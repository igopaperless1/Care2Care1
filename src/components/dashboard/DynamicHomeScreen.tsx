import React, { useState, useEffect } from "react";
import { SlidersHorizontal, Sparkles, RefreshCw, Layers } from "lucide-react";
import { UniformWidgetShell } from "./UniformWidgetShell";
import { UI_COMPONENT_REGISTRY, DashboardWidgetConfig } from "./ComponentRegistry";
import { DashboardSettings } from "./DashboardSettings";

const DEFAULT_LAYOUT: DashboardWidgetConfig[] = [
  { id: "daily_timeline", type: "DAILY_ROADMAP", position: 1, visible: true },
  { id: "progress_rings", type: "COMPACT_2X2", position: 2, visible: true },
  { id: "medicine_alerts", type: "HIGH_PRIORITY_BANNER", position: 3, visible: true },
  { id: "finance_widget", type: "FULL_WIDTH_SUMMARY", position: 4, visible: true },
  { id: "floating_actions", type: "FLOATING_ACTIONS", position: 5, visible: true },
  { id: "retail_inventory", type: "RETAIL_INVENTORY", position: 6, visible: true },
];

export const DynamicHomeScreen: React.FC<{
  showToast?: (msg: string) => void;
  userId?: string;
}> = ({ showToast, userId = "primary-user" }) => {
  const [layout, setLayout] = useState<DashboardWidgetConfig[]>(DEFAULT_LAYOUT);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadLayoutConfig = () => {
    try {
      const saved = localStorage.getItem(`care2care_user_dashboard_config_${userId}`);
      if (saved) {
        setLayout(JSON.parse(saved));
      } else {
        setLayout(DEFAULT_LAYOUT);
      }
    } catch (e) {
      setLayout(DEFAULT_LAYOUT);
    }
  };

  useEffect(() => {
    loadLayoutConfig();
  }, [userId]);

  const handleSaveLayout = (updated: DashboardWidgetConfig[]) => {
    setLayout(updated);
    try {
      localStorage.setItem(`care2care_user_dashboard_config_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Sync to backend DB if endpoint available
    fetch("/api/user-dashboard-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, layout_json: { layout: updated } }),
    }).catch((e) => console.log("DB layout sync ping:", e));

    if (showToast) {
      showToast("✨ Dashboard layout updated & saved successfully!");
    }
  };

  // Filter & Sort
  const activeWidgets = layout
    .filter((w) => w.visible)
    .sort((a, b) => a.position - b.position);

  const visibleCount = activeWidgets.length;
  const isExpanded = visibleCount === 1;
  const isCompact = visibleCount > 5;

  return (
    <div className="space-y-4">
      {/* Dynamic Header Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>Config-Driven Command Center</span>
              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-800 dark:text-amber-300 font-extrabold text-[9px] rounded-full uppercase">
                {visibleCount} Active Modules
              </span>
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {isCompact
                ? "Compact Density Mode (Saving Vertical Space)"
                : isExpanded
                ? "Expanded Detail Mode"
                : "Balanced Dashboard Grid"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
          <span>Customize Layout</span>
        </button>
      </div>

      {/* Grid of Dynamic Widgets */}
      <div className="grid grid-cols-12 gap-4">
        {activeWidgets.map((widget) => {
          const registry = UI_COMPONENT_REGISTRY[widget.type];
          if (!registry) return null; // Graceful fallback if module missing

          const WidgetComponent = registry.component;

          return (
            <UniformWidgetShell
              key={widget.id}
              id={widget.id}
              type={widget.type}
              title={registry.title}
              subtitle={registry.subtitle}
              gridSpan={widget.gridSpan || registry.defaultSpan}
              isCompact={isCompact}
              isExpanded={isExpanded}
              onSettingsClick={() => setIsSettingsOpen(true)}
            >
              <WidgetComponent widgetId={widget.id} />
            </UniformWidgetShell>
          );
        })}
      </div>

      {/* Settings Modal */}
      <DashboardSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        layout={layout}
        onSaveLayout={handleSaveLayout}
      />
    </div>
  );
};
