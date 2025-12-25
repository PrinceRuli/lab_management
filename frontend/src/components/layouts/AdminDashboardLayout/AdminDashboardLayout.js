// src/components/layouts/AdminDashboardLayout/AdminDashboardLayout.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaFlask,
  FaBell,
  FaCalendarCheck,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import Notifications from '../../common/Notifications';
import AccountSettings from '../../common/AccountSettings';

const AdminDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [currentUser, setCurrentUser] = useState(user || { name: 'Admin', role: 'admin', info: '' });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onUserUpdated = (e) => {
      const u = e.detail || JSON.parse(localStorage.getItem('user'));
      setCurrentUser(u || { name: 'Admin', role: 'admin', info: '' });
    };
    window.addEventListener('user-updated', onUserUpdated);
    return () => window.removeEventListener('user-updated', onUserUpdated);
  }, []);

  const navItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'User Management' },
    { path: '/admin/labs', icon: <FaFlask />, label: 'Lab Management' },
    { path: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Booking Management' },
    { path: '/admin/reports', icon: <FaChartBar />, label: 'Reports & Analytics' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <FaFlask className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-xl font-bold">LabSchedule</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded inline-block mt-1">Admin</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white w-full"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Header (sticky) */}
      <header className="fixed top-0 left-0 right-0 md:left-64 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {navItems.find(item => window.location.pathname === item.path)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Notifications trigger={<FaBell className="h-5 w-5" />} />
              <div className="hidden md:flex items-center space-x-3 cursor-pointer" onClick={() => setSettingsOpen(true)}>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role === 'admin' ? (currentUser?.info || 'Administrator') : currentUser?.info || 'Administrator'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                  <span className="text-sm font-medium text-blue-800">{(currentUser?.name || 'A').charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen flex flex-col pt-16">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      {settingsOpen && (
        <AccountSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
};

export default AdminDashboardLayout;