import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  Filter,
  Download,
  Printer,
  Share2,
  Trash2,
  Edit3,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  User,
  Package,
  TrendingUp,
  CreditCard,
  Send,
  Bell,
  RefreshCw,
  Eye,
  Sliders,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  FileCheck,
  Zap,
  Repeat
} from "lucide-react";
import {
  InvoiceDocument,
  BusinessProfile,
  CustomerProfile,
  CatalogItem,
  DocumentStatus,
  DocumentType,
  PaymentRecord
} from "./billingTypes";
import {
  INITIAL_BUSINESS_PROFILES,
  INITIAL_CUSTOMERS,
  INITIAL_CATALOG_ITEMS,
  TEMPLATE_GALLERY,
  TemplatePreset
} from "./billingTemplates";
import { InvoiceEditor } from "./InvoiceEditor";
import { InvoicePreview } from "./InvoicePreview";
import { SmartInvoiceAiModal } from "./SmartInvoiceAiModal";
import { PaymentRecordModal } from "./PaymentRecordModal";
import { QuickCreateInvoiceModal } from "./QuickCreateInvoiceModal";
import { TemplateSelectionScreen } from "./TemplateSelectionScreen";
import { VisualStatusTracker } from "./VisualStatusTracker";

interface BillingInvoiceServiceProps {
  onBack?: () => void;
}

export const BillingInvoiceService: React.FC<BillingInvoiceServiceProps> = ({ onBack }) => {
  // Persistence state
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    try {
      const saved = localStorage.getItem("blessikaa_billing_businesses");
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILES;
    } catch {
      return INITIAL_BUSINESS_PROFILES;
    }
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    try {
      const saved = localStorage.getItem("blessikaa_billing_customers");
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem("blessikaa_billing_catalog");
      return saved ? JSON.parse(saved) : INITIAL_CATALOG_ITEMS;
    } catch {
      return INITIAL_CATALOG_ITEMS;
    }
  });

  const [documents, setDocuments] = useState<InvoiceDocument[]>(() => {
    try {
      const saved = localStorage.getItem("blessikaa_billing_documents");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }

    // Seed 3 sample documents for instant usability
    const now = new Date();
    const seed: InvoiceDocument[] = [
      {
        id: "doc_seed_1",
        docNumber: `INV-2026-00124`,
        docType: "invoice",
        title: "TAX INVOICE",
        status: "partially_paid",
        issueDate: "2026-08-15",
        dueDate: "2026-08-30",
        seller: INITIAL_BUSINESS_PROFILES[0],
        customer: INITIAL_CUSTOMERS[0],
        items: [
          {
            id: "it_1",
            name: "Website & Web Application Development",
            description: "Phase 1 custom React & full-stack API integration",
            quantity: 1,
            unit: "Project",
            unitRate: 1500,
            discountType: "percent",
            discountValue: 0,
            taxType: "vat",
            taxPercent: 13,
            lineSubtotal: 1500,
            lineDiscountAmount: 0,
            lineTaxableAmount: 1500,
            lineTaxAmount: 195,
            lineTotal: 1695
          }
        ],
        columnsConfig: TEMPLATE_GALLERY[0].columns,
        currency: "USD",
        currencySymbol: "$",
        subtotal: 1500,
        itemDiscountsTotal: 0,
        invoiceDiscountType: "percent",
        invoiceDiscountValue: 0,
        invoiceDiscountTotal: 0,
        taxableAmount: 1500,
        taxStructure: "vat",
        taxPercent: 13,
        taxTotal: 195,
        shippingCharges: 0,
        packagingCharges: 0,
        roundOff: 0,
        grandTotal: 1695,
        paidAmount: 1000,
        balanceDue: 695,
        paymentMethod: "bank_transfer",
        showSignature: true,
        authorizedPersonName: "Eleanor Vance",
        authorizedPersonDesignation: "Authorized Signatory",
        showStamp: false,
        isComputerGeneratedDisclaimer: true,
        notes: "Thank you for partnering with us!",
        termsConditions: "Payment due within 15 days of invoice date.",
        customFields: [{ id: "cf1", label: "Project Ref", value: "NEXUS-V2", type: "text" }],
        templateId: "std_business_invoice",
        pageSize: "a4",
        orientation: "portrait",
        spacing: "standard",
        themeColor: "#FF6A45",
        fontFamily: "Inter",
        showGridlines: false,
        borderStyle: "light",
        payments: [
          {
            id: "pay_seed_1",
            invoiceId: "doc_seed_1",
            amount: 1000,
            date: "2026-08-18",
            method: "bank_transfer",
            referenceNumber: "WIRE-889921",
            notes: "Initial milestone deposit"
          }
        ],
        auditLogs: [],
        attachments: [],
        createdAt: "2026-08-15T10:00:00Z",
        updatedAt: "2026-08-18T14:30:00Z"
      },
      {
        id: "doc_seed_2",
        docNumber: `INV-2026-00125`,
        docType: "service_invoice",
        title: "SERVICE INVOICE",
        status: "paid",
        issueDate: "2026-08-10",
        dueDate: "2026-08-20",
        seller: INITIAL_BUSINESS_PROFILES[0],
        customer: INITIAL_CUSTOMERS[2],
        items: [
          {
            id: "it_2",
            name: "Senior Care & Caregiver Retainer (Monthly)",
            description: "August 2026 24/7 vitals telemetry & medication care plan",
            quantity: 1,
            unit: "Month",
            unitRate: 450,
            discountType: "percent",
            discountValue: 5,
            taxType: "none",
            taxPercent: 0,
            lineSubtotal: 450,
            lineDiscountAmount: 22.5,
            lineTaxableAmount: 427.5,
            lineTaxAmount: 0,
            lineTotal: 427.5
          }
        ],
        columnsConfig: TEMPLATE_GALLERY[3].columns,
        currency: "USD",
        currencySymbol: "$",
        subtotal: 450,
        itemDiscountsTotal: 22.5,
        invoiceDiscountType: "percent",
        invoiceDiscountValue: 0,
        invoiceDiscountTotal: 0,
        taxableAmount: 427.5,
        taxStructure: "no_tax",
        taxPercent: 0,
        taxTotal: 0,
        shippingCharges: 0,
        packagingCharges: 0,
        roundOff: 0,
        grandTotal: 427.5,
        paidAmount: 427.5,
        balanceDue: 0,
        paymentMethod: "online",
        showSignature: true,
        authorizedPersonName: "Eleanor Vance",
        authorizedPersonDesignation: "Authorized Signatory",
        showStamp: false,
        isComputerGeneratedDisclaimer: true,
        notes: "Blessed wishes for good health & vitality.",
        termsConditions: "Standard service retainer terms.",
        customFields: [],
        templateId: "consultant_freelancer_invoice",
        pageSize: "a4",
        orientation: "portrait",
        spacing: "standard",
        themeColor: "#7C3AED",
        fontFamily: "Inter",
        showGridlines: false,
        borderStyle: "light",
        payments: [],
        auditLogs: [],
        attachments: [],
        createdAt: "2026-08-10T09:00:00Z",
        updatedAt: "2026-08-11T11:00:00Z"
      },
      {
        id: "doc_seed_3",
        docNumber: `QUO-2026-00042`,
        docType: "quotation",
        title: "PRICE QUOTATION",
        status: "sent",
        issueDate: "2026-08-20",
        dueDate: "2026-09-05",
        seller: INITIAL_BUSINESS_PROFILES[1],
        customer: INITIAL_CUSTOMERS[1],
        items: [
          {
            id: "it_3",
            name: "Digital Medical QR Emergency Pendant",
            description: "50x Laser-engraved titanium NFC & QR alert pendants",
            quantity: 50,
            unit: "pcs",
            unitRate: 45,
            discountType: "percent",
            discountValue: 10,
            taxType: "vat",
            taxPercent: 13,
            lineSubtotal: 2250,
            lineDiscountAmount: 225,
            lineTaxableAmount: 2025,
            lineTaxAmount: 263.25,
            lineTotal: 2288.25
          }
        ],
        columnsConfig: TEMPLATE_GALLERY[0].columns,
        currency: "USD",
        currencySymbol: "$",
        subtotal: 2250,
        itemDiscountsTotal: 225,
        invoiceDiscountType: "percent",
        invoiceDiscountValue: 0,
        invoiceDiscountTotal: 0,
        taxableAmount: 2025,
        taxStructure: "vat",
        taxPercent: 13,
        taxTotal: 263.25,
        shippingCharges: 25,
        packagingCharges: 0,
        roundOff: 0,
        grandTotal: 2313.25,
        paidAmount: 0,
        balanceDue: 2313.25,
        paymentMethod: "bank_transfer",
        showSignature: true,
        authorizedPersonName: "Roshan Sharma",
        authorizedPersonDesignation: "Managing Director",
        showStamp: false,
        isComputerGeneratedDisclaimer: true,
        notes: "Quotation valid for 30 calendar days from issue.",
        termsConditions: "50% advance upon purchase order confirmation.",
        customFields: [],
        templateId: "std_business_invoice",
        pageSize: "a4",
        orientation: "portrait",
        spacing: "standard",
        themeColor: "#0284C7",
        fontFamily: "Inter",
        showGridlines: false,
        borderStyle: "light",
        payments: [],
        auditLogs: [],
        attachments: [],
        createdAt: "2026-08-20T08:00:00Z",
        updatedAt: "2026-08-20T08:00:00Z"
      }
    ];
    return seed;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("blessikaa_billing_documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("blessikaa_billing_businesses", JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem("blessikaa_billing_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("blessikaa_billing_catalog", JSON.stringify(catalogItems));
  }, [catalogItems]);

  // UI state
  const [mainViewMode, setMainViewMode] = useState<"documents" | "templates" | "pdf_preview">("documents");
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "invoices" | "quotes" | "receipts" | "bills" | "recurring">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "today" | "week" | "month" | "year">("all");

  // Modals & Editor
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState<boolean>(false);
  const [editingDoc, setEditingDoc] = useState<InvoiceDocument | undefined>(undefined);
  const [previewingDoc, setPreviewingDoc] = useState<InvoiceDocument | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [paymentModalDoc, setPaymentModalDoc] = useState<InvoiceDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewZoomLevel, setPreviewZoomLevel] = useState<number>(100);
  const [selectedPdfDocId, setSelectedPdfDocId] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalInvoices = documents.length;
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let draftCount = 0;

    documents.forEach((d) => {
      totalPaid += d.paidAmount;
      if (d.status === "draft") draftCount++;
      if (d.status === "overdue") totalOverdue += d.balanceDue;
      if (d.status === "sent" || d.status === "partially_paid" || d.status === "draft") {
        totalPending += d.balanceDue;
      }
    });

    return {
      totalInvoices,
      totalPaid,
      totalPending,
      totalOverdue,
      draftCount
    };
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      // Category tab filter
      if (activeCategoryTab === "invoices" && !["invoice", "tax_invoice", "service_invoice", "subscription_invoice"].includes(d.docType)) return false;
      if (activeCategoryTab === "quotes" && !["quotation", "estimate", "proforma"].includes(d.docType)) return false;
      if (activeCategoryTab === "receipts" && !["sales_receipt", "payment_receipt", "donation_receipt", "fee_receipt"].includes(d.docType)) return false;
      if (activeCategoryTab === "bills" && !["bill", "purchase_bill", "expense_bill", "rent_invoice"].includes(d.docType)) return false;
      if (activeCategoryTab === "recurring" && d.docType !== "recurring_invoice") return false;

      // Status filter
      if (statusFilter !== "all" && d.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = d.docNumber.toLowerCase().includes(q);
        const matchCust = d.customer.name.toLowerCase().includes(q) || (d.customer.companyName && d.customer.companyName.toLowerCase().includes(q));
        const matchItem = d.items.some((it) => it.name.toLowerCase().includes(q));
        if (!matchNum && !matchCust && !matchItem) return false;
      }

      return true;
    });
  }, [documents, activeCategoryTab, statusFilter, searchQuery]);

  // Handlers
  const handleSaveDocument = (savedDoc: InvoiceDocument) => {
    setDocuments((prev) => {
      const idx = prev.findIndex((d) => d.id === savedDoc.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedDoc;
        return next;
      }
      return [savedDoc, ...prev];
    });
    setIsEditorOpen(false);
    setEditingDoc(undefined);
    showToast(`Saved ${savedDoc.docNumber} successfully!`);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (previewingDoc?.id === id) setPreviewingDoc(null);
      showToast("Document deleted.");
    }
  };

  const handleDuplicateDocument = (source: InvoiceDocument) => {
    const dup: InvoiceDocument = {
      ...source,
      id: `doc_${Date.now()}`,
      docNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      status: "draft",
      paidAmount: 0,
      balanceDue: source.grandTotal,
      issueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payments: []
    };
    setDocuments((prev) => [dup, ...prev]);
    showToast(`Duplicated as ${dup.docNumber}`);
  };

  const handleConvertToReceipt = (invoice: InvoiceDocument) => {
    const receiptDoc: InvoiceDocument = {
      ...invoice,
      id: `rcpt_${Date.now()}`,
      docNumber: `RCPT-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      docType: "payment_receipt",
      title: "PAYMENT RECEIPT",
      status: "paid",
      paidAmount: invoice.grandTotal,
      balanceDue: 0,
      issueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDocuments((prev) => [receiptDoc, ...prev]);
    showToast(`Created Payment Receipt: ${receiptDoc.docNumber}`);
  };

  const handleRecordPayment = (payment: PaymentRecord) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === payment.invoiceId) {
          const newPaid = Math.min(d.grandTotal, d.paidAmount + payment.amount);
          const newBalance = Math.max(0, d.grandTotal - newPaid);
          const newStatus: DocumentStatus = newBalance === 0 ? "paid" : "partially_paid";
          return {
            ...d,
            paidAmount: newPaid,
            balanceDue: newBalance,
            status: newStatus,
            payments: [...(d.payments || []), payment],
            updatedAt: new Date().toISOString()
          };
        }
        return d;
      })
    );
    showToast(`Recorded payment of ${payment.amount} successfully!`);
  };

  const handleSendReminder = (doc: InvoiceDocument) => {
    showToast(`Payment reminder dispatched to ${doc.customer.email || doc.customer.name}!`);
  };

  return (
    <div className="w-full space-y-6 pb-24 select-none text-left">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP HERO HEADER & METRICS */}
      {/* ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/20 border border-orange-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#C2410C] dark:text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-200/70">
                💼 Cross-Platform Document Engine
              </span>
              <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                20 Document Types
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Billing, Invoices & Business Documents
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Create, customize, calculate, save, print and manage professional invoices, bills, receipts, quotations and legal tax documents effortlessly.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* QUICK CREATE BUTTON */}
            <button
              type="button"
              onClick={() => setIsQuickCreateOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/15 dark:bg-amber-950/60 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border border-amber-300/80 dark:border-amber-700/60 shadow-2xs active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>⚡ Quick Create</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 text-[#EA580C] dark:text-orange-300 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border border-orange-200/80 dark:border-orange-800/60 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🪄 Create for Me</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingDoc(undefined);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2 rounded-2xl bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Invoice</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW (MATCHING PROMPT SPEC: Invoices, Paid, Pending, Overdue, Draft) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-orange-200/60 dark:border-slate-800">
          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Invoices</span>
            <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">{metrics.totalInvoices}</p>
          </div>

          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Total Paid</span>
            <p className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono">${metrics.totalPaid.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl border border-sky-200/80 dark:border-sky-900/40 space-y-0.5">
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">Pending Due</span>
            <p className="text-base sm:text-lg font-black text-sky-700 dark:text-sky-300 font-mono">${metrics.totalPending.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 space-y-0.5">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Overdue</span>
            <p className="text-base sm:text-lg font-black text-rose-600 font-mono">${metrics.totalOverdue.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drafts</span>
            <p className="text-base sm:text-lg font-black text-slate-600 dark:text-slate-300 font-mono">{metrics.draftCount}</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE VIEW MODE SWITCHER */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMainViewMode("documents")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainViewMode === "documents"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#FF6A45]" />
            <span>📁 Document Records ({documents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMainViewMode("templates")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainViewMode === "templates"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>🎨 Template Gallery (Business, Retail, Services)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!selectedPdfDocId && documents.length > 0) {
                setSelectedPdfDocId(documents[0].id);
              }
              setMainViewMode("pdf_preview");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainViewMode === "pdf_preview"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-500" />
            <span>📱 Real-Time PDF Preview Mode</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONDITIONAL MAIN VIEW RENDERING */}
      {/* ======================================================== */}

      {/* VIEW A: TEMPLATE GALLERY SELECTION SCREEN (Business, Retail, Services, etc.) */}
      {mainViewMode === "templates" && (
        <TemplateSelectionScreen
          currentTemplateId="std_business_invoice"
          defaultBusiness={businesses[0]}
          defaultCustomer={customers[0]}
          onSelectTemplate={(template) => {
            const today = new Date().toISOString().split("T")[0];
            const newDoc: InvoiceDocument = {
              id: `doc_${Date.now()}`,
              docNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
              docType: template.docType,
              title: template.name.toUpperCase(),
              status: "draft",
              issueDate: today,
              dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
              seller: businesses[0] || INITIAL_BUSINESS_PROFILES[0],
              customer: customers[0] || INITIAL_CUSTOMERS[0],
              currency: businesses[0]?.currency || "USD",
              currencySymbol: businesses[0]?.currencySymbol || "$",
              columnsConfig: template.columns,
              items: [
                {
                  id: `it_${Date.now()}_1`,
                  name: "Service / Product Item",
                  description: "Professional delivery and consulting",
                  quantity: 1,
                  unit: "pcs",
                  unitRate: 150,
                  discountType: "percent",
                  discountValue: 0,
                  taxType: "vat",
                  taxPercent: 10,
                  lineSubtotal: 150,
                  lineDiscountAmount: 0,
                  lineTaxableAmount: 150,
                  lineTaxAmount: 15,
                  lineTotal: 165
                }
              ],
              subtotal: 150,
              itemDiscountsTotal: 0,
              invoiceDiscountType: "percent",
              invoiceDiscountValue: 0,
              invoiceDiscountTotal: 0,
              taxableAmount: 150,
              taxStructure: "vat",
              taxPercent: 10,
              taxTotal: 15,
              shippingCharges: 0,
              packagingCharges: 0,
              roundOff: 0,
              grandTotal: 165,
              paidAmount: 0,
              balanceDue: 165,
              paymentMethod: "bank_transfer",
              showSignature: true,
              authorizedPersonName: businesses[0]?.ownerName || "Authorized Signatory",
              authorizedPersonDesignation: "Managing Director",
              showStamp: true,
              isComputerGeneratedDisclaimer: true,
              notes: template.defaultNotes,
              termsConditions: template.defaultTerms,
              customFields: [],
              templateId: template.id,
              pageSize: template.pageSize,
              orientation: template.orientation,
              spacing: "standard",
              themeColor: template.themeColor,
              fontFamily: "Inter",
              showGridlines: false,
              borderStyle: "light",
              payments: [],
              auditLogs: [{ id: `log_init`, action: "Created from Template", actor: "User", timestamp: new Date().toISOString(), details: `Template: ${template.name}` }],
              attachments: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setEditingDoc(newDoc);
            setIsEditorOpen(true);
          }}
        />
      )}

      {/* VIEW B: REAL-TIME PDF PREVIEW MODE WITH MOBILE VIEWPORT GRID & ZOOM CONTROLS */}
      {mainViewMode === "pdf_preview" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    📱 Mobile Viewport Engine
                  </span>
                  <span className="text-xs font-bold text-slate-500">Live Auto-Scale</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Real-Time PDF Preview & Mobile Scaling Grid
                </h2>
              </div>

              {/* Document Selector for Preview */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">Select Document:</span>
                <select
                  value={selectedPdfDocId || (documents[0]?.id ?? "")}
                  onChange={(e) => setSelectedPdfDocId(e.target.value)}
                  className="p-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.docNumber} - {d.customer.name} ({d.currencySymbol}{d.grandTotal.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live rendered preview */}
            {(() => {
              const activeDoc = documents.find((d) => d.id === selectedPdfDocId) || documents[0];
              if (!activeDoc) {
                return (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No documents available to preview. Create an invoice to begin.
                  </div>
                );
              }

              return (
                <div className="w-full space-y-4">
                  <InvoicePreview
                    document={activeDoc}
                    zoom={previewZoomLevel}
                    onZoomChange={(newZ) => setPreviewZoomLevel(newZ)}
                    onPrint={() => window.print()}
                    onShare={() => showToast("Public document link copied to clipboard!")}
                    onDownloadPdf={() => showToast("PDF generated for printing/downloading.")}
                    onRecordPayment={() => setPaymentModalDoc(activeDoc)}
                    onMarkAsSent={() => {
                      handleSaveDocument({ ...activeDoc, status: "sent", updatedAt: new Date().toISOString() });
                      showToast("Marked as Sent!");
                    }}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* VIEW C: STANDARD DOCUMENT RECORDS LIST */}
      {mainViewMode === "documents" && (
        <div className="space-y-4">
          {/* Main Category Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5">
              {[
                { id: "all", label: "All Documents", icon: "📑" },
                { id: "invoices", label: "Invoices & Taxes", icon: "📄" },
                { id: "quotes", label: "Quotes & Estimates", icon: "💬" },
                { id: "receipts", label: "Payment Receipts", icon: "🛍️" },
                { id: "bills", label: "Bills & Expenses", icon: "🧾" },
                { id: "recurring", label: "Recurring Schedules", icon: "🔁" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategoryTab === tab.id
                      ? "bg-[#FF6A45] text-white shadow-2xs"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-800"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search, Status & Period controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by invoice #, customer name, company, or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">Time: All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Document Records List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-black text-slate-800 dark:text-slate-200">
                Document Records ({filteredDocuments.length})
              </h2>
              <span className="text-xs text-slate-400">Click any row to preview or take actions</span>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-[#FF6A45] flex items-center justify-center mx-auto text-xl font-black">
                  📄
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">No documents found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create your first professional invoice, bill or quote using the ready-made templates or smart AI prompt.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickCreateOpen(true)}
                    className="px-4 py-2 bg-amber-500 text-white text-xs font-black rounded-2xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" /> Quick Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(true)}
                    className="px-4 py-2 bg-[#FF6A45] text-white text-xs font-black rounded-2xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Full Editor
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredDocuments.map((doc) => {
                  const isPaid = doc.status === "paid";
                  const isOverdue = doc.status === "overdue";
                  const isPartial = doc.status === "partially_paid";

                  return (
                    <div
                      key={doc.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer"
                      onClick={() => setPreviewingDoc(doc)}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          style={{ backgroundColor: `${doc.themeColor}15`, color: doc.themeColor }}
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shrink-0 border border-current"
                        >
                          {doc.docType === "quotation" ? "💬" : doc.docType === "payment_receipt" ? "🛍️" : "📄"}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                              {doc.docNumber}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                              {doc.docType.replace("_", " ")}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isPaid
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : isPartial
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : isOverdue
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                              }`}
                            >
                              {doc.status.replace("_", " ")}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                            {doc.customer.name} {doc.customer.companyName ? `• ${doc.customer.companyName}` : ""}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                            <span>Issued: {doc.issueDate}</span>
                            <span>Due: <span className={isOverdue ? "text-rose-500 font-bold" : ""}>{doc.dueDate}</span></span>
                            <span>• {doc.items.length} item(s)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Amount & Quick Action Buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="text-left sm:text-right space-y-0.5">
                          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                            {doc.currencySymbol}{doc.grandTotal.toFixed(2)}
                          </span>
                          {doc.balanceDue > 0 ? (
                            <p className="text-[11px] text-rose-600 font-bold">
                              Due: {doc.currencySymbol}{doc.balanceDue.toFixed(2)}
                            </p>
                          ) : (
                            <p className="text-[11px] text-emerald-600 font-bold">Paid in Full ✓</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {/* Record Payment Button */}
                          {doc.balanceDue > 0 && (
                            <button
                              type="button"
                              onClick={() => setPaymentModalDoc(doc)}
                              className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-black rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer active:scale-95"
                              title="Record Payment"
                            >
                              + Pay
                            </button>
                          )}

                          {/* Quick PDF Preview Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPdfDocId(doc.id);
                              setMainViewMode("pdf_preview");
                            }}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="Live PDF Preview"
                          >
                            <Eye className="w-4 h-4 text-emerald-600" />
                          </button>

                          {/* Convert to Receipt */}
                          {doc.docType === "invoice" && (
                            <button
                              type="button"
                              onClick={() => handleConvertToReceipt(doc)}
                              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="Convert to Receipt"
                            >
                              <Receipt className="w-4 h-4 text-purple-500" />
                            </button>
                          )}

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateDocument(doc)}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="Duplicate Document"
                          >
                            <Copy className="w-4 h-4 text-blue-500" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDoc(doc);
                              setIsEditorOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            title="Edit Document"
                          >
                            <Edit3 className="w-4 h-4 text-orange-500" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODALS & SUB-VIEWS */}
      {/* ======================================================== */}

      {/* QUICK CREATE MODAL */}
      <QuickCreateInvoiceModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        businesses={businesses}
        customers={customers}
        catalogItems={catalogItems}
        onCreated={(newDoc) => {
          handleSaveDocument(newDoc);
          setPreviewingDoc(newDoc);
          showToast(`Invoice ${newDoc.docNumber} created!`);
        }}
      />

      {/* INVOICE EDITOR FULLSCREEN VIEW */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 overflow-y-auto p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="max-w-6xl mx-auto">
            <InvoiceEditor
              initialDocument={editingDoc}
              businesses={businesses}
              customers={customers}
              catalogItems={catalogItems}
              onSave={handleSaveDocument}
              onCancel={() => {
                setIsEditorOpen(false);
                setEditingDoc(undefined);
              }}
            />
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL WITH VISUAL STATUS TRACKER & RECORD PAYMENT */}
      {previewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-1.5 sm:p-6 flex justify-center items-start animate-in fade-in duration-150">
          <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl space-y-3 sm:space-y-4 my-2 sm:my-6">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                  {previewingDoc.docNumber}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
                  • {previewingDoc.customer.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingDoc(null)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-black rounded-xl cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <InvoicePreview
              document={previewingDoc}
              onPrint={() => window.print()}
              onShare={() => showToast("Public document link copied to clipboard!")}
              onDownloadPdf={() => showToast("PDF generated and ready for print/download.")}
              onRecordPayment={() => setPaymentModalDoc(previewingDoc)}
              onMarkAsSent={() => {
                const updated = { ...previewingDoc, status: "sent" as DocumentStatus, updatedAt: new Date().toISOString() };
                handleSaveDocument(updated);
                setPreviewingDoc(updated);
                showToast("Invoice marked as sent!");
              }}
            />
          </div>
        </div>
      )}

      {/* SMART AI NATURAL LANGUAGE INVOICE GENERATOR */}
      <SmartInvoiceAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        businesses={businesses}
        customers={customers}
        catalogItems={catalogItems}
        onGenerated={(generatedDoc) => {
          setEditingDoc(generatedDoc);
          setIsEditorOpen(true);
        }}
      />

      {/* PAYMENT RECORD MODAL */}
      {paymentModalDoc && (
        <PaymentRecordModal
          isOpen={!!paymentModalDoc}
          onClose={() => setPaymentModalDoc(null)}
          document={paymentModalDoc}
          onRecordPayment={handleRecordPayment}
        />
      )}
    </div>
  );
};
