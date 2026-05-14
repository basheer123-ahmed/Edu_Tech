import React from 'react';
import { 
  BookOpen, Briefcase, Award, TrendingUp, 
  CheckCircle, Clock, ExternalLink 
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const stats = [
    { label: "Enrolled Courses", value: "4", icon: <BookOpen className="text-blue-500" />, bg: "bg-blue-50" },
    { label: "Skill Score", value: "85", icon: <TrendingUp className="text-orange-500" />, bg: "bg-orange-50" },
    { label: "Applications", value: "12", icon: <Briefcase className="text-purple-500" />, bg: "bg-purple-50" },
    { label: "Certificates", value: "3", icon: <Award className="text-green-500" />, bg: "bg-green-50" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-secondary">Student Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your learning progress.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-secondary">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              Active Courses
            </h2>
            <div className="space-y-4">
              {[
                { title: "Full-Stack Web Development", progress: 65, instructor: "John Doe" },
                { title: "AI & Machine Learning Essentials", progress: 30, instructor: "Sarah Smith" },
              ].map((course, idx) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-secondary">{course.title}</h3>
                    <span className="text-xs font-bold text-primary">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Instructor: {course.instructor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Recommended Jobs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Frontend Developer", company: "Google", location: "Remote", salary: "$120k" },
                { title: "UI/UX Designer", company: "Adobe", location: "Bangalore", salary: "$80k" },
              ].map((job, idx) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:border-primary/50 transition-all cursor-pointer">
                  <h3 className="font-bold text-secondary">{job.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{job.company} • {job.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">{job.salary}</span>
                    <button className="text-xs font-bold text-secondary flex items-center gap-1 hover:text-primary">
                      Apply Now <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skill Score Card */}
          <div className="bg-secondary p-6 rounded-2xl text-white shadow-xl overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <h2 className="text-xl font-bold mb-2">Skill Score</h2>
            <p className="text-gray-400 text-sm mb-6">Your technical readiness score</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-bold text-primary">85</div>
              <div className="text-sm">
                <p className="text-green-400 flex items-center gap-1">
                  <TrendingUp size={14} /> +5.2%
                </p>
                <p className="text-gray-400">vs last month</p>
              </div>
            </div>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold text-sm">
              View Detailed Analytics
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <Award size={18} className="text-primary" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              {[
                { title: "HTML/CSS Certified", date: "2 days ago" },
                { title: "Top 5% in AI Quiz", date: "1 week ago" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
