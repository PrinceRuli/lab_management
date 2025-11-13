import React, { useState } from 'react';
import StatsCard from './StatsCard';
import RecentBookings from './RecentBookings';
import LabUsageChart from './LabUsageChart';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'My Bookings',
      value: '12',
      icon: '📅',
      change: '+3',
      description: 'this month'
    },
    {
      title: 'Favorites Labs',
      value: '5',
      icon: '⭐',
      change: '+1',
      description: 'new favorite'
    },
    {
      title: 'Upcoming Classes',
      value: '8',
      icon: '🏫',
      change: '-2',
      changeType: 'negative',
      description: 'this week'
    },
    {
      title: 'Success Rate',
      value: '94%',
      icon: '✅',
      change: '+2%',
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
                <div className="space-y-4">
                  {[
                    { time: '09:00 - 11:00', subject: 'Programming Class', lab: 'Computer Lab 1' },
                    { time: '13:00 - 15:00', subject: 'Database Lecture', lab: 'Multimedia Lab' },
                  ].map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{schedule.time}</p>
                        <p className="text-sm text-gray-600">{schedule.subject}</p>
                      </div>
                      <span className="text-sm text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full">
                        {schedule.lab}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <RecentBookings userRole="teacher" />
            </div>

            {/* Quick Book Lab */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Book Laboratory</h3>
                <button className="btn btn-primary">New Booking</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Computer Lab 1', 'Multimedia Lab', 'Physics Lab'].map((lab) => (
                  <button
                    key={lab}
                    className="p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 text-left"
                  >
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-cyan-600 text-xl">💻</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{lab}</h4>
                    <p className="text-sm text-green-600">Available</p>
                  </button>
                ))}
              </div>
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
            <p className="text-gray-600">Schedule management content goes here...</p>
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

export default TeacherDashboard;