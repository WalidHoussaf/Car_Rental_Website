import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { assets } from '../../assets/assets';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import LocationPinIcon from '../Ui/Icons/LocationPinIcon';
import DestinationIcon from '../Ui/Icons/DestinationIcon';
import CreditCardIcon from '../Ui/Icons/CreditCardIcon';
import StarIcon from '../Ui/Icons/StarIcon';
import CheckmarkIcon from '../Ui/Icons/CheckmarkIcon';
import { calcBasePrice } from '../../utils/price';
import { resolveImagePath } from '../../utils/images';
import { getLocationById, formatLocationAddress } from '../../config/officeLocations';

const PayPalIcon = React.memo(() => (
  <img src={assets.paypal} alt="PayPal" className="h-12 w-12 object-contain align-middle" />
));

// Radio Button Component
const CustomRadio = React.memo(({ id, name, value, checked, onChange, children }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer w-full">
    <div className="relative flex items-center justify-center w-5 h-5 mr-4">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`
        w-5 h-5 border-2 rounded-full transition-all duration-300 ease-in-out
        ${checked 
          ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/30' 
          : 'border-gray-500'
        }
      `}>
        <div className={`
          w-2.5 h-2.5 bg-cyan-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          transition-all duration-300 ease-in-out
          ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `} />
      </div>
    </div>
    {children}
  </label>
));

const BookingSummary = React.memo(({ car, bookingDetails, bookingStep, onSubmit, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const timeoutRef = useRef(null);
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carImage, setCarImage] = useState(null);
  const [locationAddresses, setLocationAddresses] = useState({});
  
  // Only resolve image once and cache it properly
  const resolvedCarImage = useMemo(() => {
    if (!car) return null;
    
    let image = resolveImagePath(car.image);

    if (!image && car.id && assets.cars[`car${car.id}`]) {
      image = assets.cars[`car${car.id}`];
    }

    if (!image && car.name) {
      const carBrand = car.name.toLowerCase().split(' ')[0];
      if (carBrand === 'tesla' && assets.cars.tesla) image = assets.cars.tesla;
      else if (carBrand === 'bmw' && assets.cars.bmw) image = assets.cars.bmw;
      else if (carBrand === 'mercedes' && assets.cars.mercedes) image = assets.cars.mercedes;
    }

    return image || null;
  }, [car]); // Car object includes all necessary properties

  useEffect(() => {
    setCarImage(resolvedCarImage);
  }, [resolvedCarImage]);

  // Get structured office location addresses
  useEffect(() => {
    const addresses = {};
    
    if (bookingDetails.pickupLocation) {
      const pickupOffice = getLocationById(bookingDetails.pickupLocation);
      if (pickupOffice) {
        addresses[bookingDetails.pickupLocation] = formatLocationAddress(pickupOffice, language);
      }
    }
    
    if (bookingDetails.dropoffLocation && bookingDetails.dropoffLocation !== bookingDetails.pickupLocation) {
      const dropoffOffice = getLocationById(bookingDetails.dropoffLocation);
      if (dropoffOffice) {
        addresses[bookingDetails.dropoffLocation] = formatLocationAddress(dropoffOffice, language);
      }
    }
    
    setLocationAddresses(addresses);
  }, [bookingDetails.pickupLocation, bookingDetails.dropoffLocation, language]);
  
  
  // Memory leak in setTimeout
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      return; 
    }
    
    setIsSubmitting(true);
    
    // Clear existing timeout to prevent multiple calls
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onSubmit(paymentMethod);
      setIsSubmitting(false);
      timeoutRef.current = null;
    }, 1500);
  }, [termsAccepted, onSubmit, paymentMethod]);

  // Add cleanup for timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleTermsChange = (checked) => {
    setTermsAccepted(checked);
  };

  // Keep expensive calculations memoized (price calculations and array operations)
  const calculations = useMemo(() => {
    const basePrice = calcBasePrice(car, bookingDetails.totalDays || 1);
    const totalPrice = bookingDetails.totalPrice || basePrice;
    
    // Inline date formatting to avoid dependency issues
    const formattedStartDate = bookingDetails.startDate 
      ? new Date(bookingDetails.startDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        })
      : '';
    const formattedEndDate = bookingDetails.endDate 
      ? new Date(bookingDetails.endDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        })
      : '';
    
    // Move availableOptions inside useMemo to avoid dependency issues
    const availableOptions = [
      { id: 'insurance', name: t('option_insurance'), price: 45 },
      { id: 'driver', name: t('option_driver'), price: 120 },
      { id: 'gps', name: t('option_gps'), price: 15 },
      { id: 'wifi', name: t('option_wifi'), price: 20 },
      { id: 'child_seat', name: t('option_child_seat'), price: 25 },
      { id: 'additional_driver', name: t('option_additional_driver'), price: 30 }
    ];
    
    const selectedOptions = (bookingDetails.options || [])
      .map(optionId => availableOptions.find(opt => opt.id === optionId))
      .filter(Boolean);

    const days = bookingDetails.totalDays || 1;

    return {
      basePrice,
      totalPrice,
      formattedStartDate,
      formattedEndDate,
      selectedOptions,
      days
    };
  }, [car, bookingDetails.totalDays, bookingDetails.totalPrice, bookingDetails.startDate, bookingDetails.endDate, bookingDetails.options, language, t]);

  if (!car) return null;
  
  return (
    <div className="relative rounded-xl p-8 md:p-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="relative z-10 w-full">
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.25] lg:leading-[1.2] tracking-wide font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] drop-shadow-[0_2px_6px_rgba(34,211,238,0.25)]">
            {t('bookingSummary')}
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto opacity-60"></div>
        </div>

        {/* Car Info Section */}
        <div className="backdrop-blur-sm bg-black/40 p-8 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 relative overflow-hidden mb-8 will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
            <div className="w-full lg:w-80 h-48 lg:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800 flex items-center justify-center transition-transform duration-300 shadow-lg will-change-transform">
              {carImage ? (
                <img 
                  src={carImage}
                  alt={car.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/100x100/0f172a/22d3ee?text=${encodeURIComponent(car.name.split(' ')[0])}`;
                  }}
                />
              ) : (
                <img 
                  src={`https://via.placeholder.com/100x100/0f172a/22d3ee?text=${encodeURIComponent(car.name.split(' ')[0])}`}
                  alt={car.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-400 font-['Orbitron'] uppercase tracking-widest mb-3">
                {car.category}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4">{car.name}</h3>
              {car.description && (
                <p className="text-gray-300/80 font-['Orbitron'] text-sm leading-relaxed text-justify mb-2 max-w-2xl lg:max-w-3xl mx-auto lg:mx-0">
                  {car.description}
                </p>
              )}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <StarIcon />
                  <span className="text-white font-['Orbitron'] font-medium">{car.rating}</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="text-gray-400 font-['Orbitron'] text-sm">{car.transmission || 'Automatic'}</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="text-gray-400 font-['Orbitron'] text-sm">{car.fuel || 'Gasoline'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8"></div>

        {/* Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Rental Dates */}
          <div className="backdrop-blur-sm bg-black/40 p-6 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 relative overflow-hidden will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h4 className="text-cyan-400 text-lg font-['Orbitron'] font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {t('rentalPeriod')}
              </h4>
              {bookingDetails.startDate ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-white font-['Orbitron']">
                      <div className="text-cyan-300 font-bold text-lg mb-1">
                        {calculations.formattedStartDate} - {calculations.formattedEndDate}
                      </div>
                      <div className="text-cyan-400/80 text-sm">{bookingDetails.totalDays || 1} {t('days')}</div>
                    </div>
                    <div className="text-white font-['Orbitron'] font-bold text-lg">
                      ${calculations.basePrice}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-cyan-400/70 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
              )}
            </div>
          </div>
          
          {/* Locations */}
          <div className="backdrop-blur-sm bg-black/40 p-6 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 relative overflow-hidden will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h4 className="text-purple-400 text-lg font-['Orbitron'] font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {t('pickupReturnTitle')}
              </h4>
              {bookingStep >= 2 && bookingDetails.pickupLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 rounded-lg flex items-center justify-center text-cyan-400 mr-3 shadow-md">
                      <LocationPinIcon />
                    </div>
                    <div>
                      <div className="text-xs text-cyan-400/70 font-['Orbitron']">{t('pickupLabel')}</div>
                      <div className="text-white font-['Orbitron'] font-medium">
                        {locationAddresses[bookingDetails.pickupLocation] || 
                         (typeof bookingDetails.pickupLocation === 'string' && bookingDetails.pickupLocation ? 
                          bookingDetails.pickupLocation.charAt(0).toUpperCase() + bookingDetails.pickupLocation.slice(1) : 
                          'Not selected')}
                      </div>
                      {bookingDetails.pickupTime && (
                        <div className="text-xs text-cyan-300 font-['Orbitron'] mt-0.5">
                          {(t('pickupTime') || 'Pickup time') + ': '}
                          <span className="text-cyan-200">{bookingDetails.pickupTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 mr-3 shadow-md">
                      <DestinationIcon />
                    </div>
                    <div>
                      <div className="text-xs text-purple-400/70 font-['Orbitron']">{t('returnLabel')}</div>
                      <div className="text-white font-['Orbitron'] font-medium">
                        {locationAddresses[bookingDetails.dropoffLocation] || 
                         (typeof bookingDetails.dropoffLocation === 'string' && bookingDetails.dropoffLocation ? 
                          bookingDetails.dropoffLocation.charAt(0).toUpperCase() + bookingDetails.dropoffLocation.slice(1) : 
                          'Not selected')}
                      </div>
                      {bookingDetails.dropoffTime && (
                        <div className="text-xs text-purple-300 font-['Orbitron'] mt-0.5">
                          {(t('dropoffTime') || 'Dropoff time') + ': '}
                          <span className="text-purple-200">{bookingDetails.dropoffTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Selected Options */}
        <div className="backdrop-blur-sm bg-black/40 p-6 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 relative overflow-hidden mb-8 will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h4 className="text-green-400 text-lg font-['Orbitron'] font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('selectedAddOns')}
            </h4>
            {bookingStep >= 3 && calculations.selectedOptions.length > 0 ? (
              <div className="space-y-3">
                {calculations.selectedOptions.map((option) => (
                  <div key={option.id} className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20 transition-all duration-300">
                    <span className="text-white font-['Orbitron'] flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      {option.name} <span className="ml-2 text-xs text-gray-400">(${option.price} x {calculations.days} {t('days')})</span>
                    </span>
                    <span className="text-green-400 font-['Orbitron'] font-bold">${option.price * calculations.days}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent w-full my-8"></div>
        
        {/* Total Section */}
        <div className="mb-8 backdrop-blur-sm bg-black/50 p-8 rounded-xl border border-cyan-500/40 shadow-lg transition-all duration-300 relative overflow-hidden will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <span className="text-cyan-400 font-['Orbitron'] font-semibold text-xl">{t('totalAmount')}</span>
              <div className="text-gray-400 text-sm font-['Orbitron'] mt-1">Including all selected options</div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                ${calculations.totalPrice}
              </span>
              <div className="text-cyan-400/70 text-sm font-['Orbitron'] mt-1">Total for {bookingDetails.totalDays || 1} days</div>
            </div>
          </div>
        </div>
        
        {/* Action Section */}
        {bookingStep < 4 ? (
          <div className="text-center">
            <div className="px-8 py-6 backdrop-blur-sm bg-black/40 rounded-xl border border-cyan-400/40 text-cyan-400 font-['Orbitron'] font-medium shadow-md transition-all duration-300">
              <svg className="w-8 h-8 mx-auto mb-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              {t('completeStepsToBook')}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div className="backdrop-blur-sm bg-black/40 p-6 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 relative overflow-hidden will-change-transform">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h4 className="text-cyan-400 text-lg font-['Orbitron'] font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                  {t('paymentMethod')}
                </h4>
                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <div className="p-4 rounded-xl border border-gray-700/50 bg-black/30 transition-all duration-300">
                    <CustomRadio
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === 'creditCard'}
                      onChange={() => handlePaymentMethodChange('creditCard')}
                    >
                      <div className="mr-4">
                        <CreditCardIcon />
                      </div>
                      <span className="text-white font-['Orbitron'] font-medium">
                        {t('creditCard')}
                      </span>
                    </CustomRadio>
                  </div>
                  
                  {/* PayPal Option */}
                  <div className="p-4 rounded-xl border border-gray-700/50 bg-black/30 transition-all duration-300">
                    <CustomRadio
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => handlePaymentMethodChange('paypal')}
                    >
                      <div className="mr-4">
                        <PayPalIcon />
                      </div>
                      <span className="text-white font-['Orbitron'] font-medium">
                        PayPal
                      </span>
                    </CustomRadio>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Terms Checkbox */}
            <div className="backdrop-blur-sm bg-black/40 p-6 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 relative overflow-hidden will-change-transform">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent opacity-0 transition-opacity duration-500"></div>
              <div className="relative z-10 flex items-start">
                <div className="relative mt-1 mr-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => handleTermsChange(e.target.checked)}
                    className="sr-only"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    <div className={`
                      w-6 h-6 border-2 rounded-md transition-all duration-300 ease-in-out flex items-center justify-center
                      ${termsAccepted 
                        ? 'bg-cyan-400 border-cyan-400 shadow-md shadow-cyan-400/20' 
                        : 'bg-black border-gray-600'
                      }
                    `}>
                      <CheckmarkIcon className={`transition-all duration-300 ease-in-out ${termsAccepted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                    </div>
                  </label>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-300 font-['Orbitron'] leading-relaxed cursor-pointer">
                  {t('agreeToTerms_booking')} <a href="#" className="text-cyan-400 underline transition-all duration-300">{t('termsConditions')}</a> {t('andPrivacy')} <a href="#" className="text-cyan-400 underline transition-all duration-300">{t('privacyPolicy')}</a>
                </label>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="space-y-4 pt-6">
              <button
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className={`
                  w-full px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-bold font-['Orbitron'] text-lg
                  rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg
                  flex items-center justify-center relative overflow-hidden will-change-transform
                  ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSubmitting ? 'animate-pulse' : ''}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                {isSubmitting ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10 group">
                    {t('confirmAndBook_now')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={onPreviousStep}
                disabled={isSubmitting}
                className="w-full px-8 py-4 backdrop-blur-sm bg-black/40 border border-gray-700/50 text-cyan-400 font-semibold font-['Orbitron'] rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md relative overflow-hidden will-change-transform group hover:border-cyan-500/40 hover:bg-black/60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <span className="flex items-center justify-center relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('backToOptions')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

export default BookingSummary;