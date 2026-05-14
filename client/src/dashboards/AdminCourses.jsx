import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  MoreVertical,
  BookOpen,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const socket = useSocket();

  const tabs = [
    { id: 'ALL', label: 'All Courses', icon: <BookOpen size={14} /> },
    { id: 'PUBLISHED', label: 'Published', icon: <CheckCircle2 size={14} className="text-emerald-500" /> },
    { id: 'DRAFT', label: 'Drafts', icon: <Edit2 size={14} className="text-slate-400" /> },
    { id: 'PENDING_REVIEW', label: 'Pending', icon: <Clock size={14} className="text-orange-500" /> },
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/courses?status=${activeTab}&search=${search}`);
      setCourses(res.data.courses || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [activeTab, search]);

  useEffect(() => {
    if (socket) {
      socket.on('course:published', () => fetchCourses());
      socket.on('course:updated', () => fetchCourses());
      socket.on('course:deleted', () => fetchCourses());
      return () => {
        socket.off('course:published');
        socket.off('course:updated');
        socket.off('course:deleted');
      };
    }
  }, [socket]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans bg-[#f4f2f8] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Manage Courses 📚</h1>
          <p className="text-slate-500 font-medium">Control, monitor and scale your learning catalog.</p>
        </div>
        <Link to="/dashboard/admin/courses/create" className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-1 transition-all flex items-center gap-2">
          <Plus size={20} /> Create New Course
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600"><BookOpen size={24} /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Courses</p>
            <p className="text-2xl font-black text-slate-900">{courses.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Users size={24} /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Enrolled</p>
            <p className="text-2xl font-black text-slate-900">{courses.reduce((acc, c) => acc + (c._count?.enrollment || 0), 0)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600"><BarChart3 size={24} /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900">
              ${courses.reduce((acc, c) => acc + (c._count?.enrollment || 0) * (c.price || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Course List Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Course Name</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enrolled</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Revenue</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6"><div className="h-16 bg-slate-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No courses found.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen size={20} /></div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-violet-600 transition-colors">{course.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-400" />
                        {course._count?.enrollment || 0}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-emerald-600">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        {((course._count?.enrollment || 0) * (course.price || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        course.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        course.status === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                        'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <Link to={`/dashboard/admin/courses/edit/${course.id}`} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-100 hover:bg-violet-50 transition shadow-sm">
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
