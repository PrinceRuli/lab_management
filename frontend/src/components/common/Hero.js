import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen p-3 flex items-center justify-center bg-white pt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-cyan-50 rounded-full border border-cyan-200">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              <span className="text-sm font-medium text-cyan-700">WE ARE LABSCHEDULE</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Smart Laboratory</span>
              <br />
              <span className="gradient-text">Scheduling System</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Welcome to LabSchedule, your comprehensive platform for managing laboratory resources 
              efficiently. We provide everything you need to schedule, track, and optimize laboratory 
              usage - making academic and research management simpler wherever you are.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn btn-primary btn-large rounded-full">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large rounded-full">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">50+</div>
                <div className="text-sm text-gray-600">Laboratories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">1K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Illustration */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="text-2xl font-bold mb-2">Computer Laboratory</h3>
                <p className="text-cyan-100">Available for booking</p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
                  <span className="text-sm">Capacity: 30 students</span>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-100 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;