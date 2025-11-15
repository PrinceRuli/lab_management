import React, { useState, useEffect } from 'react';

const BookingHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLab, setFilterLab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBookingHistory([
        {
          id: 1,
          lab: 'Computer Lab 1',
          date: '2024-01-15',
          time: '08:00 - 10:00',
          subject: 'Programming Fundamentals',
          status: 'approved',
          submittedDate: '2024-01-10',
          approvedDate: '2024-01-11',
          students: 28,
          type: 'lecture',
          equipment: ['Computers', 'Projector'],
          notes: 'Regular class'
        },
        {
          id: 2,
          lab: 'Multimedia Lab',
          date: '2024-01-16',
          time: '13:00 - 15:00',
          subject: 'Web Development',
          status: 'approved',
          submittedDate: '2024-01-11',
          approvedDate: '2024-01-12',
          students: 24,
          type: 'lab',
          equipment: ['Computers', 'Graphics Tablets'],
          notes: 'Hands-on practice'
        },
        {
          id: 3,
          lab: 'Computer Lab 2',
          date: '2024-01-17',
          time: '09:00 - 11:00',
          subject: 'Database Systems',
          status: 'rejected',
          submittedDate: '2024-01-12',
          rejectedDate: '2024-01-13',
          students: 30,
          type: 'lecture',
          equipment: ['Computers'],
          notes: 'Lab under maintenance',
          rejectionReason: 'Laboratory scheduled for maintenance'
        },
        {
          id: 4,
          lab: 'Physics Lab',
          date: '2024-01-18',
          time: '10:00 - 12:00',
          subject: 'Advanced Physics',
          status: 'pending',
          submittedDate: '2024-01-14',
          students: 25,
          type: 'lab',
          equipment: ['Oscilloscopes', 'Multimeters'],
          notes: 'Practical session'
        },
        {
          id: 5,
          lab: 'Computer Lab 1',
          date: '2024-01-19',
          time: '14:00 - 16:00',
          subject: 'Mobile Programming',
          status: 'approved',
          submittedDate: '2024-01-13',
          approvedDate: '2024-01-14',
          students: 22,
          type: 'lab',
          equipment: ['Computers', 'Android Devices'],
          notes: 'Android development workshop'
        },
        {
          id: 6,
          lab: 'Chemistry Lab',
          date: '2024-01-20',
          time: '11:00 - 13:00',
          subject: 'Organic Chemistry',
          status: 'cancelled',
          submittedDate: '2024-01-15',
          cancelledDate: '2024-01-16',
          students: 20,
          type: 'lab',
          equipment: ['Bunsen Burners', 'Test Tubes'],
          notes: 'Cancelled due to chemical shortage',
          cancellationReason: 'Insufficient chemicals available'
        },
        {
          id: 7,
          lab: 'Computer Lab 2',
          date: '2024-01-22',
          time: '08:00 - 10:00',
          subject: 'Software Engineering',
          status: 'approved',
          submittedDate: '2024-01-16',
          approvedDate: '2024-01-17',
          students: 26,
          type: 'lecture',
          equipment: ['Computers', 'Projector'],
          notes: 'Group project discussion'
        },
        {
          id: 8,
          lab: 'Multimedia Lab',
          date: '2024-01-23',
          time: '15:00 - 17:00',
          subject: 'Digital Media',
          status: 'approved',
          submittedDate: '2024-01-17',
          approvedDate: '2024-01-18',
          students: 18,
          type: 'lab',
          equipment: ['Computers', 'Video Editing Software'],
          notes: 'Video editing tutorial'
        },
        {
          id: 9,
          lab: 'Biology Lab',
          date: '2024-01-24',
          time: '09:00 - 11:00',
          subject: 'Microbiology',
          status: 'approved',
          submittedDate: '2024-01-18',
          approvedDate: '2024-01-19',
          students: 20,
          type: 'lab',
          equipment: ['Microscopes', 'Petri Dishes'],
          notes: 'Bacteria culture observation'
        },
        {
          id: 10,
          lab: 'Computer Lab 1',
          date: '2024-01-25',
          time: '13:00 - 15:00',
          subject: 'Data Structures',
          status: 'rejected',
          submittedDate: '2024-01-19',
          rejectedDate: '2024-01-20',
          students: 28,
          type: 'lecture',
          equipment: ['Computers'],
          notes: 'Algorithm visualization',
          rejectionReason: 'Time conflict with department meeting'
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter and search logic
  const filteredBookings = bookingHistory.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesLab = filterLab === 'all' || booking.lab === filterLab;
    const matchesSearch = booking.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.lab.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesLab && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      default: return '📝';
    }
  };

  const getLabIcon = (lab) => {
    if (lab.includes('Computer')) return '💻';
    if (lab.includes('Multimedia')) return '🎬';
    if (lab.includes('Physics')) return '🔬';
    if (lab.includes('Chemistry')) return '🧪';
    if (lab.includes('Biology')) return '🔬';
    return '🏢';
  };

  const stats = {
    total: bookingHistory.length,
    approved: bookingHistory.filter(b => b.status === 'approved').length,
    pending: bookingHistory.filter(b => b.status === 'pending').length,
    rejected: bookingHistory.filter(b => b.status === 'rejected').length,
    cancelled: bookingHistory.filter(b => b.status === 'cancelled').length
  };

  const uniqueLabs = [...new Set(bookingHistory.map(booking => booking.lab))];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
            <p className="text-gray-600">Track and manage your laboratory booking requests</p>
          </div>
          <button className="btn-primary">
            Export History
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="text-blue-500 text-xl">📋</div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <div className="text-green-500 text-xl">✅</div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-orange-900">{stats.pending}</p>
              </div>
              <div className="text-orange-500 text-xl">⏳</div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Rejected/Cancelled</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected + stats.cancelled}</p>
              </div>
              <div className="text-red-500 text-xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by subject or lab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Lab Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory</label>
              <select
                value={filterLab}
                onChange={(e) => setFilterLab(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">All Labs</option>
                {uniqueLabs.map(lab => (
                  <option key={lab} value={lab}>{lab}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Records ({filteredBookings.length})
          </h3>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="space-y-4">
          {currentBookings.map(booking => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-600 text-xl">{getLabIcon(booking.lab)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{booking.lab}</h4>
                    <p className="text-gray-600">{booking.subject}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">📅 {booking.date}</span>
                      <span className="text-sm text-gray-500">🕒 {booking.time}</span>
                      <span className="text-sm text-gray-500">👥 {booking.students} students</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    <span className="mr-1">{getStatusIcon(booking.status)}</span>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted: {booking.submittedDate}
                  </p>
                  {booking.approvedDate && (
                    <p className="text-xs text-green-600">Approved: {booking.approvedDate}</p>
                  )}
                  {booking.rejectedDate && (
                    <p className="text-xs text-red-600">Rejected: {booking.rejectedDate}</p>
                  )}
                  {booking.cancelledDate && (
                    <p className="text-xs text-gray-600">Cancelled: {booking.cancelledDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Equipment Needed:</p>
                  <p className="text-gray-600">{booking.equipment.join(', ')}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Session Type:</p>
                  <p className="text-gray-600 capitalize">{booking.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Notes:</p>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
              </div>

              {(booking.rejectionReason || booking.cancellationReason) && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">
                    {booking.rejectionReason ? 'Rejection Reason:' : 'Cancellation Reason:'}
                  </p>
                  <p className="text-sm text-red-700">
                    {booking.rejectionReason || booking.cancellationReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {currentBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;