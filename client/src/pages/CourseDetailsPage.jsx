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
  PlayCircle,
  Monitor,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const CourseDetailsPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum, description, instructor
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCourseDetails();
  }, [id, slug]);

  const fetchCourseDetails = async () => {
    try {
      const url = id 
        ? `http://localhost:5000/api/courses/${id}` 
        : `http://localhost:5000/api/courses/slug/${slug}`;
      const res = await axios.get(url);
      setCourse(res.data);
      
      // Check if enrolled
      if (user) {
        try {
          const progressRes = await axios.get(`http://localhost:5000/api/courses/${res.data.id}/progress`);
          if (progressRes.data) setIsEnrolled(true);
        } catch (e) {
          // Not enrolled or error
          setIsEnrolled(false);
        }
      }

      // Expand first module by default
      if (res.data.module?.[0]) {
        setExpandedModules({ [res.data.module[0].id]: true });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (isEnrolled) {
      navigate(`/course/${course.id}/learn`);
      return;
    }

    if (!user) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await axios.post(`http://localhost:5000/api/courses/${course.id}/enroll`);
      toast.success('Successfully enrolled! ✨');
      setIsEnrolled(true);
      navigate(`/course/${course.id}/learn`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f2f8]">
      <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest">Architecting course experience...</p>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f2f8]">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Course Not Found</h2>
      <button onClick={() => navigate('/courses')} className="btn-primary">Back to Catalog</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f2f8] pb-20 pt-24 font-sans">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {course.banner ? (
          <img src={course.banner} className="w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-violet-600/20 border border-violet-500/30 backdrop-blur-md rounded-full text-violet-400 text-[10px] font-black uppercase tracking-widest">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-white text-xs font-bold ml-1">(4.9)</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                {course.title}
              </h1>
              <p className="text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
                {course.shortDesc}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4 text-white/70 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2"><Users size={18} className="text-violet-500" /> {course._count?.enrollment || 0} Students</div>
                <div className="flex items-center gap-2"><Clock size={18} className="text-violet-500" /> {course.duration || 'Self-paced'}</div>
                <div className="flex items-center gap-2"><Globe size={18} className="text-violet-500" /> English</div>
                <div className="flex items-center gap-2"><Award size={18} className="text-violet-500" /> Certificate</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-2">
              {[
                { id: 'curriculum', label: 'Curriculum', icon: <BookOpen size={18} /> },
                { id: 'description', label: 'Details', icon: <FileText size={18} /> },
                { id: 'instructor', label: 'Instructor', icon: <Users size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm"
            >
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900">Course Content</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                      {course.module?.length || 0} Modules • {course.module?.reduce((acc, m) => acc + (m.lesson?.length || 0), 0)} Lessons
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {course.module?.map((module, idx) => (
                      <div key={module.id} className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleModule(module.id)}
                          className={`w-full flex items-center justify-between p-6 transition-colors ${expandedModules[module.id] ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${expandedModules[module.id] ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              {idx + 1}
                            </div>
                            <span className="font-black text-left">{module.title}</span>
                          </div>
                          <ChevronRight className={`transition-transform duration-300 ${expandedModules[module.id] ? 'rotate-90' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedModules[module.id] && (
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden bg-white"
                            >
                              <div className="p-4 space-y-2">
                                {module.lesson?.map((lesson, lIdx) => (
                                  <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-violet-50 group transition-all cursor-default">
                                    <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-violet-600 transition-colors">
                                        <PlayCircle size={18} />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{lesson.title}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lesson.duration || '5:00'}</p>
                                      </div>
                                    </div>
                                    <div className="text-slate-300 group-hover:text-violet-400 transition-colors">
                                      <Lock size={16} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6">About this course</h3>
                    <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: course.fullDesc || course.shortDesc }} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Key Outcomes</h4>
                      <ul className="space-y-3">
                        {['Master core concepts', 'Build real-world projects', 'Learn industry best practices', 'Gain professional certification'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                            <CheckCircle size={18} className="text-emerald-500" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Requirements</h4>
                      <ul className="space-y-3">
                        {['Basic understanding of the topic', 'Laptop with internet access', 'Dedication to learn'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-600" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 overflow-hidden flex-shrink-0 shadow-lg">
                    {course.institution?.user_institution_userIdTouser?.avatar ? (
                      <img src={course.institution.user_institution_userIdTouser.avatar} className="w-full h-full object-cover" alt="Instructor" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                        {course.instructorName?.[0] || 'I'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900">{course.instructorName || 'Expert Instructor'}</h3>
                      <p className="text-violet-600 font-black text-xs uppercase tracking-[0.2em]">Lead Instructor @ {course.institution?.user_institution_userIdTouser?.name || 'SkillStation'}</p>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      With over 10 years of industry experience, our instructors are dedicated to providing the highest quality education and mentorship. They have trained thousands of students globally in cutting-edge technologies.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <div className="text-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <p className="text-2xl font-black text-slate-900">15k+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students</p>
                      </div>
                      <div className="text-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <p className="text-2xl font-black text-slate-900">4.9</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                      </div>
                      <div className="text-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <p className="text-2xl font-black text-slate-900">20+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Courses</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Pricing & Intro Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
                {/* Intro Video / Poster */}
                <div className="aspect-video rounded-[2.5rem] bg-slate-900 relative overflow-hidden group shadow-lg">
                  {course.introVideo ? (
                    <video 
                      src={course.introVideo} 
                      className="w-full h-full object-cover"
                      poster={course.thumbnail}
                      muted
                      loop
                      onMouseOver={e => e.target.play()}
                      onMouseOut={e => e.target.pause()}
                    />
                  ) : (
                    <img src={course.thumbnail} className="w-full h-full object-cover opacity-60" alt="Thumbnail" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play fill="currentColor" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Watch Preview</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-end gap-3 px-2">
                    <span className="text-5xl font-black text-slate-900">${course.price || 0}</span>
                    <span className="text-slate-400 font-bold line-through mb-1.5 text-lg">${(course.price || 0) * 2}</span>
                    <span className="text-emerald-500 font-black text-sm mb-2">50% OFF</span>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className={`w-full py-5 rounded-3xl font-black shadow-xl transition-all flex items-center justify-center gap-3 text-lg ${
                        isEnrolled 
                          ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' 
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-200 hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                      {enrolling ? <Loader2 className="animate-spin" /> : isEnrolled ? <Monitor size={22} /> : <ShieldCheck size={22} />}
                      {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                    </button>
                    {!isEnrolled && (
                      <button className="w-full py-5 bg-slate-50 text-slate-600 rounded-3xl font-black hover:bg-slate-100 transition-all text-sm uppercase tracking-widest">
                        Try Free Sample
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Course Features</p>
                    {[
                      { icon: <Play size={14} />, label: 'Lifetime Access' },
                      { icon: <BarChart size={14} />, label: 'Full Curriculum' },
                      { icon: <Award size={14} />, label: 'Completion Certificate' },
                      { icon: <Users size={14} />, label: 'Premium Support' },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 px-2">
                        <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                          {feature.icon}
                        </div>
                        {feature.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secure Checkout Trust */}
              <div className="flex items-center justify-center gap-6 opacity-30">
                <div className="text-center font-black text-[10px] uppercase tracking-widest text-slate-900">Secure Payment</div>
                <div className="text-center font-black text-[10px] uppercase tracking-widest text-slate-900">30-Day Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
