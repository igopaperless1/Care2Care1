import React, { useState } from "react";
import {
  ChevronLeft,
  Edit2,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Share2,
  Trash2,
  Star,
  Check,
  Folder,
  Clock,
  Key,
  ShieldCheck
} from "lucide-react";
import { VaultItem } from "./types";

interface PasswordItemDetailsModalProps {
  item: VaultItem;
  onBack: () => void;
  onShare: (item: VaultItem) => void;
  onDelete: (id: string) => void;
}

export const PasswordItemDetailsModal: React.FC<PasswordItemDetailsModalProps> = ({
  item,
  onBack,
  onShare,
  onDelete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-black text-[#FF5A36] hover:text-[#EA4C27] bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Vault</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare(item)}
            className="p-2 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-[#FF5A36] text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* BRAND / TITLE HEADER */}
        <div className="flex items-center justify-between pb-2 border-b border-orange-200/60">
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0"
              style={{ backgroundColor: item.brandColor || "#FF5A36" }}
            >
              {item.title.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {item.title}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {item.username}
              </p>
            </div>
          </div>

          <Star
            className={`w-5 h-5 ${
              item.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
          />
        </div>

        {/* FIELDS */}
        <div className="space-y-3">
          {/* Username / Email */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Username / Email
              </span>
              <span className="text-sm font-black text-slate-900 block mt-0.5 select-all">
                {item.username}
              </span>
            </div>
            <button
              onClick={() => handleCopy(item.username, "username")}
              className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] transition-colors cursor-pointer"
              title="Copy Username"
            >
              {copiedField === "username" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Password
              </span>
              <span className="text-sm font-black text-slate-900 font-mono block mt-0.5">
                {showPassword ? item.password : "••••••••••••••••"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-xl hover:bg-orange-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={showPassword ? "Hide" : "Reveal"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleCopy(item.password, "password")}
                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] transition-colors cursor-pointer"
                title="Copy Password"
              >
                {copiedField === "password" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Website */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Website
              </span>
              <span className="text-xs font-black text-[#FF5A36] block mt-0.5 truncate">
                {item.website}
              </span>
            </div>
            <a
              href={item.website}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Category & Folder */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Category
              </span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">
                {item.category}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Folder
              </span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">
                {item.folder}
              </span>
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="bg-white rounded-2xl p-3.5 border border-orange-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Notes
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white/60 rounded-2xl p-3 border border-orange-100/60 flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-500 gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              Last Modified: {item.lastModified}
            </span>
            <span>Created: {item.createdAt}</span>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onShare(item)}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-[#FF5A36] border border-[#FF5A36] font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Securely</span>
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
