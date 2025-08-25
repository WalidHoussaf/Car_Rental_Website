import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import LanguageSwitcher from './Ui/LanguageSwitcher';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

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
      } else {
        setSearchValue('');
      }
    }
  }, [isOnCarsPage, location.search]);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account menu on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
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
      // If already on the cars page, use handleSearchUpdate from the page context
      if (isOnCarsPage) {
        // Send custom event with search value
        window.dispatchEvent(new CustomEvent('update-search', { 
          detail: { query: searchValue.trim() }
        }));
      } else {
        // Navigate to cars page with search parameter
        navigate(`/cars?search=${encodeURIComponent(searchValue.trim())}`);
      }
      setIsSearchOpen(false);
    }
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
              <NavLink to="/" label={t('home')} isActive={location.pathname === '/'} onClick={() => setIsSearchOpen(false)} />
              <NavLink to="/cars" label={t('cars')} isActive={location.pathname === '/cars'} onClick={() => setIsSearchOpen(false)} />
              <NavLink to="/about" label={t('about')} isActive={location.pathname === '/about'} onClick={() => setIsSearchOpen(false)} />
              <NavLink to="/contact" label={t('contact')} isActive={location.pathname === '/contact'} onClick={() => setIsSearchOpen(false)} />
              <NavLink to="/faq" label={t('faq')} isActive={location.pathname === '/faq'} onClick={() => setIsSearchOpen(false)} />
            </div>
          </div>

          {/* Right side - Search, Login/Register, Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Always present but conditionally visible */}
            <div className={`transition-all duration-300 ${isOnCarsPage ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
              <button 
                onClick={toggleSearch}
                className="p-2 text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={accountRef}>
                {/* Account Button */}
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                  onClick={() => setIsAccountOpen((v) => !v)}
                  className="group cursor-pointer flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-sm text-white hover:border-cyan-400/40 transition-all"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-['Orbitron'] font-bold">
                    <span className="text-[10px] leading-none">
                      {(
                        user?.firstName?.[0] ||
                        user?.name?.split(' ')?.[0]?.[0] ||
                        user?.email?.[0] ||
                        'A'
                      ).toUpperCase()}
                      {(
                        user?.lastName?.[0] ||
                        user?.name?.split(' ')?.[1]?.[0] ||
                        user?.email?.split('@')?.[0]?.[1] ||
                        ''
                      ).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-['Orbitron'] text-sm bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : (user?.name || user?.firstName || 'Account')}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-cyan-300 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  role="menu"
                  aria-hidden={!isAccountOpen}
                  className={`absolute right-0 mt-3 w-64 rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg/5 transition-all duration-200 ${isAccountOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  {/* Header */}
                  <div className="px-4 py-3 bg-black border-b border-gray-800">
                    <p className="text-sm text-gray-400 font-['Rationale']">{t('signedInAs')}</p>
                    <p className="text-sm font-['Orbitron'] bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                      {user?.email || 'admin@example.com'}
                    </p>
                  </div>

                  <div className="py-2 font-['Rationale']">
                    {user?.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        onClick={() => { setIsSearchOpen(false); setIsAccountOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        <span className="text-cyan-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z"/></svg>
                        </span>
                        <span>{t('dashboard')}</span>
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/users"
                        onClick={() => { setIsSearchOpen(false); setIsAccountOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        <span className="text-cyan-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                        </span>
                        <span>{t('manageUsers')}</span>
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/bookings"
                        onClick={() => { setIsSearchOpen(false); setIsAccountOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                        role="menuitem"
                      >
                        <span className="text-cyan-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14a1 1 0 011 1v14l-4-3-4 3-4-3-4 3V5a1 1 0 011-1z"/></svg>
                        </span>
                        <span>{t('bookingManagement')}</span>
                      </Link>
                    )}

                    <Link
                      to="/my-bookings"
                      onClick={() => { setIsSearchOpen(false); setIsAccountOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <span className="text-cyan-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14a1 1 0 011 1v14l-4-3-4 3-4-3-4 3V5a1 1 0 011-1z"/></svg>
                      </span>
                      <span>{t('myBookings')}</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => { setIsSearchOpen(false); setIsAccountOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <span className="text-cyan-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z"/></svg>
                      </span>
                      <span>{t('profileSettings')}</span>
                    </Link>

                    <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <button
                      onClick={() => { logout(); setIsSearchOpen(false); setIsAccountOpen(false); navigate('/'); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <span className="text-red-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                          <path d="M16 17l5-5-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="font-['Orbitron']">{t('logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium font-['Orbitron'] text-white bg-gradient-to-r hover:from-cyan-400 hover:to-white bg-clip-text transition-all duration-300 border border-transparent hover:border-cyan-500 hover:border-opacity-50 rounded-md"
                  onClick={() => setIsSearchOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium font-['Orbitron'] text-black bg-gradient-to-r from-cyan-400 to-white hover:from-white hover:to-cyan-400 rounded-md transition-all duration-300 transform hover:scale-105"
                  onClick={() => setIsSearchOpen(false)}
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
      {isOnCarsPage && isSearchOpen && (
        <div className="w-full bg-black/95 overflow-hidden transition-all duration-300 max-h-24 py-4 opacity-100 border-t border-gray-800">
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
                placeholder={t('searchForCars')}
                className="w-full bg-white/10 text-white border-0 rounded-md py-3 px-4 pl-10 font-['Orbitron'] focus:ring-2 focus:ring-blue-400 focus:bg-white/20 focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => {
                  if (searchValue) {
                    setSearchValue('');
                    if (isOnCarsPage) {
                      window.dispatchEvent(new CustomEvent('update-search', { 
                        detail: { query: '' }
                      }));
                    }
                  } else {
                    toggleSearch();
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={searchValue ? t('clearSearch') : t('closeSearch')}
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