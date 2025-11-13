const Laboratory = require('../models/Laboratory');

// @desc    Get all laboratories
// @route   GET /api/labs
// @access  Public
const getLaboratories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      filter.status = status;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const laboratories = await Laboratory.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username email profile.fullName');

    const total = await Laboratory.countDocuments(filter);

    res.json({
      success: true,
      data: laboratories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get laboratories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get single laboratory
// @route   GET /api/labs/:id
// @access  Public
const getLaboratory = async (req, res) => {
  try {
    const laboratory = await Laboratory.findById(req.params.id)
      .populate('createdBy', 'username email profile.fullName');

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    res.json({
      success: true,
      data: laboratory
    });

  } catch (error) {
    console.error('Get laboratory error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Create laboratory
// @route   POST /api/labs
// @access  Private/Admin
const createLaboratory = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      capacity,
      equipment,
      location,
      features,
      operatingHours
    } = req.body;

    // Check if laboratory code already exists
    const existingLab = await Laboratory.findOne({ code });
    if (existingLab) {
      return res.status(400).json({
        success: false,
        message: 'Laboratory code already exists'
      });
    }

    const laboratory = new Laboratory({
      name,
      code: code.toUpperCase(),
      description,
      capacity,
      equipment: equipment || [],
      // location: location || {},
      features: features || [],
      operatingHours: operatingHours || {},
      createdBy: req.user.id
    });

    const savedLaboratory = await laboratory.save();
    await savedLaboratory.populate('createdBy', 'username email profile.fullName');

    res.status(201).json({
      success: true,
      message: 'Laboratory created successfully',
      data: savedLaboratory
    });

  } catch (error) {
    console.error('Create laboratory error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update laboratory
// @route   PUT /api/labs/:id
// @access  Private/Admin
const updateLaboratory = async (req, res) => {
  try {
    const {
      name,
      description,
      capacity,
      equipment,
      location,
      status,
      features,
      operatingHours
    } = req.body;

    const laboratory = await Laboratory.findById(req.params.id);

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    // Update fields
    if (name) laboratory.name = name;
    if (description) laboratory.description = description;
    if (capacity) laboratory.capacity = capacity;
    if (equipment) laboratory.equipment = equipment;
    if (location) laboratory.location = location;
    if (status) laboratory.status = status;
    if (features) laboratory.features = features;
    if (operatingHours) laboratory.operatingHours = operatingHours;

    const updatedLaboratory = await laboratory.save();
    await updatedLaboratory.populate('createdBy', 'username email profile.fullName');

    res.json({
      success: true,
      message: 'Laboratory updated successfully',
      data: updatedLaboratory
    });

  } catch (error) {
    console.error('Update laboratory error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete laboratory
// @route   DELETE /api/labs/:id
// @access  Private/Admin
const deleteLaboratory = async (req, res) => {
  try {
    const laboratory = await Laboratory.findById(req.params.id);

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    await Laboratory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Laboratory deleted successfully'
    });

  } catch (error) {
    console.error('Delete laboratory error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getLaboratories,
  getLaboratory,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory
};