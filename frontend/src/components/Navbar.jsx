import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import LanguageSwitcher from './Ui/LanguageSwitcher';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Check if currently on cars page
  const isOnCarsPage = location.pathname === '/cars';

  // Extract searchParam from URL if on cars page
  useEffect(() => {
    if (isOnCarsPage) {
      const queryParams = new URLSearchParams(location.search);
      const searchParam = queryParams.get('search');
      if (searchParam) {
        setSearchValue(searchParam);
      }
    }
  }, [isOnCarsPage, location.search]);

  // Check if the current route matches the nav item
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle search box - only works on cars page
  const toggleSearch = () => {
    if (isOnCarsPage) {
      setIsSearchOpen(!isSearchOpen);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchValue.trim() !== '') {
      // Si déjà sur la page cars, utiliser handleSearchUpdate depuis le contexte de la page
      if (isOnCarsPage) {
        // Envoyer l'événement personnalisé avec la valeur de recherche
        window.dispatchEvent(new CustomEvent('update-search', { 
          detail: { query: searchValue.trim() }
        }));
      } else {
        // Sinon, naviguer vers la page cars avec le paramètre de recherche
        navigate(`/cars?search=${encodeURIComponent(searchValue.trim())}`);
      }
      setIsSearchOpen(false); // Close search box after search
    }
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchValue('');
    if (isOnCarsPage) {
      window.dispatchEvent(new CustomEvent('update-search', { 
        detail: { query: '' }
      }));
    }
  };

  // Close menu when clicking a link
  const closeMenu = () => {
    setIsSearchOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-9999 transition-all duration-500 ${
      isScrolled ? 'bg-black/90 shadow-lg backdrop-blur-sm' : 'bg-black'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-20 w-auto" 
                src={assets.logo}
                alt="Rent My Ride"
              />
              <div className="ml-2 flex flex-col">
                {/* Logo Text */}
                <span className="text-2xl font-semibold font-['Orbitron'] bg-gradient-to-r from-white to-cyan-400 text-transparent bg-clip-text">RENT MY RIDE</span>
                <span className="text-gray-300 text-2xs font-['Rationale']">CAR RENTAL</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="block">
            <div className="ml-10 flex font-['Orbitron'] items-center space-x-8">
              <NavLink to="/" label={t('home')} isActive={isActive('/')} onClick={closeMenu} />
              <NavLink to="/cars" label={t('cars')} isActive={isActive('/cars')} onClick={closeMenu} />
              <NavLink to="/about" label={t('about')} isActive={isActive('/about')} onClick={closeMenu} />
              <NavLink to="/contact" label={t('contact')} isActive={isActive('/contact')} onClick={closeMenu} />
              <NavLink to="/faq" label={t('faq')} isActive={isActive('/faq')} onClick={closeMenu} />
            </div>
          </div>

          {/* Right side - Search, Login/Register, Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Only visible on cars page */}
            {isOnCarsPage && (
              <button 
                onClick={toggleSearch}
                className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-300">
                  <span>{user?.name || 'Account'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-black ring-1 ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 font-['Rationale']">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={closeMenu}
                  >
                    {language === 'en' ? 'Dashboard' : 'Tableau de bord'}
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={closeMenu}
                  >
                    {t('myBookings')}
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={closeMenu}
                  >
                    {language === 'en' ? 'Profile Settings' : 'Paramètres du profil'}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    {t('logout')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium font-['Orbitron'] text-white bg-gradient-to-r hover:from-cyan-400 hover:to-white bg-clip-text transition-all duration-300 border border-transparent hover:border-cyan-500 hover:border-opacity-50 rounded-md"
                  onClick={closeMenu}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium font-['Orbitron'] text-black bg-gradient-to-r from-cyan-400 to-white hover:from-white hover:to-cyan-400 rounded-md transition-all duration-300 transform hover:scale-105"
                  onClick={closeMenu}
                >
                  {t('register')}
                </Link>
              </>
            )}
            
            {/* Language Switcher Button*/}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      {isOnCarsPage && (
        <div className={`w-full bg-black/95 overflow-hidden transition-all duration-300 ${
          isSearchOpen ? 'max-h-24 py-4 opacity-100 border-t border-gray-800' : 'max-h-0 py-0 opacity-0'
        }`}>
          <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={language === 'en' ? "Search for cars..." : "Rechercher des voitures..."}
                className="w-full bg-white/10 text-white border-0 rounded-md py-3 px-4 pl-10 font-['Orbitron'] focus:ring-2 focus:ring-blue-400 focus:bg-white/20 focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={searchValue ? clearSearch : toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={searchValue 
                  ? (language === 'en' ? "Clear search" : "Effacer la recherche")
                  : (language === 'en' ? "Close search" : "Fermer la recherche")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className="relative px-1 py-2 text-sm font-medium transition-colors duration-300 group whitespace-nowrap"
      onClick={onClick}
    >
      <span className={`transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-white to-cyan-400 text-transparent bg-clip-text' 
          : 'text-gray-300 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-white group-hover:text-transparent group-hover:bg-clip-text'
      }`}>
        {label}
      </span>
      <span 
        className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${
          isActive 
            ? 'scale-x-100 bg-gradient-to-r from-white to-cyan-400' 
            : 'scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-cyan-400 to-white'
        }`} 
      />
    </Link>
  );
};

export default Navbar;