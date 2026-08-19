import React, { useState, useEffect } from "react";
import { X, AlertTriangle, ShieldCheck, CheckCircle2, Trash2, Edit3, Sparkles } from "lucide-react";
import {
  PendingReviewItem,
  getPendingReviewQueue,
  resolvePendingReviewItem,
} from "../utils/QuickAddTemplateEngine";

interface PendingReviewQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (msg: string) => void;
}

export const PendingReviewQueueModal: React.FC<PendingReviewQueueModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [items, setItems] = useState<PendingReviewItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const refreshItems = () => {
    const queue = getPendingReviewQueue().filter((i) => i.status === "draft");
    setItems(queue);
  };

  useEffect(() => {
    if (isOpen) {
      refreshItems();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = (item: PendingReviewItem) => {
    let updatedPayload = { ...item.draftPayload };
    if (editingId === item.id && editAmount) {
      updatedPayload.amount = Number(editAmount);
    }
    resolvePendingReviewItem(item.id, "reviewed", updatedPayload);
    if (showToast) {
      showToast(`✅ Approved & activated draft record for "${item.templateName}"`);
    }
    setEditingId(null);
    refreshItems();
  };

  const handleDismiss = (id: string) => {
    resolvePendingReviewItem(id, "dismissed");
    if (showToast) {
      showToast(`🗑️ Dismissed draft entry`);
    }
    refreshItems();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-amber-800 font-black flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-1.5">
                <span>Pending Review Queue</span>
                <span className="text-xs bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded-full">
                  {items.length} Drafts
                </span>
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Records flagged for rule verification during Quick-Add
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-2 opacity-80" />
              <h4 className="font-black text-slate-800 text-sm">All Clear! No Pending Drafts</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                All daily quick logs passed backend rule checks automatically.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                      {item.serviceType.replace("_", " ")}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-1">
                      {item.templateName}
                    </h4>
                    <p className="text-xs font-bold text-rose-700 mt-0.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.flaggedReason}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Draft Details */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-mono text-slate-800 space-y-1">
                  {Object.entries(item.draftPayload).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500 font-bold capitalize">{k}:</span>
                      {editingId === item.id && k === "amount" ? (
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="w-24 px-2 py-0.5 bg-amber-100 border border-amber-300 font-bold rounded"
                        />
                      ) : (
                        <span className="font-bold text-slate-900">{String(v)}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                  {editingId !== item.id && item.draftPayload.amount && (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditAmount(String(item.draftPayload.amount || ""));
                      }}
                      className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Value</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleApprove(item)}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Approve & Activate</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
