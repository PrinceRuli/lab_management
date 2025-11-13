# User Stories dengan Kriteria Penerimaan
## Laboratory Scheduling System

### Stories Administrator

**SEBAGAI** administrator  
**SAYA INGIN** mengelola semua akun pengguna  
**AGAR SAYA** dapat mengontrol akses sistem

**Kriteria Penerimaan:**
- ✅ Dapat membuat pengguna dengan peran spesifik (admin/guru/siswa)
- ✅ Dapat mengupdate profil dan hak akses pengguna
- ✅ Dapat menonaktifkan/mengaktifkan akun pengguna
- ✅ Dapat reset password pengguna
- ❌ Tidak dapat menghapus akun admin sendiri

**SEBAGAI** administrator  
**SAYA INGIN** menyetujui atau menolak permintaan pemesanan  
**AGAR SAYA** dapat mengatur utilisasi laboratorium

**Kriteria Penerimaan:**
- ✅ Dapat melihat semua pemesanan pending
- ✅ Dapat menyetujui pemesanan dengan komentar
- ✅ Dapat menolak pemesanan dengan alasan
- ✅ Dapat override konflik pemesanan apa pun
- ✅ Notifikasi otomatis dikirim ke guru ketika status berubah

**SEBAGAI** administrator  
**SAYA INGIN** menghasilkan laporan penggunaan laboratorium  
**AGAR SAYA** dapat menganalisis efisiensi penggunaan

**Kriteria Penerimaan:**
- ✅ Dapat melihat statistik penggunaan per laboratorium
- ✅ Dapat filter laporan berdasarkan rentang tanggal
- ✅ Dapat ekspor laporan ke format PDF/Excel
- ✅ Dapat melihat jam sibuk setiap laboratorium

### Stories Guru/Dosen

**SEBAGAI** guru  
**SAYA INGIN** membuat pemesanan laboratorium untuk kelas saya  
**AGAR SAYA** dapat menjadwalkan sesi praktikum

**Kriteria Penerimaan:**
- ✅ Dapat memilih slot waktu yang tersedia
- ✅ Dapat melihat hanya pemesanan sendiri
- ✅ Dapat membatalkan pemesanan yang pending
- ❌ Tidak dapat menyetujui pemesanan sendiri
- ❌ Tidak dapat melihat pemesanan guru lain

**SEBAGAI** guru  
**SAYA INGIN** melihat kalender ketersediaan laboratorium  
**AGAR SAYA** dapat merencanakan jadwal mengajar

**Kriteria Penerimaan:**
- ✅ Dapat melihat jadwal semua laboratorium
- ✅ Dapat filter berdasarkan laboratorium tertentu
- ✅ Dapat melihat status "tersedia"/"dipesan"/"maintenance"
- ✅ Tampilan bulanan, mingguan, dan harian

**SEBAGAI** guru  
**SAYA INGIN** menerima notifikasi status pemesanan  
**AGAR SAYA** tahu kapan pemesanan disetujui/ditolak

**Kriteria Penerimaan:**
- ✅ Notifikasi email ketika status berubah
- ✅ Notifikasi dalam aplikasi
- ✅ Dapat melihat riwayat notifikasi
- ✅ Dapat menandai notifikasi sebagai sudah dibaca

### Stories Siswa/Publik

**SEBAGAI** siswa/pengguna publik  
**SAYA INGIN** melihat jadwal laboratorium tanpa login  
**AGAR SAYA** dapat melihat slot waktu yang tersedia

**Kriteria Penerimaan:**
- ✅ Dapat melihat kalender tanpa autentikasi
- ✅ Dapat filter berdasarkan laboratorium
- ✅ Dapat melihat slot tersedia vs dipesan
- ❌ Tidak dapat melihat detail pemesanan (hanya status "Dipesan")
- ❌ Tidak dapat membuat pemesanan

**SEBAGAI** siswa  
**SAYA INGIN** melihat informasi fasilitas laboratorium  
**AGAR SAYA** tahu spesifikasi setiap lab

**Kriteria Penerimaan:**
- ✅ Dapat melihat daftar semua laboratorium
- ✅ Dapat melihat fasilitas yang tersedia
- ✅ Dapat melihat kapasitas dan lokasi
- ✅ Dapat melihat status maintenance

### Stories Sistem

**SEBAGAI** sistem  
**SAYA INGIN** mendeteksi konflik pemesanan  
**AGAR** tidak ada double booking

**Kriteria Penerimaan:**
- ✅ Otomatis cek ketersediaan saat pemesanan baru
- ✅ Tampilkan warning jika ada konflik
- ✅ Blokir pemesanan yang overlapping
- ✅ Validasi waktu buka/tutup laboratorium

**SEBAGAI** sistem  
**SAYA INGIN** mengirim pengingat pemesanan  
**AGAR** pengguna tidak lupa jadwal

**Kriteria Penerimaan:**
- ✅ Kirim email reminder 1 jam sebelum pemesanan
- ✅ Notifikasi dalam aplikasi 30 menit sebelum
- ✅ Support untuk multiple reminder
- ✅ Konfigurasi interval reminder