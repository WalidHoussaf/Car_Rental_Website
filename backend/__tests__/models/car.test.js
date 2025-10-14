import Car from '../../models/Car.js';

describe('Car Model', () => {
  describe('Car Creation', () => {
    it('should create a valid car', async () => {
      const carData = {
        name: 'Toyota Camry 2024',
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        category: 'midsize',
        transmission: 'automatic',
        fuelType: 'gasoline',
        seats: 5,
        pricePerDay: 50,
        location: 'Mohammedia',
        description: 'Comfortable sedan for daily use',
        features: ['Air Conditioning', 'Bluetooth', 'GPS'],
        image: 'camry-main.jpg',
        images: ['camry-1.jpg', 'camry-2.jpg']
      };

      const car = new Car(carData);
      const savedCar = await car.save();

      expect(savedCar._id).toBeDefined();
      expect(savedCar.name).toBe(carData.name);
      expect(savedCar.make).toBe(carData.make);
      expect(savedCar.model).toBe(carData.model);
      expect(savedCar.year).toBe(carData.year);
      expect(savedCar.category).toBe(carData.category);
      expect(savedCar.pricePerDay).toBe(carData.pricePerDay);
      expect(savedCar.availability).toBe(true);
    });

    it('should fail without required fields', async () => {
      const car = new Car({
        name: 'Test Car'
        // Missing required fields
      });

      await expect(car.save()).rejects.toThrow();
    });

    it('should validate year is a number', async () => {
      const car = await global.testUtils.createTestCar(Car, { year: 2024 });
      expect(typeof car.year).toBe('number');
    });

    it('should validate seats is a number', async () => {
      const car = await global.testUtils.createTestCar(Car, { seats: 5 });
      expect(typeof car.seats).toBe('number');
      expect(car.seats).toBeGreaterThan(0);
    });

    it('should validate pricePerDay is a number', async () => {
      const car = await global.testUtils.createTestCar(Car, { pricePerDay: 50 });
      expect(typeof car.pricePerDay).toBe('number');
      expect(car.pricePerDay).toBeGreaterThan(0);
    });
  });

  describe('Car Categories', () => {
    it('should accept valid categories', async () => {
      const categories = ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv'];
      
      for (const category of categories) {
        const car = await global.testUtils.createTestCar(Car, { category });
        expect(car.category).toBe(category);
      }
    });
  });

  describe('Car Transmission', () => {
    it('should accept valid transmission types', async () => {
      const transmissions = ['automatic', 'manual'];
      
      for (const transmission of transmissions) {
        const car = await global.testUtils.createTestCar(Car, { transmission });
        expect(car.transmission).toBe(transmission);
      }
    });
  });

  describe('Car Fuel Types', () => {
    it('should accept valid fuel types', async () => {
      const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid'];
      
      for (const fuelType of fuelTypes) {
        const car = await global.testUtils.createTestCar(Car, { fuelType });
        expect(car.fuelType).toBe(fuelType);
      }
    });
  });

  describe('Car Availability', () => {
    it('should have default availability as true', async () => {
      const car = await global.testUtils.createTestCar(Car);
      expect(car.availability).toBe(true);
    });

    it('should allow setting availability to false', async () => {
      const car = await global.testUtils.createTestCar(Car, { availability: false });
      expect(car.availability).toBe(false);
    });
  });

  describe('Car Features', () => {
    it('should store features as an array', async () => {
      const features = ['GPS', 'Bluetooth', 'Backup Camera'];
      const car = await global.testUtils.createTestCar(Car, { features });
      
      expect(Array.isArray(car.features)).toBe(true);
      expect(car.features).toEqual(features);
    });
  });

  describe('Car Images', () => {
    it('should store images as an array', async () => {
      const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
      const car = await global.testUtils.createTestCar(Car, { images });
      
      expect(Array.isArray(car.images)).toBe(true);
      expect(car.images).toEqual(images);
    });
  });

  describe('Car Specifications', () => {
    it('should store performance specifications', async () => {
      const specifications = {
        engine: '2.5L 4-Cylinder',
        horsepower: 203,
        acceleration: '7.5s',
        fuelEconomy: '32 MPG'
      };
      
      const car = await global.testUtils.createTestCar(Car, { specifications });
      
      expect(car.specifications).toBeDefined();
      expect(car.specifications.engine).toBe(specifications.engine);
      expect(car.specifications.horsepower).toBe(String(specifications.horsepower));
    });
  });

  describe('Car Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const car = await global.testUtils.createTestCar(Car);
      
      expect(car.createdAt).toBeDefined();
      expect(car.updatedAt).toBeDefined();
      expect(car.createdAt).toBeInstanceOf(Date);
      expect(car.updatedAt).toBeInstanceOf(Date);
    });
  });
});
