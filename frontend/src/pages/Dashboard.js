import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/Header';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if role is not valid
  if (!['admin', 'teacher'].includes(role)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={role} 
      />
      
      <DashboardHeader 
        activeTab={activeTab} 
        userRole={role} 
      />
      
      {role === 'admin' ? (
        <AdminDashboard activeTab={activeTab} />
      ) : (
        <TeacherDashboard activeTab={activeTab} />
      )}
    </div>
  );
};

export default Dashboard;