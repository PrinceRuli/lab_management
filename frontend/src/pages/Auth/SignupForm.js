// src/pages/Auth/SignupForm.js - TAMBAHKAN TOMBOL BACK
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaFlask, FaArrowLeft } from 'react-icons/fa';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      // After signup, go to landing page for public/student users
      navigate('/');
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
          Buat Akun Baru
        </h2>

        <p className="text-center text-sm text-gray-600 mb-8">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Masuk di sini
          </Link>
        </p>

        {/* ===== Form ===== */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            startIcon={<FaUser className="text-gray-400" />}
            placeholder="Nama Lengkap"
          />

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

          <Input
            label="Nomor Telepon"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            startIcon={<FaPhone className="text-gray-400" />}
            placeholder="08123456789"
          />

          {/* Role is fixed to student for public signup (hidden) */}

          {/* Terms */}
          <div className="flex items-start text-sm">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-gray-700">
              Saya menyetujui{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                Kebijakan Privasi
              </Link>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Daftar
          </Button>
        </form>

        {/* Back Button (INSIDE CARD) */}
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

export default SignupForm;