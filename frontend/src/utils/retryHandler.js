/**
 * Retry Handler Utility
 * Implements exponential backoff for handling rate limiting (429) and transient errors
 */

import logger from './logger';

/**
 * Configuration for retry behavior
 */
const RETRY_CONFIG = {
  maxRetries: 3,              // Maximum number of retry attempts
  initialDelayMs: 1000,       // Initial delay: 1 second
  maxDelayMs: 10000,          // Maximum delay: 10 seconds
  backoffMultiplier: 2,       // Exponential backoff multiplier
  jitterFactor: 0.1,          // Random jitter to prevent thundering herd (10%)
  retryableStatusCodes: [429, 408, 500, 502, 503, 504], // HTTP status codes that should trigger retry
};

/**
 * Calculate delay with exponential backoff and jitter
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
const calculateDelay = (attempt) => {
  // Exponential backoff: delay = initialDelay * (multiplier ^ attempt)
  const exponentialDelay = RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  
  // Cap at maximum delay
  const cappedDelay = Math.min(exponentialDelay, RETRY_CONFIG.maxDelayMs);
  
  // Add random jitter to prevent thundering herd problem
  // Jitter range: ±10% of the delay
  const jitter = cappedDelay * RETRY_CONFIG.jitterFactor * (Math.random() * 2 - 1);
  
  return Math.round(cappedDelay + jitter);
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if an error is retryable
 * @param {Error} error - Error object
 * @param {Response} response - Fetch response object
 * @returns {boolean}
 */
const isRetryableError = (error, response) => {
  // Network errors (no response)
  if (!response) {
    return true;
  }
  
  // Check if status code is retryable
  return RETRY_CONFIG.retryableStatusCodes.includes(response.status);
};

/**
 * Extract Retry-After header value in milliseconds
 * @param {Response} response - Fetch response object
 * @returns {number|null} Delay in milliseconds or null
 */
const getRetryAfterDelay = (response) => {
  if (!response || !response.headers) return null;
  
  const retryAfter = response.headers.get('Retry-After');
  if (!retryAfter) return null;
  
  // Retry-After can be in seconds (number) or HTTP date
  const retryAfterSeconds = parseInt(retryAfter, 10);
  
  if (!isNaN(retryAfterSeconds)) {
    // It's a number of seconds
    return retryAfterSeconds * 1000;
  }
  
  // Try to parse as HTTP date
  const retryAfterDate = new Date(retryAfter);
  if (!isNaN(retryAfterDate.getTime())) {
    const delayMs = retryAfterDate.getTime() - Date.now();
    return Math.max(0, delayMs);
  }
  
  return null;
};

/**
 * Retry a fetch request with exponential backoff
 * @param {Function} fetchFn - Function that returns a fetch promise
 * @param {Object} options - Retry options
 * @returns {Promise<Response>}
 */
export const retryWithBackoff = async (fetchFn, options = {}) => {
  const maxRetries = options.maxRetries ?? RETRY_CONFIG.maxRetries;
  let lastError;
  let lastResponse;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Execute the fetch function
      const response = await fetchFn();
      
      // If successful, return immediately
      if (response.ok) {
        if (attempt > 0) {
          logger.info(`Request succeeded after ${attempt} retry attempt(s)`);
        }
        return response;
      }
      
      // Store response for potential retry decision
      lastResponse = response;
      
      // Check if we should retry this error
      if (attempt < maxRetries && isRetryableError(null, response)) {
        // Determine delay
        let delay;
        
        if (response.status === 429) {
          // For rate limiting, respect Retry-After header if present
          delay = getRetryAfterDelay(response) || calculateDelay(attempt);
          logger.warn(`Rate limited (429). Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        } else {
          // For other retryable errors, use exponential backoff
          delay = calculateDelay(attempt);
          logger.warn(`Request failed with status ${response.status}. Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        }
        
        // Wait before retrying
        await sleep(delay);
        continue;
      }
      
      // Not retryable or max retries reached, return the response
      return response;
      
    } catch (error) {
      lastError = error;
      
      // Network error or fetch failure
      if (attempt < maxRetries) {
        const delay = calculateDelay(attempt);
        logger.warn(`Network error: ${error.message}. Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      
      // Max retries reached, throw the error
      logger.error(`Request failed after ${maxRetries} retry attempts:`, error);
      throw error;
    }
  }
  
  // If we get here, we've exhausted retries
  if (lastResponse) {
    return lastResponse;
  }
  
  throw lastError || new Error('Request failed after maximum retry attempts');
};

/**
 * Create a retry-enabled fetch wrapper
 * @param {string} url - URL to fetch
 * @param {RequestInit} config - Fetch configuration
 * @param {Object} retryOptions - Retry options
 * @returns {Promise<Response>}
 */
export const fetchWithRetry = async (url, config = {}, retryOptions = {}) => {
  return retryWithBackoff(() => fetch(url, config), retryOptions);
};

/**
 * Check if an error is a rate limit error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isRateLimitError = (error) => {
  return error?.message?.includes('429') || 
         error?.message?.toLowerCase().includes('rate limit') ||
         error?.message?.toLowerCase().includes('too many requests');
};

/**
 * Get user-friendly rate limit message
 * @param {number} retryAfterMs - Milliseconds until retry is allowed
 * @returns {string}
 */
export const getRateLimitMessage = (retryAfterMs) => {
  if (!retryAfterMs) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  const seconds = Math.ceil(retryAfterMs / 1000);
  
  if (seconds < 60) {
    return `Too many requests. Please wait ${seconds} second${seconds !== 1 ? 's' : ''} and try again.`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  return `Too many requests. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} and try again.`;
};

export default {
  retryWithBackoff,
  fetchWithRetry,
  isRateLimitError,
  getRateLimitMessage,
  calculateDelay,
};
