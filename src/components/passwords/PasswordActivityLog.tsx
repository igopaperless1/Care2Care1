import React, { useState } from "react";
import { INITIAL_ACTIVITY_LOGS } from "./data";
import { Clock, Shield, Key, Share2, Download, Filter, CheckCircle2 } from "lucide-react";
import { PasswordActivityLogItem } from "./types";

export const PasswordActivityLog: React.FC = () => {
  const [logs] = useState<PasswordActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [filterType, setFilterType] = useState<"All" | "Login" | "Change" | "Share">("All");

  const filteredLogs = logs.filter((log) => {
    if (filterType === "All") return true;
    if (filterType === "Login") return log.action.toLowerCase().includes("logged");
    if (filterType === "Change") return log.action.toLowerCase().includes("updated") || log.action.toLowerCase().includes("backup");
    if (filterType === "Share") return log.action.toLowerCase().includes("shared");
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Security Activity Log
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Immutable audit trail of all vault accesses, auto-fills, and modifications
          </p>
        </div>

        {/* FILTER PILLS */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl w-fit">
          {(["All", "Login", "Change", "Share"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterType === t
                  ? "bg-[#FF5A36] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* LOGS LIST */}
      <div className="space-y-2.5">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-[#FF5A36] shadow-2xs shrink-0">
                {log.action.includes("Logged") ? (
                  <Key className="w-4 h-4" />
                ) : log.action.includes("Shared") ? (
                  <Share2 className="w-4 h-4" />
                ) : log.action.includes("Scan") ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {log.action}
                </h4>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 text-orange-600">
                    <Clock className="w-3 h-3" /> {log.timestamp}
                  </span>
                  {log.device && (
                    <>
                      <span>•</span>
                      <span>{log.device}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Verified
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
