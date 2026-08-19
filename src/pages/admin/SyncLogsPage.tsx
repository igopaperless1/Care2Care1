import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Users,
  Activity,
  Heart,
  Building,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldCheck,
  Zap,
  Play,
  Trash2,
  Calendar,
  FileText
} from "lucide-react";
import {
  SyncLogEntry,
  getLocalSyncLogs,
  propagateUserProfileUpdates
} from "../../utils/DataPropagationEngine";

export const SyncLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  const reloadLogs = () => {
    const fetched = getLocalSyncLogs();
    setLogs(fetched);
  };

  useEffect(() => {
    reloadLogs();
  }, []);

  const handleRunTestSimulation = () => {
    const testProfile = {
      id: "usr-test-99",
      fullName: "Dr. Ananya Sharma",
      gender: "Female",
      dateOfBirth: "1991-11-20",
      maritalStatus: "married",
      phone: "+977 9801998877",
      email: "ananya.sharma@care2care.org",
      address: "Bhatbhateni, Kathmandu",
      bloodGroup: "O+",
      emergencyContact: "Rajesh Sharma (+977 9841112233)",
    };

    const result = propagateUserProfileUpdates(testProfile, {}, "Profile Settings");
    reloadLogs();
    setTestNotice(`Test Simulation Complete: Propagated ${result.syncLog.totalPropagated} fields across modules (${result.affectedModules.join(", ")}).`);
    setExpandedLogId(result.syncLog.id);
    setTimeout(() => setTestNotice(null), 5000);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.changedMasterFields.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || log.status === statusFilter;

    const matchesModule =
      moduleFilter === "all" ||
      log.propagatedChanges.some((c) => c.targetModule === moduleFilter);

    return matchesSearch && matchesStatus && matchesModule;
  });

  // Analytics Math
  const totalSyncEvents = logs.length;
  const totalFieldsPropagated = logs.reduce((acc, l) => acc + l.totalPropagated, 0);
  const totalManualLocksPreserved = logs.reduce((acc, l) => acc + l.totalSkippedLocks, 0);
  const totalFlaggedVerifications = logs.reduce((acc, l) => acc + l.totalFlaggedVerifications, 0);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Data Propagation & Cross-Module Sync Logs
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Rule Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of automated data propagation from User Profiles & Sub-Accounts to Family Tree, Medical Records, Caregiver Cards, and Marketplace Stores.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRunTestSimulation}
            className="px-3.5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate Profile Sync</span>
          </button>
          <button
            type="button"
            onClick={reloadLogs}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Test Notice Banner */}
      {testNotice && (
        <div className="bg-emerald-50 text-emerald-900 px-5 py-3 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testNotice}</span>
        </div>
      )}

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Sync Events</span>
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalSyncEvents}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">All Profile Updates Audited</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Fields Propagated</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{totalFieldsPropagated}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">Auto-Synced Across Modules</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Manual Override Locks</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{totalManualLocksPreserved}</div>
          <div className="text-[10px] text-amber-700 font-bold mt-1">User Manual Edits Protected</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Flagged Verifications</span>
            <AlertTriangle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900 mt-1">{totalFlaggedVerifications}</div>
          <div className="text-[10px] text-blue-700 font-bold mt-1">Spouse Marital Status Alerts</div>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by User Name, User ID, or Changed Field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PARTIAL_SKIPPED">Partial Skipped (Lock)</option>
              <option value="VERIFICATION_REQUIRED">Verification Required</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-600">Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Target Modules</option>
              <option value="Family Tree">Family Tree</option>
              <option value="Healthcare & Medical">Healthcare & Medical</option>
              <option value="Caregiver Details">Caregiver Details</option>
              <option value="Marketplace Store">Marketplace Store</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider">
          <span>Sync Log Event Entries ({filteredLogs.length})</span>
          <span>Engine Status: Healthy</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600">No data propagation logs match filter</p>
            <p className="text-xs">Click "Simulate Profile Sync" to test the engine with demo data.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              return (
                <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* User & Trigger Info */}
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 font-bold text-xs shrink-0 mt-0.5">
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {log.userName}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">({log.userId})</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-600 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>Source:</span>
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            {log.sourceModule}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span>Fields:</span>
                          <span className="text-slate-800 font-medium">
                            {log.changedMasterFields.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Expand Control */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      {/* Status Tag */}
                      <div>
                        {log.status === "SUCCESS" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {log.totalPropagated} Synced
                          </span>
                        )}
                        {log.status === "PARTIAL_SKIPPED" && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200">
                            <Lock className="w-3 h-3 text-amber-700" />
                            {log.totalSkippedLocks} Manual Lock
                          </span>
                        )}
                        {log.status === "VERIFICATION_REQUIRED" && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-200">
                            <AlertTriangle className="w-3 h-3 text-blue-600" />
                            Flagged Notice
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>

                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Hide Details" : "Inspect Logs"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Expanded Field Breakdown */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 bg-slate-50/80 p-4 rounded-2xl animate-in fade-in">
                      <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                        <span>Propagated Field Audit Breakdown</span>
                        <span className="text-slate-400 font-normal">
                          {log.propagatedChanges.length} Target Record Updates
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {log.propagatedChanges.map((change) => (
                          <div
                            key={change.id}
                            className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900">
                                {change.targetModule}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  change.status === "SUCCESS"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : change.status === "SKIPPED_MANUAL_LOCK"
                                    ? "bg-amber-100 text-amber-900"
                                    : "bg-blue-100 text-blue-900"
                                }`}
                              >
                                {change.status}
                              </span>
                            </div>

                            <div className="text-slate-600 font-semibold">
                              Target Record: <span className="text-slate-800">{change.recordName}</span>
                            </div>
                            <div className="text-slate-600 font-semibold">
                              Field: <span className="text-slate-800">{change.field}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[11px]">
                                <span className="text-[9px] font-bold text-slate-400 block">OLD</span>
                                <span className="text-slate-700 font-medium break-words">{String(change.oldValue || "None")}</span>
                              </div>
                              <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100 text-[11px]">
                                <span className="text-[9px] font-bold text-emerald-700 block">NEW</span>
                                <span className="text-emerald-950 font-bold break-words">{String(change.newValue || "None")}</span>
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-400 font-medium">
                              {change.ruleApplied}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
