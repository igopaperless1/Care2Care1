import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  CheckCircle2,
  PieChart as PieIcon,
  Award,
  Zap,
  Target,
  Clock,
  Filter
} from "lucide-react";

export interface AnalyticsMetric {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
}

export interface ChartDataPoint {
  day: string;
  val1: number;
  val2?: number;
  target?: number;
}

interface ServiceAnalyticsDashboardProps {
  title: string;
  subtitle?: string;
  metrics: AnalyticsMetric[];
  chartData: ChartDataPoint[];
  chartLabel1?: string;
  chartLabel2?: string;
  unit?: string;
  category?: string;
  accentColor?: string;
}

export const ServiceAnalyticsDashboard: React.FC<ServiceAnalyticsDashboardProps> = ({
  title,
  subtitle = "Visual performance, weekly completion & trend insights",
  metrics,
  chartData,
  chartLabel1 = "Actual",
  chartLabel2 = "Target",
  unit = "",
  category = "Health & Care",
  accentColor = "#2E7D32"
}) => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");

  // Calculate maximum value for bar charts
  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.val1 || 0, d.val2 || 0, d.target || 0, 10)),
    10
  );

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 my-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-black shadow-xs shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">{title} Analytics</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] text-[10px] font-extrabold uppercase">
                {category}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {(["week", "month", "year"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                timeframe === tf
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1 hover:border-[#2E7D32]/40 transition-all"
          >
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block truncate">
              {metric.label}
            </span>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {metric.value}
              </span>
              {metric.trend && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    metric.trend === "up"
                      ? "bg-emerald-100 text-[#2E7D32]"
                      : metric.trend === "down"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.trendValue || ""}
                </span>
              )}
            </div>
            {metric.subtext && (
              <p className="text-[10px] text-slate-500 font-medium truncate">{metric.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Visual Bar Chart Visualization */}
      <div className="bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#2E7D32]" />
            <span>Weekly Log Activity & Target Completion</span>
          </span>
          <div className="flex items-center gap-3 text-[10px] font-extrabold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#2E7D32]" />
              {chartLabel1}
            </span>
            {chartData.some((d) => d.target !== undefined) && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                {chartLabel2}
              </span>
            )}
          </div>
        </div>

        {/* Custom HTML Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 px-1 border-b border-slate-200">
          {chartData.map((pt, i) => {
            const h1 = Math.round(((pt.val1 || 0) / maxVal) * 100);
            const h2 = pt.target ? Math.round((pt.target / maxVal) * 100) : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Actual Bar */}
                  <div
                    style={{ height: `${Math.max(h1, 6)}%` }}
                    className="w-full max-w-[28px] bg-[#2E7D32] hover:bg-[#1b5e20] rounded-t-lg transition-all relative group-hover:shadow-md cursor-pointer flex items-center justify-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap z-10">
                      {pt.val1} {unit}
                    </span>
                  </div>

                  {/* Target Bar */}
                  {pt.target !== undefined && (
                    <div
                      style={{ height: `${Math.max(h2, 6)}%` }}
                      className="w-full max-w-[14px] bg-amber-400/80 hover:bg-amber-500 rounded-t-lg transition-all relative group-hover:shadow-md cursor-pointer"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-amber-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap z-10">
                        Goal: {pt.target} {unit}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-extrabold text-slate-600">{pt.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
