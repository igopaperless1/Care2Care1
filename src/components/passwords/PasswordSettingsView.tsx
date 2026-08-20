import React, { useState } from "react";
import {
  Lock,
  Fingerprint,
  ShieldCheck,
  Smartphone,
  Cloud,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  Clock,
  Sparkles,
  Check
} from "lucide-react";

export const PasswordSettingsView: React.FC = () => {
  const [autoLockMins, setAutoLockMins] = useState(5);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [clipboardTimeout, setClipboardTimeout] = useState(30);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Vault Settings
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Configure encryption preferences, biometrics, auto-fill, and cloud sync
          </p>
        </div>
      </div>

      {/* SECURITY SECTION */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#FF5A36]" />
          Security Controls
        </h3>

        <div className="space-y-2">
          {/* Auto-Lock */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Auto-Lock Vault</span>
              <span className="text-[11px] font-semibold text-slate-400">Lock vault after inactivity</span>
            </div>
            <select
              value={autoLockMins}
              onChange={(e) => setAutoLockMins(Number(e.target.value))}
              className="text-xs font-black bg-orange-50 text-orange-900 border border-orange-200 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value={1}>1 Minute</option>
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={60}>1 Hour</option>
            </select>
          </div>

          {/* Biometrics */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Biometric Unlock</span>
                <span className="text-[11px] font-semibold text-slate-400">Touch ID & Face ID authentication</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricsEnabled}
              onChange={(e) => setBiometricsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </div>

          {/* 2FA */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Two-Factor Authentication</span>
                <span className="text-[11px] font-semibold text-slate-400">Hardware token & TOTP protection</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* AUTO-FILL SECTION */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-[#FF5A36]" />
          Auto-Fill & Browser Integration
        </h3>

        <div className="space-y-2">
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Auto-Fill Credentials</span>
              <span className="text-[11px] font-semibold text-slate-400">Inline credential suggestions</span>
            </div>
            <input
              type="checkbox"
              checked={autoFillEnabled}
              onChange={(e) => setAutoFillEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Auto-Save New Passwords</span>
              <span className="text-[11px] font-semibold text-slate-400">Prompt to save on web signup</span>
            </div>
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A36] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* BACKUP & SYNC */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#FF5A36]" />
          Backup & Data Portability
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button className="p-3.5 rounded-2xl bg-white hover:bg-orange-50 border border-orange-100 flex items-center justify-between text-left cursor-pointer shadow-2xs group">
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-[#FF5A36]" />
              <span className="text-xs font-bold text-slate-800">Export Encrypted Backup</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36]" />
          </button>

          <button className="p-3.5 rounded-2xl bg-white hover:bg-orange-50 border border-orange-100 flex items-center justify-between text-left cursor-pointer shadow-2xs group">
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Import from CSV / 1Pass</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
