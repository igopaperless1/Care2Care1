import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  FileText,
  ShieldCheck,
  Tag,
  CheckCircle2,
  FolderPlus,
  Lock,
  Layers,
  Sparkles,
  Smartphone
} from "lucide-react";
import { PaperlessAsset, PaperlessAccessLevel, PaperlessAssetType } from "./paperlessTypes";
import { PAPERLESS_CATEGORIES } from "./paperlessCategoriesData";

interface PaperlessUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newAsset: PaperlessAsset) => void;
  onOpenScanner?: () => void;
  showToast: (msg: string) => void;
  initialCategory?: string;
  initialSubService?: string;
}

export const PaperlessUploadModal: React.FC<PaperlessUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  onOpenScanner,
  showToast,
  initialCategory,
  initialSubService
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(initialCategory || PAPERLESS_CATEGORIES[0].name);
  const [subService, setSubService] = useState(
    initialSubService || PAPERLESS_CATEGORIES[0].subServices[0].name
  );
  const [accessLevel, setAccessLevel] = useState<PaperlessAccessLevel>("private");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [isEncryptedVault, setIsEncryptedVault] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Selected Category Object
  const currentCategoryObj =
    PAPERLESS_CATEGORIES.find((c) => c.name === category) || PAPERLESS_CATEGORIES[0];

  const handleCategoryChange = (newCatName: string) => {
    setCategory(newCatName);
    const matched = PAPERLESS_CATEGORIES.find((c) => c.name === newCatName);
    if (matched && matched.subServices.length > 0) {
      setSubService(matched.subServices[0].name);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPickedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processPickedFile(e.target.files[0]);
    }
  };

  const processPickedFile = (file: File) => {
    setSelectedFile(file);
    if (!name) {
      setName(file.name);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getAssetTypeFromExtension = (fileName: string): PaperlessAssetType => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return "pdf";
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
    if (["doc", "docx", "txt", "rtf", "xls", "xlsx", "csv", "ppt"].includes(ext)) return "doc";
    if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
    return "other";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter a document title");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const fileName = selectedFile ? selectedFile.name : `${name.replace(/\s+/g, "_")}.pdf`;
      const fileSizeBytes = selectedFile ? selectedFile.size : 1024 * 1024 * 2.2;
      const fileType = getAssetTypeFromExtension(fileName);

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter((t) => t.length > 0);

      const newAsset: PaperlessAsset = {
        id: `ast-${Date.now()}`,
        name: name.trim(),
        fileName: fileName,
        fileSize: formatFileSize(fileSizeBytes),
        fileSizeBytes: fileSizeBytes,
        fileType: fileType,
        category: category,
        subService: subService,
        status: isEncryptedVault ? "encrypted" : "verified",
        uploadedBy: {
          id: "usr-me",
          name: "John Doe",
          email: "johndoe@gmail.com",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
        },
        uploadDate: "Just now",
        uploadTimestamp: Date.now(),
        isFavorite: false,
        tags: parsedTags.length > 0 ? parsedTags : ["Document", category.split(" ")[0]],
        description: description.trim(),
        accessLevel: accessLevel,
        sharedWith: [],
        activityLog: [
          {
            id: `act-${Date.now()}`,
            action: isEncryptedVault ? "Uploaded & Encrypted into Vault" : "Uploaded new asset",
            performedBy: "You",
            timestamp: "Just now"
          }
        ]
      };

      onUploadSuccess(newAsset);
      setIsProcessing(false);
      showToast(`Uploaded "${newAsset.name}" successfully!`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-[#FF5A36] text-white flex items-center justify-center font-bold shadow-xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Add / Upload Asset
              </h3>
              <p className="text-[10px] text-slate-400">Save to Paperless Cloud Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              dragOver
                ? "border-[#FF5A36] bg-orange-50/50 dark:bg-orange-950/20"
                : selectedFile
                ? "border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:border-orange-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.mp4"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {formatFileSize(selectedFile.size)} • Click to change
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF5A36] dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drag & drop files here
                  </p>
                  <p className="text-[11px] text-[#FF5A36] font-bold mt-0.5">or Browse Files</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supported: PDF, JPG, PNG, DOC, XLS, MP4 • Max file size: 100MB
                </p>
              </div>
            )}
          </div>

          {/* Camera Scanner Quick Trigger */}
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Camera className="w-4 h-4 text-orange-500" />
              <span>Scan with Camera / OCR Scanner</span>
            </button>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MRI Report.pdf, Q3 Invoice..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Category & SubService Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
              >
                {PAPERLESS_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sub-Service *
              </label>
              <select
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
              >
                {currentCategoryObj.subServices.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Access Level & Security */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Privacy Access Level
              </label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as PaperlessAccessLevel)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
              >
                <option value="private">Private (Only Me)</option>
                <option value="family">Family (Care Circle)</option>
                <option value="workspace">Workspace / Business</option>
                <option value="public">Public Link</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="encryptToggle"
                checked={isEncryptedVault}
                onChange={(e) => setIsEncryptedVault(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded-md focus:ring-orange-400"
              />
              <label
                htmlFor="encryptToggle"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                AES Encrypted Vault
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. MRI, Brain, Urgent, 2026"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional summary, medical instructions, or notes..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white font-extrabold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isProcessing ? "Processing & Uploading..." : "Save Asset"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
