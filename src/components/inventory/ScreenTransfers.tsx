import React, { useState } from "react";
import {
  ArrowLeftRight,
  Plus,
  Trash2,
  Building2,
  Calendar,
  CheckCircle2,
  Truck
} from "lucide-react";
import {
  WarehouseModel,
  InventoryItemModel,
  StockTransferRecord
} from "./types";

interface ScreenTransfersProps {
  warehouses: WarehouseModel[];
  items: InventoryItemModel[];
  transfers: StockTransferRecord[];
  onAddTransfer: (record: Omit<StockTransferRecord, "id">) => void;
}

export const ScreenTransfers: React.FC<ScreenTransfersProps> = ({
  warehouses,
  items,
  transfers,
  onAddTransfer
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"transfer" | "history">("transfer");
  const [fromWarehouseId, setFromWarehouseId] = useState(warehouses[0]?.id || "");
  const [toWarehouseId, setToWarehouseId] = useState(warehouses[1]?.id || "");
  const [transferNumber, setTransferNumber] = useState(`TR-${Math.floor(100000 + Math.random() * 900000)}`);
  const [date, setDate] = useState("15 May 2025");
  const [notes, setNotes] = useState("Internal warehouse rebalancing");

  const [transferItems, setTransferItems] = useState<
    Array<{ itemId: string; itemName: string; sku: string; quantity: number; unit: string }>
  >([
    {
      itemId: items[3]?.id || "item-4",
      itemName: items[3]?.name || "PVC Pipe 2 inch",
      sku: items[3]?.sku || "PL-0045",
      quantity: 50,
      unit: "Pcs"
    },
    {
      itemId: items[2]?.id || "item-3",
      itemName: items[2]?.name || "Paint Bucket 20L",
      sku: items[2]?.sku || "PG-0033",
      quantity: 10,
      unit: "Buckets"
    }
  ]);

  const handleAddItemRow = () => {
    const defaultItem = items[transferItems.length % items.length] || items[0];
    if (defaultItem) {
      setTransferItems((prev) => [
        ...prev,
        {
          itemId: defaultItem.id,
          itemName: defaultItem.name,
          sku: defaultItem.sku,
          quantity: 10,
          unit: defaultItem.unit
        }
      ]);
    }
  };

  const handleRemoveItemRow = (index: number) => {
    setTransferItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (
    index: number,
    field: "itemId" | "quantity",
    value: any
  ) => {
    setTransferItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          if (field === "itemId") {
            const selected = items.find((it) => it.id === value);
            if (selected) {
              return {
                ...item,
                itemId: selected.id,
                itemName: selected.name,
                sku: selected.sku,
                unit: selected.unit
              };
            }
          }
          return { ...item, [field]: Number(value) || value };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWarehouseId === toWarehouseId) {
      alert("Source and Destination warehouses cannot be the same.");
      return;
    }
    if (transferItems.length === 0) {
      alert("Please specify at least one item to transfer.");
      return;
    }

    const fromWh = warehouses.find((w) => w.id === fromWarehouseId);
    const toWh = warehouses.find((w) => w.id === toWarehouseId);

    onAddTransfer({
      transferNumber,
      fromWarehouseId,
      fromWarehouseName: fromWh?.name || "Main Warehouse",
      toWarehouseId,
      toWarehouseName: toWh?.name || "Secondary Warehouse",
      date,
      items: transferItems,
      status: "Completed",
      transferredBy: "Suresh Thapa",
      notes
    });

    setTransferNumber(`TR-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex bg-[#FFF9F5] p-1 rounded-2xl border border-orange-200/80 max-w-xs">
          <button
            onClick={() => setActiveSubTab("transfer")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "transfer"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            New Transfer
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "history"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Transfer History
          </button>
        </div>

        {activeSubTab === "transfer" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">From Warehouse (Source) *</label>
                <select
                  value={fromWarehouseId}
                  onChange={(e) => setFromWarehouseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      🏢 {w.name} ({w.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">To Warehouse (Destination) *</label>
                <select
                  value={toWarehouseId}
                  onChange={(e) => setToWarehouseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      🏢 {w.name} ({w.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Transfer No.</label>
                <input
                  type="text"
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700">Items to Transfer</label>
                <span className="text-xs font-bold text-slate-400">{transferItems.length} items</span>
              </div>

              <div className="space-y-2">
                {transferItems.map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <select
                      value={row.itemId}
                      onChange={(e) => handleUpdateItem(idx, "itemId", e.target.value)}
                      className="font-black text-xs text-slate-900 bg-transparent border-0 focus:outline-none flex-1 cursor-pointer"
                    >
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.name} ({it.sku}) - {it.currentStock} in stock
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleUpdateItem(idx, "quantity", e.target.value)}
                        min="1"
                        className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-xl text-xs font-black text-center"
                      />
                      <span className="text-xs font-bold text-slate-500">{row.unit}</span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItemRow}
                className="w-full py-2.5 bg-[#FFF9F5] hover:bg-orange-50 text-[#FF5A36] border border-dashed border-orange-300 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add More Items</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-sm font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Truck className="w-4 h-4" />
              <span>Execute Stock Transfer</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            {transfers.map((tr) => (
              <div
                key={tr.id}
                className="p-4 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {tr.transferNumber}
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {tr.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-1">
                    {tr.fromWarehouseName} ➔ {tr.toWarehouseName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {tr.items.map((it) => `${it.quantity} ${it.unit} ${it.itemName}`).join(", ")}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">{tr.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
