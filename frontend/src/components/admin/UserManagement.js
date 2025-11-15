import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Sample user data
  const sampleUsers = [
    {
      _id: "690f709613915ad44085d1e3",
      name: "Dr. Sarah Smith",
      email: "sarah.smith@university.edu",
      role: "teacher",
      department: "Computer Science",
      phone: "+62 812-3456-7890",
      status: "active",
      lastLogin: "2024-01-20T14:30:00.000Z",
      createdAt: "2023-08-15T09:00:00.000Z",
      bookingsCount: 24,
      avatar: "SS"
    },
    {
      _id: "690f709613915ad44085d1e4",
      name: "Prof. John Davis",
      email: "john.davis@university.edu",
      role: "teacher",
      department: "Physics",
      phone: "+62 813-4567-8901",
      status: "active",
      lastLogin: "2024-01-19T10:15:00.000Z",
      createdAt: "2023-09-10T08:30:00.000Z",
      bookingsCount: 18,
      avatar: "JD"
    },
    {
      _id: "690f709613915ad44085d1e5",
      name: "Dr. Maria Garcia",
      email: "maria.garcia@university.edu",
      role: "teacher",
      department: "Chemistry",
      phone: "+62 814-5678-9012",
      status: "active",
      lastLogin: "2024-01-18T16:45:00.000Z",
      createdAt: "2023-10-05T11:20:00.000Z",
      bookingsCount: 15,
      avatar: "MG"
    },
    {
      _id: "690f709613915ad44085d1e6",
      name: "Admin System",
      email: "admin@university.edu",
      role: "admin",
      department: "IT",
      phone: "+62 815-6789-0123",
      status: "active",
      lastLogin: "2024-01-20T08:00:00.000Z",
      createdAt: "2023-01-01T00:00:00.000Z",
      bookingsCount: 0,
      avatar: "AS"
    },
    {
      _id: "690f709613915ad44085d1e7",
      name: "Robert Wilson",
      email: "robert.wilson@university.edu",
      role: "teacher",
      department: "Biology",
      phone: "+62 816-7890-1234",
      status: "inactive",
      lastLogin: "2023-12-15T11:30:00.000Z",
      createdAt: "2023-11-20T14:15:00.000Z",
      bookingsCount: 8,
      avatar: "RW"
    },
    {
      _id: "690f709613915ad44085d1e8",
      name: "Lisa Chen",
      email: "lisa.chen@university.edu",
      role: "teacher",
      department: "Mathematics",
      phone: "+62 817-8901-2345",
      status: "pending",
      lastLogin: null,
      createdAt: "2024-01-10T13:45:00.000Z",
      bookingsCount: 0,
      avatar: "LC"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUsers(sampleUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter users based on status and search term
  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  const handleAddUser = (userData) => {
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      bookingsCount: 0,
      avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    
    setUsers(prev => [newUser, ...prev]);
    setShowAddUserModal(false);
    console.log('User added:', newUser);
  };

  const handleEditUser = (userData) => {
    setUsers(prev => 
      prev.map(user => 
        user._id === selectedUser._id 
          ? { ...user, ...userData }
          : user
      )
    );
    setShowEditUserModal(false);
    setSelectedUser(null);
    console.log('User updated:', userData);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user._id !== userId));
      console.log('User deleted:', userId);
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => 
      prev.map(user => 
        user._id === userId 
          ? { ...user, status: newStatus }
          : user
      )
    );
    console.log('User status updated:', userId, newStatus);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'pending': return 'orange';
      default: return 'blue';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'purple';
      case 'teacher': return 'blue';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="mt-4 lg:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span>+</span>
          <span>Add New User</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-green-800">{stats.active}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-800">{stats.pending}</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Inactive</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
            </div>
            <div className="text-2xl">🚫</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Teachers</p>
              <p className="text-2xl font-bold text-blue-800">{stats.teachers}</p>
            </div>
            <div className="text-2xl">👨‍🏫</div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Admins</p>
              <p className="text-2xl font-bold text-purple-800">{stats.admins}</p>
            </div>
            <div className="text-2xl">⚙️</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Bookings</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${
                      user.role === 'admin' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'
                    } rounded-full flex items-center justify-center text-white font-bold`}>
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-gray-900">{user.department}</p>
                </td>
                <td className="py-4 px-4">
                  <select 
                    value={user.status}
                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                    className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200 focus:ring-green-500' 
                        : user.status === 'pending'
                        ? 'bg-orange-100 text-orange-800 border-orange-200 focus:ring-orange-500'
                        : 'bg-gray-100 text-gray-800 border-gray-200 focus:ring-gray-500'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <p className="text-gray-900">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('id-ID')
                      : 'Never'
                    }
                  </p>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {user.bookingsCount} bookings
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 p-1 transition-colors"
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'There are no users to display'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditUserModal(false);
            setSelectedUser(null);
          }}
          onEditUser={handleEditUser}
        />
      )}
    </div>
  );
};

// Add User Modal Component
const AddUserModal = ({ onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher',
    department: '',
    phone: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onEditUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    phone: user.phone,
    status: user.status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditUser(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;