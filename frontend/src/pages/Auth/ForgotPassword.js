import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: integrate with backend endpoint /auth/forgot-password if available
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex justify-center mb-4">
            <FaEnvelope className="h-12 w-12 text-blue-600" />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Lupa Password</h2>
          <p className="text-center text-sm text-gray-600 mb-6">Masukkan email Anda untuk menerima tautan reset password.</p>

          {sent ? (
            <div className="text-center">
              <p className="mb-4">Tautan reset telah dikirim ke email Anda jika alamat terdaftar.</p>
              <Link to="/login" className="text-blue-600 hover:underline">Kembali ke Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" startIcon={<FaEnvelope className="text-gray-400" />} />
              <Button type="submit" variant="primary" fullWidth> Kirim tautan reset </Button>
            </form>
          )}

          <Link to="/" className="flex justify-center mt-6 items-center text-sm text-gray-500 hover:text-gray-800 mb-0">
            <FaArrowLeft className="mr-2" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
