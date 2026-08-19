import React, { useState, useEffect } from "react";
import { Zap, AlertTriangle, Sparkles } from "lucide-react";
import { QuickAddModal } from "./QuickAddModal";
import { PendingReviewQueueModal } from "./PendingReviewQueueModal";
import { getPendingReviewQueue } from "../utils/QuickAddTemplateEngine";

interface QuickAddFloatingButtonProps {
  patientId?: string;
  showToast?: (msg: string) => void;
  onLogSuccess?: () => void;
}

export const QuickAddFloatingButton: React.FC<QuickAddFloatingButtonProps> = ({
  patientId,
  showToast,
  onLogSuccess,
}) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isPendingQueueOpen, setIsPendingQueueOpen] = useState<boolean>(false);
  const [pendingDraftCount, setPendingDraftCount] = useState<number>(0);

  const checkPendingQueue = () => {
    const queue = getPendingReviewQueue().filter((i) => i.status === "draft");
    setPendingDraftCount(queue.length);
  };

  useEffect(() => {
    checkPendingQueue();
    const interval = setInterval(checkPendingQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Action Button (FAB) Sticky Bottom-Right - Positioned ABOVE AI & Tools pill */}
      <div className="fixed bottom-36 right-4 sm:right-8 z-40 flex flex-col items-end gap-2 group">
        {/* Pending Review Queue Badge Alert */}
        {pendingDraftCount > 0 && (
          <button
            onClick={() => setIsPendingQueueOpen(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce cursor-pointer"
            title="View Flagged Drafts"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{pendingDraftCount} Flagged Drafts</span>
          </button>
        )}

        {/* Floating Quick-Add Button */}
        <button
          type="button"
          onClick={() => setIsQuickAddOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-emerald-800 via-emerald-900 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-amber-300 rounded-2xl shadow-2xl border-2 border-amber-400/80 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative group-hover:shadow-emerald-900/50"
          title="Quick-Add Daily Log"
        >
          <Zap className="w-7 h-7 fill-amber-300 drop-shadow-md" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-black text-slate-950 shadow-xs">
            +
          </span>
        </button>
      </div>

      {/* QUICK ADD MODAL */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        patientId={patientId}
        showToast={showToast}
        onOpenPendingQueue={() => setIsPendingQueueOpen(true)}
        onLogSuccess={() => {
          checkPendingQueue();
          if (onLogSuccess) onLogSuccess();
        }}
      />

      {/* PENDING REVIEW QUEUE MODAL */}
      <PendingReviewQueueModal
        isOpen={isPendingQueueOpen}
        onClose={() => {
          setIsPendingQueueOpen(false);
          checkPendingQueue();
        }}
        showToast={showToast}
      />
    </>
  );
};
