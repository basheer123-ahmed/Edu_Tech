import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Twitter, Linkedin, Github, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary rounded-lg text-white">
                <Rocket size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Skill<span className="text-primary">Station</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              The world's most advanced AI-powered edtech platform. Master high-demand skills and land your dream job.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github, Facebook].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-gray-400 hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link to="/jobs" className="text-gray-400 hover:text-primary transition-colors">Job Portal</Link></li>
              <li><Link to="/internships" className="text-gray-400 hover:text-primary transition-colors">Internships</Link></li>
              <li><Link to="/leaderboard" className="text-gray-400 hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-primary" /> support@skillstation.com
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-primary" /> +1 (234) 567-890
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-primary" /> Tech City, CA 94043
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 SkillStation. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-primary">Cookies</Link>
            <Link to="#" className="hover:text-primary">Security</Link>
            <Link to="#" className="hover:text-primary">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
