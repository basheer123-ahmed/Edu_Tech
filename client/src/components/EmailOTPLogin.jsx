import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, ChevronRight, RefreshCw, ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EmailOTPLogin = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

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

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error('Please enter a valid email address');
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/otp/send-otp', { email });
      
      if (response.data.success) {
        setStep('otp');
        setTimer(60);
        toast.success(`OTP sent to ${email}`);
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMsg);
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
      const response = await axios.post('http://localhost:5000/api/otp/verify-otp', { email, otp });
      
      if (response.data.success) {
        if (response.data.isNewUser) {
          toast.success('Email verified! Redirecting to complete registration...');
          // Optional: redirect to register with email pre-filled
          navigate('/register', { state: { email } });
        } else {
          toast.success('Login Successful!');
          // Store token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          if (onLoginSuccess) {
            onLoginSuccess(response.data.user);
          } else {
            // Default redirect based on role
            const role = response.data.user.role;
            if (role === 'ADMIN') navigate('/dashboard/admin');
            else if (role === 'INSTITUTION') navigate('/dashboard/institution');
            else navigate('/dashboard/student');
          }
        }
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === 'email' ? (
          <motion.div
            key="email-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-200 -rotate-3">
                <Mail size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Email Login</h2>
              <p className="text-slate-500 mt-2 font-medium">Get a secure code delivered to your inbox</p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    placeholder="example@email.com"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-base font-bold focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all focus:bg-white placeholder:text-slate-300"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    Send OTP Code
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>

            <button 
              onClick={onBack}
              className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Login
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
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Email</h2>
              <p className="text-slate-500 mt-2 font-medium">We've sent a 6-digit code to <br/><span className="text-slate-900 font-bold">{email}</span></p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">6-Digit OTP</label>
                  <button 
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                  >
                    Change Email
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <>
                    Verify & Continue
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

export default EmailOTPLogin;
