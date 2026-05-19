import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Award, Trophy, Zap, Calendar, Flame, Target, BookOpen, 
  Code2, Brain, Github, Linkedin, CheckCircle2, ChevronRight, BarChart2, 
  Layers, MapPin, Briefcase, GraduationCap, Loader2, Sparkles, Check 
} from 'lucide-react';
import { format, getDay, eachDayOfInterval } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useStudentData } from '../../hooks/useStudentData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SubmissionColorMap = {
  0: '#1e293b', // slate-800 (empty)
  1: '#4a154b', // low activity (deep purple)
  2: '#800080', // medium activity (purple)
  3: '#c13584', // high activity (magenta)
  4: '#e1306c', // extreme activity (pink)
};

const getSubmissionColor = (count) => {
  if (!count) return SubmissionColorMap[0];
  if (count <= 1) return SubmissionColorMap[1];
  if (count <= 3) return SubmissionColorMap[2];
  if (count <= 5) return SubmissionColorMap[3];
  return SubmissionColorMap[4];
};

const StudentAnalytics = () => {
  const { user } = useAuth();
  const { dashboard, progress, leaderboard, streak, skills, loading, refetch } = useStudentData();

  // Simulated integration connections
  const [gitHubConnected, setGitHubConnected] = useState(false);
  const [gitHubLoading, setGitHubLoading] = useState(false);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);

  // Active section view
  const [activeTab, setActiveTab] = useState('overview');

  // Heatmap days calculation
  const weeks = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);
    while (getDay(start) !== 0) start.setDate(start.getDate() - 1);
    
    const days = eachDayOfInterval({ start, end: today });
    const weekGroups = [];
    let week = [];
    for (const day of days) {
      week.push(day);
      if (getDay(day) === 6) {
        weekGroups.push(week);
        week = [];
      }
    }
    if (week.length) weekGroups.push(week);
    return weekGroups;
  }, []);

  const handleConnectGitHub = () => {
    setGitHubLoading(true);
    setTimeout(() => {
      setGitHubConnected(true);
      setGitHubLoading(false);
      toast.success('Successfully integrated GitHub profile & synced repositories.');
    }, 1500);
  };

  const handleConnectLinkedIn = () => {
    setLinkedInLoading(true);
    setTimeout(() => {
      setLinkedInConnected(true);
      setLinkedInLoading(false);
      toast.success('Successfully linked LinkedIn learning path & skill endorsements.');
    }, 1500);
  };

  // Mock charts datasets
  const submissionsData = [
    { name: 'Mon', count: 3 },
    { name: 'Tue', count: 5 },
    { name: 'Wed', count: 2 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 4 },
    { name: 'Sat', count: 1 },
    { name: 'Sun', count: 6 },
  ];

  const monthlyConsistencyData = [
    { name: 'Jan', tasks: 12 },
    { name: 'Feb', tasks: 18 },
    { name: 'Mar', tasks: 25 },
    { name: 'Apr', tasks: 30 },
    { name: 'May', tasks: 45 },
    { name: 'Jun', tasks: 38 },
  ];

  const skillRadarData = [
    { subject: 'Frontend', A: 85, fullMark: 100 },
    { subject: 'Backend', A: 65, fullMark: 100 },
    { subject: 'DSA', A: 50, fullMark: 100 },
    { subject: 'Database', A: 70, fullMark: 100 },
    { subject: 'System Design', A: 40, fullMark: 100 },
    { subject: 'Testing', A: 60, fullMark: 100 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="text-slate-400 font-bold">Synchronizing developer analytics profile...</p>
      </div>
    );
  }

  const { student, stats } = dashboard || { student: {}, stats: {} };
  const currentXP = student?.xp || 0;
  const levelXPThreshold = 5000;
  const levelProgressPercentage = Math.min(100, Math.round((currentXP % levelXPThreshold) / levelXPThreshold * 100));

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-20 space-y-10 relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Profile Header */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-900/30">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-pink-600 border-4 border-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
              Lvl {Math.floor(currentXP / levelXPThreshold) + 1}
            </div>
          </div>
          
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-black text-white leading-none">{user?.name}</h1>
            <p className="text-slate-400 font-bold text-xs">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                <Trophy size={10} /> Rank #{leaderboard?.myRank || 'Novice'}
              </span>
              {gitHubConnected && (
                <span className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Github size={10} /> GitHub Sync
                </span>
              )}
              {linkedInConnected && (
                <span className="px-3 py-1 bg-blue-950/40 border border-blue-900/45 text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Linkedin size={10} /> LinkedIn Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sync panel actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!gitHubConnected ? (
            <button 
              onClick={handleConnectGitHub}
              disabled={gitHubLoading}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-xl font-black text-xs transition flex items-center gap-2 border border-neutral-700"
            >
              {gitHubLoading ? <Loader2 size={14} className="animate-spin" /> : <Github size={14} />} Connect GitHub
            </button>
          ) : (
            <span className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-xs flex items-center gap-2">
              <Check size={14} /> GitHub Active
            </span>
          )}

          {!linkedInConnected ? (
            <button 
              onClick={handleConnectLinkedIn}
              disabled={linkedInLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-black text-xs transition flex items-center gap-2 shadow-lg shadow-blue-900/25"
            >
              {linkedInLoading ? <Loader2 size={14} className="animate-spin" /> : <Linkedin size={14} />} Link LinkedIn
            </button>
          ) : (
            <span className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-xs flex items-center gap-2">
              <Check size={14} /> LinkedIn Synced
            </span>
          )}
        </div>
      </div>

      {/* Redesigned Key Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
        
        {/* XP Points with circular SVG ring */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] flex flex-col justify-between items-center text-center shadow-xl space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
              <circle cx="40" cy="40" r="32" stroke="#ec4899" strokeWidth="6" fill="transparent"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={2 * Math.PI * 32 * (1 - levelProgressPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-black text-white">{levelProgressPercentage}%</span>
              <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Next Lvl</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{currentXP.toLocaleString()} XP</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Level 3 Developer</p>
          </div>
        </div>

        {/* Employability circular gauge score */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{stats?.employabilityScore || 0}%</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Employability Score</p>
            </div>
            <Brain size={24} className="text-pink-500 animate-pulse" />
          </div>
          <div className="space-y-2 border-t border-slate-800/60 pt-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                <span>Frontend</span>
                <span>70%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500" style={{ width: '70%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                <span>Backend</span>
                <span>40%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '40%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                <span>DSA</span>
                <span>20%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Streak with Fire Animation */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <Flame size={24} className="animate-bounce" />
            </div>
            <div className="text-right">
              <h3 className="text-xl font-black text-orange-500">{student?.streak || 0} Days</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Streak Count</p>
            </div>
          </div>
          <div className="bg-slate-950/45 p-3 rounded-2xl border border-slate-850 flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400">Longest Streak:</span>
            <span className="text-orange-400 font-black">{streak?.longestStreak || 0} Days</span>
          </div>
        </div>

        {/* Global Rank Medal Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl flex items-center justify-center">
              <Trophy size={22} className="animate-pulse" />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-black text-white">{student?.rank || 'Novice'}</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rank Tier</p>
            </div>
          </div>
          <div className="bg-slate-950/45 p-3 rounded-2xl border border-slate-850 flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400">Percentile:</span>
            <span className="text-yellow-500 font-black">Top 3.4%</span>
          </div>
        </div>

        {/* Skills acquirement Chips */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <h3 className="text-lg font-black text-white">{skills?.length || 0} Technologies</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skill Milestones</p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {['HTML', 'CSS', 'JavaScript', 'React', 'Java'].map((skill, sIdx) => (
              <span key={sIdx} className="px-2 py-0.5 bg-pink-900/15 border border-pink-950 text-pink-400 text-[8px] font-black uppercase tracking-wider rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* GitHub & LinkedIn Sync Integrations panel details */}
      {(gitHubConnected || linkedInConnected) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* GitHub Connected Details View */}
          <AnimatePresence>
            {gitHubConnected && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl flex flex-col gap-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-2xl">
                      <Github size={20} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">GitHub Dev Profile Sync</h3>
                      <p className="text-[10px] text-slate-400 font-bold">Synchronized contributions and repository metrics</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black tracking-widest uppercase">
                    Synced
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Repositories</p>
                    <p className="text-white font-black text-lg">24</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Contributions</p>
                    <p className="text-white font-black text-lg">438</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Active Streak</p>
                    <p className="text-white font-black text-lg">12 Days</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Top Languages</p>
                    <p className="text-white font-black text-[10px] uppercase truncate">JS, React, HTML</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LinkedIn Connected Details View */}
          <AnimatePresence>
            {linkedInConnected && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl flex flex-col gap-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-blue-900/20 border border-blue-900/35 text-blue-400 rounded-2xl">
                      <Linkedin size={20} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">LinkedIn Sync Active</h3>
                      <p className="text-[10px] text-slate-400 font-bold">Synchronized achievements & certification paths</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black tracking-widest uppercase">
                    Linked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Endorsed Skills</p>
                    <p className="text-white font-black text-xs">React, Frontend, State Management</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Linked Certifications</p>
                    <p className="text-white font-black text-xs">Advanced React & Modern Web Systems</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* GitHub-style Contribution Heatmap */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-pink-500" />
              Developer Productivity Heatmap
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Annual code submissions & challenge solving activity</p>
          </div>
          <div className="flex gap-6 text-xs font-bold">
            <div className="text-right">
              <p className="text-white font-black text-sm">{streak?.totalCorrect || 0}</p>
              <p className="text-[9px] text-slate-400 uppercase font-black">Tasks Solved</p>
            </div>
            <div className="text-right border-l border-slate-800 pl-6">
              <p className="text-pink-400 font-black text-sm">{student?.streak || 0} Days</p>
              <p className="text-[9px] text-slate-400 uppercase font-black">Current Streak</p>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="min-w-[850px]">
            {/* Fixed overlapping month labels aligned with columns */}
            <div className="flex gap-1.5 ml-10 mb-2">
              {weeks.map((week, wi) => {
                const month = week[0].getMonth();
                const isFirstWeekOfMonth = wi === 0 || weeks[wi - 1][0].getMonth() !== month;
                return (
                  <div key={wi} className="text-[9px] text-slate-500 font-black uppercase tracking-widest w-3 h-3 text-center">
                    {isFirstWeekOfMonth ? MONTHS[month] : ''}
                  </div>
                );
              })}
            </div>

            {/* Grid rows */}
            <div className="flex gap-1.5">
              <div className="flex flex-col gap-1.5 mr-2">
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                  <div key={i} className="h-3 text-[9px] text-slate-500 font-black flex items-center w-8 justify-end">
                    {day}
                  </div>
                ))}
              </div>
              
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5">
                  {week.map((day) => {
                    const key = format(day, 'yyyy-MM-dd');
                    const count = streak?.heatmap?.[key] || 0;
                    return (
                      <div 
                        key={key} 
                        className="w-3 h-3 rounded-[3px] cursor-pointer border border-transparent hover:border-pink-500 hover:scale-125 transition-all group relative"
                        style={{ 
                          background: getSubmissionColor(count)
                        }}
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950 text-white border border-slate-850 rounded-lg text-[8px] font-black tracking-wider uppercase whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                          {count} submissions on {format(day, 'MMM dd, yyyy')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mr-1">Less</span>
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className="w-3 h-3 rounded-[3px]" style={{ background: SubmissionColorMap[v] }} />
            ))}
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest ml-1">More</span>
          </div>
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
            Max Streak: {streak?.longestStreak || 0} Days
          </span>
        </div>
      </div>

      {/* Gamification Achievements Milestone Board */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl z-10 relative">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
          <Award size={14} className="text-pink-500 animate-pulse" />
          Gamified Achievement Badges
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Badge 1 */}
          <div className="p-6 bg-slate-950/60 border border-slate-850 rounded-[2rem] flex items-center gap-4 hover:border-pink-500/30 transition">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center font-black">
              🔥
            </div>
            <div>
              <h4 className="text-xs font-black text-white">7 Day Streak</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Unlocked</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="p-6 bg-slate-950/60 border border-slate-850 rounded-[2rem] flex items-center gap-4 hover:border-pink-500/30 transition">
            <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-2xl flex items-center justify-center font-black">
              💻
            </div>
            <div>
              <h4 className="text-xs font-black text-white">100 Coding Problems</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Unlocked</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="p-6 bg-slate-950/60 border border-slate-850 rounded-[2rem] flex items-center gap-4 opacity-50 border-dashed">
            <div className="w-12 h-12 bg-slate-800 text-slate-600 rounded-2xl flex items-center justify-center font-black">
              🏆
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Java Master</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Locked</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="p-6 bg-slate-950/60 border border-slate-850 rounded-[2rem] flex items-center gap-4 hover:border-pink-500/30 transition">
            <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 text-violet-500 rounded-2xl flex items-center justify-center font-black">
              🚀
            </div>
            <div>
              <h4 className="text-xs font-black text-white">First Exam Passed</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Unlocked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Insights Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Weekly Submissions Gradient Area Chart */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Weekly Submissions</h4>
            <BarChart2 size={16} className="text-pink-500" />
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionsData}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: 10 }} />
                <Area type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly consistency bar chart */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Monthly Growth</h4>
            <Layers size={16} className="text-purple-500" />
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyConsistencyData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: 10 }} />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill radar chart */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Skill Competency Radar</h4>
            <Brain size={16} className="text-indigo-500" />
          </div>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={skillRadarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                <PolarRadiusAxis stroke="#64748b" fontSize={8} />
                <Radar name="Student" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentAnalytics;
