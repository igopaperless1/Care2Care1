import React from "react";
import {
  Building2,
  Plus,
  MapPin,
  User,
  Phone,
  Package,
  Layers,
  ChevronRight,
  Edit3
} from "lucide-react";
import { WarehouseModel, InventoryTab } from "./types";

interface ScreenWarehousesProps {
  warehouses: WarehouseModel[];
  onSelectWarehouse: (id: string) => void;
  onNavigate: (tab: InventoryTab) => void;
  onOpenAddModal: (type: string) => void;
  onEditWarehouse?: (warehouse: WarehouseModel) => void;
}

export const ScreenWarehouses: React.FC<ScreenWarehousesProps> = ({
  warehouses,
  onSelectWarehouse,
  onNavigate,
  onOpenAddModal,
  onEditWarehouse
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER ROW */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Warehouses & Storage Locations
          </h2>
          <p className="text-xs font-bold text-slate-500">
            {warehouses.length} Active Storage Facilities
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal("warehouse")}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Warehouse</span>
        </button>
      </div>

      {/* WAREHOUSE CARDS (Matching Screenshot Card 6 Layout) */}
      <div className="space-y-3">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            onClick={() => {
              onSelectWarehouse(wh.id);
              onNavigate("items");
            }}
            className="bg-white border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs hover:border-[#FF5A36] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Left: Thumbnail & Details */}
            <div className="flex items-center gap-3.5">
              <img
                src={
                  wh.image ||
                  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
                }
                alt={wh.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border border-orange-200 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                    {wh.name}
                  </h3>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {wh.status}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-500 mt-0.5">{wh.branch}</p>

                <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                  <MapPin className="w-3 h-3 text-[#FF5A36]" />
                  <span>{wh.location}</span>
                </div>
              </div>
            </div>

            {/* Right: Capacity & Stats */}
            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-orange-100">
              <div className="text-left sm:text-right space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">SKUs:</span>
                  <span className="text-xs font-black text-slate-800">{wh.totalSkuCount}</span>
                </div>
                {/* Capacity Bar */}
                <div className="w-28 bg-orange-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#FF5A36] h-full rounded-full"
                    style={{ width: `${wh.capacityUsedPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 block">
                  {wh.capacityUsedPercent}% Capacity Used
                </span>
              </div>

              <div
                className="w-8 h-8 rounded-xl bg-orange-50 group-hover:bg-[#FF5A36] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors"
                title="View Warehouse Inventory"
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BUTTON */}
      <button
        onClick={() => onOpenAddModal("warehouse")}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add New Warehouse</span>
      </button>
    </div>
  );
};
