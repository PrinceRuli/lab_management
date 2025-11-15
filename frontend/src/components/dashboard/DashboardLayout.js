import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';

const DashboardLayout = ({ userRole, user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={userRole}
        user={user}
      />
      
      <div className="flex-1 ml-64">
        {userRole === 'admin' ? (
          <AdminDashboard activeTab={activeTab} user={user} />
        ) : (
          <TeacherDashboard activeTab={activeTab} user={user} />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;