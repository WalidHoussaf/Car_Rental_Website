import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// SVG Icons
const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="9" r="3" className="fill-current" />
  </svg>
);

const DestinationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M12 7L12 11M12 11L14 9M12 11L10 9" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1" className="fill-current" />
  </svg>
);

const SummaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M8 2h8v4H8z" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h.01M11 15h2" />
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.5} />
  </svg>
);

const PayPalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 7h7c1.7 0 3 1.3 3 3s-1.3 3-3 3h-7" />
    <path d="M9.5 10h7c1.7 0 3 1.3 3 3s-1.3 3-3 3h-7" />
    <path d="M6.5 7v9" />
    <path d="M9.5 10v6" />
  </svg>
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
      return; // Don't proceed if terms aren't accepted
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Si pas de voiture, ne rien rendre
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-cyan-400 font-['Orbitron'] flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/40 to-blue-500/30 rounded-xl flex items-center justify-center text-cyan-400 mr-4 shadow-lg shadow-cyan-500/20">
              <SummaryIcon />
            </div>
            {t('bookingSummary')}
          </h2>
        </div>
        
        {/* Car Info Section - Enhanced */}
        <div className="mb-8 p-5 bg-gradient-to-r from-black/60 to-blue-900/30 backdrop-blur-sm rounded-xl border border-blue-900/40 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden mr-5 border-2 border-blue-900/50 bg-black/50 flex items-center justify-center shadow-lg">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-['Orbitron'] font-medium">{car.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Details Sections */}
        <div className="space-y-6 mb-8">
          {/* Rental Dates - Enhanced */}
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
          
          {/* Locations - Enhanced */}
          <div className="p-5 bg-black/50 backdrop-blur-sm rounded-xl border border-blue-900/40 transition-all duration-300 hover:border-cyan-500/40 hover:bg-black/60">
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
          
          {/* Selected Options - Enhanced */}
          <div className="p-5 bg-black/50 backdrop-blur-sm rounded-xl border border-blue-900/40 transition-all duration-300 hover:border-cyan-500/40 hover:bg-black/60">
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
        
        {/* Total Section - Enhanced */}
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
            {/* Payment Method - Enhanced */}
            <div className="p-5 bg-black/50 backdrop-blur-sm rounded-xl border border-blue-900/40">
              <h4 className="text-cyan-400 text-sm font-['Orbitron'] font-semibold mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                {t('paymentMethod')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center p-4 rounded-xl border border-blue-900/30 bg-black/40 transition-all duration-300 hover:border-cyan-500/40 hover:bg-black/50">
                  <label htmlFor="creditCard" className="flex items-center cursor-pointer w-full">
                    <div className="relative flex items-center justify-center w-5 h-5 mr-4">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        value="creditCard"
                        checked={paymentMethod === 'creditCard'}
                        onChange={() => setPaymentMethod('creditCard')}
                        className="w-5 h-5 opacity-0 absolute cursor-pointer"
                      />
                      <div className={`w-5 h-5 border-2 rounded-full transition-all duration-300 ${paymentMethod === 'creditCard' ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-600'}`}></div>
                      {paymentMethod === 'creditCard' && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full absolute"></div>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 flex items-center justify-center text-cyan-400 mr-4 shadow-lg">
                      <CreditCardIcon />
                    </div>
                    <span className="text-white font-['Orbitron'] font-medium">
                      {t('creditCard')}
                    </span>
                  </label>
                </div>
                
                <div className="flex items-center p-4 rounded-xl border border-blue-900/30 bg-black/40 transition-all duration-300 hover:border-cyan-500/40 hover:bg-black/50">
                  <label htmlFor="paypal" className="flex items-center cursor-pointer w-full">
                    <div className="relative flex items-center justify-center w-5 h-5 mr-4">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-5 h-5 opacity-0 absolute cursor-pointer"
                      />
                      <div className={`w-5 h-5 border-2 rounded-full transition-all duration-300 ${paymentMethod === 'paypal' ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-600'}`}></div>
                      {paymentMethod === 'paypal' && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full absolute"></div>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 flex items-center justify-center text-cyan-400 mr-4 shadow-lg">
                      <PayPalIcon />
                    </div>
                    <span className="text-white font-['Orbitron'] font-medium">
                      PayPal
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Terms Checkbox - Enhanced */}
            <div className="p-5 bg-black/50 backdrop-blur-sm rounded-xl border border-blue-900/40">
              <div className="flex items-start">
                <div className="relative mt-1 mr-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 appearance-none bg-black border-2 border-gray-600 rounded-md checked:bg-cyan-400 checked:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 cursor-pointer"
                  />
                  <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${termsAccepted ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-300 font-['Orbitron'] leading-relaxed">
                  {t('agreeToTerms_booking')} <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-all duration-300">{t('termsConditions')}</a> {t('andPrivacy')} <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-all duration-300">{t('privacyPolicy')}</a>
                </label>
              </div>
            </div>
            
            {/* Navigation Buttons - Enhanced */}
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