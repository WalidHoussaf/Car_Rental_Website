import React, { useState, useEffect } from 'react';
import { getCarImage } from '../../utils/imageResolver';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { checkCarAvailability } from '../../utils/carAvailability';

const CarViewModal = ({ open, onClose, car }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  useEffect(() => {
    if (open && car?._id) {
      setLoadingAvailability(true);
      checkCarAvailability(car._id)
        .then(availabilityData => {
          setAvailability(availabilityData);
        })
        .catch(error => {
          console.error('Error fetching car availability:', error);
          setAvailability(null);
        })
        .finally(() => {
          setLoadingAvailability(false);
        });
    }
  }, [open, car?._id]);
  
  if (!open || !car) return null;

  const carImageSrc = getCarImage(car);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
            <h3 className="text-cyan-300 font-['Orbitron'] text-lg font-semibold tracking-wide">{t('adminCarsViewCar')}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center rounded-lg border border-transparent hover:border-cyan-600/40 hover:bg-cyan-600/10 transition-all duration-200 group cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Car Image and Basic Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="h-32 w-48 rounded-lg bg-black/40 border border-cyan-900/30 overflow-hidden flex items-center justify-center flex-shrink-0">
              {carImageSrc ? (
                <img src={carImageSrc} alt={car.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-sm text-gray-500 font-['Orbitron']">{t('adminCarsNoImage')}</div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xl font-semibold text-white font-['Orbitron'] mb-2">
                {car.name || `${car.make || ''} ${car.model || ''}`}
              </div>
              <div className="text-gray-400 text-sm font-['Rationale'] mb-3">
                {[car.make, car.model, car.year].filter(Boolean).join(' • ')}
              </div>
              <div className="text-gray-300 text-sm font-['Orbitron'] text-justify leading-relaxed">
                {car.description || t('adminCarsNoDescriptionAvailable')}
              </div>
            </div>
          </div>

          {/* Car Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">{t('adminCarsCategory')}</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.category || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">{t('adminCarsLocation')}</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.location?.branch || car.location || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">{t('adminCarsPricePerDay')}</div>
              <div className="text-white font-medium font-['Orbitron']">${car.pricePerDay ?? car.price ?? '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">{t('adminCarsTransmission')}</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.transmission || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">{t('adminCarsFuelType')}</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.fuelType || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">{t('adminCarsSeatsSlashDoors')}</div>
              <div className="text-white font-medium font-['Orbitron']">{[car.seats, car.doors].filter(Boolean).join(' / ') || '-'}</div>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="mt-6">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-3">{t('adminCarsFeatures')}</div>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-['Orbitron']"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div className="mt-6">
            <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-4">{t('adminCarsAvailabilityStatus')}</div>
            
            {loadingAvailability ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-500/30 rounded-lg">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm font-['Orbitron']">Loading availability...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {(() => {
                  const isAvailable = availability?.available ?? car.availability;
                  
                  return (
                    <>
                      {/* Main Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        isAvailable 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/20'
                      } shadow-sm font-['Orbitron']`}>
                        {/* Status Icon */}
                        <div className={`w-2 h-2 rounded-full ${
                          isAvailable ? 'bg-emerald-400' : 'bg-red-400'
                        } animate-pulse`}></div>
                        
                        {/* Status Text */}
                        <span className="font-semibold">
                          {isAvailable ? t('adminCarsAvailable') : t('adminCarsUnavailable')}
                        </span>
                      </div>
                      
                      {/* Booking Details for Unavailable Cars */}
                      {!isAvailable && availability && (
                        <div className="flex flex-col gap-2 ml-4">
                          {availability.activeBookings > 0 && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                              <span className="text-xs text-orange-300 font-medium font-['Orbitron']">
                                {availability.activeBookings} active booking{availability.activeBookings > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          {availability.confirmedBookings > 0 && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span className="text-xs text-blue-300 font-medium font-['Orbitron']">
                                {availability.confirmedBookings} confirmed booking{availability.confirmedBookings > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          {/* Next Available Date */}
                          {availability.nextAvailableDate && (
                            <div className="text-xs text-gray-400 mt-1 font-['Orbitron']">
                              <span className="text-gray-500">Available:</span> {new Date(availability.nextAvailableDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Available Cars - Show Ready Status */}
                      {isAvailable && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-md ml-4">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-emerald-300 font-medium font-['Orbitron']">
                            Ready to rent
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarViewModal;
