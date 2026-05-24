import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { 
  Sparkles, Rocket, User, Clock, Star, Smartphone, 
  ImageIcon, LayoutGrid, Activity, Zap, Shield, Monitor, 
  CheckCircle2, ChevronRight, GraduationCap, Bot, Code2, 
  Flame, Trophy, BadgeCheck, FileCheck, ArrowRight, Brain, Cpu
} from 'lucide-react';

const LandingPage = () => {
  // Dynamic stats state
  const [stats, setStats] = useState({
    totalStudents: 12500,
    totalCourses: 8,
    totalSubmissions: 8420,
    totalAIExams: 15,
    activeLearners: 980,
    certificationsIssued: 240
  });

  // Leaderboard state
  const [topStudents, setTopStudents] = useState([
    { name: 'Basheer Ahmed', xp: 7520, streak: 18, rank: 'Platinum' },
    { name: 'John Doe', xp: 5200, streak: 12, rank: 'Gold' },
    { name: 'Emily Chen', xp: 4850, streak: 9, rank: 'Gold' },
    { name: 'Sarah Connor', xp: 3900, streak: 7, rank: 'Silver' },
    { name: 'Alex Mercer', xp: 3400, streak: 5, rank: 'Silver' }
  ]);

  // Mockup tab state
  const [activeMockupTab, setActiveMockupTab] = useState('analytics');

  // Load backend statistics
  useEffect(() => {
    fetch('http://localhost:5000/api/public/stats')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch(err => console.log('Error loading landing page stats:', err));

    fetch('http://localhost:5000/api/public/leaderboard')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTopStudents(res.data);
        }
      })
      .catch(err => console.log('Error loading landing page leaderboard:', err));
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const floatingIcons = [
    { icon: <Code2 size={36} />, top: '12%', left: '12%', color: 'text-blue-500/80', delay: 0, glow: 'rgba(59, 130, 246, 0.4)' },
    { icon: <Sparkles size={40} />, top: '8%', left: '55%', color: 'text-pink-500/80', delay: 1, glow: 'rgba(236, 72, 153, 0.4)' },
    { icon: <Bot size={34} />, top: '15%', left: '84%', color: 'text-purple-500/80', delay: 2, glow: 'rgba(168, 85, 247, 0.4)' },
    { icon: <Activity size={32} />, top: '38%', left: '8%', color: 'text-emerald-500/80', delay: 3, glow: 'rgba(16, 185, 129, 0.4)' },
    { icon: <Clock size={32} />, top: '42%', left: '88%', color: 'text-orange-500/80', delay: 4, glow: 'rgba(249, 115, 22, 0.4)' },
    { icon: <Trophy size={34} />, top: '72%', left: '14%', color: 'text-yellow-500/80', delay: 1.5, glow: 'rgba(234, 179, 8, 0.4)' },
    { icon: <Cpu size={32} />, top: '68%', left: '84%', color: 'text-indigo-500/80', delay: 2.5, glow: 'rgba(99, 102, 241, 0.4)' },
    { icon: <Brain size={36} />, top: '84%', left: '48%', color: 'text-fuchsia-500/80', delay: 0.5, glow: 'rgba(217, 70, 239, 0.4)' },
  ];

  return (
    <div className="bg-transparent font-sans selection:bg-pink-100 overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-[95vh] text-center overflow-hidden">
        {/* Cinematic Spotlight Backdrop Behind Hero Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-pink-400/20 to-purple-400/20 blur-[130px] rounded-full pointer-events-none z-0" />
        
        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {floatingIcons.map((item, idx) => (
            <motion.div
              key={idx}
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                y: [0, -35, 0],
                x: [0, 20, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.08, 0.96, 1]
              }}
              transition={{ 
                duration: 9 + idx * 2.5, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: item.delay 
              }}
              className={`absolute ${item.color} pointer-events-none z-0`}
              style={{ 
                top: item.top, 
                left: item.left,
                filter: `drop-shadow(0 0 12px ${item.glow})`
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        <motion.div variants={containerVars} initial="hidden" animate="visible" className="max-w-4xl mx-auto relative z-10">
          <motion.div variants={itemVars} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-violet-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ec4899]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">India's AI-Powered Learning Platform</span>
            </div>
          </motion.div>

          <motion.h1 variants={itemVars} className="relative text-5xl md:text-7xl font-black text-[#1C1236] tracking-tighter leading-[1.05] mb-8 drop-shadow-[0_2px_10px_rgba(28,18,54,0.08)]">
            Discover Learn<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-fuchsia-600 to-indigo-600 drop-shadow-[0_12px_24px_rgba(236,72,153,0.15)]">
              Achieve Success
            </span>
            <motion.div 
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }} 
              transition={{ duration: 5, repeat: Infinity }} 
              className="absolute top-[30%] -left-12 text-pink-500 opacity-80 hidden md:block drop-shadow-[0_0_8px_#ec4899]"
            >
              <Sparkles size={40} />
            </motion.div>
          </motion.h1>

          <motion.p variants={itemVars} className="text-base md:text-lg text-slate-700 mb-10 max-w-xl mx-auto leading-relaxed font-bold opacity-90">
            Our courses dare you to dream bigger, learn smarter, and outperform the ordinary. Join the next generation of industry leaders.
          </motion.p>

          <motion.div variants={itemVars} className="relative inline-block">
            {/* CTA Button with soft shadow bloom and hover glow */}
            <Link to="/register" className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-[2rem] bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 text-white font-black text-lg shadow-[0_10px_35px_rgba(219,39,119,0.35)] hover:shadow-[0_20px_50px_rgba(219,39,119,0.55)] hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-500">
              <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Get Started Free</span>
              <div className="absolute inset-0 rounded-[2rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-[2rem] bg-pink-500/20 animate-ping -z-10" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. DYNAMIC STATS SECTION */}
      <section className="relative z-10 py-16 bg-white/30 backdrop-blur-md border-y border-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { label: 'Total Students', value: stats.totalStudents, suffix: '+' },
              { label: 'Total Courses', value: stats.totalCourses, suffix: '' },
              { label: 'Coding Submissions', value: stats.totalSubmissions, suffix: '+' },
              { label: 'AI Generated Exams', value: stats.totalAIExams, suffix: '' },
              { label: 'Active Learners', value: stats.activeLearners, suffix: '+' },
              { label: 'Certifications Issued', value: stats.certificationsIssued, suffix: '' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-1"
              >
                <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
                  {(() => {
                    const Component = CountUp.default || CountUp;
                    return (
                      <Component 
                        end={stat.value} 
                        duration={2.5} 
                        separator="," 
                        suffix={stat.suffix} 
                        enableScrollSpy={true} 
                        scrollSpyOnce={true} 
                      />
                    );
                  })()}
                </h3>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MARQUEE STRIP */}
      <div className="relative z-10 bg-pink-500 py-4 overflow-hidden border-y border-pink-600 shadow-lg">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase">LEARN WHAT THE INDUSTRY DEMANDS</span>
              <Sparkles className="text-white/50 mx-4" size={14} />
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase">BUILD REAL WORLD SKILLS</span>
              <Sparkles className="text-white/50 mx-4" size={14} />
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase">GET HIRED AT TOP COMPANIES</span>
              <Sparkles className="text-white/50 mx-4" size={14} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. IMPLEMENTED FEATURES SHOWCASE */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Why SkilStation</h4>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6 flex items-center justify-center gap-3">
              Join in on <Sparkles className="text-pink-500" /> Something Big
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              A complete learning ecosystem designed to take you from beginner to job-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'AI Question Generator', 
                desc: 'Generate up to 40 questions per module. Fully supports custom difficulty ranges, custom tags, MCQs, Coding, or both.', 
                icon: <Bot size={26} className="text-fuchsia-500 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500" />,
                badge: 'AI Powered',
                glowColor: 'rgba(217, 70, 239, 0.3)'
              },
              { 
                title: 'Live Coding Workspace', 
                desc: 'Integrated Monaco Editor (same code engine powering VS Code) with multi-language execution and live test cases validator.', 
                icon: <Code2 size={26} className="text-pink-500 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500" />,
                badge: 'Interactive',
                glowColor: 'rgba(236, 72, 153, 0.3)'
              },
              { 
                title: 'AI Proctored Exams', 
                desc: 'Full-screen checking, webcam monitoring, sound level check, and entire screen sharing permission verification.', 
                icon: <Shield size={26} className="text-indigo-500 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500" />,
                badge: 'Proctor-Grade',
                glowColor: 'rgba(99, 102, 241, 0.3)'
              },
              { 
                title: 'Productivity Analytics', 
                desc: 'GitHub-style heatmap contribution tracking, XP growth graphs, streaks counters, and custom skill radar competency charts.', 
                icon: <Activity size={26} className="text-violet-500 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500" />,
                badge: 'Streaks Board',
                glowColor: 'rgba(168, 85, 247, 0.3)'
              },
              { 
                title: 'Smart Roadmaps', 
                desc: 'Unlock module tasks, track lesson milestones, progress step-by-step through core skill checkpoints and unlock coding tasks.', 
                icon: <GraduationCap size={26} className="text-pink-600 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500" />,
                badge: 'Personalized',
                glowColor: 'rgba(219, 39, 119, 0.3)'
              },
              { 
                title: 'Placement Preparation', 
                desc: 'Mock placement preparation dashboard, custom mock tests, real corporate interview simulators, and ATS-profile analyzer.', 
                icon: <Trophy size={26} className="text-amber-500 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500" />,
                badge: 'Job Ready',
                glowColor: 'rgba(245, 158, 11, 0.3)'
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -10 }}
                className="group p-8 md:p-10 rounded-[2.5rem] bg-white/65 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(244,114,182,0.03)] hover:shadow-[0_20px_50px_rgba(244,114,182,0.15)] hover:border-pink-200/50 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Top Corner Glow Blob */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
                
                {/* Accent Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.01] via-transparent to-purple-600/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    {/* Glowing Icon Wrapper */}
                    <div className="w-14 h-14 bg-gradient-to-br from-white/90 to-pink-50/30 border border-pink-100/50 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(236,72,153,0.04)] relative">
                      <div className="absolute inset-0 bg-pink-500/5 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      {feat.icon}
                    </div>

                    {/* Small tag badge */}
                    <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[8px] font-black uppercase tracking-widest rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-4 relative z-10 tracking-tight leading-snug group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-fuchsia-600 transition-all duration-300">
                    {feat.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600/90 leading-relaxed font-bold relative z-10 transition-colors duration-300">
                    {feat.desc}
                  </p>
                </div>

                {/* Bottom Border Accent Indicator */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PLATFORM PREVIEWS / MOCKUPS SECTION */}
      <section className="relative z-10 py-32 px-6 bg-white/20 backdrop-blur-md border-y border-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Inside the Workspace</h4>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6">Real Platform Interface Previews</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Explore the dashboard and anti-cheat modules implemented directly in the app.</p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'analytics', label: '📊 Student Analytics' },
              { id: 'generator', label: '🤖 AI Generator' },
              { id: 'exam', label: '🛡 Secure Exam Mode' },
              { id: 'workspace', label: '💻 Coding Workspace' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveMockupTab(tab.id)}
                className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeMockupTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-xl shadow-pink-500/20 scale-[1.02]'
                    : 'bg-white/60 text-slate-600 hover:bg-white/80 border border-pink-100/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Mockups */}
          <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_rgba(244,114,182,0.1)] relative min-h-[400px] overflow-hidden">
            
            {activeMockupTab === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center font-black text-white text-lg">J</div>
                    <div>
                      <h4 className="text-[#1E1B4B] font-black text-sm">John Doe</h4>
                      <p className="text-[10px] text-slate-500">Student Analytics Dashboard</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[9px] font-black tracking-widest uppercase">Verified Profile</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-pink-100/50 shadow-sm hover:border-pink-300/50 transition-all duration-300">
                    <p className="text-[9px] text-pink-500 font-black uppercase tracking-wider">Employability Rating</p>
                    <p className="text-[#1E1B4B] font-black text-xl mt-1">85%</p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-pink-100/50 shadow-sm hover:border-pink-300/50 transition-all duration-300">
                    <p className="text-[9px] text-pink-500 font-black uppercase tracking-wider">XP Earned</p>
                    <p className="text-[#1E1B4B] font-black text-xl mt-1">3,450 XP</p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-pink-100/50 shadow-sm hover:border-pink-300/50 transition-all duration-300">
                    <p className="text-[9px] text-pink-500 font-black uppercase tracking-wider">Certifications</p>
                    <p className="text-[#1E1B4B] font-black text-xl mt-1">3 Unlocked</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMockupTab === 'generator' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                <div className="border-b border-pink-100 pb-4">
                  <h4 className="text-[#1E1B4B] font-black text-sm">AI Module-based Question Generator</h4>
                  <p className="text-[10px] text-slate-500">Generate up to 40 topic-wise coding challenges</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Module Name</label>
                      <div className="px-4 py-2.5 bg-white/50 border border-pink-100/60 rounded-xl text-xs text-slate-700 font-bold shadow-sm">Java OOP Basics</div>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Topic Tags</label>
                      <div className="flex gap-1.5 mt-1">
                        <span className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-600 text-[8px] font-black rounded">Classes</span>
                        <span className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-600 text-[8px] font-black rounded">Inheritance</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Question Type</label>
                      <div className="px-4 py-2.5 bg-white/50 border border-pink-100/60 rounded-xl text-xs text-slate-700 font-bold shadow-sm">Coding Tasks + MCQs</div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition-all duration-300 hover:-translate-y-0.5">
                      🚀 Generate Questions
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMockupTab === 'exam' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                  <div>
                    <h4 className="text-[#1E1B4B] font-black text-sm">Secure Exam Security Verification</h4>
                    <p className="text-[10px] text-slate-500">Continuous AI verification and proctor check-list</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-pink-50/45 p-4 rounded-2xl border border-pink-100/50 flex flex-col items-center justify-center text-center min-h-[160px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-100/30 via-transparent to-transparent z-10" />
                    <User className="text-pink-500 w-12 h-12 relative z-20 animate-pulse" />
                    <p className="text-xs font-black text-[#1E1B4B] relative z-20 mt-2">Webcam Camera Stream Active</p>
                    <p className="text-[9px] text-emerald-600 font-bold relative z-20 uppercase tracking-widest">Proctoring Connected</p>
                  </div>
                  <div className="space-y-2.5 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Webcam Access</span>
                      <span className="text-emerald-600 font-extrabold">✓ Enabled</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Microphone Sound Level</span>
                      <span className="text-emerald-600 font-extrabold">✓ Connected</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Fullscreen Verification</span>
                      <span className="text-emerald-600 font-extrabold">✓ Secured</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Entire Screen Share</span>
                      <span className="text-emerald-600 font-extrabold">✓ Validated</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMockupTab === 'workspace' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Interactive Coding Lab</span>
                  <span className="px-2.5 py-0.5 bg-pink-50 border border-pink-200 text-pink-600 text-[8px] font-black rounded">Java</span>
                </div>
                <div className="font-mono text-xs bg-pink-50/20 backdrop-blur-md p-4 rounded-2xl border border-pink-100/50 text-slate-700 shadow-inner">
                  <p className="text-slate-400">// Task: Calculate factorial of N recursively</p>
                  <p><span className="text-fuchsia-600 font-bold">public int</span> <span className="text-pink-600 font-bold">factorial</span>(<span className="text-fuchsia-600 font-bold">int</span> n) &#123;</p>
                  <p className="pl-4"><span className="text-fuchsia-600 font-bold">if</span> (n &lt;= 1) <span className="text-fuchsia-600 font-bold">return</span> 1;</p>
                  <p className="pl-4"><span className="text-fuchsia-600 font-bold">return</span> n * factorial(n - 1);</p>
                  <p>&#125;</p>
                </div>
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-2xl border border-pink-100/40 text-[10px] font-bold text-emerald-600 shadow-sm">
                  <span>✓ All test cases passed successfully!</span>
                  <button className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase transition-all duration-300 shadow-md shadow-emerald-500/10">Run Code</button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* 6. PRODUCTIVITY HEATMAP PREVIEW */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_rgba(244,114,182,0.1)] relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Coding Consistency</h4>
          <h2 className="text-3xl md:text-4xl font-black text-[#1E1B4B] mb-6">Productivity Heatmap Preview</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm mb-10">
            Every submission, compilation run, and test-case verification is logged onto your annual progress board. 
            Maintain your daily streak to level up your global rankings.
          </p>

          {/* Calendar boxes */}
          <div className="flex justify-center overflow-x-auto pb-4">
            <div className="flex gap-1.5">
              {[...Array(20)].map((_, col) => (
                <div key={col} className="flex flex-col gap-1.5">
                  {[...Array(7)].map((_, row) => {
                    const activeIndex = col * 7 + row;
                    return (
                      <div 
                        key={row} 
                        className="w-3 h-3 rounded-[3px]" 
                        style={{ 
                          background: activeIndex % 7 === 0 ? '#86198f' : activeIndex % 5 === 0 ? '#db2777' : activeIndex % 3 === 0 ? '#ec4899' : activeIndex % 2 === 0 ? '#f472b6' : '#fce7f3' 
                        }} 
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-500 mt-6">
            <span>Less</span>
            <div className="flex gap-1">
              {['#fce7f3', '#f472b6', '#ec4899', '#db2777', '#86198f'].map(c => (
                <div key={c} className="w-3 h-3 rounded-[3px]" style={{ background: c }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </section>

      {/* 7. LEADERBOARD & GAMIFICATION SECTION */}
      <section className="relative z-10 py-32 px-6 bg-white/20 backdrop-blur-md border-y border-white/40">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Leaderboard</h4>
          <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6">Gamified Skill Rankings</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium mb-12">Level up and earn experience points to unlock badges and rank on the global leaderboard.</p>

          <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_rgba(244,114,182,0.1)] p-8 space-y-4 text-left">
            <div className="flex justify-between items-center text-[10px] font-black text-pink-500 uppercase tracking-widest pb-3 border-b border-pink-100">
              <span>Student Profile</span>
              <div className="flex gap-16">
                <span>Streak</span>
                <span>XP Points</span>
              </div>
            </div>

            <div className="space-y-2">
              {topStudents.map((st, sIdx) => (
                <div key={sIdx} className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-pink-100/50 hover:border-pink-300 shadow-sm transition-all duration-350">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                      sIdx === 0 
                        ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                        : sIdx === 1 
                          ? 'bg-slate-100 text-slate-600 border border-slate-350' 
                          : 'bg-pink-50 text-pink-600 border border-pink-200/50'
                    }`}>
                      {sIdx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-black text-[#1E1B4B]">{st.name}</p>
                      <p className="text-[9px] font-black text-pink-500 uppercase tracking-widest">{st.rank}</p>
                    </div>
                  </div>
                  <div className="flex gap-12 text-xs font-bold text-slate-600">
                    <span className="text-orange-500 font-black">{st.streak} Days</span>
                    <span className="text-[#1E1B4B] font-black">{st.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CERTIFICATIONS SECTION */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Career Acceleration</h4>
          <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6">AI-Verified Industry Certifications</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium mb-16">Get credentials recognized by our global partner network.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Certificate Template Card */}
            <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/80 text-left shadow-[0_20px_50px_rgba(244,114,182,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-10">
                <span className="w-12 h-12 bg-pink-50 border border-pink-200 text-pink-600 rounded-2xl flex items-center justify-center font-black">
                  <BadgeCheck size={28} />
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Certificate ID: SK-8842-X</span>
              </div>
              <h3 className="text-lg font-black text-[#1E1B4B] leading-none">John Doe</h3>
              <p className="text-[10px] text-pink-600 font-black uppercase tracking-widest mt-1">Full-Stack Web Development</p>
              <div className="border-t border-pink-100 my-6 pt-6 flex justify-between items-end">
                <div>
                  <p className="text-[8px] text-slate-400 font-black uppercase">Verified By</p>
                  <p className="text-xs font-black text-[#1E1B4B]">SkilStation AI Academy</p>
                </div>
                <div className="w-10 h-10 bg-white p-1 rounded-lg">
                  {/* Mock QR Code representation */}
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded" />
                </div>
              </div>
            </div>

            {/* Explanatory insights list */}
            <div className="space-y-6 text-left">
              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center shrink-0">
                  <FileCheck size={20} />
                </span>
                <div>
                  <h4 className="text-base font-black text-slate-900">Cryptographically Secured Credentials</h4>
                  <p className="text-sm text-slate-500 font-medium">Verify certificates instantly with custom QR codes mapped directly to student records.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 flex items-center justify-center shrink-0">
                  <Brain size={20} />
                </span>
                <div>
                  <h4 className="text-base font-black text-slate-900">Integrated Employability Analytics</h4>
                  <p className="text-sm text-slate-500 font-medium">Certificates display your skill metrics breakdowns compiled directly from your code submissions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="relative z-10 py-32 px-6 bg-white/20 backdrop-blur-md border-y border-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Testimonials</h4>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6">Student Success Stories</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Hear how SkilStation helped developers land placements at global tech teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                text: "The Monaco workspace environment feels exactly like coding locally. The AI Proctor verification took under 15 seconds to set up, and I got my certificate within minutes of completing my exam.", 
                author: "Basheer Ahmed", 
                role: "Frontend Engineer, TechCorp", 
                emoji: "👨‍💻" 
              },
              { 
                text: "The annual productivity heatmap really motivated me to keep my daily coding streaks going. Tracking my weekly progress charts built consistency that helped me clear placement interviews.", 
                author: "Jessica Mercer", 
                role: "Backend Architect, Google Labs", 
                emoji: "👩‍💻" 
              },
              { 
                text: "Highly recommended for college placements. Having my skill competency radar mapped directly to my certified profile got me shortlisted for recruitment rounds immediately.", 
                author: "Ananya Sen", 
                role: "Software Developer, Microsoft", 
                emoji: "👩‍🎓" 
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <p className="text-sm text-slate-600 leading-relaxed font-bold italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-8">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{t.author}</h4>
                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. COURSES SECTION */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6">Learn From The Best</h2>
              <p className="text-slate-500 max-w-xl font-medium">Hand-picked courses to accelerate your career growth.</p>
            </div>
            <Link to="/courses" className="px-8 py-4 bg-white border border-slate-200 rounded-full font-black text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2">
              Browse All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: 'Front End Web Development', category: 'Web Development', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800' },
              { title: 'Back End Web Development', category: 'Web Development', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800' },
              { title: 'Generative AI', category: 'Artificial Intelligence', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
            ].map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-black rounded-full border border-white/20 uppercase tracking-widest">{course.level}</span>
                    <span className="px-3 py-1 bg-white/50 backdrop-blur-md text-slate-900 text-[9px] font-black rounded-full border border-white/20 uppercase tracking-widest">{course.category}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-pink-500 transition-colors">{course.title}</h3>
                  <div className="flex items-center justify-between mt-8">
                    <span className="text-2xl font-black text-pink-500">Free</span>
                    <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-2xl font-black text-xs hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="relative z-10 py-32 px-6 bg-white/20 backdrop-blur-md border-t border-white/40 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-[#1E1B4B] tracking-tight leading-none">
            🚀 Start Learning with AI Today
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto font-bold text-base md:text-lg">
            Build consistency, pass security verified proctored exams, and unlock certified skills recognized globally.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="px-10 py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-full font-black text-base shadow-[0_10px_30px_rgba(236,72,153,0.3)] flex items-center gap-2 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-1 transition-all">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="px-10 py-4 bg-white border border-slate-200 text-slate-800 rounded-full font-black text-base hover:bg-slate-50 hover:-translate-y-1 transition-all">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 border-t border-slate-100 text-center bg-transparent">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white shadow-xl mx-auto mb-8">
          <Sparkles size={24} />
        </div>
        <p className="text-slate-400 font-bold text-sm tracking-widest">© 2024 SKILSTATION. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Marquee Animation CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
