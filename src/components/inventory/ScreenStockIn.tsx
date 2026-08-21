import React, { useState } from "react";
import {
  ArrowDownLeft,
  Plus,
  Trash2,
  Calendar,
  Building2,
  FileText,
  Users,
  CheckCircle2,
  Printer,
  ChevronDown
} from "lucide-react";
import {
  InventoryItemModel,
  SupplierModel,
  WarehouseModel,
  StockInRecord
} from "./types";

interface ScreenStockInProps {
  items: InventoryItemModel[];
  suppliers: SupplierModel[];
  warehouses: WarehouseModel[];
  stockInHistory: StockInRecord[];
  onReceiveStock: (record: Omit<StockInRecord, "id" | "createdAt">) => void;
  onOpenAddModal: (type: string) => void;
}

export const ScreenStockIn: React.FC<ScreenStockInProps> = ({
  items,
  suppliers,
  warehouses,
  stockInHistory,
  onReceiveStock,
  onOpenAddModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"receive" | "history">("receive");

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "");
  const [poNumber, setPoNumber] = useState("PO-000123");
  const [grnNumber, setGrnNumber] = useState(`GRN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [date, setDate] = useState("15 May 2025");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || "");
  const [notes, setNotes] = useState("");

  // Items in receipt
  const [receiptItems, setReceiptItems] = useState<
    Array<{
      itemId: string;
      itemName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
      unit: string;
      image?: string;
    }>
  >([
    {
      itemId: items[0]?.id || "item-1",
      itemName: items[0]?.name || "Steel Rod 12mm",
      sku: items[0]?.sku || "RM-0012",
      quantity: 100,
      unitPrice: 150,
      unit: "pcs",
      image: items[0]?.image
    },
    {
      itemId: items[1]?.id || "item-2",
      itemName: items[1]?.name || "Cement OPC 43",
      sku: items[1]?.sku || "RM-0021",
      quantity: 50,
      unitPrice: 150,
      unit: "bags",
      image: items[1]?.image
    }
  ]);

  const handleAddItemRow = () => {
    const defaultItem = items[receiptItems.length % items.length] || items[0];
    if (defaultItem) {
      setReceiptItems((prev) => [
        ...prev,
        {
          itemId: defaultItem.id,
          itemName: defaultItem.name,
          sku: defaultItem.sku,
          quantity: 10,
          unitPrice: defaultItem.unitCost,
          unit: defaultItem.unit,
          image: defaultItem.image
        }
      ]);
    }
  };

  const handleRemoveItemRow = (index: number) => {
    setReceiptItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (
    index: number,
    field: "itemId" | "quantity" | "unitPrice",
    value: any
  ) => {
    setReceiptItems((prev) =>
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
                unitPrice: selected.unitCost,
                unit: selected.unit,
                image: selected.image
              };
            }
          }
          return { ...item, [field]: Number(value) || value };
        }
        return item;
      })
    );
  };

  const totalAmount = receiptItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptItems.length === 0) {
      alert("Please add at least one item to receive.");
      return;
    }
    const sup = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
    const wh = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

    onReceiveStock({
      grnNumber,
      supplierId: sup?.id || "sup-1",
      supplierName: sup?.name || "BuildWell Suppliers",
      poNumber,
      date,
      warehouseId: wh?.id || "wh-1",
      warehouseName: wh?.name || "Main Warehouse",
      items: receiptItems.map((it) => ({
        itemId: it.itemId,
        itemName: it.itemName,
        sku: it.sku,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalAmount: it.quantity * it.unitPrice,
        unit: it.unit
      })),
      totalAmount,
      notes,
      receivedBy: "Suresh Thapa"
    });

    // Reset Form
    setGrnNumber(`GRN-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* CARD CONTAINER (Matching Screenshot Card 4) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
        {/* TOP SEGMENTED PILL: Receive Stock | GRN History */}
        <div className="flex bg-[#FFF9F5] p-1 rounded-2xl border border-orange-200/80 max-w-xs">
          <button
            onClick={() => setActiveSubTab("receive")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "receive"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Receive Stock
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "history"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            GRN History
          </button>
        </div>

        {activeSubTab === "receive" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 2-Column Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Supplier Dropdown */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-700">Supplier *</label>
                  <button
                    type="button"
                    onClick={() => onOpenAddModal("supplier")}
                    className="text-[11px] font-bold text-[#FF5A36] hover:underline cursor-pointer"
                  >
                    + New Supplier
                  </button>
                </div>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 cursor-pointer"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Purchase Order (PO) */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Purchase Order (PO)</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="e.g. PO-000123"
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                />
              </div>

              {/* Reference No */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Reference No. (GRN)</label>
                <input
                  type="text"
                  value={grnNumber}
                  onChange={(e) => setGrnNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 font-mono"
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Date *</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                />
              </div>

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
                      🏢 {w.name} ({w.branch} - {w.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ITEMS LIST (Multi-Row Matching Screenshot Card 4) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700">Items to Receive</label>
                <span className="text-xs font-bold text-slate-400">{receiptItems.length} items</span>
              </div>

              <div className="space-y-2">
                {receiptItems.map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={
                          row.image ||
                          "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=100&auto=format&fit=crop&q=80"
                        }
                        alt={row.itemName}
                        className="w-10 h-10 rounded-xl object-cover border border-orange-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <select
                          value={row.itemId}
                          onChange={(e) => handleUpdateItem(idx, "itemId", e.target.value)}
                          className="w-full font-black text-xs text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer"
                        >
                          {items.map((it) => (
                            <option key={it.id} value={it.id}>
                              {it.name} ({it.sku})
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] font-bold text-slate-500">PO: {poNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={row.quantity}
                          onChange={(e) => handleUpdateItem(idx, "quantity", e.target.value)}
                          min="1"
                          className="w-16 px-2 py-1 bg-white border border-orange-200 rounded-xl text-xs font-black text-center focus:outline-none"
                        />
                        <span className="text-xs font-bold text-slate-500">{row.unit}</span>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="text-xs font-black text-[#FF5A36] block">
                          NPR {row.unitPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center cursor-pointer transition-colors"
                        title="Remove Item"
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

            {/* TOTAL AMOUNT & SUBMIT BUTTON */}
            <div className="pt-3 border-t border-orange-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">Total Amount</span>
                <span className="text-xl font-black text-[#FF5A36]">
                  NPR {totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-sm font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Receive Stock</span>
              </button>
            </div>
          </form>
        ) : (
          /* GRN HISTORY SUBTAB */
          <div className="space-y-3">
            {stockInHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No previous GRN records found.</p>
            ) : (
              stockInHistory.map((grn) => (
                <div
                  key={grn.id}
                  className="p-4 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {grn.grnNumber}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                        PO: {grn.poNumber}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      {grn.supplierName} • {grn.warehouseName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {grn.items.map((it) => `${it.quantity} ${it.unit} ${it.itemName}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#FF5A36] block">
                      NPR {grn.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{grn.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
