// Time validation utilities for booking system
import { generateTimeOptions } from './timeUtils';

// Location operating hours configuration
export const LOCATION_OPERATING_HOURS = {
  casablanca: {
    weekdays: { open: '08:00', close: '20:00' },
    weekends: { open: '09:00', close: '18:00' }
  },
  mohammedia: {
    weekdays: { open: '08:00', close: '20:00' },
    weekends: { open: '09:00', close: '18:00' }
  },
  rabat: {
    weekdays: { open: '08:00', close: '20:00' },
    weekends: { open: '09:00', close: '18:00' }
  },
  kenitra: {
    weekdays: { open: '08:00', close: '20:00' },
    weekends: { open: '09:00', close: '18:00' }
  },
  agadir: {
    weekdays: { open: '08:00', close: '20:00' },
    weekends: { open: '09:00', close: '18:00' }
  },
  fes: {
    weekdays: { open: '08:00', close: '20:00' },
    weekends: { open: '09:00', close: '18:00' }
  },
  'mohammed-v-airport': {
    weekdays: { open: '06:00', close: '22:00' },
    weekends: { open: '06:00', close: '22:00' }
  },
  // Legacy support for 'airport' key
  airport: {
    weekdays: { open: '06:00', close: '22:00' },
    weekends: { open: '06:00', close: '22:00' }
  }
};

// Buffer time in minutes for booking processing
const BOOKING_BUFFER_MINUTES = 30;

/**
 * Get available time slots for a location on a specific date
 * Filters out past times for today's bookings and respects operating hours
 */
export const getAvailableTimeSlots = (location, date) => {
  try {
    if (!location || !date) {
      return {
        success: false,
        error: 'Location and date are required',
        timeSlots: [],
        isToday: false
      };
    }

    const selectedDate = new Date(date);
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    // Get operating hours for the location
    const locationHours = LOCATION_OPERATING_HOURS[location.toLowerCase()];
    if (!locationHours) {
      // Fallback to default hours if location not found
      const allTimeSlots = generateTimeOptions();
      return {
        success: true,
        timeSlots: allTimeSlots,
        isToday,
        message: `Using default hours for ${location}`
      };
    }

    // Determine if it's weekend
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const hours = isWeekend ? locationHours.weekends : locationHours.weekdays;
    
    // Generate time slots within operating hours
    const allTimeSlots = generateTimeOptions();
    let availableSlots = allTimeSlots.filter(slot => {
      return slot.value >= hours.open && slot.value <= hours.close;
    });

    // For today's bookings, filter out past times with buffer
    if (isToday) {
      const now = new Date();
      const currentTimeWithBuffer = new Date(now.getTime() + BOOKING_BUFFER_MINUTES * 60000);
      
      // Round up to next 30-minute slot
      const minutes = currentTimeWithBuffer.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 30) * 30;
      currentTimeWithBuffer.setMinutes(roundedMinutes, 0, 0);
      
      const minTimeString = currentTimeWithBuffer.toTimeString().slice(0, 5);
      
      availableSlots = availableSlots.filter(slot => slot.value >= minTimeString);
      
      // If no slots available, return empty with message
      if (availableSlots.length === 0) {
        return {
          success: true,
          timeSlots: [],
          isToday: true,
          message: `No available times today. Next available time would be ${minTimeString} but location closes at ${hours.close}.`
        };
      }
    }

    return {
      success: true,
      timeSlots: availableSlots,
      isToday,
      operatingHours: hours,
      message: isToday ? `Times available from ${availableSlots[0]?.value || 'none'} (current time + ${BOOKING_BUFFER_MINUTES}min buffer)` : null
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      timeSlots: generateTimeOptions(),
      isToday: false
    };
  }
};

/**
 * Validate if a specific time is still available for booking
 * Used for real-time validation
 */
export const validateTimeAvailability = (location, date, time) => {
  try {
    const result = getAvailableTimeSlots(location, date);
    
    if (!result.success) {
      return { valid: false, reason: result.error };
    }
    
    const isTimeAvailable = result.timeSlots.some(slot => slot.value === time);
    
    return {
      valid: isTimeAvailable,
      reason: isTimeAvailable ? null : 'Selected time is no longer available',
      suggestedTime: result.timeSlots.length > 0 ? result.timeSlots[0].value : null,
      isToday: result.isToday
    };
    
  } catch (error) {
    return {
      valid: false,
      reason: error.message,
      suggestedTime: null,
      isToday: false
    };
  }
};

/**
 * Get the next available time slot for a location
 * Useful for automatic time adjustment
 */
export const getNextAvailableTime = (location, date) => {
  const result = getAvailableTimeSlots(location, date);
  
  if (result.success && result.timeSlots.length > 0) {
    return {
      success: true,
      time: result.timeSlots[0].value,
      isToday: result.isToday
    };
  }
  
  return {
    success: false,
    time: null,
    error: result.error || 'No available times'
  };
};

/**
 * Check if current time selection needs real-time monitoring
 * Returns true for today's bookings
 */
export const needsRealTimeValidation = (date) => {
  if (!date) return false;
  
  const selectedDate = new Date(date);
  const today = new Date();
  return selectedDate.toDateString() === today.toDateString();
};
