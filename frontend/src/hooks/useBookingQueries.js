import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../config/api';
import { queryKeys, invalidateQueries } from '../config/queryClient';

/**
 * Custom hooks for booking-related queries
 */

/**
 * Fetch all bookings (Admin only)
 * @param {Object} filters - Filter parameters
 * @param {Object} options - React Query options
 */
export const useBookings = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => api.bookings.getAll(filters),
    // API already returns the response object directly
    ...options,
  });
};

/**
 * Fetch a single booking by ID
 * @param {string} id - Booking ID
 * @param {Object} options - React Query options
 */
export const useBooking = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => api.bookings.getById(id),
    // API already returns the response object directly
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch current user's bookings
 * @param {Object} options - React Query options
 */
export const useMyBookings = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.bookings.user('me'),
    queryFn: () => api.bookings.getMyBookings(),
    // API already returns the response object directly
    staleTime: 2 * 60 * 1000, // Bookings change frequently, cache for 2 minutes
    ...options,
  });
};

/**
 * Create a new booking
 */
export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (bookingData) => api.bookings.create(bookingData),
    onSuccess: (response) => {
      // Invalidate user bookings and car availability
      invalidateQueries.bookings();
      if (response.data.booking?.car) {
        invalidateQueries.car(response.data.booking.car);
      }
    },
  });
};

/**
 * Update a booking
 */
export const useUpdateBooking = () => {
  return useMutation({
    mutationFn: ({ id, data }) => api.bookings.update(id, data),
    onSuccess: (response, variables) => {
      // Invalidate specific booking and lists
      invalidateQueries.booking(variables.id);
      invalidateQueries.bookings();
      
      // Invalidate car availability if car is in the response
      if (response.data.booking?.car) {
        invalidateQueries.car(response.data.booking.car);
      }
    },
  });
};

/**
 * Cancel a booking
 */
export const useCancelBooking = () => {
  return useMutation({
    mutationFn: (id) => api.bookings.cancel(id),
    onSuccess: (response, id) => {
      // Invalidate specific booking and lists
      invalidateQueries.booking(id);
      invalidateQueries.bookings();
      
      // Invalidate car availability
      if (response.data.booking?.car) {
        invalidateQueries.car(response.data.booking.car);
      }
    },
  });
};

/**
 * Confirm a booking (Admin only)
 */
export const useConfirmBooking = () => {
  return useMutation({
    mutationFn: (id) => api.bookings.updateStatus(id, 'confirmed'),
    onSuccess: (response, id) => {
      invalidateQueries.booking(id);
      invalidateQueries.bookings();
    },
  });
};

/**
 * Complete a booking (Admin only)
 */
export const useCompleteBooking = () => {
  return useMutation({
    mutationFn: (id) => api.bookings.updateStatus(id, 'completed'),
    onSuccess: (response, id) => {
      invalidateQueries.booking(id);
      invalidateQueries.bookings();
      
      // Invalidate car availability
      if (response.data.booking?.car) {
        invalidateQueries.car(response.data.booking.car);
      }
    },
  });
};
