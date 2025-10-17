import { QueryClient } from '@tanstack/react-query';
import { logErrorToService } from '../utils/errorLogger';

/**
 * React Query Configuration
 * Centralized configuration for data fetching, caching, and error handling
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache Configuration
      staleTime: 5 * 60 * 1000, // data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // cache persists for 10 minutes
      
      // Retry Configuration
      retry: 2, // Retry failed requests 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
      
      // Refetch Configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus (can be enabled per query)
      refetchOnReconnect: true, // Refetch when internet reconnects
      refetchOnMount: true, // Refetch when component mounts
      
      // Error Handling
      onError: (error) => {
        logErrorToService(error, {}, { context: 'React Query' });
      },
      
      // Performance
      structuralSharing: true, // Optimize re-renders by sharing unchanged data
    },
    mutations: {
      // Retry Configuration for Mutations
      retry: 1, // Retry failed mutations once
      
      // Error Handling
      onError: (error) => {
        logErrorToService(error, {}, { context: 'React Query Mutation' });
      },
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query keys for consistent cache management
 */
export const queryKeys = {
  // Cars
  cars: {
    all: ['cars'],
    lists: () => [...queryKeys.cars.all, 'list'],
    list: (filters) => [...queryKeys.cars.lists(), { filters }],
    details: () => [...queryKeys.cars.all, 'detail'],
    detail: (id) => [...queryKeys.cars.details(), id],
    featured: () => [...queryKeys.cars.all, 'featured'],
    availability: (id) => [...queryKeys.cars.all, 'availability', id],
  },
  
  // Bookings
  bookings: {
    all: ['bookings'],
    lists: () => [...queryKeys.bookings.all, 'list'],
    list: (filters) => [...queryKeys.bookings.lists(), { filters }],
    details: () => [...queryKeys.bookings.all, 'detail'],
    detail: (id) => [...queryKeys.bookings.details(), id],
    user: (userId) => [...queryKeys.bookings.all, 'user', userId],
  },
  
  // Users
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    list: (filters) => [...queryKeys.users.lists(), { filters }],
    details: () => [...queryKeys.users.all, 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
    current: () => [...queryKeys.users.all, 'current'],
  },
  
  // Auth
  auth: {
    user: () => ['auth', 'user'],
    verify: () => ['auth', 'verify'],
  },
  
  // Stats/Reports
  stats: {
    dashboard: () => ['stats', 'dashboard'],
    reports: (type) => ['stats', 'reports', type],
  },
};

/**
 * Cache Invalidation Helpers
 * Functions to invalidate specific cache entries
 */
export const invalidateQueries = {
  // Invalidate all car queries
  cars: () => queryClient.invalidateQueries({ queryKey: queryKeys.cars.all }),
  
  // Invalidate specific car
  car: (id) => queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(id) }),
  
  // Invalidate all booking queries
  bookings: () => queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all }),
  
  // Invalidate specific booking
  booking: (id) => queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) }),
  
  // Invalidate user bookings
  userBookings: (userId) => queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user(userId) }),
  
  // Invalidate all user queries
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  
  // Invalidate current user
  currentUser: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.current() }),
  
  // Invalidate auth
  auth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() }),
  
  // Invalidate stats
  stats: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
};

export default queryClient;
