import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useTranslations } from '../../translations';
import { useLanguage } from '../../context/LanguageContext';
import CalendarDateIcon from '../Ui/Icons/CalendarDateIcon';
import ArrowRightIcon from '../Ui/Icons/ArrowRightIcon';


const DatePicker = forwardRef(({ selected, onChange, minDate, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="date"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => onChange(new Date(e.target.value))}
      min={minDate ? minDate.toISOString().split('T')[0] : ''}
      className={className}
      {...props}
    />
  );
});

const BookingCalendar = ({ car = { name: 'Mercedes-Benz S-Class', price: 250 }, onDateSelection = () => {} }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [validationError, setValidationError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
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
  
  // Validation effect
  useEffect(() => {
    if (startDate && endDate && endDate <= startDate) {
      setValidationError(t('validationError'));
    } else {
      setValidationError('');
    }
  }, [startDate, endDate, t]);
  
  // Quick select handlers
  const handleQuickSelect = (days) => {
    setIsAnimating(true);
    const newStartDate = new Date(tomorrow);
    const newEndDate = new Date(tomorrow);
    newEndDate.setDate(newEndDate.getDate() + days);
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (startDate && endDate && !validationError) {
      setIsAnimating(true);
      setTimeout(() => {
        onDateSelection(startDate, endDate);
        setIsAnimating(false);
      }, 200);
    }
  };
  
  return (
    <div className="relative rounded-xl p-6 md:p-8 lg:p-12 overflow-hidden max-w-6xl mx-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>
      
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="z-10 w-full space-y-8 md:space-y-10 lg:space-y-12 relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
            {t('selectRentalDates')}
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto opacity-60"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Date Selection Section - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section Header */}
            <div className="text-center lg:text-left">
              <h3 className="text-lg md:text-xl lg:text-2xl text-cyan-400 font-['Orbitron'] flex items-center justify-center lg:justify-start">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                {t('whenStartJourney')}
              </h3>
            </div>

            {/* Quick Select Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-400 font-['Orbitron'] uppercase tracking-wider">
                {t('quickSelect')}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { days: 2, label: t('weekend') },
                  { days: 7, label: t('week') },
                  { days: 14, label: `${14} ${t('days')}` },
                  { days: 30, label: t('month') }
                ].map(({ days, label }) => (
                  <button
                    key={days}
                    onClick={() => handleQuickSelect(days)}
                    className="px-4 py-3 bg-black/60 border border-blue-500/20 rounded-lg text-cyan-400 font-['Orbitron'] text-sm hover:border-cyan-500/40 hover:bg-black/80 transition-all duration-300 hover:scale-105 transform"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Inputs */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Start Date */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300 font-['Orbitron'] flex items-center">
                  <CalendarDateIcon />
                  {t('pickupDate')}
                </label>
                <div className="relative group">
                  <DatePicker
                    ref={startDateRef}
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      if (endDate < date) {
                        const newEndDate = new Date(date);
                        newEndDate.setDate(date.getDate() + 1);
                        setEndDate(newEndDate);
                      }
                    }}
                    minDate={tomorrow}
                    className="w-full px-4 py-4 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 hover:border-cyan-500/50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400 pointer-events-none">
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300 font-['Orbitron'] flex items-center">
                  <CalendarDateIcon />
                  {t('returnDate')}
                </label>
                <div className="relative group">
                  <DatePicker
                    ref={endDateRef}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={startDate ? new Date(startDate.getTime() + 86400000) : tomorrow}
                    className="w-full px-4 py-4 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 hover:border-cyan-500/50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400 pointer-events-none">
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-['Orbitron'] text-sm">{validationError}</p>
              </div>
            )}
          </div>

          {/* Preview Section - Right Column */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-sm bg-black/50 p-6 lg:p-8 rounded-xl border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden group sticky top-4 ${isAnimating ? 'scale-105' : ''}`}>
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-lg md:text-xl text-cyan-400 font-['Orbitron'] flex items-center justify-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                  {t('rentalSummary')}
                </h3>
              </div>

              {/* Summary Details */}
              <div className="space-y-6">
                {/* Vehicle */}
                <div className="flex justify-between items-start py-3">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('vehicle')}</span>
                  <span className="text-white font-['Orbitron'] text-sm font-medium text-right max-w-[60%]">{car.name}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
                
                {/* Pickup Date */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('pickupDate')}</span>
                  <span className="text-white font-['Orbitron'] text-sm font-medium">
                    {startDate ? startDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : t('notSelected')}
                  </span>
                </div>
                
                {/* Return Date */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('returnDate')}</span>
                  <span className="text-white font-['Orbitron'] text-sm font-medium">
                    {endDate ? endDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : t('notSelected')}
                  </span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
                
                {/* Duration & Rate */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('totalDays')}</span>
                  <span className="text-white font-['Orbitron'] text-sm font-medium">{totalDays}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('dailyRate')}</span>
                  <span className="text-white font-['Orbitron'] text-sm font-medium">${car.price}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
                
                {/* Total */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400 font-['Orbitron'] font-medium text-base">{t('estimatedTotal')}</span>
                    <span className="text-xl lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                      ${car.price * totalDays}
                    </span>
                  </div>
                </div>
                
                {/* Disclaimer */}
                <p className="text-gray-500 text-xs font-['Orbitron'] text-center leading-relaxed px-2">
                  {t('finalPriceChange')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleContinue}
            disabled={!!validationError || !startDate || !endDate}
            className={`px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] text-base lg:text-lg rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-lg min-w-[200px] ${
              validationError || !startDate || !endDate 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-cyan-400 hover:to-white hover:shadow-cyan-500/20 hover:scale-105 transform cursor-pointer'
            } ${isAnimating ? 'scale-95' : ''}`}
          >
            <span className="flex items-center">
              {t('continueToLocation')}
              <ArrowRightIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;