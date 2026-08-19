import React from "react";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";

export const InventoryWidget: React.FC<{ widgetId?: string }> = () => {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
            Stock Summary: 142 Active SKUs
          </span>
        </div>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full">
          98% In Stock
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-center justify-between">
          <span className="font-bold text-amber-900 dark:text-amber-300 text-[11px]">
            Low Stock Alerts
          </span>
          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-full text-[10px]">
            3
          </span>
        </div>

        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl flex items-center justify-between">
          <span className="font-bold text-indigo-900 dark:text-indigo-300 text-[11px]">
            Expiring Soon
          </span>
          <span className="px-2 py-0.5 bg-indigo-600 text-white font-black rounded-full text-[10px]">
            1
          </span>
        </div>
      </div>
    </div>
  );
};
