import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte
const LanguageContext = createContext();

// Hook personnalisé pour utiliser le contexte de langue
export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  // Récupérer la langue stockée ou utiliser 'en' par défaut
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    localStorage.setItem('language', language);
    // Mettre à jour l'attribut lang du document HTML
    document.documentElement.lang = language;
  }, [language]);

  // Changer la langue
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  // Vérifier si la langue actuelle est le français
  const isFrench = language === 'fr';

  // Valeur du contexte
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

export default LanguageContext; 