import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ArrowLeft, Brain, Upload, Edit, Save, BookOpen, 
  HelpCircle, Code, Star, CheckCircle, AlertCircle, RefreshCw, Copy, XCircle, ChevronDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseAssignments = () => {
  const { courseId } = useParams();
  const [levels, setLevels] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Buffer state for reviews
  const [bufferedQuestions, setBufferedQuestions] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Inline edit state
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Single question regeneration indicator
  const [regeneratingIndex, setRegeneratingIndex] = useState(-1);

  // Form states
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [levelForm, setLevelForm] = useState({ title: '', description: '', order: '', xpReward: 100, difficulty: 'BEGINNER' });

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questionType, setQuestionType] = useState('MCQ');
  const [mcqForm, setMcqForm] = useState({ text: '', options: ['', ''], correctOption: '', points: 10 });
  const [codingForm, setCodingForm] = useState({
    title: '', text: '', points: 20,
    starterCodeJS: 'function solve(a, b) {\n  return a + b;\n}',
    starterCodePY: 'def solve(a, b):\n    return a + b',
    input1: '', output1: '', input2: '', output2: ''
  });

  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiForm, setAiForm] = useState({ 
    moduleName: '', 
    topics: '', 
    difficulty: 'BEGINNER', 
    questionCount: 10, 
    questionType: 'MCQ' 
  });
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const fetchAssignments = async (forceSelectId = null) => {
    setLoading(true);
    try {
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(courseRes.data);

      const res = await axios.get(`http://localhost:5000/api/assignments/admin/courses/${courseId}/assignments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLevels(res.data);
      
      let targetLevel = null;
      if (forceSelectId) {
        targetLevel = res.data.find(l => l.id === forceSelectId);
      } else if (selectedLevel) {
        targetLevel = res.data.find(l => l.id === selectedLevel.id);
      }
      
      if (!targetLevel && res.data.length > 0) {
        targetLevel = res.data[0];
      }

      if (targetLevel) {
        setSelectedLevel(targetLevel);
        setBufferedQuestions(targetLevel.questions || []);
        setIsDirty(false);
        setEditingIndex(-1);
        setEditingQuestion(null);
      } else {
        setSelectedLevel(null);
        setBufferedQuestions([]);
        setIsDirty(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load levels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleLevelChange = (lvl) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes in this level's questions. Discard changes?")) {
        return;
      }
    }
    setSelectedLevel(lvl);
    setBufferedQuestions(lvl.questions || []);
    setIsDirty(false);
    setEditingIndex(-1);
    setEditingQuestion(null);
  };

  const handleAddLevel = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/assignments/admin/levels/create', 
        { ...levelForm, courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Level created successfully!');
      setShowAddLevel(false);
      setLevelForm({ title: '', description: '', order: '', xpReward: 100, difficulty: 'BEGINNER' });
      fetchAssignments(res.data.id);
    } catch (error) {
      toast.error('Failed to create level');
    }
  };

  const handleDeleteLevel = async (levelId) => {
    if (!window.confirm('Delete this level and all associated questions?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/admin/levels/${levelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Level deleted');
      if (selectedLevel?.id === levelId) setSelectedLevel(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to delete level');
    }
  };

  // Add question to client buffer (DRAFT state)
  const handleAddQuestionLocal = (e) => {
    e.preventDefault();
    if (!selectedLevel) return;

    let newQuestion = {
      type: questionType,
      points: 10
    };

    if (questionType === 'MCQ') {
      if (!mcqForm.correctOption) {
        toast.error('Please enter correct option text exactly');
        return;
      }
      newQuestion = {
        ...newQuestion,
        text: mcqForm.text,
        points: parseInt(mcqForm.points) || 10,
        options: mcqForm.options.filter(o => o.trim() !== ''),
        correctOption: mcqForm.correctOption
      };
    } else {
      const starterCode = {
        javascript: codingForm.starterCodeJS,
        python: codingForm.starterCodePY,
        cpp: '// C++ Solution Skeleton\nint solve() {}',
        java: '// Java Solution\npublic class Solution {}'
      };
      const testCases = [];
      if (codingForm.input1 || codingForm.output1) {
        testCases.push({ input: codingForm.input1, output: codingForm.output1 });
      }
      if (codingForm.input2 || codingForm.output2) {
        testCases.push({ input: codingForm.input2, output: codingForm.output2 });
      }
      newQuestion = {
        ...newQuestion,
        title: codingForm.title,
        text: codingForm.text,
        points: parseInt(codingForm.points) || 20,
        starterCode,
        testCases
      };
    }

    setBufferedQuestions([...bufferedQuestions, newQuestion]);
    setIsDirty(true);
    setShowAddQuestion(false);
    
    // Reset forms
    setMcqForm({ text: '', options: ['', ''], correctOption: '', points: 10 });
    setCodingForm({
      title: '', text: '', points: 20,
      starterCodeJS: 'function solve(a, b) {\n  return a + b;\n}',
      starterCodePY: 'def solve(a, b):\n    return a + b',
      input1: '', output1: '', input2: '', output2: ''
    });
    toast.success('Question added to workspace!');
  };

  // AI Generate question directly to buffer
  const handleAIGenerateLocal = async (e) => {
    e.preventDefault();
    if (!selectedLevel) return;
    setGeneratingAI(true);
    setProgressPercent(0);

    // Setup simulated progress
    const totalSecs = Math.max(5, Math.ceil(aiForm.questionCount / 10) * 12);
    setEstimatedTime(totalSecs);
    setGenerationProgress(`Preparing bulk workspace to generate ${aiForm.questionCount} questions...`);

    let currentSec = 0;
    const progressInterval = setInterval(() => {
      currentSec += 1;
      const pct = Math.min(95, Math.round((currentSec / totalSecs) * 100));
      setProgressPercent(pct);
      
      let stepMessage = `Generating questions... (${pct}%)`;
      if (aiForm.questionCount > 10) {
        const batchNum = Math.min(
          Math.ceil(aiForm.questionCount / 10),
          Math.ceil((currentSec / totalSecs) * Math.ceil(aiForm.questionCount / 10))
        );
        stepMessage = `Processing batch ${batchNum} of ${Math.ceil(aiForm.questionCount / 10)}... (${pct}%)`;
      } else {
        stepMessage = `Crafting high-quality challenges... (${pct}%)`;
      }
      setGenerationProgress(stepMessage);
    }, 1000);

    try {
      const res = await axios.post('http://localhost:5000/api/assignments/admin/questions/ai-generate', {
        moduleName: aiForm.moduleName,
        topics: aiForm.topics,
        difficulty: aiForm.difficulty,
        questionCount: aiForm.questionCount,
        questionType: aiForm.questionType,
        courseName: course?.title
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      clearInterval(progressInterval);
      setProgressPercent(100);
      setGenerationProgress('Deduplicating and validating results...');

      const generated = Array.isArray(res.data) ? res.data : [res.data];
      
      // Clean properties for client state
      const cleaned = generated.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : null,
        starterCode: typeof q.starterCode === 'object' ? q.starterCode : null,
        testCases: Array.isArray(q.testCases) ? q.testCases : null
      }));

      setBufferedQuestions([...bufferedQuestions, ...cleaned]);
      setIsDirty(true);
      
      setTimeout(() => {
        setShowAIGenerator(false);
        setGeneratingAI(false);
        setGenerationProgress('');
        setProgressPercent(0);
        toast.success(`Successfully generated ${cleaned.length} AI question(s) in workspace!`);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setGeneratingAI(false);
      setProgressPercent(0);
      setGenerationProgress('');
      console.error(error);
      const errMsg = error.response?.data?.error || 'Failed to generate questions with AI';
      toast.error(errMsg);
    }
  };

  // Single question regeneration
  const handleRegenerateQuestion = async (idx) => {
    if (!selectedLevel) return;
    const originalQ = bufferedQuestions[idx];
    setRegeneratingIndex(idx);
    toast.loading('Regenerating question with AI...', { id: 'regenerate-toast' });

    try {
      const res = await axios.post('http://localhost:5000/api/assignments/admin/questions/ai-generate', {
        moduleName: selectedLevel.title,
        topics: originalQ.text ? [originalQ.text.substring(0, 30)] : ['Concept filler'],
        difficulty: selectedLevel.difficulty || 'BEGINNER',
        questionCount: 1,
        questionType: originalQ.type,
        courseName: course?.title
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const generated = Array.isArray(res.data) ? res.data : [res.data];
      if (generated.length > 0) {
        const updated = [...bufferedQuestions];
        updated[idx] = {
          ...generated[0],
          id: undefined // reset DB key
        };
        setBufferedQuestions(updated);
        setIsDirty(true);
        toast.success('Question replaced successfully in workspace!', { id: 'regenerate-toast' });
      } else {
        throw new Error('AI returned an empty response');
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'Failed to regenerate question';
      toast.error(errMsg, { id: 'regenerate-toast' });
    } finally {
      setRegeneratingIndex(-1);
    }
  };

  // Bulk upload directly to buffer
  const handleBulkUploadLocal = (e) => {
    e.preventDefault();
    if (!selectedLevel) return;
    try {
      const parsed = JSON.parse(bulkText);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      
      setBufferedQuestions([...bufferedQuestions, ...list]);
      setIsDirty(true);
      setShowBulkUpload(false);
      setBulkText('');
      toast.success(`Added ${list.length} question(s) to workspace!`);
    } catch (error) {
      toast.error('Invalid JSON structure. Must be JSON array of questions matching the schema.');
    }
  };

  // Save all questions in transaction to Database
  const handleBulkSaveQuestions = async () => {
    if (!selectedLevel) return;
    setSavingDraft(true);
    try {
      await axios.post('http://localhost:5000/api/assignments/admin/questions/bulk-save', {
        assignmentId: selectedLevel.id,
        questions: bufferedQuestions
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('All questions persisted to MySQL successfully!');
      setIsDirty(false);
      fetchAssignments(selectedLevel.id);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save questions');
    } finally {
      setSavingDraft(false);
    }
  };

  // Publish Assignment Level (updates status and saves database)
  const handlePublishAssignment = async () => {
    if (!selectedLevel) return;
    
    // Auto-save first if dirty
    if (isDirty) {
      toast.loading('Saving pending questions first...');
      try {
        await axios.post('http://localhost:5000/api/assignments/admin/questions/bulk-save', {
          assignmentId: selectedLevel.id,
          questions: bufferedQuestions
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsDirty(false);
      } catch (err) {
        toast.dismiss();
        toast.error('Failed to save pending questions before publishing.');
        return;
      }
      toast.dismiss();
    }

    if (bufferedQuestions.length === 0) {
      toast.error('Cannot publish assignment with 0 questions.');
      return;
    }

    setPublishing(true);
    try {
      await axios.post('http://localhost:5000/api/assignments/admin/assignments/publish', {
        levelId: selectedLevel.id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('🎉 Level Published Successfully! Visible on student dashboard.');
      fetchAssignments(selectedLevel.id);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'Failed to publish assignment';
      toast.error(errMsg);
    } finally {
      setPublishing(false);
    }
  };

  // Discard local edits
  const handleDiscardChanges = () => {
    if (!window.confirm('Discard all unsaved edits?')) return;
    setBufferedQuestions(selectedLevel.questions || []);
    setIsDirty(false);
    setEditingIndex(-1);
    setEditingQuestion(null);
    toast.success('Workspace reset');
  };

  // Inline question controls
  const handleEditClick = (idx) => {
    setEditingIndex(idx);
    const q = bufferedQuestions[idx];
    setEditingQuestion({
      ...q,
      options: q.options ? [...q.options] : ['', ''],
      starterCode: q.starterCode ? { ...q.starterCode } : { javascript: '', python: '' },
      testCases: q.testCases ? [...q.testCases] : [{ input: '', output: '' }]
    });
  };

  const handleSaveEdit = (idx) => {
    const updated = [...bufferedQuestions];
    updated[idx] = editingQuestion;
    setBufferedQuestions(updated);
    setIsDirty(true);
    setEditingIndex(-1);
    setEditingQuestion(null);
    toast.success('Edit saved to workspace review list!');
  };

  const handleDuplicateQuestion = (idx) => {
    const q = bufferedQuestions[idx];
    const duplicated = {
      ...q,
      id: undefined, // reset database id
      options: q.options ? [...q.options] : null,
      starterCode: q.starterCode ? { ...q.starterCode } : null,
      testCases: q.testCases ? [...q.testCases] : null
    };
    const updated = [...bufferedQuestions];
    updated.splice(idx + 1, 0, duplicated);
    setBufferedQuestions(updated);
    setIsDirty(true);
    toast.success('Question duplicated in workspace!');
  };

  const handleDeleteQuestionLocal = (idx) => {
    if (!window.confirm('Remove this question from the workspace?')) return;
    const updated = bufferedQuestions.filter((_, i) => i !== idx);
    setBufferedQuestions(updated);
    setIsDirty(true);
    if (editingIndex === idx) {
      setEditingIndex(-1);
      setEditingQuestion(null);
    }
    toast.success('Question removed from workspace!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="animate-spin text-violet-600" size={32} />
        <span className="text-slate-500 font-bold">Loading Assignments Workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 font-sans bg-[#f4f2f8] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/admin/courses" className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-violet-600 hover:-translate-x-1 transition shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">{course?.title} Assignments</h1>
          <p className="text-slate-500 font-bold">Configure levels, tests, coding assignments and proctoring rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side Levels Navigation */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-6 h-fit">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="text-violet-500" size={20} /> Course Levels
            </h3>
            <button 
              onClick={() => setShowAddLevel(true)}
              className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {levels.map((lvl) => (
              <div 
                key={lvl.id}
                onClick={() => handleLevelChange(lvl)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedLevel?.id === lvl.id 
                    ? 'border-violet-500 bg-violet-50/50 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-sm text-slate-800">Lvl {lvl.order}: {lvl.title}</h4>
                    {lvl.status === 'PUBLISHED' ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-black rounded-full uppercase tracking-wider">Published</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-black rounded-full uppercase tracking-wider">Draft</span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {lvl.difficulty} | {lvl.xpReward} XP | {lvl.questions?.length || 0} Questions
                  </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteLevel(lvl.id); }}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {levels.length === 0 && (
              <p className="text-center text-xs text-slate-400 font-bold py-6">No levels created yet. Click "+" to start.</p>
            )}
          </div>
        </div>

        {/* Right Side Content & Questions Builder */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLevel ? (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 border border-violet-200 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Level {selectedLevel.order}
                    </span>
                    {selectedLevel.status === 'PUBLISHED' ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        🟢 Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        🟡 Draft
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedLevel.title}</h2>
                  <p className="text-slate-500 font-bold text-sm mt-1">{selectedLevel.description}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => setShowAddQuestion(true)}
                    className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-100 hover:bg-violet-700 transition flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Question
                  </button>
                  <button 
                    onClick={() => {
                      setAiForm({
                        moduleName: selectedLevel.title,
                        topics: '',
                        difficulty: selectedLevel.difficulty || 'BEGINNER',
                        questionCount: 10,
                        questionType: 'MCQ'
                      });
                      setShowAIGenerator(true);
                    }}
                    className="px-4 py-2.5 bg-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-100 hover:bg-pink-700 transition flex items-center gap-1.5"
                  >
                    <Brain size={14} /> ✨ Generate AI
                  </button>
                  <button 
                    onClick={() => setShowBulkUpload(true)}
                    className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-900 transition flex items-center gap-1.5"
                  >
                    <Upload size={14} /> Bulk Upload
                  </button>
                  
                  {/* Publish Button */}
                  <button 
                    onClick={handlePublishAssignment}
                    disabled={bufferedQuestions.length === 0 || publishing}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition ${
                      selectedLevel.status === 'PUBLISHED'
                        ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700'
                        : 'bg-[#ff2a85] text-white shadow-pink-100 hover:bg-[#e02072]'
                    } ${(bufferedQuestions.length === 0 || publishing) ? 'opacity-55 cursor-not-allowed' : ''}`}
                  >
                    {publishing ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} /> Publishing...
                      </>
                    ) : selectedLevel.status === 'PUBLISHED' ? (
                      <>
                        <CheckCircle size={14} /> Published
                      </>
                    ) : (
                      <>
                        🚀 Publish Assignment
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-800">
                    Workspace Questions ({bufferedQuestions.length})
                    {isDirty && <span className="ml-2 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">Unsaved Changes</span>}
                  </h3>
                </div>

                {bufferedQuestions.map((q, idx) => {
                  const isEditing = editingIndex === idx;
                  return (
                    <div key={idx} className={`p-5 rounded-2xl border transition-all ${
                      isEditing 
                        ? 'border-violet-400 bg-violet-50/20 shadow-md ring-2 ring-violet-500/10' 
                        : 'border-slate-100 bg-slate-50/50 hover:shadow-sm'
                    } space-y-4`}>
                      
                      {/* Editing Mode */}
                      {isEditing && editingQuestion ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-xs font-black text-violet-600 uppercase tracking-wider">Editing Question #{idx+1} ({editingQuestion.type})</span>
                            <span className="text-[10px] text-slate-400 font-bold">Modify details and click Save</span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Question Text</label>
                            <input 
                              type="text"
                              value={editingQuestion.text || ''}
                              onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Points</label>
                              <input 
                                type="number"
                                value={editingQuestion.points || 10}
                                onChange={e => setEditingQuestion({...editingQuestion, points: parseInt(e.target.value) || 10})}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 font-medium"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Type</label>
                              <select 
                                value={editingQuestion.type}
                                onChange={e => setEditingQuestion({...editingQuestion, type: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 font-bold"
                              >
                                <option value="MCQ">Multiple Choice (MCQ)</option>
                                <option value="CODING">Coding Challenge</option>
                              </select>
                            </div>
                          </div>

                          {/* MCQ Specific Fields */}
                          {editingQuestion.type === 'MCQ' && (
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">MCQ Options</label>
                              {(editingQuestion.options || []).map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <input 
                                    type="text"
                                    value={opt}
                                    onChange={e => {
                                      const newOptions = [...editingQuestion.options];
                                      newOptions[oIdx] = e.target.value;
                                      setEditingQuestion({...editingQuestion, options: newOptions});
                                    }}
                                    placeholder={`Option ${oIdx+1}`}
                                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-violet-500 font-semibold"
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      const newOptions = editingQuestion.options.filter((_, i) => i !== oIdx);
                                      setEditingQuestion({...editingQuestion, options: newOptions});
                                    }}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => setEditingQuestion({...editingQuestion, options: [...(editingQuestion.options || []), '']})}
                                className="text-xs text-violet-600 font-black hover:underline flex items-center gap-1"
                              >
                                + Add Option
                              </button>

                              <div className="space-y-1.5 mt-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Correct Option Choice Text</label>
                                <select 
                                  value={editingQuestion.correctOption || ''}
                                  onChange={e => setEditingQuestion({...editingQuestion, correctOption: e.target.value})}
                                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-violet-500 font-bold"
                                >
                                  <option value="">-- Select Correct Option --</option>
                                  {(editingQuestion.options || []).map((opt, oIdx) => (
                                    <option key={oIdx} value={opt}>{opt || `Option ${oIdx+1} (empty)`}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Coding Specific Fields */}
                          {editingQuestion.type === 'CODING' && (
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                              <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">JS Starter Skeleton</label>
                                <textarea
                                  value={editingQuestion.starterCode?.javascript || ''}
                                  onChange={e => setEditingQuestion({
                                    ...editingQuestion,
                                    starterCode: { ...(editingQuestion.starterCode || {}), javascript: e.target.value }
                                  })}
                                  className="w-full bg-slate-900 text-emerald-400 font-mono border border-slate-800 rounded-xl p-3 text-xs h-20"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Python Starter Skeleton</label>
                                <textarea
                                  value={editingQuestion.starterCode?.python || ''}
                                  onChange={e => setEditingQuestion({
                                    ...editingQuestion,
                                    starterCode: { ...(editingQuestion.starterCode || {}), python: e.target.value }
                                  })}
                                  className="w-full bg-slate-900 text-emerald-400 font-mono border border-slate-800 rounded-xl p-3 text-xs h-20"
                                />
                              </div>

                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Test Cases</label>
                              {(editingQuestion.testCases || []).map((tc, tcIdx) => (
                                <div key={tcIdx} className="grid grid-cols-5 gap-2 items-center">
                                  <input 
                                    type="text" 
                                    placeholder="Input"
                                    value={tc.input} 
                                    onChange={e => {
                                      const newTcs = [...editingQuestion.testCases];
                                      newTcs[tcIdx].input = e.target.value;
                                      setEditingQuestion({...editingQuestion, testCases: newTcs});
                                    }}
                                    className="col-span-2 bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-violet-500 font-medium"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Output"
                                    value={tc.output} 
                                    onChange={e => {
                                      const newTcs = [...editingQuestion.testCases];
                                      newTcs[tcIdx].output = e.target.value;
                                      setEditingQuestion({...editingQuestion, testCases: newTcs});
                                    }}
                                    className="col-span-2 bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-violet-500 font-medium"
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newTcs = editingQuestion.testCases.filter((_, i) => i !== tcIdx);
                                      setEditingQuestion({...editingQuestion, testCases: newTcs});
                                    }}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => setEditingQuestion({...editingQuestion, testCases: [...(editingQuestion.testCases || []), { input: '', output: '' }]})}
                                className="text-xs text-violet-600 font-black hover:underline"
                              >
                                + Add Test Case
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-end gap-2 pt-3 border-t">
                            <button 
                              type="button" 
                              onClick={() => { setEditingIndex(-1); setEditingQuestion(null); }}
                              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleSaveEdit(idx)}
                              className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-violet-100"
                            >
                              <Save size={12} /> Save Edit
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Standard Card View
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="font-bold text-sm text-slate-800">{q.text || q.title || 'Coding Problem'}</h4>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{q.points} pts</span>
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                q.type === 'MCQ' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                              }`}>
                                {q.type}
                              </span>
                            </div>
                          </div>

                          {q.type === 'MCQ' && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 mt-3">
                              {q.options.map((opt, oIdx) => (
                                <div 
                                  key={oIdx} 
                                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                                    opt === q.correctOption 
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                      : 'bg-white border-slate-100 text-slate-600'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {opt === q.correctOption && <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />}
                                </div>
                              ))}
                            </div>
                          )}

                          {q.type === 'CODING' && (
                            <div className="pl-8 mt-3 text-xs text-slate-500 font-medium space-y-1 bg-white p-4 rounded-xl border border-slate-100">
                              <p className="text-slate-800 font-bold">Test Cases Configured:</p>
                              {(q.testCases || []).map((tc, tcIdx) => (
                                <div key={tcIdx} className="font-mono text-[10px] bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100 flex items-center justify-between">
                                  <span>Input: {tc.input}</span>
                                  <span>Expected Output: {tc.output}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Question Action Buttons */}
                          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-dashed border-slate-100">
                            <button 
                              onClick={() => handleEditClick(idx)}
                              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition flex items-center gap-1 font-bold"
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button 
                              onClick={() => handleRegenerateQuestion(idx)}
                              disabled={regeneratingIndex === idx}
                              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition flex items-center gap-1 font-bold"
                            >
                              {regeneratingIndex === idx ? (
                                <RefreshCw className="animate-spin text-pink-500" size={12} />
                              ) : (
                                <Brain size={12} className="text-pink-500" />
                              )}
                              Regenerate
                            </button>
                            <button 
                              onClick={() => handleDuplicateQuestion(idx)}
                              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1 font-bold"
                            >
                              <Copy size={12} /> Duplicate
                            </button>
                            <button 
                              onClick={() => handleDeleteQuestionLocal(idx)}
                              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 font-bold"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {bufferedQuestions.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 font-bold border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <HelpCircle size={40} className="mb-2 text-slate-300" />
                    <p className="text-sm">No questions in workspace yet. Add manually or use AI to generate.</p>
                  </div>
                )}
              </div>

              {/* Save changes banner */}
              <AnimatePresence>
                {isDirty && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="p-4 bg-violet-50 border border-violet-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mt-6"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="text-violet-600 flex-shrink-0" size={18} />
                      <span className="text-xs font-bold text-slate-600 text-center md:text-left">
                        You have unsaved changes in this level's workspace. Click "Save All Questions" to persist changes to the database.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={handleDiscardChanges}
                        className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-300 transition"
                      >
                        Discard
                      </button>
                      <button 
                        onClick={handleBulkSaveQuestions}
                        disabled={savingDraft}
                        className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 shadow-md shadow-violet-100 transition flex items-center gap-1"
                      >
                        {savingDraft ? <RefreshCw className="animate-spin" size={12} /> : <Save size={12} />}
                        Save All Questions
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm text-center text-slate-400 font-bold flex flex-col items-center justify-center min-h-[400px]">
              <AlertCircle size={48} className="mb-2 text-slate-300 animate-bounce" />
              <p>Select a level on the left or create a new level to start building questions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Level Modal */}
      <AnimatePresence>
        {showAddLevel && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-2xl max-w-md w-full space-y-6"
            >
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Plus className="text-violet-600" /> Create Level
              </h3>
              <form onSubmit={handleAddLevel} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Level Title</label>
                  <input 
                    type="text" 
                    required
                    value={levelForm.title} 
                    onChange={e => setLevelForm({...levelForm, title: e.target.value})}
                    placeholder="e.g. OOP Inheritance"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={levelForm.description} 
                    onChange={e => setLevelForm({...levelForm, description: e.target.value})}
                    placeholder="Explain what this level covers..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Level Order</label>
                    <input 
                      type="number" 
                      required
                      value={levelForm.order} 
                      onChange={e => setLevelForm({...levelForm, order: e.target.value})}
                      placeholder="e.g. 1"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">XP Reward</label>
                    <input 
                      type="number" 
                      required
                      value={levelForm.xpReward} 
                      onChange={e => setLevelForm({...levelForm, xpReward: e.target.value})}
                      placeholder="100"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={() => setShowAddLevel(false)}
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-xs shadow-md shadow-violet-100"
                  >
                    Save Level
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Question Modal */}
      <AnimatePresence>
        {showAddQuestion && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-2xl max-w-lg w-full space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Plus className="text-violet-600" /> Add Question manually
              </h3>
              
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <button 
                  onClick={() => setQuestionType('MCQ')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${questionType === 'MCQ' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}
                >
                  Multiple Choice (MCQ)
                </button>
                <button 
                  onClick={() => setQuestionType('CODING')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${questionType === 'CODING' ? 'bg-violet-600 text-white' : 'text-slate-500'}`}
                >
                  Coding Challenge
                </button>
              </div>

              <form onSubmit={handleAddQuestionLocal} className="space-y-4">
                {questionType === 'MCQ' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Question Text</label>
                      <input 
                        type="text" required
                        value={mcqForm.text} onChange={e => setMcqForm({...mcqForm, text: e.target.value})}
                        placeholder="What is...?"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Options</label>
                      {mcqForm.options.map((opt, idx) => (
                        <input 
                          key={idx} type="text" required
                          value={opt} onChange={e => {
                            const clone = [...mcqForm.options];
                            clone[idx] = e.target.value;
                            setMcqForm({...mcqForm, options: clone});
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                        />
                      ))}
                      <button 
                        type="button"
                        onClick={() => setMcqForm({...mcqForm, options: [...mcqForm.options, '']})}
                        className="text-xs text-violet-600 font-bold hover:underline"
                      >
                        + Add option choice
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Correct Answer Option Text</label>
                      <input 
                        type="text" required
                        value={mcqForm.correctOption} onChange={e => setMcqForm({...mcqForm, correctOption: e.target.value})}
                        placeholder="Enter the exact text match of correct option"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Challenge Title</label>
                      <input 
                        type="text" required
                        value={codingForm.title} onChange={e => setCodingForm({...codingForm, title: e.target.value})}
                        placeholder="e.g. Sum two numbers"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description & Specs</label>
                      <textarea required
                        value={codingForm.text} onChange={e => setCodingForm({...codingForm, text: e.target.value})}
                        placeholder="Define constraints, starter instructions, input formats..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">JavaScript Starter skeleton</label>
                      <textarea required
                        value={codingForm.starterCodeJS} onChange={e => setCodingForm({...codingForm, starterCodeJS: e.target.value})}
                        className="w-full bg-slate-900 text-emerald-400 font-mono border border-slate-800 rounded-xl p-3.5 text-xs h-24 resize-none focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Python Starter skeleton</label>
                      <textarea required
                        value={codingForm.starterCodePY} onChange={e => setCodingForm({...codingForm, starterCodePY: e.target.value})}
                        className="w-full bg-slate-900 text-emerald-400 font-mono border border-slate-800 rounded-xl p-3.5 text-xs h-24 resize-none focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 border-t pt-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Test Cases</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" placeholder="TC 1 Input" 
                          value={codingForm.input1} onChange={e => setCodingForm({...codingForm, input1: e.target.value})}
                          className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                        />
                        <input 
                          type="text" placeholder="TC 1 Expected Output" 
                          value={codingForm.output1} onChange={e => setCodingForm({...codingForm, output1: e.target.value})}
                          className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" placeholder="TC 2 Input" 
                          value={codingForm.input2} onChange={e => setCodingForm({...codingForm, input2: e.target.value})}
                          className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                        />
                        <input 
                          type="text" placeholder="TC 2 Expected Output" 
                          value={codingForm.output2} onChange={e => setCodingForm({...codingForm, output2: e.target.value})}
                          className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={() => setShowAddQuestion(false)}
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-xs shadow-md shadow-violet-100"
                  >
                    Add to Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Generator Modal */}
      <AnimatePresence>
        {showAIGenerator && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-2xl max-w-md w-full space-y-6"
            >
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Brain className="text-pink-600 animate-pulse" /> ✨ AI Module Bulk Generator
              </h3>

              {generatingAI ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-pink-100 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-pink-600 animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto text-pink-600 animate-bounce" size={32} />
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h4 className="font-black text-sm text-slate-800">{generationProgress}</h4>
                    <p className="text-[11px] text-slate-400 font-bold">Estimated build duration: ~{estimatedTime}s</p>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-pink-600 h-full rounded-full" 
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAIGenerateLocal} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Module Name</label>
                    <input 
                      type="text" required
                      value={aiForm.moduleName} 
                      onChange={e => setAiForm({...aiForm, moduleName: e.target.value})}
                      placeholder="e.g. Java Basics"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Topics Covered (comma-separated)</label>
                    <input 
                      type="text" required
                      value={aiForm.topics} 
                      onChange={e => setAiForm({...aiForm, topics: e.target.value})}
                      placeholder="e.g. Variables, Loops, Arrays, Methods"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium"
                    />
                    <p className="text-[10px] text-slate-400 font-bold">Topics will be distributed proportionally across questions.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Question Type</label>
                      <select 
                        value={aiForm.questionType} 
                        onChange={e => setAiForm({...aiForm, questionType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-bold"
                      >
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                        <option value="CODING">Coding Problem</option>
                        <option value="BOTH">Both (Mixed)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Difficulty</label>
                      <select 
                        value={aiForm.difficulty} 
                        onChange={e => setAiForm({...aiForm, difficulty: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-bold"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Number of Questions (1-40)</label>
                    <select 
                      value={aiForm.questionCount} 
                      onChange={e => setAiForm({...aiForm, questionCount: parseInt(e.target.value) || 10})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-bold"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions (2 batches)</option>
                      <option value={30}>30 Questions (3 batches)</option>
                      <option value={40}>40 Questions (4 batches)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <button 
                      type="button" 
                      onClick={() => setShowAIGenerator(false)}
                      className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                      disabled={generatingAI}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-pink-600 text-white rounded-xl font-bold text-xs shadow-md shadow-pink-100 flex items-center gap-2 hover:bg-pink-700 transition"
                      disabled={generatingAI}
                    >
                      <Brain size={14} /> Generate Questions
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkUpload && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-2xl max-w-lg w-full space-y-6"
            >
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Upload className="text-slate-800" /> Bulk Questions JSON Upload
              </h3>
              <form onSubmit={handleBulkUploadLocal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">JSON array payload</label>
                  <textarea required
                    value={bulkText} onChange={e => setBulkText(e.target.value)}
                    placeholder='[{"text":"What is 2+2?","type":"MCQ","options":["3","4"],"correctOption":"4","points":10}]'
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs h-40 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={() => setShowBulkUpload(false)}
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    Add to Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseAssignments;
