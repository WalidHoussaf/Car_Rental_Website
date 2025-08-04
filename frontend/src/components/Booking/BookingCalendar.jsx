import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const BookingCalendar = ({ car, onDateSelection }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  
  // Get tomorrow's date for min start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Calculate total days for preview
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)) || 1;
  };

  const totalDays = calculateDays();
  
  // Handle continue button click
  const handleContinue = () => {
    if (startDate && endDate) {
      onDateSelection(startDate, endDate);
    }
  };
  
  return (
    <div className="relative rounded-xl p-8 md:p-12 overflow-hidden max-w-7xl mx-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div> 
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-10 text-center">
          {t('selectRentalDates')}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Date Selection Section */}
          <div className="relative">
            <h3 className="text-xl md:text-2xl text-cyan-400 font-['Orbitron'] mb-8 flex items-center justify-center lg:justify-start">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              {t('whenStartJourney')}
            </h3>
            
            <div className="space-y-8">
              {/* Start Date */}
              <div className="relative">
                <label className="text-base font-medium text-gray-300 mb-4 font-['Orbitron'] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('pickupDate')}
                </label>
                <div className="relative group">
                  <DatePicker
                    ref={startDateRef}
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      // If end date is before new start date, adjust it
                      if (endDate < date) {
                        const newEndDate = new Date(date);
                        newEndDate.setDate(date.getDate() + 1);
                        setEndDate(newEndDate);
                      }
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={tomorrow}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-6 py-4 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 hover:border-cyan-500/50"
                  />
                  <div 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400 cursor-pointer"
                    onClick={() => startDateRef.current?.setOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* End Date */}
              <div className="relative">
                <label className="text-base font-medium text-gray-300 mb-4 font-['Orbitron'] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('returnDate')}
                </label>
                <div className="relative group">
                  <DatePicker
                    ref={endDateRef}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate ? new Date(startDate.getTime() + 86400000) : tomorrow} // +1 day from start date
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-6 py-4 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 hover:border-cyan-500/50"
                  />
                  <div 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400 cursor-pointer"
                    onClick={() => endDateRef.current?.setOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="backdrop-blur-sm bg-black/50 p-8 rounded-xl border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group h-fit">
            <div className="relative">
              <h3 className="text-xl md:text-2xl text-cyan-400 font-['Orbitron'] mb-8 flex items-center justify-center lg:justify-start">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                {t('rentalSummary')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-['Orbitron'] text-base">{t('vehicle')}</span>
                  <span className="text-white font-['Orbitron'] text-base font-medium">{car.name}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full"></div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-['Orbitron'] text-base">{t('pickupDate')}</span>
                  <span className="text-white font-['Orbitron'] text-base font-medium">
                    {startDate ? startDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : t('notSelected')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-['Orbitron'] text-base">{t('returnDate')}</span>
                  <span className="text-white font-['Orbitron'] text-base font-medium">
                    {endDate ? endDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : t('notSelected')}
                  </span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full"></div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-['Orbitron'] text-base">{t('totalDays')}</span>
                  <span className="text-white font-['Orbitron'] text-base font-medium">{totalDays}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-['Orbitron'] text-base">{t('dailyRate')}</span>
                  <span className="text-white font-['Orbitron'] text-base font-medium">${car.price}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full"></div>
                
                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg px-4 border border-cyan-500/20">
                  <span className="text-cyan-400 font-['Orbitron'] font-medium text-lg">{t('estimatedTotal')}</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                    ${car.price * totalDays}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm font-['Orbitron'] mt-4 text-center">
                  {t('finalPriceChange')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleContinue}
            disabled={!startDate || !endDate}
            className={`px-8 py-4 font-semibold font-['Orbitron'] text-lg rounded-lg flex items-center justify-center mx-auto transition-all duration-300 backdrop-blur-sm shadow-lg transform ${
              startDate && endDate 
                ? 'bg-gradient-to-r from-white to-cyan-400 text-black hover:from-cyan-400 hover:to-white hover:shadow-cyan-500/20 hover:scale-105 cursor-pointer' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('continueToLocation')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;