import React from "react";
import {
  Shield,
  Plus,
  Key,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Lock,
  Folder,
  FileText,
  Share2
} from "lucide-react";
import { PasswordTab } from "./types";

interface PasswordDashboardProps {
  onNavigate: (tab: PasswordTab) => void;
  onOpenAddItem: () => void;
  totalCount?: number;
  weakCount?: number;
  reusedCount?: number;
  compromisedCount?: number;
  securityScore?: number;
}

export const PasswordDashboard: React.FC<PasswordDashboardProps> = ({
  onNavigate,
  onOpenAddItem,
  totalCount = 128,
  weakCount = 3,
  reusedCount = 7,
  compromisedCount = 0,
  securityScore = 82,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* GREETING */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
            Good Morning, Roshan <span className="animate-bounce inline-block">👋</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Your security at a glance.
          </p>
        </div>
        <button
          onClick={onOpenAddItem}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* SECURITY SCORE HERO CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FF5A36]" />
            Security Score
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Strong
          </h3>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Keep it up!</span>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center self-center sm:self-auto shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-orange-100" strokeWidth="10" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#FF5A36]"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - securityScore / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900">{securityScore}</span>
            <span className="text-[9px] font-black text-orange-600 uppercase">/100</span>
          </div>
        </div>
      </div>

      {/* 4 STAT TILES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Items */}
        <button
          onClick={() => onNavigate("all_items")}
          className="bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 rounded-2xl p-3.5 text-left transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Items
            </span>
            <div className="w-7 h-7 rounded-xl bg-orange-100/80 text-[#FF5A36] flex items-center justify-center text-xs">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight mt-1.5 block">
            {totalCount}
          </span>
        </button>

        {/* Weak */}
        <button
          onClick={() => onNavigate("security_checkup")}
          className="bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 rounded-2xl p-3.5 text-left transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Weak
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-amber-600 tracking-tight mt-1.5 block">
            {weakCount}
          </span>
        </button>

        {/* Reused */}
        <button
          onClick={() => onNavigate("security_checkup")}
          className="bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 rounded-2xl p-3.5 text-left transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Reused
            </span>
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center text-xs">
              <Key className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-orange-600 tracking-tight mt-1.5 block">
            {reusedCount}
          </span>
        </button>

        {/* Compromised */}
        <button
          onClick={() => onNavigate("breach_monitor")}
          className="bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 rounded-2xl p-3.5 text-left transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Compromised
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-emerald-600 tracking-tight mt-1.5 block">
            {compromisedCount}
          </span>
        </button>
      </div>

      {/* QUICK ACTIONS LIST */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
          Quick Actions
        </h4>

        <div className="space-y-2">
          {/* Add New Item */}
          <button
            onClick={onOpenAddItem}
            className="w-full bg-white hover:bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-slate-900">Add New Item</h5>
                <p className="text-[11px] font-semibold text-slate-500">Store credentials, logins & tokens</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
          </button>

          {/* Password Generator */}
          <button
            onClick={() => onNavigate("generator")}
            className="w-full bg-white hover:bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-slate-900">Password Generator</h5>
                <p className="text-[11px] font-semibold text-slate-500">Create a strong password</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
          </button>

          {/* Security Checkup */}
          <button
            onClick={() => onNavigate("security_checkup")}
            className="w-full bg-white hover:bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-slate-900">Security Checkup</h5>
                <p className="text-[11px] font-semibold text-slate-500">Scan your passwords</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
          </button>

          {/* Breach Monitor */}
          <button
            onClick={() => onNavigate("breach_monitor")}
            className="w-full bg-white hover:bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-[#FF5A36] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-slate-900">Breach Monitor</h5>
                <p className="text-[11px] font-semibold text-slate-500">Check if your data is leaked</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
