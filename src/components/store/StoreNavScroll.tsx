import React from "react";
import {
  Sparkles,
  LayoutGrid,
  Package,
  FileText,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShoppingBag,
  Receipt,
  Tag,
  BarChart3,
  RotateCcw,
  Wallet,
  Users,
  AlertTriangle,
  Truck,
  Eye
} from "lucide-react";
import { StoreTab } from "./types";

interface StoreNavScrollProps {
  currentTab: StoreTab;
  onSelectTab: (tab: StoreTab) => void;
  processingOrdersCount?: number;
  lowStockCount?: number;
  pendingReturnsCount?: number;
}

interface TabItem {
  id: StoreTab;
  numberPrefix: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const StoreNavScroll: React.FC<StoreNavScrollProps> = ({
  currentTab,
  onSelectTab,
  processingOrdersCount = 0,
  lowStockCount = 0,
  pendingReturnsCount = 0
}) => {
  const tabs: TabItem[] = [
    { id: "store_setup", numberPrefix: "1", label: "Store Setup Wizard", icon: Sparkles },
    { id: "inventory_overview", numberPrefix: "2", label: "Inventory Overview", icon: LayoutGrid },
    { id: "products", numberPrefix: "3", label: "Products Catalog", icon: Package },
    { id: "product_details", numberPrefix: "4", label: "Product Details", icon: FileText },
    { id: "stock_in", numberPrefix: "5", label: "Stock In / Receive", icon: ArrowDownToLine },
    { id: "stock_out", numberPrefix: "6", label: "Stock Out / Issue", icon: ArrowUpFromLine },
    {
      id: "orders",
      numberPrefix: "7",
      label: "Orders Management",
      icon: ShoppingBag,
      badge: processingOrdersCount > 0 ? `${processingOrdersCount} New` : undefined,
      badgeColor: "bg-[#FF5A36] text-white"
    },
    { id: "order_details", numberPrefix: "8", label: "Order Details & Invoice", icon: Receipt },
    { id: "coupons", numberPrefix: "9", label: "Coupons & Discounts", icon: Tag },
    { id: "analytics", numberPrefix: "10", label: "Analytics Dashboard", icon: BarChart3 },
    {
      id: "returns_refunds",
      numberPrefix: "11",
      label: "Returns & Refunds",
      icon: RotateCcw,
      badge: pendingReturnsCount > 0 ? `${pendingReturnsCount} Pending` : undefined,
      badgeColor: "bg-amber-500 text-white"
    },
    { id: "payouts", numberPrefix: "12", label: "Payouts & Earnings", icon: Wallet },
    { id: "customers", numberPrefix: "13", label: "Customers CRM", icon: Users },
    {
      id: "inventory_alerts",
      numberPrefix: "14",
      label: "Inventory Alerts",
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined,
      badgeColor: "bg-red-500 text-white animate-pulse"
    },
    { id: "shipping_settings", numberPrefix: "15", label: "Shipping Settings", icon: Truck },
    { id: "storefront_preview", numberPrefix: "16", label: "Storefront Preview", icon: Eye }
  ];

  return (
    <div className="bg-[#FFF3EC]/60 border-b border-orange-100/80 sticky top-[73px] sm:top-[81px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? "bg-[#FF5A36] text-white shadow-xs shadow-orange-500/30 scale-[1.02]"
                    : "bg-white/80 hover:bg-white text-slate-600 hover:text-[#FF5A36] border border-orange-100/80 hover:border-orange-200"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-white text-[#FF5A36]" : "bg-orange-100/80 text-orange-900"
                  }`}
                >
                  {tab.numberPrefix}
                </span>

                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      isActive ? "bg-white text-[#FF5A36]" : tab.badgeColor || "bg-orange-500 text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
