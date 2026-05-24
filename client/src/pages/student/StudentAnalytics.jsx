import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Trophy, Flame, Calendar, Brain, Github, Linkedin,
  Loader2, BarChart2, Layers, Check, Zap, X, Share2, ExternalLink
} from 'lucide-react';
import { format, getDay, eachDayOfInterval } from 'date-fns';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useStudentData } from '../../hooks/useStudentData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SubmissionColorMap = {
  0: 'rgba(0,0,0,0.06)',
  1: '#bbf7d0',
  2: '#4ade80',
  3: '#16a34a',
  4: '#14532d',
};

const getSubmissionColor = (count) => {
  if (!count) return SubmissionColorMap[0];
  if (count <= 1) return SubmissionColorMap[1];
  if (count <= 3) return SubmissionColorMap[2];
  if (count <= 5) return SubmissionColorMap[3];
  return SubmissionColorMap[4];
};

/* ─── Glass card matching the platform's light theme ─── */
const Card = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.015 }}
    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    className={`bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-[0_8px_32px_rgba(244,114,182,0.08)] ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── Hashtags pool ─── */
const HASHTAGS = [
  '#java', '#sql', '#coding', '#programming', '#job', '#jobs',
  '#hiring', '#developer', '#javadeveloper', '#coder', '#SkilStation',
  '#30DaysCodeAtSkilStation', '#ProgrammingChallenge', '#CodeNewbie',
  '#SkilStationLearner', '#CodingCommunity', '#ProblemSolving',
  '#FullStack', '#TechLearning', '#EdTech',
];

/* ─── LinkedIn Post Modal Component ─── */
const LinkedInPostModal = ({ isOpen, onClose, user, streakDays, rank, xp, tasksCompleted }) => {
  const defaultMessage = `Thrilled to share that I've maintained an impressive ${streakDays}-day coding streak at SkilStation! 🚀\n\nWith ${xp} XP earned and ${tasksCompleted} tasks completed, I'm currently ranked among the top coders on the SkilStation leaderboard! Excited to keep pushing my limits and sharpening my coding skills. 💻🔥\n\nCheck out SkilStation: https://skilstation.com\n\n#SkilStation`;
  
  const [message, setMessage] = useState(defaultMessage);
  const [selectedTags, setSelectedTags] = useState(['#SkilStation', '#coding', '#programming', '#30DaysCodeAtSkilStation', '#ProgrammingChallenge']);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const fullMessage = `${message}\n\n${selectedTags.join('  ')}`;

  const handlePostOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://skilstation.com')}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    toast.success('Opening LinkedIn to share your achievement! 🎉');
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(fullMessage);
    toast.success('Message copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center">
                <Linkedin size={18} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-black text-slate-900">LinkedIn Post</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Editable Message */}
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 resize-none transition-all"
                style={{ background: 'rgba(248,250,252,1)', borderRadius: '16px' }}
              />
            </div>

            {/* Preview Card */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">LinkedIn Message Preview</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{message}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedTags.map(tag => (
                  <span key={tag} className="text-[11px] font-bold text-blue-600">{tag}</span>
                ))}
              </div>
            </div>

            {/* Hashtag Picker */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Select Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {HASHTAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handlePostOnLinkedIn}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <Linkedin size={16} /> Post on LinkedIn
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleCopyMessage}
              className="py-3 px-5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm flex items-center gap-2 border border-slate-200 transition-all"
            >
              Copy
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const StudentAnalytics = () => {
  const { user } = useAuth();
  const { dashboard, leaderboard, streak, skills, loading } = useStudentData();

  const [gitHubConnected, setGitHubConnected] = useState(false);
  const [gitHubLoading, setGitHubLoading] = useState(false);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [showLinkedInPost, setShowLinkedInPost] = useState(false);

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
      if (getDay(day) === 6) { weekGroups.push(week); week = []; }
    }
    if (week.length) weekGroups.push(week);
    return weekGroups;
  }, []);

  const handleConnectGitHub = () => {
    setGitHubLoading(true);
    setTimeout(() => { setGitHubConnected(true); setGitHubLoading(false); toast.success('GitHub synced!'); }, 1500);
  };
  const handleConnectLinkedIn = () => {
    setLinkedInLoading(true);
    setTimeout(() => { setLinkedInConnected(true); setLinkedInLoading(false); toast.success('LinkedIn linked!'); }, 1500);
  };

  const submissionsData = [
    { name: 'Mon', count: 3 }, { name: 'Tue', count: 5 }, { name: 'Wed', count: 2 },
    { name: 'Thu', count: 8 }, { name: 'Fri', count: 4 }, { name: 'Sat', count: 1 }, { name: 'Sun', count: 6 },
  ];
  const monthlyData = [
    { name: 'Jan', tasks: 12 }, { name: 'Feb', tasks: 18 }, { name: 'Mar', tasks: 25 },
    { name: 'Apr', tasks: 30 }, { name: 'May', tasks: 45 }, { name: 'Jun', tasks: 38 },
  ];
  const skillRadarData = [
    { subject: 'Frontend', A: 85 }, { subject: 'Backend', A: 65 },
    { subject: 'DSA', A: 50 }, { subject: 'Database', A: 70 },
    { subject: 'System Design', A: 40 }, { subject: 'Testing', A: 60 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4"
        style={{ background: 'radial-gradient(circle at 50% 50%, #f8e5f4 0%, #eccde5 35%, #dfb5d8 65%, #c88dc0 100%)' }}>
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Loading analytics...</p>
      </div>
    );
  }

  const { student, stats } = dashboard || { student: {}, stats: {} };
  const currentXP = student?.xp || 0;
  const levelXPThreshold = 5000;
  const levelPct = Math.min(100, Math.round((currentXP % levelXPThreshold) / levelXPThreshold * 100));

  const tooltipStyle = {
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(244,114,182,0.2)',
    borderRadius: '12px',
    fontSize: 11,
    color: '#1f2937',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  };

  return (
    <div className="min-h-screen pb-20 space-y-6 font-sans">

      {/* LinkedIn Post Modal */}
      <LinkedInPostModal
        isOpen={showLinkedInPost}
        onClose={() => setShowLinkedInPost(false)}
        user={user}
        streakDays={student?.streak || 0}
        rank={leaderboard?.myRank || 'Novice'}
        xp={currentXP}
        tasksCompleted={streak?.totalCorrect || 0}
      />

      {/* ══════════════════════════════════
          PROFILE HERO CARD
      ══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(244,114,182,0.10)]"
      >
        {/* Avatar + Info */}
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-pink-400 via-rose-400 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-pink-200">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full border-2 border-white shadow-md">
              Lvl {Math.floor(currentXP / levelXPThreshold) + 1}
            </div>
          </div>

          <div className="text-center md:text-left space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <p className="text-slate-400 text-xs font-semibold">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-pink-50 border border-pink-200 text-pink-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                <Trophy size={10} /> Rank #{leaderboard?.myRank || 'Novice'}
              </span>
              {gitHubConnected && (
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Github size={10} /> GitHub Sync
                </span>
              )}
              {linkedInConnected && (
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Linkedin size={10} /> LinkedIn Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!gitHubConnected ? (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={handleConnectGitHub} disabled={gitHubLoading}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-black text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50">
              {gitHubLoading ? <Loader2 size={13} className="animate-spin" /> : <Github size={13} />} Connect GitHub
            </motion.button>
          ) : (
            <span className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl font-black text-xs flex items-center gap-2">
              <Check size={13} /> GitHub Active
            </span>
          )}
          {!linkedInConnected ? (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={handleConnectLinkedIn} disabled={linkedInLoading}
              className="px-5 py-2.5 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #ec4899, #a21caf)' }}>
              {linkedInLoading ? <Loader2 size={13} className="animate-spin" /> : <Linkedin size={13} />} Link LinkedIn
            </motion.button>
          ) : (
            <span className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl font-black text-xs flex items-center gap-2">
              <Check size={13} /> LinkedIn Synced
            </span>
          )}

          {/* Share Streak on LinkedIn */}
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowLinkedInPost(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Share2 size={13} /> Share Streak
          </motion.button>
        </div>
      </motion.div>

      {/* ══════════════════════════════════
          STATS GRID
      ══════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* XP Ring */}
        <Card className="p-6 flex flex-col items-center text-center gap-3">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#fce7f3" strokeWidth="5" fill="transparent" />
              <circle cx="32" cy="32" r="26" stroke="url(#xpGrad)" strokeWidth="5" fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - levelPct / 100)}
                strokeLinecap="round" />
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#c026d3" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-700">{levelPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">XP Points</p>
            <h3 className="text-xl font-black text-slate-900">{currentXP.toLocaleString()}</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Level 3 Developer</p>
          </div>
        </Card>

        {/* Employability */}
        <Card className="p-6 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Employability Score</p>
              <h3 className="text-2xl font-black text-slate-900">{stats?.employabilityScore || 0}%</h3>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Brain size={18} className="text-purple-500" />
            </div>
          </div>
          <div className="space-y-2">
            {[{ l: 'Frontend', v: 70, c: '#ec4899' }, { l: 'Backend', v: 40, c: '#a21caf' }, { l: 'DSA', v: 20, c: '#6366f1' }].map(({ l, v, c }) => (
              <div key={l}>
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mb-1">
                  <span>{l}</span><span>{v}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full" style={{ background: c }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 bg-orange-50 border border-orange-100 text-orange-500 rounded-2xl flex items-center justify-center">
              <Flame size={22} className="animate-bounce" />
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Streak Count</p>
              <h3 className="text-xl font-black text-orange-500">{student?.streak || 0} Days</h3>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 p-3 rounded-2xl flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400">Longest Streak:</span>
            <span className="text-orange-500 font-black">{streak?.longestStreak || 0} Days</span>
          </div>
        </Card>

        {/* Global Rank */}
        <Card className="p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 bg-yellow-50 border border-yellow-100 text-yellow-500 rounded-2xl flex items-center justify-center">
              <Trophy size={20} className="animate-pulse" />
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Global Rank Tier</p>
              <h3 className="text-xl font-black text-slate-900">{student?.rank || 'Novice'}</h3>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-2xl flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400">Percentile:</span>
            <span className="text-yellow-600 font-black">Top 3.4%</span>
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6 flex flex-col justify-between gap-3">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Skill Milestones</p>
            <h3 className="text-2xl font-black text-slate-900">{skills?.length || 0} <span className="text-base font-bold text-slate-500">Technologies</span></h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['HTML', 'CSS', 'JavaScript', 'React', 'Java'].map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-600 text-[8px] font-black uppercase tracking-wider rounded-md">
                {s}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════
          GITHUB / LINKEDIN PANELS
      ══════════════════════════════════ */}
      {(gitHubConnected || linkedInConnected) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {gitHubConnected && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-7 shadow-[0_8px_32px_rgba(244,114,182,0.08)] flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl"><Github size={18} /></span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">GitHub Dev Profile Sync</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Contributions & repository metrics</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Synced</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[['Repositories', '24'], ['Contributions', '438'], ['Active Streak', '12 Days'], ['Top Languages', 'JS, React']].map(([label, val]) => (
                    <div key={label} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{label}</p>
                      <p className="text-slate-900 font-black text-sm truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {linkedInConnected && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-7 shadow-[0_8px_32px_rgba(244,114,182,0.08)] flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl"><Linkedin size={18} /></span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">LinkedIn Sync Active</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Achievements & certification paths</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Linked</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[['Endorsed Skills', 'React, Frontend, State Management'], ['Linked Certifications', 'Advanced React & Modern Web Systems']].map(([label, val]) => (
                    <div key={label} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{label}</p>
                      <p className="text-slate-900 font-black text-xs">{val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ══════════════════════════════════
          HEATMAP
      ══════════════════════════════════ */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-7 shadow-[0_8px_32px_rgba(244,114,182,0.08)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-pink-500" /> Developer Productivity Heatmap
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Annual code submissions & challenge solving activity</p>
          </div>
          <div className="flex gap-5 text-xs font-bold">
            <div className="text-right">
              <p className="text-slate-900 font-black text-sm">{streak?.totalCorrect || 0}</p>
              <p className="text-[9px] text-slate-400 uppercase font-black">Tasks Solved</p>
            </div>
            <div className="text-right border-l border-slate-100 pl-5">
              <p className="text-pink-500 font-black text-sm">{student?.streak || 0} Days</p>
              <p className="text-[9px] text-slate-400 uppercase font-black">Current Streak</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[850px]">
            <div className="flex gap-1.5 ml-10 mb-2">
              {weeks.map((week, wi) => {
                const month = week[0].getMonth();
                const isFirst = wi === 0 || weeks[wi - 1][0].getMonth() !== month;
                return (
                  <div key={wi} className="text-[9px] text-slate-400 font-black uppercase tracking-widest w-3 h-3 text-center">
                    {isFirst ? MONTHS[month] : ''}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1.5">
              <div className="flex flex-col gap-1.5 mr-2">
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                  <div key={i} className="h-3 text-[9px] text-slate-400 font-bold flex items-center w-8 justify-end">{d}</div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5">
                  {week.map((day) => {
                    const key = format(day, 'yyyy-MM-dd');
                    const count = streak?.heatmap?.[key] || 0;
                    return (
                      <div key={key}
                        className="w-3 h-3 rounded-[3px] cursor-pointer border border-transparent hover:border-pink-400 hover:scale-125 transition-all group relative"
                        style={{ background: getSubmissionColor(count) }}>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                          {count} submissions · {format(day, 'MMM dd, yyyy')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mr-1">Less</span>
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className="w-3 h-3 rounded-[3px] border border-slate-200" style={{ background: SubmissionColorMap[v] }} />
            ))}
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest ml-1">More</span>
          </div>
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
            Max Streak: {streak?.longestStreak || 0} Days
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          ACHIEVEMENT BADGES
      ══════════════════════════════════ */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-7 shadow-[0_8px_32px_rgba(244,114,182,0.08)]">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-5">
          <Award size={14} className="text-pink-500" /> Gamified Achievement Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: '🔥', label: '7 Day Streak', status: 'Unlocked', bg: 'bg-orange-50', border: 'border-orange-100' },
            { emoji: '💻', label: '100 Coding Problems', status: 'Unlocked', bg: 'bg-pink-50', border: 'border-pink-100' },
            { emoji: '🏆', label: 'Java Master', status: 'Locked', bg: 'bg-slate-50', border: 'border-slate-100', dim: true },
            { emoji: '🚀', label: 'First Exam Passed', status: 'Unlocked', bg: 'bg-violet-50', border: 'border-violet-100' },
          ].map(({ emoji, label, status, bg, border, dim }) => (
            <motion.div key={label}
              whileHover={!dim ? { y: -3, scale: 1.02 } : {}}
              className={`p-5 ${bg} border ${border} rounded-3xl flex items-center gap-4 transition-all ${dim ? 'opacity-40' : ''}`}>
              <div className={`w-11 h-11 bg-white border ${border} rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                {emoji}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">{label}</h4>
                <p className={`text-[9px] font-bold uppercase mt-0.5 ${status === 'Locked' ? 'text-slate-400' : 'text-pink-500'}`}>{status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          RECHARTS
      ══════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-6 shadow-[0_8px_32px_rgba(244,114,182,0.08)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Weekly Submissions</h4>
            <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center">
              <BarChart2 size={14} className="text-pink-500" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionsData}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#aGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-6 shadow-[0_8px_32px_rgba(244,114,182,0.08)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Monthly Growth</h4>
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Layers size={14} className="text-purple-500" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <defs>
                  <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#a21caf" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="tasks" fill="url(#bGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl p-6 shadow-[0_8px_32px_rgba(244,114,182,0.08)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Skill Competency Radar</h4>
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
              <Brain size={14} className="text-violet-500" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis stroke="#e2e8f0" fontSize={8} />
                <Radar name="Student" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAnalytics;
