import BookingStatusService from '../services/bookingStatusService.js';

/**
 * Middleware to automatically update booking statuses before processing requests
 */
export const updateBookingStatuses = async (req, res, next) => {
  try {
    // Run status updates in the background (don't wait for completion)
    BookingStatusService.updateBookingStatuses().catch(error => {
      console.error('Background booking status update failed:', error);
    });
    
    next();
  } catch (error) {
    console.error('Booking status middleware error:', error);
    next(); // Continue even if status update fails
  }
};

/**
 * Middleware to update a specific booking's status when accessed
 */
export const updateSingleBookingStatus = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    if (bookingId) {
      // Update this specific booking's status in the background
      BookingStatusService.updateSingleBookingStatus(bookingId).catch(error => {
        console.error('Single booking status update failed:', error);
      });
    }
    
    next();
  } catch (error) {
    console.error('Single booking status middleware error:', error);
    next(); // Continue even if status update fails
  }
};
