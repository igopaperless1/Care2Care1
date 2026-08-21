import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Volume2,
  Bell,
  Vibrate,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Download,
  Check
} from "lucide-react";
import { MedicineSettingsModel, MedicineTab } from "./types";
import { playMedicineTone } from "./soundUtil";

interface ScreenSettingsProps {
  settings: MedicineSettingsModel;
  onUpdateSettings: (newSettings: Partial<MedicineSettingsModel>) => void;
  onResetData: () => void;
  onNavigate: (tab: MedicineTab) => void;
}

export const ScreenSettings: React.FC<ScreenSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onNavigate
}) => {
  const [localSettings, setLocalSettings] = useState<MedicineSettingsModel>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSoundTest = () => {
    playMedicineTone("alert");
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Medicine Alert & Sound Settings</h3>
            <p className="text-xs text-slate-500">Configure reminder sounds, snooze duration, & sync</p>
          </div>
        </div>
      </div>

      {/* 2. Sounds & Chimes */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-[#FF5A36]" /> Sound & Audio Chimes
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700">Reminder Sound</label>
              <select
                value={localSettings.reminderSound}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, reminderSound: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Gentle Chime">Gentle Chime (Care2Care Harmonizer)</option>
                <option value="Morning Birds">Morning Birds & Water</option>
                <option value="Radar Alert">Medical Pulse Radar</option>
                <option value="Soft Bell">Temple Zen Bell</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSoundTest}
              className="mt-5 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-bold whitespace-nowrap"
            >
              Test Sound
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Volume Level</span>
              <span className="text-[#FF5A36]">{localSettings.soundVolume}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={localSettings.soundVolume}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, soundVolume: Number(e.target.value) })
              }
              className="w-full accent-[#FF5A36] cursor-pointer"
            />
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 space-y-2 border-t border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Haptic Vibration</div>
                <div className="text-[11px] text-slate-500">Vibrate phone on scheduled dose alert</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.vibration}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, vibration: e.target.checked })
                }
                className="w-4 h-4 accent-[#FF5A36] rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Critical Alerts (Break DND)</div>
                <div className="text-[11px] text-slate-500">Play alarm sound even when Do Not Disturb is active</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.criticalAlertsDnd}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, criticalAlertsDnd: e.target.checked })
                }
                className="w-4 h-4 accent-[#FF5A36] rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Snooze & Dosing Preferences */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-500" /> Dosing & Snooze Preferences
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Snooze</label>
            <select
              value={localSettings.defaultSnoozeMinutes}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  defaultSnoozeMinutes: Number(e.target.value)
                })
              }
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Time Format</label>
            <select
              value={localSettings.timeFormat24h ? "24h" : "12h"}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  timeFormat24h: e.target.value === "24h"
                })
              }
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="12h">12-Hour (AM / PM)</option>
              <option value="24h">24-Hour (Military)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
      >
        {savedSuccess ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>Settings Saved!</span>
          </>
        ) : (
          <span>Save Preferences</span>
        )}
      </button>

      {/* Reset Data Button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all medicine reminder data back to initial clean sample state?")) {
              onResetData();
            }
          }}
          className="text-xs font-bold text-red-500 hover:underline inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Initial Sample Data
        </button>
      </div>
    </div>
  );
};
