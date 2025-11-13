import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold gradient-text">LabSchedule</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Home
            </a>
            <a href="#features" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#labs" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Laboratories
            </a>
            <a href="#about" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <a href="/login" className="btn-secondary hidden sm:inline-flex">
              Login
            </a>
            <a href="/register" className="btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;