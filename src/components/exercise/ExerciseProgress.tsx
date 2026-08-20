import React, { useState } from "react";
import { BarChart3, TrendingUp, Sparkles, ChevronRight, Activity, Target } from "lucide-react";

export const ExerciseProgress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "strength" | "endurance">("overview");

  const weeklyBars = [
    { label: "1-7", count: 2, height: "45%" },
    { label: "8-14", count: 3, height: "65%" },
    { label: "15-21", count: 4, height: "85%" },
    { label: "22-28", count: 3, height: "65%" },
    { label: "29-31", count: 5, height: "100%" },
  ];

  const muscleBreakdown = [
    { name: "Chest", pct: 30, color: "#FF5A36" },
    { name: "Back", pct: 25, color: "#FF8B6B" },
    { name: "Legs", pct: 20, color: "#10B981" },
    { name: "Shoulders", pct: 15, color: "#3B82F6" },
    { name: "Arms", pct: 10, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("strength")}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "strength"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Strength
        </button>
        <button
          onClick={() => setActiveTab("endurance")}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "endurance"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Endurance
        </button>
      </div>

      {/* WORKOUTS COMPLETED BAR CHART */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              Workouts Completed
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">12</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                +20% from last month
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
            This Month
          </span>
        </div>

        {/* BARS VISUAL */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-2xs">
          <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2">
            {weeklyBars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-black text-slate-400">{bar.count}</span>
                <div
                  style={{ height: bar.height }}
                  className="w-full max-w-[36px] bg-gradient-to-t from-[#FF5A36] to-[#FF8B6B] rounded-t-xl transition-all hover:brightness-110 shadow-2xs"
                />
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MUSCLE FOCUS BREAKDOWN */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#FF5A36]" />
            Muscle Focus Distribution
          </h4>
          <span className="text-xs font-bold text-slate-500">Last 30 Days</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-2xs flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Circular Donut Visual */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" className="stroke-orange-100" strokeWidth="12" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#FF5A36"
                strokeWidth="12"
                strokeDasharray={`${(30 / 100) * (2 * Math.PI * 38)} ${2 * Math.PI * 38}`}
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#FF8B6B"
                strokeWidth="12"
                strokeDasharray={`${(25 / 100) * (2 * Math.PI * 38)} ${2 * Math.PI * 38}`}
                strokeDashoffset={-((30 / 100) * (2 * Math.PI * 38))}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-slate-900">100%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Volume</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="space-y-2 w-full sm:w-auto">
            {muscleBreakdown.map((m) => (
              <div key={m.name} className="flex items-center justify-between gap-6 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span>{m.name}</span>
                </div>
                <span className="font-black text-slate-900">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
