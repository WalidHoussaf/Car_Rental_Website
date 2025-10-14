import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import Car from '../../models/Car.js';

describe('Car Routes', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create admin user
    const admin = await global.testUtils.createTestAdmin(User, {
      email: 'admin-cars@example.com'
    });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin-cars@example.com',
        password: 'Test123!@#'
      });
    adminToken = adminLogin.body.token;

    // Create regular user
    const user = await global.testUtils.createTestUser(User, {
      email: 'user@example.com',
      isVerified: true
    });

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'Test123!@#'
      });
    userToken = userLogin.body.token;
  });

  describe('GET /api/cars', () => {
    beforeEach(async () => {
      // Create test cars
      await global.testUtils.createTestCar(Car, { name: 'Toyota Camry' });
      await global.testUtils.createTestCar(Car, { name: 'Honda Accord', category: 'midsize' });
      await global.testUtils.createTestCar(Car, { name: 'Tesla Model 3', category: 'luxury' });
    });

    it('should get all cars', async () => {
      const response = await request(app)
        .get('/api/cars')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cars).toBeDefined();
      expect(response.body.cars.length).toBeGreaterThan(0);
    });

    it('should filter cars by category', async () => {
      const response = await request(app)
        .get('/api/cars?category=midsize')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cars.every(car => car.category === 'midsize')).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/cars?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cars.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/cars/:id', () => {
    let testCar;

    beforeEach(async () => {
      testCar = await global.testUtils.createTestCar(Car);
    });

    it('should get car by id', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.car).toBeDefined();
      expect(response.body.car.name).toBe(testCar.name);
    });

    it('should return 404 for non-existent car', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/cars/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid car id', async () => {
      const response = await request(app)
        .get('/api/cars/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/cars', () => {
    it('should create car as admin', async () => {
      const carData = {
        name: 'New Test Car',
        make: 'Toyota',
        model: 'Corolla',
        year: 2024,
        category: 'midsize',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        doors: 4,
        pricePerDay: 45,
        location: 'Mohammedia',
        description: 'Brand new car',
        features: ['GPS', 'Bluetooth'],
        image: 'car-main.jpg',
        images: ['car1.jpg']
      };

      const response = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(carData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.car).toBeDefined();
      expect(response.body.car.name).toBe(carData.name);
    });

    it('should fail to create car as regular user', async () => {
      const carData = {
        name: 'Unauthorized Car',
        make: 'Toyota',
        model: 'Corolla',
        year: 2024,
        category: 'midsize',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        pricePerDay: 45,
        location: 'Mohammedia',
        description: 'Test',
        features: [],
        images: []
      };

      const response = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${userToken}`)
        .send(carData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/cars')
        .send({})
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/cars/:id', () => {
    let testCar;

    beforeEach(async () => {
      testCar = await global.testUtils.createTestCar(Car);
    });

    it('should update car as admin', async () => {
      const updates = {
        name: 'Updated Car Name',
        pricePerDay: 60
      };

      const response = await request(app)
        .put(`/api/cars/${testCar._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.car.name).toBe(updates.name);
      expect(response.body.car.pricePerDay).toBe(updates.pricePerDay);
    });

    it('should fail to update car as regular user', async () => {
      const response = await request(app)
        .put(`/api/cars/${testCar._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Hacked' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    let testCar;

    beforeEach(async () => {
      testCar = await global.testUtils.createTestCar(Car);
    });

    it('should delete car as admin', async () => {
      const response = await request(app)
        .delete(`/api/cars/${testCar._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify car is deleted
      const deletedCar = await Car.findById(testCar._id);
      expect(deletedCar).toBeNull();
    });

    it('should fail to delete car as regular user', async () => {
      const response = await request(app)
        .delete(`/api/cars/${testCar._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/cars/:id/availability', () => {
    let testCar;

    beforeEach(async () => {
      testCar = await global.testUtils.createTestCar(Car);
    });

    it('should check car availability', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar._id}/availability?startDate=2025-02-01&endDate=2025-02-05`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.available).toBeDefined();
    });

    it('should fail without date parameters', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar._id}/availability`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
