const express = require('express');
const router = express.Router();

console.log('🔧 Laboratory routes file loaded!');

// Test route tanpa dependencies
router.get('/test-simple', (req, res) => {
  console.log('✅ Simple test route hit!');
  res.json({ 
    success: true, 
    message: 'Simple test route working!',
    path: '/api/labs/test-simple'
  });
});

// Test route dengan auth middleware sederhana
const simpleAuth = (req, res, next) => {
  console.log('🔐 Simple auth middleware executed');
  // Simulate user for testing
  req.user = { id: 'test-user-id', role: 'admin' };
  next();
};

router.get('/test-auth', simpleAuth, (req, res) => {
  console.log('✅ Auth test route hit! User:', req.user);
  res.json({ 
    success: true, 
    message: 'Auth test route working!',
    user: req.user
  });
});

router.post('/test-create', simpleAuth, (req, res) => {
  console.log('📝 Create test route hit! Body:', req.body);
  res.json({ 
    success: true, 
    message: 'Create test route working!',
    body: req.body,
    user: req.user
  });
});

module.exports = router;