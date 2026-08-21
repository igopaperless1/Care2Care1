import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
  Printer,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Package
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { MONTHLY_TREND_DATA } from "./mockData";
import { InventoryItemModel } from "./types";

interface ScreenReportsAnalyticsProps {
  items: InventoryItemModel[];
  onExportPdf: () => void;
}

export const ScreenReportsAnalytics: React.FC<ScreenReportsAnalyticsProps> = ({
  items,
  onExportPdf
}) => {
  const [period, setPeriod] = useState("This Month");

  const topMovingItems = [
    {
      id: "1",
      name: "Steel Rod 12mm",
      quantity: "850 pcs",
      image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "2",
      name: "Cement OPC 43",
      quantity: "420 bags",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&auto=format&fit=crop&q=80"
    },
    {
      id: "3",
      name: "PVC Pipe 2 inch",
      quantity: "300 pcs",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=100&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER & PERIOD FILTER (Matching Screenshot Card 8) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-xs font-bold text-slate-500">
            Financial & Stock Turnover Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Today">Today</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
          </select>

          <button
            onClick={onExportPdf}
            className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 4 METRIC CARDS (Matching Screenshot Card 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Value */}
        <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-2xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block">Total Value</span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">NPR 2,450,000</h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +8.5%
          </p>
        </div>

        {/* Total Inward */}
        <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-2xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block">Total Inward</span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">NPR 850,000</h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12.3%
          </p>
        </div>

        {/* Total Outward */}
        <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-2xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block">Total Outward</span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">NPR 620,000</h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +9.1%
          </p>
        </div>

        {/* Total Profit */}
        <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-2xs">
          <span className="text-[11px] font-black uppercase text-slate-400 block">Total Profit</span>
          <h3 className="text-lg sm:text-xl font-black text-[#FF5A36] mt-1">NPR 230,000</h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +15.2%
          </p>
        </div>
      </div>

      {/* STOCK VALUE TREND LINE CHART (Matching Screenshot Card 8) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Stock Value Trend (in Millions NPR)
          </h3>
          <span className="text-[11px] font-bold text-slate-500 bg-[#FFF9F5] px-2.5 py-0.5 rounded-full border border-orange-200">
            6-Month Valuation
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FEE2D5" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 3]} tickFormatter={(v) => `${v}M`} />
              <Tooltip
                formatter={(value: any) => [`NPR ${Number(value) * 1000000}`, "Valuation"]}
                contentStyle={{
                  backgroundColor: "#FFF9F5",
                  borderColor: "#FDBA74",
                  borderRadius: "1rem",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP MOVING ITEMS LIST (Matching Screenshot Card 8) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 tracking-tight">
          Top Moving Items
        </h3>

        <div className="space-y-2.5">
          {topMovingItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover border border-orange-200 shrink-0"
                />
                <span className="text-xs font-black text-slate-900">{item.name}</span>
              </div>
              <span className="text-xs font-black text-slate-800 bg-white px-3 py-1 rounded-xl border border-orange-200">
                {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
