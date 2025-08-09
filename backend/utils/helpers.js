import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Calculate booking total
export const calculateBookingTotal = (pricePerDay, startDate, endDate, extras = [], insurance = { price: 0 }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price * (extra.quantity || 1)), 0);
  const totalAmount = (pricePerDay * totalDays) + extrasTotal + insurance.price;
  
  return {
    totalDays,
    totalAmount,
    breakdown: {
      carRental: pricePerDay * totalDays,
      extras: extrasTotal,
      insurance: insurance.price
    }
  };
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Check if dates overlap
export const datesOverlap = (start1, end1, start2, end2) => {
  return start1 <= end2 && end1 >= start2;
};

// Generate booking reference number
export const generateBookingReference = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CR-${timestamp}-${random}`.toUpperCase();
};

// Validate age requirement
export const isValidAge = (dateOfBirth, minimumAge = 18) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minimumAge;
  }
  
  return age >= minimumAge;
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Calculate refund amount based on cancellation policy
export const calculateRefund = (totalAmount, startDate, cancellationDate = new Date()) => {
  const daysUntilStart = Math.ceil((new Date(startDate) - cancellationDate) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  if (daysUntilStart >= 7) {
    refundPercentage = 1.0; // 100% refund
  } else if (daysUntilStart >= 3) {
    refundPercentage = 0.5; // 50% refund
  } else if (daysUntilStart >= 1) {
    refundPercentage = 0.25; // 25% refund
  }
  
  return {
    refundAmount: totalAmount * refundPercentage,
    refundPercentage: refundPercentage * 100,
    daysUntilStart
  };
};
