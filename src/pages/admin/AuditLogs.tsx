import React, { useState } from "react";
import {
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  UserCheck
} from "lucide-react";
import { AuditLogEntry } from "./System";

interface AuditLogsPageProps {
  auditLogs: AuditLogEntry[];
  showToast: (msg: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ auditLogs, showToast }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionCategoryFilter, setActionCategoryFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL_TIME");

  // Filter logic
  const filteredLogs = auditLogs.filter((log) => {
    // 1. Search Query
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Action Category Filter
    let matchesCategory = true;
    if (actionCategoryFilter === "BAN") {
      matchesCategory = log.action.includes("BAN") || log.action.includes("SUSPEND");
    } else if (actionCategoryFilter === "WARN") {
      matchesCategory = log.action.includes("WARN");
    } else if (actionCategoryFilter === "NOTIFY") {
      matchesCategory = log.action.includes("NOTIF") || log.action.includes("BROADCAST");
    } else if (actionCategoryFilter === "PAYOUT") {
      matchesCategory = log.action.includes("PAYOUT") || log.action.includes("FINANCE");
    } else if (actionCategoryFilter === "SYSTEM") {
      matchesCategory = log.action.includes("SYSTEM") || log.action.includes("WORKSPACE");
    }

    // 3. Time Filter (simple mock evaluation)
    let matchesTime = true;
    if (timeFilter === "TODAY") {
      const todayStr = new Date().toISOString().substring(0, 10);
      matchesTime = log.timestamp.startsWith(todayStr);
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast("No audit records available to export!");
      return;
    }

    const csvHeaders = ["ID,Timestamp,Admin Email,Action,Details"];
    const csvRows = filteredLogs.map((log) => {
      const sanitizedDetails = `"${log.details.replace(/"/g, '""')}"`;
      return `${log.id},${log.timestamp},${log.adminEmail},${log.action},${sanitizedDetails}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `care2care_audit_logs_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredLogs.length} audit log entries to CSV file.`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Immutable Audit Logs & Activity History</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Read-only system activity stream recording administrative operations, security policy adjustments, and account moderation.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin email, action, or target user..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Category Filter */}
          <select
            value={actionCategoryFilter}
            onChange={(e) => setActionCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Filter: All Action Categories</option>
            <option value="BAN">Bans & Account Suspensions</option>
            <option value="WARN">Warnings & Alerts</option>
            <option value="NOTIFY">Notifications & System Broadcasts</option>
            <option value="PAYOUT">Payouts & Finance</option>
            <option value="SYSTEM">System & Workspaces</option>
          </select>

          {/* Time Range Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL_TIME">Timeframe: All Time</option>
            <option value="TODAY">Today Only</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* READ-ONLY AUDIT LOG TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Recorded Security Events ({filteredLogs.length})
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Read-Only Compliance Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Details & Target Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500 font-bold">
                    No matching audit records found for selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isBan = log.action.includes("BAN") || log.action.includes("SUSPEND");
                  const isWarn = log.action.includes("WARN");
                  const isBroadcast = log.action.includes("BROADCAST") || log.action.includes("NOTIF");

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{log.adminEmail}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                            isBan
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : isWarn
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : isBroadcast
                              ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                              : "bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{log.details}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
