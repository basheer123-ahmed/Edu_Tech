import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Zap } from 'lucide-react';

const ProductivityInsights = ({ data = [], loading }) => {
  if (loading) return (
    <div className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse shadow-sm" />
  );

  // Mock data for XP progress
  const chartData = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 250 },
    { day: 'Wed', xp: 180 },
    { day: 'Thu', xp: 400 },
    { day: 'Fri', xp: 320 },
    { day: 'Sat', xp: 500 },
    { day: 'Sun', xp: 450 },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" />
            Productivity
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">Weekly XP earning trends</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
          <TrendingUp size={12} className="text-emerald-600" />
          <span className="text-[11px] font-black text-emerald-600">+12%</span>
        </div>
      </div>

      <div className="flex-1 min-h-[160px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="xp" 
              stroke="#10B981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorXp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
            <Award size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-900">Daily Goal</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Reached 5/7</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="p-2 rounded-xl bg-violet-100 text-violet-600">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-900">Total XP</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">12.5k Points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityInsights;
