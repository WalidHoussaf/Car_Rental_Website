import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';

const DeleteBookingModal = ({ isOpen, onClose, onConfirm, booking, loading }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-red-900/40 rounded-2xl shadow-2xl shadow-red-500/10 overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/30 bg-gradient-to-r from-red-900/20 via-red-900/10 to-red-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-red-300 font-['Orbitron'] text-lg font-semibold tracking-wide">
              {t('deleteBooking')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg border border-transparent hover:border-red-600/40 hover:bg-red-600/10 transition-all duration-200 group cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {t('areYouSureDeleteBooking')} <span className="font-semibold text-white">#{booking._id?.slice(-8)}</span>?
          </p>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-red-300 font-['Orbitron'] text-sm font-semibold mb-1">
                  {t('warning')}
                </p>
                <p className="text-red-200 text-sm leading-relaxed">
                  {t('actionCannotBeUndone')}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-black/40 border border-cyan-900/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t('customer')}:</span>
              <span className="text-white font-medium">
                {booking.user?.firstName && booking.user?.lastName 
                  ? `${booking.user.firstName} ${booking.user.lastName}` 
                  : booking.user?.name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t('vehicle')}:</span>
              <span className="text-white font-medium">
                {booking.car?.make || booking.car?.brand} {booking.car?.model}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t('totalAmount')}:</span>
              <span className="text-cyan-400 font-semibold">
                ${booking.totalAmount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-red-900/30 bg-gradient-to-r from-black/20 via-black/10 to-black/20">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 bg-transparent border border-cyan-500/30 text-cyan-400 font-['Orbitron'] text-sm font-semibold rounded-lg hover:bg-cyan-900/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-['Orbitron'] text-sm font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 cursor-pointer transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-500/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('deleting')}
              </span>
            ) : (
              t('deleteBooking')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingModal;
