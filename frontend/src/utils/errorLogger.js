/**
 * Error Logging Utility
 * Logs errors to console in development and can be extended to send to monitoring services in production
 */

import logger from './logger';

/**
 * Log error to monitoring service
 * @param {Error} error - The error object
 * @param {Object} errorInfo - Additional error information (componentStack, etc.)
 * @param {Object} context - Additional context (user info, page, etc.)
 */
export const logErrorToService = (error, errorInfo, context = {}) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context,
  };

  // Log to console in development
  if (import.meta.env.MODE === 'development') {
    logger.error('Error Boundary caught an error:', error);
    logger.error('Error Info:', errorInfo);
    logger.error('Context:', context);
  }

  // In production, send to monitoring service (e.g., Sentry, LogRocket, etc.)
  if (import.meta.env.MODE === 'production') {
    // Example: Send to external service
    // Sentry.captureException(error, { contexts: { react: errorInfo, custom: context } });
    
    // For now, log to console.error (always logged even in production)
    console.error('Production Error:', errorData);
    
    // You can also send to your own backend logging endpoint
    try {
      fetch('/api/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silently fail if logging endpoint is not available
      });
    } catch {
      // Silently fail
    }
  }
};

/**
 * Log warning to monitoring service
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 */
export const logWarning = (message, context = {}) => {
  const warningData = {
    message,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...context,
  };

  logger.warn(message, context);

  if (import.meta.env.MODE === 'production') {
    console.warn('Production Warning:', warningData);
  }
};

/**
 * Log info to monitoring service
 * @param {string} message - Info message
 * @param {Object} context - Additional context
 */
export const logInfo = (message, context = {}) => {
  logger.log(message, context);
};

export default {
  logErrorToService,
  logWarning,
  logInfo,
};
