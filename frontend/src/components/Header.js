import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Pastikan ini ada

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollToFooter = () => {
    const footer = document.getElementById('footer-contact');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      const labsSection = document.getElementById('labs');
      if (labsSection) {
        labsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold gradient-text">LABSCHEDULE</span>
          </div>

          {/* Navigation Links - Center Position */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="#home" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Home
            </a>
            <a href="#features" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#labs" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Laboratories
            </a>
            <button 
              onClick={scrollToFooter}
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Contact
            </button>
          </div>

          {/* Action Buttons & Search */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden sm:flex">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laboratories..."
                  className="w-48 lg:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-600 transition-colors duration-200"
                >
                  🔍
                </button>
              </div>
            </form>

            {/* Login Button - Link ke Login Page */}
            <Link to="/login" className="btn-secondary">
              Login
            </Link>

            {/* Register Button - Link ke Register Page */}
            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden mt-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laboratories..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 text-white rounded-r-lg hover:bg-cyan-600 transition-colors duration-200"
            >
              🔍
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;