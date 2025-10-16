import cron from 'node-cron';
import BackupService from '../services/backupService.js';
import logger from './logger.js';

class BackupScheduler {
  constructor() {
    // Create BackupService instance here (after env vars are loaded)
    this.backupService = new BackupService();
    this.jobs = new Map();
    this.enabled = process.env.BACKUP_ENABLED !== 'false';
    this.schedules = {
      daily: process.env.BACKUP_DAILY_SCHEDULE || '0 2 * * *', // 2 AM daily
      weekly: process.env.BACKUP_WEEKLY_SCHEDULE || '0 3 * * 0', // 3 AM Sunday
      monthly: process.env.BACKUP_MONTHLY_SCHEDULE || '0 4 1 * *', // 4 AM 1st of month
    };
  }

  /**
   * Initialize and start all scheduled backup jobs
   */
  async initialize() {
    if (!this.enabled) {
      logger.info('Backup scheduler is disabled');
      return;
    }

    try {
      // Initialize backup service
      await this.backupService.initialize();

      // Schedule daily backups
      if (process.env.BACKUP_DAILY_ENABLED !== 'false') {
        this.scheduleDailyBackup();
      }

      // Schedule weekly backups
      if (process.env.BACKUP_WEEKLY_ENABLED === 'true') {
        this.scheduleWeeklyBackup();
      }

      // Schedule monthly backups
      if (process.env.BACKUP_MONTHLY_ENABLED === 'true') {
        this.scheduleMonthlyBackup();
      }

      // Schedule custom interval if specified
      const customSchedule = process.env.BACKUP_CUSTOM_SCHEDULE;
      if (customSchedule) {
        this.scheduleCustomBackup(customSchedule);
      }

      logger.info('Backup scheduler initialized successfully');
      this.logSchedules();
    } catch (error) {
      logger.error('Failed to initialize backup scheduler:', error);
      throw error;
    }
  }

  /**
   * Schedule daily backups
   */
  scheduleDailyBackup() {
    const schedule = this.schedules.daily;
    
    if (!cron.validate(schedule)) {
      logger.error(`Invalid daily backup schedule: ${schedule}`);
      return;
    }

    const job = cron.schedule(schedule, async () => {
      try {
        logger.info('Starting scheduled daily backup...');
        const backup = await this.backupService.createBackup({
          name: `daily-backup-${new Date().toISOString().split('T')[0]}`
        });
        logger.info(`Daily backup completed: ${backup.name} (${backup.sizeFormatted})`);
      } catch (error) {
        logger.error('Daily backup failed:', error);
        await this.notifyBackupFailure('daily', error);
      }
    });

    this.jobs.set('daily', job);
    logger.info(`Daily backup scheduled: ${schedule}`);
  }

  /**
   * Schedule weekly backups
   */
  scheduleWeeklyBackup() {
    const schedule = this.schedules.weekly;
    
    if (!cron.validate(schedule)) {
      logger.error(`Invalid weekly backup schedule: ${schedule}`);
      return;
    }

    const job = cron.schedule(schedule, async () => {
      try {
        logger.info('Starting scheduled weekly backup...');
        const backup = await this.backupService.createBackup({
          name: `weekly-backup-${new Date().toISOString().split('T')[0]}`
        });
        logger.info(`Weekly backup completed: ${backup.name} (${backup.sizeFormatted})`);
      } catch (error) {
        logger.error('Weekly backup failed:', error);
        await this.notifyBackupFailure('weekly', error);
      }
    });

    this.jobs.set('weekly', job);
    logger.info(`Weekly backup scheduled: ${schedule}`);
  }

  /**
   * Schedule monthly backups
   */
  scheduleMonthlyBackup() {
    const schedule = this.schedules.monthly;
    
    if (!cron.validate(schedule)) {
      logger.error(`Invalid monthly backup schedule: ${schedule}`);
      return;
    }

    const job = cron.schedule(schedule, async () => {
      try {
        logger.info('Starting scheduled monthly backup...');
        const backup = await this.backupService.createBackup({
          name: `monthly-backup-${new Date().toISOString().split('T')[0]}`
        });
        logger.info(`Monthly backup completed: ${backup.name} (${backup.sizeFormatted})`);
      } catch (error) {
        logger.error('Monthly backup failed:', error);
        await this.notifyBackupFailure('monthly', error);
      }
    });

    this.jobs.set('monthly', job);
    logger.info(`Monthly backup scheduled: ${schedule}`);
  }

  /**
   * Schedule custom interval backup
   */
  scheduleCustomBackup(schedule) {
    if (!cron.validate(schedule)) {
      logger.error(`Invalid custom backup schedule: ${schedule}`);
      return;
    }

    const job = cron.schedule(schedule, async () => {
      try {
        logger.info('Starting scheduled custom backup...');
        const backup = await this.backupService.createBackup({
          name: `custom-backup-${new Date().toISOString().split('T')[0]}`
        });
        logger.info(`Custom backup completed: ${backup.name} (${backup.sizeFormatted})`);
      } catch (error) {
        logger.error('Custom backup failed:', error);
        await this.notifyBackupFailure('custom', error);
      }
    });

    this.jobs.set('custom', job);
    logger.info(`Custom backup scheduled: ${schedule}`);
  }

  /**
   * Trigger manual backup
   */
  async triggerManualBackup(name) {
    try {
      logger.info('Starting manual backup...');
      const backup = await this.backupService.createBackup({
        name: name || `manual-backup-${new Date().toISOString().split('T')[0]}`
      });
      logger.info(`Manual backup completed: ${backup.name} (${backup.sizeFormatted})`);
      return backup;
    } catch (error) {
      logger.error('Manual backup failed:', error);
      throw error;
    }
  }

  /**
   * Stop a specific scheduled job
   */
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      this.jobs.delete(jobName);
      logger.info(`Backup job stopped: ${jobName}`);
      return true;
    }
    return false;
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    for (const [name, job] of this.jobs) {
      job.stop();
      logger.info(`Backup job stopped: ${name}`);
    }
    this.jobs.clear();
    logger.info('All backup jobs stopped');
  }

  /**
   * Get status of all scheduled jobs
   */
  getStatus() {
    const jobs = [];
    
    for (const [name, job] of this.jobs) {
      jobs.push({
        name,
        schedule: this.schedules[name] || 'custom',
        running: true
      });
    }

    return {
      enabled: this.enabled,
      jobs,
      totalJobs: this.jobs.size
    };
  }

  /**
   * Log all active schedules
   */
  logSchedules() {
    logger.info('Active backup schedules:');
    for (const [name, schedule] of Object.entries(this.schedules)) {
      if (this.jobs.has(name)) {
        logger.info(`  - ${name}: ${schedule}`);
      }
    }
  }

  /**
   * Notify about backup failure
   */
  async notifyBackupFailure(type, error) {
    logger.error(`BACKUP FAILURE ALERT: ${type} backup failed`, {
      type,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Health check for backup system
   */
  async healthCheck() {
    try {
      const stats = await this.backupService.getStats();
      const now = Date.now();
      const lastBackupTime = stats.lastBackup ? new Date(stats.lastBackup).getTime() : 0;
      const hoursSinceLastBackup = (now - lastBackupTime) / (1000 * 60 * 60);

      // Alert if no backup in last 25 hours (daily backup should run every 24h)
      const healthy = hoursSinceLastBackup < 25 || stats.totalBackups === 0;

      return {
        healthy,
        lastBackup: stats.lastBackup,
        hoursSinceLastBackup: Math.round(hoursSinceLastBackup * 10) / 10,
        totalBackups: stats.totalBackups,
        failedBackups: stats.failedBackups,
        successRate: stats.totalBackups > 0 
          ? Math.round((stats.successfulBackups / stats.totalBackups) * 100) 
          : 100,
        message: healthy 
          ? 'Backup system is healthy' 
          : 'Warning: No recent backups detected'
      };
    } catch (error) {
      logger.error('Backup health check failed:', error);
      return {
        healthy: false,
        error: error.message,
        message: 'Backup system health check failed'
      };
    }
  }
}

// Export the class, instance will be created in server.js after env vars are loaded
export default BackupScheduler;
