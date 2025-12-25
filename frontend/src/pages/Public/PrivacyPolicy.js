import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-16">
      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Kebijakan Privasi</h1>
        <p className="text-gray-700 mb-4">
          Kami menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan layanan LabSchedule.
        </p>

        <h2 className="text-lg font-semibold mt-4">1. Informasi yang Dikumpulkan</h2>
        <p className="text-gray-700">Data yang kami kumpulkan meliputi nama, email, nomor telepon, dan data penggunaan yang diperlukan untuk menyediakan layanan.</p>

        <h2 className="text-lg font-semibold mt-4">2. Tujuan Penggunaan</h2>
        <p className="text-gray-700">Data digunakan untuk autentikasi, manajemen akun, notifikasi, dan peningkatan layanan.</p>

        <h2 className="text-lg font-semibold mt-4">3. Keamanan</h2>
        <p className="text-gray-700">Kami menerapkan langkah-langkah teknis dan organisasi untuk melindungi data Anda, termasuk enkripsi dan kontrol akses.</p>

        <h2 className="text-lg font-semibold mt-4">4. Hak Anda</h2>
        <p className="text-gray-700">Anda berhak mengakses, mengubah, atau menghapus data profil Anda. Untuk permintaan khusus, hubungi administrator sistem.</p>

        <h2 className="text-lg font-semibold mt-4">5. Perubahan Kebijakan</h2>
        <p className="text-gray-700">Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan akan diumumkan pada aplikasi.</p>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
