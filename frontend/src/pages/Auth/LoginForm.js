import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaFlask, FaArrowLeft } from 'react-icons/fa';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect based on role
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/');
      }
    }
    
    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="w-full max-w-md">

      {/* ===== Card ===== */}
      <div className="bg-white rounded-3xl shadow-sm p-8">

        

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <FaFlask className="h-12 w-12 text-blue-600" />
        </div>

        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Masuk ke Akun Anda
        </h2>

        <p className="text-center text-sm text-gray-600 mb-8">
          Belum punya akun?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
            Daftar sekarang
          </Link>
        </p>

        {/* ===== Form ===== */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Alamat Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            startIcon={<FaEnvelope className="text-gray-400" />}
            placeholder="anda@email.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            startIcon={<FaLock className="text-gray-400" />}
            placeholder="••••••••"
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
              />
              Ingat saya
            </label>

            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
              Lupa password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Masuk
          </Button>
        </form>

        

        {/* Back Button (INSIDE FORM) */}
        <Link
          to="/"
          className="flex justify-center mt-10 items-center text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Kembali ke Beranda
        </Link>

      </div>
    </div>
  </div>
);

};

export default LoginForm;