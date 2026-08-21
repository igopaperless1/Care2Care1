import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Sliders,
  Barcode,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Trash2,
  Calendar,
  Building2,
  Tag,
  ShieldCheck,
  TrendingUp,
  History,
  AlertTriangle
} from "lucide-react";
import {
  InventoryItemModel,
  StockInRecord,
  StockOutRecord,
  ActivityLogModel
} from "./types";

interface ScreenItemDetailsProps {
  item: InventoryItemModel;
  onBack: () => void;
  onOpenEditModal: (item: InventoryItemModel) => void;
  onOpenAdjustModal: (item: InventoryItemModel) => void;
  onOpenBarcode: (item: InventoryItemModel) => void;
  onStockIn: (item: InventoryItemModel) => void;
  onStockOut: (item: InventoryItemModel) => void;
  onDelete?: (id: string) => void;
}

export const ScreenItemDetails: React.FC<ScreenItemDetailsProps> = ({
  item,
  onBack,
  onOpenEditModal,
  onOpenAdjustModal,
  onOpenBarcode,
  onStockIn,
  onStockOut,
  onDelete
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "history" | "transactions" | "analytics"
  >("overview");

  const profitMarginPercent = item.unitCost > 0
    ? Math.round(((item.sellingPrice - item.unitCost) / item.unitCost) * 100)
    : 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TOP HEADER CARD WITH ITEM INFO (Matching Screenshot Card 3) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-[#FF5A36] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Items</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                item.status === "In Stock"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : item.status === "Low Stock"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Item Title & Hero Thumbnail */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={
              item.image ||
              "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=300&auto=format&fit=crop&q=80"
            }
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-orange-200 shadow-2xs"
          />
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {item.name}
            </h2>
            <p className="text-xs font-bold text-slate-500">SKU: {item.sku}</p>
            <p className="text-xs text-slate-600 max-w-lg">{item.description}</p>
          </div>
        </div>

        {/* SUBTABS: Overview | Stock History | Transactions | Analytics */}
        <div className="flex items-center gap-1 border-b border-orange-100 pt-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "history", label: "Stock History" },
            { id: "transactions", label: "Transactions" },
            { id: "analytics", label: "Analytics" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeSubTab === tab.id
                  ? "border-[#FF5A36] text-[#FF5A36] font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUBTAB 1: OVERVIEW DATA GRID (Matching Screenshot Card 3 Table) */}
        {activeSubTab === "overview" && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Category</span>
                <span className="font-black text-slate-900">{item.category}</span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Unit</span>
                <span className="font-black text-slate-900">{item.unit}</span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Current Stock</span>
                <span className="font-black text-slate-900 text-sm">
                  {item.currentStock} {item.unit}
                </span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Reserved Stock</span>
                <span className="font-black text-amber-600">
                  {item.reservedStock} {item.unit}
                </span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Available Stock</span>
                <span className="font-black text-emerald-600 text-sm">
                  {item.availableStock} {item.unit}
                </span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Minimum Stock Level</span>
                <span className="font-black text-slate-900">
                  {item.minimumStock} {item.unit}
                </span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Reorder Level</span>
                <span className="font-black text-amber-600">
                  {item.reorderLevel} {item.unit}
                </span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Unit Cost</span>
                <span className="font-black text-slate-900">NPR {item.unitCost}</span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Selling Price</span>
                <span className="font-black text-[#FF5A36]">
                  NPR {item.sellingPrice}
                </span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Warehouse</span>
                <span className="font-black text-slate-900">{item.warehouseName}</span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Location</span>
                <span className="font-black text-slate-900">{item.location}</span>
              </div>

              <div className="p-3 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Last Updated</span>
                <span className="font-black text-slate-900">{item.lastUpdated}</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: STOCK HISTORY */}
        {activeSubTab === "history" && (
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-[#FFF9F5] border border-orange-100 rounded-2xl space-y-2">
              <span className="text-xs font-black text-slate-900 uppercase">
                Stock Movement Log
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold border-b border-orange-100/60 pb-2">
                  <span className="text-slate-500">15 May 2025 • 10:30 AM</span>
                  <span className="text-emerald-600 font-black">+100 pcs (GRN-000124)</span>
                  <span className="text-slate-800">850 pcs</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold border-b border-orange-100/60 pb-2">
                  <span className="text-slate-500">15 May 2025 • 09:15 AM</span>
                  <span className="text-blue-600 font-black">-50 pcs (SO-000456)</span>
                  <span className="text-slate-800">750 pcs</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold border-b border-orange-100/60 pb-2">
                  <span className="text-slate-500">14 May 2025 • 04:20 PM</span>
                  <span className="text-purple-600 font-black">-50 pcs (TR-000789)</span>
                  <span className="text-slate-800">800 pcs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: TRANSACTIONS */}
        {activeSubTab === "transactions" && (
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-[#FFF9F5] border border-orange-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Supplier:</span>
                <span className="font-black text-slate-900">{item.supplierName || "Nepal Steel Industries"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Barcode / EAN-13:</span>
                <span className="font-mono font-bold text-slate-800">{item.barcode}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Batch Number:</span>
                <span className="font-bold text-slate-800">{item.batchNumber || "BAT-2025-01"}</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: ANALYTICS */}
        {activeSubTab === "analytics" && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-emerald-800">Gross Margin</span>
              <p className="text-xl font-black text-emerald-700 mt-1">{profitMarginPercent}%</p>
              <p className="text-[11px] font-bold text-emerald-600">NPR {item.sellingPrice - item.unitCost} / unit profit</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-orange-800">Stock Turnover</span>
              <p className="text-xl font-black text-[#FF5A36] mt-1">4.2x</p>
              <p className="text-[11px] font-bold text-slate-600">High velocity SKU</p>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS (Matching Screenshot Card 3) */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-orange-100">
          <button
            onClick={() => onOpenEditModal(item)}
            className="flex-1 py-2.5 bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onOpenAdjustModal(item)}
            className="flex-1 py-2.5 bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Adjust Stock</span>
          </button>

          <button
            onClick={() => onOpenBarcode(item)}
            className="flex-1 py-2.5 bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Barcode className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Barcode</span>
          </button>

          <button
            onClick={() => onStockIn(item)}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stock In</span>
          </button>

          <button
            onClick={() => onStockOut(item)}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-2xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Stock Out</span>
          </button>

          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                  onDelete(item.id);
                  onBack();
                }
              }}
              className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl transition-all cursor-pointer"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
