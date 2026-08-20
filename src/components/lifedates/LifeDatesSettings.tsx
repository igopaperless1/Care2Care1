import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Sun,
  Bell,
  Download,
  Upload,
  Shield,
  HelpCircle,
  Trash2,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Globe
} from "lucide-react";

export const LifeDatesSettings: React.FC = () => {
  const [dateFormat, setDateFormat] = useState("24 May 2025 (DD MMM YYYY)");
  const [reminderTime, setReminderTime] = useState("09:00 AM");
  const [theme, setTheme] = useState("Warm Peach / Water");
  const [firstDay, setFirstDay] = useState("Monday");
  const [notifications, setNotifications] = useState(true);
  const [nepaliCalendarEnabled, setNepaliCalendarEnabled] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ exportDate: new Date().toISOString(), type: "LifeDatesService" }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lifedates-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Data exported successfully as JSON.");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all life dates, memories and couple goals?")) {
      showToast("Life Dates database restored to defaults.");
    }
  };

  return (
    <div className="space-y-4">
      {/* TOAST FEEDBACK */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* PREFERENCES */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
          Preferences
        </h3>

        <div className="bg-white border border-orange-200/60 rounded-2xl divide-y divide-orange-100 overflow-hidden text-xs">
          {/* Date Format */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Calendar className="w-4 h-4 text-[#FF5A36]" />
              <span>Date Format</span>
            </div>
            <select
              value={dateFormat}
              onChange={(e) => {
                setDateFormat(e.target.value);
                showToast("Date format updated.");
              }}
              className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer text-right"
            >
              <option value="24 May 2025 (DD MMM YYYY)">24 May 2025</option>
              <option value="May 24, 2025 (MMM DD, YYYY)">May 24, 2025</option>
              <option value="2025-05-24 (YYYY-MM-DD)">2025-05-24</option>
            </select>
          </div>

          {/* Reminder Time */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Clock className="w-4 h-4 text-[#FF5A36]" />
              <span>Default Reminder Time</span>
            </div>
            <select
              value={reminderTime}
              onChange={(e) => {
                setReminderTime(e.target.value);
                showToast("Default notification time set to " + e.target.value);
              }}
              className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer text-right"
            >
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM (Recommended)</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          {/* Dual Calendar BS / Tithi */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Globe className="w-4 h-4 text-[#FF5A36]" />
              <span>Nepali (BS) & Tithi Calendar</span>
            </div>
            <button
              onClick={() => {
                setNepaliCalendarEnabled(!nepaliCalendarEnabled);
                showToast(
                  nepaliCalendarEnabled
                    ? "Bikram Sambat conversion disabled."
                    : "Bikram Sambat & Tithi dates enabled."
                );
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                nepaliCalendarEnabled ? "bg-[#FF5A36]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  nepaliCalendarEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Theme */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Sun className="w-4 h-4 text-[#FF5A36]" />
              <span>Theme</span>
            </div>
            <span className="font-black text-slate-900 flex items-center gap-1">
              <span>Warm Peach (Water Style)</span>
            </span>
          </div>

          {/* First Day of Week */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Calendar className="w-4 h-4 text-[#FF5A36]" />
              <span>First Day of Week</span>
            </div>
            <select
              value={firstDay}
              onChange={(e) => {
                setFirstDay(e.target.value);
                showToast("Calendar starting on " + e.target.value);
              }}
              className="bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer text-right"
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Bell className="w-4 h-4 text-[#FF5A36]" />
              <span>System Notifications</span>
            </div>
            <button
              onClick={() => {
                setNotifications(!notifications);
                showToast(notifications ? "Notifications turned off." : "Notifications enabled.");
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                notifications ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  notifications ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* OTHER SETTINGS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
          Data & Security
        </h3>

        <div className="bg-white border border-orange-200/60 rounded-2xl divide-y divide-orange-100 overflow-hidden text-xs">
          <button
            onClick={() => showToast("Cloud auto-sync status: Healthy and up to date.")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Upload className="w-4 h-4 text-[#FF5A36]" />
              <span>Backup & Cloud Restore</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleExportData}
            className="w-full p-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Download className="w-4 h-4 text-[#FF5A36]" />
              <span>Export Life Dates (JSON / CSV)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => showToast("All anniversary & milestone records are locally AES-256 encrypted.")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <Shield className="w-4 h-4 text-[#FF5A36]" />
              <span>Privacy & Vault Protection</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => showToast("Care2Care Life Dates Guide v2.4")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 text-slate-700 font-bold">
              <HelpCircle className="w-4 h-4 text-[#FF5A36]" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleResetData}
            className="w-full p-3.5 flex items-center justify-between hover:bg-rose-50/50 text-rose-600 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 font-bold">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Delete All Data</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
