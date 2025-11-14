const Booking = require('../models/Booking');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, laboratory, user } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (laboratory) filter.laboratory = laboratory;
    if (user) filter.user = user;

    const bookings = await Booking.find(filter)
      .populate('laboratory', 'name code location color')
      .populate('user', 'username profile.fullName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1, startTime: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { laboratory, date, startTime, endTime, purpose, attendees, notes } = req.body;
    
    // Validate time range
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        error: 'End time must be after start time'
      });
    }

    // Check for time conflicts
    const conflictingBooking = await Booking.findOne({
      laboratory,
      date,
      status: { $in: ['approved', 'pending'] },
      $or: [
        { 
          startTime: { $lt: endTime }, 
          endTime: { $gt: startTime } 
        }
      ]
    }).populate('laboratory', 'name code');

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        error: `Time conflict with existing booking in ${conflictingBooking.laboratory.name}`
      });
    }

    // Check laboratory operating hours (basic validation)
    const lab = await require('../models/Laboratory').findById(laboratory);
    if (lab && lab.operatingHours) {
      const labOpen = lab.operatingHours.open || '08:00';
      const labClose = lab.operatingHours.close || '17:00';
      
      if (startTime < labOpen || endTime > labClose) {
        return res.status(400).json({
          success: false,
          error: `Booking outside laboratory operating hours (${labOpen} - ${labClose})`
        });
      }
    }

    // Check capacity
    if (lab && attendees > lab.capacity) {
      return res.status(400).json({
        success: false,
        error: `Attendees exceed laboratory capacity (max: ${lab.capacity})`
      });
    }

    const booking = new Booking({
      laboratory,
      date,
      startTime,
      endTime,
      purpose,
      attendees: parseInt(attendees),
      notes,
      user: req.user?.id || 'demo-user',
      status: 'pending'
    });

    await booking.save();
    await booking.populate('laboratory', 'name code location color');
    await booking.populate('user', 'username profile.fullName');

    res.status(201).json({ 
      success: true, 
      data: booking,
      message: 'Booking created successfully and pending approval'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update booking status (approve/reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: approved, rejected, or cancelled'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        status, 
        adminNotes, 
        processedAt: new Date(),
        processedBy: req.user?.id || 'admin'
      },
      { new: true }
    )
    .populate('laboratory', 'name code location')
    .populate('user', 'username profile.fullName email');

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ 
      success: true, 
      data: booking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { status } = req.query;
    
    const filter = { user: userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('laboratory', 'name code location color')
      .sort({ date: -1, startTime: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get bookings for calendar view
const getCalendarBookings = async (req, res) => {
  try {
    const { start, end, laboratory } = req.query;
    
    let filter = {
      status: { $in: ['approved', 'pending'] }
    };

    // Date range filter
    if (start && end) {
      filter.date = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    // Laboratory filter
    if (laboratory && laboratory !== 'all') {
      filter.laboratory = laboratory;
    }

    const bookings = await Booking.find(filter)
      .populate('laboratory', 'name code color')
      .populate('user', 'profile.fullName')
      .sort({ date: 1, startTime: 1 });

    // Format for calendar
    const calendarEvents = bookings.map(booking => ({
      id: booking._id,
      title: `${booking.laboratory.name} - ${booking.purpose}`,
      start: new Date(`${booking.date}T${booking.startTime}`),
      end: new Date(`${booking.date}T${booking.endTime}`),
      laboratory: booking.laboratory.name,
      labCode: booking.laboratory.code,
      purpose: booking.purpose,
      user: booking.user?.profile?.fullName || 'Unknown User',
      status: booking.status,
      attendees: booking.attendees,
      color: getStatusColor(booking.status),
      notes: booking.notes
    }));

    res.json({ success: true, data: calendarEvents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function for status colors
const getStatusColor = (status) => {
  const colors = {
    approved: '#10B981', // green
    pending: '#F59E0B',  // amber
    rejected: '#EF4444', // red
    cancelled: '#6B7280' // gray
  };
  return colors[status] || '#6B7280';
};

// Get booking statistics
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    
    // Weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyBookings = await Booking.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todaysBookings = await Booking.countDocuments({ date: today });

    res.json({
      success: true,
      data: {
        total: totalBookings,
        approved: approvedBookings,
        pending: pendingBookings,
        rejected: rejectedBookings,
        weekly: weeklyBookings,
        today: todaysBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, purpose, attendees, notes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Only allow updates for pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending bookings can be updated'
      });
    }

    // Check for time conflicts (excluding current booking)
    if (date || startTime || endTime) {
      const conflictFilter = {
        laboratory: booking.laboratory,
        date: date || booking.date,
        status: { $in: ['approved', 'pending'] },
        _id: { $ne: id },
        $or: [
          { 
            startTime: { $lt: endTime || booking.endTime }, 
            endTime: { $gt: startTime || booking.startTime } 
          }
        ]
      };

      const conflictingBooking = await Booking.findOne(conflictFilter)
        .populate('laboratory', 'name code');

      if (conflictingBooking) {
        return res.status(400).json({
          success: false,
          error: `Time conflict with existing booking in ${conflictingBooking.laboratory.name}`
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        date: date || booking.date,
        startTime: startTime || booking.startTime,
        endTime: endTime || booking.endTime,
        purpose: purpose || booking.purpose,
        attendees: attendees ? parseInt(attendees) : booking.attendees,
        notes: notes || booking.notes
      },
      { new: true }
    )
    .populate('laboratory', 'name code location color')
    .populate('user', 'username profile.fullName');

    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Only allow deletion for pending bookings or by admin
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending bookings can be deleted'
      });
    }

    await Booking.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  updateBooking,
  updateBookingStatus,
  getUserBookings,
  getCalendarBookings,
  getBookingStats,
  deleteBooking
};