// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const createApiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Details:', data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API methods
export const api = {
  // Authentication endpoints
  auth: {
    register: (userData) => createApiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
    login: (credentials) => createApiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
    getProfile: () => createApiRequest('/auth/profile'),
    
    updateProfile: (userData) => createApiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    
    verifyToken: () => createApiRequest('/auth/verify'),
  },

  // Car endpoints
  cars: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return createApiRequest(`/cars${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => createApiRequest(`/cars/${id}`),
    
    create: (carData) => createApiRequest('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    }),
    
    update: (id, carData) => createApiRequest(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    }),
    
    delete: (id) => createApiRequest(`/cars/${id}`, {
      method: 'DELETE',
    }),
    
    checkAvailability: (id, startDate, endDate) => {
      const params = new URLSearchParams({ startDate, endDate });
      return createApiRequest(`/cars/${id}/availability?${params}`);
    },
    
    getCategories: () => createApiRequest('/cars/meta/categories'),
    
    getLocations: () => createApiRequest('/cars/meta/locations'),
    
    // Upload images (admin only)
    upload: (files) => {
      const fd = new FormData();
      [...files].forEach(f => fd.append('images', f));
      return createApiRequest('/cars/upload', {
        method: 'POST',
        body: fd,
      });
    },
  },

  // Booking endpoints
  bookings: {
    getMyBookings: (params = {}) => {
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      const queryString = new URLSearchParams(cleanParams).toString();
      return createApiRequest(`/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
    },
    
    getStats: () => createApiRequest('/bookings/stats'),
    
    getAll: (params = {}) => {
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      const queryString = new URLSearchParams(cleanParams).toString();
      return createApiRequest(`/bookings/all${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => createApiRequest(`/bookings/${id}`),
    
    create: (bookingData) => createApiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
    
    updateStatus: (id, status) => createApiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
    
    cancel: (id, cancellationReason) => createApiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ cancellationReason }),
    }),
    
    update: (id, bookingData) => createApiRequest(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bookingData),
    }),
    
    delete: (id) => createApiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    }),
    
    bulkDelete: (bookingIds) => createApiRequest('/bookings/bulk/delete', {
      method: 'DELETE',
      body: JSON.stringify({ bookingIds }),
    }),
  },

  // User endpoints
  users: {
    getAll: (params = {}) => {
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      
      const queryString = new URLSearchParams(cleanParams).toString();
      return createApiRequest(`/users${queryString ? `?${queryString}` : ''}`);
    },
    
    getById: (id) => createApiRequest(`/users/${id}`),
    
    updateRole: (id, role) => createApiRequest(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
    
    verify: (id) => createApiRequest(`/users/${id}/verify`, {
      method: 'PATCH',
    }),
    
    delete: (id) => createApiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
    
    getDashboardStats: () => createApiRequest('/users/dashboard/stats'),
  },
};

export default api;
