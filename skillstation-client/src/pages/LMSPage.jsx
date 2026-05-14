import React, { useState } from 'react';
import { 
  PlayCircle, CheckCircle, Lock, 
  ChevronRight, FileText, HelpCircle, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LMSPage = () => {
  const [activeLesson, setActiveLesson] = useState(1);
  const [expandedModule, setExpandedModule] = useState(1);

  const modules = [
    {
      id: 1,
      title: "Introduction to Web Development",
      lessons: [
        { id: 1, title: "What is the Web?", type: "video", duration: "10:24", completed: true },
        { id: 2, title: "Setting up your Environment", type: "video", duration: "15:45", completed: true },
        { id: 3, title: "HTML Basics", type: "video", duration: "20:10", completed: false },
      ]
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      lessons: [
        { id: 4, title: "Flexbox Mastery", type: "video", duration: "18:20", completed: false, locked: true },
        { id: 5, title: "CSS Grid Layouts", type: "video", duration: "25:30", completed: false, locked: true },
        { id: 6, title: "Animations and Transitions", type: "video", duration: "12:15", completed: false, locked: true },
      ]
    },
    {
      id: 3,
      title: "JavaScript Fundamentals",
      lessons: [
        { id: 7, title: "Variables and Data Types", type: "quiz", duration: "5 mins", completed: false, locked: true },
        { id: 8, title: "Functions and Scope", type: "video", duration: "30:00", completed: false, locked: true },
      ]
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Main Content (Video Player) */}
      <div className="flex-1 lg:h-[calc(100vh-96px)] overflow-y-auto border-r border-gray-100">
        <div className="p-6 lg:p-10 max-w-5xl mx-auto">
          <Link to="/dashboard/student" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          {/* Video Placeholder */}
          <div className="aspect-video bg-secondary rounded-3xl mb-10 relative group cursor-pointer overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={80} className="text-white opacity-80 group-hover:scale-110 group-hover:text-primary transition-all" />
            </div>
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-50" alt="Video Thumbnail" />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">What is the Web?</h1>
              <p className="text-gray-500">Module 1 • Lesson 1 • 10:24 mins</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              Mark as Completed <CheckCircle size={18} />
            </button>
          </div>

          <hr className="border-gray-100 my-10" />

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-secondary mb-6">About this lesson</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              In this introductory lesson, we'll explore the foundational concepts of the World Wide Web. 
              We'll discuss how servers and clients interact, the role of HTTP, and why understanding the 
              architecture of the web is crucial for any developer.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-2xl flex items-center gap-4">
                <FileText className="text-primary" size={24} />
                <div>
                  <p className="font-bold text-secondary">Download Resources</p>
                  <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl flex items-center gap-4">
                <HelpCircle className="text-blue-500" size={24} />
                <div>
                  <p className="font-bold text-secondary">Lesson Quiz</p>
                  <p className="text-sm text-gray-500">5 Questions • 10 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Course Content) */}
      <div className="w-full lg:w-[400px] bg-gray-50 h-screen lg:h-[calc(100vh-96px)] overflow-y-auto">
        <div className="p-8">
          <h3 className="text-xl font-bold text-secondary mb-6">Course Content</h3>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-secondary text-left">{module.title}</span>
                  <ChevronRight size={18} className={`text-gray-400 transition-transform ${expandedModule === module.id ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedModule === module.id && (
                  <div className="p-2 border-t border-gray-50">
                    {module.lessons.map((lesson) => (
                      <button 
                        key={lesson.id}
                        disabled={lesson.locked}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full p-4 flex items-center justify-between rounded-xl transition-all ${
                          activeLesson === lesson.id ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-500'
                        } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? <CheckCircle size={18} className="text-green-500" /> : <PlayCircle size={18} />}
                          <span className="text-sm font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{lesson.duration}</span>
                          {lesson.locked && <Lock size={14} />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMSPage;
