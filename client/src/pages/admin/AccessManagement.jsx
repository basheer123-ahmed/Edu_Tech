import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, X, Mail, Phone, User, Lock,
  CheckCircle2, Clock, Search, Trash2, RotateCcw,
  ChevronRight, AlertCircle, Send, Loader2,
  ShieldAlert, Eye, EyeOff, UserPlus, Ban
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AccessManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('admins');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tempPasswordInfo, setTempPasswordInfo] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/admins');
      setAdmins(res.data.admins || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admin accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Name, email, and temporary password are required');
      return;
    }

    setCreating(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/create-admin', formData);

      if (res.data.emailSent) {
        toast.success(`Admin created! Credentials sent to ${formData.email}`, { duration: 5000 });
      } else {
        setTempPasswordInfo({
          name: formData.name,
          email: formData.email,
          tempPassword: res.data.tempPassword,
        });
        toast.error('Email delivery failed. Share credentials manually.', { duration: 6000 });
      }

      setFormData({ name: '', email: '', password: '', phone: '' });
      setShowCreateModal(false);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (admin) => {
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/admins/${admin.id}`);
      toast.success(`Admin "${admin.name}" deleted`);
      setShowDeleteModal(null);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (admin) => {
    if (!resetPassword || resetPassword.length < 6) {
      toast.error('Temporary password must be at least 6 characters');
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/admin/admins/${admin.id}/reset-password`, {
        newTempPassword: resetPassword,
      });
      toast.success(`Password reset for "${admin.name}"`);
      setShowResetModal(null);
      setResetPassword('');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (admin) => {
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/admin/admins/${admin.id}/suspend`);
      toast.success(`Admin "${admin.name}" suspended`);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to suspend admin');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Access Management 🛡️</h1>
          <p className="text-slate-500 font-medium">Create and manage admin accounts on SkilStation.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 hover:-translate-y-1 transition-all flex items-center gap-2 self-start"
        >
          <UserPlus size={20} />
          Create Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Admins', value: admins.length, icon: <Shield className="text-pink-500" size={20} />, color: 'from-pink-50 to-fuchsia-50 border-pink-200' },
          { label: 'Active', value: admins.filter(a => a.status === 'ACTIVE').length, icon: <CheckCircle2 className="text-emerald-500" size={20} />, color: 'from-emerald-50 to-emerald-100 border-emerald-200' },
          { label: 'Pending Setup', value: admins.filter(a => a.status === 'PENDING_SETUP').length, icon: <Clock className="text-amber-500" size={20} />, color: 'from-amber-50 to-amber-100 border-amber-200' },
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
          placeholder="Search admins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
        />
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-pink-500" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-600 mb-1">No Admins Found</h3>
            <p className="text-slate-400 text-sm">
              {searchTerm ? 'Try a different search term.' : 'Create your first admin to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((admin, idx) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-pink-50/30 transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-fuchsia-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{admin.name}</p>
                          {admin.phone && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Phone size={10} /> {admin.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 font-medium">{admin.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      {admin.status === 'PENDING_SETUP' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                          <Clock size={12} /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-400 font-bold">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-slate-400 font-bold">
                        {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSuspend(admin)}
                          title="Suspend"
                          className="p-2 rounded-xl text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all"
                        >
                          <Ban size={16} />
                        </button>
                        <button
                          onClick={() => { setShowResetModal(admin); setResetPassword(''); }}
                          title="Reset Password"
                          className="p-2 rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(admin)}
                          title="Delete"
                          className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ───── CREATE ADMIN MODAL ───── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-pink-600 to-fuchsia-500 rounded-2xl shadow-lg shadow-pink-200">
                    <ShieldAlert className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Create Admin</h3>
                    <p className="text-xs text-slate-400 font-medium">Grant admin access to SkilStation</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Address *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input type="email" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Temporary Password */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Temporary Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="e.g. ADMIN@123"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Phone <span className="text-slate-400">(Optional)</span></label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                    <input type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100 flex items-start gap-3">
                  <Send className="text-pink-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-pink-700 font-medium leading-relaxed">
                    Credentials will be emailed automatically. The new admin must change their password on first login.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating}
                    className="flex-1 py-3.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {creating ? <Loader2 className="animate-spin" size={18} /> : <><ShieldAlert size={18} /> Create & Send</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── RESET PASSWORD MODAL ───── */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowResetModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <h3 className="text-xl font-black text-slate-900 mb-2">Reset Password</h3>
              <p className="text-sm text-slate-500 mb-6">Set a new temporary password for <strong>{showResetModal.name}</strong>.</p>

              <div className="relative group mb-6">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input type="text" value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="New temporary password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all focus:bg-white"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowResetModal(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={() => handleResetPassword(showResetModal)} disabled={actionLoading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <><RotateCcw size={16} /> Reset</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── DELETE CONFIRM MODAL ───── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-50 rounded-2xl"><Trash2 className="text-rose-500" size={24} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Delete Admin</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to permanently delete <strong>{showDeleteModal.name}</strong> ({showDeleteModal.email})?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={() => handleDelete(showDeleteModal)} disabled={actionLoading}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <><Trash2 size={16} /> Delete</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── TEMP PASSWORD FALLBACK MODAL ───── */}
      <AnimatePresence>
        {tempPasswordInfo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setTempPasswordInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-50 rounded-2xl"><AlertCircle className="text-amber-500" size={24} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Email Failed</h3>
                  <p className="text-xs text-slate-400">Share credentials manually</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Admin</p>
                  <p className="text-sm font-bold text-slate-900">{tempPasswordInfo.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-900">{tempPasswordInfo.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temporary Password</p>
                  <p className="text-lg font-black text-pink-600 font-mono tracking-wider">{tempPasswordInfo.tempPassword}</p>
                </div>
              </div>

              <button onClick={() => { navigator.clipboard.writeText(tempPasswordInfo.tempPassword); toast.success('Copied!'); }}
                className="w-full py-3 bg-pink-600 text-white rounded-2xl font-bold text-sm hover:bg-pink-700 transition-all mb-3">
                Copy Password
              </button>
              <button onClick={() => setTempPasswordInfo(null)}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessManagement;
