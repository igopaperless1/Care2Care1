import React from "react";
import {
  LayoutDashboard,
  Trees,
  CheckSquare,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Award,
  Package,
  Clock,
  CloudSun,
  BarChart3,
  Settings
} from "lucide-react";
import { FarmTab } from "./types";

interface FarmNavScrollProps {
  currentTab: FarmTab;
  onSelectTab: (tab: FarmTab) => void;
}

export const FarmNavScroll: React.FC<FarmNavScrollProps> = ({
  currentTab,
  onSelectTab
}) => {
  const navItems: Array<{ id: FarmTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my_farms", label: "My Farms & Gardens", icon: Trees },
    { id: "tasks", label: "Tasks & Schedule", icon: CheckSquare },
    { id: "sowing", label: "Sowing & Planting", icon: Sprout },
    { id: "irrigation", label: "Irrigation & Watering", icon: Droplets },
    { id: "fertilizer", label: "Soil & Fertilizer", icon: FlaskConical },
    { id: "pest", label: "Pest & Disease", icon: Bug },
    { id: "harvest", label: "Harvest & Yield", icon: Award },
    { id: "inventory", label: "Inventory & Storage", icon: Package },
    { id: "time_tracking", label: "Time Tracking", icon: Clock },
    { id: "weather", label: "Weather", icon: CloudSun },
    { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
              isActive
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                : "bg-white text-slate-700 hover:bg-orange-50/80 border-slate-200/80"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isActive ? "text-white" : "text-[#FF5A36]"
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
