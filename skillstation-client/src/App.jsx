import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

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
import InstitutionDashboard from './dashboards/InstitutionDashboard';
import CompanyDashboard from './dashboards/CompanyDashboard';

// Placeholder for Course Details
const CourseDetailsPage = () => <div className="pt-32 text-center text-3xl">Course Details Page (Coming Soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route 
            path="/course/:id/learn" 
            element={
              <ProtectedRoute role="STUDENT">
                <LMSPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/internships" element={<JobsPage />} /> {/* Reusing JobsPage for now */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard/student" 
            element={
              <ProtectedRoute role="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/institution" 
            element={
              <ProtectedRoute role="INSTITUTION">
                <InstitutionDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/company" 
            element={
              <ProtectedRoute role="COMPANY">
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
