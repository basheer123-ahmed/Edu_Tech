import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Linkedin, Github } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-[#f472b6] via-[#e879f9] to-[#db2777]">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-white/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-pink-100/20 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 relative z-10">
          <h1 className="text-5xl font-black text-slate-950 tracking-tight leading-none mb-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400">Touch</span>
          </h1>
          <p className="text-slate-900 font-extrabold text-sm md:text-base max-w-xl mx-auto bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm inline-block">
            Have questions? We're here to help you navigate your journey with <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-600 font-black">SkilStation</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 relative z-10">
            {/* Card 1: Email */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="flex gap-6 items-center bg-white/85 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="w-14 h-14 bg-pink-100 border border-pink-200 text-pink-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Mail size={26} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Email Us</h3>
                <p className="text-slate-500 font-bold text-xs mb-1">Our team is here to help with any queries.</p>
                <a href="mailto:support@skilstation.com" className="text-pink-600 font-extrabold text-base hover:text-pink-700 transition-colors">support@skilstation.com</a>
              </div>
            </motion.div>

            {/* Card 2: Phone */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="flex gap-6 items-center bg-white/85 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="w-14 h-14 bg-pink-100 border border-pink-200 text-pink-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Phone size={26} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Call Us</h3>
                <p className="text-slate-500 font-bold text-xs mb-1">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+1234567890" className="text-pink-600 font-extrabold text-base hover:text-pink-700 transition-colors">+1 (234) 567-890</a>
              </div>
            </motion.div>

            {/* Card 3: Office */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="flex gap-6 items-center bg-white/85 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="w-14 h-14 bg-pink-100 border border-pink-200 text-pink-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <MapPin size={26} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Our Office</h3>
                <p className="text-slate-500 font-bold text-xs mb-1">Visit us at our headquarters.</p>
                <p className="text-slate-800 font-extrabold text-base">123 Innovation Way, Tech City, CA 94043</p>
              </div>
            </motion.div>

            {/* Social Links */}
            <div className="pt-8 border-t border-white/20">
              <h4 className="text-lg font-black text-slate-950 mb-6 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: <Twitter size={22} />, link: "#" },
                  { icon: <Linkedin size={22} />, link: "#" },
                  { icon: <Github size={22} />, link: "#" },
                  { icon: <MessageSquare size={22} />, link: "#" },
                ].map((social, idx) => (
                  <motion.a 
                    key={idx} 
                    href={social.link} 
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="w-12 h-12 rounded-xl bg-white/85 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-900 hover:text-pink-600 hover:border-white transition-all shadow-md cursor-pointer"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/85 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10"
          >
            {/* Floating gradient accent dots */}
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-pink-400 to-fuchsia-400 rounded-full opacity-10 blur-md pointer-events-none" />
            <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-10 blur-md pointer-events-none" />

            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-pink-600 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John" 
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium shadow-inner" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-pink-600 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium shadow-inner" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-pink-600 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium shadow-inner" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-pink-600 uppercase tracking-wider">Subject</label>
                <select className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all text-slate-800 font-medium shadow-inner cursor-pointer">
                  <option className="bg-white text-slate-800">General Inquiry</option>
                  <option className="bg-white text-slate-800">Course Support</option>
                  <option className="bg-white text-slate-800">Job Opportunities</option>
                  <option className="bg-white text-slate-800">Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-pink-600 uppercase tracking-wider">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Tell us how we can help..." 
                  className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium shadow-inner resize-none"
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 group text-base shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
              >
                Send Message 
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
