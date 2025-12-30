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
  deleteBooking,
  getApprovedSchedules,
  getAllSchedules,
  getTodaySchedules
} = require('../controllers/bookingController');

router.get('/schedules/approved', getApprovedSchedules);
router.get('/schedules/all', getAllSchedules);
router.get('/schedules/today', getTodaySchedules);

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.get('/my-bookings', protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBookingStatus)
  .delete(protect, deleteBooking);

module.exports = router;