import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, AlertCircle, CheckCircle,
  Download, Printer, Save, Check,
  ArrowUp, ArrowDown, ZoomIn, ZoomOut, RotateCcw,
  Briefcase, Github, Linkedin, Globe, Mail, Phone, MapPin,
  PlusCircle, Trash, Star, ExternalLink, Settings, Eye, EyeOff
} from 'lucide-react';

const ResumeBuilder = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [zoom, setZoom] = useState(100);

  const [sectionVisibility, setSectionVisibility] = useState({
    summary: true, skills: true, experience: true, projects: true,
    education: true, certifications: true, languages: true, achievements: true,
  });
  const [sectionOrder, setSectionOrder] = useState([
    'summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages', 'achievements',
  ]);

  const [experiences, setExperiences] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const previewRef = useRef(null);

  // Glass UI design tokens
  const glass = 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-pink-100/20 rounded-3xl';
  const glassElevated = 'bg-white/80 backdrop-blur-2xl border border-white/60 shadow-xl shadow-violet-100/20 rounded-3xl';
  const inputClass = 'w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium text-sm';
  const btnPrimary = 'px-5 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2 text-sm';
  const btnGlass = 'px-4 py-2.5 bg-white/60 border border-white/60 text-slate-700 hover:bg-white/80 rounded-2xl font-bold transition flex items-center gap-2 text-sm backdrop-blur-sm';

  const templatesList = [
    { id: 'modern',    name: 'Modern Professional', desc: 'Violet-accented corporate layout.' },
    { id: 'minimal',   name: 'Minimal ATS',         desc: 'Ultra-clean serif for ATS parsing.' },
    { id: 'software',  name: 'Software Engineer',    desc: 'Monospace dev style with tech stack.' },
    { id: 'ai_ml',     name: 'AI / ML Engineer',     desc: 'Indigo research theme.' },
    { id: 'fullstack', name: 'Full Stack Dev',       desc: 'Two-column rose sidebar layout.' },
    { id: 'fresher',   name: 'Fresher Resume',       desc: 'Education-first green academic.' },
    { id: 'corporate', name: 'Corporate Clean',      desc: 'Formal serif blue executive.' },
    { id: 'creative',  name: 'Creative Professional',desc: 'Gradient cards design theme.' },
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/profile/me');
      setProfile(res.data);
      const parsedResumeData = res.data.resumeData || {};
      const savedResumes = parsedResumeData.resumes || [];
      setResumes(savedResumes);
      if (savedResumes.length > 0) {
        const defaultResume = savedResumes.find(r => r.isDefault) || savedResumes[0];
        setActiveResumeId(defaultResume.id);
        setActiveTemplate(defaultResume.templateId || 'modern');
        if (defaultResume.sectionVisibility) setSectionVisibility(defaultResume.sectionVisibility);
        if (defaultResume.sectionOrder) setSectionOrder(defaultResume.sectionOrder);
      } else {
        const initialId = 'resume-' + Math.random().toString(36).substr(2, 9);
        const newResume = {
          id: initialId, title: 'My ATS Resume', templateId: 'modern', isDefault: true,
          sectionVisibility: { summary: true, skills: true, experience: true, projects: true, education: true, certifications: true, languages: true, achievements: true },
          sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages', 'achievements'],
        };
        setResumes([newResume]);
        setActiveResumeId(initialId);
      }
      setExperiences(parsedResumeData.experiences || []);
      setLanguages(parsedResumeData.languages || ['English']);
      setAchievements(parsedResumeData.achievements || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveResumeData = async (updatedResumes = resumes, showToast = true) => {
    try {
      const updatedResumeData = { resumes: updatedResumes, experiences, languages, achievements };
      const score = calculateAtsScore();
      await axios.put('http://localhost:5000/api/profile/resume-data', { resumeData: updatedResumeData, atsScore: score });
      if (showToast) toast.success('Resume saved!');
      setProfile(prev => prev ? { ...prev, resumeData: updatedResumeData, atsScore: score } : null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save settings');
    }
  };

  const handleTemplateChange = (templateId) => {
    setActiveTemplate(templateId);
    const updated = resumes.map(r => r.id === activeResumeId ? { ...r, templateId } : r);
    setResumes(updated);
    saveResumeData(updated, false);
  };

  const toggleVisibility = (section) => {
    const uv = { ...sectionVisibility, [section]: !sectionVisibility[section] };
    setSectionVisibility(uv);
    const updated = resumes.map(r => r.id === activeResumeId ? { ...r, sectionVisibility: uv } : r);
    setResumes(updated);
    saveResumeData(updated, false);
  };

  const moveSection = (index, direction) => {
    const newOrder = [...sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setSectionOrder(newOrder);
    const updated = resumes.map(r => r.id === activeResumeId ? { ...r, sectionOrder: newOrder } : r);
    setResumes(updated);
    saveResumeData(updated, false);
  };

  const handleAddNewResume = () => {
    const newId = 'resume-' + Math.random().toString(36).substr(2, 9);
    const newResume = {
      id: newId, title: `Resume v${resumes.length + 1}`, templateId: 'modern', isDefault: false,
      sectionVisibility: { ...sectionVisibility }, sectionOrder: [...sectionOrder],
    };
    const updated = [...resumes, newResume];
    setResumes(updated);
    setActiveResumeId(newId);
    setActiveTemplate('modern');
    saveResumeData(updated, true);
  };

  const handleDeleteResume = (id) => {
    if (resumes.length === 1) { toast.error('Keep at least one resume version'); return; }
    const updated = resumes.filter(r => r.id !== id);
    setResumes(updated);
    if (activeResumeId === id) {
      setActiveResumeId(updated[0].id);
      setActiveTemplate(updated[0].templateId || 'modern');
      if (updated[0].sectionVisibility) setSectionVisibility(updated[0].sectionVisibility);
      if (updated[0].sectionOrder) setSectionOrder(updated[0].sectionOrder);
    }
    saveResumeData(updated, true);
  };

  const handleSetDefault = (id) => {
    const updated = resumes.map(r => ({ ...r, isDefault: r.id === id }));
    setResumes(updated);
    saveResumeData(updated, true);
  };

  const handleSelectResume = (res) => {
    setActiveResumeId(res.id);
    setActiveTemplate(res.templateId || 'modern');
    if (res.sectionVisibility) setSectionVisibility(res.sectionVisibility);
    if (res.sectionOrder) setSectionOrder(res.sectionOrder);
    toast.success(`Loaded: ${res.title}`);
  };

  const handleRenameLocal = (id, val) => setResumes(resumes.map(r => r.id === id ? { ...r, title: val } : r));

  const handleAddExperience = () => {
    setExperiences([...experiences, {
      id: 'exp-' + Math.random().toString(36).substr(2, 9),
      role: 'Software Intern', company: 'Your Company', startDate: 'May 2025', endDate: 'Aug 2025',
      description: 'Built and maintained features for client-facing products using React & Node.',
    }]);
    toast.success('Experience draft added — press Save');
  };

  const handleEditExp = (id, field, value) =>
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));

  const handleDeleteExp = (id) => setExperiences(experiences.filter(e => e.id !== id));

  const handleAddLanguage = (lang) => {
    if (!lang.trim() || languages.includes(lang)) return;
    setLanguages([...languages, lang]);
  };

  const handleAddAchievement = (ach) => {
    if (!ach.trim()) return;
    setAchievements([...achievements, ach]);
  };

  const calculateAtsScore = () => {
    let score = 0;
    if (!profile) return 0;
    if (profile.user?.name)   score += 5;
    if (profile.user?.email)  score += 5;
    if (profile.mobile)       score += 5;
    if (profile.city || profile.state) score += 5;
    if (profile.user?.bio && profile.user.bio.length > 50) score += 15;
    else if (profile.user?.bio) score += 5;
    if (profile.education?.length > 0)   score += 15;
    if (profile.skills?.length >= 5)      score += 20;
    else if (profile.skills?.length > 0)  score += 10;
    if (profile.projects?.length >= 2)    score += 15;
    else if (profile.projects?.length > 0) score += 8;
    if (experiences.length > 0) score += 10;
    if (profile.user?.socialLinks && Object.keys(profile.user.socialLinks).length > 0) score += 5;
    return score;
  };

  const atsScore = calculateAtsScore();

  const getImprovementTips = () => {
    const tips = [];
    if (!profile) return [];
    if (!profile.user?.bio || profile.user.bio.length < 50) tips.push('Write a professional Summary (50+ chars).');
    if (!profile.education?.length) tips.push('Add Education details.');
    if (!profile.skills || profile.skills.length < 5) tips.push('Add at least 5 skills for keyword coverage.');
    if (!profile.projects || profile.projects.length < 2) tips.push('Feature at least 2 projects.');
    if (!experiences.length) tips.push('Add professional experience records.');
    if (!profile.user?.socialLinks?.linkedin) tips.push('Link your LinkedIn profile.');
    if (!profile.user?.socialLinks?.github)   tips.push('Add your GitHub URL.');
    return tips;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const html = previewRef.current.innerHTML;
    let styles = '';
    try {
      for (const sheet of document.styleSheets) {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) for (const rule of rules) styles += rule.cssText;
      }
    } catch { styles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n'); }
    printWindow.document.write(`<html><head><title>Resume</title><style>${styles}
      body{background:white!important;color:black!important;padding:0;margin:0;font-family:Inter,system-ui,sans-serif}
      @media print{body{background:white!important}}</style></head>
      <body><div style="padding:40px">${html}</div>
      <script>window.onload=function(){window.print();setTimeout(()=>window.close(),500)}<\/script></body></html>`);
    printWindow.document.close();
  };

  const handleDownloadDocx = () => {
    const source = 'data:application/vnd.ms-word;charset=utf-8,' +
      encodeURIComponent(`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'
        xmlns='http://www.w3.org/TR/REC-html40'><head><title>Resume</title><style>body{font-family:Arial;font-size:11pt;padding:20px}
        h1{font-size:20pt;font-weight:bold}h2{font-size:13pt;font-weight:bold;border-bottom:1px solid #ccc;margin-top:14px}
        </style></head><body>${previewRef.current.innerHTML}</body></html>`);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = source;
    a.download = `${resumes.find(r => r.id === activeResumeId)?.title || 'Resume'}.doc`;
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 animate-spin flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#F6EAF4]" />
        </div>
        <p className="text-slate-600 font-bold">Loading your profile data…</p>
      </div>
    );
  }

  const improvementTips = getImprovementTips();
  const name         = profile?.user?.name  || 'Your Name';
  const email        = profile?.user?.email || 'email@example.com';
  const phone        = profile?.mobile      || '';
  const bio          = profile?.user?.bio   || '';
  const locationText = (profile?.city && profile?.state) ? `${profile.city}, ${profile.state}` : (profile?.user?.location || '');
  const githubUrl    = profile?.user?.socialLinks?.github    || '';
  const linkedinUrl  = profile?.user?.socialLinks?.linkedin  || '';
  const portfolioUrl = profile?.user?.socialLinks?.portfolio || profile?.user?.socialLinks?.website || '';
  const skillsList   = profile?.skills        || [];
  const educationList= profile?.education     || [];
  const projectsList = profile?.projects      || [];
  const certsList    = profile?.certifications|| [];

  // ── Resume template section renderer ─────────────────────────────────────────
  const renderSections = (style = 'modern') => sectionOrder.map((sec) => {
    if (!sectionVisibility[sec]) return null;

    const colors = {
      modern: { accent: 'bg-violet-600', h: 'border-b border-slate-200 pb-1 text-slate-900 uppercase tracking-wider font-black text-[13px]' },
      indigo: { accent: 'text-indigo-700', h: 'text-xs font-black text-indigo-700 uppercase tracking-widest mb-1' },
      rose:   { accent: 'bg-rose-600', h: 'text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5' },
      serif:  { accent: '', h: 'text-[11.5px] font-bold text-indigo-950 uppercase tracking-wider border-b border-slate-200 pb-0.5' },
      creative: { accent: 'bg-pink-500', h: 'text-[13px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5' },
      emerald: { accent: 'border-emerald-600', h: 'text-xs font-black text-slate-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-2' },
    };
    const c = colors[style] || colors.modern;

    const DotViolet = () => <span className="w-1.5 h-3 bg-violet-600 rounded-full" />;
    const DotRose   = () => <span className="w-1 h-3 bg-rose-600 rounded-full" />;
    const DotPink   = () => <span className="w-2 h-2 rounded-full bg-pink-500" />;

    if (sec === 'summary' && bio) return (
      <div key={sec} className="space-y-1.5">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          {style === 'rose' && <DotRose />}
          {style === 'creative' && <DotPink />}
          {style === 'indigo' ? 'Research Focus' : style === 'serif' ? 'Executive Profile' : style === 'creative' ? 'My Story' : 'Professional Summary'}
        </h2>
        <p className="text-slate-600 font-medium leading-relaxed text-xs">{bio}</p>
      </div>
    );

    if (sec === 'skills' && skillsList.length > 0) return (
      <div key={sec} className="space-y-1.5">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          {style === 'rose' && <DotRose />}
          {style === 'creative' && <DotPink />}
          {style === 'indigo' ? 'Frameworks & Toolkits' : style === 'serif' ? 'Core Competencies' : style === 'creative' ? 'Creative Arsenal' : 'Core Skills'}
        </h2>
        {style === 'serif'
          ? <p className="text-slate-800 font-sans text-xs">{skillsList.map(s => s.name).join('  |  ')}</p>
          : <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsList.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg font-bold text-[10px] border bg-slate-50 border-slate-200/65 text-slate-700">
                  {skill.name} <span className="text-[8px] uppercase tracking-widest pl-1 font-black opacity-60">({skill.level})</span>
                </span>
              ))}
            </div>
        }
      </div>
    );

    if (sec === 'experience' && experiences.length > 0) return (
      <div key={sec} className="space-y-2.5">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          {style === 'rose' && <DotRose />}
          {style === 'creative' && <DotPink />}
          {style === 'indigo' ? 'R&D Experience' : style === 'serif' ? 'Professional Career' : style === 'creative' ? 'Career Journey' : 'Work Experience'}
        </h2>
        <div className="space-y-2.5">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className={style === 'creative' ? 'p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1' : 'space-y-0.5'}>
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-black text-slate-800">{exp.role}</h4>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-violet-600 bg-violet-50">{exp.startDate} – {exp.endDate}</span>
              </div>
              {style !== 'serif' && <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest">{exp.company}</p>}
              <p className="text-slate-600 font-medium text-[11px] leading-relaxed pl-2 border-l border-slate-100">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    );

    if (sec === 'projects' && projectsList.length > 0) return (
      <div key={sec} className="space-y-2">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          {style === 'rose' && <DotRose />}
          {style === 'creative' && <DotPink />}
          {style === 'creative' ? 'Live Builds' : style === 'indigo' ? 'AI & Deep Learning Projects' : 'Projects'}
        </h2>
        <div className="space-y-2">
          {projectsList.map((proj, idx) => (
            <div key={proj.id || idx} className="p-2.5 bg-slate-50/50 border border-slate-200/40 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-black text-slate-800">{proj.title}</h4>
                {proj.repoLink && <a href={proj.repoLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-violet-600 hover:underline flex items-center gap-0.5">Repo <ExternalLink size={8} /></a>}
              </div>
              <p className="text-slate-600 font-medium text-[11px] leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    );

    if (sec === 'education' && educationList.length > 0) return (
      <div key={sec} className="space-y-2">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          {style === 'rose' && <DotRose />}
          {style === 'creative' && <DotPink />}
          Education
        </h2>
        <div className="space-y-2">
          {educationList.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between items-start text-xs border-l-2 border-slate-100 pl-3">
              <div>
                <h4 className="font-black text-slate-800">{edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}</h4>
                <p className="text-[10px] text-slate-400 font-bold">{edu.institution}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 font-black">{edu.startYear} – {edu.endYear}</span>
                {edu.cgpa && <p className="text-[10px] text-violet-600 font-black mt-0.5">GPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (sec === 'certifications' && certsList.length > 0) return (
      <div key={sec} className="space-y-2">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          Certifications
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {certsList.map((cert, idx) => (
            <div key={cert.id || idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200/40">
              <h4 className="font-black text-slate-800 text-[10px] leading-tight">{cert.title}</h4>
              <p className="text-[9px] text-slate-400 font-bold">{cert.issuingOrg}</p>
            </div>
          ))}
        </div>
      </div>
    );

    if (sec === 'languages' && languages.length > 0) return (
      <div key={sec} className="space-y-1.5">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          Languages
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang, idx) => (
            <span key={idx} className="px-2.5 py-1 border border-violet-100 bg-violet-50/50 text-violet-700 rounded-lg text-[10px] font-bold">{lang}</span>
          ))}
        </div>
      </div>
    );

    if (sec === 'achievements' && achievements.length > 0) return (
      <div key={sec} className="space-y-1.5">
        <h2 className={`flex items-center gap-2 ${c.h}`}>
          {style === 'modern' && <DotViolet />}
          Achievements
        </h2>
        <ul className="list-disc list-inside text-slate-650 text-[11px] space-y-0.5 font-medium">
          {achievements.map((ach, idx) => <li key={idx} className="marker:text-violet-500">{ach}</li>)}
        </ul>
      </div>
    );

    return null;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 relative">

      {/* Ambient glowing blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-pink-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">ATS Resume</span> Builder
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-1">Create, optimize, and export ATS-friendly resumes from your profile</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleAddNewResume} className={btnPrimary}>
              <PlusCircle size={14} /> New Version
            </button>
            <button onClick={() => saveResumeData()} className={btnGlass}>
              <Save size={14} /> Save Config
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* ATS Score Widget */}
            <div className="relative overflow-hidden rounded-3xl p-6 border border-white/40 shadow-xl"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.9) 0%, rgba(217,70,239,0.85) 50%, rgba(236,72,153,0.85) 100%)' }}>
              {/* Ambient glow inside */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              <h3 className="text-sm font-black uppercase tracking-wider text-white/80 mb-5 flex items-center gap-2 relative z-10">
                <Sparkles size={16} className="text-white" /> ATS Scoring Matrix
              </h3>

              <div className="flex items-center gap-6 relative z-10">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="white" strokeWidth="8" fill="transparent"
                      strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                      strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-white">{atsScore}%</span>
                    <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Match</span>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h4 className="text-base font-black text-white">
                    {atsScore >= 80 ? '🎉 Excellent!' : atsScore >= 60 ? '⚡ Good Progress' : '🔧 Needs Work'}
                  </h4>
                  <p className="text-xs text-white/70 font-bold leading-relaxed">
                    Based on contact info, summary, skills count, projects, education & social links.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg w-max">
                    <CheckCircle size={10} /> Profile: {atsScore >= 80 ? 'Strong' : 'Improvable'}
                  </div>
                </div>
              </div>

              {improvementTips.length > 0 && (
                <div className="mt-5 border-t border-white/20 pt-4 space-y-2 relative z-10">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-wider mb-2">Recommendations</p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {improvementTips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start bg-white/10 backdrop-blur-sm p-2.5 rounded-xl text-xs text-white/80">
                        <AlertCircle size={12} className="text-yellow-300 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resume Versions */}
            <div className={`${glass} p-6 space-y-4`}>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-violet-500" /> Saved Resume Versions
              </h3>
              <div className="space-y-2">
                {resumes.map((res) => (
                  <div key={res.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      activeResumeId === res.id
                        ? 'bg-gradient-to-r from-violet-500/10 to-pink-500/5 border-violet-300/40 shadow-sm'
                        : 'bg-white/40 border-white/40 hover:border-violet-200'
                    }`}>
                    <div className="flex-1 min-w-0">
                      <input type="text" value={res.title}
                        onChange={(e) => handleRenameLocal(res.id, e.target.value)}
                        onBlur={() => saveResumeData(resumes, false)}
                        className="bg-transparent border-none outline-none font-bold text-sm text-slate-800 w-full p-0 leading-tight" />
                      <div className="flex items-center gap-2 mt-0.5">
                        {res.isDefault && <span className="text-[9px] font-black text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Default</span>}
                        <span className="text-[10px] text-slate-400 font-bold capitalize">{res.templateId} layout</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleSelectResume(res)}
                        className={`p-1.5 rounded-xl transition ${activeResumeId === res.id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50'}`}>
                        <Check size={13} />
                      </button>
                      {!res.isDefault && (
                        <button onClick={() => handleSetDefault(res.id)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition">
                          <Star size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDeleteResume(res.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition">
                        <Trash size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Selector */}
            <div className={`${glass} p-6 space-y-4`}>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Settings size={16} className="text-violet-500" /> Choose Template
              </h3>
              <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {templatesList.map((tpl) => (
                  <button key={tpl.id} onClick={() => handleTemplateChange(tpl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      activeTemplate === tpl.id
                        ? 'bg-gradient-to-br from-violet-500/15 to-pink-500/10 border-violet-300/50 shadow-md ring-2 ring-violet-400/20'
                        : 'bg-white/40 border-white/40 hover:border-violet-200 hover:bg-white/60'
                    }`}>
                    <p className="font-black text-xs text-slate-800 leading-tight">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-1">{tpl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience / Languages / Achievements */}
            <div className={`${glass} p-6 space-y-6`}>

              {/* Experience */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Briefcase size={15} className="text-violet-500" /> Work Experience
                </h3>
                <p className="text-xs text-slate-400 font-bold mb-4">Add jobs/internships not in your profile</p>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-3.5 bg-white/40 border border-white/60 rounded-2xl relative space-y-2">
                      <button onClick={() => handleDeleteExp(exp.id)} className="absolute top-2.5 right-2.5 p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition">
                        <Trash size={12} />
                      </button>
                      <input type="text" placeholder="Role" value={exp.role} onChange={(e) => handleEditExp(exp.id, 'role', e.target.value)}
                        className="w-full bg-transparent border-b border-white/60 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-400" />
                      <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleEditExp(exp.id, 'company', e.target.value)}
                        className="w-full bg-transparent border-b border-white/60 py-1 text-xs text-slate-600 focus:outline-none focus:border-violet-400" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="Start" value={exp.startDate} onChange={(e) => handleEditExp(exp.id, 'startDate', e.target.value)}
                          className="w-1/2 bg-transparent border-b border-white/60 py-1 text-[11px] text-slate-500 focus:outline-none" />
                        <input type="text" placeholder="End" value={exp.endDate} onChange={(e) => handleEditExp(exp.id, 'endDate', e.target.value)}
                          className="w-1/2 bg-transparent border-b border-white/60 py-1 text-[11px] text-slate-500 focus:outline-none" />
                      </div>
                      <textarea placeholder="Description" value={exp.description} onChange={(e) => handleEditExp(exp.id, 'description', e.target.value)}
                        rows={2} className="w-full bg-white/30 border border-white/50 rounded-xl p-2 text-[11px] text-slate-500 focus:outline-none resize-none" />
                    </div>
                  ))}
                  <button onClick={handleAddExperience}
                    className="w-full py-2.5 bg-violet-50/60 hover:bg-violet-100/60 border border-violet-100 rounded-2xl text-xs font-black text-violet-700 transition flex items-center justify-center gap-2">
                    <PlusCircle size={13} /> Add Experience Record
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div className="border-t border-white/40 pt-5">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Achievements</h3>
                <div className="space-y-2">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 bg-white/40 border border-white/50 p-2.5 rounded-xl">
                      <span className="font-medium text-slate-700 text-xs">{ach}</span>
                      <button onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))} className="text-rose-400 hover:text-rose-600 transition shrink-0">
                        <Trash size={11} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" id="new-ach-input" placeholder="Enter achievement…" className={inputClass}
                      onKeyDown={(e) => { if (e.key === 'Enter') { handleAddAchievement(e.target.value); e.target.value = ''; } }} />
                    <button onClick={() => { const inp = document.getElementById('new-ach-input'); handleAddAchievement(inp.value); inp.value = ''; }}
                      className="px-3 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl text-xs font-bold shrink-0">Add</button>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="border-t border-white/40 pt-5">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Languages</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {languages.map((lang, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-violet-100/60 border border-violet-200/40 text-violet-700 rounded-full text-xs font-bold">
                      {lang}
                      <button onClick={() => setLanguages(languages.filter((_, i) => i !== idx))} className="text-violet-400 hover:text-violet-700 transition ml-0.5">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" id="new-lang-input" placeholder="e.g. French…" className={inputClass}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleAddLanguage(e.target.value); e.target.value = ''; } }} />
                  <button onClick={() => { const inp = document.getElementById('new-lang-input'); handleAddLanguage(inp.value); inp.value = ''; }}
                    className="px-3 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl text-xs font-bold shrink-0">Add</button>
                </div>
              </div>

              <button onClick={() => saveResumeData()}
                className="w-full py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 rounded-2xl text-sm font-black text-white shadow-lg shadow-violet-300/30 transition flex items-center justify-center gap-2">
                <Save size={15} /> Commit Changes to Database
              </button>
            </div>

            {/* Section Order & Visibility */}
            <div className={`${glass} p-6 space-y-4`}>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Settings size={16} className="text-violet-500" /> Section Order & Visibility
              </h3>
              <p className="text-xs text-slate-400 font-bold">Toggle visibility • reorder with arrows</p>
              <div className="space-y-2">
                {sectionOrder.map((section, idx) => (
                  <div key={section} className="flex items-center justify-between p-3 bg-white/40 border border-white/50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleVisibility(section)}
                        className={`p-1.5 rounded-xl transition ${sectionVisibility[section] ? 'text-violet-600 hover:text-violet-800 hover:bg-violet-50' : 'text-slate-300 hover:text-slate-500'}`}>
                        {sectionVisibility[section] ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <span className={`font-bold text-sm capitalize ${sectionVisibility[section] ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{section}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveSection(idx, -1)} disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition">
                        <ArrowUp size={12} />
                      </button>
                      <button onClick={() => moveSection(idx, 1)} disabled={idx === sectionOrder.length - 1}
                        className="p-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition">
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (preview) ── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Toolbar */}
            <div className={`${glass} p-4 flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition"><ZoomOut size={15} /></button>
                <span className="text-xs font-black text-slate-700 w-12 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition"><ZoomIn size={15} /></button>
                <button onClick={() => setZoom(100)} className="p-1.5 text-slate-400 hover:text-violet-600 rounded-xl transition"><RotateCcw size={13} /></button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className={btnGlass}><Printer size={14} /> Print / PDF</button>
                <button onClick={handleDownloadDocx}
                  className="px-4 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl text-sm font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2">
                  <Download size={14} /> DOCX
                </button>
              </div>
            </div>

            {/* A4 Preview Sheet */}
            <div className={`${glass} p-6 overflow-auto max-h-[920px]`}
              style={{ background: 'rgba(255,255,255,0.4)' }}>
              <div
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s' }}
                className="bg-white shadow-2xl p-10 text-slate-800 rounded-sm border border-slate-200/80 w-[794px] min-h-[1123px] shrink-0 mx-auto"
                id="resume-preview-container"
                ref={previewRef}
              >
                {/* ── TEMPLATE 1: MINIMAL ATS ── */}
                {activeTemplate === 'minimal' && (
                  <div className="space-y-5 text-[11px] text-slate-950 font-serif leading-relaxed">
                    <div className="text-center space-y-1 pb-3 border-b border-slate-900">
                      <h1 className="text-2xl font-bold uppercase tracking-wide">{name}</h1>
                      <p className="font-sans text-[10.5px]">{[phone, email, locationText].filter(Boolean).join(' • ')}</p>
                      <div className="flex items-center justify-center gap-3 text-[10px] pt-0.5 font-sans text-slate-700">
                        {githubUrl && <span>GitHub: {githubUrl.replace('https://', '')}</span>}
                        {linkedinUrl && <span>LinkedIn: {linkedinUrl.replace('https://', '')}</span>}
                        {portfolioUrl && <span>Portfolio: {portfolioUrl.replace('https://', '')}</span>}
                      </div>
                    </div>
                    {sectionOrder.map((sec) => {
                      if (!sectionVisibility[sec]) return null;
                      const H = ({ children }) => <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1">{children}</h2>;
                      if (sec === 'summary' && bio) return <div key={sec}><H>Summary</H><p className="font-sans text-slate-800">{bio}</p></div>;
                      if (sec === 'skills' && skillsList.length > 0) return <div key={sec}><H>Skills</H><p className="font-sans"><strong>Key: </strong>{skillsList.map(s => `${s.name}`).join(', ')}</p></div>;
                      if (sec === 'experience' && experiences.length > 0) return (
                        <div key={sec}><H>Work History</H>
                          {experiences.map((exp, i) => (
                            <div key={exp.id || i} className="mb-1.5">
                              <div className="flex justify-between font-bold"><span>{exp.role} — {exp.company}</span><span>{exp.startDate}–{exp.endDate}</span></div>
                              <p className="font-sans text-slate-700 pl-1">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      );
                      if (sec === 'projects' && projectsList.length > 0) return (
                        <div key={sec}><H>Projects</H>
                          {projectsList.map((proj, i) => (
                            <div key={proj.id || i} className="mb-1.5">
                              <div className="flex justify-between font-bold"><span>{proj.title}</span></div>
                              <p className="font-sans text-slate-700 pl-1">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      );
                      if (sec === 'education' && educationList.length > 0) return (
                        <div key={sec}><H>Education</H>
                          {educationList.map((edu, i) => (
                            <div key={edu.id || i} className="flex justify-between">
                              <span><strong>{edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}</strong> | {edu.institution}</span>
                              <span className="font-bold">{edu.startYear}–{edu.endYear}{edu.cgpa ? ` (CGPA: ${edu.cgpa})` : ''}</span>
                            </div>
                          ))}
                        </div>
                      );
                      if (sec === 'certifications' && certsList.length > 0) return (
                        <div key={sec}><H>Certifications</H>
                          <ul className="list-disc list-inside font-sans text-slate-850 space-y-0.5">
                            {certsList.map((cert, i) => <li key={cert.id || i}><strong>{cert.title}</strong> — {cert.issuingOrg}</li>)}
                          </ul>
                        </div>
                      );
                      if (sec === 'languages' && languages.length > 0) return <div key={sec}><H>Languages</H><p className="font-sans">{languages.join(', ')}</p></div>;
                      if (sec === 'achievements' && achievements.length > 0) return (
                        <div key={sec}><H>Achievements</H>
                          <ul className="list-disc list-inside font-sans space-y-0.5">{achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
                        </div>
                      );
                      return null;
                    })}
                  </div>
                )}

                {/* ── TEMPLATE 2: MODERN PROFESSIONAL ── */}
                {activeTemplate === 'modern' && (
                  <div className="space-y-5 text-slate-800 leading-relaxed font-sans text-xs">
                    <div className="border-l-4 border-violet-600 pl-4 py-1.5 space-y-1">
                      <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{name}</h1>
                      <p className="text-xs text-violet-700 font-black tracking-widest uppercase">{profile?.headline || 'Tech Professional'}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 font-bold text-[10px] pt-1">
                        {phone && <span className="flex items-center gap-1"><Phone size={10}/> {phone}</span>}
                        {email && <span className="flex items-center gap-1"><Mail size={10}/> {email}</span>}
                        {locationText && <span className="flex items-center gap-1"><MapPin size={10}/> {locationText}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] pt-0.5">
                        {githubUrl && <span className="flex items-center gap-1 text-violet-600/80"><Github size={10}/> {githubUrl.replace('https://', '')}</span>}
                        {linkedinUrl && <span className="flex items-center gap-1 text-violet-600/80"><Linkedin size={10}/> {linkedinUrl.replace('https://', '')}</span>}
                      </div>
                    </div>
                    {renderSections('modern')}
                  </div>
                )}

                {/* ── TEMPLATE 3: SOFTWARE ENGINEER ── */}
                {activeTemplate === 'software' && (
                  <div className="space-y-4 text-slate-800 leading-relaxed font-mono text-[11px]">
                    <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-end">
                      <div>
                        <h1 className="text-2xl font-black text-slate-900 font-sans uppercase">{name}</h1>
                        <p className="text-[10px] text-indigo-700 uppercase tracking-wider font-bold mt-0.5">&lt; {profile?.headline || 'Software Engineer'} /&gt;</p>
                      </div>
                      <div className="text-right text-[9px] text-slate-600 font-sans">
                        <div>{phone}{phone && email && ' | '}{email}</div>
                        <div>{locationText}</div>
                      </div>
                    </div>
                    {sectionOrder.map((sec) => {
                      if (!sectionVisibility[sec]) return null;
                      const H = ({ c }) => <h2 className="text-[12px] font-bold text-slate-900 font-sans uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">// {c}</h2>;
                      if (sec === 'summary' && bio) return <div key={sec}><H c="Summary" /><p className="text-slate-650 leading-relaxed font-sans">{bio}</p></div>;
                      if (sec === 'skills' && skillsList.length > 0) return <div key={sec}><H c="Tech Stack" /><div className="flex flex-wrap gap-1.5 pt-1">{skillsList.map((s, i) => <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">{s.name}</span>)}</div></div>;
                      if (sec === 'experience' && experiences.length > 0) return <div key={sec}><H c="Experience" /><div className="space-y-2">{experiences.map((exp, i) => (<div key={exp.id || i}><div className="flex justify-between font-sans font-bold text-[10px]"><span>{exp.role} @ {exp.company}</span><span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{exp.startDate}-{exp.endDate}</span></div><p className="text-slate-650 pl-2 border-l border-indigo-200 leading-normal font-sans">{exp.description}</p></div>))}</div></div>;
                      if (sec === 'projects' && projectsList.length > 0) return <div key={sec}><H c="Projects" /><div className="space-y-2 font-sans">{projectsList.map((proj, i) => (<div key={proj.id || i} className="p-2 bg-indigo-50/20 border border-indigo-100 rounded-lg"><div className="flex justify-between font-bold text-[10px]"><span>{proj.title}</span>{proj.repoLink && <a href={proj.repoLink} className="font-mono text-indigo-650">repo »</a>}</div><p className="text-slate-600 text-[10.5px] leading-relaxed">{proj.description}</p></div>))}</div></div>;
                      if (sec === 'education' && educationList.length > 0) return <div key={sec}><H c="Education" />{educationList.map((edu, i) => (<div key={edu.id || i} className="flex justify-between items-start font-sans"><div><span className="font-bold">{edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}</span><p className="text-[10px] text-slate-500">{edu.institution}</p></div><div className="text-right"><span>{edu.startYear}-{edu.endYear}</span>{edu.cgpa && <p className="text-indigo-600 font-bold">GPA: {edu.cgpa}</p>}</div></div>))}</div>;
                      if (sec === 'certifications' && certsList.length > 0) return <div key={sec}><H c="Credentials" /><div className="grid grid-cols-2 gap-2 font-sans">{certsList.map((cert, i) => <div key={cert.id || i} className="p-1.5 bg-slate-50 border border-slate-100 rounded text-[9.5px]"><h4 className="font-bold">{cert.title}</h4><p className="text-slate-450">{cert.issuingOrg}</p></div>)}</div></div>;
                      if (sec === 'languages' && languages.length > 0) return <div key={sec}><H c="Languages" /><p className="text-slate-700 font-sans">{languages.join(', ')}</p></div>;
                      if (sec === 'achievements' && achievements.length > 0) return <div key={sec}><H c="Achievements" /><ul className="list-disc list-inside space-y-0.5 text-slate-650 font-sans">{achievements.map((a, i) => <li key={i}>{a}</li>)}</ul></div>;
                      return null;
                    })}
                  </div>
                )}

                {/* ── TEMPLATE 4: AI/ML ── */}
                {activeTemplate === 'ai_ml' && (
                  <div className="space-y-4 text-slate-800 font-sans text-xs leading-relaxed">
                    <div className="text-center border-b-4 border-indigo-600 pb-3">
                      <h1 className="text-3xl font-black text-slate-950">{name}</h1>
                      <p className="text-[10px] text-indigo-650 font-black tracking-widest uppercase mt-1">AI &amp; Machine Learning Engineer</p>
                      <div className="flex justify-center gap-3 text-[10px] text-slate-500 pt-2">
                        {[phone, email, locationText].filter(Boolean).join(' • ')}
                      </div>
                    </div>
                    {renderSections('indigo')}
                  </div>
                )}

                {/* ── TEMPLATE 5: FULL STACK ── */}
                {activeTemplate === 'fullstack' && (
                  <div className="text-slate-800 font-sans text-xs leading-relaxed">
                    <div className="border-b-2 border-slate-200 pb-3 flex justify-between items-center mb-5">
                      <div><h1 className="text-3xl font-black text-slate-900 uppercase">{name}</h1><p className="text-xs text-rose-600 font-black uppercase">{profile?.headline || 'Full Stack Engineer'}</p></div>
                      <div className="text-right text-[10px] text-slate-500 font-bold"><div>{phone}{phone && email && ' | '}{email}</div><div>{locationText}</div></div>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-4 space-y-4 border-r border-slate-100 pr-4">
                        {githubUrl && <div className="text-[9.5px] font-bold text-rose-600 truncate">Github: {githubUrl.replace('https://', '')}</div>}
                        {linkedinUrl && <div className="text-[9.5px] font-bold text-rose-600 truncate">LinkedIn: {linkedinUrl.replace('https://', '')}</div>}
                        {sectionVisibility.skills && skillsList.length > 0 && <div><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-0.5 mb-1">Core Tech</h3><div className="flex flex-wrap gap-1">{skillsList.map((s, i) => <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200/50 rounded-lg text-slate-700 font-bold text-[9.5px]">{s.name}</span>)}</div></div>}
                        {sectionVisibility.education && educationList.length > 0 && <div><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-0.5 mb-1">Education</h3>{educationList.map((edu, i) => <div key={edu.id || i} className="text-[10px] leading-snug"><p className="font-black">{edu.degree}</p><p className="text-slate-500">{edu.institution}</p><p className="text-rose-600 font-bold">{edu.startYear}–{edu.endYear}</p></div>)}</div>}
                      </div>
                      <div className="col-span-8 space-y-3">
                        {renderSections('rose')}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TEMPLATE 6: FRESHER ── */}
                {activeTemplate === 'fresher' && (
                  <div className="space-y-4 text-slate-800 font-sans text-xs leading-relaxed">
                    <div className="text-center space-y-1 pb-3 border-b-2 border-emerald-600">
                      <h1 className="text-2xl font-black text-slate-950 uppercase">{name}</h1>
                      <p className="text-[10px] text-emerald-700 font-black tracking-widest uppercase">Entry-Level Graduate</p>
                      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-500 font-bold text-[10px] pt-1">
                        {phone && <span>{phone}</span>}{email && <span>{email}</span>}{locationText && <span>{locationText}</span>}
                      </div>
                    </div>
                    {['summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'languages', 'achievements'].map((sec) => {
                      if (!sectionVisibility[sec]) return null;
                      const H = ({ c }) => <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-2 mb-1">{c}</h2>;
                      if (sec === 'summary' && bio) return <div key={sec}><H c="Objective" /><p className="text-slate-600 font-medium">{bio}</p></div>;
                      if (sec === 'education' && educationList.length > 0) return <div key={sec}><H c="Education" />{educationList.map((edu, i) => <div key={edu.id || i} className="flex justify-between items-start border-l border-slate-100 pl-2 mb-1"><div><h4 className="font-black">{edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}</h4><p className="text-[10px] text-slate-400">{edu.institution}</p></div><div className="text-right"><span className="font-black">{edu.startYear}–{edu.endYear}</span>{edu.cgpa && <p className="text-emerald-650 font-black text-[10px]">CGPA: {edu.cgpa}</p>}</div></div>)}</div>;
                      if (sec === 'skills' && skillsList.length > 0) return <div key={sec}><H c="Skills" /><div className="flex flex-wrap gap-1.5 pt-1">{skillsList.map((s, i) => <span key={i} className="px-2.5 py-1 bg-emerald-50/20 border border-emerald-100/50 font-bold rounded text-[9.5px]">{s.name}</span>)}</div></div>;
                      if (sec === 'projects' && projectsList.length > 0) return <div key={sec}><H c="Academic Projects" />{projectsList.map((proj, i) => <div key={proj.id || i} className="p-2.5 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1 mb-2"><div className="flex justify-between"><h4 className="font-black">{proj.title}</h4></div><p className="text-slate-650 text-[11px]">{proj.description}</p></div>)}</div>;
                      if (sec === 'experience' && experiences.length > 0) return <div key={sec}><H c="Internships" />{experiences.map((exp, i) => <div key={exp.id || i} className="mb-1.5"><div className="flex justify-between"><h4 className="font-black">{exp.role}</h4><span className="text-emerald-600 font-bold text-[9.5px]">{exp.startDate}–{exp.endDate}</span></div><p className="text-[9.5px] text-slate-400 uppercase tracking-widest">{exp.company}</p><p className="text-slate-650 text-[11px] pl-2 border-l border-slate-100">{exp.description}</p></div>)}</div>;
                      if (sec === 'certifications' && certsList.length > 0) return <div key={sec}><H c="Certificates" /><ul className="list-disc list-inside text-slate-600 space-y-0.5">{certsList.map((cert, i) => <li key={cert.id || i} className="marker:text-emerald-500"><strong>{cert.title}</strong> – {cert.issuingOrg}</li>)}</ul></div>;
                      if (sec === 'languages' && languages.length > 0) return <div key={sec}><H c="Languages" /><p className="text-slate-700">{languages.join(', ')}</p></div>;
                      if (sec === 'achievements' && achievements.length > 0) return <div key={sec}><H c="Honors" /><ul className="list-disc list-inside text-slate-650 space-y-0.5">{achievements.map((a, i) => <li key={i} className="marker:text-emerald-500">{a}</li>)}</ul></div>;
                      return null;
                    })}
                  </div>
                )}

                {/* ── TEMPLATE 7: CORPORATE ── */}
                {activeTemplate === 'corporate' && (
                  <div className="space-y-5 text-slate-900 font-serif text-[11px] leading-relaxed">
                    <div className="border-b-2 border-slate-900 pb-2 text-center space-y-1">
                      <h1 className="text-2xl font-bold uppercase tracking-wider text-indigo-950">{name}</h1>
                      <p className="text-[10px] font-sans font-black text-slate-500 tracking-widest uppercase">{profile?.headline || 'Corporate Professional'}</p>
                      <p className="text-[10px] font-sans text-slate-700">{[phone, email, locationText].filter(Boolean).join(' | ')}</p>
                    </div>
                    {renderSections('serif')}
                  </div>
                )}

                {/* ── TEMPLATE 8: CREATIVE ── */}
                {activeTemplate === 'creative' && (
                  <div className="space-y-5 text-slate-800 font-sans text-xs leading-relaxed">
                    <div className="bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 rounded-2xl p-5 border border-indigo-100 flex justify-between items-center">
                      <div><h1 className="text-3xl font-black text-slate-900 uppercase">{name}</h1><p className="text-xs text-indigo-700 font-extrabold tracking-widest uppercase">{profile?.headline || 'Creative Talent'}</p></div>
                      <div className="text-right text-[10px] text-slate-600 font-bold space-y-0.5">
                        {phone && <div className="flex items-center gap-1 justify-end"><Phone size={10}/> {phone}</div>}
                        {email && <div className="flex items-center gap-1 justify-end"><Mail size={10}/> {email}</div>}
                      </div>
                    </div>
                    {renderSections('creative')}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
