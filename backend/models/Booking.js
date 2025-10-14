import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  pickupLocation: {
    branch: {
      type: String,
      required: [true, 'Pickup branch is required']
    },
    address: {
      type: String,
      required: [true, 'Pickup address is required']
    }
  },
  dropoffLocation: {
    branch: {
      type: String,
      required: [true, 'Dropoff branch is required']
    },
    address: {
      type: String,
      required: [true, 'Dropoff address is required']
    }
  },
  totalDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  extras: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  insurance: {
    type: {
      type: String,
      enum: ['basic', 'premium', 'full'],
      default: 'basic'
    },
    price: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash'],
    required: [true, 'Payment method is required']
  },
  driverInfo: {
    primaryDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    additionalDrivers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  notes: {
    customer: String,
    admin: String
  },
  cancellationReason: String,
  refundAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Validate booking dates
bookingSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'));
  }
  
  // Allow bookings for today and future dates
  const startDate = new Date(this.startDate);
  const today = new Date();
  
  // Use UTC dates to avoid timezone issues
  const startDateUTC = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  
  if (startDateUTC < todayUTC) {
    return next(new Error('Start date cannot be in the past'));
  }
  
  // Calculate total days for inclusive date range
  const timeDiff = this.endDate.getTime() - this.startDate.getTime();
  const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // For inclusive ranges: same day = 1 day, next day = 2 days, etc.
  this.totalDays = daysDifference === 0 ? 1 : daysDifference;
  
  next();
});

// Virtual for backward compatibility (totalPrice → totalAmount)
bookingSchema.virtual('totalPrice').get(function() {
  return this.totalAmount;
});

bookingSchema.virtual('totalPrice').set(function(value) {
  this.totalAmount = value;
});

// Ensure virtuals are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Index for efficient queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ car: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
