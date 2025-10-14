import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

// Import routes
import authRoutes from './routes/auth.js';
import carRoutes from './routes/cars.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';

// Import scheduler
import BookingScheduler from './utils/scheduler.js';

// Import logger
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', { missing: missingEnvVars });
  logger.error('Please create a .env file based on .env.example');
  process.exit(1);
}

// Validate JWT_SECRET strength 
if (process.env.JWT_SECRET.length < 64) {
  logger.error('SECURITY ERROR: JWT_SECRET must be at least 64 characters!', { length: process.env.JWT_SECRET.length });
  logger.error('Generate a secure secret: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

if (process.env.JWT_SECRET === 'your_super_secure_jwt_secret_change_this_in_production') {
  logger.error('SECURITY ERROR: Please change the default JWT_SECRET!');
  process.exit(1);
}

const hasUpperCase = /[A-Z]/.test(process.env.JWT_SECRET);
const hasLowerCase = /[a-z]/.test(process.env.JWT_SECRET);
const hasNumbers = /[0-9]/.test(process.env.JWT_SECRET);
const hasSpecialChars = /[^A-Za-z0-9]/.test(process.env.JWT_SECRET);

if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
  logger.warn('WARNING: JWT_SECRET should contain uppercase, lowercase, and numbers for better security');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration (MUST be before rate limiting to ensure CORS headers on rate limit responses) 
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin 
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token']
}));

// HTTPS enforcement middleware (production only)
// Applied AFTER CORS to ensure CORS headers are set before redirect
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Check if request is already HTTPS
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      return next();
    }
    
    // Redirect HTTP to HTTPS
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    logger.info('Redirecting HTTP to HTTPS', { url: req.url });
    return res.redirect(301, httpsUrl);
  });
}

// General rate limiting (disabled in test environment)
// Applied AFTER CORS to ensure rate limit responses include CORS headers
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Stricter rate limiting for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Increased from 5 to 50 for development testing
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
  });

  // Apply stricter limits to auth routes
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
}

// Cookie parser middleware (MUST be before CSRF)
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// CSRF Protection (using cookies) - Disabled in test environment
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict'
  }
});

// Apply CSRF protection to state-changing routes 
if (process.env.NODE_ENV !== 'test') {
  // EXCLUDE auth routes (login/register) since they don't have cookies yet
  app.use('/api/auth', (req, res, next) => {
    // Skip CSRF for login and register endpoints
    if (req.path === '/login' || req.path === '/register') {
      return next();
    }
    // Apply CSRF to other auth routes (logout, profile updates, etc.)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return csrfProtection(req, res, next);
    }
    next();
  });

  app.use('/api/cars', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return csrfProtection(req, res, next);
    }
    next();
  });

  app.use('/api/bookings', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return csrfProtection(req, res, next);
    }
    next();
  });

  app.use('/api/users', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return csrfProtection(req, res, next);
    }
    next();
  });
}

// CSRF token endpoint (for frontend to get token)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ 
    success: true,
    csrfToken: req.csrfToken() 
  });
});

// Static files for uploads with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static('uploads'));

// Database connection (skip in test environment as tests handle their own connection)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental_db')
    .then(() => {
      logger.info('Connected to MongoDB');
      // Initialize booking scheduler after DB connection
      BookingScheduler.init();
    })
    .catch((error) => {
      logger.error('MongoDB connection error:', { error: error.message });
      process.exit(1);
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Car Rental API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Global error handler:', { message: error.message, stack: error.stack });
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Frontend URL: ${process.env.FRONTEND_URL}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}

export default app;
