import React, { useState } from "react";
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Building2,
  DollarSign,
  Printer,
  Eye,
  FileCheck
} from "lucide-react";

interface InvoicesAndReportsPageProps {
  showToast?: (msg: string) => void;
}

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPan?: string;
  date: string;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  status: "Paid" | "Refunded" | "Pending";
}

const DEMO_INVOICES: InvoiceItem[] = [
  {
    id: "inv-001",
    invoiceNo: "BLS-2026-0814",
    customerName: "Jane Smith",
    customerPan: "602910482",
    date: "2026-08-14",
    taxableAmount: 4424.78,
    vatAmount: 575.22,
    totalAmount: 5000.0,
    currency: "NPR",
    paymentMethod: "Fonepay QR (Direct Bank)",
    status: "Paid"
  },
  {
    id: "inv-002",
    invoiceNo: "BLS-2026-0812",
    customerName: "Dr. Robert Sterling",
    customerPan: "301984210",
    date: "2026-08-12",
    taxableAmount: 22123.89,
    vatAmount: 2876.11,
    totalAmount: 25000.0,
    currency: "NPR",
    paymentMethod: "Bank Wire",
    status: "Paid"
  },
  {
    id: "inv-003",
    invoiceNo: "BLS-2026-0810",
    customerName: "Sarah Brown",
    customerPan: "500129841",
    date: "2026-08-10",
    taxableAmount: 442.48,
    vatAmount: 57.52,
    totalAmount: 500.0,
    currency: "NPR",
    paymentMethod: "eSewa Direct",
    status: "Paid"
  },
  {
    id: "inv-004",
    invoiceNo: "BLS-2026-0808",
    customerName: "Marcus Miller",
    date: "2026-08-08",
    taxableAmount: 4.42,
    vatAmount: 0.57,
    totalAmount: 4.99,
    currency: "USD",
    paymentMethod: "Stripe International",
    status: "Paid"
  }
];

export const InvoicesAndReportsPage: React.FC<InvoicesAndReportsPageProps> = ({ showToast }) => {
  const [invoices] = useState<InvoiceItem[]>(DEMO_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerPan && inv.customerPan.includes(searchTerm))
  );

  const handleExportTaxAudit = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["InvoiceNo,Customer,PAN,Date,Taxable,VAT(13%),Total,Currency,Method,Status"]
        .concat(
          filtered.map(
            (i) =>
              `"${i.invoiceNo}","${i.customerName}","${i.customerPan || "N/A"}","${i.date}",${i.taxableAmount},${i.vatAmount},${i.totalAmount},"${i.currency}","${i.paymentMethod}","${i.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IRD_VAT_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast("IRD Tax Compliance Report exported successfully!");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                IRD & VAT Compliance
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Official Fiscal Invoices
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Invoices & IRD Tax Reports
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTaxAudit}
            className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download IRD Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice no, PAN, buyer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#131d38] rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-[#1e294b]">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer & PAN</th>
                <th className="p-4">Date</th>
                <th className="p-4">Taxable</th>
                <th className="p-4">VAT (13%)</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-black text-[#FF5A36]">{inv.invoiceNo}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">PAN: {inv.customerPan || "N/A"}</div>
                  </td>
                  <td className="p-4 text-slate-500">{inv.date}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {inv.currency} {inv.taxableAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {inv.currency} {inv.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 font-black text-slate-900 dark:text-white">
                    {inv.currency} {inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{inv.paymentMethod}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-1.5 bg-orange-50 dark:bg-slate-800 text-[#FF5A36] rounded-xl hover:bg-orange-100 transition-colors cursor-pointer"
                      title="View Invoice Receipt"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d38] w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-black text-base text-slate-900 dark:text-white">
                  Tax Invoice {selectedInvoice.invoiceNo}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                {selectedInvoice.status}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Seller:</span>
                <span className="font-bold text-slate-900 dark:text-white">Care2Care Technologies Pvt. Ltd.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seller PAN / VAT:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">619842011</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Buyer PAN:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedInvoice.customerPan || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issued Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.paymentMethod}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxable Net Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.currency} {selectedInvoice.taxableAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VAT (13%):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedInvoice.currency} {selectedInvoice.vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-600 text-sm font-black text-slate-900 dark:text-white">
                  <span>Grand Total:</span>
                  <span className="text-[#FF5A36]">{selectedInvoice.currency} {selectedInvoice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl font-black text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
