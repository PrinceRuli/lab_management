import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { bookingAPI } from '../../services/api';

const MySchedule = () => {
  // ================= STATE =================
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed


  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching schedule data...');
        
        // Fetch approved bookings as schedule
        const bookingsResponse = await bookingAPI.getMyBookings();
        const approvedBookings = Array.isArray(bookingsResponse.data) 
          ? bookingsResponse.data.filter(b => b.status === 'approved')
          : [];
        
        // Transform bookings to schedule format
        const transformedSchedules = approvedBookings.map(booking => ({
          _id: booking._id,
          activityTitle: booking.activityTitle,
          subject: booking.subject,
          classGroup: booking.classGroup,
          teacherName: booking.teacherName,
          labName: booking.lab?.name || 'Lab',
          labLocation: booking.lab?.location || 'Lokasi',
          bookingDate: booking.bookingDate,
          day: booking.day,
          startTime: booking.startTime,
          endTime: booking.endTime,
          description: booking.description,
          status: 'upcoming', // Schedule status
          photo: booking.photo || '/assets/images/lab_image.jpg',
          type: 'Praktikum',
          students: booking.classGroup ? parseInt(booking.classGroup.split(' ')[1]) * 10 || 30 : 30
        }));
        
        setSchedules(transformedSchedules);
        
        
      } catch (err) {
        console.error('❌ Error fetching schedule:', err);
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Sesi telah berakhir. Silakan login kembali.');
            setTimeout(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }, 2000);
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

    fetchScheduleData();
  }, []);

  // ================= HANDLERS =================
  const openDetail = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setSelectedSchedule(null);
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

  const getTypeBadge = (type) => {
    const typeConfig = {
      praktikum: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Praktikum' },
      teori: { bg: 'bg-green-100', text: 'text-green-800', label: 'Teori' },
      seminar: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Seminar' },
      workshop: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Workshop' },
    };

    const config = typeConfig[type?.toLowerCase()] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      label: type || 'Kegiatan'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // ================= FILTER SCHEDULES =================
  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      const scheduleDate = new Date(schedule.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return scheduleDate >= today;
    }
    if (filter === 'completed') {
      const scheduleDate = new Date(schedule.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return scheduleDate < today;
    }
    return true;
  });

  // ================= STATS =================
  const stats = {
    total: schedules.length,
    upcoming: schedules.filter(s => {
      const scheduleDate = new Date(s.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return scheduleDate >= today;
    }).length,
    completed: schedules.filter(s => {
      const scheduleDate = new Date(s.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return scheduleDate < today;
    }).length,
    thisWeek: schedules.filter(s => {
      const scheduleDate = new Date(s.bookingDate);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    }).length
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Mengajar Saya</h1>
          <p className="text-gray-600 mt-1">Memuat data jadwal...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Sedang memuat data jadwal...</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Mengajar Saya</h1>
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
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Mengajar Saya</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-gray-600 mt-1">
              Susunan jadwal praktikum laboratorium
            </p>
            <div className="mt-3 md:mt-0">
              <div className="inline-flex rounded-lg border border-gray-200">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium ${filter === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 text-sm font-medium border-l ${filter === 'upcoming' ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Akan Datang
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 text-sm font-medium border-l ${filter === 'completed' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Jadwal</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Akan Datang</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.upcoming}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Selesai</p>
            <p className="text-2xl font-bold text-gray-700 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Minggu Ini</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{stats.thisWeek}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'upcoming' ? 'Tidak ada jadwal akan datang' : 
               filter === 'completed' ? 'Tidak ada jadwal selesai' : 
               'Belum ada jadwal'}
            </h3>
            <p className="text-gray-600">
              {filter === 'upcoming' ? 'Tidak ada jadwal mengajar yang akan datang.' : 
               filter === 'completed' ? 'Belum ada jadwal mengajar yang selesai.' : 
               'Belum ada jadwal mengajar yang disetujui.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <Card 
              key={schedule._id} 
              className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Schedule Image */}
                {/* {schedule.photo && (
                  <div className="w-full md:w-32 h-40 md:h-32 flex-shrink-0">
                    <img 
                      src={schedule.photo}
                      alt={schedule.activityTitle}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/assets/images/lab_image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )} */}
                
                {/* Schedule Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {schedule.activityTitle}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {schedule.subject}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {schedule.classGroup}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {schedule.labName}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(schedule.bookingDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{schedule.labLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{schedule.teacherName}</span>
                        </div>
                      </div>
                      
                      {schedule.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {schedule.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      {getTypeBadge(schedule.type)}
                      <div className="text-xs text-gray-500 text-right">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v3.5m0 0h-12m12 0h-12" />
                          </svg>
                          <span>{schedule.students || '30'} siswa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(schedule.bookingDate) >= new Date().setHours(0, 0, 0, 0) ? (
                        <span className="flex items-center text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Akan Datang
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Selesai
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openDetail(schedule)}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Detail Jadwal
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
            <span>Detail Jadwal Mengajar</span>
          </div>
        }
        size="lg"
      >
        {selectedSchedule && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedSchedule.activityTitle}</h3>
              <p className="text-gray-600">{selectedSchedule.subject} • {selectedSchedule.classGroup}</p>
            </div>

            {/* Photo if exists */}
            {selectedSchedule.photo && (
              <div>
                <img 
                  src={selectedSchedule.photo}
                  alt={selectedSchedule.activityTitle}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/assets/images/lab_image.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
            )}

            {/* Schedule Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Mata Pelajaran" value={selectedSchedule.subject} />
              <DetailItem label="Kegiatan" value={selectedSchedule.activityTitle} />
              <DetailItem label="Kelas" value={selectedSchedule.classGroup} />
              <DetailItem label="Pengajar" value={selectedSchedule.teacherName} />
              <DetailItem label="Laboratorium" value={selectedSchedule.labName} />
              <DetailItem label="Lokasi" value={selectedSchedule.labLocation} />
              <DetailItem label="Tanggal" value={formatDate(selectedSchedule.bookingDate)} />
              <DetailItem label="Waktu" value={`${formatTime(selectedSchedule.startTime)} - ${formatTime(selectedSchedule.endTime)}`} />
              <DetailItem label="Tipe" value={selectedSchedule.type} />
              <DetailItem label="Jumlah Siswa" value={`${selectedSchedule.students || '30'} siswa`} />
            </div>

            {/* Description */}
            {selectedSchedule.description && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Deskripsi Kegiatan</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedSchedule.description}</p>
                </div>
              </div>
            )}

            {/* Status Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Status</h4>
                  {new Date(selectedSchedule.bookingDate) >= new Date().setHours(0, 0, 0, 0) ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Akan Datang
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Selesai
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <h4 className="font-medium text-gray-700 mb-2">Durasi</h4>
                  <p className="text-gray-600">
                    {(() => {
                      const [sh, sm] = selectedSchedule.startTime.split(':').map(Number);
                      const [eh, em] = selectedSchedule.endTime.split(':').map(Number);
                      const duration = (eh * 60 + em) - (sh * 60 + sm);
                      return `${Math.floor(duration / 60)} jam ${duration % 60} menit`;
                    })()}
                  </p>
                </div>
              </div>
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

export default MySchedule;