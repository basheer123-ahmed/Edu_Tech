import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

const AttendanceAnalytics = ({ data = [], loading }) => {
  if (loading) return (
    <div className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse" />
  );

  const stats = [
    { label: 'Present', value: data.filter(a => a.status === 'PRESENT').length, icon: <CheckCircle2 size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Absent', value: data.filter(a => a.status === 'ABSENT').length, icon: <XCircle size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Late', value: data.filter(a => a.status === 'LATE').length, icon: <Clock size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const percentage = data.length > 0 
    ? Math.round((data.filter(a => a.status === 'PRESENT').length / data.length) * 100)
    : 0;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-full flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            Attendance
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">Monthly Tracking</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-[11px] font-black text-blue-600">{percentage}%</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-7 gap-2 mb-6">
        {[...Array(28)].map((_, i) => {
          const isPresent = Math.random() > 0.2;
          return (
            <div key={i} className={`aspect-square rounded-lg border flex items-center justify-center text-[8px] font-bold transition-colors ${isPresent ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600/50'}`}>
              {i + 1}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`p-3 rounded-2xl ${s.bg} border border-slate-100 flex flex-col items-center gap-1`}>
            <div className={s.color}>{s.icon}</div>
            <p className="text-[14px] font-black text-slate-900">{s.value}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
