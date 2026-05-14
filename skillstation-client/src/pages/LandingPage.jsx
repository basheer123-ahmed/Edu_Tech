import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Rocket, BookOpen, Briefcase, Award, 
  BarChart2, Users, Bell, Globe, Zap, ArrowRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold mb-6">
                <Zap size={16} />
                <span>AI-Powered Learning Platform</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-secondary mb-6 leading-tight">
                Discover Learn <br />
                <span className="text-primary">Achieve Success</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                The world's most advanced AI-powered edtech platform. Master skills, 
                get certified, and land your dream job with personalized learning paths.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/register" className="btn-primary py-4 px-10 text-lg flex items-center gap-2 group">
                  Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/courses" className="btn-outline py-4 px-10 text-lg">
                  Explore Courses
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white" alt="user" />
                  ))}
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold border-4 border-white">
                    +10k
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex text-yellow-400 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm font-medium text-gray-500">Trusted by 50,000+ students</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                  alt="Dashboard Preview" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating Shapes */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Skill Score</p>
                    <p className="text-lg font-bold">92/100</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jobs Applied</p>
                    <p className="text-lg font-bold">12 Active</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-4 font-bold">Enterprise-Ready Features</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">
            SkillStation provides everything you need to manage your education and career in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Rocket size={24} />, title: "AI Learning Platform", desc: "Personalized learning paths powered by AI." },
              { icon: <BookOpen size={24} />, title: "LMS System", desc: "Comprehensive course management for institutions." },
              { icon: <Briefcase size={24} />, title: "Internship Automation", desc: "Automated internship matching and workflows." },
              { icon: <BarChart2 size={24} />, title: "AI Skill Score", desc: "Real-time analytics of your technical proficiency." },
              { icon: <Globe size={24} />, title: "Job Portal", desc: "Connect with top companies worldwide." },
              { icon: <Award size={24} />, title: "Certificate System", desc: "Blockchain-verified certificates for every course." },
              { icon: <Users size={24} />, title: "Institution Management", desc: "Manage students, batches, and curricula." },
              { icon: <Bell size={24} />, title: "Real-time Notifications", desc: "Stay updated with instant push notifications." },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="card-premium text-left group"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <h2 className="text-4xl font-bold text-secondary mb-4">Top Categories</h2>
              <p className="text-gray-500 max-w-md">Explore our most popular subjects and start learning today.</p>
            </div>
            <Link to="/courses" className="btn-outline">View All Categories</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "Web Development", "AI & ML", "Data Science", 
              "Cyber Security", "Cloud Computing", "UI/UX Design"
            ].map((cat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white border border-gray-100 rounded-2xl text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket size={20} />
                </div>
                <p className="font-bold text-secondary text-sm">{cat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl bg-secondary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Stay updated with SkillStation</h2>
            <p className="text-gray-400 mb-10">Join 50,000+ learners and get the latest news about courses, jobs, and features.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white outline-none focus:border-primary transition-all"
              />
              <button className="btn-primary py-4 px-10">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
