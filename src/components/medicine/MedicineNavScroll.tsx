import React from "react";
import {
  LayoutDashboard,
  Pill,
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle,
  Package,
  BookOpen,
  ShieldAlert,
  CalendarCheck,
  Users,
  FileSpreadsheet,
  Settings
} from "lucide-react";
import { MedicineTab } from "./types";

interface MedicineNavScrollProps {
  currentTab: MedicineTab;
  onSelectTab: (tab: MedicineTab) => void;
  dueNowCount?: number;
  lowStockCount?: number;
}

interface TabItem {
  id: MedicineTab;
  label: string;
  numberPrefix?: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const MedicineNavScroll: React.FC<MedicineNavScrollProps> = ({
  currentTab,
  onSelectTab,
  dueNowCount = 0,
  lowStockCount = 0
}) => {
  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "my_medicines", label: "My Medicines", numberPrefix: "1", icon: Pill },
    { id: "add_medicine", label: "Add Medicine", numberPrefix: "2", icon: PlusCircle },
    { id: "schedule_dosing", label: "Schedule & Dosing", numberPrefix: "3", icon: Clock },
    {
      id: "today_doses",
      label: "Today's Doses",
      numberPrefix: "4",
      icon: Calendar,
      badge: dueNowCount > 0 ? `${dueNowCount} Due` : undefined,
      badgeColor: "bg-[#FF5A36] text-white animate-pulse"
    },
    { id: "dose_action", label: "Dose Action", numberPrefix: "5", icon: CheckCircle },
    {
      id: "refill_inventory",
      label: "Inventory & Refill",
      numberPrefix: "6",
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: "bg-amber-500 text-white"
    },
    { id: "medicine_journal", label: "Medicine Journal", numberPrefix: "7", icon: BookOpen },
    { id: "interactions_safety", label: "Interactions & Safety", numberPrefix: "8", icon: ShieldAlert },
    { id: "adherence_history", label: "21-Day Calendar", numberPrefix: "9", icon: CalendarCheck },
    { id: "caregiver_family", label: "Caregiver & Family", numberPrefix: "10", icon: Users },
    { id: "doctor_reports", label: "Doctor Report", numberPrefix: "11", icon: FileSpreadsheet },
    { id: "settings", label: "Settings", numberPrefix: "12", icon: Settings }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xs border-b border-orange-100 py-2.5 px-3 sm:px-4 sticky top-[88px] sm:top-[92px] z-20 shadow-2xs">
      <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-0.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-sm shadow-orange-500/25 scale-[1.02]"
                  : "bg-orange-50/70 hover:bg-orange-100/80 text-slate-700 hover:text-slate-900 border border-orange-100/60"
              }`}
            >
              {t.numberPrefix && (
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                    isActive ? "bg-white text-[#FF5A36]" : "bg-orange-200/80 text-orange-900"
                  }`}
                >
                  {t.numberPrefix}
                </span>
              )}
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-orange-500"}`} />
              <span>{t.label}</span>

              {t.badge && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold shadow-2xs ${t.badgeColor}`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
