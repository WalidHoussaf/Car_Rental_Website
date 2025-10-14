import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db');
    console.log('✅ Connected to database:', mongoose.connection.name);
    
    // Check if admin already exists (normalized email)
    const existingAdmin = await User.findOne({ email: 'walid.houssaf@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping...');
      await mongoose.connection.close();
      return;
    }
    
    // Create admin user - Walid Houssaf
    // Note: Email will be automatically normalized (dots removed for Gmail)
    const adminUser = new User({
      firstName: 'Walid',
      lastName: 'Houssaf',
      email: 'walid.houssaf@gmail.com',
      password: 'Admin123!@#', // Change this password after first login!
      phone: '+212600000000',
      dateOfBirth: new Date('1990-01-01'),
      address: {
        street: 'Derb Chabab A el Alia',
        city: 'Mohammedia',
        state: 'Casablanca-Settat',
        zipCode: '28810',
        country: 'Morocco'
      },
      role: 'admin',
      isVerified: true, // Admin is pre-verified
      profileImage: null
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email: walid.houssaf@gmail.com (or walidhoussaf@gmail.com - both work!)');
    console.log('   Password: Admin123!@#');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    
    // Create a few sample customer users for testing
    const customers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Customer123!',
        phone: '+212611111111',
        dateOfBirth: new Date('1995-05-15'),
        address: {
          city: 'Casablanca',
          country: 'Morocco'
        },
        role: 'customer',
        isVerified: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'Customer123!',
        phone: '+212622222222',
        dateOfBirth: new Date('1992-08-20'),
        address: {
          city: 'Rabat',
          country: 'Morocco'
        },
        role: 'customer',
        isVerified: true
      },
      {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        email: 'ahmed.hassan@example.com',
        password: 'Customer123!',
        phone: '+212633333333',
        dateOfBirth: new Date('1988-03-10'),
        address: {
          city: 'Mohammedia',
          country: 'Morocco'
        },
        role: 'customer',
        isVerified: false // This one is not verified yet
      }
    ];
    
    await User.insertMany(customers);
    console.log(`✅ Created ${customers.length} sample customer users`);
    console.log('\n📋 Sample Customer Accounts:');
    customers.forEach(customer => {
      console.log(`   - ${customer.firstName} ${customer.lastName} (${customer.email})`);
      console.log(`     Password: Customer123!`);
    });
    
    // Summary
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    console.log('   - Admins: 1');
    console.log('   - Customers: 3');
    
    await mongoose.connection.close();
    console.log('\n✅ Database seeding complete!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedUsers();
