import Booking from '../../models/Booking.js';
import User from '../../models/User.js';
import Car from '../../models/Car.js';

describe('Booking Model', () => {
  let testUser;
  let testCar;

  beforeEach(async () => {
    testUser = await global.testUtils.createTestUser(User);
    testCar = await global.testUtils.createTestCar(Car);
  });

  describe('Booking Creation', () => {
    it('should create a valid booking', async () => {
      const bookingData = {
        user: testUser._id,
        car: testCar._id,
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
        paymentMethod: 'credit_card',
        driverInfo: {
          primaryDriver: testUser._id
        }
      };

      const booking = new Booking(bookingData);
      const savedBooking = await booking.save();

      expect(savedBooking._id).toBeDefined();
      expect(savedBooking.user.toString()).toBe(testUser._id.toString());
      expect(savedBooking.car.toString()).toBe(testCar._id.toString());
      expect(savedBooking.status).toBe('pending'); 
      expect(savedBooking.totalDays).toBe(5);
      expect(savedBooking.totalPrice).toBe(250);
    });

    it('should fail without required fields', async () => {
      const booking = new Booking({
        user: testUser._id
        // Missing required fields
      });

      await expect(booking.save()).rejects.toThrow();
    });

    it('should validate dates', async () => {
      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id
      );

      expect(booking.startDate).toBeInstanceOf(Date);
      expect(booking.endDate).toBeInstanceOf(Date);
      expect(booking.endDate.getTime()).toBeGreaterThan(booking.startDate.getTime());
    });
  });

  describe('Booking Status', () => {
    it('should have default status as pending', async () => {
      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id
      );

      expect(booking.status).toBe('pending');
    });

    it('should accept valid status values', async () => {
      const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

      for (const status of validStatuses) {
        const booking = await global.testUtils.createTestBooking(
          Booking,
          testUser._id,
          testCar._id,
          { status }
        );
        expect(booking.status).toBe(status);
      }
    });
  });

  describe('Booking Payment', () => {
    it('should accept valid payment methods', async () => {
      const validMethods = ['credit_card', 'debit_card', 'paypal', 'cash'];

      for (const method of validMethods) {
        const booking = await global.testUtils.createTestBooking(
          Booking,
          testUser._id,
          testCar._id,
          { paymentMethod: method }
        );
        expect(booking.paymentMethod).toBe(method);
      }
    });

    it('should store payment status', async () => {
      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id,
        { paymentStatus: 'paid' }
      );

      expect(booking.paymentStatus).toBe('paid');
    });
  });

  describe('Booking Locations', () => {
    it('should store pickup location details', async () => {
      const pickupLocation = {
        branch: 'Airport Office',
        address: 'Mohammed V Airport, Casablanca'
      };

      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id,
        { pickupLocation }
      );

      expect(booking.pickupLocation.branch).toBe(pickupLocation.branch);
      expect(booking.pickupLocation.address).toBe(pickupLocation.address);
    });

    it('should store dropoff location details', async () => {
      const dropoffLocation = {
        branch: 'Downtown Office',
        address: 'City Center, Casablanca'
      };

      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id,
        { dropoffLocation }
      );

      expect(booking.dropoffLocation.branch).toBe(dropoffLocation.branch);
      expect(booking.dropoffLocation.address).toBe(dropoffLocation.address);
    });
  });

  describe('Booking Extras', () => {
    it('should store extras as an array', async () => {
      const extras = [
        { name: 'GPS', price: 10, quantity: 1 },
        { name: 'Child Seat', price: 15, quantity: 2 }
      ];

      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id,
        { extras }
      );

      expect(Array.isArray(booking.extras)).toBe(true);
      expect(booking.extras).toHaveLength(2);
      expect(booking.extras[0].name).toBe('GPS');
      expect(booking.extras[1].quantity).toBe(2);
    });
  });

  describe('Booking Cancellation', () => {
    it('should store cancellation reason', async () => {
      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id,
        {
          status: 'cancelled',
          cancellationReason: 'Customer request'
        }
      );

      expect(booking.status).toBe('cancelled');
      expect(booking.cancellationReason).toBe('Customer request');
    });
  });

  describe('Booking Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id
      );

      expect(booking.createdAt).toBeDefined();
      expect(booking.updatedAt).toBeDefined();
      expect(booking.createdAt).toBeInstanceOf(Date);
      expect(booking.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Booking Population', () => {
    it('should populate user details', async () => {
      // Create fresh user for this test
      const freshUser = await global.testUtils.createTestUser(User, {
        email: 'populate-user@example.com'
      });
      
      const booking = await global.testUtils.createTestBooking(
        Booking,
        freshUser._id,
        testCar._id
      );

      const populatedBooking = await Booking.findById(booking._id).populate('user');

      expect(populatedBooking.user).toBeDefined();
      expect(populatedBooking.user.email).toBe(freshUser.email);
      expect(populatedBooking.user.firstName).toBe(freshUser.firstName);
    });

    it('should populate car details', async () => {
      const booking = await global.testUtils.createTestBooking(
        Booking,
        testUser._id,
        testCar._id
      );

      const populatedBooking = await Booking.findById(booking._id).populate('car');

      expect(populatedBooking.car.name).toBe(testCar.name);
      expect(populatedBooking.car.make).toBe(testCar.make);
    });
  });
});
