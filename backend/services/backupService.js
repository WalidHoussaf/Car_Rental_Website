import { exec } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BackupService {
  constructor() {
    this.backupDir = process.env.BACKUP_DIR || path.join(__dirname, '../backups');
    this.retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
    this.maxBackups = parseInt(process.env.BACKUP_MAX_COUNT) || 50;
    this.compressionEnabled = process.env.BACKUP_COMPRESSION !== 'false';
    this.encryptionEnabled = process.env.BACKUP_ENCRYPTION === 'true';
    this.encryptionKey = process.env.BACKUP_ENCRYPTION_KEY;
    
    // MongoDB connection details
    this.mongoUri = process.env.MONGODB_URI;
    logger.info(`Backup service MongoDB URI: ${this.mongoUri ? 'defined' : 'undefined'}`);
    this.dbName = this.extractDbName(this.mongoUri);
    
    // Backup statistics
    this.stats = {
      lastBackup: null,
      lastBackupSize: 0,
      totalBackups: 0,
      failedBackups: 0,
      successfulBackups: 0
    };
  }

  /**
   * Extract database name from MongoDB URI
   */
  extractDbName(uri) {
    try {
      if (!uri) {
        logger.warn('MongoDB URI is not defined, using default database name');
        return 'car_rental_db';
      }
      const match = uri.match(/\/([^/?]+)(\?|$)/);
      return match ? match[1] : 'car_rental_db';
    } catch (error) {
      logger.error('Error extracting database name:', error);
      return 'car_rental_db';
    }
  }

  /**
   * Initialize backup directory
   */
  async initialize() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      logger.info(`Backup service initialized. Directory: ${this.backupDir}`);
      
      // Load existing backup statistics
      await this.loadStats();
      
      return true;
    } catch (error) {
      logger.error('Failed to initialize backup service:', error);
      throw error;
    }
  }

  /**
   * Create a backup of the MongoDB database
   */
  async createBackup(options = {}) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = options.name || `backup-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);

    try {
      logger.info(`Starting backup: ${backupName}`);

      // Ensure backup directory exists
      await fs.mkdir(this.backupDir, { recursive: true });

      // Build mongodump command
      const dumpCommand = this.buildDumpCommand(backupPath);
      
      // Execute backup
      logger.info(`Executing: ${dumpCommand.replace(/mongodb:\/\/[^@]+@/, 'mongodb://***:***@')}`);
      const { stdout, stderr } = await execAsync(dumpCommand);
      
      if (stderr && !stderr.includes('done dumping')) {
        logger.warn('Backup stderr:', stderr);
      }

      // Get backup size
      const stats = await this.getDirectorySize(backupPath);
      const backupSize = stats.size;
      const duration = Date.now() - startTime;

      // Compress if enabled
      let finalPath = backupPath;
      let finalSize = backupSize;
      
      if (this.compressionEnabled) {
        finalPath = await this.compressBackup(backupPath);
        const compressedStats = await fs.stat(finalPath);
        finalSize = compressedStats.size;
        
        // Remove uncompressed backup
        await this.removeDirectory(backupPath);
      }

      // Encrypt if enabled
      if (this.encryptionEnabled && this.encryptionKey) {
        finalPath = await this.encryptBackup(finalPath);
        const encryptedStats = await fs.stat(finalPath);
        finalSize = encryptedStats.size;
      }

      // Update statistics
      this.stats.lastBackup = new Date();
      this.stats.lastBackupSize = finalSize;
      this.stats.totalBackups++;
      this.stats.successfulBackups++;
      await this.saveStats();

      // Create backup metadata
      const metadata = {
        name: backupName,
        timestamp: new Date().toISOString(),
        size: finalSize,
        sizeFormatted: this.formatBytes(finalSize),
        duration: duration,
        compressed: this.compressionEnabled,
        encrypted: this.encryptionEnabled,
        database: this.dbName,
        path: finalPath
      };

      await this.saveMetadata(backupName, metadata);

      logger.info(`Backup completed successfully: ${backupName} (${metadata.sizeFormatted}, ${duration}ms)`);

      // Clean old backups
      await this.cleanOldBackups();

      return metadata;
    } catch (error) {
      this.stats.failedBackups++;
      await this.saveStats();
      
      logger.error(`Backup failed: ${backupName}`, error);
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  /**
   * Build mongodump command
   */
  buildDumpCommand(backupPath) {
    const uri = this.mongoUri;
    
    // Basic mongodump command
    let command = `mongodump --uri="${uri}" --out="${backupPath}"`;
    
    // Add gzip compression at dump level if not doing file compression
    if (!this.compressionEnabled) {
      command += ' --gzip';
    }

    return command;
  }

  /**
   * Compress backup directory
   */
  async compressBackup(backupPath) {
    try {
      const archivePath = `${backupPath}.tar.gz`;
      const command = process.platform === 'win32'
        ? `tar -czf "${archivePath}" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}"`
        : `tar -czf "${archivePath}" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}"`;
      
      await execAsync(command);
      logger.info(`Backup compressed: ${archivePath}`);
      
      return archivePath;
    } catch (error) {
      logger.error('Compression failed:', error);
      throw error;
    }
  }

  /**
   * Encrypt backup file
   */
  async encryptBackup(backupPath) {
    try {
      const encryptedPath = `${backupPath}.enc`;
      
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const input = fsSync.createReadStream(backupPath);
      const output = fsSync.createWriteStream(encryptedPath);
      
      // Write IV to the beginning of the file
      output.write(iv);
      
      await new Promise((resolve, reject) => {
        input.pipe(cipher).pipe(output);
        output.on('finish', resolve);
        output.on('error', reject);
      });
      
      // Remove unencrypted backup
      await fs.unlink(backupPath);
      
      logger.info(`Backup encrypted: ${encryptedPath}`);
      return encryptedPath;
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw error;
    }
  }

  /**
   * List all available backups
   */
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (file.startsWith('backup-') && !file.endsWith('.json')) {
          const metadataPath = path.join(this.backupDir, `${file}.json`);
          
          try {
            const metadata = await fs.readFile(metadataPath, 'utf8');
            backups.push(JSON.parse(metadata));
          } catch (error) {
            // If metadata doesn't exist, create basic info
            const filePath = path.join(this.backupDir, file);
            const stats = await fs.stat(filePath);
            
            backups.push({
              name: file,
              timestamp: stats.mtime.toISOString(),
              size: stats.size,
              sizeFormatted: this.formatBytes(stats.size),
              path: filePath
            });
          }
        }
      }

      // Sort by timestamp (newest first)
      backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return backups;
    } catch (error) {
      logger.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(backupName) {
    try {
      logger.info(`Starting restore from backup: ${backupName}`);

      // Find backup file
      const backups = await this.listBackups();
      const backup = backups.find(b => b.name === backupName || b.name.startsWith(backupName));
      
      if (!backup) {
        throw new Error(`Backup not found: ${backupName}`);
      }

      let restorePath = backup.path;

      // Decrypt if needed
      if (backup.encrypted) {
        restorePath = await this.decryptBackup(restorePath);
      }

      // Decompress if needed
      if (backup.compressed || restorePath.endsWith('.tar.gz')) {
        restorePath = await this.decompressBackup(restorePath);
      }

      // Build mongorestore command
      const restoreCommand = `mongorestore --uri="${this.mongoUri}" --drop "${restorePath}"`;
      
      logger.info('Executing restore...');
      const { stdout, stderr } = await execAsync(restoreCommand);
      
      if (stderr && !stderr.includes('done')) {
        logger.warn('Restore stderr:', stderr);
      }

      logger.info(`Database restored successfully from: ${backupName}`);

      // Cleanup temporary files
      if (restorePath !== backup.path) {
        await this.removeDirectory(restorePath);
      }

      return {
        success: true,
        backup: backupName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Restore failed:', error);
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  /**
   * Decrypt backup file
   */
  async decryptBackup(encryptedPath) {
    try {
      const decryptedPath = encryptedPath.replace('.enc', '');
      
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      
      const input = fsSync.createReadStream(encryptedPath);
      const output = fsSync.createWriteStream(decryptedPath);
      
      // Read IV from the beginning of the file
      const iv = await new Promise((resolve, reject) => {
        input.once('readable', () => {
          const iv = input.read(16);
          resolve(iv);
        });
        input.once('error', reject);
      });
      
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      
      await new Promise((resolve, reject) => {
        input.pipe(decipher).pipe(output);
        output.on('finish', resolve);
        output.on('error', reject);
      });
      
      logger.info(`Backup decrypted: ${decryptedPath}`);
      return decryptedPath;
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Decompress backup archive
   */
  async decompressBackup(archivePath) {
    try {
      const extractPath = archivePath.replace('.tar.gz', '');
      const command = process.platform === 'win32'
        ? `tar -xzf "${archivePath}" -C "${path.dirname(archivePath)}"`
        : `tar -xzf "${archivePath}" -C "${path.dirname(archivePath)}"`;
      
      await execAsync(command);
      logger.info(`Backup decompressed: ${extractPath}`);
      
      return extractPath;
    } catch (error) {
      logger.error('Decompression failed:', error);
      throw error;
    }
  }

  /**
   * Delete a specific backup
   */
  async deleteBackup(backupName) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.name === backupName || b.name.startsWith(backupName));
      
      if (!backup) {
        throw new Error(`Backup not found: ${backupName}`);
      }

      // Delete backup file/directory
      const backupPath = backup.path;
      const stats = await fs.stat(backupPath);
      
      if (stats.isDirectory()) {
        await this.removeDirectory(backupPath);
      } else {
        await fs.unlink(backupPath);
      }

      // Delete metadata
      const metadataPath = `${backupPath}.json`;
      try {
        await fs.unlink(metadataPath);
      } catch (error) {
        // Metadata might not exist
      }

      logger.info(`Backup deleted: ${backupName}`);
      
      this.stats.totalBackups = Math.max(0, this.stats.totalBackups - 1);
      await this.saveStats();

      return { success: true, deleted: backupName };
    } catch (error) {
      logger.error('Failed to delete backup:', error);
      throw error;
    }
  }

  /**
   * Clean old backups based on retention policy
   */
  async cleanOldBackups() {
    try {
      const backups = await this.listBackups();
      const now = Date.now();
      const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;
      
      let deleted = 0;

      // Delete backups older than retention period
      for (const backup of backups) {
        const backupAge = now - new Date(backup.timestamp).getTime();
        
        if (backupAge > retentionMs) {
          await this.deleteBackup(backup.name);
          deleted++;
        }
      }

      // Delete oldest backups if exceeding max count
      const remainingBackups = await this.listBackups();
      if (remainingBackups.length > this.maxBackups) {
        const toDelete = remainingBackups.slice(this.maxBackups);
        
        for (const backup of toDelete) {
          await this.deleteBackup(backup.name);
          deleted++;
        }
      }

      if (deleted > 0) {
        logger.info(`Cleaned ${deleted} old backup(s)`);
      }

      return deleted;
    } catch (error) {
      logger.error('Failed to clean old backups:', error);
      return 0;
    }
  }

  /**
   * Get backup service statistics
   */
  async getStats() {
    const backups = await this.listBackups();
    const totalSize = backups.reduce((sum, b) => sum + (b.size || 0), 0);

    return {
      ...this.stats,
      currentBackupCount: backups.length,
      totalBackupSize: totalSize,
      totalBackupSizeFormatted: this.formatBytes(totalSize),
      oldestBackup: backups[backups.length - 1]?.timestamp || null,
      newestBackup: backups[0]?.timestamp || null,
      retentionDays: this.retentionDays,
      maxBackups: this.maxBackups,
      compressionEnabled: this.compressionEnabled,
      encryptionEnabled: this.encryptionEnabled
    };
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupName) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.name === backupName || b.name.startsWith(backupName));
      
      if (!backup) {
        return { valid: false, error: 'Backup not found' };
      }

      // Check if file exists
      const exists = await fs.access(backup.path).then(() => true).catch(() => false);
      if (!exists) {
        return { valid: false, error: 'Backup file not found' };
      }

      // Check file size
      const stats = await fs.stat(backup.path);
      if (stats.size === 0) {
        return { valid: false, error: 'Backup file is empty' };
      }

      // For compressed backups, try to list contents
      if (backup.compressed || backup.path.endsWith('.tar.gz')) {
        try {
          const command = `tar -tzf "${backup.path}"`;
          await execAsync(command);
        } catch (error) {
          return { valid: false, error: 'Backup archive is corrupted' };
        }
      }

      return {
        valid: true,
        backup: backup.name,
        size: stats.size,
        sizeFormatted: this.formatBytes(stats.size),
        timestamp: backup.timestamp
      };
    } catch (error) {
      logger.error('Backup verification failed:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Helper: Get directory size
   */
  async getDirectorySize(dirPath) {
    let totalSize = 0;
    let fileCount = 0;

    async function calculateSize(currentPath) {
      const stats = await fs.stat(currentPath);
      
      if (stats.isDirectory()) {
        const files = await fs.readdir(currentPath);
        for (const file of files) {
          await calculateSize(path.join(currentPath, file));
        }
      } else {
        totalSize += stats.size;
        fileCount++;
      }
    }

    await calculateSize(dirPath);
    return { size: totalSize, files: fileCount };
  }

  /**
   * Helper: Remove directory recursively
   */
  async removeDirectory(dirPath) {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
      logger.error(`Failed to remove directory: ${dirPath}`, error);
    }
  }

  /**
   * Helper: Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Save backup metadata
   */
  async saveMetadata(backupName, metadata) {
    try {
      const metadataPath = path.join(this.backupDir, `${backupName}.json`);
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    } catch (error) {
      logger.error('Failed to save backup metadata:', error);
    }
  }

  /**
   * Load service statistics
   */
  async loadStats() {
    try {
      const statsPath = path.join(this.backupDir, 'backup-stats.json');
      const data = await fs.readFile(statsPath, 'utf8');
      this.stats = JSON.parse(data);
    } catch (error) {
      // Stats file doesn't exist yet, use defaults
    }
  }

  /**
   * Save service statistics
   */
  async saveStats() {
    try {
      const statsPath = path.join(this.backupDir, 'backup-stats.json');
      await fs.writeFile(statsPath, JSON.stringify(this.stats, null, 2));
    } catch (error) {
      logger.error('Failed to save backup statistics:', error);
    }
  }
}

// Instance will be created after environment variables are loaded
export default BackupService;
