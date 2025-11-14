const User = require('../models/User');

// Get all users with filtering and pagination
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email or username already exists' 
      });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'teacher',
      profile: {
        fullName: profile?.fullName || '',
        phone: profile?.phone || '',
        department: profile?.department || '',
        nim: profile?.nim || '',
        nidn: profile?.nidn || ''
      }
    });

    await user.save();

    res.status(201).json({ 
      success: true, 
      data: user,
      message: 'User created successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { username, email, role, profile, isActive } = req.body;
    
    const updateData = { 
      username, 
      email, 
      role, 
      profile,
      isActive 
    };

    // If password is provided, it will be automatically hashed by pre-save hook
    if (req.body.password) {
      updateData.password = req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      data: user,
      message: 'User updated successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'User deactivated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reactivate user
const reactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      data: user,
      message: 'User reactivated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    const studentCount = await User.countDocuments({ role: 'student' });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        byRole: {
          admin: adminCount,
          teacher: teacherCount,
          student: studentCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user permissions
const updateUserPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      data: user,
      message: 'User permissions updated successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser,
  getUserStats,
  updateUserPermissions
};