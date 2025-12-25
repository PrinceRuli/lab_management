
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FaCalendarAlt,
  /* FaFlask, */
  FaNewspaper,
  FaQuoteLeft,
  FaPhone,
  /* FaMapMarkerAlt,
  FaEnvelope,
  FaClock, */
  /* FaChalkboardTeacher, */
  FaStar,
  FaArrowRight,
  // FaUserTie Alternatif untuk pengajar
} from 'react-icons/fa';
import labImage from '../../assets/images/lab_image.jpg';
import hubKami from '../../assets/images/hubungi_kami.jpg';

const LandingPage = () => {
  // Schedule Data
  const labSchedules = [
    {
      id: 1,
      nama: "Dr. Ahmad Santoso, M.Kom",
      mapel: "Pemrograman Web",
      foto: labImage,
      judulKegiatan: "Praktikum React JS",
      status: "active",
      deskripsi: "Praktikum pengembangan antarmuka web menggunakan React dan state management.",
      hari: "Senin",
      jam: "08:00 - 10:00",
    },
    {
      id: 2,
      nama: "Dr. Sri Rahayu, M.Si",
      mapel: "Biologi Molekuler",
      foto: labImage,
      judulKegiatan: "Eksperimen DNA",
      status: "active",
      deskripsi: "Eksperimen analisis struktur DNA menggunakan mikroskop digital.",
      hari: "Selasa",
      jam: "13:00 - 15:00",
    },
    {
      id: 3,
      nama: "Prof. Budi Setiawan, Ph.D",
      mapel: "Kimia Analitik",
      foto: labImage,
      judulKegiatan: "Analisis Senyawa",
      status: "available",
      deskripsi: "Pengujian senyawa kimia dengan metode titrasi dan spektrofotometri.",
      hari: "Rabu",
      jam: "10:00 - 12:00",
    },
    {
      id: 4,
      nama: "Dr. Rita Wijaya, M.T",
      mapel: "Fisika Modern",
      foto: labImage,
      judulKegiatan: "Eksperimen Gelombang",
      status: "active",
      deskripsi: "Praktikum konsep gelombang elektromagnetik dan aplikasinya.",
      hari: "Kamis",
      jam: "09:00 - 11:00",
    },
    {
      id: 5,
      nama: "Andi Pratama, M.Kom",
      mapel: "Jaringan Komputer",
      foto: labImage,
      judulKegiatan: "Simulasi Jaringan",
      status: "available",
      deskripsi: "Simulasi topologi jaringan menggunakan Cisco Packet Tracer.",
      hari: "Jumat",
      jam: "13:00 - 15:00",
    },
  ];


  // Articles Data
  const articles = [
    {
      id: 1,
      title: 'Tips Optimalisasi Penggunaan Laboratorium',
      excerpt: 'Pelajari cara mengoptimalkan penggunaan laboratorium untuk meningkatkan efisiensi pembelajaran...',
      category: 'Tips & Trik',
      date: '15 Des 2024',
      readTime: '5 min read',
      image: 'article1'
    },
    {
      id: 2,
      title: 'Teknologi Terbaru dalam Laboratorium Pendidikan',
      excerpt: 'Eksplorasi teknologi terbaru yang dapat diterapkan di laboratorium pendidikan untuk meningkatkan kualitas pembelajaran...',
      category: 'Teknologi',
      date: '12 Des 2024',
      readTime: '8 min read',
      image: 'article2'
    },
    {
      id: 3,
      title: 'Manajemen Keamanan di Laboratorium',
      excerpt: 'Panduan lengkap untuk menjaga keamanan dan keselamatan di lingkungan laboratorium...',
      category: 'Keamanan',
      date: '10 Des 2024',
      readTime: '6 min read',
      image: 'article3'
    },
  ];

  // Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Ahmad Santoso',
      role: 'Kepala Lab Komputer',
      text: 'Sistem ini sangat membantu dalam mengelola jadwal penggunaan lab. Efisiensi meningkat 40% sejak kami mengimplementasikannya.',
      rating: 5,
      avatar: 'AS'
    },
    {
      id: 2,
      name: 'Prof. Sri Rahayu',
      role: 'Dosen Biologi',
      text: 'Pengalaman booking yang sangat mudah dan cepat. Tidak ada lagi konflik jadwal antara dosen.',
      rating: 5,
      avatar: 'SR'
    },
    {
      id: 3,
      name: 'Budi Setiawan',
      role: 'Mahasiswa Teknik',
      text: 'Sebagai mahasiswa, saya bisa dengan mudah melihat jadwal lab yang tersedia untuk praktikum.',
      rating: 4,
      avatar: 'BS'
    },
  ];

  const [current, setCurrent] = useState(0);
  const [flippedId, setFlippedId] = useState(null);

  const toggleFlip = (id) => {
    setFlippedId((prev) => (prev===id ? null : id));
  };




  return (
    <div className="scroll-smooth">
      {/* ============ HERO SECTION ============ */}
      <section
        id="beranda"
        className="relative py-24 overflow-hidden"
      >
        {/* === Background Image === */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${labImage})` }}
        />

        {/* === Gradient Overlay === */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />

        {/* === Content === */}
        <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              Sistem Laboratorium Terintegrasi
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Kelola Laboratorium <br />
              <span className="text-blue-600">Lebih Mudah & Efisien</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-xl">
              Manajemen jadwal, booking, dan penggunaan lab dalam satu sistem modern.
            </p>

            {/* BUTTONS (FIXED SIZE) */}
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-3 text-sm font-medium bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
              >
                Mulai Sekarang
              </Link>

              <Link
                to="/signup"
                className="px-6 py-3 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Demo Sistem
              </Link>
            </div>
          </div>

          {/* RIGHT (kosong → biar gambar background terlihat) */}
          <div className="hidden md:block" />

        </div>
      </section>



      {/* ============ SCHEDULE SECTION ============ */}
      <section id="jadwal" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">

          {/* ===== Section Header ===== */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              <FaCalendarAlt className="mr-2" />
              Jadwal Laboratorium
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jadwal Penggunaan Laboratorium
            </h2>

            <p className="text-lg text-gray-600">
              Pantau ketersediaan dan jadwal penggunaan laboratorium secara
              real-time untuk mendukung kegiatan belajar mengajar.
            </p>
          </div>

          {/* ===== Schedule Cards ===== */}

          <div className="relative max-w-6xl mx-auto">

            {/* LEFT ARROW */}
            <button
              onClick={() =>
                setCurrent(current === 0 ? labSchedules.length - 1 : current - 1)
              }
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center"
            >
              ‹
            </button>

            {/* SLIDER */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${current * 320}px)` }}
              >
                {labSchedules.map((item, index) => (
                  <div
                    key={item.id}
                    className={`w-72 mx-4 flex-shrink-0 transition-all duration-300 ${index === current
                        ? "scale-100 opacity-100"
                        : "scale-[0.97] opacity-70"
                      }`}
                  >
                    {/* ================= FLIP CARD ================= */}
                    <div
                      onClick={() => toggleFlip(item.id)}
                      className="h-96 perspective cursor-pointer"
                    >
                      <div
                        className={`relative w-full h-full duration-700 transform-style-preserve-3d ${flippedId === item.id ? "rotate-y-180" : ""
                          }`}
                      >
                        {/* FRONT */}
                        <div className="absolute inset-0 rounded-2xl shadow-xl backface-hidden overflow-hidden">
                          <img
                            src={item.foto}
                            alt={item.nama}
                            className="w-full h-44 object-cover"
                          />

                          <div className="p-5 text-center">
                            <h3 className="text-lg font-bold">{item.nama}</h3>
                            <p className="text-sm text-blue-600">{item.mapel}</p>
                          </div>
                        </div>

                        {/* BACK */}
                        <div className="absolute inset-0 bg-blue-600 text-white rounded-2xl shadow-xl rotate-y-180 backface-hidden p-5 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {item.judulKegiatan}
                            </h3>
                            <p className="text-sm opacity-90">
                              {item.deskripsi}
                            </p>
                          </div>
                          <div className="text-sm border-t border-white/30 pt-3">
                            <p>{item.hari}</p>
                            <p>{item.jam}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ================= END FLIP ================= */}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button
              onClick={() =>
                setCurrent(current === labSchedules.length - 1 ? 0 : current + 1)
              }
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center"
            >
              ›
            </button>

            {/* DOTS */}
            <div className="flex justify-center mt-6 gap-2">
              {labSchedules.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${i === current ? "bg-blue-600" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ============ ARTICLES SECTION ============ */}
      <section id="artikel" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">

          {/* ===== Section Header ===== */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              <FaNewspaper className="mr-2" />
              Artikel & Berita
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Insight & Artikel Terbaru
            </h2>

            <p className="text-lg text-gray-600">
              Update informasi, tips, dan wawasan terbaru seputar pengelolaan
              laboratorium pendidikan modern.
            </p>
          </div>

          {/* ===== Article Cards ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
              >
                {/* Image / Thumbnail */}
                <div className="h-52 bg-gray-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <FaNewspaper className="h-14 w-14 text-blue-500 opacity-70" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-400">
                      {article.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {article.readTime}
                    </span>

                    <Link
                      to="#"
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                    >
                      Baca Artikel
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== CTA ===== */}
          <div className="text-center mt-16">
            <Link
              to="/artikel"
              className="inline-flex items-center px-8 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Lihat Semua Artikel
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

        </div>
      </section>


      {/* ============ TESTIMONIALS SECTION ============ */}
      <section id="testimoni" className="py-24 bg-white">
        <div className="container mx-auto px-6">

          {/* ===== Section Header ===== */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium mb-4">
              <FaQuoteLeft className="mr-2" />
              Testimoni Pengguna
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dipercaya Banyak Pengguna
            </h2>

            <p className="text-lg text-gray-600">
              Pengalaman nyata dosen, pengelola, dan mahasiswa menggunakan sistem kami.
            </p>
          </div>

          {/* ===== Testimonials ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition duration-300"
              >
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 leading-relaxed mb-6 break-words">
                  “{testimonial.text}”
                </p>

                {/* User */}
                <div className="flex items-center">
                  <div className="min-w-12 min-h-12w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold mr-4">
                    {testimonial.avatar}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ============ CONTACT SECTION ============ */}
      <section id="kontak" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">

          {/* ===== Section Header ===== */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              <FaPhone className="mr-2" />
              Hubungi Kami
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kami Siap Membantu Anda
            </h2>

            <p className="text-lg text-gray-600">
              Punya pertanyaan atau ingin demo sistem? Tim kami akan segera merespons.
            </p>
          </div>

          {/* ===== Content ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ===== Illustration ===== */}
            <div className="flex flex-col justify-center items-center text-center bg-white rounded-3xl p-10 shadow-sm">

              <img
                src={hubKami}
                alt="Contact Illustration"
                className="w-full rounded-3xl max-w-sm mb-8"
              />

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Butuh Bantuan?
              </h3>

              <p className="text-gray-600 max-w-md">
                Tim kami siap membantu menjawab pertanyaan, memberikan demo sistem,
                atau mendukung kebutuhan laboratorium Anda.
              </p>

              <div className="mt-6 text-sm text-gray-500">
                ⏱ Respon cepat pada jam kerja
              </div>

            </div>


            {/* ===== Contact Form ===== */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-8">
                Kirim Pesan
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Subjek"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <textarea
                  rows="5"
                  placeholder="Tulis pesan Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
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