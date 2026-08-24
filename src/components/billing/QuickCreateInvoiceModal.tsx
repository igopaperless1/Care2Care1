import React, { useState } from "react";
import {
  Zap,
  X,
  User,
  Package,
  Plus,
  Trash2,
  Percent,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import {
  InvoiceDocument,
  BusinessProfile,
  CustomerProfile,
  CatalogItem,
  InvoiceLineItem
} from "./billingTypes";
import { DEFAULT_DOCUMENT_COLUMNS, TEMPLATE_GALLERY } from "./billingTemplates";
import { useInvoiceCalculation } from "./useInvoiceCalculation";

interface QuickCreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessProfile[];
  customers: CustomerProfile[];
  catalogItems: CatalogItem[];
  onCreated: (doc: InvoiceDocument) => void;
}

export const QuickCreateInvoiceModal: React.FC<QuickCreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  businesses,
  customers,
  catalogItems,
  onCreated
}) => {
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

  // Quick State
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const [itemName, setItemName] = useState<string>("Standard Consulting & Implementation");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitRate, setUnitRate] = useState<number>(250);
  const [taxPercent, setTaxPercent] = useState<number>(10);
  const [dueDateDays, setDueDateDays] = useState<number>(15);

  // When picking existing customer
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerEmail(found.email);
      setCustomerPhone(found.phone);
    }
  };

  // Build draft line items for live calculation hook
  const rawLineItem: InvoiceLineItem = {
    id: `quick_item_1`,
    name: itemName || "Line Item",
    quantity: Math.max(1, quantity),
    unit: "hrs",
    unitRate: Math.max(0, unitRate),
    discountType: "percent",
    discountValue: 0,
    taxType: taxPercent > 0 ? "vat" : "none",
    taxPercent: Math.max(0, taxPercent),
    lineSubtotal: Math.max(1, quantity) * Math.max(0, unitRate),
    lineDiscountAmount: 0,
    lineTaxableAmount: Math.max(1, quantity) * Math.max(0, unitRate),
    lineTaxAmount: 0,
    lineTotal: 0
  };

  // Real-time calculation hook
  const calc = useInvoiceCalculation({
    items: [rawLineItem],
    taxPercent: taxPercent,
    taxStructure: taxPercent > 0 ? "vat" : "no_tax",
    paidAmount: 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCustomer: CustomerProfile = selectedCustomerId
      ? customers.find((c) => c.id === selectedCustomerId) || {
          id: `cust_${Date.now()}`,
          name: customerName || "Valued Client",
          type: "individual",
          email: customerEmail || "client@example.com",
          phone: customerPhone || "+1 555-0100",
          billingAddress: "Direct Client"
        }
      : {
          id: `cust_${Date.now()}`,
          name: customerName || "Valued Client",
          type: "individual",
          email: customerEmail || "client@example.com",
          phone: customerPhone || "+1 555-0100",
          billingAddress: "Direct Client"
        };

    const docNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + dueDateDays * 86400000).toISOString().split("T")[0];

    const newDoc: InvoiceDocument = {
      id: `doc_${Date.now()}`,
      docNumber,
      docType: "invoice",
      title: "TAX INVOICE",
      status: "draft",
      issueDate: today,
      dueDate,
      seller: defaultBusiness,
      customer: finalCustomer,
      currency: defaultBusiness.currency || "USD",
      currencySymbol: defaultBusiness.currencySymbol || "$",
      columnsConfig: DEFAULT_DOCUMENT_COLUMNS,
      items: calc.items,
      subtotal: calc.subtotal,
      itemDiscountsTotal: calc.itemDiscountsTotal,
      invoiceDiscountType: "percent",
      invoiceDiscountValue: 0,
      invoiceDiscountTotal: 0,
      taxableAmount: calc.taxableAmount,
      taxStructure: taxPercent > 0 ? "vat" : "no_tax",
      taxPercent,
      taxTotal: calc.taxTotal,
      shippingCharges: 0,
      packagingCharges: 0,
      roundOff: 0,
      grandTotal: calc.grandTotal,
      paidAmount: 0,
      balanceDue: calc.grandTotal,
      paymentMethod: "bank_transfer",
      showSignature: true,
      authorizedPersonName: defaultBusiness.ownerName,
      authorizedPersonDesignation: "Authorized Signatory",
      showStamp: false,
      isComputerGeneratedDisclaimer: true,
      notes: "Thank you for your business. We appreciate working with you!",
      termsConditions: `Payment is due within ${dueDateDays} days.`,
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
      auditLogs: [{ id: `log_q1`, action: "Quick Created", actor: defaultBusiness.ownerName, timestamp: new Date().toISOString(), details: "Created via Quick Create wizard" }],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreated(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150 select-none text-left">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-slate-900 dark:via-orange-950/20 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6A45] flex items-center justify-center text-white font-black text-base shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ⚡ Quick Create Invoice
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Essential fields only • Ready in seconds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QUICK FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
          {/* 1. CUSTOMER SECTION */}
          <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between">
              <label className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF6A45]" />
                <span>1. Customer Details</span>
              </label>
              {customers.length > 0 && (
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  className="p-1 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 font-bold"
                >
                  <option value="">-- Quick Pick Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.companyName ? `(${c.companyName})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="space-y-1 sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Customer or Company Name *"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setSelectedCustomerId("");
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Customer Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="tel"
                  placeholder="Customer Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. ITEM, QUANTITY, PRICE & TAX */}
          <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <label className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#FF6A45]" />
              <span>2. Line Item, Price & Tax</span>
            </label>

            <div className="space-y-1">
              <input
                type="text"
                required
                placeholder="Item / Service Description *"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Quantity */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Quantity</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-center text-slate-900 dark:text-white"
                />
              </div>

              {/* Price / Rate */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Price ({defaultBusiness.currencySymbol})</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={unitRate}
                  onChange={(e) => setUnitRate(Number(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-right text-slate-900 dark:text-white"
                />
              </div>

              {/* Tax % */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tax (%)</span>
                <select
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                >
                  <option value={0}>0% (No Tax)</option>
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={13}>13% (VAT)</option>
                  <option value={18}>18% (GST)</option>
                  <option value={20}>20%</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. REAL-TIME CALCULATION SUMMARY CARD */}
          <div className="p-3.5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:bg-slate-800 rounded-2xl border border-orange-200/80 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-xs">
              <span>Subtotal ({quantity} × {defaultBusiness.currencySymbol}{unitRate.toFixed(2)}):</span>
              <span className="font-mono font-bold">{defaultBusiness.currencySymbol}{calc.subtotal.toFixed(2)}</span>
            </div>
            {taxPercent > 0 && (
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-xs">
                <span>Tax ({taxPercent}%):</span>
                <span className="font-mono font-bold">+{defaultBusiness.currencySymbol}{calc.taxTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-orange-200 dark:border-slate-700 font-black text-sm text-slate-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-[#FF6A45]">
                {defaultBusiness.currencySymbol}{calc.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create & Preview</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
