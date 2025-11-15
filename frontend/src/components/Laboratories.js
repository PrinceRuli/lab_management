import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Laboratories = () => {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

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

  const categories = [
    { id: 'all', name: 'All Laboratories' },
    { id: 'computer', name: 'Computer Labs' },
    { id: 'science', name: 'Science Labs' },
    { id: 'multimedia', name: 'Multimedia Labs' },
    { id: 'research', name: 'Research Labs' }
  ];

  const sampleLabs = [
    {
      _id: '1',
      name: 'Computer Laboratory 1',
      code: 'COMPLAB1',
      location: 'Building A, Room 101',
      capacity: 30,
      status: 'available',
      description: 'Main computer lab for programming courses with 30 high-performance computers',
      category: 'computer',
      image: '💻'
    },
    {
      _id: '2',
      name: 'Multimedia Laboratory',
      code: 'MEDIALAB1',
      location: 'Building B, Room 205',
      capacity: 20,
      status: 'available',
      description: 'Advanced multimedia lab for design and video editing courses',
      category: 'multimedia',
      image: '🎬'
    },
    {
      _id: '3',
      name: 'Physics Laboratory',
      code: 'PHYSLAB1',
      location: 'Building C, Room 105',
      capacity: 25,
      status: 'maintenance',
      description: 'Fully equipped physics lab for experiments and research projects',
      category: 'science',
      image: '🔬'
    },
    {
      _id: '4',
      name: 'Chemistry Laboratory',
      code: 'CHEMLAB1',
      location: 'Building D, Room 301',
      capacity: 15,
      status: 'available',
      description: 'Modern chemistry lab with safety equipment and advanced instruments',
      category: 'science',
      image: '🧪'
    },
    {
      _id: '5',
      name: 'AI Research Lab',
      code: 'AIRLAB1',
      location: 'Building E, Room 401',
      capacity: 10,
      status: 'available',
      description: 'Specialized lab for artificial intelligence and machine learning research',
      category: 'research',
      image: '🤖'
    },
    {
      _id: '6',
      name: 'Computer Laboratory 2',
      code: 'COMPLAB2',
      location: 'Building A, Room 102',
      capacity: 35,
      status: 'available',
      description: 'Secondary computer lab for database and networking courses',
      category: 'computer',
      image: '💻'
    }
  ];

  const displayLabs = laboratories.length > 0 ? laboratories : sampleLabs;

  const filteredLabs = activeCategory === 'all' 
    ? displayLabs 
    : displayLabs.filter(lab => lab.category === activeCategory);

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      maintenance: 'bg-amber-100 text-amber-800',
      occupied: 'bg-blue-100 text-blue-800',
      unavailable: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="labs" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Laboratories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            State-of-the-art facilities equipped with modern technology for education and research
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading laboratories...</p>
          </div>
        )}

        {/* Laboratories Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLabs.map((lab) => (
              <div key={lab._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Lab Image/Icon */}
                <div className="h-48 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl text-white">
                    {lab.image || '🏢'}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lab.status)}`}>
                      {lab.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
                      {lab.code}
                    </span>
                  </div>
                </div>

                {/* Lab Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
                    {lab.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {lab.description}
                  </p>

                  {/* Lab Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-5 mr-3">📍</span>
                      <span>{lab.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-5 mr-3">👥</span>
                      <span>Capacity: {lab.capacity} students</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-5 mr-3">⚡</span>
                      <span className="capitalize">{lab.category} Laboratory</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-cyan-600 transition-colors duration-200 text-sm">
                      View Details
                    </button>
                    <button className="flex-1 border border-cyan-500 text-cyan-500 py-2 px-4 rounded-full font-semibold hover:bg-cyan-500 hover:text-white transition-colors duration-200 text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Explore Our Facilities?
            </h3>
            <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
              Book a tour or schedule a laboratory session today. Our team is ready to assist you with all your educational and research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-cyan-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                Schedule a Tour
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-cyan-600 transition-colors duration-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Laboratories;