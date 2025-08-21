import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { register, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    agreeTerms: false
  });
  
  // Error State
  const [errors, setErrors] = useState({});
  
  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Loading State for registration
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Redirect if already authenticated 
  React.useEffect(() => {
    if (isAuthenticated && user && !isLoading && !isSuccess) {
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, isLoading, isSuccess]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      const sanitizedValue = (addressField === 'zipCode')
        ? value.replace(/\D/g, '').slice(0, 5)
        : value;
      setFormData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: sanitizedValue
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear Error when User Types
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Validate form with Translated Error Messages
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'fr' ? 'Le prénom est requis' : 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'fr' ? 'Le nom est requis' : 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'L\'adresse email est invalide' : 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = language === 'fr' ? 'Le mot de passe est requis' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = language === 'fr' ? 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' : 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'fr' ? 'Le numéro de téléphone est requis' : 'Phone number is required';
    } else if (!/^[+]?[\d\s\-()]{7,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = language === 'fr' ? 'Veuillez fournir un numéro de téléphone valide' : 'Please provide a valid phone number';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = language === 'fr' ? 'La date de naissance est requise' : 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = language === 'fr' ? 'Vous devez avoir au moins 18 ans' : 'You must be at least 18 years old';
      }
    }
    
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = language === 'fr' ? 'L\'adresse est requise' : 'Street address is required';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = language === 'fr' ? 'La ville est requise' : 'City is required';
    }
    
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = language === 'fr' ? 'L\'état/province est requis' : 'State/Province is required';
    }
    
    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = language === 'fr' ? 'Le code postal est requis' : 'Zip code is required';
    } else if (!/^\d{5}$/.test(formData.address.zipCode)) {
      newErrors['address.zipCode'] = language === 'fr' 
        ? 'Le code postal doit comporter exactement 5 chiffres' 
        : 'Zip code must be exactly 5 digits';
    }
    
    if (!formData.address.country.trim()) {
      newErrors['address.country'] = language === 'fr' ? 'Le pays est requis' : 'Country is required';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = language === 'fr' ? 'Vous devez accepter les conditions d\'utilisation' : 'You must agree to the terms and conditions';
    }
    
    return newErrors;
  };

  // Handle form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading || isSuccess) {
      return;
    }
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

      return;
    }
    try {

      setIsLoading(true);
      setErrors({});
      
      // Prepare user data for backend API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };

      const [result] = await Promise.all([
        register(userData),
        new Promise(resolve => setTimeout(resolve, 800)) 
      ]);

      // Check if component is still mounted before updating state
      if (!mountedRef.current) return;
      
      if (result.success) {
        setIsSuccess(true);
        
        // Check if component is still mounted
        if (!mountedRef.current) return;
        
        // Small post-success delay to let the UI show success/loading
        await new Promise((resolve) => setTimeout(resolve, 1800));

        // Get the most up-to-date user data from AuthContext or localStorage
        const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

        if (currentUser && currentUser.role === 'admin') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
        
      } else {

        if (mountedRef.current) {
          setIsLoading(false);
          setIsSuccess(false); 
          setErrors({ 
            general: result.message || 'Registration failed. Please try again.' 
          });
        }
      }
    } catch (error) {

      if (mountedRef.current) {
        setIsLoading(false);
        setIsSuccess(false); 
        const errorMessage = error.message || 'Registration failed. Please check your connection and try again.';
        setErrors({ 
          general: errorMessage
        });
      }
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (!loading && isLoading && !isSuccess) {

      setIsLoading(false);
    }
  }, [loading, isLoading, isSuccess]);

  // Common Input Styling
  const inputClassName = (name) => `w-full bg-black/40 border ${
    errors[name] ? 'border-red-500' : 'border-cyan-900/40'
  } rounded-md px-4 h-12 text-white 
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50
    font-['Orbitron'] 
    text-sm
    transition-all duration-300
    group-hover:border-cyan-400/30
    group-hover:bg-black/60
    placeholder-gray-500
    shadow-inner shadow-cyan-900/5`;

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      
      {/* Form Loading Overlay */}
      {(isLoading || isSuccess) && (
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[50]"
          style={{ 
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div className="text-center p-8 bg-black/80 rounded-xl border border-cyan-500/30 shadow-2xl backdrop-blur-sm">
            {!isSuccess ? (
              <>
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 mb-6"></div>
                <p className="text-cyan-300 font-medium text-xl mb-2">
                  {language === 'fr' ? 'Création de votre compte...' : 'Creating your account...'}
                </p>
                <p className="text-gray-400 text-base">
                  {language === 'fr' ? 'Veuillez patienter' : 'Please wait'}
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center h-20 w-20 bg-green-500/20 rounded-full mb-6">
                  <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-green-300 font-medium text-xl mb-2">
                  {language === 'fr' ? 'Compte créé avec succès!' : 'Account created successfully!'}
                </p>
                <p className="text-gray-400 text-base">
                  {language === 'fr' ? 'Redirection en cours...' : 'Redirecting...'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
          tabIndex={-1}
          aria-hidden="true"
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={assets.hero.loginbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content */}
      <div 
        className={`relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-10 transition-opacity duration-300 ${
          (isLoading || isSuccess) ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="w-full max-w-xl bg-gradient-to-b from-black/90 via-black/80 to-black/90 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-cyan-900/20 relative z-10 animate-fade-in-up overflow-hidden">
          
          {/* Glowing Borders */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          
          {/* Form Header */}
          <div className="text-center mb-8 relative">
            <h1 className="text-3xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 uppercase">
              {t('createYourAccount')}
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-['Orbitron']">
              {t('joinPremiumService')}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-md text-center animate-fade-in">
              <p className="text-red-300">{errors.general}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate className="animate-fade-in relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('firstName')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('enterFirstName')}
                    className={inputClassName('firstName')}
                    autoComplete="off"
                    disabled={isLoading || isSuccess}
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('lastName')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t('enterLastName')}
                    className={inputClassName('lastName')}
                    autoComplete="off"
                    disabled={isLoading || isSuccess}
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('emailAddress')}</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('enterEmail')}
                  className={inputClassName('email')}
                  autoComplete="off"
                  disabled={isLoading || isSuccess}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('enterPassword')}
                    className={inputClassName('password')}
                    autoComplete="off"
                    disabled={isLoading || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 focus:outline-none cursor-pointer"
                    disabled={isLoading || isSuccess}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('confirmPassword')}</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('confirmYourPassword')}
                    className={inputClassName('confirmPassword')}
                    autoComplete="off"
                    disabled={isLoading || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 focus:outline-none cursor-pointer"
                    disabled={isLoading || isSuccess}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mb-6 group">
              <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('phoneNumber')}</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t('enterPhoneNumber')}
                  className={inputClassName('phoneNumber')}
                  autoComplete="off"
                  disabled={isLoading || isSuccess}
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="mb-6 group">
              <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">
                {language === 'fr' ? 'Date de naissance' : 'Date of Birth'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputClassName('dateOfBirth')}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  disabled={isLoading || isSuccess}
                />
              </div>
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-cyan-300 mb-4">
                {language === 'fr' ? 'Adresse' : 'Address'}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">
                    {language === 'fr' ? 'Adresse' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder={language === 'fr' ? 'Entrez votre adresse' : 'Enter your street address'}
                    className={inputClassName('address.street')}
                    disabled={isLoading || isSuccess}
                  />
                  {errors['address.street'] && <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">
                      {language === 'fr' ? 'Ville' : 'City'}
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder={language === 'fr' ? 'Ville' : 'City'}
                      className={inputClassName('address.city')}
                      disabled={isLoading || isSuccess}
                    />
                    {errors['address.city'] && <p className="text-red-500 text-xs mt-1">{errors['address.city']}</p>}
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">
                      {language === 'fr' ? 'État/Province' : 'State/Province'}
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder={language === 'fr' ? 'État/Province' : 'State/Province'}
                      className={inputClassName('address.state')}
                      disabled={isLoading || isSuccess}
                    />
                    {errors['address.state'] && <p className="text-red-500 text-xs mt-1">{errors['address.state']}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">
                      {language === 'fr' ? 'Code postal' : 'Zip Code'}
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      placeholder={language === 'fr' ? 'Code postal' : 'Zip Code'}
                      className={inputClassName('address.zipCode')}
                      maxLength={5}
                      inputMode="numeric"
                      title={language === 'fr' ? 'Veuillez saisir exactement 5 chiffres' : 'Please enter exactly 5 digits'}
                      disabled={isLoading || isSuccess}
                    />
                    {errors['address.zipCode'] && <p className="text-red-500 text-xs mt-1">{errors['address.zipCode']}</p>}
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">
                      {language === 'fr' ? 'Pays' : 'Country'}
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder={language === 'fr' ? 'Pays' : 'Country'}
                      className={inputClassName('address.country')}
                      disabled={isLoading || isSuccess}
                    />
                    {errors['address.country'] && <p className="text-red-500 text-xs mt-1">{errors['address.country']}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 bg-transparent border-cyan-800 rounded focus:ring-cyan-500 text-cyan-500 cursor-pointer"
                    disabled={isLoading || isSuccess}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-300 hover:text-cyan-300 transition-colors duration-300">
                    {t('agreeToTerms')}
                  </label>
                </div>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full px-6 py-3.5 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white rounded-md transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10"></span>
              
              {isLoading ? (language === 'fr' ? 'Création...' : 'Creating...') : t('signUp')}
            </button>

            {/* Link to Login */}
            <div className="text-center mt-8 relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent -z-10"></div>
              <span className="px-4 bg-black/60 backdrop-blur-sm relative inline-block">
                <p className="text-sm text-gray-400">
                  {t('alreadyHaveAccount')} 
                  <Link to="/login" className="ml-2 text-cyan-400 hover:text-white transition-colors duration-300 relative group cursor-pointer">
                    {t('signIn')}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </span>
            </div>
          </form>
        </div>
      </div>
      
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>


    </div>
  );
};

export default RegisterPage;