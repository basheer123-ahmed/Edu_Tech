import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, ShieldCheck, Zap } from 'lucide-react';

const EmployabilityMeter = ({ score = 0, loading }) => {
  const getStatus = (s) => {
    if (s >= 80) return { label: 'High Potential', color: 'text-emerald-600', bg: 'bg-emerald-500' };
    if (s >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-500' };
    if (s >= 40) return { label: 'Intermediate', color: 'text-amber-600', bg: 'bg-amber-500' };
    return { label: 'Low', color: 'text-red-600', bg: 'bg-red-500' };
  };

  const status = getStatus(score);

  if (loading) return (
    <div className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse" />
  );

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden h-full flex flex-col justify-between group hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="absolute top-0 right-0 p-8 text-slate-100 -mr-4 -mt-4 transition-transform group-hover:scale-110">
        <Brain size={120} />
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Brain size={14} className="text-violet-500" />
          Employability
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mb-4">AI Talent Analysis</p>
      </div>

      <div className="relative flex items-center justify-center py-4 z-10">
        <div className="relative w-48 h-24 overflow-hidden">
          <svg className="absolute top-0 left-0 w-48 h-24" viewBox="0 0 100 50">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
            <motion.path 
              d="M 10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke="url(#grad-employ)" 
              strokeWidth="8" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="grad-employ" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <span className="text-4xl font-black text-slate-900">{score}</span>
            <span className="text-xs font-bold text-slate-400 block -mt-1">%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status.bg} shadow-[0_0_8px_currentColor]`} />
          <span className={`text-xs font-black uppercase tracking-wider ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-1 h-3 rounded-full ${i <= (score / 20) ? 'bg-violet-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 z-10">
        <div className="p-2 rounded-xl bg-slate-50/50 border border-slate-100 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase">Rank</p>
          <p className="text-xs font-black text-slate-900">Top 5%</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/50 border border-slate-100 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase">Status</p>
          <p className="text-xs font-black text-emerald-600">Verified</p>
        </div>
      </div>
    </div>
  );
};

export default EmployabilityMeter;
