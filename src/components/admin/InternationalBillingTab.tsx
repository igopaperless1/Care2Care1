import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Send,
  Copy,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  Globe,
  DollarSign,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  AdminInvoiceItem,
  getAdminGeneratedInvoices,
  saveAdminGeneratedInvoice,
  generatePdfReceipt,
  triggerReceiptDeliveryAlerts,
  getAdminBillingConfig,
} from "../../utils/BillingAndReceiptEngine";

interface InternationalBillingTabProps {
  showToast?: (msg: string) => void;
}

export const InternationalBillingTab: React.FC<InternationalBillingTabProps> = ({ showToast }) => {
  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+1 ");
  const [selectedPlan, setSelectedPlan] = useState("Enterprise Care Suite (1 Year)");
  const [amountNpr, setAmountNpr] = useState<number>(39900);
  const [agreementPdfUrl, setAgreementPdfUrl] = useState<string | null>(null);

  const refreshInvoices = () => {
    const list = getAdminGeneratedInvoices();
    setInvoices(list);
  };

  useEffect(() => {
    refreshInvoices();
  }, []);

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    if (plan.includes("Enterprise Care")) setAmountNpr(39900);
    else if (plan.includes("Family Premium")) setAmountNpr(1350);
    else if (plan.includes("Practice Pro")) setAmountNpr(5900);
    else setAmountNpr(10000);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    const sequence = Math.floor(1000 + Math.random() * 9000);
    const purchaseOrderId = `INV-2026-${sequence}`;
    const amountPaisa = amountNpr * 100;
    const khaltiPaymentUrl = `https://checkout.khalti.com/payment/p_idx_strp_${sequence}_${Date.now()}`;

    const newInvoice: AdminInvoiceItem = {
      id: `inv-${Date.now()}`,
      adminId: "admin-primary",
      customerName,
      customerEmail,
      customerPhone,
      subscriptionItem: selectedPlan,
      amountNpr,
      amountPaisa,
      purchaseOrderId,
      khaltiPaymentUrl,
      status: "pending",
      pdfInvoiceUrl: agreementPdfUrl || undefined,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    saveAdminGeneratedInvoice(newInvoice);

    // Trigger auto-notifications
    triggerReceiptDeliveryAlerts(newInvoice, getAdminBillingConfig());

    if (showToast) {
      showToast(`🌐 Generated Khalti/Stripe Checkout link for PO #${purchaseOrderId}`);
    }

    // Reset Form
    setCustomerName("");
    setCustomerEmail("");
    setAgreementPdfUrl(null);
    setIsCreateModalOpen(false);
    refreshInvoices();
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    if (showToast) {
      showToast(`📋 Checkout link copied to clipboard!`);
    }
  };

  const handleMarkCompleted = (inv: AdminInvoiceItem) => {
    const updated: AdminInvoiceItem = {
      ...inv,
      status: "completed",
      completedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      khaltiTransactionId: `KHLT-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };
    saveAdminGeneratedInvoice(updated);
    refreshInvoices();
    if (showToast) {
      showToast(`✅ Payment completed & subscription activated for ${inv.customerEmail}`);
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch =
      i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "pending") return matchesSearch && i.status === "pending";
    if (statusFilter === "completed") return matchesSearch && i.status === "completed";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border border-indigo-900/60 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-amber-300 font-black flex items-center justify-center shadow-lg text-2xl shrink-0">
            <Globe className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-xl tracking-tight">International Khalti & Stripe Billing</h2>
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase">
                5% TDS & FX Auto
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl">
              Generate custom on-the-fly checkout links for foreign subscribers. Funds settle directly to Khalti/Stripe with 0% Export VAT compliance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice Link</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search invoice PO #, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(["all", "pending", "completed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize transition-all cursor-pointer ${
                statusFilter === st ? "bg-white text-indigo-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Generated Invoice History ({filteredInvoices.length})</span>
          </h3>
          <span className="text-[10px] font-extrabold text-slate-500">Live Khalti Webhook Synchronization</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">PO ID & Date</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Subscription Plan</th>
                <th className="p-3.5">Amount (NPR)</th>
                <th className="p-3.5">Status & Txn</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                    No generated invoice links found. Click "Generate New Invoice Link" to create one.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-indigo-50/40 transition-all">
                    <td className="p-3.5">
                      <span className="font-black text-indigo-900">{inv.purchaseOrderId}</span>
                      <p className="text-[10px] text-slate-400">{inv.createdAt}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-black text-slate-900">{inv.customerName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{inv.customerEmail}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-full text-[10px]">
                        {inv.subscriptionItem}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-emerald-700">
                      NPR {inv.amountNpr.toLocaleString()}
                      <p className="text-[9px] text-slate-400 font-normal">{(inv.amountNpr / 135).toFixed(2)} USD Approx</p>
                    </td>
                    <td className="p-3.5">
                      {inv.status === "completed" ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black text-[10px] rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
                          </span>
                          <p className="text-[9px] font-mono text-slate-500">{inv.khaltiTransactionId}</p>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Payment
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleCopyLink(inv.khaltiPaymentUrl)}
                        className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-[11px] rounded-lg cursor-pointer inline-flex items-center gap-1"
                        title="Copy Checkout Link"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </button>

                      <button
                        onClick={() => generatePdfReceipt(inv)}
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-[11px] rounded-lg cursor-pointer inline-flex items-center gap-1"
                        title="Download Receipt PDF"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>

                      {inv.status === "pending" && (
                        <button
                          onClick={() => handleMarkCompleted(inv)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-[11px] rounded-lg cursor-pointer inline-flex items-center gap-1"
                          title="Simulate Khalti Webhook Completion"
                        >
                          <CheckCircle2 className="w-3 h-3 text-amber-300" />
                          <span>Mark Paid</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight flex items-center gap-1.5">
                    <span>Generate Khalti Payment Link</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </h3>
                  <p className="text-xs text-indigo-200 font-medium">Stripe international checkout integration</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Sarah Jenkins"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Customer Email (Crucial)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@clinic.org"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (415) 890-2341"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Select Plan
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="Enterprise Care Suite (1 Year)">Enterprise Care (39,900 NPR)</option>
                    <option value="Family Premium Plan (Monthly)">Family Premium (1,350 NPR)</option>
                    <option value="Practice Pro Plan (Monthly)">Practice Pro (5,900 NPR)</option>
                    <option value="Custom Billing Amount">Custom Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Amount in NPR
                  </label>
                  <input
                    type="number"
                    required
                    value={amountNpr}
                    onChange={(e) => setAmountNpr(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-indigo-900 outline-none"
                  />
                </div>
              </div>

              {/* Chargeback Defense Attachment */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
                <label className="block text-xs font-black text-indigo-950 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Upload Digital Agreement / Invoice PDF (Chargeback Shield)</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAgreementPdfUrl("https://care2care.org/agreements/agrmnt-signed-doc.pdf");
                    }
                  }}
                  className="text-xs text-slate-600 cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-black text-xs rounded-2xl cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Generate Link & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
