import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Navigation will be handled by the useEffect above
      console.log('Login successful, redirecting to dashboard...');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Demo accounts for quick testing
  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: 'admin@lab.com', password: 'admin123' },
      teacher: { email: 'teacher@lab.com', password: 'teacher123' },
      student: { email: 'student@lab.com', password: 'student123' }
    };
    
    setFormData(demoAccounts[role]);
    setError(''); // Clear any previous errors
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">L</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to your LabSchedule account
          </p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}
          
          {/* Form Fields */}
          <div className="space-y-4">
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
                placeholder="Enter your email"
                disabled={isLoading}
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
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-200">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 text-white py-3 px-4 rounded-full font-semibold hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
            
            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Don't have an account?</p>
              <Link 
                to="/register" 
                className="inline-block w-full border border-cyan-500 text-cyan-500 py-3 px-4 rounded-full font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Create New Account
              </Link>
            </div>
            
            {/* Demo Accounts Section */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
              </div>
            </div>

            {/* Demo Account Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center space-y-2 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <span className="text-xl">👑</span>
                <span className="text-sm">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center space-y-2 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <span className="text-xl">👨‍🏫</span>
                <span className="text-sm">Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center space-y-2 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <span className="text-xl">🎓</span>
                <span className="text-sm">Student</span>
              </button>
            </div>

            {/* Demo Account Info */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-cyan-800 text-sm text-center">
                <strong>Demo Accounts Info:</strong><br />
                Use any demo account to explore the system features.
              </p>
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

export default Login;