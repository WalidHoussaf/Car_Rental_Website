import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../config/api';
import { assets } from '../assets/assets';
import { useAuth } from '../hooks/useAuth';
import logger from '../utils/logger';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshAccessToken } = useAuth();
  const [status, setStatus] = useState('verifying'); 
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent double execution
      if (!token || hasVerified.current) {
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link. No token provided.');
        }
        return;
      }

      hasVerified.current = true;

      try {
        const data = await api.auth.verifyEmail(token);

        if (data.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Refresh user data to get updated verification status
          await refreshAccessToken();
          
          setTimeout(() => {
            // Check auth status at redirect time, not at mount time
            const currentUser = data.data?.user;
            const isLoggedIn = isAuthenticated || !!currentUser;
            
            if (isLoggedIn) {
              const userRole = currentUser?.role || user?.role;
              if (userRole === 'admin') {
                navigate('/dashboard');
              } else {
                navigate('/profile');
              }
            } else {
              navigate('/login');
            }
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Email verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification. Please try again.');
        logger.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [token, navigate, isAuthenticated, user, refreshAccessToken]);

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />
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
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-gradient-to-b from-black/90 via-black/80 to-black/90 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-cyan-900/20 relative z-10 animate-fade-in-up overflow-hidden">
        
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          
          {/* Content */}
          <div className="text-center">
            {status === 'verifying' && (
              <>
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 mb-6"></div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 uppercase">
                  Verifying Email
                </h1>
                <p className="text-gray-300">Please wait while we verify your email address...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="inline-flex items-center justify-center h-20 w-20 bg-green-500/20 rounded-full mb-6">
                  <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 uppercase">
                  Email Verified!
                </h1>
                <p className="text-gray-300 mb-4">{message}</p>
                <p className="text-sm text-gray-400">
                  {isAuthenticated && user 
                    ? (user.role === 'admin' ? 'Redirecting to dashboard...' : 'Redirecting to profile...') 
                    : 'Redirecting to login page...'}
                </p>
                <div className="mt-6">
                  {isAuthenticated && user ? (
                    <Link
                      to={user.role === 'admin' ? '/dashboard' : '/profile'}
                      className="inline-block px-6 py-3 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white rounded-md transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                      {user.role === 'admin' ? 'Go to Dashboard' : 'Go to Profile'}
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-block px-6 py-3 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white rounded-md transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                      Go to Login
                    </Link>
                  )}
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="inline-flex items-center justify-center h-20 w-20 bg-red-500/20 rounded-full mb-6">
                  <svg className="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 uppercase">
                  Verification Failed
                </h1>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-6 py-3 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white rounded-md transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                  >
                    Go to Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-6 py-3 text-base font-medium text-cyan-400 border border-cyan-400 hover:bg-cyan-400/10 rounded-md transform transition-all duration-300"
                  >
                    Register Again
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
