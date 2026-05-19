import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Users, Trash2, Eye, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

const ExamMonitoring = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const socket = useSocket();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/assignments/admin/proctor/logs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLogs(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load proctoring violation logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Socket realtime event handler
  useEffect(() => {
    if (socket) {
      const handleRealtimeViolation = (newViolation) => {
        setLogs(prev => [newViolation, ...prev]);
        toast.error(`⚠️ Proctor Alert: ${newViolation.studentName} triggered violation: ${newViolation.type}`, {
          duration: 5000,
          position: 'top-right'
        });
      };

      socket.on('proctor:violation', handleRealtimeViolation);
      return () => {
        socket.off('proctor:violation', handleRealtimeViolation);
      };
    }
  }, [socket]);

  const getSeverityBadge = (sev) => {
    if (sev === 'CRITICAL' || sev === 'HIGH') return 'bg-rose-50 border-rose-100 text-rose-600';
    if (sev === 'MEDIUM') return 'bg-amber-50 border-amber-100 text-amber-600';
    return 'bg-blue-50 border-blue-100 text-blue-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="animate-spin text-pink-600" size={32} />
        <span className="text-slate-500 font-bold">Connecting Real-time Proctor stream...</span>
      </div>
    );
  }

  const criticalCount = logs.filter(l => l.severity === 'HIGH' || l.severity === 'CRITICAL').length;

  return (
    <div className="space-y-8 pb-12 font-sans bg-[#f4f2f8] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-2">
          <ShieldAlert className="text-pink-600 animate-pulse" /> AI Proctoring Control Center
        </h1>
        <p className="text-slate-500 font-bold">Monitor exam sessions, view student camera feeds and inspect real-time anti-cheat logs.</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Violations</p>
            <p className="text-2xl font-black text-slate-900">{logs.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Critical/High Risks</p>
            <p className="text-2xl font-black text-slate-900">{criticalCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Listeners</p>
            <p className="text-2xl font-black text-slate-900">Connected</p>
          </div>
        </div>
      </div>

      {/* Violation Feed Stream */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 border-b pb-4 mb-4">Realtime Audit Logs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Violation Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Severity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-sm text-slate-800">{log.studentName || 'Student'}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-500 font-bold">{log.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Eye size={12} /> Inspect Feed
                    </button>
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center font-bold text-slate-400 py-12">
                    No violation flags recorded yet. Monitor active exam sessions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Preview modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-2xl max-w-md w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-black text-slate-800 text-base">{selectedLog.studentName}'s Feed Snapshot</h3>
                <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getSeverityBadge(selectedLog.severity)}`}>
                  {selectedLog.severity}
                </span>
              </div>

              {selectedLog.metadata?.snapshot ? (
                <div className="w-full h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                  <img src={selectedLog.metadata.snapshot} alt="Webcam snapshot Feed" className="w-full h-full object-cover scale-x-[-1]" />
                </div>
              ) : (
                <div className="w-full h-56 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-center text-slate-400 font-bold gap-2">
                  <ShieldCheck size={36} className="text-slate-300" />
                  <p className="text-xs">No camera snapshot saved for this violation type.</p>
                </div>
              )}

              <div className="text-xs space-y-1.5 font-bold text-slate-500">
                <p><span className="text-slate-400 uppercase tracking-widest text-[9px]">Type:</span> {selectedLog.type}</p>
                <p><span className="text-slate-400 uppercase tracking-widest text-[9px]">Timestamp:</span> {new Date(selectedLog.timestamp).toLocaleString()}</p>
                <p><span className="text-slate-400 uppercase tracking-widest text-[9px]">Metadata:</span> {JSON.stringify(selectedLog.metadata || {})}</p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  Close Inspect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamMonitoring;
