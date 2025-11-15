const express = require('express');
const router = express.Router();

// Public routes - no authentication required
router.get('/laboratories', (req, res) => {
  res.json({
    sucess: true,
    message: 'Public laboratories endpoint' });
});

router.get('/test', (req, res) => {
  res.json({
    sucess: true,
    message: 'Public calendar endpoint' });
});

module.exports = router;