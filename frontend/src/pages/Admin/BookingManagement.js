import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users,
  User,
  Mail,
  Building,
  Target,
  /* FileText, */
  Eye,
  Trash2,
  Download,
  /* Bell,
  FileBarChart, */
 /*  Plus, */
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  /* MoreVertical, */
  Edit,
  /* Printer,
  Send,
  AlertCircle,
  Info, */
  CheckSquare
} from 'lucide-react';
import { labAPI, bookingAPI } from '../../services/api';

const BookingManagement = () => {
  // Labs will be loaded from backend

  // bookings will be loaded from backend

  // State Management
  const [labs, setLabs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    labId: '',
    teacherName: '',
    subject: '',
    activityTitle: '',
    description: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    participants: [],
    status: 'pending',
    remarks: ''
  });
  
  const [filter, setFilter] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  /* const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); */
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [labFilter, setLabFilter] = useState('semua');
  const [departmentFilter, setDepartmentFilter] = useState('semua');
  const [priorityFilter, setPriorityFilter] = useState('semua');
  
  // Departments
  const departments = ['Informatika', 'Kimia', 'Fisika', 'Biologi', 'Teknik Komputer', 'Desain Komunikasi', 'Matematika'];

  // Initialize date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setNewBooking(prev => ({
      ...prev,
      date: today
    }));
  }, []);

  // Fetch labs from backend and map status to local labels
  useEffect(() => {
    let mounted = true;
    const fetchLabs = async () => {
      try {
        const res = await labAPI.getAll();
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        const mapped = data.map(l => ({
          ...l,
          // map backend enum to local display used in UI
          status: l.status === 'available' ? 'tersedia' : l.status === 'occupied' ? 'digunakan' : 'maintenance',
          facilities: l.facilities || [],
          capacity: l.capacity || 0,
        }));
        if (mounted) setLabs(mapped);
      } catch (err) {
        console.error('Failed to fetch labs', err);
      }
    };

    fetchLabs();
    return () => { mounted = false; };
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({
      ...newBooking,
      [name]: value
    });
  };

  // Fetch bookings from backend and normalize fields for UI
  useEffect(() => {
    let mounted = true;
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getAll();
        const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data || []);
        const mapped = data.map(b => {
          const bookingDate = b.bookingDate ? new Date(b.bookingDate).toISOString().split('T')[0] : '';
          const createdAt = b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '';
          return {
            id: b.id || b._id,
            lab: b.lab || null,
            labId: b.lab?.id || b.lab?._id,
            labName: b.lab?.name || '',
            user: b.user?.name || b.teacherName || '',
            userEmail: b.user?.email || '',
            teacherName: b.teacherName || '',
            subject: b.subject || '',
            activityTitle: b.activityTitle || b.purpose || '',
            description: b.description || b.remarks || '',
            bookingDate,
            date: bookingDate,
            day: b.day || '',
            startTime: b.startTime || '',
            endTime: b.endTime || '',
            purpose: b.purpose || b.activityTitle || '',
            participants: b.participants || [],
            status: b.status || 'pending',
            remarks: b.remarks || '',
            createdAt,
            approvedAt: b.approvedAt || null,
          };
        });
        if (mounted) setBookings(mapped);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };

    fetchBookings();
    return () => { mounted = false; };
  }, []);

  const addBooking = () => {
    if (newBooking.labId && newBooking.user && newBooking.date && newBooking.startTime && newBooking.endTime) {
      const selectedLab = labs.find(lab => lab.id === parseInt(newBooking.labId));
      
      // Check for time conflicts
      const hasConflict = bookings.some(booking => 
        booking.labId === parseInt(newBooking.labId) &&
        booking.date === newBooking.date &&
        booking.status !== 'rejected' &&
        (
          (newBooking.startTime >= booking.startTime && newBooking.startTime < booking.endTime) ||
          (newBooking.endTime > booking.startTime && newBooking.endTime <= booking.endTime) ||
          (newBooking.startTime <= booking.startTime && newBooking.endTime >= booking.endTime)
        )
      );
      
      if (hasConflict) {
        alert('❌ Konflik jadwal! Lab sudah dipesan pada waktu tersebut.');
        return;
      }
      
      const bookingToAdd = {
        ...newBooking,
        id: bookings.length > 0 ? Math.max(...bookings.map(booking => booking.id)) + 1 : 1,
        labName: selectedLab ? selectedLab.name : 'Lab Tidak Diketahui',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setBookings([...bookings, bookingToAdd]);
      setNewBooking({
        labId: '',
        user: '',
        userEmail: '',
        department: '',
        purpose: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        notes: '',
        status: 'pending',
        attendees: 1,
        priority: 'normal'
      });
      setShowAddModal(false);
      
      alert('✅ Pemesanan berhasil ditambahkan!');
    } else {
      alert('⚠️ Harap isi semua field yang diperlukan!');
    }
  };

  const updateBookingStatus = (id, status) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({...selectedBooking, status});
    }
  };

  const deleteBooking = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pemesanan ini?')) {
      setBookings(bookings.filter(booking => booking.id !== id));
      if (selectedBooking && selectedBooking.id === id) {
        setShowModal(false);
      }
    }
  };

  const editBooking = (booking) => {
    setNewBooking({
      labId: booking.lab?.id || '',
      teacherName: booking.teacherName || booking.user?.name || '',
      subject: booking.subject || '',
      activityTitle: booking.activityTitle || booking.purpose || '',
      description: booking.description || booking.remarks || '',
      bookingDate: booking.bookingDate || booking.date || '',
      startTime: booking.startTime || '',
      endTime: booking.endTime || '',
      purpose: booking.purpose || booking.activityTitle || '',
      participants: booking.participants || [],
      status: booking.status || 'pending',
      remarks: booking.remarks || ''
    });
    setShowAddModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Disetujui';
      case 'pending': return 'Menunggu';
      case 'rejected': return 'Ditolak';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    return 'bg-gray-100 text-gray-800';
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Filter bookings (use DB field names)
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filter === 'semua' || booking.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (booking.teacherName || booking.user?.name || '').toLowerCase().includes(searchLower) ||
      (booking.activityTitle || booking.subject || booking.purpose || '').toLowerCase().includes(searchLower) ||
      (booking.lab?.name || '').toLowerCase().includes(searchLower)
    );
    const matchesDate = !dateFilter || booking.bookingDate === dateFilter;
    const matchesLab = labFilter === 'semua' || booking.lab?.id === parseInt(labFilter);
    const matchesDept = departmentFilter === 'semua' || (booking.user?.department === departmentFilter);
    const matchesPriority = priorityFilter === 'semua' || true;

    return matchesStatus && matchesSearch && matchesDate && matchesLab && matchesDept && matchesPriority;
  });

  // Calculate stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'approved').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    today: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length,
    thisWeek: bookings.filter(b => {
      const bookingDate = new Date(b.date);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return bookingDate >= weekStart && bookingDate <= weekEnd;
    }).length
  };

  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const days = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(calendarYear, calendarMonth - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: 'prev',
        date: new Date(calendarYear, calendarMonth - 1, prevMonthDays - i).toISOString().split('T')[0]
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        date: new Date(calendarYear, calendarMonth, i).toISOString().split('T')[0]
      });
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks
    for (let i = 1; days.length < totalCells; i++) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(calendarYear, calendarMonth + 1, i).toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => booking.bookingDate === date);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(calendarYear - 1);
      } else {
        setCalendarMonth(calendarMonth - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(calendarYear + 1);
      } else {
        setCalendarMonth(calendarMonth + 1);
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Lab', 'Pemesan', 'Email', 'Subject', 'Activity', 'Tanggal', 'Waktu', 'Status', 'Remarks', 'Participants', 'CreatedAt'];
    const csvData = bookings.map(booking => [
      booking.id,
      booking.lab?.name || '',
      booking.user?.name || booking.teacherName || '',
      booking.user?.email || '',
      booking.subject || '',
      booking.activityTitle || booking.purpose || '',
      booking.bookingDate || '',
      `${booking.startTime || ''}-${booking.endTime || ''}`,
      booking.status || '',
      booking.remarks || booking.description || '',
      (booking.participants && booking.participants.length) || 0,
      booking.createdAt || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Booking Management System</h1>
            <p className="text-gray-600">Admin Panel - Manajemen Pemesanan Laboratorium</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            
            <button 
              onClick={exportToCSV}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-2xl font-bold text-gray-800">{stats.today}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <Users size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-800">{stats.thisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex space-x-3 mb-4 lg:mb-0">
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'table' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setViewMode('table')}
              >
                <div className="w-4 h-4 mr-2">📋</div>
                Table View
              </button>
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'calendar' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar size={16} className="mr-2" />
                Calendar View
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search bookings..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <div className="flex space-x-3">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="semua">All Status</option>
                  <option value="approved">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lab</label>
                  <select 
                    value={labFilter}
                    onChange={(e) => setLabFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="semua">All Labs</option>
                    {labs.map(lab => (
                      <option key={lab.id} value={lab.id}>{lab.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="semua">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="semua">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-3">
                <button 
                  onClick={() => {
                    setDateFilter('');
                    setLabFilter('semua');
                    setDepartmentFilter('semua');
                    setPriorityFilter('semua');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">All Bookings</h2>
                <span className="text-sm text-gray-500">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </span>
              </div>
            </div>
            
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings found</h3>
                <p className="text-gray-500">
                  {searchTerm || filter !== 'semua' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No bookings have been created yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab & User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                          <div className="text-xs text-gray-500">{booking.createdAt}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building size={20} className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{booking.lab?.name || 'Unknown Lab'}</div>
                              <div className="text-sm text-gray-500">{booking.user?.name || booking.teacherName}</div>
                              <div className="text-xs text-gray-400">{booking.user?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.bookingDate}</div>
                            <div className="text-sm text-gray-500">
                              {booking.startTime} - {booking.endTime}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center">
                              <Users size={12} className="mr-1" />
                              {(booking.participants && booking.participants.length) || 0} participants
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.activityTitle || booking.purpose}</div>
                            {(booking.description || booking.remarks) && (
                              <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{booking.description || booking.remarks}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status === 'approved' && <CheckCircle size={12} className="mr-1" />}
                            {booking.status === 'pending' && <Clock size={12} className="mr-1" />}
                            {booking.status === 'rejected' && <XCircle size={12} className="mr-1" />}
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => viewBookingDetails(booking)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => editBooking(booking)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            {booking.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'approved')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Approve"
                                >
                                  <CheckSquare size={16} />
                                </button>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'rejected')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => deleteBooking(booking.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Calendar View</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="mx-4 font-medium">
                      {monthNames[calendarMonth]} {calendarYear}
                    </span>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setCalendarMonth(new Date().getMonth());
                      setCalendarYear(new Date().getFullYear());
                    }}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((day, index) => {
                  const dayBookings = getBookingsForDate(day.date);
                  const isToday = day.date === today;
                  const isCurrentMonth = day.month === 'current';
                  
                  return (
                    <div 
                      key={index}
                      className={`min-h-32 border rounded-lg p-2 ${
                        isToday 
                          ? 'border-blue-300 bg-blue-50' 
                          : isCurrentMonth 
                            ? 'border-gray-200 bg-white' 
                            : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${
                          isToday 
                            ? 'text-blue-600' 
                            : isCurrentMonth 
                              ? 'text-gray-700' 
                              : 'text-gray-400'
                        }`}>
                          {day.day}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {dayBookings.length}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayBookings.slice(0, 3).map(booking => (
                          <div 
                            key={booking.id}
                            className={`text-xs p-1 rounded truncate cursor-pointer ${
                              booking.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}
                            onClick={() => viewBookingDetails(booking)}
                            title={`${booking.labName} - ${booking.startTime}`}
                          >
                            <div className="font-medium truncate">{booking.labName}</div>
                            <div className="truncate">{booking.startTime} - {booking.user.split(' ')[0]}</div>
                          </div>
                        ))}
                        
                        {dayBookings.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayBookings.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Confirmed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Labs Overview */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Labs Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labs.map(lab => {
              const labBookings = bookings.filter(b => b.labId === lab.id && b.status === 'approved');
              const todayBookings = labBookings.filter(b => b.date === today);
              
              return (
                <div key={lab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{lab.name}</h3>
                      <p className="text-sm text-gray-500">{lab.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      lab.status === 'tersedia' ? 'bg-green-100 text-green-800' :
                      lab.status === 'digunakan' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Users size={14} className="mr-1" />
                    <span>Capacity: {lab.capacity}</span>
                    <span className="mx-2">•</span>
                    <span>{lab.type}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="font-medium mb-1">Facilities:</div>
                    <div className="flex flex-wrap gap-1">
                      {lab.facilities.map((facility, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {labBookings.length} confirmed bookings • {todayBookings.length} today
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {newBooking.labId ? 'Edit Booking' : 'Add New Booking'}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory *</label>
                    <select 
                      name="labId"
                      value={newBooking.labId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Lab</option>
                      {labs.map(lab => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name} ({lab.capacity} seats, {lab.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name *</label>
                    <input 
                      type="text" 
                      name="user"
                      value={newBooking.user}
                      onChange={handleInputChange}
                      placeholder="Dr. Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="userEmail"
                      value={newBooking.userEmail}
                      onChange={handleInputChange}
                      placeholder="email@university.edu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select 
                      name="department"
                      value={newBooking.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                    <input 
                      type="text" 
                      name="purpose"
                      value={newBooking.purpose}
                      onChange={handleInputChange}
                      placeholder="Class, Research, Workshop, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input 
                        type="date" 
                        name="date"
                        value={newBooking.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                      <input 
                        type="number" 
                        name="attendees"
                        value={newBooking.attendees}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                      <input 
                        type="time" 
                        name="startTime"
                        value={newBooking.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                      <input 
                        type="time" 
                        name="endTime"
                        value={newBooking.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                      name="priority"
                      value={newBooking.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea 
                  name="notes"
                  value={newBooking.notes}
                  onChange={handleInputChange}
                  placeholder="Special requirements, equipment needed, etc."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={addBooking}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
                >
                  {newBooking.labId ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">Booking Details #{selectedBooking.id}</h3>
                  <p className="text-blue-100 text-sm">{selectedBooking.labName}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-blue-200"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Lab Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">LAB INFORMATION</h4>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Building size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedBooking.labName}</div>
                      <div className="text-sm text-gray-500">ID: {selectedBooking.labId}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={14} className="mr-2" />
                      Capacity: {labs.find(l => l.id === selectedBooking.labId)?.capacity || 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target size={14} className="mr-2" />
                      Type: {labs.find(l => l.id === selectedBooking.labId)?.type || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {/* Requester Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">REQUESTER INFORMATION</h4>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <User size={24} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedBooking.user}</div>
                      <div className="text-sm text-gray-500">{selectedBooking.department}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2" />
                      {selectedBooking.userEmail}
                    </div>
                    <div className="text-sm text-gray-600">
                      Purpose: {selectedBooking.purpose}
                    </div>
                  </div>
                </div>
                
                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">BOOKING DETAILS</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Date & Time</div>
                      <div className="font-medium text-gray-900">{selectedBooking.date}</div>
                      <div className="text-sm text-gray-700">
                        {selectedBooking.startTime} - {selectedBooking.endTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusText(selectedBooking.status)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="text-sm text-gray-700">{selectedBooking.createdAt}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">ATTENDANCE & PRIORITY</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expected Attendees</span>
                      <span className="font-semibold text-gray-900">{selectedBooking.attendees} people</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Priority Level</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(selectedBooking.priority)}`}>
                        {selectedBooking.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">NOTES</h4>
                  {selectedBooking.notes ? (
                    <div className="text-gray-700 whitespace-pre-wrap">{selectedBooking.notes}</div>
                  ) : (
                    <div className="text-gray-400 italic">No notes provided</div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedBooking, null, 2));
                      alert('Booking details copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <Copy size={16} className="mr-2" />
                    Copy Details
                  </button>
                  
                  <button 
                    onClick={() => editBooking(selectedBooking)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Booking
                  </button>
                  
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'dikonfirmasi');
                          alert('Booking confirmed!');
                        }}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center"
                      >
                        <CheckSquare size={16} className="mr-2" />
                        Confirm Booking
                      </button>
                      <button 
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'ditolak');
                          alert('Booking rejected!');
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center"
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject Booking
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this booking?')) {
                        deleteBooking(selectedBooking.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center ml-auto"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500">
          <div>
            <span className="font-medium text-gray-700">Booking Management System v2.0</span> • 
            Last updated: {new Date().toLocaleDateString('id-ID')}
          </div>
          <div className="mt-2 md:mt-0">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span>System Active • Total {bookings.length} bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;