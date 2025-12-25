// src/router/AppRouter.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import LandingPageLayout from '../components/layouts/LandingPageLayout/LandingPageLayout';
import AdminDashboardLayout from '../components/layouts/AdminDashboardLayout/AdminDashboardLayout';
import TeacherDashboardLayout from '../components/layouts/TeacherDashboardLayout/TeacherDashboardLayout';

// Public Pages
import LandingPage from '../pages/Public/LandingPage';
import LoginForm from '../pages/Auth/LoginForm';
import SignupForm from '../pages/Auth/SignupForm';
import PrivacyPolicy from '../pages/Public/PrivacyPolicy';
import TermsAndConditions from '../pages/Public/TermsAndConditions';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserManagement from '../pages/Admin/UserManagement';
import LabManagement from '../pages/Admin/LabManagement';
import BookingManagement from '../pages/Admin/BookingManagement';
import ReportAnalytics from '../pages/Admin/ReportAnalytics';

// Teacher Pages
import TeacherDashboard from '../pages/Teacher/TeacherDashboard';
import MySchedule from '../pages/Teacher/MySchedule';
import BookingLabs from '../pages/Teacher/BookingLabs';
import BookingHistory from '../pages/Teacher/BookingHistory';
import Resources from '../pages/Teacher/Resources';
import ArticleManagement from '../pages/Teacher/ArticleManagement';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* ============ PUBLIC ROUTES ============ */}
          <Route path="/" element={
            <LandingPageLayout>
              <LandingPage />
            </LandingPageLayout>
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* ============ ADMIN ROUTES ============ */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboardLayout>
                <AdminDashboard />
              </AdminDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin">
              <AdminDashboardLayout>
                <UserManagement />
              </AdminDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/labs" element={
            <ProtectedRoute role="admin">
              <AdminDashboardLayout>
                <LabManagement />
              </AdminDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/bookings" element={
            <ProtectedRoute role="admin">
              <AdminDashboardLayout>
                <BookingManagement />
              </AdminDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/reports" element={
            <ProtectedRoute role="admin">
              <AdminDashboardLayout>
                <ReportAnalytics />
              </AdminDashboardLayout>
            </ProtectedRoute>
          } />

          {/* ============ TEACHER ROUTES ============ */}
          <Route path="/teacher" element={<Navigate to="/teacher/dashboard" />} />
          
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardLayout>
                <TeacherDashboard />
              </TeacherDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/schedule" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardLayout>
                <MySchedule />
              </TeacherDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/booking" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardLayout>
                <BookingLabs />
              </TeacherDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/history" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardLayout>
                <BookingHistory />
              </TeacherDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/resources" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardLayout>
                <Resources />
              </TeacherDashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/articles" element={
            <ProtectedRoute role="teacher">
              <TeacherDashboardLayout>
                <ArticleManagement />
              </TeacherDashboardLayout>
            </ProtectedRoute>
          } />

          {/* ============ 404 ROUTE ============ */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
                <p className="text-gray-500 mb-8">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="space-y-3">
                  <a 
                    href="/" 
                    className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Homepage
                  </a>
                  <button 
                    onClick={() => window.history.back()}
                    className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;