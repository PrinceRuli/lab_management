const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  reactivateUser,
  getUserStats,
  updateUserPermissions
} = require('../controllers/userController');

// Admin routes
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/reactivate', reactivateUser);
router.patch('/:id/permissions', updateUserPermissions);

module.exports = router;