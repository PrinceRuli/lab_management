import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToFooter = () => {
    const footer = document.getElementById('footer-contact');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      const labsSection = document.getElementById('labs');
      if (labsSection) {
        labsSection.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMenuOpen(false);
    }
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between py-3 px-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold gradient-text">LABSCHEDULE</span>
          </div>

          {/* Navigation Links - Center Position (Desktop) */}
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
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

          {/* Action Buttons & Search (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Login Button - Link ke Login Page */}
            <Link to="/login" className="btn-secondary rounded-full">
              Login
            </Link>

            {/* Register Button - Link ke Register Page */}
            <Link to="/register" className="btn-primary rounded-full">
              Register
            </Link>
          </div>

          {/* Hamburger Menu (Mobile & Tablet) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-cyan-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute p-3 top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <div className="container-custom py-4">
              {/* Navigation Links */}
              <div className="flex flex-col space-y-4 mb-6">
                <a 
                  href="#home" 
                  onClick={handleNavClick}
                  className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                >
                  Home
                </a>
                <a 
                  href="#features" 
                  onClick={handleNavClick}
                  className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                >
                  Features
                </a>
                <a 
                  href="#labs" 
                  onClick={handleNavClick}
                  className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                >
                  Laboratories
                </a>
                <button 
                  onClick={scrollToFooter}
                  className="text-left text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                >
                  Contact
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 mb-4">
                <Link 
                  to="/login" 
                  onClick={handleNavClick}
                  className="btn-secondary rounded-full text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={handleNavClick}
                  className="btn-primary rounded-full text-center"
                >
                  Register
                </Link>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laboratories..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-white rounded-r-full hover:bg-cyan-600 transition-colors duration-200"
                >
                  🔍
                </button>
              </form>
            </div>
          </div>
        )}

        
      </nav>
    </header>
  );
};

export default Header;