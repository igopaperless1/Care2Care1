import React from "react";
import {
  Pill,
  Camera,
  Bell,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Share2,
  FileText,
  CheckCircle2,
  Plus
} from "lucide-react";
import { MedicineTab } from "./types";

interface MedicineHeaderProps {
  currentTab: MedicineTab;
  onNavigate: (tab: MedicineTab) => void;
  dueNowCount: number;
  lowStockCount: number;
  adherencePercent: number;
  onOpenScanner: () => void;
  onOpenAddModal: () => void;
  onBack?: () => void;
}

export const MedicineHeader: React.FC<MedicineHeaderProps> = ({
  currentTab,
  onNavigate,
  dueNowCount,
  lowStockCount,
  adherencePercent,
  onOpenScanner,
  onOpenAddModal,
  onBack
}) => {
  return (
    <header className="bg-white border-b border-orange-100/80 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Tag */}
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-bold flex items-center gap-1">
            <Pill className="w-3 h-3" /> MEDICINE REMINDER SERVICE
          </span>
          <span className="hidden sm:inline text-orange-100">Care daily. Live fully.</span>
        </div>
        <div className="flex items-center gap-3">
          {dueNowCount > 0 && (
            <button
              onClick={() => onNavigate("today_doses")}
              className="bg-white text-[#FF5A36] px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-orange-50 transition-colors shadow-2xs animate-pulse"
            >
              <Clock className="w-3 h-3" /> {dueNowCount} Due Now
            </button>
          )}
          {lowStockCount > 0 && (
            <button
              onClick={() => onNavigate("refill_inventory")}
              className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-amber-300 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" /> {lowStockCount} Low Stock
            </button>
          )}
          <span className="text-white/90 text-[11px] font-medium hidden md:inline">
            Adherence: <strong className="text-white font-bold">{adherencePercent}%</strong>
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center transition-colors border border-orange-200/60"
              title="Back to Services"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8C68] text-white flex items-center justify-center shadow-sm shadow-orange-500/20">
              <Pill className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  Care2Care <span className="text-[#FF5A36]">Medicine</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-md font-semibold">
                  Smart Dosing
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pill Timetable, Smart Refills & Family Sync
              </p>
            </div>
          </div>
        </div>

        {/* Right: Fast Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200/80 rounded-2xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95"
            title="Scan Prescription with AI OCR"
          >
            <Camera className="w-4 h-4 text-[#FF5A36]" />
            <span className="hidden sm:inline">Scan Rx</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-bold transition-all shadow-sm shadow-orange-500/25 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Medicine</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};
