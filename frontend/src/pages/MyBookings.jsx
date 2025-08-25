import React, { useContext, useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../config/api';
import { useNotification } from '../context/NotificationContext';
import AuthContext from '../context/authContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const PAGE_SIZE = 10;

const MyBookings = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { showError } = useNotification();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [status, setStatus] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef(null);

  const fetchBookings = async (opts = {}) => {
    const { page: p = page, status: s = status } = opts;
    setLoading(true);
    setError('');
    try {
      const res = await api.bookings.getMyBookings({ page: p, limit: PAGE_SIZE, status: s || undefined });
      if (res?.success) {
        setBookings(res.data.bookings || []);
        setPage(res.data.pagination.currentPage || 1);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalItems(res.data.pagination.totalItems || 0);
      } else {
        throw new Error(res?.message || 'Failed to load bookings');
      }
    } catch (error) {
      const msg = error?.message || t('failedToLoadBookings') || 'Failed to load bookings';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
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
        {status}
      </span>
    );
  };

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

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage:
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px' }} />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2 leading-tight">
                {t('myBookings') || 'My Bookings'}
              </h1>
              <p className="text-gray-400 mb-3">{t('myBookingsDesc') || 'Review and manage your reservations.'}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalItems}</div>
              <div className="text-sm text-gray-400">{t('totalBookings') || 'Total Bookings'}</div>
            </div>
          </div>

          {/* Card: Stats + Filters + Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/40 border border-yellow-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'pending').length}</div>
                    <div className="text-sm text-gray-400">{t('pending') || 'Pending'}</div>
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
                    <div className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'confirmed').length}</div>
                    <div className="text-sm text-gray-400">{t('confirmed') || 'Confirmed'}</div>
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
                    <div className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'active').length}</div>
                    <div className="text-sm text-gray-400">{t('active') || 'Active'}</div>
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
                    <div className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'completed').length}</div>
                    <div className="text-sm text-gray-400">{t('completed') || 'Completed'}</div>
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
                  {status === '' ? t('allStatuses') : (t(status) || status)}
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
                      {t('allStatuses') || 'All Statuses'}
                    </button>
                    <button
                      onClick={() => { setStatus('pending'); setPage(1); fetchBookings({ page: 1, status: 'pending' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('pending') || 'Pending'}
                    </button>
                    <button
                      onClick={() => { setStatus('confirmed'); setPage(1); fetchBookings({ page: 1, status: 'confirmed' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('confirmed') || 'Confirmed'}
                    </button>
                    <button
                      onClick={() => { setStatus('active'); setPage(1); fetchBookings({ page: 1, status: 'active' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('active') || 'Active'}
                    </button>
                    <button
                      onClick={() => { setStatus('completed'); setPage(1); fetchBookings({ page: 1, status: 'completed' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('completed') || 'Completed'}
                    </button>
                    <button
                      onClick={() => { setStatus('cancelled'); setPage(1); fetchBookings({ page: 1, status: 'cancelled' }); setIsStatusDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('cancelled') || 'Cancelled'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black/60 text-gray-400 font-['Orbitron']">
                  <tr>
                    <th className="py-4 px-4 font-medium">{t('booking') || 'Booking'}</th>
                    <th className="py-4 px-4 font-medium">{t('car') || 'Car'}</th>
                    <th className="py-4 px-4 font-medium">{t('dates') || 'Dates'}</th>
                    <th className="py-4 px-4 font-medium">{t('status') || 'Status'}</th>
                    <th className="py-4 px-4 font-medium">{t('total') || 'Total'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/30">
                  {loading ? (
                    <tr><td className="py-6 text-center text-gray-400" colSpan={5}>{t('loading') || 'Loading...'}</td></tr>
                  ) : error ? (
                    <tr><td className="py-6 text-center text-red-300" colSpan={5}>{error}</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td className="py-6 text-center text-gray-400" colSpan={5}>{t('noBookingsFound') || 'No bookings found'}</td></tr>
                  ) : (
                    bookings.map(booking => (
                      <tr key={booking._id} className="border-b border-cyan-900/20 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-white font-medium">#{booking._id.slice(-8)}</div>
                            <div className="text-gray-400 text-xs font-['Orbitron']">{new Date(booking.createdAt).toLocaleDateString()}</div>
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
                            <div className="text-gray-500 text-xs">{t('to') || 'to'} {new Date(booking.endDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 uppercase"><StatusBadge status={booking.status} /></td>
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">${booking.totalAmount}</div>
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
                <div>{t('showing') || 'Showing'} <span className="text-white font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, totalItems)}</span> {t('to') || 'to'} <span className="text-white font-medium">{Math.min(page * PAGE_SIZE, totalItems)}</span> {t('of') || 'of'} <span className="text-white font-medium">{totalItems}</span> {t('bookings') || 'bookings'} </div>
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
                  {t('previous') || 'Previous'}
                </button>
                <div className="px-3 py-2 bg-cyan-600/20 border border-cyan-600/40 rounded-md text-cyan-300 font-['Orbitron']">
                  {page} {t('of') || 'of'} {totalPages}
                </div>
                <button 
                  disabled={page >= totalPages || loading} 
                  onClick={() => fetchBookings({ page: page + 1 })} 
                  className={`px-4 py-2 rounded-md border font-['Orbitron'] transition-colors flex items-center gap-2 ${page >= totalPages || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                >
                  {t('next') || 'Next'}
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
    </div>
  );
};

export default MyBookings;
