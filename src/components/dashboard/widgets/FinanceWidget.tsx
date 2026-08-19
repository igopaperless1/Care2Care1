import React from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, DollarSign } from "lucide-react";

export const FinanceWidget: React.FC<{ widgetId?: string }> = () => {
  return (
    <div className="space-y-3">
      {/* Finance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
            <span className="text-[10px] font-black uppercase">Monthly Income</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            NPR 185,000
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">+12% vs last month</span>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300">
            <span className="text-[10px] font-black uppercase">Expenses</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            NPR 42,300
          </p>
          <span className="text-[10px] text-amber-600 font-bold">22.8% of Budget</span>
        </div>

        <div className="p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 rounded-xl">
          <div className="flex items-center justify-between text-sky-800 dark:text-sky-300">
            <span className="text-[10px] font-black uppercase">Net Savings</span>
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            NPR 142,700
          </p>
          <span className="text-[10px] text-sky-600 font-bold">Safely Invested</span>
        </div>
      </div>
    </div>
  );
};
