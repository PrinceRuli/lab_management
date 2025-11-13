import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-cyan-100 pt-20">
      <div className="container-custom text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-4xl mx-auto">
          <span className="gradient-text">Smart Laboratory</span>
          <br />
          <span className="text-gray-900">Scheduling System</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Effortlessly manage and schedule your laboratory resources. Book equipment, 
          track availability, and optimize space utilization with our intelligent platform.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a href="/register" className="btn btn-primary btn-large">
            <span className="mr-2">🚀</span>
            Start Scheduling Now
          </a>
          <a href="#features" className="btn btn-secondary btn-large">
            <span className="mr-2">📚</span>
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">50+</div>
            <div className="text-gray-600">Laboratories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">1K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">99%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;