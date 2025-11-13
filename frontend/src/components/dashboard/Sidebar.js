import React from 'react';

const Sidebar = ({ activeTab, onTabChange, userRole }) => {
  const adminMenu = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'labs', name: 'Laboratories', icon: '💻' },
    { id: 'bookings', name: 'Bookings', icon: '📅' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'reports', name: 'Reports', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  const teacherMenu = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'labs', name: 'Laboratories', icon: '💻' },
    { id: 'bookings', name: 'My Bookings', icon: '📅' },
    { id: 'schedule', name: 'Schedule', icon: '🗓️' },
    { id: 'history', name: 'History', icon: '📋' },
  ];

  const menuItems = userRole === 'admin' ? adminMenu : teacherMenu;

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen fixed left-0 top-0 pt-16">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-8 p-3 bg-cyan-50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {userRole === 'admin' ? 'A' : 'T'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {userRole === 'admin' ? 'Administrator' : 'Teacher'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 mt-8 transition-all duration-200">
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;