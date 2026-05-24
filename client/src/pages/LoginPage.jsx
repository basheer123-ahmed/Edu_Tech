import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ChevronRight, Eye, EyeOff, ShieldCheck, 
  GraduationCap, Building2, Users, BookOpen, Headset,
  Phone, Mail as MailIcon, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PhoneLogin from '../components/PhoneLogin';
import EmailOTPLogin from '../components/EmailOTPLogin';

const LoginPage = ({ defaultRole = 'STUDENT' }) => {
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone', or 'email-otp'
  
  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password, role);
      
      if (user.mustResetPassword) {
        toast.success('Please set a new password to continue');
        navigate('/force-reset-password');
        return;
      }

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
    <div className="h-screen w-full flex bg-[#fff8fc] font-sans selection:bg-pink-200 overflow-hidden text-slate-800">
      
      {/* ───── LEFT SIDE: AI HERO BANNER (52%) ───── */}
      <div className="hidden lg:flex w-[52%] h-full relative bg-gradient-to-br from-[#120014] via-[#2b0036] to-[#4c0519] overflow-y-auto overflow-x-hidden p-8 xl:p-14 flex-col border-r border-pink-500/20 shadow-2xl custom-scrollbar">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 bg-[url('/images/login-bg.png')] bg-cover bg-center opacity-60 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120014] via-transparent to-[#120014]/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-pink-500/5 backdrop-blur-[1px] z-10 pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-pink-600/30 blur-[120px] rounded-full pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-fuchsia-600/20 blur-[140px] rounded-full pointer-events-none z-10" />

        <div className="relative z-20 flex flex-col min-h-full max-w-xl mx-auto w-full">
          
          {/* Brand Section */}
          <Link to="/" className="flex items-center gap-3 mb-8 self-start group">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500 blur-lg opacity-50 rounded-full group-hover:opacity-80 transition-opacity" />
              <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide leading-none mb-1">
                <span className="text-[#00a2ff]">Skil</span><span className="text-[#ff7f00]">Station</span>
              </h1>
              <p className="text-pink-400 text-[10px] font-bold uppercase tracking-[0.25em]">Learn. Grow. Achieve.</p>
            </div>
          </Link>

          {/* Hero Content (Centered vertically) */}
          <div className="flex-grow flex flex-col justify-center py-6">
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Upgrade Skills.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_20px_rgba(255,79,163,0.3)]">Elevate Future.</span>
            </h2>
            <p className="text-pink-100/70 text-sm leading-relaxed mb-8 font-medium max-w-md">
              A modern learning platform designed to empower students, institutions and administrators with smarter education.
            </p>

            <div className="space-y-4 max-w-md">
              {[
                { icon: <GraduationCap size={20} />, title: "Smart Learning", desc: "Access engaging courses and interactive content." },
                { icon: <Building2 size={20} />, title: "For Institutions", desc: "Manage learners, courses and certificates with ease." },
                { icon: <ShieldCheck size={20} />, title: "Secure & Reliable", desc: "Your data is protected with enterprise-grade security." },
              ].map((feature, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                  key={idx} className="flex items-start gap-4 group"
                >
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/20 text-pink-400 shadow-[0_0_20px_rgba(255,79,163,0.1)] group-hover:bg-pink-500/20 group-hover:border-pink-400/40 transition-all backdrop-blur-md">
                    {feature.icon}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-white font-bold text-sm mb-1 tracking-wide">{feature.title}</h3>
                    <p className="text-pink-100/50 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Stats Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-[2rem] p-5 xl:p-6 shadow-[0_0_40px_rgba(255,79,163,0.15)] relative overflow-hidden group mt-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="grid grid-cols-3 gap-6 divide-x divide-pink-500/20 text-center relative z-10">
              <div>
                <Users className="mx-auto text-pink-400 mb-2 opacity-90" size={24} />
                <div className="text-2xl font-black text-white tracking-tight">10K+</div>
                <div className="text-[10px] text-pink-200/60 font-bold uppercase tracking-[0.15em] mt-1">Students</div>
              </div>
              <div>
                <BookOpen className="mx-auto text-pink-400 mb-2 opacity-90" size={24} />
                <div className="text-2xl font-black text-white tracking-tight">500+</div>
                <div className="text-[10px] text-pink-200/60 font-bold uppercase tracking-[0.15em] mt-1">Courses</div>
              </div>
              <div>
                <Building2 className="mx-auto text-pink-400 mb-2 opacity-90" size={24} />
                <div className="text-2xl font-black text-white tracking-tight">200+</div>
                <div className="text-[10px] text-pink-200/60 font-bold uppercase tracking-[0.15em] mt-1">Institutions</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ───── RIGHT SIDE: LOGIN PANEL (48%) ───── */}
      <div className="w-full lg:w-[48%] h-full overflow-y-auto flex items-center justify-center p-6 sm:p-12 relative custom-scrollbar">
        
        {/* Mobile App Logo */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-3 z-20">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-black text-lg">
            <span className="text-[#00a2ff]">Skil</span><span className="text-[#ff7f00]">Station</span>
          </span>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[520px] bg-white/75 backdrop-blur-2xl rounded-[36px] border border-white shadow-[0_20px_80px_rgba(255,79,163,0.08)] p-10 sm:p-14 relative z-10 my-10 lg:my-auto"
        >
          {/* Back to Home Link */}
          <Link to="/" className="absolute top-8 left-8 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-500 transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>

          {/* Welcome Header */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="relative hidden sm:block">
                <div className="absolute inset-0 bg-pink-500 blur-lg opacity-20 rounded-full" />
                <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain relative z-10" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500 drop-shadow-sm">Back</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium text-sm">Please enter your details to sign in.</p>
          </div>

          {/* Role Switcher Pill Tabs */}
          <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-[1.25rem] mb-10 shadow-inner">
            {['STUDENT', 'INSTITUTION', 'ADMIN'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  role === r 
                    ? 'bg-white text-pink-600 shadow-md shadow-pink-100/50 border border-pink-100' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* EMAIL LOGIN FORM */}
            {authMethod === 'email' && (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin} className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white/80 border border-pink-100/80 rounded-2xl py-4 pl-12 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white shadow-sm placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Password</label>
                    <Link to="/forgot-password" size={16} className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition-colors">Forgot Password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/80 border border-pink-100/80 rounded-2xl py-4 pl-12 pr-12 text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white shadow-sm placeholder:text-slate-300"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-500 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1 pt-2 mb-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-pink-200 text-pink-500 focus:ring-pink-500" />
                  <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">Remember me</label>
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ff4fa3] to-[#d946ef] text-white font-black text-[13px] uppercase tracking-[0.15em] shadow-[0_10px_30px_rgba(255,79,163,0.25)] hover:shadow-[0_15px_40px_rgba(255,79,163,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 mt-8"
                >
                  {isLoading ? 'Authenticating...' : `Sign in as ${role === 'STUDENT' ? 'Student' : role === 'ADMIN' ? 'Admin' : 'Institution'}`}
                  {!isLoading && <ChevronRight size={20} />}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#fffcfd] px-4 text-slate-400 font-black tracking-widest backdrop-blur-sm">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setAuthMethod('phone')} className="py-4 rounded-2xl bg-white/50 border border-pink-100 text-slate-600 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-white hover:border-pink-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <Phone size={16} className="text-pink-500" /> Phone OTP
                  </button>
                  <button type="button" onClick={() => setAuthMethod('email-otp')} className="py-4 rounded-2xl bg-white/50 border border-pink-100 text-slate-600 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-white hover:border-pink-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <MailIcon size={16} className="text-pink-500" /> Email OTP
                  </button>
                </div>
              </motion.form>
            )}

            {/* PHONE / EMAIL OTP VIEWS */}
            {authMethod === 'phone' && (
              <motion.div key="phone-form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <PhoneLogin 
                  onBack={() => setAuthMethod('email')}
                  onLoginSuccess={(user) => {
                    toast.success(`Authenticated with phone: ${user.phoneNumber}`);
                    if (role === 'ADMIN') navigate('/dashboard/admin');
                    else if (role === 'INSTITUTION') navigate('/dashboard/institution');
                    else navigate('/dashboard/student');
                  }}
                />
              </motion.div>
            )}

            {authMethod === 'email-otp' && (
              <motion.div key="email-otp-form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <EmailOTPLogin 
                  onBack={() => setAuthMethod('email')}
                  onLoginSuccess={(user) => {
                    if (role === 'ADMIN') navigate('/dashboard/admin');
                    else if (role === 'INSTITUTION') navigate('/dashboard/institution');
                    else navigate('/dashboard/student');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Register / Notice Card */}
          <div className="mt-8 pt-6 border-t border-slate-100/60">
            {role === 'STUDENT' ? (
              <p className="text-center text-slate-500 font-medium text-sm">
                Don't have an account? <Link to="/register" className="text-pink-500 font-black hover:text-pink-600 transition-colors ml-1">Create Account</Link>
              </p>
            ) : (
              <div className="bg-gradient-to-br from-pink-50/80 to-white border border-pink-100 rounded-2xl p-5 text-center shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-400 to-fuchsia-500" />
                <div className="flex justify-center mb-2">
                  <ShieldCheck className="text-pink-500/80" size={24} />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4 px-2">
                  <strong>Admin</strong> and <strong>Institution</strong> access is managed securely by the platform administration.<br />
                  Please contact the administrator for login credentials.
                </p>
                <a href="mailto:support@skilstation.com" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-pink-100 text-pink-600 text-[11px] font-black uppercase tracking-widest hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm">
                  <Mail size={16} /> Contact Admin
                </a>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Footer links */}
        <div className="absolute bottom-6 left-0 right-0 hidden sm:flex justify-between px-12 text-[10px] text-slate-400 font-bold uppercase tracking-widest w-full max-w-[800px] mx-auto">
          <p>© 2026 SkilStation. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-pink-500 transition-colors">Terms of Use</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
