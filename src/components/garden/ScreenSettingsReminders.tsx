import React, { useState } from "react";
import {
  Settings,
  Bell,
  Droplets,
  FlaskConical,
  Bug,
  Sprout,
  Award,
  Check,
  Globe,
  Sliders,
  DollarSign,
  Layers
} from "lucide-react";
import { FarmSettingReminder, FarmGardenItem } from "./types";
import { INITIAL_REMINDER_SETTINGS } from "./mockData";

interface ScreenSettingsRemindersProps {
  activeFarm: FarmGardenItem;
}

export const ScreenSettingsReminders: React.FC<ScreenSettingsRemindersProps> = ({
  activeFarm
}) => {
  const [subTab, setSubTab] = useState<"Reminders" | "Notifications" | "Preferences">("Reminders");
  const [reminders, setReminders] = useState<FarmSettingReminder[]>(INITIAL_REMINDER_SETTINGS);
  const [currency, setCurrency] = useState("NPR");
  const [areaUnit, setAreaUnit] = useState("Acres");

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const getReminderIcon = (iconName: string) => {
    switch (iconName) {
      case "Droplets":
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case "Sparkles":
        return <FlaskConical className="w-4 h-4 text-emerald-600" />;
      case "Bug":
        return <Bug className="w-4 h-4 text-rose-500" />;
      case "Sprout":
        return <Sprout className="w-4 h-4 text-[#FF5A36]" />;
      case "Award":
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF5A36]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* SUBTABS HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(["Reminders", "Notifications", "Preferences"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                subTab === tab
                  ? "bg-[#FF5A36] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-orange-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-400">Care2Care Farm Sync</span>
      </div>

      {subTab === "Preferences" ? (
        /* PREFERENCES & UNITS */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Regional Agricultural Units</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold focus:outline-hidden"
              >
                <option value="NPR">Nepalese Rupee (NPR ₨)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="INR">Indian Rupee (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Area Measurement Standard
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold focus:outline-hidden"
              >
                <option value="Acres">Acres</option>
                <option value="Ropani">Ropani / Aana (Hilly Nepal)</option>
                <option value="Bigha">Bigha / Kattha (Terai Nepal)</option>
                <option value="Hectares">Hectares</option>
                <option value="sq ft">Square Feet (sq ft)</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* SMART REMINDERS TOGGLES LIST (Matching Screenshot Card 12) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-base font-black text-slate-900">Smart Reminders</h3>

            <div className="space-y-2.5">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs shrink-0">
                      {getReminderIcon(rem.iconName)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{rem.label}</h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        {rem.description}
                      </p>
                    </div>
                  </div>

                  {/* TOGGLE SWITCH */}
                  <button
                    onClick={() => handleToggleReminder(rem.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      rem.enabled ? "bg-[#FF5A36]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        rem.enabled ? "translate-x-6 shadow-xs" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING REMINDERS (Matching Screenshot Card 12) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-base font-black text-slate-900">Upcoming Reminders</h3>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-orange-100/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Irrigation - Zone B
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      16 May 2025, 07:00 AM
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-orange-100/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Fertilizer - Tomato
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      18 May 2025, 09:30 AM
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                  Scheduled
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
