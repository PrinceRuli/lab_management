import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import LandingPageLayout from '../components/layouts/LandingPageLayout/LandingPageLayout';
import AdminDashboardLayout from '../components/layouts/AdminDashboardLayout/AdminDashboardLayout';
import TeacherDashboardLayout from '../components/layouts/TeacherDashboardLayout/TeacherDashboardLayout';

// Loading Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load components for better performance
const LandingPage = lazy(() => import('../pages/Public/LandingPage'));
const SchedulesPage = lazy(() => import('../pages/Public/SchedulesPage'));
const LoginForm = lazy(() => import('../pages/Auth/LoginForm'));
const SignupForm = lazy(() => import('../pages/Auth/SignupForm'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const PrivacyPolicy = lazy(() => import('../pages/Public/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/Public/TermsAndConditions'));

// Admin Pages - Lazy loaded
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/Admin/UserManagement'));
const LabManagement = lazy(() => import('../pages/Admin/LabManagement'));
const BookingManagement = lazy(() => import('../pages/Admin/BookingManagement'));
const ReportAnalytics = lazy(() => import('../pages/Admin/ReportAnalytics'));

// Teacher Pages - Lazy loaded
const TeacherDashboard = lazy(() => import('../pages/Teacher/TeacherDashboard'));
const MySchedule = lazy(() => import('../pages/Teacher/MySchedule'));
const BookingLabs = lazy(() => import('../pages/Teacher/BookingLabs'));
const BookingHistory = lazy(() => import('../pages/Teacher/BookingHistory'));
const Resources = lazy(() => import('../pages/Teacher/Resources'));
const ArticleManagement = lazy(() => import('../pages/Teacher/ArticleManagement'));

// Protected Route Component - Improved version
const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  
  React.useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');
      
      if (!token || !user) {
        setIsAuthenticated(false);
        return;
      }
      
      if (role && user?.role !== role) {
        setIsAuthenticated('unauthorized');
        return;
      }
      
      setIsAuthenticated(true);
    };
    
    checkAuth();
    
    // Listen for storage changes
    const handleStorageChange = () => checkAuth();
    
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [role]);
  
  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }
  
  if (isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  
  if (isAuthenticated === 'unauthorized') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (for logged-in users who shouldn't access login/signup)
const PublicRoute = ({ children }) => {
  const [isChecking, setIsChecking] = React.useState(true);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      setShouldRedirect(true);
    }
    
    setIsChecking(false);
  }, []);
  
  if (isChecking) {
    return <LoadingSpinner />;
  }
  
  if (shouldRedirect) {
    // Redirect to appropriate dashboard based on role
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_normalizeFormMethod: true
      }}
    >
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
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* ============ PUBLIC ROUTES ============ */}
            <Route path="/" element={
              <LandingPageLayout>
                <LandingPage />
              </LandingPageLayout>
            } />

            <Route path="/schedules" element={
              <LandingPageLayout>
                <SchedulesPage />
              </LandingPageLayout>
            } />
            
            <Route path="/login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            
            <Route path="/signup" element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            } />
            
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            <Route path="/privacy" element={
              <LandingPageLayout>
                <PrivacyPolicy />
              </LandingPageLayout>
            } />
            
            <Route path="/terms" element={
              <LandingPageLayout>
                <TermsAndConditions />
              </LandingPageLayout>
            } />

            {/* ============ ADMIN ROUTES ============ */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
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
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            
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
              <LandingPageLayout>
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-6">Oops! Halaman tidak ditemukan</p>
                    <p className="text-gray-500 mb-8">
                      Halaman yang Anda cari tidak ada atau telah dipindahkan.
                    </p>
                    <div className="space-y-3">
                      <a 
                        href="/" 
                        className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Kembali ke Beranda
                      </a>
                      <button 
                        onClick={() => window.history.back()}
                        className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Kembali
                      </button>
                    </div>
                  </div>
                </div>
              </LandingPageLayout>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;