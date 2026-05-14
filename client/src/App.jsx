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
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
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
                <Route path="courses/:id" element={<CourseDetailsPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="analytics" element={<PlaceholderView title="Analytics" />} />
                <Route path="tests" element={<PlaceholderView title="Tests" />} />
                <Route path="assignments" element={<PlaceholderView title="Assignments" />} />
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

              {/* Admin Dashboard Routes */}
              <Route path="/dashboard/admin" element={<AdminLayoutWrapper />}>
                <Route index element={<Navigate to="/dashboard/admin/overview" replace />} />
                <Route path="overview" element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/create" element={<AdminCourseBuilder />} />
                <Route path="courses/edit/:id" element={<AdminCourseBuilder />} />
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
