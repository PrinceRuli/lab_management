// src/pages/Admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { userAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  // ================= STATE =================
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    phone: '',
  });

  // ================= FETCH DATA =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching users...');
      const response = await userAPI.getAll();
      
      // Handle different response formats
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else if (response.data && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      } else {
        usersData = [];
      }
      
      console.log(`✅ Loaded ${usersData.length} users`, usersData);
      setUsers(usersData);
      
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      const errorMessage = err.response?.data?.message || 'Gagal memuat data pengguna. Silakan coba lagi.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= HANDLERS =================
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openAddForm = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'teacher',
      phone: '',
    });
    setShowFormModal(true);
  };

  const openEditForm = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Empty password for edit
      role: user.role || 'teacher',
      phone: user.phone || '',
    });
    setShowFormModal(true);
  };

  const openDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeForm = () => {
    setShowFormModal(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'teacher',
      phone: '',
    });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email harus diisi');
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Format email tidak valid');
      return false;
    }
    if (!selectedUser && !formData.password.trim()) {
      toast.error('Password harus diisi untuk pengguna baru');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return false;
    }
    return true;
  };

  const saveUser = async () => {
    if (!validateForm()) return;

    try {
      console.log('📤 Saving user:', formData);
      
      let response;
      
      if (selectedUser) {
        // EDIT existing user
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          phone: formData.phone.trim() || undefined
        };
        
        // Only include password if provided
        if (formData.password.trim()) {
          payload.password = formData.password;
        }
        
        console.log('📝 Updating user:', selectedUser._id, payload);
        response = await userAPI.update(selectedUser._id, payload);
        console.log('✅ Update response:', response.data);
        toast.success('Pengguna berhasil diperbarui');
        
      } else {
        // ADD new user
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          phone: formData.phone.trim() || undefined
        };
        
        console.log('➕ Creating new user:', payload);
        response = await userAPI.create(payload);
        console.log('✅ Create response:', response.data);
        toast.success('Pengguna berhasil ditambahkan');
      }
      
      // Refresh the users list
      await fetchUsers();
      closeForm();
      
    } catch (err) {
      console.error('❌ Error saving user:', err);
      
      // Display specific error messages
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (errorData.errors) {
          // Handle validation errors
          const firstError = errorData.errors[0];
          toast.error(firstError.msg || 'Validasi gagal');
        } else if (errorData.message) {
          // Handle custom error messages
          toast.error(errorData.message);
        } else {
          toast.error('Terjadi kesalahan saat menyimpan data');
        }
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Gagal menyimpan pengguna. Silakan coba lagi.');
      }
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      console.log('🗑️ Deleting user:', selectedUser._id);
      
      await userAPI.delete(selectedUser._id);
      
      // Update local state immediately
      setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      
      toast.success('Pengguna berhasil dihapus');
      closeDeleteModal();
      
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Gagal menghapus pengguna. Silakan coba lagi.');
      }
    }
  };

  const getRoleBadge = (role) => {
    const config = {
      'admin': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Admin' },
      'teacher': { bg: 'bg-green-100', text: 'text-green-800', label: 'Guru' },
      'student': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Siswa' },
    };

    const roleConfig = config[role] || { bg: 'bg-gray-100', text: 'text-gray-800', label: role };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}>
        {roleConfig.label}
      </span>
    );
  };

  const getStatusBadge = (user) => {
    // Check if user has isActive property or status property
    const isActive = user.isActive !== undefined ? user.isActive : 
                    user.status ? user.status === 'active' : true;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'Aktif' : 'Nonaktif'}
      </span>
    );
  };

  // ================= FILTER USERS =================
  const filteredUsers = users.filter(user => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.role || '').toLowerCase().includes(searchLower) ||
      (user.phone || '').toLowerCase().includes(searchLower)
    );
  });

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-600 mt-1">Memuat data pengguna...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  // ================= RENDER ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-600 mt-1">Terjadi kesalahan</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Muat Ulang
                </button>
                <button
                  onClick={fetchUsers}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
            <p className="text-gray-600 mt-1">
              Kelola data pengguna sistem
            </p>
          </div>
          <Button
            onClick={openAddForm}
            className="mt-4 md:mt-0 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Pengguna
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Pengguna</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{users.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Guru</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {users.filter(u => u.role === 'teacher').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Siswa</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {users.filter(u => u.role === 'student').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Admin</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari pengguna berdasarkan nama, email, atau role..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v3.5m0 0h-12m12 0h-12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Pengguna tidak ditemukan' : 'Belum ada pengguna'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Coba dengan kata kunci pencarian yang berbeda.'
                : 'Mulai dengan menambahkan pengguna pertama Anda.'}
            </p>
            {!searchTerm && (
              <Button onClick={openAddForm}>
                Tambah Pengguna Pertama
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card 
              key={user._id} 
              className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* User Avatar */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-blue-600">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                
                {/* User Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {user.name || 'Nama tidak tersedia'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{user.email || 'Email tidak tersedia'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{user.phone || 'Tidak ada telepon'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      ID: {user._id?.substring(0, 8) || 'N/A'}...
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditForm(user)}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => openDeleteConfirmation(user)}
                        className="flex items-center gap-1"
                        disabled={user.role === 'admin'} // Optional: prevent deleting admin users
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ================= MODAL FORM ================= */}
      <Modal
        isOpen={showFormModal}
        onClose={closeForm}
        title={
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {selectedUser ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              )}
            </svg>
            <span>{selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</span>
          </div>
        }
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {!selectedUser && '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={selectedUser ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password (min 6 karakter)'}
            />
            {selectedUser ? (
              <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah password</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0812-3456-7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="teacher">Guru</option>
              <option value="student">Siswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={closeForm}
            >
              Batal
            </Button>
            <Button
              onClick={saveUser}
            >
              {selectedUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Hapus Pengguna
          </h3>
          <p className="text-gray-600 mb-2">
            Anda akan menghapus pengguna:
          </p>
          <p className="font-medium text-gray-900 mb-1">{selectedUser?.name}</p>
          <p className="text-sm text-gray-500 mb-6">{selectedUser?.email}</p>
          
          <p className="text-red-600 text-sm mb-6">
            Tindakan ini tidak dapat dibatalkan. Semua data pengguna akan dihapus permanen.
          </p>
          
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={deleteUser}
            >
              Hapus Permanen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;