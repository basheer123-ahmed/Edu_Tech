import React from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const notifications = [
    { id: 1, type: 'SUCCESS', title: 'Course Completed', message: 'Congratulations! You completed React Mastery.', time: '2 mins ago' },
    { id: 2, type: 'INFO', title: 'New Job Match', message: 'A new Senior Developer role matches your skills.', time: '1 hour ago' },
    { id: 3, type: 'WARNING', title: 'Deadline Approaching', message: 'Your quiz for Module 3 is due in 24 hours.', time: '5 hours ago' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Bell size={20} className="text-primary" /> Notifications
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">3 New</span>
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                      notif.type === 'WARNING' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {notif.type === 'SUCCESS' ? <CheckCircle size={20} /> :
                       notif.type === 'WARNING' ? <AlertTriangle size={20} /> : <Info size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">{notif.title}</p>
                        <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 text-center border-t border-gray-50">
              <button className="text-sm font-bold text-primary hover:underline">Mark all as read</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
