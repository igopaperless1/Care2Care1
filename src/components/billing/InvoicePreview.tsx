import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Printer,
  Share2,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building,
  User,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Smartphone,
  LayoutTemplate,
  Layers,
  FileSpreadsheet,
  Check,
  CreditCard
} from "lucide-react";
import { InvoiceDocument } from "./billingTypes";
import { VisualStatusTracker } from "./VisualStatusTracker";

interface InvoicePreviewProps {
  document: InvoiceDocument;
  zoom?: number;
  onZoomChange?: (newZoom: number) => void;
  onPrint?: () => void;
  onDownloadPdf?: () => void;
  onShare?: () => void;
  onRecordPayment?: () => void;
  onMarkAsSent?: () => void;
  showToolbar?: boolean;
  showStatusTracker?: boolean;
}

export type PreviewViewMode = "fit" | "flow" | "sheet";

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  document: doc,
  zoom = 100,
  onZoomChange,
  onPrint,
  onDownloadPdf,
  onShare,
  onRecordPayment,
  onMarkAsSent,
  showToolbar = true,
  showStatusTracker = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [sheetHeight, setSheetHeight] = useState<number>(1100);
  
  // Default to "fit" on mobile devices, or let user switch
  const [viewMode, setViewMode] = useState<PreviewViewMode>("fit");

  const isReceipt = doc.pageSize === "receipt";
  const baseDocWidth = isReceipt ? 340 : doc.orientation === "landscape" ? 1050 : 780;

  // Measure container width and sheet height dynamically
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
      if (printRef.current) {
        setSheetHeight(printRef.current.scrollHeight);
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    if (containerRef.current) ro.observe(containerRef.current);
    if (printRef.current) ro.observe(printRef.current);
    window.addEventListener("resize", updateDimensions);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [doc, viewMode]);

  // Compute scale
  // Available width subtracts container padding (approx 16-24px)
  const availableWidth = Math.max(280, containerWidth - 20);
  const autoFitScale = Math.min(1, availableWidth / baseDocWidth);
  
  // Final scale factor
  const effectiveScale =
    viewMode === "fit"
      ? (zoom / 100) * autoFitScale
      : viewMode === "sheet"
      ? zoom / 100
      : 1;

  const handleNativePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase border border-emerald-300">
            PAID ✓
          </span>
        );
      case "partially_paid":
        return (
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase border border-amber-300">
            PARTIAL ({doc.currencySymbol}{doc.paidAmount})
          </span>
        );
      case "overdue":
        return (
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase border border-rose-300">
            OVERDUE
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase border border-slate-300">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase border border-sky-300">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none text-left">
      {/* TOOLBAR */}
      {showToolbar && (
        <div className="w-full max-w-4xl mb-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 sm:p-2.5 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <FileText className="w-4 h-4 text-[#FF6A45] shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[180px] text-xs font-bold text-slate-200 font-mono">
                {doc.docNumber || "Draft Document"}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/10 text-orange-300 shrink-0">
              {doc.pageSize.toUpperCase()} • {doc.orientation}
            </span>

            {/* View Mode Switcher Pills */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/60 ml-auto sm:ml-2">
              <button
                type="button"
                onClick={() => setViewMode("fit")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "fit"
                    ? "bg-[#FF6A45] text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Fit full page to mobile screen"
              >
                <Smartphone className="w-3 h-3" />
                <span>Fit Screen</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("flow")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "flow"
                    ? "bg-[#FF6A45] text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
                title="Mobile responsive card flow"
              >
                <LayoutTemplate className="w-3 h-3" />
                <span>Mobile View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("sheet")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "sheet"
                    ? "bg-[#FF6A45] text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
                title="100% original printable sheet"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>A4 Sheet</span>
              </button>
            </div>
          </div>

          {/* Actions & Zoom */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
            {onZoomChange && viewMode !== "flow" && (
              <div className="flex items-center gap-1 bg-slate-800 rounded-xl px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => onZoomChange(Math.max(40, zoom - 15))}
                  className="p-1 hover:text-orange-400 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono font-bold w-9 text-center">
                  {viewMode === "fit" ? `${Math.round(effectiveScale * 100)}%` : `${zoom}%`}
                </span>
                <button
                  type="button"
                  onClick={() => onZoomChange(Math.min(150, zoom + 15))}
                  className="p-1 hover:text-orange-400 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 ml-auto sm:ml-0">
              <button
                type="button"
                onClick={handleNativePrint}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-slate-200"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Print</span>
              </button>

              {onDownloadPdf && (
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-slate-200"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}

              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  className="px-3 py-1.5 rounded-xl bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                  title="Share Document"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISUAL STATUS TRACKER */}
      {showStatusTracker && (
        <div className="w-full max-w-4xl mb-3">
          <VisualStatusTracker
            document={doc}
            onRecordPayment={onRecordPayment}
            onMarkAsSent={onMarkAsSent}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MOBILE RESPONSIVE CARD FLOW VIEW (100% FLUID MOBILE) */}
      {/* ======================================================== */}
      {viewMode === "flow" ? (
        <div className="w-full max-w-4xl space-y-4 text-slate-900 dark:text-white">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: doc.themeColor }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xs shrink-0"
                >
                  {doc.seller.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight">{doc.seller.name}</h2>
                  <p className="text-xs text-slate-500">{doc.seller.businessType || "Company"}</p>
                </div>
              </div>
              <div className="text-right">
                <h3 style={{ color: doc.themeColor }} className="text-lg font-black uppercase">
                  {doc.title || "TAX INVOICE"}
                </h3>
                <div className="mt-1">{getStatusBadge(doc.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">Document Number</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">{doc.docNumber}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">Issue Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.issueDate}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">Payment Due</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{doc.dueDate}</span>
              </div>
              {doc.poNumber && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold block">PO Reference</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{doc.poNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                From (Seller / Issuer)
              </span>
              <p className="font-black text-slate-900 dark:text-white text-sm">{doc.seller.name}</p>
              <p className="text-slate-600 dark:text-slate-300">{doc.seller.address}, {doc.seller.city}, {doc.seller.country}</p>
              <p className="text-slate-500">Phone: {doc.seller.phone} • Email: {doc.seller.email}</p>
              {doc.seller.taxId && (
                <p className="font-bold text-slate-700 dark:text-slate-300 pt-0.5">
                  Tax ID: <span className="font-mono">{doc.seller.taxId}</span>
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Billed To (Customer)
              </span>
              <p className="font-black text-slate-900 dark:text-white text-sm">{doc.customer.name}</p>
              {doc.customer.companyName && <p className="font-bold text-slate-700 dark:text-slate-300">{doc.customer.companyName}</p>}
              <p className="text-slate-600 dark:text-slate-300">{doc.customer.billingAddress}</p>
              <p className="text-slate-500">Email: {doc.customer.email} • Tel: {doc.customer.phone}</p>
              {doc.customer.taxId && (
                <p className="font-bold text-slate-700 dark:text-slate-300 pt-0.5">
                  Tax ID: <span className="font-mono">{doc.customer.taxId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Line Items List */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Line Items ({doc.items.length})
              </h4>
              <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300">
                Subtotal: {doc.currencySymbol}{doc.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              {doc.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white">{item.name}</p>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono flex-wrap">
                      <span>Qty: <strong className="text-slate-700 dark:text-slate-200">{item.quantity} {item.unit || "pcs"}</strong></span>
                      <span>•</span>
                      <span>Rate: {doc.currencySymbol}{item.unitRate.toFixed(2)}</span>
                      {item.discountValue > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600">Disc: {item.discountValue}{item.discountType === "percent" ? "%" : doc.currencySymbol}</span>
                        </>
                      )}
                      {item.taxPercent > 0 && (
                        <>
                          <span>•</span>
                          <span>Tax: {item.taxPercent}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      {doc.currencySymbol}{item.lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Summary & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Payment & Bank Details */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment & Wire Instructions
              </span>
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl text-[11px]">
                <p><span className="text-slate-400">Bank:</span> <strong className="text-slate-800 dark:text-slate-200">{doc.seller.bankName || "First National Commerce"}</strong></p>
                <p><span className="text-slate-400">A/C Name:</span> <strong className="text-slate-800 dark:text-slate-200">{doc.seller.accountName || doc.seller.name}</strong></p>
                <p><span className="text-slate-400">A/C Number:</span> <strong className="font-mono text-slate-900 dark:text-white">{doc.seller.accountNumber || "987654321098"}</strong></p>
                {doc.seller.swiftCode && (
                  <p><span className="text-slate-400">SWIFT / IFSC:</span> <strong className="font-mono text-slate-700 dark:text-slate-300">{doc.seller.swiftCode}</strong></p>
                )}
                {doc.seller.upiId && (
                  <p className="pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">UPI / QR ID:</span> <strong className="font-mono text-[#FF6A45]">{doc.seller.upiId}</strong>
                  </p>
                )}
              </div>

              {/* Instant QR Payment */}
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <div className="p-1 bg-white rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div className="text-[11px]">
                  <p className="font-black text-slate-900 dark:text-white">Scan with Mobile App</p>
                  <p className="text-slate-500">Scan to pay instantly via UPI or mobile banking.</p>
                </div>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Total Balance Breakdown
              </span>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{doc.currencySymbol}{doc.subtotal.toFixed(2)}</span>
                </div>
                {doc.itemDiscountsTotal + doc.invoiceDiscountTotal > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Total Discount:</span>
                    <span className="font-mono">-{doc.currencySymbol}{(doc.itemDiscountsTotal + doc.invoiceDiscountTotal).toFixed(2)}</span>
                  </div>
                )}
                {doc.taxTotal > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{doc.taxStructure.toUpperCase()} ({doc.taxPercent}%):</span>
                    <span className="font-mono">{doc.currencySymbol}{doc.taxTotal.toFixed(2)}</span>
                  </div>
                )}
                {doc.shippingCharges > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping:</span>
                    <span className="font-mono">{doc.currencySymbol}{doc.shippingCharges.toFixed(2)}</span>
                  </div>
                )}

                <div
                  style={{ borderTopColor: doc.themeColor }}
                  className="flex justify-between text-base font-black text-slate-900 dark:text-white border-t-2 pt-2"
                >
                  <span>Grand Total:</span>
                  <span className="font-mono" style={{ color: doc.themeColor }}>
                    {doc.currencySymbol}{doc.grandTotal.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 font-bold">
                    <span>Paid to Date:</span>
                    <span className="font-mono text-emerald-600">{doc.currencySymbol}{doc.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm">
                    <span>Balance Due:</span>
                    <span className={`font-mono ${doc.balanceDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"}`}>
                      {doc.currencySymbol}{doc.balanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(doc.notes || doc.termsConditions) && (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2">
              {doc.notes && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-slate-400">Notes</span>
                  <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    "{doc.notes}"
                  </p>
                </div>
              )}
              {doc.termsConditions && (
                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">Terms & Conditions</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    {doc.termsConditions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* 2. AUTO-FIT & PRINTABLE A4/LETTER SHEET VIEW */
        /* ======================================================== */
        <div
          ref={containerRef}
          className={`w-full ${
            viewMode === "sheet" ? "overflow-x-auto" : "overflow-hidden"
          } p-1 sm:p-4 flex justify-center bg-slate-100 dark:bg-slate-950/60 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[360px]`}
        >
          {/* SCALED WRAPPER: Matches exact scaled geometry to prevent empty gaps and horizontal clipping */}
          <div
            style={{
              width: `${baseDocWidth * effectiveScale}px`,
              height: sheetHeight ? `${sheetHeight * effectiveScale}px` : "auto",
              minHeight: `${800 * effectiveScale}px`,
            }}
            className="relative mx-auto transition-all duration-150 origin-top"
          >
            <div
              ref={printRef}
              style={{
                width: `${baseDocWidth}px`,
                transform: `scale(${effectiveScale})`,
                transformOrigin: "top left"
              }}
              className={`bg-white text-slate-900 shadow-2xl transition-transform duration-150 p-6 sm:p-8 rounded-xl font-sans absolute top-0 left-0 border border-slate-300/80 ${
                isReceipt ? "text-[12px] leading-tight font-mono" : "min-h-[1050px]"
              }`}
            >
              {/* WATERMARK STAMP FOR OVERDUE OR CANCELLED */}
              {doc.status === "paid" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 rotate-[-25deg] text-8xl font-black text-emerald-600 border-8 border-emerald-600 px-8 py-4 rounded-3xl">
                  PAID
                </div>
              )}

              {/* ======================================================== */}
              {/* THERMAL RECEIPT LAYOUT */}
              {/* ======================================================== */}
              {isReceipt ? (
                <div className="space-y-3 text-center">
                  <div className="border-b-2 border-dashed border-slate-400 pb-3 space-y-1">
                    <h2 className="text-base font-black uppercase tracking-wider">{doc.seller.name}</h2>
                    <p className="text-[11px] text-slate-600">{doc.seller.address}</p>
                    <p className="text-[11px] text-slate-600">Tel: {doc.seller.phone}</p>
                    {doc.seller.taxId && <p className="text-[10px] font-bold">Tax ID: {doc.seller.taxId}</p>}
                  </div>

                  <div className="text-left text-[11px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Doc #:</span>
                      <span>{doc.docNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Date:</span>
                      <span>{doc.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Customer:</span>
                      <span>{doc.customer.name}</span>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full text-[11px] text-left border-b-2 border-dashed border-slate-400 pb-2">
                    <thead>
                      <tr className="border-b border-slate-400">
                        <th className="py-1">Item</th>
                        <th className="py-1 text-center">Qty</th>
                        <th className="py-1 text-right">Price</th>
                        <th className="py-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {doc.items.map((it, idx) => (
                        <tr key={it.id || idx}>
                          <td className="py-1 pr-1 font-medium">{it.name}</td>
                          <td className="py-1 text-center">{it.quantity}</td>
                          <td className="py-1 text-right">{doc.currencySymbol}{it.unitRate}</td>
                          <td className="py-1 text-right font-bold">{doc.currencySymbol}{it.lineTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary */}
                  <div className="space-y-1 text-[11px] text-right font-medium pt-1 border-b-2 border-dashed border-slate-400 pb-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{doc.currencySymbol}{doc.subtotal.toFixed(2)}</span>
                    </div>
                    {doc.itemDiscountsTotal + doc.invoiceDiscountTotal > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Total Discount:</span>
                        <span>-{doc.currencySymbol}{(doc.itemDiscountsTotal + doc.invoiceDiscountTotal).toFixed(2)}</span>
                      </div>
                    )}
                    {doc.taxTotal > 0 && (
                      <div className="flex justify-between">
                        <span>Tax ({doc.taxPercent}%):</span>
                        <span>{doc.currencySymbol}{doc.taxTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black pt-1 border-t border-slate-400 text-slate-900">
                      <span>GRAND TOTAL:</span>
                      <span>{doc.currencySymbol}{doc.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-0.5">
                      <span>Paid Amount:</span>
                      <span>{doc.currencySymbol}{doc.paidAmount.toFixed(2)}</span>
                    </div>
                    {doc.balanceDue > 0 && (
                      <div className="flex justify-between text-xs font-black text-rose-600">
                        <span>Balance Due:</span>
                        <span>{doc.currencySymbol}{doc.balanceDue.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Barcode/QR and Footer */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-center">
                      <div className="p-2 border border-slate-400 rounded-lg inline-block">
                        <QrCode className="w-16 h-16 text-slate-800 mx-auto" />
                        <span className="text-[9px] block text-center mt-0.5 font-bold">SCAN TO PAY</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold">{doc.notes || "Thank you for visiting!"}</p>
                    <p className="text-[9px] text-slate-500">Paperless POS & Billing System</p>
                  </div>
                </div>
              ) : (
                /* ======================================================== */
                /* STANDARD A4 / LETTER / A5 PROFESSIONAL INVOICE LAYOUT */
                /* ======================================================== */
                <div className="space-y-6">
                  {/* TOP HEADER & BRANDING */}
                  <div className="flex items-start justify-between gap-4 border-b pb-6 border-slate-200">
                    <div className="space-y-2 max-w-[55%]">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: doc.themeColor }}
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shrink-0"
                        >
                          {doc.seller.name.charAt(0)}
                        </div>
                        <div>
                          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                            {doc.seller.name}
                          </h1>
                          <p className="text-xs font-bold text-slate-500">{doc.seller.businessType}</p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                        <p className="font-medium">{doc.seller.address}, {doc.seller.city}, {doc.seller.country}</p>
                        <p className="font-medium">Phone: {doc.seller.phone} • Email: {doc.seller.email}</p>
                        {doc.seller.taxId && (
                          <p className="font-bold text-slate-800">
                            Tax ID / GST / VAT: <span className="font-mono">{doc.seller.taxId}</span>
                          </p>
                        )}
                        {doc.seller.regNumber && (
                          <p className="text-[11px] text-slate-500">Company Reg: {doc.seller.regNumber}</p>
                        )}
                      </div>
                    </div>

                    {/* Right: Document Title & Metadata */}
                    <div className="text-right space-y-2 shrink-0">
                      <div className="space-y-1">
                        <h2
                          style={{ color: doc.themeColor }}
                          className="text-2xl sm:text-3xl font-black uppercase tracking-wider"
                        >
                          {doc.title || "TAX INVOICE"}
                        </h2>
                        <div>{getStatusBadge(doc.status)}</div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1 text-left min-w-[200px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Doc Number:</span>
                          <span className="font-mono font-black text-slate-900">{doc.docNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Date Issued:</span>
                          <span className="font-bold text-slate-800">{doc.issueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Payment Due:</span>
                          <span className="font-black text-rose-600">{doc.dueDate}</span>
                        </div>
                        {doc.poNumber && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">PO Ref:</span>
                            <span className="font-bold text-slate-800">{doc.poNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BILLED TO / SHIP TO SECTION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Billed To (Client / Customer)
                      </span>
                      <h3 className="text-sm font-black text-slate-900">{doc.customer.name}</h3>
                      {doc.customer.companyName && (
                        <p className="font-bold text-slate-700">{doc.customer.companyName}</p>
                      )}
                      <p className="text-slate-600 leading-relaxed">{doc.customer.billingAddress}</p>
                      <p className="text-slate-600 font-medium">Email: {doc.customer.email} • Tel: {doc.customer.phone}</p>
                      {doc.customer.taxId && (
                        <p className="font-bold text-slate-800">Tax ID: <span className="font-mono">{doc.customer.taxId}</span></p>
                      )}
                    </div>

                    {doc.customer.shippingAddress && (
                      <div className="space-y-1 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Shipped / Delivery Address
                        </span>
                        <p className="text-slate-600 leading-relaxed">{doc.customer.shippingAddress}</p>
                        {doc.deliveryDate && (
                          <p className="text-slate-700 font-bold pt-1">Expected Delivery: {doc.deliveryDate}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CUSTOM FIELDS */}
                  {doc.customFields && doc.customFields.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      {doc.customFields.map((cf) => (
                        <div key={cf.id} className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{cf.label}</span>
                          <p className="font-black text-slate-800">{cf.value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* LINE ITEMS TABLE */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-xs text-left">
                      <thead style={{ backgroundColor: `${doc.themeColor}15` }}>
                        <tr className="border-b border-slate-200 font-black text-slate-800">
                          <th className="py-2.5 px-3 w-8 text-center">#</th>
                          <th className="py-2.5 px-3">Item & Description</th>
                          {doc.columnsConfig.find((c) => c.key === "hsnSac" && c.enabled) && (
                            <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                          )}
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-center">Unit</th>
                          <th className="py-2.5 px-3 text-right">Rate</th>
                          {doc.columnsConfig.find((c) => c.key === "discount" && c.enabled) && (
                            <th className="py-2.5 px-3 text-right">Disc</th>
                          )}
                          {doc.columnsConfig.find((c) => c.key === "tax" && c.enabled) && (
                            <th className="py-2.5 px-3 text-right">Tax %</th>
                          )}
                          <th className="py-2.5 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {doc.items.map((item, index) => (
                          <tr key={item.id || index} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3 text-center text-slate-400 font-mono font-bold">{index + 1}</td>
                            <td className="py-3 px-3">
                              <p className="font-black text-slate-900">{item.name}</p>
                              {item.description && (
                                <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
                              )}
                              {item.sku && <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>}
                            </td>
                            {doc.columnsConfig.find((c) => c.key === "hsnSac" && c.enabled) && (
                              <td className="py-3 px-3 text-center font-mono text-slate-600">{item.hsnSac || "—"}</td>
                            )}
                            <td className="py-3 px-3 text-center font-black">{item.quantity}</td>
                            <td className="py-3 px-3 text-center text-slate-500">{item.unit || "pcs"}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold">
                              {doc.currencySymbol}{item.unitRate.toFixed(2)}
                            </td>
                            {doc.columnsConfig.find((c) => c.key === "discount" && c.enabled) && (
                              <td className="py-3 px-3 text-right font-mono text-emerald-600">
                                {item.discountValue > 0 ? `${item.discountValue}${item.discountType === "percent" ? "%" : doc.currencySymbol}` : "—"}
                              </td>
                            )}
                            {doc.columnsConfig.find((c) => c.key === "tax" && c.enabled) && (
                              <td className="py-3 px-3 text-right font-mono text-slate-600">
                                {item.taxPercent > 0 ? `${item.taxPercent}%` : "0%"}
                              </td>
                            )}
                            <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                              {doc.currencySymbol}{item.lineTotal.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* FINANCIAL TOTALS & PAYMENT INSTRUCTIONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
                    {/* Left Side: Payment Details, Bank, UPI QR */}
                    <div className="sm:col-span-7 space-y-4">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment Information & Wire Details
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-slate-700">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">Bank Name:</span>
                            <p className="font-black text-slate-800">{doc.seller.bankName || "First National Commerce"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">Account Name:</span>
                            <p className="font-black text-slate-800">{doc.seller.accountName || doc.seller.name}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">Account Number:</span>
                            <p className="font-mono font-black text-slate-900">{doc.seller.accountNumber || "987654321098"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">SWIFT / IFSC / Routing:</span>
                            <p className="font-mono font-bold text-slate-700">{doc.seller.swiftCode || "FNCBUSA66XX"}</p>
                          </div>
                        </div>

                        {doc.seller.upiId && (
                          <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
                            <span className="font-bold text-slate-600">UPI / Digital Wallet:</span>
                            <span className="font-mono font-black text-[#FF6A45]">{doc.seller.upiId}</span>
                          </div>
                        )}
                      </div>

                      {/* QR Code */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200">
                        <div className="p-1.5 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                          <QrCode className="w-14 h-14 text-slate-800" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <p className="font-black text-slate-900">Instant QR Payment</p>
                          <p className="text-[11px] text-slate-500">Scan with any mobile banking, UPI or wallet app to settle this bill instantly.</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Totals Calculation Breakdown */}
                    <div className="sm:col-span-5 space-y-2 text-xs">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex justify-between text-slate-600">
                          <span className="font-bold">Subtotal:</span>
                          <span className="font-mono font-bold text-slate-900">{doc.currencySymbol}{doc.subtotal.toFixed(2)}</span>
                        </div>

                        {doc.itemDiscountsTotal > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Item Discounts:</span>
                            <span className="font-mono">-{doc.currencySymbol}{doc.itemDiscountsTotal.toFixed(2)}</span>
                          </div>
                        )}

                        {doc.invoiceDiscountTotal > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Invoice Discount ({doc.invoiceDiscountValue}{doc.invoiceDiscountType === "percent" ? "%" : ""}):</span>
                            <span className="font-mono">-{doc.currencySymbol}{doc.invoiceDiscountTotal.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-slate-700 font-bold border-t border-slate-200 pt-1.5">
                          <span>Taxable Amount:</span>
                          <span className="font-mono">{doc.currencySymbol}{doc.taxableAmount.toFixed(2)}</span>
                        </div>

                        {doc.taxStructure === "gst" ? (
                          <>
                            <div className="flex justify-between text-slate-600">
                              <span>CGST ({(doc.taxPercent / 2).toFixed(1)}%):</span>
                              <span className="font-mono">{doc.currencySymbol}{(doc.cgstAmount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>SGST ({(doc.taxPercent / 2).toFixed(1)}%):</span>
                              <span className="font-mono">{doc.currencySymbol}{(doc.sgstAmount || 0).toFixed(2)}</span>
                            </div>
                          </>
                        ) : doc.taxTotal > 0 ? (
                          <div className="flex justify-between text-slate-600">
                            <span>{doc.taxStructure.toUpperCase()} ({doc.taxPercent}%):</span>
                            <span className="font-mono">{doc.currencySymbol}{doc.taxTotal.toFixed(2)}</span>
                          </div>
                        ) : null}

                        {doc.shippingCharges > 0 && (
                          <div className="flex justify-between text-slate-600">
                            <span>Shipping & Delivery:</span>
                            <span className="font-mono">{doc.currencySymbol}{doc.shippingCharges.toFixed(2)}</span>
                          </div>
                        )}

                        {doc.roundOff !== 0 && (
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Round Off:</span>
                            <span className="font-mono">{doc.roundOff > 0 ? `+${doc.roundOff}` : doc.roundOff}</span>
                          </div>
                        )}

                        {/* GRAND TOTAL */}
                        <div
                          style={{ borderTopColor: doc.themeColor }}
                          className="flex justify-between text-base font-black text-slate-900 border-t-2 pt-2"
                        >
                          <span>Grand Total:</span>
                          <span className="font-mono" style={{ color: doc.themeColor }}>
                            {doc.currencySymbol}{doc.grandTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* PAID & BALANCE */}
                        <div className="pt-2 border-t border-slate-200 space-y-1">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>Amount Paid:</span>
                            <span className="font-mono text-emerald-600">{doc.currencySymbol}{doc.paidAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-black text-sm">
                            <span>Balance Due:</span>
                            <span className={`font-mono ${doc.balanceDue > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                              {doc.currencySymbol}{doc.balanceDue.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NOTES & TERMS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Customer Notes</span>
                      <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        "{doc.notes || "Thank you for your business. We look forward to serving you again!"}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Terms & Conditions</span>
                      <p className="text-slate-600 whitespace-pre-line text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {doc.termsConditions || "1. Payment is due within standard terms.\n2. Invoices subject to official dispute rules within 7 days."}
                      </p>
                    </div>
                  </div>

                  {/* SIGNATURE & AUTHORIZED STAMP */}
                  <div className="flex items-end justify-between pt-6 border-t border-slate-200">
                    <div className="text-[11px] text-slate-400 space-y-1">
                      {doc.isComputerGeneratedDisclaimer && (
                        <p className="italic">★ This is a computer-generated official document. No physical signature required.</p>
                      )}
                      <p className="font-mono text-[10px]">Doc Hash: {doc.id.slice(0, 16)} • Paperless Enterprise Suite</p>
                    </div>

                    <div className="text-center space-y-1.5 min-w-[180px]">
                      {doc.showSignature && (
                        <div className="h-12 border-b-2 border-slate-800 flex items-center justify-center px-4 font-serif italic text-lg text-slate-800">
                          {doc.authorizedPersonName || doc.seller.ownerName}
                        </div>
                      )}
                      <p className="text-xs font-black text-slate-900">{doc.authorizedPersonName || doc.seller.ownerName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{doc.authorizedPersonDesignation || "Authorized Signatory"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
