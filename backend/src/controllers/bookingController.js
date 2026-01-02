const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Lab = require('../models/Lab');
const User = require('../models/User');

// @desc    Get approved schedules for landing page
// @route   GET /api/bookings/schedules/approved
// @access  Public
const getApprovedSchedules = async (req, res) => {
  try {
    console.log('=== Fetching approved schedules for landing page ===');

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all approved bookings
    const schedules = await Booking.find({
      status: 'approved',
      bookingDate: { $gte: today }
    })
      .populate('lab', 'name location photo')
      .populate('user', 'name email')
      .populate('teacher', 'name email')
      .populate('approvedBy', 'name')
      .sort({ bookingDate: 1, startTime: 1 })

    console.log(`Found ${schedules.length} approved schedules`);

    // Format response for frontend
    const formattedSchedules = schedules.map(schedule => {
      // Format date to Indonesian format
      const bookingDate = new Date(schedule.bookingDate);
      const formattedDate = bookingDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        id: schedule._id,
        _id: schedule._id,
        teacherName: schedule.teacherName,
        teacher: schedule.teacher?.name || schedule.teacherName,
        subject: schedule.subject,
        activityTitle: schedule.activityTitle,
        activity: schedule.activityTitle,
        description: schedule.description,
        photo: schedule.photo || '/assets/images/lab_image.jpg',
        lab: schedule.lab?.name || 'Laboratory',
        labDetails: schedule.lab,
        day: schedule.day,
        date: formattedDate,
        rawDate: schedule.bookingDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        time: `${schedule.startTime} - ${schedule.endTime}`,
        classGroup: schedule.classGroup,
        status: schedule.status,
        approvedBy: schedule.approvedBy?.name,
        approvedAt: schedule.approvedAt,
        remarks: schedule.remarks,
        createdAt: schedule.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSchedules.length,
      data: formattedSchedules
    });
  } catch (error) {
    console.error('❌ Error fetching approved schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedules',
      error: error.message
    });
  }
};

// @desc    Get all schedules (public access)
// @route   GET /api/bookings/schedules
// @access  Public
const getAllSchedules = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      lab,
      status = 'approved',
      startDate,
      endDate,
      day,
      subject
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    let filter = { status: 'approved' };

    if (lab) filter.lab = lab;
    if (day) filter.day = day;
    if (subject) filter.subject = new RegExp(subject, 'i');

    if (startDate && endDate) {
      filter.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default: show future schedules
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.bookingDate = { $gte: today };
    }

    console.log('Schedule filter:', filter);

    const schedules = await Booking.find(filter)
      .populate('lab', 'name location')
      .populate('user', 'name')
      .populate('teacher', 'name')
      .populate('approvedBy', 'name')
      .sort({ bookingDate: 1, startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    const formattedSchedules = schedules.map(schedule => {
      const bookingDate = new Date(schedule.bookingDate);
      const formattedDate = bookingDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        id: schedule._id,
        _id: schedule._id,
        teacherName: schedule.teacherName,
        subject: schedule.subject,
        activityTitle: schedule.activityTitle,
        description: schedule.description,
        photo: schedule.photo || '/assets/images/lab_image.jpg',
        lab: schedule.lab?.name,
        labId: schedule.lab?._id,
        day: schedule.day,
        date: formattedDate,
        rawDate: schedule.bookingDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        time: `${schedule.startTime} - ${schedule.endTime}`,
        classGroup: schedule.classGroup,
        status: schedule.status,
        approvedBy: schedule.approvedBy?.name,
        approvedAt: schedule.approvedAt,
        createdAt: schedule.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSchedules.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: formattedSchedules
    });
  } catch (error) {
    console.error('❌ Error fetching all schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get today's schedules
// @route   GET /api/bookings/schedules/today
// @access  Public
const getTodaySchedules = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await Booking.find({
      status: 'approved',
      bookingDate: {
        $gte: today,
        $lt: tomorrow
      }
    })
      .populate('lab', 'name location')
      .populate('teacher', 'name')
      .sort({ startTime: 1 })
      .limit(10);

    const formattedSchedules = schedules.map(schedule => ({
      id: schedule._id,
      teacherName: schedule.teacherName,
      subject: schedule.subject,
      activityTitle: schedule.activityTitle,
      lab: schedule.lab?.name,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      time: `${schedule.startTime} - ${schedule.endTime}`,
      classGroup: schedule.classGroup
    }));

    res.status(200).json({
      success: true,
      count: formattedSchedules.length,
      date: today.toISOString().split('T')[0],
      data: formattedSchedules
    });
  } catch (error) {
    console.error('Error fetching today schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    console.log('=== Create Booking debug ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user?.id);
    console.log('Lab dari request:', req.body.lab || req.body.labId);


    // 🔥 NORMALISASI lab
    const labId = req.body.lab || req.body.labId;

    console.log('Normalized labId:', labId);

    if (!labId) {
      console.error('Lab ID is missing in the request');
      return res.status(400).json({
        message: 'Missing required fields: lab',
      });
    }

    const required = [
      'bookingDate',
      'startTime',
      'endTime',
      'teacherName',
      'subject',
      'activityTitle',
      'classGroup',
      'day',
    ];

    const missing = required.filter(
      (k) => !req.body[k] || req.body[k].toString().trim() === ''
    );

    if (missing.length) {
      console.error('Missing required fields:', missing);
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const {
      bookingDate,
      startTime,
      endTime,
      teacherName,
      subject,
      activityTitle,
      description,
      day,
      classGroup,
    } = req.body;

    // 🔍 CEK LAB
    const labDoc = await Lab.findById(labId);
    if (!labDoc) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // ⏰ NORMALISASI JAM
    const normalizeTime = (t) => {
      const [h, m] = String(t).split(':');
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    };

    const normStart = normalizeTime(startTime);
    const normEnd = normalizeTime(endTime);

    // 🚫 CEK TABRAKAN
    const conflict = await Booking.findOne({
      lab: labId,
      bookingDate: new Date(bookingDate),
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startTime: { $lt: normEnd }, endTime: { $gt: normStart } },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        message: 'Time slot already booked',
      });
    }

    // ✅ SIMPAN
    const booking = await Booking.create({
      ...req.body,
      user: req.user.id,
      teacherName: req.user.name
    });

    // AUTO-CREATE NOTIFICATION untuk teacher
    await Notification.create({
      recipient: req.user.id,
      booking: booking._id,
      message: `Booking untuk "${req.body.activityTitle || 'Laboratorium'}" telah diajukan. Menunggu persetujuan admin.`,
      read: false
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

// @desc    Update booking status - PERBAIKI NOTIFICATION
// @route   PUT /api/bookings/:id
// @access  Private/Admin or Teacher
const updateBookingStatus = async (req, res) => {
  try {
    const { status, remarks, rejectionReason } = req.body;
    
    let booking = await Booking.findById(req.params.id)
      .populate('lab', 'name location')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    // Authorization check
    const isOwner = booking.user._id.toString() === req.user.id;
    const isTeacher = booking.teacher?.toString() === req.user.id;
    
    if (req.user.role === 'teacher' && !isOwner && !isTeacher) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this booking' 
      });
    }

    // Only admin can approve/reject bookings
    if (['approved', 'rejected'].includes(status) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can approve or reject bookings'
      });
    }

    // Update booking
    const updateData = { status };
    
    if (remarks !== undefined) updateData.remarks = remarks;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    
    if (status === 'approved' || status === 'rejected') {
      updateData.approvedBy = req.user.id;
      updateData.approvedAt = new Date();
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('lab', 'name location')
      .populate('user', 'name email');

    // ✅ AUTO-CREATE NOTIFICATION untuk guru yang buat booking
    if (status && status !== booking.status) {
      let message = '';
      let notificationType = 'info';
      
      const labName = booking.lab?.name || 'Laboratorium';
      const activity = booking.activityTitle || 'Booking';
      const bookingDate = new Date(booking.bookingDate).toLocaleDateString('id-ID');
      const time = `${booking.startTime} - ${booking.endTime}`;
      
      switch (status) {
        case 'approved':
          message = `🎉 Booking Anda untuk "${activity}" di ${labName} pada ${bookingDate} (${time}) telah DISETUJUI.`;
          notificationType = 'success';
          break;
          
        case 'rejected':
          const reason = rejectionReason ? ` Alasan: ${rejectionReason}` : '';
          message = `❌ Booking Anda untuk "${activity}" di ${labName} telah DITOLAK.${reason}`;
          notificationType = 'error';
          break;
          
        case 'pending':
          message = `⏳ Booking untuk "${activity}" di ${labName} sedang ditinjau ulang oleh admin.`;
          break;
          
        case 'cancelled':
          message = `🚫 Booking untuk "${activity}" di ${labName} telah DIBATALKAN.`;
          break;
          
        default:
          message = `📝 Status booking "${activity}" diubah menjadi ${status}.`;
      }
      
      // Create notification for the teacher who made the booking
      await Notification.create({
        recipient: booking.user._id,
        booking: booking._id,
        message: message,
        type: notificationType,
        read: false
      });
      
      console.log(`📢 Notification created for teacher ${booking.user._id}: ${message}`);
    }

    // Juga buat notifikasi untuk admin jika teacher update booking mereka sendiri
    if (req.user.role === 'teacher' && status === 'pending') {
      // Find admin users to notify (assuming admin role exists)
      // You might need to adjust this based on your user model
      const adminUsers = await User.find({ role: 'admin' }).select('_id');
      
      for (const admin of adminUsers) {
        await Notification.create({
          recipient: admin._id,
          booking: booking._id,
          message: `📋 Teacher ${req.user.name} mengajukan perubahan pada booking "${booking.activityTitle}"`,
          type: 'info',
          read: false
        });
      }
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
    
  } catch (error) {
    console.error('❌ Update booking status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
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

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (admin or owner)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Allow admin or the user who created the booking to delete
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.remove();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus semua karakter yang tidak perlu di akhir file
module.exports = {
  getApprovedSchedules,
  getAllSchedules,
  getTodaySchedules,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getUserBookings,
  deleteBooking,
};