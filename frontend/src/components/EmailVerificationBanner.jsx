import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../config/api';

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  // Don't show banner if user is verified or not logged in
  if (!user || user.isVerified || !showBanner) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setMessage('');

      const response = await api.auth.resendVerification();

      if (response.success) {
        setMessage('Verification email sent! Please check your inbox.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(response.message || 'Failed to send email');
      }
    } catch (error) {
      setMessage(error.message || 'Failed to send verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-yellow-500/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-100">
                Please verify your email address to access all features
              </p>
              {message && (
                <p className={`text-xs mt-1 ${message.includes('sent') ? 'text-green-300' : 'text-red-300'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Resend Email'
              )}
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 text-yellow-300 hover:text-yellow-100 transition-colors duration-200"
              aria-label="Close banner"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
