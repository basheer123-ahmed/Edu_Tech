import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  ChevronRight, 
  FileText, 
  ArrowLeft, 
  Loader2, 
  Video, 
  ChevronDown, 
  Monitor, 
  Download, 
  ShieldCheck, 
  Zap, 
  PlayCircle, 
  Menu, 
  X,
  Award,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Clock,
  Check,
  Code,
  TrendingUp,
  Activity,
  Tv
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LMSPage = () => {
  const { id, courseId } = useParams();
  const actualCourseId = id || courseId;
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('videos'); // overview, videos, assignments, exams
  const videoRef = useRef(null);

  useEffect(() => {
    fetchCourseData();
  }, [actualCourseId]);

  const fetchCourseData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [courseRes, modulesRes, progressRes, levelsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/courses/${actualCourseId}`, { headers }),
        axios.get(`http://localhost:5000/api/courses/${actualCourseId}/modules`, { headers }),
        axios.get(`http://localhost:5000/api/courses/${actualCourseId}/progress`, { headers }),
        axios.get(`http://localhost:5000/api/assignments/course/${actualCourseId}`, { headers }).catch(e => {
          console.error("No assignments found or error fetching levels:", e);
          return { data: [] };
        })
      ]);

      setCourse(courseRes.data);
      setModules(modulesRes.data);
      setProgress(progressRes.data.lessonProgress || {});
      setLevels(levelsRes.data || []);
      
      // Set first lesson as active if none selected
      if (modulesRes.data?.[0]?.lesson?.[0]) {
        setActiveLesson(modulesRes.data[0].lesson[0]);
      }
    } catch (error) {
      console.error('Error fetching LMS data:', error);
      toast.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    setMarking(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`http://localhost:5000/api/courses/lessons/${lessonId}/complete`, {}, { headers });
      setProgress(prev => ({ ...prev, [lessonId]: true }));
      toast.success('Lesson completed! 🎯');
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setMarking(false);
    }
  };

  const getNextLesson = () => {
    if (!activeLesson || !modules.length) return null;
    let foundActive = false;
    for (const mod of modules) {
      for (const les of mod.lesson || []) {
        if (foundActive) return les;
        if (les.id === activeLesson.id) {
          foundActive = true;
        }
      }
    }
    return null;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#fff3f8] via-[#ffffff] to-[#fbf0fc] font-sans text-slate-800 relative">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-pink-300/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-fuchsia-300/20 rounded-full blur-[120px]" />
      <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Initializing Learning Workspace...</p>
    </div>
  );

  const totalLessons = modules.reduce((acc, m) => acc + (m.lesson?.length || 0), 0);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const nextLesson = getNextLesson();

  // Split assignments and final exams
  const regularAssignments = levels.filter(l => l.order < 4);
  const finalExam = levels.find(l => l.order === 4 || l.title.toLowerCase().includes('secure') || l.title.toLowerCase().includes('exam'));

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#fff5f9] via-[#ffffff] to-[#faf0fc] text-slate-800 font-sans flex flex-col relative overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Background Spotlights, Mesh Gradients & Floating Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-300/30 rounded-full blur-[130px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="fixed bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-fuchsia-300/25 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="fixed top-[30%] left-[25%] w-[45%] h-[45%] bg-rose-200/20 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Subtle Cinematic Grain Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Floating Premium Glassmorphic Navbar Container */}
      <div className="mx-4 sm:mx-6 my-4 bg-white/40 backdrop-blur-xl border border-pink-200/40 rounded-3xl px-6 py-4 flex items-center justify-between z-40 relative shadow-[0_12px_40px_-10px_rgba(244,114,182,0.15)] transition-all duration-300 hover:border-pink-300/50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/student/courses" className="p-2.5 bg-white hover:bg-pink-50/50 border border-pink-200/40 rounded-2xl transition-all text-slate-600 hover:text-pink-600 flex items-center justify-center shadow-md shadow-pink-100/5 hover:scale-105 active:scale-95">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-8 w-[1px] bg-pink-250/20" />
          <div>
            <h1 className="text-sm md:text-base font-black text-slate-900 truncate max-w-[160px] md:max-w-md tracking-tight">
              {course?.title}
            </h1>
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_6px_#ec4899]" />
              {completedCount} / {totalLessons} Lessons Completed ({completionPercentage}%)
            </p>
          </div>
        </div>

        {/* Glossy Tab Switcher - Centered */}
        <div className="hidden lg:flex items-center bg-white/60 p-1.5 border border-pink-200/30 rounded-[22px] backdrop-blur-md shadow-inner">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'videos', label: 'Video Lectures', icon: Video },
            { id: 'assignments', label: 'Assignments', icon: Award },
            { id: 'exams', label: 'Secure Exam', icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/20 scale-105 hover:shadow-pink-500/30' 
                    : 'text-slate-500 hover:text-pink-600 hover:bg-pink-50/50'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Certified Badge & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {activeTab === 'videos' && (
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 bg-white hover:bg-pink-50/50 border border-pink-200/40 rounded-2xl transition-all text-slate-600 hover:text-pink-600 shadow-md shadow-pink-100/5 hover:scale-105 active:scale-95"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-pink-50/80 border border-pink-200/35 rounded-full text-pink-600 text-[10px] font-black uppercase tracking-widest shadow-sm shadow-pink-100/5">
            <ShieldCheck size={12} className="animate-pulse text-pink-500 filter drop-shadow-[0_0_2px_#ec4899]" /> Certified LMS
          </div>
        </div>
      </div>

      {/* Tabs list for mobile screens */}
      <div className="lg:hidden mx-4 mb-4 flex items-center justify-around bg-white/40 backdrop-blur-xl border border-pink-200/30 rounded-2xl p-2 overflow-x-auto shrink-0 relative z-30 shadow-md shadow-pink-100/5">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'videos', label: 'Videos', icon: Video },
          { id: 'assignments', label: 'Assignments', icon: Award },
          { id: 'exams', label: 'Exam', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                isActive ? 'text-pink-600 bg-white/80 shadow-sm border border-pink-100/30 scale-105' : 'text-slate-500'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-grow flex overflow-hidden relative z-10 px-4 sm:px-6 pb-6 gap-6">
        <div className="flex-grow overflow-y-auto custom-scrollbar relative bg-white/20 border border-pink-200/25 rounded-[32px] backdrop-blur-lg shadow-inner">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 pb-16"
              >
                {/* Hero Header Card */}
                <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/50 border border-pink-200/40 backdrop-blur-xl relative overflow-hidden shadow-xl shadow-pink-100/5 hover:border-pink-300/40 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-pink-400/10 to-fuchsia-400/10 rounded-full blur-[100px] pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                    <div className="space-y-4">
                      <span className="px-3.5 py-1.5 bg-pink-50 border border-pink-200/30 text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 shadow-sm shadow-pink-100/2">
                        <Sparkles size={12} className="animate-spin text-pink-500" style={{ animationDuration: '6s' }} /> Interactive Workspace
                      </span>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">{course?.title}</h2>
                      <p className="text-slate-600 text-sm max-w-2xl font-bold leading-relaxed">{course?.description}</p>
                    </div>

                    {/* Progress Circle Container */}
                    <div className="bg-white/80 border border-pink-200/40 p-6 rounded-[2rem] flex items-center gap-5 shrink-0 shadow-md shadow-pink-100/5 hover:scale-105 transition duration-300">
                      <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-pink-100/40" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-pink-500" strokeDasharray={`${completionPercentage}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-sm font-black text-slate-900">{completionPercentage}%</span>
                      </div>
                      <div className="text-left">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Progress</p>
                        <p className="text-lg font-black text-slate-800 mt-0.5">{completedCount} / {totalLessons}</p>
                        <p className="text-slate-500 text-[10px] font-bold">Lessons Completed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Total Lectures", val: `${totalLessons} Lessons`, desc: `${modules.length} modules uploaded`, icon: Video, color: "text-pink-600 bg-pink-50 border-pink-200/30 shadow-pink-100/5" },
                    { title: "Syllabus Status", val: `${completionPercentage}% Done`, desc: `${totalLessons - completedCount} videos pending`, icon: BookOpen, color: "text-purple-600 bg-purple-50 border-purple-200/30 shadow-purple-100/5" },
                    { title: "Practice Levels", val: `${regularAssignments.length} Assignments`, desc: "Unproctored training", icon: Award, color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200/30 shadow-fuchsia-100/5" },
                    { title: "Secure Certification", val: finalExam ? "Secure Exam Enabled" : "No Exam Configured", desc: "Face and browser locked", icon: ShieldCheck, color: "text-rose-600 bg-rose-50 border-rose-200/30 shadow-rose-100/5" },
                  ].map((st, sIdx) => {
                    const Icon = st.icon;
                    return (
                      <div key={sIdx} className="p-6 bg-white/50 border border-pink-200/30 backdrop-blur-md rounded-[24px] space-y-4 hover:-translate-y-1.5 hover:border-pink-300/40 hover:shadow-[0_12px_24px_rgba(244,114,182,0.06)] transition duration-300 shadow-sm shadow-pink-100/5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${st.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{st.title}</p>
                          <p className="text-lg font-black text-slate-900 tracking-tight mt-1">{st.val}</p>
                          <p className="text-slate-600 text-xs font-bold mt-0.5">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Card to continue learning */}
                <div className="p-8 rounded-[2rem] bg-gradient-to-r from-pink-500/10 via-fuchsia-500/10 to-purple-500/10 border border-pink-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-md shadow-pink-100/5">
                  <div className="space-y-1 z-10">
                    <h3 className="text-lg font-black text-slate-900">Ready to continue?</h3>
                    <p className="text-xs text-slate-600 font-bold">Pick up right where you left off. Watch your next video lecture now.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('videos')}
                    className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:opacity-90 transition-all duration-300 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:scale-[1.02] active:scale-95 shrink-0 flex items-center gap-1.5 z-10"
                  >
                    <Play size={12} fill="currentColor" /> Enter Lecture Workspace
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIDEOS TAB */}
            {activeTab === 'videos' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col"
              >
                <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 w-full pb-16">
                  {/* Video Screen Glow Container */}
                  <div className="bg-white/45 p-4 sm:p-6 border border-pink-200/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(244,114,182,0.12)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.22)] relative overflow-hidden backdrop-blur-xl group hover:border-pink-300/60 transition-all duration-500 z-10">
                    {/* Ambient pink glow blob behind player */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-500/5 opacity-40 pointer-events-none z-0" />
                    
                    <div className="aspect-video bg-black rounded-[1.8rem] overflow-hidden shadow-lg relative border border-pink-100/20 z-10">
                      {activeLesson?.videoUrl ? (
                        <video 
                          key={activeLesson.id}
                          ref={videoRef}
                          src={activeLesson.videoUrl}
                          className="w-full h-full object-contain relative z-10"
                          controls
                          autoPlay
                          poster={course?.thumbnail}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4 p-8">
                          <PlayCircle size={64} className="text-pink-500/40 animate-pulse" />
                          <div className="text-center space-y-1">
                            <p className="font-black uppercase tracking-widest text-xs text-slate-400">Curriculum Video Player</p>
                            <p className="text-slate-500 text-[10px] font-bold">Select a module lesson from the sidebar curriculum to start learning.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating lesson cards below */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 relative z-10">
                    {/* Card 1: Current Lesson Status & Controls */}
                    <div className="bg-white/50 backdrop-blur-md border border-pink-200/30 p-6 rounded-3xl shadow-md shadow-pink-100/5 flex flex-col justify-between space-y-4 hover:border-pink-300/50 hover:shadow-[0_12px_30px_rgba(244,114,182,0.08)] hover:-translate-y-1 transition duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-150/40 text-pink-600 flex items-center justify-center shadow-sm">
                          <Tv size={20} className="text-pink-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Currently Playing</p>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeLesson?.duration || '00:00'}</p>
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 leading-snug line-clamp-1">{activeLesson?.title || "No Active Lesson"}</h4>
                      {activeLesson && (
                        <button 
                          onClick={() => handleLessonComplete(activeLesson.id)}
                          disabled={marking || progress[activeLesson.id]}
                          className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md ${
                            progress[activeLesson.id] 
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-none' 
                              : 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:opacity-95 shadow-pink-500/15 hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          {marking ? (
                            <Loader2 className="animate-spin" size={12} />
                          ) : progress[activeLesson.id] ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Zap size={12} />
                          )}
                          {progress[activeLesson.id] ? 'Completed' : 'Mark as Done'}
                        </button>
                      )}
                    </div>

                    {/* Card 2: Next Lesson Info */}
                    <div className="bg-white/50 backdrop-blur-md border border-pink-200/30 p-6 rounded-3xl shadow-md shadow-pink-100/5 flex flex-col justify-between space-y-4 hover:border-pink-300/50 hover:shadow-[0_12px_30px_rgba(244,114,182,0.08)] hover:-translate-y-1 transition duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-150/40 text-purple-650 flex items-center justify-center shadow-sm">
                          <PlayCircle size={20} className="text-purple-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-purple-550 uppercase tracking-widest">Next Lesson</p>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{nextLesson?.duration || '00:00'}</p>
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 leading-snug line-clamp-1">{nextLesson?.title || "Course Completed 🎉"}</h4>
                      {nextLesson ? (
                        <button 
                          onClick={() => setActiveLesson(nextLesson)}
                          className="w-full py-3.5 bg-slate-900 hover:bg-pink-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Up Next
                        </button>
                      ) : (
                        <div className="py-3.5 bg-emerald-500/10 text-emerald-600 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          All caught up!
                        </div>
                      )}
                    </div>

                    {/* Card 3: Overall Course Progress */}
                    <div className="bg-white/50 backdrop-blur-md border border-pink-200/30 p-6 rounded-3xl shadow-md shadow-pink-100/5 flex flex-col justify-between space-y-4 hover:border-pink-300/50 hover:shadow-[0_12px_30px_rgba(244,114,182,0.08)] hover:-translate-y-1 transition duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 border border-fuchsia-150/40 text-fuchsia-600 flex items-center justify-center shadow-sm">
                          <TrendingUp size={20} className="text-fuchsia-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">Overall stats</p>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{completedCount} / {totalLessons} Done</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Progress ratio</span>
                          <span>{completionPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden border border-pink-200/20">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full shadow-inner transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overview details & Handouts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-2 relative z-10">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <BookOpen size={18} className="text-pink-500" /> Lesson Description
                      </h3>
                      <div className="bg-white/50 border border-pink-200/30 backdrop-blur-md p-6 rounded-[24px] text-slate-600 font-semibold leading-relaxed text-sm whitespace-pre-wrap shadow-sm">
                        {activeLesson?.content || "No synopsis is available for this lesson module. Watch the complete video lecture to learn concepts."}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <FileText size={18} className="text-pink-500" /> Handouts & Slides
                      </h3>
                      <div className="space-y-3">
                        {activeLesson?.pdfUrl ? (
                          <a 
                            href={activeLesson.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-5 bg-white/70 border border-pink-200/40 rounded-2xl hover:bg-pink-500/5 hover:border-pink-300/40 transition-all duration-300 group shadow-md shadow-pink-100/2 hover:scale-[1.01]"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-slate-800">Lesson Handouts</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF Document</p>
                              </div>
                            </div>
                            <Download size={18} className="text-slate-400 group-hover:text-pink-600" />
                          </a>
                        ) : (
                          <div className="p-8 text-center bg-white/40 rounded-[2rem] border border-dashed border-pink-200/60 shadow-inner">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No resources uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ASSIGNMENTS TAB */}
            {activeTab === 'assignments' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 pb-16 relative z-10"
              >
                <div className="space-y-3 border-b border-pink-100 pb-6">
                  <span className="px-3 py-1 bg-pink-50 border border-pink-200/40 text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <Award size={12} /> Practice Sandbox
                  </span>
                  <h2 className="text-3xl font-black text-slate-900">🎯 Course Assignments & Quizzes</h2>
                  <p className="text-slate-600 text-xs font-bold leading-relaxed">
                    Test your coding skills and concepts sequence by sequence. Passing an assignment unlocks the next level. 
                    <span className="text-pink-600"> These homework challenges are completely proctor-free (no webcam or browser restrictions are enforced).</span>
                  </p>
                </div>

                <div className="space-y-6">
                  {regularAssignments.map((level, index) => {
                    const isUnlocked = level.isUnlocked;
                    const isCompleted = level.isCompleted;

                    return (
                      <div 
                        key={level.id}
                        className={`p-6 rounded-[2rem] border backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition duration-300 relative overflow-hidden shadow-md ${
                          isCompleted
                            ? 'bg-white/70 border-emerald-250 shadow-emerald-100/5'
                            : isUnlocked
                              ? 'bg-white/80 border-pink-200/60 shadow-pink-150/10 hover:border-pink-300 hover:shadow-pink-250/20'
                              : 'bg-white/20 border-pink-100/10 opacity-60'
                        }`}
                      >
                        {isUnlocked && !isCompleted && (
                          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-pink-500/[0.02] rounded-full blur-3xl pointer-events-none" />
                        )}

                        <div className="space-y-3 flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 bg-pink-50 border border-pink-200/35 rounded-lg text-[9px] font-black text-pink-500 uppercase tracking-widest">
                              Level {level.order}
                            </span>
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-600 border border-purple-200/20 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                              {level.type === 'coding' ? <Code size={10} /> : <HelpCircle size={10} />}
                              {level.type}
                            </span>
                            <span className="px-2.5 py-1 bg-pink-100/60 text-pink-650 border border-pink-200/20 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                              <Award size={10} /> {level.xpReward} XP
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            {level.title}
                            {isCompleted && <span className="p-0.5 bg-emerald-100 text-emerald-600 rounded-full border border-emerald-300"><Check size={10} /></span>}
                          </h3>
                          <p className="text-slate-600 text-xs font-bold leading-relaxed max-w-xl">{level.description}</p>
                        </div>

                        <div className="shrink-0 flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
                          {isCompleted ? (
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Your Score</p>
                              <p className="text-xl font-black text-emerald-600">{level.score}%</p>
                              <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                Completed ✅
                              </span>
                            </div>
                          ) : isUnlocked ? (
                            <Link 
                              to={`/assignments/${actualCourseId}/level/${level.id}`}
                              className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:opacity-95 transition-all duration-300 text-white rounded-xl text-center font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-500/15 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Start Challenge <ChevronRight size={14} />
                            </Link>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-450 font-black uppercase tracking-widest bg-pink-50/50 border border-pink-100/50 px-4 py-2.5 rounded-xl shadow-inner">
                              <Lock size={12} className="text-pink-300" /> Locked
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {regularAssignments.length === 0 && (
                    <div className="p-12 text-center bg-white/40 rounded-[2rem] border border-dashed border-pink-200/60 space-y-2">
                      <HelpCircle size={40} className="text-slate-400 mx-auto" />
                      <p className="text-slate-500 font-black text-sm">No assignments found</p>
                      <p className="text-slate-400 text-xs font-bold">Assignments haven't been seeded or created for this course yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* EXAMS TAB */}
            {activeTab === 'exams' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 pb-16 relative z-10"
              >
                <div className="space-y-3 border-b border-pink-100 pb-6">
                  <span className="px-3.5 py-1.5 bg-pink-50 border border-pink-200/40 text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck size={12} className="animate-pulse" /> Secure Certification Gate
                  </span>
                  <h2 className="text-3xl font-black text-slate-900">🔒 Secure Comprehensive Examination</h2>
                  <p className="text-slate-600 text-xs font-bold leading-relaxed">
                    Earn your accredited certificate of completion by demonstrating master-level competency. 
                    This final challenge is governed by rigorous automated proctoring protocols.
                  </p>
                </div>

                {finalExam ? (
                  <div className="bg-gradient-to-br from-white/90 to-pink-50/20 border border-pink-250 shadow-xl shadow-pink-200/5 p-8 rounded-[2.5rem] relative overflow-hidden space-y-8">
                    <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-pink-100">
                      <div>
                        <span className="px-2.5 py-1 bg-pink-50 border border-pink-200/35 text-pink-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          Final Stage Proctored Level {finalExam.order}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-3">{finalExam.title}</h3>
                        <p className="text-slate-600 text-xs font-bold leading-relaxed mt-1 max-w-lg">{finalExam.description}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-pink-100 border border-pink-200/30 text-pink-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Award size={12} /> {finalExam.xpReward} XP Reward
                        </span>
                      </div>
                    </div>

                    {/* Strict Warning Panel */}
                    <div className="p-6 bg-pink-50/60 border border-pink-200 rounded-2xl space-y-4 shadow-inner">
                      <h4 className="text-pink-600 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert size={16} className="text-pink-500 animate-bounce" /> Automated AI Proctoring Warning
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed font-bold">
                        Launching this comprehensive exam session enables biometric monitoring and cheat trackers. The following conditions MUST be respected to prevent auto-disqualification:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-700 font-bold">
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" /> Continuous Webcam Monitoring</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" /> Active Mic Level Analytics</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" /> Screen Share & Primary Monitor lock</div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" /> Strict Browser Tab Lockout</div>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passing Threshold</p>
                        <p className="text-base font-black text-slate-800 mt-1">Score 50% or above</p>
                      </div>

                      {finalExam.isCompleted ? (
                        <div className="text-right flex flex-col items-center sm:items-end">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Exam Results</p>
                          <p className="text-2xl font-black text-emerald-600">{finalExam.score}% Score</p>
                          <span className="inline-flex items-center gap-1.5 mt-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-250 px-3 py-1 rounded-lg uppercase tracking-wider">
                            Certified Complete ✅
                          </span>
                        </div>
                      ) : finalExam.isUnlocked ? (
                        <Link 
                          to={`/final-exam/${actualCourseId}/${finalExam.id}`}
                          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:opacity-95 transition-all duration-300 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 hover:scale-[1.03] hover:shadow-pink-500/35 active:scale-[0.98]"
                        >
                          <ShieldCheck size={16} /> Enter Secure Exam Workspace
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-450 font-black uppercase tracking-widest bg-pink-50/50 border border-pink-100/50 px-5 py-3.5 rounded-2xl shadow-inner">
                          <Lock size={14} className="text-pink-300" /> Unlock assignments (Levels 1-3) to open exam
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white/40 rounded-[2rem] border border-dashed border-pink-200/60 space-y-2">
                    <ShieldAlert size={40} className="text-slate-400 mx-auto animate-pulse" />
                    <p className="text-slate-500 font-black text-sm">Secure Exam Not Configured</p>
                    <p className="text-slate-400 text-xs font-bold">No proctored exam is available for this course yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Syllabus Sidebar - Dynamic Curriculum Floating Glass Card */}
        {sidebarOpen && activeTab === 'videos' && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white/50 backdrop-blur-2xl border-l border-pink-200/30 z-40 lg:relative lg:block shrink-0 shadow-[0_20px_50px_rgba(244,114,182,0.1)] pt-20 lg:pt-0 lg:rounded-[2.5rem] lg:border lg:border-pink-200/40 overflow-hidden transition-all duration-300 hover:border-pink-300/40">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-pink-100/60 flex items-center justify-between shrink-0">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                  <BookOpen size={12} className="text-pink-500" /> Syllabus Curriculum
                </h3>
                <div className="px-2.5 py-1 bg-pink-50 border border-pink-200/35 rounded-full text-[9px] font-black text-pink-650 uppercase tracking-widest shadow-sm">
                  {modules.length} Modules
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {modules.map((module, mIdx) => (
                  <div key={module.id} className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Module {mIdx + 1}</p>
                      <ChevronDown size={12} className="text-slate-400" />
                    </div>
                    <h4 className="px-2 text-xs font-black text-slate-800 leading-snug">{module.title}</h4>
                    
                    {/* Vertical timeline progress effect link */}
                    <div className="space-y-2 relative pl-4 border-l-2 border-pink-100 ml-4">
                      {module.lesson?.map((lesson, lIdx) => {
                        const isLessonActive = activeLesson?.id === lesson.id;
                        const isLessonDone = progress[lesson.id];

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setActiveLesson(lesson);
                              if (window.innerWidth < 1024) setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group border ${
                              isLessonActive 
                                ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-[0_8px_20px_rgba(236,72,153,0.3)] border-pink-400/20 scale-[1.02]' 
                                : 'text-slate-650 bg-white/30 hover:bg-pink-50/70 border-transparent hover:text-pink-600'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isLessonActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-pink-50 border border-pink-150 text-pink-400 group-hover:bg-white group-hover:text-pink-650'
                              }`}>
                                {isLessonDone ? (
                                  <CheckCircle size={14} className={isLessonActive ? "text-white" : "text-pink-500 filter drop-shadow-[0_0_3px_rgba(236,72,153,0.5)]"} />
                                ) : (
                                  <PlayCircle size={14} />
                                )}
                              </div>
                              <div className="text-left truncate">
                                <p className={`text-xs font-bold truncate ${isLessonActive ? 'text-white' : 'text-slate-800'}`}>
                                  {lesson.title}
                                </p>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${isLessonActive ? 'text-white/75' : 'text-slate-400'}`}>
                                  {lesson.duration || '00:00'}
                                </p>
                              </div>
                            </div>
                            {isLessonDone && !isLessonActive && (
                              <CheckCircle size={14} className="text-pink-500 shrink-0 filter drop-shadow-[0_0_3px_rgba(236,72,153,0.5)]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.15);
        }
      `}</style>
    </div>
  );
};

export default LMSPage;
