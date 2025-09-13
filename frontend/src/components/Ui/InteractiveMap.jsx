import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import SpinnerIcon from './Icons/SpinnerIcon';

// Global Leaflet loading cache
let leafletLoadingPromise = null;
let leafletLoaded = false;

// Utility function to find the closest location to a given coordinate
const _findClosestLocation = (targetLatLng, locations) => {
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

const InteractiveMap = ({ 
  pickup, 
  locations = [], 
  onLocationSelect,
  className = "h-80",
  showControls = true,
  initialZoom = 13,
  disableInteraction = false
}) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(leafletLoaded);
  const [mapError, setMapError] = useState(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

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
  }, []);

  // Initialize map after Leaflet loads - only once
  useEffect(() => {
    if (mapLoaded && mapContainerRef.current && !mapRef.current && !isMapInitialized) {
      try {
        const map = window.L.map(mapContainerRef.current, {
          zoomControl: showControls,
          attributionControl: false,
          scrollWheelZoom: !disableInteraction,
          doubleClickZoom: !disableInteraction,
          boxZoom: !disableInteraction,
          keyboard: !disableInteraction,
          dragging: !disableInteraction,
          touchZoom: !disableInteraction
        });

        // Dark theme map tiles
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '© CARTO © OpenStreetMap contributors'
        }).addTo(map);

        mapRef.current = map;
        setIsMapInitialized(true);

        // Set initial view if we have locations
        if (locations.length > 0) {
          const firstLocation = locations[0];
          if (firstLocation.coordinates) {
            map.setView([firstLocation.coordinates.lat, firstLocation.coordinates.lng], initialZoom);
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    }
  }, [mapLoaded, showControls, disableInteraction, initialZoom, isMapInitialized, locations]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      markersRef.current = [];
    }
  }, []);

  // Create marker with custom styling
  const createMarker = useCallback((location, isSelected = false) => {
    if (!window.L || !location.coordinates) return null;

    const markerColor = isSelected ? 'from-cyan-400 to-blue-600' : 'from-gray-400 to-gray-600';
    const shadowColor = isSelected ? 'shadow-cyan-500/50' : 'shadow-gray-500/30';
    const animationClass = isSelected ? 'animate-pulse' : '';

    const customIcon = window.L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative">
          <div class="w-10 h-10 bg-gradient-to-br ${markerColor} rounded-full flex items-center justify-center shadow-2xl ${shadowColor} border-2 border-white/20 backdrop-blur-sm ${animationClass}">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br ${markerColor} rotate-45 border border-white/20"></div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 45]
    });

    return customIcon;
  }, []);

  // Update markers when pickup location changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !isMapInitialized) return;

    const map = mapRef.current;
    
    // Clear existing markers
    clearMarkers();

    if (!locations || locations.length === 0) return;

    // Add markers for all locations
    locations.forEach(location => {
      if (location.coordinates) {
        const isSelected = pickup === location.id;
        const markerIcon = createMarker(location, isSelected);
        
        if (markerIcon) {
          const marker = window.L.marker(
            [location.coordinates.lat, location.coordinates.lng], 
            { 
              icon: markerIcon,
              title: `${location.displayName?.[language] || location.name} Branch`
            }
          ).addTo(map);
          
          // Add click handler for location selection
          marker.on('click', () => {
            if (onLocationSelect && !disableInteraction) {
              onLocationSelect(location.id, 'pickup');
            }
          });
          
          markersRef.current.push(marker);
        }
      }
    });

    // Center map on selected location or fit all locations
    if (pickup) {
      const selectedLocation = locations.find(loc => loc.id === pickup);
      if (selectedLocation?.coordinates) {
        // Check if map has been initialized with a view first
        try {
          const currentCenter = map.getCenter();
          const targetLat = selectedLocation.coordinates.lat;
          const targetLng = selectedLocation.coordinates.lng;
          
          // Check if we need to update the center (with some tolerance)
          const tolerance = 0.001;
          if (Math.abs(currentCenter.lat - targetLat) > tolerance || 
              Math.abs(currentCenter.lng - targetLng) > tolerance) {
            map.setView([targetLat, targetLng], Math.max(map.getZoom(), initialZoom));
          }
        } catch {
          // Map not initialized yet, set initial view
          map.setView([selectedLocation.coordinates.lat, selectedLocation.coordinates.lng], initialZoom);
        }
      }
    } else if (locations.length > 1 && markersRef.current.length > 0) {
      // Fit bounds to show all locations
      try {
        const group = new window.L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.1));
      } catch {
        // Fallback to first location if fitBounds fails
        if (locations[0]?.coordinates) {
          map.setView([locations[0].coordinates.lat, locations[0].coordinates.lng], initialZoom);
        }
      }
    } else if (locations.length === 1 && locations[0].coordinates) {
      // Center on single location
      map.setView([locations[0].coordinates.lat, locations[0].coordinates.lng], initialZoom);
    }
  }, [mapLoaded, isMapInitialized, pickup, locations, language, onLocationSelect, disableInteraction, clearMarkers, createMarker, initialZoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsMapInitialized(false);
      }
    };
  }, [clearMarkers]);

  return (
    <div className={`relative ${className} bg-gradient-to-br from-gray-950 via-blue-950/50 to-black rounded-xl mb-8 overflow-hidden border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-2xl shadow-cyan-500/10`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 z-10"></div>
      
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

export default InteractiveMap;
