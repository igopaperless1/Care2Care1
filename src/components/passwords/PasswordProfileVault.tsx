import React, { useState } from "react";
import { User, Shield, Key, Lock, Users, LogOut, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

export const PasswordProfileVault: React.FC = () => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {feedback && (
        <div className="bg-emerald-500 text-white p-3 rounded-2xl text-xs font-black text-center shadow-md">
          {feedback}
        </div>
      )}

      {/* USER PROFILE CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white text-2xl font-black shadow-md">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Roshan Singh
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                PRO
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              roshan.singh@gmail.com
            </p>
          </div>
        </div>

        <div className="bg-white px-4 py-3 rounded-2xl border border-orange-100 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>Vault Quota</span>
            <span className="text-[#FF5A36]">12.4 MB / 1 GB</span>
          </div>
          <div className="h-2 w-36 bg-orange-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF5A36] rounded-full w-[15%]" />
          </div>
        </div>
      </div>

      {/* ACCOUNT & SECURITY ACTIONS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Account & Master Encryption Key
        </h3>

        <div className="space-y-2">
          {/* Change Master Password */}
          <button
            onClick={() => handleAction("Master password change request initiated.")}
            className="w-full bg-white hover:bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#FF5A36] flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">Change Master Password</h4>
                <p className="text-[11px] font-semibold text-slate-400">Last changed 30 days ago</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36]" />
          </button>

          {/* Emergency Access Contacts */}
          <button
            onClick={() => handleAction("Emergency contacts verified: 2 trusted delegates.")}
            className="w-full bg-white hover:bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">Emergency Access Contacts</h4>
                <p className="text-[11px] font-semibold text-slate-400">2 trusted recovery delegates assigned</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>

          {/* Sign Out */}
          <button
            onClick={() => handleAction("Vault locked and cached credentials flushed.")}
            className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer shadow-2xs group mt-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-2xs">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-rose-700">Lock & Sign Out</h4>
                <p className="text-[11px] font-semibold text-rose-500">Flush encryption keys from browser memory</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
