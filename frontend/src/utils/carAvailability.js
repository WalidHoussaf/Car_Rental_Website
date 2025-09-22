/**
 * Car Availability Utility Functions
 * 
 * Implements the improved availability logic:
 * - Cars are unavailable if they have 'active' OR 'confirmed' bookings
 * - 'active' = currently rented (picked up)
 * - 'confirmed' = booked and confirmed (waiting for pickup)
 * - 'pending' = waiting for admin approval, car remains available
 * - 'completed', 'cancelled' = car is available
 */

import { api } from '../config/api';

/**
 * Check if a car is currently available based on its bookings
 * @param {string} carId - The car ID to check
 * @param {Array} bookings - Array of all bookings (optional, will fetch if not provided)
 * @returns {Promise<Object>} - { available: boolean, reason: string, nextAvailableDate: string|null }
 */
export const checkCarAvailability = async (carId, bookings = null) => {
  try {
    // Fetch bookings if not provided
    if (!bookings) {
      const response = await api.bookings.getAll({ limit: 1000 });
      if (!response.success) {
        throw new Error('Failed to fetch bookings');
      }
      bookings = response.data.bookings || [];
    }

    // Find bookings for this specific car
    const carBookings = bookings.filter(booking => 
      booking.car && booking.car._id === carId
    );
    
    // Check for unavailable bookings (active or confirmed only)
    // active = currently rented (picked up)
    // confirmed = booked and confirmed (waiting for pickup)
    // pending = waiting for admin approval, car remains available
    const unavailableBookings = carBookings.filter(booking => 
      ['active', 'confirmed'].includes(booking.status)
    );
    

    if (unavailableBookings.length === 0) {
      return {
        available: true,
        reason: 'Car is available for booking',
        nextAvailableDate: null,
        currentBookings: carBookings.length,
        unavailableBookings: 0
      };
    }

    // Car is unavailable, find the reason and next available date
    const activeBookings = unavailableBookings.filter(b => b.status === 'active');
    const confirmedBookings = unavailableBookings.filter(b => b.status === 'confirmed');
    const pendingBookings = unavailableBookings.filter(b => b.status === 'pending');

    let reason = '';
    let nextAvailableDate = null;

    if (activeBookings.length > 0) {
      reason = 'Car is currently rented (active booking)';
      // Find the earliest return date from active bookings
      const returnDates = activeBookings.map(b => new Date(b.endDate));
      nextAvailableDate = new Date(Math.min(...returnDates)).toISOString().split('T')[0];
    } else if (confirmedBookings.length > 0) {
      reason = 'Car has confirmed booking (waiting for pickup)';
      // Find the earliest end date from confirmed bookings
      const returnDates = confirmedBookings.map(b => new Date(b.endDate));
      nextAvailableDate = new Date(Math.min(...returnDates)).toISOString().split('T')[0];
    } else if (pendingBookings.length > 0) {
      reason = 'Car has pending booking (awaiting approval)';
      // Find the earliest end date from pending bookings
      const returnDates = pendingBookings.map(b => new Date(b.endDate));
      nextAvailableDate = new Date(Math.min(...returnDates)).toISOString().split('T')[0];
    }

    return {
      available: false,
      reason,
      nextAvailableDate,
      currentBookings: carBookings.length,
      unavailableBookings: unavailableBookings.length,
      activeBookings: activeBookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length
    };

  } catch (error) {
    console.error('Error checking car availability:', error);
    return {
      available: false,
      reason: 'Error checking availability',
      nextAvailableDate: null,
      error: error.message
    };
  }
};

/**
 * Get availability status for multiple cars
 * @param {Array} cars - Array of car objects
 * @param {Array} bookings - Array of all bookings (optional, will fetch if not provided)
 * @returns {Promise<Object>} - Object with carId as key and availability info as value
 */
export const getMultipleCarAvailability = async (cars, bookings = null) => {
  try {
    // Fetch bookings if not provided
    if (!bookings) {
      const response = await api.bookings.getAll({ limit: 1000 });
      if (!response.success) {
        throw new Error('Failed to fetch bookings');
      }
      bookings = response.data.bookings || [];
    }

    const availabilityMap = {};

    // Check availability for each car
    for (const car of cars) {
      const availability = await checkCarAvailability(car._id, bookings);
      availabilityMap[car._id] = {
        ...availability,
        carName: car.name,
        carModel: `${car.make} ${car.model}`.trim()
      };
    }

    return availabilityMap;
  } catch (error) {
    console.error('Error checking multiple car availability:', error);
    return {};
  }
};

/**
 * Get availability statistics for a fleet of cars
 * @param {Array} cars - Array of car objects
 * @param {Array} bookings - Array of all bookings (optional, will fetch if not provided)
 * @returns {Promise<Object>} - Fleet availability statistics
 */
export const getFleetAvailabilityStats = async (cars, bookings = null) => {
  try {
    const availabilityMap = await getMultipleCarAvailability(cars, bookings);
    
    const stats = {
      totalCars: cars.length,
      availableCars: 0,
      unavailableCars: 0,
      activeCars: 0,
      confirmedCars: 0,
      availabilityRate: 0
    };

    Object.values(availabilityMap).forEach(availability => {
      if (availability.available) {
        stats.availableCars++;
      } else {
        stats.unavailableCars++;
        if (availability.activeBookings > 0) {
          stats.activeCars++;
        }
        if (availability.confirmedBookings > 0) {
          stats.confirmedCars++;
        }
      }
    });

    stats.availabilityRate = stats.totalCars > 0 
      ? (stats.availableCars / stats.totalCars * 100).toFixed(1)
      : 0;

    return {
      ...stats,
      availabilityMap
    };
  } catch (error) {
    console.error('Error getting fleet availability stats:', error);
    return {
      totalCars: cars.length,
      availableCars: 0,
      unavailableCars: 0,
      activeCars: 0,
      confirmedCars: 0,
      availabilityRate: 0,
      availabilityMap: {},
      error: error.message
    };
  }
};
