const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// GET /api/auth/test (untuk testing)
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Auth routes working!' 
  });
});

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;