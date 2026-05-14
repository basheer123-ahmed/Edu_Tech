import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Trophy, Zap, TrendingUp, Target, Code2, Brain } from 'lucide-react';

const SkeletonCard = () => (
  <div className="animate-pulse p-6 rounded-3xl bg-white border border-slate-100 flex items-center gap-5">
    <div className="w-12 h-12 rounded-2xl bg-slate-100" />
    <div className="flex-1">
      <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
      <div className="h-5 bg-slate-100 rounded w-1/3" />
    </div>
  </div>
);

const StatsCard = ({ label, value, icon, color, gradient }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className={`relative p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden group cursor-default`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 text-2xl transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-md`} style={{ color }}>
        {icon}
      </div>
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 relative z-10">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 relative z-10">{value}</h3>
  </motion.div>
);

const PerformanceStats = ({ data, loading }) => {
  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  const { student, stats } = data || { student: {}, stats: {} };

  const cards = [
    { label: 'XP Points', value: student?.xp?.toLocaleString() || '0', icon: <Zap size={22} />, color: '#F59E0B', gradient: 'from-amber-400 to-yellow-500' },
    { label: 'Employability', value: `${stats?.employabilityScore || 0}%`, icon: <Brain size={22} />, color: '#7c3aed', gradient: 'from-violet-400 to-purple-500' },
    { label: 'Streak', value: `${student?.streak || 0} Days`, icon: <TrendingUp size={22} />, color: '#f97316', gradient: 'from-orange-400 to-red-500' },
    { label: 'Global Rank', value: student?.rank || 'Novice', icon: <Trophy size={22} />, color: '#EAB308', gradient: 'from-yellow-400 to-amber-500' },
    { label: 'Enrolled Courses', value: stats?.totalCourses || '0', icon: <BookOpen size={22} />, color: '#3B82F6', gradient: 'from-blue-400 to-indigo-500' },
    { label: 'Submitted', value: stats?.totalSubmissions || '0', icon: <CheckCircle2 size={22} />, color: '#10B981', gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Exams Passed', value: stats?.passedExams || '0', icon: <Target size={22} />, color: '#EC4899', gradient: 'from-pink-400 to-rose-500' },
    { label: 'Skills', value: stats?.skillsCount || '0', icon: <Code2 size={22} />, color: '#06B6D4', gradient: 'from-cyan-400 to-sky-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <StatsCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default PerformanceStats;
