import React, { useState, useEffect } from 'react';
import { getCarImage } from '../../utils/imageResolver';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';

const DeleteCarModal = ({ 
  open, 
  onClose, 
  car, 
  onConfirm, 
  processing = false 
}) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [confirmAck, setConfirmAck] = useState(false);

  // Reset confirmation when modal opens/closes
  useEffect(() => {
    if (open) {
      setConfirmAck(false);
    }
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open || !car) return null;

  const carImageSrc = getCarImage(car);

  const handleConfirm = () => {
    if (confirmAck && !processing) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setConfirmAck(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCancel} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
            <h3 className="text-red-300 font-['Orbitron'] text-lg font-semibold tracking-wide">{t('adminCarsDeleteCar')}</h3>
          </div>
          <button
            type="button"
            onClick={handleCancel}
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
          {/* Car Preview */}
          <div className="flex items-start gap-4 mb-6">
            <div className="h-20 w-28 rounded-lg bg-black/40 border border-red-900/30 overflow-hidden flex items-center justify-center flex-shrink-0">
              {carImageSrc ? (
                <img src={carImageSrc} alt={car.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-xs text-gray-500 font-['Orbitron']">{t('adminCarsNoImage')}</div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-white font-['Orbitron'] mb-1">
                {car.name || `${car.make || ''} ${car.model || ''}`}
              </div>
              <div className="text-gray-400 text-sm font-['Rationale'] mb-2">
                {[car.make, car.model, car.year].filter(Boolean).join(' • ')}
              </div>
              <div className="text-gray-300 text-sm font-['Orbitron']">
                {car.category} • ${car.pricePerDay ?? car.price}/day
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-gradient-to-r from-red-950/40 via-red-900/30 to-red-950/40 border border-red-900/40 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-red-400 font-medium font-['Orbitron'] mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM10.5 8.25a1.5 1.5 0 113 0v4.5a1.5 1.5 0 11-3 0V8.25zm1.5 8.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
              </svg>
              <span>{t('adminCarsDeleteWarning')}</span>
            </div>
            <p className="text-sm text-gray-300 font-['Rationale'] leading-relaxed">
              {t('adminCarsDeleteMessage')}
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-black/30 border border-cyan-900/30 rounded-xl p-4 mb-6">
            <label className="flex items-start gap-3 text-sm text-gray-200 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={confirmAck} 
                  onChange={(e) => setConfirmAck(e.target.checked)}
                  className="w-5 h-5 text-red-600 bg-transparent border-2 border-red-600/60 rounded focus:ring-red-500 focus:ring-2 transition-all duration-200 cursor-pointer"
                />
                {confirmAck && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="font-['Orbitron'] group-hover:text-white transition-colors">
                {t('adminCarsDeleteConfirmation')}
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl bg-transparent border-2 border-gray-600/40 text-gray-300 hover:bg-gray-600/10 hover:border-gray-500/60 hover:text-white transition-all duration-300 font-['Orbitron'] text-sm tracking-wide font-medium group cursor-pointer"
          >
            <span className="group-hover:scale-95 transition-transform duration-200 inline-block">{t('cancel')}</span>
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing || !confirmAck}
            className="relative px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-lg shadow-red-500/25 transition-all duration-300 font-['Orbitron'] text-sm tracking-wide overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative group-hover:scale-95 transition-transform duration-200 flex items-center gap-2">
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('adminCarsDeleting')}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                  {t('adminCarsDeleteCar')}
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarModal;
