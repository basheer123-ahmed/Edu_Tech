import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pink-950/40 backdrop-blur-xl border-t-4 border-pink-500/50 shadow-[0_-12px_50px_rgba(236,72,153,0.2)] text-white pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="SkilStation Logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-blue-400">Skil</span><span className="text-orange-400">Station</span>
              </span>
            </Link>
            <p className="text-white/80 leading-relaxed">
              The world's most advanced AI-powered edtech platform. Master high-demand skills and land your dream job.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github, Facebook].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-pink-500 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-white/75 hover:text-orange-400 transition-colors">All Courses</Link></li>
              <li><Link to="/jobs" className="text-white/75 hover:text-orange-400 transition-colors">Job Portal</Link></li>
              <li><Link to="/internships" className="text-white/75 hover:text-orange-400 transition-colors">Internships</Link></li>
              <li><Link to="/leaderboard" className="text-white/75 hover:text-orange-400 transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-white/75 hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-white/75 hover:text-orange-400 transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-white/75 hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-white/75 hover:text-orange-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/75">
                <Mail size={18} className="text-orange-400" /> support@skilstation.com
              </li>
              <li className="flex items-center gap-3 text-white/75">
                <Phone size={18} className="text-orange-400" /> +1 (234) 567-890
              </li>
              <li className="flex items-center gap-3 text-white/75">
                <MapPin size={18} className="text-orange-400" /> Tech City, CA 94043
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/20 mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© 2026 SkilStation. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-orange-400 transition-colors">Cookies</Link>
            <Link to="#" className="hover:text-orange-400 transition-colors">Security</Link>
            <Link to="#" className="hover:text-orange-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
