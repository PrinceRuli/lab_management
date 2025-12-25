// backend/src/controllers/bookingController.js
const Booking = require('../models/Booking');
const Lab = require('../models/Lab');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      labId,
      bookingDate,
      startTime,
      endTime,

      // 🔽 DATA BARU DARI FORM
      teacherName,
      subject,
      activityTitle,
      description,
      day,

      participants,
    } = req.body;

    // 🔍 Check lab availability
    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // ⏰ Check for time conflicts
    const conflictingBooking = await Booking.findOne({
      lab: labId,
      bookingDate: new Date(bookingDate),
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
      status: { $in: ['approved', 'pending'] },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: 'Time slot already booked',
        conflictingBooking,
      });
    }

    // ✅ CREATE BOOKING (FORMAT BARU)
    const booking = await Booking.create({
      lab: labId,
      user: req.user.id,

      // 🔽 SIMPAN DATA FORM
      teacherName,
      subject,
      activityTitle,
      description,
      day,

      bookingDate,
      startTime,
      endTime,

      // 🔄 purpose DI-MAP dari activityTitle
      purpose: activityTitle,

      participants: participants || [],
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, labId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (labId) query.lab = labId;
    if (startDate && endDate) {
      query.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Admin bisa lihat semua, teacher hanya booking mereka
    if (req.user.role === 'teacher') {
      query.$or = [
        { user: req.user.id },
        { teacher: req.user.id }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('lab', 'name location')
      .populate('user', 'name email')
      .populate('teacher', 'name email')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('lab', 'name location capacity')
      .populate('user', 'name email')
      .populate('teacher', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    if (req.user.role !== 'admin' &&
      booking.user._id.toString() !== req.user.id &&
      booking.teacher?._id?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin or Teacher
const updateBookingStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Hanya admin atau teacher terkait yang bisa approve/reject
    if (req.user.role === 'teacher' && booking.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    booking.remarks = remarks;

    if (status === 'approved' || status === 'rejected') {
      booking.approvedBy = req.user.id;
      booking.approvedAt = new Date();
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('lab', 'name location')
      .populate('teacher', 'name email')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus semua karakter yang tidak perlu di akhir file
module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getUserBookings,
};