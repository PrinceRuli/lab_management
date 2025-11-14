import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5001/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize axios with base config
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token with backend
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes - simulate API call
      // In real app, use: const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user data based on email
      let userData = null;
      
      if (email === 'admin@lab.com' && password === 'admin123') {
        userData = {
          id: 1,
          email: 'admin@lab.com',
          role: 'admin',
          name: 'Administrator',
          username: 'admin'
        };
      } else if (email === 'teacher@lab.com' && password === 'teacher123') {
        userData = {
          id: 2,
          email: 'teacher@lab.com',
          role: 'teacher', 
          name: 'John Teacher',
          username: 'teacher1'
        };
      } else if (email === 'student@lab.com' && password === 'student123') {
        userData = {
          id: 3,
          email: 'student@lab.com',
          role: 'student',
          name: 'Jane Student',
          username: 'student1'
        };
      } else {
        throw new Error('Invalid email or password');
      }

      // Simulate token
      const token = 'demo-token-' + Date.now();
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true, user: userData };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    // ... existing register code ...
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};