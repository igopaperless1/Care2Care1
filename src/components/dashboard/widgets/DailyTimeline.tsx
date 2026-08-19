import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Circle, AlertCircle, Pill, Droplets, Wallet, Calendar, Sparkles } from "lucide-react";

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  type: "medicine" | "finance_bill" | "habit" | "water" | "appointment";
  isCompleted: boolean;
  urgency?: "high" | "medium" | "normal";
}

const DEFAULT_TIMELINE_ITEMS: TimelineEvent[] = [
  {
    id: "tl-1",
    time: "08:00 AM",
    title: "Morning Medication: Amlodipine 5mg",
    subtitle: "Take 1 tablet with warm water after breakfast",
    type: "medicine",
    isCompleted: true,
    urgency: "high",
  },
  {
    id: "tl-2",
    time: "10:30 AM",
    title: "Hydration Check: 500ml Water",
    subtitle: "Daily Target: 2,500ml (60% completed)",
    type: "water",
    isCompleted: true,
  },
  {
    id: "tl-3",
    time: "02:00 PM",
    title: "Clinic Facility Rent & Utility Bill Due",
    subtitle: "Amount: NPR 12,500 (Standard Chartered Bank Auto-Pay)",
    type: "finance_bill",
    isCompleted: false,
    urgency: "high",
  },
  {
    id: "tl-4",
    time: "05:00 PM",
    title: "Evening Mindfulness & Diaphragmatic Breathwork",
    subtitle: "15 minutes guided meditation loop",
    type: "habit",
    isCompleted: false,
  },
  {
    id: "tl-5",
    time: "08:30 PM",
    title: "Night Dose: Atorvastatin 10mg",
    subtitle: "Take before sleep with water",
    type: "medicine",
    isCompleted: false,
    urgency: "medium",
  },
];

export const DailyTimeline: React.FC<{ widgetId?: string }> = () => {
  const [items, setItems] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("care2care_daily_timeline");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems(DEFAULT_TIMELINE_ITEMS);
      }
    } catch (e) {
      setItems(DEFAULT_TIMELINE_ITEMS);
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = items.map((i) => (i.id === id ? { ...i, isCompleted: !i.isCompleted } : i));
    setItems(updated);
    try {
      localStorage.setItem("care2care_daily_timeline", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "medicine":
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case "finance_bill":
        return <Wallet className="w-4 h-4 text-amber-600" />;
      case "water":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "appointment":
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  const completedCount = items.filter((i) => i.isCompleted).length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Daily Progress Bar Header */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
            Today's Roadmap ({completedCount}/{items.length} Done)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
            {progressPct}%
          </span>
        </div>
      </div>

      {/* Timeline Item List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              item.isCompleted
                ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 opacity-75"
                : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300"
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-emerald-600 hover:scale-110 transition-transform shrink-0"
            >
              {item.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-900" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-black ${
                    item.isCompleted
                      ? "line-through text-slate-400 dark:text-slate-500"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {item.title}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-full shrink-0">
                  {item.time}
                </span>
              </div>
              {item.subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {item.subtitle}
                </p>
              )}
            </div>

            <div className="mt-0.5">{getIcon(item.type)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
