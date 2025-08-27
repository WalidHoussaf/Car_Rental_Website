import React, { useState, useEffect } from 'react';
import { LanguageContext } from './languageContext';

export const LanguageProvider = ({ children }) => {
  // Get stored language or use 'en' as default
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update the lang attribute of the HTML document
    document.documentElement.lang = language;
  }, [language]);

  // Change the language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  // Check if current language is French
  const isFrench = language === 'fr';

  // Context value
  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isFrench
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

 