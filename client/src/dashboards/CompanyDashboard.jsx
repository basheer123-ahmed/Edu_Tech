import React from 'react';
import { 
  Plus, Search, Briefcase, Users, 
  CheckCircle2, XCircle, MoreHorizontal, ExternalLink 
} from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyDashboard = () => {
  const stats = [
    { label: "Active Jobs", value: "12", icon: <Briefcase size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Applicants", value: "840", icon: <Users size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Shortlisted", value: "64", icon: <CheckCircle2 size={20} />, color: "text-green-600", bg: "bg-green-50" },
    { label: "Rejected", value: "245", icon: <XCircle size={20} />, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen pt-28">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Company Dashboard</h1>
          <p className="text-gray-500">Post jobs and manage your hiring pipeline.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Post a New Job
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
        {/* Applicants List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-secondary">Recent Applicants</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-primary"><Search size={18} /></button>
              <button className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-primary"><MoreHorizontal size={18} /></button>
            </div>
          </div>
          <div className="space-y-0">
            {[
              { name: "John Doe", role: "Frontend Developer", score: 92, date: "Today", avatar: "1" },
              { name: "Alice Smith", role: "UI Designer", score: 88, date: "Yesterday", avatar: "2" },
              { name: "Bob Johnson", role: "Backend Engineer", score: 85, date: "2 days ago", avatar: "3" },
              { name: "Emma Watson", role: "Data Scientist", score: 95, date: "3 days ago", avatar: "4" },
            ].map((app, idx) => (
              <div key={idx} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/100?img=${app.avatar}`} className="w-12 h-12 rounded-full border border-gray-100" alt={app.name} />
                  <div>
                    <h3 className="font-bold text-secondary">{app.name}</h3>
                    <p className="text-xs text-gray-400">{app.role} • Applied {app.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">AI Skill Score</p>
                    <p className="text-lg font-bold text-primary">{app.score}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
                      Shortlist
                    </button>
                    <button className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-secondary">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Pipeline */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-secondary mb-8">Hiring Pipeline</h2>
          <div className="space-y-6">
            {[
              { stage: "Applied", count: 420, color: "bg-blue-500" },
              { stage: "Screening", count: 150, color: "bg-orange-500" },
              { stage: "Interview", count: 45, color: "bg-purple-500" },
              { stage: "Offer", count: 12, color: "bg-green-500" },
            ].map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-secondary">{stage.stage}</span>
                  <span className="text-sm font-medium text-gray-400">{stage.count} candidates</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`${stage.color} h-full transition-all duration-1000`} 
                    style={{ width: `${(stage.count / 420) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-sm font-bold text-gray-400 hover:border-primary/50 hover:text-primary transition-all">
            View Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
