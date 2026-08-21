import React from "react";
import {
  LayoutDashboard,
  Package,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
  Users,
  ArrowLeftRight,
  History,
  Settings
} from "lucide-react";
import { InventoryTab } from "./types";

interface InventoryNavScrollProps {
  currentTab: InventoryTab;
  onSelectTab: (tab: InventoryTab) => void;
  lowStockCount?: number;
}

export const InventoryNavScroll: React.FC<InventoryNavScrollProps> = ({
  currentTab,
  onSelectTab,
  lowStockCount = 0
}) => {
  const tabs: Array<{ id: InventoryTab; label: string; icon: any; badge?: number }> = [
    { id: "overview", label: "Inventory Overview", icon: LayoutDashboard },
    { id: "items", label: "Items", icon: Package },
    { id: "item_details", label: "Item Details", icon: FileText },
    { id: "stock_in", label: "Stock In / Receive", icon: ArrowDownLeft },
    { id: "stock_out", label: "Stock Out / Issue", icon: ArrowUpRight },
    { id: "warehouses", label: "Warehouses", icon: Building2 },
    { id: "stock_take", label: "Stock Take", icon: ClipboardCheck },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "alerts", label: "Low Stock Alerts", icon: AlertTriangle, badge: lowStockCount },
    { id: "suppliers", label: "Suppliers", icon: Users },
    { id: "transfers", label: "Transfers", icon: ArrowLeftRight },
    { id: "activity_log", label: "Activity Log", icon: History },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              isActive
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                : "bg-white text-slate-700 hover:bg-orange-50/80 border-slate-200/80 hover:border-orange-200"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF5A36]"}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                  isActive ? "bg-white text-[#FF5A36]" : "bg-rose-500 text-white"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
