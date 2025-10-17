import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import { queryKeys, invalidateQueries } from '../config/queryClient';

/**
 * Custom hooks for authentication and user queries
 */

/**
 * Verify current user authentication
 * @param {Object} options - React Query options
 */
export const useAuthVerify = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.auth.verify(),
    queryFn: () => api.get('/auth/verify'),
    select: (response) => response.data,
    retry: false, // Don't retry auth checks
    staleTime: 5 * 60 * 1000, // Cache auth status for 5 minutes
    ...options,
  });
};

/**
 * Get current user profile
 * @param {Object} options - React Query options
 */
export const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: () => api.get('/users/profile'),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (response) => {
      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), response.data);
      queryClient.setQueryData(queryKeys.users.current(), response.data.user);
      
      // Store token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    },
  });
};

/**
 * Register mutation
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => api.post('/auth/register', userData),
    onSuccess: (response) => {
      // Set user data in cache
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        queryClient.setQueryData(queryKeys.auth.user(), response.data);
        queryClient.setQueryData(queryKeys.users.current(), response.data.user);
      }
    },
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Remove token
      localStorage.removeItem('token');
    },
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => api.put('/users/profile', userData),
    onSuccess: (response) => {
      // Update current user in cache
      queryClient.setQueryData(queryKeys.users.current(), response.data.user);
      invalidateQueries.currentUser();
    },
  });
};

/**
 * Change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => api.put('/users/change-password', passwordData),
  });
};

/**
 * Request password reset
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email) => api.post('/auth/forgot-password', { email }),
  });
};

/**
 * Reset password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }) => api.post('/auth/reset-password', { token, password }),
  });
};

/**
 * Verify email
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token) => api.post('/auth/verify-email', { token }),
    onSuccess: () => {
      // Refresh user data
      invalidateQueries.currentUser();
      invalidateQueries.auth();
    },
  });
};

/**
 * Get all users (Admin only)
 */
export const useUsers = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => api.users.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Get user by ID (Admin only)
 */
export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => api.users.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Update user (Admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => api.users.update(id, data),
    onSuccess: (response, variables) => {
      invalidateQueries.users();
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    },
  });
};

/**
 * Delete user (Admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => api.users.delete(id),
    onSuccess: (response, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(id) });
      invalidateQueries.users();
    },
  });
};
