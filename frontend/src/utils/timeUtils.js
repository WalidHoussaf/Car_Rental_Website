// src/utils/timeUtils.js

// Generate time options for select dropdowns (memoized)
export const generateTimeOptions = () => {
  return Array.from({ length: 15 }, (_, i) => {
    const hour = 6 + i;
    const time24 = `${hour.toString().padStart(2, '0')}:00`;
    const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
    return { value: time24, label: time12 };
  });
};

// Validate that dropoff time is after pickup time
export const validateTimeOrder = (pickupTime, dropoffTime, pickupDate, dropoffDate) => {
  // If dates are different, time order doesn't matter
  if (pickupDate !== dropoffDate) {
    return true;
  }
  
  // Convert times to minutes for comparison
  const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
  const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
  
  const pickupMinutes = pickupHour * 60 + pickupMinute;
  const dropoffMinutes = dropoffHour * 60 + dropoffMinute;
  
  return dropoffMinutes > pickupMinutes;
};

// Format time for display
export const formatTimeForDisplay = (time24) => {
  const [hour] = time24.split(':').map(Number);
  return hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
};

// Operating hours configuration
export const OPERATING_HOURS = {
  START: 6,
  END: 20,
  TOTAL_HOURS: 15
};
