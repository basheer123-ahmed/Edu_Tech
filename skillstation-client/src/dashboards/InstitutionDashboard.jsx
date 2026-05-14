import React from 'react';
import { 
  Users, BookOpen, GraduationCap, Calendar, 
  BarChart2, Plus, Search, MoreVertical 
} from 'lucide-react';
import { motion } from 'framer-motion';

const InstitutionDashboard = () => {
  const stats = [
    { label: "Active Students", value: "2,450", icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Courses", value: "45", icon: <BookOpen size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Graduated", value: "1,120", icon: <GraduationCap size={20} />, color: "text-green-600", bg: "bg-green-50" },
    { label: "Batches", value: "12", icon: <Calendar size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-28">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Institution Dashboard</h1>
          <p className="text-gray-500">Manage your students, courses, and batches.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Create New Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-secondary mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Management Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-secondary">Managed Courses</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: "Full-Stack Web Development", students: 120, status: "Active", rating: 4.8 },
                  { name: "UI/UX Masterclass", students: 85, status: "Draft", rating: 0 },
                  { name: "Python for Data Science", students: 210, status: "Active", rating: 4.9 },
                ].map((course, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-secondary text-sm">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{course.students}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        course.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>{course.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{course.rating || "N/A"}</td>
                    <td className="px-6 py-4"><MoreVertical size={16} className="text-gray-400 cursor-pointer" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-primary" />
            Student Performance
          </h2>
          <div className="space-y-6">
            <div className="flex justify-center py-6">
              {/* Mock Chart Circle */}
              <div className="w-40 h-40 rounded-full border-[12px] border-primary border-t-transparent flex items-center justify-center relative rotate-45">
                <div className="text-center -rotate-45">
                  <p className="text-3xl font-bold text-secondary">78%</p>
                  <p className="text-xs text-gray-400">Avg Score</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-xs text-gray-400 mb-1">Pass Rate</p>
                <p className="text-lg font-bold text-secondary">92%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-xs text-gray-400 mb-1">Dropout</p>
                <p className="text-lg font-bold text-secondary">4%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
