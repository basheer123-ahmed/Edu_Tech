import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Bell, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  ArrowUpRight
} from 'lucide-react';

const InstitutionDashboard = () => {
  const stats = [
    { label: 'Total Enrolled', value: '4,280', change: '+15%', icon: <Users className="text-blue-400" />, color: 'from-blue-600/20 to-blue-900/20' },
    { label: 'Courses Active', value: '32', change: '+2', icon: <BookOpen className="text-violet-400" />, color: 'from-violet-600/20 to-violet-900/20' },
    { label: 'Certificates Issued', value: '1,120', change: '+85', icon: <GraduationCap className="text-emerald-400" />, color: 'from-emerald-600/20 to-emerald-900/20' },
    { label: 'Avg. Attendance', value: '92%', change: '+1.5%', icon: <TrendingUp className="text-fuchsia-400" />, color: 'from-fuchsia-600/20 to-fuchsia-900/20' },
  ];

  const students = [
    { name: 'Sarah Wilson', email: 'sarah.w@student.edu', course: 'Machine Learning', progress: 85, status: 'Active' },
    { name: 'David Miller', email: 'david.m@student.edu', course: 'Frontend Dev', progress: 42, status: 'Active' },
    { name: 'Emily Brown', email: 'emily.b@student.edu', course: 'AI Foundations', progress: 100, status: 'Completed' },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Institution Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Institution Dashboard 🏛️</h1>
          <p className="text-slate-400">Manage your students, courses, and educational performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-600/20 hover:shadow-fuchsia-600/40 hover:-translate-y-1 transition-all flex items-center gap-2">
            <Plus size={20} /> Upload New Course
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${stat.color} border border-white/5 shadow-xl flex flex-col gap-4 group hover:border-white/10 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-900/50 rounded-2xl border border-white/5 text-2xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">{stat.change}</span>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Management */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Users className="text-blue-500" size={22} />
                Student Performance
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" placeholder="Search student..." className="bg-white/5 border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-white transition">View All</button>
              </div>
            </div>
            
            <div className="overflow-x-auto px-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="pb-4">Student</th>
                    <th className="pb-4">Course</th>
                    <th className="pb-4">Progress</th>
                    <th className="pb-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((student, idx) => (
                    <tr key={idx} className="group hover:bg-white/5 transition duration-300">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400 border border-white/5">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">{student.name}</p>
                            <p className="text-[10px] text-slate-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-xs font-bold text-slate-300">{student.course}</span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${student.progress}%` }} className="h-full bg-blue-500" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          student.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Announcements & Quick Actions */}
        <div className="space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 h-full">
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <Bell className="text-fuchsia-500" size={22} />
              Announcements
            </h2>
            
            <div className="space-y-6">
              {[
                { title: 'New Semester Schedule', date: 'Oct 24', color: 'bg-violet-500' },
                { title: 'AI Workshop Registration', date: 'Oct 28', color: 'bg-fuchsia-500' },
                { title: 'Exam Guidelines 2024', date: 'Nov 02', color: 'bg-blue-500' },
              ].map((ann, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition duration-300 border border-transparent hover:border-white/5">
                    <div className={`w-10 h-10 rounded-xl ${ann.color}/10 flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0`}>
                      {ann.date.split(' ')[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1 group-hover:text-fuchsia-400 transition">{ann.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{ann.date}</p>
                    </div>
                    <ArrowUpRight className="ml-auto text-slate-600 group-hover:text-white transition" size={16} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/10">
              <TrendingUp className="text-violet-400 mb-4" size={28} />
              <h4 className="font-black text-white mb-2">Student Engagement</h4>
              <p className="text-xs text-slate-400 mb-6">Engagement is up by 22% this week compared to last month.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black transition">
                Generate Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
