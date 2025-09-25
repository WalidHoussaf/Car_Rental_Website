import { useContext } from 'react';
import CarContext from '../context/CarContext.jsx';

export const useCar = () => {
  return useContext(CarContext);
};
