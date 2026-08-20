import React, { useState } from "react";
import {
  Settings,
  Shield,
  Volume2,
  PhoneCall,
  MapPin,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
  Sliders,
  Sparkles
} from "lucide-react";
import { SosSettingsConfig, SosEmergencyContact } from "./types";

interface SosSettingsProps {
  settings: SosSettingsConfig;
  contacts: SosEmergencyContact[];
  onUpdateSettings: (newSettings: SosSettingsConfig) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaults: () => void;
  onNotify: (msg: string) => void;
}

export const SosSettings: React.FC<SosSettingsProps> = ({
  settings,
  contacts,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetDefaults,
  onNotify
}) => {
  const [config, setConfig] = useState<SosSettingsConfig>(settings);

  const handleToggle = (key: keyof SosSettingsConfig) => {
    const updated = { ...config, [key]: !config[key] };
    setConfig(updated);
    onUpdateSettings(updated);
    onNotify("Settings saved.");
  };

  const handleChange = (key: keyof SosSettingsConfig, value: any) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    onUpdateSettings(updated);
    onNotify("Settings saved.");
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">SOS Settings</h2>
        <p className="text-xs text-slate-500 font-medium">
          Configure panic triggers, automated beacon dials, and check-in intervals
        </p>
      </div>

      {/* GENERAL SECTION (SCREEN 11) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-6 shadow-xs space-y-4">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          General
        </span>

        <div className="divide-y divide-orange-100/70">
          {/* Activation Method */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">SOS Activation Method</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                How panic sequence is initiated
              </p>
            </div>
            <select
              value={config.activationMethod}
              onChange={(e) => handleChange("activationMethod", e.target.value)}
              className="p-2 text-xs font-bold bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none text-slate-800"
            >
              <option value="Press & Hold 3s">Press & Hold 3s</option>
              <option value="Tap to Activate">Instant Tap</option>
              <option value="Triple Tap">Triple Tap</option>
            </select>
          </div>

          {/* Alert Sound */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">Alert Sound</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Audio alarm played on trigger
              </p>
            </div>
            <select
              value={config.alertSound}
              onChange={(e) => handleChange("alertSound", e.target.value)}
              className="p-2 text-xs font-bold bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none text-slate-800"
            >
              <option value="Siren">Siren (Loud)</option>
              <option value="Loud Alarm">Loud Alarm</option>
              <option value="High Beep">High Beep</option>
              <option value="Silent Strobe">Silent (Strobe Only)</option>
            </select>
          </div>

          {/* Auto-call on SOS */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">Auto-call on SOS</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Automatically dial primary contact
              </p>
            </div>
            <button
              onClick={() => handleToggle("autoCallOnSos")}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                config.autoCallOnSos ? "bg-[#FF5A36]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  config.autoCallOnSos ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Share Exact Location */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">Share Exact Location</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Attach high-precision GPS link
              </p>
            </div>
            <button
              onClick={() => handleToggle("shareExactLocation")}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                config.shareExactLocation ? "bg-[#FF5A36]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  config.shareExactLocation ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* CHECK-IN SECTION (SCREEN 11) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-6 shadow-xs space-y-4">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Check-in
        </span>

        <div className="divide-y divide-orange-100/70">
          {/* Enable Check-in */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">Enable Check-in</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Periodic safety verification prompt
              </p>
            </div>
            <button
              onClick={() => handleToggle("enableCheckIn")}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                config.enableCheckIn ? "bg-[#FF5A36]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  config.enableCheckIn ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Check-in Interval */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">Check-in Interval</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Frequency of check-in prompts
              </p>
            </div>
            <select
              value={config.checkInIntervalHours}
              onChange={(e) => handleChange("checkInIntervalHours", Number(e.target.value))}
              className="p-2 text-xs font-bold bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none text-slate-800"
            >
              <option value={0.5}>30 Minutes</option>
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={4}>4 Hours</option>
            </select>
          </div>

          {/* Missed Check-in Action */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900">Missed Check-in Action</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Action taken if prompt unanswered
              </p>
            </div>
            <select
              value={config.missedCheckInAction}
              onChange={(e) => handleChange("missedCheckInAction", e.target.value)}
              className="p-2 text-xs font-bold bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none text-slate-800"
            >
              <option value="Alert Contacts">Alert Contacts</option>
              <option value="Trigger SOS">Trigger Full SOS</option>
              <option value="Send SMS">Send SMS Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA MANAGEMENT & BACKUP */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-6 shadow-xs space-y-3">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Data Backup & Encryption
        </span>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onExportData}
            className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-orange-50 border border-orange-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Export Backup</span>
          </button>

          <label className="p-3 rounded-2xl bg-[#FFF9F5] hover:bg-orange-50 border border-orange-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Import Backup</span>
            <input type="file" accept=".json" onChange={onImportData} className="hidden" />
          </label>
        </div>

        <button
          onClick={onResetDefaults}
          className="w-full py-2.5 rounded-xl text-slate-400 hover:text-red-600 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset SOS Preferences to Factory Defaults</span>
        </button>
      </div>
    </div>
  );
};
