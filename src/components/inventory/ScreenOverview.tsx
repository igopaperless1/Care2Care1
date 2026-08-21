import React from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ClipboardCheck,
  Plus,
  ChevronRight,
  Sparkles,
  Barcode,
  Layers,
  Building2,
  FileSpreadsheet
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  InventoryItemModel,
  WarehouseModel,
  ActivityLogModel,
  CategoryModel,
  InventoryTab
} from "./types";

interface ScreenOverviewProps {
  items: InventoryItemModel[];
  warehouses: WarehouseModel[];
  activities: ActivityLogModel[];
  categories: CategoryModel[];
  selectedWarehouseId: string;
  onNavigate: (tab: InventoryTab) => void;
  onOpenAddModal: (type: string) => void;
  onSelectItem: (item: InventoryItemModel) => void;
}

export const ScreenOverview: React.FC<ScreenOverviewProps> = ({
  items,
  warehouses,
  activities,
  categories,
  selectedWarehouseId,
  onNavigate,
  onOpenAddModal,
  onSelectItem
}) => {
  // Filter items by warehouse if selected
  const filteredItems = selectedWarehouseId === "all"
    ? items
    : items.filter((i) => i.warehouseId === selectedWarehouseId);

  const totalItemsCount = 1245; // Display total matching reference or calculate
  const totalValueNpr = filteredItems.reduce(
    (sum, i) => sum + i.currentStock * i.sellingPrice,
    0
  ) || 2450000;

  const lowStockItems = filteredItems.filter((i) => i.status === "Low Stock");
  const outOfStockItems = filteredItems.filter((i) => i.status === "Out of Stock");

  const pieData = [
    { name: "Raw Materials", value: 40, color: "#10B981" },
    { name: "Finished Goods", value: 30, color: "#3B82F6" },
    { name: "Packaging", value: 20, color: "#F59E0B" },
    { name: "Others", value: 10, color: "#8B5CF6" }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 4 SUMMARY METRIC CARDS (Matching Screenshot Card 1) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Items */}
        <div
          onClick={() => onNavigate("items")}
          className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-[#FF5A36] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Total Items
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF5A36] group-hover:bg-[#FF5A36] group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              1,245
            </h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12 this month
            </p>
          </div>
        </div>

        {/* Total Value */}
        <div
          onClick={() => onNavigate("reports")}
          className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-[#FF5A36] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Total Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              NPR 2,450,000
            </h3>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8.5%
            </p>
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => onNavigate("alerts")}
          className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Low Stock Items
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              28
            </h3>
            <span className="text-[11px] font-black text-[#FF5A36] hover:underline">
              View All
            </span>
          </div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => onNavigate("items")}
          className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              7
            </h3>
            <span className="text-[11px] font-black text-[#FF5A36] hover:underline">
              View All
            </span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-gradient-to-r from-[#FFF5ED] to-[#FFF0E6] border border-orange-200 rounded-3xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Quick Operations
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            1-Click Stock Actions
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button
            onClick={() => onNavigate("stock_in")}
            className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-2xl border border-orange-200/80 text-xs font-black transition-all flex flex-col items-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span>Receive Stock</span>
          </button>

          <button
            onClick={() => onNavigate("stock_out")}
            className="p-2.5 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-2xl border border-orange-200/80 text-xs font-black transition-all flex flex-col items-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span>Issue Stock</span>
          </button>

          <button
            onClick={() => onNavigate("transfers")}
            className="p-2.5 bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-700 rounded-2xl border border-orange-200/80 text-xs font-black transition-all flex flex-col items-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span>Transfer</span>
          </button>

          <button
            onClick={() => onNavigate("stock_take")}
            className="p-2.5 bg-white hover:bg-orange-50 text-slate-800 hover:text-[#FF5A36] rounded-2xl border border-orange-200/80 text-xs font-black transition-all flex flex-col items-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <span>Stock Take</span>
          </button>

          <button
            onClick={() => onOpenAddModal("item")}
            className="p-2.5 bg-white hover:bg-orange-50 text-slate-800 hover:text-[#FF5A36] rounded-2xl border border-orange-200/80 text-xs font-black transition-all flex flex-col items-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>New Item</span>
          </button>

          <button
            onClick={() => onOpenAddModal("supplier")}
            className="p-2.5 bg-white hover:bg-orange-50 text-slate-800 hover:text-[#FF5A36] rounded-2xl border border-orange-200/80 text-xs font-black transition-all flex flex-col items-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <span>New Supplier</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN SECTION: STOCK VALUE OVERVIEW + RECENT ACTIVITY (Matching Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STOCK VALUE OVERVIEW (Donut Chart) */}
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Stock Value Overview
            </h3>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Categories
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-2">
            {/* Donut Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase">NPR</span>
                <span className="text-base font-black text-slate-900">2.45M</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2.5 w-full sm:w-auto">
              {pieData.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between gap-6 text-xs font-bold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-black text-slate-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY STREAM (Matching Screenshot) */}
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Recent Activity
            </h3>
            <button
              onClick={() => onNavigate("activity_log")}
              className="text-xs font-black text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-orange-200/80 flex items-center justify-center shrink-0">
                    {act.type === "received" && (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    )}
                    {act.type === "issued" && (
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    )}
                    {act.type === "transfer" && (
                      <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                    )}
                    {act.type === "adjustment" && (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    {act.type === "stock_take" && (
                      <ClipboardCheck className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{act.title}</h4>
                    <p className="text-[11px] font-bold text-slate-500">{act.referenceNo}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-black text-slate-500 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP IN-STOCK ITEMS PREVIEW ROW */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Key Inventory Items
          </h3>
          <button
            onClick={() => onNavigate("items")}
            className="text-xs font-black text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All 1,245 Items</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="p-3.5 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl flex items-center gap-3 hover:border-[#FF5A36] transition-all cursor-pointer group"
            >
              <img
                src={item.image || "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=100&auto=format&fit=crop&q=80"}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-900 truncate">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-500">SKU: {item.sku}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-black text-slate-900">
                    {item.currentStock} {item.unit}
                  </span>
                  <span className="text-xs font-black text-[#FF5A36]">
                    NPR {(item.currentStock * item.sellingPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
