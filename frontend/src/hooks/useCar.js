import { useContext } from 'react';
import CarContext from '../context/CarContext.jsx';

// Custom hook to use the car context
export const useCar = () => {
  return useContext(CarContext);
};
