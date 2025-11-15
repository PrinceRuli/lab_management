import React from 'react';

const Footer = () => {
  return (
    <footer id="footer-contact" className="bg-gray-900 text-white px-3  ">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-2xl font-bold text-white">LABSCHEDULE</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Revolutionizing laboratory management with smart scheduling solutions 
                for educational institutions and research facilities worldwide.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', icon: '📘' },
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'LinkedIn', icon: '💼' },
                  { name: 'Instagram', icon: '📷' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={`#${social.name.toLowerCase()}`}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700 transition-colors duration-200"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'Features', href: '#features' },
                  { name: 'Laboratories', href: '#labs' },
                  { name: 'About Us', href: '#about' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={() => document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Laboratories */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Laboratories</h3>
              <ul className="space-y-3">
                {[
                  'Computer Labs',
                  'Science Labs', 
                  'Multimedia Labs',
                  'Research Labs',
                  'All Facilities'
                ].map((lab) => (
                  <li key={lab}>
                    <a
                      href="#labs"
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {lab}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-400 mt-1">📧</span>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p>support@labschedule.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-400 mt-1">📞</span>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-400 mt-1">📍</span>
                  <div>
                    <p className="font-medium text-white">Office</p>
                    <p>123 University Ave<br />Campus City, CC 12345</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Stay updated with our latest features</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-full text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-r-full hover:bg-cyan-600 transition-colors duration-200 text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 LabSchedule. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-cyan-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-cyan-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-cyan-400 transition-colors duration-200">
                Cookie Policy
              </a>
              <a href="#sitemap" className="hover:text-cyan-400 transition-colors duration-200">
                Sitemap
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                🔒 Secure Platform
              </div>
              <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                ⭐ 4.9/5 Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;