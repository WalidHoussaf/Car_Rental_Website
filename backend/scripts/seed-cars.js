import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const seedCars = async () => {
  try {
    // Check if MONGODB_URI is set
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set in environment variables!');
      console.log('\n💡 Solutions:');
      console.log('   1. Create a .env file in the backend directory');
      console.log('   2. Copy from .env.example: cp .env.example .env');
      console.log('   3. Update MONGODB_URI with your MongoDB connection string');
      console.log('\n   Example for local MongoDB:');
      console.log('   MONGODB_URI=mongodb://localhost:27017/car_rental_db');
      console.log('\n   Example for MongoDB with auth:');
      console.log('   MONGODB_URI=mongodb://username:password@localhost:27017/car_rental_db');
      console.log('\n   Example for MongoDB Atlas:');
      console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car_rental_db');
      process.exit(1);
    }
    
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database:', mongoose.connection.name);
    
    // Check if cars already exist
    const existingCars = await Car.countDocuments();
    if (existingCars > 0) {
      console.log(`⚠️  ${existingCars} cars already exist. Skipping...`);
      await mongoose.connection.close();
      return;
    }
    
    // Sample car data
    const cars = [
      // Economy Cars
      {
        name: 'Toyota Corolla 2024',
        make: 'Toyota',
        model: 'Corolla',
        year: 2024,
        category: 'economy',
        pricePerDay: 45,
        rating: 4.5,
        location: 'Mohammedia',
        features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'Backup Camera', 'Cruise Control'],
        description: 'Reliable and fuel-efficient sedan perfect for city driving and daily commutes.',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
        images: [],
        specifications: {
          engine: '1.8L 4-Cylinder',
          horsepower: '139 HP',
          acceleration: '0-60 mph in 8.2s',
          fuelEconomy: '32 MPG City / 41 MPG Highway',
          seatingCapacity: 5,
          luggage: 2,
          doors: 4,
          transmission: 'CVT Automatic',
          driveType: 'Front-Wheel Drive'
        }
      },
      {
        name: 'Honda Civic 2024',
        make: 'Honda',
        model: 'Civic',
        year: 2024,
        category: 'compact',
        pricePerDay: 50,
        rating: 4.6,
        location: 'Casablanca',
        features: ['Air Conditioning', 'Bluetooth', 'Apple CarPlay', 'Android Auto', 'Lane Assist'],
        description: 'Modern compact car with excellent fuel economy and advanced safety features.',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        images: [],
        specifications: {
          engine: '2.0L 4-Cylinder',
          horsepower: '158 HP',
          acceleration: '0-60 mph in 7.5s',
          fuelEconomy: '31 MPG City / 40 MPG Highway',
          seatingCapacity: 5,
          luggage: 2,
          doors: 4,
          transmission: 'CVT Automatic',
          driveType: 'Front-Wheel Drive'
        }
      },
      // Midsize Cars
      {
        name: 'Toyota Camry 2024',
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        category: 'midsize',
        pricePerDay: 65,
        rating: 4.7,
        location: 'Mohammedia',
        features: ['Leather Seats', 'Sunroof', 'Navigation', 'Heated Seats', 'Wireless Charging'],
        description: 'Spacious midsize sedan with premium features and smooth ride quality.',
        transmission: 'automatic',
        fuelType: 'hybrid',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        images: [],
        specifications: {
          engine: '2.5L Hybrid 4-Cylinder',
          horsepower: '208 HP',
          acceleration: '0-60 mph in 7.1s',
          fuelEconomy: '51 MPG City / 53 MPG Highway',
          seatingCapacity: 5,
          luggage: 3,
          doors: 4,
          transmission: '8-Speed Automatic',
          driveType: 'Front-Wheel Drive'
        }
      },
      {
        name: 'Honda Accord 2024',
        make: 'Honda',
        model: 'Accord',
        year: 2024,
        category: 'midsize',
        pricePerDay: 68,
        rating: 4.8,
        location: 'Casablanca',
        features: ['Leather Seats', 'Sunroof', 'Navigation', 'Adaptive Cruise Control', 'Blind Spot Monitor'],
        description: 'Premium midsize sedan with cutting-edge technology and comfort.',
        transmission: 'automatic',
        fuelType: 'hybrid',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        images: [],
        specifications: {
          engine: '2.0L Hybrid 4-Cylinder',
          horsepower: '204 HP',
          acceleration: '0-60 mph in 6.9s',
          fuelEconomy: '48 MPG City / 47 MPG Highway',
          seatingCapacity: 5,
          luggage: 3,
          doors: 4,
          transmission: 'CVT Automatic',
          driveType: 'Front-Wheel Drive'
        }
      },
      // SUVs
      {
        name: 'Toyota RAV4 2024',
        make: 'Toyota',
        model: 'RAV4',
        year: 2024,
        category: 'suv',
        pricePerDay: 75,
        rating: 4.6,
        location: 'Mohammedia',
        features: ['All-Wheel Drive', 'Roof Rack', 'Power Liftgate', 'Panoramic Sunroof', 'Heated Seats'],
        description: 'Versatile SUV perfect for family trips and outdoor adventures.',
        transmission: 'automatic',
        fuelType: 'hybrid',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        images: [],
        specifications: {
          engine: '2.5L Hybrid 4-Cylinder',
          horsepower: '219 HP',
          acceleration: '0-60 mph in 7.8s',
          fuelEconomy: '41 MPG City / 38 MPG Highway',
          seatingCapacity: 5,
          luggage: 4,
          doors: 4,
          transmission: '8-Speed Automatic',
          driveType: 'All-Wheel Drive'
        }
      },
      {
        name: 'Honda CR-V 2024',
        make: 'Honda',
        model: 'CR-V',
        year: 2024,
        category: 'suv',
        pricePerDay: 78,
        rating: 4.7,
        location: 'Casablanca',
        features: ['All-Wheel Drive', 'Hands-Free Liftgate', 'Wireless CarPlay', 'Panoramic Sunroof', 'Heated Steering Wheel'],
        description: 'Spacious and comfortable SUV with advanced safety and technology features.',
        transmission: 'automatic',
        fuelType: 'hybrid',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        images: [],
        specifications: {
          engine: '2.0L Hybrid 4-Cylinder',
          horsepower: '204 HP',
          acceleration: '0-60 mph in 7.5s',
          fuelEconomy: '40 MPG City / 35 MPG Highway',
          seatingCapacity: 5,
          luggage: 4,
          doors: 4,
          transmission: 'CVT Automatic',
          driveType: 'All-Wheel Drive'
        }
      },
      // Luxury Cars
      {
        name: 'BMW 3 Series 2024',
        make: 'BMW',
        model: '3 Series',
        year: 2024,
        category: 'luxury',
        pricePerDay: 120,
        rating: 4.9,
        location: 'Casablanca',
        features: ['Premium Leather', 'Harman Kardon Sound', 'Adaptive LED Headlights', 'Gesture Control', 'Wireless Charging'],
        description: 'Luxury sports sedan combining performance, comfort, and cutting-edge technology.',
        transmission: '8-Speed Automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        images: [],
        specifications: {
          engine: '2.0L Turbocharged 4-Cylinder',
          horsepower: '255 HP',
          acceleration: '0-60 mph in 5.6s',
          fuelEconomy: '26 MPG City / 36 MPG Highway',
          seatingCapacity: 5,
          luggage: 3,
          doors: 4,
          transmission: '8-Speed Automatic',
          driveType: 'Rear-Wheel Drive'
        }
      },
      {
        name: 'Mercedes-Benz C-Class 2024',
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2024,
        category: 'luxury',
        pricePerDay: 130,
        rating: 4.9,
        location: 'Casablanca',
        features: ['Nappa Leather', 'Burmester Sound', 'Ambient Lighting', 'Augmented Reality Navigation', 'Massage Seats'],
        description: 'Elegant luxury sedan with exceptional comfort and advanced driver assistance systems.',
        transmission: '9-Speed Automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        images: [],
        specifications: {
          engine: '2.0L Turbocharged 4-Cylinder',
          horsepower: '255 HP',
          acceleration: '0-60 mph in 5.9s',
          fuelEconomy: '25 MPG City / 35 MPG Highway',
          seatingCapacity: 5,
          luggage: 3,
          doors: 4,
          transmission: '9-Speed Automatic',
          driveType: 'Rear-Wheel Drive'
        }
      },
      // Sport Cars
      {
        name: 'Ford Mustang GT 2024',
        make: 'Ford',
        model: 'Mustang GT',
        year: 2024,
        category: 'sport',
        pricePerDay: 150,
        rating: 4.8,
        location: 'Mohammedia',
        features: ['Performance Exhaust', 'Track Apps', 'Recaro Seats', 'Launch Control', 'Performance Package'],
        description: 'Iconic American muscle car delivering thrilling performance and unmistakable style.',
        transmission: '10-Speed Automatic',
        fuelType: 'gasoline',
        seats: 4,
        doors: 2,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1584345604476-8ec5f5e8e8b6?w=800',
        images: [],
        specifications: {
          engine: '5.0L V8',
          horsepower: '486 HP',
          acceleration: '0-60 mph in 4.3s',
          fuelEconomy: '16 MPG City / 25 MPG Highway',
          seatingCapacity: 4,
          luggage: 2,
          doors: 2,
          transmission: '10-Speed Automatic',
          driveType: 'Rear-Wheel Drive',
          topSpeed: '155 mph'
        }
      },
      {
        name: 'Chevrolet Camaro SS 2024',
        make: 'Chevrolet',
        model: 'Camaro SS',
        year: 2024,
        category: 'sport',
        pricePerDay: 145,
        rating: 4.7,
        location: 'Casablanca',
        features: ['Brembo Brakes', 'Magnetic Ride Control', 'Performance Data Recorder', 'Head-Up Display', 'Sport Exhaust'],
        description: 'Powerful sports car with aggressive styling and exhilarating performance.',
        transmission: '10-Speed Automatic',
        fuelType: 'gasoline',
        seats: 4,
        doors: 2,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        images: [],
        specifications: {
          engine: '6.2L V8',
          horsepower: '455 HP',
          acceleration: '0-60 mph in 4.0s',
          fuelEconomy: '16 MPG City / 24 MPG Highway',
          seatingCapacity: 4,
          luggage: 2,
          doors: 2,
          transmission: '10-Speed Automatic',
          driveType: 'Rear-Wheel Drive',
          topSpeed: '165 mph'
        }
      },
      // Electric/Luxury SUV
      {
        name: 'Tesla Model Y 2024',
        make: 'Tesla',
        model: 'Model Y',
        year: 2024,
        category: 'suv',
        pricePerDay: 110,
        rating: 4.8,
        location: 'Casablanca',
        features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Over-the-Air Updates', 'Supercharger Access'],
        description: 'All-electric SUV with impressive range, cutting-edge technology, and zero emissions.',
        transmission: 'Single-Speed',
        fuelType: 'electric',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        images: [],
        specifications: {
          engine: 'Dual Motor Electric',
          horsepower: '384 HP',
          acceleration: '0-60 mph in 4.8s',
          range: '330 miles',
          seatingCapacity: 5,
          luggage: 4,
          doors: 4,
          transmission: 'Single-Speed',
          driveType: 'All-Wheel Drive'
        }
      },
      // Van
      {
        name: 'Honda Odyssey 2024',
        make: 'Honda',
        model: 'Odyssey',
        year: 2024,
        category: 'van',
        pricePerDay: 95,
        rating: 4.6,
        location: 'Mohammedia',
        features: ['8 Passenger Seating', 'Power Sliding Doors', 'Rear Entertainment', 'Vacuum Cleaner', 'CabinWatch'],
        description: 'Family-friendly minivan with versatile seating and abundant cargo space.',
        transmission: '10-Speed Automatic',
        fuelType: 'gasoline',
        seats: 8,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
        images: [],
        specifications: {
          engine: '3.5L V6',
          horsepower: '280 HP',
          acceleration: '0-60 mph in 7.2s',
          fuelEconomy: '19 MPG City / 28 MPG Highway',
          seatingCapacity: 8,
          luggage: 5,
          doors: 4,
          transmission: '10-Speed Automatic',
          driveType: 'Front-Wheel Drive'
        }
      },
      // Convertible
      {
        name: 'Mazda MX-5 Miata 2024',
        make: 'Mazda',
        model: 'MX-5 Miata',
        year: 2024,
        category: 'convertible',
        pricePerDay: 85,
        rating: 4.7,
        location: 'Casablanca',
        features: ['Soft-Top Convertible', 'Bose Audio', 'Sport Tuned Suspension', 'Limited Slip Differential', 'Bilstein Dampers'],
        description: 'Lightweight roadster offering pure driving pleasure with top-down freedom.',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 2,
        doors: 2,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        images: [],
        specifications: {
          engine: '2.0L 4-Cylinder',
          horsepower: '181 HP',
          acceleration: '0-60 mph in 5.7s',
          fuelEconomy: '26 MPG City / 35 MPG Highway',
          seatingCapacity: 2,
          luggage: 1,
          doors: 2,
          transmission: '6-Speed Automatic',
          driveType: 'Rear-Wheel Drive',
          topSpeed: '135 mph'
        }
      },
      // Full-size
      {
        name: 'Chevrolet Tahoe 2024',
        make: 'Chevrolet',
        model: 'Tahoe',
        year: 2024,
        category: 'fullsize',
        pricePerDay: 125,
        rating: 4.5,
        location: 'Mohammedia',
        features: ['7 Passenger Seating', 'Towing Package', 'Bose Audio', 'Wireless Charging', 'Adaptive Cruise Control'],
        description: 'Full-size SUV with commanding presence, spacious interior, and impressive towing capacity.',
        transmission: '10-Speed Automatic',
        fuelType: 'gasoline',
        seats: 7,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        images: [],
        specifications: {
          engine: '5.3L V8',
          horsepower: '355 HP',
          acceleration: '0-60 mph in 6.7s',
          fuelEconomy: '16 MPG City / 20 MPG Highway',
          seatingCapacity: 7,
          luggage: 5,
          doors: 4,
          transmission: '10-Speed Automatic',
          driveType: 'Four-Wheel Drive'
        }
      },
      // Additional Economy
      {
        name: 'Hyundai Elantra 2024',
        make: 'Hyundai',
        model: 'Elantra',
        year: 2024,
        category: 'economy',
        pricePerDay: 42,
        rating: 4.4,
        location: 'Casablanca',
        features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Forward Collision Warning', 'Lane Keep Assist'],
        description: 'Affordable and stylish sedan with great warranty and modern features.',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        availability: true,
        maintenanceStatus: 'available',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
        images: [],
        specifications: {
          engine: '2.0L 4-Cylinder',
          horsepower: '147 HP',
          acceleration: '0-60 mph in 8.5s',
          fuelEconomy: '33 MPG City / 43 MPG Highway',
          seatingCapacity: 5,
          luggage: 2,
          doors: 4,
          transmission: 'CVT Automatic',
          driveType: 'Front-Wheel Drive'
        }
      }
    ];
    
    // Insert cars
    await Car.insertMany(cars);
    console.log(`✅ Created ${cars.length} sample cars successfully!`);
    
    // Summary by category
    const categoryCounts = cars.reduce((acc, car) => {
      acc[car.category] = (acc[car.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Cars by Category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });
    
    // Summary by location
    const locationCounts = cars.reduce((acc, car) => {
      acc[car.location] = (acc[car.location] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📍 Cars by Location:');
    Object.entries(locationCounts).forEach(([location, count]) => {
      console.log(`   - ${location}: ${count}`);
    });
    
    // Total count
    const totalCars = await Car.countDocuments();
    console.log(`\n📊 Total cars in database: ${totalCars}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database seeding complete!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedCars();
