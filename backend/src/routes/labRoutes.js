// src/routes/labRoutes.js
const express = require('express');
const router = express.Router();
const {
  getLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
} = require('../controllers/labController');
const { protect, authorize } = require('../middleware/auth');
const { getLabStats } = require('../controllers/labController');

router.get('/stats', getLabStats);

router.route('/')
  .get(getLabs)
  .post(protect, authorize('admin'), createLab);

router.route('/:id')
  .get(getLabById)
  .put(protect, authorize('admin'), updateLab)
  .delete(protect, authorize('admin'), deleteLab);

module.exports = router;