import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultBanners = [
  {
    id: 1,
    title: 'Share your Journey',
    subtitle: 'Your Story. Your Reels. Your Earnings.',
    placedText: 'Placed Student',
    cta: 'LEARN MORE',
    bg: '#25262B',
    logoText: 'tcs',
    image: '/placed_students.png',
    badges: ['7.9 LPA', '9.9 LPA', '7.5 LPA']
  },
  {
    id: 2,
    title: 'Master Tech Skills',
    subtitle: 'Code. Practice. Build your Resume.',
    placedText: 'Coding Elite',
    cta: 'START CODING',
    bg: '#25262B',
    logoText: 'wipro',
    image: '/placed_students_2.png',
    badges: ['8.5 LPA', '12.0 LPA', '9.2 LPA']
  },
  {
    id: 3,
    title: 'Campus Recruitment',
    subtitle: 'Register. Get Interviewed. Get Placed.',
    placedText: 'Future Leader',
    cta: 'VIEW DRIVES',
    bg: '#25262B',
    logoText: 'infosys',
    image: '/placed_students_3.png',
    badges: ['6.8 LPA', '10.5 LPA', '8.0 LPA']
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
    <div className="relative w-full h-[220px] md:h-[240px] rounded-[2rem] overflow-hidden group shadow-xl border border-white/20">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-between overflow-hidden"
          style={{ background: b.bg || '#25262B' }}
        >
          {/* CUSTOM PLACEMENT BANNER LAYOUT (MATCHING 2ND SCREENSHOT EXACTLY) */}
          <div className="relative w-full h-full flex items-center justify-between px-8 md:px-12 text-white">
            {/* Giant Translucent background Logo */}
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 select-none opacity-[0.04] pointer-events-none text-8xl font-black tracking-tighter uppercase">
              {b.logoText}
            </div>
            
            {/* Left Content Column */}
            <div className="relative z-10 max-w-lg flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                {/* Play / Reels Icon */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                  {b.title}
                </h2>
              </div>

              {/* Subtitle with highlighted EARN/CODE/GET word */}
              <p className="text-slate-300 font-bold text-sm md:text-base leading-snug tracking-wide">
                {b.id === 1 && (
                  <>Your Story. Your Reels. Your <span className="text-rose-400 font-black">EARN</span>ings.</>
                )}
                {b.id === 2 && (
                  <>Code. Practice. Build your <span className="text-rose-400 font-black">RESUME</span>.</>
                )}
                {b.id === 3 && (
                  <>Register. Get Interviewed. Get <span className="text-rose-400 font-black">PLACED</span>.</>
                )}
              </p>

              {/* Large Placed Student Overlay Outline Text */}
              <h1 className="text-4xl md:text-5xl font-black text-white/10 uppercase tracking-tight my-2 select-none">
                {b.placedText || 'Placed Student'}
              </h1>

              {/* Red CTA Button with chevron indicator */}
              <button className="self-start mt-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-full text-white font-black text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 hover:-translate-y-0.5 transition-all">
                <span className="flex items-center tracking-widest">
                  <span className="text-[10px] opacity-70">» </span> {b.cta}
                </span>
              </button>
            </div>

            {/* Right Side: Placed Students Image & Packages overlay */}
            <div className="relative h-full w-[45%] hidden md:flex items-center justify-center pr-4">
              {/* Red background glow behind students */}
              <div className="absolute w-72 h-72 rounded-full bg-rose-500/25 blur-3xl" />
              
              {/* Student Team Photo */}
              <div className="relative z-10 h-[90%] w-full flex items-end justify-center overflow-hidden rounded-2xl">
                <img 
                  src={b.image} 
                  alt="Placed Students" 
                  className="h-full w-full object-cover object-top filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" 
                />
              </div>

              {/* Absolute LPA salary tags at the bottom */}
              <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-around gap-2 px-2">
                {b.badges?.map((badgeText, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-amber-100/90 backdrop-blur-sm border border-amber-200/50 rounded-lg text-slate-800 font-black text-[10px] shadow-md">
                    {badgeText}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 shadow-lg">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 shadow-lg">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-6 bg-rose-500' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
