import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  DollarSign,
  Award
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";
import { FarmGardenItem } from "./types";
import { FINANCIAL_ANALYTICS_DATA } from "./mockData";

interface ScreenReportsAnalyticsProps {
  activeFarm: FarmGardenItem;
  onExportPdf: () => void;
}

export const ScreenReportsAnalytics: React.FC<ScreenReportsAnalyticsProps> = ({
  activeFarm,
  onExportPdf
}) => {
  const [timeframe, setTimeframe] = useState<"This Season" | "This Month" | "This Year" | "All Time">("This Season");

  return (
    <div className="space-y-4">
      {/* TIMEFRAME HEADER & PDF BUTTON */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Period:</span>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="appearance-none bg-orange-50 text-slate-900 text-xs font-black pl-3 pr-7 py-1.5 rounded-xl border border-orange-200 focus:outline-hidden cursor-pointer"
            >
              <option value="This Season">This Season</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={onExportPdf}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* 3 HIGH-LEVEL METRIC CARDS (Total Cost NPR 48,750, Total Yield 1,250 kg, Net Profit NPR 85,300) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Cost
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
            NPR {FINANCIAL_ANALYTICS_DATA.totalCostNpr.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">
            Seeds, Labor & Inputs
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Yield
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">
            {FINANCIAL_ANALYTICS_DATA.totalYieldKg.toLocaleString()} kg
          </span>
          <span className="text-[10px] font-medium text-emerald-600 mt-0.5 block">
            Across 6 crop types
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Profit
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#FF5A36] mt-1 block">
            NPR {FINANCIAL_ANALYTICS_DATA.netProfitNpr.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium text-[#FF5A36] mt-0.5 block">
            ROI +175%
          </span>
        </div>
      </div>

      {/* COST VS YIELD CHART (Matching Screenshot Card 11) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">Cost vs Yield Trend</h3>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Cost (NPR)
            </span>
            <span className="flex items-center gap-1 text-[#FF5A36]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FF5A36] inline-block" /> Yield (kg)
            </span>
          </div>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={FINANCIAL_ANALYTICS_DATA.monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B", fontWeight: "bold" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              />
              <Bar dataKey="cost" fill="#10B981" radius={[6, 6, 0, 0]} name="Cost (NPR)" />
              <Bar dataKey="yieldKg" fill="#FF5A36" radius={[6, 6, 0, 0]} name="Yield (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={onExportPdf}
          className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 font-black text-sm rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span>View Detailed Report</span>
        </button>
      </div>
    </div>
  );
};
