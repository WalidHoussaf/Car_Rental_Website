import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import CalendarStepIcon from '../Ui/Icons/CalendarStepIcon';
import LocationStepIcon from '../Ui/Icons/LocationStepIcon';
import OptionsStepIcon from '../Ui/Icons/OptionsStepIcon';
import SummaryStepIcon from '../Ui/Icons/SummaryStepIcon';
import ArrowLeftIcon from '../Ui/Icons/ArrowLeftIcon';

const BookingHeader = ({ car, bookingStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Booking process steps 
  const steps = [
    { id: 1, name: t('dates'), icon: <CalendarStepIcon />, description: t('selectRentalPeriod') },
    { id: 2, name: t('location'), icon: <LocationStepIcon />, description: t('choosePickupReturn') },
    { id: 3, name: t('selectOptions'), icon: <OptionsStepIcon />, description: t('customizeExperience') },
    { id: 4, name: t('summary'), icon: <SummaryStepIcon />, description: t('reviewAndConfirm') }
  ];

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-black pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #06B6D4 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative">
        <div className="bg-black backdrop-blur-sm border border-gray-800 rounded-xl p-8 lg:p-12 relative overflow-hidden">          
          <div className="relative z-10">
            <div className="mb-8">
              <Link 
                to={`/cars/${car?.id}`} 
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center font-['Orbitron'] group transition-all duration-300"
              >
                <ArrowLeftIcon />
                {t('backToVehicleDetails')}
              </Link>
            </div>
            
            {/* Car Details Progress*/}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 transform animate-fade-in-up">
              <div className="max-w-2xl">
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-400 font-['Orbitron'] uppercase tracking-widest mb-4">
                  {car?.category ? (t(car.category) || car.category) : t('vehicle')}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-3">
                  {t('bookYour')} {car?.name || t('vehicle')}
                </h1>
                <p className="text-gray-300 font-['Orbitron'] text-sm md:text-base">
                  {t('completeStepsBelow')}
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center bg-black/50 p-4 rounded-lg border border-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-900/20 transition-all duration-300 transform hover:scale-105">
                <span className="text-gray-400 mr-2 text-sm font-['Orbitron']">{t('startingAt')}</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                  ${car?.price || '---'}
                </span>
                <span className="text-gray-400 ml-1 text-sm font-['Orbitron']">{t('day')}</span>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-16 mb-6">
              <div className="relative">
                <div className="hidden md:block absolute top-7 left-14 right-14 h-1 bg-gray-800" style={{ zIndex: 5 }}></div>
                <div 
                  className="hidden md:block absolute top-7 h-1 bg-gradient-to-r from-white to-cyan-400 transition-all duration-500 ease-in-out" 
                  style={{ 
                    left: '50px',
                    width: bookingStep === 1 ? '100px' : 
                           bookingStep === 2 ? '500px' : 
                           bookingStep === 3 ? '800px' : 
                           '1200px',
                    zIndex: 6
                  }}
                ></div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center justify-start relative z-10">
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center
                        ${bookingStep >= step.id 
                          ? 'bg-gradient-to-r from-white to-cyan-400 text-black shadow-lg shadow-cyan-500/20' 
                          : 'bg-gray-800/80 text-gray-500 border border-gray-700'}
                        transition-all duration-500 transform ${bookingStep === step.id ? 'scale-110' : ''}
                      `} style={{ zIndex: 7 }}>
                        {step.icon}
                      </div>

                      <div className={`
                        mt-3 font-medium font-['Orbitron'] transition-all duration-300 w-full
                        ${bookingStep >= step.id ? 'text-white' : 'text-gray-600'}
                      `}>
                        <div className="text-center">
                          <div className="text-sm min-h-[20px] px-2">{step.name}</div>
                          <div className={`
                            text-xs mt-1 min-h-[32px] px-1 line-clamp-2 overflow-hidden
                            ${bookingStep >= step.id ? 'text-gray-300' : 'text-gray-600'}
                          `}>
                            {step.description}
                          </div>
                        </div>
                      </div>

                      {bookingStep === step.id && (
                        <div className="absolute -bottom-2 w-16 h-1 bg-gradient-to-r from-white to-cyan-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;
