import React, { useState } from "react";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Clock,
  Percent,
  DollarSign,
  Gift,
  Calendar,
  X,
  Check
} from "lucide-react";
import { CouponItem, StoreTab } from "./types";

interface ScreenCouponsProps {
  coupons: CouponItem[];
  onCreateCoupon: (coupon: CouponItem) => void;
  onToggleCoupon: (couponId: string) => void;
  onDeleteCoupon: (couponId: string) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenCoupons: React.FC<ScreenCouponsProps> = ({
  coupons,
  onCreateCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  onNavigate
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(500);
  const [maxDiscount, setMaxDiscount] = useState<number>(300);
  const [expiryDate, setExpiryDate] = useState("2025-06-30");
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      maxDiscount: discountType === "percentage" ? Number(maxDiscount) : undefined,
      expiryDate,
      usageLimit: Number(usageLimit),
      usedCount: 0,
      status: "Active"
    };

    onCreateCoupon(newCoupon);
    setShowCreateModal(false);
    setCode("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Coupons & Discount Codes ({coupons.length})</h3>
            <p className="text-xs text-slate-500">Create promotional discount codes for cart incentives</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* 2. Coupons List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {coupons.map((c) => {
          const isActive = c.status === "Active";
          return (
            <div
              key={c.id}
              className={`bg-white rounded-3xl p-4 sm:p-5 border shadow-2xs space-y-3 relative overflow-hidden transition-all ${
                isActive ? "border-orange-200/90" : "border-slate-200 opacity-60"
              }`}
            >
              {/* Top Row: Code & Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-orange-50 text-[#FF5A36] border border-dashed border-[#FF5A36] rounded-xl font-black text-sm tracking-wider flex items-center gap-2">
                    <span>{c.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.code)}
                      className="text-slate-400 hover:text-[#FF5A36] cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              {/* Discount Info */}
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}% OFF`
                    : `Flat NPR ${c.discountValue} OFF`}
                </div>
                <div className="text-xs text-slate-500">
                  Min spend: <strong className="text-slate-700">NPR {c.minSpend}</strong>
                  {c.maxDiscount && (
                    <span> • Max cap: <strong className="text-slate-700">NPR {c.maxDiscount}</strong></span>
                  )}
                </div>
              </div>

              {/* Progress Bar & Expiry */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>Usage: {c.usedCount} / {c.usageLimit}</span>
                  <span>Expires: {c.expiryDate}</span>
                </div>
                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF5A36] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-orange-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleCoupon(c.id)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isActive ? "Pause Coupon" : "Activate"}
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCoupon(c.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#FF5A36]" /> Create Promo Coupon
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code <span className="text-[#FF5A36]">*</span></label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME20, HEALTHY100"
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold uppercase text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (NPR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Value ({discountType === "percentage" ? "%" : "NPR"})</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Spend (NPR)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Discount Cap (NPR)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create & Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
