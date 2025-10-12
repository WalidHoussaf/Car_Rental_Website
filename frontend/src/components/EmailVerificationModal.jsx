import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerificationModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  const handleResendEmail = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
            <h3 className="text-cyan-300 font-['Orbitron'] text-lg font-semibold tracking-wide">Email Verification Required</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center rounded-lg border border-transparent hover:border-cyan-600/40 hover:bg-cyan-600/10 transition-all duration-200 group cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium font-['Orbitron']">Verify Your Email</div>
              <div className="text-gray-400 text-sm font-['Rationale']">Action Required</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-300 font-['Orbitron'] text-sm leading-relaxed">
              Please verify your email address before making a booking.
            </p>
            <p className="text-gray-400 font-['Rationale'] text-sm leading-relaxed">
              We've sent a verification link to your email inbox. Click the link to verify your account and start booking your dream car.
            </p>
            <div className="flex items-start gap-2 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-cyan-300 text-xs font-['Rationale']">
                Didn't receive the email? Check your spam folder or request a new verification link from your profile page.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-black/30 border-t border-cyan-900/30">
          <button
            type="button"
            onClick={handleGoHome}
            className="px-4 py-2 text-sm font-['Orbitron'] text-gray-300 border border-gray-600/40 rounded-lg hover:bg-gray-600/10 hover:border-gray-500/50 transition-all duration-200 cursor-pointer"
          >
            Go to Home
          </button>
          <button
            type="button"
            onClick={handleResendEmail}
            className="px-4 py-2 text-sm font-['Orbitron'] text-white bg-gradient-to-r from-cyan-600/80 to-cyan-700/80 border border-cyan-500/50 rounded-lg hover:from-cyan-500/90 hover:to-cyan-600/90 hover:border-cyan-400/60 transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Resend Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
