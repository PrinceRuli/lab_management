const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use(limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-scheduling');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
};
connectDB();

// ==================== MODELS ====================
// User Model (Simplified)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
  profile: {
    fullName: { type: String, required: true }
  },
  permissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageLabs: { type: Boolean, default: false },
    canViewAllBookings: { type: Boolean, default: false },
    canApproveBookings: { type: Boolean, default: false },
    canGenerateReports: { type: Boolean, default: false },
    canCreateBookings: { type: Boolean, default: true },
    canViewOwnBookings: { type: Boolean, default: true },
    canViewCalendar: { type: Boolean, default: true },
    canViewPublicCalendar: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Add method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  // For now, simple comparison. In production, use bcrypt
  return this.password === candidatePassword;
};

const User = mongoose.model('User', userSchema);

// Laboratory Model
const laboratorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Laboratory name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Laboratory code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1
  },
  equipment: [{
    name: String,
    quantity: Number,
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  }],
  facilities: [String],
  status: {
    type: String,
    enum: ['available', 'maintenance', 'occupied', 'unavailable'],
    default: 'available'
  },
  images: [String],
  operatingHours: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '17:00' }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Laboratory = mongoose.model('Laboratory', laboratorySchema);

// ==================== MIDDLEWARE FUNCTIONS ====================
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// ==================== AUTH ROUTES ====================
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Set permissions based on role
    const permissions = {};
    if (role === 'admin') {
      permissions.canManageUsers = true;
      permissions.canManageLabs = true;
      permissions.canViewAllBookings = true;
      permissions.canApproveBookings = true;
      permissions.canGenerateReports = true;
    }

    // Create user
    const user = new User({
      username,
      email,
      password, // In production, hash this password
      role: role || 'student',
      profile: { fullName: fullName || username },
      permissions
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
        profile: req.user.profile
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== LABORATORY ROUTES ====================
// Get all laboratories (Public)
app.get('/api/laboratories', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      filter.status = status;
    }

    const laboratories = await Laboratory.find(filter)
      .populate('createdBy', 'username email profile.fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Laboratory.countDocuments(filter);

    res.json({
      success: true,
      count: laboratories.length,
      data: laboratories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single laboratory (Public)
app.get('/api/laboratories/:id', async (req, res) => {
  try {
    const laboratory = await Laboratory.findById(req.params.id)
      .populate('createdBy', 'username email profile.fullName');

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    res.json({
      success: true,
      data: laboratory
    });

  } catch (error) {
    console.error('Get laboratory error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create laboratory (Admin only)
app.post('/api/laboratories', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      location,
      capacity,
      equipment,
      facilities,
      status,
      operatingHours
    } = req.body;

    // Check if laboratory code exists
    const existingLab = await Laboratory.findOne({ code });
    if (existingLab) {
      return res.status(400).json({
        success: false,
        message: 'Laboratory code already exists'
      });
    }

    const laboratory = new Laboratory({
      name,
      code: code.toUpperCase(),
      description,
      location,
      capacity,
      equipment: equipment || [],
      facilities: facilities || [],
      status: status || 'available',
      operatingHours: operatingHours || { open: '08:00', close: '17:00' },
      createdBy: req.user.id
    });

    await laboratory.save();
    await laboratory.populate('createdBy', 'username email profile.fullName');

    res.status(201).json({
      success: true,
      message: 'Laboratory created successfully',
      data: laboratory
    });

  } catch (error) {
    console.error('Create laboratory error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update laboratory (Admin only)
app.put('/api/laboratories/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      capacity,
      equipment,
      facilities,
      status,
      operatingHours
    } = req.body;

    const laboratory = await Laboratory.findById(req.params.id);

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    // Update fields
    if (name) laboratory.name = name;
    if (description) laboratory.description = description;
    if (location) laboratory.location = location;
    if (capacity) laboratory.capacity = capacity;
    if (equipment) laboratory.equipment = equipment;
    if (facilities) laboratory.facilities = facilities;
    if (status) laboratory.status = status;
    if (operatingHours) laboratory.operatingHours = operatingHours;

    await laboratory.save();
    await laboratory.populate('createdBy', 'username email profile.fullName');

    res.json({
      success: true,
      message: 'Laboratory updated successfully',
      data: laboratory
    });

  } catch (error) {
    console.error('Update laboratory error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete laboratory (Admin only)
app.delete('/api/laboratories/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const laboratory = await Laboratory.findById(req.params.id);

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    await Laboratory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Laboratory deleted successfully'
    });

  } catch (error) {
    console.error('Delete laboratory error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==================== BASIC ROUTES ====================
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Lab Scheduling System API',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ==================== ERROR HANDLING ====================
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error'
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('\n🎉 ===== LAB SCHEDULING SYSTEM API =====');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('========================================\n');
  
  console.log('📍 Available Endpoints:');
  console.log('   AUTH:');
  console.log('     POST /api/auth/register');
  console.log('     POST /api/auth/login');
  console.log('     GET  /api/auth/me (Protected)');
  console.log('   LABORATORIES:');
  console.log('     GET    /api/laboratories (Public)');
  console.log('     GET    /api/laboratories/:id (Public)');
  console.log('     POST   /api/laboratories (Admin only)');
  console.log('     PUT    /api/laboratories/:id (Admin only)');
  console.log('     DELETE /api/laboratories/:id (Admin only)');
  console.log('   SYSTEM:');
  console.log('     GET /');
  console.log('     GET /api/health');
  console.log('');
});