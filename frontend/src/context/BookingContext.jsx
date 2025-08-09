import React, { createContext, useContext, useState } from 'react';
import { api } from '../config/api.js';

// Create the context
const BookingContext = createContext();

// Custom hook to use the booking context
export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Create a new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.bookings.create(bookingData);
      
      if (response.success) {
        const newBooking = response.data.booking;
        setCurrentBooking(newBooking);
        setBookings(prev => [newBooking, ...prev]);
        
        return { success: true, booking: newBooking };
      } else {
        setError(response.message || 'Failed to create booking');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create booking';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.bookings.getMyBookings(params);
      
      if (response.success) {
        setBookings(response.data.bookings);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch bookings');
        return null;
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch bookings';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get single booking by ID
  const getBookingById = async (bookingId) => {
    try {
      const response = await api.bookings.getById(bookingId);
      
      if (response.success) {
        setCurrentBooking(response.data.booking);
        return response.data.booking;
      } else {
        throw new Error(response.message || 'Booking not found');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId, cancellationReason = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.bookings.cancel(bookingId, cancellationReason);
      
      if (response.success) {
        // Update bookings list
        const updatedBookings = bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled', cancellationReason, refundAmount: response.data.refundAmount }
            : booking
        );
        
        setBookings(updatedBookings);
        
        // Update current booking if it's the one being cancelled
        if (currentBooking && currentBooking._id === bookingId) {
          setCurrentBooking({ 
            ...currentBooking, 
            status: 'cancelled', 
            cancellationReason,
            refundAmount: response.data.refundAmount 
          });
        }
        
        return { success: true, refundAmount: response.data.refundAmount };
      } else {
        setError(response.message || 'Failed to cancel booking');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel booking';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await api.users.getDashboardStats();
      
      if (response.success) {
        setDashboardStats(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
    return null;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    bookings,
    currentBooking,
    dashboardStats,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    getBookingById,
    cancelBooking,
    fetchDashboardStats,
    setCurrentBooking,
    clearError
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;