// src/pages/Teacher/TeacherDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFlask, FaClock, FaCheckCircle } from 'react-icons/fa';
import Card from '../../components/common/Card';

const TeacherDashboard = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const upcomingBookings = [
    { id: 1, lab: 'Lab Komputer 1', date: 'Today', time: '09:00 - 11:00', subject: 'Computer Science' },
    { id: 2, lab: 'Lab Biologi', date: 'Tomorrow', time: '13:00 - 15:00', subject: 'Biology' },
    { id: 3, lab: 'Lab Kimia', date: 'Dec 20', time: '10:00 - 12:00', subject: 'Chemistry' },
  ];

  const quickStats = [
    { label: 'Today\'s Classes', value: '3', icon: <FaCalendarAlt />, color: 'bg-blue-500' },
    { label: 'Available Labs', value: '5', icon: <FaFlask />, color: 'bg-green-500' },
    { label: 'Pending Approval', value: '2', icon: <FaClock />, color: 'bg-yellow-500' },
    { label: 'Completed', value: '24', icon: <FaCheckCircle />, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Today is {today}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <div className="text-white text-xl">{stat.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
            <Link to="/teacher/schedule" className="text-sm text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{booking.lab}</h3>
                      <p className="text-sm text-gray-500">{booking.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.date}</p>
                    <p className="text-sm text-gray-500">{booking.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/teacher/booking" className="block w-full">
                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Book New Lab
                </button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/teacher/booking"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <FaFlask className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Book Lab</h3>
                <p className="text-sm text-gray-500">Schedule new class</p>
              </Link>
              <Link
                to="/teacher/schedule"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <FaCalendarAlt className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">My Schedule</h3>
                <p className="text-sm text-gray-500">View calendar</p>
              </Link>
              <Link
                to="/teacher/resources"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <FaCheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium">Resources</h3>
                <p className="text-sm text-gray-500">Teaching materials</p>
              </Link>
              <Link
                to="/teacher/history"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <FaClock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-medium">History</h3>
                <p className="text-sm text-gray-500">Past bookings</p>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;