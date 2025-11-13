import React from 'react';

const DashboardHeader = ({ userRole, activeTab }) => {
  const getPageTitle = (tab) => {
    const titles = {
      overview: 'Dashboard Overview',
      labs: 'Laboratory Management',
      bookings: userRole === 'admin' ? 'All Bookings' : 'My Bookings',
      users: 'User Management',
      reports: 'Analytics & Reports',
      settings: 'System Settings',
      schedule: 'Teaching Schedule',
      history: 'Booking History',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-40">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {userRole === 'admin' ? 'Administrator' : 'Teacher'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors duration-200">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {userRole === 'admin' ? 'Admin User' : 'Teacher User'}
                </p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {userRole === 'admin' ? 'A' : 'T'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;