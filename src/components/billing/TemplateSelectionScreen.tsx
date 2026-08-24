import React, { useState } from "react";
import {
  LayoutTemplate,
  Check,
  Eye,
  Edit3,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Smartphone,
  CheckCircle2,
  Printer,
  FileText,
  Star,
  ChevronRight
} from "lucide-react";
import { TemplatePreset, TEMPLATE_GALLERY } from "./billingTemplates";
import { InvoiceDocument, BusinessProfile, CustomerProfile } from "./billingTypes";
import { InvoicePreview } from "./InvoicePreview";

interface TemplateSelectionScreenProps {
  onSelectTemplate: (template: TemplatePreset) => void;
  onPreviewTemplate?: (template: TemplatePreset) => void;
  currentTemplateId?: string;
  defaultBusiness?: BusinessProfile;
  defaultCustomer?: CustomerProfile;
}

export const TemplateSelectionScreen: React.FC<TemplateSelectionScreenProps> = ({
  onSelectTemplate,
  onPreviewTemplate,
  currentTemplateId = "std_business_invoice",
  defaultBusiness,
  defaultCustomer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreset>(() => {
    return TEMPLATE_GALLERY.find((t) => t.id === currentTemplateId) || TEMPLATE_GALLERY[0];
  });
  const [previewZoom, setPreviewZoom] = useState<number>(100);

  const categories = ["All", "Business", "Retail", "Services", "Education", "Healthcare", "Property"];

  const filteredTemplates = TEMPLATE_GALLERY.filter((t) => {
    if (selectedCategory === "All") return true;
    return t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Construct a dummy document to preview the template in real-time
  const mockPreviewDoc: InvoiceDocument = {
    id: `preview_${previewTemplate.id}`,
    docNumber: `INV-2026-0089`,
    docType: previewTemplate.docType,
    title: previewTemplate.name.toUpperCase(),
    status: "sent",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    seller: defaultBusiness || {
      id: "demo_biz",
      name: "Acme Enterprises Inc.",
      ownerName: "Sarah Jenkins",
      businessType: "Technology & Professional Services",
      taxId: "US-TAX-884920",
      phone: "+1 (555) 234-5678",
      email: "billing@acme-corp.com",
      address: "742 Evergreen Terrace",
      city: "San Francisco",
      country: "United States",
      bankName: "First National Commerce",
      accountName: "Acme Enterprises Inc.",
      accountNumber: "987654321098",
      swiftCode: "FNCBUSA66XX",
      upiId: "acme@upi",
      currency: "USD",
      currencySymbol: "$"
    },
    customer: defaultCustomer || {
      id: "demo_cust",
      name: "Global Tech Solutions Ltd",
      companyName: "Global Tech Group",
      type: "business",
      email: "accounts@globaltech.io",
      phone: "+1 (555) 987-6543",
      billingAddress: "100 Innovation Parkway, Suite 400, Austin, TX",
      taxId: "TX-9988231"
    },
    items: [
      {
        id: "p_it_1",
        name: "Enterprise Cloud Architecture & Development",
        description: "Full-stack system engineering, microservices setup and deployment",
        quantity: 1,
        unit: "Milestone",
        unitRate: 1800,
        discountType: "percent",
        discountValue: 5,
        taxType: "vat",
        taxPercent: 10,
        lineSubtotal: 1800,
        lineDiscountAmount: 90,
        lineTaxableAmount: 1710,
        lineTaxAmount: 171,
        lineTotal: 1881
      },
      {
        id: "p_it_2",
        name: "Mobile Responsive UI & Security Hardening",
        description: "Adaptive viewport layout, cryptographic signatures and SSL",
        quantity: 2,
        unit: "Sprints",
        unitRate: 450,
        discountType: "percent",
        discountValue: 0,
        taxType: "vat",
        taxPercent: 10,
        lineSubtotal: 900,
        lineDiscountAmount: 0,
        lineTaxableAmount: 900,
        lineTaxAmount: 90,
        lineTotal: 990
      }
    ],
    columnsConfig: previewTemplate.columns,
    currency: "USD",
    currencySymbol: "$",
    subtotal: 2700,
    itemDiscountsTotal: 90,
    invoiceDiscountType: "percent",
    invoiceDiscountValue: 0,
    invoiceDiscountTotal: 0,
    taxableAmount: 2610,
    taxStructure: "vat",
    taxPercent: 10,
    taxTotal: 261,
    shippingCharges: 0,
    packagingCharges: 0,
    roundOff: 0,
    grandTotal: 2871,
    paidAmount: 1000,
    balanceDue: 1871,
    paymentMethod: "bank_transfer",
    showSignature: true,
    authorizedPersonName: "Sarah Jenkins",
    authorizedPersonDesignation: "Managing Director",
    showStamp: true,
    isComputerGeneratedDisclaimer: true,
    notes: previewTemplate.defaultNotes,
    termsConditions: previewTemplate.defaultTerms,
    customFields: [{ id: "cf1", label: "PO Number", value: "PO-88741", type: "text" }],
    templateId: previewTemplate.id,
    pageSize: previewTemplate.pageSize,
    orientation: previewTemplate.orientation,
    spacing: "standard",
    themeColor: previewTemplate.themeColor,
    fontFamily: "Inter",
    showGridlines: false,
    borderStyle: "light",
    payments: [],
    auditLogs: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="w-full space-y-6 select-none text-left animate-in fade-in duration-200">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#C2410C] dark:text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-200/70">
              Template Gallery
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {TEMPLATE_GALLERY.length} Ready-to-Use Formats
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Choose Your Invoice & Billing Format
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Select a tailored layout category. Click any thumbnail to see it auto-scale in real-time in the live PDF preview pane.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectTemplate(previewTemplate)}
          className="px-4 py-2.5 bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center active:scale-95"
        >
          <Edit3 className="w-4 h-4" />
          <span>Use "{previewTemplate.name}"</span>
        </button>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            {cat === "All" && "📂 "}
            {cat === "Business" && "💼 "}
            {cat === "Retail" && "🛍️ "}
            {cat === "Services" && "💻 "}
            {cat === "Education" && "🎓 "}
            {cat === "Healthcare" && "🩺 "}
            {cat === "Property" && "🏠 "}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* TWO-COLUMN GRID: TEMPLATE CARDS (LEFT) + REAL-TIME PDF PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* TEMPLATE CARDS LIST (COL-SPAN 5 OR 6) */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredTemplates.map((template) => {
            const isSelected = previewTemplate.id === template.id;

            return (
              <div
                key={template.id}
                onClick={() => setPreviewTemplate(template)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col gap-3 group relative ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 border-[#FF6A45] ring-2 ring-[#FF6A45]/30 shadow-md"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                {/* Visual Header Banner */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: template.themeColor }}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0"
                    >
                      {template.category.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white">
                          {template.name}
                        </h3>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#FF6A45] animate-ping" />
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {template.category} • {template.pageSize.toUpperCase()} ({template.orientation})
                      </span>
                    </div>
                  </div>

                  <span
                    style={{ color: template.themeColor }}
                    className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-current"
                  >
                    {template.docType.replace("_", " ")}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {template.description}
                </p>

                {/* Column structure tags */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500">
                  <span className="font-bold text-slate-400">Columns:</span>
                  {template.columns.slice(0, 4).map((col) => (
                    <span
                      key={col.key}
                      className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-mono"
                    >
                      {col.label}
                    </span>
                  ))}
                  {template.columns.length > 4 && <span>+{template.columns.length - 4} more</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#FF6A45]" />
                    <span>Click to preview live</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FF6A45] hover:bg-[#EA580C] text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>Use Template</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* REAL-TIME PDF PREVIEW PANE WITH MOBILE AUTO-SCALE & ZOOM (COL-SPAN 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: previewTemplate.themeColor }}
                className="w-3.5 h-3.5 rounded-full"
              />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Live PDF Preview: {previewTemplate.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onSelectTemplate(previewTemplate)}
              className="px-3 py-1 bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black rounded-xl transition-all cursor-pointer"
            >
              Start With This →
            </button>
          </div>

          {/* REAL-TIME INVOICE PREVIEW ENGINE WITH AUTO-SCALE & ZOOM CONTROLS */}
          <div className="w-full">
            <InvoicePreview
              document={mockPreviewDoc}
              zoom={previewZoom}
              onZoomChange={(newZ) => setPreviewZoom(newZ)}
              showToolbar={true}
              onShare={() => alert("Preview link copied!")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
