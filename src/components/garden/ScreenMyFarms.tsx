import React, { useState } from "react";
import {
  Trees,
  MapPin,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Droplets,
  Sprout,
  Sun,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { FarmGardenItem, FarmTab } from "./types";

interface ScreenMyFarmsProps {
  farms: FarmGardenItem[];
  activeFarmId: string;
  onSelectFarm: (farmId: string) => void;
  onNavigate: (tab: FarmTab) => void;
  onOpenAddModal: (type: string) => void;
  onDeleteFarm: (farmId: string) => void;
}

export const ScreenMyFarms: React.FC<ScreenMyFarmsProps> = ({
  farms,
  activeFarmId,
  onSelectFarm,
  onNavigate,
  onOpenAddModal,
  onDeleteFarm
}) => {
  const [filterType, setFilterType] = useState<"All" | "Farms" | "Gardens" | "Greenhouses">("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredFarms = farms.filter((f) => {
    if (filterType === "All") return true;
    if (filterType === "Farms") return f.type === "Farm" || f.type === "Orchard";
    if (filterType === "Gardens") return f.type === "Garden";
    if (filterType === "Greenhouses") return f.type === "Greenhouse" || f.type === "Polyhouse";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* FILTER TABS & ADD ACTION */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["All", "Farms", "Gardens", "Greenhouses"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                filterType === filter
                  ? "bg-[#FF5A36] text-white shadow-xs font-black"
                  : "bg-slate-100/80 text-slate-700 hover:bg-orange-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenAddModal("farm")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Farm / Plot</span>
        </button>
      </div>

      {/* FARMS LIST / CARDS (Matching Screenshot Card 1) */}
      <div className="space-y-3">
        {filteredFarms.map((farm) => {
          const isSelected = farm.id === activeFarmId;
          const isMenuOpen = activeMenuId === farm.id;

          return (
            <div
              key={farm.id}
              onClick={() => onSelectFarm(farm.id)}
              className={`bg-white border rounded-3xl p-4 sm:p-5 shadow-2xs transition-all cursor-pointer relative ${
                isSelected
                  ? "border-[#FF5A36] ring-2 ring-orange-200/60 bg-[#FFFDFB]"
                  : "border-slate-200/80 hover:border-orange-200 hover:shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* THUMBNAIL & TITLES */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-2xs border border-orange-100 shrink-0 relative">
                    <img
                      src={farm.photoUrl}
                      alt={farm.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <span className="absolute top-1 left-1 bg-[#FF5A36] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        Current
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {farm.name}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {farm.categoryDesc}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mt-1.5 flex-wrap">
                      <span className="bg-orange-50 text-[#FF5A36] px-2.5 py-0.5 rounded-lg border border-orange-100 font-black">
                        {farm.area} {farm.areaUnit}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">
                        {farm.soilType || "Rich Loam"}
                      </span>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-600 hidden sm:inline">
                        pH {farm.phLevel || 6.5}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT BADGES & 3-DOTS ACTION */}
                <div className="flex items-center gap-3 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-xl">
                    {farm.status}
                  </span>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : farm.id);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* CONTEXT MENU DROPDOWN */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={() => {
                            onSelectFarm(farm.id);
                            onNavigate("dashboard");
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 flex items-center gap-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>Open Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectFarm(farm.id);
                            onNavigate("sowing");
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 flex items-center gap-2"
                        >
                          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Manage Crops</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectFarm(farm.id);
                            onNavigate("irrigation");
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 flex items-center gap-2"
                        >
                          <Droplets className="w-3.5 h-3.5 text-blue-500" />
                          <span>Irrigation Lines</span>
                        </button>
                        {farms.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${farm.name}?`)) {
                                onDeleteFarm(farm.id);
                              }
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Farm</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
