const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // ===== RELATION =====
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // ===== KEGIATAN (UNTUK LANDING PAGE) =====
  teacherName: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  activityTitle: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: '',
  },

  photo: {
    type: String,
    default: '/assets/images/lab_image.jpg',
  },

  // ===== WAKTU =====
  bookingDate: {
    type: Date,
    required: true,
  },

  day: {
    type: String,
  },

  startTime: {
    type: String,
    required: true,
  },

  endTime: {
    type: String,
    required: true,
  },

  // ===== BOOKING DETAIL =====
  
  classGroup: {
    type: String,
    required: true,
  },

  // ===== STATUS =====
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },

  remarks: {
    type: String,
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  approvedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
