import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/Header';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAuthenticated, loading } = useAuth();

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
      // Redirect ke dashboard yang sesuai dengan role user
      navigate(`/dashboard/${user.role}`);
      return;
    }
  }, [user, role, navigate]);

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
        onTabChange={setActiveTab} 
        userRole={currentRole} 
        user={user}
      />
      
      <DashboardHeader 
        activeTab={activeTab} 
        userRole={currentRole} 
        userName={user?.name || user?.username}
      />
      
      {currentRole === 'admin' ? (
        <AdminDashboard activeTab={activeTab} user={user} />
      ) : currentRole === 'teacher' ? (
        <TeacherDashboard activeTab={activeTab} user={user} />
      ) : (
        <div className="ml-64 pt-16">
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
              <p className="text-gray-600">Student dashboard is under development.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;