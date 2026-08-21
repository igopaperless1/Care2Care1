import React from "react";
import {
  Sprout,
  Plus,
  ChevronDown,
  Calendar,
  Sparkles,
  Download,
  Share2,
  Bell,
  Layers,
  Search,
  ArrowLeft
} from "lucide-react";
import { FarmGardenItem, FarmTab } from "./types";

interface FarmHeaderProps {
  currentTab: FarmTab;
  activeFarm: FarmGardenItem;
  farms: FarmGardenItem[];
  onSelectFarm: (farmId: string) => void;
  onNavigate: (tab: FarmTab) => void;
  onOpenAddModal: (type: string) => void;
  onExportPdf: () => void;
  onBack?: () => void;
}

export const FarmHeader: React.FC<FarmHeaderProps> = ({
  currentTab,
  activeFarm,
  farms,
  onSelectFarm,
  onNavigate,
  onOpenAddModal,
  onExportPdf,
  onBack
}) => {
  return (
    <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* BRAND & TITLE */}
      <div className="flex items-center gap-3.5">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-slate-700 hover:bg-orange-50 hover:text-[#FF5A36] transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Back to Services"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs shrink-0">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
              Farm & Garden Service
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Care daily. Live fully.
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{activeFarm?.name || "Green Valley Farm"}</span>
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">
              ({activeFarm?.location || "Pokhara, Nepal"})
            </span>
          </h1>
        </div>
      </div>

      {/* RIGHT ACTIONS: FARM PICKER & QUICK BUTTONS */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* FARM SELECTOR DROPDOWN */}
        <div className="relative">
          <select
            value={activeFarm?.id || ""}
            onChange={(e) => onSelectFarm(e.target.value)}
            className="appearance-none bg-white text-slate-800 text-xs font-bold pl-3 pr-8 py-2 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-orange-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36] cursor-pointer"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.area} {f.areaUnit})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* ADD FARM BUTTON */}
        <button
          onClick={() => onOpenAddModal("farm")}
          className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Add New Farm or Plot"
        >
          <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span className="hidden sm:inline">Add Plot</span>
        </button>

        {/* QUICK ADD ACTION BUTTON */}
        <button
          onClick={() => onOpenAddModal("task")}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Quick Task</span>
        </button>

        {/* EXPORT REPORT BUTTON */}
        <button
          onClick={onExportPdf}
          className="p-2 bg-white hover:bg-orange-50 text-slate-700 rounded-2xl border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
          title="Download PDF Report"
        >
          <Download className="w-4 h-4 text-[#FF5A36]" />
        </button>
      </div>
    </div>
  );
};
