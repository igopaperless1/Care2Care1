import React from "react";
import {
  FileEdit,
  Send,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { InvoiceDocument, DocumentStatus } from "./billingTypes";

interface VisualStatusTrackerProps {
  document: InvoiceDocument;
  onRecordPayment?: () => void;
  onMarkAsSent?: () => void;
  className?: string;
}

export const VisualStatusTracker: React.FC<VisualStatusTrackerProps> = ({
  document: doc,
  onRecordPayment,
  onMarkAsSent,
  className = ""
}) => {
  const isPaid = doc.status === "paid";
  const isPartial = doc.status === "partially_paid";
  const isOverdue = doc.status === "overdue";
  const isSent = doc.status === "sent" || doc.status === "viewed";
  const isDraft = doc.status === "draft";

  // Determine active step index (0: Draft, 1: Sent, 2: Paid/Overdue)
  let activeStep = 0;
  if (isPaid || isPartial) {
    activeStep = 2;
  } else if (isOverdue) {
    activeStep = 2;
  } else if (isSent) {
    activeStep = 1;
  } else {
    activeStep = 0;
  }

  // Calculate percentage paid
  const paidPercent = doc.grandTotal > 0 ? Math.min(100, Math.round((doc.paidAmount / doc.grandTotal) * 100)) : 0;

  const steps = [
    {
      id: "draft",
      label: "Draft",
      desc: "Created & saved",
      icon: FileEdit,
      completed: activeStep > 0 || isPaid || isSent || isPartial,
      current: isDraft,
      color: "amber"
    },
    {
      id: "sent",
      label: "Sent",
      desc: isSent ? "Delivered to client" : "Ready to dispatch",
      icon: Send,
      completed: activeStep > 1 || isPaid,
      current: isSent,
      color: "sky"
    },
    {
      id: "payment",
      label: isPaid ? "Paid" : isPartial ? "Partially Paid" : isOverdue ? "Overdue" : "Payment Due",
      desc: isPaid
        ? "Settled in full"
        : isPartial
        ? `${paidPercent}% settled`
        : isOverdue
        ? "Past due date"
        : `Due on ${doc.dueDate || "N/A"}`,
      icon: isPaid ? CheckCircle2 : isOverdue ? AlertTriangle : Clock,
      completed: isPaid,
      current: isPaid || isPartial || isOverdue,
      color: isPaid ? "emerald" : isPartial ? "amber" : isOverdue ? "rose" : "slate"
    }
  ];

  return (
    <div
      className={`w-full p-3.5 sm:p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3.5 select-none ${className}`}
    >
      {/* TOP STATUS HEADER & PAYMENT ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              isPaid
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : isPartial
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : isOverdue
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-sky-500/20 text-sky-400 border border-sky-500/40"
            }`}
          >
            {isPaid ? "✓" : isPartial ? "½" : isOverdue ? "!" : "📄"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Invoice Status Tracker
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isPaid
                    ? "bg-emerald-500 text-slate-950"
                    : isPartial
                    ? "bg-amber-400 text-slate-950"
                    : isOverdue
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-sky-500 text-slate-950"
                }`}
              >
                {doc.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Total: {doc.currencySymbol}{doc.grandTotal.toFixed(2)} • Due:{" "}
              <span className={doc.balanceDue > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                {doc.currencySymbol}{doc.balanceDue.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* ACTION BUTTON: RECORD PAYMENT */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {isDraft && onMarkAsSent && (
            <button
              type="button"
              onClick={onMarkAsSent}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mark Sent</span>
            </button>
          )}

          {onRecordPayment && (
            <button
              type="button"
              onClick={onRecordPayment}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 ${
                doc.balanceDue > 0
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{doc.balanceDue > 0 ? "Record Payment" : "Payment History"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-STEP VISUAL PROGRESSION TIMELINE */}
      <div className="grid grid-cols-3 gap-2 relative">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = step.completed;
          const isCurrent = step.current;

          return (
            <div
              key={step.id}
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1.5 ${
                isDone && isPaid
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : isDone
                  ? "bg-slate-800/80 border-slate-700 text-slate-200"
                  : isCurrent && isOverdue
                  ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                  : isCurrent
                  ? "bg-sky-950/40 border-sky-500/50 text-sky-200 shadow-xs ring-1 ring-sky-500/30"
                  : "bg-slate-800/30 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400">
                  Step 0{idx + 1}
                </span>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isDone && isPaid
                      ? "bg-emerald-500 text-slate-950"
                      : isDone
                      ? "bg-slate-700 text-slate-300"
                      : isCurrent && isOverdue
                      ? "bg-rose-500 text-white"
                      : isCurrent
                      ? "bg-[#FF6A45] text-white"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <p className="text-xs font-black truncate">{step.label}</p>
                <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAYMENT PROGRESS BAR */}
      {doc.grandTotal > 0 && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Payment Progress: {paidPercent}%</span>
            <span>
              Paid: <strong className="text-emerald-400">{doc.currencySymbol}{doc.paidAmount.toFixed(2)}</strong> / {doc.currencySymbol}{doc.grandTotal.toFixed(2)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${paidPercent}%` }}
              className={`h-full transition-all duration-300 rounded-full ${
                isPaid ? "bg-emerald-400" : isPartial ? "bg-amber-400" : "bg-sky-400"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
