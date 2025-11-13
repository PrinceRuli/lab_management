const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Laboratory name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Laboratory code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Code cannot exceed 10 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  equipment: [{
    name: String,
    quantity: Number,
    status: {
      type: String,
      enum: ['available', 'maintenance', 'out-of-service'],
      default: 'available'
    }
  }],
  // ✅ PERBAIKI BAGIAN INI - location sebagai Object
  location: {
    building: {
      type: String,
      trim: true
    },
    room: {
      type: String,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['available', 'maintenance', 'closed'],
    default: 'available'
  },
  features: [String],
  images: [String],
  operatingHours: {
    open: String, // Format: "08:00"
    close: String, // Format: "17:00"
    timezone: {
      type: String,
      default: 'UTC+7'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
laboratorySchema.index({ name: 'text', description: 'text' });
laboratorySchema.index({ code: 1 });
laboratorySchema.index({ status: 1 });

module.exports = mongoose.model('Laboratory', laboratorySchema);