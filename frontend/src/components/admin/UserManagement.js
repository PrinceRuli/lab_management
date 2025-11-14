import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    isActive: 'true'
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'teacher',
    profile: {
      fullName: '',
      phone: '',
      department: '',
      nim: '',
      nidn: ''
    }
  });

  const [permissionsData, setPermissionsData] = useState({});

  useEffect(() => {
    if (user?.permissions?.canManageUsers) {
      fetchUsers();
      fetchStats();
    }
  }, [filters, user]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      if (filters.isActive) params.append('isActive', filters.isActive);

      const response = await axios.get(`http://localhost:5001/api/users?${params}`);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5001/api/users/${editingUser._id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/users', formData);
      }
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.error || 'Error saving user');
    }
  };

  const handlePermissionsUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:5001/api/users/${editingUser._id}/permissions`,
        { permissions: permissionsData }
      );
      setShowPermissionsModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      profile: {
        fullName: user.profile.fullName,
        phone: user.profile.phone || '',
        department: user.profile.department || '',
        nim: user.profile.nim || '',
        nidn: user.profile.nidn || ''
      }
    });
    setShowModal(true);
  };

  const handleEditPermissions = (user) => {
    setEditingUser(user);
    setPermissionsData(user.permissions);
    setShowPermissionsModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await axios.delete(`http://localhost:5001/api/users/${userId}`);
        fetchUsers();
        fetchStats();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await axios.patch(`http://localhost:5001/api/users/${userId}/reactivate`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error reactivating user:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'teacher',
      profile: {
        fullName: '',
        phone: '',
        department: '',
        nim: '',
        nidn: ''
      }
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
      : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
  };

  // Check if current user has permission to manage users
  if (!user?.permissions?.canManageUsers) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header and Stats */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>
        
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-2xl font-bold text-cyan-600">{stats.totalUsers}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-2xl font-bold text-purple-600">{stats.byRole.admin}</div>
              <div className="text-gray-600">Admins</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-2xl font-bold text-blue-600">{stats.byRole.teacher}</div>
              <div className="text-gray-600">Teachers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-2xl font-bold text-green-600">{stats.byRole.student}</div>
              <div className="text-gray-600">Students</div>
            </div>
          </div>
        )}

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>

            <select
              value={filters.isActive}
              onChange={(e) => setFilters({...filters, isActive: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
              <option value="">All</option>
            </select>

            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            onClick={() => {
              setEditingUser(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 whitespace-nowrap"
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.profile.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.profile.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.profile.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(user.isActive)}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-cyan-600 hover:text-cyan-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleEditPermissions(user)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Permissions
                      </button>
                      {user.isActive ? (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {!editingUser && '*'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!editingUser}
                      minLength="6"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                      placeholder={editingUser ? "Leave blank to keep current" : ""}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.profile.fullName}
                      onChange={(e) => setFormData({
                        ...formData, 
                        profile: {...formData.profile, fullName: e.target.value}
                      })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.profile.department}
                      onChange={(e) => setFormData({
                        ...formData, 
                        profile: {...formData.profile, department: e.target.value}
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.profile.phone}
                      onChange={(e) => setFormData({
                        ...formData, 
                        profile: {...formData.profile, phone: e.target.value}
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* NIM/NIDN based on role */}
                  {formData.role === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIM
                      </label>
                      <input
                        type="text"
                        value={formData.profile.nim}
                        onChange={(e) => setFormData({
                          ...formData, 
                          profile: {...formData.profile, nim: e.target.value}
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  )}

                  {formData.role === 'teacher' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIDN
                      </label>
                      <input
                        type="text"
                        value={formData.profile.nidn}
                        onChange={(e) => setFormData({
                          ...formData, 
                          profile: {...formData.profile, nidn: e.target.value}
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  Edit Permissions - {editingUser.profile.fullName}
                </h3>
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePermissionsUpdate}>
                <div className="space-y-3 mb-6">
                  {Object.entries(permissionsData).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setPermissionsData({
                            ...permissionsData,
                            [key]: e.target.checked
                          })}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPermissionsModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Update Permissions
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;