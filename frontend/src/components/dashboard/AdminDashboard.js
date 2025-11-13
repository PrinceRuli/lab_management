import React, { useState } from 'react';
import StatsCard from './StatsCard';
import RecentBookings from './RecentBookings';
import LabUsageChart from './LabUsageChart';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Laboratories',
      value: '15',
      icon: '💻',
      change: '+2',
      description: 'from last month'
    },
    {
      title: 'Active Bookings',
      value: '47',
      icon: '📅',
      change: '+12%',
      description: 'from last week'
    },
    {
      title: 'Registered Users',
      value: '284',
      icon: '👥',
      change: '+8',
      description: 'new users'
    },
    {
      title: 'Utilization Rate',
      value: '78%',
      icon: '📊',
      change: '+5%',
      description: 'from last month'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Charts and Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LabUsageChart />
              <RecentBookings userRole="admin" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '➕', label: 'Add Lab', action: () => setActiveTab('labs') },
                  { icon: '👥', label: 'Manage Users', action: () => setActiveTab('users') },
                  { icon: '📊', label: 'View Reports', action: () => setActiveTab('reports') },
                  { icon: '⚙️', label: 'Settings', action: () => setActiveTab('settings') },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 group"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {action.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Laboratory Management</h2>
            <p className="text-gray-600">Laboratory management content goes here...</p>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Management</h2>
            <RecentBookings userRole="admin" />
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-gray-600">Content for {activeTab} goes here...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 pt-16">
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;