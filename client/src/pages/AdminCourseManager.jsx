import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Video, Image as ImageIcon, Save, CheckCircle,
  FileText, Plus, Trash2, Pencil, Tag, X, Check
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

const AdminCourseManager = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'categories'

  // Category Manager state
  const { categories, addCategory, removeCategory, renameCategory } = useCategories();
  const [newCat, setNewCat] = useState('');
  const [editingCat, setEditingCat] = useState(null); // { name, value }
  const [addError, setAddError] = useState('');

  const handleAddCategory = () => {
    if (!newCat.trim()) return setAddError('Category name cannot be empty.');
    const ok = addCategory(newCat);
    if (ok) { setNewCat(''); setAddError(''); }
    else setAddError('Category already exists.');
  };

  const handleRename = (oldName) => {
    if (!editingCat?.value.trim()) return;
    const ok = renameCategory(oldName, editingCat.value);
    if (ok) setEditingCat(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Course Builder</h1>
          <p className="text-slate-400">Create, manage courses and categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition flex items-center gap-2 border border-white/5">
            <Save size={18} /> Save Draft
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <CheckCircle size={18} /> Publish Course
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'builder', label: 'Course Builder', icon: <FileText size={16} /> },
          { id: 'categories', label: 'Manage Categories', icon: <Tag size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── COURSE BUILDER TAB ── */}
        {activeTab === 'builder' && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {['Basic Info', 'Curriculum', 'Media Upload', 'Settings'].map((s, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 z-10 transition-all cursor-pointer ${
                    step >= idx + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500 border border-white/5'
                  }`} onClick={() => setStep(idx + 1)}>
                    {idx + 1}
                  </div>
                  <span className={`text-sm font-medium ${step >= idx + 1 ? 'text-blue-400' : 'text-slate-500'}`}>{s}</span>
                  {idx < 3 && (
                    <div className="absolute top-5 left-1/2 w-full h-1 bg-slate-800 -z-0">
                      <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: step > idx + 1 ? '100%' : '0%' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
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
                      <textarea rows="5" placeholder="Detailed course overview..." className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {/* CATEGORY DROPDOWN — populated from admin-managed categories */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <Tag size={14} className="text-blue-400" /> Category
                        </label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                          <option value="">— Select Category —</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500">Manage categories in the <button onClick={() => setActiveTab('categories')} className="text-blue-400 hover:underline">"Manage Categories" tab</button>.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Level</label>
                        <select className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer">
                          <option>BEGINNER</option>
                          <option>INTERMEDIATE</option>
                          <option>ADVANCED</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
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
          </motion.div>
        )}

        {/* ── CATEGORY MANAGER TAB ── */}
        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl"
          >
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Tag className="text-blue-400" /> Manage Categories
              </h2>
              <p className="text-slate-400 text-sm mb-8">Add, rename, or remove course categories. These will appear in the category dropdown when creating a course and on the Courses page.</p>

              {/* Add new category */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Add New Category</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCat}
                    onChange={e => { setNewCat(e.target.value); setAddError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                    placeholder="e.g. Robotics & Automation"
                    className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-slate-500"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/20 whitespace-nowrap"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
                {addError && <p className="text-red-400 text-xs mt-2">{addError}</p>}
              </div>

              {/* Category list */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{categories.length} Categories</p>
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center gap-3 bg-slate-800/60 border border-white/5 rounded-xl px-4 py-3 group"
                  >
                    <Tag size={15} className="text-blue-400 flex-shrink-0" />

                    {editingCat?.name === cat ? (
                      <>
                        <input
                          autoFocus
                          value={editingCat.value}
                          onChange={e => setEditingCat({ ...editingCat, value: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRename(cat);
                            if (e.key === 'Escape') setEditingCat(null);
                          }}
                          className="flex-1 bg-slate-900 border border-blue-500 rounded-lg px-3 py-1 text-white text-sm focus:outline-none"
                        />
                        <button onClick={() => handleRename(cat)} className="p-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white transition">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingCat(null)} className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-white font-medium text-sm">{cat}</span>
                        <button
                          onClick={() => setEditingCat({ name: cat, value: cat })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-slate-700 transition opacity-0 group-hover:opacity-100"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => removeCategory(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCourseManager;
