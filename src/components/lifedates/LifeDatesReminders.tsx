import React, { useState } from "react";
import {
  Bell,
  Plus,
  Sliders,
  CheckCircle2,
  Heart,
  Gift,
  Camera,
  Calendar,
  Clock,
  Volume2,
  AlertCircle
} from "lucide-react";
import { ReminderSettingItem } from "./types";
import { INITIAL_REMINDERS } from "./data";

interface LifeDatesRemindersProps {
  onOpenSettings?: () => void;
}

export const LifeDatesReminders: React.FC<LifeDatesRemindersProps> = ({
  onOpenSettings
}) => {
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [reminders, setReminders] = useState<ReminderSettingItem[]>(INITIAL_REMINDERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Reminder form state
  const [newTitle, setNewTitle] = useState("");
  const [newNoticeTime, setNewNoticeTime] = useState("1 Day Before at 9:00 AM");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast("Reminder preference updated.");
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ReminderSettingItem = {
      id: "r-" + Date.now(),
      eventTitle: newTitle,
      eventDate: "Custom Date",
      noticeTime: newNoticeTime,
      enabled: true,
      category: "Special Day",
    };

    setReminders((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle("");
    showToast("New reminder scheduled!");
  };

  return (
    <div className="space-y-4">
      {/* TOAST FEEDBACK */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MASTER TOGGLE HEADER CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] text-white flex items-center justify-center shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Event Reminders</h3>
            <p className="text-xs font-semibold text-slate-500">
              Get timely notifications before special moments
            </p>
          </div>
        </div>

        {/* Master Switch */}
        <button
          onClick={() => {
            setMasterEnabled(!masterEnabled);
            showToast(masterEnabled ? "All notifications silenced." : "Reminders activated.");
          }}
          className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
            masterEnabled ? "bg-[#FF5A36]" : "bg-slate-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
              masterEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* LIST OF EVENT REMINDERS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Active Alerts ({reminders.filter((r) => r.enabled && masterEnabled).length})
          </h3>
          <span className="text-[11px] font-bold text-slate-500">Default Alarm: 9:00 AM</span>
        </div>

        <div className="space-y-2.5">
          {reminders.map((r) => {
            const isAnniversary = r.category === "Anniversary";
            const isBirthday = r.category === "Birthday";

            return (
              <div
                key={r.id}
                className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all shadow-2xs ${
                  r.enabled && masterEnabled
                    ? "border-orange-200/80"
                    : "border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isAnniversary
                        ? "bg-rose-100 text-rose-500"
                        : isBirthday
                        ? "bg-amber-100 text-amber-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {isAnniversary ? (
                      <Heart className="w-5 h-5 fill-rose-500" />
                    ) : isBirthday ? (
                      <Gift className="w-5 h-5" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 truncate">{r.eventTitle}</h4>
                    <p className="text-[11px] font-bold text-[#FF5A36] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF5A36]" />
                      <span>{r.noticeTime}</span>
                    </p>
                  </div>
                </div>

                {/* Individual Switch */}
                <button
                  disabled={!masterEnabled}
                  onClick={() => handleToggleReminder(r.id)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    r.enabled && masterEnabled ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      r.enabled && masterEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="space-y-2">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full py-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFEFE8] border border-orange-200/80 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-[#FF5A36]" />
          <span>Reminder Settings</span>
        </button>
      </div>

      {/* MODAL: ADD REMINDER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF5A36]" />
              <h3 className="text-base font-black text-slate-900">Schedule New Reminder</h3>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Wedding Anniversary Surprise"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reminder Notice</label>
                <select
                  value={newNoticeTime}
                  onChange={(e) => setNewNoticeTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                >
                  <option value="On the Day at 9:00 AM">On the Day at 9:00 AM</option>
                  <option value="1 Day Before at 9:00 AM">1 Day Before at 9:00 AM</option>
                  <option value="2 Days Before at 9:00 AM">2 Days Before at 9:00 AM</option>
                  <option value="3 Days Before at 9:00 AM">3 Days Before at 9:00 AM</option>
                  <option value="7 Days Before at 9:00 AM">1 Week Before at 9:00 AM</option>
                  <option value="15 Days Before at 9:00 AM">15 Days Before at 9:00 AM</option>
                  <option value="30 Days Before at 9:00 AM">1 Month Before at 9:00 AM</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
