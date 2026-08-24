import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Check,
  RotateCcw,
  Sparkles,
  Eye
} from "lucide-react";
import { DoseLogModel, MedicineTab } from "./types";
import { playMedicineTone } from "./soundUtil";

interface ScreenTodayDosesProps {
  todayDoses: DoseLogModel[];
  onOpenDoseAction: (dose: DoseLogModel) => void;
  onQuickMarkTaken: (doseId: string) => void;
  onQuickSnooze: (doseId: string) => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenTodayDoses: React.FC<ScreenTodayDosesProps> = ({
  todayDoses,
  onOpenDoseAction,
  onQuickMarkTaken,
  onQuickSnooze,
  onNavigate
}) => {
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0);

  // Generate 7 days centered on selected
  const days = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      offset,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: d.getDate(),
      isToday: offset === 0
    };
  });

  const takenCount = todayDoses.filter((d) => d.status === "Taken").length;
  const totalCount = todayDoses.length;
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  // Group doses by slot
  const morningDoses = todayDoses.filter((d) => d.slot === "Morning");
  const afternoonDoses = todayDoses.filter((d) => d.slot === "Afternoon");
  const eveningDoses = todayDoses.filter((d) => d.slot === "Evening" || d.slot === "Night");

  const renderSlotGroup = (title: string, icon: string, doses: DoseLogModel[]) => {
    if (doses.length === 0) return null;

    return (
      <div className="space-y-2.5">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#6C3CE1] flex items-center gap-1.5 px-1">
          <span>{icon}</span>
          <span>{title} ({doses.length})</span>
        </h4>

        <div className="space-y-2.5">
          {doses.map((dose) => {
            const isTaken = dose.status === "Taken";
            const isSnoozed = dose.status === "Snoozed";
            const isSkipped = dose.status === "Skipped";

            return (
              <div
                key={dose.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center justify-between gap-3 ${
                  isTaken
                    ? "border-emerald-200 bg-emerald-50/20"
                    : isSnoozed
                    ? "border-amber-200 bg-amber-50/20"
                    : "border-[#D1D5DB]/80 hover:border-[#6C3CE1]/50"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 ${
                      isTaken
                        ? "bg-[#2ECC71] text-white"
                        : "bg-[#F3F0FF] text-[#6C3CE1]"
                    }`}
                  >
                    {isTaken ? "✓" : "💊"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className={`text-sm font-black truncate ${isTaken ? "text-[#4A4A4A] line-through" : "text-[#1A1A1A]"}`}>
                        {dose.medicineName}
                      </h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F3F0FF] text-[#6C3CE1]">
                        {dose.dosage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#4A4A4A] mt-0.5">
                      <span className="font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6C3CE1]" /> {dose.scheduledTime}
                      </span>
                      {dose.takenAt && (
                        <span className="text-[#2ECC71] font-bold">
                          • Taken at {dose.takenAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dose Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isTaken ? (
                    <span className="px-3 py-1 rounded-xl bg-[#2ECC71] text-white text-xs font-black shadow-2xs">
                      ✅ Taken
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          playMedicineTone("gentle_bell");
                          onQuickMarkTaken(dose.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2ECC71] hover:bg-emerald-600 active:scale-95 text-white text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Taken</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickSnooze(dose.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#F39C12] hover:bg-amber-600 active:scale-95 text-white text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                        title="Snooze 15 mins"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Snooze</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenDoseAction(dose)}
                        className="p-1.5 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white transition-colors cursor-pointer"
                        title="More Options"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Date Bar Navigation & Strip */}
      <div className="bg-white rounded-2xl p-4 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedDateOffset((prev) => prev - 1)}
            className="w-8 h-8 rounded-xl bg-[#F3F0FF] hover:bg-[#6C3CE1] hover:text-white text-[#6C3CE1] flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h3 className="text-sm sm:text-base font-black text-[#1A1A1A] flex items-center justify-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#6C3CE1]" />
              <span>
                {new Date(Date.now() + selectedDateOffset * 86400000).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  weekday: "short"
                })}
              </span>
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDateOffset((prev) => prev + 1)}
            className="w-8 h-8 rounded-xl bg-[#F3F0FF] hover:bg-[#6C3CE1] hover:text-white text-[#6C3CE1] flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Day Quick Strip */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((d) => {
            const isSelected = selectedDateOffset === d.offset;
            return (
              <button
                key={d.offset}
                type="button"
                onClick={() => setSelectedDateOffset(d.offset)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#6C3CE1] text-white shadow-xs scale-105"
                    : "bg-[#F5F5F5] hover:bg-[#F3F0FF] text-[#4A4A4A]"
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{d.dayName}</span>
                <span className="text-xs sm:text-sm font-black mt-0.5">{d.dateNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Today's Adherence Summary */}
      <div className="bg-white rounded-2xl p-4 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider block">
            Adherence Progress
          </span>
          <h4 className="text-base font-black text-[#1A1A1A]">
            {takenCount} of {totalCount} Doses Completed
          </h4>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-[#6C3CE1]">{adherencePercent}%</span>
          <span className="text-[10px] text-[#2ECC71] font-bold block">On Track</span>
        </div>
      </div>

      {/* 3. Slot-grouped Doses */}
      <div className="space-y-4">
        {renderSlotGroup("Morning Doses", "🌅", morningDoses)}
        {renderSlotGroup("Afternoon Doses", "☀️", afternoonDoses)}
        {renderSlotGroup("Evening & Bedtime Doses", "🌙", eveningDoses)}
      </div>
    </div>
  );
};
