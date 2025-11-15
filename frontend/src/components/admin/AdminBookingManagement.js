import React, { useState, useEffect } from 'react';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - replace with actual API call
  const sampleBookings = [
    {
      _id: "690f74e913915ad44085d1f7",
      userId: "690f722713915ad44085d1e9",
      laboratoryId: "690f729713915ad44085d1ee",
      teacherName: "Dr. Sarah Smith",
      labName: "Computer Lab 1",
      title: "Pemrograman Web Lecture",
      description: "Kelas pemrograman web untuk mahasiswa semester 4",
      date: "2024-01-22",
      startTime: "08:00",
      endTime: "10:00",
      status: "approved",
      bookingType: "academic",
      participants: 25,
      createdAt: "2024-01-15T08:00:00.000Z",
      approvedBy: "Admin System",
      approvedAt: "2024-01-15T08:30:00.000Z"
    },
    {
      _id: "690f74e913915ad44085d1f8",
      teacherName: "Prof. John Davis",
      labName: "Physics Lab",
      title: "Advanced Physics Lab",
      description: "Quantum mechanics experiments for graduate students",
      date: "2024-01-23",
      startTime: "14:00",
      endTime: "16:00",
      status: "pending",
      bookingType: "research",
      participants: 15,
      createdAt: "2024-01-16T10:30:00.000Z"
    },
    {
      _id: "690f74e913915ad44085d1f9",
      teacherName: "Dr. Maria Garcia",
      labName: "Chemistry Lab",
      title: "Organic Chemistry Lab",
      description: "Chemical synthesis and analysis session",
      date: "2024-01-24",
      startTime: "09:00",
      endTime: "12:00",
      status: "pending",
      bookingType: "academic",
      participants: 20,
      createdAt: "2024-01-17T14:20:00.000Z"
    },
    {
      _id: "690f74e913915ad44085d1fa",
      teacherName: "Dr. Robert Wilson",
      labName: "Biology Lab",
      title: "Microbiology Practical",
      description: "Bacterial culture and microscopy",
      date: "2024-01-25",
      startTime: "10:00",
      endTime: "12:00",
      status: "rejected",
      bookingType: "academic",
      participants: 18,
      createdAt: "2024-01-18T09:15:00.000Z",
      rejectedReason: "Lab under maintenance"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBookings(sampleBookings);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleApproveBooking = async (bookingId) => {
    try {
      // Simulate API call
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { 
                ...booking, 
                status: 'approved',
                approvedBy: 'Admin User',
                approvedAt: new Date().toISOString()
              }
            : booking
        )
      );
      
      console.log('Booking approved:', bookingId);
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const reason = prompt('Please enter reason for rejection:');
      if (reason) {
        // Simulate API call
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { 
                  ...booking, 
                  status: 'rejected',
                  rejectedReason: reason
                }
              : booking
          )
        );
        
        console.log('Booking rejected:', bookingId, 'Reason:', reason);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Simulate API call
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        
        console.log('Booking cancelled:', bookingId);
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      case 'cancelled': return 'gray';
      default: return 'blue';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-600 mt-1">Manage and approve all laboratory bookings</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <span>📥</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-800">{stats.pending}</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-800">{stats.approved}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by teacher, lab, or title..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div 
            key={booking._id} 
            className={`border-l-4 rounded-lg p-4 transition-all duration-200 ${
              booking.status === 'approved' 
                ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                : booking.status === 'pending'
                ? 'border-orange-500 bg-orange-50 hover:bg-orange-100'
                : booking.status === 'rejected'
                ? 'border-red-500 bg-red-50 hover:bg-red-100'
                : 'border-gray-500 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{booking.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'approved' 
                      ? 'bg-green-500 text-white' 
                      : booking.status === 'pending'
                      ? 'bg-orange-500 text-white'
                      : booking.status === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-600 font-medium">Teacher</p>
                    <p className="text-gray-900 font-semibold">{booking.teacherName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Laboratory</p>
                    <p className="text-gray-900 font-semibold">{booking.labName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Date & Time</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(booking.date).toLocaleDateString('id-ID')} | {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Type</p>
                    <p className="text-gray-900 font-semibold capitalize">{booking.bookingType}</p>
                  </div>
                </div>

                {booking.description && (
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Description</p>
                    <p className="text-gray-900">{booking.description}</p>
                  </div>
                )}

                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <span>👥 {booking.participants} participants</span>
                  <span>📅 Booked: {new Date(booking.createdAt).toLocaleDateString('id-ID')}</span>
                  {booking.approvedBy && (
                    <span>✅ Approved by: {booking.approvedBy}</span>
                  )}
                  {booking.rejectedReason && (
                    <span>❌ Reason: {booking.rejectedReason}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleApproveBooking(booking._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRejectBooking(booking._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </>
                )}
                {(booking.status === 'approved' || booking.status === 'pending') && (
                  <button 
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-200 transition-colors">
                  ⋮
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'There are no bookings to display'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingManagement;