import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📅',
      title: 'Easy Scheduling',
      description: 'Book laboratories and equipment with our intuitive calendar interface. Real-time availability updates.'
    },
    {
      icon: '👥',
      title: 'Multi-User Management',
      description: 'Manage students, teachers, and administrators with role-based access control.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track laboratory usage and generate reports for better resource planning.'
    },
    {
      icon: '🔔',
      title: 'Instant Notifications',
      description: 'Get notified about booking confirmations, reminders, and schedule changes.'
    },
    {
      icon: '🛡️',
      title: 'Secure Access',
      description: 'Advanced security features to protect your data and ensure privacy.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access the system from any device with our responsive design.'
    }
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">Our System?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your laboratory management with our comprehensive features designed for modern education
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-8 group">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;