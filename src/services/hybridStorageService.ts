// ============================================================
// src/services/hybridStorageService.ts
// Care2Care Hybrid Storage & Google Drive Integration Service
// ============================================================

import {
  StorageFile,
  StorageSettings,
  BackupJob,
  RestoreJob,
  GoogleDriveAuth
} from "../types";

// Safe property access utility helpers
export const safeStr = (val: any, fallback = ""): string => (val !== null && val !== undefined ? String(val) : fallback);
export const safeNum = (val: any, fallback = 0): number => {
  const parsed = Number(val);
  return isNaN(parsed) ? fallback : parsed;
};
export const safeArray = <T>(val: any): T[] => (Array.isArray(val) ? val : []);
export const safeDate = (val: any): string => {
  try {
    return new Date(val).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const STORAGE_KEY_FILES = "care2care_hybrid_files";
const STORAGE_KEY_SETTINGS = "care2care_hybrid_settings";
const STORAGE_KEY_AUTH = "care2care_hybrid_drive_auth";
const STORAGE_KEY_BACKUP_JOBS = "care2care_hybrid_backup_jobs";
const STORAGE_KEY_RESTORE_JOBS = "care2care_hybrid_restore_jobs";

export class HybridStorageService {
  private static instance: HybridStorageService;

  public static getInstance(): HybridStorageService {
    if (!HybridStorageService.instance) {
      HybridStorageService.instance = new HybridStorageService();
    }
    return HybridStorageService.instance;
  }

  // ============================================================
  // SETTINGS MANAGEMENT
  // ============================================================

  public getSettings(): StorageSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to read storage settings:", e);
    }
    return this.getDefaultSettings();
  }

  public getDefaultSettings(): StorageSettings {
    return {
      userId: "usr-demo-user",
      storageType: "hybrid",
      defaultLocation: "internal",
      autoBackup: true,
      autoBackupNetwork: "wifi",
      autoBackupFrequency: "daily",
      cloudFolderName: "Care2Care Backup",
      maxLocalStorage: 1024, // 1 GB
      maxCloudStorage: 5120, // 5 GB
      compressImages: true,
      compressQuality: 80,
      keepLocalCopy: true,
      keepCloudCopy: true,
      createdAt: safeDate(Date.now()),
      updatedAt: safeDate(Date.now()),
    };
  }

  public saveSettings(settings: Partial<StorageSettings>): StorageSettings {
    const current = this.getSettings();
    const updated: StorageSettings = {
      ...current,
      ...settings,
      updatedAt: safeDate(Date.now()),
    };
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save storage settings:", e);
    }
    return updated;
  }

  // ============================================================
  // GOOGLE DRIVE AUTHENTICATION
  // ============================================================

  public getDriveAuth(): GoogleDriveAuth | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to read Google Drive Auth:", e);
    }
    return null;
  }

  public connectGoogleDrive(email = "eleanor.vance@gmail.com", name = "Eleanor Vance"): GoogleDriveAuth {
    const auth: GoogleDriveAuth = {
      userId: "usr-demo-user",
      accessToken: `ya29.a0Axoo_${Date.now()}_simulated_access_token`,
      refreshToken: `1//04_${Date.now()}_simulated_refresh_token`,
      tokenExpiry: safeDate(Date.now() + 3600 * 1000),
      email,
      name,
      isConnected: true,
      createdAt: safeDate(Date.now()),
      updatedAt: safeDate(Date.now()),
    };
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(auth));
      this.saveSettings({ storageType: "hybrid" });
    } catch (e) {
      console.error("Failed to save Google Drive Auth:", e);
    }
    return auth;
  }

  public disconnectGoogleDrive(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      this.saveSettings({ storageType: "local" });
    } catch (e) {
      console.error("Failed to remove Google Drive Auth:", e);
    }
  }

  // ============================================================
  // FILE MANAGEMENT
  // ============================================================

  public getFiles(filter?: { type?: string; backedUp?: boolean }): StorageFile[] {
    let files: StorageFile[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILES);
      if (saved) {
        files = JSON.parse(saved);
      } else {
        // Initialize with default sample files
        files = this.getInitialSampleFiles();
        localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
      }
    } catch (e) {
      console.error("Failed to get storage files:", e);
      files = this.getInitialSampleFiles();
    }

    files = files.filter((f) => !f.isDeleted);

    if (filter?.type && filter.type !== "all") {
      files = files.filter((f) => f.fileType === filter.type);
    }

    if (filter?.backedUp !== undefined) {
      files = files.filter((f) => f.isBackedUp === filter.backedUp);
    }

    return files;
  }

  public getInitialSampleFiles(): StorageFile[] {
    return [
      {
        id: "file-001",
        userId: "usr-demo-user",
        fileName: "Blood_Test_Report_Aug2026.pdf",
        fileType: "document",
        fileSize: 1450000, // 1.45 MB
        mimeType: "application/pdf",
        localPath: "/care2care/documents/Blood_Test_Report_Aug2026.pdf",
        localUri: "data:application/pdf;base64,JVBERi0xLjQK...",
        cloudId: "gdrive_doc_001",
        cloudUrl: "https://drive.google.com/file/d/gdrive_doc_001/view",
        cloudFolder: "Care2Care Backup",
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80",
        hash: "e3b0c44298fc1c149afbf4c8996fb924",
        tags: ["Medical", "Lab Report", "Vitals"],
        isBackedUp: true,
        isDeleted: false,
        createdAt: safeDate(Date.now() - 86400000 * 2),
        updatedAt: safeDate(Date.now() - 86400000 * 2),
      },
      {
        id: "file-002",
        userId: "usr-demo-user",
        fileName: "Prescription_Dr_Smith.jpg",
        fileType: "image",
        fileSize: 850000, // 850 KB
        mimeType: "image/jpeg",
        localPath: "/care2care/pictures/Prescription_Dr_Smith.jpg",
        localUri: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
        cloudId: "gdrive_img_002",
        cloudUrl: "https://drive.google.com/file/d/gdrive_img_002/view",
        cloudFolder: "Care2Care Backup",
        thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
        hash: "c8f2b381a1829d71a81f3",
        tags: ["Prescription", "Medicine"],
        isBackedUp: true,
        isDeleted: false,
        createdAt: safeDate(Date.now() - 86400000 * 4),
        updatedAt: safeDate(Date.now() - 86400000 * 4),
      },
      {
        id: "file-003",
        userId: "usr-demo-user",
        fileName: "Grandma_Physio_Session.mp4",
        fileType: "video",
        fileSize: 24500000, // 24.5 MB
        mimeType: "video/mp4",
        localPath: "/care2care/videos/Grandma_Physio_Session.mp4",
        localUri: "data:video/mp4;base64,...",
        cloudId: "",
        cloudUrl: "",
        cloudFolder: "Care2Care Backup",
        thumbnail: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=300&auto=format&fit=crop&q=80",
        hash: "f1a2b3c4d5e6f7a8",
        tags: ["Care Log", "Physiotherapy"],
        isBackedUp: false,
        isDeleted: false,
        createdAt: safeDate(Date.now() - 86400000 * 1),
        updatedAt: safeDate(Date.now() - 86400000 * 1),
      },
      {
        id: "file-004",
        userId: "usr-demo-user",
        fileName: "Caregiver_Voice_Note_Instructions.m4a",
        fileType: "audio",
        fileSize: 3200000, // 3.2 MB
        mimeType: "audio/mp4",
        localPath: "/care2care/audio/Caregiver_Voice_Note_Instructions.m4a",
        localUri: "data:audio/m4a;base64,...",
        cloudId: "gdrive_aud_004",
        cloudUrl: "https://drive.google.com/file/d/gdrive_aud_004/view",
        cloudFolder: "Care2Care Backup",
        tags: ["Voice Memo", "Instructions"],
        isBackedUp: true,
        isDeleted: false,
        createdAt: safeDate(Date.now() - 86400000 * 3),
        updatedAt: safeDate(Date.now() - 86400000 * 3),
      },
      {
        id: "file-005",
        userId: "usr-demo-user",
        fileName: "Care2Care_Full_Backup_2026-08-01.json",
        fileType: "backup",
        fileSize: 4200000, // 4.2 MB
        mimeType: "application/json",
        localPath: "/care2care/backups/Care2Care_Full_Backup_2026-08-01.json",
        localUri: "data:application/json;base64,...",
        cloudId: "gdrive_bkp_005",
        cloudUrl: "https://drive.google.com/file/d/gdrive_bkp_005/view",
        cloudFolder: "Care2Care Backup",
        tags: ["Full Backup", "Database"],
        isBackedUp: true,
        isDeleted: false,
        createdAt: safeDate(Date.now() - 86400000 * 5),
        updatedAt: safeDate(Date.now() - 86400000 * 5),
      },
    ];
  }

  public saveFile(fileData: {
    fileName: string;
    fileType: 'image' | 'video' | 'audio' | 'document' | 'backup';
    fileSize: number;
    mimeType: string;
    localUri: string;
    tags?: string[];
  }): StorageFile {
    const settings = this.getSettings();
    const driveAuth = this.getDriveAuth();

    const newFile: StorageFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: settings.userId,
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSize: fileData.fileSize,
      mimeType: fileData.mimeType,
      localPath: `/care2care/storage/${fileData.fileName}`,
      localUri: fileData.localUri,
      cloudId: "",
      cloudUrl: "",
      cloudFolder: settings.cloudFolderName,
      thumbnail: fileData.fileType === "image" ? fileData.localUri : undefined,
      hash: Math.random().toString(36).substring(2, 10),
      tags: fileData.tags || ["General"],
      isBackedUp: false,
      isDeleted: false,
      createdAt: safeDate(Date.now()),
      updatedAt: safeDate(Date.now()),
    };

    const files = this.getFiles();
    files.unshift(newFile);

    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error("Failed to save file to local storage:", e);
    }

    // Auto-backup to Google Drive if connected and enabled
    if (settings.autoBackup && driveAuth?.isConnected) {
      setTimeout(() => {
        this.backupSingleFile(newFile.id);
      }, 500);
    }

    return newFile;
  }

  public backupSingleFile(fileId: string): StorageFile | null {
    const files = this.getFiles();
    const index = files.findIndex((f) => f.id === fileId);
    if (index === -1) return null;

    const file = files[index];
    file.cloudId = `gdrive_${file.fileType}_${Date.now()}`;
    file.cloudUrl = `https://drive.google.com/file/d/${file.cloudId}/view`;
    file.isBackedUp = true;
    file.updatedAt = safeDate(Date.now());

    files[index] = file;
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error("Failed to backup file:", e);
    }

    return file;
  }

  public deleteFile(fileId: string, options: { deleteLocal: boolean; deleteCloud: boolean }): void {
    const files = this.getFiles();
    const index = files.findIndex((f) => f.id === fileId);
    if (index === -1) return;

    const file = files[index];

    if (options.deleteLocal && options.deleteCloud) {
      // Full soft deletion
      file.isDeleted = true;
    } else if (options.deleteLocal) {
      file.localPath = "";
      file.localUri = "";
    } else if (options.deleteCloud) {
      file.cloudId = "";
      file.cloudUrl = "";
      file.isBackedUp = false;
    }

    file.updatedAt = safeDate(Date.now());
    files[index] = file;

    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error("Failed to update deleted file:", e);
    }
  }

  // ============================================================
  // JOBS & HISTORY (BACKUP / RESTORE)
  // ============================================================

  public getBackupJobs(): BackupJob[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BACKUP_JOBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to read backup jobs:", e);
    }
    return [
      {
        id: "job-001",
        userId: "usr-demo-user",
        status: "completed",
        type: "auto",
        progress: 100,
        totalFiles: 4,
        uploadedFiles: 4,
        failedFiles: 0,
        startTime: safeDate(Date.now() - 86400000),
        endTime: safeDate(Date.now() - 86400000 + 12000),
        files: [],
        logs: ["Syncing initialized", "Connecting to Google Drive", "4 files uploaded successfully", "Job completed"],
        createdAt: safeDate(Date.now() - 86400000),
        updatedAt: safeDate(Date.now() - 86400000 + 12000),
      },
    ];
  }

  public saveBackupJob(job: BackupJob): void {
    const jobs = this.getBackupJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    try {
      localStorage.setItem(STORAGE_KEY_BACKUP_JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error("Failed to save backup job:", e);
    }
  }

  public getRestoreJobs(): RestoreJob[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESTORE_JOBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to read restore jobs:", e);
    }
    return [];
  }

  public saveRestoreJob(job: RestoreJob): void {
    const jobs = this.getRestoreJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    try {
      localStorage.setItem(STORAGE_KEY_RESTORE_JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error("Failed to save restore job:", e);
    }
  }

  // ============================================================
  // USAGE & STATS
  // ============================================================

  public getStorageStats(): {
    localUsageMB: number;
    maxLocalMB: number;
    cloudUsageMB: number;
    maxCloudMB: number;
    totalFilesCount: number;
    backedUpCount: number;
    pendingBackupCount: number;
    byType: {
      image: { count: number; bytes: number };
      video: { count: number; bytes: number };
      audio: { count: number; bytes: number };
      document: { count: number; bytes: number };
      backup: { count: number; bytes: number };
    };
  } {
    const settings = this.getSettings();
    const files = this.getFiles();

    let localBytes = 0;
    let cloudBytes = 0;
    let backedUpCount = 0;
    let pendingBackupCount = 0;

    const byType = {
      image: { count: 0, bytes: 0 },
      video: { count: 0, bytes: 0 },
      audio: { count: 0, bytes: 0 },
      document: { count: 0, bytes: 0 },
      backup: { count: 0, bytes: 0 },
    };

    files.forEach((f) => {
      const size = safeNum(f.fileSize, 0);
      if (f.localUri || f.localPath) {
        localBytes += size;
      }
      if (f.isBackedUp) {
        cloudBytes += size;
        backedUpCount++;
      } else {
        pendingBackupCount++;
      }

      if (byType[f.fileType]) {
        byType[f.fileType].count++;
        byType[f.fileType].bytes += size;
      }
    });

    return {
      localUsageMB: parseFloat((localBytes / (1024 * 1024)).toFixed(2)),
      maxLocalMB: settings.maxLocalStorage,
      cloudUsageMB: parseFloat((cloudBytes / (1024 * 1024)).toFixed(2)),
      maxCloudMB: settings.maxCloudStorage,
      totalFilesCount: files.length,
      backedUpCount,
      pendingBackupCount,
      byType,
    };
  }

  public clearLocalCache(): void {
    const files = this.getFiles();
    files.forEach((f) => {
      if (f.isBackedUp) {
        f.localUri = "";
        f.localPath = "";
      }
    });
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error("Failed to clear local cache:", e);
    }
  }
}

export const hybridStorage = HybridStorageService.getInstance();
