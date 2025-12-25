// src/pages/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaFlask, 
  FaCalendarCheck, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import Card from '../../components/common/Card';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLabs: 0,
    totalBookings: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real app, you'd have a dedicated stats endpoint
      const [usersRes, labsRes, bookingsRes] = await Promise.all([
        api.get('/api/auth/users'), // You'll need to create this endpoint
        api.get('/api/labs'),
        api.get('/api/bookings'),
      ]);

      const pendingBookings = bookingsRes.data.filter(
        booking => booking.status === 'pending'
      ).length;

      setStats({
        totalUsers: usersRes.data.length || 0,
        totalLabs: labsRes.data.length || 0,
        totalBookings: bookingsRes.data.length || 0,
        pendingApprovals: pendingBookings,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data
      setStats({
        totalUsers: 45,
        totalLabs: 8,
        totalBookings: 127,
        pendingApprovals: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Labs',
      value: stats.totalLabs,
      icon: <FaFlask className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+2',
      trend: 'up',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarCheck className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '+24%',
      trend: 'up',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: <FaChartLine className="h-6 w-6" />,
      color: 'bg-yellow-500',
      change: '-3',
      trend: 'down',
    },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Booked Lab Komputer 1', time: '10 min ago', type: 'booking' },
    { id: 2, user: 'Jane Smith', action: 'Created new account', time: '25 min ago', type: 'user' },
    { id: 3, user: 'Admin', action: 'Approved booking #123', time: '1 hour ago', type: 'approval' },
    { id: 4, user: 'Robert Johnson', action: 'Updated lab equipment', time: '2 hours ago', type: 'update' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {loading ? '...' : stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUsers className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove users</p>
            </Link>
            <Link
              to="/admin/labs"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaFlask className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium">Manage Labs</h3>
              <p className="text-sm text-gray-500">Add or update laboratories</p>
            </Link>
            <Link
              to="/admin/bookings"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCalendarCheck className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium">Manage Bookings</h3>
              <p className="text-sm text-gray-500">Approve or reject bookings</p>
            </Link>
            <Link
              to="/admin/reports"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaChartLine className="h-6 w-6 text-yellow-600 mb-2" />
              <h3 className="font-medium">View Reports</h3>
              <p className="text-sm text-gray-500">Analytics and insights</p>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'booking' ? 'bg-blue-100' :
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'approval' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'booking' && <FaCalendarCheck className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'user' && <FaUsers className="h-4 w-4 text-green-600" />}
                    {activity.type === 'approval' && <FaChartLine className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;