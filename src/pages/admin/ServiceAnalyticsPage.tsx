import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Users,
  Activity
} from "lucide-react";

interface ServiceAnalyticsPageProps {
  showToast?: (msg: string) => void;
}

export const ServiceAnalyticsPage: React.FC<ServiceAnalyticsPageProps> = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const serviceBreakdown = [
    { name: "Walk & Steps", users: 12540, percent: 27, color: "bg-emerald-500" },
    { name: "Hydration / Water", users: 11230, percent: 24, color: "bg-blue-500" },
    { name: "Sleep & Recovery", users: 9875, percent: 21, color: "bg-purple-500" },
    { name: "Medicine Adherence", users: 7420, percent: 16, color: "bg-amber-500" },
    { name: "Nutrition & Diet", users: 6890, percent: 15, color: "bg-rose-500" },
    { name: "Mental Health", users: 4850, percent: 10, color: "bg-teal-500" }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                Deep Telemetry
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Interaction Volumes
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Service Analytics & Utilization Metrics
            </h1>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a274c] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center shadow-xs">
          {(["7d", "30d", "90d", "1y"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                period === p
                  ? "bg-[#FF5A36] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-2">
          <div className="text-slate-400 text-xs font-bold">Total Service Invocations</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">642,890</div>
          <div className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% growth vs previous period
          </div>
        </div>

        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-2">
          <div className="text-slate-400 text-xs font-bold">Average Daily Active Sessions</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">18,450</div>
          <div className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.1% engagement rate
          </div>
        </div>

        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-2">
          <div className="text-slate-400 text-xs font-bold">Platform Retention (30-Day)</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">84.2%</div>
          <div className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Top 5% in Health OS Category
          </div>
        </div>
      </div>

      {/* Service Breakdown Bars */}
      <div className="bg-white dark:bg-[#131d38] p-6 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-4">
        <h3 className="font-black text-base text-slate-900 dark:text-white">Service Usage Distribution</h3>
        <div className="space-y-4">
          {serviceBreakdown.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {item.users.toLocaleString()} users ({item.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${item.percent * 3}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
