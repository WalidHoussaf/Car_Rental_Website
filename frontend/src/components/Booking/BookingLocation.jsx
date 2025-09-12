import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Select from 'react-select';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import locationService from '../../services/locationService';
import { locationSelectStyles, timeSelectStyles } from '../../styles/selectStyles';
import { generateTimeOptions, validateTimeOrder } from '../../utils/timeUtils';
import MapMarkerIcon from '../Ui/Icons/MapMarkerIcon';
import SpinnerIcon from '../Ui/Icons/SpinnerIcon';
import CheckmarkIcon from '../Ui/Icons/CheckmarkIcon';
import LocationPinIcon from '../Ui/Icons/LocationPinIcon';
import DestinationIcon from '../Ui/Icons/DestinationIcon';
import ArrowLeftIcon from '../Ui/Icons/ArrowLeftIcon';
import ArrowRightIcon from '../Ui/Icons/ArrowRightIcon';

// Global Leaflet loading cache
let leafletLoadingPromise = null;
let leafletLoaded = false;

// Utility function to find the closest location to a given coordinate
const findClosestLocation = (targetLatLng, locations) => {
  if (!locations || locations.length === 0) return null;
  
  let closestLocation = null;
  let minDistance = Infinity;
  
  locations.forEach(location => {
    if (location.coordinates) {
      const distance = Math.sqrt(
        Math.pow(location.coordinates.lat - targetLatLng.lat, 2) +
        Math.pow(location.coordinates.lng - targetLatLng.lng, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    }
  });
  
  return closestLocation;
};

// Interactive map component using OpenStreetMap with Leaflet
const InteractiveMap = ({ pickup, dropoff, sameLocation, locations, onLocationSelect }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(leafletLoaded);
  const [mapError, setMapError] = useState(null);

  // Loading Leaflet resources with caching
  useEffect(() => {
    const loadLeafletResources = async () => {
      if (leafletLoaded || window.L) {
        setMapLoaded(true);
        leafletLoaded = true;
        return;
      }

      // Use cached promise if already loading
      if (leafletLoadingPromise) {
        try {
          await leafletLoadingPromise;
          setMapLoaded(true);
        } catch (error) {
          console.error('Error loading Leaflet:', error);
          setMapError('Failed to load map resources');
        }
        return;
      }

      // Create new loading promise
      leafletLoadingPromise = new Promise((resolve, reject) => {
        try {
          // Load Leaflet CSS
          const linkElement = document.createElement('link');
          linkElement.rel = 'stylesheet';
          linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          linkElement.crossOrigin = '';
          document.head.appendChild(linkElement);

          // Load Leaflet script
          const scriptElement = document.createElement('script');
          scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          scriptElement.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          scriptElement.crossOrigin = '';
          document.body.appendChild(scriptElement);

          scriptElement.onload = () => {
            leafletLoaded = true;
            resolve();
          };
          
          scriptElement.onerror = () => {
            reject(new Error('Failed to load Leaflet script'));
          };
        } catch (error) {
          reject(error);
        }
      });

      try {
        await leafletLoadingPromise;
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setMapError('Failed to load map resources');
      }
    };

    loadLeafletResources();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize map after Leaflet loads
  useEffect(() => {
    if (mapLoaded && mapContainerRef.current && !mapRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      });

      // Replace dark theme with a lighter one
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapRef.current = map;
    }
  }, [mapLoaded]);

  // Update markers when pickup/dropoff change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;
    
    // Clean existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const pickupLocation = locations?.find(loc => loc.id === pickup);
    if (pickup && pickupLocation) {
      const pickupCoords = pickupLocation.coordinates;
      
      // Create custom icon for pickup point
      const pickupIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-cyan-500/50">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add pickup marker with drag and click handlers
      const pickupMarker = window.L.marker([pickupCoords.lat, pickupCoords.lng], { 
        icon: pickupIcon,
        title: `${pickupLocation.displayName[language] || pickupLocation.name} Branch`,
        draggable: true
      }).addTo(map);
      
      // Add click handler for location selection
      pickupMarker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(pickup, 'pickup');
        }
      });
      
      // Add drag handlers for manual positioning
      pickupMarker.on('dragstart', () => {
        pickupMarker.setOpacity(0.7);
      });
      
      pickupMarker.on('dragend', (e) => {
        const newLatLng = e.target.getLatLng();
        pickupMarker.setOpacity(1);
        
        // Find the closest available location to the new position
        const closestLocation = findClosestLocation(newLatLng, locations);
        if (closestLocation && onLocationSelect) {
          onLocationSelect(closestLocation.id, 'pickup');
        }
      });
      
      markersRef.current.push(pickupMarker);

      // If it's the only point, center on it
      if (sameLocation || !dropoff) {
        map.setView([pickupCoords.lat, pickupCoords.lng], 13);
      }
    }

    // Add dropoff marker if different
    const dropoffLocation = locations?.find(loc => loc.id === dropoff);
    if (!sameLocation && dropoff && dropoffLocation) {
      const dropoffCoords = dropoffLocation.coordinates;
      
      // Create custom icon for dropoff point
      const dropoffIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add dropoff marker with drag and click handlers
      const dropoffMarker = window.L.marker([dropoffCoords.lat, dropoffCoords.lng], { 
        icon: dropoffIcon,
        title: `${dropoffLocation.displayName[language] || dropoffLocation.name} Branch`,
        draggable: true
      }).addTo(map);
      
      // Add click handler for location selection
      dropoffMarker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(dropoff, 'dropoff');
        }
      });
      
      // Add drag handlers for manual positioning
      dropoffMarker.on('dragstart', () => {
        dropoffMarker.setOpacity(0.7);
      });
      
      dropoffMarker.on('dragend', (e) => {
        const newLatLng = e.target.getLatLng();
        dropoffMarker.setOpacity(1);
        
        // Find the closest available location to the new position
        const closestLocation = findClosestLocation(newLatLng, locations);
        if (closestLocation && onLocationSelect) {
          onLocationSelect(closestLocation.id, 'dropoff');
        }
      });
      
      markersRef.current.push(dropoffMarker);

      // If the two points are different, adjust view to see both
      if (pickup !== dropoff && pickupLocation) {
        const bounds = window.L.latLngBounds(
          [pickupLocation.coordinates.lat, pickupLocation.coordinates.lng],
          [dropoffCoords.lat, dropoffCoords.lng]
        );
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [mapLoaded, pickup, dropoff, sameLocation, locations, language, onLocationSelect]);

  return (
    <div className="relative h-64 bg-black/60 rounded-xl mb-8 overflow-hidden border border-blue-900/20 group-hover:border-blue-900/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 pointer-events-none"></div>
      
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
          <div className="text-gray-500 font-['Orbitron'] flex flex-col items-center">
            <SpinnerIcon className="mb-2" />
            <span>{t('loadingMap')}</span>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
          <div className="text-red-400 font-['Orbitron'] flex flex-col items-center text-center p-4">
            <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{mapError}</span>
          </div>
        </div>
      )}
      
      <div ref={mapContainerRef} className="w-full h-full z-0"></div>
    </div>
  );
};

const BookingLocation = ({ car, bookingDetails, onLocationSelection, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [pickup, setPickup] = useState(bookingDetails.pickupLocation || '');
  const [dropoff, setDropoff] = useState(bookingDetails.dropoffLocation || '');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [dropoffTime, setDropoffTime] = useState('18:00');
  const [sameLocation, setSameLocation] = useState(true);
  const [locations, setLocations] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Memoized time options based on selected locations
  const pickupTimeOptions = useMemo(() => {
    if (!pickup || !bookingDetails.startDate) return generateTimeOptions();
    
    const result = locationService.getAvailableTimeSlots(
      pickup, 
      bookingDetails.startDate
    );
    
    return result.success ? result.timeSlots : generateTimeOptions();
  }, [pickup, bookingDetails.startDate]);
  
  const dropoffTimeOptions = useMemo(() => {
    if (!dropoff || !bookingDetails.endDate) return generateTimeOptions();
    
    const result = locationService.getAvailableTimeSlots(
      dropoff, 
      bookingDetails.endDate
    );
    
    return result.success ? result.timeSlots : generateTimeOptions();
  }, [dropoff, bookingDetails.endDate]);
  
  // Load available locations when component mounts
  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await locationService.getAvailableLocationsForCar(car.id);
        
        if (result.success) {
          setLocations(result.data);
          
          // Format locations for select component
          const formattedResult = await locationService.getFormattedLocationsForSelect(language, car.id);
          if (formattedResult.success) {
            setAvailableLocations(formattedResult.options);
          }
        } else {
          setError(result.error);
          // Fallback to car's location data if service fails
          const fallbackLocations = Array.isArray(car.location) 
            ? car.location.map(loc => ({ value: loc, label: loc.charAt(0).toUpperCase() + loc.slice(1) }))
            : [{ value: car.location, label: car.location.charAt(0).toUpperCase() + car.location.slice(1) }];
          setAvailableLocations(fallbackLocations);
        }
      } catch (err) {
        console.error('Error loading locations:', err);
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [car.id, car.location, language]);

  // Initialize with bookingDetails when locations are loaded
  useEffect(() => {
    if (bookingDetails.pickupLocation && bookingDetails.dropoffLocation && locations.length > 0) {
      setPickup(bookingDetails.pickupLocation);
      setDropoff(bookingDetails.dropoffLocation);
      setSameLocation(bookingDetails.pickupLocation === bookingDetails.dropoffLocation);
    }
  }, [bookingDetails, locations]);
  
  // When sameLocation changes, update dropoff
  useEffect(() => {
    if (sameLocation) {
      setDropoff(pickup);
    }
  }, [sameLocation, pickup]);

  // Reset pickup time when pickup location changes to ensure it's within operating hours
  useEffect(() => {
    if (pickup && bookingDetails.startDate) {
      const result = locationService.getAvailableTimeSlots(pickup, bookingDetails.startDate);
      if (result.success && result.timeSlots.length > 0) {
        // Check if current pickup time is valid for this location
        const isCurrentTimeValid = result.timeSlots.some(slot => slot.value === pickupTime);
        if (!isCurrentTimeValid) {
          // Set to the first available time slot (opening time or next available for today)
          setPickupTime(result.timeSlots[0].value);
        }
      }
    }
  }, [pickup, bookingDetails.startDate, pickupTime]);

  // Refresh time options every minute for today's bookings to handle real-time updates
  useEffect(() => {
    if (!pickup || !bookingDetails.startDate) return;

    const targetDate = new Date(bookingDetails.startDate);
    const isToday = targetDate.toDateString() === new Date().toDateString();
    
    if (!isToday) return;

    const interval = setInterval(() => {
      const result = locationService.getAvailableTimeSlots(pickup, bookingDetails.startDate);
      if (result.success && result.timeSlots.length > 0) {
        // Check if current pickup time is still valid
        const isCurrentTimeValid = result.timeSlots.some(slot => slot.value === pickupTime);
        if (!isCurrentTimeValid) {
          // Auto-update to next available time
          setPickupTime(result.timeSlots[0].value);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pickup, bookingDetails.startDate, pickupTime]);

  // Reset dropoff time when dropoff location changes to ensure it's within operating hours
  useEffect(() => {
    if (dropoff && bookingDetails.endDate && !sameLocation) {
      const result = locationService.getAvailableTimeSlots(dropoff, bookingDetails.endDate);
      if (result.success && result.timeSlots.length > 0) {
        // Check if current dropoff time is valid for this location
        const isCurrentTimeValid = result.timeSlots.some(slot => slot.value === dropoffTime);
        if (!isCurrentTimeValid) {
          // Set to a reasonable default time (6 PM or last available slot if earlier)
          const preferredTime = '18:00';
          const preferredSlot = result.timeSlots.find(slot => slot.value === preferredTime);
          setDropoffTime(preferredSlot ? preferredTime : result.timeSlots[result.timeSlots.length - 1].value);
        }
      }
    }
  }, [dropoff, bookingDetails.endDate, sameLocation, dropoffTime]);

  // Sync dropoff time with pickup location when same location is selected
  useEffect(() => {
    if (sameLocation && pickup && bookingDetails.endDate) {
      const result = locationService.getAvailableTimeSlots(pickup, bookingDetails.endDate);
      if (result.success && result.timeSlots.length > 0) {
        // Check if current dropoff time is valid for the pickup location
        const isCurrentTimeValid = result.timeSlots.some(slot => slot.value === dropoffTime);
        if (!isCurrentTimeValid) {
          // Set to a reasonable default time (6 PM or last available slot if earlier)
          const preferredTime = '18:00';
          const preferredSlot = result.timeSlots.find(slot => slot.value === preferredTime);
          setDropoffTime(preferredSlot ? preferredTime : result.timeSlots[result.timeSlots.length - 1].value);
        }
      }
    }
  }, [sameLocation, pickup, bookingDetails.endDate, dropoffTime]);
  
  // Handle location selection from map
  const handleLocationSelect = useCallback((locationId, type) => {
    if (type === 'pickup') {
      setPickup(locationId);
      if (sameLocation) {
        setDropoff(locationId);
      }
    } else if (type === 'dropoff' && !sameLocation) {
      setDropoff(locationId);
    }
  }, [sameLocation]);
  
  // Time validation
  const timeValidationError = useMemo(() => {
    if (bookingDetails.startDate && bookingDetails.endDate && 
        bookingDetails.startDate === bookingDetails.endDate && 
        !validateTimeOrder(pickupTime, dropoffTime, bookingDetails.startDate, bookingDetails.endDate)) {
      return t('dropoffTimeMustBeAfterPickup');
    }
    return null;
  }, [pickupTime, dropoffTime, bookingDetails.startDate, bookingDetails.endDate, t]);
  
  // Validate location availability before continuing
  const validateAndContinue = async () => {
    setValidationErrors({});
    
    if (!pickup) {
      setValidationErrors(prev => ({ ...prev, pickup: t('pleaseSelectPickupLocation') }));
      return;
    }
    
    if (!sameLocation && !dropoff) {
      setValidationErrors(prev => ({ ...prev, dropoff: t('pleaseSelectDropoffLocation') }));
      return;
    }
    
    // Validate time order
    if (timeValidationError) {
      setValidationErrors(prev => ({ ...prev, time: timeValidationError }));
      return;
    }
    
    // Validate pickup location availability
    if (bookingDetails.startDate && bookingDetails.endDate) {
      // Create date objects with selected times
      const startDateTime = new Date(bookingDetails.startDate);
      const endDateTime = new Date(bookingDetails.endDate);
      
      // Set the selected times
      const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
      const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
      
      startDateTime.setHours(pickupHour, pickupMinute, 0, 0);
      endDateTime.setHours(dropoffHour, dropoffMinute, 0, 0);
      
      const pickupValidation = await locationService.validateLocationAvailability(
        pickup, 
        startDateTime, 
        endDateTime, 
        car.id
      );
      
      if (!pickupValidation.success || !pickupValidation.available) {
        let errorMsg = pickupValidation.error || t('locationNotAvailable');
        if (pickupValidation.hoursValidation && !pickupValidation.hoursValidation.pickupValid) {
          const pickupLocation = locations.find(loc => loc.id === pickup);
          if (pickupLocation) {
            const date = new Date(bookingDetails.startDate);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const hours = isWeekend ? pickupLocation.operatingHours.weekends : pickupLocation.operatingHours.weekdays;
            errorMsg = `Pickup time ${pickupTime} is outside operating hours (${hours.open} - ${hours.close})`;
          }
        }
        setValidationErrors(prev => ({ 
          ...prev, 
          pickup: errorMsg
        }));
        return;
      }
      
      // Validate dropoff location if different
      if (!sameLocation) {
        const dropoffValidation = await locationService.validateLocationAvailability(
          dropoff, 
          startDateTime, 
          endDateTime, 
          car.id
        );
        
        if (!dropoffValidation.success || !dropoffValidation.available) {
          let errorMsg = dropoffValidation.error || t('locationNotAvailable');
          if (dropoffValidation.hoursValidation && !dropoffValidation.hoursValidation.dropoffValid) {
            const dropoffLocation = locations.find(loc => loc.id === dropoff);
            if (dropoffLocation) {
              const date = new Date(bookingDetails.endDate);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const hours = isWeekend ? dropoffLocation.operatingHours.weekends : dropoffLocation.operatingHours.weekdays;
              errorMsg = `Dropoff time ${dropoffTime} is outside operating hours (${hours.open} - ${hours.close})`;
            }
          }
          setValidationErrors(prev => ({ 
            ...prev, 
            dropoff: errorMsg
          }));
          return;
        }
      }
    }
    
    // All validations passed, proceed (include selected times)
    onLocationSelection(pickup, dropoff, pickupTime, dropoffTime);
  };
  
  return (
    <div className="relative rounded-xl p-8 md:p-12 overflow-hidden max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>     
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="z-10 w-full space-y-8 md:space-y-10 lg:space-y-12 relative">
       <div className="text-center space-y-2">
       <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
          {t('selectPickupDropoff')}
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto opacity-60"></div>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Location Selection Section */}
          <div className="relative">
            <h3 className="text-xl md:text-2xl text-cyan-400 font-['Orbitron'] mb-8 flex items-center justify-center lg:justify-start">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              {t('chooseYourLocations')}
            </h3>
            
            <div className="space-y-8">
              {/* Pickup Location */}
              <div className="relative">
                <label className="text-base font-medium text-gray-300 mb-4 font-['Orbitron'] flex items-center">
                  <MapMarkerIcon className="w-5 h-5 mr-2 text-cyan-400" />
                  {t('pickupLocation')}
                </label>
                <div className="relative">
                  <Select
                    options={availableLocations}
                    value={availableLocations.find(loc => loc.value === pickup)}
                    onChange={(selected) => {
                      setPickup(selected?.value || '');
                      // Clear validation error when user makes a selection
                      if (validationErrors.pickup) {
                        setValidationErrors(prev => ({ ...prev, pickup: null }));
                      }
                    }}
                    onInputChange={(inputValue, { action }) => {
                      // Clear selected value when user starts typing
                      if (action === 'input-change' && pickup) {
                        setPickup('');
                      }
                    }}
                    styles={locationSelectStyles}
                    isSearchable={true}
                    placeholder={t('searchOrSelectLocation')}
                    noOptionsMessage={() => t('noLocationsFound')}
                    isDisabled={loading}
                    isClearable={true}
                    openMenuOnClick={true}
                    openMenuOnFocus={true}
                  />
                  {validationErrors.pickup && (
                    <p className="mt-2 text-sm text-red-400 font-['Orbitron']">
                      {validationErrors.pickup}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-500 font-['Orbitron']">
                    {t('vehicleOnlySelectLocations')}
                  </p>
                </div>
                
                {/* Pickup Time Selection */}
                {pickup && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-400 mb-2 font-['Orbitron'] flex items-center">
                      <svg className="w-4 h-4 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {t('pickupTime')}
                    </label>
                    <Select
                      options={pickupTimeOptions}
                      value={pickupTimeOptions.find(option => option.value === pickupTime)}
                      onChange={(selected) => setPickupTime(selected.value)}
                      styles={timeSelectStyles('#22d3ee')}
                      isSearchable={false}
                      placeholder="Select pickup time"
                      noOptionsMessage={() => {
                        const targetDate = new Date(bookingDetails.startDate);
                        const isToday = targetDate.toDateString() === new Date().toDateString();
                        return isToday ? "No more available times today" : "No available times";
                      }}
                    />
                    {(() => {
                      const targetDate = new Date(bookingDetails.startDate);
                      const isToday = targetDate.toDateString() === new Date().toDateString();
                      if (isToday && pickupTimeOptions.length > 0) {
                        return (
                          <p className="mt-2 text-xs text-yellow-400 font-['Orbitron']">
                            ⚠️ Times shown are available from now + 30min buffer
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
              
              {/* Same Location Toggle */}
              <div className="flex items-center p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="same-location"
                    checked={sameLocation}
                    onChange={(e) => setSameLocation(e.target.checked)}
                    className="w-5 h-5 appearance-none bg-black border border-gray-700 rounded checked:bg-cyan-400 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 cursor-pointer"
                  />
                  <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${sameLocation ? 'opacity-100' : 'opacity-0'}`}>
                    <CheckmarkIcon />
                  </div>
                </div>
                <label htmlFor="same-location" className="ml-3 text-base text-gray-300 font-['Orbitron'] cursor-pointer">
                  {t('returnSameLocation')}
                </label>
              </div>
              
              {/* Dropoff Location (if not same) */}
              {!sameLocation && (
                <div className="transition-all duration-500 animate-fade-in">
                  <label className="text-base font-medium text-gray-300 mb-4 font-['Orbitron'] flex items-center">
                    <MapMarkerIcon className="w-5 h-5 mr-2 text-purple-400" />
                    {t('dropoffLocation')}
                  </label>
                  <div className="relative">
                    <Select
                      options={availableLocations}
                      value={availableLocations.find(loc => loc.value === dropoff)}
                      onChange={(selected) => {
                        setDropoff(selected?.value || '');
                        // Clear validation error when user makes a selection
                        if (validationErrors.dropoff) {
                          setValidationErrors(prev => ({ ...prev, dropoff: null }));
                        }
                      }}
                      onInputChange={(inputValue, { action }) => {
                        // Clear selected value when user starts typing
                        if (action === 'input-change' && dropoff) {
                          setDropoff('');
                        }
                      }}
                      styles={locationSelectStyles}
                      isSearchable={true}
                      placeholder={t('searchOrSelectLocation')}
                      noOptionsMessage={() => t('noLocationsFound')}
                      isDisabled={loading}
                      isClearable={true}
                      openMenuOnClick={true}
                      openMenuOnFocus={true}
                    />
                    {validationErrors.dropoff && (
                      <p className="mt-2 text-sm text-red-400 font-['Orbitron']">
                        {validationErrors.dropoff}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Dropoff Time Selection - Always show when pickup location is selected */}
              {pickup && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-400 mb-2 font-['Orbitron'] flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {t('dropoffTime')}
                  </label>
                  <Select
                    options={dropoffTimeOptions}
                    value={dropoffTimeOptions.find(option => option.value === dropoffTime)}
                    onChange={(selected) => setDropoffTime(selected.value)}
                    styles={timeSelectStyles('#a855f7')}
                    isSearchable={false}
                    placeholder="Select dropoff time"
                    noOptionsMessage={() => {
                      const targetDate = new Date(bookingDetails.endDate);
                      const isToday = targetDate.toDateString() === new Date().toDateString();
                      return isToday ? "No more available times today" : "No available times";
                    }}
                  />
                  {(() => {
                    const targetDate = new Date(bookingDetails.endDate);
                    const isToday = targetDate.toDateString() === new Date().toDateString();
                    if (isToday && dropoffTimeOptions.length > 0) {
                      return (
                        <p className="mt-2 text-xs text-yellow-400 font-['Orbitron']">
                          ⚠️ Times shown are available from now + 30min buffer
                        </p>
                      );
                    }
                    return null;
                  })()}
                  {timeValidationError && (
                    <p className="mt-2 text-sm text-red-400 font-['Orbitron']">
                      {timeValidationError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="backdrop-blur-sm bg-black/50 p-8 rounded-xl border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group h-fit">
                        
            <div className="relative">
              <h3 className="text-xl md:text-2xl text-cyan-400 font-['Orbitron'] mb-8 flex items-center justify-center lg:justify-start">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                {t('locationDetails')}
              </h3>
              
              {/* Interactive Map Component */}
              <InteractiveMap 
                pickup={pickup} 
                dropoff={dropoff} 
                sameLocation={sameLocation}
                locations={locations}
                onLocationSelect={handleLocationSelect}
              />
              
              <div className="space-y-6">
                {pickup && (
                  <div className="flex items-start p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30 group">
                    <div className="w-10 h-10 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mt-1 transition-all duration-300 group-hover:bg-cyan-500/30">
                      <LocationPinIcon />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white font-['Orbitron'] mb-1">
                        {(() => {
                          const pickupLocation = locations.find(loc => loc.id === pickup);
                          return pickupLocation 
                            ? `${pickupLocation.displayName[language] || pickupLocation.name} ${language === 'fr' ? 'Agence' : 'Branch'}`
                            : `${pickup.charAt(0).toUpperCase() + pickup.slice(1)} ${language === 'fr' ? 'Agence' : 'Branch'}`;
                        })()} 
                      </h4>
                      <p className="text-sm text-gray-400 font-['Orbitron'] mb-2">
                        {(() => {
                          const pickupLocation = locations.find(loc => loc.id === pickup);
                          return pickupLocation?.address?.[language] || t('branchAddress', { location: pickup.charAt(0).toUpperCase() + pickup.slice(1) });
                        })()}
                      </p>
                      <p className="text-sm text-cyan-400 font-['Orbitron']">
                        {(() => {
                          const pickupLocation = locations.find(loc => loc.id === pickup);
                          if (pickupLocation && bookingDetails.startDate) {
                            const date = new Date(bookingDetails.startDate);
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const hours = isWeekend ? pickupLocation.operatingHours.weekends : pickupLocation.operatingHours.weekdays;
                            return `${t('openingHours')}: ${hours.open} - ${hours.close} ${isWeekend ? '(Weekend)' : '(Weekday)'}`;
                          }
                          return t('branchOpeningHours');
                        })()} 
                      </p>
                    </div>
                  </div>
                )}
                
                {!sameLocation && dropoff && (
                  <div className="flex items-start p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-purple-500/30 group">
                    <div className="w-10 h-10 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mt-1 transition-all duration-300 group-hover:bg-purple-500/30">
                      <DestinationIcon />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white font-['Orbitron'] mb-1">
                        {(() => {
                          const dropoffLocation = locations.find(loc => loc.id === dropoff);
                          return dropoffLocation 
                            ? `${dropoffLocation.displayName[language] || dropoffLocation.name} ${language === 'fr' ? 'Agence' : 'Branch'}`
                            : `${dropoff.charAt(0).toUpperCase() + dropoff.slice(1)} ${language === 'fr' ? 'Agence' : 'Branch'}`;
                        })()} 
                      </h4>
                      <p className="text-sm text-gray-400 font-['Orbitron'] mb-2">
                        {(() => {
                          const dropoffLocation = locations.find(loc => loc.id === dropoff);
                          return dropoffLocation?.address?.[language] || t('branchAddress', { location: dropoff.charAt(0).toUpperCase() + dropoff.slice(1) });
                        })()}
                      </p>
                      <p className="text-sm text-purple-400 font-['Orbitron']">
                        {(() => {
                          const dropoffLocation = locations.find(loc => loc.id === dropoff);
                          if (dropoffLocation && bookingDetails.endDate) {
                            const date = new Date(bookingDetails.endDate);
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const hours = isWeekend ? dropoffLocation.operatingHours.weekends : dropoffLocation.operatingHours.weekdays;
                            return `${t('openingHours')}: ${hours.open} - ${hours.close} ${isWeekend ? '(Weekend)' : '(Weekday)'}`;
                          }
                          return t('branchOpeningHours');
                        })()} 
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center text-red-400 font-['Orbitron']">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={onPreviousStep}
            className="px-8 py-4 bg-black/50 border border-blue-900/30 hover:border-cyan-500/50 text-cyan-400 font-medium font-['Orbitron'] text-lg rounded-lg transition-all duration-300 flex items-center justify-center group cursor-pointer hover:scale-105 transform"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            {t('backToDates')}
          </button>
          
          <button
            onClick={validateAndContinue}
            disabled={loading || !pickup || (!sameLocation && !dropoff) || timeValidationError}
            className="px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] text-lg rounded-lg flex items-center justify-center hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <SpinnerIcon className="h-5 w-5 mr-3" />
                {t('loading')}
              </>
            ) : (
              <>
                {t('continueToOptions')}
                <ArrowRightIcon className="h-6 w-6 ml-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingLocation;