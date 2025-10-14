import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkCarAvailability, getMultipleCarAvailability } from '../../utils/carAvailability';
import { api } from '../../config/api';

vi.mock('../../config/api', () => ({
  api: {
    bookings: {
      getAll: vi.fn()
    },
    cars: {
      checkMultipleAvailability: vi.fn()
    }
  }
}));

describe('Car Availability Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkCarAvailability', () => {
    it('should return available when no conflicting bookings', async () => {
      const mockBookings = [];
      api.bookings.getAll.mockResolvedValue({
        success: true,
        data: {
          bookings: mockBookings
        }
      });

      const result = await checkCarAvailability('car123');

      expect(result.available).toBe(true);
      expect(result.reason).toBe('Car is available for booking');
    });

    it('should return unavailable when car has active booking', async () => {
      const mockBookings = [
        {
          car: { _id: 'car123' },
          status: 'active',
          startDate: '2025-01-15',
          endDate: '2025-01-20'
        }
      ];
      
      api.bookings.getAll.mockResolvedValue({
        success: true,
        data: {
          bookings: mockBookings
        }
      });

      const result = await checkCarAvailability('car123');

      expect(result.available).toBe(false);
      expect(result.reason).toBe('Car is currently rented (active booking)');
    });

    it('should return unavailable when car has confirmed booking', async () => {
      const mockBookings = [
        {
          car: { _id: 'car123' },
          status: 'confirmed',
          startDate: '2025-01-15',
          endDate: '2025-01-20'
        }
      ];
      
      api.bookings.getAll.mockResolvedValue({
        success: true,
        data: {
          bookings: mockBookings
        }
      });

      const result = await checkCarAvailability('car123');

      expect(result.available).toBe(false);
      expect(result.reason).toBe('Car has confirmed booking (waiting for pickup)');
    });

    it('should ignore pending bookings', async () => {
      const mockBookings = [
        {
          car: { _id: 'car123' },
          status: 'pending',
          startDate: '2025-01-15',
          endDate: '2025-01-20'
        }
      ];
      
      api.bookings.getAll.mockResolvedValue({
        success: true,
        data: {
          bookings: mockBookings
        }
      });

      const result = await checkCarAvailability('car123');

      expect(result.available).toBe(true);
    });

    it('should ignore completed bookings', async () => {
      const mockBookings = [
        {
          car: { _id: 'car123' },
          status: 'completed',
          startDate: '2024-12-01',
          endDate: '2024-12-05'
        }
      ];
      
      api.bookings.getAll.mockResolvedValue({
        success: true,
        data: {
          bookings: mockBookings
        }
      });

      const result = await checkCarAvailability('car123');

      expect(result.available).toBe(true);
    });

    it('should ignore cancelled bookings', async () => {
      const mockBookings = [
        {
          car: { _id: 'car123' },
          status: 'cancelled',
          startDate: '2025-01-15',
          endDate: '2025-01-20'
        }
      ];
      
      api.bookings.getAll.mockResolvedValue({
        success: true,
        data: {
          bookings: mockBookings
        }
      });

      const result = await checkCarAvailability('car123');

      expect(result.available).toBe(true);
    });
  });

  describe('getMultipleCarAvailability', () => {
    it('should check availability for multiple cars', async () => {
      const cars = [
        { _id: 'car1', name: 'Car 1', make: 'Toyota', model: 'Camry' },
        { _id: 'car2', name: 'Car 2', make: 'Honda', model: 'Accord' },
        { _id: 'car3', name: 'Car 3', make: 'Ford', model: 'Fusion' }
      ];
      
      api.cars.checkMultipleAvailability.mockResolvedValue({
        success: true,
        data: {
          availabilityMap: {
            car1: { available: false, reason: 'Active booking' },
            car2: { available: true, reason: 'Available' },
            car3: { available: false, reason: 'Confirmed booking' }
          }
        }
      });

      const result = await getMultipleCarAvailability(cars);

      expect(result.car1.available).toBe(false);
      expect(result.car2.available).toBe(true);
      expect(result.car3.available).toBe(false);
    });

    it('should handle empty car list', async () => {
      const result = await getMultipleCarAvailability([]);

      expect(result).toEqual({});
    });

    it('should handle API errors gracefully', async () => {
      const cars = [{ _id: 'car1', name: 'Car 1', make: 'Toyota', model: 'Camry' }];
      api.cars.checkMultipleAvailability.mockRejectedValue(new Error('API Error'));

      const result = await getMultipleCarAvailability(cars);

      expect(result).toEqual({}); // Returns empty object on error
    });
  });
});
