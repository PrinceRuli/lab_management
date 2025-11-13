import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Laboratories = () => {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      description: 'Main computer lab for programming courses'
    },
    {
      _id: '2',
      name: 'Multimedia Laboratory',
      code: 'MEDIALAB1',
      location: 'Building B, Room 205',
      capacity: 20,
      status: 'available',
      description: 'Lab for multimedia and design courses'
    },
    {
      _id: '3',
      name: 'Physics Laboratory',
      code: 'PHYSLAB1',
      location: 'Building C, Room 105',
      capacity: 25,
      status: 'maintenance',
      description: 'Lab for physics experiments and research'
    }
  ];

  const displayLabs = laboratories.length > 0 ? laboratories : sampleLabs;

  const getLabIcon = (labName) => {
    if (labName.includes('Computer')) return '💻';
    if (labName.includes('Multimedia')) return '🎬';
    if (labName.includes('Physics')) return '🔬';
    return '🏢';
  };

  const getStatusColor = (status) => {
    return status === 'available' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-amber-100 text-amber-800';
  };

  return (
    <section id="labs" className="section-padding bg-gradient-to-br from-gray-50 to-cyan-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Laboratories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            State-of-the-art facilities equipped for modern education and research
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayLabs.map((lab) => (
              <div key={lab._id} className="card overflow-hidden group">
                {/* Lab Header */}
                <div className="h-48 bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl text-white animate-float">
                    {getLabIcon(lab.name)}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lab.status)}`}>
                      {lab.status}
                    </span>
                  </div>
                </div>

                {/* Lab Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {lab.name}
                  </h3>
                  <div className="text-cyan-600 font-semibold mb-3">
                    {lab.code}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {lab.description}
                  </p>

                  {/* Lab Info */}
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      📍 {lab.location}
                    </span>
                    <span className="flex items-center">
                      👥 {lab.capacity}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 btn-primary py-2 text-sm">
                      View Details
                    </button>
                    <button className="flex-1 btn-secondary py-2 text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <a href="/laboratories" className="btn btn-primary btn-large">
            View All Laboratories
          </a>
        </div>
      </div>
    </section>
  );
};

export default Laboratories;