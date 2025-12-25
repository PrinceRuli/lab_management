// backend/src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getUserBookings,
} = require('../controllers/bookingController');

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.get('/my-bookings', protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBookingStatus);

module.exports = router;