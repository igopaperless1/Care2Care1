import React from "react";
import {
  Bell,
  Volume2,
  Vibrate,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Users,
  Smartphone
} from "lucide-react";
import { MedicineSettingsModel, MedicineTab } from "./types";

interface ScreenSettingsProps {
  settings: MedicineSettingsModel;
  onUpdateSettings: (newSettings: Partial<MedicineSettingsModel>) => void;
  onResetData: () => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenSettings: React.FC<ScreenSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onNavigate
}) => {
  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20">
      {/* 1. Notifications & Sounds */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#6C3CE1] flex items-center gap-1.5">
          <Volume2 className="w-4 h-4" />
          <span>Reminders & Alerts Audio</span>
        </h3>

        <div className="space-y-3 divide-y divide-[#D1D5DB]/40">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#1A1A1A]">
                Sound Alert Chime
              </h4>
              <p className="text-[11px] text-[#4A4A4A]">
                Play audio alert when a scheduled dose is due
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-[#6C3CE1] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#1A1A1A]">
                Default Snooze Duration
              </h4>
              <p className="text-[11px] text-[#4A4A4A]">
                Re-alert interval when snooze button is clicked
              </p>
            </div>
            <select
              value={settings.defaultSnoozeMinutes}
              onChange={(e) => onUpdateSettings({ defaultSnoozeMinutes: Number(e.target.value) })}
              className="p-2 bg-[#F3F0FF] border border-[#8B6CE6]/40 rounded-xl text-xs font-bold text-[#6C3CE1] outline-none"
            >
              <option value={5}>5 mins</option>
              <option value={10}>10 mins</option>
              <option value={15}>15 mins</option>
              <option value={30}>30 mins</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#1A1A1A]">
                Caregiver Emergency Alert
              </h4>
              <p className="text-[11px] text-[#4A4A4A]">
                Notify linked family if dose is missed by 45+ mins
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.caregiverAlertsEnabled}
              onChange={(e) => onUpdateSettings({ caregiverAlertsEnabled: e.target.checked })}
              className="w-5 h-5 accent-[#6C3CE1] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Reset / Data Controls */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#E74C3C]">
          Reset Service Data
        </h3>
        <p className="text-xs text-[#4A4A4A]">
          Restore default medication list, sample doses, and interaction database.
        </p>
        <button
          type="button"
          onClick={onResetData}
          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-[#E74C3C] border border-red-200 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Medicine Data</span>
        </button>
      </div>
    </div>
  );
};
