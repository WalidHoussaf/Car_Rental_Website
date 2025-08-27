import { useContext } from 'react';
import { LanguageContext } from '../context/languageContext';

// Custom hook to use the language context
export const useLanguage = () => {
  return useContext(LanguageContext);
};
