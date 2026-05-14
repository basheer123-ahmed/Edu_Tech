import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Share2, Flame, Calendar } from 'lucide-react';
import { format, startOfYear, eachDayOfInterval, getDay, addDays } from 'date-fns';

const COLORS = {
  0: '#f1f5f9',  // no practice
  1: '#ddd6fe',  // violet low
  2: '#c4b5fd',  // violet med
  3: '#a78bfa',  // violet high
  4: '#8b5cf6',  // violet max
};

const getColor = (count) => {
  if (!count) return COLORS[0];
  if (count === 1) return COLORS[1];
  if (count === 2) return COLORS[2];
  if (count === 3) return COLORS[3];
  return COLORS[4];
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SubmissionHeatmap = ({ data, loading }) => {
  const { heatmap = {}, currentStreak = 0, longestStreak = 0, totalCorrect = 0 } = data || {};

  const weeks = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);
    while (getDay(start) !== 0) start.setDate(start.getDate() - 1);
    
    const days = eachDayOfInterval({ start, end: today });
    const weekGroups = [];
    let week = [];
    for (const day of days) {
      week.push(day);
      if (getDay(day) === 6) { weekGroups.push(week); week = []; }
    }
    if (week.length) weekGroups.push(week);
    return weekGroups;
  }, []);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const month = week[0].getMonth();
      if (month !== lastMonth) { labels.push({ wi, label: MONTHS[month] }); lastMonth = month; }
    });
    return labels;
  }, [weeks]);

  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 animate-pulse shadow-sm">
      <div className="h-5 bg-slate-100 rounded w-1/4 mb-6" />
      <div className="h-40 bg-slate-50 rounded-2xl" />
    </div>
  );

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} className="text-violet-500" />
            Productivity Map
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Annual Coding Activity</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs font-black text-slate-900">{totalCorrect}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Tasks</p>
          </div>
          <div className="text-right border-l border-slate-100 pl-4">
            <p className="text-xs font-black text-orange-600">{currentStreak} Days</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Current</p>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <div className="min-w-[800px]">
          <div className="flex mb-3 ml-10">
            {monthLabels.map(({ wi, label }) => (
              <div key={`${wi}-${label}`} className="text-[9px] text-slate-400 font-black uppercase tracking-widest" style={{ width: `${(1 / weeks.length) * 100}%` }}>
                {label}
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <div className="flex flex-col gap-1.5 mr-2">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                <div key={i} className="h-3 text-[9px] text-slate-400 font-black flex items-center w-8 justify-end">
                  {day}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const count = heatmap[key] || 0;
                  return (
                    <motion.div 
                      key={key} 
                      whileHover={{ scale: 1.3, zIndex: 10 }}
                      className="w-3 h-3 rounded-[2px] cursor-pointer transition-all border border-transparent hover:border-violet-400"
                      style={{ 
                        background: getColor(count)
                      }}
                      title={`${key}: ${count} interactions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-orange-50 border border-orange-100">
            <Flame size={14} className="text-orange-600" />
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Max Streak: {longestStreak} Days</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mr-1">Less</span>
          {[0, 1, 2, 3, 4].map(v => (
            <div key={v} className="w-3 h-3 rounded-[2px]" style={{ background: getColor(v === 0 ? 0 : v), border: '1px solid #f1f5f9' }} />
          ))}
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest ml-1">More</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHeatmap;
