import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import MapMarkerIcon from '../Ui/Icons/MapMarkerIcon';
import SpinnerIcon from '../Ui/Icons/SpinnerIcon';
import CheckmarkIcon from '../Ui/Icons/CheckmarkIcon';
import LocationPinIcon from '../Ui/Icons/LocationPinIcon';
import DestinationIcon from '../Ui/Icons/DestinationIcon';
import ArrowLeftIcon from '../Ui/Icons/ArrowLeftIcon';
import ArrowRightIcon from '../Ui/Icons/ArrowRightIcon';

// Location coordinates
const LOCATIONS_COORDINATES = {
  'casablanca': { lat: 33.5731, lng: -7.5898 },
  'marrakech': { lat: 31.6295, lng: -7.9811 },
  'marrakesh': { lat: 31.6295, lng: -7.9811 }, 
  'rabat': { lat: 34.0209, lng: -6.8416 },
  'fes': { lat: 34.0181, lng: -5.0078 },
  'tangier': { lat: 35.7595, lng: -5.8340 },
  'agadir': { lat: 30.4278, lng: -9.5981 },
  'kenitra': { lat: 34.2610, lng: -6.5802 },
  'mohammedia': { lat: 33.6861, lng: -7.3828 }
};

// Interactive map component using OpenStreetMap with Leaflet
const InteractiveMap = ({ pickup, dropoff, sameLocation }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Loading Leaflet resources
  useEffect(() => {
    const loadLeafletResources = async () => {
      if (window.L) {
        setMapLoaded(true);
        return;
      }

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
          setMapLoaded(true);
        };
      } catch (error) {
        console.error('Error loading Leaflet:', error);
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

    if (pickup && LOCATIONS_COORDINATES[pickup]) {
      const pickupCoords = LOCATIONS_COORDINATES[pickup];
      
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

      // Add pickup marker
      const pickupMarker = window.L.marker([pickupCoords.lat, pickupCoords.lng], { 
        icon: pickupIcon,
        title: `${pickup.charAt(0).toUpperCase() + pickup.slice(1)} Branch` 
      }).addTo(map);
      
      markersRef.current.push(pickupMarker);

      // If it's the only point, center on it
      if (sameLocation || !dropoff) {
        map.setView([pickupCoords.lat, pickupCoords.lng], 13);
      }
    }

    // Add dropoff marker if different
    if (!sameLocation && dropoff && LOCATIONS_COORDINATES[dropoff]) {
      const dropoffCoords = LOCATIONS_COORDINATES[dropoff];
      
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

      // Add dropoff marker
      const dropoffMarker = window.L.marker([dropoffCoords.lat, dropoffCoords.lng], { 
        icon: dropoffIcon,
        title: `${dropoff.charAt(0).toUpperCase() + dropoff.slice(1)} Branch` 
      }).addTo(map);
      
      markersRef.current.push(dropoffMarker);

      // If the two points are different, adjust view to see both
      if (pickup !== dropoff) {
        const bounds = window.L.latLngBounds(
          [LOCATIONS_COORDINATES[pickup].lat, LOCATIONS_COORDINATES[pickup].lng],
          [dropoffCoords.lat, dropoffCoords.lng]
        );
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [mapLoaded, pickup, dropoff, sameLocation]);

  return (
    <div className="relative h-64 bg-black/60 rounded-xl mb-8 overflow-hidden border border-blue-900/20 group-hover:border-blue-900/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 pointer-events-none"></div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
          <div className="text-gray-500 font-['Orbitron'] flex flex-col items-center">
            <SpinnerIcon className="mb-2" />
            <span>{t('loadingMap')}</span>
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
  const [sameLocation, setSameLocation] = useState(true);
  
  // Available locations based on car availability
  const availableLocations = Array.isArray(car.location) 
    ? car.location.map(loc => ({ value: loc, label: loc.charAt(0).toUpperCase() + loc.slice(1) }))
    : [{ value: car.location, label: car.location.charAt(0).toUpperCase() + car.location.slice(1) }];
  
  // When component mounts, initialize with bookingDetails
  useEffect(() => {
    if (bookingDetails.pickupLocation && bookingDetails.dropoffLocation) {
      setPickup(bookingDetails.pickupLocation);
      setDropoff(bookingDetails.dropoffLocation);
      setSameLocation(bookingDetails.pickupLocation === bookingDetails.dropoffLocation);
    }
  }, [bookingDetails]);
  
  // When sameLocation changes, update dropoff
  useEffect(() => {
    if (sameLocation) {
      setDropoff(pickup);
    }
  }, [sameLocation, pickup]);
  
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: state.isFocused ? '#22d3ee' : 'rgba(59, 130, 246, 0.3)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '1.125rem',
      minHeight: '3.5rem',
      boxShadow: state.isFocused ? '0 0 0 2px #22d3ee' : 'none',
      '&:hover': {
        borderColor: '#22d3ee',
      },
      transition: 'all 0.3s ease'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      zIndex: 50,
      boxShadow: '0 4px 12px rgba(0, 200, 255, 0.15)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'rgba(34, 211, 238, 0.2)' 
        : state.isFocused 
          ? 'rgba(34, 211, 238, 0.1)' 
          : 'transparent',
      color: state.isSelected ? '#22d3ee' : '#ffffff',
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '1.125rem',
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontFamily: 'Orbitron, sans-serif',
    }),
  };
  
  const handleContinue = () => {
    onLocationSelection(pickup, dropoff);
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
                    onChange={(selected) => setPickup(selected.value)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                   
                  </div>
                  <p className="mt-3 text-sm text-gray-500 font-['Orbitron']">
                    {t('vehicleOnlySelectLocations')}
                  </p>
                </div>
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
                      onChange={(selected) => setDropoff(selected.value)}
                      styles={selectStyles}
                      isSearchable={false}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    </div>
                  </div>
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
              />
              
              <div className="space-y-6">
                <div className="flex items-start p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30 group">
                  <div className="w-10 h-10 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mt-1 transition-all duration-300 group-hover:bg-cyan-500/30">
                    <LocationPinIcon />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-white font-['Orbitron'] mb-1">
                      {pickup.charAt(0).toUpperCase() + pickup.slice(1)} {language === 'fr' ? 'Agence' : 'Branch'}
                    </h4>
                    <p className="text-sm text-gray-400 font-['Orbitron'] mb-2">
                      {t('branchAddress', { location: pickup.charAt(0).toUpperCase() + pickup.slice(1) })}
                    </p>
                    <p className="text-sm text-cyan-400 font-['Orbitron']">
                      {t('branchOpeningHours')}
                    </p>
                  </div>
                </div>
                
                {!sameLocation && (
                  <div className="flex items-start p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-purple-500/30 group">
                    <div className="w-10 h-10 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mt-1 transition-all duration-300 group-hover:bg-purple-500/30">
                      <DestinationIcon />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white font-['Orbitron'] mb-1">
                        {dropoff.charAt(0).toUpperCase() + dropoff.slice(1)} {language === 'fr' ? 'Agence' : 'Branch'}
                      </h4>
                      <p className="text-sm text-gray-400 font-['Orbitron'] mb-2">
                        {t('branchAddress', { location: dropoff.charAt(0).toUpperCase() + dropoff.slice(1) })}
                      </p>
                      <p className="text-sm text-purple-400 font-['Orbitron']">
                        {t('branchOpeningHours')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
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
            onClick={handleContinue}
            className="px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] text-lg rounded-lg flex items-center justify-center hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transform cursor-pointer"
          >
            {t('continueToOptions')}
            <ArrowRightIcon className="h-6 w-6 ml-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingLocation;