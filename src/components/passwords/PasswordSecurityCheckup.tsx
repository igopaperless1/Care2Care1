import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Key, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

interface PasswordSecurityCheckupProps {
  onFixWeakPasswords: () => void;
}

export const PasswordSecurityCheckup: React.FC<PasswordSecurityCheckupProps> = ({
  onFixWeakPasswords,
}) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Security Checkup
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Full vault vulnerability audit against rainbow tables and leak patterns
          </p>
        </div>
        <button
          onClick={handleRescan}
          className="px-3.5 py-1.5 rounded-xl bg-orange-100 text-[#FF5A36] hover:bg-orange-200 text-xs font-black transition-all cursor-pointer"
        >
          {isScanning ? "Scanning..." : "Rescan Vault"}
        </button>
      </div>

      {/* SCAN COMPLETE GAUGE */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col items-center text-center space-y-4">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-orange-100" strokeWidth="9" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-emerald-500"
              strokeWidth="9"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - 0.82)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
            <span className="text-2xl font-black text-slate-900">82/100</span>
            <span className="text-[9px] font-black text-emerald-600 uppercase">Strong</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">Scan Complete</h3>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mt-0.5">
            3 weak and 7 reused passwords detected. Fixing these will elevate your score to 98%.
          </p>
        </div>
      </div>

      {/* DETAILED CATEGORIZED BREAKDOWN */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Vault Vulnerability Breakdown
        </h4>

        <div className="space-y-2">
          {/* Strong */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800">Strong Passwords</span>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              112
            </span>
          </div>

          {/* Weak */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-slate-800">Weak Passwords</span>
            </div>
            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg">
              3
            </span>
          </div>

          {/* Reused */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5A36]" />
              <span className="text-xs font-bold text-slate-800">Reused Passwords</span>
            </div>
            <span className="text-xs font-black text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-lg">
              7
            </span>
          </div>

          {/* Old */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-xs font-bold text-slate-800">Old Passwords (&gt; 1 yr)</span>
            </div>
            <span className="text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              6
            </span>
          </div>

          {/* Compromised */}
          <div className="bg-white rounded-2xl p-3.5 border border-orange-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800">Compromised Passwords</span>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              0
            </span>
          </div>
        </div>

        <button
          onClick={onFixWeakPasswords}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto-Strengthen Weak Passwords</span>
        </button>
      </div>
    </div>
  );
};
