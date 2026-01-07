const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);


// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);          // TAMBAH INI
router.put('/change-password', protect, changePassword); // TAMBAH INI

// Upload avatar (opsional, tambahkan jika diperlukan)
router.post('/profile/avatar', protect, upload.single('avatar'), (req, res) => {
  try {
    const user = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    // Update avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        avatar: avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;