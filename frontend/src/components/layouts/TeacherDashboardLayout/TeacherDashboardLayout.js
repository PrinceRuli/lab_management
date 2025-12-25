// src/components/layouts/TeacherDashboardLayout/TeacherDashboardLayout.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaFlask, 
  FaHistory,
  FaBook,
  FaNewspaper,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBell
} from 'react-icons/fa';
import Notifications from '../../common/Notifications';
import AccountSettings from '../../common/AccountSettings';

const TeacherDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Teacher', role: 'teacher' };
  const [currentUser, setCurrentUser] = useState(user);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onUserUpdated = (e) => {
      const u = e.detail || JSON.parse(localStorage.getItem('user'));
      setCurrentUser(u || { name: 'Teacher', role: 'teacher' });
    };
    window.addEventListener('user-updated', onUserUpdated);
    return () => window.removeEventListener('user-updated', onUserUpdated);
  }, []);

  const navItems = [
    { path: '/teacher/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/teacher/schedule', icon: <FaCalendarAlt />, label: 'My Schedule' },
    { path: '/teacher/booking', icon: <FaFlask />, label: 'Book Lab' },
    { path: '/teacher/history', icon: <FaHistory />, label: 'Booking History' },
    { path: '/teacher/resources', icon: <FaBook />, label: 'Resources' },
    { path: '/teacher/articles', icon: <FaNewspaper />, label: 'Articles' },
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
          className="p-2 rounded-md bg-white shadow-md border border-gray-200"
        >
          {sidebarOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <FaFlask className="h-8 w-8 text-green-400" />
              <div>
                <span className="text-xl font-bold block">LabSchedule</span>
                <span className="text-xs bg-green-600 px-2 py-1 rounded inline-block mt-1">Teacher</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  <FaUserCircle className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name || 'Teacher User'}</p>
                <p className="text-sm text-gray-400 truncate">{user.email || 'teacher@lab.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${window.location.pathname === item.path 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
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

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen flex flex-col pt-16">
        {/* Top Header (sticky) */}
        <header className="fixed top-0 left-0 right-0 md:left-64 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {navItems.find(item => window.location.pathname === item.path)?.label || 'Teacher Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Notifications trigger={<FaBell className="h-5 w-5" />} />
                
                {/* User Menu (Desktop) */}
                <div className="hidden md:flex items-center space-x-3 cursor-pointer" onClick={() => setSettingsOpen(true)}>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500">{currentUser?.role === 'teacher' ? (currentUser?.info || 'Teacher') : currentUser?.info || 'Teacher'}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                    <span className="text-sm font-medium text-green-800">{(currentUser?.name || 'T').charAt(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} LabSchedule Teacher Dashboard
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Teacher Account
              </span>
              <span className="text-xs text-gray-500">
                Last login: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </footer>
      </div>
      {settingsOpen && (
        <AccountSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboardLayout;