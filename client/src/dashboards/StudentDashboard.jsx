import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, LayoutDashboard, Calendar, Trophy, Zap, TrendingUp, Target, Code2, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudentData } from '../hooks/useStudentData';

// Components
import HeroBanner from '../components/student/HeroBanner';
import PerformanceStats from '../components/student/PerformanceStats';
import ProgressAnalytics from '../components/student/ProgressAnalytics';
import Leaderboard from '../components/student/Leaderboard';
import SkillsAcquired from '../components/student/SkillsAcquired';
import DriveAnalytics from '../components/student/DriveAnalytics';
import SubmissionHeatmap from '../components/student/SubmissionHeatmap';
import MyCourses from '../components/student/MyCourses';
import AIRecommendations from '../components/student/AIRecommendations';
import EmployabilityMeter from '../components/student/EmployabilityMeter';
import AttendanceAnalytics from '../components/student/AttendanceAnalytics';
import UpcomingItems from '../components/student/UpcomingItems';
import QuickActions from '../components/student/QuickActions';
import ProductivityInsights from '../components/student/ProductivityInsights';
import AchievementBadges from '../components/student/AchievementBadges';
import DailyGoals from '../components/student/DailyGoals';

const ErrorBanner = ({ message, onRetry }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
    <AlertCircle size={20} />
    <p className="text-sm font-bold flex-1">{message}</p>
    <button onClick={onRetry} className="px-4 py-2 bg-red-500 text-white text-xs font-black rounded-xl hover:bg-red-600 transition">
      Retry
    </button>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const {
    dashboard, progress, leaderboard, streak, skills,
    analytics, recommendations, loading, error, refetch
  } = useStudentData();

  const firstName = user?.name?.split(' ')[0] || 'Student';
  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-[#f4f2f8] font-sans pb-20 overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-400/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {greet()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500">{firstName}!</span> 👋
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/5 border border-orange-200">
                <Zap size={12} className="text-orange-500" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{dashboard?.student?.streak || 0} DAY STREAK</span>
              </div>
              <p className="text-slate-500 font-bold text-xs">You're doing great this week!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <Trophy size={16} className="text-amber-500" />
              <span className="text-xs font-black text-slate-900">RANK #{leaderboard?.myRank || '--'}</span>
            </div>
            <motion.button
              whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}
              onClick={refetch}
              className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 transition shadow-sm"
            >
              <RefreshCw size={18} />
            </motion.button>
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {/* Top Section: Hero Banner */}
        <div className="grid grid-cols-1 gap-8">
          <HeroBanner data={dashboard?.banners} />
        </div>

        {/* Row 2: Key Metrics Cards */}
        <PerformanceStats data={dashboard} loading={loading} />

        {/* Row 3: Analytics Triple Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <EmployabilityMeter score={dashboard?.stats?.employabilityScore} loading={loading} />
            <AttendanceAnalytics data={dashboard?.attendance} loading={loading} />
          </div>
          <div className="lg:col-span-6">
            <ProgressAnalytics data={progress} loading={loading} />
          </div>
          <div className="lg:col-span-3">
            <UpcomingItems exams={dashboard?.upcomingExams} assignments={dashboard?.upcomingAssignments} loading={loading} />
          </div>
        </div>

        {/* Row 4: Engagement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Leaderboard data={leaderboard} loading={loading} />
          </div>
          <div className="lg:col-span-5">
            <MyCourses data={dashboard} loading={loading} />
          </div>
          <div className="lg:col-span-3">
            <DailyGoals goals={dashboard?.dailyGoals} loading={loading} />
          </div>
        </div>

        {/* Row 5: Insights & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SubmissionHeatmap data={streak} loading={loading} />
          </div>
          <div className="lg:col-span-4">
            <ProductivityInsights loading={loading} />
          </div>
        </div>

        {/* Row 6: Skills & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <SkillsAcquired data={skills} loading={loading} />
          </div>
          <div className="lg:col-span-3">
            <AchievementBadges badges={dashboard?.badges} loading={loading} />
          </div>
          <div className="lg:col-span-3">
            <QuickActions />
          </div>
        </div>

        {/* Row 7: AI Recommendations & Placement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <DriveAnalytics data={analytics} loading={loading} />
          </div>
          <div className="lg:col-span-8">
            <AIRecommendations data={recommendations} loading={loading} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
