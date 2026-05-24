import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Linkedin, Github } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-bold text-secondary mb-6">Get in <span className="text-primary">Touch</span></h1>
          <p className="text-xl text-gray-500">Have questions? We're here to help you navigate your journey with SkilStation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Email Us</h3>
                <p className="text-gray-500 mb-2">Our team is here to help with any queries.</p>
                <a href="mailto:support@skilstation.com" className="text-primary font-bold text-lg hover:underline">support@skilstation.com</a>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Call Us</h3>
                <p className="text-gray-500 mb-2">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+1234567890" className="text-secondary font-bold text-lg hover:text-primary transition-colors">+1 (234) 567-890</a>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Our Office</h3>
                <p className="text-gray-500 mb-2">Visit us at our headquarters.</p>
                <p className="text-secondary font-bold text-lg">123 Innovation Way, Tech City, CA 94043</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="text-lg font-bold text-secondary mb-6">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: <Twitter size={24} />, link: "#" },
                  { icon: <Linkedin size={24} />, link: "#" },
                  { icon: <Github size={24} />, link: "#" },
                  { icon: <MessageSquare size={24} />, link: "#" },
                ].map((social, idx) => (
                  <a key={idx} href={social.link} className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">First Name</label>
                  <input type="text" placeholder="John" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Email</label>
                <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Subject</label>
                <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary transition-all">
                  <option>General Inquiry</option>
                  <option>Course Support</option>
                  <option>Job Opportunities</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Message</label>
                <textarea rows="4" placeholder="Tell us how we can help..." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary transition-all resize-none"></textarea>
              </div>

              <button className="w-full btn-primary py-4 flex items-center justify-center gap-2 group text-lg">
                Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
