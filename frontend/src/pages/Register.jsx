import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';

const RegisterPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeTerms: false
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
          agreeTerms: false
        });
        setIsSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Common input styling
  const inputClassName = (name) => `w-full bg-black/80 border ${
    errors[name] ? 'border-red-500' : 'border-gray-800/50'
  } rounded-md px-4 h-11 text-white 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    font-['Orbitron'] 
    text-sm
    transition-all duration-300
    hover:border-blue-400
    hover:bg-black/90
    transform hover:scale-102`;

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src={assets.hero.loginbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Animated light beams - matching HeroSection */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-blue-400 blur-xl transform -skew-x-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-purple-400 blur-xl transform skew-x-12 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Registration Form Card */}
        <div className="w-full max-w-xl bg-black/70 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-800/50 relative transform transition-all duration-500 hover:shadow-blue-900/20 animate-fade-in-up">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-regular mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-gray-400">
              Create Your Account
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-['Orbitron']">
              Join our premium car rental service today
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-md text-center animate-fade-in">
              <p className="text-green-400">Registration successful! Welcome aboard.</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-4 group">
                <label className="block text-sm font-medium text-gray-400 mb-1 group-hover:text-blue-400 transition-colors">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={inputClassName('firstName')}
                  autoComplete="off"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div className="mb-4 group">
                <label className="block text-sm font-medium text-gray-400 mb-1 group-hover:text-blue-400 transition-colors">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={inputClassName('lastName')}
                  autoComplete="off"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="mb-4 group">
              <label className="block text-sm font-medium text-gray-400 mb-1 group-hover:text-blue-400 transition-colors">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={inputClassName('email')}
                autoComplete="off"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-4 group">
                <label className="block text-sm font-medium text-gray-400 mb-1 group-hover:text-blue-400 transition-colors">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={inputClassName('password')}
                  autoComplete="off"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="mb-4 group">
                <label className="block text-sm font-medium text-gray-400 mb-1 group-hover:text-blue-400 transition-colors">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={inputClassName('confirmPassword')}
                  autoComplete="off"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mb-6 group">
              <label className="block text-sm font-medium text-gray-400 mb-1 group-hover:text-blue-400 transition-colors">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={inputClassName('phoneNumber')}
                autoComplete="off"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 bg-black border-gray-600 rounded focus:ring-blue-500 hover:border-blue-400 transition-colors"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                    I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Privacy Policy</a>
                  </label>
                  {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-500 hover:to-gray-500 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm font-['Orbitron']">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 animate-pulse"></div>
      </div>
    </div>
  );
};

export default RegisterPage;