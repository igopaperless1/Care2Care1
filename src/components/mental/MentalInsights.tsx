import React from "react";
import {
  TrendingUp,
  Activity,
  Smile,
  Zap,
  Sun,
  Calendar,
  Sparkles,
  BarChart3,
  Flame,
  Droplets
} from "lucide-react";

export const MentalInsights: React.FC = () => {
  const weeklyTrend = [
    { day: "Thu", date: "8 May", score: 6.5, emoji: "😐" },
    { day: "Fri", date: "9 May", score: 7.2, emoji: "😊" },
    { day: "Sat", date: "10 May", score: 8.5, emoji: "😁" },
    { day: "Sun", date: "11 May", score: 9.0, emoji: "😁" },
    { day: "Mon", date: "12 May", score: 7.0, emoji: "😊" },
    { day: "Tue", date: "13 May", score: 7.8, emoji: "😊" },
    { day: "Wed", date: "14 May", score: 8.2, emoji: "😊" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Analytics & Trends
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">7-Day Wellbeing Insights</h2>
          <p className="text-xs text-slate-500 font-medium">Clear correlations between sleep, breathwork, and mood.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Weekly Mood Trend Chart in Peach */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            7-Day Mood Trajectory
          </span>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            +14% vs Last Week
          </span>
        </div>

        {/* Bar chart representation */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-orange-100 pb-2">
          {weeklyTrend.map((d, idx) => {
            const heightPercent = (d.score / 10) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#FF5A36]">
                  {d.score}
                </span>
                <span className="text-sm">{d.emoji}</span>
                <div className="w-full max-w-[32px] bg-orange-100 rounded-t-xl overflow-hidden h-full max-h-24 flex items-end">
                  <div
                    className="w-full bg-[#FF5A36] rounded-t-xl transition-all duration-700 group-hover:bg-[#E04826]"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-black text-slate-700 mt-1">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Correlated Positive Factors */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Key Drivers of Positive Mood
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200/60 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#FF5A36]">Top Contributor</span>
            <h4 className="text-sm font-black text-slate-900">7.5+ Hours Sleep</h4>
            <p className="text-xs text-slate-500 font-medium">+28% mood boost on days with full sleep rest.</p>
          </div>

          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200/60 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#FF5A36]">High Impact</span>
            <h4 className="text-sm font-black text-slate-900">Morning Walks</h4>
            <p className="text-xs text-slate-500 font-medium">92% of entries with outdoor walks rated "Great".</p>
          </div>

          <div className="p-4 bg-[#FFF9F5] rounded-2xl border border-orange-200/60 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#FF5A36]">Stress Shield</span>
            <h4 className="text-sm font-black text-slate-900">Box Breathing</h4>
            <p className="text-xs text-slate-500 font-medium">Reduced peak afternoon heart rate significantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
