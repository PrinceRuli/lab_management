import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/DashboardSidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import AdminDashboard from '../components/admin/AdminDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard'; // Pastikan path benar

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAuthenticated, loading } = useAuth();

  // Extract activeTab dari URL path
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const tabFromUrl = pathSegments[pathSegments.length - 1];
    
    if (tabFromUrl && tabFromUrl !== role && ['overview', 'labs', 'users', 'bookings', 'reports', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.pathname, role]);

  // Redirect jika belum login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, loading, navigate]);

  // Redirect jika role tidak valid atau tidak match dengan user role
  useEffect(() => {
    if (user && role && user.role !== role) {
      navigate(`/dashboard/${user.role}`);
      return;
    }

    // Jika tidak ada role di URL, redirect ke role user
    if (user && !role) {
      navigate(`/dashboard/${user.role}`);
      return;
    }
  }, [user, role, navigate]);

  // Handle tab change dengan update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL ketika ganti tab
    navigate(`/dashboard/${role}/${tab}`);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect jika tidak terautentikasi
  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  // Jika tidak ada role di URL, gunakan role dari user
  const currentRole = role || user?.role;

  // Validasi role
  if (!['admin', 'teacher', 'student'].includes(currentRole)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        userRole={currentRole} 
        user={user}
      />
      
      <DashboardHeader 
        activeTab={activeTab} 
        userRole={currentRole} 
        userName={user?.name || user?.username}
      />
      
      {currentRole === 'admin' ? (
        <AdminDashboard 
          activeTab={activeTab} 
          user={user} 
          onTabChange={handleTabChange} 
        />
      ) : currentRole === 'teacher' ? (
        <TeacherDashboard 
          activeTab={activeTab} 
          user={user} 
          onTabChange={handleTabChange} 
        />
      ) : (
        <div className="ml-64 pt-16">
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
              <p className="text-gray-600 mb-6">Access your courses, assignments, and grades.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold">My Courses</h3>
                  <p className="text-sm text-gray-600">View enrolled courses</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold">Assignments</h3>
                  <p className="text-sm text-gray-600">Check assignments</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold">Grades</h3>
                  <p className="text-sm text-gray-600">View your grades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;