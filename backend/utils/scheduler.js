import cron from 'node-cron';
import BookingStatusService from '../services/bookingStatusService.js';

/**
 * Scheduler for automatic booking status updates
 */
class BookingScheduler {
  static init() {
    // Run every 5 minutes to check and update booking statuses
    cron.schedule('*/5 * * * *', async () => {
      console.log('🔄 Running scheduled booking status update...');
      await BookingStatusService.updateBookingStatuses();
    });

    // Run every hour for more comprehensive checks
    cron.schedule('0 * * * *', async () => {
      console.log('🔄 Running hourly booking status comprehensive check...');
      const result = await BookingStatusService.updateBookingStatuses();
      if (result.updatedCount > 0) {
        console.log(`✅ Hourly update: ${result.confirmedToActive} confirmed→active, ${result.activeToCompleted} active→completed`);
      }
    });

    // Run at midnight for daily cleanup
    cron.schedule('0 0 * * *', async () => {
      console.log('🌙 Running daily booking status cleanup...');
      const result = await BookingStatusService.updateBookingStatuses();
      console.log(`📊 Daily cleanup: Updated ${result.updatedCount} bookings`);
    });

    console.log('⏰ Booking status scheduler initialized');
    console.log('   - Every 5 minutes: Status updates');
    console.log('   - Every hour: Comprehensive check');
    console.log('   - Daily at midnight: Cleanup');
  }

  static async runManualUpdate() {
    console.log('🔧 Running manual booking status update...');
    return await BookingStatusService.updateBookingStatuses();
  }
}

export default BookingScheduler;
