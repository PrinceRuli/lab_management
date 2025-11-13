# Spesifikasi Kebutuhan Sistem
## Laboratory Scheduling System

### 1. Pendahuluan
Sistem ini dirancang untuk mengelola pemesanan laboratorium dengan kontrol akses berbasis peran. Sistem membagi pengguna menjadi tiga peran utama: Administrator, Guru/Dosen, dan Siswa/Publik dengan tingkat akses yang berbeda.

### 2. Analisis Stakeholder

#### 2.1 Administrator
**Tanggung Jawab:**
- Kontrol penuh sistem dan konfigurasi
- Manajemen pengguna (buat, baca, update, hapus semua pengguna)
- Manajemen laboratorium
- Persetujuan permintaan pemesanan
- Analitik sistem dan pelaporan

**Hak Akses:**
- ✅ Kelola semua pengguna
- ✅ Kelola laboratorium  
- ✅ Lihat semua pemesanan
- ✅ Setujui/tolak pemesanan apa pun
- ✅ Hasilkan laporan sistem
- ✅ Konfigurasi sistem

#### 2.2 Guru/Dosen
**Tanggung Jawab:**
- Buat pemesanan laboratorium pribadi
- Lihat riwayat pemesanan sendiri
- Lihat ketersediaan kalender laboratorium
- Tidak memiliki hak administratif

**Hak Akses:**
- ✅ Buat pemesanan (hanya untuk diri sendiri)
- ✅ Lihat pemesanan sendiri
- ✅ Lihat kalender (hanya baca)
- ❌ Kelola pengguna lain
- ❌ Setujui pemesanan
- ❌ Laporan sistem

#### 2.3 Siswa/Mahasiswa & Publik
**Tanggung Jawab:**
- Lihat jadwal laboratorium publik
- Tidak perlu login
- Akses baca-saja ke kalender

**Hak Akses:**
- ✅ Lihat kalender publik (tanpa login)
- ❌ Buat pemesanan
- ❌ Akses dashboard
- ❌ Operasi tulis apa pun

### 3. Fitur Utama Sistem

#### 3.1 Modul Pemesanan Laboratorium
- Form pemesanan dengan validasi
- Pengecekan ketersediaan waktu
- Deteksi konflik pemesanan
- Opsi pemesanan berulang

#### 3.2 Sistem Persetujuan
- Persetujuan multi-level (admin saja)
- Pelacakan status: pending/disetujui/ditolak
- Workflow persetujuan
- Auto-persetujuan untuk kondisi tertentu

#### 3.3 Tampilan Kalender
- Tampilan bulanan/mingguan/harian
- Warna status pemesanan
- Filter berdasarkan laboratorium
- Fungsi ekspor

#### 3.4 Sistem Notifikasi
- Notifikasi email
- Notifikasi dalam aplikasi
- Pengingat untuk pemesanan mendatang
- Notifikasi status persetujuan

#### 3.5 Analitik & Pelaporan
- Statistik penggunaan per laboratorium
- Analisis jam sibuk
- Laporan aktivitas pengguna
- Ekspor ke PDF/Excel

### 4. Persyaratan Non-Fungsional

#### 4.1 Kinerja
- Waktu respons API: < 2 detik
- Kapasitas pengguna bersamaan: 100+ pengguna
- Ketersediaan sistem: 99.5%

#### 4.2 Keamanan
- Autentikasi JWT
- Enkripsi data sensitif
- Validasi input
- Rate limiting
- Proteksi CORS

#### 4.3 Kemudahan Penggunaan
- Antarmuka responsif
- Navigasi intuitif
- Dokumentasi pengguna
- Dukungan multi-browser