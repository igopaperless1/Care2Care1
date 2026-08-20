import React, { useState } from "react";
import { Sparkles, Calendar, Award, Dumbbell, Flame, TrendingUp, Download, CheckCircle2 } from "lucide-react";

export const ExerciseInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"insights" | "trends" | "reports">("insights");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TABS */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "insights"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab("trends")}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "trends"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Trends
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === "reports"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Reports
        </button>
      </div>

      {/* YOUR INSIGHTS CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF5A36]" />
            Your Insights
          </h3>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-0.5 rounded-full">
            This Week
          </span>
        </div>

        {/* INSIGHTS METRIC TILES */}
        <div className="space-y-2.5">
          {/* Most Active Day */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Most Active Day</span>
            </div>
            <span className="text-sm font-black text-slate-900">Wednesday</span>
          </div>

          {/* Best Performance */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Best Performance</span>
            </div>
            <span className="text-sm font-black text-slate-900">Bench Press (+5kg)</span>
          </div>

          {/* Total Volume Lifted */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Total Volume Lifted</span>
            </div>
            <span className="text-sm font-black text-slate-900">12,450 kg</span>
          </div>

          {/* Calories Burned */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Calories Burned</span>
            </div>
            <span className="text-sm font-black text-slate-900">2,450 kcal</span>
          </div>

          {/* Consistency Score */}
          <div className="bg-white rounded-2xl p-4 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Consistency Score</span>
                <span className="text-[11px] font-black text-emerald-600">Excellent Rhythm</span>
              </div>
            </div>

            {/* Circular score gauge */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" className="stroke-orange-100" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-emerald-500"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - 0.85)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">85%</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BUTTON */}
        <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Export Analytics & Performance PDF</span>
        </button>
      </div>
    </div>
  );
};
