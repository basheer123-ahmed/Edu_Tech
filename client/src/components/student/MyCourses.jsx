import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Play, CheckCircle2, Clock } from 'lucide-react';

const CourseProgressCard = ({ enrollment }) => {
  const navigate = useNavigate();
  const { course, progress } = enrollment;
  const progressPct = typeof progress === 'number' ? Math.round(progress) : 0;
  const isDone = progressPct >= 100;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/course/${course.id}/learn`)}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-violet-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
        {course?.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-90" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-slate-400" size={20} /></div>
        }
        {isDone && (
          <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
            <CheckCircle2 className="text-white" size={20} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-violet-600 transition">{course?.title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{course?.category}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full" />
          </div>
          <span className="text-[10px] font-black text-slate-400">{progressPct}%</span>
        </div>
      </div>
      <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-white group-hover:bg-violet-600 group-hover:border-violet-600 transition-all shadow-sm">
        {isDone ? <CheckCircle2 size={16} /> : <Play size={16} />}
      </button>
    </motion.div>
  );
};

const MyCourses = ({ data, loading }) => {
  const enrollments = data?.enrollments || [];

  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
      <div className="h-5 bg-slate-100 rounded w-1/3 mb-6 animate-pulse" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-slate-50 rounded-2xl mb-3 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
          <Play className="text-violet-600" size={20} fill="currentColor" />
          My Learning
        </h3>
        <button 
          onClick={() => navigate('/dashboard/student/courses')}
          className="text-xs font-bold text-slate-400 hover:text-slate-900 transition flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      {enrollments.length > 0 ? (
        <div className="space-y-3">
          {enrollments.slice(0, 5).map(e => <CourseProgressCard key={e.id} enrollment={e} />)}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
          <BookOpen className="mx-auto text-slate-200 mb-3" size={40} />
          <p className="text-slate-400 font-bold text-sm">No active courses.</p>
          <button className="mt-4 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black rounded-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-violet-200">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
