# Spesifikasi API Endpoints Berbasis Peran
## Laboratory Scheduling System

### 📋 Daftar Isi
1. [Endpoints Autentikasi](#1-endpoints-autentikasi)
2. [Endpoints Administrator](#2-endpoints-administrator)
3. [Endpoints Manajemen Laboratorium](#3-endpoints-manajemen-laboratorium)
4. [Endpoints Pemesanan Administrator](#4-endpoints-pemesanan-administrator)
5. [Endpoints Guru/Dosen](#5-endpoints-gurudosen)
6. [Endpoints Kalender Guru](#6-endpoints-kalender-guru)
7. [Endpoints Publik](#7-endpoints-publik)
8. [Response & Error Handling](#8-response--error-handling)

---

## 1. Endpoints Autentikasi

### **POST** `/api/auth/login`
**Akses:** Publik  
**Deskripsi:** Login untuk semua peran (admin, teacher, student)  
**Validation:** Email & password required

```javascript
// Request Body
{
  "email": "admin@lab.com",
  "password": "admin123"
}

// Response Success (200)
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@lab.com",
    "role": "admin",
    "permissions": {
      "canManageUsers": true,
      "canManageLabs": true,
      "canViewAllBookings": true,
      "canApproveBookings": true,
      "canGenerateReports": true,
      "canCreateBookings": true,
      "canViewOwnBookings": true,
      "canViewCalendar": true,
      "canViewPublicCalendar": true
    },
    "profile": {
      "fullName": "System Administrator",
      "phone": "+6281234567890",
      "department": "IT"
    }
  }
}

// Response Error (401)
{
  "success": false,
  "message": "Email atau password salah"
}