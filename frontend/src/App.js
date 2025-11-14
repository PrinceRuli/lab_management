import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Home />} />
            
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/admin" element={<Dashboard />} />
            <Route path="/dashboard/teacher" element={<Dashboard />} />
            <Route path="/dashboard/student" element={<Dashboard />} />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <Link to="/" className="btn btn-primary">Go Home</Link>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;