import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, Image as ImageIcon, Save, CheckCircle, Plus, FileText, Settings, LayoutGrid } from 'lucide-react';

const AdminCourseManager = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Builder</h1>
          <p className="text-slate-400">Create, upload, and publish your AI EdTech content.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition flex items-center gap-2 border border-white/5">
            <Save size={18} /> Save Draft
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <CheckCircle size={18} /> Publish Course
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Basic Info', 'Curriculum', 'Media Upload', 'Settings'].map((s, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 z-10 transition-all ${
              step >= idx + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500 border border-white/5'
            }`}>
              {idx + 1}
            </div>
            <span className={`text-sm font-medium ${step >= idx + 1 ? 'text-blue-400' : 'text-slate-500'}`}>{s}</span>
            {idx < 3 && (
              <div className="absolute top-5 left-1/2 w-full h-1 bg-slate-800 -z-0">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: step > idx + 1 ? '100%' : '0%' }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main Builder Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="text-blue-500" /> Course Metadata
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Course Title</label>
                <input type="text" placeholder="e.g. Advanced AI & Machine Learning" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea rows="5" placeholder="Detailed course overview..." className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition">
                    <option>Artificial Intelligence</option>
                    <option>Web Development</option>
                    <option>Data Science</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Price ($)</label>
                  <input type="number" placeholder="49.99" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Media Upload Area */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-purple-400" /> Course Thumbnail
            </h2>
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-950/30 group">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload size={24} className="text-slate-400 group-hover:text-blue-400" />
              </div>
              <p className="text-slate-300 font-medium mb-1">Drag & drop image here</p>
              <p className="text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Video size={18} className="text-pink-400" /> Intro Video
            </h2>
            <div className="border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-950/30 group">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Video size={24} className="text-slate-400 group-hover:text-pink-400" />
              </div>
              <p className="text-slate-300 font-medium mb-1">Upload promo video</p>
              <p className="text-xs text-slate-500">Supports MP4, WebM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseManager;
