import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { api } from '../../config/api';

const AvailabilitySection = ({ carId }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [isAvailable, setIsAvailable] = useState(null);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateError, setDateError] = useState(null);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const todayString = getTodayString();

  const isValidDate = useCallback((dateString) => {
    const selectedDateObj = new Date(dateString);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    const todayDateObj = new Date();
    todayDateObj.setHours(0, 0, 0, 0);
    
    return selectedDateObj >= todayDateObj;
  }, []);

  const findNextAvailableDate = useCallback(async (startDate) => {
    try {
      for (let i = 1; i <= 30; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        const response = await api.cars.checkAvailability(carId, dateString, dateString);
        if (response.success && response.data.available) {
          return dateString;
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding next available date:', error);
      return null;
    }
  }, [carId]);

  const checkAvailability = useCallback(async (date) => {
    setLoading(true);
    setDateError(null);
    setNextAvailableDate(null);
    
    if (!isValidDate(date)) {
      setIsAvailable(false);
      setDateError(t('cannotSelectPastDate'));
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.cars.checkAvailability(carId, date, date);
      
      if (response.success) {
        const available = response.data.available;
        setIsAvailable(available);
        
        if (!available) {
          const nextDate = await findNextAvailableDate(date);
          setNextAvailableDate(nextDate);
        }
      } else {
        throw new Error(response.message || 'Failed to check availability');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setIsAvailable(false);
      setDateError(t('errorCheckingAvailability') || 'Error checking availability. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [t, isValidDate, carId, findNextAvailableDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    
    if (!isValidDate(newDate)) {
      setDateError(t('cannotSelectPastDate'));
      setIsAvailable(false);
    } else {
      setDateError(null);
    }
    
    setIsCalendarOpen(false);
  };

  const handleReserveNow = () => {
    navigate(`/booking/${carId}?date=${selectedDate}`);
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  useEffect(() => {
    if (isValidDate(selectedDate)) {
      checkAvailability(selectedDate);
    } else {
      setDateError(t('cannotSelectPastDate'));
      setIsAvailable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, selectedDate]);

  const generateDateButtons = () => {
    const buttons = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      buttons.push(
        <button
          key={i}
          onClick={() => handleDateChange(dateString)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 rounded-md p-2 text-center transition-colors duration-300 cursor-pointer"
        >
          <div className="text-xs text-gray-400 font-['Orbitron']">
            {date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' })}
          </div>
          <div className="text-lg text-white font-['Rationale']">
            {date.getDate()}
          </div>
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="bg-gradient-to-b from-gray-900/40 to-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6">
        {t('availability')}
      </h2>
      
      {/* Custom Date Selector */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-['Orbitron'] mb-2">
          {t('checkAvailabilityFor')}
        </label>
        <div className="relative">
          <div 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full bg-gray-900 border border-cyan-500/30 rounded-md px-4 py-3 text-white cursor-pointer flex items-center justify-between hover:border-cyan-400/50 hover:bg-gray-800 transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-['Rationale'] text-lg text-blue-100">
                {formatDateForDisplay(selectedDate)}
              </span>
            </div>
            <div className="text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Calendar Dropdown */}
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 w-full bg-gray-900 border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/10 overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                <span className="font-['Orbitron'] text-cyan-400 text-sm">{t('selectDate')}</span>
                <button 
                  onClick={() => setIsCalendarOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-['Rationale']"
                  min={todayString}
                />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {generateDateButtons()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Availability Status */}
      {loading ? (
        <div className="flex items-center space-x-3 py-4">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300 font-['Orbitron']">{t('checkingAvailability')}</span>
        </div>
      ) : isAvailable === null ? (
        <div className="py-4">
          <span className="text-gray-400 font-['Orbitron']">{t('selectDateToCheck')}</span>
        </div>
      ) : dateError ? (
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/30 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-['Orbitron'] font-bold">{t('invalidDate')}</p>
            <p className="text-gray-300 text-sm font-['Rationale']">{dateError}</p>
            <p className="text-cyan-400 text-sm font-['Rationale'] mt-1">
              {t('pleaseSelectFromToday')}
            </p>
          </div>
        </div>
      ) : isAvailable ? (
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-800/30 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-green-400 font-['Orbitron'] font-bold">{t('availableExclamation')}</p>
            <p className="text-gray-300 text-2xs font-['Rationale']">{t('vehicleAvailableOn')} {formatDateForDisplay(selectedDate)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/30 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-['Orbitron'] font-bold">{t('notAvailable')}</p>
            <p className="text-gray-300 text-2xs font-['Rationale']">{t('vehicleNotAvailable')}</p>
            {nextAvailableDate && (
              <p className="text-cyan-400 text-2xs font-['Rationale'] mt-1">
                {t('nextAvailableOn')} {formatDateForDisplay(nextAvailableDate)}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button 
          className={`px-4 py-2 rounded-md font-['Orbitron'] text-sm flex-1 ${
            isAvailable 
              ? 'bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30 cursor-pointer' 
              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isAvailable || loading || dateError}
          onClick={handleReserveNow}
        >
          {t('reserveNow')}
        </button>
        <button 
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-['Orbitron'] text-sm rounded-md flex-1 transition-colors duration-300 cursor-pointer"
          onClick={() => checkAvailability(selectedDate)}
        >
          {t('checkAgain')}
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySection;