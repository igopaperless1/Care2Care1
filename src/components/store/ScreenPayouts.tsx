import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Plus,
  ShieldCheck,
  Check
} from "lucide-react";
import { StoreProfileModel, StoreTab } from "./types";

interface PayoutRecord {
  id: string;
  payoutId: string;
  amount: number;
  method: string;
  account: string;
  date: string;
  status: "Completed" | "Processing" | "Scheduled";
}

interface ScreenPayoutsProps {
  storeProfile: StoreProfileModel;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenPayouts: React.FC<ScreenPayoutsProps> = ({ storeProfile, onNavigate }) => {
  const [availableBalance, setAvailableBalance] = useState(84500);
  const [withdrawnSuccess, setWithdrawnSuccess] = useState(false);

  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([
    {
      id: "pay-1",
      payoutId: "PAY-2025-0510",
      amount: 45000,
      method: "eSewa Direct",
      account: "9812345678",
      date: "10 May 2025",
      status: "Completed"
    },
    {
      id: "pay-2",
      payoutId: "PAY-2025-0503",
      amount: 62000,
      method: "Nabil Bank A/C",
      account: "01201017500124",
      date: "03 May 2025",
      status: "Completed"
    },
    {
      id: "pay-3",
      payoutId: "PAY-2025-0426",
      amount: 38500,
      method: "eSewa Direct",
      account: "9812345678",
      date: "26 Apr 2025",
      status: "Completed"
    }
  ]);

  const handleWithdrawal = () => {
    if (availableBalance <= 0) return;
    const amountToWithdraw = availableBalance;
    const newRecord: PayoutRecord = {
      id: `pay-${Date.now()}`,
      payoutId: `PAY-2025-05${Math.floor(15 + Math.random() * 10)}`,
      amount: amountToWithdraw,
      method: "eSewa Wallet",
      account: storeProfile.payoutAccount || "9812345678",
      date: new Date().toLocaleDateString(),
      status: "Processing"
    };

    setAvailableBalance(0);
    setPayoutHistory([newRecord, ...payoutHistory]);
    setWithdrawnSuccess(true);
    setTimeout(() => setWithdrawnSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header & Available Balance Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/10 rounded-2xl">
              <Wallet className="w-5 h-5 text-amber-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-200">Merchant Settlement Balance</span>
          </div>

          <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
            KYC Verified Payouts
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              NPR {availableBalance.toLocaleString()}
            </div>
            <div className="text-xs text-orange-200/80 mt-1">
              Scheduled automatic payout: <strong className="text-white">Wednesday, 20 May 2025</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={availableBalance === 0}
            onClick={handleWithdrawal}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              availableBalance > 0
                ? "bg-[#FF5A36] hover:bg-[#E04826] text-white shadow-lg shadow-orange-500/30 active:scale-95"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {withdrawnSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Withdrawal Initiated!</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Request Instant Payout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Key Stats & Connected Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lifetime Settled</span>
          <div className="text-xl font-black text-slate-900">NPR 1,240,000</div>
          <p className="text-[10px] text-slate-400">Total net revenue disbursed</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Default Payout Method</span>
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>eSewa Wallet (9812345678)</span>
          </div>
          <p className="text-[10px] text-slate-400">Instant 0% transaction fee</p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-orange-100/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bank Direct A/C</span>
          <div className="text-xs font-bold text-slate-900 truncate">Nabil Bank Lazimpat</div>
          <p className="text-[10px] text-slate-400">Acc: 01201017500124</p>
        </div>
      </div>

      {/* 3. Payout History Table */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Disbursement Log History</h4>
          <button
            type="button"
            onClick={() => alert("Statement downloaded in CSV format.")}
            className="text-[11px] font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="divide-y divide-orange-100/70">
          {payoutHistory.map((p) => {
            const isDone = p.status === "Completed";
            return (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isDone ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 animate-pulse"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">{p.payoutId}</div>
                    <div className="text-[11px] text-slate-500">
                      {p.method} • {p.account} • {p.date}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">
                    NPR {p.amount.toLocaleString()}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isDone
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
