import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-16">
      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Syarat & Ketentuan</h1>

        <p className="text-gray-700 mb-4">Selamat datang di LabSchedule. Dengan menggunakan layanan ini, Anda setuju untuk mematuhi syarat dan ketentuan berikut:</p>

        <h2 className="text-lg font-semibold mt-4">1. Penggunaan Layanan</h2>
        <p className="text-gray-700">Layanan disediakan untuk keperluan manajemen laboratorium pendidikan. Penggunaan untuk tujuan ilegal atau merugikan dilarang.</p>

        <h2 className="text-lg font-semibold mt-4">2. Akun</h2>
        <p className="text-gray-700">Anda bertanggung jawab atas keamanan kredensial akun Anda. Admin dapat mengelola akun sesuai kebijakan institusi.</p>

        <h2 className="text-lg font-semibold mt-4">3. Konten dan Data</h2>
        <p className="text-gray-700">Data yang Anda masukkan harus akurat. Kami tidak bertanggung jawab atas kesalahan data yang dimasukkan pengguna.</p>

        <h2 className="text-lg font-semibold mt-4">4. Pembatasan Tanggung Jawab</h2>
        <p className="text-gray-700">Kami berusaha menyediakan layanan andal, namun tidak menjamin ketersediaan tanpa gangguan.</p>

        <h2 className="text-lg font-semibold mt-4">5. Perubahan</h2>
        <p className="text-gray-700">Kami dapat mengubah syarat ini kapan saja; perubahan akan dipublikasikan di halaman ini.</p>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
