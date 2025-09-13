// OpenStreetMap Nominatim API service for geocoding
class NominatimService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours cache for location data
  }

  // Search for a location and get detailed address information
  async searchLocation(query, countryCode = 'MA') {
    try {
      const cacheKey = `search_${query}_${countryCode}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const params = new URLSearchParams({
        q: query,
        format: 'json',
        countrycodes: countryCode,
        limit: 1,
        addressdetails: 1,
        extratags: 1,
        namedetails: 1
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        headers: {
          'User-Agent': 'RentMyRide-CarRental/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        return {
          success: false,
          error: 'Location not found',
          data: null
        };
      }

      const location = data[0];
      const result = {
        success: true,
        data: {
          displayName: location.display_name,
          address: this.formatAddress(location.address),
          coordinates: {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon)
          },
          boundingBox: location.boundingbox,
          placeId: location.place_id,
          osmType: location.osm_type,
          osmId: location.osm_id,
          importance: location.importance,
          addressComponents: location.address
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Nominatim search error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Reverse geocoding - get address from coordinates
  async reverseGeocode(lat, lng) {
    try {
      const cacheKey = `reverse_${lat}_${lng}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: 1,
        extratags: 1,
        namedetails: 1
      });

      const response = await fetch(`${this.baseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': 'RentMyRide-CarRental/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        return {
          success: false,
          error: data.error,
          data: null
        };
      }

      const result = {
        success: true,
        data: {
          displayName: data.display_name,
          address: this.formatAddress(data.address),
          coordinates: {
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lon)
          },
          placeId: data.place_id,
          osmType: data.osm_type,
          osmId: data.osm_id,
          addressComponents: data.address
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Nominatim reverse geocode error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // Get detailed information for Morocco cities used in the app
  async getMoroccoLocationDetails(cityName) {
    // Add validation for undefined/null cityName
    if (!cityName || typeof cityName !== 'string') {
      return {
        success: false,
        error: 'Invalid city name provided',
        data: null
      };
    }

    const cityQueries = {
      'casablanca': 'Mohammed V International Airport, Casablanca, Morocco',
      'mohammedia': 'Mohammedia, Morocco',
      'rabat': 'Rabat, Morocco',
      'airport': 'Mohammed V International Airport, Casablanca, Morocco',
      'mohammed-v-airport': 'Mohammed V International Airport, Casablanca, Morocco',
      'marrakech': 'Marrakech Menara Airport, Morocco',
      'fes': 'Fes, Morocco',
      'kenitra': 'Kenitra, Morocco',
      'tangier': 'Ibn Battouta Airport, Tangier, Morocco',
      'agadir': 'Agadir Al Massira Airport, Morocco'
    };

    const query = cityQueries[cityName.toLowerCase()] || `${cityName}, Morocco`;
    return await this.searchLocation(query);
  }

  // Format address components into a readable string
  formatAddress(addressComponents) {
    if (!addressComponents) return '';

    const parts = [];
    
    // Add specific location (airport, station, etc.)
    if (addressComponents.aeroway || addressComponents.amenity) {
      if (addressComponents.name) {
        parts.push(addressComponents.name);
      }
    }

    // Add road/street
    if (addressComponents.road) {
      parts.push(addressComponents.road);
    }

    // Add suburb/neighbourhood
    if (addressComponents.suburb) {
      parts.push(addressComponents.suburb);
    }

    // Add city
    if (addressComponents.city) {
      parts.push(addressComponents.city);
    } else if (addressComponents.town) {
      parts.push(addressComponents.town);
    } else if (addressComponents.village) {
      parts.push(addressComponents.village);
    }

    // Add state/region
    if (addressComponents.state) {
      parts.push(addressComponents.state);
    }

    // Add country
    if (addressComponents.country) {
      parts.push(addressComponents.country);
    }

    return parts.join(', ');
  }

  // Get location data for all app locations
  async getAllAppLocations() {
    const locations = [
      'casablanca',
      'mohammedia', 
      'rabat',
      'airport',
      'marrakech',
      'fes',
      'tangier',
      'agadir'
    ];

    const results = {};
    
    for (const location of locations) {
      try {
        const result = await this.getMoroccoLocationDetails(location);
        if (result.success) {
          results[location] = result.data;
        } else {
          console.warn(`Failed to get details for ${location}:`, result.error);
          // Fallback to basic info
          results[location] = {
            displayName: `${location.charAt(0).toUpperCase() + location.slice(1)}, Morocco`,
            address: `${location.charAt(0).toUpperCase() + location.slice(1)}, Morocco`,
            coordinates: { lat: 0, lng: 0 },
            error: result.error
          };
        }
        
        // Add delay to respect API rate limits
        await this.delay(1000);
      } catch (error) {
        console.error(`Error fetching ${location}:`, error);
        results[location] = {
          displayName: `${location.charAt(0).toUpperCase() + location.slice(1)}, Morocco`,
          address: `${location.charAt(0).toUpperCase() + location.slice(1)}, Morocco`,
          coordinates: { lat: 0, lng: 0 },
          error: error.message
        };
      }
    }

    return {
      success: true,
      data: results
    };
  }

  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
}

// Create and export singleton instance
const nominatimService = new NominatimService();
export default nominatimService;
