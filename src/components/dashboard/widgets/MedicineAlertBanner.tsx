import React from "react";
import { Pill, AlertTriangle, Clock, ArrowRight } from "lucide-react";

export const MedicineAlertBanner: React.FC<{ widgetId?: string }> = () => {
  return (
    <div className="p-4 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              High Priority Dose Alert
            </span>
            <span className="px-2 py-0.5 bg-amber-400/30 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] rounded-full">
              Due at 08:30 PM
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5">
            Atorvastatin 10mg — Evening Cholesterol Regulation Dose
          </p>
        </div>
      </div>

      <button
        type="button"
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5 shrink-0"
      >
        <span>Mark Taken</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
