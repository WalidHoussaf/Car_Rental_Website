import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Car year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  category: {
    type: String,
    required: [true, 'Car category is required'],
    enum: ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'convertible', 'van']
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['manual', 'automatic']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['gasoline', 'diesel', 'hybrid', 'electric']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [2, 'Car must have at least 2 seats'],
    max: [9, 'Car cannot have more than 9 seats']
  },
  doors: {
    type: Number,
    required: [true, 'Number of doors is required'],
    min: [2, 'Car must have at least 2 doors'],
    max: [5, 'Car cannot have more than 5 doors']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    required: true
  }],
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage cannot be negative']
  },
  location: {
    branch: {
      type: String,
      required: [true, 'Branch location is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  maintenanceStatus: {
    type: String,
    enum: ['available', 'maintenance', 'repair'],
    default: 'available'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
carSchema.index({ make: 'text', model: 'text', category: 'text' });
carSchema.index({ 'location.branch': 1 });
carSchema.index({ availability: 1, maintenanceStatus: 1 });

export default mongoose.model('Car', carSchema);
