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
  MoreVertical,
  PlayCircle,
  Menu,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LMSPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, modulesRes, progressRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/courses/${id}`),
        axios.get(`http://localhost:5000/api/courses/${id}/modules`),
        axios.get(`http://localhost:5000/api/courses/${id}/progress`)
      ]);

      setCourse(courseRes.data);
      setModules(modulesRes.data);
      setProgress(progressRes.data.lessonProgress || {});
      
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
      const res = await axios.post(`http://localhost:5000/api/courses/lessons/${lessonId}/complete`);
      setProgress(prev => ({ ...prev, [lessonId]: true }));
      toast.success('Lesson completed! 🎯');
      
      // Auto-play next lesson logic could go here
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Initializing Learning Environment...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-16">
      {/* Top Header */}
      <div className="h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/student/courses" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <h1 className="text-sm font-black text-white truncate max-w-[200px] md:max-w-md">{course?.title}</h1>
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
              {Object.values(progress).filter(Boolean).length} / {modules.reduce((acc, m) => acc + m.lesson.length, 0)} Lessons Completed
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Course Verified
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar">
          <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            {/* Video Player Section */}
            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative group border border-white/5">
              {activeLesson?.videoUrl ? (
                <video 
                  key={activeLesson.id}
                  ref={videoRef}
                  src={activeLesson.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  poster={course?.thumbnail}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                  <PlayCircle size={64} className="opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">No video content for this lesson</p>
                </div>
              )}
            </div>

            {/* Lesson Details */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-violet-500/20">
                    Active Lesson
                  </span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> {activeLesson?.duration || '00:00'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">{activeLesson?.title}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLessonComplete(activeLesson?.id)}
                  disabled={marking || progress[activeLesson?.id]}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
                    progress[activeLesson?.id] 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-white text-slate-950 hover:bg-violet-500 hover:text-white shadow-xl shadow-white/5'
                  }`}
                >
                  {marking ? <Loader2 className="animate-spin" /> : progress[activeLesson?.id] ? <CheckCircle size={18} /> : <Zap size={18} />}
                  {progress[activeLesson?.id] ? 'Completed' : 'Mark as Done'}
                </button>
              </div>
            </div>

            {/* Lesson Info / Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black text-white">Lesson Overview</h3>
                <div className="prose prose-invert max-w-none text-slate-400 font-medium leading-relaxed">
                  {activeLesson?.content || "In this lesson, we'll cover the fundamental concepts and practical applications relevant to this topic. Make sure to follow along and try the examples provided."}
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white">Resources</h3>
                <div className="space-y-3">
                  {activeLesson?.pdfUrl ? (
                    <a 
                      href={activeLesson.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">Lesson Handouts</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PDF Document</p>
                        </div>
                      </div>
                      <Download size={18} className="text-slate-500 group-hover:text-white" />
                    </a>
                  ) : (
                    <div className="p-8 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No resources for this lesson</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-white/5 z-40 lg:relative lg:block shrink-0 shadow-2xl"
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-black text-white uppercase tracking-widest text-xs">Curriculum</h3>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-400">
                    {modules.length} Modules
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {modules.map((module, mIdx) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-center justify-between px-2 mb-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Module {mIdx + 1}</p>
                        <ChevronDown size={14} className="text-slate-600" />
                      </div>
                      <h4 className="px-2 text-xs font-black text-slate-300 mb-4">{module.title}</h4>
                      
                      <div className="space-y-1">
                        {module.lesson?.map((lesson, lIdx) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setActiveLesson(lesson);
                              if (window.innerWidth < 1024) setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                              activeLesson?.id === lesson.id 
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                                : 'text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                activeLesson?.id === lesson.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-600 group-hover:bg-slate-700'
                              }`}>
                                {progress[lesson.id] ? <CheckCircle size={16} className="text-emerald-400" /> : <PlayCircle size={16} />}
                              </div>
                              <div className="text-left truncate">
                                <p className={`text-xs font-bold truncate ${activeLesson?.id === lesson.id ? 'text-white' : 'text-slate-300'}`}>
                                  {lesson.title}
                                </p>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${activeLesson?.id === lesson.id ? 'text-white/60' : 'text-slate-600'}`}>
                                  {lesson.duration || '00:00'}
                                </p>
                              </div>
                            </div>
                            {progress[lesson.id] && activeLesson?.id !== lesson.id && (
                              <CheckCircle size={14} className="text-emerald-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LMSPage;
