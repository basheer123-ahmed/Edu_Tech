import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, ChevronRight, AlertCircle } from 'lucide-react';

const UpcomingItems = ({ exams = [], assignments = [], loading }) => {
  if (loading) return (
    <div className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse shadow-sm" />
  );

  const allItems = [
    ...exams.map(e => ({ ...e, type: 'EXAM', icon: <AlertCircle size={14} />, color: 'text-orange-600', bg: 'bg-orange-50' })),
    ...assignments.map(a => ({ ...a, type: 'ASSIGNMENT', icon: <FileText size={14} />, color: 'text-blue-600', bg: 'bg-blue-50' }))
  ].slice(0, 5);

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-full flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Clock size={14} className="text-fuchsia-500" />
            Upcoming
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">Deadlines & Events</p>
        </div>
        <button className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:text-violet-700 transition flex items-center gap-1">
          View All <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex-1 space-y-3">
        {allItems.length > 0 ? allItems.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 hover:border-violet-200 transition-all cursor-pointer shadow-sm"
          >
            <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-slate-900 truncate">{item.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.type}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-slate-600">2 Days</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Left</p>
            </div>
          </motion.div>
        )) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-300">
            <Clock size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-bold uppercase tracking-widest">No upcoming items</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingItems;
