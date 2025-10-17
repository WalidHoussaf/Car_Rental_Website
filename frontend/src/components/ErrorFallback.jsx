import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * Error Fallback UI Component
 * Displays a user-friendly error message when an error boundary catches an error
 */
const ErrorFallback = ({ error, resetError, level = 'page' }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (resetError) resetError();
    navigate('/');
  };

  const handleGoBack = () => {
    if (resetError) resetError();
    navigate(-1);
  };

  const handleRefresh = () => {
    if (resetError) resetError();
    window.location.reload();
  };

  // Different UI based on error level
  const isAppLevel = level === 'app';
  const isPageLevel = level === 'page';
  const isComponentLevel = level === 'component';

  return (
    <div className={`flex items-center justify-center ${isAppLevel ? 'min-h-screen' : isPageLevel ? 'min-h-screen' : 'min-h-[300px]'} bg-black p-4 font-['Orbitron']`}>
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 p-8 md:p-12">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-full border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/50">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white via-cyan-300 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
            {isAppLevel ? 'System Error' : isComponentLevel ? 'Component Error' : 'Page Error'}
          </h1>

          {/* Error Description */}
          <p className="text-gray-300 text-center mb-8 text-base md:text-lg">
            {isAppLevel 
              ? "We're sorry, but something unexpected happened. Our team has been notified and we're working on a fix."
              : isComponentLevel
              ? "A component on this page encountered an error. You can try refreshing or continue using other parts of the app."
              : "This page encountered an error. Don't worry, you can try refreshing or go back to continue."}
          </p>

          {/* Error Details (Development Only) */}
          {import.meta.env.MODE === 'development' && error && (
            <div className="mb-8 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wide">
                Error Details (Development Only):
              </h3>
              <p className="text-xs text-cyan-100 font-mono break-all">
                {error.toString()}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">
                    View Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="group relative px-6 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black rounded-md font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
              <span className="relative z-10 uppercase tracking-wide">Refresh</span>
            </button>

            {/* Go Back Button (not for app-level errors) */}
            {!isAppLevel && (
              <button
                onClick={handleGoBack}
                className="group relative px-6 py-3 bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/50 rounded-md font-semibold shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="uppercase tracking-wide">Go Back</span>
              </button>
            )}

            {/* Go Home Button */}
            <button
              onClick={handleGoHome}
              className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white border border-cyan-400/50 rounded-md font-semibold shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="uppercase tracking-wide">Home</span>
            </button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-400 mt-8">
            If this problem persists, please{' '}
            <a
              href="/contact"
              className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
