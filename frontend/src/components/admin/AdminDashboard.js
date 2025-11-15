import React, { useState, useEffect } from 'react';
import StatsCard from '../common/StatsCard';
import RecentBookings from '../booking/RecentBookings';
import LabUsageChart from '../dashboard/LabUsageChart';
import AddLaboratoryModal from './AddLaboratoryModal'; // Import modal
import AdminBookingManagement from './AdminBookingManagement';
import SystemReports from './SystemReports';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import LaboratoryManagement from './LaboratoryManagement';



const AdminDashboard = ({ activeTab, user, onTabChange }) => {  // Tambah onTabChange prop
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  
  
  // Simulate data loading for admin
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData({
        pendingApprovals: [
          {
            id: 1,
            teacher: 'Dr. Sarah Smith',
            lab: 'Computer Lab 1',
            date: '2024-01-15',
            time: '09:00 - 11:00',
            subject: 'Programming Fundamentals',
            class: 'CS-101',
            participants: 25,
            status: 'pending',
            requestedAt: '2024-01-10 14:30'
          }
        ],
        systemAlerts: [
          { type: 'maintenance', lab: 'Chemistry Lab', message: 'Scheduled maintenance on Jan 20', priority: 'high' }
        ]
      });
      
      
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);



  // Quick Actions Handlers
  const handleQuickAction = (action) => {
    switch(action) {
      case 'manage-labs':
        onTabChange('labs');
        break;
      case 'user-management':
        onTabChange('users');
        break;
      case 'view-reports':
        onTabChange('reports');
        break;
      case 'system-settings':
        onTabChange('settings');
        break;
      case 'booking-management':
        onTabChange('bookings');
        break;
      default:
        break;
    }
  };

  const stats = [
    {
      title: 'Total Laboratories',
      value: '5' ,
      icon: '🏢',
      change: '+2',
      description: 'from last month',
      loading
    },
    {
      title: 'Pending Approvals',
      value: dashboardData.pendingApprovals?.length.toString() || '0',
      icon: '⏳',
      change: '+3',
      description: 'awaiting review',
      loading
    },
    {
      title: 'Active Users',
      value: '156',
      icon: '👥',
      change: '+12',
      description: 'this month',
      loading
    },
    {
      title: 'System Utilization',
      value: '82%',
      icon: '📊',
      change: '+7%',
      description: 'from last month',
      loading
    }
  ];

  const handleApproveBooking = (bookingId) => {
    console.log('Approving booking:', bookingId);
    setDashboardData(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals?.filter(booking => booking.id !== bookingId)
    }));
  };

  const handleRejectBooking = (bookingId) => {
    console.log('Rejecting booking:', bookingId);
    setDashboardData(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals?.filter(booking => booking.id !== bookingId)
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-blue-100">Manage laboratories, users, and system operations</p>
                </div>
                <div className="text-4xl">⚙️</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { 
                    icon: '🏢', 
                    label: 'Manage Labs', 
                    color: 'blue',
                    action: 'manage-labs'
                  },
                  { 
                    icon: '👥', 
                    label: 'User Management', 
                    color: 'green',
                    action: 'user-management'
                  },
                  { 
                    icon: '📅', 
                    label: 'Booking Management', 
                    color: 'purple',
                    action: 'booking-management'
                  },
                  { 
                    icon: '📊', 
                    label: 'View Reports', 
                    color: 'orange',
                    action: 'view-reports'
                  },
                  { 
                    icon: '⚙️', 
                    label: 'System Settings', 
                    color: 'gray',
                    action: 'system-settings'
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pending Approvals & System Alerts */}
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
                  {dashboardData.pendingApprovals?.map(booking => (
                    <div key={booking.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.teacher}</h4>
                          <p className="text-sm text-gray-600">{booking.lab}</p>
                        </div>
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>📅 {booking.date} | 🕒 {booking.time}</p>
                        <p>📚 {booking.subject} - {booking.class}</p>
                        <p>👥 {booking.participants} participants</p>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button 
                          onClick={() => handleApproveBooking(booking.id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectBooking(booking.id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
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

              {/* System Alerts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>
                <div className="space-y-4">
                  {dashboardData.systemAlerts?.map((alert, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${
                      alert.priority === 'high' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.priority === 'high' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {alert.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                        </span>
                        <span className="text-sm text-gray-500">{alert.type}</span>
                      </div>
                      <p className="font-medium text-gray-900">{alert.lab}</p>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                  ))}
                  
                  {(!dashboardData.systemAlerts || dashboardData.systemAlerts.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🔔</div>
                      <p className="text-gray-500">No system alerts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LabUsageChart />
              <RecentBookings userRole="admin" />
            </div>
          </div>
        );

      case 'labs':
        return <LaboratoryManagement />;     

      case 'bookings':
        return <AdminBookingManagement />;

      case 'reports':
        return <SystemReports />;

      case 'users':
        return <UserManagement />;

      case 'settings':
        return <SystemSettings />;

      // ... other cases (users, bookings, reports, settings) tetap sama

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h2>
            <p className="text-gray-600">Select a section from the navigation to manage the system.</p>
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
    </>
  );
};

export default AdminDashboard;