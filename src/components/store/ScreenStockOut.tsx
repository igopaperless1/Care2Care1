import React, { useState } from "react";
import {
  ArrowUpFromLine,
  Building2,
  Calendar,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  Check
} from "lucide-react";
import { ProductItem, StockTransaction, StoreTab } from "./types";

interface ScreenStockOutProps {
  products: ProductItem[];
  transactions: StockTransaction[];
  onIssueStock: (newTransaction: StockTransaction, updatedProducts: { id: string; qty: number }[]) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenStockOut: React.FC<ScreenStockOutProps> = ({
  products,
  transactions,
  onIssueStock,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<"issue" | "history">("issue");
  const [recipient, setRecipient] = useState("Walk-in Customer / Dispatch");
  const [issueType, setIssueType] = useState("Sales Order");
  const [soNumber, setSoNumber] = useState(`SO-000${Math.floor(100 + Math.random() * 900)}`);
  const [warehouse, setWarehouse] = useState("Main Warehouse (Lazimpat)");

  const [items, setItems] = useState([
    { productId: products[0]?.id || "prod-001", productName: products[0]?.name || "Organic Green Tea", quantity: 2 },
    { productId: products[1]?.id || "prod-002", productName: products[1]?.name || "Vitamin C 1000mg", quantity: 1 }
  ]);

  const [issuedSuccess, setIssuedSuccess] = useState(false);

  const totalIssued = items.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);

  const handleAddItem = () => {
    const nextProd = products[items.length % products.length] || products[0];
    setItems([...items, { productId: nextProd.id, productName: nextProd.name, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      type: "Issue",
      refNo: soNumber,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      partyName: recipient,
      warehouse,
      totalItems: totalIssued,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity
      })),
      status: "Completed"
    };

    const updates = items.map((i) => ({
      id: i.productId,
      qty: Number(i.quantity || 0)
    }));

    onIssueStock(newTx, updates);
    setIssuedSuccess(true);
    setTimeout(() => {
      setIssuedSuccess(false);
      setActiveTab("history");
    }, 1500);
  };

  const issueHistory = transactions.filter((t) => t.type === "Issue");

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 1. Header with Mode Toggle */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <ArrowUpFromLine className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Stock Out / Goods Issue (GIN)</h3>
            <p className="text-xs text-slate-500">Dispatch sales orders or log internal branch transfers</p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-orange-50/60 rounded-2xl border border-orange-200">
          <button
            type="button"
            onClick={() => setActiveTab("issue")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "issue" ? "bg-[#FF5A36] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Issue Stock
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "history" ? "bg-[#FF5A36] text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Issue History ({issueHistory.length})
          </button>
        </div>
      </div>

      {activeTab === "issue" ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">To (Customer / Department) <span className="text-[#FF5A36]">*</span></label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="Walk-in Customer / Dispatch">Walk-in Customer / Dispatch</option>
                <option value="Online Customer Order">Online Customer Order</option>
                <option value="Packaging & Clinic Ward">Packaging & Clinic Ward</option>
                <option value="Damaged / Expired Clearance">Damaged / Expired Clearance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="Sales Order">Sales Order (SO)</option>
                <option value="Internal Consumption">Internal Clinic Consumption</option>
                <option value="Branch Transfer">Branch Transfer</option>
                <option value="Sample Testing">Sample Testing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sales Order / Ref (SO)</label>
              <input
                type="text"
                value={soNumber}
                onChange={(e) => setSoNumber(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Warehouse <span className="text-[#FF5A36]">*</span></label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="Main Warehouse (Lazimpat)">Main Warehouse (Lazimpat)</option>
                <option value="Pokhara Branch Hub">Pokhara Branch Hub</option>
                <option value="Thamel Dispatch">Thamel Dispatch</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 pt-2 border-t border-orange-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Items to Issue</span>
              <span className="text-[#FF5A36]">Total Issued: {totalIssued} pcs</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const matchedProd = products.find((p) => p.id === item.productId);
                return (
                  <div key={idx} className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const sel = products.find((p) => p.id === e.target.value);
                          const copy = [...items];
                          copy[idx].productId = e.target.value;
                          copy[idx].productName = sel?.name || "";
                          setItems(copy);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Avail: {p.stock} pcs)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">Issue Qty</span>
                      <input
                        type="number"
                        min={1}
                        max={matchedProd ? matchedProd.stock : 999}
                        value={item.quantity}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].quantity = Number(e.target.value);
                          setItems(copy);
                        }}
                        className="w-full text-center px-1.5 py-1 bg-white border border-orange-200 rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 text-xs font-bold text-[#FF5A36] bg-orange-50 hover:bg-orange-100 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add More Items</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              {issuedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Stock Issued & Deducted from Warehouse!</span>
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-4 h-4" />
                  <span>Issue Stock ({totalIssued} pcs)</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Issue History Tab */
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Goods Issue Records</h4>
          <div className="space-y-2.5">
            {issueHistory.map((tx) => (
              <div key={tx.id} className="p-3.5 bg-orange-50/40 rounded-2xl border border-orange-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{tx.refNo}</span>
                  <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 text-[10px]">
                    {tx.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Recipient: <strong>{tx.partyName}</strong> • {tx.warehouse}
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{tx.totalItems} items dispatched</span>
                  <span>{tx.date} at {tx.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
