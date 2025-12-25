import React, { useEffect, useState } from 'react';
import { userAPI, authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'user';

const loadUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const saveLocalUser = (u) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  window.dispatchEvent(new CustomEvent('user-updated', { detail: u }));
};

const AccountSettings = ({ open, onClose }) => {
  const [user, setUser] = useState(loadUser() || { name: '', email: '', role: 'teacher', info: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUser(loadUser() || { name: '', email: '', role: 'teacher', info: '' });
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const local = loadUser();
      let id = local?._id || local?.id;

      if (!id) {
        // Try fetching profile from backend
        const profileRes = await authAPI.getProfile();
        id = profileRes.data?._id || profileRes.data?.id;
      }

      if (!id) {
        throw new Error('User ID not found');
      }

      // Prepare payload (do not send empty fields unnecessarily)
      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
        info: user.info,
      };

      const res = await userAPI.update(id, payload);

      const updated = res.data;
      // Persist to localStorage and notify
      saveLocalUser(updated);
      toast.success('Profile updated');
      onClose && onClose();
    } catch (err) {
      console.error('Failed to update user:', err);
      toast.error(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <select value={user.role} onChange={e => setUser({ ...user, role: e.target.value })} className="w-full px-3 py-2 border rounded">
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Additional Info</label>
            <input placeholder="For teacher: subject / For admin: position" value={user.info || ''} onChange={e => setUser({ ...user, info: e.target.value })} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
