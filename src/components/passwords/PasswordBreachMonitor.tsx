import React, { useState } from "react";
import { ShieldCheck, Plus, RefreshCw, Bell, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

export const PasswordBreachMonitor: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([
    "roshan.singh@gmail.com",
    "roshan_work@care2care.org",
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes("@")) return;
    setEmails((prev) => [...prev, newEmail]);
    setNewEmail("");
    setIsAddingEmail(false);
  };

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Breach Monitor
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Dark web leak radar and compromised identity notification engine
          </p>
        </div>
      </div>

      {/* YOU'RE SAFE HERO BANNER */}
      <div className="bg-gradient-to-br from-[#FFF2EB] via-[#FFE8DC] to-[#FEDBC9] border border-orange-200/80 rounded-3xl p-6 shadow-xs text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-white text-[#FF5A36] border border-orange-200 shadow-md flex items-center justify-center text-3xl mx-auto">
          🛡️
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            You're Safe!
          </h3>
          <p className="text-xs font-bold text-slate-600 mt-0.5">
            No active leaks or compromised records found for your monitored credentials.
          </p>
        </div>
      </div>

      {/* MONITORED EMAILS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Monitored Accounts ({emails.length})
          </span>
          <button
            onClick={() => setIsAddingEmail(true)}
            className="text-xs font-black text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Email</span>
          </button>
        </div>

        {isAddingEmail && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-orange-200">
            <input
              type="email"
              placeholder="e.g. personal@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full text-xs font-bold px-3 py-1.5 focus:outline-none"
            />
            <button
              onClick={handleAddEmail}
              className="px-4 py-1.5 rounded-xl bg-[#FF5A36] text-white text-xs font-black shrink-0 cursor-pointer"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-2">
          {emails.map((email, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-black text-slate-900">{email}</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Clean
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SCAN METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Last Scan */}
        <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Last Scan
            </span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">
              14 May 2025, 9:30 AM
            </span>
          </div>
          <button
            onClick={handleRescan}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-[#FF5A36] border border-orange-200 text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning..." : "Rescan"}</span>
          </button>
        </div>

        {/* Breaches Checked */}
        <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Breaches Checked
            </span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">
              12,458,790,123
            </span>
          </div>
          <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-2.5 py-1 rounded-xl">
            Live Feed
          </span>
        </div>
      </div>

      {/* TIPS & ALERTS BOX */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#FF5A36]" />
            Real-Time Leak Telemetry
          </h4>
          <p className="text-xs font-semibold text-slate-600">
            Turn on real-time alerts to get instant notifications if your password appears in a breach.
          </p>
        </div>

        <button
          onClick={() => setAlertsEnabled(!alertsEnabled)}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer shrink-0 ${
            alertsEnabled
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-[#FF5A36] text-white shadow-xs"
          }`}
        >
          {alertsEnabled ? "Alerts Enabled ✓" : "Enable Alerts"}
        </button>
      </div>
    </div>
  );
};
