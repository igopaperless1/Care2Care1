import React, { useState } from "react";
import {
  ClipboardCheck,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Play,
  RotateCcw,
  ArrowRight
} from "lucide-react";
import {
  WarehouseModel,
  StockTakeRecord,
  InventoryItemModel
} from "./types";

interface ScreenStockTakeProps {
  warehouses: WarehouseModel[];
  items: InventoryItemModel[];
  currentStockTake: StockTakeRecord;
  onSaveStockTake?: (record: StockTakeRecord) => void;
}

export const ScreenStockTake: React.FC<ScreenStockTakeProps> = ({
  warehouses,
  items,
  currentStockTake,
  onSaveStockTake
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"stock_take" | "history">("stock_take");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || "");
  const [countDate, setCountDate] = useState("15 May 2025");
  const [referenceNo, setReferenceNo] = useState(currentStockTake.referenceNo);

  // Dynamic state for stock take items
  const [auditItems, setAuditItems] = useState(currentStockTake.varianceList);
  const [isAuditing, setIsAuditing] = useState(false);

  const totalItems = currentStockTake.totalItems;
  const countedItems = currentStockTake.countedItems;
  const pendingItems = currentStockTake.pendingItems;
  const varianceFound = currentStockTake.varianceFound;
  const percentComplete = Math.round((countedItems / totalItems) * 100);

  const handleUpdatePhysicalCount = (itemId: string, physicalCount: number) => {
    setAuditItems((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const variance = physicalCount - item.systemStock;
          return { ...item, physicalStock: physicalCount, variance };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* CARD CONTAINER (Matching Screenshot Card 7) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
        {/* TOP SEGMENTED PILL: Stock Take | History */}
        <div className="flex bg-[#FFF9F5] p-1 rounded-2xl border border-orange-200/80 max-w-xs">
          <button
            onClick={() => setActiveSubTab("stock_take")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "stock_take"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Stock Take
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "history"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            History
          </button>
        </div>

        {activeSubTab === "stock_take" ? (
          <div className="space-y-4">
            {/* Form selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Warehouse Dropdown */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-black text-slate-700">Warehouse *</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 cursor-pointer"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      🏢 {w.name} ({w.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Count Date */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Count Date</label>
                <input
                  type="text"
                  value={countDate}
                  onChange={(e) => setCountDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                />
              </div>

              {/* Reference No */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Reference No.</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 font-mono"
                />
              </div>
            </div>

            {/* COUNT PROGRESS CONTAINER (Matching Screenshot Card 7) */}
            <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Count Progress
                </span>
                <span className="text-xs font-black text-[#FF5A36]">{percentComplete}%</span>
              </div>

              {/* Counts */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Total Items</span>
                  <span className="text-lg font-black text-slate-900">{totalItems.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold block">Counted Items</span>
                  <span className="text-lg font-black text-emerald-600">{countedItems.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-orange-200/60 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF5A36] to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>

            {/* COUNT BY STATUS (Matching Screenshot Card 7) */}
            <div className="space-y-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Count by Status
              </span>

              <div className="space-y-2 text-xs font-bold">
                {/* Counted */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-900">Counted</span>
                  </div>
                  <span className="font-black text-emerald-800">
                    {countedItems} (68%)
                  </span>
                </div>

                {/* Pending */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-amber-900">Pending</span>
                  </div>
                  <span className="font-black text-amber-800">
                    {pendingItems} (26%)
                  </span>
                </div>

                {/* Variance Found */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-rose-900">Variance Found</span>
                  </div>
                  <span className="font-black text-rose-800">
                    {varianceFound} (6%)
                  </span>
                </div>
              </div>
            </div>

            {/* VARIANCE DISCREPANCY RECONCILIATION TABLE */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Active Audit Items with Variance
              </span>

              <div className="space-y-2">
                {auditItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-3 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-black text-slate-900">{item.itemName}</h4>
                      <p className="text-[11px] font-bold text-slate-500">SKU: {item.sku}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">System Stock</span>
                        <span className="font-black text-slate-800">
                          {item.systemStock} {item.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Physical Count</span>
                        <input
                          type="number"
                          value={item.physicalStock}
                          onChange={(e) =>
                            handleUpdatePhysicalCount(item.itemId, Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-xl font-black text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Variance</span>
                        <span
                          className={`font-black ${
                            item.variance < 0
                              ? "text-rose-600"
                              : item.variance > 0
                              ? "text-emerald-600"
                              : "text-slate-800"
                          }`}
                        >
                          {item.variance > 0 ? `+${item.variance}` : item.variance} {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BIG ORANGE BUTTON (Matching Screenshot Card 7) */}
            <button
              onClick={() => {
                alert("Stock Take session submitted! Discrepancies auto-adjusted to inventory log.");
              }}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-sm font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Start Stock Take</span>
            </button>
          </div>
        ) : (
          /* AUDIT HISTORY SUBTAB */
          <div className="space-y-3">
            <div className="p-4 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 font-mono">
                  STK-000124 (April Audit)
                </span>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Main Warehouse • Audited by Prakash
                </p>
                <p className="text-[11px] text-emerald-600 font-black mt-0.5">
                  1,230 Items Counted • 99.4% Accuracy
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">14 Apr 2025</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
