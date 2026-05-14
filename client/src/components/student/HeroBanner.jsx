import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Briefcase, Zap, Star, Bell } from 'lucide-react';

const defaultBanners = [
  {
    id: 1,
    title: 'Top Companies Are Hiring!',
    subtitle: 'TCS, Infosys, Wipro campus drives are open for eligible students.',
    cta: 'View Drives',
    ctaColor: 'from-orange-500 to-red-500',
    bg: 'from-white via-orange-50/30 to-white',
    accent: '#f97316',
    icon: <Briefcase size={80} className="text-orange-500/10" />,
    badge: '🏢 Placement Drive',
    textColor: 'text-slate-900',
    subColor: 'text-slate-600'
  },
  {
    id: 2,
    title: 'Boost Your Employability Score',
    subtitle: 'Complete coding challenges and assignments to reach the top 10% percentile.',
    cta: 'Start Practicing',
    ctaColor: 'from-violet-600 to-fuchsia-600',
    bg: 'from-white via-violet-50/30 to-white',
    accent: '#7c3aed',
    icon: <Zap size={80} className="text-violet-500/10" />,
    badge: '⚡ AI Powered',
    textColor: 'text-slate-900',
    subColor: 'text-slate-600'
  },
  {
    id: 3,
    title: 'New Courses Available!',
    subtitle: 'Advanced React, GenAI, and Cloud Architecture courses just published.',
    cta: 'Explore Courses',
    ctaColor: 'from-emerald-600 to-teal-600',
    bg: 'from-white via-emerald-50/30 to-white',
    accent: '#10B981',
    icon: <Star size={80} className="text-emerald-500/10" />,
    badge: '🎓 New Courses',
    textColor: 'text-slate-900',
    subColor: 'text-slate-600'
  }
];

const HeroBanner = ({ data }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const banners = data?.length ? data : defaultBanners;

  const next = () => setCurrent(c => (c + 1) % banners.length);
  const prev = () => setCurrent(c => (c - 1 + banners.length) % banners.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  const b = banners[current];

  return (
    <div className="relative w-full h-[200px] md:h-[220px] rounded-[2rem] overflow-hidden group shadow-xl shadow-slate-200/50 border border-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${b.bg} flex items-center px-10 overflow-hidden`}
        >
          {/* Decorative bg shapes */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-60">{b.icon}</div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: b.accent }} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/60 border border-slate-100 text-slate-500 mb-4 shadow-sm">
              {b.badge}
            </span>
            <h2 className={`text-2xl md:text-3xl font-black ${b.textColor || 'text-slate-900'} mb-2 leading-tight`}>{b.title}</h2>
            <p className={`${b.subColor || 'text-slate-600'} font-medium mb-5 text-sm max-w-md`}>{b.subtitle}</p>
            <button className={`px-7 py-3 bg-gradient-to-r ${b.ctaColor} rounded-xl text-white font-black text-sm shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all`}>
              {b.cta} →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-slate-800' : 'w-2 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
