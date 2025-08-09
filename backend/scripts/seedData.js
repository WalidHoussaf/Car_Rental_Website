import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Car from '../models/Car.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Car.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@carrental.com',
      password: adminPassword,
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'AC',
        zipCode: '12345',
        country: 'USA'
      },
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('Created admin user');

    // Sample cars data
    const carsData = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        category: 'midsize',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        pricePerDay: 45,
        features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'USB Ports'],
        images: ['https://via.placeholder.com/400x300?text=Toyota+Camry'],
        licensePlate: 'ABC123',
        mileage: 15000,
        location: {
          branch: 'Downtown',
          address: '123 Main St, Downtown',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        }
      },
      {
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        category: 'compact',
        transmission: 'manual',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        pricePerDay: 35,
        features: ['Air Conditioning', 'Bluetooth', 'USB Ports'],
        images: ['https://via.placeholder.com/400x300?text=Honda+Civic'],
        licensePlate: 'DEF456',
        mileage: 25000,
        location: {
          branch: 'Airport',
          address: '456 Airport Rd, Terminal 1',
          coordinates: { latitude: 40.6892, longitude: -74.1745 }
        }
      },
      {
        make: 'BMW',
        model: 'X5',
        year: 2023,
        category: 'luxury',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 7,
        doors: 5,
        pricePerDay: 95,
        features: ['Leather Seats', 'Navigation', 'Premium Sound', 'Sunroof', 'All-Wheel Drive'],
        images: ['https://via.placeholder.com/400x300?text=BMW+X5'],
        licensePlate: 'GHI789',
        mileage: 8000,
        location: {
          branch: 'Uptown',
          address: '789 Luxury Ave, Uptown',
          coordinates: { latitude: 40.7831, longitude: -73.9712 }
        }
      },
      {
        make: 'Ford',
        model: 'Escape',
        year: 2022,
        category: 'suv',
        transmission: 'automatic',
        fuelType: 'hybrid',
        seats: 5,
        doors: 5,
        pricePerDay: 55,
        features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'All-Wheel Drive'],
        images: ['https://via.placeholder.com/400x300?text=Ford+Escape'],
        licensePlate: 'JKL012',
        mileage: 18000,
        location: {
          branch: 'Downtown',
          address: '123 Main St, Downtown',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        }
      },
      {
        make: 'Nissan',
        model: 'Versa',
        year: 2021,
        category: 'economy',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        pricePerDay: 30,
        features: ['Air Conditioning', 'Bluetooth'],
        images: ['https://via.placeholder.com/400x300?text=Nissan+Versa'],
        licensePlate: 'MNO345',
        mileage: 35000,
        location: {
          branch: 'Airport',
          address: '456 Airport Rd, Terminal 1',
          coordinates: { latitude: 40.6892, longitude: -74.1745 }
        }
      },
      {
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2023,
        category: 'luxury',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        pricePerDay: 85,
        features: ['Leather Seats', 'Navigation', 'Premium Sound', 'Heated Seats'],
        images: ['https://via.placeholder.com/400x300?text=Mercedes+C-Class'],
        licensePlate: 'PQR678',
        mileage: 12000,
        location: {
          branch: 'Uptown',
          address: '789 Luxury Ave, Uptown',
          coordinates: { latitude: 40.7831, longitude: -73.9712 }
        }
      },
      {
        make: 'Chevrolet',
        model: 'Tahoe',
        year: 2022,
        category: 'suv',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 8,
        doors: 5,
        pricePerDay: 75,
        features: ['Air Conditioning', 'Bluetooth', 'Third Row Seating', 'Towing Package'],
        images: ['https://via.placeholder.com/400x300?text=Chevrolet+Tahoe'],
        licensePlate: 'STU901',
        mileage: 22000,
        location: {
          branch: 'Downtown',
          address: '123 Main St, Downtown',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        }
      },
      {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        category: 'luxury',
        transmission: 'automatic',
        fuelType: 'electric',
        seats: 5,
        doors: 4,
        pricePerDay: 70,
        features: ['Autopilot', 'Premium Interior', 'Supercharging', 'Over-the-Air Updates'],
        images: ['https://via.placeholder.com/400x300?text=Tesla+Model+3'],
        licensePlate: 'VWX234',
        mileage: 5000,
        location: {
          branch: 'Tech District',
          address: '321 Innovation Blvd, Tech District',
          coordinates: { latitude: 40.7589, longitude: -73.9851 }
        }
      }
    ];

    // Insert cars
    await Car.insertMany(carsData);
    console.log(`Created ${carsData.length} sample cars`);

    console.log('✅ Seed data created successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@carrental.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed script
seedData();
