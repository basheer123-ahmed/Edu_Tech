import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, Shield } from 'lucide-react';

const AchievementBadges = ({ badges = [], loading }) => {
  if (loading) return (
    <div className="h-40 rounded-3xl bg-white border border-slate-100 animate-pulse shadow-sm" />
  );

  const mockBadges = [
    { name: 'Fast Learner', icon: <Zap size={24} />, color: 'text-amber-500', bg: 'bg-amber-50', unlocked: true },
    { name: 'Code Ninja', icon: <Star size={24} />, color: 'text-violet-500', bg: 'bg-violet-50', unlocked: true },
    { name: 'Problem Solver', icon: <Shield size={24} />, color: 'text-blue-500', bg: 'bg-blue-50', unlocked: true },
    { name: 'Early Bird', icon: <Award size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-50', unlocked: false },
    { name: 'Consistency King', icon: <Zap size={24} />, color: 'text-orange-500', bg: 'bg-orange-50', unlocked: false },
  ];

  const displayBadges = badges.length > 0 ? badges : mockBadges;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all h-full">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Mastery Badges</h3>
      <div className="flex flex-wrap gap-4">
        {displayBadges.map((badge, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${badge.unlocked ? 'border-slate-100 ' + badge.bg + ' ' + badge.color : 'border-slate-50 bg-slate-50 text-slate-300 grayscale opacity-40'} relative group cursor-help transition-all`}
          >
            {badge.icon || <Award size={24} />}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-[9px] font-bold text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              {badge.name}
            </div>
          </motion.div>
        ))}
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300">
          <span className="text-[10px] font-black">+12</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;
