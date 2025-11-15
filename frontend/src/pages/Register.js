import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const userData = {
      username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
      email: formData.email,
      password: formData.password,
      fullName: `${formData.firstName} ${formData.lastName}`,
      role: 'student' // Public registration only for students
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">L</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Join LabSchedule
          </h1>
          <p className="text-gray-600 text-lg">
            Create your student account
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm">
              📝 <strong>Student Registration Only</strong><br />
              Teacher and admin accounts must be created by administrator.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="student@university.edu"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="At least 6 characters"
              minLength="6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-cyan-600 hover:text-cyan-500">
                Terms and Conditions
              </a>
            </label>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Student Account'
              )}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Already have an account?</p>
              <Link 
                to="/login" 
                className="inline-block w-full border border-cyan-500 text-cyan-500 py-3 px-4 rounded-full font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 mt-2"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </form>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;