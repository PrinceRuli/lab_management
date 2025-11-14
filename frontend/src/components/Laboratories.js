import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import BookingModal from './booking/BookingModal';

const Laboratories = () => {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLaboratories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/laboratories');
        setLaboratories(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching laboratories:', error);
        setLoading(false);
      }
    };

    fetchLaboratories();
  }, []);

  const sampleLabs = [
    {
      _id: '1',
      name: 'Computer Laboratory 1',
      code: 'COMPLAB1',
      location: 'Building A, Room 101',
      capacity: 30,
      status: 'available',
      description: 'Main computer lab for programming courses',
      facilities: ['WiFi', 'Air Conditioner', 'Projector', 'Computers'],
      operatingHours: { open: '08:00', close: '17:00' },
      color: '#3B82F6'
    },
    {
      _id: '2',
      name: 'Multimedia Laboratory',
      code: 'MEDIALAB1',
      location: 'Building B, Room 205',
      capacity: 20,
      status: 'available',
      description: 'Lab for multimedia and design courses',
      facilities: ['WiFi', 'AC', 'Projector', 'Sound System'],
      operatingHours: { open: '08:00', close: '17:00' },
      color: '#8B5CF6'
    },
    {
      _id: '3',
      name: 'Physics Laboratory',
      code: 'PHYSLAB1',
      location: 'Building C, Room 105',
      capacity: 25,
      status: 'maintenance',
      description: 'Lab for physics experiments and research',
      facilities: ['AC', 'Lab Equipment', 'Safety Gear'],
      operatingHours: { open: '09:00', close: '16:00' },
      color: '#10B981'
    }
  ];

  const displayLabs = laboratories.length > 0 ? laboratories : sampleLabs;

  const getLabIcon = (labName) => {
    if (labName.includes('Computer')) return '💻';
    if (labName.includes('Multimedia')) return '🎬';
    if (labName.includes('Physics')) return '🔬';
    if (labName.includes('Chemistry')) return '🧪';
    if (labName.includes('Biology')) return '🔬';
    return '🏢';
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      maintenance: 'bg-amber-100 text-amber-800',
      occupied: 'bg-blue-100 text-blue-800',
      unavailable: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      available: 'Available',
      maintenance: 'Maintenance',
      occupied: 'Occupied',
      unavailable: 'Unavailable'
    };
    return texts[status] || status;
  };

  const handleBookNow = (lab) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setSelectedLab(lab);
    setShowBookingModal(true);
  };

  const handleBookingCreated = (booking) => {
    setBookingSuccess(true);
    setShowBookingModal(false);
    setSelectedLab(null);
    
    setTimeout(() => {
      setBookingSuccess(false);
    }, 5000);
  };

  const handleViewDetails = (lab) => {
    // For now, show alert with details
    alert(`
      ${lab.name} (${lab.code})
      
      Location: ${lab.location}
      Capacity: ${lab.capacity} people
      Status: ${getStatusText(lab.status)}
      Operating Hours: ${lab.operatingHours?.open || '08:00'} - ${lab.operatingHours?.close || '17:00'}
      
      Facilities:
      ${lab.facilities?.join(', ') || 'Standard equipment'}
      
      ${lab.description}
    `);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 py-4">
            <Link 
              to="/laboratories" 
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
            >
              View Laboratories
            </Link>
            <Link 
              to="/calendar" 
              className="px-4 py-2 bg-white text-cyan-600 border border-cyan-600 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
            >
              Calendar View
            </Link>
            {user?.permissions?.canManageUsers && (
              <Link 
                to="/admin/users" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                User Management
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-cyan-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-cyan-600">Laboratories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              State-of-the-art facilities equipped for modern education and research
            </p>
          </div>

          {/* Success Message */}
          {bookingSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <div>
                  <p className="font-semibold">Booking Created Successfully!</p>
                  <p className="text-sm mt-1">Your booking is pending approval.</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading laboratories...</p>
            </div>
          )}

          {/* Laboratories Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayLabs.map((lab) => (
                <div key={lab._id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                  {/* Lab Header */}
                  <div 
                    className="h-48 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: lab.color || '#0891b2' }}
                  >
                    <div className="text-6xl text-white animate-float">
                      {getLabIcon(lab.name)}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lab.status)}`}>
                        {getStatusText(lab.status)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-white text-sm font-medium bg-black bg-opacity-30 px-2 py-1 rounded">
                        Capacity: {lab.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Lab Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
                      {lab.name}
                    </h3>
                    <div className="text-cyan-600 font-semibold mb-3">
                      {lab.code}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {lab.description}
                    </p>

                    {/* Lab Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📍</span>
                        <span>{lab.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">⏰</span>
                        <span>{lab.operatingHours?.open || '08:00'} - {lab.operatingHours?.close || '17:00'}</span>
                      </div>
                      {lab.facilities && lab.facilities.length > 0 && (
                        <div className="flex items-start text-sm text-gray-500">
                          <span className="mr-2 mt-1">🛠️</span>
                          <div className="flex flex-wrap gap-1">
                            {lab.facilities.slice(0, 3).map((facility, index) => (
                              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {facility}
                              </span>
                            ))}
                            {lab.facilities.length > 3 && (
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                +{lab.facilities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewDetails(lab)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                      >
                        <span className="mr-2">👁️</span>
                        Details
                      </button>
                      <button 
                        onClick={() => handleBookNow(lab)}
                        disabled={lab.status !== 'available' || !isAuthenticated}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
                          lab.status === 'available' && isAuthenticated
                            ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="mr-2">📅</span>
                        {!isAuthenticated ? 'Login to Book' : 'Book Now'}
                      </button>
                    </div>

                    {/* Status Message */}
                    {lab.status !== 'available' && (
                      <div className="mt-3 text-xs text-amber-600 text-center">
                        {lab.status === 'maintenance' && '🚧 Under maintenance'}
                        {lab.status === 'occupied' && '👥 Currently occupied'}
                        {lab.status === 'unavailable' && '❌ Temporarily unavailable'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-cyan-600 mb-2">
                {displayLabs.length}
              </div>
              <div className="text-sm text-gray-600">Total Labs</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {displayLabs.filter(lab => lab.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available Now</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-amber-600 mb-2">
                {displayLabs.filter(lab => lab.status === 'maintenance').length}
              </div>
              <div className="text-sm text-gray-600">Under Maintenance</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-600 mb-2">
                {displayLabs.reduce((total, lab) => total + lab.capacity, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Capacity</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Ready to book a laboratory for your next session?
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    to="/calendar" 
                    className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                  >
                    View Calendar
                  </Link>
                  <button 
                    onClick={() => {
                      const availableLab = displayLabs.find(lab => lab.status === 'available');
                      if (availableLab) {
                        handleBookNow(availableLab);
                      } else {
                        alert('No laboratories available at the moment');
                      }
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Sign in to start booking laboratories for your classes and research
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    to="/login" 
                    className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                  >
                    Sign In to Book
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold border border-cyan-600 hover:bg-cyan-50 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedLab && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedLab(null);
          }}
          laboratory={selectedLab}
          onBookingCreated={handleBookingCreated}
        />
      )}
    </div>
  );
};

export default Laboratories;