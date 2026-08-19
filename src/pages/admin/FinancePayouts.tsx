import React, { useState } from "react";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building2,
  Send,
  AlertTriangle,
  X,
  FileText,
  Search,
  RefreshCw,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";

export interface PayoutRequest {
  id: string;
  businessName: string;
  ownerEmail: string;
  amount: number;
  bankDetails: string;
  requestDate: string;
  status: "Pending" | "Paid" | "Rejected";
  referenceId?: string;
  rejectionReason?: string;
}

export interface SubscriptionLog {
  id: string;
  userEmail: string;
  plan: string;
  amount: number;
  billingDate: string;
  status: "Paid" | "Past Due" | "Cancelled";
  gateway: "Paddle SDK";
}

const DEMO_PAYOUTS: PayoutRequest[] = [
  {
    id: "pay-1001",
    businessName: "Apex Retail Pharmacy & Store",
    ownerEmail: "apex.store@care2care.org",
    amount: 2450.0,
    bankDetails: "Chase Bank • Account ***4092 • Routing ***881",
    requestDate: "2026-08-10 14:30",
    status: "Pending"
  },
  {
    id: "pay-1002",
    businessName: "Sterling Medical Clinic",
    ownerEmail: "robert.sterling@clinic.org",
    amount: 5120.5,
    bankDetails: "Wells Fargo • Account ***9912 • SWIFT WFBIUS6S",
    requestDate: "2026-08-09 09:15",
    status: "Pending"
  },
  {
    id: "pay-1000",
    businessName: "Sunrise Senior Living Hub",
    ownerEmail: "director@sunrisecare.org",
    amount: 1850.0,
    bankDetails: "Bank of America • Account ***1209",
    requestDate: "2026-08-05 11:00",
    status: "Paid",
    referenceId: "TXN-8840129-US"
  }
];

const DEMO_SUBSCRIPTIONS: SubscriptionLog[] = [
  {
    id: "sub-901",
    userEmail: "eleanor.vance@family.com",
    plan: "Family Suite",
    amount: 9.99,
    billingDate: "2026-08-01",
    status: "Paid",
    gateway: "Paddle SDK"
  },
  {
    id: "sub-902",
    userEmail: "apex.store@care2care.org",
    plan: "Enterprise Workspace",
    amount: 29.99,
    billingDate: "2026-08-03",
    status: "Paid",
    gateway: "Paddle SDK"
  },
  {
    id: "sub-903",
    userEmail: "marcus.miller@gmail.com",
    plan: "Premium Tier",
    amount: 4.99,
    billingDate: "2026-07-28",
    status: "Past Due",
    gateway: "Paddle SDK"
  }
];

interface FinancePayoutsPageProps {
  showToast: (msg: string) => void;
}

export const FinancePayoutsPage: React.FC<FinancePayoutsPageProps> = ({ showToast }) => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(DEMO_PAYOUTS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionLog[]>(DEMO_SUBSCRIPTIONS);

  // Modals state
  const [selectedPayoutForPay, setSelectedPayoutForPay] = useState<PayoutRequest | null>(null);
  const [refIdInput, setRefIdInput] = useState("");

  const [selectedPayoutForReject, setSelectedPayoutForReject] = useState<PayoutRequest | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");

  const handleConfirmPaid = () => {
    if (!selectedPayoutForPay || !refIdInput.trim()) return;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === selectedPayoutForPay.id
          ? { ...p, status: "Paid", referenceId: refIdInput }
          : p
      )
    );
    showToast(`Withdrawal of $${selectedPayoutForPay.amount} marked as Paid!`);
    setSelectedPayoutForPay(null);
    setRefIdInput("");
  };

  const handleConfirmReject = () => {
    if (!selectedPayoutForReject || !rejectReasonInput.trim()) return;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === selectedPayoutForReject.id
          ? { ...p, status: "Rejected", rejectionReason: rejectReasonInput }
          : p
      )
    );
    showToast(`Payout request rejected with notification sent.`);
    setSelectedPayoutForReject(null);
    setRejectReasonInput("");
  };

  const totalPendingAmount = payouts
    .filter((p) => p.status === "Pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaidAmount = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-600" />
              <span>Finance, Billing & Payout Wallet</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Review cash withdrawal requests from retail shops & businesses, log bank payouts, and monitor Paddle subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-black px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl">
              Pending Payouts: ${totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Pending Withdrawals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ${totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-amber-700 font-bold">
            {payouts.filter((p) => p.status === "Pending").length} business requests waiting
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Approved & Paid Out</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ${totalPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold">Processed via Bank Transfer / SWIFT</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Monthly Subscription Revenue</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">$1,842.50</p>
          <p className="text-[10px] text-indigo-600 font-bold">Processed via Paddle SDK Gateway</p>
        </div>
      </div>

      {/* SECTION 1: PENDING WITHDRAWAL REQUESTS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Retail & Business Cash Withdrawal Requests</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {payouts.filter((p) => p.status === "Pending").length} Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                <th className="py-3 px-4">Business & Owner</th>
                <th className="py-3 px-4">Requested Cash Amount</th>
                <th className="py-3 px-4">Bank / Payment Details</th>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payout Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.businessName}</div>
                    <div className="text-[11px] text-slate-500">{p.ownerEmail}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-black text-slate-900 text-sm">
                      ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 text-[11px] font-mono">
                    {p.bankDetails}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {p.requestDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.status === "Pending"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : p.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {p.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPayoutForPay(p)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Paid</span>
                        </button>
                        <button
                          onClick={() => setSelectedPayoutForReject(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.referenceId ? `Ref: ${p.referenceId}` : p.rejectionReason || "Completed"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: PADDLE SUBSCRIPTION BILLING LOG */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Paddle Subscription Billing Log & Past Due Auto-Flags</span>
          </h2>
          <span className="text-xs font-mono text-emerald-600 font-bold">Gateway: Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                <th className="py-3 px-4">User Email</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Billing Date</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.userEmail}</td>
                  <td className="py-3.5 px-4 font-extrabold text-indigo-700">{s.plan}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">${s.amount.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{s.billingDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        s.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800 animate-pulse"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.status === "Past Due" && (
                      <button
                        onClick={() => {
                          showToast(`Payment reminder notification sent to ${s.userEmail}`);
                        }}
                        className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] rounded-lg hover:bg-rose-700 cursor-pointer"
                      >
                        Send Payment Reminder
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: MARK AS PAID */}
      {selectedPayoutForPay && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Log Bank Transfer Payout</span>
              </div>
              <button onClick={() => setSelectedPayoutForPay(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Confirming payout of <strong className="text-slate-900">${selectedPayoutForPay.amount}</strong> to <strong className="text-slate-900">{selectedPayoutForPay.businessName}</strong>.
            </p>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                Bank Transfer / SWIFT Reference ID:
              </label>
              <input
                type="text"
                required
                value={refIdInput}
                onChange={(e) => setRefIdInput(e.target.value)}
                placeholder="e.g. TXN-9940129-US"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPayoutForPay(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPaid}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Confirm Payout Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT PAYOUT */}
      {selectedPayoutForReject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2 text-rose-700 font-black text-sm">
                <XCircle className="w-5 h-5" />
                <span>Reject Withdrawal Request</span>
              </div>
              <button onClick={() => setSelectedPayoutForReject(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Provide reason for rejecting <strong className="text-slate-900">{selectedPayoutForReject.businessName}</strong>'s request.
            </p>

            <textarea
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="e.g. Bank details invalid or incomplete account verification."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPayoutForReject(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
