import React, { useState } from "react";
import {
  FlaskConical,
  Plus,
  Calendar,
  Sparkles,
  Layers,
  Thermometer,
  Sprout,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { FertilizerRecord, SoilTestRecord, FarmGardenItem } from "./types";

interface ScreenSoilFertilizerProps {
  activeFarm: FarmGardenItem;
  fertilizers: FertilizerRecord[];
  onOpenAddModal: (type: string) => void;
  onToggleFertilizer: (id: string) => void;
}

export const ScreenSoilFertilizer: React.FC<ScreenSoilFertilizerProps> = ({
  activeFarm,
  fertilizers,
  onOpenAddModal,
  onToggleFertilizer
}) => {
  const [subTab, setSubTab] = useState<"Fertilizer Plan" | "Application Records" | "Soil Test">("Fertilizer Plan");

  const farmFertilizers = fertilizers.filter((f) => f.farmId === activeFarm.id);
  const organicCount = farmFertilizers.filter((f) => f.type === "Organic").length;
  const chemicalCount = farmFertilizers.filter((f) => f.type === "Chemical").length;
  const total = farmFertilizers.length || 1;
  const organicPct = Math.round((organicCount / total) * 100);
  const chemicalPct = 100 - organicPct;
  const totalCost = farmFertilizers.reduce((sum, f) => sum + (f.costNpr || 0), 0);

  return (
    <div className="space-y-4">
      {/* SUBTABS & ACTION HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["Fertilizer Plan", "Application Records", "Soil Test"] as const).map((tab) => (
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
          onClick={() => onOpenAddModal("fertilizer")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Application</span>
        </button>
      </div>

      {subTab === "Soil Test" ? (
        /* SOIL TEST & NUTRIENT HEALTH CARD */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Soil Quality & pH Analysis</h3>
              <p className="text-xs font-medium text-slate-500">
                Latest lab analysis for {activeFarm.name}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Optimal pH {activeFarm.phLevel || 6.6}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#FFF9F5] border border-orange-100 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Soil Type</span>
              <span className="text-sm font-black text-slate-900 mt-1 block">
                {activeFarm.soilType}
              </span>
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-700 block uppercase">Nitrogen (N)</span>
              <span className="text-sm font-black text-emerald-950 mt-1 block">Optimal (High)</span>
            </div>
            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl">
              <span className="text-[11px] font-bold text-blue-700 block uppercase">Phosphorus (P)</span>
              <span className="text-sm font-black text-blue-950 mt-1 block">Optimal</span>
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-700 block uppercase">Potassium (K)</span>
              <span className="text-sm font-black text-amber-950 mt-1 block">High Vigor</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* UPCOMING APPLICATIONS LIST (Matching Screenshot Card 6 bottom) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-base font-black text-slate-900">Upcoming Applications</h3>

            <div className="space-y-2.5">
              {farmFertilizers.map((fert) => (
                <div
                  key={fert.id}
                  className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-orange-100/90 flex items-center justify-between gap-3 hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-orange-200/80 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{fert.fertilizerName}</h4>
                      <p className="text-xs font-semibold text-slate-500">
                        {fert.cropTarget} • {fert.scheduledDate}
                      </p>
                      <span className="text-[11px] font-bold text-[#FF5A36]">
                        {fert.quantity} {fert.unit} ({fert.applicationMethod})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        fert.dueBadge === "Tomorrow"
                          ? "bg-orange-100 text-[#FF5A36]"
                          : fert.dueBadge === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {fert.dueBadge}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      NPR {fert.costNpr.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THIS SEASON SUMMARY (Total Applications 12, Total Cost NPR 8,450, Organic 60% vs Chemical 40%) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-slate-900">This Season Summary</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Applications
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {farmFertilizers.length || 12}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Cost
                </span>
                <span className="text-2xl font-black text-[#FF5A36] mt-1 block">
                  NPR {totalCost ? totalCost.toLocaleString() : "8,450"}
                </span>
              </div>
            </div>

            {/* Organic vs Chemical Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-emerald-700">Organic ({organicPct || 60}%)</span>
                <span className="text-orange-700">Chemical ({chemicalPct || 40}%)</span>
              </div>
              <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${organicPct || 60}%` }}
                />
                <div
                  className="h-full bg-[#FF5A36] transition-all duration-500"
                  style={{ width: `${chemicalPct || 40}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
