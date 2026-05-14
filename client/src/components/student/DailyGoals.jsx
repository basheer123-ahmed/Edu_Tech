import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Target, Trophy } from 'lucide-react';

const DailyGoals = ({ goals = [], loading }) => {
  if (loading) return (
    <div className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse shadow-sm" />
  );

  const mockGoals = [
    { id: 1, title: 'Complete 2 lessons', completed: true },
    { id: 2, title: 'Solve 1 coding problem', completed: false },
    { id: 3, title: 'Take weekly test', completed: false },
  ];

  const currentGoals = goals.length > 0 ? goals : mockGoals;
  const completedCount = currentGoals.filter(g => g.completed).length;
  const progress = Math.round((completedCount / currentGoals.length) * 100);

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-full flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Target size={14} className="text-red-500" />
            Daily Goals
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">XP Bonus Available</p>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
          <Trophy size={14} className="text-amber-600" />
          <span className="text-[11px] font-black text-amber-700">50 XP</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{progress}% Complete</span>
          <span className="text-[10px] font-black text-slate-400">{completedCount}/{currentGoals.length}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
          />
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {currentGoals.map((goal, i) => (
          <div key={goal.id} className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${goal.completed ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-100 shadow-sm'}`}>
            <button className={`shrink-0 transition-colors ${goal.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-500'}`}>
              {goal.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
            <span className={`text-xs font-bold transition-all ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {goal.title}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-slate-200 text-[10px] font-black text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-600 transition-all uppercase tracking-widest shadow-sm">
        + Add Custom Goal
      </button>
    </div>
  );
};

export default DailyGoals;
