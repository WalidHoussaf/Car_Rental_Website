import Booking from '../models/Booking.js';
import logger from '../utils/logger.js';

/**
 * Service to automatically update booking statuses based on dates
 */
class BookingStatusService {
  /**
   * Update booking statuses based on current date and time
   */
  static async updateBookingStatuses() {
    try {
      const now = new Date();
      let updatedCount = 0;

      // Update confirmed bookings to active when pickup date arrives
      const confirmedToActive = await Booking.updateMany(
        {
          status: 'confirmed',
          startDate: { $lte: now }
        },
        {
          $set: { status: 'active' }
        }
      );

      updatedCount += confirmedToActive.modifiedCount;

      // Update active bookings to completed when end date passes
      const activeToCompleted = await Booking.updateMany(
        {
          status: 'active',
          endDate: { $lt: now }
        },
        {
          $set: { status: 'completed' }
        }
      );

      updatedCount += activeToCompleted.modifiedCount;

      if (updatedCount > 0) {
        logger.info('Booking statuses updated automatically', { updatedCount });
      }

      return {
        success: true,
        updatedCount,
        confirmedToActive: confirmedToActive.modifiedCount,
        activeToCompleted: activeToCompleted.modifiedCount
      };
    } catch (error) {
      logger.error('Error updating booking statuses:', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get bookings that need status updates (for debugging/monitoring)
   */
  static async getBookingsNeedingUpdate() {
    try {
      const now = new Date();

      const confirmedBookings = await Booking.find({
        status: 'confirmed',
        startDate: { $lte: now }
      }).populate('car', 'name').populate('user', 'firstName lastName');

      const activeBookings = await Booking.find({
        status: 'active',
        endDate: { $lt: now }
      }).populate('car', 'name').populate('user', 'firstName lastName');

      return {
        confirmedToActive: confirmedBookings,
        activeToCompleted: activeBookings
      };
    } catch (error) {
      logger.error('Error getting bookings needing update:', { error: error.message });
      return {
        confirmedToActive: [],
        activeToCompleted: []
      };
    }
  }

  /**
   * Check and update a specific booking's status
   */
  static async updateSingleBookingStatus(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return { success: false, message: 'Booking not found' };
      }

      const now = new Date();
      let updated = false;
      let oldStatus = booking.status;

      // Check if confirmed booking should become active
      if (booking.status === 'confirmed' && booking.startDate <= now) {
        booking.status = 'active';
        updated = true;
      }
      // Check if active booking should become completed
      else if (booking.status === 'active' && booking.endDate < now) {
        booking.status = 'completed';
        updated = true;
      }

      if (updated) {
        await booking.save();
        logger.info('Booking status updated', { bookingId, oldStatus, newStatus: booking.status });
        return {
          success: true,
          updated: true,
          oldStatus,
          newStatus: booking.status
        };
      }

      return {
        success: true,
        updated: false,
        status: booking.status
      };
    } catch (error) {
      logger.error('Error updating single booking status:', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default BookingStatusService;
