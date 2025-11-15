import React, { useState, useEffect } from 'react';
import StatsCard from '../common/StatsCard';
import RecentBookings from '../booking/RecentBookings';
import LabUsageChart from './LabUsageChart';
import BookingForm from '../booking/BookingForm';

const TeacherDashboard = ({ activeTab, user }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  // Simulate data loading untuk teacher
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData({
        stats: {
          approvedBookings: 8,
          pendingBookings: 2,
          upcomingClasses: 5,
          utilizationRate: 76
        },
        todaysSchedule: [
          { 
            time: '09:00 - 11:00', 
            subject: 'Programming Class', 
            lab: 'Computer Lab 1', 
            type: 'lecture',
            status: 'confirmed'
          },
          { 
            time: '13:00 - 15:00', 
            subject: 'Database Lecture', 
            lab: 'Multimedia Lab', 
            type: 'lecture',
            status: 'confirmed'
          },
          { 
            time: '16:00 - 17:00', 
            subject: 'Student Consultation', 
            lab: 'Office', 
            type: 'meeting',
            status: 'confirmed'
          },
        ],
        pendingApprovals: [
          {
            id: 1,
            lab: 'Physics Lab',
            date: '2024-01-18',
            time: '10:00 - 12:00',
            subject: 'Advanced Physics',
            status: 'pending',
            submittedDate: '2024-01-10'
          }
        ]
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewBooking = () => {
    setIsBookingFormOpen(true);
  };

  const handleBookingSubmit = (bookingData) => {
    console.log('New booking submitted:', bookingData);
    // Simpan booking dan tambahkan ke pending approvals
    setDashboardData(prev => ({
      ...prev,
      pendingApprovals: [
        ...prev.pendingApprovals,
        {
          id: Date.now(),
          lab: bookingData.lab,
          date: bookingData.date,
          time: `${bookingData.startTime} - ${bookingData.endTime}`,
          subject: bookingData.subject,
          status: 'pending',
          submittedDate: new Date().toISOString().split('T')[0]
        }
      ],
      stats: {
        ...prev.stats,
        pendingBookings: prev.stats.pendingBookings + 1
      }
    }));
    alert('Booking submitted successfully! Waiting for admin approval.');
  };

  const stats = [
    {
      title: 'Approved Bookings',
      value: dashboardData.stats?.approvedBookings || '0',
      icon: '✅',
      change: '+2',
      description: 'this month',
      loading
    },
    {
      title: 'Pending Approval',
      value: dashboardData.stats?.pendingBookings || '0',
      icon: '⏳',
      change: '+1',
      description: 'awaiting review',
      loading
    },
    {
      title: 'Upcoming Classes',
      value: dashboardData.stats?.upcomingClasses || '0',
      icon: '🏫',
      change: '-1',
      changeType: 'negative',
      description: 'this week',
      loading
    },
    {
      title: 'Utilization Rate',
      value: `${dashboardData.stats?.utilizationRate || '0'}%`,
      icon: '📊',
      change: '+5%',
      description: 'from last month',
      loading
    }
  ];

  const quickLabs = [
    { name: 'Computer Lab 1', status: 'available', icon: '💻', capacity: 30 },
    { name: 'Computer Lab 2', status: 'available', icon: '💻', capacity: 30 },
    { name: 'Multimedia Lab', status: 'available', icon: '🎬', capacity: 20 },
    { name: 'Physics Lab', status: 'maintenance', icon: '🔬', capacity: 25 },
    { name: 'Chemistry Lab', status: 'available', icon: '🧪', capacity: 25 },
    { name: 'Biology Lab', status: 'available', icon: '🔬', capacity: 20 }
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
                  <p className="text-cyan-100">Manage your laboratory bookings and teaching schedule</p>
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

            {/* Pending Approvals & Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {dashboardData.pendingApprovals?.length || 0} requests
                  </span>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.pendingApprovals?.map((approval, index) => (
                    <div key={index} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{approval.lab}</h4>
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                          Waiting Approval
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">📅 {approval.date} | 🕒 {approval.time}</p>
                      <p className="text-sm text-gray-600">📚 {approval.subject}</p>
                      <p className="text-xs text-gray-500 mt-2">Submitted on {approval.submittedDate}</p>
                    </div>
                  ))}
                  
                  {(!dashboardData.pendingApprovals || dashboardData.pendingApprovals.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-gray-500">No pending approvals</p>
                    </div>
                  )}
                </div>
              </div>

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
                          <p className="text-xs text-cyan-600">{schedule.lab}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        Confirmed
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
            </div>

            {/* Quick Book Laboratory */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Quick Book Laboratory</h3>
                <button 
                  onClick={handleNewBooking}
                  className="btn-primary"
                >
                  New Booking
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLabs.map((lab, index) => (
                  <button
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 text-left group"
                    disabled={lab.status === 'maintenance'}
                    onClick={handleNewBooking}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        lab.status === 'available' ? 'bg-green-100' : 'bg-amber-100'
                      }`}>
                        <span className={`text-xl ${
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Capacity: {lab.capacity}</span>
                      <span className="text-xs text-cyan-600 group-hover:text-cyan-700 font-medium">
                        Book Now →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Bookings and Personal Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentBookings userRole="teacher" loading={loading} />
              <LabUsageChart loading={loading} />
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Laboratories</h2>
              <button 
                onClick={handleNewBooking}
                className="btn-primary"
              >
                Book Laboratory
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLabs.map((lab, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      lab.status === 'available' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <span className={`text-xl ${
                        lab.status === 'available' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {lab.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lab.name}</h3>
                      <p className={`text-sm ${
                        lab.status === 'available' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {lab.status === 'available' ? 'Available' : 'Under Maintenance'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Capacity: {lab.capacity} students</p>
                    <p>Equipment: Standard lab equipment</p>
                  </div>
                  <button
                    onClick={handleNewBooking}
                    disabled={lab.status === 'maintenance'}
                    className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      lab.status === 'available' 
                        ? 'btn-primary' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {lab.status === 'available' ? 'Book This Lab' : 'Unavailable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <button 
                onClick={handleNewBooking}
                className="btn-primary"
              >
                New Booking
              </button>
            </div>
            <RecentBookings userRole="teacher" />
          </div>
        );

      case 'schedule':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Schedule</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗓️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Schedule</h3>
              <p className="text-gray-600">View and manage your personal teaching schedule</p>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Booking History</h3>
              <p className="text-gray-600">View your past laboratory bookings and usage statistics</p>
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
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="ml-64 pt-16">
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onBookingSubmit={handleBookingSubmit}
      />
    </>
  );
};

export default TeacherDashboard;