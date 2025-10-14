import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const resetUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db');
    console.log('✅ Connected to database:', mongoose.connection.name);
    
    // Count existing users
    const userCount = await User.countDocuments();
    console.log(`\n📊 Found ${userCount} existing users`);
    
    // Delete all users
    const result = await User.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} users`);
    
    await mongoose.connection.close();
    console.log('\n✅ Users cleared! Now run: npm run seed:users');
    
  } catch (error) {
    console.error('❌ Error resetting users:', error.message);
    process.exit(1);
  }
};

resetUsers();
