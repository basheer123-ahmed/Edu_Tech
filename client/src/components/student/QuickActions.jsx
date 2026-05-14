import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Code2, GraduationCap, FileSearch, MessageSquare, Plus } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { name: 'Practice Coding', icon: <Code2 size={18} />, color: 'bg-violet-600', shadow: 'shadow-violet-200' },
    { name: 'Ask TAI', icon: <MessageSquare size={18} />, color: 'bg-fuchsia-600', shadow: 'shadow-fuchsia-200' },
    { name: 'Resume AI', icon: <FileSearch size={18} />, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
    { name: 'Courses', icon: <GraduationCap size={18} />, color: 'bg-emerald-600', shadow: 'shadow-emerald-200' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all h-full flex flex-col">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Zap size={14} className="text-yellow-500" />
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, i) => (
          <motion.button
            key={action.name}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all group"
          >
            <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors text-center uppercase tracking-widest leading-tight">
              {action.name}
            </span>
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-500 transition-all"
        >
          <Plus size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QuickActions;
