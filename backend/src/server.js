const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Load env vars - HARUS di awal
dotenv.config({ path: '.env' });

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const labRoutes = require('./routes/labRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ========== MIDDLEWARE ==========
// CORS Configuration - HARUS di awal
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001'
    ];
    
    if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-Timestamp',
    'Accept'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Handle preflight requests
app.options('*', cors());

// Body parser dengan limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// Morgan logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ========== ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
    environment: process.env.NODE_ENV
  });
});

// ========== API DOCS ==========
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Lab Management System API',
    version: '1.0.0',
    documentation: 'API Documentation',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile'
      },
      labs: {
        getAll: 'GET /api/labs',
        getOne: 'GET /api/labs/:id',
        create: 'POST /api/labs',
        update: 'PUT /api/labs/:id',
        delete: 'DELETE /api/labs/:id',
        stats: 'GET /api/labs/stats'
      },
      bookings: 'GET /api/bookings',
      users: 'GET /api/users'
    },
    status: 'operational'
  });
});

// ========== 404 HANDLER ==========
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    suggestion: 'Check / for available endpoints'
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query
  });
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed',
      allowedOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000']
    });
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, HOST, () => {
  console.log(`
  🚀 Server Started!
  ==================
  📍 Local: http://${HOST}:${PORT}
  🔌 API Base: http://${HOST}:${PORT}/api
  📊 Health: http://${HOST}:${PORT}/health
  🌐 Environment: ${process.env.NODE_ENV || 'development'}
  🗄️ Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}
  ==================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err.message);
  console.error(err.stack);
  
  // Close server & exit process
  server.close(() => {
    console.log('💥 Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});

module.exports = app;