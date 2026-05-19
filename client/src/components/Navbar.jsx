import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  User, 
  Briefcase, 
  ChevronDown, 
  Menu, 
  X,
  UserCircle
} from 'lucide-react';
import heroLogo from '../assets/hero-logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses', hasDropdown: true },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-6">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/35 backdrop-blur-2xl rounded-full border border-white/40 shadow-[0_10px_40px_rgba(236,72,153,0.06)] flex items-center px-4 py-1.5 sm:px-8 gap-10 sm:gap-20 relative hover:border-white/60 transition-all duration-500"
      >
        {/* LEFT: Compact Logo branding */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {heroLogo ? (
                <img src={heroLogo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Sparkles size={20} className="text-[#FF5722]" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tighter text-slate-900 leading-none group-hover:text-[#FF5722] transition-colors">
                SkillStation
              </span>
              <span className="text-[7px] font-black text-[#FF5722] tracking-[0.2em] uppercase leading-none mt-1">
                AI ACADEMY
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER-LEFT: Compact Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className={`text-[12px] font-bold tracking-tight transition-all duration-300 ${
                location.pathname === link.path ? 'text-[#FF5722]' : 'text-slate-500 hover:text-[#FF5722]'
              }`}
            >
              <div className="flex items-center gap-1">
                {link.name}
                {link.hasDropdown && <ChevronDown size={12} className="opacity-40" />}
              </div>
            </Link>
          ))}
        </div>

        {/* RIGHT: Compact Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              to="/login" 
              className="px-6 py-2.5 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
            >
              <User size={14} /> Login
            </Link>
            <Link 
              to="/jobs" 
              className="px-6 py-2.5 rounded-full bg-white border border-orange-500/60 text-slate-900 text-[11px] font-bold flex items-center gap-2 hover:bg-orange-50 transition-all"
            >
              <UserCircle size={14} className="text-slate-400" /> Jobs
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-slate-500 hover:text-[#FF5722] transition-all"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-3 mx-4 bg-white/35 backdrop-blur-3xl rounded-[2rem] border border-white/40 shadow-2xl p-6 flex flex-col gap-4 lg:hidden z-[60]"
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold text-slate-900 hover:text-[#FF5722] flex items-center justify-between"
                >
                  {link.name}
                  <ChevronDown size={16} className="-rotate-90 opacity-20" />
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex gap-3">
                <Link to="/login" className="flex-1 py-3 bg-orange-500 text-white text-center rounded-xl font-bold text-sm">
                  Login
                </Link>
                <Link to="/jobs" className="flex-1 py-3 bg-white border border-orange-500 text-slate-900 text-center rounded-xl font-bold text-sm">
                  Jobs
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
