import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { bookingAPI } from '../../services/api';

const BookingHistory = () => {
  // ================= STATE =================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching user bookings...');
        
        const response = await bookingAPI.getMyBookings();
        
        console.log('✅ Bookings data received:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setBookings(response.data);
        } else if (response.data && response.data.success !== undefined) {
          setBookings(response.data.data || []);
        } else {
          setBookings(response.data || []);
        }
        
      } catch (err) {
        console.error('❌ Error fetching bookings:', err);
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Sesi telah berakhir. Silakan login kembali.');
            setTimeout(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }, 2000);
          } else if (err.response.status === 404) {
            setError('Endpoint tidak ditemukan. Periksa konfigurasi backend.');
          } else {
            setError(err.response.data?.message || `Error ${err.response.status}: Gagal mengambil data`);
          }
        } else if (err.request) {
          setError('Server tidak merespon. Periksa koneksi atau backend server.');
        } else {
          setError(err.message || 'Terjadi kesalahan tidak diketahui');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  // ================= HANDLERS =================
  const openDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setSelectedBooking(null);
    setShowDetailModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.length >= 5 ? timeString.substring(0, 5) : timeString;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Menunggu',
        icon: '⏳'
      },
      approved: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Disetujui',
        icon: '✅'
      },
      rejected: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Ditolak',
        icon: '❌'
      },
      completed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        label: 'Selesai',
        icon: '✔️'
      },
      cancelled: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Dibatalkan',
        icon: '🚫'
      },
    };

    const config = statusConfig[status] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      label: status,
      icon: '❓'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} flex items-center gap-1`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Booking</h1>
          <p className="text-gray-600 mt-1">Memuat data booking...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Sedang memuat data...</p>
          <p className="text-sm text-gray-500 mt-2">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // ================= RENDER ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Booking</h1>
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
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  variant="danger"
                  className="px-6"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Muat Ulang
                </Button>
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  variant="outline"
                >
                  Kembali ke Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Booking</h1>
          <p className="text-gray-600 mt-1">
            Daftar booking laboratorium yang pernah Anda ajukan
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            Total: <span className="font-bold">{bookings.length}</span> booking
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-600">Menunggu: {bookings.filter(b => b.status === 'pending').length}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">Disetujui: {bookings.filter(b => b.status === 'approved').length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada riwayat booking</h3>
            <p className="text-gray-600 mb-6">
              Anda belum memiliki booking laboratorium.
            </p>
            {/* TOMBOL DIHAPUS - Booking sudah ada di halaman lain */}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card 
              key={booking._id} 
              className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Booking Image */}
                {booking.photo && booking.photo !== '/assets/images/lab_image.jpg' && (
                  <div className="w-full md:w-32 h-40 md:h-32 flex-shrink-0">
                    <img 
                      src={booking.photo}
                      alt={booking.activityTitle}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/assets/images/lab_image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )}
                
                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {booking.activityTitle}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {booking.lab?.name || 'Lab'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {booking.subject}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {booking.classGroup}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{booking.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{booking.lab?.location || 'Lokasi tidak tersedia'}</span>
                        </div>
                      </div>
                      
                      {booking.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {booking.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(booking.status)}
                      <div className="text-xs text-gray-500 text-right">
                        Dibuat: {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      ID: {booking._id}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openDetail(booking)}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ================= MODAL DETAIL ================= */}
      <Modal
        isOpen={showDetailModal}
        onClose={closeDetail}
        title={
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Detail Booking</span>
          </div>
        }
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Header with Status */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedBooking.activityTitle}</h3>
                <p className="text-gray-600">{selectedBooking.subject} • {selectedBooking.classGroup}</p>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            {/* Photo if exists */}
            {selectedBooking.photo && selectedBooking.photo !== '/assets/images/lab_image.jpg' && (
              <div>
                <img 
                  src={selectedBooking.photo}
                  alt={selectedBooking.activityTitle}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/assets/images/lab_image.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
            )}

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Laboratorium" value={selectedBooking.lab?.name} />
              <DetailItem label="Lokasi" value={selectedBooking.lab?.location} />
              <DetailItem label="Pengajar" value={selectedBooking.teacherName} />
              <DetailItem label="Mata Pelajaran" value={selectedBooking.subject} />
              <DetailItem label="Kelas" value={selectedBooking.classGroup} />
              <DetailItem label="Hari" value={selectedBooking.day} />
              <DetailItem label="Tanggal" value={formatDate(selectedBooking.bookingDate)} />
              <DetailItem label="Waktu" value={`${formatTime(selectedBooking.startTime)} - ${formatTime(selectedBooking.endTime)}`} />
            </div>

            {/* Description */}
            {selectedBooking.description && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Deskripsi Kegiatan</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedBooking.description}</p>
                </div>
              </div>
            )}

            {/* Meta Information */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <DetailItem label="ID Booking" value={selectedBooking._id} small />
              <DetailItem label="Tanggal Dibuat" value={new Date(selectedBooking.createdAt).toLocaleString('id-ID')} small />
              
              {selectedBooking.approvedAt && (
                <DetailItem label="Disetujui Pada" value={new Date(selectedBooking.approvedAt).toLocaleString('id-ID')} small />
              )}
              
              {selectedBooking.remarks && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Catatan</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800">{selectedBooking.remarks}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Helper Component for Detail Items
const DetailItem = ({ label, value, small = false }) => (
  <div>
    <h4 className={`font-medium ${small ? 'text-gray-500 text-sm' : 'text-gray-700'}`}>{label}</h4>
    <p className={`mt-1 ${small ? 'text-gray-600 text-sm' : 'text-gray-900'}`}>
      {value || <span className="text-gray-400">Tidak tersedia</span>}
    </p>
  </div>
);

export default BookingHistory;