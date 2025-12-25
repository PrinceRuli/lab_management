import React, { useState } from 'react';

const BookingHistory = () => {
  // Data guru (dari konteks autentikasi)
  const teacherData = {
    id: 1,
    name: "Dr. Ahmad",
    email: "ahmad@university.edu",
    department: "Informatika"
  };

  // Data booking history dari guru
  const initialBookings = [
    {
      id: 1,
      labId: 1,
      labName: 'Lab Komputer A',
      purpose: 'Praktikum Algoritma',
      date: '2023-10-15',
      startTime: '08:00',
      endTime: '10:00',
      status: 'dikonfirmasi',
      notes: 'Membawa laptop sendiri',
      createdAt: '2023-10-10',
      department: 'Informatika',
      students: 30,
      type: 'Praktikum',
      equipment: ['30 PC', 'Projector'],
      confirmationDate: '2023-10-11',
      bookingCode: 'LAB-2023-001'
    },
    {
      id: 2,
      labId: 2,
      labName: 'Lab Kimia',
      purpose: 'Penelitian Kimia Organik',
      date: '2023-10-16',
      startTime: '13:00',
      endTime: '16:00',
      status: 'dikonfirmasi',
      notes: 'Butuh bahan kimia khusus',
      createdAt: '2023-10-11',
      department: 'Kimia',
      students: 8,
      type: 'Penelitian',
      equipment: ['Chemical Hood', 'Safety Equipment'],
      confirmationDate: '2023-10-12',
      bookingCode: 'LAB-2023-002'
    },
    {
      id: 3,
      labId: 3,
      labName: 'Lab Fisika',
      purpose: 'Eksperimen Mekanika',
      date: '2023-10-17',
      startTime: '09:00',
      endTime: '12:00',
      status: 'dikonfirmasi',
      notes: '',
      createdAt: '2023-10-12',
      department: 'Fisika',
      students: 15,
      type: 'Eksperimen',
      equipment: ['Physics Equipment', 'Measurement Tools'],
      confirmationDate: '2023-10-13',
      bookingCode: 'LAB-2023-003'
    },
    {
      id: 4,
      labId: 4,
      labName: 'Lab Biologi',
      purpose: 'Studi Mikroorganisme',
      date: '2023-10-18',
      startTime: '14:00',
      endTime: '17:00',
      status: 'ditolak',
      notes: 'Lab sedang maintenance',
      createdAt: '2023-10-13',
      department: 'Biologi',
      students: 10,
      type: 'Penelitian',
      equipment: ['Microscopes'],
      confirmationDate: '2023-10-14',
      rejectionReason: 'Laboratorium sedang dalam perawatan',
      bookingCode: 'LAB-2023-004'
    },
    {
      id: 5,
      labId: 1,
      labName: 'Lab Komputer A',
      purpose: 'Workshop Machine Learning',
      date: '2023-10-19',
      startTime: '10:00',
      endTime: '15:00',
      status: 'menunggu',
      notes: 'Peserta 25 orang',
      createdAt: '2023-10-14',
      department: 'Informatika',
      students: 25,
      type: 'Workshop',
      equipment: ['25 PC', 'Projector', 'Whiteboard'],
      bookingCode: 'LAB-2023-005'
    },
    {
      id: 6,
      labId: 5,
      labName: 'Lab Multimedia',
      purpose: 'Editing Video Project',
      date: '2023-10-20',
      startTime: '08:00',
      endTime: '17:00',
      status: 'dikonfirmasi',
      notes: 'Full day booking',
      createdAt: '2023-10-10',
      department: 'Desain Komunikasi',
      students: 12,
      type: 'Proyek',
      equipment: ['Mac Computers', 'Audio Equipment'],
      confirmationDate: '2023-10-11',
      bookingCode: 'LAB-2023-006'
    },
    {
      id: 7,
      labId: 2,
      labName: 'Lab Kimia',
      purpose: 'Analisis Bahan',
      date: '2023-10-21',
      startTime: '09:00',
      endTime: '11:00',
      status: 'menunggu',
      notes: 'Membawa sample sendiri',
      createdAt: '2023-10-15',
      department: 'Kimia',
      students: 5,
      type: 'Analisis',
      equipment: ['Lab Equipment'],
      bookingCode: 'LAB-2023-007'
    },
    {
      id: 8,
      labId: 1,
      labName: 'Lab Komputer A',
      purpose: 'Praktikum Struktur Data',
      date: '2023-10-22',
      startTime: '13:00',
      endTime: '15:00',
      status: 'dikonfirmasi',
      notes: '',
      createdAt: '2023-10-08',
      department: 'Informatika',
      students: 28,
      type: 'Praktikum',
      equipment: ['28 PC', 'Projector'],
      confirmationDate: '2023-10-09',
      bookingCode: 'LAB-2023-008'
    }
  ];

  // State management
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [labFilter, setLabFilter] = useState('semua');
  const [typeFilter, setTypeFilter] = useState('semua');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Data untuk filter
  const labs = [...new Set(initialBookings.map(b => b.labName))];
  const types = [...new Set(initialBookings.map(b => b.type))];

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filter === 'semua' || booking.status === filter;
    const matchesSearch = 
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.labName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || booking.date === dateFilter;
    const matchesLab = labFilter === 'semua' || booking.labName === labFilter;
    const matchesType = typeFilter === 'semua' || booking.type === typeFilter;
    
    return matchesStatus && matchesSearch && matchesDate && matchesLab && matchesType;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'created') {
      return sortOrder === 'desc'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'students') {
      return sortOrder === 'desc'
        ? b.students - a.students
        : a.students - b.students;
    }
    return 0;
  });

  // Handle booking cancellation
  const handleCancelBooking = (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
      const bookingToCancel = bookings.find(b => b.id === id);
      if (bookingToCancel && bookingToCancel.status === 'menunggu') {
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status: 'dibatalkan' } : booking
        ));
        alert('Pemesanan berhasil dibatalkan!');
      } else {
        alert('Hanya pemesanan dengan status "menunggu" yang dapat dibatalkan.');
      }
    }
  };

  // Handle booking duplicate
  const handleDuplicateBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      status: 'menunggu',
      createdAt: new Date().toISOString().split('T')[0],
      bookingCode: `LAB-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`
    };
    
    setBookings([newBooking, ...bookings]);
    alert('Pemesanan berhasil diduplikasi! Silakan periksa jadwal baru.');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'dikonfirmasi': return 'bg-green-100 text-green-800 border-green-200';
      case 'menunggu': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ditolak': return 'bg-red-100 text-red-800 border-red-200';
      case 'dibatalkan': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'dikonfirmasi': return 'Dikonfirmasi';
      case 'menunggu': return 'Menunggu';
      case 'ditolak': return 'Ditolak';
      case 'dibatalkan': return 'Dibatalkan';
      default: return status;
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    const colorMap = {
      'Praktikum': 'bg-blue-100 text-blue-800',
      'Penelitian': 'bg-purple-100 text-purple-800',
      'Eksperimen': 'bg-orange-100 text-orange-800',
      'Workshop': 'bg-indigo-100 text-indigo-800',
      'Proyek': 'bg-pink-100 text-pink-800',
      'Analisis': 'bg-teal-100 text-teal-800',
      'Seminar': 'bg-cyan-100 text-cyan-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Export to PDF (simulasi)
  const exportToPDF = () => {
    alert('Data booking akan di-export ke PDF. Fitur ini dalam pengembangan.');
  };

  // Export to Excel (simulasi)
  const exportToExcel = () => {
    alert('Data booking akan di-export ke Excel. Fitur ini dalam pengembangan.');
  };

  // Calculate stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'dikonfirmasi').length,
    pending: bookings.filter(b => b.status === 'menunggu').length,
    rejected: bookings.filter(b => b.status === 'ditolak').length,
    cancelled: bookings.filter(b => b.status === 'dibatalkan').length,
    thisMonth: bookings.filter(b => {
      const bookingDate = new Date(b.date);
      const today = new Date();
      return bookingDate.getMonth() === today.getMonth() && 
             bookingDate.getFullYear() === today.getFullYear();
    }).length,
    totalStudents: bookings.reduce((sum, b) => sum + b.students, 0)
  };

  // Get most booked lab
  const getMostBookedLab = () => {
    const labCounts = {};
    bookings.forEach(b => {
      labCounts[b.labName] = (labCounts[b.labName] || 0) + 1;
    });
    const maxLab = Object.entries(labCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]);
    return maxLab[0];
  };

  // Icons
  const IconSearch = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  );

  const IconCalendar = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  );

  const IconCheck = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  );

  const IconClock = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  const IconX = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  );

  const IconUsers = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v3.5m0 0h-12m12 0h-12"></path>
    </svg>
  );

  const IconBuilding = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  );

  const IconDownload = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
    </svg>
  );

  const IconFilter = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
    </svg>
  );

  const IconEye = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    </svg>
  );

  const IconCopy = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
    </svg>
  );

  const IconTrash = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
  );

  const IconRefresh = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
  );

  // Format date untuk display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time duration
  const getDuration = (startTime, endTime) => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);
    return `${Math.floor(duration / 60)} jam ${duration % 60} menit`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Riwayat Pemesanan</h1>
            <p className="text-blue-100 mt-2">
              {teacherData.name} • {teacherData.department}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Seluruh riwayat pemesanan laboratorium Anda
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-blue-50 transition flex items-center"
            >
              <IconDownload />
              <span className="ml-2">Export Excel</span>
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              <IconDownload />
              <span className="ml-2">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <IconCalendar />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Booking</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <IconCheck />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dikonfirmasi</p>
                <p className="text-2xl font-bold text-gray-800">{stats.confirmed}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <IconClock />
              </div>
              <div>
                <p className="text-sm text-gray-500">Menunggu</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                <p className="text-xs text-yellow-600 mt-1">Butuh konfirmasi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <IconX />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ditolak</p>
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                <p className="text-xs text-red-600 mt-1">
                  {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <IconX />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dibatalkan</p>
                <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
                <p className="text-xs text-gray-600 mt-1">Oleh Anda</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <IconCalendar />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-800">{stats.thisMonth}</p>
                <p className="text-xs text-purple-600 mt-1">Aktif</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <IconUsers />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Peserta</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                <p className="text-xs text-pink-600 mt-1">Mahasiswa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded-lg ${filter === 'semua' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('semua')}
                >
                  Semua
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${filter === 'dikonfirmasi' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('dikonfirmasi')}
                >
                  Dikonfirmasi
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${filter === 'menunggu' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('menunggu')}
                >
                  Menunggu
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${filter === 'ditolak' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('ditolak')}
                >
                  Ditolak
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconSearch />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari booking..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <IconFilter />
                <span className="ml-2">Filter Lanjutan</span>
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratorium</label>
                  <select 
                    value={labFilter}
                    onChange={(e) => setLabFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="semua">Semua Lab</option>
                    {labs.map(lab => (
                      <option key={lab} value={lab}>{lab}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kegiatan</label>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="semua">Semua Tipe</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan Berdasarkan</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="date">Tanggal Booking</option>
                    <option value="created">Tanggal Dibuat</option>
                    <option value="students">Jumlah Peserta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="desc">Terbaru ke Terlama</option>
                    <option value="asc">Terlama ke Terbaru</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-3">
                <button 
                  onClick={() => {
                    setDateFilter('');
                    setLabFilter('semua');
                    setTypeFilter('semua');
                    setSortBy('date');
                    setSortOrder('desc');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Riwayat Pemesanan</h2>
              <span className="text-sm text-gray-500">
                Menampilkan {sortedBookings.length} dari {bookings.length} booking
              </span>
            </div>
          </div>
          
          {sortedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <IconCalendar />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada riwayat booking</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filter !== 'semua' 
                  ? 'Tidak ada booking yang sesuai dengan filter pencarian.' 
                  : 'Belum ada riwayat pemesanan laboratorium.'}
              </p>
              <a 
                href="/teacher/booking"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
              >
                Buat Booking Baru
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedBookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => viewBookingDetails(booking)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start">
                    {/* Booking Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${getTypeColor(booking.type)}`}>
                          {booking.type}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          Kode: {booking.bookingCode}
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{booking.purpose}</h3>
                          <div className="flex items-center text-gray-600 mb-1">
                            <IconBuilding className="mr-2" />
                            <span className="font-medium">{booking.labName}</span>
                            <span className="mx-2">•</span>
                            <span>Jurusan: {booking.department}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-0 text-right">
                          <div className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</div>
                          <div className="text-sm text-gray-700">
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <IconUsers className="mr-2" />
                          <span>{booking.students} peserta</span>
                        </div>
                        <div className="flex items-center">
                          <IconCalendar className="mr-2" />
                          <span>Dibuat: {booking.createdAt}</span>
                        </div>
                        <div className="flex items-center">
                          <IconClock className="mr-2" />
                          <span>Durasi: {getDuration(booking.startTime, booking.endTime)}</span>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
                          <span className="font-medium">Catatan: </span>
                          {booking.notes}
                        </div>
                      )}
                      
                      {booking.equipment && booking.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium text-gray-700">Perlengkapan:</span>
                          {booking.equipment.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewBookingDetails(booking);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                        title="Lihat Detail"
                      >
                        <IconEye />
                      </button>
                      
                      {booking.status === 'menunggu' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                          title="Batalkan Booking"
                        >
                          <IconTrash />
                        </button>
                      )}
                      
                      {booking.status === 'dikonfirmasi' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateBooking(booking);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-200"
                          title="Duplikasi Booking"
                        >
                          <IconRefresh />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Panel */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Statistik Booking</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lab Paling Sering Digunakan</span>
                <span className="font-semibold text-blue-800">{getMostBookedLab()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rata-rata Durasi</span>
                <span className="font-semibold text-blue-800">
                  {(() => {
                    const durations = bookings.map(b => {
                      const [sh, sm] = b.startTime.split(':').map(Number);
                      const [eh, em] = b.endTime.split(':').map(Number);
                      return (eh * 60 + em) - (sh * 60 + sm);
                    });
                    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
                    return `${Math.floor(avgDuration / 60)} jam ${Math.round(avgDuration % 60)} menit`;
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tingkat Konfirmasi</span>
                <span className="font-semibold text-blue-800">
                  {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipe Terpopuler</span>
                <span className="font-semibold text-blue-800">Praktikum</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Booking Terbaru</h3>
            <div className="space-y-3">
              {bookings
                .filter(b => b.status === 'dikonfirmasi')
                .slice(0, 3)
                .map(booking => (
                  <div key={booking.id} className="p-3 bg-white rounded-lg border border-green-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800">{booking.purpose}</div>
                        <div className="text-xs text-gray-500">{booking.labName}</div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {booking.date}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center">
                      <IconClock className="mr-1" size={12} />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⏳ Menunggu Konfirmasi</h3>
            <div className="space-y-3">
              {bookings
                .filter(b => b.status === 'menunggu')
                .slice(0, 3)
                .map(booking => (
                  <div key={booking.id} className="p-3 bg-white rounded-lg border border-yellow-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800">{booking.purpose}</div>
                        <div className="text-xs text-gray-500">{booking.labName}</div>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {booking.date}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-600">
                        Dibuat: {booking.createdAt}
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                ))}
              
              {bookings.filter(b => b.status === 'menunggu').length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Tidak ada booking yang menunggu
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">Detail Booking #{selectedBooking.id}</h3>
                  <p className="text-blue-100 text-sm">{selectedBooking.bookingCode}</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-blue-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Booking Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">INFORMASI BOOKING</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Kode Booking</div>
                        <div className="font-semibold text-gray-800">{selectedBooking.bookingCode}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Tujuan</div>
                        <div className="font-semibold text-gray-800">{selectedBooking.purpose}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Tipe Kegiatan</div>
                        <div className={`inline-block px-3 py-1 rounded text-sm ${getTypeColor(selectedBooking.type)}`}>
                          {selectedBooking.type}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Status</div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusText(selectedBooking.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">WAKTU & TANGGAL</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Tanggal Booking</div>
                        <div className="font-semibold text-gray-800">{formatDate(selectedBooking.date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Waktu</div>
                        <div className="font-semibold text-gray-800">
                          {selectedBooking.startTime} - {selectedBooking.endTime}
                        </div>
                        <div className="text-sm text-gray-500">
                          Durasi: {getDuration(selectedBooking.startTime, selectedBooking.endTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Dibuat Pada</div>
                        <div className="text-gray-700">{selectedBooking.createdAt}</div>
                      </div>
                      {selectedBooking.confirmationDate && (
                        <div>
                          <div className="text-sm text-gray-600">Dikonfirmasi Pada</div>
                          <div className="text-gray-700">{selectedBooking.confirmationDate}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Lab & Equipment Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">LABORATORIUM</h4>
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <IconBuilding />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{selectedBooking.labName}</div>
                        <div className="text-sm text-gray-500">Lab ID: {selectedBooking.labId}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Jurusan:</span> {selectedBooking.department}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Jumlah Peserta:</span> {selectedBooking.students} orang
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">PERLENGKAPAN</h4>
                    {selectedBooking.equipment && selectedBooking.equipment.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.equipment.map((item, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 italic">Tidak ada perlengkapan khusus</div>
                    )}
                  </div>
                  
                  {selectedBooking.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">CATATAN</h4>
                      <div className="text-gray-700 whitespace-pre-wrap">{selectedBooking.notes}</div>
                    </div>
                  )}
                  
                  {selectedBooking.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-600 mb-3">ALASAN PENOLAKAN</h4>
                      <div className="text-red-700">{selectedBooking.rejectionReason}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedBooking, null, 2));
                      alert('Detail booking disalin ke clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <IconCopy />
                    <span className="ml-2">Salin Detail</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      handleDuplicateBooking(selectedBooking);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center"
                  >
                    <IconRefresh />
                    <span className="ml-2">Duplikasi Booking</span>
                  </button>
                  
                  {selectedBooking.status === 'menunggu' && (
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                      <IconTrash />
                      <span className="ml-2">Batalkan Booking</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      // Redirect to booking page
                      window.location.href = '/teacher/booking';
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ml-auto"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Buat Booking Baru
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;