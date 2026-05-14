import React from 'react';
import { motion } from 'framer-motion';

const CircularProgress = ({ value = 0, size = 120, strokeWidth = 10, color = '#7c3aed', label, sublabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          {/* Progress */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-slate-900 leading-none">{value}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        {sublabel && <p className="text-[10px] text-slate-400 uppercase tracking-widest">{sublabel}</p>}
      </div>
    </div>
  );
};

const ProgressAnalytics = ({ data, loading }) => {
  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 animate-pulse">
      <div className="h-5 bg-slate-100 rounded w-1/3 mb-8" />
      <div className="flex justify-around">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full bg-slate-50" />
            <div className="h-3 bg-slate-50 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );

  const metrics = [
    { label: 'Courses', sublabel: 'Progress', value: data?.courseProgress || 0, color: '#3B82F6' },
    { label: 'Assignments', sublabel: 'Submitted', value: data?.assignmentProgress || 0, color: '#7c3aed' },
    { label: 'Exams', sublabel: 'Passed', value: data?.examProgress || 0, color: '#06B6D4' },
    { label: 'Attendance', sublabel: 'Presence', value: data?.attendanceProgress || 0, color: '#f97316' },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-slate-900">Progress Analytics</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Live
        </span>
      </div>
      <div className="flex flex-wrap justify-around gap-8">
        {metrics.map(m => (
          <CircularProgress key={m.label} value={m.value} color={m.color} label={m.label} sublabel={m.sublabel} />
        ))}
      </div>
    </div>
  );
};

export default ProgressAnalytics;
