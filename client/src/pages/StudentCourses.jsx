import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  BookOpen, 
  ChevronRight,
  Loader2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    available: 0,
    enrolled: 0,
    completed: 0,
    certificates: 0,
    enrolledCourseIds: [],
    completedCourseIds: []
  });
  const socket = useSocket();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses?status=PUBLISHED&search=${search}`);
      setCourses(res.data.courses || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/student/courses/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load student course stats', error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in first');
        return;
      }
      const res = await axios.post(
        'http://localhost:5000/api/student/courses/enroll',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || 'Successfully enrolled! 🚀');
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, [search]);

  useEffect(() => {
    if (socket) {
      socket.on('course:published', (newCourse) => {
        setCourses(prev => [newCourse, ...prev]);
        toast.success(`New course available: ${newCourse.title}`, { icon: '🚀' });
        fetchStats();
      });

      socket.on('course:updated', () => {
        fetchCourses();
        fetchStats();
      });
      socket.on('course:deleted', (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        fetchStats();
      });

      return () => {
        socket.off('course:published');
        socket.off('socket:updated');
        socket.off('course:deleted');
      };
    }
  }, [socket]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 min-h-screen bg-[#F6EAF4]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Explore Courses 🎓</h1>
          <p className="text-slate-500 font-medium italic">"The beautiful thing about learning is that no one can take it away from you."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="What do you want to learn today?" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 w-80 text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all shadow-sm font-medium"
            />
          </div>
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stats Summary - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Available', value: stats.available || courses.length, icon: <BookOpen />, color: 'blue' },
          { label: 'Enrolled', value: stats.enrolled, icon: <Layers />, color: 'violet' },
          { label: 'Completed', value: stats.completed, icon: <CheckCircle />, color: 'emerald' },
          { label: 'Certificates', value: stats.certificates, icon: <Award />, color: 'orange' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Learning Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Syncing catalog with cloud...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-400 font-medium">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {courses.map((course, idx) => (
              <motion.div 
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-200/20 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Visual Thumbnail Section */}
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={course.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                      <BookOpen size={48} />
                    </div>
                  )}
                  
                  {/* Floating Badge */}
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-violet-600 text-[10px] font-black px-4 py-2 rounded-xl shadow-lg border border-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse"></div> {course.category?.toUpperCase() || 'GENERAL'}
                  </div>

                  <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-xl border border-white/10">
                    ${course.price || 'Free'}
                  </div>
                </div>

                {/* Detailed Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight group-hover:text-violet-600 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-black text-violet-600 uppercase">
                        {course.instructorName?.[0] || 'I'}
                      </div>
                      <p className="text-xs text-slate-400 font-bold">by <span className="text-slate-600">{course.instructorName || 'Expert Instructor'}</span></p>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} className="text-violet-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{course.duration || 'Self-paced'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Layers size={14} className="text-violet-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{course._count?.module || 0} Modules</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons based on enrollment state */}
                  <div className="mt-auto pt-4">
                    {stats.completedCourseIds.includes(course.id) ? (
                      <Link 
                        to={`/dashboard/student/certificates`}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200/20 hover:-translate-y-1 active:scale-95"
                      >
                        🏆 View Certificate <ChevronRight size={18} />
                      </Link>
                    ) : stats.enrolledCourseIds.includes(course.id) ? (
                      <Link 
                        to={`/learn/${course.id}`}
                        className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-300 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200/20 hover:-translate-y-1 active:scale-95"
                      >
                        ✅ Continue Learning <ChevronRight size={18} />
                      </Link>
                    ) : (
                      <div className="flex gap-3 w-full">
                        <Link 
                          to={`${course.id}`}
                          className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-slate-200 hover:-translate-y-0.5 active:scale-95 border border-slate-200/50"
                        >
                          Details
                        </Link>
                        <button 
                          onClick={() => handleEnroll(course.id)}
                          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-violet-600 hover:shadow-xl hover:shadow-violet-200/20 hover:-translate-y-0.5 active:scale-95"
                        >
                          🚀 Enroll Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
