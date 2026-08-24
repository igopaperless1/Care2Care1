import React, { useState } from "react";
import {
  X,
  Share2,
  Download,
  Star,
  MoreVertical,
  FileText,
  Clock,
  ShieldCheck,
  Tag,
  Eye,
  Edit,
  Trash2,
  Copy,
  Lock,
  ExternalLink,
  User,
  Users,
  CheckCircle2,
  QrCode
} from "lucide-react";
import { PaperlessAsset } from "./paperlessTypes";
import { ProfessionalQrRenderer } from "../ProfessionalQrRenderer";

interface PaperlessAssetDetailsModalProps {
  asset: PaperlessAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (asset: PaperlessAsset) => void;
  onEdit: (asset: PaperlessAsset) => void;
  onDelete: (assetId: string) => void;
  onToggleFavorite: (assetId: string) => void;
  showToast: (msg: string) => void;
}

export const PaperlessAssetDetailsModal: React.FC<PaperlessAssetDetailsModalProps> = ({
  asset,
  isOpen,
  onClose,
  onShare,
  onEdit,
  onDelete,
  onToggleFavorite,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "activity" | "access">("details");
  const [showQrModal, setShowQrModal] = useState(false);

  if (!isOpen || !asset) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Direct access link copied to clipboard!");
  };

  const handleDownload = () => {
    const dummyData = `BLESSIKA ENCRYPTED DOCUMENT: ${asset.fileName}\nCategory: ${asset.category}\nSub-Service: ${asset.subService}\nStatus: ${asset.status}\nUploaded: ${asset.uploadDate}`;
    const blob = new Blob([dummyData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = asset.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${asset.fileName}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Close and Title */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Document Preview
            </span>
            {asset.status === "verified" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified
              </span>
            )}
            {asset.status === "encrypted" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40">
                <Lock className="w-3 h-3 text-indigo-500" />
                Encrypted Vault
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Document Card Info Header */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/40 dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                {asset.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {asset.category} • {asset.subService}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <span>By {asset.uploadedBy.name}</span>
                <span>•</span>
                <span>{asset.uploadDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar (Share, Download, Favorite, More) */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onShare(asset)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-200 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold gap-1.5"
            >
              <Share2 className="w-4 h-4 text-[#FF5A36]" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-200 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Download</span>
            </button>
            <button
              onClick={() => onToggleFavorite(asset.id)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-200 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold gap-1.5"
            >
              <Star
                className={`w-4 h-4 ${
                  asset.isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-400"
                }`}
              />
              <span>{asset.isFavorite ? "Favorited" : "Favorite"}</span>
            </button>
            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-200 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold gap-1.5"
            >
              <QrCode className="w-4 h-4 text-blue-500" />
              <span>Smart QR</span>
            </button>
          </div>

          {/* Smart QR Card Accordion */}
          {showQrModal && (
            <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-slate-900/90 border border-orange-200 dark:border-orange-500/30 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-150">
              <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Instant Verification Smart QR
              </span>
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                <ProfessionalQrRenderer
                  value={`BLESSIKA_DOC_ID:${asset.id}|HASH:${asset.fileSizeBytes}|CAT:${asset.category}`}
                  size={140}
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                  patternStyle="rounded"
                  level="H"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scan with any mobile camera or Blessika QR Scanner to verify origin & authenticity.
              </p>
            </div>
          )}

          {/* Horizontal Tabs: Details | Activity | Access */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "details"
                  ? "border-[#FF5A36] text-[#FF5A36]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "activity"
                  ? "border-[#FF5A36] text-[#FF5A36]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Activity Log ({asset.activityLog?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "access"
                  ? "border-[#FF5A36] text-[#FF5A36]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Access & Shared ({asset.sharedWith?.length || 0})
            </button>
          </div>

          {/* TAB 1: DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {asset.fileName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {asset.category}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Sub-Service:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {asset.subService}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Size:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {asset.fileSize}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Access Level:</span>
                <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                  {asset.accessLevel}
                </span>
              </div>
              <div className="py-2 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-slate-400">Tags:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {asset.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              {asset.description && (
                <div className="py-2 space-y-1">
                  <span className="text-slate-400">Description:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    {asset.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVITY */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {asset.activityLog && asset.activityLog.length > 0 ? (
                asset.activityLog.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{log.action}</p>
                      <p className="text-[11px] text-slate-400">
                        {log.performedBy} • {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No recent activity logs.</p>
              )}
            </div>
          )}

          {/* TAB 3: ACCESS & SHARED */}
          {activeTab === "access" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Shared Users
                </span>
                <button
                  onClick={() => onShare(asset)}
                  className="text-xs font-bold text-[#FF5A36] hover:underline"
                >
                  + Add User
                </button>
              </div>
              {asset.sharedWith && asset.sharedWith.length > 0 ? (
                asset.sharedWith.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-600 dark:text-slate-200">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200">
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  Only you have access to this document.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions: Edit / Copy Link / Delete */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(asset)}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              Edit
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              Copy Link
            </button>
          </div>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
                onDelete(asset.id);
                onClose();
              }
            }}
            className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
