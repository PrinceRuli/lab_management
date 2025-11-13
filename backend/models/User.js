const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true
  },
  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageLabs: { type: Boolean, default: false },
    canViewAllBookings: { type: Boolean, default: false },
    canApproveBookings: { type: Boolean, default: false },
    canGenerateReports: { type: Boolean, default: false },
    canCreateBookings: { type: Boolean, default: false },
    canViewOwnBookings: { type: Boolean, default: false },
    canViewCalendar: { type: Boolean, default: false },
    canViewPublicCalendar: { type: Boolean, default: true }
  },
  profile: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    phone: String,
    department: String,
    nim: String, // for students
    nidn: String // for teachers
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password pre-save hook
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Set permissions based on role
userSchema.pre('save', function(next) {
  const rolePermissions = {
    admin: {
      canManageUsers: true, canManageLabs: true, canViewAllBookings: true,
      canApproveBookings: true, canGenerateReports: true, canCreateBookings: true,
      canViewOwnBookings: true, canViewCalendar: true, canViewPublicCalendar: true
    },
    teacher: {
      canManageUsers: false, canManageLabs: false, canViewAllBookings: false,
      canApproveBookings: false, canGenerateReports: false, canCreateBookings: true,
      canViewOwnBookings: true, canViewCalendar: true, canViewPublicCalendar: true
    },
    student: {
      canManageUsers: false, canManageLabs: false, canViewAllBookings: false,
      canApproveBookings: false, canGenerateReports: false, canCreateBookings: false,
      canViewOwnBookings: false, canViewCalendar: false, canViewPublicCalendar: true
    }
  };
  
  if (this.role && rolePermissions[this.role]) {
    this.permissions = rolePermissions[this.role];
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);