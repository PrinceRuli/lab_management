import React, { useEffect, useState, useRef } from 'react';
import { /* userAPI, */ authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  FaUser, FaEnvelope, FaPhone, FaCamera,
  FaLock, FaEye, FaEyeSlash, FaCalendar,
  FaIdCard, /* FaMapMarkerAlt, */ FaSchool,
  FaGraduationCap, FaSave, FaTimes
} from 'react-icons/fa';

const STORAGE_KEY = 'user';

const AccountSettings = ({ open, onClose }) => {
  const [user, setUser] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Tabs available
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'preferences', label: 'Preferences', icon: <FaCalendar /> },
  ];

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  const loadUserData = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      setUser(localUser);
      setOriginalUser(localUser);

      // Optional: Fetch fresh data from backend
      const profileRes = await authAPI.getProfile();
      if (profileRes.data) {
        const freshUser = { ...localUser, ...profileRes.data };
        setUser(freshUser);
        setOriginalUser(freshUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const id = user._id || user.id;
      if (!id) throw new Error('User ID not found');

      // Prepare updated fields only
      const payload = {};
      Object.keys(user).forEach(key => {
        if (user[key] !== originalUser[key]) {
          payload[key] = user[key];
        }
      });

      if (Object.keys(payload).length === 0) {
        toast.info('No changes detected');
        return;
      }

      const res = await authAPI.updateProfile(payload);

      // Update localStorage
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

      window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));

      toast.success('Profile updated successfully');
      onClose && onClose();
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload JPEG, PNG, or GIF image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await authAPI.uploadAvatar(formData);
      setUser({ ...user, avatar: res.data.avatar });
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully');
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <div className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-gray-100'
                    }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Image Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={
                          user.image ||
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=4F46E5&color=fff`
                        }
                        alt={user.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=4F46E5&color=fff`;
                        }}
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                    >
                      <FaCamera className="h-4 w-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.name || 'User'}</h3>
                    <p className="text-gray-600">{user.role || 'Teacher'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name || ''}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0812-3456-7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaIdCard className="inline mr-2" /> Teacher ID / NIP
                    </label>
                    <input
                      type="text"
                      value={user.teacherId || ''}
                      onChange={(e) => setUser({ ...user, teacherId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your teacher ID"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaGraduationCap className="inline mr-2" /> Subject/Expertise
                    </label>
                    <input
                      type="text"
                      value={user.subject || user.info || ''}
                      onChange={(e) => setUser({ ...user, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mathematics, Physics, Computer Science"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaSchool className="inline mr-2" /> Department
                    </label>
                    <input
                      type="text"
                      value={user.department || ''}
                      onChange={(e) => setUser({ ...user, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Science Department, Computer Department"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio/Description
                    </label>
                    <textarea
                      value={user.bio || ''}
                      onChange={(e) => setUser({ ...user, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Tell something about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </form>

                {/* Security Settings */}
                <div className="pt-6 border-t">
                  <h4 className="font-semibold mb-4">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Login Sessions</p>
                        <p className="text-sm text-gray-600">View and manage active sessions</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive booking updates via email' },
                    { id: 'pushNotifications', label: 'Push Notifications', description: 'Get real-time notifications' },
                    { id: 'bookingReminders', label: 'Booking Reminders', description: 'Reminders before your scheduled bookings' },
                    { id: 'statusUpdates', label: 'Status Updates', description: 'When booking status changes' },
                  ].map(pref => (
                    <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{pref.label}</p>
                        <p className="text-sm text-gray-600">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-semibold mb-4">Display Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={() => {
              setUser(originalUser);
              onClose();
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Reset password logic
                toast.success('Password reset link sent to email');
              }}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Reset Password
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;