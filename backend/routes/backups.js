import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getBackupScheduler } from '../instances/backupScheduler.js';
import logger from '../utils/logger.js';

const router = express.Router();

// All backup routes require admin authentication
router.use(authenticateToken, requireAdmin);

/**
 * @route   POST /api/backups
 * @desc    Create a manual backup
 * @access  Admin only
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    logger.info(`Manual backup requested by admin: ${req.user.email}`);
    
    const backupScheduler = getBackupScheduler();
    const backup = await backupScheduler.triggerManualBackup(name);
    
    res.status(201).json({
      success: true,
      message: 'Backup created successfully',
      backup
    });
  } catch (error) {
    console.error('=== BACKUP ERROR ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', error);
    console.error('===================');
    
    logger.error('Failed to create backup:', { 
      message: error.message, 
      stack: error.stack,
      error: error 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/backups
 * @desc    List all available backups
 * @access  Admin only
 */
router.get('/', async (req, res) => {
  try {
    const backupScheduler = getBackupScheduler();
    const backups = await backupScheduler.backupService.listBackups();
    
    res.json({
      success: true,
      count: backups.length,
      backups
    });
  } catch (error) {
    logger.error('Failed to list backups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list backups',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/backups/stats
 * @desc    Get backup service statistics
 * @access  Admin only
 */
router.get('/stats', async (req, res) => {
  try {
    const backupScheduler = getBackupScheduler();
    const stats = await backupScheduler.backupService.getStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Failed to get backup stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get backup statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/backups/health
 * @desc    Check backup system health
 * @access  Admin only
 */
router.get('/health', async (req, res) => {
  try {
    const backupScheduler = getBackupScheduler();
    const health = await backupScheduler.healthCheck();
    
    res.json({
      success: true,
      health
    });
  } catch (error) {
    logger.error('Backup health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/backups/schedule
 * @desc    Get backup schedule status
 * @access  Admin only
 */
router.get('/schedule', async (req, res) => {
  try {
    const status = backupScheduler.getStatus();
    
    res.json({
      success: true,
      schedule: status
    });
  } catch (error) {
    logger.error('Failed to get schedule status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get schedule status',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/backups/:name/verify
 * @desc    Verify backup integrity
 * @access  Admin only
 */
router.get('/:name/verify', async (req, res) => {
  try {
    const { name } = req.params;
    
    const backupScheduler = getBackupScheduler();
    const verification = await backupScheduler.backupService.verifyBackup(name);
    
    res.json({
      success: true,
      verification
    });
  } catch (error) {
    logger.error('Backup verification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Backup verification failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/backups/:name/restore
 * @desc    Restore database from backup
 * @access  Admin only
 */
router.post('/:name/restore', async (req, res) => {
  try {
    const { name } = req.params;
    const { confirm } = req.body;
    
    // Require explicit confirmation
    if (confirm !== true) {
      return res.status(400).json({
        success: false,
        message: 'Restore operation requires explicit confirmation',
        hint: 'Send { "confirm": true } in request body'
      });
    }
    
    logger.warn(`Database restore initiated by admin: ${req.user.email} from backup: ${name}`);
    
    const backupScheduler = getBackupScheduler();
    const result = await backupScheduler.backupService.restoreBackup(name);
    
    logger.info(`Database restored successfully from: ${name}`);
    
    res.json({
      success: true,
      message: 'Database restored successfully',
      result
    });
  } catch (error) {
    logger.error('Failed to restore backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore backup',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/backups/:name
 * @desc    Delete a specific backup
 * @access  Admin only
 */
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    logger.info(`Backup deletion requested by admin: ${req.user.email} for backup: ${name}`);
    
    const backupScheduler = getBackupScheduler();
    const result = await backupScheduler.backupService.deleteBackup(name);
    
    res.json({
      success: true,
      message: 'Backup deleted successfully',
      result
    });
  } catch (error) {
    logger.error('Failed to delete backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete backup',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/backups/cleanup
 * @desc    Clean old backups based on retention policy
 * @access  Admin only
 */
router.post('/cleanup', async (req, res) => {
  try {
    logger.info(`Backup cleanup requested by admin: ${req.user.email}`);
    
    const backupScheduler = getBackupScheduler();
    const deleted = await backupScheduler.backupService.cleanOldBackups();
    
    res.json({
      success: true,
      message: `Cleaned ${deleted} old backup(s)`,
      deleted
    });
  } catch (error) {
    logger.error('Failed to clean backups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean backups',
      error: error.message
    });
  }
});

export default router;
