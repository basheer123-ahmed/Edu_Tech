import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LevelWorkspacePage = () => {
  const { courseId, levelId } = useParams();
  const navigate = useNavigate();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLevelDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/assignments/level/${levelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLevel(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load level details');
      navigate(`/dashboard/student/assignments/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevelDetails();
  }, [levelId]);

  const handleStartChallenge = () => {
    navigate(`/secure-exam/${courseId}/${levelId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin" />
        <span className="text-slate-500 font-bold">Synchronizing challenge details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-4">
        <Link to={`/dashboard/student/assignments/${courseId}`} className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-pink-600 hover:-translate-x-1 transition shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-slate-500 text-sm">Return to Roadmap</span>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
        <div className="border-b pb-6 space-y-2">
          <span className="px-3 py-1 bg-pink-100 text-pink-700 border border-pink-200 rounded-full text-[10px] font-black uppercase tracking-widest">
            Roadmap Level {level?.order}
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">{level?.title}</h1>
          <p className="text-slate-500 font-bold">{level?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Questions Count</span>
            <p className="text-slate-700 font-black text-sm">{level?.questions?.length} Items</p>
          </div>
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Passing Criteria</span>
            <p className="text-slate-700 font-black text-sm">Score 50% or above</p>
          </div>
        </div>

        <div className="p-5 bg-pink-50 text-pink-800 rounded-2xl border border-pink-100 flex items-start gap-4 text-xs font-bold leading-relaxed">
          <ShieldCheck className="text-pink-600 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <p className="font-black text-pink-900">AI Exam Proctoring Enforced</p>
            <p>Entering the secure exam workspace initiates Camera/Microphone checks, visibility sensors, tab trackers, and fullscreen lockouts. Unauthorised exit from the environment logs security violation events.</p>
          </div>
        </div>

        <button 
          onClick={handleStartChallenge}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl text-center font-black text-sm hover:opacity-90 shadow-lg shadow-pink-100 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
        >
          <ShieldCheck size={18} /> Authenticate & Start Challenge
        </button>
      </div>
    </div>
  );
};

export default LevelWorkspacePage;
