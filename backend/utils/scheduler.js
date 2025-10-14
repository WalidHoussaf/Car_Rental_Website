import cron from 'node-cron';
import BookingStatusService from '../services/bookingStatusService.js';
import logger from './logger.js';

/**
 * Scheduler for automatic booking status updates
 */
class BookingScheduler {
  static init() {
    // Run every 5 minutes to check and update booking statuses
    cron.schedule('*/5 * * * *', async () => {
      logger.debug('Running scheduled booking status update...');
      await BookingStatusService.updateBookingStatuses();
    });

    // Run every hour for more comprehensive checks
    cron.schedule('0 * * * *', async () => {
      logger.info('Running hourly booking status comprehensive check...');
      const result = await BookingStatusService.updateBookingStatuses();
      if (result.updatedCount > 0) {
        logger.info('Hourly update completed', {
          confirmedToActive: result.confirmedToActive,
          activeToCompleted: result.activeToCompleted
        });
      }
    });

    // Run at midnight for daily cleanup
    cron.schedule('0 0 * * *', async () => {
      logger.info('Running daily booking status cleanup...');
      const result = await BookingStatusService.updateBookingStatuses();
      logger.info('Daily cleanup completed', { updatedCount: result.updatedCount });
    });

    logger.info('Booking status scheduler initialized');
    logger.info('   - Every 5 minutes: Status updates');
    logger.info('   - Every hour: Comprehensive check');
    logger.info('   - Daily at midnight: Cleanup');
  }

  static async runManualUpdate() {
    logger.info('Running manual booking status update...');
    return await BookingStatusService.updateBookingStatuses();
  }
}

export default BookingScheduler;
