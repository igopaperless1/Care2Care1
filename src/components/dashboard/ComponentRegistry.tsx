import React from "react";
import { DailyTimeline } from "./widgets/DailyTimeline";
import { ProgressRings } from "./widgets/ProgressRings";
import { FinanceWidget } from "./widgets/FinanceWidget";
import { MedicineAlertBanner } from "./widgets/MedicineAlertBanner";
import { QuickActions } from "./widgets/QuickActions";
import { InventoryWidget } from "./widgets/InventoryWidget";
import { AutoRemindersWidget } from "./widgets/AutoRemindersWidget";

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  position: number;
  visible: boolean;
  title?: string;
  subtitle?: string;
  gridSpan?: string;
}

export const UI_COMPONENT_REGISTRY: Record<
  string,
  {
    component: React.FC<{ widgetId?: string }>;
    title: string;
    subtitle: string;
    defaultSpan: string;
  }
> = {
  AUTO_REMINDERS: {
    component: AutoRemindersWidget,
    title: "Pending Setup Reminders",
    subtitle: "Automated alerts for skipped or pending configuration items",
    defaultSpan: "FULL_WIDTH",
  },
  DAILY_ROADMAP: {
    component: DailyTimeline,
    title: "Daily Roadmap & Checklist",
    subtitle: "Chronological daily medications, water logs, bills & habits",
    defaultSpan: "FULL_WIDTH",
  },
  COMPACT_2X2: {
    component: ProgressRings,
    title: "Live Activity & Health Rings",
    subtitle: "Real-time hydration, steps, budget & streak percentages",
    defaultSpan: "FULL_WIDTH",
  },
  FULL_WIDTH_SUMMARY: {
    component: FinanceWidget,
    title: "Finance & Income Overview",
    subtitle: "Monthly income, expenses, and net savings",
    defaultSpan: "FULL_WIDTH",
  },
  HIGH_PRIORITY_BANNER: {
    component: MedicineAlertBanner,
    title: "Urgent Medical & Dose Alert",
    subtitle: "High priority scheduled medications",
    defaultSpan: "FULL_WIDTH",
  },
  FLOATING_ACTIONS: {
    component: QuickActions,
    title: "Smart Command Launcher",
    subtitle: "1-tap quick actions across active modules",
    defaultSpan: "FULL_WIDTH",
  },
  RETAIL_INVENTORY: {
    component: InventoryWidget,
    title: "Inventory & Stock Summary",
    subtitle: "SKU stock counts, low stock alerts, and expiration flags",
    defaultSpan: "FULL_WIDTH",
  },
};
