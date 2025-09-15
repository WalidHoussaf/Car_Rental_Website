import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../config/api';
import { useNotification } from '../../context/notificationUtils';
import AuthContext from '../../context/authContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import BookingDetailsModal from '../../components/Admin/BookingDetailsModal';

const PAGE_SIZE = 20;

const AdminBookings = () => {
  const { showError } = useNotification();
  const { user: currentUser, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Currency formatter: English -> USD ($), French -> EUR (€)
  const currencyFormatter = useMemo(() => {
    const isFR = language === 'fr';
    return new Intl.NumberFormat(isFR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: isFR ? 'EUR' : 'USD',
    });
  }, [language]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [status, setStatus] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  // Stats state
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Bulk selection state
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  // Close status dropdown on outside click or Esc
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

  // Guard: only admins can view
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setError(t('notAuthorized'));
    }
  }, [isAuthenticated, isAdmin, t]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await api.bookings.getStats();
      
      // Backend now returns data.statusCounts instead of array
      if (response.data && response.data.statusCounts) {
        setStats(response.data.statusCounts);
      } else {
        // Fallback for array format
        const statsData = {
          pending: 0,
          confirmed: 0,
          active: 0,
          completed: 0,
          cancelled: 0
        };
        
        if (Array.isArray(response.data)) {
          response.data.forEach(stat => {
            if (Object.prototype.hasOwnProperty.call(statsData, stat._id)) {
              statsData[stat._id] = stat.count;
            }
          });
        }
        
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleUpdateBooking = (updatedBooking) => {
    setBookings(prev => prev.map(booking => 
      booking._id === updatedBooking._id ? updatedBooking : booking
    ));
    fetchStats(); // Refresh stats after update
  };

  const handleDeleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking._id !== bookingId));
    fetchStats(); // Refresh stats after delete
  };

  // Bulk selection handlers
  const handleSelectBooking = (bookingId) => {
    setSelectedBookings(prev => {
      const newSelection = prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId];
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
      setShowBulkActions(false);
    } else {
      const allBookingIds = bookings.map(booking => booking._id);
      setSelectedBookings(allBookingIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.length === 0) return;
    
    setBulkDeleteLoading(true);
    try {
      const response = await api.bookings.bulkDelete(selectedBookings);
      if (response?.success) {
        setBookings(prev => prev.filter(booking => !selectedBookings.includes(booking._id)));
        setSelectedBookings([]);
        setShowBulkActions(false);
        setShowBulkDeleteModal(false);
        fetchStats(); // Refresh stats after bulk delete
        showError(`Successfully deleted ${selectedBookings.length} booking(s)`, 'success');
      } else {
        showError(response?.message || 'Failed to delete selected bookings');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      showError(error?.message || 'Failed to delete selected bookings');
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedBookings([]);
    setShowBulkActions(false);
  };

  const fetchBookings = async (opts = {}) => {
    const { page: p = page, status: s = status } = opts;
    setLoading(true);
    setError('');
    try {
      const res = await api.bookings.getAll({ page: p, limit: PAGE_SIZE, status: s || undefined });
      if (res?.success) {
        const list = res.data.bookings || [];
        const pag = res.data.pagination || {};
        setBookings(list);
        setPage(pag.currentPage || 1);
        setTotalPages(pag.totalPages || 1);
        setTotalItems(pag.totalItems || 0);
        // Clear selection when data is refetched
        setSelectedBookings([]);
        setShowBulkActions(false);
      } else {
        throw new Error(res?.message || t('failedToLoadBookings'));
      }
    } catch (error) {
      const msg = error?.message || t('failedToLoadBookings');
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchStats();
      fetchBookings({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
      confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
      active: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
      completed: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${config.bg} ${config.text} border ${config.border}`}>
        {t(status)}
      </span>
    );
  };

  // Wait for auth to resolve before deciding navigation
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-300 font-['Orbitron']">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>{t('checkingAuthentication')}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAuthenticated && !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2 leading-tight">{t('bookingManagement')}</h1>
              <p className="text-gray-400 mb-3">{t('manageAllBookings')}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalItems}</div>
              <div className="text-sm text-gray-400">{t('totalBookings')}</div>
            </div>
          </div>

          {/* Card: Stats + Filters + Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-black/40 border border-yellow-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{statsLoading ? '...' : stats.pending}</div>
                    <div className="text-sm text-gray-400">{t('pending')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-blue-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{statsLoading ? '...' : stats.confirmed}</div>
                    <div className="text-sm text-gray-400">{t('confirmed')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-green-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{statsLoading ? '...' : stats.active}</div>
                    <div className="text-sm text-gray-400">{t('active')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-purple-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{statsLoading ? '...' : stats.completed}</div>
                    <div className="text-sm text-gray-400">{t('completed')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-red-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{statsLoading ? '...' : stats.cancelled}</div>
                    <div className="text-sm text-gray-400">{t('cancelled')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex justify-end">
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full sm:w-64 text-left font-['Orbitron'] bg-black/40 border border-cyan-900/30 rounded-md py-2 pl-3 pr-9 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-200 hover:border-cyan-600/40 transition-colors cursor-pointer"
                >
                  {status === '' ? t('allStatuses') : t(status)}
                </button>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.16l-4.18 3.31a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z" clipRule="evenodd" />
                  </svg>
                </span>
                
                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-full sm:w-64 rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg transition-all duration-200 z-50 ${isStatusDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  <div className="py-2 font-['Orbitron']">
                    <button
                      onClick={() => { setStatus(''); setPage(1); fetchBookings({ page: 1, status: '' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('allStatuses')}
                    </button>
                    <button
                      onClick={() => { setStatus('pending'); setPage(1); fetchBookings({ page: 1, status: 'pending' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('pending')}
                    </button>
                    <button
                      onClick={() => { setStatus('confirmed'); setPage(1); fetchBookings({ page: 1, status: 'confirmed' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('confirmed')}
                    </button>
                    <button
                      onClick={() => { setStatus('active'); setPage(1); fetchBookings({ page: 1, status: 'active' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('active')}
                    </button>
                    <button
                      onClick={() => { setStatus('completed'); setPage(1); fetchBookings({ page: 1, status: 'completed' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('completed')}
                    </button>
                    <button
                      onClick={() => { setStatus('cancelled'); setPage(1); fetchBookings({ page: 1, status: 'cancelled' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('cancelled')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {showBulkActions && (
              <div className="mb-4 p-4 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-300 font-medium">
                      {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={handleClearSelection}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBulkDeleteModal(true)}
                      className="px-4 py-2 bg-red-600/20 text-red-300 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors text-sm font-medium"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black/60 text-gray-400 font-['Orbitron']">
                  <tr>
                    <th className="py-4 px-4 font-medium w-12">
                      <input
                        type="checkbox"
                        checked={selectedBookings.length === bookings.length && bookings.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                    </th>
                    <th className="py-4 px-4 font-medium">{t('bookingId')}</th>
                    <th className="py-4 px-4 font-medium">{t('customer')}</th>
                    <th className="py-4 px-4 font-medium">{t('car')}</th>
                    <th className="py-4 px-4 font-medium">{t('dates')}</th>
                    <th className="py-4 px-4 font-medium">{t('status')}</th>
                    <th className="py-4 px-4 font-medium">{t('total')}</th>
                    <th className="py-4 px-4 font-medium">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/30">
                  {loading ? (
                    <tr><td className="py-6 text-center text-gray-400" colSpan={8}>{t('loadingGeneric')}</td></tr>
                  ) : error ? (
                    <tr><td className="py-6 text-center text-red-300" colSpan={8}>{error}</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td className="py-6 text-center text-gray-400" colSpan={8}>{t('noBookingsFound')}</td></tr>
                  ) : (
                    bookings.map(booking => (
                      <tr key={booking._id} className="border-b border-cyan-900/20 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking._id)}
                            onChange={() => handleSelectBooking(booking._id)}
                            className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-white font-medium">#{booking._id.slice(-8)}</div>
                            <div className="text-gray-400 text-xs font-['Orbitron']">{new Date(booking.createdAt).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-['Orbitron'] font-bold text-xs">
                              {booking.user?.firstName?.[0]?.toUpperCase()}{booking.user?.lastName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium">{booking.user?.firstName} {booking.user?.lastName}</div>
                              <div className="text-gray-400 text-xs">{booking.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-white font-medium">
                              {booking.car?.make} {booking.car?.model} ({booking.car?.year})
                            </div>
                            <div className="text-gray-400 text-xs">{booking.car?.licensePlate}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-gray-300">{new Date(booking.startDate).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs">{t('to')} {new Date(booking.endDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 uppercase"><StatusBadge status={booking.status} /></td>
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{currencyFormatter.format(Number(booking.totalAmount) || 0)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewBooking(booking)}
                              className="px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-600/30 rounded hover:bg-blue-600/30 transition-colors text-xs cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-300 bg-black/40 rounded-lg p-4 border border-cyan-900/30">
              <div className="flex items-center gap-4">
                <div>{t('showing')} <span className="text-white font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, totalItems)}</span> {t('to')} <span className="text-white font-medium">{Math.min(page * PAGE_SIZE, totalItems)}</span> {t('of')} <span className="text-white font-medium">{totalItems}</span> {t('bookings')} </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page <= 1 || loading} 
                  onClick={() => fetchBookings({ page: page - 1 })} 
                  className={`px-4 py-2 rounded-md border font-['Orbitron'] transition-colors flex items-center gap-2 ${page <= 1 || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('previous')}
                </button>
                <div className="px-3 py-2 bg-cyan-600/20 border border-cyan-600/40 rounded-md text-cyan-300 font-['Orbitron']">
                  {page} {t('of')} {totalPages}
                </div>
                <button 
                  disabled={page >= totalPages || loading} 
                  onClick={() => fetchBookings({ page: page + 1 })} 
                  className={`px-4 py-2 rounded-md border font-['Orbitron'] transition-colors flex items-center gap-2 ${page >= totalPages || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                >
                  {t('next')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateBooking}
        onDelete={handleDeleteBooking}
      />

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-600/20 rounded-full">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white font-['Orbitron']">Confirm Bulk Delete</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete <span className="text-red-400 font-medium">{selectedBookings.length}</span> selected booking(s)?
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                <p className="text-gray-400 text-sm mb-2">Selected bookings:</p>
                {bookings
                  .filter(booking => selectedBookings.includes(booking._id))
                  .map(booking => (
                    <div key={booking._id} className="flex justify-between items-center py-1 text-sm">
                      <span className="text-gray-300">#{booking._id.slice(-8)}</span>
                      <span className="text-gray-400">{booking.user?.firstName} {booking.user?.lastName}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                disabled={bulkDeleteLoading}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {bulkDeleteLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Bookings'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
