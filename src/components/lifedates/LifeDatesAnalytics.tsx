import React, { useState } from "react";
import {
  TrendingUp,
  Calendar,
  Sparkles,
  Flame,
  Award,
  BarChart3,
  Heart,
  ChevronDown
} from "lucide-react";
import { LifeEventItem } from "./types";

interface LifeDatesAnalyticsProps {
  events: LifeEventItem[];
}

export const LifeDatesAnalytics: React.FC<LifeDatesAnalyticsProps> = ({ events }) => {
  const [activeTab, setActiveTab] = useState<"Overview" | "Events" | "Streaks">("Overview");

  // Monthly breakdown for bar chart
  const monthsData = [
    { month: "Jan", count: 2 },
    { month: "Feb", count: 3 },
    { month: "Mar", count: 4 },
    { month: "Apr", count: 3 },
    { month: "May", count: 8, isPeak: true },
    { month: "Jun", count: 6 },
    { month: "Jul", count: 4 },
    { month: "Aug", count: 2 },
    { month: "Sep", count: 3 },
    { month: "Oct", count: 5 },
    { month: "Nov", count: 4 },
    { month: "Dec", count: 7 },
  ];

  return (
    <div className="space-y-4">
      {/* FILTER TABS */}
      <div className="flex items-center gap-2">
        {(["Overview", "Events", "Streaks"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              activeTab === tab
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : "bg-[#FFF9F5] hover:bg-[#FFEFE8] text-slate-700 border-orange-200/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* THIS YEAR OVERVIEW: 3 METRIC CARDS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
          This Year Overview (2025)
        </h3>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
          <div className="bg-white border border-orange-200/80 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              34
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Total Events
            </span>
          </div>

          <div className="bg-white border border-orange-200/80 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">
              12
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Upcoming
            </span>
          </div>

          <div className="bg-white border border-orange-200/80 rounded-2xl p-3.5 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">
              22
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* EVENTS TIMELINE LINE GRAPH */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Events Timeline</h3>
            <p className="text-xs text-slate-500">Distribution over annual cycle</p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-orange-200 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700">
            <span>(This Year)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="bg-white border border-orange-200/60 rounded-2xl p-4 shadow-2xs">
          <div className="h-44 relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="eventGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF5A36" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d="M 0,90 Q 60,70 120,40 T 240,20 T 320,60 T 400,30 L 400,120 L 0,120 Z"
                fill="url(#eventGrad)"
              />
              {/* Line */}
              <path
                d="M 0,90 Q 60,70 120,40 T 240,20 T 320,60 T 400,30"
                fill="none"
                stroke="#FF5A36"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Point dots */}
              <circle cx="0" cy="90" r="4" fill="#FF5A36" />
              <circle cx="60" cy="75" r="4" fill="#FF5A36" />
              <circle cx="120" cy="40" r="4" fill="#FF5A36" />
              <circle cx="180" cy="50" r="4" fill="#FF5A36" />
              <circle cx="240" cy="20" r="5" fill="#FF5A36" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="320" cy="60" r="4" fill="#FF5A36" />
              <circle cx="400" cy="30" r="4" fill="#FF5A36" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-100">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>
      </div>

      {/* MOST CELEBRATED MONTH BAR CHART */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Most Celebrated Month</h3>
            <p className="text-xs font-bold text-[#FF5A36]">May (8 Events Scheduled)</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-orange-100 px-2.5 py-0.5 rounded-full">
            Peak Season
          </span>
        </div>

        <div className="bg-white border border-orange-200/60 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-end justify-between gap-1.5 h-36 pt-4">
            {monthsData.map((m) => {
              const heightPercent = (m.count / 8) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-black text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-24 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        m.isPeak
                          ? "bg-gradient-to-t from-[#EA4C27] to-[#FF5A36]"
                          : "bg-orange-200 hover:bg-orange-300"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      m.isPeak ? "text-[#FF5A36] font-black" : "text-slate-500"
                    }`}
                  >
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STREAK & CONNECTION MILESTONE BANNER */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-3xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">Celebration Consistency</h4>
            <p className="text-[11px] font-bold text-orange-800">
              100% on-time memory & reminder readiness
            </p>
          </div>
        </div>
        <Award className="w-6 h-6 text-[#FF5A36]" />
      </div>
    </div>
  );
};
