import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, onTabChange, userRole, user }) => {
  const { logout } = useAuth();

  const adminMenu = [
    { id: 'overview', name: 'Dashboard', icon: '📊' },
    { id: 'labs', name: 'Laboratory Management', icon: '🏢' },
    { id: 'bookings', name: 'Booking Management', icon: '📅' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'reports', name: 'System Reports', icon: '📈' },
    { id: 'settings', name: 'System Settings', icon: '⚙️' },
  ];

  const teacherMenu = [
    { id: 'overview', name: 'Dashboard', icon: '📊' },
    { id: 'labs', name: 'Available Laboratories', icon: '💻' },
    { id: 'bookings', name: 'My Bookings', icon: '📅' },
    { id: 'schedule', name: 'Teaching Schedule', icon: '🗓️' },
    { id: 'history', name: 'Booking History', icon: '📋' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin': return adminMenu;
      case 'teacher': return teacherMenu;
      default: return teacherMenu; // Default ke teacher menu untuk role lainnya
    }
  };

  const menuItems = getMenuItems();

  // Warna tema berdasarkan role
  const getRoleColors = () => {
    switch (userRole) {
      case 'admin':
        return {
          bg: 'bg-blue-500',
          hover: 'hover:bg-blue-50 hover:text-blue-600',
          active: 'bg-blue-500 text-white',
          gradient: 'from-blue-500 to-blue-600',
          light: 'bg-blue-50'
        };
      case 'teacher':
        return {
          bg: 'bg-cyan-500',
          hover: 'hover:bg-cyan-50 hover:text-cyan-600',
          active: 'bg-cyan-500 text-white',
          gradient: 'from-cyan-500 to-cyan-600',
          light: 'bg-cyan-50'
        };
      default:
        return {
          bg: 'bg-cyan-500',
          hover: 'hover:bg-cyan-50 hover:text-cyan-600',
          active: 'bg-cyan-500 text-white',
          gradient: 'from-cyan-500 to-cyan-600',
          light: 'bg-cyan-50'
        };
    }
  };

  const colors = getRoleColors();

  // Label role yang lebih deskriptif
  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'System Administrator';
      case 'teacher': return 'Teacher';
      default: return 'User';
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen fixed left-0 top-0 pt-16 z-40">
      <div className="p-6">
        {/* User Info */}
        <div className={`flex items-center space-x-3 mb-8 p-3 ${colors.light} rounded-lg`}>
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : userRole.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || (userRole === 'admin' ? 'Administrator' : userRole === 'teacher' ? 'Teacher' : 'User')}
            </p>
            <p className="text-xs text-gray-500 capitalize">{getRoleLabel()}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? `${colors.active} shadow-md`
                  : `text-gray-700 ${colors.hover}`
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 mt-8 transition-all duration-200 border-t border-gray-100 pt-4"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>

        {/* Role Indicator */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            Logged in as <span className="font-medium text-gray-700 capitalize">{userRole}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;