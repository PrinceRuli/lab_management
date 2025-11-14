import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

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

  // Check if user is logged in on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock user data that matches the User model structure
      const mockUser = {
        _id: '1',
        username: email.includes('admin') ? 'admin' : 'teacher',
        email: email,
        role: email.includes('admin') ? 'admin' : 'teacher',
        profile: {
          fullName: email.includes('admin') ? 'Administrator' : 'Teacher User',
          phone: '',
          department: 'Computer Science',
          nim: '',
          nidn: email.includes('admin') ? '' : '1234567890'
        },
        permissions: {
          canManageUsers: email.includes('admin'),
          canManageLabs: email.includes('admin'),
          canViewAllBookings: email.includes('admin'),
          canApproveBookings: email.includes('admin'),
          canGenerateReports: email.includes('admin'),
          canCreateBookings: true,
          canViewOwnBookings: true,
          canViewCalendar: true,
          canViewPublicCalendar: true
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulate registration with proper structure
      const newUser = {
        _id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role || 'teacher',
        profile: {
          fullName: userData.fullName,
          phone: userData.phone || '',
          department: userData.department || '',
          nim: userData.nim || '',
          nidn: userData.nidn || ''
        },
        permissions: {
          canManageUsers: userData.role === 'admin',
          canManageLabs: userData.role === 'admin',
          canViewAllBookings: userData.role === 'admin',
          canApproveBookings: userData.role === 'admin',
          canGenerateReports: userData.role === 'admin',
          canCreateBookings: userData.role !== 'student',
          canViewOwnBookings: true,
          canViewCalendar: userData.role !== 'student',
          canViewPublicCalendar: true
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;