import React, { useState } from "react";
import {
  Bell,
  Droplets,
  Moon,
  Smile,
  Pill,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Footprints,
  Sparkles,
  ChevronRight,
  X,
  Volume2
} from "lucide-react";
import { CareToggle, CareButton, CareCard } from "../design-system";

interface ReminderItem {
  id: string;
  title: string;
  time: string;
  category: "water" | "sleep" | "mood" | "medication" | "walk" | "meditation" | "custom";
  icon: any;
  enabled: boolean;
}

export const NotificationsRemindersView: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: "r-1", title: "Water Reminder", time: "Every 2 hours", category: "water", icon: Droplets, enabled: true },
    { id: "r-2", title: "Sleep Reminder", time: "10:30 PM", category: "sleep", icon: Moon, enabled: true },
    { id: "r-3", title: "Mood Check-in", time: "08:00 PM", category: "mood", icon: Smile, enabled: false },
    { id: "r-4", title: "Medicine Reminder", time: "09:00 AM & 09:00 PM", category: "medication", icon: Pill, enabled: true },
  ]);

  const [upcomingReminders, setUpcomingReminders] = useState([
    { id: "u-1", title: "Drink Water", time: "In 30 mins", icon: Droplets, color: "text-sky-500 bg-sky-50 dark:bg-sky-950/50" },
    { id: "u-2", title: "Evening Walk", time: "6:00 PM", icon: Footprints, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
    { id: "u-3", title: "Meditation", time: "7:30 PM", icon: Sparkles, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
    { id: "u-4", title: "Bedtime", time: "10:00 PM", icon: Moon, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    setToastMsg("Reminder preference updated");
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) return;
    const newItem: ReminderItem = {
      id: "r-" + Date.now(),
      title: newTitle,
      time: newTime,
      category: "custom",
      icon: Clock,
      enabled: true
    };
    setReminders((prev) => [...prev, newItem]);
    setNewTitle("");
    setShowAddModal(false);
    setToastMsg(`Added reminder: "${newItem.title}"`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEEDB] dark:bg-orange-950/60 text-[#FF6A45] flex items-center justify-center text-2xl shadow-2xs font-black">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Notifications & Reminders
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage smart alerts, habit triggers & scheduled routines
            </p>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid: Reminder Settings + Upcoming Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Card: Reminder Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Reminder Settings
            </h2>
            <span className="text-[10px] font-bold text-slate-400">
              {reminders.filter((r) => r.enabled).length} Active
            </span>
          </div>

          <div className="space-y-3">
            {reminders.map((r) => {
              const IconComp = r.icon;
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8F5] dark:bg-slate-850 border border-[#FFE2D6] dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-[#FF6A45] flex items-center justify-center shadow-2xs border border-orange-100 dark:border-slate-700">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {r.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">{r.time}</p>
                    </div>
                  </div>
                  <CareToggle
                    checked={r.enabled}
                    onChange={() => toggleReminder(r.id)}
                  />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full py-2.5 rounded-2xl border border-dashed border-orange-300 hover:border-[#FF6A45] text-[#FF6A45] hover:bg-orange-50 dark:hover:bg-orange-950/20 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Reminder</span>
          </button>
        </div>

        {/* Right Card: Upcoming Reminders Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Upcoming Reminders
            </h2>
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              Today's Schedule
            </span>
          </div>

          <div className="space-y-3">
            {upcomingReminders.map((u) => {
              const IconComp = u.icon;
              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8F5] dark:bg-slate-850 border border-[#FFE2D6] dark:border-slate-700 hover:border-orange-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-700 ${u.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                        {u.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">Scheduled Alert</p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {u.time}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setToastMsg("Viewing full schedule calendar...")}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black rounded-2xl transition-all cursor-pointer text-center"
          >
            View All Scheduled Reminders
          </button>
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Add New Habit Reminder</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drink Cold Water, Stretches"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alert Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddReminder}
                className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-[#FF6A45] hover:bg-[#EA580C]"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
