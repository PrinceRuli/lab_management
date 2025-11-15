import React, { useState, useEffect } from 'react';
import StatsCard from '../common/StatsCard';
import RecentBookings from '../booking/RecentBookings';
import LabUsageChart from '../dashboard/LabUsageChart';
import AddLaboratoryModal from './AddLaboratoryModal'; // Import modal
import AdminBookingManagement from './AdminBookingManagement';
import SystemReports from './SystemReports';
import UserManagement from './UserManagement';



const AdminDashboard = ({ activeTab, user, onTabChange }) => {  // Tambah onTabChange prop
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [laboratories, setLaboratories] = useState([]);

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
      
      // Sample laboratories data
      setLaboratories([
        {
          id: 1,
          name: 'Computer Lab 1',
          location: 'Building A, Room 101',
          capacity: 30,
          equipment: ['Computers', 'Projector', 'Whiteboard'],
          description: 'Main computer laboratory for programming classes',
          status: 'active'
        },
        {
          id: 2,
          name: 'Physics Lab',
          location: 'Building B, Room 201',
          capacity: 25,
          equipment: ['Oscilloscopes', 'Multimeters', 'Power Supplies'],
          description: 'Laboratory for physics experiments',
          status: 'active'
        }
      ]);
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle adding new laboratory
  const handleAddLaboratory = (laboratoryData) => {
    const newLaboratory = {
      ...laboratoryData,
      id: Date.now() // Use timestamp as unique ID
    };
    
    setLaboratories(prev => [newLaboratory, ...prev]);
    
    // Show success message (you can replace with toast notification)
    console.log('Laboratory added:', newLaboratory);
    alert('Laboratory added successfully!');
  };

  // Function to handle laboratory status change
  const handleStatusChange = (labId, newStatus) => {
    setLaboratories(prev => 
      prev.map(lab => 
        lab.id === labId ? { ...lab, status: newStatus } : lab
      )
    );
  };

  // Function to handle laboratory deletion
  const handleDeleteLaboratory = (labId) => {
    if (window.confirm('Are you sure you want to delete this laboratory?')) {
      setLaboratories(prev => prev.filter(lab => lab.id !== labId));
      alert('Laboratory deleted successfully!');
    }
  };

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
      value: laboratories.length.toString(),
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
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Laboratory Management</h2>
                <p className="text-gray-600 mt-1">Manage all laboratory facilities and equipment</p>
              </div>
              <button 
                onClick={() => setShowAddLabModal(true)}
                className="btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>+</span>
                <span>Add New Laboratory</span>
              </button>
            </div>

            {/* Laboratories List */}
            <div className="space-y-4">
              {laboratories.map(lab => (
                <div key={lab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🏢</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{lab.name}</h3>
                        <p className="text-sm text-gray-600">{lab.location}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Capacity: {lab.capacity}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            lab.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : lab.status === 'maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Status Dropdown */}
                      <select 
                        value={lab.status}
                        onChange={(e) => handleStatusChange(lab.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      
                      {/* Edit Button */}
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        ✏️
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteLaboratory(lab.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  {/* Equipment and Description */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Equipment:</strong> {lab.equipment.join(', ')}
                    </p>
                    {lab.description && (
                      <p className="text-sm text-gray-600">
                        <strong>Description:</strong> {lab.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {laboratories.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Laboratories</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first laboratory</p>
                  <button 
                    onClick={() => setShowAddLabModal(true)}
                    className="btn-primary px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add First Laboratory
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'bookings':
        return <AdminBookingManagement />;

      case 'reports':
        return <SystemReports />;

      case 'users':
        return <UserManagement />;

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
            <p className="text-gray-600">System settings content coming soon...</p>
          </div>
        );

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

      {/* Add Laboratory Modal */}
      <AddLaboratoryModal
        isOpen={showAddLabModal}
        onClose={() => setShowAddLabModal(false)}
        onAddLaboratory={handleAddLaboratory}
      />
    </>
  );
};

export default AdminDashboard;