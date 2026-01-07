const User = require('../models/User');

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE USER (ADMIN)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.isActive ? 'active' : 'inactive',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      teacherId,
      subject,
      department,
      bio,
    } = req.body;

    // cari user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email already exists
    if (email && email !== user.email) {
      const email = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if teacher already exists
    if (teacherId && teacherId !== user.teacherId) {
      const teacherIdExists = await User.findOne(teacherId);
      if (teacherIdExists) {
        return res.status(400).json({ message: 'Teacher ID already in use' });
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (teacherId) user.teacherId = teacherId;
    if (subject) user.subject = subject;
    if (department) user.department = department;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    // Return user withoth password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse,
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({
      message: err.message || 'Failed to update user'
    });
  }
};

// UPLOAD AVATAR
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload avatar URL/path
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ 
      success: true, 
      data: {
        avatar: user.avatar,
       },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER PROFILE
exports.getPro = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      success: true,
      data: user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};