import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Rocket, 
  User, 
  Clock, 
  HeartPulse, 
  Book, 
  Star, 
  Smartphone, 
  Image as ImageIcon, 
  LayoutGrid,
  Activity,
  Zap,
  Shield,
  Monitor,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Bot
} from 'lucide-react';

const LandingPage = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const floatingIcons = [
    { icon: <User size={40} />, top: '10%', left: '15%', color: 'text-blue-400', delay: 0 },
    { icon: <Star size={44} />, top: '5%', left: '55%', color: 'text-emerald-400', delay: 1 },
    { icon: <Smartphone size={32} />, top: '15%', left: '85%', color: 'text-pink-400', delay: 2 },
    { icon: <LayoutGrid size={36} />, top: '40%', left: '5%', color: 'text-indigo-400', delay: 3 },
    { icon: <Clock size={32} />, top: '45%', left: '90%', color: 'text-orange-400', delay: 4 },
    { icon: <ImageIcon size={36} />, top: '75%', left: '12%', color: 'text-blue-500', delay: 1.5 },
    { icon: <Activity size={32} />, top: '70%', left: '80%', color: 'text-emerald-500', delay: 2.5 },
    { icon: <Star size={32} />, top: '85%', left: '50%', color: 'text-violet-400', delay: 0.5 },
  ];

  const features = [
    { title: 'Expert Curriculum', desc: 'Industry-designed courses built to give you real, job-ready skills from day one.', icon: '🎓', color: 'bg-violet-500' },
    { title: 'AI-Powered Tutor', desc: 'Get instant answers to your tech questions with our built-in AI assistant 24/7.', icon: '🤖', color: 'bg-fuchsia-500' },
    { title: 'Track Your Progress', desc: 'Personal dashboard showing all enrolled courses and your complete learning journey.', icon: '📊', color: 'bg-blue-500' },
    { title: 'Secure Platform', desc: 'Your account protected with industry-standard authentication and encryption.', icon: '🔐', color: 'bg-orange-500' },
    { title: 'Instant Enrollment', desc: 'One click to enroll. Start learning immediately with no waiting periods.', icon: '⚡', color: 'bg-emerald-500' },
    { title: 'Learn Anywhere', desc: 'Fully responsive — learn on desktop or mobile whenever and wherever you want.', icon: '🌍', color: 'bg-sky-500' },
  ];

  const courses = [
    { title: 'Front End Web Development', category: 'Web Development', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800' },
    { title: 'Back End Web Development', category: 'Web Development', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800' },
    { title: 'Generative AI', category: 'Artificial Intelligence', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
    { title: 'Data Science with Python', category: 'Data Science', level: 'BEGINNER', img: 'https://images.unsplash.com/photo-1551288049-bbda38a5f85d?auto=format&fit=crop&q=80&w=800' },
    { title: 'Machine Learning', category: 'Machine Learning', level: 'INTERMEDIATE', img: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800' },
    { title: 'Python Programming', category: 'Programming', level: 'BEGINNER', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="min-h-screen bg-[#ece8f5] font-sans selection:bg-pink-100 overflow-x-hidden relative">
      {/* Cinematic Noise Texture Overlay */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Ambient Vignette Effect */}
      <div className="fixed inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)]" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-[95vh] text-center overflow-hidden">
        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#d4d0e6]/40 via-[#ece8f5]/60 to-[#f1e6f0]/40" />
          
          {/* Layered Radial Glows */}
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-violet-400/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-pink-400/10 blur-[100px] rounded-full" />
          
          {floatingIcons.map((item, idx) => (
            <motion.div
              key={idx}
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                y: [0, -40, 0],
                x: [0, 20, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ duration: 7 + idx, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
              className={`absolute ${item.color} blur-[0.5px] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
              style={{ top: item.top, left: item.left }}
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

          <motion.h1 variants={itemVars} className="relative text-5xl md:text-6xl font-black text-[#1E1B4B] tracking-tighter leading-[1.05] mb-8">
            Discover Learn<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-violet-600 to-indigo-600">
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

          <motion.p variants={itemVars} className="text-base md:text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed font-bold opacity-80">
            Our courses dare you to dream bigger, learn smarter, and outperform the ordinary. Join the next generation of industry leaders.
          </motion.p>

          <motion.div variants={itemVars}>
            <Link to="/register" className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-[1.8rem] bg-gradient-to-r from-pink-600 to-violet-600 text-white font-black text-lg shadow-[0_15px_40px_rgba(236,72,153,0.3)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.5)] hover:-translate-y-1.5 transition-all duration-500">
              <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Get Started Free</span>
              <div className="absolute inset-0 rounded-[1.8rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="relative z-10 py-16 bg-[#F5F3FF]/50 border-y border-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {[
              { label: 'STUDENTS', value: '10K+' },
              { label: 'PARTNERS', value: '200+' },
              { label: 'COURSES', value: '15' },
              { label: 'AI TUTOR', value: 'AI' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-5xl font-black text-pink-500 mb-2">{stat.value}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
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

      {/* 4. FEATURES SECTION */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h4 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Why SkillStation</h4>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6 flex items-center justify-center gap-3">
              Join in on <Sparkles className="text-pink-500" /> Something Big
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              A complete learning ecosystem designed to take you from beginner to job-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[2.5rem] bg-white border border-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="text-4xl mb-8 relative z-10">{feat.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-4 relative z-10">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium relative z-10">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COURSES SECTION */}
      <section className="relative z-10 py-32 px-6 bg-[#FDF2F8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6">Learn From The Best</h2>
              <p className="text-slate-500 max-w-xl font-medium">Hand-picked courses to accelerate your career growth.</p>
            </div>
            <button className="px-8 py-4 bg-white border border-slate-200 rounded-full font-black text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2">
              Browse All <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course, i) => (
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
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white rounded-2xl font-black text-xs hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="relative z-10 py-20 px-6 border-t border-slate-100 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white shadow-xl mx-auto mb-8">
          <Sparkles size={24} />
        </div>
        <p className="text-slate-400 font-bold text-sm tracking-widest">© 2024 SKILLSTATION. ALL RIGHTS RESERVED.</p>
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
