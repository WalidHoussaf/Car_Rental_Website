// import { api } from '../config/api'; // Will be used when implementing real API calls

// Enhanced location data structure with comprehensive information
const LOCATION_DATA = {
  casablanca: {
    id: 'casablanca',
    name: 'Casablanca',
    displayName: {
      en: 'Casablanca',
      fr: 'Casablanca'
    },
    coordinates: { lat: 33.5731, lng: -7.5898 },
    address: {
      en: 'Mohammed V International Airport, Casablanca',
      fr: 'Aéroport International Mohammed V, Casablanca'
    },
    type: 'airport',
    isActive: true,
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '21:00' }
    },
    contactInfo: {
      phone: '+212 522 539 040',
      email: 'casablanca@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom', 'cafe'],
    maxCapacity: 50,
    timezone: 'Africa/Casablanca'
  },
  marrakech: {
    id: 'marrakech',
    name: 'Marrakech',
    displayName: {
      en: 'Marrakech',
      fr: 'Marrakech'
    },
    coordinates: { lat: 31.6295, lng: -7.9811 },
    address: {
      en: 'Marrakech Menara Airport, Marrakech',
      fr: 'Aéroport Marrakech Ménara, Marrakech'
    },
    type: 'airport',
    isActive: true,
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '21:00' }
    },
    contactInfo: {
      phone: '+212 524 447 910',
      email: 'marrakech@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom', 'cafe', 'currency_exchange'],
    maxCapacity: 40,
    timezone: 'Africa/Casablanca'
  },
  rabat: {
    id: 'rabat',
    name: 'Rabat',
    displayName: {
      en: 'Rabat',
      fr: 'Rabat'
    },
    coordinates: { lat: 34.0209, lng: -6.8416 },
    address: {
      en: 'Rabat-Salé Airport, Rabat',
      fr: 'Aéroport Rabat-Salé, Rabat'
    },
    type: 'airport',
    isActive: true,
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '21:00' }
    },
    contactInfo: {
      phone: '+212 537 808 090',
      email: 'rabat@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom'],
    maxCapacity: 30,
    timezone: 'Africa/Casablanca'
  },
  fes: {
    id: 'fes',
    name: 'Fes',
    displayName: {
      en: 'Fes',
      fr: 'Fès'
    },
    coordinates: { lat: 34.0181, lng: -5.0078 },
    address: {
      en: 'Fes-Saïs Airport, Fes',
      fr: 'Aéroport Fès-Saïs, Fès'
    },
    type: 'airport',
    isActive: true,
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '21:00' }
    },
    contactInfo: {
      phone: '+212 535 674 712',
      email: 'fes@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom'],
    maxCapacity: 25,
    timezone: 'Africa/Casablanca'
  },
  tangier: {
    id: 'tangier',
    name: 'Tangier',
    displayName: {
      en: 'Tangier',
      fr: 'Tanger'
    },
    coordinates: { lat: 35.7595, lng: -5.8340 },
    address: {
      en: 'Ibn Battouta Airport, Tangier',
      fr: 'Aéroport Ibn Battouta, Tanger'
    },
    type: 'airport',
    isActive: true,
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '21:00' }
    },
    contactInfo: {
      phone: '+212 539 393 720',
      email: 'tangier@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom', 'cafe'],
    maxCapacity: 35,
    timezone: 'Africa/Casablanca'
  },
  agadir: {
    id: 'agadir',
    name: 'Agadir',
    displayName: {
      en: 'Agadir',
      fr: 'Agadir'
    },
    coordinates: { lat: 30.4278, lng: -9.5981 },
    address: {
      en: 'Agadir Al Massira Airport, Agadir',
      fr: 'Aéroport Agadir Al Massira, Agadir'
    },
    type: 'airport',
    isActive: true,
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '21:00' }
    },
    contactInfo: {
      phone: '+212 528 839 122',
      email: 'agadir@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom', 'cafe', 'car_wash'],
    maxCapacity: 30,
    timezone: 'Africa/Casablanca'
  },
  mohammedia: {
    id: 'mohammedia',
    name: 'Mohammedia',
    displayName: {
      en: 'Mohammedia',
      fr: 'Mohammedia'
    },
    coordinates: { lat: 33.6866, lng: -7.3833 },
    address: {
      en: 'Mohammedia City Center, Mohammedia',
      fr: 'Centre-ville de Mohammedia, Mohammedia'
    },
    type: 'city',
    isActive: true,
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '19:00' }
    },
    contactInfo: {
      phone: '+212 523 324 567',
      email: 'mohammedia@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom', 'fuel_station'],
    maxCapacity: 25,
    timezone: 'Africa/Casablanca'
  },
  kenitra: {
    id: 'kenitra',
    name: 'Kenitra',
    displayName: {
      en: 'Kenitra',
      fr: 'Kénitra'
    },
    coordinates: { lat: 34.2610, lng: -6.5802 },
    address: {
      en: 'Kenitra Train Station, Kenitra',
      fr: 'Gare de Kénitra, Kénitra'
    },
    type: 'train_station',
    isActive: true,
    operatingHours: {
      weekdays: { open: '07:00', close: '21:00' },
      weekends: { open: '08:00', close: '20:00' }
    },
    contactInfo: {
      phone: '+212 537 371 234',
      email: 'kenitra@rentmyride.ma'
    },
    amenities: ['parking', 'wifi', 'restroom', 'cafe'],
    maxCapacity: 20,
    timezone: 'Africa/Casablanca'
  }
};

// Location service class with comprehensive functionality
class LocationService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  // Get all available locations
  async getAllLocations() {
    try {
      // Check cache first
      const cacheKey = 'all_locations';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // This would be an API call after we finish the backend
      // const response = await api.locations.getAll();
      
      // For now, return our static data
      const locations = Object.values(LOCATION_DATA).filter(loc => loc.isActive);
      
      const result = {
        success: true,
        data: locations
      };
      
      // Cache the result
      this.setCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return {
        success: false,
        error: 'Failed to fetch locations',
        data: []
      };
    }
  }

  // Get locations available for a specific car
  async getAvailableLocationsForCar(carId) {
    try {
      const cacheKey = `car_locations_${carId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // This would check car availability at each location after we finish the backend
      // const response = await api.cars.getAvailableLocations(carId);
      
      // For now, return all active locations
      const allLocations = await this.getAllLocations();
      if (!allLocations.success) return allLocations;

      const result = {
        success: true,
        data: allLocations.data
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching car locations:', error);
      return {
        success: false,
        error: 'Failed to fetch available locations for car',
        data: []
      };
    }
  }

  // Validate location availability for specific dates
  async validateLocationAvailability(locationId, startDate, endDate, carId = null) {
    // carId will be used for future API integration to check car-specific availability
    try {
      const location = LOCATION_DATA[locationId];
      if (!location) {
        return {
          success: false,
          error: 'Location not found',
          available: false
        };
      }

      if (!location.isActive) {
        return {
          success: false,
          error: 'Location is currently inactive',
          available: false
        };
      }

      // Check if dates are within operating hours
      const isWithinOperatingHours = this.isWithinOperatingHours(location, startDate, endDate);
      if (!isWithinOperatingHours) {
        return {
          success: false,
          error: 'Requested time is outside operating hours',
          available: false
        };
      }

      // Check actual availability against bookings after we finish the backend
      // const response = await api.locations.checkAvailability(locationId, startDate, endDate, carId);
      // Note: carId parameter will be used in future API integration
      
      // Temporary: Log carId to avoid unused parameter warning
      if (carId) {
        console.log(`Checking availability for car ${carId} at location ${locationId}`);
      }

      return {
        success: true,
        available: true,
        location: location
      };
    } catch (error) {
      console.error('Error validating location availability:', error);
      return {
        success: false,
        error: 'Failed to validate location availability',
        available: false
      };
    }
  }

  // Get location details by ID
  async getLocationById(locationId) {
    try {
      const location = LOCATION_DATA[locationId];
      if (!location) {
        return {
          success: false,
          error: 'Location not found',
          data: null
        };
      }

      return {
        success: true,
        data: location
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return {
        success: false,
        error: 'Failed to fetch location details',
        data: null
      };
    }
  }

  // Calculate distance between two locations
  calculateDistance(location1Id, location2Id) {
    const loc1 = LOCATION_DATA[location1Id];
    const loc2 = LOCATION_DATA[location2Id];

    if (!loc1 || !loc2) {
      return { success: false, error: 'Invalid location(s)' };
    }

    if (location1Id === location2Id) {
      return { success: true, distance: 0, unit: 'km' };
    }

    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(loc2.coordinates.lat - loc1.coordinates.lat);
    const dLng = this.toRadians(loc2.coordinates.lng - loc1.coordinates.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(loc1.coordinates.lat)) * 
              Math.cos(this.toRadians(loc2.coordinates.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return {
      success: true,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      unit: 'km'
    };
  }

  // Check if requested time is within operating hours
  isWithinOperatingHours(location, startDate, endDate) {
    // Check if pickup and dropoff times are within operating hours
    // Users can make reservations anytime, but pickup/dropoff must be during business hours
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If the time is very early (before 6 AM) or very late (after 10 PM), 
    // assume it's a date-only selection and use default business hours
    const startHour = start.getHours();
    const endHour = end.getHours();
    
    // Default to 9 AM for pickup and 6 PM for dropoff if times seem unreasonable
    let pickupHour, pickupMinutes, dropoffHour, dropoffMinutes;
    
    if (startHour < 6 || startHour > 22) {
      // Use default pickup time of 9:00 AM
      pickupHour = 9;
      pickupMinutes = 0;
    } else {
      pickupHour = startHour;
      pickupMinutes = start.getMinutes();
    }
    
    if (endHour < 6 || endHour > 22) {
      // Use default dropoff time of 6:00 PM
      dropoffHour = 18;
      dropoffMinutes = 0;
    } else {
      dropoffHour = endHour;
      dropoffMinutes = end.getMinutes();
    }
    const isPickupWeekend = start.getDay() === 0 || start.getDay() === 6;
    const pickupHours = isPickupWeekend ? location.operatingHours.weekends : location.operatingHours.weekdays;
    
    const pickupOpenTime = pickupHours.open.split(':');
    const pickupCloseTime = pickupHours.close.split(':');
    const pickupOpenHour = parseInt(pickupOpenTime[0]);
    const pickupOpenMinutes = parseInt(pickupOpenTime[1]);
    const pickupCloseHour = parseInt(pickupCloseTime[0]);
    const pickupCloseMinutes = parseInt(pickupCloseTime[1]);
    
    // Convert to minutes for easier comparison
    const pickupTimeInMinutes = pickupHour * 60 + pickupMinutes;
    const pickupOpenInMinutes = pickupOpenHour * 60 + pickupOpenMinutes;
    const pickupCloseInMinutes = pickupCloseHour * 60 + pickupCloseMinutes;
    
    const isPickupValid = pickupTimeInMinutes >= pickupOpenInMinutes && pickupTimeInMinutes <= pickupCloseInMinutes;
    
    // Check dropoff time
    const isDropoffWeekend = end.getDay() === 0 || end.getDay() === 6;
    const dropoffHours = isDropoffWeekend ? location.operatingHours.weekends : location.operatingHours.weekdays;
    
    const dropoffOpenTime = dropoffHours.open.split(':');
    const dropoffCloseTime = dropoffHours.close.split(':');
    const dropoffOpenHour = parseInt(dropoffOpenTime[0]);
    const dropoffOpenMinutes = parseInt(dropoffOpenTime[1]);
    const dropoffCloseHour = parseInt(dropoffCloseTime[0]);
    const dropoffCloseMinutes = parseInt(dropoffCloseTime[1]);
    
    const dropoffTimeInMinutes = dropoffHour * 60 + dropoffMinutes;
    const dropoffOpenInMinutes = dropoffOpenHour * 60 + dropoffOpenMinutes;
    const dropoffCloseInMinutes = dropoffCloseHour * 60 + dropoffCloseMinutes;
    
    const isDropoffValid = dropoffTimeInMinutes >= dropoffOpenInMinutes && dropoffTimeInMinutes <= dropoffCloseInMinutes;
    
    return isPickupValid && isDropoffValid;
  }

  // Utility methods
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Format location for display in select components
  formatLocationForSelect(location, language = 'en') {
    return {
      value: location.id,
      label: location.displayName[language] || location.name,
      data: location
    };
  }

  // Get formatted locations for select component
  async getFormattedLocationsForSelect(language = 'en', carId = null) {
    const result = carId 
      ? await this.getAvailableLocationsForCar(carId)
      : await this.getAllLocations();
    
    // Note: carId parameter is reserved for future API integration

    if (!result.success) {
      return { success: false, error: result.error, options: [] };
    }

    const options = result.data.map(location => 
      this.formatLocationForSelect(location, language)
    );

    return { success: true, options };
  }
}

// Create and export singleton instance
const locationService = new LocationService();
export default locationService;

// Export location data for backward compatibility
export { LOCATION_DATA };
