// API Helper utilities

// Handle API errors consistently
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Network errors
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network.';
  }
  
  // Server errors
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  // Authentication errors
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    // Clear invalid tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return 'Session expired. Please log in again.';
  }
  
  // Forbidden errors
  if (error.message.includes('403') || error.message.includes('Forbidden')) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  // Not found errors
  if (error.message.includes('404') || error.message.includes('Not Found')) {
    return 'Resource not found.';
  }
  
  // Validation errors
  if (error.message.includes('400') || error.message.includes('Validation')) {
    return error.message || 'Invalid data provided.';
  }
  
  // Default error message
  return error.message || 'Something went wrong. Please try again.';
};

// Format date for API requests
export const formatDateForApi = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

// Format date for display
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate total days between dates
export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Check if user is at least 18 years old
export const isValidAge = (dateOfBirth, minimumAge = 18) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minimumAge;
  }
  
  return age >= minimumAge;
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get file extension from filename
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is valid image
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};
