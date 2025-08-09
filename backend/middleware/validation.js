import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-()]{7,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) {
        throw new Error('You must be at least 18 years old');
      }
      return true;
    }),
  

  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State/Province is required'),
  
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  
  body('address.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Car validation rules
export const validateCar = [
  body('make')
    .trim()
    .notEmpty()
    .withMessage('Car make is required'),
  
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Car model is required'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  
  body('category')
    .isIn(['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'convertible', 'van'])
    .withMessage('Please select a valid category'),
  
  body('transmission')
    .isIn(['manual', 'automatic'])
    .withMessage('Please select a valid transmission type'),
  
  body('fuelType')
    .isIn(['gasoline', 'diesel', 'hybrid', 'electric'])
    .withMessage('Please select a valid fuel type'),
  
  body('seats')
    .isInt({ min: 2, max: 9 })
    .withMessage('Number of seats must be between 2 and 9'),
  
  body('doors')
    .isInt({ min: 2, max: 5 })
    .withMessage('Number of doors must be between 2 and 5'),
  
  body('pricePerDay')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  
  body('licensePlate')
    .trim()
    .notEmpty()
    .withMessage('License plate is required'),
  
  body('mileage')
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  
  body('location.branch')
    .trim()
    .notEmpty()
    .withMessage('Branch location is required'),
  
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
];

// Booking validation rules
export const validateBooking = [
  body('car')
    .isMongoId()
    .withMessage('Please provide a valid car ID'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('pickupLocation.branch')
    .trim()
    .notEmpty()
    .withMessage('Pickup branch is required'),
  
  body('dropoffLocation.branch')
    .trim()
    .notEmpty()
    .withMessage('Dropoff branch is required'),
  
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'cash'])
    .withMessage('Please select a valid payment method')
];

// Query validation
export const validateCarSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('category')
    .optional()
    .isIn(['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'convertible', 'van'])
    .withMessage('Please select a valid category')
];

// Parameter validation
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid ID')
];
