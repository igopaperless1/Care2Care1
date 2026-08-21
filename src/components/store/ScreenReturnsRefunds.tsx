import React, { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  User,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  MessageSquare
} from "lucide-react";
import { StoreTab } from "./types";

interface ReturnItem {
  id: string;
  returnCode: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  quantity: number;
  amount: number;
  reason: string;
  date: string;
  status: "Pending" | "Approved" | "Refunded" | "Rejected";
}

interface ScreenReturnsRefundsProps {
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenReturnsRefunds: React.FC<ScreenReturnsRefundsProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [returnsList, setReturnsList] = useState<ReturnItem[]>([
    {
      id: "ret-1",
      returnCode: "RET-0012",
      orderNumber: "ORD-000118",
      customerName: "Sita Karki",
      customerPhone: "9841234567",
      productName: "Organic Green Tea (250g)",
      quantity: 1,
      amount: 450,
      reason: "Damaged outer seal upon delivery",
      date: "14 May 2025",
      status: "Pending"
    },
    {
      id: "ret-2",
      returnCode: "RET-0011",
      orderNumber: "ORD-000110",
      customerName: "Ramesh Shrestha",
      customerPhone: "9812345678",
      productName: "Vitamin C 1000mg Effervescent",
      quantity: 1,
      amount: 650,
      reason: "Wrong flavor variant received",
      date: "12 May 2025",
      status: "Approved"
    },
    {
      id: "ret-3",
      returnCode: "RET-0010",
      orderNumber: "ORD-000095",
      customerName: "Priya Gurung",
      customerPhone: "9809876543",
      productName: "Handmade Herbal Neem Soap",
      quantity: 1,
      amount: 150,
      reason: "Skin sensitivity preference",
      date: "10 May 2025",
      status: "Refunded"
    }
  ]);

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Refunded" | "Rejected") => {
    setReturnsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filtered = returnsList.filter(
    (r) => activeFilter === "All" || r.status === activeFilter
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Returns, Replacements & Refunds</h3>
            <p className="text-xs text-slate-500">Handle customer dispute claims, returns, and reverse logistics</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-orange-50/60 p-1 rounded-2xl border border-orange-200">
          {["All", "Pending", "Approved", "Refunded"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === status
                  ? "bg-[#FF5A36] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 2. RMA List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isPending = item.status === "Pending";
          const isApproved = item.status === "Approved";
          const isRefunded = item.status === "Refunded";

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">{item.returnCode}</span>
                  <span className="text-xs text-slate-500">• Order: <strong className="text-slate-700">{item.orderNumber}</strong></span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isPending
                      ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                      : isApproved
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : isRefunded
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Item Info */}
              <div className="p-3 bg-orange-50/30 rounded-2xl border border-orange-100/80 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  {item.productName} (Qty: {item.quantity})
                </div>
                <div className="text-xs text-slate-600">
                  Reason: <span className="text-slate-800 font-semibold">{item.reason}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Customer: <strong>{item.customerName}</strong> ({item.customerPhone}) • Logged on {item.date}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-orange-100">
                <div className="text-xs font-black text-slate-900">
                  Refund Value: <span className="text-[#FF5A36]">NPR {item.amount}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, "Approved")}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Approve Return
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, "Refunded")}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Issue Instant Refund
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, "Rejected")}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, "Refunded")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Complete Payout Refund
                    </button>
                  )}

                  {isRefunded && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Refund Settled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
