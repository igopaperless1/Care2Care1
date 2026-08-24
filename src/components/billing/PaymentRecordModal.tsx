import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  DollarSign,
  Calendar,
  X,
  FileText,
  ShieldCheck
} from "lucide-react";
import { InvoiceDocument, PaymentRecord } from "./billingTypes";

interface PaymentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: InvoiceDocument;
  onRecordPayment: (payment: PaymentRecord) => void;
}

export const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onRecordPayment
}) => {
  const [amount, setAmount] = useState<number>(doc.balanceDue > 0 ? doc.balanceDue : doc.grandTotal);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [method, setMethod] = useState<PaymentRecord["method"]>("bank_transfer");
  const [refNumber, setRefNumber] = useState<string>(`TXN-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState<string>("Payment received in full settlement.");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: PaymentRecord = {
      id: `pay_${Date.now()}`,
      invoiceId: doc.id,
      amount: Math.min(amount, doc.grandTotal),
      date,
      method,
      referenceNumber: refNumber,
      notes,
      receivedBy: doc.seller.ownerName
    };
    onRecordPayment(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 select-none text-left">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              💳
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Record Invoice Payment
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {doc.docNumber} • {doc.customer.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Due Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Bill</span>
              <p className="font-mono font-black text-sm text-slate-900 dark:text-white">
                {doc.currencySymbol}{doc.grandTotal.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Remaining Balance</span>
              <p className="font-mono font-black text-sm text-rose-600">
                {doc.currencySymbol}{doc.balanceDue.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Payment Amount ({doc.currencySymbol})</label>
            <input
              type="number"
              min="1"
              max={doc.grandTotal}
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-black text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Payment Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                <option value="bank_transfer">Bank Transfer / Wire</option>
                <option value="cash">Cash Settlement</option>
                <option value="qr_payment">QR / UPI / Esewa</option>
                <option value="card">Credit / Debit Card</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online Payment Link</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Transaction / Cheque Reference #</label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. UPI-9988123 or Wire-4421"
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Notes & Confirmation</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          {/* FOOTER */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Record Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
