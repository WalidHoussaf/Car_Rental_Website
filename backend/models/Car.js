import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  // Basic car information
  name: {
    type: String,
    required: [true, 'Car name is required'],
    trim: true
  },
  make: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  category: {
    type: String,
    required: [true, 'Car category is required'],
    enum: ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'sport', 'convertible', 'van']
  },
  
  // Pricing and rating
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Location
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  
  // Car details
  features: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  
  // Technical specifications
  specifications: {
    engine: String,
    power: String,
    torque: String,
    acceleration: String,
    fuelEconomy: String,
    range: String,
    seatingCapacity: Number,
    luggage: Number,
    doors: Number,
    transmission: String,
    horsepower: Number,
    topSpeed: String,
    weight: String,
    length: String,
    width: String,
    height: String,
    wheelbase: String,
    driveType: String
  },
  
  // Images
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  images: [{
    type: String
  }],
  gallery: [{
    path: String,
    alt: String
  }],
  galleryRef: String,
  
  // Legacy fields for backward compatibility
  transmission: {
    type: String,
    enum: ['manual', 'automatic', '8-Speed Automatic', '9-Speed Automatic', '10-Speed Automatic', '8-Speed Dual-Clutch', '7-Speed Dual-Clutch', 'Single-Speed']
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'hybrid', 'electric']
  },
  seats: {
    type: Number,
    min: [2, 'Car must have at least 2 seats'],
    max: [9, 'Car cannot have more than 9 seats']
  },
  doors: {
    type: Number,
    min: [2, 'Car must have at least 2 doors'],
    max: [5, 'Car cannot have more than 5 doors']
  },
  availability: {
    type: Boolean,
    default: true
  },
  maintenanceStatus: {
    type: String,
    enum: ['available', 'maintenance', 'repair'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Index for search functionality
carSchema.index({ make: 'text', model: 'text', category: 'text' });
carSchema.index({ location: 1 });
carSchema.index({ availability: 1, maintenanceStatus: 1 });

export default mongoose.model('Car', carSchema);
