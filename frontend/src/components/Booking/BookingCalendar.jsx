import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { calculateInclusiveDays } from '../../utils/dateCalculation';
import { useTranslations } from '../../translations';
import { useLanguage } from '../../hooks/useLanguage';
import CalendarDateIcon from '../Ui/Icons/CalendarDateIcon';
import ArrowRightIcon from '../Ui/Icons/ArrowRightIcon';
import { getNumericPrice } from '../../utils/price';


const DatePicker = forwardRef(({ 
  selected, 
  onChange, 
  minDate, 
  className, 
  placeholder = '',
  ...props 
}, ref) => {
  // Format date safely without timezone issues
  const formatDateForInput = (date) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  // Parse date from input value
  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      // Create date at local midnight to avoid timezone shifts
      const [year, month, day] = value.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      onChange(localDate);
    } else {
      onChange(null);
    }
  };

  return (
    <input
      ref={ref}
      type="date"
      value={formatDateForInput(selected)}
      onChange={handleDateChange}
      min={formatDateForInput(minDate)}
      className={className}
      placeholder={placeholder}
      {...props}
    />
  );
});

const BookingCalendar = ({ car, onDateSelection = () => {} }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [validationError, setValidationError] = useState('');
  const [maxDurationWarning, setMaxDurationWarning] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Configuration
  const MAX_RENTAL_DAYS = 90; // Maximum rental duration
  const MIN_RENTAL_DAYS = 3; // Minimum rental duration
  
  // Get today's date for min start date (allow same-day bookings)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate total days for preview (inclusive date range)
  const calculateDays = useCallback(() => {
    return calculateInclusiveDays(startDate, endDate);
  }, [startDate, endDate]);

  const totalDays = calculateDays();
  
  // Calculate total cost
  const calculateTotalCost = () => {
    if (!startDate || !endDate || !car?.pricePerDay) {
      return 0;
    }
    
    const days = calculateDays();
    const numericPrice = getNumericPrice(car);
    const cost = days * numericPrice;
    // Prevent negative cost from showing
    return Math.max(cost, 0);
  };

  const totalCost = calculateTotalCost();
  
  // Validation with max duration checking, past date validation, and minimum duration
  useEffect(() => {
    if (!startDate || !endDate) {
      setValidationError('');
      setMaxDurationWarning('');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison

    // Check if start date is in the past
    if (startDate < today) {
      setValidationError('Pickup date cannot be in the past. Please select today or a future date.');
      setMaxDurationWarning('');
      return;
    }

    // Check if end date is in the past
    if (endDate < today) {
      setValidationError('Return date cannot be in the past. Please select today or a future date.');
      setMaxDurationWarning('');
      return;
    }

    // Check if end date is before or same as start date
    if (endDate <= startDate) {
      setValidationError(t('validationErrors') || 'Return date must be after pickup date');
      setMaxDurationWarning('');
      return;
    }

    const daysDifference = calculateDays();
    
    // Check minimum rental duration (uniform 3-day minimum)
    if (daysDifference < MIN_RENTAL_DAYS) {
      setValidationError(`Minimum rental duration is ${MIN_RENTAL_DAYS} days. Please extend your rental period.`);
      setMaxDurationWarning('');
      return;
    }

    // Check max rental duration
    if (daysDifference > MAX_RENTAL_DAYS) {
      setValidationError('');
      setMaxDurationWarning(t('maxRentalDurationWarning') || `Maximum rental duration is ${MAX_RENTAL_DAYS} days`);
    } else if (daysDifference > MAX_RENTAL_DAYS * 0.8) {
      // Warning when approaching max duration (80% threshold)
      setValidationError('');
      setMaxDurationWarning(t('approachingMaxDuration') || `Rental duration is ${daysDifference} days (max: ${MAX_RENTAL_DAYS})`);
    } else {
      setValidationError('');
      setMaxDurationWarning('');
    }
  }, [startDate, endDate, t, MAX_RENTAL_DAYS, MIN_RENTAL_DAYS, calculateDays]);
  
  // Quick select handlers
  const handleQuickSelect = (days) => {
    setIsAnimating(true);
    const newStartDate = new Date(today);
    const newEndDate = new Date(today);
    newEndDate.setDate(newEndDate.getDate() + days);
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  // Calculate dynamic max date for end date picker
  const getMaxEndDate = () => {
    if (!startDate) return null;
    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + MAX_RENTAL_DAYS);
    return maxDate;
  };

  // Handle continue button click
  const handleContinue = () => {
    if (startDate && endDate && !validationError && !maxDurationWarning) {
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.25] lg:leading-[1.2] tracking-wide font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] drop-shadow-[0_2px_6px_rgba(34,211,238,0.25)]">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
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
                      if (endDate && date && endDate < date) {
                        const newEndDate = new Date(date);
                        newEndDate.setDate(date.getDate() + 1);
                        setEndDate(newEndDate);
                      }
                    }}
                    minDate={today}
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
                    minDate={startDate ? new Date(startDate.getTime() + 86400000) : today}
                    max={getMaxEndDate() ? format(getMaxEndDate(), 'yyyy-MM-dd') : undefined}
                    className="w-full px-4 py-4 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all duration-300 hover:border-cyan-500/50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400 pointer-events-none">
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            {validationError && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg transform transition-all duration-300 ease-in-out">
                <p className="text-red-400 font-['Orbitron'] text-sm">{validationError}</p>
              </div>
            )}
            
            {maxDurationWarning && !validationError && (
              <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg transform transition-all duration-300 ease-in-out">
                <p className="text-yellow-400 font-['Orbitron'] text-sm">{maxDurationWarning}</p>
              </div>
            )}
          </div>

          {/* Preview Section - Right Column */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-sm bg-black/50 p-6 lg:p-8 rounded-xl border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-500 ease-out overflow-hidden group sticky top-4 transform ${isAnimating ? 'scale-105 shadow-cyan-500/20' : 'scale-100'}`}>
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
                  <span className="text-white font-['Orbitron'] text-sm font-medium">${getNumericPrice(car)}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
                
                {/* Total Cost */}
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-lg px-4 -mx-2">
                  <span className="text-cyan-400 font-['Orbitron'] text-base font-semibold">{t('totalCost') || 'Total Cost'}</span>
                  <span className="text-white font-['Orbitron'] text-lg font-bold">
                    ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleContinue}
            disabled={!!validationError || !!maxDurationWarning || !startDate || !endDate}
            className={`px-8 py-4 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] text-base lg:text-lg rounded-lg flex items-center justify-center transition-all duration-500 ease-out backdrop-blur-sm shadow-lg min-w-[200px] transform ${
              validationError || maxDurationWarning || !startDate || !endDate 
                ? 'opacity-50 cursor-not-allowed scale-95' 
                : 'hover:from-cyan-400 hover:to-white hover:shadow-cyan-500/30 hover:scale-105 cursor-pointer'
            } ${isAnimating ? 'scale-110 shadow-cyan-500/40' : 'scale-100'}`}
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

// PropTypes validation
BookingCalendar.propTypes = {
  car: PropTypes.shape({
    name: PropTypes.string.isRequired,
    pricePerDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onDateSelection: PropTypes.func,
};

BookingCalendar.defaultProps = {
  onDateSelection: () => {},
};

export default BookingCalendar;