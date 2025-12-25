
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFlask,
  /* FaHome, 
  FaCalendarAlt,
  FaNewspaper,
  FaQuoteLeft,
  FaPhone, */
  FaBars,
  FaTimes,
  /* FaSignInAlt,
  FaUserPlus, */
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt
} from 'react-icons/fa';
import AccountSettings from '../../common/AccountSettings';

const LandingPageLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [accountOpen, setAccountOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu
    }
  };




  return (
    <div className="min-h-screen flex flex-col">
      {/* ============ NAVIGATION ============ */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white shadow-lg py-2'
        : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">

            {/* ===== Logo ===== */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FaFlask className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  LabSchedule
                </span>
                <span className="block text-xs text-blue-600 font-medium">
                  Sistem Manajemen Lab
                </span>
              </div>
            </Link>


            {/* ===== Desktop Navigation ===== */}
            <div className="hidden lg:flex items-center space-x-10">
              <button
                onClick={() => scrollToSection('beranda')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Beranda
              </button>

              <button
                onClick={() => scrollToSection('jadwal')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Jadwal
              </button>

              <button
                onClick={() => scrollToSection('artikel')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Artikel
              </button>

              <button
                onClick={() => scrollToSection('testimoni')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Testimoni
              </button>

              <button
                onClick={() => scrollToSection('kontak')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Kontak
              </button>
            </div>


            {/* ===== Desktop Auth + Mobile Burger ===== */}
            <div className="flex items-center space-x-3">

              {/* ===== DESKTOP AUTH ONLY ===== */}
              {user ? (
                <>
                  <div className="hidden lg:flex items-center space-x-3 relative">
                    <button onClick={() => setAccountOpen(prev => !prev)} className="flex items-center space-x-3 focus:outline-none">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.role === 'admin' ? 'Administrator' : 'Pengguna'}
                        </p>
                      </div>
                    </button>

                    {accountOpen && (
                      <div className="absolute right-0 mt-14 w-44 bg-white shadow-lg rounded-lg p-1 z-50">
                        <button onClick={() => { setSettingsOpen(true); setAccountOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Account Settings</button>
                        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Logout</button>
                      </div>
                    )}
                  </div>

                  <AccountSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden lg:inline-flex px-5 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition"
                  >

                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="hidden lg:inline-flex px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >

                    Daftar
                  </Link>
                </>
              )}

              {/* ===== Burger Button (Tablet & Mobile) ===== */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* ===== MOBILE MENU ===== */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">

                <div className="space-y-2">
                  <button
                    onClick={() => scrollToSection('beranda')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Beranda
                  </button>

                  <button
                    onClick={() => scrollToSection('jadwal')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Jadwal
                  </button>

                  <button
                    onClick={() => scrollToSection('artikel')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Artikel
                  </button>

                  <button
                    onClick={() => scrollToSection('testimoni')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Testimoni
                  </button>

                  <button
                    onClick={() => scrollToSection('kontak')}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    Kontak
                  </button>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">

                  {user ? (
                    <>
                      <button onClick={() => { setSettingsOpen(true); setIsMenuOpen(false); }} className="block px-4 py-3 bg-blue-600 text-white rounded-lg text-center">
                        Account Settings
                      </button>

                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = '/';
                        }}
                        className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-center"
                      >
                        Login
                      </Link>

                      <Link
                        to="/signup"
                        className="block px-4 py-3 bg-blue-600 text-white rounded-lg text-center"
                      >
                        Daftar
                      </Link>
                    </>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </nav>


      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* ===== Company Info ===== */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <FaFlask className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">LabSchedule</h3>
                  <p className="text-gray-400 text-sm">
                    Sistem Manajemen Laboratorium
                  </p>
                </div>
              </div>

              <p className="text-gray-400 max-w-md mb-6">
                Platform terintegrasi untuk mengelola jadwal, booking, dan penggunaan
                laboratorium di institusi pendidikan secara efisien dan modern.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <FaYoutube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* ===== Contact Info (PINDAHAN) ===== */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-blue-400 mt-1" />
                  <span>
                    Gedung Laboratorium Lt. 3 <br />
                    Universitas Pendidikan Indonesia
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaPhoneAlt className="h-5 w-5 text-blue-400" />
                  <span>(021) 1234-5678</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaEnvelope className="h-5 w-5 text-blue-400" />
                  <span>labschedule@universitas.edu</span>
                </li>
              </ul>
            </div>

            {/* ===== Support / Info Singkat ===== */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Informasi</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Jam Operasional:</li>
                <li>Senin – Jumat</li>
                <li>08.00 – 17.00 WIB</li>
                <li className="pt-2 text-gray-500">
                  Respons email maksimal 1x24 jam kerja
                </li>
              </ul>
            </div>

          </div>

          {/* ===== Divider ===== */}
          <div className="border-t border-gray-800 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p className="mb-3 md:mb-0">
                &copy; {new Date().getFullYear()} LabSchedule. Hak Cipta Dilindungi.
              </p>
              <p>
                Dibuat dengan ❤️ untuk pendidikan Indonesia
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPageLayout;