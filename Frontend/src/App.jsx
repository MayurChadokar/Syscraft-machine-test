import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import EventListing from './pages/EventListing';
import EventDetails from './pages/EventDetails';
import SurveyForm from './pages/SurveyForm';
import CertificateDownload from './pages/CertificateDownload';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import CreateSurvey from './pages/CreateSurvey';
import EventRegistrations from './pages/EventRegistrations';
import SurveyReports from './pages/SurveyReports';
import AdminLogin from './pages/AdminLogin';

import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to admin login");
    return <Navigate to="/admin/login" />;
  }

  if (role && user.role !== role) {
    console.log(`User role ${user.role} does not match required role ${role}, redirecting to home`);
    return <Navigate to="/" />;
  }

  return children;
};

import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Public Browsing Routes */}
          <Route path="/events" element={<MainLayout><EventListing /></MainLayout>} />
          <Route path="/events/:id" element={<MainLayout><EventDetails /></MainLayout>} />
          
          {/* Public Survey & Certificate Routes (Guest Friendly) */}
          <Route path="/survey/:eventId" element={<MainLayout><SurveyForm /></MainLayout>} />
          <Route path="/certificate-download/:eventId" element={<MainLayout><CertificateDownload /></MainLayout>} />

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute role="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/events/create" element={<ProtectedRoute role="admin"><AdminLayout><CreateEvent /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/survey/create/:eventId" element={<ProtectedRoute role="admin"><AdminLayout><CreateSurvey /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/registrations/:eventId" element={<ProtectedRoute role="admin"><AdminLayout><EventRegistrations /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminLayout><SurveyReports /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
