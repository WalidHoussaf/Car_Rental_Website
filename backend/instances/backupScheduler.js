// Singleton instance holder for BackupScheduler
// This allows routes to import the instance after it's created in server.js

let backupSchedulerInstance = null;

export function setBackupScheduler(instance) {
  backupSchedulerInstance = instance;
}

export function getBackupScheduler() {
  if (!backupSchedulerInstance) {
    throw new Error('BackupScheduler instance not initialized. Call setBackupScheduler() first.');
  }
  return backupSchedulerInstance;
}

export default {
  set: setBackupScheduler,
  get: getBackupScheduler
};
