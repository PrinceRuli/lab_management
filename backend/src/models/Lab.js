const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  // Field dari LabManagement component
  name: {
    type: String,
    required: [true, 'Nama lab harus diisi'],
    trim: true,
    unique: true,
  },
  location: {
    type: String,
    required: [true, 'Lokasi lab harus diisi'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Kapasitas harus diisi'],
    min: [1, 'Kapasitas minimal adalah 1'],
    max: [1000, 'Kapasitas maksimal adalah 1000'],
    validate: {
      validator: Number.isInteger,
      message: 'Kapasitas harus berupa angka bulat',
    }
  },
  facilities: [{  
    type: String,
    trim: true,
  }],

  images: [{
    type: String,
  }],

  status: {  
    type: String,
    enum: ['available', 'occupied', 'maintenance'], 
    default: 'available'
  },
  openingTime: {
    type: String,
    default: '08:00',
  },
  closingTime: {
    type: String,
    default: '17:00',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  maintenanceSchedule: Date,
    status: {
      type: String,
      enum: ['active', 'maintenance', 'closed'],
      default: 'active',
    },
    lastMaintenance: Date,
    nextMaintenance: Date
});

// Middleware untuk update timestamp
labSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual untuk mendapatkan id sebagai string
labSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Configure toJSON
labSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Lab', labSchema);