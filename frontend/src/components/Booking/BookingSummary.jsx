import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import LocationPinIcon from '../Ui/Icons/LocationPinIcon';
import DestinationIcon from '../Ui/Icons/DestinationIcon';
import CreditCardIcon from '../Ui/Icons/CreditCardIcon';
import StarIcon from '../Ui/Icons/StarIcon';
import CheckmarkIcon from '../Ui/Icons/CheckmarkIcon';

const PayPalIcon = () => (
  <img src={assets.paypal} alt="PayPal" className="h-12 w-12 object-contain align-middle" />
);

// Radio Button Component
const CustomRadio = ({ id, name, value, checked, onChange, children }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer w-full group">
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
          : 'border-gray-500 group-hover:border-cyan-300'
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
);

// Function to resolve image paths
const resolvePath = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  console.log('Resolving path:', path);
  
  // If it's a reference to assets (format: "cars.tesla")
  if (path.includes('.')) {
    const parts = path.split('.');
    if (parts.length === 2) {
      const category = parts[0];
      const key = parts[1];
      console.log('Trying to resolve from assets:', category, key);
      const result = assets[category] && assets[category][key];
      console.log('Result:', result);
      return result;
    }
  }
  return path;
};

const BookingSummary = ({ car, bookingDetails, bookingStep, onSubmit, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carImage, setCarImage] = useState(null);
  
  // Resolve car image on load and when car changes
  useEffect(() => {
    if (!car) return;
    
    console.log('Car data:', car);
    
    let image = null;
    
    // Attempt 1: Use car.image if it's an asset reference
    if (car.image && typeof car.image === 'string' && car.image.includes('.')) {
      console.log('Trying to resolve from car.image:', car.image);
      image = resolvePath(car.image);
    }
    
    // Attempt 2: Look up by ID (car1, car2, etc.)
    if (!image && car.id && assets.cars[`car${car.id}`]) {
      console.log('Resolving from car ID:', car.id);
      image = assets.cars[`car${car.id}`];
    }
    
    // Attempt 3: Look up by brand name
    if (!image && car.name) {
      const carBrand = car.name.toLowerCase().split(' ')[0];
      console.log('Trying to resolve by car brand:', carBrand);
      
      if (carBrand === 'tesla' && assets.cars.tesla) {
        image = assets.cars.tesla;
      } else if (carBrand === 'bmw' && assets.cars.bmw) {
        image = assets.cars.bmw;
      } else if (carBrand === 'mercedes' && assets.cars.mercedes) {
        image = assets.cars.mercedes;
      }
    }
    
    console.log('Final resolved image:', image);
    setCarImage(image);
  }, [car]);
  
  // Date formatting helper
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // List of available options with pricing
  const availableOptions = [
    { id: 'insurance', name: t('option_insurance'), price: 45 },
    { id: 'driver', name: t('option_driver'), price: 120 },
    { id: 'gps', name: t('option_gps'), price: 15 },
    { id: 'wifi', name: t('option_wifi'), price: 20 },
    { id: 'child_seat', name: t('option_child_seat'), price: 25 },
    { id: 'additional_driver', name: t('option_additional_driver'), price: 30 }
  ];
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      return; 
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 1500);
  };
  if (!car) return null;
  
  return (
    <div className="relative rounded-xl p-8 md:p-12 overflow-hidden max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      <div className="relative z-10">
        {/* Header Section */}
        <div className="z-10 w-full space-y-8 md:space-y-10 lg:space-y-12 relative">
        <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
            {t('bookingSummary')}
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto opacity-60"></div>
          </div>
        </div>
        <div className="my-6"></div>
        {/* Car Info Section */}
        <div className="p-5 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/60 transition-all duration-300 hover:border-cyan-400/80 shadow-lg shadow-cyan-500/20">
          <div className="flex items-center">
            <div className="w-56 h-40 md:w-72 md:h-52 rounded-3xl overflow-hidden mr-10 border-1 border-blue-900/40 bg-black/70 flex items-center justify-center transition-all duration-300 hover:scale-105">
              {carImage ? (
                <img 
                  src={carImage}
                  alt={car.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", carImage);
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/100x100/0f172a/22d3ee?text=${encodeURIComponent(car.name.split(' ')[0])}`;
                  }}
                />
              ) : (
                <img 
                  src={`https://via.placeholder.com/100x100/0f172a/22d3ee?text=${encodeURIComponent(car.name.split(' ')[0])}`}
                  alt={car.name} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white font-['Orbitron'] mb-2">{car.name}</h3>
              <div className="flex items-center text-sm space-x-3">
                <span className="text-cyan-400 uppercase font-['Orbitron'] font-medium px-2 py-1 bg-cyan-400/10 rounded-md">
                  {car.category}
                </span>
                <div className="flex items-center">
                                    <StarIcon />
                  <span className="text-white font-['Orbitron'] font-medium">{car.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8"></div>
        {/* Details Sections */}
        <div className="space-y-6 mb-8">
          {/* Rental Dates */}
          <div className="p-5 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/60 transition-all duration-300 hover:border-cyan-400/80 shadow-lg shadow-cyan-500/20">
            <h4 className="text-cyan-400 text-sm font-['Orbitron'] font-semibold mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              {t('rentalPeriod').toUpperCase()}
            </h4>
            {bookingDetails.startDate ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="text-white font-['Orbitron']">
                    <div className="text-cyan-300 font-bold text-lg mb-1">
                      {formatDate(bookingDetails.startDate)} - {formatDate(bookingDetails.endDate)}
                    </div>
                    <div className="text-cyan-400/80 text-sm">{bookingDetails.totalDays} {t('days')}</div>
                  </div>
                  <div className="text-white font-['Orbitron'] font-bold text-lg">
                    ${car.price * bookingDetails.totalDays}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-cyan-400/70 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
          
          {/* Locations */}
          <div className="p-5 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/60 transition-all duration-300 hover:border-cyan-400/80 shadow-lg shadow-cyan-500/20">
            <h4 className="text-cyan-400 text-sm font-['Orbitron'] font-semibold mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
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
                      {bookingDetails.pickupLocation?.charAt(0).toUpperCase() + bookingDetails.pickupLocation?.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 mr-3 shadow-md">
                    <DestinationIcon />
                  </div>
                  <div>
                    <div className="text-xs text-purple-400/70 font-['Orbitron']">{t('returnLabel')}</div>
                    <div className="text-white font-['Orbitron'] font-medium">
                      {bookingDetails.dropoffLocation?.charAt(0).toUpperCase() + bookingDetails.dropoffLocation?.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
          
          {/* Selected Options */}
          <div className="p-5 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/60 transition-all duration-300 hover:border-cyan-400/80 shadow-lg shadow-cyan-500/20">
            <h4 className="text-cyan-400 text-sm font-['Orbitron'] font-semibold mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              {t('selectedAddOns')}
            </h4>
            {bookingStep >= 3 && bookingDetails.options && bookingDetails.options.length > 0 ? (
              <div className="space-y-3">
                {bookingDetails.options.map((optionId, index) => {
                  // Show maximum 3 options
                  if (index >= 3) return null;
                  
                  const option = availableOptions.find(opt => opt.id === optionId);
                  return option ? (
                    <div key={optionId} className="flex justify-between items-center py-2 px-3 bg-black/30 rounded-lg border border-blue-900/20">
                      <span className="text-gray-300 font-['Orbitron'] flex items-center text-sm">
                        <span className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full mr-3"></span>
                        {option.name}
                      </span>
                      <span className="text-white font-['Orbitron'] font-medium">${option.price}</span>
                    </div>
                  ) : null;
                })}
                {bookingDetails.options.length > 3 && (
                  <div className="text-gray-400 text-xs text-center italic pt-2 border-t border-blue-900/20">
                    +{bookingDetails.options.length - 3} {t('moreOptions')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent w-full my-8"></div>
        
        {/* Total Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-black/80 to-blue-900/50 backdrop-blur-sm rounded-xl border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/20">
          <div className="flex justify-between items-center">
            <span className="text-cyan-400 font-['Orbitron'] font-semibold text-lg">{t('totalAmount')}</span>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 font-['Orbitron']">
              ${bookingDetails.totalPrice || (car.price * (bookingDetails.totalDays || 1))}
            </span>
          </div>
        </div>
        
        {/* Action Section */}
        {bookingStep < 4 ? (
          <div className="text-center">
            <div className="px-8 py-4 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border border-cyan-400/30 text-cyan-400 font-['Orbitron'] font-medium shadow-lg shadow-cyan-500/10">
              {t('completeStepsToBook')}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div className="p-5 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/60 transition-all duration-300 hover:border-cyan-400/80 shadow-lg shadow-cyan-500/20">
              <h4 className="text-cyan-400 text-sm font-['Orbitron'] font-semibold mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                {t('paymentMethod')}
              </h4>
              <div className="space-y-3">
                {/* Credit Card Option */}
                <div className="p-4 rounded-xl border border-blue-900/30 bg-black/40 transition-all duration-300 hover:border-cyan-500/40 hover:bg-black/50">
                  <CustomRadio
                    id="creditCard"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => setPaymentMethod('creditCard')}
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
                <div className="p-4 rounded-xl border border-blue-900/30 bg-black/40 transition-all duration-300 hover:border-cyan-500/40 hover:bg-black/50">
                  <CustomRadio
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
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
            
            {/* Terms Checkbox */}
            <div className="p-5 bg-gradient-to-r from-black/70 to-blue-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/60 transition-all duration-300 hover:border-cyan-400/80 shadow-lg shadow-cyan-500/20">
              <div className="flex items-start">
                <div className="relative mt-1 mr-4 group">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="sr-only"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    <div className={`
                      w-5 h-5 border-2 rounded-md transition-all duration-300 ease-in-out flex items-center justify-center
                      ${termsAccepted 
                        ? 'bg-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/30' 
                        : 'bg-black border-gray-600 group-hover:border-cyan-300'
                      }
                    `}>
                      <CheckmarkIcon className={`transition-all duration-300 ease-in-out ${termsAccepted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                    </div>
                  </label>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-300 font-['Orbitron'] leading-relaxed cursor-pointer">
                  {t('agreeToTerms_booking')} <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-all duration-300">{t('termsConditions')}</a> {t('andPrivacy')} <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-all duration-300">{t('privacyPolicy')}</a>
                </label>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className={`
                  w-full px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-bold font-['Orbitron'] text-lg
                  rounded-xl transition-all duration-300 backdrop-blur-sm shadow-xl hover:shadow-cyan-500/30
                  flex items-center justify-center relative overflow-hidden
                  ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-400 hover:to-white cursor-pointer hover:scale-105'}
                  ${isSubmitting ? 'animate-pulse' : ''}
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing')}
                  </span>
                ) : (
                  <>
                    {t('confirmAndBook_now')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onPreviousStep}
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-black/60 border-2 border-blue-900/50 hover:border-cyan-500/60 text-cyan-400 font-semibold font-['Orbitron'] rounded-xl transition-all duration-300 flex items-center justify-center group cursor-pointer hover:bg-black/70 hover:scale-105 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('backToOptions')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;