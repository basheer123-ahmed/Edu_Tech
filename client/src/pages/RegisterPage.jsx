import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Phone, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // OTP State
  const [otp, setOtp] = useState('');
  const [showOTPField, setShowOTPField] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset verification if email changes
    if (e.target.name === 'email') {
      setIsEmailVerified(false);
      setShowOTPField(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return toast.error('Please enter a valid email address');
    }

    setIsSendingOTP(true);
    try {
      const response = await axios.post('http://localhost:5000/api/otp/send-otp', { email: formData.email });
      if (response.data.success) {
        setShowOTPField(true);
        toast.success(`OTP sent to ${formData.email}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error('Please enter the 6-digit OTP');
    }

    setIsVerifyingOTP(true);
    try {
      const response = await axios.post('http://localhost:5000/api/otp/verify-otp', { 
        email: formData.email, 
        otp 
      });
      if (response.data.success) {
        setIsEmailVerified(true);
        setShowOTPField(false);
        toast.success('Email verified successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register({ ...registerData, role });
      toast.success('Account created successfully!');
      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EAF4] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 sm:p-12 border border-slate-100"
      >
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-6 font-bold text-sm">
            <ArrowRight className="rotate-180" size={16} /> Back to Home
          </Link>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 font-medium">Join SkillStation and start achieving success.</p>
        </div>

        {/* Role Switcher */}
        <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-2xl mb-10 max-w-md mx-auto">
          {['STUDENT', 'INSTITUTION', 'ADMIN'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${
                role === r ? 'bg-white text-violet-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  name="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Gender</label>
              <select 
                name="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white appearance-none text-slate-700"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
            <div className="flex gap-2">
              <div className="relative group flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required
                  disabled={isEmailVerified}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white ${isEmailVerified ? 'opacity-70 border-emerald-200' : ''}`}
                />
                {isEmailVerified && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                )}
              </div>
              {!isEmailVerified && (
                <button 
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || !formData.email}
                  className="px-6 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider hover:bg-black transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSendingOTP ? <RefreshCw className="animate-spin" size={14} /> : 'Send OTP'}
                </button>
              )}
            </div>
          </div>

          {showOTPField && !isEmailVerified && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-violet-50 rounded-2xl border border-violet-100 space-y-4"
            >
              <div className="flex items-center gap-2 text-violet-700">
                <ShieldCheck size={18} />
                <span className="text-xs font-black uppercase tracking-wider">Verify your email</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-Digit OTP"
                  className="flex-1 bg-white border border-violet-200 rounded-xl py-3 px-4 text-center text-lg font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
                <button 
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isVerifyingOTP || otp.length !== 6}
                  className="px-6 rounded-xl bg-violet-600 text-white text-[10px] font-black uppercase tracking-wider hover:bg-violet-700 transition-all disabled:opacity-50"
                >
                  {isVerifyingOTP ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              <p className="text-[10px] text-violet-500 font-medium px-1 italic">* We've sent a code to your email. It expires in 5 minutes.</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input 
                name="phone"
                type="tel" 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  name="confirmPassword"
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isLoading || !isEmailVerified}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                isEmailVerified 
                ? 'bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5' 
                : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Processing...' : 'Submit Registration'}
              {!isLoading && <ChevronRight size={18} />}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-violet-600 font-black hover:underline transition-all">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
