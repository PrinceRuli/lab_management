import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📅',
      title: 'Smart Scheduling',
      description: 'Easy booking system with real-time availability and calendar integration'
    },
    {
      icon: '👥',
      title: 'User Management',
      description: 'Role-based access for admins, teachers, and students with proper permissions'
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Comprehensive usage statistics and reporting for better resource planning'
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Instant alerts for booking confirmations, reminders, and schedule changes'
    }
  ];

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive laboratory management solutions designed for modern educational institutions
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center group hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Everything You Need for Efficient Laboratory Management
            </h3>
            <div className="space-y-4">
              {[
                'Real-time availability tracking',
                'Automated booking approvals',
                'Resource utilization analytics',
                'Multi-device accessibility',
                'Secure user authentication',
                'Customizable booking rules'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-2xl font-bold mb-4">Ready to Get Started?</h4>
              <p className="text-cyan-100 mb-6">
                Join hundreds of institutions already using LabSchedule
              </p>
              <a href="/register" className="inline-block bg-white text-cyan-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 ">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;