import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Pill,
  Sparkles,
  Check,
  RotateCcw
} from "lucide-react";
import { DoseLogModel, MedicineTab } from "./types";
import { playMedicineTone } from "./soundUtil";

interface ScreenTodayDosesProps {
  todayDoses: DoseLogModel[];
  onOpenDoseAction: (dose: DoseLogModel) => void;
  onQuickMarkTaken: (doseId: string) => void;
  onQuickSnooze: (doseId: string) => void;
  onNavigate: (tab: MedicineTab) => void;
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

  return (
    <div className="space-y-4">
      {/* 1. Date Bar Navigation & Month Picker */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDateOffset((prev) => prev - 1)}
            className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center justify-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#FF5A36]" />
              <span>
                {new Date(Date.now() + selectedDateOffset * 86400000).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  weekday: "long"
                })}
              </span>
            </h3>
          </div>

          <button
            onClick={() => setSelectedDateOffset((prev) => prev + 1)}
            className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center transition-colors"
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
                onClick={() => setSelectedDateOffset(d.offset)}
                className={`py-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5A36] text-white shadow-sm shadow-orange-500/25 scale-105"
                    : d.isToday
                    ? "bg-orange-100/80 text-orange-950 font-bold border border-orange-200"
                    : "bg-orange-50/40 text-slate-600 hover:bg-orange-100/60"
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">{d.dayName}</span>
                <span className="text-sm sm:text-base font-black mt-0.5">{d.dateNum}</span>
              </button>
            );
          })}
        </div>

        {/* Daily Adherence Progress Bar */}
        <div className="pt-2 border-t border-orange-100/80">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600">Daily Adherence</span>
            <span className="text-[#FF5A36] font-black">
              {adherencePercent}% <span className="text-slate-400 font-medium">({takenCount} of {totalCount} taken)</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#FF5A36] transition-all duration-500 rounded-full"
              style={{ width: `${adherencePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Doses Timeline by Time Slots */}
      <div className="space-y-4">
        {/* Morning Section */}
        {morningDoses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Morning Dose • 08:00 AM
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Completed
              </span>
            </div>

            {morningDoses.map((dose) => (
              <div
                key={dose.id}
                className="bg-white rounded-3xl p-4 border border-orange-100 shadow-2xs hover:border-orange-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{dose.medicineName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{dose.dosage}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">Taken at {dose.takenAt || "08:05 AM"}</span>
                    </p>
                  </div>
                </div>

                {dose.photoProofUrl ? (
                  <div
                    title="Photo Proof Captured"
                    className="w-8 h-8 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={dose.photoProofUrl}
                      alt="Proof"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-emerald-600 font-bold px-2.5 py-1 bg-emerald-50 rounded-xl">
                    Taken
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Afternoon Section (Due Now) */}
        {afternoonDoses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5A36] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Afternoon Dose • 02:00 PM
              </span>
              <span className="text-[11px] font-bold text-white bg-[#FF5A36] px-2 py-0.5 rounded-full animate-pulse">
                Due Now
              </span>
            </div>

            {afternoonDoses.map((dose) => {
              const isTaken = dose.status === "Taken";
              return (
                <div
                  key={dose.id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border-2 ${
                    isTaken ? "border-emerald-200" : "border-[#FF5A36]/40"
                  } shadow-xs transition-all space-y-3`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF5A36] flex items-center justify-center flex-shrink-0 border border-orange-200">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{dose.medicineName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {dose.dosage} • Take with water after food
                        </p>
                      </div>
                    </div>

                    {!isTaken ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            playMedicineTone("take");
                            onOpenDoseAction(dose);
                          }}
                          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Log Dose</span>
                        </button>
                        <button
                          onClick={() => {
                            playMedicineTone("snooze");
                            onQuickSnooze(dose.id);
                          }}
                          className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-slate-700 font-bold text-xs rounded-2xl border border-orange-200"
                        >
                          Snooze
                        </button>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Taken
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Evening Section (Upcoming) */}
        {eveningDoses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> Evening Dose • 08:00 PM
              </span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Upcoming
              </span>
            </div>

            {eveningDoses.map((dose) => (
              <div
                key={dose.id}
                className="bg-white rounded-3xl p-4 border border-orange-100 shadow-2xs hover:border-orange-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{dose.medicineName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{dose.dosage} • 08:00 PM</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDoseAction(dose)}
                  className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] text-xs font-bold rounded-xl border border-orange-200/80"
                >
                  Take Early
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
