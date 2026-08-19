import React, { useState } from "react";
import { SlidersHorizontal, Eye, EyeOff, ArrowUp, ArrowDown, Save, Sparkles, X, RotateCcw } from "lucide-react";
import { DashboardWidgetConfig, UI_COMPONENT_REGISTRY } from "./ComponentRegistry";

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  layout: DashboardWidgetConfig[];
  onSaveLayout: (updated: DashboardWidgetConfig[]) => void;
}

export const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  isOpen,
  onClose,
  layout,
  onSaveLayout,
}) => {
  const [items, setItems] = useState<DashboardWidgetConfig[]>([...layout].sort((a, b) => a.position - b.position));

  if (!isOpen) return null;

  const toggleVisibility = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) return;
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate position indices
    const reindexed = newItems.map((it, idx) => ({ ...it, position: idx + 1 }));
    setItems(reindexed);
  };

  const handleSave = () => {
    onSaveLayout(items);
    onClose();
  };

  const handleResetDefault = () => {
    const defaultLayout: DashboardWidgetConfig[] = [
      { id: "daily_timeline", type: "DAILY_ROADMAP", position: 1, visible: true },
      { id: "progress_rings", type: "COMPACT_2X2", position: 2, visible: true },
      { id: "medicine_alerts", type: "HIGH_PRIORITY_BANNER", position: 3, visible: true },
      { id: "finance_widget", type: "FULL_WIDTH_SUMMARY", position: 4, visible: true },
      { id: "floating_actions", type: "FLOATING_ACTIONS", position: 5, visible: true },
      { id: "retail_inventory", type: "RETAIL_INVENTORY", position: 6, visible: true },
    ];
    setItems(defaultLayout);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-1.5">
                <span>Config-Driven Dashboard Layout</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Toggle & rearrange home screen widgets dynamically
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Widgets */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {items.map((item, index) => {
            const registry = UI_COMPONENT_REGISTRY[item.type];
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.visible
                    ? "bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700"
                    : "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                    #{item.position}
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-xs text-slate-900 dark:text-slate-100 truncate">
                      {registry?.title || item.type}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      {registry?.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Position Up/Down Buttons */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, "up")}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 cursor-pointer flex items-center justify-center text-xs"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, "down")}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 cursor-pointer flex items-center justify-center text-xs"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Visibility Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-black cursor-pointer flex items-center gap-1 transition-all ${
                      item.visible
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {item.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-black text-xs rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Apply & Save Layout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
