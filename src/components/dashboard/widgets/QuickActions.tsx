import React from "react";
import { Plus, Droplets, Pill, Wallet, Package, Heart, Car } from "lucide-react";

export const QuickActions: React.FC<{ widgetId?: string }> = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
      >
        <Droplets className="w-3.5 h-3.5 text-emerald-700" />
        <span>+ Log Water</span>
      </button>

      <button
        type="button"
        className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
      >
        <Pill className="w-3.5 h-3.5 text-amber-700" />
        <span>+ Dose Log</span>
      </button>

      <button
        type="button"
        className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
      >
        <Wallet className="w-3.5 h-3.5 text-indigo-700" />
        <span>+ Add Expense</span>
      </button>

      <button
        type="button"
        className="px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
      >
        <Package className="w-3.5 h-3.5 text-sky-700" />
        <span>+ Add Stock Item</span>
      </button>
    </div>
  );
};
