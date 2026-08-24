import React, { useState, useEffect } from "react";
import {
  Save,
  Eye,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  Package,
  Calendar,
  Percent,
  DollarSign,
  FileText,
  Clock,
  Printer,
  Share2,
  LayoutGrid,
  ChevronDown,
  Layers,
  Settings,
  HelpCircle
} from "lucide-react";
import {
  InvoiceDocument,
  InvoiceLineItem,
  BusinessProfile,
  CustomerProfile,
  CatalogItem,
  CustomField,
  DocumentType,
  DOCUMENT_TYPE_OPTIONS
} from "./billingTypes";
import { TEMPLATE_GALLERY, DEFAULT_DOCUMENT_COLUMNS } from "./billingTemplates";
import { calculateInvoice } from "./InvoiceCalculationEngine";
import { useInvoiceCalculation } from "./useInvoiceCalculation";
import { InvoicePreview } from "./InvoicePreview";

interface InvoiceEditorProps {
  initialDocument?: Partial<InvoiceDocument>;
  businesses: BusinessProfile[];
  customers: CustomerProfile[];
  catalogItems: CatalogItem[];
  onSave: (document: InvoiceDocument) => void;
  onCancel: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  initialDocument,
  businesses,
  customers,
  catalogItems,
  onSave,
  onCancel
}) => {
  // Mode: "quick" vs "advanced"
  const [editorMode, setEditorMode] = useState<"quick" | "advanced">("quick");
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"general" | "items" | "taxes" | "custom_fields" | "payment" | "terms">("general");

  // Selected default profile & customer
  const defaultBusiness = businesses.find((b) => b.isDefault) || businesses[0] || {
    id: "default_biz",
    name: "My Business",
    ownerName: "Business Owner",
    businessType: "Business",
    phone: "+1 555-0199",
    email: "billing@example.com",
    address: "123 Commerce St",
    city: "New York",
    country: "USA",
    currency: "USD",
    currencySymbol: "$"
  };

  const defaultCustomer = customers[0] || {
    id: "cust_default",
    name: "New Client",
    type: "individual",
    email: "client@example.com",
    phone: "+1 555-0100",
    billingAddress: "456 Client Ave"
  };

  // State
  const [doc, setDoc] = useState<InvoiceDocument>(() => {
    const base: Partial<InvoiceDocument> = {
      id: initialDocument?.id || `doc_${Date.now()}`,
      docNumber: initialDocument?.docNumber || `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      docType: initialDocument?.docType || "invoice",
      title: initialDocument?.title || "TAX INVOICE",
      status: initialDocument?.status || "draft",
      issueDate: initialDocument?.issueDate || new Date().toISOString().split("T")[0],
      dueDate: initialDocument?.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
      seller: initialDocument?.seller || defaultBusiness,
      customer: initialDocument?.customer || defaultCustomer,
      currency: initialDocument?.currency || defaultBusiness.currency || "USD",
      currencySymbol: initialDocument?.currencySymbol || defaultBusiness.currencySymbol || "$",
      columnsConfig: initialDocument?.columnsConfig || DEFAULT_DOCUMENT_COLUMNS,
      items: initialDocument?.items || [
        {
          id: `item_${Date.now()}_1`,
          name: "Professional Consultation & Service",
          description: "Initial project strategy and implementation sprint",
          quantity: 1,
          unit: "hrs",
          unitRate: 150,
          discountType: "percent",
          discountValue: 0,
          taxType: "vat",
          taxPercent: 13,
          lineSubtotal: 150,
          lineDiscountAmount: 0,
          lineTaxableAmount: 150,
          lineTaxAmount: 19.5,
          lineTotal: 169.5
        }
      ],
      subtotal: 150,
      itemDiscountsTotal: 0,
      invoiceDiscountType: "percent",
      invoiceDiscountValue: 0,
      invoiceDiscountTotal: 0,
      taxableAmount: 150,
      taxStructure: "vat",
      taxPercent: 13,
      taxTotal: 19.5,
      shippingCharges: 0,
      packagingCharges: 0,
      roundOff: 0,
      grandTotal: 169.5,
      paidAmount: 0,
      balanceDue: 169.5,
      paymentMethod: "bank_transfer",
      showSignature: true,
      authorizedPersonName: defaultBusiness.ownerName,
      authorizedPersonDesignation: "Authorized Signatory",
      showStamp: false,
      isComputerGeneratedDisclaimer: true,
      notes: "Thank you for your business. We appreciate working with you!",
      termsConditions: "1. Payment is due within 15 days of invoice date.\n2. Invoices past due are subject to 1.5% interest.",
      customFields: [],
      templateId: "std_business_invoice",
      pageSize: "a4",
      orientation: "portrait",
      spacing: "standard",
      themeColor: "#FF6A45",
      fontFamily: "Inter",
      showGridlines: false,
      borderStyle: "light",
      payments: [],
      auditLogs: [{ id: `log_1`, action: "Created Draft", actor: defaultBusiness.ownerName, timestamp: new Date().toISOString(), details: "Document initialized in editor" }],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const calculated = calculateInvoice(base);
    return { ...base, ...calculated } as InvoiceDocument;
  });

  // Re-calculate when items, discounts or taxes change
  const updateDocument = (updates: Partial<InvoiceDocument>) => {
    setDoc((prev) => {
      const merged = { ...prev, ...updates };
      const calculated = calculateInvoice(merged);
      return { ...merged, ...calculated, updatedAt: new Date().toISOString() };
    });
  };

  // Line item handlers
  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const newItems = [...doc.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateDocument({ items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item_${Date.now()}_${Math.random()}`,
      name: "New Item / Service",
      description: "",
      quantity: 1,
      unit: "pcs",
      unitRate: 100,
      discountType: "percent",
      discountValue: 0,
      taxType: doc.taxStructure === "no_tax" ? "none" : "vat",
      taxPercent: doc.taxPercent || 0,
      lineSubtotal: 100,
      lineDiscountAmount: 0,
      lineTaxableAmount: 100,
      lineTaxAmount: 0,
      lineTotal: 100
    };
    updateDocument({ items: [...doc.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    if (doc.items.length <= 1) return;
    const newItems = doc.items.filter((_, i) => i !== index);
    updateDocument({ items: newItems });
  };

  const handleSelectCatalogItem = (index: number, catalogItem: CatalogItem) => {
    const newItems = [...doc.items];
    newItems[index] = {
      ...newItems[index],
      name: catalogItem.name,
      description: catalogItem.description,
      sku: catalogItem.sku,
      unit: catalogItem.unit,
      unitRate: catalogItem.unitPrice,
      taxPercent: catalogItem.taxPercent,
      discountValue: catalogItem.discountPercent || 0
    };
    updateDocument({ items: newItems });
  };

  const handleApplyTemplate = (template: typeof TEMPLATE_GALLERY[0]) => {
    updateDocument({
      templateId: template.id,
      docType: template.docType,
      themeColor: template.themeColor,
      pageSize: template.pageSize,
      orientation: template.orientation,
      columnsConfig: template.columns,
      termsConditions: template.defaultTerms,
      notes: template.defaultNotes
    });
  };

  const handleAddCustomField = () => {
    const newField: CustomField = {
      id: `cf_${Date.now()}`,
      label: "Project Name",
      value: "",
      type: "text"
    };
    updateDocument({ customFields: [...(doc.customFields || []), newField] });
  };

  const handleRemoveCustomField = (id: string) => {
    updateDocument({ customFields: doc.customFields.filter((cf) => cf.id !== id) });
  };

  return (
    <div className="w-full space-y-4 pb-12 select-none text-left">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {doc.docNumber || "New Invoice"}
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#FF6A45] px-2 py-0.5 rounded-full">
                {doc.docType.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              “Choose a professional default, customize only what you need, or create completely.”
            </p>
          </div>
        </div>

        {/* Quick / Advanced Mode Switcher & Save */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setEditorMode("quick")}
              className={`px-3 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                editorMode === "quick"
                  ? "bg-white dark:bg-slate-900 text-[#FF6A45] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              ⚡ Quick Create
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("advanced")}
              className={`px-3 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                editorMode === "advanced"
                  ? "bg-white dark:bg-slate-900 text-[#FF6A45] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              🛠️ Advanced Builder
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-black rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF6A45]" />
            <span className="hidden sm:inline">{showLivePreview ? "Hide Preview" : "Split Preview"}</span>
          </button>

          <button
            type="button"
            onClick={() => onSave(doc)}
            className="px-4 py-2 bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Issue</span>
          </button>
        </div>
      </div>

      {/* TEMPLATE PICKER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-black uppercase text-slate-400 whitespace-nowrap px-1">
          Preset Templates:
        </span>
        {TEMPLATE_GALLERY.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => handleApplyTemplate(tmpl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
              doc.templateId === tmpl.id
                ? "bg-orange-50 dark:bg-orange-950 text-[#FF6A45] border-[#FF6A45]"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-300"
            }`}
          >
            {tmpl.name}
          </button>
        ))}
      </div>

      {/* MAIN SPLIT GRID: LEFT EDITOR, RIGHT LIVE PREVIEW */}
      <div className={`grid gap-4 ${showLivePreview ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* LEFT COLUMN: FORM & CONTROLS */}
        <div className={`space-y-4 ${showLivePreview ? "lg:col-span-6" : "w-full"}`}>
          {/* ADVANCED SUB-TABS (IF IN ADVANCED MODE) */}
          {editorMode === "advanced" && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: "general", label: "General & Type", icon: "📄" },
                { id: "items", label: "Items & Columns", icon: "📦" },
                { id: "taxes", label: "Taxes & Discounts", icon: "🏛️" },
                { id: "custom_fields", label: "Custom Fields", icon: "🏷️" },
                { id: "payment", label: "Payment & Bank", icon: "💳" },
                { id: "terms", label: "Terms & Signature", icon: "✍️" }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === t.id
                      ? "bg-[#FF6A45] text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: BUSINESS & CUSTOMER SELECTORS */}
          {/* ======================================================== */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bill From: Business Profile */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#FF6A45]" /> Bill From (Your Business)
                  </span>
                  <span className="text-[10px] text-slate-400">Multi-Business</span>
                </label>
                <select
                  value={doc.seller.id}
                  onChange={(e) => {
                    const sel = businesses.find((b) => b.id === e.target.value);
                    if (sel) {
                      updateDocument({
                        seller: sel,
                        currency: sel.currency,
                        currencySymbol: sel.currencySymbol,
                        authorizedPersonName: sel.ownerName
                      });
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.currencySymbol})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 truncate">{doc.seller.address}, {doc.seller.phone}</p>
              </div>

              {/* Bill To: Customer Profile */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-500" /> Bill To (Customer / Client)
                  </span>
                  <span className="text-[10px] text-slate-400">Customer DB</span>
                </label>
                <select
                  value={doc.customer.id}
                  onChange={(e) => {
                    const sel = customers.find((c) => c.id === e.target.value);
                    if (sel) updateDocument({ customer: sel });
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.companyName ? `• ${c.companyName}` : ""}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 truncate">{doc.customer.billingAddress || doc.customer.email}</p>
              </div>
            </div>

            {/* Document Type, Number & Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Document Type</label>
                <select
                  value={doc.docType}
                  onChange={(e) => {
                    const dt = e.target.value as DocumentType;
                    const opt = DOCUMENT_TYPE_OPTIONS.find((o) => o.id === dt);
                    updateDocument({ docType: dt, title: opt?.defaultTitle || "INVOICE" });
                  }}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Doc Number</label>
                <input
                  type="text"
                  value={doc.docNumber}
                  onChange={(e) => updateDocument({ docNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Issue Date</label>
                <input
                  type="date"
                  value={doc.issueDate}
                  onChange={(e) => updateDocument({ issueDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Due Date</label>
                <input
                  type="date"
                  value={doc.dueDate}
                  onChange={(e) => updateDocument({ dueDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-rose-600"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: LINE ITEMS TABLE */}
          {/* ======================================================== */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#FF6A45]" /> Products & Service Items ({doc.items.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950 text-[#FF6A45] hover:bg-orange-100 text-xs font-black rounded-xl border border-orange-200 dark:border-orange-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {doc.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-[10px] font-black flex items-center justify-center text-slate-600 dark:text-slate-300">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Item name / Service title"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Detailed description, project phase or milestones..."
                        value={item.description || ""}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] text-slate-600 dark:text-slate-300"
                      />
                    </div>

                    {/* Catalog Auto-fill Quick Picker */}
                    <div className="space-y-1 shrink-0">
                      <select
                        onChange={(e) => {
                          const catItem = catalogItems.find((ci) => ci.id === e.target.value);
                          if (catItem) handleSelectCatalogItem(index, catItem);
                        }}
                        defaultValue=""
                        className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-500"
                      >
                        <option value="" disabled>📦 Auto-Fill from Catalog</option>
                        {catalogItems.map((ci) => (
                          <option key={ci.id} value={ci.id}>
                            {ci.name} ({doc.currencySymbol}{ci.unitPrice})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={doc.items.length <= 1}
                        className="w-full p-1 text-[11px] text-rose-500 hover:text-rose-700 font-bold disabled:opacity-30 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Unit</label>
                      <input
                        type="text"
                        placeholder="pcs/hrs"
                        value={item.unit || "pcs"}
                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Unit Rate ({doc.currencySymbol})</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitRate}
                        onChange={(e) => handleItemChange(index, "unitRate", e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Disc %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountValue}
                        onChange={(e) => handleItemChange(index, "discountValue", e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-center"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-1 text-right self-center">
                      <span className="text-[10px] font-bold text-slate-400 block">Line Total</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                        {doc.currencySymbol}{item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: TAXES, DISCOUNTS & SHIPPING */}
          {/* ======================================================== */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-500" /> Taxes, Overall Discount & Delivery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tax Structure */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Tax Type</label>
                <select
                  value={doc.taxStructure}
                  onChange={(e) => updateDocument({ taxStructure: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="no_tax">No Tax (0%)</option>
                  <option value="vat">VAT (Single Rate)</option>
                  <option value="gst">GST (Dual CGST + SGST)</option>
                  <option value="sales_tax">Sales Tax</option>
                  <option value="custom">Custom Tax</option>
                </select>
              </div>

              {/* Tax Rate % */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Tax Rate %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={doc.taxPercent}
                  onChange={(e) => updateDocument({ taxPercent: Number(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Overall Discount */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Invoice Discount</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="0"
                    value={doc.invoiceDiscountValue}
                    onChange={(e) => updateDocument({ invoiceDiscountValue: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                  <select
                    value={doc.invoiceDiscountType}
                    onChange={(e) => updateDocument({ invoiceDiscountType: e.target.value as any })}
                    className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shrink-0"
                  >
                    <option value="percent">%</option>
                    <option value="fixed">{doc.currencySymbol}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping & Paid Amount */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Shipping & Handling ({doc.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  value={doc.shippingCharges}
                  onChange={(e) => updateDocument({ shippingCharges: Number(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Already Paid ({doc.currencySymbol})</label>
                <input
                  type="number"
                  min="0"
                  value={doc.paidAmount}
                  onChange={(e) => {
                    const paid = Number(e.target.value) || 0;
                    const newStatus = paid >= doc.grandTotal ? "paid" : paid > 0 ? "partially_paid" : "draft";
                    updateDocument({ paidAmount: paid, status: newStatus });
                  }}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: NOTES, TERMS & SIGNATURE */}
          {/* ======================================================== */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-500" /> Customer Notes & Legal Terms
            </h3>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block">Customer Note</label>
                <textarea
                  rows={2}
                  value={doc.notes}
                  onChange={(e) => updateDocument({ notes: e.target.value })}
                  placeholder="Notes shown to the client..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={doc.termsConditions}
                  onChange={(e) => updateDocument({ termsConditions: e.target.value })}
                  placeholder="Terms, cancellation, warranty policies..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE REAL-TIME PREVIEW */}
        {showLivePreview && (
          <div className="lg:col-span-6 sticky top-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6A45]" /> Real-Time Live Preview
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Updates instantly as you type</span>
              </div>
              <InvoicePreview document={doc} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
