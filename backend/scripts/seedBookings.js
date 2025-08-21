import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Car from '../models/Car.js';

dotenv.config();

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  try {
    const users = await User.find({ role: 'customer' }).lean();
    const cars = await Car.find({}).lean();

    if (!users.length) {
      console.log('No customer users found. Please create users first.');
      return;
    }
    if (!cars.length) {
      console.log('No cars found. Please seed cars first.');
      return;
    }

    // Create bookings spread across customers and cars
    const count = 14;
    const bookings = [];

    const statusOptions = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    const paymentMethods = ['credit_card', 'debit_card', 'paypal', 'cash'];
    const insuranceOptions = [
      { type: 'basic', price: 0 },
      { type: 'premium', price: 15 },
      { type: 'full', price: 30 }
    ];
    const extrasOptions = [
      { name: 'GPS', price: 5 },
      { name: 'Child Seat', price: 4 },
      { name: 'Additional Driver', price: 7 },
      { name: 'Roadside Assistance', price: 3 }
    ];

    for (let i = 0; i < count; i++) {
      const user = randomChoice(users);
      const car = randomChoice(cars);

      // Dates must be in the future per model validation
      const startOffset = 2 + Math.floor(Math.random() * 15); // 2-16 days from now
      const durationDays = 1 + Math.floor(Math.random() * 7); // 1-7 days
      const startDate = addDays(new Date(), startOffset);
      const endDate = addDays(startDate, durationDays);

      // Choose status consistent with dates
      const status = randomChoice(statusOptions);

      // Derive payment status from booking status for realism
      const paymentStatus = ['confirmed', 'active', 'completed'].includes(status) ? 'paid' : randomChoice(['pending', 'failed']);

      const insurance = randomChoice(insuranceOptions);

      // Random subset of extras
      const extrasCount = Math.floor(Math.random() * 3); 
      const extras = Array.from({ length: extrasCount }, () => randomChoice(extrasOptions))
        .map((e) => ({ ...e, quantity: 1 }));

      const pricePerDay = car.pricePerDay || 50;
      const extrasTotal = extras.reduce((sum, e) => sum + (e.price * (e.quantity || 1)), 0);
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      const totalAmount = totalDays * pricePerDay + extrasTotal + (insurance.price || 0);

      const pickupBranch = car?.location?.branch || 'Main Branch';
      const pickupAddress = car?.location?.address || '123 Main St';

      bookings.push({
        user: user._id,
        car: car._id,
        startDate,
        endDate,
        pickupLocation: {
          branch: pickupBranch,
          address: pickupAddress
        },
        dropoffLocation: {
          branch: pickupBranch,
          address: pickupAddress
        },
        totalDays, 
        pricePerDay,
        totalAmount,
        extras,
        insurance,
        status,
        paymentStatus,
        paymentMethod: randomChoice(paymentMethods),
        driverInfo: {
          primaryDriver: user._id,
          additionalDrivers: []
        },
        notes: {
          customer: 'Looking forward to the trip!',
          admin: 'Seeded booking for testing.'
        }
      });
    }

    const result = await Booking.insertMany(bookings);
    console.log(`Inserted ${result.length} bookings.`);
  } catch (err) {
    console.error('Error seeding bookings:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

main();
