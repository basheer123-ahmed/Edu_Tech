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
    <div className="fixed top-0 inset-x-0 z-50 flex items-start justify-center pt-4 px-6 pointer-events-none">

      {/* CENTERED GROUP: Logo + Pill side by side */}
      <div className="flex items-center gap-3">

        {/* Logo — separate, left of pill, both centered */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-shrink-0 pointer-events-auto"
        >
          <Link to="/" className="flex items-center group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {heroLogo ? (
                <img src={heroLogo} alt="SkilStation Logo" className="w-full h-full object-contain drop-shadow-md" />
              ) : (
                <Sparkles size={24} className="text-[#FF5722]" />
              )}
            </div>
          </Link>
        </motion.div>

        {/* Compact Pill — right of logo */}
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative inline-flex items-center gap-3 px-4 py-2 pointer-events-auto rounded-[50px] border-2 border-[#FF5722]/40 bg-white/20 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        >
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 px-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={`text-[14px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1 whitespace-nowrap ${
                    isActive 
                      ? 'text-[#FF5722]' 
                      : 'text-slate-800 hover:text-[#FF5722]'
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={13} className="opacity-60" />}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-slate-300/50" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-5 py-2 rounded-full bg-[#FF5722] text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-[#E64A19] transition-all shadow-lg shadow-[#FF5722]/25 whitespace-nowrap"
              >
                <User size={14} /> Login
              </Link>
              <Link 
                to="/jobs" 
                className="px-5 py-2 rounded-full bg-white/80 text-slate-900 text-[13px] font-bold flex items-center gap-1.5 hover:bg-white transition-all border border-slate-200/60 whitespace-nowrap"
              >
                <Briefcase size={14} className="text-slate-700" /> Jobs
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
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-3xl rounded-[2rem] border border-slate-100 shadow-2xl p-6 flex flex-col gap-4 lg:hidden z-[60]"
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
                  <Link to="/login" className="flex-1 py-3 bg-[#FF5722] text-white text-center rounded-xl font-bold text-sm shadow-md shadow-[#FF5722]/20">
                    Login
                  </Link>
                  <Link to="/jobs" className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 text-center rounded-xl font-bold text-sm shadow-sm">
                    Jobs
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

      </div>
    </div>
  );
};

export default Navbar;
