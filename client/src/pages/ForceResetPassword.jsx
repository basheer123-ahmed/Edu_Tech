import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForceResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  // Password strength checks
  const checks = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: 'Contains uppercase letter', valid: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter', valid: /[a-z]/.test(newPassword) },
    { label: 'Contains a number', valid: /[0-9]/.test(newPassword) },
    { label: 'Passwords match', valid: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  const allValid = checks.every((c) => c.valid);
  const strengthPercent = (checks.filter((c) => c.valid).length / checks.length) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/auth/force-reset-password',
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update token and user in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      toast.success('Password updated successfully! Welcome to SkilStation 🎉');
      
      // Refresh user context and redirect
      await refreshUser();
      navigate('/dashboard/institution/overview');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EAF4] flex items-center justify-center p-4 font-sans">
      {/* Ambient effects */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-400/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-slate-100">
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-200"
            >
              <Shield className="text-white" size={36} />
            </motion.div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Set New Password</h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Welcome! For security, please set a new password to activate your institution account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Strength Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strength</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  strengthPercent <= 40 ? 'text-rose-500' : strengthPercent <= 80 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {strengthPercent <= 40 ? 'Weak' : strengthPercent <= 80 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strengthPercent}%` }}
                  className={`h-full rounded-full transition-colors ${
                    strengthPercent <= 40 ? 'bg-rose-500' : strengthPercent <= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100">
              {checks.map((check, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  {check.valid ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-slate-300 shrink-0" />
                  )}
                  <span className={`text-xs font-bold ${check.valid ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {check.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!allValid || isLoading}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all mt-6 ${
                allValid
                  ? 'bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Activate Account
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Info */}
        <p className="text-center text-slate-400 text-xs font-bold mt-6">
          🔒 Your password is encrypted and stored securely
        </p>
      </motion.div>
    </div>
  );
};

export default ForceResetPassword;
