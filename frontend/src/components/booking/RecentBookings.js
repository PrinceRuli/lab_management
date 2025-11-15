import React from 'react';

const RecentBookings = ({ bookings, userRole }) => {
  const sampleBookings = [
    {
      id: 1,
      labName: 'Computer Laboratory 1',
      date: '2025-11-15',
      time: '09:00 - 11:00',
      user: 'Dr. Smith',
      status: 'confirmed',
      purpose: 'Programming Class'
    },
    {
      id: 2,
      labName: 'Multimedia Laboratory',
      date: '2025-11-15',
      time: '13:00 - 15:00',
      user: 'Prof. Johnson',
      status: 'pending',
      purpose: 'Design Workshop'
    },
    {
      id: 3,
      labName: 'Physics Laboratory',
      date: '2025-11-16',
      time: '10:00 - 12:00',
      user: 'Dr. Brown',
      status: 'confirmed',
      purpose: 'Research Experiment'
    },
  ];

  const displayBookings = bookings || sampleBookings;

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-amber-100 text-amber-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Bookings
        </h3>
        <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {displayBookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
                <span className="text-cyan-600 text-lg">💻</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{booking.labName}</h4>
                <p className="text-sm text-gray-600">{booking.purpose}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">📅 {booking.date}</span>
                  <span className="text-xs text-gray-500">⏰ {booking.time}</span>
                  {userRole === 'admin' && (
                    <span className="text-xs text-gray-500">👤 {booking.user}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
              {userRole === 'admin' && booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors duration-200">
                    ✓
                  </button>
                  <button className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors duration-200">
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;