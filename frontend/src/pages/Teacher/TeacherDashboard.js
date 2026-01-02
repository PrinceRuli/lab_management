import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFlask, FaClock, FaCheckCircle, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import Card from '../../components/common/Card';

const TeacherDashboard = () => {
  // ================= STATE =================
  const [stats, setStats] = useState({
    todaysBookings: 0,
    availableLabs: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalStudents: 0,
    upcomingClasses: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 Fetching teacher dashboard data...');
      
        
        
        // Import API services
        const { bookingAPI, labAPI } = await import('../../services/api');
        
        // Fetch data dengan timeout yang lebih lama
        const fetchPromises = [];
        
        // Fetch labs data
        fetchPromises.push(
          labAPI.getAll().catch(err => {
            console.warn('Failed to fetch labs:', err);
            return { data: [] };
          })
        );
        
        // Fetch bookings data - GUNAKAN getMyBookings()
        fetchPromises.push(
          bookingAPI.getMyBookings().catch(err => {
            console.warn('Failed to fetch bookings:', err);
            // Fallback ke getAll jika getMyBookings error
            return bookingAPI.getAll().catch(() => ({ data: [] }));
          })
        );
        
        // Gunakan timeout 15 detik
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout (15s)')), 15000);
        });

        try {
          const [labsResponse, bookingsResponse] = await Promise.race([
            Promise.all(fetchPromises),
            timeoutPromise
          ]);
          
          console.log('API Responses:', { labsResponse, bookingsResponse });
          
          // Process labs data
          let labsData = [];
          if (labsResponse && labsResponse.data) {
            if (Array.isArray(labsResponse.data)) {
              labsData = labsResponse.data;
            } else if (labsResponse.data.data && Array.isArray(labsResponse.data.data)) {
              labsData = labsResponse.data.data;
            } else if (labsResponse.data.labs && Array.isArray(labsResponse.data.labs)) {
              labsData = labsResponse.data.labs;
            }
          }
          
          // Process bookings data
          let bookingsData = [];
          if (bookingsResponse && bookingsResponse.data) {
            if (Array.isArray(bookingsResponse.data)) {
              bookingsData = bookingsResponse.data;
            } else if (bookingsResponse.data.data && Array.isArray(bookingsResponse.data.data)) {
              bookingsData = bookingsResponse.data.data;
            } else if (bookingsResponse.data.bookings && Array.isArray(bookingsResponse.data.bookings)) {
              bookingsData = bookingsResponse.data.bookings;
            }
          }
          
          console.log('Processed data:', {
            bookingsCount: bookingsData.length,
            labsCount: labsData.length,
            bookingsData: bookingsData.slice(0, 3)
          });

          // Filter available labs
          const availableLabs = labsData.filter(lab => {
            const status = lab.status || lab.availability || lab.isAvailable;
            return status === 'available' || status === 'active' || status === 'ready' || lab.isAvailable === true;
          });
          
          // Calculate statistics
          const nowDate = new Date();
          nowDate.setHours(0, 0, 0, 0);
          
          const todaysBookings = bookingsData.filter(b => {
            try {
              const bookingDate = b.bookingDate || b.date || b.startDate || b.scheduleDate;
              if (!bookingDate) return false;
              
              const date = new Date(bookingDate);
              date.setHours(0, 0, 0, 0);
              const status = b.status || b.bookingStatus || b.state;
              
              return date.getTime() === nowDate.getTime() && 
                     (status === 'approved' || status === 'pending' || status === 'confirmed' || status === 'scheduled');
            } catch (err) {
              console.warn('Error processing booking date:', err);
              return false;
            }
          }).length;
          
          const pendingBookings = bookingsData.filter(b => {
            const status = b.status || b.bookingStatus || b.state;
            return status === 'pending' || status === 'waiting' || status === 'requested';
          }).length;
          
          const completedBookings = bookingsData.filter(b => {
            const status = b.status || b.bookingStatus || b.state;
            return status === 'completed' || status === 'approved' || status === 'done' || status === 'finished';
          }).length;
          
          // Get upcoming bookings (next 7 days)
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          
          const upcoming = bookingsData
            .filter(b => {
              try {
                const bookingDate = b.bookingDate || b.date || b.startDate || b.scheduleDate;
                if (!bookingDate) return false;
                
                const date = new Date(bookingDate);
                const status = b.status || b.bookingStatus || b.state;
                
                return date > nowDate && 
                       date <= nextWeek && 
                       (status === 'approved' || status === 'confirmed' || status === 'scheduled');
              } catch (err) {
                console.warn('Error filtering upcoming booking:', err);
                return false;
              }
            })
            .sort((a, b) => {
              try {
                const dateA = new Date(a.bookingDate || a.date || a.startDate || a.scheduleDate);
                const dateB = new Date(b.bookingDate || b.date || b.startDate || b.scheduleDate);
                return dateA - dateB;
              } catch (err) {
                return 0;
              }
            })
            .slice(0, 3)
            .map(booking => ({
              id: booking._id || booking.id || Math.random().toString(),
              lab: booking.lab?.name || booking.labName || booking.lab?.labName || booking.labId || 'Laboratorium',
              date: formatBookingDate(booking.bookingDate || booking.date || booking.startDate || booking.scheduleDate),
              time: `${booking.startTime || '09:00'} - ${booking.endTime || '11:00'}`,
              subject: booking.subject || booking.activityTitle || booking.course || booking.className || booking.title || 'Kelas',
              status: booking.status || booking.bookingStatus || booking.state
            }));
          
          // Get recent activities
          const recent = bookingsData
            .sort((a, b) => {
              try {
                const dateA = new Date(a.createdAt || a.bookingDate || a.date || a.updatedAt || a.createdDate);
                const dateB = new Date(b.createdAt || b.bookingDate || b.date || b.updatedAt || b.createdDate);
                return dateB - dateA;
              } catch (err) {
                return 0;
              }
            })
            .slice(0, 5)
            .map(booking => ({
              id: booking._id || booking.id || Math.random().toString(),
              lab: booking.lab?.name || booking.labName || booking.lab?.labName || booking.labId || 'Laboratorium',
              action: getBookingAction(booking),
              time: getTimeAgo(booking.createdAt || booking.bookingDate || booking.date || booking.updatedAt || booking.createdDate),
              type: getActivityType(booking.status || booking.bookingStatus || booking.state),
              status: booking.status || booking.bookingStatus || booking.state
            }));
          
          // Calculate total students
          const totalStudents = bookingsData
            .filter(b => {
              const status = b.status || b.bookingStatus || b.state;
              return status === 'completed' || status === 'approved' || status === 'done' || status === 'finished';
            })
            .reduce((total, booking) => {
              return total + (booking.studentCount || booking.numberOfStudents || booking.participants || booking.students || 0);
            }, 0);
          
          setStats({
            todaysBookings,
            availableLabs: availableLabs.length,
            pendingBookings,
            completedBookings,
            totalStudents,
            upcomingClasses: upcoming.length
          });
          
          setUpcomingBookings(upcoming);
          setRecentActivities(recent);
          
          console.log('✅ Teacher dashboard data loaded successfully');
          
        } catch (timeoutErr) {
          console.warn('API request timeout, using fallback data');
          // Use fallback data
          initializeFallbackData();
        }
        
      } catch (err) {
        console.error('❌ Error in dashboard:', err);
        setError(`Terjadi kesalahan: ${err.message}`);
        // Use fallback data
        initializeFallbackData();
      } finally {
        setLoading(false);
      }
    };

    // Fallback data initialization
    const initializeFallbackData = () => {
      
      
      // Set fallback data
      setStats({
        todaysBookings: 3,
        availableLabs: 5,
        pendingBookings: 2,
        completedBookings: 24,
        totalStudents: 156,
        upcomingClasses: 3
      });
      
      setUpcomingBookings([
        { id: 1, lab: 'Lab Komputer 1', date: 'Hari Ini', time: '09:00 - 11:00', subject: 'Computer Science', status: 'approved' },
        { id: 2, lab: 'Lab Biologi', date: 'Besok', time: '13:00 - 15:00', subject: 'Biology', status: 'pending' },
        { id: 3, lab: 'Lab Kimia', date: '20 Des', time: '10:00 - 12:00', subject: 'Chemistry', status: 'approved' },
      ]);
      
      setRecentActivities([
        { id: 1, lab: 'Lab Komputer 1', action: 'Mengajukan booking Computer Science di Lab Komputer 1', time: '10 menit yang lalu', status: 'pending' },
        { id: 2, lab: 'Lab Biologi', action: 'Booking Biology di Lab Biologi disetujui', time: '1 jam yang lalu', status: 'approved' },
        { id: 3, lab: 'Lab Kimia', action: 'Menyelesaikan kelas di Lab Kimia', time: '2 hari yang lalu', status: 'completed' },
      ]);
    };

    fetchDashboardData();
    
    // Refresh data setiap 2 menit
    const intervalId = setInterval(fetchDashboardData, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // ================= HELPER FUNCTIONS =================
  const formatBookingDate = (dateString) => {
    if (!dateString) return 'Hari Ini';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
      
      if (dateOnly.getTime() === todayOnly.getTime()) return 'Hari Ini';
      if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'Besok';
      
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (err) {
      return 'Tanggal tidak valid';
    }
  };

  const getBookingAction = (booking) => {
    const labName = booking.lab?.name || booking.labName || booking.lab?.labName || booking.labId || 'Laboratorium';
    const activity = booking.subject || booking.activityTitle || booking.course || booking.className || booking.title || 'Kegiatan';
    const status = booking.status || booking.bookingStatus || booking.state;
    
    switch(status) {
      case 'pending':
      case 'waiting':
      case 'requested':
        return `Mengajukan booking ${activity} di ${labName}`;
      case 'approved':
      case 'confirmed':
      case 'scheduled':
        return `Booking ${activity} di ${labName} disetujui`;
      case 'rejected':
      case 'cancelled':
      case 'declined':
        return `Booking ${activity} di ${labName} ditolak`;
      case 'completed':
      case 'done':
      case 'finished':
        return `Menyelesaikan kelas di ${labName}`;
      default:
        return `Melakukan booking di ${labName}`;
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays < 7) return `${diffDays} hari yang lalu`;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (err) {
      return 'Waktu tidak valid';
    }
  };

  const getActivityType = (status) => {
    switch(status) {
      case 'pending':
      case 'waiting': 
      case 'requested':
        return 'booking';
      case 'approved':
      case 'confirmed': 
      case 'scheduled':
        return 'approval';
      case 'rejected':
      case 'cancelled': 
      case 'declined':
        return 'rejection';
      case 'completed':
      case 'done': 
      case 'finished':
        return 'completion';
      default: 
        return 'update';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
      case 'confirmed': 
      case 'scheduled':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
      case 'waiting': 
      case 'requested':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected':
      case 'cancelled': 
      case 'declined':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'completed':
      case 'done': 
      case 'finished':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: 
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved':
      case 'confirmed': 
      case 'scheduled':
        return 'Disetujui';
      case 'pending':
      case 'waiting': 
      case 'requested':
        return 'Menunggu';
      case 'rejected':
      case 'cancelled': 
      case 'declined':
        return 'Ditolak';
      case 'completed':
      case 'done': 
      case 'finished':
        return 'Selesai';
      default: 
        return status || 'Unknown';
    }
  };

  

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="space-y-6 p-4">
        {/* Welcome Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  const quickStats = [
    { 
      label: 'Kelas Hari Ini', 
      value: stats.todaysBookings, 
      icon: <FaCalendarAlt className="text-white" />, 
      color: 'bg-blue-500',
      description: 'Jadwal hari ini',
      link: '/teacher/schedule?filter=today'
    },
    { 
      label: 'Lab Tersedia', 
      value: stats.availableLabs, 
      icon: <FaFlask className="text-white" />, 
      color: 'bg-green-500',
      description: 'Lab dapat digunakan',
      link: '/teacher/booking'
    },
    { 
      label: 'Menunggu Persetujuan', 
      value: stats.pendingBookings, 
      icon: <FaClock className="text-white" />, 
      color: 'bg-yellow-500',
      description: 'Perlu konfirmasi',
      link: '/teacher/schedule?filter=pending'
    },
    { 
      label: 'Total Siswa', 
      value: stats.totalStudents.toLocaleString('id-ID'), 
      icon: <FaUsers className="text-white" />, 
      color: 'bg-purple-500',
      description: 'Seluruh kelas',
      link: '/teacher/history'
    }
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
          <p className="text-gray-600">
            Rangkuman kegiatan yang saya jalan
          </p>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Link key={index} to={stat.link} className="block">
            <Card className="p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <div className="text-white text-xl">{stat.icon}</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Lihat detail
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Booking Mendatang</h2>
              <Link to="/teacher/schedule" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Lihat semua →
              </Link>
            </div>
            
            <div className="space-y-3">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">Tidak ada booking mendatang</p>
                  <p className="text-sm text-gray-400 mb-4">Mulai dengan membuat booking pertama Anda</p>
                  <Link to="/teacher/booking">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Buat Booking
                    </button>
                  </Link>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.lab}</h3>
                        <p className="text-sm text-gray-500">{booking.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{booking.date}</p>
                      <p className="text-sm text-gray-500">{booking.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6">
              <Link to="/teacher/booking" className="block w-full">
                <button className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  <span className="flex items-center justify-center gap-2">
                    <FaFlask className="h-4 w-4" />
                    Booking Lab Baru
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/teacher/booking"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors hover:shadow-sm hover:border-green-300 group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                  <FaFlask className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Booking Lab</h3>
                <p className="text-sm text-gray-500">Jadwalkan kelas baru</p>
              </Link>
              
              <Link
                to="/teacher/schedule"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors hover:shadow-sm hover:border-blue-300 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                  <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Jadwal Saya</h3>
                <p className="text-sm text-gray-500">Lihat kalender</p>
              </Link>
              
              <Link
                to="/teacher/resources"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors hover:shadow-sm hover:border-purple-300 group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200 transition-colors">
                  <FaCheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Materi Ajar</h3>
                <p className="text-sm text-gray-500">Bahan pengajaran</p>
              </Link>
              
              <Link
                to="/teacher/history"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors hover:shadow-sm hover:border-yellow-300 group"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-yellow-200 transition-colors">
                  <FaClock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-medium text-gray-900">Riwayat</h3>
                <p className="text-sm text-gray-500">Booking sebelumnya</p>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Aktivitas Terbaru</h3>
            <Link 
              to="/teacher/history" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Lihat semua →
            </Link>
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Belum ada aktivitas terbaru</p>
              <p className="text-sm text-gray-400">Mulai dengan membuat booking pertama</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                      {activity.status === 'approved' || activity.status === 'confirmed' || activity.status === 'scheduled' ? (
                        <FaCheckCircle className="w-4 h-4" />
                      ) : activity.status === 'pending' || activity.status === 'waiting' || activity.status === 'requested' ? (
                        <FaClock className="w-4 h-4" />
                      ) : activity.status === 'rejected' || activity.status === 'cancelled' || activity.status === 'declined' ? (
                        <FaExclamationTriangle className="w-4 h-4" />
                      ) : (
                        <FaCalendarAlt className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.lab}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getStatusColor(activity.status)}`}>
                      {getStatusText(activity.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;