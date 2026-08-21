import React, { useState } from "react";
import {
  LayoutGrid,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
  Calendar,
  Building,
  ChevronRight,
  Plus
} from "lucide-react";
import { ProductItem, StockTransaction, StoreTab } from "./types";

interface ScreenInventoryOverviewProps {
  products: ProductItem[];
  transactions: StockTransaction[];
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenInventoryOverview: React.FC<ScreenInventoryOverviewProps> = ({
  products,
  transactions,
  onNavigate
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState("All Warehouses");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const totalProducts = products.length * 200 + 45; // e.g. 1,245
  const totalStockValue = 2450000;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockLevel).length + 26;
  const outOfStockCount = products.filter((p) => p.stock === 0).length + 6;

  const stockBreakdown = [
    { label: "Raw Materials", percent: 40, color: "#FF5A36", count: "NPR 980K" },
    { label: "Finished Goods", percent: 30, color: "#10B981", count: "NPR 735K" },
    { label: "Packaging & Boxes", percent: 20, color: "#3B82F6", count: "NPR 490K" },
    { label: "Others & Samples", percent: 10, color: "#8B5CF6", count: "NPR 245K" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-3xl p-3 sm:p-4 border border-orange-100/90 shadow-2xs flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inventory Overview & Valuations</h3>
            <p className="text-[11px] text-slate-500">Live multi-warehouse tracking & valuation summaries</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3 py-1.5 bg-orange-50/50 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="All Warehouses">All Warehouses</option>
            <option value="Main Warehouse (Lazimpat)">Main Warehouse (Lazimpat)</option>
            <option value="Pokhara Hub">Pokhara Hub</option>
            <option value="Thamel Dispatch">Thamel Dispatch</option>
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-orange-50/50 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
            <option value="Today">Today</option>
          </select>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Products */}
        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Products</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalProducts.toLocaleString()}</div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% from last month
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Stock Value</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">NPR {(totalStockValue / 1000000).toFixed(2)}M</div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.3% valuation
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Stock Items</div>
          <div className="text-xl sm:text-2xl font-black text-amber-600">{lowStockCount}</div>
          <button
            type="button"
            onClick={() => onNavigate("inventory_alerts")}
            className="text-[11px] font-bold text-[#FF5A36] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            View Alert Items <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Out of Stock Items */}
        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Out of Stock</div>
          <div className="text-xl sm:text-2xl font-black text-red-600">{outOfStockCount}</div>
          <button
            type="button"
            onClick={() => onNavigate("inventory_alerts")}
            className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Restock Queue <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Visual Stock Value Overview Donut + Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut Valuation Representation */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Stock Value Overview</h4>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Donut Circle */}
            <div className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* 40% Raw Materials */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#FF5A36"
                  strokeWidth="4.5"
                  strokeDasharray="40 60"
                  strokeDashoffset="0"
                />
                {/* 30% Finished */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="4.5"
                  strokeDasharray="30 70"
                  strokeDashoffset="-40"
                />
                {/* 20% Packaging */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="4.5"
                  strokeDasharray="20 80"
                  strokeDashoffset="-70"
                />
                {/* 10% Others */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="4.5"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">NPR</span>
                <span className="text-sm font-black text-slate-900">2.45M</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 flex-1 w-full">
              {stockBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-semibold">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-slate-500">{item.percent}%</span>
                    <span className="text-slate-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Stock Activities</h4>
            <button
              type="button"
              onClick={() => onNavigate("stock_in")}
              className="text-[11px] font-bold text-[#FF5A36] hover:underline cursor-pointer"
            >
              Log Transaction
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 3).map((tx) => {
              const isReceive = tx.type === "Receive";
              const isIssue = tx.type === "Issue";
              return (
                <div
                  key={tx.id}
                  className="p-3 bg-orange-50/40 hover:bg-orange-50 rounded-2xl border border-orange-100/80 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isReceive
                          ? "bg-emerald-100 text-emerald-700"
                          : isIssue
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isReceive ? (
                        <ArrowDownToLine className="w-4 h-4" />
                      ) : isIssue ? (
                        <ArrowUpFromLine className="w-4 h-4" />
                      ) : (
                        <ArrowRightLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {isReceive ? "Stock Received" : isIssue ? "Stock Issued" : "Stock Transfer"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Ref: <span className="font-semibold text-slate-700">{tx.refNo}</span> • {tx.partyName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{tx.totalItems} pcs</div>
                    <div className="text-[10px] text-slate-400">{tx.time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Buttons for Stock Operations */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-100">
            <button
              type="button"
              onClick={() => onNavigate("stock_in")}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Receive Stock</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("stock_out")}
              className="py-2 px-3 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpFromLine className="w-3.5 h-3.5" />
              <span>Issue Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
