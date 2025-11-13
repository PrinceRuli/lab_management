# Persyaratan Keamanan & Kontrol Akses
## Laboratory Scheduling System

### 1. Matriks Kontrol Akses Berbasis Peran

| Modul Fitur          | Administrator | Guru/Dosen | Publik/Siswa |
|---------------------|---------------|------------|--------------|
| Manajemen Pengguna  | ✅ Penuh       | ❌ Ditolak   | ❌ Ditolak     |
| Manajemen Laboratorium | ✅ Penuh    | ❌ Ditolak   | ❌ Ditolak     |
| Lihat Semua Pemesanan | ✅ Penuh     | ❌ Ditolak   | ❌ Ditolak     |
| Setujui Pemesanan   | ✅ Penuh       | ❌ Ditolak   | ❌ Ditolak     |
| Buat Pemesanan      | ✅ Penuh       | ✅ Milik Sendiri | ❌ Ditolak |
| Lihat Pemesanan Sendiri | ✅ Penuh  | ✅ Milik Sendiri | ❌ Ditolak |
| Lihat Kalender      | ✅ Penuh       | ✅ Hanya Baca | ✅ Hanya Baca |
| Generate Laporan    | ✅ Penuh       | ❌ Ditolak   | ❌ Ditolak     |

### 2. Aturan Visibilitas Data

#### 2.1 Administrator
- **Akses Data:** Semua data di sistem
- **Query Pattern:** Tidak ada filter, akses penuh collection
- **Contoh Query:** `db.bookings.find({})`

#### 2.2 Guru/Dosen
- **Akses Data:** Hanya data milik sendiri + kalender publik
- **Query Pattern:** Selalu filter oleh `userId`
- **Contoh Query:** `db.bookings.find({ userId: currentUserId })`

#### 2.3 Siswa/Publik
- **Akses Data:** Hanya data kalender publik
- **Query Pattern:** Hanya collection `public_calendar_views`
- **Contoh Query:** `db.public_calendar_views.find({ date: { $gte: today } })`

### 3. Persyaratan Autentikasi

#### 3.1 Sistem Login
- **Metode:** JWT (JSON Web Token)
- **Durasi Token:** 7 hari
- **Refresh Token:** Tidak diperlukan
- **Logout:** Token dihapus dari client-side

#### 3.2 Manajemen Session
- Single session per user
- Auto-logout setelah token expired
- Tidak ada remember me functionality

#### 3.3 Keamanan Password
- Minimum 6 karakter
- Hash menggunakan bcrypt (12 salt rounds)
- Validasi strength password
- Reset password via email

### 4. Proteksi API & Middleware

#### 4.1 Role-Based Middleware
```javascript
// Contoh implementasi middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  next();
};

const requireTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  next();
};