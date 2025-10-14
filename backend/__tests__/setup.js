import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Connect to test database before all tests
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/car_rental_test';
  
  try {
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    await mongoose.connect(MONGODB_URI);
    
    // Ensure all indexes are created
    await mongoose.connection.syncIndexes();
    
    console.log('✅ Connected to test database');
  } catch (error) {
    console.error('❌ Test database connection error:', error);
    throw error;
  }
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log('✅ Disconnected from test database');
});

// Global test utilities
global.testUtils = {
  // Create a test user
  createTestUser: async (User, overrides = {}) => {
    const defaultUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Test123!@#',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      role: 'customer',
      isVerified: true,
      ...overrides
    };
    
    const user = new User(defaultUser);
    await user.save();
    return user;
  },

  // Create a test admin
  createTestAdmin: async (User, overrides = {}) => {
    // Generate unique email if not provided
    const uniqueEmail = overrides.email || `admin-${Date.now()}@example.com`;
    return global.testUtils.createTestUser(User, {
      email: uniqueEmail,
      role: 'admin',
      ...overrides
    });
  },

  // Create a test car
  createTestCar: async (Car, overrides = {}) => {
    const defaultCar = {
      name: 'Test Car',
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      category: 'midsize',
      transmission: 'automatic',
      fuelType: 'gasoline',
      seats: 5,
      pricePerDay: 50,
      location: 'Mohammedia',
      description: 'Test car description',
      features: ['Air Conditioning', 'Bluetooth'],
      image: 'test-image.jpg',
      images: ['test-image.jpg'],
      availability: true,
      ...overrides
    };
    
    const car = new Car(defaultCar);
    await car.save();
    return car;
  },

  // Create a test booking
  createTestBooking: async (Booking, userId, carId, overrides = {}) => {
    const defaultBooking = {
      user: userId,
      car: carId,
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-20'),
      pickupLocation: {
        branch: 'Mohammedia Office',
        address: 'Derb Chabab A el Alia, Mohammedia 28810'
      },
      dropoffLocation: {
        branch: 'Mohammedia Office',
        address: 'Derb Chabab A el Alia, Mohammedia 28810'
      },
      totalDays: 5,
      pricePerDay: 50,
      totalAmount: 250,
      status: 'pending',
      paymentMethod: 'credit_card',
      driverInfo: {
        primaryDriver: userId
      },
      extras: [],
      ...overrides
    };
    
    const booking = new Booking(defaultBooking);
    await booking.save();
    return booking;
  }
};
