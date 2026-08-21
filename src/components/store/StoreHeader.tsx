import React from "react";
import {
  Store as StoreIcon,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Plus,
  ArrowLeft,
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  DollarSign
} from "lucide-react";
import { StoreTab, StoreProfileModel } from "./types";

interface StoreHeaderProps {
  currentTab: StoreTab;
  onNavigate: (tab: StoreTab) => void;
  storeProfile: StoreProfileModel;
  totalRevenue: number;
  lowStockCount: number;
  processingOrdersCount: number;
  onOpenAddProductModal: () => void;
  onBack?: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  currentTab,
  onNavigate,
  storeProfile,
  totalRevenue,
  lowStockCount,
  processingOrdersCount,
  onOpenAddProductModal,
  onBack
}) => {
  return (
    <header className="bg-white border-b border-orange-100/80 sticky top-0 z-30 shadow-xs">
      {/* Top Coral Header Bar */}
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-bold flex items-center gap-1">
            <StoreIcon className="w-3 h-3" /> STORE & MARKETPLACE
          </span>
          <span className="hidden sm:inline text-orange-100 font-medium">
            Empowering Health, Herbal & Organic Commerce
          </span>
        </div>

        <div className="flex items-center gap-3">
          {processingOrdersCount > 0 && (
            <button
              onClick={() => onNavigate("orders")}
              className="bg-white text-[#FF5A36] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-orange-50 transition-colors shadow-2xs animate-pulse cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3" /> {processingOrdersCount} Processing Orders
            </button>
          )}

          {lowStockCount > 0 && (
            <button
              onClick={() => onNavigate("inventory_alerts")}
              className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" /> {lowStockCount} Low Stock
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-white/95 text-[11px] bg-black/15 px-2.5 py-0.5 rounded-full">
            <DollarSign className="w-3 h-3 text-amber-300" />
            <span>Revenue:</span>
            <strong className="text-white font-bold">NPR {totalRevenue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Main Navigation Subheader */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-600 hover:text-[#FF5A36] border border-slate-200 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0"
              title="Back to Services"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={storeProfile.logoUrl}
                alt={storeProfile.storeName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-2xl object-cover border-2 border-orange-200 shadow-2xs shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" title="Verified Store">
                <ShieldCheck className="w-2.5 h-2.5" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                  {storeProfile.storeName}
                </h1>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Live & Active
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden xs:block">
                {storeProfile.storeTagline} • {storeProfile.city}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("storefront_preview")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === "storefront_preview"
                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                : "bg-orange-50/70 hover:bg-orange-100 text-[#FF5A36] border-orange-200"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live</span> Storefront
          </button>

          <button
            type="button"
            onClick={onOpenAddProductModal}
            className="px-3.5 py-1.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </header>
  );
};
