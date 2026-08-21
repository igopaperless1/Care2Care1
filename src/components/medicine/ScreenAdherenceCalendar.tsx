import React from "react";
import {
  CalendarCheck,
  Flame,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  Share2
} from "lucide-react";
import { MedicineTab } from "./types";

interface ScreenAdherenceCalendarProps {
  onNavigate: (tab: MedicineTab) => void;
}

export const ScreenAdherenceCalendar: React.FC<ScreenAdherenceCalendarProps> = ({ onNavigate }) => {
  // Generate 21 days data
  const calendarDays = Array.from({ length: 21 }, (_, i) => {
    const dayNum = i + 1;
    let status: "full" | "partial" | "missed" | "future" = "full";
    if (dayNum === 4 || dayNum === 11) status = "partial";
    if (dayNum === 8) status = "missed";
    if (dayNum > 15) status = "future";

    return {
      dayNum,
      dateStr: `May ${dayNum}`,
      status,
      takenRatio: status === "full" ? "3/3" : status === "partial" ? "2/3" : status === "missed" ? "0/3" : "-/-"
    };
  });

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Header Streak & Trophy Card */}
      <div className="bg-gradient-to-r from-orange-500 to-[#FF5A36] text-white rounded-3xl p-5 shadow-sm shadow-orange-500/25 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Active Streak
            </div>
            <h3 className="text-2xl font-black">14 Consecutive Days!</h3>
            <p className="text-xs text-orange-100 mt-0.5">
              You are in the top 5% of consistent medication adherence.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-amber-300 shadow-xs">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* 2. 21-Day Matrix Grid */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">21-Day Habit Formation Cycle</h4>
            <p className="text-xs text-slate-500">Target: Build automatic daily medication adherence</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            92% Compliance
          </span>
        </div>

        {/* 7 columns x 3 rows grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((d) => (
            <div
              key={d.dayNum}
              className={`p-2 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                d.status === "full"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                  : d.status === "partial"
                  ? "bg-amber-50 border-amber-300 text-amber-950 font-bold"
                  : d.status === "missed"
                  ? "bg-red-50 border-red-300 text-red-950 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <span className="text-xs font-black">Day {d.dayNum}</span>
              <div className="my-1">
                {d.status === "full" && <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto" />}
                {d.status === "partial" && <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto" />}
                {d.status === "missed" && <div className="w-3 h-3 rounded-full bg-red-500 mx-auto" />}
                {d.status === "future" && <div className="w-3 h-3 rounded-full bg-slate-300 mx-auto" />}
              </div>
              <span className="text-[9px] font-bold opacity-80">{d.takenRatio}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-2 border-t border-orange-100 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>100% Taken</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Partial / Snoozed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* 3. Breakdown Metrics */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-orange-100/90 text-center shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Scheduled</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">63 Doses</div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-orange-100/90 text-center shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Taken on Time</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">58 Doses</div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-orange-100/90 text-center shadow-2xs">
          <div className="text-xs font-bold text-slate-500">Missed / Late</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">5 Doses</div>
        </div>
      </div>
    </div>
  );
};
