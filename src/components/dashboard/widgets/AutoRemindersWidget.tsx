import React, { useState, useEffect } from "react";
import { Sparkles, AlertCircle, ArrowRight, CheckCircle2, UserPlus, Sliders, Zap } from "lucide-react";
import { UniformWidgetShell } from "../UniformWidgetShell";

interface PendingItem {
  id: string;
  title: string;
  description: string;
  action: string;
  pending: boolean;
}

export const AutoRemindersWidget: React.FC<{ widgetId?: string }> = () => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);

  useEffect(() => {
    // Check localStorage or API for pending setup items
    const savedPending = localStorage.getItem("care2care_pending_setups");
    if (savedPending) {
      try {
        setPendingItems(JSON.parse(savedPending));
      } catch (e) {
        setPendingItems(getDefaultPending());
      }
    } else {
      setPendingItems(getDefaultPending());
    }
  }, []);

  const getDefaultPending = (): PendingItem[] => [
    {
      id: "sub_accounts",
      title: "Complete Sub-Accounts Setup",
      description: "You skipped adding family/staff members during setup. Add them anytime for multi-account syncing.",
      action: "ADD_SUBACCOUNT",
      pending: true,
    },
    {
      id: "quick_templates",
      title: "Create Quick-Add Shortcuts",
      description: "Set up 1-tap logging shortcuts for frequent expenses or vitals.",
      action: "CREATE_TEMPLATE",
      pending: true,
    },
  ];

  const handleDismiss = (id: string) => {
    const updated = pendingItems.filter((item) => item.id !== id);
    setPendingItems(updated);
    localStorage.setItem("care2care_pending_setups", JSON.stringify(updated));
  };

  const handleAction = (item: PendingItem) => {
    if (item.action === "ADD_SUBACCOUNT") {
      const event = new CustomEvent("care2care_open_add_member");
      window.dispatchEvent(event);
    } else if (item.action === "CREATE_TEMPLATE") {
      const event = new CustomEvent("care2care_open_reconfig_wizard");
      window.dispatchEvent(event);
    }
    handleDismiss(item.id);
  };

  if (pendingItems.length === 0) {
    return null; // Invisible when no pending items exist
  }

  return (
    <UniformWidgetShell
      title="Setup & Pending Reminders"
      subtitle="Complete skipped configuration items to unlock full OS automation"
      headerAction={
        <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full border border-emerald-200 dark:border-emerald-800">
          Smart OS
        </span>
      }
    >
      <div className="space-y-3">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:bg-amber-500/15"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">{item.title}</h4>
                <p className="text-[11px] font-medium text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleDismiss(item.id)}
                className="px-3 py-1.5 text-[11px] font-extrabold text-amber-800 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-900/40 rounded-xl transition-all cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => handleAction(item)}
                className="px-4 py-1.5 text-[11px] font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Complete Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </UniformWidgetShell>
  );
};
