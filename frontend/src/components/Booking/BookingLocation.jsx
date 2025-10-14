import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Select from 'react-select';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { locationSelectStyles, timeSelectStyles } from '../../styles/selectStyles';
import { generateTimeOptions, validateTimeOrder } from '../../utils/timeUtils';
import { getAvailableTimeSlots, validateTimeAvailability, needsRealTimeValidation, LOCATION_OPERATING_HOURS } from '../../utils/timeValidation';
import { OFFICE_LOCATIONS, getLocationById, formatLocationAddress } from '../../config/officeLocations';
import MapMarkerIcon from '../Ui/Icons/MapMarkerIcon';
import SpinnerIcon from '../Ui/Icons/SpinnerIcon';
import LocationPinIcon from '../Ui/Icons/LocationPinIcon';
import DestinationIcon from '../Ui/Icons/DestinationIcon';
import ArrowLeftIcon from '../Ui/Icons/ArrowLeftIcon';
import ArrowRightIcon from '../Ui/Icons/ArrowRightIcon';
import InteractiveMap from '../Ui/InteractiveMap';
import logger from '../../utils/logger';


const BookingLocation = ({ car, bookingDetails, onLocationSelection, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [pickup, setPickup] = useState('');
  const [pickupTime, setPickupTime] = useState(bookingDetails.pickupTime || '09:00');
  const [dropoffTime, setDropoffTime] = useState(bookingDetails.dropoffTime || '18:00');
  const [locations, setLocations] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [locationAddresses, setLocationAddresses] = useState({});
  
  const pickupTimeOptions = useMemo(() => {
    if (!pickup || !bookingDetails.startDate) return generateTimeOptions();
    
    const result = getAvailableTimeSlots(pickup, bookingDetails.startDate);
    return result.success ? result.timeSlots : generateTimeOptions();
  }, [pickup, bookingDetails.startDate]);
  
  const dropoffTimeOptions = useMemo(() => {
    if (!pickup || !bookingDetails.endDate) return generateTimeOptions();
    
    const result = getAvailableTimeSlots(pickup, bookingDetails.endDate);
    return result.success ? result.timeSlots : generateTimeOptions();
  }, [pickup, bookingDetails.endDate]);
  
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      let availableOfficeLocations = [];
      
      if (car && car.location) {
        const carLocation = OFFICE_LOCATIONS.find(office => 
          office.id === car.location.toLowerCase() || 
          office.name.toLowerCase() === car.location.toLowerCase()
        );
        
        if (carLocation) {
          availableOfficeLocations = [carLocation];
        } else {
          logger.warn(`Car location "${car.location}" not found in office locations`);
          availableOfficeLocations = OFFICE_LOCATIONS;
        }
      } else {
        availableOfficeLocations = OFFICE_LOCATIONS;
      }
      
      setLocations(availableOfficeLocations);
      setAvailableLocations(availableOfficeLocations.map(location => ({
        value: location.id,
        label: location.displayName[language] || location.name,
        address: location.address[language],
        coordinates: location.coordinates,
        operatingHours: location.operatingHours,
        phone: location.phone,
        features: location.features
      })));
      
    } catch (err) {
      setError(err.message || t('errorLoadingLocations'));
    } finally {
      setLoading(false);
    }
  }, [car, language]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const addresses = {};
    
    OFFICE_LOCATIONS.forEach(location => {
      addresses[location.id] = formatLocationAddress(location, language);
    });
    
    setLocationAddresses(addresses);
  }, [language]);

  useEffect(() => {
    if (bookingDetails.pickupLocation && locations.length > 0) {
      setPickup(bookingDetails.pickupLocation);
    }
  }, [bookingDetails.pickupLocation, locations]);

  useEffect(() => {
    if (pickup && bookingDetails.startDate) {
      const result = getAvailableTimeSlots(pickup, bookingDetails.startDate);
      if (result.success && result.timeSlots.length > 0) {
        setPickupTime(currentPickupTime => {
          if (!currentPickupTime || !result.timeSlots.some(slot => slot.value === currentPickupTime)) {
            return result.timeSlots[0].value;
          }
          return currentPickupTime; 
        });
      }
    }
  }, [pickup, bookingDetails.startDate]);

  useEffect(() => {
    if (!pickup || !bookingDetails.startDate) return;
    
    const isToday = needsRealTimeValidation(bookingDetails.startDate);
    if (!isToday) return;

    const interval = setInterval(() => {
      setPickupTime(currentTime => {
        if (!currentTime) return currentTime;
        
        const validation = validateTimeAvailability(pickup, bookingDetails.startDate, currentTime);
        if (!validation.valid && validation.suggestedTime) {
          return validation.suggestedTime;
        }
        return currentTime;
      });
    }, 60000); 

    return () => clearInterval(interval);
  }, [pickup, bookingDetails.startDate]);

  useEffect(() => {
    if (pickup && bookingDetails.endDate) {
      const result = getAvailableTimeSlots(pickup, bookingDetails.endDate);
      if (result.success && result.timeSlots.length > 0) {
        if (!dropoffTime || !result.timeSlots.some(slot => slot.value === dropoffTime)) {
          const preferredTime = '18:00';
          const preferredSlot = result.timeSlots.find(slot => slot.value === preferredTime);
          setDropoffTime(preferredSlot ? preferredTime : result.timeSlots[result.timeSlots.length - 1].value);
        }
      }
    }
  }, [pickup, bookingDetails.endDate, dropoffTime]);

  const enhancedLocationOptions = useMemo(() => {
    return availableLocations.map(location => ({
      ...location,
      label: locationAddresses[location.value] 
        ? `${location.label} - ${locationAddresses[location.value]}`
        : location.label
    }));
  }, [availableLocations, locationAddresses]);

  
  const handleLocationSelect = useCallback((locationId, type) => {
    if (type === 'pickup') {
      setPickup(locationId);
    }
  }, []);
  
  const timeValidationError = useMemo(() => {
    if (bookingDetails.startDate && bookingDetails.endDate && 
        bookingDetails.startDate === bookingDetails.endDate && 
        !validateTimeOrder(pickupTime, dropoffTime, bookingDetails.startDate, bookingDetails.endDate)) {
      return t('dropoffTimeMustBeAfterPickup');
    }
    return null;
  }, [pickupTime, dropoffTime, bookingDetails.startDate, bookingDetails.endDate]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const validateAndContinue = async () => {
    setValidationErrors({});
    
    if (!pickup) {
      setValidationErrors(prev => ({ ...prev, pickup: t('pleaseSelectPickupLocation') }));
      return;
    }
  
    if (timeValidationError) {
      setValidationErrors(prev => ({ ...prev, time: timeValidationError }));
      return;
    }
    
    if (bookingDetails.startDate && bookingDetails.endDate) {
      const startDateTime = new Date(bookingDetails.startDate);
      const endDateTime = new Date(bookingDetails.endDate);
      
      const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
      const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
      
      startDateTime.setHours(pickupHour, pickupMinute, 0, 0);
      endDateTime.setHours(dropoffHour, dropoffMinute, 0, 0);
    }
    
    onLocationSelection({
      pickupLocation: pickup,
      dropoffLocation: pickup, 
      pickupTime,
      dropoffTime
    });
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
       <h2 className="text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.25] lg:leading-[1.2] tracking-wide font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] drop-shadow-[0_2px_6px_rgba(34,211,238,0.25)]">
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
                    options={enhancedLocationOptions}
                    value={enhancedLocationOptions.find(loc => loc.value === pickup)}
                    onChange={(selected) => {
                      setPickup(selected?.value || '');
                      if (validationErrors.pickup) {
                        setValidationErrors(prev => ({ ...prev, pickup: null }));
                      }
                    }}
                    onInputChange={(inputValue, { action }) => {
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
                            ⚠️ Times shown are available from now + 1hr buffer
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
              
              <div className="mb-6 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                <p className="text-sm text-blue-300 font-['Orbitron']">
                  {t('dropoffSameAsPickup') || 'Vehicle must be returned to the same pickup location'}
                </p>
              </div>
              
              {/* Dropoff Time Selection */}
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
                          ⚠️ Times shown are available from now + 1hr buffer
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
          
          {/* Map Preview - Only show when location is selected */}
          {pickup && (
            <div className="backdrop-blur-sm bg-black/50 p-8 rounded-xl border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group h-fit">
              <div className="relative">
                <h3 className="text-xl md:text-2xl text-cyan-400 font-['Orbitron'] mb-8 flex items-center justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  {t('locationDetails')}
                </h3>
                
                <InteractiveMap 
                  pickup={pickup} 
                  locations={locations}
                  onLocationSelect={handleLocationSelect}
                />
              
                <div className="space-y-6">
                  {/* Pickup location info */}
                  <div className="flex items-start p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30 group">
                    <div className="w-10 h-10 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mt-1 transition-all duration-300 group-hover:bg-cyan-500/30">
                      <LocationPinIcon />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white font-['Orbitron'] mb-1">
                        {(() => {
                          const pickupLocation = getLocationById(pickup);
                          if (pickupLocation) {
                            const officeName = pickupLocation.displayName[language] || pickupLocation.name;
                            const officeAddress = formatLocationAddress(pickupLocation, language);
                            return (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-cyan-400 font-semibold">{officeName}</span>
                                  {pickupLocation.officeType && (
                                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                                      {pickupLocation.officeType}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{officeAddress}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {pickupLocation.phone && (
                                    <p className="text-xs text-gray-400 flex items-center">
                                      <svg className="w-3 h-3 mr-1 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                      </svg>
                                      {pickupLocation.phone}
                                    </p>
                                  )}
                                  {pickupLocation.email && (
                                    <p className="text-xs text-gray-400 flex items-center">
                                      <svg className="w-3 h-3 mr-1 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                      </svg>
                                      {pickupLocation.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return pickup;
                        })()}
                      </h4>
                      <p className="text-sm text-gray-400 font-['Orbitron'] mb-2">
                        {t('pickupLocation')}
                      </p>
                      <div className="text-sm text-cyan-400 font-['Orbitron']">
                        {(() => {
                          if (pickup && bookingDetails.startDate) {
                            const pickupLocation = getLocationById(pickup);
                            if (pickupLocation) {
                              const weekdayHours = `${pickupLocation.operatingHours.weekdays.open} - ${pickupLocation.operatingHours.weekdays.close}`;
                              const weekendHours = `${pickupLocation.operatingHours.weekends.open} - ${pickupLocation.operatingHours.weekends.close}`;
                              
                              return (
                                <div>
                                  <p className="mb-1">{t('openingHours')}:</p>
                                  <div className="text-xs space-y-1 ml-2">
                                    <p className="flex items-center">
                                      <svg className="w-3 h-3 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                      </svg>
                                      {language === 'fr' ? 'Lun-Ven' : 'Mon-Fri'}: <span className="text-white ml-1">{weekdayHours}</span>
                                    </p>
                                    <p className="flex items-center">
                                      <svg className="w-3 h-3 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {language === 'fr' ? 'Sam-Dim' : 'Sat-Sun'}: <span className="text-white ml-1">{weekendHours}</span>
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          }
                          return <p>{t('branchOpeningHours')}</p>;
                        })()} 
                      </div>
                      {(() => {
                        const pickupLocation = getLocationById(pickup);
                        if (pickupLocation && pickupLocation.features) {
                          return (
                            <div className="mt-2">
                              <p className="text-xs text-gray-400 mb-1 font-['Orbitron']">{t('availableServices') || 'Available Services'}:</p>
                              <div className="flex flex-wrap gap-1">
                                {pickupLocation.features.map((feature, index) => (
                                  <span key={index} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded font-['Orbitron']">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  
                  {/* Dropoff location info - same as pickup */}
                  <div className="flex items-start p-4 bg-black/40 rounded-xl border border-blue-900/20 transition-all duration-300 hover:border-purple-500/30 group">
                    <div className="w-10 h-10 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mt-1 transition-all duration-300 group-hover:bg-purple-500/30">
                      <DestinationIcon />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white font-['Orbitron'] mb-1">
                        {(() => {
                          const dropoffLocation = getLocationById(pickup);
                          if (dropoffLocation) {
                            const officeName = dropoffLocation.displayName[language] || dropoffLocation.name;
                            const officeAddress = formatLocationAddress(dropoffLocation, language);
                            return (
                              <div>
                                <span className="text-purple-400 font-semibold">{officeName}</span>
                                <p className="text-sm text-gray-300 mt-1">{officeAddress}</p>
                              </div>
                            );
                          }
                          return pickup;
                        })()}
                      </h4>
                      <p className="text-sm text-gray-400 font-['Orbitron'] mb-2">
                        {t('dropoffLocation')}
                      </p>
                      <div className="text-sm text-purple-400 font-['Orbitron']">
                        {(() => {
                          if (pickup && bookingDetails.endDate) {
                            const dropoffLocation = getLocationById(pickup);
                            if (dropoffLocation) {
                              const weekdayHours = `${dropoffLocation.operatingHours.weekdays.open} - ${dropoffLocation.operatingHours.weekdays.close}`;
                              const weekendHours = `${dropoffLocation.operatingHours.weekends.open} - ${dropoffLocation.operatingHours.weekends.close}`;
                              
                              return (
                                <div>
                                  <p className="mb-1">{t('openingHours')}:</p>
                                  <div className="text-xs space-y-1 ml-2">
                                    <p className="flex items-center">
                                      <svg className="w-3 h-3 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                      </svg>
                                      {language === 'fr' ? 'Lun-Ven' : 'Mon-Fri'}: <span className="text-white ml-1">{weekdayHours}</span>
                                    </p>
                                    <p className="flex items-center">
                                      <svg className="w-3 h-3 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {language === 'fr' ? 'Sam-Dim' : 'Sat-Sun'}: <span className="text-white ml-1">{weekendHours}</span>
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          }
                          return <p>{t('branchOpeningHours')}</p>;
                        })()} 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            disabled={loading || !pickup || timeValidationError}
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