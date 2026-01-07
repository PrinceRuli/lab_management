import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaNewspaper,
  FaQuoteLeft,
  FaPhone,
  FaStar,
  FaArrowRight,
  FaExclamationTriangle,
  FaSpinner,
  FaBook,
  FaClock,
  FaUsers,
  FaBuilding,
  FaGraduationCap,
  FaFlask,
  FaMicroscope,
  FaSync
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../../services/api';
import labImage from '../../assets/images/lab_image.jpg';
import contactImage from '../../assets/images/hubungi_kami.jpg';
import artikel1 from '../../assets/images/image1.jpg';
import artikel2 from '../../assets/images/image2.jpg';
import artikel3 from '../../assets/images/image3.jpg';


const LandingPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Data Testimoni
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Steven Elephant',
      role: 'Koordinator Lab Komputer',
      text: 'Sistem ini sangat membantu dalam mengelola jadwal penggunaan lab. Produktivitas meningkat 40% sejak kami mengimplementasikannya.',
      rating: 5,
      avatar: 'SE'
    },
    {
      id: 2,
      name: 'Prof. Sarah Johnson',
      role: 'Dosen Biologi',
      text: 'Pengalaman booking yang sangat mudah dan cepat. Tidak ada lagi konflik jadwal antar dosen.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Mahasiswa Teknik',
      text: 'Sebagai mahasiswa, saya bisa dengan mudah melihat jadwal lab yang tersedia untuk praktikum.',
      rating: 4,
      avatar: 'MC'
    },
  ];

  // Data Artikel
  const articles = [
    {
      id: 1,
      title: 'Tips Optimalisasi Penggunaan Laboratorium',
      excerpt: 'Pelajari cara mengoptimalkan penggunaan laboratorium untuk meningkatkan efisiensi pembelajaran dan pemanfaatan sumber daya...',
      category: 'Tips & Trik',
      image: artikel1,
      date: '15 Des 2024',
      readTime: '5 menit',
    },
    {
      id: 2,
      title: 'Teknologi Terbaru dalam Laboratorium Pendidikan',
      excerpt: 'Jelajahi teknologi terbaru yang dapat diterapkan di laboratorium pendidikan untuk meningkatkan kualitas pembelajaran...',
      category: 'Teknologi',
      image: artikel2,
      date: '12 Des 2024',
      readTime: '8 menit',
    },
    {
      id: 3,
      title: 'Manajemen Keamanan di Laboratorium',
      excerpt: 'Panduan lengkap untuk menjaga keselamatan dan keamanan di lingkungan laboratorium...',
      category: 'Keamanan',
      image: artikel3,
      date: '10 Des 2024',
      readTime: '6 menit',
    },
  ];

  // ================= FETCH APPROVED SCHEDULES =================
  // ================= FETCH APPROVED SCHEDULES =================
  const fetchApprovedSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Endpoint sudah benar
      const response = await bookingAPI.getApprovedSchedules();

      console.log('🔍 Full API Response:', response.data);

      // Backend mengembalikan: { success: true, data: [...] }
      let schedulesData = response.data.data || [];

      console.log('📊 Schedules data:', schedulesData);
      console.log('🏢 First schedule lab:', schedulesData[0]?.lab);

      // PROSES DATA DENGAN BENAR
      const processedSchedules = schedulesData.map((schedule) => {
        // DEBUG: Lihat struktur schedule
        console.log('📝 Processing schedule:', {
          id: schedule._id,
          labField: schedule.lab,
          labName: schedule.lab, // Ini sudah string "Lab Komputer 2"
          labDetails: schedule.labDetails,
          activityTitle: schedule.activityTitle
        });

        // Nama lab sudah ada di schedule.lab (string)
        // Dari backend: lab: schedule.lab?.name || 'Laboratory'
        const labName = schedule.lab || 'Laboratorium';

        // Format tanggal
        const bookingDate = schedule.rawDate ? new Date(schedule.rawDate) : null;

        // Format waktu
        const startTime = schedule.startTime || '';
        const displayTime = formatDisplayTime(startTime);

        // Durasi
        const durationHours = schedule.durationHours || 2;
        const endTime = schedule.endTime || calculateEndTime(startTime, durationHours);

        return {
          _id: schedule._id,
          teacherName: schedule.teacherName || schedule.teacher || 'Pengajar',
          subject: schedule.subject || 'Mata Pelajaran',
          activityTitle: schedule.activityTitle || 'Kegiatan Laboratorium',
          lab: labName, // <-- INI SUDAH NAMA LAB YANG BENAR
          labLocation: schedule.labDetails?.location || '',
          classGroup: schedule.classGroup || 'Kelas',
          bookingDate,
          startTime,
          displayTime,
          endTime,
          durationHours,
          status: 'approved'
        };
      });

      console.log('✅ Processed schedules:', processedSchedules);
      setSchedules(processedSchedules);

    } catch (err) {
      console.error('❌ Error fetching approved schedules:', err);
      const errorMsg = err.response?.data?.message || 'Gagal memuat jadwal';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Process schedule data untuk display - DIUBAH


  // Format waktu untuk display
  const formatDisplayTime = (time) => {
    if (!time) return 'Waktu tidak tersedia';
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return 'Waktu tidak valid';
    }
  };

  // Calculate end time
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

  // Get icon berdasarkan mata pelajaran
  const getSubjectIcon = (subject) => {
    if (!subject) return <FaBook className="h-4 w-4 text-gray-500" />;
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('kimia') || lowerSubject.includes('biologi')) {
      return <FaFlask className="h-4 w-4 text-blue-500" />;
    }
    if (lowerSubject.includes('fisika') || lowerSubject.includes('sains')) {
      return <FaMicroscope className="h-4 w-4 text-purple-500" />;
    }
    if (lowerSubject.includes('komputer') || lowerSubject.includes('tik')) {
      return <FaGraduationCap className="h-4 w-4 text-green-500" />;
    }
    return <FaBook className="h-4 w-4 text-gray-500" />;
  };

  // Get avatar color berdasarkan nama
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  // Get initials dari nama
  const getInitials = (name) => {
    if (!name || name === 'Pengajar') return 'PG';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get visible schedules untuk slide saat ini
  const getVisibleSchedules = () => {
    if (schedules.length === 0) return [];
    const startIndex = currentSlide * 3;
    const endIndex = startIndex + 3;
    return schedules.slice(startIndex, endIndex);
  };

  // Format date untuk display
  const formatDisplayDate = (date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Tanggal tidak tersedia';
    }
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
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

  // Auto slide untuk schedule
  useEffect(() => {
    if (schedules.length === 0) return;
    const interval = setInterval(() => {
      const totalSlides = Math.ceil(schedules.length / 3);
      setCurrentSlide((prev) =>
        prev === totalSlides - 1 ? 0 : prev + 1
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [schedules]);

  // Auto slide untuk testimoni
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Fetch data saat komponen dimuat - DIUBAH dengan proper cleanup
  useEffect(() => {
    fetchApprovedSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial(prev =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Loading skeleton
  const ScheduleSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-5/6"></div>
          <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyScheduleState = () => (
    <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-white rounded-3xl border-2 border-dashed border-blue-200">
      <div className="inline-block p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
          <FaCalendarAlt className="h-12 w-12 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Belum Ada Jadwal yang Disetujui
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
          Saat ini belum ada jadwal laboratorium yang telah disetujui.
        </p>
        <button
          onClick={fetchApprovedSchedules}
          disabled={loading}
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <FaSync className={`mr-3 ${loading ? 'animate-spin' : ''}`} />
          Coba Lagi
        </button>
      </div>
    </div>
  );

  // Error state
  const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-16 bg-gradient-to-br from-red-50 to-white rounded-3xl border-2 border-red-200">
      <div className="inline-block p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center">
          <FaExclamationTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Gagal Memuat Data
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          {message}
        </p>
        <button
          onClick={onRetry}
          disabled={loading}
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <FaSpinner className={`mr-3 ${loading ? 'animate-spin' : ''}`} />
          Coba Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="scroll-smooth">
      {/* ============ HERO SECTION ============ */}
      <section id="beranda" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={labImage}
            alt="Laboratorium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Sistem Laboratorium Terintegrasi
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Kelola Laboratorium <br />
                <span className="text-blue-600">Lebih Mudah & Efisien</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl">
                Manajemen jadwal, booking, dan penggunaan lab dalam satu sistem modern yang intuitif.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-center"
                >
                  Mulai Kuy
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-4 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 font-medium text-center"
                >
                  Regis lah
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ JADWAL SECTION ============ */}
      <section id="jadwal" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold">
              <FaCalendarAlt className="h-5 w-5" />
              Jadwal Laboratorium
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sesi Laboratorium
            </h2>

            <p className="text-xl text-gray-600">
              Daftar jadwal sesi laboratorium yang akan menemani kamu.
            </p>
          </div>

          {/* Loading State */}
          {loading && !error && (
            <div className="mb-12">
              <ScheduleSkeleton />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mb-12">
              <ErrorState message={error} onRetry={fetchApprovedSchedules} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && schedules.length === 0 && (
            <div className="mb-12">
              <EmptyScheduleState />
            </div>
          )}

          {/* Success State - Grid Jadwal */}
          {!loading && !error && schedules.length > 0 && (
            <>
              <div className="relative mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getVisibleSchedules().map((schedule, index) => (
                    <div
                      key={schedule._id || index}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-blue-300"
                    >
                      <div className="p-6 pb-4">
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                            {getSubjectIcon(schedule.subject)}
                            <span className="truncate">{schedule.subject}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                            {schedule.activityTitle}
                          </h3>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-gray-700 mb-2">
                            <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-gray-900">
                              {formatDisplayDate(schedule.bookingDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FaClock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">
                              {schedule.displayTime} - {schedule.endTime}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({schedule.durationHours} jam)
                            </span>
                          </div>
                        </div>

                        {/* INFO LAB - INI YANG DIPERBAIKI */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <FaUsers className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {schedule.classGroup}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaBuilding className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {schedule.lab} {/* NAMA LAB DARI DATABASE */}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(schedule.teacherName)}`}>
                            {getInitials(schedule.teacherName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {schedule.teacherName}
                            </p>
                            <p className="text-sm text-gray-500">Pengajar</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {schedules.length > 3 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {[...Array(Math.ceil(schedules.length / 3))].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-8 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                          ? 'bg-blue-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center">
                <Link
                  to="/schedules"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Lihat Semua Jadwal
                  <FaArrowRight className="ml-3" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============ ARTIKEL SECTION ============ */}
      <section id="artikel" className="py-20 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
              <FaNewspaper className="h-5 w-5" />
              Artikel & Berita Terbaru
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wawasan & Pembaruan
              </span>
            </h2>

            <p className="text-xl text-gray-600">
              Tetap terinformasi dengan tips, berita, dan wawasan terbaru tentang manajemen laboratorium modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-purple-300 hover:-translate-y-2"
              >
                {/* Gambar dengan efek overlay */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Badge kategori di atas gambar */}
                  <div className="absolute top-5 left-5 z-20">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-purple-700 text-sm font-bold rounded-full shadow-lg">
                      {article.category}
                    </span>
                  </div>

                  {/* Overlay gradient di bawah */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Konten artikel */}
                <div className="p-7">
                  {/* Metadata */}
                  <div className="flex items-center gap-4 mb-5 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-purple-500" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4 text-pink-500" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Judul */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300 leading-tight">
                    {article.title}
                  </h3>

                  {/* Ringkasan */}
                  <p className="text-gray-600 mb-7 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Tombol Baca */}
                  <div className="pt-5 border-t border-gray-100">
                    <Link
                      to={`/artikel/${article.id}`}
                      className="inline-flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-semibold rounded-xl hover:from-purple-100 hover:to-pink-100 hover:text-purple-800 transition-all duration-300 group/btn"
                    >
                      <span>Baca Artikel Lengkap</span>
                      <FaArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Tombol Lihat Semua */}
          <div className="text-center mt-16">
            <Link
              to="/artikel"
              className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <FaNewspaper className="mr-3" />
              Jelajahi Semua Artikel
              <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONI SECTION ============ */}
      <section id="testimoni" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-semibold">
              <FaQuoteLeft className="h-5 w-5" />
              Testimoni Pengguna
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Dipercaya oleh Profesional
            </h2>

            <p className="text-xl text-gray-600">
              Pengalaman nyata dari dosen, administrator, dan mahasiswa menggunakan sistem kami.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-200">
              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/3 text-center lg:text-left">
                    <div className="w-32 h-32 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-4xl font-bold text-yellow-700 mb-6">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="flex justify-center lg:justify-start mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>

                  <div className="lg:w-2/3">
                    <div className="relative">
                      <FaQuoteLeft className="absolute -top-4 -left-4 h-12 w-12 text-yellow-100 opacity-50" />
                      <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed pl-8">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                prevTestimonial();
              }}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-2xl w-14 h-14 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
            >
              ‹
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                nextTestimonial();
              }}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-2xl w-14 h-14 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
            >
              ›
            </button>

            <div className="flex justify-center mt-12 gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentTestimonial(i);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentTestimonial
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ KONTAK SECTION ============ */}
      <section id="kontak" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold">
              <FaPhone className="h-5 w-5" />
              Hubungi Kami
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kami Siap Membantu Anda
            </h2>

            <p className="text-xl text-gray-600">
              Punya pertanyaan atau ingin demo sistem? Tim kami akan segera merespons.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20"></div>
                <img
                  src={contactImage}
                  alt="Ilustrasi Hubungi Kami"
                  className="relative rounded-3xl shadow-2xl w-full"
                />
              </div>

              <div className="mt-12 space-y-6 max-w-md">
                <h3 className="text-3xl font-bold text-gray-900">
                  Butuh Bantuan?
                </h3>
                <p className="text-lg text-gray-600">
                  Tim kami siap menjawab pertanyaan Anda, memberikan demo sistem,
                  atau mendukung kebutuhan manajemen laboratorium Anda.
                </p>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaClock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Respon Cepat</p>
                    <p className="text-sm">Pada jam kerja</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Kirim Pesan kepada Kami
              </h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama Anda"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      placeholder="Masukkan email Anda"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    placeholder="Tentang apa ini?"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Ketik pesan Anda di sini..."
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;