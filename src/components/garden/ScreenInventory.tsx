import React, { useState } from "react";
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Archive,
  Trash2
} from "lucide-react";
import { InventoryItem, FarmGardenItem } from "./types";

interface ScreenInventoryProps {
  activeFarm: FarmGardenItem;
  inventory: InventoryItem[];
  onOpenAddModal: (type: string) => void;
  onDeleteInventory: (id: string) => void;
}

export const ScreenInventory: React.FC<ScreenInventoryProps> = ({
  activeFarm,
  inventory,
  onOpenAddModal,
  onDeleteInventory
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const farmInventory = inventory.filter((i) => i.farmId === activeFarm.id);
  const categories = ["All", "Seeds", "Fertilizers", "Pesticides", "Packaging", "Tools & Gear"];

  const filteredItems = farmInventory.filter((item) => {
    if (categoryFilter === "All") return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="space-y-4">
      {/* CATEGORY FILTER & ACTION */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#FF5A36] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-orange-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => onOpenAddModal("inventory")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Stock Item</span>
        </button>
      </div>

      {/* INVENTORY ITEMS LIST */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isLow = item.quantity <= item.minThreshold;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 hover:border-orange-200 rounded-3xl p-4 sm:p-5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A36] shadow-2xs shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{item.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Storage: {item.storageLocation} • Supplier: {item.supplier || "Local"}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    In Stock: <span className={isLow ? "text-rose-600 font-black" : "text-emerald-700 font-black"}>{item.quantity} {item.unit}</span>
                    <span className="text-slate-400 font-normal"> (Min threshold: {item.minThreshold} {item.unit})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`px-3 py-1 text-xs font-black rounded-xl border ${
                    isLow
                      ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {isLow ? "Low Stock" : "In Stock"}
                </span>

                <button
                  onClick={() => onDeleteInventory(item.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <button
        onClick={() => onOpenAddModal("inventory")}
        className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>+ Add Stock Item</span>
      </button>
    </div>
  );
};
