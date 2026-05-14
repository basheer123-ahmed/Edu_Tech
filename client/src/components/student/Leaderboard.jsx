import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Share2, TrendingUp, Filter } from 'lucide-react';

const avatarColors = ['#F59E0B', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#F97316', '#06B6D4'];

const Avatar = ({ name = '', size = 44, color }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const bg = color || avatarColors[name.charCodeAt(0) % avatarColors.length];
  return (
    <div className="flex items-center justify-center rounded-full font-black text-white select-none border-2 border-white/10"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
};

const Leaderboard = ({ data, loading }) => {
  const [filter, setFilter] = useState('total');
  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 animate-pulse">
      <div className="h-5 bg-slate-100 rounded w-1/3 mb-8" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-100" />
          <div className="flex-1 h-4 bg-slate-100 rounded" />
          <div className="w-16 h-4 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );

  const leaderboard = data?.leaderboard || [];
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 8); // Showing fewer for density

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumSizes = [44, 60, 44];

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] flex flex-col h-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Crown size={14} className="text-amber-500" />
            Leaderboard
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Top Talent</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition shadow-sm">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* Podium Section */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-6 px-6 pb-6 pt-4 border-b border-slate-50">
          {podiumOrder.map((student, i) => {
            const isFirst = student.rank === 1;
            const avatarSize = podiumSizes[i];
            return (
              <motion.div key={student.studentId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center gap-2 ${isFirst ? 'scale-110 -mt-2' : 'opacity-80'}`}>
                <div className="relative">
                  {isFirst && (
                    <motion.div 
                      animate={{ y: [-5, -10, -5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2"
                    >
                      <Crown className="text-amber-500" size={24} fill="currentColor" />
                    </motion.div>
                  )}
                  <Avatar name={student.name} size={avatarSize} />
                  <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center border-2 border-white ${isFirst ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-600'}`}>
                    {student.rank}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black text-slate-900 truncate max-w-[80px]">{student.name.split(' ')[0]}</p>
                  <p className="text-[10px] font-black text-violet-600">{student.xp.toLocaleString()} XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List Section */}
      <div className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-none">
        {rest.map((student, i) => (
          <motion.div key={student.studentId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all ${student.isCurrentUser ? 'bg-violet-50 border border-violet-100 shadow-sm' : 'bg-slate-50/50 border border-transparent'}`}>
            <span className="text-[10px] font-black text-slate-400 w-5 text-center">{student.rank}</span>
            <Avatar name={student.name} size={32} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold truncate ${student.isCurrentUser ? 'text-violet-600' : 'text-slate-800'}`}>
                {student.name}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Level {student.level || 1}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-900">{student.xp.toLocaleString()}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-50">
        <button className="w-full py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition uppercase tracking-widest shadow-sm">
          View All Performers
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
