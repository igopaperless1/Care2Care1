import React from "react";
import {
  Droplets,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { IrrigationZone, FarmGardenItem } from "./types";

interface ScreenIrrigationProps {
  activeFarm: FarmGardenItem;
  irrigationZones: IrrigationZone[];
  onOpenAddModal: (type: string) => void;
  onToggleZoneStatus: (zoneId: string) => void;
}

export const ScreenIrrigation: React.FC<ScreenIrrigationProps> = ({
  activeFarm,
  irrigationZones,
  onOpenAddModal,
  onToggleZoneStatus
}) => {
  const farmZones = irrigationZones.filter((z) => z.farmId === activeFarm.id);
  const doneZones = farmZones.filter((z) => z.status === "Done").length;
  const completionPct = farmZones.length > 0 ? Math.round((doneZones / farmZones.length) * 100) : 80;

  return (
    <div className="space-y-4">
      {/* 2 HIGH LEVEL CARDS (Matching Screenshot Card 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Today's Watering */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Today's Watering
            </span>
            <div className="text-xl font-black text-slate-900 flex items-center gap-1.5">
              <span>Completed</span>
              <span className="text-[#FF5A36]">{completionPct}%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {doneZones} of {farmZones.length} zones watered
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-2xs shrink-0">
            <Droplets className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        {/* Next Irrigation */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Next Irrigation
            </span>
            <div className="text-lg font-black text-slate-900">
              16 May 2025
            </div>
            <p className="text-xs font-bold text-blue-600">
              07:00 AM • Zone B (Sprinkler)
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A36] shadow-2xs shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* IRRIGATION ZONES LIST */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Irrigation Zones</h3>
            <p className="text-xs font-medium text-slate-500">
              Automated and manual drip lines across fields
            </p>
          </div>
          <button
            onClick={() => onOpenAddModal("irrigation")}
            className="text-xs font-black text-[#FF5A36] hover:underline cursor-pointer"
          >
            + Add Zone
          </button>
        </div>

        <div className="space-y-3">
          {farmZones.map((zone) => {
            const isDone = zone.status === "Done";
            const isScheduled = zone.status === "Scheduled";
            const isUpcoming = zone.status === "Upcoming";

            return (
              <div
                key={zone.id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-200 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-blue-500 shadow-2xs shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{zone.zoneName}</h4>
                    <p className="text-xs font-semibold text-slate-500">
                      {zone.method} • {zone.scheduledTime}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-slate-400">
                      <span>{zone.volumeLiters} L volume</span>
                      <span>•</span>
                      <span>{zone.durationMinutes} mins duration</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <button
                    onClick={() => onToggleZoneStatus(zone.id)}
                    className={`px-3.5 py-1.5 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : isScheduled
                        ? "bg-orange-100 text-[#FF5A36] border-orange-200 hover:bg-orange-200"
                        : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                    }`}
                  >
                    {zone.status === "Done" ? "✓ Done" : zone.status}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <button
          onClick={() => onOpenAddModal("irrigation")}
          className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 font-black text-sm rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Irrigation Task</span>
        </button>
      </div>
    </div>
  );
};
