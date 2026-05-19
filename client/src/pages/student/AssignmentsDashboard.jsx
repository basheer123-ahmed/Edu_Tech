import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Target, CheckCircle2, Award, ChevronRight, BookMarked, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignmentsDashboard = () => {
  const [stats, setStats] = useState({ totalQuestions: 0, solved: 0, attempted: 0, marksObtained: 0 });
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get('http://localhost:5000/api/assignments/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(statsRes.data);

      const coursesRes = await axios.get('http://localhost:5000/api/assignments/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCourses(coursesRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load assignments statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin" />
        <span className="text-slate-500 font-bold">Loading Assignments Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans bg-[#fbf9fc] min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-purple-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 space-y-4 max-w-xl">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <Sparkles size={14} className="text-yellow-300 animate-bounce" /> Gamified Roadmap Challenges
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Master skills, unlock new levels.</h1>
          <p className="text-white/80 font-medium text-sm md:text-base">Complete assignments, solve coding modules in real-time, earn badges, and build your portfolio profile.</p>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Questions', val: stats.totalQuestions, bg: 'from-amber-500/10 to-orange-500/10', text: 'text-amber-600', icon: <BookMarked size={20} /> },
          { label: 'Solved Problems', val: stats.solved, bg: 'from-emerald-500/10 to-teal-500/10', text: 'text-emerald-600', icon: <CheckCircle2 size={20} /> },
          { label: 'Attempted Levels', val: stats.attempted, bg: 'from-pink-500/10 to-rose-500/10', text: 'text-pink-600', icon: <Target size={20} /> },
          { label: 'Average Score', val: `${stats.marksObtained}%`, bg: 'from-violet-500/10 to-purple-500/10', text: 'text-violet-600', icon: <Award size={20} /> }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.bg} ${item.text} flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{item.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Your Roadmap Catalog 🚀</h2>
          <p className="text-slate-500 font-bold text-sm">Select your active enrolled course to start solving levels.</p>
        </div>

        <div className="relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search assignments/courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Course Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <motion.div 
            key={course.id}
            whileHover={{ y: -6 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group"
          >
            {/* Thumbnail */}
            <div className="h-44 bg-slate-100 relative overflow-hidden border-b border-slate-50 shrink-0">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-pink-50 to-purple-50"><BookOpen size={48} className="text-purple-300" /></div>
              )}
              <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-700 shadow-sm">
                {course.difficulty}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-pink-600 transition-colors">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{course.totalLevels} Levels</span>
                  <span>•</span>
                  <span>{course.totalQuestions} Problems</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-slate-400">Roadmap Progress</span>
                  <span className="text-pink-600">{course.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>
              </div>

              {/* CTA Link */}
              <Link 
                to={`/dashboard/student/assignments/${course.id}`} 
                className="w-full py-3 bg-slate-50 border border-slate-100 rounded-2xl text-center font-black text-xs text-slate-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-1 group/btn"
              >
                Enter Levels Roadmap <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-[2rem] border border-slate-100 shadow-sm text-slate-400 font-bold">
            No courses matches found. Please make sure you are enrolled in a course.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsDashboard;
