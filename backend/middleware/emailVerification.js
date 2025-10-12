// Middleware to check if user's email is verified
export const requireEmailVerification = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if email is verified
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature',
      requiresVerification: true
    });
  }

  next();
};

// Optional verification check (warns but doesn't block)
export const optionalEmailVerification = (req, res, next) => {
  if (req.user && !req.user.isVerified) {
    // Add warning header but allow request to proceed
    res.setHeader('X-Email-Verification-Required', 'true');
  }
  next();
};

export default {
  requireEmailVerification,
  optionalEmailVerification
};
