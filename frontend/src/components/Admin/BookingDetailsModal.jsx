import React, { useState, useEffect } from 'react';
import { getLocationById } from '../../config/officeLocations';
import api from '../../config/api';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { calculateInclusiveDays } from '../../utils/dateCalculation';

const BookingDetailsModal = ({ booking, isOpen, onClose, onUpdate, onDelete }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    status: booking?.status || '',
    startDate: booking?.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '',
    endDate: booking?.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '',
    pickupLocation: booking?.pickupLocation?.branch || '',
    dropoffLocation: booking?.dropoffLocation?.branch || '',
    notes: booking?.notes || ''
  });

  // Update form when booking changes
  useEffect(() => {
    if (booking) {
      setEditForm({
        status: booking.status || '',
        startDate: booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '',
        endDate: booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '',
        pickupLocation: booking.pickupLocation?.branch || '',
        dropoffLocation: booking.dropoffLocation?.branch || '',
        notes: booking.notes || ''
      });
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
    setEditForm({
      status: booking.status,
      startDate: new Date(booking.startDate).toISOString().split('T')[0],
      endDate: new Date(booking.endDate).toISOString().split('T')[0],
      pickupLocation: booking.pickupLocation?.branch || '',
      dropoffLocation: booking.dropoffLocation?.branch || '',
      notes: booking.notes || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        status: editForm.status,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        pickupLocation: { branch: editForm.pickupLocation },
        dropoffLocation: { branch: editForm.dropoffLocation },
        notes: editForm.notes
      };

      const response = await api.bookings.update(booking._id, updateData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.bookings.delete(booking._id);
      onDelete(booking._id);
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
{t('bookingDetails') || 'Booking Details'} - #{booking._id.slice(-8)}
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
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300"
                  >
                    <option value="pending">{t('pending') || 'Pending'}</option>
                    <option value="confirmed">{t('confirmed') || 'Confirmed'}</option>
                    <option value="active">{t('active') || 'Active'}</option>
                    <option value="completed">{t('completed') || 'Completed'}</option>
                    <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
                  </select>
                ) : (
                  <span className={`${getStatusColor(booking.status)} font-['Orbitron'] font-medium`}>
{t(booking.status) || booking.status}
                  </span>
                )}
                <span className="text-sm text-gray-400 font-['Orbitron']">
                  {t('created') || 'Created'}: {formatDate(booking.createdAt)}
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
                      {loading ? (t('saving') || 'Saving...') : (t('save') || 'Save')}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-transparent border border-cyan-500/30 text-cyan-400 font-['Orbitron'] text-sm font-semibold rounded-md hover:bg-cyan-900/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      {t('cancel') || 'Cancel'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-600/20 text-white border border-blue-600/30 rounded hover:bg-blue-600/30 hover:border-blue-500 transition-all duration-300 font-['Orbitron'] text-sm font-semibold cursor-pointer transform hover:scale-105"
                    >
                      {t('edit') || 'Edit'}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600/50 text-white border border-red-500/30 rounded hover:bg-red-700/50 transition-all duration-300 text-sm font-['Orbitron'] font-semibold  cursor-pointer transform hover:scale-105"
                    >
                      {t('deleteBooking') || 'Delete'}
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-600/20 text-white border border-orange-600/30 rounded hover:bg-amber-600/30 transition-all duration-300 font-['Orbitron'] text-sm font-semibold cursor-pointer transform hover:scale-105"
                      >
                        {t('cancelBooking') || 'Cancel Booking'}
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
                {t('customerInformation') || 'Customer Information'}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('fullName') || 'Full Name'}</p>
                  <p className="text-gray-200 font-medium">
                    {booking.user?.firstName && booking.user?.lastName 
                      ? `${booking.user.firstName} ${booking.user.lastName}` 
                      : booking.user?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('phoneNumber') || 'Phone Number'}</p>
                  <p className="text-gray-200 font-medium">{booking.user?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('emailAddress') || 'Email Address'}</p>
                  <p className="text-gray-200 font-medium">{booking.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('address') || 'Address'}</p>
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
                {t('vehicleInformation') || 'Vehicle Information'}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('brand') || 'Brand'}</p>
                <p className="text-gray-200 font-medium">{booking.car?.make || booking.car?.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('model') || 'Model'}</p>
                <p className="text-gray-200 font-medium">{booking.car?.model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('year') || 'Year'}</p>
                <p className="text-gray-200 font-medium">{booking.car?.year || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
                {t('bookingInformation') || 'Booking Details'}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('startDate') || 'Start Date'}</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      className="bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 w-full"
                    />
                  ) : (
                    <p className="text-gray-200 font-medium">{formatDate(booking.startDate)}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('pickupTime') || 'Pickup Time'}</p>
                  <p className="text-gray-200 font-medium">{formatTime(booking.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('pickupLocation') || 'Pickup Location'}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.pickupLocation}
                      onChange={(e) => setEditForm({ ...editForm, pickupLocation: e.target.value })}
                      className="bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 w-full"
                    />
                  ) : (
                    <p className="text-gray-200 font-medium">
                      {(() => {
                        if (!booking.pickupLocation?.branch) return 'N/A';
                        const office = getLocationById(booking.pickupLocation.branch.toLowerCase());
                        return office ? office.address.en : booking.pickupLocation.branch;
                      })()}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('endDate') || 'End Date'}</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                      className="bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 w-full"
                    />
                  ) : (
                    <p className="text-gray-200 font-medium">{formatDate(booking.endDate)}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('dropoffTime') || 'Dropoff Time'}</p>
                  <p className="text-gray-200 font-medium">{formatTime(booking.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide mb-2">{t('dropoffLocation') || 'Drop-off Location'}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.dropoffLocation}
                      onChange={(e) => setEditForm({ ...editForm, dropoffLocation: e.target.value })}
                      className="bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 w-full"
                    />
                  ) : (
                    <p className="text-gray-200 font-medium">
                      {(() => {
                        if (!booking.dropoffLocation?.branch) return 'N/A';
                        const office = getLocationById(booking.dropoffLocation.branch.toLowerCase());
                        return office ? office.address.en : booking.dropoffLocation.branch;
                      })()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Pricing Details */}
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 border border-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
                {t('pricingDetails') || 'Pricing Details'}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
            </div>
            
            <div className="space-y-4">
              {/* Base Price */}
              <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/20 transition-all duration-300">
                <span className="text-white font-['Orbitron'] flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  {t('basePrice') || 'Base Price'} 
                  <span className="ml-2 text-xs text-gray-400">
                    {(() => {
                      const startDate = new Date(booking.startDate);
                      const endDate = new Date(booking.endDate);
                      const days = calculateInclusiveDays(startDate, endDate);
                      const pricePerDay = booking.pricePerDay || (booking.car?.pricePerDay) || 0;
                      return `(${formatCurrency(pricePerDay)} x ${days} ${days === 1 ? (t('day') || 'day') : (t('days') || 'days')})`;
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
                // Get selected extras from booking 
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
                            {extra.name} <span className="ml-2 text-xs text-gray-400">(${extra.price}{(extra.quantity && extra.quantity > 1) ? ` x ${extra.quantity}` : ''} x {days} {days === 1 ? (t('day') || 'day') : (t('days') || 'days')})</span>
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
                <p className="text-cyan-300 font-['Orbitron'] font-semibold text-lg">{t('totalAmount') || 'Total Amount'}</p>
                <p className="text-cyan-300 font-['Orbitron'] font-bold text-xl">{formatCurrency(booking.totalAmount)}</p>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide">{t('paymentMethod') || 'Payment Method'}</p>
                <p className="text-gray-200 font-medium capitalize">{booking.paymentMethod?.replace('_', ' ') || 'N/A'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
