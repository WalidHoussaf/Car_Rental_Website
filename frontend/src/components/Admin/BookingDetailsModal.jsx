import React, { useState, useEffect, useRef } from 'react';
import { getLocationById } from '../../config/officeLocations';
import api from '../../config/api';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { calculateInclusiveDays } from '../../utils/dateCalculation';
import DeleteBookingModal from './DeleteBookingModal';

const BookingDetailsModal = ({ booking, isOpen, onClose, onUpdate, onDelete }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const statusDropdownRef = useRef(null);
  const [editStatus, setEditStatus] = useState(booking?.status || '');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
        setIsStatusDropdownOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsStatusDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (booking) {
      setEditStatus(booking.status || '');
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
      confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
      active: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
      completed: { bg: 'purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return `px-2 py-0.5 rounded text-xs ${config.bg} ${config.text} border ${config.border}`;
  };

  const handleEdit = () => {
    setEditStatus(booking.status);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        status: editStatus
      };

      const response = await api.bookings.update(booking._id, updateData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(`${t('failedToLoadBookings')}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await api.bookings.delete(booking._id);
      onDelete(booking._id);
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt('Please provide a cancellation reason:');
    if (!reason) return;

    setLoading(true);
    try {
      const response = await api.bookings.cancel(booking._id, reason);
      onUpdate(response.data.booking);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[85vh] bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
            <h3 className="text-cyan-300 font-['Orbitron'] text-xl font-semibold tracking-wide">
{t('bookingDetailsModal')} - #{booking._id.slice(-8)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white w-12 h-12 flex items-center justify-center rounded-lg border border-transparent hover:border-cyan-600/40 hover:bg-cyan-600/10 transition-all duration-200 text-xl group cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Status and Actions */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <div className="relative" ref={statusDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="w-48 text-left font-['Orbitron'] bg-black/40 border border-cyan-900/30 rounded-md py-2 pl-3 pr-9 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-200 hover:border-cyan-600/40 transition-colors cursor-pointer"
                    >
                      {t(editStatus)}
                    </button>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}>
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.16l-4.18 3.31a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z" clipRule="evenodd" />
                      </svg>
                    </span>
                    
                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-0 mt-2 w-48 rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg transition-all duration-200 z-50 ${isStatusDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                    >
                      <div className="py-2 font-['Orbitron']">
                        <button
                          onClick={() => { setEditStatus('pending'); setIsStatusDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {t('pending')}
                        </button>
                        <button
                          onClick={() => { setEditStatus('confirmed'); setIsStatusDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {t('confirmed')}
                        </button>
                        <button
                          onClick={() => { setEditStatus('active'); setIsStatusDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {t('active')}
                        </button>
                        <button
                          onClick={() => { setEditStatus('completed'); setIsStatusDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {t('completed')}
                        </button>
                        <button
                          onClick={() => { setEditStatus('cancelled'); setIsStatusDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          {t('cancelled')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className={`${getStatusColor(booking.status)} font-['Orbitron'] font-medium`}>
{t(booking.status)}
                  </span>
                )}
                <span className="text-sm text-gray-400 font-['Orbitron']">
                  {t('created')}: {formatDate(booking.createdAt)}
                </span>
              </div>

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600/20 text-white border border-blue-600/30 rounded hover:bg-blue-600/30 hover:border-blue-500 transition-all duration-300 font-['Orbitron'] text-sm font-semibold cursor-pointer transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? t('saving') : t('save')}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-transparent border border-cyan-500/30 text-cyan-400 font-['Orbitron'] text-sm font-semibold rounded-md hover:bg-cyan-900/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      {t('cancel')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-600/20 text-white border border-blue-600/30 rounded hover:bg-blue-600/30 hover:border-blue-500 transition-all duration-300 font-['Orbitron'] text-sm font-semibold cursor-pointer transform hover:scale-105"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="px-4 py-2 bg-red-600/50 text-white border border-red-500/30 rounded hover:bg-red-700/50 transition-all duration-300 text-sm font-['Orbitron'] font-semibold  cursor-pointer transform hover:scale-105"
                    >
                      {t('deleteBooking')}
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-600/20 text-white border border-orange-600/30 rounded hover:bg-amber-600/30 transition-all duration-300 font-['Orbitron'] text-sm font-semibold cursor-pointer transform hover:scale-105"
                      >
                        {t('cancelBooking')}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
                {t('customerInformation')}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('fullName')}</p>
                  <p className="text-gray-200 font-medium">
                    {booking.user?.firstName && booking.user?.lastName 
                      ? `${booking.user.firstName} ${booking.user.lastName}` 
                      : booking.user?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('phoneNumber')}</p>
                  <p className="text-gray-200 font-medium">{booking.user?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('emailAddress')}</p>
                  <p className="text-gray-200 font-medium">{booking.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('address')}</p>
                  <p className="text-gray-200 font-medium leading-relaxed">
                    {booking.user?.address ? (
                      [
                        booking.user.address.street,
                        booking.user.address.city,
                        booking.user.address.state,
                        booking.user.address.zipCode,
                        booking.user.address.country
                      ].filter(Boolean).join(', ') || 'N/A'
                    ) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
                {t('vehicleInformation')}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('brand')}</p>
                <p className="text-gray-200 font-medium">{booking.car?.make || booking.car?.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('model')}</p>
                <p className="text-gray-200 font-medium">{booking.car?.model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('year')}</p>
                <p className="text-gray-200 font-medium">{booking.car?.year || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
                {t('bookingInformation')}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('startDate')}</p>
                  <p className="text-gray-200 font-medium">{formatDate(booking.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('pickupTime')}</p>
                  <p className="text-gray-200 font-medium">{formatTime(booking.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('pickupLocation')}</p>
                  <p className="text-gray-200 font-medium">
                    {(() => {
                      if (!booking.pickupLocation?.branch) return 'N/A';
                      const office = getLocationById(booking.pickupLocation.branch.toLowerCase());
                      return office ? office.address.en : booking.pickupLocation.branch;
                    })()}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('endDate')}</p>
                  <p className="text-gray-200 font-medium">{formatDate(booking.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('dropoffTime')}</p>
                  <p className="text-gray-200 font-medium">{formatTime(booking.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('dropoffLocation')}</p>
                  <p className="text-gray-200 font-medium">
                    {(() => {
                      if (!booking.dropoffLocation?.branch) return 'N/A';
                      const office = getLocationById(booking.dropoffLocation.branch.toLowerCase());
                      return office ? office.address.en : booking.dropoffLocation.branch;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Pricing Details */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
                {t('pricingDetails')}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            
            <div className="space-y-4">
              {/* Base Price */}
              <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/20 transition-all duration-300">
                <span className="text-white font-['Orbitron'] flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  {t('basePrice')} 
                  <span className="ml-2 text-xs text-gray-400">
                    {(() => {
                      const startDate = new Date(booking.startDate);
                      const endDate = new Date(booking.endDate);
                      const days = calculateInclusiveDays(startDate, endDate);
                      const pricePerDay = booking.pricePerDay || (booking.car?.pricePerDay) || 0;
                      return `(${formatCurrency(pricePerDay)} x ${days} ${days === 1 ? t('day') : t('days')})`;
                    })()}
                  </span>
                </span>
                <span className="text-cyan-400 font-['Orbitron'] font-bold">
                  {(() => {
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);
                    const days = calculateInclusiveDays(startDate, endDate);
                    const pricePerDay = booking.pricePerDay || (booking.car?.pricePerDay) || 0;
                    return formatCurrency(pricePerDay * days);
                  })()}
                </span>
              </div>

              {/* Selected Options */}
              {(() => { 
                const selectedExtras = booking.extras || [];

                const days = (() => {
                  const startDate = new Date(booking.startDate);
                  const endDate = new Date(booking.endDate);
                  return calculateInclusiveDays(startDate, endDate);
                })();

                return selectedExtras.length > 0 ? (
                  <>
                    {selectedExtras.map((extra, index) => {
                      const totalPrice = extra.price * (extra.quantity || 1) * days;
                      return (
                        <div key={index} className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20 transition-all duration-300">
                          <span className="text-white font-['Orbitron'] flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                            {extra.name} <span className="ml-2 text-xs text-gray-400">(${extra.price}{(extra.quantity && extra.quantity > 1) ? ` x ${extra.quantity}` : ''} x {days} {days === 1 ? t('day') : t('days')})</span>
                          </span>
                          <span className="text-green-400 font-['Orbitron'] font-bold">${totalPrice}</span>
                        </div>
                      );
                    })}
                  </>
                ) : null;
              })()}

              {/* Total Amount */}
              <div className="flex justify-between items-center py-3 border-t border-cyan-500/30 bg-gradient-to-r from-cyan-900/10 to-transparent rounded-lg px-4">
                <p className="text-cyan-300 font-['Orbitron'] font-semibold text-lg">{t('totalAmount')}</p>
                <p className="text-cyan-300 font-['Orbitron'] font-bold text-xl">{formatCurrency(booking.totalAmount)}</p>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide">{t('paymentMethod')}</p>
                <p className="text-gray-200 font-medium capitalize">{booking.paymentMethod?.replace('_', ' ') || 'N/A'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteBookingModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        booking={booking}
        loading={loading}
      />
    </div>
  );
};

export default BookingDetailsModal;
