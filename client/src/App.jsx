import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components & Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import JobsPage from './pages/JobsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LMSPage from './pages/LMSPage';
import LeaderboardPage from './pages/LeaderboardPage';

// Dashboards
import StudentDashboard from './dashboards/StudentDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import AdminCourses from './dashboards/AdminCourses';
import AdminCourseBuilder from './dashboards/AdminCourseBuilder';
import InstitutionDashboard from './dashboards/InstitutionDashboard';
import CompanyDashboard from './dashboards/CompanyDashboard';

// Restored Components
import Profile from './pages/Profile';
import AdminCourseManager from './pages/AdminCourseManager';
import StudentCourses from './pages/StudentCourses';
import CourseDetailsPage from './pages/CourseDetailsPage';
import AIChatWidget from './components/AIChatWidget';

// Placeholder Components for Missing Views
const PlaceholderView = ({ title }) => (
  <div className="flex items-center justify-center h-full min-h-[400px] bg-slate-900 rounded-2xl border border-white/5">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400">This module is currently being reconnected.</p>
    </div>
  </div>
);

// Layout Wrappers
// New Assignments & Proctoring imports
import AssignmentsDashboard from './pages/student/AssignmentsDashboard';
import CourseRoadmapPage from './pages/student/CourseRoadmapPage';
import LevelWorkspacePage from './pages/student/LevelWorkspacePage';
import StudentCourseDetails from './pages/student/StudentCourseDetails';
import SecureWorkspacePage from './pages/student/SecureWorkspacePage';
import StudentAnalytics from './pages/student/StudentAnalytics';
import CourseAssignments from './pages/admin/CourseAssignments';
import ExamMonitoring from './pages/admin/ExamMonitoring';

// Layout Wrappers
const PublicLayout = () => (
  <div 
    className="flex flex-col min-h-screen font-sans selection:bg-pink-150 overflow-x-hidden relative"
    style={{ background: 'radial-gradient(circle at 50% 50%, #f8e5f4 0%, #eccde5 35%, #dfb5d8 65%, #c88dc0 100%)' }}
  >
    {/* Cinematic Noise Texture Overlay */}
    <div className="fixed inset-0 z-[1] opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    
    {/* Ambient Vignette Effect */}
    <div className="fixed inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_100%)]" />

    {/* Layered Glow Blobs & Radial Spotlights */}
    <div className="fixed top-1/4 left-1/4 w-[700px] h-[700px] bg-violet-400/25 blur-[140px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />
    <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-400/25 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '9s' }} />
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-pink-300/35 to-violet-300/35 blur-[180px] rounded-full pointer-events-none z-0" />

    <Navbar />
    <main className="flex-grow relative z-10">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AuthLayout = () => (
  <div className="flex flex-col min-h-screen">
    <main className="flex-grow flex items-center justify-center">
      <Outlet />
    </main>
  </div>
);

const StudentLayoutWrapper = () => (
  <ProtectedRoute role="STUDENT">
    <DashboardLayout role="STUDENT" />
  </ProtectedRoute>
);

const AdminLayoutWrapper = () => (
  <ProtectedRoute role="ADMIN">
    <DashboardLayout role="ADMIN" />
  </ProtectedRoute>
);

import { SocketProvider } from './context/SocketContext';
import { SidebarProvider } from './context/SidebarContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <SidebarProvider>
          <Router>
          <Toaster position="top-right" />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/internships" element={<JobsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/course/:id" element={<CourseDetailsPage />} />
                <Route path="/courses/:slug" element={<CourseDetailsPage />} />
                <Route 
                  path="/course/:id/learn" 
                  element={
                    <ProtectedRoute role="STUDENT">
                      <LMSPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>

              {/* Auth Routes with NO Footer */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Student Dashboard Routes */}
              <Route path="/dashboard/student" element={<StudentLayoutWrapper />}>
                <Route index element={<Navigate to="/dashboard/student/overview" replace />} />
                <Route path="overview" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="courses/:id" element={<StudentCourseDetails />} />
                <Route path="profile" element={<Profile />} />
                <Route path="analytics" element={<StudentAnalytics />} />
                <Route path="tests" element={<PlaceholderView title="Tests" />} />
                <Route path="assignments" element={<AssignmentsDashboard />} />
                <Route path="assignments/:courseId" element={<CourseRoadmapPage />} />
                <Route path="assignments/:courseId/level/:levelId" element={<LevelWorkspacePage />} />
                <Route path="company-questions" element={<PlaceholderView title="Company Questions" />} />
                <Route path="jobs" element={<PlaceholderView title="Jobs" />} />
                <Route path="bookmarks" element={<PlaceholderView title="Bookmarks" />} />
                <Route path="attendance" element={<PlaceholderView title="Attendance" />} />
                <Route path="leaderboard" element={<PlaceholderView title="Leaderboard" />} />
                <Route path="certificates" element={<PlaceholderView title="Certificates" />} />
                <Route path="coding" element={<PlaceholderView title="Coding Practice" />} />
                <Route path="report" element={<PlaceholderView title="Report Issue" />} />
                <Route path="ask-ai" element={<PlaceholderView title="Ask AI" />} />
                <Route path="settings" element={<PlaceholderView title="Settings" />} />
              </Route>

              {/* Standalone Secure Exam Route */}
              <Route 
                path="/secure-exam/:courseId/:levelId" 
                element={
                  <ProtectedRoute role="STUDENT">
                    <SecureWorkspacePage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Dashboard Routes */}
              <Route path="/dashboard/admin" element={<AdminLayoutWrapper />}>
                <Route index element={<Navigate to="/dashboard/admin/overview" replace />} />
                <Route path="overview" element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/create" element={<AdminCourseBuilder />} />
                <Route path="courses/edit/:id" element={<AdminCourseBuilder />} />
                <Route path="courses/:courseId/assignments" element={<CourseAssignments />} />
                <Route path="exams/monitoring" element={<ExamMonitoring />} />
                <Route path="students" element={<PlaceholderView title="Manage Students" />} />
                <Route path="analytics" element={<PlaceholderView title="Admin Analytics" />} />
                <Route path="revenue" element={<PlaceholderView title="Revenue Tracking" />} />
                <Route path="certificates" element={<PlaceholderView title="Certificates Management" />} />
                <Route path="notifications" element={<PlaceholderView title="Notifications Hub" />} />
                <Route path="settings" element={<PlaceholderView title="Admin Settings" />} />
              </Route>

              {/* Other Role Dashboards (For Future Use / Legacy) */}
              <Route 
                path="/institution/*" 
                element={
                  <ProtectedRoute role="INSTITUTION">
                    <DashboardLayout role="INSTITUTION">
                      <InstitutionDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company/*" 
                element={
                  <ProtectedRoute role="COMPANY">
                    <DashboardLayout role="COMPANY">
                      <CompanyDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Catch All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <AIChatWidget />
        </Router>
      </SidebarProvider>
    </SocketProvider>
  </AuthProvider>
  );
}

export default App;
