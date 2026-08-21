import React from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  Phone,
  Package,
  CheckCircle2,
  RefreshCw,
  BellRing
} from "lucide-react";
import { InventoryItemModel, InventoryTab } from "./types";

interface ScreenLowStockAlertsProps {
  items: InventoryItemModel[];
  onNavigate: (tab: InventoryTab) => void;
  onStockInItem: (item: InventoryItemModel) => void;
}

export const ScreenLowStockAlerts: React.FC<ScreenLowStockAlertsProps> = ({
  items,
  onNavigate,
  onStockInItem
}) => {
  const lowOrOutItems = items.filter(
    (i) => i.status === "Low Stock" || i.status === "Out of Stock" || i.currentStock <= i.minimumStock
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* CARD CONTAINER (Matching Screenshot Card 9) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Low Stock Alerts
              </h2>
              <p className="text-xs font-bold text-slate-500">
                {lowOrOutItems.length} SKUs below minimum reorder threshold
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            Action Required
          </span>
        </div>

        {/* ALERTS LIST (Matching Screenshot Card 9) */}
        <div className="space-y-3">
          {lowOrOutItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-[#FFF9F5] border border-orange-200/80 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-300 transition-all"
            >
              {/* Left icon & item */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.currentStock === 0
                      ? "bg-rose-100 text-rose-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{item.name}</h3>
                  <div className="flex items-center gap-3 text-xs font-bold mt-0.5">
                    <span className={item.currentStock === 0 ? "text-rose-600 font-black" : "text-amber-700"}>
                      Current: {item.currentStock} {item.unit}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      Min: {item.minimumStock} {item.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supplier: {item.supplierName || "Default Supplier"}
                  </p>
                </div>
              </div>

              {/* Right: Quick Reorder button */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onStockInItem(item)}
                  className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Reorder Stock</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA (Matching Screenshot Card 9) */}
        <button
          onClick={() => onNavigate("items")}
          className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View All Stock Items</span>
        </button>
      </div>
    </div>
  );
};
