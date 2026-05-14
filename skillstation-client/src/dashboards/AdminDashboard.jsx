import React from 'react';
import { 
  Users, Building2, Briefcase, BookOpen, 
  TrendingUp, ShieldAlert, BarChart3, Settings 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: "12,450", icon: <Users className="text-blue-500" />, bg: "bg-blue-50", change: "+12%" },
    { label: "Institutions", value: "85", icon: <Building2 className="text-orange-500" />, bg: "bg-orange-50", change: "+5%" },
    { label: "Companies", value: "420", icon: <Briefcase className="text-purple-500" />, bg: "bg-purple-50", change: "+18%" },
    { label: "Active Courses", value: "1,200", icon: <BookOpen className="text-green-500" />, bg: "bg-green-50", change: "+7%" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-28">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-gray-500">Platform-wide overview and management.</p>
        </div>
        <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary transition-colors">
          <Settings size={20} />
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-secondary mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-8 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Recent Platform Activity
          </h2>
          <div className="space-y-6">
            {[
              { type: 'USER', text: 'New student registered: Sarah Williams', time: '2 mins ago' },
              { type: 'COURSE', text: 'New course approved: Quantum Computing 101', time: '15 mins ago' },
              { type: 'COMPANY', text: 'Google posted 3 new internship positions', time: '1 hour ago' },
              { type: 'ALERT', text: 'System update scheduled for tonight at 2 AM', time: '3 hours ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'ALERT' ? 'bg-red-500' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-secondary">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-8 flex items-center gap-2">
            <ShieldAlert size={20} className="text-primary" />
            System Status
          </h2>
          <div className="space-y-8">
            {[
              { label: "API Response Time", value: "45ms", status: "Optimal" },
              { label: "Database Load", value: "12%", status: "Healthy" },
              { label: "Storage Used", value: "64%", status: "Warning" },
              { label: "Active Sockets", value: "4,210", status: "Normal" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">{item.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Optimal' || item.status === 'Healthy' ? 'text-green-600 bg-green-50' : 
                    item.status === 'Warning' ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${
                    item.status === 'Warning' ? 'bg-orange-500' : 'bg-primary'
                  }`} style={{ width: item.value.includes('%') ? item.value : '80%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
