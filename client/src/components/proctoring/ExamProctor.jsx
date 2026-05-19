import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, AlertTriangle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ExamProctor = ({ 
  examId, 
  onViolationLimitExceeded, 
  isProctoringActive,
  cameraStream,
  screenStream
}) => {
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [warningsCount, setWarningsCount] = useState(0);
  const [micLevel, setMicLevel] = useState(0);

  // Verification state tracking
  const [isFullscreenActive, setIsFullscreenActive] = useState(true);
  const [isScreenShareActive, setIsScreenShareActive] = useState(true);
  const [countdown, setCountdown] = useState(null);

  // Initialize permissions, camera stream & Audio analyzer
  useEffect(() => {
    if (!isProctoringActive) return;

    const initProctoring = async () => {
      try {
        let stream = cameraStream;
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Web Audio API analyzer
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;

        setHasPermission(true);
        
        // Double check fullscreen element
        if (!document.fullscreenElement) {
          setIsFullscreenActive(false);
          requestFullscreen();
        }
      } catch (err) {
        console.error(err);
        toast.error('Camera & Microphone access are mandatory to take this exam.');
        logViolation('CAMERA_DISABLED', 'HIGH', { error: err.message });
      }
    };

    initProctoring();

    return () => {
      // Cleanup streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isProctoringActive, cameraStream]);

  // Screen share termination check
  useEffect(() => {
    if (!isProctoringActive || !screenStream) return;

    const screenTrack = screenStream.getVideoTracks()[0];
    if (!screenTrack) return;

    const handleScreenEnded = () => {
      toast.error('Screen sharing was stopped! Entire screen sharing must remain active.', { duration: 5000 });
      logViolation('SCREEN_SHARE_STOPPED', 'HIGH', { info: 'Screen track ended by user' });
      setIsScreenShareActive(false);
    };

    screenTrack.addEventListener('ended', handleScreenEnded);

    return () => {
      screenTrack.removeEventListener('ended', handleScreenEnded);
    };
  }, [isProctoringActive, screenStream]);

  // Enforce violation countdown threshold
  useEffect(() => {
    if (!isProctoringActive) return;

    if (!isFullscreenActive || !isScreenShareActive) {
      setCountdown(15);
    } else {
      setCountdown(null);
    }
  }, [isFullscreenActive, isScreenShareActive, isProctoringActive]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      toast.error('Security verification timeout exceeded! Auto-submitting solutions.');
      onViolationLimitExceeded();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Request Fullscreen Helper
  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  // Log violation API helper
  const logViolation = async (type, severity = 'MEDIUM', metadata = {}) => {
    try {
      const snap = captureSnapshot();
      await axios.post('http://localhost:5000/api/assignments/proctor/violation', {
        examId,
        type,
        severity,
        metadata: { ...metadata, snapshot: snap }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setWarningsCount(prev => {
        const next = prev + 1;
        if (next >= 5) {
          onViolationLimitExceeded();
        }
        return next;
      });
    } catch (err) {
      console.error('Error logging violation:', err);
    }
  };

  // Capture canvas snapshot base64
  const captureSnapshot = () => {
    if (!videoRef.current) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', 0.6); // compressed webp
    } catch (e) {
      return null;
    }
  };

  // Decibel analyser audio detection tick
  useEffect(() => {
    if (!hasPermission || !analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    let lastNoiseAlert = 0;

    const checkVolume = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      let values = 0;
      for (let i = 0; i < dataArray.length; i++) {
        values += dataArray[i];
      }
      const average = values / dataArray.length;
      setMicLevel(Math.min(100, Math.round(average)));

      // If volume spike detected (Average > 45)
      if (average > 45 && Date.now() - lastNoiseAlert > 10000) {
        lastNoiseAlert = Date.now();
        toast.error('Voice or loud talking noise detected during exam.');
        logViolation('SOUND_DETECTED', 'MEDIUM', { decibelLevel: average });
      }

      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }, [hasPermission]);

  // Tab switch & focus loss listeners
  useEffect(() => {
    if (!isProctoringActive) return;

    const handleVisibility = () => {
      if (document.hidden) {
        toast.error('Tab switching or leaving workspace is strictly forbidden.');
        logViolation('TAB_SWITCH', 'HIGH', { info: 'Student minimized/switched tab' });
      }
    };

    const handleBlur = () => {
      toast.error('Exam focus lost. Please stay in full focus.');
      logViolation('TAB_SWITCH', 'HIGH', { info: 'Window lost focus' });
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        toast.error('Fullscreen exited. Re-entering fullscreen is required.');
        logViolation('FULLSCREEN_EXITED', 'HIGH');
        setIsFullscreenActive(false);
        // try to force re-entry
        setTimeout(requestFullscreen, 2000);
      } else {
        setIsFullscreenActive(true);
      }
    };

    // Anti-cheat key & mouse handlers
    const preventRightClick = (e) => e.preventDefault();
    const preventKeys = (e) => {
      // Block F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 67) || // Ctrl+C (block copy)
        (e.ctrlKey && e.keyCode === 86) // Ctrl+V (block paste)
      ) {
        e.preventDefault();
        toast.error('Copy/Paste and developer tools are blocked during this test.');
        logViolation('KEY_BLOCKED', 'MEDIUM', { key: e.keyCode });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('keydown', preventKeys);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventKeys);
    };
  }, [isProctoringActive, hasPermission]);

  // Periodic Snapshot Timer (Every 45 seconds)
  useEffect(() => {
    if (!hasPermission) return;
    const interval = setInterval(() => {
      logViolation('PERIODIC_SNAP', 'LOW');
    }, 45000);

    return () => clearInterval(interval);
  }, [hasPermission]);

  if (!isProctoringActive) return null;

  return (
    <>
      {/* Warning Overlay when screen share or fullscreen is inactive */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center font-sans text-white p-6">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 animate-pulse">
              <ShieldAlert size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-red-400">Security Violation Detected</h2>
              <p className="text-sm text-slate-300 font-semibold">
                {!isScreenShareActive && !isFullscreenActive
                  ? "Entire Screen Share and Fullscreen mode must be active."
                  : !isScreenShareActive
                  ? "Entire Screen Share is inactive or was stopped."
                  : "Fullscreen mode was exited."}
              </p>
              <p className="text-xs text-slate-400">
                Please re-enable permissions immediately to resume your session.
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 py-4 px-6 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Auto-Submitting Challenge In</p>
              <h3 className="text-3xl font-black text-red-500 mt-1">{countdown}s</h3>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Floating Webcam Feed */}
        <div className="w-48 h-36 bg-slate-900 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-2xl relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute top-2 left-2 bg-pink-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> AI PROCTOR ACTIVE
          </div>
        </div>

        {/* Mic decibel feedback & Warnings indicator */}
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl w-48 text-xs font-bold space-y-2 text-slate-700">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest"><Camera size={12} /> Feed</span>
            <span className="text-emerald-500 text-[10px]">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest"><Mic size={12} /> Sound level</span>
            <span className={`${micLevel > 40 ? 'text-rose-500' : 'text-slate-400'}`}>{micLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 transition-all duration-100" 
              style={{ width: `${Math.min(100, micLevel * 2)}%` }}
            />
          </div>
          <div className="flex items-center justify-between border-t pt-2 mt-1">
            <span className="text-slate-400 text-[10px] uppercase tracking-widest">Violations</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
              warningsCount >= 3 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {warningsCount} / 5
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamProctor;
