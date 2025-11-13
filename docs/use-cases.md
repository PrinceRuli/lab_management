# Diagram Use Case Berbasis Peran
## Laboratory Scheduling System

### 1. Diagram Use Case Sistem
SISTEM PEMESANAN LABORATORIUM

AKTOR: Administrator, Guru, Siswa/Publik

USE CASES:

1. Login/Logout System

2. Kelola Akun Pengguna (Admin)

3. Pemesanan Laboratorium (Guru)

4. Persetujuan Pemesanan (Admin)

5. Lihat Kalender Jadwal

6. Kelola Notifikasi

7. Generate Laporan (Admin)

8. Lihat Riwayat Pemesanan


### 2. Use Case Administrator

#### UC-ADM-001: Kelola Akun Pengguna
- **Deskripsi:** Admin dapat membuat, membaca, update, dan menghapus akun pengguna
- **Actor:** Administrator
- **Pre-condition:** Admin sudah login
- **Post-condition:** Data pengguna berhasil diupdate
- **Flow:**
  1. Admin membuka halaman manajemen pengguna
  2. Sistem menampilkan daftar semua pengguna
  3. Admin memilih aksi (tambah, edit, hapus)
  4. Sistem memproses permintaan
  5. Sistem mengupdate database

#### UC-ADM-002: Kelola Laboratorium
- **Deskripsi:** Admin dapat mengelola data laboratorium
- **Actor:** Administrator
- **Flow:** 
  1. Admin mengakses menu laboratorium
  2. Sistem menampilkan daftar laboratorium
  3. Admin menambah/edit laboratorium
  4. Sistem menyimpan perubahan

#### UC-ADM-003: Setujui/Tolak Pemesanan
- **Deskripsi:** Admin dapat menyetujui atau menolak pemesanan
- **Actor:** Administrator
- **Flow:**
  1. Admin melihat daftar pemesanan pending
  2. Admin memilih pemesanan untuk ditinjau
  3. Admin menyetujui atau menolak dengan alasan
  4. Sistem mengupdate status dan mengirim notifikasi

### 3. Use Case Guru

#### UC-TCH-001: Buat Pemesanan Pribadi
- **Deskripsi:** Guru dapat membuat pemesanan laboratorium untuk diri sendiri
- **Actor:** Guru
- **Pre-condition:** Guru sudah login
- **Flow:**
  1. Guru membuka form pemesanan baru
  2. Guru memilih laboratorium dan tanggal
  3. Sistem menampilkan slot waktu yang tersedia
  4. Guru mengisi detail pemesanan
  5. Sistem membuat pemesanan dengan status "pending"

#### UC-TCH-002: Lihat Pemesanan Sendiri
- **Deskripsi:** Guru dapat melihat riwayat pemesanan sendiri
- **Actor:** Guru
- **Flow:**
  1. Guru mengakses halaman "Pemesanan Saya"
  2. Sistem menampilkan hanya pemesanan milik guru tersebut
  3. Guru dapat filter berdasarkan status/tanggal

#### UC-TCH-003: Lihat Kalender Laboratorium
- **Deskripsi:** Guru dapat melihat ketersediaan laboratorium
- **Actor:** Guru
- **Flow:**
  1. Guru membuka halaman kalender
  2. Sistem menampilkan jadwal semua laboratorium
  3. Guru dapat filter berdasarkan laboratorium tertentu

### 4. Use Case Publik/Siswa

#### UC-PUB-001: Lihat Kalender Publik
- **Deskripsi:** Siswa/publik dapat melihat jadwal tanpa login
- **Actor:** Siswa/Publik
- **Pre-condition:** Tidak perlu login
- **Flow:**
  1. Pengguna mengakses halaman landing
  2. Sistem menampilkan kalender publik
  3. Pengguna dapat melihat status "Tersedia"/"Dipesan"

#### UC-PUB-002: Lihat Daftar Laboratorium
- **Deskripsi:** Melihat informasi laboratorium yang tersedia
- **Actor:** Siswa/Publik
- **Flow:**
  1. Pengguna membuka halaman laboratorium
  2. Sistem menampilkan daftar laboratorium dengan fasilitas
  3. Informasi kapasitas dan status ditampilkan

### 5. Use Case Umum

#### UC-AUTH-001: Login Sistem
- **Deskripsi:** Pengguna dapat login ke sistem
- **Actor:** Admin, Guru
- **Flow:**
  1. Pengguna memasukkan email dan password
  2. Sistem memverifikasi kredensial
  3. Sistem mengarahkan ke dashboard sesuai role

#### UC-NOTIF-001: Terima Notifikasi
- **Deskripsi:** Pengguna menerima notifikasi status pemesanan
- **Actor:** Admin, Guru
- **Flow:**
  1. Sistem menghasilkan notifikasi
  2. Notifikasi dikirim via email/app
  3. Pengguna melihat notifikasi