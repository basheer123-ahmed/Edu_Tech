import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldCheck, ChevronRight, RefreshCw, ArrowLeft, Smartphone } from 'lucide-react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import toast from 'react-hot-toast';

const PhoneLogin = ({ onLoginSuccess, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Handle Resend Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /**
   * Initializes reCAPTCHA only once to prevent "already rendered" errors.
   */
  const setupRecaptcha = () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            toast.error('reCAPTCHA expired. Please try again.');
          }
        });
      }
    } catch (error) {
      console.error('Recaptcha Initialization Error:', error);
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    
    // Validate Indian Phone Number (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return toast.error('Please enter a valid 10-digit Indian phone number');
    }

    setIsLoading(true);
    const formattedPhone = `+91${phoneNumber}`;

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      // Store confirmation result globally for production robustness
      window.confirmationResult = confirmation;
      
      setStep('otp');
      setTimer(60);
      toast.success(`OTP sent to +91 ${phoneNumber}`);
    } catch (error) {
      console.error('Send OTP Error:', error);
      
      // Reset reCAPTCHA on error to allow retry
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      const errorMessage = error.code === 'auth/too-many-requests' 
        ? 'Too many attempts. Please try again later.' 
        : (error.message || 'Failed to send OTP');
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error('Please enter the 6-digit verification code');
    }

    setIsLoading(true);
    try {
      if (!window.confirmationResult) {
        throw new Error('Session expired. Please request a new OTP.');
      }

      const result = await window.confirmationResult.confirm(otp);
      toast.success('Authentication Successful!');
      
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      toast.error(error.code === 'auth/invalid-verification-code' 
        ? 'Invalid OTP code. Please try again.' 
        : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container for invisible reCAPTCHA - must stay in DOM */}
      <div id="recaptcha-container"></div>
      
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-violet-500 to-pink-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-200 rotate-3">
                <Smartphone size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Phone Login</h2>
              <p className="text-slate-500 mt-2 font-medium">Verify your identity via Secure OTP</p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Indian Mobile Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-slate-200">
                    <span className="text-sm font-bold text-slate-900">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-20 pr-4 text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all focus:bg-white placeholder:text-slate-300"
                  />
                </div>
                <p className="text-[10px] text-slate-400 ml-1 font-medium italic">* Enter 10-digit number without +91</p>
              </div>

              <button 
                type="submit"
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    Request OTP
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            <button 
              onClick={onBack}
              className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft size={14} /> Use Email Instead
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100 rotate-3">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Code</h2>
              <p className="text-slate-500 mt-2 font-medium">Sent to <span className="text-slate-900 font-bold">+91 {phoneNumber}</span></p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">6-Digit OTP</label>
                  <button 
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="······"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.75em] focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all focus:bg-white placeholder:text-slate-200"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    Verify & Sign In
                    <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center py-2">
              {timer > 0 ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resend in</span>
                  <span className="text-sm text-violet-600 font-black">{timer}s</span>
                </div>
              ) : (
                <button 
                  onClick={handleSendOTP}
                  className="group flex items-center justify-center gap-2 mx-auto text-sm font-black text-violet-600 hover:text-violet-700 transition-colors"
                >
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  Resend OTP Code
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneLogin;
