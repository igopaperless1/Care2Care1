export type DocumentType =
  | "invoice"
  | "bill"
  | "tax_invoice"
  | "proforma"
  | "quotation"
  | "estimate"
  | "sales_receipt"
  | "payment_receipt"
  | "credit_note"
  | "debit_note"
  | "purchase_bill"
  | "delivery_note"
  | "service_invoice"
  | "subscription_invoice"
  | "recurring_invoice"
  | "expense_bill"
  | "rent_invoice"
  | "donation_receipt"
  | "fee_receipt"
  | "custom_doc";

export interface DocumentTypeOption {
  id: DocumentType;
  label: string;
  category: "sales" | "billing" | "receipts" | "estimates" | "adjustments" | "specialized";
  icon: string;
  description: string;
  defaultTitle: string;
}

export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = [
  { id: "invoice", label: "Invoice", category: "sales", icon: "📄", description: "Standard business sales invoice with full tax & payment terms", defaultTitle: "TAX INVOICE" },
  { id: "bill", label: "Bill", category: "billing", icon: "🧾", description: "Standard retail or vendor purchase bill", defaultTitle: "BILL" },
  { id: "tax_invoice", label: "Tax Invoice", category: "sales", icon: "🏛️", description: "Compliant GST / VAT tax invoice with tax breakdowns", defaultTitle: "TAX INVOICE" },
  { id: "proforma", label: "Proforma Invoice", category: "estimates", icon: "📋", description: "Preliminary bill of sale sent to buyers before shipment", defaultTitle: "PROFORMA INVOICE" },
  { id: "quotation", label: "Quotation", category: "estimates", icon: "💬", description: "Formal price quote for products or proposed project scope", defaultTitle: "PRICE QUOTATION" },
  { id: "estimate", label: "Estimate", category: "estimates", icon: "📐", description: "Approximate cost calculation for future contract or services", defaultTitle: "COST ESTIMATE" },
  { id: "sales_receipt", label: "Sales Receipt", category: "receipts", icon: "🛍️", description: "Proof of completed retail purchase or counter sale", defaultTitle: "SALES RECEIPT" },
  { id: "payment_receipt", label: "Payment Receipt", category: "receipts", icon: "💳", description: "Formal acknowledgment of partial or full fund payment", defaultTitle: "PAYMENT RECEIPT" },
  { id: "credit_note", label: "Credit Note", category: "adjustments", icon: "↩️", description: "Issued for goods returned, cancellations or overbilling", defaultTitle: "CREDIT NOTE" },
  { id: "debit_note", label: "Debit Note", category: "adjustments", icon: "➕", description: "Issued for extra adjustments or undercharged items", defaultTitle: "DEBIT NOTE" },
  { id: "purchase_bill", label: "Purchase Bill", category: "billing", icon: "📦", description: "Vendor inward invoice received for recorded purchase expenses", defaultTitle: "PURCHASE BILL" },
  { id: "delivery_note", label: "Delivery Note / Challan", category: "sales", icon: "🚚", description: "Dispatch document accompanying shipped goods with quantities", defaultTitle: "DELIVERY CHALLAN" },
  { id: "service_invoice", label: "Service Invoice", category: "sales", icon: "💼", description: "Hourly, milestone or fixed consulting service billing", defaultTitle: "SERVICE INVOICE" },
  { id: "subscription_invoice", label: "Subscription Invoice", category: "billing", icon: "🔄", description: "Recurring software, membership or retainer period fee", defaultTitle: "SUBSCRIPTION INVOICE" },
  { id: "recurring_invoice", label: "Recurring Invoice", category: "billing", icon: "🔁", description: "Auto-scheduled recurring invoice with frequency schedule", defaultTitle: "RECURRING INVOICE" },
  { id: "expense_bill", label: "Expense Bill", category: "billing", icon: "💸", description: "Company or personal out-of-pocket reimbursable expense", defaultTitle: "EXPENSE BILL" },
  { id: "rent_invoice", label: "Rent Invoice", category: "specialized", icon: "🏠", description: "Residential or commercial tenant monthly lease dues", defaultTitle: "RENT INVOICE" },
  { id: "donation_receipt", label: "Donation Receipt", category: "specialized", icon: "💖", description: "NGO / Charity contribution tax exemption receipt", defaultTitle: "DONATION RECEIPT" },
  { id: "fee_receipt", label: "Fee Receipt", category: "specialized", icon: "🎓", description: "School, college or training course tuition fee receipt", defaultTitle: "FEE RECEIPT" },
  { id: "custom_doc", label: "Custom Document", category: "specialized", icon: "✨", description: "Custom blank canvas builder with flexible sections", defaultTitle: "BUSINESS DOCUMENT" }
];

export type DocumentStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled"
  | "refunded";

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  logoUrl?: string;
  businessType: string;
  regNumber?: string;
  taxId?: string; // VAT/GST/PAN
  phone: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  bankBranch?: string;
  swiftCode?: string;
  upiId?: string;
  qrCodeUrl?: string;
  signatureUrl?: string;
  stampUrl?: string;
  currency: string;
  currencySymbol: string;
  defaultTerms?: string;
  defaultNotes?: string;
  isDefault?: boolean;
}

export type CustomerType = "individual" | "business" | "organization" | "family" | "government" | "vendor";

export interface CustomerProfile {
  id: string;
  name: string;
  companyName?: string;
  type: CustomerType;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress?: string;
  taxId?: string;
  paymentTermsDays?: number;
  notes?: string;
  outstandingBalance?: number;
  totalSpent?: number;
  currency?: string;
}

export interface CatalogItem {
  id: string;
  type: "product" | "service";
  name: string;
  sku?: string;
  category: string;
  description: string;
  unit: string; // pcs, hrs, days, kg, sqft, mtr
  unitPrice: number;
  costPrice?: number;
  taxPercent: number;
  discountPercent?: number;
  stock?: number;
  barcode?: string;
  imageUrl?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: "text" | "number" | "date" | "dropdown" | "checkbox" | "currency";
  options?: string[]; // for dropdown
}

export interface InvoiceLineItem {
  id: string;
  itemId?: string;
  name: string;
  description?: string;
  sku?: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  unitRate: number;
  discountType: "percent" | "fixed";
  discountValue: number;
  taxType: "none" | "vat" | "gst" | "custom";
  taxPercent: number;
  serialNumber?: string;
  customColumns?: Record<string, string>;
  
  // Computed values
  lineSubtotal: number;
  lineDiscountAmount: number;
  lineTaxableAmount: number;
  lineTaxAmount: number;
  lineTotal: number;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: "cash" | "bank_transfer" | "card" | "cheque" | "qr_payment" | "wallet" | "online" | "other";
  referenceNumber?: string;
  notes?: string;
  attachmentUrl?: string;
  receivedBy?: string;
}

export interface RecurringSchedule {
  enabled: boolean;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate?: string;
  autoSend: boolean;
  nextRunDate?: string;
  lastGeneratedDate?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
  details: string;
}

export interface DocumentColumnConfig {
  key: string;
  label: string;
  enabled: boolean;
  width?: string;
  align: "left" | "center" | "right";
  isCustom?: boolean;
}

export interface InvoiceDocument {
  id: string;
  docNumber: string;
  docType: DocumentType;
  title: string;
  status: DocumentStatus;
  
  // Dates
  issueDate: string;
  dueDate: string;
  deliveryDate?: string;
  poNumber?: string;
  referenceNumber?: string;
  
  // Profiles
  seller: BusinessProfile;
  customer: CustomerProfile;
  
  // Items & Custom Columns
  items: InvoiceLineItem[];
  columnsConfig: DocumentColumnConfig[];
  
  // Calculations
  currency: string;
  currencySymbol: string;
  subtotal: number;
  itemDiscountsTotal: number;
  invoiceDiscountType: "percent" | "fixed";
  invoiceDiscountValue: number;
  invoiceDiscountTotal: number;
  taxableAmount: number;
  taxStructure: "no_tax" | "vat" | "gst" | "sales_tax" | "custom";
  taxPercent: number;
  taxName?: string;
  cgstAmount?: number;
  sgstAmount?: number;
  taxTotal: number;
  shippingCharges: number;
  packagingCharges: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  
  // Payment info
  paymentMethod: "cash" | "bank_transfer" | "card" | "cheque" | "qr_payment" | "online";
  paymentInstructions?: string;
  
  // Signatures & Auth
  showSignature: boolean;
  signatureUrl?: string;
  authorizedPersonName?: string;
  authorizedPersonDesignation?: string;
  showStamp: boolean;
  stampUrl?: string;
  isComputerGeneratedDisclaimer: boolean;
  
  // Notes & Terms
  notes: string;
  termsConditions: string;
  
  // Custom Fields & Design
  customFields: CustomField[];
  templateId: string;
  pageSize: "a4" | "a5" | "letter" | "legal" | "receipt";
  orientation: "portrait" | "landscape";
  spacing: "compact" | "standard" | "spacious";
  themeColor: string;
  fontFamily: string;
  showGridlines: boolean;
  borderStyle: "none" | "light" | "standard" | "strong";
  
  // Sub-features
  recurringSchedule?: RecurringSchedule;
  payments: PaymentRecord[];
  auditLogs: AuditEntry[];
  attachments: { name: string; url: string; size: string }[];
  publicShareId?: string;
  isPublicShareActive?: boolean;
  
  createdAt: string;
  updatedAt: string;
}
