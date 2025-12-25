// src/services/api.js - VERSION COMPLETE
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for debugging
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403: // Forbidden
          console.warn('Access forbidden');
          break;
          
        case 404: // Not Found
          console.warn('Resource not found');
          break;
          
        case 500: // Server Error
          console.error('Server error occurred');
          break;
          
        default:
          console.warn(`HTTP error: ${error.response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/auth/profile'),
};

export const userAPI = {
  getAll: () => 
    api.get('/users'),
  
  getById: (id) => 
    api.get(`/users/${id}`),
  
  create: (userData) => 
    api.post('/users', userData),
  
  update: (id, userData) => 
    api.put(`/users/${id}`, userData),
  
  delete: (id) => 
    api.delete(`/users/${id}`),
};

export const labAPI = {
  getAll: () => 
    api.get('/labs'),
  
  getById: (id) => 
    api.get(`/labs/${id}`),
  
  create: (labData) => 
    api.post('/labs', labData),
  
  update: (id, labData) => 
    api.put(`/labs/${id}`, labData),
  
  delete: (id) => 
    api.delete(`/labs/${id}`),
};

export const bookingAPI = {
  getAll: (params = {}) => 
    api.get('/bookings', { params }),
  
  getById: (id) => 
    api.get(`/bookings/${id}`),
  
  create: (bookingData) => 
    api.post('/bookings', bookingData),
  
  update: (id, bookingData) => 
    api.put(`/bookings/${id}`, bookingData),
  
  delete: (id) => 
    api.delete(`/bookings/${id}`),
  
  getMyBookings: () => 
    api.get('/bookings/my-bookings'),
};

// Export default instance
export default api;