import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// SVG Icons
const InsuranceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M12 4L6 7v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8V7l-6-3z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M9 12l2 2 4-4" className="stroke-current stroke-1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DriverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <circle cx="12" cy="7" r="4" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" className="stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M16 11l2-1.5M8 11l-2-1.5" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 13v4M12 17l-2 2M12 17l2 2" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GpsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <circle cx="12" cy="12" r="9" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" className="fill-current" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" className="stroke-current stroke-1" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" className="fill-current" />
    <path d="M12 15c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0-3c-3.87 0-7 3.13-7 7" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 12c4.97 0 9 4.03 9 9" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 9c-6.07 0-11 4.93-11 11" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 9c6.63 0 12 5.37 12 12" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ChildSeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M6 9h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M10 2L8 9h8l-2-7" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M8 12h8M8 15h8M8 18h8" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="5" r="1" className="fill-current" />
  </svg>
);

const AdditionalDriverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <circle cx="9" cy="7" r="3" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M4 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" className="stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="17" cy="10" r="2.5" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M14 21v-1a3 3 0 013-3h0a3 3 0 013 3v1" className="stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M15 7h4" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
  </svg>
);

const getOptionIcon = (iconId) => {
  switch(iconId) {
    case 'insurance': return <InsuranceIcon />;
    case 'driver': return <DriverIcon />;
    case 'gps': return <GpsIcon />;
    case 'wifi': return <WifiIcon />;
    case 'child_seat': return <ChildSeatIcon />;
    case 'additional_driver': return <AdditionalDriverIcon />;
    default: return null;
  }
};

const BookingOption = ({ car, bookingDetails, onOptionSelection, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Available options with pricing
  const availableOptions = [
    { 
      id: 'insurance', 
      name: t('option_insurance'), 
      description: t('option_insurance_desc'), 
      price: 45,
      icon: 'insurance'
    },
    { 
      id: 'driver', 
      name: t('option_driver'), 
      description: t('option_driver_desc'), 
      price: 120,
      icon: 'driver'
    },
    { 
      id: 'gps', 
      name: t('option_gps'), 
      description: t('option_gps_desc'), 
      price: 15,
      icon: 'gps'
    },
    { 
      id: 'wifi', 
      name: t('option_wifi'), 
      description: t('option_wifi_desc'), 
      price: 20,
      icon: 'wifi'
    },
    { 
      id: 'child_seat', 
      name: t('option_child_seat'), 
      description: t('option_child_seat_desc'), 
      price: 25,
      icon: 'child_seat'
    },
    { 
      id: 'additional_driver', 
      name: t('option_additional_driver'), 
      description: t('option_additional_driver_desc'), 
      price: 30,
      icon: 'additional_driver'
    }
  ];
  
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Calculate additional price
  const calculateAdditionalPrice = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = availableOptions.find(opt => opt.id === optionId);
      return total + (option ? option.price : 0);
    }, 0);
  };
  
  // Base price calculation
  const basePrice = car ? car.price * bookingDetails.totalDays : 0;
  const additionalPrice = calculateAdditionalPrice();
  const totalPrice = basePrice + additionalPrice;
  
  // Toggle option selection
  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };
  
  // Handle continue button click
  const handleContinue = () => {
    onOptionSelection(selectedOptions, additionalPrice);
  };
  
  return (
    <div className="relative rounded-xl p-4 md:p-6 overflow-hidden max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="z-10 w-full space-y-8 md:space-y-10 lg:space-y-12 relative">
        <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
            {t('enhanceExperience')}
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto opacity-60"></div>
        </div>
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <OptionsIcon className="text-cyan-400 mr-2" />
            <span className="text-lg md:text-xl text-cyan-400 font-['Orbitron'] font-medium">
              {t('availableAddOns')}
            </span>
          </div>
          <p className="text-gray-400 font-['Orbitron'] text-base max-w-2xl mx-auto">
            {t('selectAddOns').replace('{carName}', car.name)}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {availableOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`
                p-4 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group
                ${selectedOptions.includes(option.id) 
                  ? 'border-cyan-500/60 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 hover:shadow-lg hover:shadow-cyan-500/20 scale-105' 
                  : 'border-blue-900/20 bg-black/40 hover:border-cyan-500/30 hover:bg-black/50'}
                transform hover:scale-105 hover:-translate-y-1
              `}
            >
              {/* Glow effect for selected items */}
              {selectedOptions.includes(option.id) && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-sm rounded-xl opacity-75"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-start mb-4">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 flex-shrink-0
                    ${selectedOptions.includes(option.id) 
                      ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-white shadow-lg border border-cyan-500/30' 
                      : 'bg-black/70 border border-blue-900/30 text-gray-400 group-hover:border-cyan-500/30'}
                  `}>
                    {getOptionIcon(option.icon)}
                  </div>
                  
                  {/* Checkbox */}
                  <div className={`
                    w-6 h-6 border-2 rounded-lg flex items-center justify-center ml-auto transition-all duration-300
                    ${selectedOptions.includes(option.id) 
                      ? 'border-cyan-400 bg-cyan-400 text-black' 
                      : 'border-gray-600 group-hover:border-cyan-400/50'}
                  `}>
                    {selectedOptions.includes(option.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className={`
                    font-['Orbitron'] font-medium text-lg mb-2 transition-all duration-300
                    ${selectedOptions.includes(option.id) ? 'text-cyan-400' : 'text-white'}
                  `}>
                    {option.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-['Orbitron'] leading-relaxed">
                    {option.description}
                  </p>
                </div>
                
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-['Orbitron'] text-sm">{t('perDay')}</span>
                  <div className={`
                    font-['Orbitron'] font-bold text-xl transition-all duration-300
                    ${selectedOptions.includes(option.id) 
                      ? 'text-white' 
                      : 'text-cyan-400'}
                  `}>
                    ${option.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price Summary */}
        <div className="backdrop-blur-sm bg-black/50 p-8 rounded-xl border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group mb-12">
          <div className="relative">
            <h3 className="text-xl md:text-2xl text-cyan-400 font-['Orbitron'] mb-8 flex items-center justify-center lg:justify-start">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              {t('priceSummary')}
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-['Orbitron'] text-base">
                  {t('baseRate').replace('{price}', car.price).replace('{days}', bookingDetails.totalDays)}
                </span>
                <span className="text-white font-['Orbitron'] text-base font-medium">${basePrice}</span>
              </div>
              
              {selectedOptions.length > 0 && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full"></div>
                  
                  {selectedOptions.map(optionId => {
                    const option = availableOptions.find(opt => opt.id === optionId);
                    return (
                      <div key={optionId} className="flex justify-between items-center py-2">
                        <span className="text-gray-400 font-['Orbitron'] text-base flex items-center">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 opacity-60"></span>
                          {option.name}
                        </span>
                        <span className="text-white font-['Orbitron'] text-base font-medium">${option.price}</span>
                      </div>
                    );
                  })}
                </>
              )}
              
              <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full"></div>
              
              <div className="flex justify-between items-center py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg px-4 border border-cyan-500/20">
                <span className="text-cyan-400 font-['Orbitron'] font-medium text-lg">{t('totalAmount')}</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={onPreviousStep}
            className="px-8 py-4 bg-black/50 border border-blue-900/30 hover:border-cyan-500/50 text-cyan-400 font-medium font-['Orbitron'] text-lg rounded-lg transition-all duration-300 flex items-center justify-center group cursor-pointer hover:scale-105 transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToLocation')}
          </button>
          
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] text-lg rounded-lg flex items-center justify-center hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transform cursor-pointer"
          >
            {t('continueToSummary')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingOption;