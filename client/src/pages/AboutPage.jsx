import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Users, 
  Award, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Tv, 
  Cpu, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import founderSathish from '../assets/founder_sathish.png';

const AboutPage = () => {
  const stats = [
    { label: "Active Learners", value: "50k+" },
    { label: "Partner Companies", value: "500+" },
    { label: "Courses Offered", value: "1,200+" },
    { label: "Success Rate", value: "94%" },
  ];

  const whyChooseUs = [
    {
      icon: <Tv size={26} />,
      title: "Recorded Videos",
      desc: "High-definition interactive video lectures prepared by senior engineers to let you learn complex technical concepts at your own comfortable pace."
    },
    {
      icon: <Award size={26} />,
      title: "Top Rated Instructors",
      desc: "Learn directly from top 1% industry experts, software architects, and career coaches dedicated to mentoring your path to success."
    },
    {
      icon: <Cpu size={26} />,
      title: "LMS Access",
      desc: "Enjoy 24/7 unlimited access to our state-of-the-art glassmorphic Learning Management System with integrated secure exam verification tools."
    }
  ];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-gradient-to-br from-[#f472b6] via-[#e879f9] to-[#db2777] min-h-screen">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-pink-300/30 rounded-full blur-[120px] pointer-events-none" />

      {/* -----------------------------------
          SECTION 1 — ABOUT US HERO
         ----------------------------------- */}
      <section className="container mx-auto px-6 mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Founders Profile */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Clean, Simple Circular Profile Avatar */}
              <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-white/40 shadow-2xl bg-white/20 p-1 mb-6 hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/20">
                  <img 
                    src={founderSathish} 
                    alt="Upputuri Sathish" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Title & Badge wrapped in a clean, small white-glass badge */}
              <div className="bg-white/85 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 shadow-xl mt-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Upputuri Sathish</h3>
                <p className="text-xs font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-600 uppercase tracking-widest mt-0.5">
                  SEO & Manager
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Description Area */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-slate-900 text-xs font-black uppercase tracking-[0.3em] mb-3 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block border border-white/30 shadow-sm">
                Sofzenix IT Solutions LLP
              </h4>
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-none mb-6 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)] mt-4">
                Not just learning—<span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400">building real skills.</span>
              </h1>
            </motion.div>

            {/* Description Glass Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/85 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              {/* Floating gradient accent dots */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-pink-400 to-fuchsia-400 rounded-full opacity-10 blur-md pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-10 blur-md pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <p className="text-base md:text-lg text-slate-800 leading-relaxed font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-600 font-extrabold">SkilStation</span> is an edtech platform focused on creating industry-ready professionals through practical, project-based learning. We bridge the gap between theory and real-world application with hands-on training, mentorship, and career-driven programs.
                </p>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff4fa3] to-[#d946ef] font-black">Learn. Build. Get Ready for the Future.</span> SkilStation empowers learners with real-time experience, helping them stand out and succeed in today’s competitive job market.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* -----------------------------------
          STATS TICKER
         ----------------------------------- */}
      <section className="relative z-10 py-16 mb-24 bg-white/85 backdrop-blur-xl border-y border-white/40 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="space-y-1"
              >
                <h3 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-fuchsia-600 to-indigo-600 drop-shadow-sm">
                  {stat.value}
                </h3>
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -----------------------------------
          SECTION 2 — HISTORY & MISSION
         ----------------------------------- */}
      <section className="container mx-auto px-6 mb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - High-fidelity visual mockup wrapper */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              {/* Ambient neon spot */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-pink-100/5 pointer-events-none" />
              
              {/* Skill matrix graphics representation */}
              <div className="h-64 flex flex-col justify-between items-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-white to-pink-100 shadow-lg shadow-pink-500/10 flex items-center justify-center text-pink-600 font-black z-20">
                  <Sparkles size={32} />
                </div>
                
                {/* Connecting glowing pathways */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 rounded z-0 opacity-40 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-48 bg-gradient-to-b from-pink-200 via-pink-100 to-pink-200 rounded z-0 opacity-40 animate-pulse" />

                <div className="flex justify-between w-full relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white shadow-md">
                    <Target size={24} />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white shadow-md">
                    <Eye size={24} />
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white shadow-md relative z-10">
                  <Users size={24} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Mission details */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div className="space-y-4">
              <h4 className="text-slate-900 text-xs font-black uppercase tracking-[0.3em] bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block border border-white/30 shadow-sm">
                Corporate Direction
              </h4>
              <h2 className="text-3.5xl md:text-4.5xl font-black text-slate-950 leading-tight mt-4">
                We Have Helped Millions Of People Worldwide <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400">Unlock Technical Skills</span>
              </h2>
              <p className="text-slate-900 font-extrabold text-sm leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm">
                By providing an elegant and responsive, browser-based coding hub with continuous real-time grading and automated verification checkpoints, we ensure no student is left behind.
              </p>
            </div>

            {/* Our History & Our Mission side-by-side cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Card 1: Our History */}
              <motion.div 
                whileHover={{ y: -6 }}
                className="bg-white/85 backdrop-blur-xl border border-white/40 p-6 rounded-[1.75rem] shadow-2xl relative overflow-hidden group hover:border-white/50 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-t-full" />
                
                <div className="w-12 h-12 bg-pink-100 border border-pink-200 text-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Our History</h3>
                <p className="text-[12px] font-bold text-slate-600 leading-relaxed">
                  Beginning as a vision to democratize technical learning, we have expanded globally, creating seamless educational pathways and state-of-the-art interactive coding platforms for students in every region.
                </p>
              </motion.div>

              {/* Card 2: Our Mission */}
              <motion.div 
                whileHover={{ y: -6 }}
                className="bg-white/85 backdrop-blur-xl border border-white/40 p-6 rounded-[1.75rem] shadow-2xl relative overflow-hidden group hover:border-white/50 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-t-full" />
                
                <div className="w-12 h-12 bg-pink-100 border border-pink-200 text-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Target size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Our Mission</h3>
                <p className="text-[12px] font-bold text-slate-600 leading-relaxed">
                  To provide accessible, high-quality education and career opportunities to every student, regardless of their background, using artificial intelligence to personalize the journey.
                </p>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* -----------------------------------
          SECTION 3 — WHY ACHIEVE ACADEMY
         ----------------------------------- */}
      <section className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-[0.3em] mb-3 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full inline-block border border-white/30 shadow-sm">
            Why SkilStation
          </h4>
          <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)] mt-4">
            Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400">Achieve Academy</span>
          </h2>
          <p className="text-slate-900 font-extrabold max-w-xl mx-auto mt-4 text-sm md:text-base bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm">
            A tech-focused Learning Management System crafted for modern engineers. Let's see what makes us stand out.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUs.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white/85 backdrop-blur-xl border border-white/40 p-8 rounded-[2.25rem] text-left shadow-2xl relative overflow-hidden transition-all duration-350 group"
            >
              {/* Background circular spotlights */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100 rounded-full blur-xl pointer-events-none group-hover:bg-pink-200 opacity-20" />
              
              {/* Glowing Icon Wrapper */}
              <div className="w-14 h-14 bg-pink-100 border border-pink-200 rounded-2xl flex items-center justify-center mb-6 relative">
                <div className="absolute -top-1 -right-1 text-pink-500 w-4 h-4 animate-pulse">
                  <Sparkles size={14} />
                </div>
                <div className="text-pink-600 relative z-10">
                  {item.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-pink-600 transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="text-xs text-slate-600 leading-relaxed font-bold transition-colors duration-300">
                {item.desc}
              </p>

              {/* Bottom Border Accent Indicator */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
