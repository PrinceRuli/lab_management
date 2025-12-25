const Lab = require('../models/Lab');

// @desc    Get all labs
// @route   GET /api/labs
// @access  Public
const getLabs = async (req, res) => {
  try {
    const labs = await Lab.find().sort('-createdAt').populate('createdBy', 'name email');
    
    res.json({
      success: true,
      count: labs.length,
      data: labs
    });
  } catch (error) {
    console.error('Get labs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil data lab'
    });
  }
};

// @desc    Get single lab
// @route   GET /api/labs/:id
// @access  Public
const getLabById = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id).populate('createdBy', 'name email');
    
    if (lab) {
      res.json({
        success: true,
        data: lab
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Lab tidak ditemukan' 
      });
    }
  } catch (error) {
    console.error('Get lab by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil data lab'
    });
  }
};

// @desc    Create lab
// @route   POST /api/labs
// @access  Private/Admin
const createLab = async (req, res) => {
  try {
    console.log('📥 CREATE LAB REQUEST:', {
      body: req.body,
      user: req.user
    });

    const { name, capacity, location, facilities, status, openingTime, closingTime } = req.body;
    
    // ⭐⭐ PERBAIKAN: Validasi lebih lengkap ⭐⭐
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Nama lab harus diisi' 
      });
    }

    if (!capacity) {
      return res.status(400).json({ 
        success: false,
        message: 'Kapasitas lab harus diisi' 
      });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Lokasi lab harus diisi' 
      });
    }

    // Validasi kapasitas
    const capacityNum = Number(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Kapasitas harus berupa angka positif'
      });
    }

    // ⭐⭐ PERBAIKAN: Parsing fasilitas yang lebih robust ⭐⭐
    let facilitiesArray = [];
    if (facilities !== undefined && facilities !== null) {
      if (Array.isArray(facilities)) {
        facilitiesArray = facilities;
      } else if (typeof facilities === 'string' && facilities.trim()) {
        facilitiesArray = facilities
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
    }

    console.log('🔧 Parsed facilities:', facilitiesArray);

    // ⭐⭐ PERBAIKAN: Data yang akan disimpan ⭐⭐
    const labData = {
      name: name.trim(),
      location: location.trim(),
      capacity: Math.floor(capacityNum), // Pastikan integer
      facilities: facilitiesArray,
      status: status || 'available', // Gunakan 'available' bukan 'tersedia'
      openingTime: openingTime || '08:00',
      closingTime: closingTime || '17:00',
      createdBy: req.user?.id // Tambahkan createdBy dari user yang login
    };

    console.log('💾 Lab data to be created:', labData);

    const lab = await Lab.create(labData);

    console.log('✅ Lab created successfully:', {
      _id: lab._id,
      name: lab.name,
      location: lab.location,
      capacity: lab.capacity,
      facilities: lab.facilities,
      status: lab.status
    });
    
    res.status(201).json({
      success: true,
      data: lab
    });
  } catch (error) {
    console.error('❌ Create lab error:', error);
    
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Nama lab sudah digunakan' 
      });
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Gagal membuat lab',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update lab
// @route   PUT /api/labs/:id
// @access  Private/Admin
const updateLab = async (req, res) => {
  try {
    console.log('🔄 UPDATE LAB REQUEST:');
    console.log('📥 Params:', req.params);
    console.log('📦 Request body:', req.body);
    console.log('👤 User:', req.user?.id);

    const { id } = req.params;
    
    // ⭐⭐ PERBAIKAN: Validasi ID ⭐⭐
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID lab tidak valid'
      });
    }

    console.log('🔍 Mencari lab dengan ID:', id);
    const lab = await Lab.findById(id);
    
    if (!lab) {
      console.error('❌ Lab tidak ditemukan dengan ID:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Lab tidak ditemukan' 
      });
    }
    
    console.log('✅ Lab ditemukan:', lab.name);

    // ⭐⭐ PERBAIKAN: Validasi data input ⭐⭐
    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama lab tidak boleh kosong'
        });
      }
      lab.name = req.body.name.trim();
      console.log('✏️ Update name:', lab.name);
    }

    if (req.body.location !== undefined) {
      if (!req.body.location.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Lokasi lab tidak boleh kosong'
        });
      }
      lab.location = req.body.location.trim();
      console.log('✏️ Update location:', lab.location);
    }

    if (req.body.capacity !== undefined) {
      const capacityNum = Number(req.body.capacity);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Kapasitas harus berupa angka positif'
        });
      }
      lab.capacity = Math.floor(capacityNum);
      console.log('✏️ Update capacity:', lab.capacity);
    }

    // ⭐⭐ PERBAIKAN: Handle facilities dengan benar ⭐⭐
    if (req.body.facilities !== undefined) {
      if (Array.isArray(req.body.facilities)) {
        lab.facilities = req.body.facilities;
      } else if (typeof req.body.facilities === 'string' && req.body.facilities.trim()) {
        lab.facilities = req.body.facilities
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else {
        lab.facilities = [];
      }
      console.log('✏️ Update facilities:', lab.facilities);
    }

    // ⭐⭐ PERBAIKAN: Status yang benar - sesuai dengan frontend ⭐⭐
    if (req.body.status !== undefined) {
      const validStatuses = ['available', 'occupied', 'maintenance'];
      if (validStatuses.includes(req.body.status)) {
        lab.status = req.body.status;
        console.log('✏️ Update status:', lab.status);
      } else {
        console.warn('⚠️ Invalid status:', req.body.status);
      }
    }

    // Jam operasional
    if (req.body.openingTime !== undefined) {
      lab.openingTime = req.body.openingTime;
      console.log('✏️ Update openingTime:', lab.openingTime);
    }

    if (req.body.closingTime !== undefined) {
      lab.closingTime = req.body.closingTime;
      console.log('✏️ Update closingTime:', lab.closingTime);
    }

    console.log('💾 Saving updated lab...');
    const updatedLab = await lab.save();
    
    console.log('✅ Lab updated successfully:', {
      id: updatedLab._id,
      name: updatedLab.name,
      location: updatedLab.location,
      capacity: updatedLab.capacity,
      facilities: updatedLab.facilities,
      status: updatedLab.status,
      openingTime: updatedLab.openingTime,
      closingTime: updatedLab.closingTime
    });

    res.json({
      success: true,
      data: updatedLab
    });

  } catch (error) {
    console.error('❌ Update lab error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Nama lab sudah digunakan' 
      });
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Gagal memperbarui lab',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete lab
// @route   DELETE /api/labs/:id
// @access  Private/Admin
const deleteLab = async (req, res) => {
  try {
    console.log('🗑️ DELETE LAB REQUEST:');
    console.log('ID:', req.params.id);
    console.log('User:', req.user?.id);
    
    const { id } = req.params;
    
    // Validasi ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID lab tidak valid'
      });
    }

    console.log('🔍 Mencari lab untuk dihapus...');
    const lab = await Lab.findByIdAndDelete(id);
    
    if (!lab) {
      console.error('❌ Lab tidak ditemukan dengan ID:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Lab tidak ditemukan' 
      });
    }
    
    console.log('✅ Lab deleted:', {
      id: lab._id,
      name: lab.name
    });
    
    res.json({
      success: true,
      message: 'Lab berhasil dihapus',
      data: { 
        id: lab._id, 
        name: lab.name 
      }
    });
  } catch (error) {
    console.error('❌ Delete lab error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal menghapus lab',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get lab statistics
// @route   GET /api/labs/stats
// @access  Public
const getLabStats = async (req, res) => {
  try {
    const total = await Lab.countDocuments();
    const tersedia = await Lab.countDocuments({ status: 'available' });
    const digunakan = await Lab.countDocuments({ status: 'occupied' });
    const maintenance = await Lab.countDocuments({ status: 'maintenance' });
    
    res.json({
      success: true,
      data: {
        total,
        tersedia,
        digunakan,
        maintenance
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil statistik'
    });
  }
};

module.exports = {
  getLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
  getLabStats
};