import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, BadgeCheck, Zap, Code2, Database, Globe, Cpu, ChevronRight } from 'lucide-react';

const LEVEL_COLORS = { BEGINNER: '#10B981', INTERMEDIATE: '#3B82F6', ADVANCED: '#8B5CF6', EXPERT: '#F59E0B' };
const LEVEL_PROGRESS = { BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 };

const SkillCard = ({ skill }) => {
  const level = skill.level?.toUpperCase() || 'BEGINNER';
  const color = LEVEL_COLORS[level] || '#10B981';
  const progress = LEVEL_PROGRESS[level] || 25;

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white border border-slate-100 rounded-2xl p-4 group transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-slate-50 text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
          <Code2 size={18} />
        </div>
        {skill.isVerified && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100">
            <BadgeCheck size={12} className="text-blue-600" />
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Verified</span>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-black text-slate-900 text-sm group-hover:text-violet-600 transition">{skill.name}</h4>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{level}</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Proficiency</span>
          <span className="text-[10px] font-black text-slate-900">{progress}%</span>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full" 
            style={{ backgroundColor: color }} 
          />
        </div>
      </div>
    </motion.div>
  );
};

const SkillsAcquired = ({ data, loading }) => {
  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 animate-pulse shadow-sm">
      <div className="h-5 bg-slate-100 rounded w-1/4 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 h-full flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} className="text-violet-500" />
            Skill Matrix
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Verified industry readiness</p>
        </div>
        <button className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:text-violet-700 transition flex items-center gap-1">
          Explore All <ChevronRight size={12} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto scrollbar-none pr-1">
        {data?.length > 0 ? (
          data.map(skill => <SkillCard key={skill.id} skill={skill} />)
        ) : (
          [...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2 opacity-60">
              <Code2 size={24} className="text-slate-300" />
              <p className="text-[9px] font-black text-slate-400 uppercase">Available Skill Slot</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillsAcquired;
