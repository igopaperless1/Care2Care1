import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Building2,
  User,
  CreditCard,
  Calendar,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  X,
  Check,
  RefreshCw,
  Sparkles,
  DollarSign
} from "lucide-react";
import {
  PaymentRequest,
  getPaymentRequests,
  verifyAndActivatePayment,
  rejectPaymentRequest
} from "../../utils/ManualPaymentEngine";

interface PaymentVerificationTabProps {
  showToast?: (msg: string) => void;
}

export const PaymentVerificationTab: React.FC<PaymentVerificationTabProps> = ({ showToast }) => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const reloadRequests = () => {
    setRequests(getPaymentRequests());
  };

  useEffect(() => {
    reloadRequests();
  }, []);

  const handleOpenModal = (req: PaymentRequest) => {
    setSelectedRequest(req);
    setAdminNotesInput(req.adminNotes || "");
  };

  const handleVerify = () => {
    if (!selectedRequest) return;
    setIsProcessing(true);

    const success = verifyAndActivatePayment(selectedRequest.id, adminNotesInput);
    if (success) {
      setTimeout(() => {
        setIsProcessing(false);
        reloadRequests();
        if (showToast) showToast(`✅ Verified & Activated subscription for ${selectedRequest.userName}!`);
        setSelectedRequest(null);
      }, 500);
    }
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    if (!adminNotesInput.trim()) {
      alert("Please enter Admin Notes explaining the rejection reason (e.g., 'Proof screenshot unclear' or 'Transaction ID mismatch').");
      return;
    }

    setIsProcessing(true);
    const success = rejectPaymentRequest(selectedRequest.id, adminNotesInput);
    if (success) {
      setTimeout(() => {
        setIsProcessing(false);
        reloadRequests();
        if (showToast) showToast(`❌ Rejected payment request from ${selectedRequest.userName}. User notified.`);
        setSelectedRequest(null);
      }, 500);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["ID", "User Name", "User Email", "Plan Name", "Amount ($)", "Transaction ID / Ref", "Status", "Created At", "Admin Notes"];
    const rows = filteredRequests.map((r) => [
      r.id,
      `"${r.userName.replace(/"/g, '""')}"`,
      `"${r.userEmail.replace(/"/g, '""')}"`,
      `"${r.planName.replace(/"/g, '""')}"`,
      r.amount,
      `"${r.transactionId.replace(/"/g, '""')}"`,
      r.status,
      `"${r.createdAt}"`,
      `"${(r.adminNotes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Care2Care_Payment_Requests_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) showToast("📊 Downloaded Payment Verification CSV report!");
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const verifiedCount = requests.filter((r) => r.status === "verified").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const totalVolume = requests.reduce((acc, curr) => acc + (curr.status === "verified" ? curr.amount : 0), 0);

  return (
    <div className="space-y-6">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Manual Payment Verification Engine
            </h1>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                {pendingCount} Pending Verification
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review offline bank transfers & UPI proof receipts submitted by subscribers. Approve to auto-activate subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={reloadRequests}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* STAT METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-amber-700 font-bold mt-0.5">Requires Verification</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
            <span>Verified Payments</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Subscriptions Activated</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
            <span>Rejected Requests</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-1">{rejectedCount}</div>
          <div className="text-[10px] text-rose-700 font-bold mt-0.5">Flagged / Invalid TxIDs</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-bold flex items-center justify-between">
            <span>Verified Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">${totalVolume.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Cleared Offline Funds</div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User Email, Name, or Transaction UTR ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 ${
              statusFilter === "pending" ? "bg-amber-500 text-slate-950 font-black" : "bg-amber-50 text-amber-900 border border-amber-200"
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && <span className="bg-amber-900 text-amber-100 text-[9px] px-1.5 py-0.2 rounded-full">{pendingCount}</span>}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("verified")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              statusFilter === "verified" ? "bg-emerald-600 text-white font-black" : "bg-emerald-50 text-emerald-900 border border-emerald-200"
            }`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              statusFilter === "rejected" ? "bg-rose-600 text-white font-black" : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* REQUESTS DATA TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Requested Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Transaction UTR / Ref</th>
                <th className="p-4">Submitted Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-600">No payment requests match filter</p>
                    <p className="text-[11px]">New user bank transfer attempts will populate here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* User Details */}
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 text-xs">{req.userName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.userEmail}</div>
                    </td>

                    {/* Plan */}
                    <td className="p-4">
                      <span className="font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">
                        {req.planName}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-black text-slate-900 text-sm">
                      ${req.amount.toFixed(2)}
                    </td>

                    {/* Transaction ID */}
                    <td className="p-4 font-mono font-bold text-indigo-900">
                      {req.transactionId}
                    </td>

                    {/* Submitted Time */}
                    <td className="p-4 text-[11px] text-slate-500 font-mono">
                      {req.createdAt}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-700" />
                          Pending Review
                        </span>
                      )}
                      {req.status === "verified" && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified & Active
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(req)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect & Verify</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Payment Proof Inspection</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review uploaded transfer receipt & verify transaction UTR against bank records
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 3-Column Layout */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* LEFT: User & Request Meta */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                  Subscriber & Plan Info
                </h3>

                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Subscriber Name</span>
                    <span className="font-black text-slate-900 text-sm">{selectedRequest.userName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Email Address</span>
                    <span className="font-mono text-slate-700 font-bold">{selectedRequest.userEmail}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Subscription Tier</span>
                    <span className="font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mt-0.5">
                      {selectedRequest.planName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Claimed Transfer Amount</span>
                    <span className="text-xl font-black text-emerald-800">${selectedRequest.amount.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Transaction ID / Ref</span>
                    <span className="font-mono font-black text-indigo-950 bg-white p-2 rounded-lg border border-slate-200 block mt-0.5 select-all">
                      {selectedRequest.transactionId}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Submission Date</span>
                    <span className="text-slate-600 font-semibold">{selectedRequest.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* CENTER: Payment Proof Screenshot Image Preview */}
              <div className="space-y-3 bg-slate-900 p-4 rounded-2xl text-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-black uppercase text-slate-300">Uploaded Transfer Proof</span>
                  <a
                    href={selectedRequest.paymentProofImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Full Resolution</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={selectedRequest.paymentProofImageUrl}
                    alt="Payment Proof Receipt"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  Verify receipt timestamp, bank logo, & amount match claims.
                </p>
              </div>

              {/* RIGHT: Actions & Admin Notes */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                    Admin Verification Notes
                  </h3>
                  <textarea
                    rows={4}
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    placeholder="Enter audit reason, bank account confirmation note, or rejection reason if proof is unverified..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>VERIFY & ACTIVATE SUBSCRIPTION</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-rose-200" />
                    <span>REJECT PAYMENT</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
