import { useContext } from 'react';
import BookingContext from '../context/BookingContext.jsx';

// Custom hook to use the booking context
export const useBooking = () => {
  return useContext(BookingContext);
};
