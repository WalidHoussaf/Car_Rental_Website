import { useContext } from 'react';
import AuthContext from '../context/authContext';

// Hook to consume Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
