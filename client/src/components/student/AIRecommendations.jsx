import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, Code2, Briefcase, ChevronRight } from 'lucide-react';

const TYPE_ICONS = {
  COURSE: <BookOpen size={18} className="text-blue-500" />,
  CODING: <Code2 size={18} className="text-violet-500" />,
  JOB: <Briefcase size={18} className="text-emerald-500" />,
  default: <Lightbulb size={18} className="text-amber-500" />
};

const AIRecommendations = ({ data, loading }) => {
  const recs = data?.recommendations || [];
  const courses = data?.suggestedCourses || [];

  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 animate-pulse shadow-sm">
      <div className="h-5 bg-slate-100 rounded w-1/3 mb-6" />
      {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-50 rounded-2xl mb-3" />)}
    </div>
  );

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-3">
        <Lightbulb className="text-amber-500" size={22} fill="currentColor" />
        AI Guide
      </h3>
      <p className="text-xs text-slate-400 font-medium mb-6">Personalized path to mastery</p>

      {recs.length > 0 && (
        <div className="space-y-3 mb-6">
          {recs.map(rec => (
            <motion.div key={rec.id} whileHover={{ x: 4 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-amber-100 hover:bg-white hover:shadow-lg transition group cursor-pointer">
              <div className="mt-0.5">{TYPE_ICONS[rec.type] || TYPE_ICONS.default}</div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">{rec.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{rec.reason}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 transition mt-1" />
            </motion.div>
          ))}
        </div>
      )}

      {courses.length > 0 && (
        <>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Suggested Courses</p>
          <div className="space-y-3">
            {courses.map(course => (
              <motion.div key={course.id} whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0">
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    : <BookOpen className="w-full h-full p-2 text-slate-200" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-600 transition">{course.title}</p>
                  <p className="text-[10px] text-slate-400">{course.category}</p>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
                  {course.difficulty}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {recs.length === 0 && courses.length === 0 && (
        <div className="text-center py-10">
          <Lightbulb className="mx-auto text-amber-100 mb-3" size={40} />
          <p className="text-slate-400 text-sm font-medium">Keep learning for more guide.</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
