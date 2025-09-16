// src/utils/timeUtils.js

// Generate time options for select dropdowns with 30-minute intervals
export const generateTimeOptions = () => {
  const options = [];
  
  // Generate from 6:00 AM to 10:00 PM in 30-minute intervals
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Format for 12-hour display
      let displayHour = hour;
      let period = 'AM';
      
      if (hour === 0) {
        displayHour = 12;
      } else if (hour === 12) {
        period = 'PM';
      } else if (hour > 12) {
        displayHour = hour - 12;
        period = 'PM';
      }
      
      const time12 = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      options.push({ value: time24, label: time12 });
    }
  }
  
  return options;
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
