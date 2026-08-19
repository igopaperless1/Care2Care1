import React, { useState, useEffect } from "react";
import { X, FileText, Download, CheckCircle2, ShieldCheck, Sparkles, Building2, Calendar } from "lucide-react";
import {
  AdminInvoiceItem,
  getAdminGeneratedInvoices,
  generatePdfReceipt,
} from "../utils/BillingAndReceiptEngine";

interface UserReceiptVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (msg: string) => void;
}

export const UserReceiptVaultModal: React.FC<UserReceiptVaultModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      const all = getAdminGeneratedInvoices();
      // Filter completed invoices
      setInvoices(all.filter((i) => i.status === "completed"));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg text-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-1.5">
                <span>My Payments & Tax Receipts Vault</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Official IRD-compliant Zero-Rated Export VAT tax receipts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {invoices.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-2 opacity-80" />
              <h4 className="font-black text-slate-800 text-sm">No Completed Receipts Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Completed subscription receipts will automatically appear here for 1-tap PDF download.
              </p>
            </div>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{inv.subscriptionItem}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black text-[10px] rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span>PO #: {inv.purchaseOrderId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {inv.completedAt || inv.createdAt}
                    </span>
                  </p>

                  <p className="text-xs font-black text-emerald-700">
                    NPR {inv.amountNpr.toLocaleString()}
                    <span className="text-[10px] text-slate-400 font-normal ml-1.5">
                      ({inv.khaltiTransactionId || "Txn Verified"})
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    generatePdfReceipt(inv);
                    if (showToast) showToast(`📄 Downloaded official PDF tax receipt!`);
                  }}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Tax Receipt PDF</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
