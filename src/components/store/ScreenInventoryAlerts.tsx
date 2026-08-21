import React, { useState } from "react";
import {
  AlertTriangle,
  Package,
  Bell,
  ArrowDownToLine,
  CheckCircle2,
  Settings,
  Mail,
  Smartphone
} from "lucide-react";
import { ProductItem, StoreTab } from "./types";

interface ScreenInventoryAlertsProps {
  products: ProductItem[];
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenInventoryAlerts: React.FC<ScreenInventoryAlertsProps> = ({
  products,
  onNavigate
}) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.minStockLevel);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Inventory Stock Alerts</h3>
            <p className="text-xs text-slate-500">Real-time depletion alerts to prevent stockouts and lost revenue</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("stock_in")}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 cursor-pointer"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Create Restock Batch</span>
        </button>
      </div>

      {/* 2. Critical Alert Items List */}
      <div className="space-y-3">
        {/* Out of Stock Section */}
        {outOfStockProducts.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>Critical Out of Stock ({outOfStockProducts.length})</span>
            </div>

            <div className="space-y-2">
              {outOfStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-red-50/40 rounded-3xl p-4 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border border-red-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-red-700 font-semibold">
                        Stock: 0 pcs • Reorder Level: {p.reorderLevel} pcs
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate("stock_in")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Emergency Restock</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Warning Section */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Low Stock Warnings ({lowStockProducts.length})</span>
          </div>

          <div className="space-y-2">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border border-amber-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-amber-700 font-semibold">
                      Only <strong className="text-slate-900">{p.stock} pcs</strong> remaining (Threshold: {p.minStockLevel} pcs)
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate("stock_in")}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-amber-700" />
                  <span>Receive Restock</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Alert Notification Channels */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-slate-400" /> Automated Alert Rules
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#FF5A36]" />
              <div>
                <div className="text-xs font-bold text-slate-800">Daily Stock Digest Email</div>
                <div className="text-[10px] text-slate-500">Sent every morning at 08:00 AM</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] rounded cursor-pointer"
            />
          </div>

          <div className="p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-800">Instant SMS on Low Stock</div>
                <div className="text-[10px] text-slate-500">Triggered when stock &lt; threshold</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
