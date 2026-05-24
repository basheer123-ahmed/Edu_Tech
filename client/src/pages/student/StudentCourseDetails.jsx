import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  Award, 
  Users, 
  Star,
  Globe,
  BarChart,
  Shield,
  ArrowLeft,
  Loader2,
  Video,
  FileText,
  Lock,
  Unlock,
  PlayCircle,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Compass
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [stats, setStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum, roadmap, details
  const [expandedModules, setExpandedModules] = useState({});

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch course base details
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${id}`, { headers });
      setCourse(courseRes.data);

      // Check enrollment & stats
      if (token) {
        try {
          const statsRes = await axios.get('http://localhost:5000/api/student/courses/stats', { headers });
          if (statsRes.data.enrolledCourseIds.includes(courseRes.data.id)) {
            setIsEnrolled(true);
            
            // Fetch roadmap / assignments
            const assignRes = await axios.get(`http://localhost:5000/api/assignments/student/courses/${courseRes.data.id}`, { headers });
            setAssignments(assignRes.data);
          }
        } catch (e) {
          console.error('Error fetching student course status:', e);
        }
      }

      // Expand first module
      if (courseRes.data.module?.[0]) {
        setExpandedModules({ [courseRes.data.module[0].id]: true });
      }
    } catch (error) {
      console.error('Error loading details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in first');
        navigate('/login');
        return;
      }
      await axios.post(
        'http://localhost:5000/api/student/courses/enroll',
        { courseId: course.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Successfully enrolled! Welcome aboard 🚀');
      setIsEnrolled(true);
      fetchDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6EAF4]">
      <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest">Architecting course experience...</p>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6EAF4] p-6 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Course Not Found</h2>
      <button onClick={() => navigate('/dashboard/student/courses')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold">
        Back to Courses
      </button>
    </div>
  );

  // Compute stats
  const totalLessons = course.module?.reduce((acc, m) => acc + (m.lesson?.length || 0), 0) || 0;
  const assignmentsCount = assignments.length || 0;
  const codingLabsCount = assignments.filter(a => a.type === 'coding' || a.type === 'both').length || 0;

  return (
    <div className="min-h-screen bg-[#F6EAF4] pb-20 pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Back Link */}
        <Link 
          to="/dashboard/student/courses"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        {/* Hero Section Banner */}
        <div className="relative h-[320px] w-full rounded-[2.5rem] overflow-hidden shadow-xl border border-white/20">
          {course.banner ? (
            <img src={course.banner} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          
          <div className="absolute inset-0 flex items-center p-10">
            <div className="max-w-3xl space-y-4">
              <span className="px-4 py-1.5 bg-violet-600/30 border border-violet-500/30 backdrop-blur-md rounded-full text-violet-300 text-[10px] font-black uppercase tracking-widest">
                {course.category || 'General'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                {course.title}
              </h1>
              <p className="text-slate-300 font-medium text-sm md:text-base max-w-2xl">
                {course.shortDesc}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-white/80 text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-2"><Clock size={16} className="text-violet-400" /> {course.duration || 'Self-paced'}</div>
                <div className="flex items-center gap-2"><BarChart size={16} className="text-violet-400" /> {course.difficulty}</div>
                <div className="flex items-center gap-2"><Globe size={16} className="text-violet-400" /> English</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Tabs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-2 rounded-[2rem] shadow-sm flex items-center gap-2">
              {[
                { id: 'curriculum', label: 'Curriculum', icon: <BookOpen size={16} /> },
                { id: 'roadmap', label: 'Roadmap Preview', icon: <Compass size={16} /> },
                { id: 'details', label: 'About', icon: <FileText size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-sm min-h-[400px]">
              
              {/* TAB 1: CURRICULUM */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900">Course Syllabus</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                      {course.module?.length || 0} Modules • {totalLessons} Lessons
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {course.module?.map((module, idx) => (
                      <div key={module.id} className="border border-slate-100/80 rounded-3xl overflow-hidden bg-white/40 shadow-sm">
                        <button 
                          onClick={() => toggleModule(module.id)}
                          className={`w-full flex items-center justify-between p-5 transition-colors ${expandedModules[module.id] ? 'bg-slate-900 text-white' : 'bg-white/90 text-slate-900 hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${expandedModules[module.id] ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              {idx + 1}
                            </div>
                            <span className="font-black text-left text-sm md:text-base">{module.title}</span>
                          </div>
                          <ChevronRight className={`transition-transform duration-300 ${expandedModules[module.id] ? 'rotate-90' : ''}`} size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedModules[module.id] && (
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden bg-white/20"
                            >
                              <div className="p-3 space-y-2 border-t border-slate-100">
                                {module.lesson?.length === 0 ? (
                                  <p className="text-slate-400 text-xs p-4 text-center font-bold">No lessons uploaded yet</p>
                                ) : (
                                  module.lesson?.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-violet-100/50 group transition-all">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100/80 flex items-center justify-center text-slate-400 group-hover:text-violet-600 transition-colors">
                                          <PlayCircle size={16} />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-700">{lesson.title}</p>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lesson.duration || '5 mins'}</p>
                                        </div>
                                      </div>
                                      <div className="text-slate-300">
                                        {isEnrolled ? <Unlock size={14} className="text-emerald-500" /> : <Lock size={14} />}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ROADMAP PREVIEW */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">Assignments Roadmap</h3>
                    <p className="text-slate-500 text-xs font-medium">Verify your locks and progression tracks.</p>
                  </div>

                  {!isEnrolled ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-4 bg-slate-50/50 border border-slate-150 rounded-3xl p-6">
                      <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Roadmap is locked</h4>
                        <p className="text-slate-400 text-xs font-bold max-w-xs mt-1">Enroll in this course to unlock assignments, custom levels, and workspace submissions.</p>
                      </div>
                      <button 
                        onClick={handleEnroll}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-violet-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Enroll Now
                      </button>
                    </div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs font-bold">
                      No assignments found for this course roadmap yet.
                    </div>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 py-2">
                      {assignments.map((lvl, index) => (
                        <div key={lvl.id} className="relative group">
                          {/* Dot indicator */}
                          <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300 ${lvl.isCompleted ? 'border-emerald-500 bg-emerald-500' : lvl.isUnlocked ? 'border-violet-500 bg-violet-100' : 'border-slate-300'}`} />

                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Level {lvl.order}</span>
                                {lvl.isCompleted && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-wider">Passed</span>}
                              </div>
                              <h4 className="font-black text-sm text-slate-900">{lvl.title}</h4>
                              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{lvl.description}</p>
                              
                              <div className="flex gap-4 mt-3">
                                <span className="text-[9px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded">
                                  Type: {lvl.type.toUpperCase()}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                  XP Reward: {lvl.xpReward}
                                </span>
                              </div>
                            </div>

                            <div>
                              {lvl.isUnlocked ? (
                                <Link 
                                  to={lvl.order === 4 ? `/final-exam/${course.id}/${lvl.id}` : `/assignments/${course.id}/level/${lvl.id}`}
                                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-violet-600 transition-colors uppercase tracking-wider block text-center"
                                >
                                  Enter Workspace
                                </Link>
                              ) : (
                                <div className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed uppercase tracking-wider">
                                  <Lock size={12} /> Locked
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ABOUT */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">About the Course</h3>
                    <div 
                      className="text-slate-600 text-sm leading-relaxed space-y-4 font-medium"
                      dangerouslySetInnerHTML={{ __html: course.fullDesc || course.shortDesc }}
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Target Outcomes</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-bold">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Build modern fullstack apps</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Master advanced programming techniques</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Professional-grade projects for portfolio</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Pre-requisites</h4>
                      <ul className="space-y-2 text-xs text-slate-600 font-bold">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-600" /> Basic programming concepts</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-600" /> Access to code editor & terminal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Pricing, Enrollment & Proctoring Warning */}
          <div className="space-y-6">
            
            {/* Enrollment Checkout Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/50 shadow-sm space-y-6">
              
              <div className="flex items-end gap-2 px-2">
                <span className="text-4xl font-black text-slate-900">${course.price || 0}</span>
                {course.price > 0 && <span className="text-slate-400 font-bold line-through text-base mb-1">${course.price * 2}</span>}
                <span className="text-emerald-500 font-black text-xs mb-1 bg-emerald-50 px-2 py-0.5 rounded">FREE DEMO</span>
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-center">
                    <span className="text-xs font-black text-emerald-700 flex items-center justify-center gap-2">
                      <ShieldCheck size={16} /> Enrolled & Verified
                    </span>
                  </div>
                  <Link 
                    to={`/learn/${course.id}`}
                    className="w-full py-4 bg-slate-900 hover:bg-violet-600 text-white rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-slate-950/10 hover:-translate-y-0.5"
                  >
                    <Monitor size={18} /> Continue Learning
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-violet-500/20 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  {enrolling ? <Loader2 className="animate-spin" size={18} /> : <span>🚀 Enroll Now</span>}
                </button>
              )}

              {/* Course quick metadata */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-lg font-black text-slate-800 leading-none">{assignmentsCount}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Assignments</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-lg font-black text-slate-800 leading-none">{codingLabsCount}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Coding Labs</p>
                </div>
              </div>
            </div>

            {/* AI Proctoring System Warning Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 border border-amber-200/50 shadow-lg shadow-amber-500/5 space-y-4 relative overflow-hidden">
              
              {/* Top Warning Strip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-amber-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Exam Protocols</span>
                </div>
                {/* Active Monitor simulation */}
                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-[9px] font-black uppercase text-amber-700">Exam Mode</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-slate-500 text-xs font-bold leading-relaxed">
                  Regular homework levels are completely proctor-free. Proctoring checks are strictly enforced <span className="text-pink-600">only</span> on the Final Comprehensive Exam.
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    { text: 'Webcam active on Final Exam', desc: 'Continuous face verification scan' },
                    { text: 'Microphone active on Final Exam', desc: 'Continuous ambient sound monitoring' },
                    { text: 'Anti-tab bypass locks on Exam', desc: 'Disqualification warning on window changes' },
                    { text: 'Fully proctorless homeworks', desc: 'No system checks for practice levels' },
                  ].map((rule, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-black text-slate-700 leading-tight">{rule.text}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure Lock Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} className="text-slate-400" /> Secure Exam Environment
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentCourseDetails;
