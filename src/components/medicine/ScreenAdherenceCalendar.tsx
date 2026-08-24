import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Flame,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { MedicineTab } from "./types";

interface ScreenAdherenceCalendarProps {
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenAdherenceCalendar: React.FC<ScreenAdherenceCalendarProps> = ({
  onNavigate
}) => {
  const currentStreak = 14;
  const bestStreak = 21;
  const totalDaysTracked = 30;

  // Generate 21 days for the 3-week challenge heatmap
  const days = Array.from({ length: 21 }, (_, i) => {
    const dayNum = i + 1;
    let status: "full" | "partial" | "missed" | "future" = "full";
    if (dayNum > 14) status = "future";
    else if (dayNum === 7 || dayNum === 12) status = "partial";
    else if (dayNum === 4) status = "missed";

    return {
      day: dayNum,
      status,
      takenPct: status === "full" ? 100 : status === "partial" ? 66 : status === "missed" ? 0 : null
    };
  });

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Streak Hero Card */}
      <div className="bg-gradient-to-br from-[#6C3CE1] to-[#4A1FAD] text-white rounded-2xl p-5 shadow-md shadow-purple-950/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/15 text-amber-300">
              <Flame className="w-6 h-6 fill-amber-300" />
            </span>
            <div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">
                Active Adherence Streak
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {currentStreak} Days Strong!
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black">
            Goal: 21 Days
          </span>
        </div>

        {/* Challenge Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-white/90 font-bold">
            <span>21-Day Habit Formation Challenge</span>
            <span>{Math.round((currentStreak / 21) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${(currentStreak / 21) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. 21-Day Heatmap Grid */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1A1A1A]">
            📅 21-Day Habit Heatmap
          </h3>
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#8A8A8A]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]" /> 100% Taken
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F39C12]" /> Partial
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E74C3C]" /> Missed
            </span>
          </div>
        </div>

        {/* 3 weeks x 7 days grid */}
        <div className="grid grid-cols-7 gap-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((w, idx) => (
            <div key={idx} className="text-center text-[10px] font-black text-[#8A8A8A] pb-1">
              {w}
            </div>
          ))}

          {days.map((d) => {
            let bgClass = "bg-[#F5F5F5] text-[#8A8A8A]";
            if (d.status === "full") bgClass = "bg-[#2ECC71] text-white shadow-2xs";
            else if (d.status === "partial") bgClass = "bg-[#F39C12] text-white";
            else if (d.status === "missed") bgClass = "bg-[#E74C3C] text-white";

            return (
              <div
                key={d.day}
                className={`h-11 rounded-xl flex flex-col items-center justify-center font-black text-xs transition-all ${bgClass}`}
              >
                <span>Day {d.day}</span>
                {d.status !== "future" && (
                  <span className="text-[9px] font-bold opacity-90">
                    {d.takenPct}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Consistency Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1D5DB]/80 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
            Overall Rate
          </span>
          <span className="text-xl font-black text-[#6C3CE1]">94%</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1D5DB]/80 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
            Best Streak
          </span>
          <span className="text-xl font-black text-[#2ECC71]">21 Days</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1D5DB]/80 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-[#8A8A8A] uppercase block">
            Missed Doses
          </span>
          <span className="text-xl font-black text-[#E74C3C]">1</span>
        </div>
      </div>
    </div>
  );
};
