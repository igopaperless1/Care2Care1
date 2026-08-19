import React, { useState } from "react";
import {
  X,
  RefreshCw,
  CheckCircle2,
  Lock,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldCheck,
  Building,
  Users,
  Activity,
  Heart,
  ChevronRight,
  Info
} from "lucide-react";
import { SyncLogEntry, revertSyncChange } from "../utils/DataPropagationEngine";

interface SyncReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncLog: SyncLogEntry | null;
  onRefreshLogs?: () => void;
}

export const SyncReviewModal: React.FC<SyncReviewModalProps> = ({
  isOpen,
  onClose,
  syncLog,
  onRefreshLogs
}) => {
  const [revertedIds, setRevertedIds] = useState<string[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen || !syncLog) return null;

  const handleRevertSingle = (changeId: string) => {
    const success = revertSyncChange(syncLog.id, changeId);
    if (success) {
      setRevertedIds((prev) => [...prev, changeId]);
      setActionNotice("Change reverted successfully and target field locked to Manual.");
      if (onRefreshLogs) onRefreshLogs();
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Family Tree":
        return <Users className="w-4 h-4 text-emerald-600" />;
      case "Healthcare & Medical":
        return <Activity className="w-4 h-4 text-blue-600" />;
      case "Caregiver Details":
        return <Heart className="w-4 h-4 text-rose-600" />;
      case "Marketplace Store":
        return <Building className="w-4 h-4 text-purple-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">Data Propagation Review</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  Engine v3.2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated cross-module profile sync & verification report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="bg-emerald-50 text-emerald-800 px-5 py-2.5 border-b border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Summary Stat Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <div className="text-xs font-bold text-emerald-700">Auto-Synced</div>
              <div className="text-xl font-black text-emerald-900 mt-0.5">
                {syncLog.totalPropagated} Records
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <div className="text-xs font-bold text-amber-700">Manual Locks</div>
              <div className="text-xl font-black text-amber-900 mt-0.5">
                {syncLog.totalSkippedLocks} Preserved
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <div className="text-xs font-bold text-blue-700">Flagged Notice</div>
              <div className="text-xl font-black text-blue-900 mt-0.5">
                {syncLog.totalFlaggedVerifications} Pending
              </div>
            </div>
          </div>

          {/* Trigger Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-bold text-slate-700">Trigger Source:</span>
              <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                {syncLog.sourceModule} ({syncLog.userName})
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-bold text-slate-700">Changed Master Fields:</span>
              <span className="font-semibold text-slate-800">
                {syncLog.changedMasterFields.join(", ")}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-bold text-slate-700">Sync Timestamp:</span>
              <span className="text-slate-500 font-mono text-[11px]">{syncLog.timestamp}</span>
            </div>
          </div>

          {/* List of Propagated Changes */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Propagated Record Breakdown</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Click "Revert" to lock any field manually
              </span>
            </h3>

            {syncLog.propagatedChanges.map((change) => {
              const isReverted = revertedIds.includes(change.id) || change.newValue.includes("[REVERTED");

              return (
                <div
                  key={change.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    change.status === "SUCCESS"
                      ? "bg-white border-slate-200 hover:border-emerald-300"
                      : change.status === "SKIPPED_MANUAL_LOCK"
                      ? "bg-amber-50/50 border-amber-200"
                      : "bg-blue-50/50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-100 rounded-xl">
                        {getModuleIcon(change.targetModule)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {change.targetModule}
                          </span>
                          <span className="text-slate-400 font-bold">•</span>
                          <span className="text-xs font-semibold text-slate-600">
                            {change.recordName}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                          Field: <span className="text-slate-800">{change.field}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {change.status === "SUCCESS" && !isReverted && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Auto-Synced
                        </span>
                      )}
                      {change.status === "SKIPPED_MANUAL_LOCK" && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-700" />
                          Manual Lock Preserved
                        </span>
                      )}
                      {change.status === "VERIFICATION_FLAGGED" && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                          <AlertTriangle className="w-3 h-3 text-blue-600" />
                          Verification Needed
                        </span>
                      )}
                      {isReverted && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-300">
                          Reverted & Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Value Transition Comparison */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Original Value</span>
                      <span className="font-semibold text-slate-700 break-words">{String(change.oldValue || "None")}</span>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Updated Value</span>
                      <span className="font-bold text-emerald-900 break-words">{String(change.newValue || "None")}</span>
                    </div>
                  </div>

                  {/* Rule Applied */}
                  <div className="mt-2 text-[10px] font-medium text-slate-400 flex items-center justify-between">
                    <span>{change.ruleApplied}</span>
                    {change.status === "SUCCESS" && !isReverted && (
                      <button
                        type="button"
                        onClick={() => handleRevertSingle(change.id)}
                        className="text-rose-600 hover:text-rose-800 font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Revert to Manual</span>
                      </button>
                    )}
                  </div>

                  {/* Verification Notice if Spouse Marital Status */}
                  {change.verificationNotice && (
                    <div className="mt-2 p-2 bg-blue-100/60 rounded-xl text-[11px] text-blue-900 font-medium flex items-start gap-1.5 border border-blue-200">
                      <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                      <span>{change.verificationNotice}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data integrity verified by Care2Care Logic Brain</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Acknowledge & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
