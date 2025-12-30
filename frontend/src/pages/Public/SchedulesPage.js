// src/pages/Public/SchedulesPage.jsx - VERSI HANYA APPROVED UNTUK PUBLIC
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaFilter, 
  FaSort, 
  FaSearch, 
  FaClock, 
  FaUsers, 
  FaBuilding, 
  FaGraduationCap,
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaEye,
  FaExclamationTriangle,
  FaChevronDown,
  FaCalendarDay,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaListAlt,
  FaCalendarCheck
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../../services/api';

const SchedulesPage = () => {
  // State Management
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Configuration - HANYA filter untuk approved schedules
  const FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Jadwal', icon: FaCalendarAlt },
    { value: 'today', label: 'Hari Ini', icon: FaCalendarDay },
    { value: 'ongoing', label: 'Sedang Berlangsung', icon: FaClock },
    { value: 'upcoming', label: 'Mendatang', icon: FaClock },
    { value: 'past', label: 'Selesai', icon: FaCheckCircle }
  ];

  const SORT_OPTIONS = [
    { value: 'date', label: 'Tanggal (Terbaru)' },
    { value: 'date-asc', label: 'Tanggal (Terlama)' },
    { value: 'lab', label: 'Laboratorium' },
    { value: 'subject', label: 'Mata Pelajaran' },
    { value: 'teacher', label: 'Pengajar' }
  ];

  // ================= FETCH APPROVED SCHEDULES ONLY =================
  const fetchApprovedSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Memuat jadwal yang DISETUJUI untuk publik...');
      
      // OPTION 1: Gunakan endpoint khusus approved schedules
      // const response = await bookingAPI.getApprovedSchedules();
      
      // OPTION 2: Jika endpoint khusus tidak ada, filter dari semua data
      const response = await bookingAPI.getApprovedSchedules();
      
      console.log('📊 Response API bookings:', response.data);
      
      let bookingsData = [];
      
      // Handle berbagai format response
      if (Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        bookingsData = response.data.data;
      } else if (response.data?.bookings && Array.isArray(response.data.bookings)) {
        bookingsData = response.data.bookings;
      } else {
        console.warn('⚠️ Format data tidak dikenali:', response.data);
        bookingsData = [];
      }
      
      console.log(`📥 Total data mentah: ${bookingsData.length}`);
      
      // FILTER HANYA YANG STATUS 'approved'
      const approvedBookings = bookingsData.filter(booking => 
        booking.status === 'approved'
      );
      
      console.log(`✅ Berhasil memuat ${approvedBookings.length} booking yang DISETUJUI`);
      
      // Process hanya booking yang approved
      const processedBookings = processBookings(approvedBookings);
      setBookings(processedBookings);
      setLastUpdated(new Date());
      
      if (approvedBookings.length > 0) {
        toast.success(`Menampilkan ${approvedBookings.length} jadwal yang disetujui`);
      } else {
        toast.info('Belum ada jadwal yang disetujui');
      }
      
    } catch (err) {
      console.error('❌ Error fetching approved schedules:', err);
      const errorMsg = err.response?.data?.message || 'Gagal memuat jadwal. Silakan coba lagi.';
      setError(errorMsg);
      toast.error('Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  };

  // Process hanya booking yang approved
  const processBookings = (bookingsData) => {
    const now = new Date();
    
    return bookingsData.map((booking, index) => {
      try {
        // Normalize lab data
        const labData = booking.lab || {};
        const labName = labData.name || booking.labName || 'Laboratorium';
        const labLocation = labData.location || 'Lokasi tidak tersedia';
        
        // Normalize date and time
        const rawDate = booking.bookingDate || booking.tanggal;
        const bookingDate = rawDate ? new Date(rawDate) : null;
        
        const startTime = booking.startTime || '';
        const durationHours = booking.durationHours || 2;
        
        // Calculate schedule status (hanya untuk approved)
        const { combinedDateTime, status } = calculateScheduleStatus(bookingDate, startTime, durationHours, now);
        
        // Format display
        const displayDate = formatDisplayDate(bookingDate);
        const displayTime = formatDisplayTime(startTime);
        const endTime = calculateEndTime(startTime, durationHours);
        
        return {
          // ID & metadata
          _id: booking._id || `temp-${Date.now()}-${index}`,
          rawId: booking._id,
          
          // Original booking data
          ...booking,
          
          // Lab data
          lab: labData,
          labName,
          labLocation,
          
          // Schedule data
          bookingDate,
          startTime,
          combinedDateTime,
          status,
          displayDate,
          displayTime,
          durationHours,
          endTime,
          
          // Normalized fields
          teacherName: booking.teacherName || booking.user?.name || 'Pengajar',
          subject: booking.subject || 'Mata Pelajaran',
          activityTitle: booking.activityTitle || booking.purpose || 'Kegiatan Laboratorium',
          description: booking.description || booking.remarks || '',
          classGroup: booking.classGroup || 'Kelas',
          gradeLevel: booking.gradeLevel || '',
          semester: booking.semester || '',
          academicYear: booking.academicYear || '',
          
          // Booking status (selalu 'approved' di sini)
          bookingStatus: 'approved',
          
          // Additional info
          remarks: booking.remarks || '',
          approvedAt: booking.approvedAt,
          createdAt: booking.createdAt,
          user: booking.user || null
        };
      } catch (error) {
        console.error('Error processing booking:', error, booking);
        return null;
      }
    }).filter(booking => booking !== null);
  };

  // ================= HELPER FUNCTIONS =================
  const calculateScheduleStatus = (bookingDate, startTime, durationHours, now) => {
    let combinedDateTime = null;
    let status = 'upcoming';
    
    if (bookingDate && startTime) {
      try {
        const [hours, minutes] = startTime.split(':').map(Number);
        combinedDateTime = new Date(bookingDate);
        combinedDateTime.setHours(hours || 0, minutes || 0, 0, 0);
        
        const endTime = new Date(combinedDateTime.getTime() + (durationHours || 2) * 60 * 60 * 1000);
        
        if (now >= combinedDateTime && now <= endTime) {
          status = 'ongoing';
        } else if (combinedDateTime < now) {
          status = 'past';
        }
      } catch (error) {
        console.error('Error calculating schedule status:', error);
      }
    }
    
    return { combinedDateTime, status };
  };

  const formatDisplayDate = (date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Tanggal tidak tersedia';
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset waktu untuk perbandingan
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Hari Ini';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Besok';
    } else {
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const formatDisplayTime = (time) => {
    if (!time) return 'Waktu tidak tersedia';
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return 'Waktu tidak valid';
    }
  };

  const calculateEndTime = (startTime, durationHours) => {
    if (!startTime || !durationHours) return '';
    
    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + (durationHours * 60);
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      
      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const getStatusBadge = (status) => {
    // Hanya tampilkan schedule status karena semua booking sudah approved
    const scheduleConfig = {
      'ongoing': { 
        bg: 'bg-green-100 text-green-800 border border-green-200',
        icon: '🟢',
        label: 'Sedang Berlangsung' 
      },
      'upcoming': { 
        bg: 'bg-blue-100 text-blue-800 border border-blue-200',
        icon: '🟡',
        label: 'Akan Datang' 
      },
      'past': { 
        bg: 'bg-gray-100 text-gray-800 border border-gray-200',
        icon: '⚫',
        label: 'Selesai' 
      },
    };
    
    const config = scheduleConfig[status] || { 
      bg: 'bg-gray-100 text-gray-800', 
      icon: '❓',
      label: status 
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} flex items-center gap-1`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // Tambahkan badge "DISETUJUI" untuk semua kartu
  const getApprovedBadge = () => (
    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
      <FaCheckCircle className="h-3 w-3" />
      DISETUJUI
    </div>
  );

  const getSubjectIcon = (subject) => {
    const lowerSubject = (subject || '').toLowerCase();
    
    const iconMap = {
      'kimia': '🧪',
      'biologi': '🔬',
      'fisika': '⚛️',
      'sains': '🔭',
      'komputer': '💻',
      'tik': '⌨️',
      'matematika': '🧮',
      'mat': '📐',
      'bahasa': '📖',
      'inggris': '🇬🇧',
      'sejarah': '🏛️',
      'geografi': '🌍',
      'ekonomi': '📈',
      'seni': '🎨',
      'olahraga': '⚽'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerSubject.includes(key)) {
        return icon;
      }
    }
    
    return '📚';
  };

  // ================= FILTER & SORT =================
  const filteredBookings = useMemo(() => {
    let result = [...bookings]; // Semua booking di sini sudah approved
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking =>
        booking.teacherName?.toLowerCase().includes(term) ||
        booking.subject?.toLowerCase().includes(term) ||
        booking.activityTitle?.toLowerCase().includes(term) ||
        booking.labName?.toLowerCase().includes(term) ||
        booking.classGroup?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter (hanya untuk schedule status)
    if (filter !== 'all') {
      if (filter === 'today') {
        const today = new Date().toDateString();
        result = result.filter(booking => {
          const scheduleDate = booking.combinedDateTime?.toDateString() || 
                             booking.bookingDate?.toDateString();
          return scheduleDate === today;
        });
      } else {
        result = result.filter(booking => booking.status === filter);
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'date':
        case 'date-asc':
          compareA = a.combinedDateTime || new Date(0);
          compareB = b.combinedDateTime || new Date(0);
          break;
        case 'lab':
          compareA = a.labName || '';
          compareB = b.labName || '';
          break;
        case 'subject':
          compareA = a.subject || '';
          compareB = b.subject || '';
          break;
        case 'teacher':
          compareA = a.teacherName || '';
          compareB = b.teacherName || '';
          break;
        default:
          compareA = a.combinedDateTime || new Date(0);
          compareB = b.combinedDateTime || new Date(0);
      }
      
      // Handle date-asc specially
      if (sortBy === 'date-asc') {
        return compareA < compareB ? -1 : 1;
      }
      
      return sortOrder === 'asc' 
        ? compareA > compareB ? 1 : -1
        : compareA < compareB ? 1 : -1;
    });
    
    return result;
  }, [bookings, searchTerm, filter, sortBy, sortOrder]);

  // Display with pagination
  const displayedBookings = useMemo(() => {
    return filteredBookings.slice(0, visibleCount);
  }, [filteredBookings, visibleCount]);

  // Calculate statistics - HANYA untuk approved
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    
    return {
      all: bookings.length,
      ongoing: bookings.filter(b => b.status === 'ongoing').length,
      upcoming: bookings.filter(b => b.status === 'upcoming').length,
      past: bookings.filter(b => b.status === 'past').length,
      today: bookings.filter(b => {
        const scheduleDate = b.combinedDateTime?.toDateString() || 
                           b.bookingDate?.toDateString();
        return scheduleDate === today;
      }).length,
    };
  }, [bookings]);

  // ================= HANDLERS =================
  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const exportToPDF = () => {
    const data = {
      title: 'Jadwal Laboratorium (Hanya yang Disetujui)',
      date: new Date().toLocaleDateString('id-ID'),
      bookings: displayedBookings,
      stats: stats
    };
    
    console.log('Export data:', data);
    toast.success('Fitur export PDF akan segera tersedia');
  };

  const exportToExcel = () => {
    toast.success('Fitur export Excel akan segera tersedia');
  };

  const printSchedule = () => {
    window.print();
  };

  const refreshData = () => {
    fetchApprovedSchedules();
  };

  const openScheduleDetail = (booking) => {
    setSelectedSchedule(booking);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedSchedule(null);
  };

  // ================= USE EFFECTS =================
  useEffect(() => {
    fetchApprovedSchedules();
    
    // Auto-refresh every 5 minutes untuk real-time
    const refreshInterval = setInterval(() => {
      if (!loading) {
        fetchApprovedSchedules();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 print:bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Jadwal Laboratorium
              </h1>
              <p className="text-gray-600">
                Informasi jadwal laboratorium yang telah disetujui untuk umum
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={refreshData}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                title="Refresh data"
              >
                <FaSync className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Memuat...' : 'Refresh'}
              </button>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <FaDownload className="h-4 w-4" />
                Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <FaDownload className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={printSchedule}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 print:hidden"
              >
                <FaPrint className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>
          
          {/* Stats Cards - Hanya untuk approved */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jadwal</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaListAlt className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCalendarDay className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Berlangsung</p>
                  <p className="text-2xl font-bold text-green-700">{stats.ongoing}</p>
                </div>
                <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                  <FaClock className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mendatang</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <FaCalendarCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.past}</p>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan guru, mata pelajaran, lab, atau kelas..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimesCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filters & Sort */}
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  {FILTER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative flex-1 min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSort className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center min-w-[44px]"
                title={sortOrder === 'asc' ? 'Urutkan menaik' : 'Urutkan menurun'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          {/* Active Filters Info */}
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Pencarian: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1">×</button>
              </span>
            )}
            {filter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Filter: {FILTER_OPTIONS.find(f => f.value === filter)?.label}
                <button onClick={() => setFilter('all')} className="ml-1">×</button>
              </span>
            )}
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Memuat jadwal yang disetujui...</p>
            <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-block p-8 max-w-md">
              <FaExclamationTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={fetchApprovedSchedules}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Refresh Halaman
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FaCalendarAlt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum ada jadwal yang disetujui
            </h3>
            <p className="text-gray-600 mb-6">
              Saat ini belum ada booking laboratorium yang telah disetujui oleh administrator.
            </p>
            <div className="space-x-3">
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaSync className="inline mr-2" />
                Muat Ulang
              </button>
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 inline-block"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}
        
        {/* Schedules Grid - Hanya yang approved */}
        {!loading && !error && displayedBookings.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 group"
                >
                  {/* Status Badge - Hanya schedule status */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        {getApprovedBadge()}
                      </div>
                      <button
                        onClick={() => openScheduleDetail(booking)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Lihat detail"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Booking Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{getSubjectIcon(booking.subject)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {booking.activityTitle}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {booking.subject}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaGraduationCap className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate" title={booking.teacherName}>
                          {booking.teacherName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaBuilding className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate" title={booking.labName}>
                          {booking.labName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaUsers className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate" title={booking.classGroup}>
                          {booking.classGroup}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {booking.displayDate}
                          </div>
                          <div className="text-sm text-gray-600">
                            ⏰ {booking.displayTime} - {booking.endTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Durasi</div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.durationHours} jam
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {visibleCount < filteredBookings.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium inline-flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FaChevronDown className="h-4 w-4" />
                  Tampilkan Lebih Banyak ({filteredBookings.length - visibleCount} tersisa)
                </button>
                <p className="text-gray-600 mt-2">
                  Menampilkan {visibleCount} dari {filteredBookings.length} jadwal
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Summary Info */}
        {!loading && !error && bookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-700 font-medium">
                  📊 <span className="font-bold">{bookings.length}</span> jadwal disetujui • 
                  <span className="font-bold ml-2">{stats.ongoing}</span> berlangsung • 
                  <span className="font-bold ml-2">{stats.upcoming}</span> mendatang
                </p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Data diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="h-4 w-4 text-green-600" />
                <span>Semua jadwal telah disetujui oleh admin</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Schedule Detail Modal */}
      {selectedSchedule && showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedSchedule.activityTitle}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(selectedSchedule.status)}
                    {getApprovedBadge()}
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      {selectedSchedule.subject}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              {/* Schedule Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaGraduationCap className="h-4 w-4" /> Pengajar
                    </h4>
                    <p className="text-gray-900 font-medium">{selectedSchedule.teacherName}</p>
                    {selectedSchedule.user?.email && (
                      <p className="text-sm text-gray-600 mt-1">{selectedSchedule.user.email}</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaBuilding className="h-4 w-4" /> Laboratorium
                    </h4>
                    <p className="text-gray-900 font-medium">{selectedSchedule.labName}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedSchedule.labLocation}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaUsers className="h-4 w-4" /> Kelas/Kelompok
                    </h4>
                    <p className="text-gray-900 font-medium">{selectedSchedule.classGroup}</p>
                    {selectedSchedule.gradeLevel && (
                      <p className="text-sm text-gray-600 mt-1">
                        Tingkat: {selectedSchedule.gradeLevel}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4" /> Tanggal
                    </h4>
                    <p className="text-gray-900 font-medium">{selectedSchedule.displayDate}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSchedule.bookingDate?.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaClock className="h-4 w-4" /> Waktu
                    </h4>
                    <p className="text-gray-900 font-medium">
                      {selectedSchedule.displayTime} - {selectedSchedule.endTime}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Durasi: {selectedSchedule.durationHours} jam
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaCheckCircle className="h-4 w-4 text-green-600" /> Status
                    </h4>
                    <p className="text-gray-900 font-medium capitalize">
                      {selectedSchedule.status === 'ongoing' && 'Sedang berlangsung'}
                      {selectedSchedule.status === 'upcoming' && 'Akan datang'}
                      {selectedSchedule.status === 'past' && 'Selesai'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      ✅ Jadwal telah disetujui oleh administrator
                    </p>
                    {selectedSchedule.approvedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Disetujui: {new Date(selectedSchedule.approvedAt).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              {selectedSchedule.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">📝 Deskripsi Kegiatan</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedSchedule.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Additional Info */}
              {(selectedSchedule.academicYear || selectedSchedule.semester) && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">📚 Informasi Akademik</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedSchedule.academicYear && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        Tahun Ajaran: {selectedSchedule.academicYear}
                      </span>
                    )}
                    {selectedSchedule.semester && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Semester: {selectedSchedule.semester}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Modal Footer */}
              <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Tutup
                </button>
                <button
                  onClick={printSchedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Cetak Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;