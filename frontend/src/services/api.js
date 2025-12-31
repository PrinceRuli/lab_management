import axios from 'axios';


// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    // Normalize network errors to a friendly server response shape so callers can show consistent messages
    if (!error.response) {
      console.error('❌ Network Error:', error.message);
      error.response = {
        status: 0,
        data: { message: 'Koneksi jaringan gagal. Periksa sambungan internet Anda dan coba lagi.' }
      };
    } else {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
      });
    }

    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401: { // Unauthorized
          const publicPaths = ['/', '/schedules', '/privacy', '/terms'];

          if (!publicPaths.includes(window.location.pathname)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }

          break;
        }

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

  getApprovedSchedules: () =>
    api.get('/bookings/schedules/approved'),

  getAllSchedules: (params = {}) =>
    api.get('/bookings/schedules', { params }),

  getTodaySchedules: () =>
    api.get('/bookings/schedules/today'),
  getAll: (params = {}) =>
    api.get('/bookings', { params }),

  getById: (id) =>
    api.get(`/bookings/${id}`),

  // Create booking untuk booking lab
  createBooking: (bookingData) => {
    console.log('[BOOKING API] POST /bookings');
    console.log('Booking Data:', JSON.stringify(bookingData, null, 2));
    return api.post('/bookings', bookingData);
  },

  create: (bookingData) => {
    console.log('[BOOKING API] POST /bookings');
    console.log('Booking Data:', bookingData);
    console.log('Lab field check:', {
      lab: bookingData.lab,
      labId: bookingData.labId,
      haslab: !!bookingData.lab,
      haslabId: !!bookingData.labId,
      selectedLabHasId: bookingData.selectedLab?._id
    });
    console.log('Required fields check:', {
      teacherName: bookingData.teacherName,
      subject: bookingData.subject,
      activityTitle: bookingData.activityTitle,
      bookingDate: bookingData.bookingDate,
      classGroup: bookingData.classGroup,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
    });

    return api.post('/bookings', bookingData);

  },

  update: (id, bookingData) =>
    api.put(`/bookings/${id}`, bookingData),

  delete: (id) =>
    api.delete(`/bookings/${id}`),

  getMyBookings: () =>
    api.get('/bookings/my-bookings'),
};


export default api;