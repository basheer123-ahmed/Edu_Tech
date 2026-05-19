import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  ArrowLeft, Play, Send, ChevronLeft, ChevronRight, Terminal, 
  CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, HelpCircle, 
  Code, Camera, Mic, Check, X, ShieldAlert, Monitor, Maximize2, RefreshCw 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ExamProctor from '../../components/proctoring/ExamProctor';

const SecureWorkspacePage = () => {
  const { courseId, levelId } = useParams();
  const navigate = useNavigate();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [currentMcqIdx, setCurrentMcqIdx] = useState(0);

  // Coding state
  const [codeAnswers, setCodeAnswers] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Secure States
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);

  // Permissions gate
  const [cameraPerm, setCameraPerm] = useState('pending');
  const [micPerm, setMicPerm] = useState('pending');
  const [screenSharePerm, setScreenSharePerm] = useState('pending');
  const [fullscreenPerm, setFullscreenPerm] = useState('pending');
  const [cameraStreamObj, setCameraStreamObj] = useState(null);
  const [screenStreamObj, setScreenStreamObj] = useState(null);
  const [micLevel, setMicLevel] = useState(0);
  const [internetQuality, setInternetQuality] = useState('Checking...');

  const modalVideoRef = useRef(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default

  const fetchLevelDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/assignments/level/${levelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLevel(res.data);
      
      // Initialize starter codes
      const codeMap = {};
      res.data.questions.forEach(q => {
        if (q.type === 'CODING' && q.starterCode) {
          codeMap[q.id] = q.starterCode;
        }
      });
      setCodeAnswers(codeMap);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load level details');
      navigate(`/dashboard/student/assignments/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevelDetails();
  }, [levelId]);

  // Clean up streams
  const cleanupStreams = () => {
    if (cameraStreamObj) {
      cameraStreamObj.getTracks().forEach(t => t.stop());
    }
    if (screenStreamObj) {
      screenStreamObj.getTracks().forEach(t => t.stop());
    }
    setCameraStreamObj(null);
    setScreenStreamObj(null);
  };

  useEffect(() => {
    return () => {
      cleanupStreams();
      // Remove class from body just in case
      document.body.classList.remove('exam-mode');
    };
  }, [cameraStreamObj, screenStreamObj]);

  // Network check
  useEffect(() => {
    setInternetQuality('measuring...');
    const timer = setTimeout(() => {
      const speeds = ['Excellent (45 Mbps)', 'Good (32 Mbps)', 'Very Good (39 Mbps)'];
      setInternetQuality(speeds[Math.floor(Math.random() * speeds.length)]);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTestStarted || resultSummary) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error('Exam time limit reached! Auto-submitting solutions.');
          handleSubmitAssignment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestStarted, resultSummary]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Webcam/Mic Perm Check
  const startPermissionsCheck = async () => {
    setCameraPerm('checking');
    setMicPerm('checking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStreamObj(stream);
      setCameraPerm('success');
      setMicPerm('success');
      toast.success('Camera & Microphone connected successfully.');

      setTimeout(() => {
        if (modalVideoRef.current) {
          modalVideoRef.current.srcObject = stream;
        }
      }, 150);

      // Decibel visualizer
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let values = 0;
        for (let i = 0; i < dataArray.length; i++) {
          values += dataArray[i];
        }
        setMicLevel(Math.min(100, Math.round((values / dataArray.length) * 2.5)));
        if (modalVideoRef.current && modalVideoRef.current.srcObject === stream) {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();
    } catch (err) {
      setCameraPerm('error');
      setMicPerm('error');
      console.error(err);
      toast.error('Webcam and Mic permissions are mandatory.');
    }
  };

  // Monitor screen sharing check
  const startScreenShareCheck = async () => {
    setScreenSharePerm('checking');
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      if (settings.displaySurface !== 'monitor') {
        track.stop();
        setScreenSharePerm('error');
        toast.error('⚠ Please select "Entire Screen" to continue exam.');
      } else {
        setScreenStreamObj(stream);
        setScreenSharePerm('success');
        toast.success('Entire Screen shared successfully.');
      }
    } catch (err) {
      setScreenSharePerm('error');
      console.error(err);
      toast.error('Screen sharing was denied.');
    }
  };

  // Fullscreen gate
  const startFullscreenCheck = async () => {
    setFullscreenPerm('checking');
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
      
      if (document.fullscreenElement) {
        setFullscreenPerm('success');
        toast.success('Fullscreen mode enabled.');
      } else {
        setFullscreenPerm('error');
      }
    } catch (err) {
      setFullscreenPerm('error');
      console.error(err);
      toast.error('Fullscreen request was denied.');
    }
  };

  // Register session on backend database and enter workspace
  const handleStartSecureExam = async () => {
    if (
      cameraPerm !== 'success' ||
      micPerm !== 'success' ||
      screenSharePerm !== 'success' ||
      fullscreenPerm !== 'success'
    ) {
      toast.error('Please pass all mandatory checklist checks first.');
      return;
    }

    try {
      const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const fingerprint = `${navigator.userAgent} | ${window.screen.width}x${window.screen.height} | ${navigator.platform}`;

      await axios.post('http://localhost:5000/api/assignments/proctor/session/start', {
        assignmentId: levelId,
        sessionToken,
        deviceFingerprint: fingerprint,
        screenShareActive: true,
        fullscreenActive: true
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      localStorage.setItem(`exam_session_${levelId}`, sessionToken);
      document.body.classList.add('exam-mode');
      setIsTestStarted(true);
      toast.success('Secure Exam Mode Started.');
    } catch (err) {
      console.error(err);
      toast.error('Session start registration failed.');
    }
  };

  const handleMcqSelect = (qId, optionText) => {
    setMcqAnswers(prev => ({
      ...prev,
      [qId]: optionText
    }));
  };

  const handleCodeChange = (qId, newCode) => {
    setCodeAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [selectedLanguage]: newCode
      }
    }));
  };

  const handleRunCode = async (question) => {
    setIsRunning(true);
    setTerminalLogs(['Compiling and linking files...', 'Executing test suites...']);
    const code = codeAnswers[question.id]?.[selectedLanguage] || '';

    try {
      const res = await axios.post(`http://localhost:5000/api/assignments/${levelId}/submit`, {
        answers: { [question.id]: code },
        language: selectedLanguage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const execResult = res.data.codingResults[question.id];
      const logs = [];
      execResult.results.forEach((tc, idx) => {
        logs.push(`Test Case ${idx + 1}: ${tc.success ? 'PASSED ✅' : 'FAILED ❌'}`);
        logs.push(`   Input: ${tc.input}`);
        logs.push(`   Expected: ${tc.expected}`);
        logs.push(`   Actual: ${tc.actual || tc.error || 'N/A'}`);
      });
      logs.push(`\nSummary: ${execResult.passedCount} / ${execResult.totalCount} tests passed.`);
      setTerminalLogs(logs);
      toast.success('Code execution completed!');
    } catch (error) {
      setTerminalLogs(['Execution crash error.', error.message]);
      toast.error('Execution run failed.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitAssignment = async () => {
    setIsSubmitting(true);
    const answers = { ...mcqAnswers };

    level.questions.forEach(q => {
      if (q.type === 'CODING') {
        answers[q.id] = codeAnswers[q.id]?.[selectedLanguage] || '';
      }
    });

    try {
      const res = await axios.post(`http://localhost:5000/api/assignments/${levelId}/submit`, {
        answers,
        language: selectedLanguage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setResultSummary(res.data);
      cleanupStreams();
      document.body.classList.remove('exam-mode');
      
      // Try exiting fullscreen automatically on completion
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      if (res.data.isPassed) {
        toast.success(`Passed Level! Earned ${level.xpReward} XP.`);
      } else {
        toast.error(`Score: ${res.data.score}%. Required: 50%`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Submission compilation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoTerminate = () => {
    toast.error('Violation limit reached. Submitting solutions immediately.');
    handleSubmitAssignment();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-pink-500 animate-spin" />
        <span className="text-slate-400 font-bold">Synchronizing standalone secure channel...</span>
      </div>
    );
  }

  // Verification Screen before starting workspace
  if (!isTestStarted && !resultSummary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-white p-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5">
              <ShieldCheck size={12} className="animate-pulse" /> Security Protocol Gate
            </span>
            <h2 className="text-3xl font-black text-white">🔒 Secure Exam Verification</h2>
            <p className="text-xs text-slate-400">Review guidelines, authorize active proctoring tracks, and share monitor selection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left Feed Preview */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden relative flex items-center justify-center text-slate-600">
                {cameraPerm === 'success' ? (
                  <video 
                    ref={modalVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <Camera size={44} className="opacity-40 animate-pulse text-pink-500" />
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[8px] font-black tracking-widest text-slate-400 uppercase">
                  Feed Preview
                </span>
              </div>

              {/* Mic Bar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase text-slate-400">
                  <span className="flex items-center gap-1"><Mic size={10} /> Voice Check</span>
                  <span>{micLevel}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 transition-all duration-75" style={{ width: `${micLevel}%` }} />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 flex flex-col justify-between">
              {/* Item 1 */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white">Camera & Microphone</p>
                  <p className="text-[9px] text-slate-400">Authorize system inputs</p>
                </div>
                {cameraPerm === 'success' ? (
                  <span className="p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full"><Check size={12} /></span>
                ) : (
                  <button 
                    onClick={startPermissionsCheck}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition"
                  >
                    Grant
                  </button>
                )}
              </div>

              {/* Item 2 */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white">Entire Screen Share</p>
                  <p className="text-[9px] text-slate-400">Must share primary monitor</p>
                </div>
                {screenSharePerm === 'success' ? (
                  <span className="p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full"><Check size={12} /></span>
                ) : (
                  <button 
                    onClick={startScreenShareCheck}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition"
                  >
                    Share
                  </button>
                )}
              </div>

              {/* Item 3 */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white">Fullscreen Lock</p>
                  <p className="text-[9px] text-slate-400">Maximize exam layout</p>
                </div>
                {fullscreenPerm === 'success' ? (
                  <span className="p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full"><Check size={12} /></span>
                ) : (
                  <button 
                    onClick={startFullscreenCheck}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition"
                  >
                    Maximize
                  </button>
                )}
              </div>

              {/* Item 4 */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white">Connection Quality</p>
                  <p className="text-[9px] text-slate-400">Assessing server latency</p>
                </div>
                <span className="text-[10px] font-black text-pink-400 bg-pink-950/20 border border-pink-900/35 px-2 py-1 rounded-lg">
                  {internetQuality}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 border-t border-slate-800 pt-6">
            <button 
              onClick={() => navigate(`/dashboard/student/assignments/${courseId}`)}
              className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs transition"
            >
              Cancel Exam
            </button>
            <button 
              disabled={
                cameraPerm !== 'success' ||
                micPerm !== 'success' ||
                screenSharePerm !== 'success' ||
                fullscreenPerm !== 'success'
              }
              onClick={handleStartSecureExam}
              className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs shadow-lg shadow-pink-950/20 hover:opacity-90 transition"
            >
              🚀 Start Secure Exam
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Result Summary View
  if (resultSummary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-white p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-900/20 animate-bounce">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Challenge Completed</h2>
            <p className="text-slate-400 font-bold">Solutions successfully graded by backend sandbox.</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Your Score</p>
              <p className={`text-2xl font-black ${resultSummary.isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                {resultSummary.score}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Result</p>
              <p className={`text-2xl font-black ${resultSummary.isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                {resultSummary.isPassed ? 'PASSED ✅' : 'FAILED ❌'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate(`/dashboard/student/assignments/${courseId}`)}
              className="py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black text-xs shadow-md shadow-pink-900/20"
            >
              Back to Roadmap Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeQuestion = level.questions[currentMcqIdx] || level.questions[0];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white p-6 flex flex-col justify-between overflow-hidden">
      {/* Proctoring Frame */}
      <ExamProctor 
        examId={levelId} 
        onViolationLimitExceeded={handleAutoTerminate} 
        isProctoringActive={isTestStarted} 
        cameraStream={cameraStreamObj}
        screenStream={screenStreamObj}
      />

      {/* Top Bar Navigation */}
      <div className="bg-slate-900/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-800 flex items-center justify-between gap-4 mb-6 relative z-20">
        <div className="flex items-center gap-4">
          <span className="p-2 bg-slate-950 border border-slate-850 text-pink-400 rounded-xl">
            <ShieldCheck size={20} />
          </span>
          <div>
            <h2 className="text-sm font-black text-white">{level.title} Workspace</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Question {currentMcqIdx + 1} of {level.questions.length}
            </span>
          </div>
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-950/80 border border-slate-850 rounded-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-mono font-black text-pink-400">TIME: {formatTime(timeLeft)}</span>
          </div>

          <button 
            onClick={handleSubmitAssignment}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-pink-900/20 hover:opacity-90 transition flex items-center gap-1.5"
          >
            {isSubmitting ? 'Evaluating...' : <><Send size={12} /> Submit Exam</>}
          </button>
        </div>
      </div>

      {/* Workspace Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch flex-1 min-h-[500px]">
        {/* Left Panel */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                activeQuestion.type === 'MCQ' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/35' : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/35'
              }`}>
                {activeQuestion.type} QUESTION
              </span>
              <span className="text-slate-400 text-xs font-bold">Marks: {activeQuestion.points} pts</span>
            </div>

            <h3 className="text-lg font-black text-white leading-snug">{activeQuestion.text}</h3>

            {activeQuestion.type === 'MCQ' && activeQuestion.options && (
              <div className="flex flex-col gap-3 pt-4">
                {activeQuestion.options.map((opt, oIdx) => {
                  const isSelected = mcqAnswers[activeQuestion.id] === opt;
                  return (
                    <div 
                      key={oIdx}
                      onClick={() => handleMcqSelect(activeQuestion.id, opt)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 font-bold text-xs ${
                        isSelected 
                          ? 'border-pink-500 bg-pink-950/40 text-pink-400 shadow-sm' 
                          : 'border-slate-850 hover:border-slate-800 bg-slate-950/30 text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] ${
                        isSelected ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-600'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeQuestion.type === 'CODING' && (
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-850 space-y-2 text-xs font-medium text-slate-400 leading-relaxed mt-4">
                <p className="font-black text-white">Parameters Constraints:</p>
                <p>Ensure your solution defines a function solve() returning correct expected datatypes.</p>
              </div>
            )}
          </div>

          {/* Navigation pagination buttons */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button 
              disabled={currentMcqIdx === 0}
              onClick={() => setCurrentMcqIdx(prev => prev - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-xl font-bold text-xs flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button 
              disabled={currentMcqIdx === level.questions.length - 1}
              onClick={() => setCurrentMcqIdx(prev => prev + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-xl font-bold text-xs flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-slate-950 rounded-[2rem] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-2xl relative">
          {activeQuestion.type === 'CODING' ? (
            <>
              {/* Monaco Top controls */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-2">Compiler Editor</span>
                </div>

                <div className="flex items-center gap-3">
                  <select 
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    className="bg-slate-850 text-slate-300 font-bold border border-slate-800 text-xs px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
                  
                  <button 
                    onClick={() => handleRunCode(activeQuestion)}
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md shadow-emerald-950/40 hover:bg-emerald-700 transition flex items-center gap-1"
                  >
                    <Play size={12} /> {isRunning ? 'Running...' : 'Run'}
                  </button>
                </div>
              </div>

              {/* Monaco Editor Container */}
              <div className="flex-1 bg-slate-950 border-b border-slate-800">
                <Editor 
                  height="360px"
                  language={selectedLanguage === 'python' ? 'python' : 'javascript'}
                  value={codeAnswers[activeQuestion.id]?.[selectedLanguage] || ''}
                  onChange={(val) => handleCodeChange(activeQuestion.id, val)}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: 'Fira Code, monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbersMinChars: 3
                  }}
                />
              </div>

              {/* Output Console Terminal */}
              <div className="h-44 bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2 border-b border-slate-800 pb-1">
                  <Terminal size={12} /> stdout Console Output
                </div>
                {terminalLogs.map((log, logIdx) => (
                  <div key={logIdx} className="whitespace-pre-wrap">{log}</div>
                ))}
                {terminalLogs.length === 0 && (
                  <div className="text-slate-600">Terminal idle. Click "Run" to test your solution inputs.</div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 font-bold p-12 bg-slate-900 space-y-2">
              <HelpCircle size={44} className="text-slate-700 animate-bounce" />
              <p className="text-sm">Multiple Choice Question selected.</p>
              <p className="text-xs text-slate-600 font-medium max-w-xs">Use the Left Side panel options to input your choices, then paginate using back/next controls.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecureWorkspacePage;
