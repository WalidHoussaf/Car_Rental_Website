import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const checkCar = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db');
    console.log('✅ Connected to database');
    
    const car = await Car.findOne();
    if (car) {
      console.log('\n📋 Sample Car Data:');
      console.log(JSON.stringify(car.toObject(), null, 2));
    } else {
      console.log('⚠️  No cars found in database');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkCar();
