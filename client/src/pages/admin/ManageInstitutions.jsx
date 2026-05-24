import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, X, Mail, Phone, User,
  CheckCircle2, Clock, BookOpen, Search,
  ChevronRight, AlertCircle, Send, Loader2,
  Shield
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [creating, setCreating] = useState(false);
  const [tempPasswordInfo, setTempPasswordInfo] = useState(null);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/institutions');
      setInstitutions(res.data.institutions || []);
    } catch (error) {
      console.error('Failed to fetch institutions:', error);
      toast.error('Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setCreating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/institutions', formData);
      
      if (res.data.emailSent) {
        toast.success(`Institution created! Credentials sent to ${formData.email}`, { duration: 5000 });
      } else {
        // Email failed — show temp password to admin
        setTempPasswordInfo({
          name: formData.name,
          email: formData.email,
          tempPassword: res.data.tempPassword,
        });
        toast.error('Email delivery failed. Please share credentials manually.', { duration: 6000 });
      }

      setFormData({ name: '', email: '', phone: '' });
      setShowModal(false);
      fetchInstitutions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create institution');
    } finally {
      setCreating(false);
    }
  };

  const filtered = institutions.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Manage Institutions 🏛️</h1>
          <p className="text-slate-500 font-medium">Create and manage institution accounts on SkilStation.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-600/20 hover:shadow-fuchsia-600/40 hover:-translate-y-1 transition-all flex items-center gap-2 self-start"
        >
          <Plus size={20} />
          Create Institution
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Institutions', value: institutions.length, icon: <Building2 className="text-violet-500" size={20} />, color: 'from-violet-50 to-violet-100 border-violet-200' },
          { label: 'Active', value: institutions.filter(i => !i.mustResetPassword).length, icon: <CheckCircle2 className="text-emerald-500" size={20} />, color: 'from-emerald-50 to-emerald-100 border-emerald-200' },
          { label: 'Pending Setup', value: institutions.filter(i => i.mustResetPassword).length, icon: <Clock className="text-amber-500" size={20} />, color: 'from-amber-50 to-amber-100 border-amber-200' },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border flex items-center gap-4`}>
            <div className="p-2.5 bg-white rounded-xl shadow-sm">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search institutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
        />
      </div>

      {/* Institutions Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-violet-500" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-600 mb-1">No Institutions Found</h3>
            <p className="text-slate-400 text-sm">
              {searchTerm ? 'Try a different search term.' : 'Create your first institution to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4">Institution</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Courses</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((inst, idx) => (
                  <motion.tr
                    key={inst.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-violet-50/30 transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                          {inst.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{inst.name}</p>
                          {inst.phone && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Phone size={10} /> {inst.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 font-medium">{inst.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-violet-400" />
                        <span className="text-sm font-bold text-slate-700">{inst.courseCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {inst.mustResetPassword ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                          <Clock size={12} /> Pending Setup
                        </span>
                      ) : inst.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                          <Shield size={12} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-400 font-bold">
                        {new Date(inst.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Temp Password Fallback Modal */}
      <AnimatePresence>
        {tempPasswordInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setTempPasswordInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <AlertCircle className="text-amber-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Email Delivery Failed</h3>
                  <p className="text-xs text-slate-400 font-medium">Share these credentials manually</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Institution</p>
                  <p className="text-sm font-bold text-slate-900">{tempPasswordInfo.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-900">{tempPasswordInfo.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporary Password</p>
                  <p className="text-lg font-black text-violet-600 font-mono tracking-wider">{tempPasswordInfo.tempPassword}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(tempPasswordInfo.tempPassword);
                  toast.success('Password copied to clipboard!');
                }}
                className="w-full py-3 bg-violet-600 text-white rounded-2xl font-bold text-sm hover:bg-violet-700 transition-all mb-3"
              >
                Copy Password
              </button>
              <button
                onClick={() => setTempPasswordInfo(null)}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Institution Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-2xl shadow-lg shadow-violet-200">
                    <Building2 className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Create Institution</h3>
                    <p className="text-xs text-slate-400 font-medium">A temporary password will be emailed</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                {/* Institution Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                    Institution Name *
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Stanford University"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                    Email Address *
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@institution.edu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                    Phone <span className="text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100 flex items-start gap-3">
                  <Send className="text-violet-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-violet-700 font-medium leading-relaxed">
                    A temporary password will be auto-generated and emailed to the institution. They'll be prompted to change it on first login.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {creating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Building2 size={18} />
                        Create & Send Credentials
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageInstitutions;
