import React from "react";
import { ArrowLeft, Clock, AlertTriangle, Plus, Camera, Bell } from "lucide-react";
import { MedicineTab } from "./types";

interface MedicineHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onOpenScanner?: () => void;
  onOpenAdd?: () => void;
  dueNowCount?: number;
  lowStockCount?: number;
  showQuickActions?: boolean;
}

export const MedicineHeader: React.FC<MedicineHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onOpenScanner,
  onOpenAdd,
  dueNowCount = 0,
  lowStockCount = 0,
  showQuickActions = true
}) => {
  return (
    <header className="bg-[#6C3CE1] text-white sticky top-0 z-30 shadow-md shadow-purple-950/15">
      {/* Top Level Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        {/* Left: Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/20"
            title="Go Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Center / Left Title & Subtitle */}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-white leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-white/80 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Actions / Status Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {dueNowCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B6B] text-white text-[11px] font-bold shadow-xs animate-pulse">
              <Clock className="w-3 h-3" /> {dueNowCount} Due
            </span>
          )}

          {lowStockCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F39C12] text-white text-[11px] font-bold shadow-xs">
              <AlertTriangle className="w-3 h-3" /> {lowStockCount} Low
            </span>
          )}

          {showQuickActions && onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              title="Scan Prescription"
              aria-label="Scan Prescription"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {showQuickActions && onOpenAdd && (
            <button
              type="button"
              onClick={onOpenAdd}
              className="w-9 h-9 rounded-xl bg-white text-[#6C3CE1] hover:bg-[#F3F0FF] active:scale-95 flex items-center justify-center transition-all cursor-pointer font-black shadow-xs"
              title="Add New Medicine"
              aria-label="Add Medicine"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
