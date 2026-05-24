import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, Book, Award, Link as LinkIcon, Camera, Edit2, MapPin, Mail, Phone, Calendar, 
  Briefcase, Trash2, Plus, Save, Sparkles, Star, Github, Linkedin, Globe, FileText, CheckCircle
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Form states
  const [personalForm, setPersonalForm] = useState({
    name: '',
    bio: '',
    location: '',
    gender: 'MALE',
    dob: '',
    mobile: '',
    whatsapp: '',
    parentContact: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [socialForm, setSocialForm] = useState({
    github: '',
    linkedin: '',
    portfolio: ''
  });

  // Skills input states
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('INTERMEDIATE');

  // Education input states
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    branch: '',
    cgpa: '',
    startYear: '',
    endYear: '',
    isCurrent: false
  });

  // Projects input states
  const [showAddProj, setShowAddProj] = useState(false);
  const [projForm, setProjForm] = useState({
    title: '',
    description: '',
    repoLink: '',
    demoLink: '',
    techStackInput: '' // comma-separated strings
  });

  // Certifications input states
  const [showAddCert, setShowAddCert] = useState(false);
  const [certForm, setCertForm] = useState({
    title: '',
    issuingOrg: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  // Fetch student profile on mount
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/profile/me');
      const data = res.data;
      setProfile(data);

      // Initialize forms
      setPersonalForm({
        name: data.user?.name || '',
        bio: data.user?.bio || '',
        location: data.user?.location || '',
        gender: data.gender || 'MALE',
        dob: data.dob ? data.dob.split('T')[0] : '',
        mobile: data.mobile || '',
        whatsapp: data.whatsapp || '',
        parentContact: data.parentContact || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || ''
      });

      const links = data.user?.socialLinks || {};
      setSocialForm({
        github: links.github || '',
        linkedin: links.linkedin || '',
        portfolio: links.portfolio || links.website || ''
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save personal information
  const handleSavePersonal = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/profile/personal', {
        ...personalForm,
        socialLinks: {
          ...profile?.user?.socialLinks,
          ...socialForm
        }
      });
      toast.success('Personal information updated!');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save personal info');
    }
  };

  // Save social links
  const handleSaveSocial = async () => {
    try {
      await axios.put('http://localhost:5000/api/profile/personal', {
        name: personalForm.name,
        bio: personalForm.bio,
        location: personalForm.location,
        socialLinks: socialForm
      });
      toast.success('Social profiles saved!');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save social links');
    }
  };

  // Add a skill
  const handleAddSkill = async () => {
    if (!newSkillName.trim()) {
      toast.error('Skill name cannot be empty');
      return;
    }

    const exists = profile?.skills?.some(s => s.name.toLowerCase() === newSkillName.toLowerCase().trim());
    if (exists) {
      toast.error('Skill already added');
      return;
    }

    try {
      const updatedSkills = [
        ...(profile?.skills?.map(s => ({ name: s.name, level: s.level })) || []),
        { name: newSkillName.trim(), level: newSkillLevel }
      ];

      await axios.put('http://localhost:5000/api/profile/skills', { skills: updatedSkills });
      toast.success('Skill added!');
      setNewSkillName('');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add skill');
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (skillName) => {
    try {
      const updatedSkills = profile?.skills
        ?.filter(s => s.name !== skillName)
        ?.map(s => ({ name: s.name, level: s.level })) || [];

      await axios.put('http://localhost:5000/api/profile/skills', { skills: updatedSkills });
      toast.success('Skill removed');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete skill');
    }
  };

  // Add education record
  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/profile/education', eduForm);
      toast.success('Education record added!');
      setShowAddEdu(false);
      setEduForm({
        institution: '',
        degree: '',
        branch: '',
        cgpa: '',
        startYear: '',
        endYear: '',
        isCurrent: false
      });
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save education record');
    }
  };

  // Delete education record
  const handleDeleteEducation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/profile/education/${id}`);
      toast.success('Education record removed');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete record');
    }
  };

  // Add project record
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const techStackArray = projForm.techStackInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await axios.post('http://localhost:5000/api/profile/projects', {
        title: projForm.title,
        description: projForm.description,
        repoLink: projForm.repoLink || null,
        demoLink: projForm.demoLink || null,
        techStack: techStackArray
      });

      toast.success('Project record added!');
      setShowAddProj(false);
      setProjForm({
        title: '',
        description: '',
        repoLink: '',
        demoLink: '',
        techStackInput: ''
      });
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project');
    }
  };

  // Delete project record
  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/profile/projects/${id}`);
      toast.success('Project removed');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete project');
    }
  };

  // Add certification record
  const handleAddCertification = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/profile/certifications', {
        ...certForm,
        issueDate: certForm.issueDate || null,
        expiryDate: certForm.expiryDate || null
      });

      toast.success('Certification added!');
      setShowAddCert(false);
      setCertForm({
        title: '',
        issuingOrg: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: ''
      });
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save certification');
    }
  };

  // Delete certification record
  const handleDeleteCertification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/profile/certifications/${id}`);
      toast.success('Certification removed');
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete certification');
    }
  };

  // Calculate completeness percentage
  const calculateCompleteness = () => {
    if (!profile) return 0;
    let filled = 0;
    let total = 0;

    // Personal info check (max 5 points)
    const personalKeys = ['dob', 'gender', 'mobile', 'city', 'state'];
    personalKeys.forEach(k => {
      total++;
      if (profile[k]) filled++;
    });

    // Bio check
    total++;
    if (profile.user?.bio) filled++;

    // Location check
    total++;
    if (profile.user?.location) filled++;

    // Education check
    total++;
    if (profile.education?.length > 0) filled++;

    // Skills check
    total++;
    if (profile.skills?.length > 0) filled++;

    // Projects check
    total++;
    if (profile.projects?.length > 0) filled++;

    // Certifications check
    total++;
    if (profile.certifications?.length > 0) filled++;

    // Social checks
    const socialLinks = profile.user?.socialLinks || {};
    total += 2;
    if (socialLinks.github) filled++;
    if (socialLinks.linkedin) filled++;

    return Math.round((filled / total) * 100);
  };

  const completeness = calculateCompleteness();

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'academic', label: 'Academic & Skills', icon: <Book size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={18} /> },
    { id: 'certificates', label: 'Certifications', icon: <Award size={18} /> },
    { id: 'social', label: 'Social Links', icon: <LinkIcon size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-slate-500 font-medium">Loading student profile metadata...</p>
      </div>
    );
  }

  const nameInitial = profile?.user?.name ? profile.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'ST';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-violet-100/30">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-violet-400 rounded-full blur-3xl pointer-events-none opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-56 h-56 bg-pink-400 rounded-full blur-3xl pointer-events-none opacity-30 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-fuchsia-400 rounded-full blur-3xl pointer-events-none opacity-20" />

        <div className="h-44 bg-gradient-to-r from-violet-600/80 via-fuchsia-600/60 to-pink-500/60 relative" />

        <div className="px-8 pb-8 bg-gradient-to-b from-violet-600/10 to-pink-500/5 backdrop-blur-xl border border-white/40">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-6 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 p-1 ring-4 ring-white/80 shadow-2xl shadow-violet-400/30">
                  <div className="w-full h-full rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-black text-white">
                    {nameInitial}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-xl text-white shadow-lg hover:opacity-90 transition">
                  <Camera size={13} />
                </button>
              </div>

              <div className="mb-2 max-w-xl overflow-hidden">
                <h1 className="text-3xl font-black text-white drop-shadow">{profile?.user?.name || 'Student Name'}</h1>
                <p className="text-slate-600 font-medium mt-1 break-words line-clamp-4">{profile?.user?.bio || 'Undergraduate student • Profile details missing'}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-semibold">
                  <MapPin size={12} className="text-pink-500" />
                  <span>{profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : profile?.user?.location || 'Location unspecified'}</span>
                </div>
              </div>
            </div>

            {/* Generate ATS Resume Button */}
            <button
              onClick={() => navigate('/dashboard/student/resume-builder')}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black transition flex items-center gap-2 shadow-lg shadow-violet-300/40"
            >
              <FileText size={18} /> Generate ATS Resume
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-lg shadow-pink-100/30">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all mb-1 last:mb-0 ${
                  activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/10 text-violet-700 border border-violet-300/40 shadow-sm'
                  : 'text-slate-600 hover:bg-violet-50/60 hover:text-violet-700 border border-transparent'
                }`}
              >
                {tab.icon}
                <span className="font-bold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Profile Completeness Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg shadow-pink-100/30">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={13} className="text-violet-400" /> Completeness
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold">Profile Health</span>
              <span className={`font-black text-sm ${completeness >= 80 ? 'text-green-500' : completeness >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{completeness}%</span>
            </div>
            <div className="w-full bg-white/40 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${completeness >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : completeness >= 50 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-rose-400 to-red-400'}`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 min-h-[400px] shadow-lg shadow-pink-100/30"
          >
            {/* ── Personal Tab ── */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><Mail size={14} /> Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profile?.user?.email || ''}
                      className="w-full bg-white/30 border border-white/60 rounded-2xl px-4 py-3 text-slate-500 font-bold focus:outline-none cursor-not-allowed backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><Phone size={14} /> Phone Number / Mobile</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={personalForm.mobile}
                      onChange={(e) => setPersonalForm({ ...personalForm, mobile: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><MapPin size={14} /> City</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco"
                      value={personalForm.city}
                      onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><MapPin size={14} /> State</label>
                    <input
                      type="text"
                      placeholder="e.g. CA"
                      value={personalForm.state}
                      onChange={(e) => setPersonalForm({ ...personalForm, state: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><Calendar size={14} /> Date of Birth</label>
                    <input
                      type="date"
                      value={personalForm.dob}
                      onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 mb-1 block">Gender</label>
                    <select
                      value={personalForm.gender}
                      onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium cursor-pointer"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-bold text-slate-600 mb-1 block">Professional Summary / Headline Bio</label>
                    <textarea
                      rows="4"
                      placeholder="Computer Science student passionate about AI/ML development, building web software..."
                      value={personalForm.bio}
                      onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSavePersonal}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2"
                  >
                    <Save size={16} /> Save Personal Details
                  </button>
                </div>
              </div>
            )}

            {/* ── Academic & Skills Tab ── */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Academic History & Skills</h2>

                {/* Core Skills Section */}
                <div className="p-6 rounded-2xl bg-white/40 border border-white/60 space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Star size={13} className="text-violet-400" /> Core Technical Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map(skill => (
                      <span key={skill.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-100/80 to-pink-100/80 border border-violet-200/40 rounded-full text-violet-800 text-xs font-bold">
                        {skill.name}
                        <span className="text-[9px] text-violet-500 uppercase tracking-widest pl-1 font-black">({skill.level})</span>
                        <button onClick={() => handleDeleteSkill(skill.name)} className="text-violet-400 hover:text-rose-500 transition font-black ml-0.5 leading-none">×</button>
                      </span>
                    ))}
                    {(!profile?.skills || profile.skills.length === 0) && (
                      <p className="text-slate-400 text-xs font-medium">No skills added yet.</p>
                    )}
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap gap-3 pt-3 border-t border-white/60 items-center">
                    <input
                      type="text"
                      placeholder="Add new skill (e.g. React, Docker)"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium w-full md:w-64"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(); }}
                    />
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                      className="bg-white/50 border border-white/60 rounded-2xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium cursor-pointer"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-pink-500/10 border border-violet-200/50 text-violet-700 rounded-2xl font-bold text-sm hover:from-violet-500/30 transition flex items-center gap-2 shrink-0"
                    >
                      <Plus size={14} /> Add Skill
                    </button>
                  </div>
                </div>

                {/* Academic History List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Book size={13} className="text-violet-400" /> Education History
                    </h3>
                    <button
                      onClick={() => setShowAddEdu(!showAddEdu)}
                      className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-pink-500/10 border border-violet-200/50 text-violet-700 rounded-2xl font-bold text-sm hover:from-violet-500/30 transition flex items-center gap-2"
                    >
                      <Plus size={14} /> {showAddEdu ? 'Cancel' : 'Add School'}
                    </button>
                  </div>

                  {/* Add Education Form */}
                  <AnimatePresence>
                    {showAddEdu && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddEducation}
                        className="p-5 rounded-2xl bg-white/40 border border-white/60 space-y-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="School / University Name"
                            required
                            value={eduForm.institution}
                            onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Degree (e.g. Bachelor of Science)"
                            required
                            value={eduForm.degree}
                            onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Major / Branch (e.g. Computer Science)"
                            value={eduForm.branch}
                            onChange={(e) => setEduForm({ ...eduForm, branch: e.target.value })}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                          />
                          <input
                            type="text"
                            placeholder="CGPA / Grade (e.g. 3.8 / 4.0)"
                            value={eduForm.cgpa}
                            onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                          />
                          <input
                            type="number"
                            placeholder="Start Year"
                            required
                            value={eduForm.startYear}
                            onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                          />
                          <input
                            type="number"
                            placeholder="End Year (or Expected)"
                            required
                            value={eduForm.endYear}
                            onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                            className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                          />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2 text-sm">
                          <Save size={14} /> Save Record
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* List Education */}
                  <div className="space-y-3">
                    {profile?.education?.length === 0 ? (
                      <p className="text-slate-400 text-xs font-medium pl-2">No education records found. Please add your degree details.</p>
                    ) : (
                      profile?.education?.map((edu) => (
                        <div key={edu.id} className="p-4 bg-white/40 border border-white/60 rounded-2xl flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{edu.degree} in {edu.branch || 'General Science'}</h4>
                            <p className="text-slate-600 text-xs font-medium">{edu.institution}</p>
                            <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-wider">{edu.startYear} &ndash; {edu.endYear} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Projects Tab ── */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Student Projects</h2>
                  <button
                    onClick={() => setShowAddProj(!showAddProj)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-pink-500/10 border border-violet-200/50 text-violet-700 rounded-2xl font-bold text-sm hover:from-violet-500/30 transition flex items-center gap-2"
                  >
                    <Plus size={14} /> {showAddProj ? 'Cancel' : 'Add Project'}
                  </button>
                </div>

                {/* Add Project Form */}
                <AnimatePresence>
                  {showAddProj && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddProject}
                      className="p-5 rounded-2xl bg-white/40 border border-white/60 space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Project Title"
                          required
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack (comma separated, e.g. React, Node, SQL)"
                          required
                          value={projForm.techStackInput}
                          onChange={(e) => setProjForm({ ...projForm, techStackInput: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="url"
                          placeholder="GitHub Repository URL (Optional)"
                          value={projForm.repoLink}
                          onChange={(e) => setProjForm({ ...projForm, repoLink: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="url"
                          placeholder="Live Demo URL (Optional)"
                          value={projForm.demoLink}
                          onChange={(e) => setProjForm({ ...projForm, demoLink: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <textarea
                          rows="3"
                          placeholder="Project description, architecture, and your contributions..."
                          required
                          value={projForm.description}
                          onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium resize-none md:col-span-2"
                        />
                      </div>
                      <button type="submit" className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2 text-sm">
                        <Save size={14} /> Save Project
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* List Projects */}
                <div className="space-y-4">
                  {profile?.projects?.length === 0 ? (
                    <p className="text-slate-400 text-xs font-medium pl-2">No projects listed yet. Feature your work here!</p>
                  ) : (
                    profile?.projects?.map((proj) => (
                      <div key={proj.id} className="p-4 bg-white/40 border border-white/60 rounded-2xl flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>

                          {/* Tech stack */}
                          {proj.techStack && (
                            <div className="flex flex-wrap gap-1.5">
                              {(Array.isArray(proj.techStack) ? proj.techStack : JSON.parse(proj.techStack || '[]')).map((ts, idx) => (
                                <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-100/80 to-pink-100/80 border border-violet-200/40 rounded-full text-violet-800 text-[10px] font-bold">{ts}</span>
                              ))}
                            </div>
                          )}

                          <p className="text-slate-600 text-xs font-medium leading-relaxed">{proj.description}</p>

                          <div className="flex gap-4 pt-1">
                            {proj.repoLink && (
                              <a href={proj.repoLink} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1.5">
                                <Github size={12} /> Codebase
                              </a>
                            )}
                            {proj.demoLink && (
                              <a href={proj.demoLink} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1.5">
                                <Globe size={12} /> Live Link
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── Certifications Tab ── */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Professional Certifications</h2>
                  <button
                    onClick={() => setShowAddCert(!showAddCert)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-pink-500/10 border border-violet-200/50 text-violet-700 rounded-2xl font-bold text-sm hover:from-violet-500/30 transition flex items-center gap-2"
                  >
                    <Plus size={14} /> {showAddCert ? 'Cancel' : 'Add Cert'}
                  </button>
                </div>

                {/* Add Certification Form */}
                <AnimatePresence>
                  {showAddCert && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddCertification}
                      className="p-5 rounded-2xl bg-white/40 border border-white/60 space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Certification Title"
                          required
                          value={certForm.title}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Issuing Organization (e.g. Google, AWS)"
                          required
                          value={certForm.issuingOrg}
                          onChange={(e) => setCertForm({ ...certForm, issuingOrg: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="date"
                          placeholder="Issue Date"
                          value={certForm.issueDate}
                          onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="date"
                          placeholder="Expiry Date"
                          value={certForm.expiryDate}
                          onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Credential ID"
                          value={certForm.credentialId}
                          onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                        <input
                          type="url"
                          placeholder="Credential URL"
                          value={certForm.credentialUrl}
                          onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                          className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                        />
                      </div>
                      <button type="submit" className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2 text-sm">
                        <Save size={14} /> Save Certificate
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* List Certifications */}
                <div className="space-y-3">
                  {profile?.certifications?.length === 0 ? (
                    <p className="text-slate-400 text-xs font-medium pl-2">No certificates verified yet. Add your external certificates here.</p>
                  ) : (
                    profile?.certifications?.map((cert) => (
                      <div key={cert.id} className="p-4 bg-white/40 border border-white/60 rounded-2xl flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{cert.title}</h4>
                          <p className="text-slate-600 text-xs font-medium">{cert.issuingOrg}</p>
                          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
                            Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Unspecified'}
                            {cert.credentialId && ` | ID: ${cert.credentialId}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-violet-500 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition"
                            >
                              <Globe size={16} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteCertification(cert.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── Social Links Tab ── */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Social Profiles & Portfolio</h2>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><Github size={14} className="text-violet-500" /> GitHub Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={socialForm.github}
                      onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><Linkedin size={14} className="text-blue-500" /> LinkedIn Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/yourusername"
                      value={socialForm.linkedin}
                      onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-1"><Globe size={14} className="text-emerald-500" /> Portfolio Website</label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.me"
                      value={socialForm.portfolio}
                      onChange={(e) => setSocialForm({ ...socialForm, portfolio: e.target.value })}
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 backdrop-blur-sm transition font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveSocial}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:opacity-90 text-white rounded-2xl font-black shadow-lg shadow-violet-300/30 transition flex items-center gap-2"
                  >
                    <Save size={16} /> Save Social Profiles
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
