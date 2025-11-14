import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import RecentBookings from './RecentBookings';
import LabUsageChart from './LabUsageChart';

const TeacherDashboard = ({ activeTab, user }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData({
        stats: {
          myBookings: 12,
          favoriteLabs: 5,
          upcomingClasses: 8,
          successRate: 94
        },
        todaysSchedule: [
          { time: '09:00 - 11:00', subject: 'Programming Class', lab: 'Computer Lab 1', type: 'lecture' },
          { time: '13:00 - 15:00', subject: 'Database Lecture', lab: 'Multimedia Lab', type: 'lecture' },
          { time: '16:00 - 17:00', subject: 'Student Consultation', lab: 'Office', type: 'meeting' },
        ]
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'My Bookings',
      value: dashboardData.stats?.myBookings || '0',
      icon: '📅',
      change: '+3',
      description: 'this month',
      loading
    },
    {
      title: 'Favorite Labs',
      value: dashboardData.stats?.favoriteLabs || '0',
      icon: '⭐',
      change: '+1',
      description: 'new favorite',
      loading
    },
    {
      title: 'Upcoming Classes',
      value: dashboardData.stats?.upcomingClasses || '0',
      icon: '🏫',
      change: '-2',
      changeType: 'negative',
      description: 'this week',
      loading
    },
    {
      title: 'Success Rate',
      value: `${dashboardData.stats?.successRate || '0'}%`,
      icon: '✅',
      change: '+2%',
      description: 'from last month',
      loading
    }
  ];

  const quickLabs = [
    { name: 'Computer Lab 1', status: 'available', icon: '💻', capacity: 30 },
    { name: 'Multimedia Lab', status: 'available', icon: '🎬', capacity: 20 },
    { name: 'Physics Lab', status: 'maintenance', icon: '🔬', capacity: 25 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || 'Teacher'}! 👨‍🏫</h1>
                  <p className="text-cyan-100">Ready for today's classes and laboratory sessions.</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Today's Schedule and Quick Book */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
                <div className="space-y-4">
                  {dashboardData.todaysSchedule?.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-cyan-200">
                          <span className="text-cyan-600">
                            {schedule.type === 'lecture' ? '📖' : '💬'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{schedule.time}</p>
                          <p className="text-sm text-gray-600">{schedule.subject}</p>
                        </div>
                      </div>
                      <span className="text-sm text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full">
                        {schedule.lab}
                      </span>
                    </div>
                  ))}
                </div>
                {(!dashboardData.todaysSchedule || dashboardData.todaysSchedule.length === 0) && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📅</div>
                    <p className="text-gray-500">No classes scheduled for today</p>
                  </div>
                )}
              </div>

              {/* Quick Book Laboratory */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Book Laboratory</h3>
                  <button className="btn-primary text-sm">New Booking</button>
                </div>
                <div className="space-y-4">
                  {quickLabs.map((lab, index) => (
                    <button
                      key={index}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 text-left group"
                      disabled={lab.status === 'maintenance'}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            lab.status === 'available' ? 'bg-green-100' : 'bg-amber-100'
                          }`}>
                            <span className={`text-lg ${
                              lab.status === 'available' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {lab.icon}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-cyan-600">{lab.name}</h4>
                            <p className={`text-xs ${
                              lab.status === 'available' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {lab.status === 'available' ? 'Available' : 'Under Maintenance'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Capacity: {lab.capacity}</p>
                          <span className="text-xs text-cyan-600 group-hover:text-cyan-700">Book Now →</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings and Lab Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentBookings userRole="teacher" loading={loading} />
              <LabUsageChart loading={loading} />
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Laboratories</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Laboratory Booking</h3>
              <p className="text-gray-600">Browse and book available laboratory facilities</p>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
            <RecentBookings userRole="teacher" />
          </div>
        );

      case 'schedule':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Schedule</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗓️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Schedule Management</h3>
              <p className="text-gray-600">View and manage your teaching schedule</p>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Historical Data</h3>
              <p className="text-gray-600">View your past laboratory bookings and usage</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Teacher Dashboard</h2>
            <p className="text-gray-600">Select a section from the sidebar to manage your laboratory activities.</p>
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

export default TeacherDashboard;