import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { bookingAPI, labAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const BookingManagement = () => {
  // ================= STATE =================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('semua');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching booking data with lab populated...');
        
        // REQUEST 1: Fetch bookings dengan populate lab
        const bookingsResponse = await bookingAPI.getAll();
        
        let bookingsData = [];
        
        // Handle berbagai format response
        if (Array.isArray(bookingsResponse.data)) {
          bookingsData = bookingsResponse.data;
        } else if (bookingsResponse.data?.data && Array.isArray(bookingsResponse.data.data)) {
          bookingsData = bookingsResponse.data.data;
        } else if (bookingsResponse.data?.success && Array.isArray(bookingsResponse.data.data)) {
          bookingsData = bookingsResponse.data.data;
        } else {
          bookingsData = [];
        }
        
        console.log('📊 First booking data:', bookingsData[0]);
        console.log('🔍 Lab in booking data:', bookingsData[0]?.lab);
        
        // Transform data dengan akses lab object yang sudah dipopulate
        const transformedBookings = bookingsData.map(booking => {
          // Dapatkan data lab - bisa berupa object penuh atau hanya ID
          const labData = booking.lab || {};
          const isLabPopulated = labData && typeof labData === 'object' && labData.name;
          
          return {
            // ID & basic info
            _id: booking._id || booking.id,
            rawId: booking._id || booking.id,
            
            // Lab data - akses dari lab object yang sudah dipopulate
            lab: labData,
            labName: isLabPopulated 
              ? labData.name 
              : booking.labName || 'Lab tidak ditemukan',
            labLocation: isLabPopulated 
              ? labData.location 
              : booking.labLocation || 'Lokasi tidak tersedia',
            
            // User & booking info
            teacherName: booking.teacherName || booking.user?.name || 'Tidak ada nama',
            userEmail: booking.user?.email || '',
            subject: booking.subject || 'Tidak ada mata pelajaran',
            activityTitle: booking.activityTitle || booking.purpose || 'Tidak ada judul',
            description: booking.description || booking.remarks || '',
            bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString().split('T')[0] : '',
            day: booking.day || '',
            startTime: booking.startTime || '',
            endTime: booking.endTime || '',
            classGroup: booking.classGroup || 'Tidak ada kelas',
            status: booking.status || 'pending',
            remarks: booking.remarks || '',
            createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : '',
            approvedAt: booking.approvedAt || null,
            user: booking.user || null
          };
        });
        
        setBookings(transformedBookings);
        console.log(`✅ Loaded ${transformedBookings.length} bookings`);
        
        // REQUEST 2: Fetch labs sebagai fallback (optional)
        try {
          const labsResponse = await labAPI.getAll();
          console.log('📚 Labs loaded as fallback:', labsResponse.data?.length || 0);
        } catch (labErr) {
          console.log('⚠️ Could not load labs separately, using populated data only');
        }
        
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= HANDLERS =================
  const openDetail = (booking) => {
    setSelectedBooking(booking);
    setRemarks(booking.remarks || '');
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setSelectedBooking(null);
    setRemarks('');
    setShowDetailModal(false);
  };

  const updateBookingStatus = async (status) => {
    if (!selectedBooking) return;

    try {
      console.log('🔄 Updating booking status:', {
        bookingId: selectedBooking.rawId,
        status: status,
        remarks: remarks
      });

      // Gunakan endpoint update booking
      const response = await bookingAPI.update(selectedBooking.rawId, { 
        status, 
        remarks: remarks || undefined 
      });

      console.log('✅ Status updated successfully:', response.data);

      // Update local state - PERTAHANKAN data lab yang sudah ada
      setBookings(bookings.map(booking => 
        booking._id === selectedBooking._id 
          ? { 
              ...booking, 
              status,
              remarks: remarks || booking.remarks,
              approvedAt: status === 'approved' || status === 'rejected' 
                ? new Date().toISOString() 
                : booking.approvedAt
            } 
          : booking
      ));

      // Update selected booking in modal
      setSelectedBooking({
        ...selectedBooking,
        status,
        remarks: remarks || selectedBooking.remarks,
        approvedAt: status === 'approved' || status === 'rejected' 
          ? new Date().toISOString() 
          : selectedBooking.approvedAt
      });

      toast.success(`Booking berhasil di${status === 'approved' ? 'setujui' : 'tolak'}`);
      
      // Optionally close modal after success
      if (status === 'approved' || status === 'rejected') {
        setTimeout(() => {
          closeDetail();
        }, 1500);
      }

    } catch (err) {
      console.error('❌ Error updating status:', err);
      const errorMessage = err.response?.data?.message || 'Gagal mengupdate status booking';
      toast.error(errorMessage);
    }
  };

  const handleSendNote = async () => {
    if (!selectedBooking || !remarks.trim()) {
      toast.error('Catatan tidak boleh kosong');
      return;
    }

    try {
      console.log('📝 Sending note to booking:', selectedBooking.rawId);
      
      await bookingAPI.update(selectedBooking.rawId, { 
        remarks: remarks 
      });

      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === selectedBooking._id 
          ? { ...booking, remarks } 
          : booking
      ));

      // Update selected booking
      setSelectedBooking({
        ...selectedBooking,
        remarks
      });

      toast.success('Catatan berhasil dikirim');
      
    } catch (err) {
      console.error('❌ Error sending note:', err);
      toast.error('Gagal mengirim catatan');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Disetujui' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
      'completed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Selesai' },
      'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Dibatalkan' },
    };

    const config = statusConfig[status] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      label: status 
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
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

  // ================= FILTER BOOKINGS =================
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filter === 'semua' || booking.status === filter;
    const searchLower = searchTerm.toLowerCase();
    
    // Pencarian mencakup semua field termasuk lab name
    const matchesSearch = (
      (booking.teacherName || '').toLowerCase().includes(searchLower) ||
      (booking.activityTitle || '').toLowerCase().includes(searchLower) ||
      (booking.subject || '').toLowerCase().includes(searchLower) ||
      (booking.labName || '').toLowerCase().includes(searchLower) ||
      (booking.labLocation || '').toLowerCase().includes(searchLower)
    );

    return matchesStatus && matchesSearch;
  });

  // ================= STATS =================
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    today: bookings.filter(b => b.bookingDate === new Date().toISOString().split('T')[0]).length,
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Booking</h1>
          <p className="text-gray-600 mt-1">Memuat data booking...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Memuat data booking...</p>
        </div>
      </div>
    );
  }

  // ================= RENDER ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Booking</h1>
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

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - UI PERTAHANAN SAMA */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Booking</h1>
            <p className="text-gray-600 mt-1">
              Kelola semua permintaan booking laboratorium
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-lg border border-gray-200">
              <button
                onClick={() => setFilter('semua')}
                className={`px-4 py-2 text-sm font-medium ${filter === 'semua' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 text-sm font-medium border-l ${filter === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Menunggu
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 text-sm font-medium border-l ${filter === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Disetujui
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 text-sm font-medium border-l ${filter === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Ditolak
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Disetujui</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Ditolak</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.rejected}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Hari Ini</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{stats.today}</p>
          </div>
        </div>
      </div>

      {/* Search Bar - UI PERTAHANAN SAMA */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari booking berdasarkan nama guru, judul, lab, atau lokasi..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bookings List - UI PERTAHANAN SAMA */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filter !== 'semua' ? 'Booking tidak ditemukan' : 'Belum ada booking'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Coba dengan kata kunci pencarian yang berbeda.'
                : 'Belum ada permintaan booking yang diajukan.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card 
              key={booking._id} 
              className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Lab Icon */}
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                
                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {booking.activityTitle}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {booking.labName} {/* AKAN TERISI KARENA POPULATE */}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{booking.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{booking.labLocation} {/* AKAN TERISI KARENA POPULATE */}</span>
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
                        Diajukan: {booking.createdAt}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      ID: {booking._id?.substring(0, 8)}...
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openDetail(booking)}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Detail & Aksi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ================= MODAL DETAIL ================= */}
      {/* UI MODAL PERTAHANAN SAMA DENGAN ACTION APPROVE/REJECT */}
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
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedBooking.activityTitle}</h3>
                <p className="text-gray-600">{selectedBooking.subject} • {selectedBooking.classGroup}</p>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Laboratorium" value={selectedBooking.labName} />
              <DetailItem label="Lokasi" value={selectedBooking.labLocation} />
              <DetailItem label="Pengajar" value={selectedBooking.teacherName} />
              <DetailItem label="Email" value={selectedBooking.userEmail} small />
              <DetailItem label="Mata Pelajaran" value={selectedBooking.subject} />
              <DetailItem label="Kelas" value={selectedBooking.classGroup} />
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

            {/* Admin Notes Section - SAMA DENGAN SEBELUMNYA */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Catatan Admin</h4>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Tulis catatan untuk guru (alasan persetujuan/penolakan, instruksi, dll)..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              
              {selectedBooking.remarks && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-600 mb-1">Catatan Sebelumnya:</h5>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-yellow-800 text-sm">{selectedBooking.remarks}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - SAMA DENGAN SEBELUMNYA */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Status Saat Ini</h4>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.status === 'pending' && 'Booking menunggu persetujuan'}
                    {selectedBooking.status === 'approved' && 'Booking telah disetujui'}
                    {selectedBooking.status === 'rejected' && 'Booking telah ditolak'}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="font-medium text-gray-700 mb-2">Tanggal Diajukan</h4>
                  <p className="text-sm text-gray-600">{selectedBooking.createdAt}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleSendNote}
                  disabled={!remarks.trim()}
                  className="flex-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Kirim Catatan
                </Button>
                
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => updateBookingStatus('approved')}
                      variant="success"
                      className="flex-1"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Setujui Booking
                    </Button>
                    
                    <Button
                      onClick={() => updateBookingStatus('rejected')}
                      variant="danger"
                      className="flex-1"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Tolak Booking
                    </Button>
                  </>
                )}
              </div>
              
              {/* Completed or Rejected Status Info */}
              {(selectedBooking.status === 'approved' || selectedBooking.status === 'rejected') && selectedBooking.approvedAt && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Booking ini telah {selectedBooking.status === 'approved' ? 'disetujui' : 'ditolak'} pada{' '}
                    {new Date(selectedBooking.approvedAt).toLocaleString('id-ID')}
                  </p>
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

export default BookingManagement;