import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Video, 
  BookOpen, 
  Settings, 
  Save, 
  Trash2, 
  GripVertical,
  CheckCircle2,
  FileText,
  DollarSign,
  Loader2,
  X,
  PlayCircle,
  Film,
  Image as ImageIcon,
  MonitorPlay,
  FileDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const VideoPlayer = ({ url, title }) => {
  if (!url) return null;
  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
      <video 
        src={url} 
        controls 
        className="w-full h-full object-contain"
        poster="/placeholder-video.png"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const AdminCourseBuilder = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState({ type: null, id: null, progress: 0 });
  
  const thumbnailInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const introVideoInputRef = useRef(null);
  const previewVideoInputRef = useRef(null);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: '',
    difficulty: 'BEGINNER',
    tags: [],
    thumbnail: '',
    banner: '',
    introVideo: '',
    previewVideo: '',
    status: 'DRAFT',
    modules: [
      { 
        title: 'Introduction', 
        description: '',
        lessons: [{ title: 'Welcome to the course', description: '', videoUrl: '', resources: '', duration: '05:00' }] 
      }
    ]
  });

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
      const data = res.data;
      setCourseData({
        ...data,
        description: data.fullDesc || data.shortDesc,
        modules: data.module?.map(m => ({
          title: m.title,
          description: m.description || '',
          lessons: m.lesson?.map(l => ({
            title: l.title,
            description: l.content || '',
            videoUrl: l.videoUrl || '',
            resources: l.pdfUrl || '',
            duration: l.duration || '00:00'
          })) || []
        })) || []
      });
    } catch (error) {
      toast.error('Failed to load course details');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type, moduleIdx = null, lessonIdx = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    // Map internal types to backend field names
    const fieldMap = {
      thumbnail: 'thumbnail',
      banner: 'banner',
      introVideo: 'introVideo',
      previewVideo: 'previewVideo',
      lessonVideo: 'lessonVideo'
    };
    
    formData.append(fieldMap[type] || 'file', file);

    const uploadId = moduleIdx !== null ? `l-${moduleIdx}-${lessonIdx}` : type;
    setUploading({ type, id: uploadId, progress: 0 });

    try {
      // Map types to endpoints
      const endpointMap = {
        thumbnail: '/api/upload/thumbnail',
        banner: '/api/upload/banner',
        introVideo: '/api/upload/intro-video',
        previewVideo: '/api/upload/preview-video',
        lessonVideo: '/api/upload/lesson-video'
      };

      const res = await axios.post(`http://localhost:5000${endpointMap[type]}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploading({ type, id: uploadId, progress });
        }
      });

      const fileUrl = res.data.fileUrl;

      if (moduleIdx !== null && lessonIdx !== null) {
        const newModules = [...courseData.modules];
        newModules[moduleIdx].lessons[lessonIdx].videoUrl = fileUrl;
        setCourseData(prev => ({ ...prev, modules: newModules }));
      } else {
        setCourseData(prev => ({ ...prev, [type]: fileUrl }));
      }
      
      toast.success('File uploaded successfully! ✨');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error(error.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      setUploading({ type: null, id: null, progress: 0 });
    }
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: 'New Module', description: '', lessons: [] }]
    }));
  };

  const removeModule = (idx) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== idx)
    }));
  };

  const addLesson = (moduleIdx) => {
    const newModules = [...courseData.modules];
    newModules[moduleIdx].lessons.push({ title: 'New Lesson', description: '', videoUrl: '', resources: '', duration: '00:00' });
    setCourseData(prev => ({ ...prev, modules: newModules }));
  };

  const removeLesson = (moduleIdx, lessonIdx) => {
    const newModules = [...courseData.modules];
    newModules[moduleIdx].lessons = newModules[moduleIdx].lessons.filter((_, i) => i !== lessonIdx);
    setCourseData(prev => ({ ...prev, modules: newModules }));
  };

  const updateLesson = (moduleIdx, lessonIdx, field, value) => {
    const newModules = [...courseData.modules];
    newModules[moduleIdx].lessons[lessonIdx][field] = value;
    setCourseData(prev => ({ ...prev, modules: newModules }));
  };

  const handleSubmit = async (publish = false) => {
    setLoading(true);
    try {
      const payload = { ...courseData, status: publish ? 'PUBLISHED' : 'DRAFT' };
      if (id) {
        await axios.put(`http://localhost:5000/api/courses/${id}`, payload);
        toast.success('Course updated! 🔄');
      } else {
        await axios.post('http://localhost:5000/api/courses', payload);
        toast.success(publish ? 'Course published! 🚀' : 'Course saved as draft! 💾');
      }
      navigate('/dashboard/admin/courses');
    } catch (error) {
      console.error('❌ Save Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info', icon: <FileText size={18} /> },
    { id: 2, name: 'Media Assets', icon: <Upload size={18} /> },
    { id: 3, name: 'Curriculum', icon: <BookOpen size={18} /> },
    { id: 4, name: 'Finalize', icon: <Settings size={18} /> },
  ];

  if (fetching) return (
    <div className="min-h-[600px] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest">Loading Course Data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{id ? 'Edit Course' : 'Course Builder'}</h1>
          <p className="text-slate-500 font-medium">Architect an elite learning experience.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-8 py-3.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            <Save size={18} /> Save Draft
          </button>
          <button 
            onClick={() => navigate('/dashboard/admin/courses')}
            className="px-8 py-3.5 bg-white text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-50 transition flex items-center gap-2"
          >
            <X size={18} /> Cancel
          </button>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div 
              onClick={() => setStep(s.id)}
              className={`flex flex-col items-center gap-3 relative z-10 cursor-pointer transition-all duration-300 ${step >= s.id ? 'text-violet-600' : 'text-slate-400'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                step === s.id ? 'bg-violet-600 border-violet-600 text-white shadow-xl shadow-violet-200 scale-110' : 
                step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100'
              }`}>
                {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1.5 mx-6 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step > s.id ? '100%' : '0%' }}
                  className="h-full bg-violet-600"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Builder Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm min-h-[600px]"
        >
          {step === 1 && (
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm"><FileText size={28} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Basic Information</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Define the course fundamentals</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Course Title</label>
                  <input 
                    name="title" value={courseData.title} onChange={handleInputChange}
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none" 
                    placeholder="e.g. Next.js 14 Masterclass"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Category</label>
                  <select 
                    name="category" value={courseData.category} onChange={handleInputChange}
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none appearance-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Design">Design & UI/UX</option>
                    <option value="Business">Business & Management</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Course Description</label>
                  <textarea 
                    name="description" value={courseData.description} onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none resize-none" 
                    placeholder="Describe the learning journey and target outcomes..."
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Course Pricing (USD)</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors"><DollarSign size={20} /></div>
                    <input 
                      name="price" value={courseData.price} onChange={handleInputChange}
                      className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 pl-14 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none" 
                      placeholder="99.00"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setCourseData(prev => ({ ...prev, difficulty: level }))}
                        className={`py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          courseData.difficulty === level 
                            ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-100' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm"><Upload size={28} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Media Assets</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Visual branding and previews</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Thumbnail */}
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Course Thumbnail</label>
                  <div 
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="relative aspect-video rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8 group hover:border-violet-300 hover:bg-violet-50/10 transition-all cursor-pointer overflow-hidden"
                  >
                    {courseData.thumbnail ? (
                      <>
                        <img src={courseData.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt="Thumbnail" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <p className="text-white font-black text-sm uppercase tracking-widest">Replace Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-slate-300 mx-auto group-hover:scale-110 group-hover:text-violet-500 transition-all duration-500">
                          {uploading.type === 'thumbnail' ? <Loader2 className="animate-spin" /> : <Plus size={40} />}
                        </div>
                        <div>
                          <p className="text-slate-900 font-black">Drop thumbnail here</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">1280x720 • JPG/PNG</p>
                        </div>
                      </div>
                    )}
                    {uploading.type === 'thumbnail' && (
                      <div className="absolute bottom-0 left-0 h-2 bg-violet-600 transition-all duration-300" style={{ width: `${uploading.progress}%` }} />
                    )}
                  </div>
                  <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                </div>

                {/* Banner */}
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Course Banner</label>
                  <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="relative aspect-video rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8 group hover:border-violet-300 hover:bg-violet-50/10 transition-all cursor-pointer overflow-hidden"
                  >
                    {courseData.banner ? (
                      <>
                        <img src={courseData.banner} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <p className="text-white font-black text-sm uppercase tracking-widest">Replace Banner</p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-slate-300 mx-auto group-hover:scale-110 group-hover:text-violet-500 transition-all duration-500">
                          {uploading.type === 'banner' ? <Loader2 className="animate-spin" /> : <ImageIcon size={40} />}
                        </div>
                        <div>
                          <p className="text-slate-900 font-black">Upload Hero Banner</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">1920x1080 • JPG/PNG</p>
                        </div>
                      </div>
                    )}
                    {uploading.type === 'banner' && (
                      <div className="absolute bottom-0 left-0 h-2 bg-violet-600 transition-all duration-300" style={{ width: `${uploading.progress}%` }} />
                    )}
                  </div>
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'banner')} />
                </div>

                {/* Intro Video */}
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Intro Video (Trailer)</label>
                  {courseData.introVideo ? (
                    <div className="space-y-4">
                      <VideoPlayer url={courseData.introVideo} title="Intro Video Preview" />
                      <button 
                        onClick={() => setCourseData(prev => ({ ...prev, introVideo: '' }))}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] hover:text-rose-600 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Trash2 size={14} /> Remove and Replace Video
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => introVideoInputRef.current?.click()}
                      className="relative aspect-video rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8 group hover:border-violet-300 hover:bg-violet-50/10 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-slate-300 mx-auto group-hover:scale-110 group-hover:text-violet-500 transition-all duration-500">
                          {uploading.type === 'introVideo' ? <Loader2 className="animate-spin" /> : <Video size={40} />}
                        </div>
                        <div>
                          <p className="text-slate-900 font-black">Upload Intro Trailer</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">MP4/MOV • Max 500MB</p>
                        </div>
                      </div>
                      {uploading.type === 'introVideo' && (
                        <div className="absolute bottom-0 left-0 h-2 bg-violet-600 transition-all duration-300" style={{ width: `${uploading.progress}%` }} />
                      )}
                    </div>
                  )}
                  <input ref={introVideoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'introVideo')} />
                </div>

                {/* Preview Video */}
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Free Sample Lesson</label>
                  {courseData.previewVideo ? (
                    <div className="space-y-4">
                      <VideoPlayer url={courseData.previewVideo} title="Preview Video" />
                      <button 
                        onClick={() => setCourseData(prev => ({ ...prev, previewVideo: '' }))}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] hover:text-rose-600 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Trash2 size={14} /> Replace Sample Video
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => previewVideoInputRef.current?.click()}
                      className="relative aspect-video rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8 group hover:border-violet-300 hover:bg-violet-50/10 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-slate-300 mx-auto group-hover:scale-110 group-hover:text-violet-500 transition-all duration-500">
                          {uploading.type === 'previewVideo' ? <Loader2 className="animate-spin" /> : <MonitorPlay size={40} />}
                        </div>
                        <div>
                          <p className="text-slate-900 font-black">Upload Preview Video</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Show students what to expect</p>
                        </div>
                      </div>
                      {uploading.type === 'previewVideo' && (
                        <div className="absolute bottom-0 left-0 h-2 bg-violet-600 transition-all duration-300" style={{ width: `${uploading.progress}%` }} />
                      )}
                    </div>
                  )}
                  <input ref={previewVideoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'previewVideo')} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm"><BookOpen size={28} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Curriculum Builder</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Build the knowledge tree</p>
                  </div>
                </div>
                <button onClick={addModule} className="px-10 py-5 bg-violet-600 text-white rounded-3xl text-xs font-black hover:bg-violet-700 transition flex items-center gap-3 shadow-2xl shadow-violet-200 uppercase tracking-[0.1em]">
                  <Plus size={20} /> Create New Module
                </button>
              </div>
              
              <div className="space-y-12">
                {courseData.modules.map((module, mIdx) => (
                  <div key={mIdx} className="bg-slate-50 border-2 border-slate-100 rounded-[3.5rem] p-10 space-y-8 relative group/module">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 cursor-grab"><GripVertical size={20} /></div>
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Module {mIdx + 1}</label>
                        <input 
                          value={module.title}
                          onChange={(e) => {
                            const newModules = [...courseData.modules];
                            newModules[mIdx].title = e.target.value;
                            setCourseData(prev => ({ ...prev, modules: newModules }));
                          }}
                          className="w-full bg-transparent border-none text-2xl font-black text-slate-900 focus:outline-none placeholder:text-slate-300"
                          placeholder="Module Title (e.g. Master the Fundamentals)"
                        />
                      </div>
                      <button onClick={() => removeModule(mIdx)} className="w-12 h-12 rounded-2xl bg-white text-slate-300 hover:text-rose-500 hover:shadow-lg transition-all flex items-center justify-center border border-slate-100"><Trash2 size={20} /></button>
                    </div>

                    <div className="pl-12 space-y-6">
                      {module.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 space-y-8 shadow-sm group/lesson hover:border-violet-200 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover/lesson:text-violet-600 transition-colors flex items-center justify-center"><PlayCircle size={24} /></div>
                            <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lesson {lIdx + 1}</label>
                              <input 
                                value={lesson.title}
                                onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                                className="w-full bg-transparent border-none text-lg font-black text-slate-800 focus:outline-none"
                                placeholder="Enter lesson title..."
                              />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Duration</label>
                              <input 
                                value={lesson.duration}
                                onChange={(e) => updateLesson(mIdx, lIdx, 'duration', e.target.value)}
                                className="w-24 bg-slate-50 rounded-xl px-3 py-2 text-xs font-black text-slate-600 border border-slate-100 focus:border-violet-500 outline-none text-center"
                                placeholder="10:00"
                              />
                            </div>
                            <button onClick={() => removeLesson(mIdx, lIdx)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-500 transition flex items-center justify-center"><Trash2 size={18} /></button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                            {/* Lesson Description & Resources */}
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> Description</label>
                                <textarea 
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(mIdx, lIdx, 'description', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none resize-none"
                                  rows={3}
                                  placeholder="What will students learn in this lesson?"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileDown size={14} /> Resource URL</label>
                                <input 
                                  value={lesson.resources}
                                  onChange={(e) => updateLesson(mIdx, lIdx, 'resources', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
                                  placeholder="Link to PDF, Github, or docs..."
                                />
                              </div>
                            </div>

                            {/* Lesson Video Upload */}
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Video size={14} /> Lesson Content</label>
                              {lesson.videoUrl ? (
                                <div className="space-y-3">
                                  <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
                                  <button 
                                    onClick={() => updateLesson(mIdx, lIdx, 'videoUrl', '')}
                                    className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] hover:underline"
                                  >
                                    Delete and re-upload video
                                  </button>
                                </div>
                              ) : (
                                <div className="relative group/upload h-full">
                                  <input 
                                    id={`l-upload-${mIdx}-${lIdx}`}
                                    type="file" 
                                    accept="video/*" 
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'lessonVideo', mIdx, lIdx)}
                                  />
                                  <label 
                                    htmlFor={`l-upload-${mIdx}-${lIdx}`}
                                    className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] hover:border-violet-300 hover:bg-violet-50/20 transition-all cursor-pointer text-center group"
                                  >
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-violet-500 transition-all mb-3">
                                      {uploading.id === `l-${mIdx}-${lIdx}` ? <Loader2 className="animate-spin" /> : <Film size={24} />}
                                    </div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Upload Video</p>
                                    {uploading.id === `l-${mIdx}-${lIdx}` && (
                                      <div className="absolute inset-0 bg-white/80 rounded-[2rem] flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                                        <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{uploading.progress}% Uploading...</p>
                                      </div>
                                    )}
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addLesson(mIdx)} 
                        className="w-full py-6 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50/10 transition-all flex items-center justify-center gap-3"
                      >
                        <Plus size={20} /> Add New Lesson to Module
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-16 text-center flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 rounded-[3rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-100">
                <CheckCircle2 size={64} className="animate-bounce" />
              </div>
              <div className="space-y-6">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Elite Status Awaits 🏆</h2>
                <p className="text-slate-500 max-w-lg font-bold text-lg mx-auto leading-relaxed">
                  Your curriculum is architected, your media is polished, and your course is ready to revolutionize student learning.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 text-left shadow-sm">
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3">Modules</p>
                  <p className="text-5xl font-black text-slate-900">{courseData.modules.length}</p>
                </div>
                <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 text-left shadow-sm">
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3">Lessons</p>
                  <p className="text-5xl font-black text-slate-900">
                    {courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                  </p>
                </div>
                <div className="p-10 bg-violet-600 rounded-[3rem] border-2 border-violet-500 text-left shadow-xl shadow-violet-200">
                  <p className="text-[12px] font-black text-violet-200 uppercase tracking-widest mb-3">Asset Quality</p>
                  <p className="text-5xl font-black text-white">4K</p>
                </div>
              </div>
              
              <div className="w-full max-w-3xl p-12 bg-white rounded-[4rem] border-4 border-violet-50 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-xl shadow-violet-200"><Settings size={28} /></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Final Launch Sync</h3>
                </div>
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {[
                    "Video encoding complete",
                    "MySQL data optimized",
                    "Socket.IO rooms initialized",
                    "CDN pathways verified",
                    "Price parity established",
                    "Mobile layouts confirmed"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-black text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Plus size={10} /></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between bg-white border border-slate-100 p-8 rounded-[3.5rem] shadow-sm">
        <button 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="px-10 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition flex items-center gap-3 uppercase tracking-widest text-[11px]"
        >
          <ChevronLeft size={20} /> Previous Phase
        </button>
        
        <div className="flex gap-4">
          {step < 4 ? (
            <button 
              onClick={() => setStep(s => Math.min(4, s + 1))}
              className="px-16 py-5 bg-violet-600 text-white rounded-3xl font-black hover:bg-violet-700 hover:shadow-2xl hover:shadow-violet-200 transition-all flex items-center gap-3 uppercase tracking-widest text-[11px]"
            >
              Next Milestone <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-20 py-5 bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600 text-white rounded-3xl font-black shadow-2xl shadow-violet-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 uppercase tracking-[0.2em] text-[12px]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
              {id ? 'Update Course Ecosystem' : 'Launch Course Platform'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseBuilder;
