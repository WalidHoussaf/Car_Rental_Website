// Centralized date calculation utilities for consistent behavior across components

/**
 * Calculate the number of days between two dates (inclusive)
 * This ensures consistent calculation across all booking components
 * 
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} - Number of days (inclusive range)
 */
export const calculateInclusiveDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  // Create new date objects to avoid timezone issues
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Set to start of day to ensure accurate calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const differenceInTime = end.getTime() - start.getTime();
  const days = Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1; // +1 for inclusive range
  
  // Prevent negative values
  return Math.max(days, 0);
};

