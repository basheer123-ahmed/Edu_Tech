import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PhoneLogin from '../components/PhoneLogin';
import EmailOTPLogin from '../components/EmailOTPLogin';
import { Phone, Mail as MailIcon } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone', or 'email-otp'
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, role);
      toast.success(`Logged in as ${role}`);
      
      if (role === 'ADMIN') navigate('/dashboard/admin');
      else if (role === 'INSTITUTION') navigate('/dashboard/institution');
      else navigate('/dashboard/student');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EAF4] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 sm:p-10 border border-slate-100"
      >
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors mb-6 font-bold text-sm">
            <ArrowRight className="rotate-180" size={16} /> Back to Home
          </Link>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
        </div>

        {/* Role Switcher */}
        <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-2xl mb-8">
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

        {authMethod === 'email' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size={16} className="text-xs font-bold text-violet-600 hover:text-violet-700">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <div className="flex items-center gap-3 px-1 mb-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer">Remember me</label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-violet-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
            >
              {isLoading ? 'Signing in...' : `Sign in as ${role === 'STUDENT' ? 'Student' : role === 'ADMIN' ? 'Admin' : 'Institution'}`}
              {!isLoading && <ChevronRight size={18} />}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-black tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setAuthMethod('phone')}
                className="py-3.5 rounded-2xl border-2 border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={14} className="text-violet-600" />
                Phone OTP
              </button>
              <button 
                type="button"
                onClick={() => setAuthMethod('email-otp')}
                className="py-3.5 rounded-2xl border-2 border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <MailIcon size={14} className="text-violet-600" />
                Email OTP
              </button>
            </div>
          </form>
        ) : authMethod === 'phone' ? (
          <PhoneLogin 
            onBack={() => setAuthMethod('email')}
            onLoginSuccess={(user) => {
              toast.success(`Authenticated with phone: ${user.phoneNumber}`);
              if (role === 'ADMIN') navigate('/dashboard/admin');
              else if (role === 'INSTITUTION') navigate('/dashboard/institution');
              else navigate('/dashboard/student');
            }}
          />
        ) : (
          <EmailOTPLogin 
            onBack={() => setAuthMethod('email')}
            onLoginSuccess={(user) => {
              // Redirection handled within EmailOTPLogin or here
              if (role === 'ADMIN') navigate('/dashboard/admin');
              else if (role === 'INSTITUTION') navigate('/dashboard/institution');
              else navigate('/dashboard/student');
            }}
          />
        )}

        <p className="mt-8 text-center text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-violet-600 font-black hover:underline transition-all">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
