import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  ArrowRight,
  X,
  FileText,
  CheckCircle2,
  HelpCircle,
  Zap
} from "lucide-react";
import { InvoiceDocument, BusinessProfile, CustomerProfile, CatalogItem } from "./billingTypes";
import { calculateInvoice } from "./InvoiceCalculationEngine";

interface SmartInvoiceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessProfile[];
  customers: CustomerProfile[];
  catalogItems: CatalogItem[];
  onGenerated: (doc: InvoiceDocument) => void;
}

export const SmartInvoiceAiModal: React.FC<SmartInvoiceAiModalProps> = ({
  isOpen,
  onClose,
  businesses,
  customers,
  catalogItems,
  onGenerated
}) => {
  const [prompt, setPrompt] = useState<string>(
    "Create an invoice for Nexus Tech Ventures for website development $1,500 plus 13% VAT tax due in 15 days"
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const examplePrompts = [
    "Bill Samantha Brooks for Senior Care Monthly Retainer $450 with 5% discount, due in 7 days",
    "Create a tax invoice for Dr. Maya Thapa for 2 Digital Medical QR Pendants at $49.99 each plus 8% tax",
    "Generate quote for ABC Traders for Legal Contract Review & Filing $250",
    "Create shop bill for 3 Habit Transformation Journals at $24.50 each"
  ];

  const handleProcessPrompt = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Smart extraction logic
      const lower = prompt.toLowerCase();
      
      // Match business
      const selectedBiz = businesses.find((b) => b.isDefault) || businesses[0];
      
      // Match customer
      let matchedCust = customers[0];
      for (const c of customers) {
        if (lower.includes(c.name.toLowerCase()) || (c.companyName && lower.includes(c.companyName.toLowerCase()))) {
          matchedCust = c;
          break;
        }
      }

      // Match amount
      const amountMatch = prompt.match(/\$?\s?(\d+([,.]\d+)?)/);
      const extractedAmount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 250;

      // Match tax
      let taxRate = 0;
      if (lower.includes("vat") || lower.includes("tax") || lower.includes("gst")) {
        const taxMatch = prompt.match(/(\d+)%\s*(vat|tax|gst)/i);
        taxRate = taxMatch ? parseFloat(taxMatch[1]) : 13;
      }

      // Match discount
      let discountVal = 0;
      if (lower.includes("discount")) {
        const discMatch = prompt.match(/(\d+)%\s*discount/i);
        discountVal = discMatch ? parseFloat(discMatch[1]) : 0;
      }

      // Match item from catalog or fallback
      let itemName = "Professional Consultation & Services";
      for (const ci of catalogItems) {
        if (lower.includes(ci.name.toLowerCase().slice(0, 8))) {
          itemName = ci.name;
          break;
        }
      }

      const rawDoc: Partial<InvoiceDocument> = {
        id: `smart_doc_${Date.now()}`,
        docNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
        docType: lower.includes("quote") ? "quotation" : lower.includes("bill") ? "bill" : "invoice",
        title: lower.includes("quote") ? "PRICE QUOTATION" : "TAX INVOICE",
        status: "draft",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
        seller: selectedBiz,
        customer: matchedCust,
        currency: selectedBiz.currency,
        currencySymbol: selectedBiz.currencySymbol,
        columnsConfig: [
          { key: "item", label: "Item & Description", enabled: true, width: "45%", align: "left" },
          { key: "quantity", label: "Qty", enabled: true, width: "10%", align: "center" },
          { key: "unitRate", label: "Rate", enabled: true, width: "15%", align: "right" },
          { key: "discount", label: "Disc", enabled: true, width: "10%", align: "right" },
          { key: "amount", label: "Amount", enabled: true, width: "20%", align: "right" }
        ],
        items: [
          {
            id: `item_smart_${Date.now()}`,
            name: itemName,
            description: prompt,
            quantity: 1,
            unit: "Unit",
            unitRate: extractedAmount,
            discountType: "percent",
            discountValue: discountVal,
            taxType: taxRate > 0 ? "vat" : "none",
            taxPercent: taxRate,
            lineSubtotal: extractedAmount,
            lineDiscountAmount: (extractedAmount * discountVal) / 100,
            lineTaxableAmount: extractedAmount - (extractedAmount * discountVal) / 100,
            lineTaxAmount: ((extractedAmount - (extractedAmount * discountVal) / 100) * taxRate) / 100,
            lineTotal: extractedAmount * (1 + taxRate / 100)
          }
        ],
        taxStructure: taxRate > 0 ? "vat" : "no_tax",
        taxPercent: taxRate,
        notes: `Smart generated from request: "${prompt}"`,
        termsConditions: selectedBiz.defaultTerms || "Payment is due within 15 days of invoice date.",
        showSignature: true,
        authorizedPersonName: selectedBiz.ownerName,
        authorizedPersonDesignation: "Authorized Signatory",
        showStamp: false,
        isComputerGeneratedDisclaimer: true,
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
        auditLogs: [{ id: `log_ai`, action: "Generated via Smart AI", actor: selectedBiz.ownerName, timestamp: new Date().toISOString(), details: prompt }],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const calculated = calculateInvoice(rawDoc);
      const finalDoc = { ...rawDoc, ...calculated } as InvoiceDocument;

      setIsProcessing(false);
      onGenerated(finalDoc);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 select-none text-left">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-slate-900 dark:via-orange-950/20 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A45] to-[#FB923C] flex items-center justify-center text-white font-black text-lg shadow-md">
              🪄
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>“Create for Me” Smart Invoicing</span>
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-[#FF6A45] px-2 py-0.5 rounded-full font-black uppercase">
                  AI Prompt
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Describe who you are billing, the items, price, and tax in plain language.
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

        {/* MODAL BODY */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Your Prompt</span>
              <span className="text-[11px] text-slate-400 font-medium">English / Nepali / Any format</span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create an invoice for ABC Traders for website development $1,500 plus 13% VAT tax due in 15 days"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-[#FF6A45]"
            />
          </div>

          {/* Quick Examples */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase text-slate-400">Try these prompt examples:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {examplePrompts.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-[11px] text-slate-600 dark:text-slate-300 font-medium transition-colors border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-[#FF6A45] shrink-0" />
                  <span className="truncate">{ex}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProcessPrompt}
            disabled={!prompt.trim() || isProcessing}
            className="px-5 py-2.5 bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isProcessing ? (
              <span>Generating Document...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Professional Document</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
