import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Briefcase, CheckCircle2, TrendingUp, Building2 } from 'lucide-react';

const DriveAnalytics = ({ data, loading }) => {
  if (loading) return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 animate-pulse h-full shadow-sm">
      <div className="h-5 bg-slate-100 rounded w-1/3 mb-6" />
      <div className="h-40 bg-slate-50 rounded-2xl" />
    </div>
  );

  const { applications = {} } = data || {};
  const statusData = [
    { name: 'Eligible', value: applications?.eligible || 0, color: '#3B82F6' },
    { name: 'Applied', value: applications?.applied || 0, color: '#7c3aed' },
    { name: 'Offered', value: applications?.byStatus?.OFFERED || 0, color: '#10B981' },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 h-full flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Building2 size={14} className="text-blue-500" />
            Drives Analytics
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Placement readiness</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-[11px] font-black text-blue-600">85% Rate</span>
        </div>
      </div>

      <div className="flex-1 min-h-[140px] mb-6 -ml-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#1e293b', fontSize: '11px', fontWeight: 'bold' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Interview Rate</p>
          <div className="flex items-end gap-2">
            <p className="text-lg font-black text-slate-900">72%</p>
            <span className="text-[10px] font-bold text-emerald-600 mb-1">+4%</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Elite Status</p>
          <div className="flex items-end gap-2">
            <p className="text-lg font-black text-slate-900">High</p>
            <div className="flex gap-0.5 mb-1.5">
              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveAnalytics;
