import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, User, Building2, TrendingUp, 
  Briefcase, Award, FileText, Bell, Bot, Activity, 
  Settings, Shield, Menu, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

const useWindowWidth = () => {
  const [width, setWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const DashboardLayout = ({ role = 'ADMIN' }) => {
  const { isCollapsed, isMobileOpen, setIsMobileOpen, toggleMobile } = useSidebar();
  const windowWidth = useWindowWidth();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const adminNavGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard/admin/overview', icon: LayoutDashboard },
        { name: 'Courses', path: '/dashboard/admin/courses', icon: BookOpen },
        { name: 'Students', path: '/dashboard/admin/students', icon: User },
        { name: 'Institutions', path: '/dashboard/admin/institutions', icon: Building2 },
      ]
    },
    {
      label: 'Analytics',
      items: [
        { name: 'Growth', path: '/dashboard/admin/analytics', icon: TrendingUp },
        { name: 'Revenue', path: '/dashboard/admin/revenue', icon: Briefcase },
        { name: 'Certificates', path: '/dashboard/admin/certificates', icon: Award },
        { name: 'Reports', path: '/dashboard/admin/reports', icon: FileText },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'Proctoring Logs', path: '/dashboard/admin/exams/monitoring', icon: Shield },
        { name: 'Notifications', path: '/dashboard/admin/notifications', icon: Bell },
        { name: 'AI Insights', path: '/dashboard/admin/ai-insights', icon: Bot },
        { name: 'Activity', path: '/dashboard/admin/activity-logs', icon: Activity },
        { name: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
      ]
    }
  ];

  const institutionNavGroups = [
    {
      label: 'Hub',
      items: [
        { name: 'Dashboard', path: '/dashboard/institution/overview', icon: LayoutDashboard },
        { name: 'Students', path: '/dashboard/institution/students', icon: User },
        { name: 'Courses', path: '/dashboard/institution/courses', icon: BookOpen },
        { name: 'Analytics', path: '/dashboard/institution/analytics', icon: TrendingUp },
      ]
    }
  ];

  const studentNavGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard/student/overview', icon: LayoutDashboard },
        { name: 'Courses', path: '/dashboard/student/courses', icon: BookOpen },
        { name: 'Tests', path: '/dashboard/student/tests', icon: Activity },
        { name: 'Assignments', path: '/dashboard/student/assignments', icon: FileText },
        { name: 'Jobs', path: '/dashboard/student/jobs', icon: Briefcase },
      ]
    },
    {
      label: 'Learning',
      items: [
        { name: 'Analytics', path: '/dashboard/student/analytics', icon: TrendingUp },
        { name: 'Leaderboard', path: '/dashboard/student/leaderboard', icon: Award },
        { name: 'Certificates', path: '/dashboard/student/certificates', icon: Award },
        { name: 'Settings', path: '/dashboard/student/settings', icon: Settings },
      ]
    }
  ];

  const navGroups = role === 'ADMIN' ? adminNavGroups : (role === 'STUDENT' ? studentNavGroups : institutionNavGroups);
  const sidebarWidth = isCollapsed ? '90px' : '260px';

  return (
    <div className="min-h-screen bg-[#F6EAF4] flex overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        style={{ width: sidebarWidth }}
        className="hidden md:block fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out"
      >
        <Sidebar navGroups={navGroups} role={role} handleLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[70] md:hidden"
            >
              <Sidebar navGroups={navGroups} role={role} handleLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: windowWidth > 768 ? sidebarWidth : '0' }}
      >
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobile}
              className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 w-80 group focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 focus-within:border-violet-500 transition-all">
              <Search size={18} className="text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search command..." 
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user?.name || role}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{role}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-200">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
