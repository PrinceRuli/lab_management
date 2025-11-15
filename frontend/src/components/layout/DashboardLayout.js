import React, { useState } from 'react';
import Sidebar from './DashboardSidebar'; // Pastikan path benar
import AdminDashboard from '../admin/AdminDashboard'; // Import AdminDashboard
import TeacherDashboard from '../teacher/TeacherDashboard'; // Import TeacherDashboard
import DashboardHeader from './DashboardHeader'; // Tambahkan header

const DashboardLayout = ({ userRole, user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Render content berdasarkan role
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard activeTab={activeTab} user={user} onTabChange={handleTabChange} />;
      case 'teacher':
        return <TeacherDashboard activeTab={activeTab} user={user} onTabChange={handleTabChange} />;
      case 'student':
        return (
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
              <p className="text-gray-600">Student dashboard content coming soon.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h2>
              <p className="text-gray-600">Please contact administrator.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={userRole}
        user={user}
      />
      
      {/* Header */}
      <DashboardHeader 
        activeTab={activeTab}
        userRole={userRole}
        userName={user?.name || user?.username || 'User'}
      />
      
      {/* Main Content */}
      <main className="ml-64 pt-16">
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;