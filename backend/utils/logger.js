import pino from 'pino';

/**
 * Pino Logger Configuration
 * High-performance JSON logger for Node.js
 * 
 * Features:
 * - Fast and low overhead
 * - Structured JSON logging
 * - Pretty printing in development
 * - Silent in test environment
 */

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';

// Configure Pino logger options
const pinoOptions = {
  // Set log level based on environment
  level: isTest ? 'silent' : (process.env.LOG_LEVEL || 'info'),
  
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
  
  // Redact sensitive information
  redact: {
    paths: ['password', 'token', 'accessToken', 'refreshToken', 'JWT_SECRET'],
    remove: true
  },
  
  // Serializers for common objects
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
};

// Only add pretty print transport in development (not in test or production)
if (isDevelopment) {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      singleLine: false,
    }
  };
}

// Create logger instance
const logger = pino(pinoOptions);

// Add custom methods for backward compatibility
logger.raw = (message) => {
  if (!isTest) {
    console.log(message);
  }
};

export default logger;
