import React, { useState } from "react";
import {
  Bell,
  Clock,
  Plus,
  Check,
  Trash2,
  Calendar,
  Sparkles,
  Heart
} from "lucide-react";
import { soundEngine } from "./soundEngine";

export const MentalReminders: React.FC = () => {
  const [reminders, setReminders] = useState([
    { id: "r-1", title: "Morning Mindfulness Meditation", time: "08:30 AM", enabled: true, days: "Mon, Tue, Wed, Thu, Fri" },
    { id: "r-2", title: "Midday Box Breathing Check-in", time: "02:00 PM", enabled: true, days: "Everyday" },
    { id: "r-3", title: "Evening Gratitude Journaling", time: "09:30 PM", enabled: true, days: "Everyday" },
    { id: "r-4", title: "Sleep Screen-Off Reminder", time: "10:30 PM", enabled: false, days: "Everyday" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00 AM");

  const toggleReminder = (id: string) => {
    soundEngine.playChime(550, 0.2);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) return;
    soundEngine.playChime(620, 0.3);
    const newRem = {
      id: `r-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      enabled: true,
      days: "Everyday",
    };
    setReminders([...reminders, newRem]);
    setNewTitle("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Nudges & Alerts
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Mindfulness Reminders</h2>
          <p className="text-xs text-slate-500 font-medium">Gentle daily prompts to pause, breathe, and reflect.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Reminder</span>
        </button>
      </div>

      {/* 2. Reminders Feed */}
      <div className="space-y-3">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF5A36] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{rem.title}</h4>
                <p className="text-xs font-bold text-[#FF5A36] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  {rem.time} • <span className="text-slate-400 font-medium">{rem.days}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleReminder(rem.id)}
              className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center shrink-0 ${
                rem.enabled ? "bg-[#FF5A36] justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-100 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Create New Mindfulness Reminder</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Reminder Label</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Afternoon Stress Reset"
                  className="w-full p-3 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full p-3 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                className="flex-1 py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black cursor-pointer shadow-xs"
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
