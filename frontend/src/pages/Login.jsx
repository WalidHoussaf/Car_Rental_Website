import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';

const LoginPage = () => {
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
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80" />
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
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Login Form Card */}
        <div className="w-full max-w-md bg-black/80 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-gray-800 relative">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-regular mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-gray-400">
              Welcome Back
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              Sign in to access your account
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-md text-center">
              <p className="text-green-400">Login successful! Redirecting...</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <div className="relative w-full mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`w-full bg-black/80 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 h-11 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    font-['Orbitron'] 
                    text-sm
                    transition-all duration-300
                    hover:border-blue-500
                    hover:bg-black/90`}
                  autoComplete="off"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative w-full mb-4">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full bg-black/80 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-md px-4 h-11 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    font-['Orbitron'] 
                    text-sm
                    transition-all duration-300
                    hover:border-blue-500
                    hover:bg-black/90`}
                  autoComplete="off"
                />
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
                    className="w-4 h-4 bg-black border-gray-600 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-500 hover:to-gray-500 rounded-md transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Social Login Buttons */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-800/50 rounded-lg shadow-xl bg-black/70 backdrop-blur-lg text-sm font-medium text-gray-300 transition-all duration-300 hover:shadow-blue-900/20 transform hover:scale-105 cursor-pointer"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.676-4.203-2.707-6.735-2.707-5.522 0-10.002 4.48-10.002 10.002s4.48 10.002 10.002 10.002c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.083z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-800/50 rounded-lg shadow-xl bg-black/70 backdrop-blur-lg text-sm font-medium text-gray-300 transition-all duration-300 hover:shadow-blue-900/20 transform hover:scale-105 cursor-pointer"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300">
                Create an account
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

export default LoginPage;