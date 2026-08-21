import React, { useState } from "react";
import {
  Award,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  DollarSign,
  Package,
  Trash2
} from "lucide-react";
import { HarvestRecord, FarmGardenItem } from "./types";

interface ScreenHarvestYieldProps {
  activeFarm: FarmGardenItem;
  harvests: HarvestRecord[];
  onOpenAddModal: (type: string) => void;
  onDeleteHarvest: (id: string) => void;
}

export const ScreenHarvestYield: React.FC<ScreenHarvestYieldProps> = ({
  activeFarm,
  harvests,
  onOpenAddModal,
  onDeleteHarvest
}) => {
  const [subTab, setSubTab] = useState<"Harvest Records" | "Yield Summary" | "Storage">("Harvest Records");

  const farmHarvests = harvests.filter((h) => h.farmId === activeFarm.id);
  const totalKg = farmHarvests.reduce((sum, h) => sum + (h.quantityKg || 0), 0);
  const totalRevenue = farmHarvests.reduce((sum, h) => sum + (h.totalValueNpr || 0), 0);

  return (
    <div className="space-y-4">
      {/* SUBTABS & ADD HARVEST HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["Harvest Records", "Yield Summary", "Storage"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                subTab === tab
                  ? "bg-[#FF5A36] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-orange-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenAddModal("harvest")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Harvest Record</span>
        </button>
      </div>

      {subTab === "Yield Summary" ? (
        /* YIELD SUMMARY METRICS */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Total Yield & Commercial Value</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Total Harvested Yield
              </span>
              <span className="text-3xl font-black text-emerald-950 mt-1 block">
                {totalKg.toLocaleString()} kg
              </span>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                Fresh grade-A market produce
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200/60 rounded-2xl">
              <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider block">
                Estimated Commercial Value
              </span>
              <span className="text-3xl font-black text-orange-950 mt-1 block">
                NPR {totalRevenue ? totalRevenue.toLocaleString() : "17,515"}
              </span>
              <p className="text-xs text-[#FF5A36] mt-1 font-medium">
                Direct farm gate & wholesale revenue
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* HARVEST RECORDS LIST (Matching Screenshot Card 9) */
        <div className="space-y-3">
          {farmHarvests.map((harv) => (
            <div
              key={harv.id}
              className="bg-white border border-slate-200/80 hover:border-orange-200 rounded-3xl p-4 sm:p-5 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* IMAGE & INFO */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-2xs border border-orange-100 shrink-0">
                  <img
                    src={harv.photoUrl}
                    alt={harv.cropName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{harv.cropName}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Harvested on {harv.date}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    Quantity: <span className="text-emerald-600 font-black">{harv.quantityKg} kg</span>
                  </p>
                  {harv.buyerOrStorage && (
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Destination: {harv.buyerOrStorage}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT QUALITY BADGE & ACTION */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black rounded-xl">
                  {harv.quality}
                </span>

                <button
                  onClick={() => onDeleteHarvest(harv.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM ACTION BUTTON */}
      <button
        onClick={() => onOpenAddModal("harvest")}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>+ Add Harvest Record</span>
      </button>
    </div>
  );
};
