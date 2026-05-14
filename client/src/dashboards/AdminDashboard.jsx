import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, DollarSign, Clock, FileText, Activity, 
  Zap, ArrowUpRight, Plus, MoreVertical 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const AdminDashboard = () => {
  const socket = useSocket();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      activeCourses: 0,
      pendingReviews: 0,
      totalRevenue: 0,
      completionRate: 0,
      aiEngagement: 0,
      monthlyGrowth: 0
    },
    recentActivity: [],
    growthData: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setDashboardData(res.data);
    } catch (error) {
      console.error('Failed to fetch admin stats');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('admin_stats_updated', (newData) => {
        setDashboardData(prev => ({
          ...prev,
          ...newData
        }));
      });
      return () => {
        socket.off('admin_stats_updated');
      };
    }
  }, [socket]);

  const { stats, recentActivity, growthData } = dashboardData;

  const statCards = [
    { label: 'Active Courses', value: stats.activeCourses, change: '+12%', icon: <BookOpen />, color: 'text-violet-600', bgIcon: 'bg-violet-100' },
    { label: 'Total Students', value: stats.totalStudents, change: '+24%', icon: <Users />, color: 'text-blue-600', bgIcon: 'bg-blue-100' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+18%', icon: <DollarSign />, color: 'text-emerald-600', bgIcon: 'bg-emerald-100' },
    { label: 'Pending Reviews', value: stats.pendingReviews, change: '-3', icon: <Clock />, color: 'text-orange-600', bgIcon: 'bg-orange-100' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, change: '+5%', icon: <FileText />, color: 'text-fuchsia-600', bgIcon: 'bg-fuchsia-100' },
    { label: 'AI Engagement', value: `${stats.aiEngagement}%`, change: '+15%', icon: <Zap />, color: 'text-sky-600', bgIcon: 'bg-sky-100' },
    { label: 'Monthly Growth', value: `${stats.monthlyGrowth}%`, change: '+2.4%', icon: <TrendingUp />, color: 'text-rose-600', bgIcon: 'bg-rose-100' },
    { label: 'Daily Active', value: '1.2K', change: '+8%', icon: <Activity />, color: 'text-slate-600', bgIcon: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans bg-[#f4f2f8] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Admin Command Center 🛡️</h1>
          <p className="text-slate-500 font-medium">Enterprise overview of the SkillStation ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
            Download Reports
          </button>
          <button className="px-6 py-3 bg-violet-600 text-white rounded-xl font-black shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={20} /> New Course
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-4 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bgIcon} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black ${stat.color} bg-slate-50 px-3 py-1 rounded-full border border-slate-100`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{loading ? '...' : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-2 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                <TrendingUp size={22} />
              </div>
              Growth Performance
            </h2>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] flex items-end justify-between gap-2 px-2">
            {(growthData.length ? growthData : [45, 60, 40, 85, 70, 95, 100, 80, 65, 75, 90, 110]).map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className="flex-1 bg-gradient-to-t from-violet-100 to-violet-500 rounded-t-lg relative group cursor-pointer"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {val}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
                <Activity size={22} />
              </div>
              Recent Activity
            </h2>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition duration-300 group border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-xl ${act.color.replace('bg-', 'bg-').replace('-500', '-100')} flex items-center justify-center ${act.color.replace('bg-', 'text-')} shrink-0 group-hover:scale-110 transition-transform`}>
                    <ArrowUpRight size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{act.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{act.status}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 text-sm py-10 font-medium">
                No recent activity found.
              </div>
            )}
          </div>

          <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-black transition border border-slate-200">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
