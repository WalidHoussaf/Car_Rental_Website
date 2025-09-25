import { useContext } from 'react';
import BookingContext from '../context/BookingContext.jsx';

export const useBooking = () => {
  return useContext(BookingContext);
};
