import React from "react";
import {
  Package,
  Plus,
  ArrowLeft,
  Share2,
  Printer,
  Barcode,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Bell
} from "lucide-react";
import { InventoryTab, WarehouseModel } from "./types";

interface InventoryHeaderProps {
  currentTab: InventoryTab;
  warehouses: WarehouseModel[];
  selectedWarehouseId: string;
  onSelectWarehouse: (id: string) => void;
  onNavigate: (tab: InventoryTab) => void;
  onOpenAddModal: (type: string) => void;
  onExportPdf: () => void;
  onOpenScanner?: () => void;
  onBack?: () => void;
  lowStockCount?: number;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  currentTab,
  warehouses,
  selectedWarehouseId,
  onSelectWarehouse,
  onNavigate,
  onOpenAddModal,
  onExportPdf,
  onOpenScanner,
  onBack,
  lowStockCount = 0
}) => {
  return (
    <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* LEFT BRAND & TITLE */}
      <div className="flex items-center gap-3.5">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-slate-700 hover:bg-orange-50 hover:text-[#FF5A36] transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Back to Services"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs shrink-0">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-200">
              Care daily. Live fully.
            </span>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
              15 May 2025
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Inventory & Stock Manager
          </h1>
        </div>
      </div>

      {/* RIGHT WAREHOUSE SELECTOR & ACTIONS */}
      <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
        {/* Warehouse Dropdown */}
        <div className="relative">
          <select
            value={selectedWarehouseId}
            onChange={(e) => onSelectWarehouse(e.target.value)}
            className="appearance-none pl-8 pr-7 py-2 bg-white border border-orange-200 rounded-2xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 shadow-2xs cursor-pointer"
          >
            <option value="all">🏢 All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                📍 {w.name}
              </option>
            ))}
          </select>
          <Building2 className="w-3.5 h-3.5 text-[#FF5A36] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Scan Barcode Button */}
        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-orange-50 text-slate-700 hover:text-[#FF5A36] border border-orange-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Scan Barcode / QR"
          >
            <Barcode className="w-4 h-4 text-[#FF5A36]" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        )}

        {/* Export / Print */}
        <button
          onClick={onExportPdf}
          className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-orange-50 text-slate-700 hover:text-[#FF5A36] border border-orange-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Export PDF / Print Stock Report"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Quick Stock In / Out */}
        <button
          onClick={() => onNavigate("stock_in")}
          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          title="Receive Stock"
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
          <span>Receive</span>
        </button>

        <button
          onClick={() => onNavigate("stock_out")}
          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-2xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          title="Issue Stock"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
          <span>Issue</span>
        </button>

        {/* Add Item Modal */}
        <button
          onClick={() => onOpenAddModal("item")}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Item</span>
        </button>
      </div>
    </div>
  );
};
