import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Unlock, CheckCircle2, ChevronRight, Award, HelpCircle, Code, HelpCircle as BothIcon, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseRoadmapPage = () => {
  const { courseId } = useParams();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/assignments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLevels(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load levels roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin" />
        <span className="text-slate-500 font-bold">Assembling Roadmap Connector...</span>
      </div>
    );
  }

  const getIcon = (type) => {
    if (type === 'coding') return <Code size={16} />;
    if (type === 'mcq') return <HelpCircle size={16} />;
    return <Sparkles size={16} />;
  };

  return (
    <div className="space-y-8 pb-20 font-sans bg-[#fbf9fc] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/student/assignments" className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-pink-600 hover:-translate-x-1 transition shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Learning Roadmap 🗺️</h1>
          <p className="text-slate-500 font-bold">Solve levels in sequence. Score 50%+ to unlock the next level.</p>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="relative max-w-2xl mx-auto py-8">
        {/* Vertical Connector Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-400 rounded-full" />

        <div className="space-y-12 relative z-10">
          {levels.map((level, idx) => {
            const isUnlocked = level.isUnlocked;
            const isCompleted = level.isCompleted;

            return (
              <div key={level.id} className="flex gap-8 items-start group">
                {/* Node Icon */}
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-4 shadow-md shrink-0 transition duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-white text-white shadow-emerald-100' 
                    : isUnlocked 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-white text-white animate-pulse shadow-pink-100' 
                      : 'bg-slate-100 border-white text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={24} />
                  ) : isUnlocked ? (
                    <Unlock size={22} />
                  ) : (
                    <Lock size={22} />
                  )}
                </div>

                {/* Level Card */}
                <motion.div 
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  className={`flex-1 p-6 rounded-[2rem] border transition-all ${
                    isCompleted 
                      ? 'bg-white border-slate-100 shadow-sm' 
                      : isUnlocked 
                        ? 'bg-white border-pink-100 shadow-md shadow-pink-500/5 hover:shadow-lg' 
                        : 'bg-slate-50/50 border-slate-100 opacity-60 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Level {level.order}
                      </span>
                      <h3 className="text-lg font-black text-slate-800 mt-1">{level.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        {getIcon(level.type)} {level.type}
                      </span>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Award size={10} /> {level.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-500 font-bold text-sm mb-6 leading-relaxed">{level.description}</p>

                  <div className="flex items-center justify-between gap-4">
                    {isCompleted ? (
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 size={14} /> Passed ({level.score}%)
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-bold">
                        {level.problemsCount} Questions Total
                      </div>
                    )}

                    {isUnlocked && (
                      <Link 
                        to={`/dashboard/student/assignments/${courseId}/level/${level.id}`}
                        className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-xs shadow-md shadow-pink-100 hover:opacity-90 transition flex items-center gap-1"
                      >
                        Enter Workspace <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}

          {levels.length === 0 && (
            <p className="text-center text-slate-400 font-bold py-12">No levels configured for this course yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRoadmapPage;
