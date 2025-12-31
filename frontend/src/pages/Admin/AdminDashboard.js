import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import { userAPI, labAPI, bookingAPI } from '../../services/api';

const AdminDashboard = () => {
  // ================= STATE =================
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLabs: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 Fetching dashboard data...');
        
        // Fetch all data in parallel
        const [usersResponse, labsResponse, bookingsResponse] = await Promise.all([
          userAPI.getAll(),
          labAPI.getAll(),
          bookingAPI.getAll()
        ]);
        
        // Process users data
        let usersData = [];
        if (Array.isArray(usersResponse.data)) {
          usersData = usersResponse.data;
        } else if (usersResponse.data?.data && Array.isArray(usersResponse.data.data)) {
          usersData = usersResponse.data.data;
        }
        
        // Process labs data
        let labsData = [];
        if (Array.isArray(labsResponse.data)) {
          labsData = labsResponse.data;
        } else if (labsResponse.data?.data && Array.isArray(labsResponse.data.data)) {
          labsData = labsResponse.data.data;
        }
        
        // Process bookings data
        let bookingsData = [];
        if (Array.isArray(bookingsResponse.data)) {
          bookingsData = bookingsResponse.data;
        } else if (bookingsResponse.data?.data && Array.isArray(bookingsResponse.data.data)) {
          bookingsData = bookingsResponse.data.data;
        }
        
        // Calculate statistics
        const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
        const approvedBookings = bookingsData.filter(b => b.status === 'approved').length;
        const rejectedBookings = bookingsData.filter(b => b.status === 'rejected').length;
        
        setStats({
          totalUsers: usersData.length,
          totalLabs: labsData.length,
          totalBookings: bookingsData.length,
          pendingBookings,
          approvedBookings,
          rejectedBookings,
        });
        
        // Generate recent activities from bookings
        const recentBookings = bookingsData
          .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
          .slice(0, 5)
          .map(booking => ({
            id: booking._id || booking.id,
            user: booking.teacherName || booking.user?.name || 'Pengguna',
            action: getBookingAction(booking),
            time: getTimeAgo(booking.createdAt || booking.bookingDate),
            type: getActivityType(booking.status),
            status: booking.status
          }));
        
        setRecentActivities(recentBookings);
        
        console.log('✅ Dashboard data loaded:', {
          users: usersData.length,
          labs: labsData.length,
          bookings: bookingsData.length
        });
        
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= HELPER FUNCTIONS =================
  const getBookingAction = (booking) => {
    const labName = booking.lab?.name || booking.labName || 'Laboratorium';
    const activity = booking.activityTitle || booking.subject || 'Kegiatan';
    
    switch(booking.status) {
      case 'pending':
        return `Mengajukan booking ${activity} di ${labName}`;
      case 'approved':
        return `Booking ${activity} di ${labName} disetujui`;
      case 'rejected':
        return `Booking ${activity} di ${labName} ditolak`;
      default:
        return `Melakukan booking di ${labName}`;
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID');
  };

  const getActivityType = (status) => {
    switch(status) {
      case 'pending': return 'booking';
      case 'approved': return 'approval';
      case 'rejected': return 'rejection';
      default: return 'update';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Disetujui';
      case 'pending': return 'Menunggu';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('id-ID');
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Memuat data dashboard...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  // ================= RENDER ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Terjadi kesalahan</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= STATS CARDS =================
  const statCards = [
    {
      title: 'Total Pengguna',
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v3.5m0 0h-12m12 0h-12" />
        </svg>
      ),
      color: 'bg-blue-500',
      description: 'Pengguna terdaftar',
      link: '/admin/users'
    },
    {
      title: 'Total Laboratorium',
      value: stats.totalLabs,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-green-500',
      description: 'Lab tersedia',
      link: '/admin/labs'
    },
    {
      title: 'Total Booking',
      value: stats.totalBookings,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500',
      description: 'Semua booking',
      link: '/admin/bookings'
    },
    {
      title: 'Menunggu Persetujuan',
      value: stats.pendingBookings,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
      description: 'Perlu ditinjau',
      link: '/admin/bookings?filter=pending'
    }
  ];

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-600 mt-1">
              Kelola sistem laboratorium Anda dari sini.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="block">
            <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatNumber(stat.value)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Lihat detail
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Booking Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.approvedBookings)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.totalBookings > 0 
                ? `${Math.round((stats.approvedBookings / stats.totalBookings) * 100)}% dari total booking`
                : 'Belum ada data'
              }
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.pendingBookings)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.totalBookings > 0 
                ? `${Math.round((stats.pendingBookings / stats.totalBookings) * 100)}% dari total booking`
                : 'Belum ada data'
              }
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.rejectedBookings)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.totalBookings > 0 
                ? `${Math.round((stats.rejectedBookings / stats.totalBookings) * 100)}% dari total booking`
                : 'Belum ada data'
              }
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v3.5m0 0h-12m12 0h-12" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Kelola Pengguna</h4>
                <p className="text-sm text-gray-500">Tambah atau edit pengguna</p>
              </div>
            </Link>

            <Link
              to="/admin/labs"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Kelola Lab</h4>
                <p className="text-sm text-gray-500">Tambah atau edit laboratorium</p>
              </div>
            </Link>

            <Link
              to="/admin/bookings"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Kelola Booking</h4>
                <p className="text-sm text-gray-500">Setujui atau tolak booking</p>
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Lihat Laporan</h4>
                <p className="text-sm text-gray-500">Analisis dan statistik</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Aktivitas Terbaru</h3>
            <Link 
              to="/admin/bookings" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Lihat semua →
            </Link>
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">Belum ada aktivitas terbaru</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                      {activity.status === 'approved' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {activity.status === 'pending' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {activity.status === 'rejected' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
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

export default AdminDashboard;