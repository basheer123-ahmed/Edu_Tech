import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Book, Award, Link as LinkIcon, Camera, Edit2, MapPin, Mail, Phone, Calendar } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'academic', label: 'Academic & Skills', icon: <Book size={18} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={18} /> },
    { id: 'social', label: 'Social Links', icon: <LinkIcon size={18} /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
        <div className="h-48 bg-gradient-to-r from-purple-600/40 via-blue-600/40 to-cyan-500/40 relative">
          <button className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition">
            <Camera size={18} />
          </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-1">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-4xl font-bold text-white">
                    JS
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-lg text-white shadow-lg hover:bg-blue-500 transition">
                  <Camera size={14} />
                </button>
              </div>
              
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-white">John Student</h1>
                <p className="text-slate-400">Computer Science Undergraduate • UI/UX Enthusiast</p>
              </div>
            </div>
            
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition flex items-center gap-2">
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mt-4">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Completion</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Profile Health</span>
              <span className="text-green-400 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 min-h-[400px]"
          >
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><Mail size={14}/> Email Address</label>
                    <input type="email" disabled value="john.student@example.com" className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><Phone size={14}/> Phone Number</label>
                    <input type="text" placeholder="+1 (555) 000-0000" className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><MapPin size={14}/> Location</label>
                    <input type="text" placeholder="San Francisco, CA" className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><Calendar size={14}/> Date of Birth</label>
                    <input type="date" className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-slate-400">Bio</label>
                    <textarea rows="4" placeholder="Tell us about yourself..." className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"></textarea>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition shadow-lg shadow-blue-500/20">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Academic & Skills</h2>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-800/30 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">Core Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Python', 'Machine Learning', 'TailwindCSS'].map(skill => (
                        <span key={skill} className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                          {skill}
                        </span>
                      ))}
                      <button className="px-4 py-2 rounded-lg border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition">
                        + Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab === 'certificates' || activeTab === 'social') && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Award size={48} className="mb-4 opacity-50" />
                <p>Module integration restored. Content loading...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
