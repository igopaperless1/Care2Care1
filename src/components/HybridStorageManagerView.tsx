import React, { useState, useEffect } from "react";
import {
  HardDrive,
  Cloud,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  CheckCircle,
  AlertCircle,
  Settings,
  Search,
  Filter,
  Layers,
  Sparkles,
  Wifi,
  Smartphone,
  Shield,
  Clock,
  ChevronRight,
  X,
  Eye,
  Plus,
  Play,
  Check,
  Zap,
  Info
} from "lucide-react";
import {
  StorageFile,
  StorageSettings,
  BackupJob,
  RestoreJob,
  GoogleDriveAuth
} from "../types";
import { hybridStorage, safeStr, safeNum, safeArray } from "../services/hybridStorageService";

interface HybridStorageManagerViewProps {
  onBack?: () => void;
}

export const HybridStorageManagerView: React.FC<HybridStorageManagerViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<"files" | "settings" | "history">("files");

  // State
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [settings, setSettings] = useState<StorageSettings>(hybridStorage.getSettings());
  const [driveAuth, setDriveAuth] = useState<GoogleDriveAuth | null>(hybridStorage.getDriveAuth());
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>(hybridStorage.getBackupJobs());
  const [restoreJobs, setRestoreJobs] = useState<RestoreJob[]>(hybridStorage.getRestoreJobs());

  // Filter & Search State
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<StorageFile | null>(null);

  // Active Progress Job State
  const [activeBackupProgress, setActiveBackupProgress] = useState<BackupJob | null>(null);
  const [activeRestoreProgress, setActiveRestoreProgress] = useState<RestoreJob | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete modal confirmation
  const [deleteModalFile, setDeleteModalFile] = useState<StorageFile | null>(null);

  const refreshData = () => {
    setFiles(hybridStorage.getFiles());
    setSettings(hybridStorage.getSettings());
    setDriveAuth(hybridStorage.getDriveAuth());
    setBackupJobs(hybridStorage.getBackupJobs());
    setRestoreJobs(hybridStorage.getRestoreJobs());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const stats = hybridStorage.getStorageStats();

  // ============================================================
  // GOOGLE DRIVE AUTH FLOW
  // ============================================================
  const handleConnectGoogleDrive = () => {
    const auth = hybridStorage.connectGoogleDrive("eleanor.vance@gmail.com", "Eleanor Vance");
    setDriveAuth(auth);
    setSettings(hybridStorage.getSettings());
    showToast("Google Drive connected successfully! App folder created.");
  };

  const handleDisconnectGoogleDrive = () => {
    hybridStorage.disconnectGoogleDrive();
    setDriveAuth(null);
    setSettings(hybridStorage.getSettings());
    showToast("Disconnected from Google Drive.");
  };

  // ============================================================
  // FILE UPLOAD SIMULATION / ADD
  // ============================================================
  const handleUploadNewFile = () => {
    const fileTypes: Array<'image' | 'video' | 'audio' | 'document' | 'backup'> = ['image', 'document', 'audio', 'video'];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const timeStr = new Date().toISOString().slice(0, 10);
    
    let fileName = `Medical_Record_${timeStr}.pdf`;
    let mimeType = "application/pdf";
    let size = 1800000; // 1.8 MB

    if (randomType === "image") {
      fileName = `Lab_Report_Scan_${Date.now().toString().slice(-4)}.jpg`;
      mimeType = "image/jpeg";
      size = 950000;
    } else if (randomType === "audio") {
      fileName = `Caregiver_Voice_Note_${Date.now().toString().slice(-4)}.m4a`;
      mimeType = "audio/m4a";
      size = 2400000;
    } else if (randomType === "video") {
      fileName = `Physiotherapy_Session_${Date.now().toString().slice(-4)}.mp4`;
      mimeType = "video/mp4";
      size = 18500000;
    }

    const savedFile = hybridStorage.saveFile({
      fileName,
      fileType: randomType,
      fileSize: size,
      mimeType,
      localUri: randomType === "image" ? "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80" : "data:application/octet-stream;base64,...",
      tags: ["Uploaded", "Care2Care"],
    });

    refreshData();
    showToast(`Uploaded '${savedFile.fileName}' (${(size / 1024 / 1024).toFixed(1)} MB)!`);
  };

  // ============================================================
  // BACKUP ALL & RESTORE ALL JOBS
  // ============================================================
  const handleRunBackupAll = () => {
    const unbacked = files.filter((f) => !f.isBackedUp);
    if (unbacked.length === 0) {
      showToast("All files are already backed up to Google Drive!");
      return;
    }

    const job: BackupJob = {
      id: `backup_${Date.now()}`,
      userId: settings.userId,
      status: "running",
      type: "manual",
      progress: 0,
      totalFiles: unbacked.length,
      uploadedFiles: 0,
      failedFiles: 0,
      startTime: new Date().toISOString(),
      files: unbacked,
      logs: ["Starting Google Drive sync job...", `Target folder: ${settings.cloudFolderName}`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveBackupProgress(job);

    // Simulate progress increments
    let progress = 0;
    let index = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress <= 100) {
        if (index < unbacked.length) {
          hybridStorage.backupSingleFile(unbacked[index].id);
          index++;
        }
        setActiveBackupProgress((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            progress: Math.min(progress, 100),
            uploadedFiles: Math.min(index, unbacked.length),
            logs: [...(prev.logs || []), `Uploaded file ${index} of ${unbacked.length} to Google Drive`],
          };
        });
      } else {
        clearInterval(interval);
        job.status = "completed";
        job.progress = 100;
        job.uploadedFiles = unbacked.length;
        job.endTime = new Date().toISOString();
        hybridStorage.saveBackupJob(job);
        setActiveBackupProgress(null);
        refreshData();
        showToast("Backup completed successfully!");
      }
    }, 600);
  };

  const handleRunRestoreAll = () => {
    const cloudFiles = files.filter((f) => f.isBackedUp);
    if (cloudFiles.length === 0) {
      showToast("No files found in Google Drive to restore.");
      return;
    }

    const job: RestoreJob = {
      id: `restore_${Date.now()}`,
      userId: settings.userId,
      status: "running",
      progress: 0,
      totalFiles: cloudFiles.length,
      restoredFiles: 0,
      failedFiles: 0,
      startTime: new Date().toISOString(),
      files: cloudFiles,
      logs: ["Connecting to Google Drive...", "Downloading cloud assets to local app storage"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveRestoreProgress(job);

    let progress = 0;
    let index = 0;
    const interval = setInterval(() => {
      progress += 33;
      if (progress <= 100) {
        index++;
        setActiveRestoreProgress((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            progress: Math.min(progress, 100),
            restoredFiles: Math.min(index, cloudFiles.length),
            logs: [...(prev.logs || []), `Downloaded file ${index} of ${cloudFiles.length} to local directory`],
          };
        });
      } else {
        clearInterval(interval);
        job.status = "completed";
        job.progress = 100;
        job.endTime = new Date().toISOString();
        hybridStorage.saveRestoreJob(job);
        setActiveRestoreProgress(null);
        refreshData();
        showToast("Restored all cloud files to local device!");
      }
    }, 700);
  };

  // ============================================================
  // FILE DELETION HANDLER
  // ============================================================
  const executeDeleteFile = (deleteLocal: boolean, deleteCloud: boolean) => {
    if (!deleteModalFile) return;
    hybridStorage.deleteFile(deleteModalFile.id, { deleteLocal, deleteCloud });
    setDeleteModalFile(null);
    refreshData();
    showToast("Selected file deleted according to preferences.");
  };

  // Filtered files calculation
  const filteredFiles = files.filter((file) => {
    const matchesType = fileTypeFilter === "all" || file.fileType === fileTypeFilter;
    const matchesSearch =
      searchQuery === "" ||
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedFileIds.length === filteredFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(filteredFiles.map((f) => f.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedFileIds.length === 0) return;
    selectedFileIds.forEach((id) => {
      hybridStorage.deleteFile(id, { deleteLocal: true, deleteCloud: true });
    });
    setSelectedFileIds([]);
    refreshData();
    showToast(`Deleted ${selectedFileIds.length} files.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Hybrid Storage System
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Local + Google Drive
                  </span>
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Complete local device privacy paired with optional Google Drive cloud sync
                </p>
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center space-x-2.5 flex-wrap">
            <button
              onClick={handleUploadNewFile}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center space-x-2 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>

            {driveAuth?.isConnected ? (
              <button
                onClick={handleRunBackupAll}
                className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-900/30 flex items-center space-x-2 transition"
              >
                <Cloud className="w-4 h-4" />
                <span>Backup Now</span>
              </button>
            ) : (
              <button
                onClick={handleConnectGoogleDrive}
                className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 flex items-center space-x-2 transition"
              >
                <Cloud className="w-4 h-4" />
                <span>Connect Google Drive</span>
              </button>
            )}
          </div>
        </div>

        {/* Storage Quick Summary Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-medium">Local Device Used</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {stats.localUsageMB} MB / {stats.maxLocalMB} MB
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min((stats.localUsageMB / stats.maxLocalMB) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-medium">Google Drive Cloud</div>
            <div className="text-lg font-bold text-teal-300 mt-0.5">
              {stats.cloudUsageMB} MB / {stats.maxCloudMB} MB
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-teal-400 h-full rounded-full"
                style={{ width: `${Math.min((stats.cloudUsageMB / stats.maxCloudMB) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-medium">Synced Status</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {stats.backedUpCount} / {stats.totalFilesCount} Files
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats.pendingBackupCount} pending backup
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[10px] text-slate-400 font-medium">Cloud Connection</div>
            <div className="text-sm font-bold mt-0.5 flex items-center gap-1.5">
              {driveAuth?.isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 truncate">{driveAuth.email}</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-300">Local Only</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("files")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === "files"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>File Manager ({files.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === "settings"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Storage Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === "history"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Backup History ({backupJobs.length})</span>
        </button>
      </div>

      {/* SCREEN 1 & 2: FILE MANAGER TAB */}
      {activeTab === "files" && (
        <div className="space-y-4">
          {/* Search, Category Tabs & Batch Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Type Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {[
                { id: "all", label: "All Files", icon: Layers },
                { id: "image", label: "Photos", icon: Image },
                { id: "video", label: "Videos", icon: Video },
                { id: "audio", label: "Audio", icon: Music },
                { id: "document", label: "Documents", icon: FileText },
                { id: "backup", label: "Backups", icon: Archive },
              ].map((tab) => {
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFileTypeFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition whitespace-nowrap ${
                      fileTypeFilter === tab.id
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search files or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Select & Batch Operations Bar */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {selectedFileIds.length === filteredFiles.length ? "Deselect All" : "Select All"}
              </button>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                {selectedFileIds.length} of {filteredFiles.length} selected
              </span>
            </div>

            {selectedFileIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            )}
          </div>

          {/* File Cards Grid */}
          {filteredFiles.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Folder className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No storage files found matching query
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your health records, photos, audio memos, or backups to manage them locally and in Google Drive.
              </p>
              <button
                onClick={handleUploadNewFile}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700"
              >
                Upload First File
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <div
                    key={file.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition shadow-sm hover:shadow-md relative space-y-3 ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Top File Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedFileIds((prev) =>
                              prev.includes(file.id) ? prev.filter((i) => i !== file.id) : [...prev, file.id]
                            );
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {/* File Type Icon */}
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {file.fileType === "image" && <Image className="w-4 h-4 text-emerald-500" />}
                          {file.fileType === "video" && <Video className="w-4 h-4 text-indigo-500" />}
                          {file.fileType === "audio" && <Music className="w-4 h-4 text-amber-500" />}
                          {file.fileType === "document" && <FileText className="w-4 h-4 text-teal-500" />}
                          {file.fileType === "backup" && <Archive className="w-4 h-4 text-cyan-500" />}
                        </div>
                      </div>

                      {/* Sync Badges */}
                      <div className="flex items-center space-x-1">
                        {file.localUri && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            ✅ Local
                          </span>
                        )}
                        {file.isBackedUp ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            ☁️ Drive
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            ⏳ Local Only
                          </span>
                        )}
                      </div>
                    </div>

                    {/* File Info */}
                    <div>
                      <h3
                        onClick={() => setPreviewFile(file)}
                        className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-emerald-600 cursor-pointer"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </h3>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>{(file.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {!file.isBackedUp && (
                        <button
                          onClick={() => {
                            hybridStorage.backupSingleFile(file.id);
                            refreshData();
                            showToast(`Backed up '${file.fileName}' to Google Drive!`);
                          }}
                          className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-bold hover:bg-teal-100"
                        >
                          Backup
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteModalFile(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SCREEN 1: STORAGE SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              Hybrid Storage & Backup Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize local directory limits, auto-backup rules, network preferences, and cloud connectivity
            </p>
          </div>

          {/* SECTION 1: STORAGE MODE SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
              1. Storage Mode Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "local", title: "Local Device Only", desc: "Files stored strictly on device. Zero cloud sync.", icon: HardDrive },
                { id: "cloud", title: "Google Drive Only", desc: "Uploads stream directly to Google Drive cloud.", icon: Cloud },
                { id: "hybrid", title: "Hybrid (Recommended)", desc: "Primary local storage + automatic Google Drive cloud backup.", icon: Shield },
              ].map((mode) => {
                const IconComp = mode.icon;
                const isSelected = settings.storageType === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      const updated = hybridStorage.saveSettings({ storageType: mode.id as any });
                      setSettings(updated);
                      showToast(`Storage mode set to ${mode.title}`);
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <IconComp className={`w-6 h-6 mb-2 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{mode.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{mode.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: GOOGLE DRIVE CONNECTION */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Drive Integration</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {driveAuth?.isConnected
                      ? `Connected as ${driveAuth.email} (${driveAuth.name})`
                      : "Connect your Google Drive account to activate cloud backups"}
                  </p>
                </div>
              </div>

              {driveAuth?.isConnected ? (
                <button
                  onClick={handleDisconnectGoogleDrive}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100"
                >
                  Disconnect Google Drive
                </button>
              ) : (
                <button
                  onClick={handleConnectGoogleDrive}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 flex items-center space-x-1.5"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Connect Google Drive</span>
                </button>
              )}
            </div>

            {driveAuth?.isConnected && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/60">
                {/* Auto Backup Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Auto-Backup Enabled</div>
                    <div className="text-[10px] text-slate-400">Automatically sync new files</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => {
                      const updated = hybridStorage.saveSettings({ autoBackup: e.target.checked });
                      setSettings(updated);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                {/* Network Choice */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Backup Network</label>
                  <select
                    value={settings.autoBackupNetwork}
                    onChange={(e) => {
                      const updated = hybridStorage.saveSettings({ autoBackupNetwork: e.target.value as any });
                      setSettings(updated);
                    }}
                    className="w-full text-xs font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="wifi">Wi-Fi Only (Saves Mobile Data)</option>
                    <option value="cellular">Cellular Data Only</option>
                    <option value="both">Wi-Fi + Cellular Network</option>
                  </select>
                </div>

                {/* Frequency Choice */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Backup Frequency</label>
                  <select
                    value={settings.autoBackupFrequency}
                    onChange={(e) => {
                      const updated = hybridStorage.saveSettings({ autoBackupFrequency: e.target.value as any });
                      setSettings(updated);
                    }}
                    className="w-full text-xs font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="realtime">Real-time Instant Sync</option>
                    <option value="daily">Daily Schedule</option>
                    <option value="weekly">Weekly Schedule</option>
                    <option value="manual">Manual Backup Only</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: STORAGE CONTROLS & MANAGEMENT */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
              3. Maintenance & Actions
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRunRestoreAll}
                className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md hover:bg-teal-700 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Restore All From Drive</span>
              </button>

              <button
                onClick={() => {
                  hybridStorage.clearLocalCache();
                  refreshData();
                  showToast("Local cache cleared. Offline cloud references preserved.");
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
              >
                Clear Local Cache
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: BACKUP HISTORY TAB */}
      {activeTab === "history" && (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Backup & Restore Job Logs
            </h2>
            <span className="text-xs text-slate-400">{backupJobs.length} historical entries</span>
          </div>

          {backupJobs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No backup history logged yet.</div>
          ) : (
            <div className="space-y-3">
              {backupJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white uppercase">{job.type} Backup</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {job.status}
                      </span>
                    </div>
                    <span className="text-slate-400">{new Date(job.startTime).toLocaleString()}</span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Processed {job.uploadedFiles} of {job.totalFiles} files • Progress {job.progress}%
                  </div>

                  {job.logs && job.logs.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] space-y-1">
                      {job.logs.map((log, idx) => (
                        <div key={idx}>&gt; {log}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCREEN 3 & 4: UPLOAD / RESTORE PROGRESS MODAL */}
      {(activeBackupProgress || activeRestoreProgress) && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeBackupProgress ? "Uploading to Google Drive..." : "Restoring Cloud Files..."}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Progress: {activeBackupProgress ? activeBackupProgress.progress : activeRestoreProgress?.progress}%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${activeBackupProgress ? activeBackupProgress.progress : activeRestoreProgress?.progress}%`,
                }}
              />
            </div>

            {/* Logs preview */}
            <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] text-left max-h-28 overflow-y-auto space-y-1">
              {(activeBackupProgress?.logs || activeRestoreProgress?.logs || []).map((l, i) => (
                <div key={i}>&gt; {l}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW FILE MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{previewFile.fileName}</h3>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewFile.fileType === "image" && previewFile.localUri ? (
              <img
                src={previewFile.localUri}
                alt={previewFile.fileName}
                className="w-full h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-full h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                Preview file asset: {previewFile.mimeType}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div>Size: {(previewFile.fileSize / (1024 * 1024)).toFixed(2)} MB</div>
              <div>Type: {previewFile.fileType}</div>
              <div>Location: {previewFile.localPath || "Cloud Only"}</div>
              <div>Cloud Status: {previewFile.isBackedUp ? "Backed Up" : "Local Only"}</div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL CONFIRMATION */}
      {deleteModalFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Storage File</h3>
              <p className="text-xs text-slate-400 mt-1 truncate">{deleteModalFile.fileName}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => executeDeleteFile(true, false)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
              >
                Delete Local Copy Only (Keep Cloud Copy)
              </button>

              <button
                onClick={() => executeDeleteFile(false, true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
              >
                Delete Cloud Copy Only (Keep Local Copy)
              </button>

              <button
                onClick={() => executeDeleteFile(true, true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                Delete Both Local & Cloud Copy
              </button>
            </div>

            <button onClick={() => setDeleteModalFile(null)} className="text-xs text-slate-400 hover:underline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn border border-slate-800">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
