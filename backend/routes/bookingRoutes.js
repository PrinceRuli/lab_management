const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  createBooking,
  updateBooking,
  updateBookingStatus,
  getUserBookings,
  getCalendarBookings,
  getBookingStats,
  deleteBooking
} = require('../controllers/bookingController');

// Public routes
router.get('/', getAllBookings);
router.get('/calendar', getCalendarBookings);
router.get('/stats', getBookingStats);

// User routes
router.get('/my-bookings', getUserBookings);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

// Admin routes
router.patch('/:id/status', updateBookingStatus);

module.exports = router;