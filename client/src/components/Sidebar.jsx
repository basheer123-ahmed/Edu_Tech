import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = ({ navGroups, role, handleLogout }) => {
  const { isCollapsed, toggleCollapsed, closeMobile } = useSidebar();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo Section */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-6'} gap-3 border-b border-slate-100 shrink-0`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
          <Sparkles size={20} className="text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="font-black text-xl text-slate-900 whitespace-nowrap tracking-tight"
            >
              SkillStation
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {navGroups.map((group, groupIdx) => (
          <div key={group.label || groupIdx} className="space-y-2">
            {!isCollapsed && (
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-xl shadow-violet-200'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-violet-600 transition-colors'}`} />
                    
                    {!isCollapsed && (
                      <span className="text-sm font-bold whitespace-nowrap flex-1">
                        {item.name}
                      </span>
                    )}

                    {isActive && !isCollapsed && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="w-1.5 h-1.5 rounded-full bg-white/40" 
                      />
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none translate-x-2 group-hover:translate-x-0 transition-all z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle Button (Desktop Only) */}
      <button 
        onClick={toggleCollapsed}
        className="hidden md:flex absolute -right-3 top-24 w-7 h-7 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default Sidebar;
