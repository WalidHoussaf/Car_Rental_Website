import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import { queryKeys, invalidateQueries } from '../config/queryClient';

/**
 * Custom hooks for car-related queries
 * Provides caching, automatic refetching, and optimistic updates
 */

/**
 * Fetch all cars with optional filters
 * @param {Object} filters - Filter parameters (category, location, etc.)
 * @param {Object} options - React Query options
 */
export const useCars = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.cars.list(filters),
    queryFn: () => api.cars.getAll(filters),
    // API already returns the response object directly
    ...options,
  });
};

/**
 * Fetch a single car by ID
 * @param {string} id - Car ID
 * @param {Object} options - React Query options
 */
export const useCar = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.cars.detail(id),
    queryFn: () => api.cars.getById(id),
    // API already returns the response object directly
    enabled: !!id, // Only fetch if ID exists
    ...options,
  });
};

/**
 * Fetch featured cars
 * @param {Object} options - React Query options
 */
export const useFeaturedCars = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.cars.featured(),
    queryFn: () => api.cars.getAll({ featured: true }),
    // API already returns the response object directly
    staleTime: 10 * 60 * 1000, // Featured cars can be cached longer (10 minutes)
    ...options,
  });
};

/**
 * Check car availability
 * @param {string} id - Car ID
 * @param {Object} dates - Start and end dates
 * @param {Object} options - React Query options
 */
export const useCarAvailability = (id, dates = {}, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.cars.availability(id), dates],
    queryFn: () => api.cars.checkAvailability(id, dates.startDate, dates.endDate),
    // API already returns the response object directly
    enabled: !!id && !!dates.startDate && !!dates.endDate,
    staleTime: 2 * 60 * 1000, // Availability changes frequently, cache for 2 minutes
    ...options,
  });
};

/**
 * Create a new car (Admin only)
 */
export const useCreateCar = () => {
  return useMutation({
    mutationFn: (carData) => api.cars.create(carData),
    onSuccess: () => {
      // Invalidate and refetch car lists
      invalidateQueries.cars();
    },
  });
};

/**
 * Update a car (Admin only)
 */
export const useUpdateCar = () => {
  return useMutation({
    mutationFn: ({ id, data }) => api.cars.update(id, data),
    onSuccess: (response, variables) => {
      // Invalidate specific car and all car lists
      invalidateQueries.car(variables.id);
      invalidateQueries.cars();
    },
  });
};

/**
 * Delete a car (Admin only)
 */
export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => api.cars.delete(id),
    onSuccess: (response, id) => {
      // Remove car from cache
      queryClient.removeQueries({ queryKey: queryKeys.cars.detail(id) });
      // Invalidate car lists
      invalidateQueries.cars();
    },
  });
};

/**
 * Upload car images
 */
export const useUploadCarImages = () => {
  return useMutation({
    mutationFn: ({ files }) => api.cars.upload(files),
    onSuccess: () => {
      // Invalidate all cars to refetch with new images
      invalidateQueries.cars();
    },
  });
};
