import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const LoginPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // État pour les particules brillantes
  const [particles, setParticles] = useState([]);
  
  // Générer des particules aléatoires
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state for submit button
  const [isLoading, setIsLoading] = useState(false);
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'L\'adresse email est invalide' : 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = language === 'fr' ? 'Le mot de passe est requis' : 'Password is required';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Simulate login process
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Reset success message after delay
      setTimeout(() => {
        setIsSuccess(false);
        // Here you would typically redirect to dashboard/home
      }, 2000);
    }, 1500);
  };

  // Handle social login redirects
  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/o/oauth2/auth";
    // In a real implementation, you would include more OAuth parameters
  };

  const handleFacebookLogin = () => {
    window.location.href = "https://www.facebook.com/v13.0/dialog/oauth";
    // In a real implementation, you would include more OAuth parameters
  };

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Arrière-plan amélioré */}
      <div className="absolute inset-0 z-0">
        {/* Overlay de dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
        
        {/* Vidéo d'arrière-plan */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src={assets.hero.loginbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Cercles décoratifs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"></div>
        
        {/* Motif de grille */}
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-repeat opacity-10"></div>
        
        {/* Particules brillantes */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.4,
              boxShadow: '0 0 8px 2px rgba(34, 211, 238, 0.3)',
              animation: `pulse ${particle.duration}s infinite ${particle.delay}s, float ${particle.duration * 2}s infinite ${particle.delay}s`,
            }}
          ></div>
        ))}
        
        {/* Lignes horizontales décoratives */}
        <div className="absolute top-1/3 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="absolute top-2/3 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Élément décoratif flottant */}
        <div className="absolute top-1/4 right-10 w-20 h-20 md:w-32 md:h-32">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-spin-slower"></div>
            <div className="absolute inset-4 rounded-full border border-cyan-300/10 animate-ping"></div>
          </div>
        </div>
        
        {/* Carte de formulaire de connexion */}
        <div className="w-full max-w-md bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-cyan-800/20 relative overflow-hidden z-10 animate-fade-in-up">
          {/* Décoration de bordure lumineuse */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
          
          {/* Effet de paillettes dans le coin */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/5 rounded-full blur-xl"></div>
          
          {/* En-tête du formulaire */}
          <div className="text-center mb-8 relative">
            <h1 className="text-3xl md:text-4xl font-regular mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('welcomeBack')}
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              {t('signInToAccess')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
          </div>

          {/* Message de succès */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/50 rounded-md text-center">
              <p className="text-cyan-400">{t('loginSuccessful')}</p>
            </div>
          )}

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1">{t('emailAddress')}</label>
              <div className="relative w-full mb-4 group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('enterEmail')}
                  className={`w-full bg-black/40 border ${errors.email ? 'border-red-500' : 'border-cyan-800/50'} rounded-md px-4 h-11 text-white 
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                    font-['Orbitron'] 
                    text-sm
                    transition-all duration-300
                    group-hover:border-cyan-400/70
                    group-hover:bg-black/60
                    placeholder-gray-500`}
                  autoComplete="off"
                />
                {/* Effet de focus */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-white group-hover:w-full transition-all duration-500"></div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-cyan-300 mb-1">{t('password')}</label>
                <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-white transition-colors duration-300">
                  {t('forgotPassword')}
                </Link>
              </div>
              <div className="relative w-full mb-4 group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('enterPassword')}
                  className={`w-full bg-black/40 border ${errors.password ? 'border-red-500' : 'border-cyan-800/50'} rounded-md px-4 h-11 text-white 
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                    font-['Orbitron'] 
                    text-sm
                    transition-all duration-300
                    group-hover:border-cyan-400/70
                    group-hover:bg-black/60
                    placeholder-gray-500`}
                  autoComplete="off"
                />
                {/* Effet de focus */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-white group-hover:w-full transition-all duration-500"></div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 bg-black border-cyan-700 rounded focus:ring-cyan-500 text-cyan-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-300 hover:text-cyan-300 transition-colors duration-300">
                    {t('rememberMe')}
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white rounded-md transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer relative overflow-hidden group"
            >
              {/* Effet d'éclairage au survol */}
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 group-hover:animate-pulse-fast"></span>
              
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('signingIn')}
                </span>
              ) : (
                t('signIn')
              )}
            </button>

            {/* Boutons de connexion sociale */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-700/30 to-transparent"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-cyan-400">{t('orContinueWith')}</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-cyan-900/30 rounded-lg shadow-xl bg-black/40 backdrop-blur-lg text-sm font-medium text-white transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-700/20 transform hover:scale-105 cursor-pointer group"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.676-4.203-2.707-6.735-2.707-5.522 0-10.002 4.48-10.002 10.002s4.48 10.002 10.002 10.002c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.083z" />
                  </svg>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-cyan-900/30 rounded-lg shadow-xl bg-black/40 backdrop-blur-lg text-sm font-medium text-white transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-700/20 transform hover:scale-105 cursor-pointer group"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.988c4.781-.75 8.437-4.887 8.437-9.878z" />
                  </svg>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Facebook</span>
                </button>
              </div>
            </div>

            {/* Lien d'inscription */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                {t('noAccount')} <Link to="/register" className="text-cyan-400 hover:text-white transition-colors duration-300 relative group">
                  {t('createAccount')}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Séparateur animé */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoginPage;