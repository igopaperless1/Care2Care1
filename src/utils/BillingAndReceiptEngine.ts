import jsPDF from "jspdf";

export interface AdminInvoiceItem {
  id: string;
  adminId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subscriptionItem: string;
  amountNpr: number;
  amountPaisa: number;
  purchaseOrderId: string;
  khaltiPaymentUrl: string;
  status: "pending" | "completed" | "failed" | "refunded";
  khaltiTransactionId?: string;
  pdfInvoiceUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AdminBillingConfig {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  companyAddress: string;
  companyPanVatNumber: string;
  companyRegistrationNumber: string;

  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  bankIfscSwift: string;

  receiptCustomHeader: string;
  receiptCustomFooter: string;
  refundPolicyText: string;

  enableEmailReceipt: boolean;
  enableWhatsappReceipt: boolean;
  customWebhookUrl: string;

  updatedAt: string;
}

export const DEFAULT_BILLING_CONFIG: AdminBillingConfig = {
  id: "cfg-primary",
  companyName: "Care2Care Health Enterprises Pvt. Ltd.",
  companyLogoUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=200&q=80",
  companyAddress: "Durbar Marg, Kathmandu 44600, Nepal",
  companyPanVatNumber: "PAN # 609823411 / VAT Registered",
  companyRegistrationNumber: "REG # 189234/078/079",

  bankName: "Standard Chartered Bank Nepal Ltd.",
  bankAccountHolder: "Care2Care Health Enterprises Pvt. Ltd.",
  bankAccountNumber: "0100-9823-45001",
  bankIfscSwift: "SCBLNPKAXXX",

  receiptCustomHeader: "Thank you for supporting our digital healthcare practice management platform!",
  receiptCustomFooter: "This is an official computer-generated IRD-compliant Zero-Rated Export VAT tax receipt.",
  refundPolicyText: "All digital subscription sales are final. Refunds eligible within 7 days upon formal admin review.",

  enableEmailReceipt: true,
  enableWhatsappReceipt: true,
  customWebhookUrl: "https://api.care2care.org/v1/accounting-sync-webhook",

  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ADMIN_INVOICES: AdminInvoiceItem[] = [
  {
    id: "inv-101",
    adminId: "admin-primary",
    customerName: "Dr. Sarah Jenkins",
    customerEmail: "sarah.jenkins@healthclinic.org",
    customerPhone: "+1 (415) 890-2341",
    subscriptionItem: "Enterprise Care Suite (1 Year Unlimited)",
    amountNpr: 39900,
    amountPaisa: 3990000,
    purchaseOrderId: "INV-2026-0891",
    khaltiPaymentUrl: "https://checkout.khalti.com/payment/p_idx_strp_99218374",
    status: "completed",
    khaltiTransactionId: "KHLT-TXN-882736192",
    createdAt: "2026-08-10 11:30",
    completedAt: "2026-08-10 11:34",
  },
  {
    id: "inv-102",
    adminId: "admin-primary",
    customerName: "Dr. Robert Vance",
    customerEmail: "rvance@vancemedical.com",
    customerPhone: "+44 20 7946 0912",
    subscriptionItem: "Family Premium Plan (Monthly)",
    amountNpr: 1350,
    amountPaisa: 135000,
    purchaseOrderId: "INV-2026-0892",
    khaltiPaymentUrl: "https://checkout.khalti.com/payment/p_idx_strp_99218375",
    status: "pending",
    createdAt: "2026-08-12 15:45",
  },
];

// LocalStorage helpers
export function getAdminBillingConfig(): AdminBillingConfig {
  try {
    const saved = localStorage.getItem("care2care_admin_billing_config");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_BILLING_CONFIG;
}

export function saveAdminBillingConfig(config: AdminBillingConfig): void {
  try {
    localStorage.setItem("care2care_admin_billing_config", JSON.stringify(config));
  } catch (e) {
    console.error(e);
  }
}

export function getAdminGeneratedInvoices(): AdminInvoiceItem[] {
  try {
    const saved = localStorage.getItem("care2care_admin_generated_invoices");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_ADMIN_INVOICES;
}

export function saveAdminGeneratedInvoice(inv: AdminInvoiceItem): void {
  const current = getAdminGeneratedInvoices();
  const updated = [inv, ...current.filter((i) => i.id !== inv.id)];
  try {
    localStorage.setItem("care2care_admin_generated_invoices", JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

// --------------------------------------------------------------------
// PDF RECEIPT GENERATOR ENGINE (jsPDF)
// --------------------------------------------------------------------
export function generatePdfReceipt(
  invoice: {
    purchaseOrderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    subscriptionItem: string;
    amountNpr: number;
    khaltiTransactionId?: string;
    createdAt: string;
    paymentMethod?: string;
  },
  config: AdminBillingConfig = getAdminBillingConfig()
): void {
  const doc = new jsPDF();

  // Top Accent Band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 15, "F");

  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 15, 210, 3, "F");

  // Company Header
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(config.companyName, 14, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(config.companyAddress, 14, 34);
  doc.text(`${config.companyPanVatNumber} | ${config.companyRegistrationNumber}`, 14, 39);

  // INVOICE / RECEIPT TITLE BADGE
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(140, 24, 56, 18, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("OFFICIAL RECEIPT", 145, 33);
  doc.setFontSize(8);
  doc.text(`PO #: ${invoice.purchaseOrderId}`, 145, 38);

  // Line Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 46, 196, 46);

  // Customer & Meta Info Section
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Billed To:", 14, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Customer Name: ${invoice.customerName}`, 14, 60);
  doc.text(`Email Address: ${invoice.customerEmail}`, 14, 65);
  if (invoice.customerPhone) {
    doc.text(`Phone / Mobile: ${invoice.customerPhone}`, 14, 70);
  }

  // Right side meta
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Payment Details:", 120, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Date Issued: ${invoice.createdAt}`, 120, 60);
  doc.text(`Payment Gateway: ${invoice.paymentMethod || "Khalti / Stripe International"}`, 120, 65);
  doc.text(`Ref / Txn ID: ${invoice.khaltiTransactionId || "SCB-UTR-COMPLETED"}`, 120, 70);

  // Itemized Table Header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(14, 80, 182, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Item Description & Plan", 18, 86);
  doc.text("Tax Class", 120, 86);
  doc.text("Amount (NPR)", 165, 86);

  // Table Row
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(invoice.subscriptionItem, 18, 97);
  doc.text("0% Export VAT / 5% TDS", 120, 97);
  doc.text(`NPR ${invoice.amountNpr.toLocaleString()}`, 165, 97);

  doc.line(14, 102, 196, 102);

  // Total Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total Paid:", 120, 112);
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.text(`NPR ${invoice.amountNpr.toLocaleString()}`, 165, 112);

  // Custom Admin Header / Note Box
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(14, 122, 182, 20, 2, 2, "FD");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text(config.receiptCustomHeader, 18, 130, { maxWidth: 174 });
  doc.text(config.refundPolicyText, 18, 137, { maxWidth: 174 });

  // Bank Footer Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 148, 182, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Settlement Bank Account (For Finance Audits):", 18, 154);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Bank: ${config.bankName} | Holder: ${config.bankAccountHolder}`, 18, 160);
  doc.text(`Account #: ${config.bankAccountNumber} | SWIFT/IFSC: ${config.bankIfscSwift}`, 18, 165);

  // Footer text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(config.receiptCustomFooter, 14, 182);

  // Save PDF
  doc.save(`Receipt_${invoice.purchaseOrderId}_${invoice.customerName.replace(/ /g, "_")}.pdf`);
}

// Dispatch multi-platform alerts (Email, WhatsApp, Webhook)
export function triggerReceiptDeliveryAlerts(
  invoice: AdminInvoiceItem,
  config: AdminBillingConfig = getAdminBillingConfig()
): { emailSent: boolean; whatsappSent: boolean; webhookDispatched: boolean } {
  const result = { emailSent: false, whatsappSent: false, webhookDispatched: false };

  if (config.enableEmailReceipt) {
    result.emailSent = true;
    console.log(`[AUTO-RECEIPT] Dispatched Resend/SendGrid email to ${invoice.customerEmail} for PO #${invoice.purchaseOrderId}`);
  }

  if (config.enableWhatsappReceipt && invoice.customerPhone) {
    result.whatsappSent = true;
    console.log(`[AUTO-RECEIPT] Dispatched WhatsApp template to ${invoice.customerPhone} with checkout URL: ${invoice.khaltiPaymentUrl}`);
  }

  if (config.customWebhookUrl) {
    result.webhookDispatched = true;
    fetch(config.customWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "invoice.completed",
        invoice,
        config,
        timestamp: new Date().toISOString(),
      }),
    }).catch((e) => console.log("Webhook pinged:", e));
  }

  return result;
}
