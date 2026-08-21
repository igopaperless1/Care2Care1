import React, { useState } from "react";
import {
  ArrowUpRight,
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
  WarehouseModel,
  StockOutRecord
} from "./types";

interface ScreenStockOutProps {
  items: InventoryItemModel[];
  warehouses: WarehouseModel[];
  stockOutHistory: StockOutRecord[];
  onIssueStock: (record: Omit<StockOutRecord, "id" | "createdAt">) => void;
}

export const ScreenStockOut: React.FC<ScreenStockOutProps> = ({
  items,
  warehouses,
  stockOutHistory,
  onIssueStock
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"issue" | "history">("issue");

  // Form State
  const [customerOrDept, setCustomerOrDept] = useState("Apex Builders Pvt. Ltd.");
  const [issueType, setIssueType] = useState<
    "Sales Order" | "Departmental Dispatch" | "Damage Disposal" | "Return to Vendor"
  >("Sales Order");
  const [soNumber, setSoNumber] = useState("SO-000456");
  const [date, setDate] = useState("15 May 2025");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || "");
  const [notes, setNotes] = useState("");

  // Items in issue dispatch
  const [issueItems, setIssueItems] = useState<
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
      quantity: 50,
      unitPrice: 150,
      unit: "pcs",
      image: items[0]?.image
    },
    {
      itemId: items[1]?.id || "item-2",
      itemName: items[1]?.name || "Cement OPC 43",
      sku: items[1]?.sku || "RM-0021",
      quantity: 20,
      unitPrice: 150,
      unit: "bags",
      image: items[1]?.image
    }
  ]);

  const handleAddItemRow = () => {
    const defaultItem = items[issueItems.length % items.length] || items[0];
    if (defaultItem) {
      setIssueItems((prev) => [
        ...prev,
        {
          itemId: defaultItem.id,
          itemName: defaultItem.name,
          sku: defaultItem.sku,
          quantity: 5,
          unitPrice: defaultItem.sellingPrice,
          unit: defaultItem.unit,
          image: defaultItem.image
        }
      ]);
    }
  };

  const handleRemoveItemRow = (index: number) => {
    setIssueItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (
    index: number,
    field: "itemId" | "quantity" | "unitPrice",
    value: any
  ) => {
    setIssueItems((prev) =>
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
                unitPrice: selected.sellingPrice,
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

  const totalAmount = issueItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (issueItems.length === 0) {
      alert("Please add at least one item to issue.");
      return;
    }
    const wh = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

    onIssueStock({
      soNumber,
      customerOrDept,
      issueType,
      date,
      warehouseId: wh?.id || "wh-1",
      warehouseName: wh?.name || "Main Warehouse",
      items: issueItems.map((it) => ({
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
      issuedBy: "Bikram Karki"
    });

    setSoNumber(`SO-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* CARD CONTAINER (Matching Screenshot Card 5) */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-5">
        {/* TOP SEGMENTED PILL: Issue Stock | Issue History */}
        <div className="flex bg-[#FFF9F5] p-1 rounded-2xl border border-orange-200/80 max-w-xs">
          <button
            onClick={() => setActiveSubTab("issue")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "issue"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Issue Stock
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeSubTab === "history"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Issue History
          </button>
        </div>

        {activeSubTab === "issue" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* To (Customer / Department) */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">
                  To (Customer/Department) *
                </label>
                <input
                  type="text"
                  value={customerOrDept}
                  onChange={(e) => setCustomerOrDept(e.target.value)}
                  placeholder="e.g. Apex Builders / Sales Counter"
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                  required
                />
              </div>

              {/* Issue Type */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 cursor-pointer"
                >
                  <option value="Sales Order">Sales Order</option>
                  <option value="Departmental Dispatch">Departmental Dispatch</option>
                  <option value="Damage Disposal">Damage Disposal</option>
                  <option value="Return to Vendor">Return to Vendor</option>
                </select>
              </div>

              {/* Sales Order (SO) */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700">Sales Order (SO)</label>
                <input
                  type="text"
                  value={soNumber}
                  onChange={(e) => setSoNumber(e.target.value)}
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

              {/* Warehouse */}
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

            {/* ITEMS LIST (Multi-Row Matching Screenshot Card 5) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700">Items to Dispatch</label>
                <span className="text-xs font-bold text-slate-400">{issueItems.length} items</span>
              </div>

              <div className="space-y-2">
                {issueItems.map((row, idx) => (
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
                              {it.name} ({it.sku}) - {it.currentStock} in stock
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] font-bold text-slate-500">SO: {soNumber}</p>
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
                <ArrowUpRight className="w-4 h-4" />
                <span>Issue Stock</span>
              </button>
            </div>
          </form>
        ) : (
          /* ISSUE HISTORY SUBTAB */
          <div className="space-y-3">
            {stockOutHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No previous issue records found.</p>
            ) : (
              stockOutHistory.map((so) => (
                <div
                  key={so.id}
                  className="p-4 bg-[#FFF9F5] border border-orange-100 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {so.soNumber}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {so.issueType}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      To: {so.customerOrDept} • {so.warehouseName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {so.items.map((it) => `${it.quantity} ${it.unit} ${it.itemName}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#FF5A36] block">
                      NPR {so.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{so.date}</span>
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
