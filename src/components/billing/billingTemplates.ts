import {
  BusinessProfile,
  CustomerProfile,
  CatalogItem,
  DocumentColumnConfig,
  InvoiceDocument,
  DocumentType
} from "./billingTypes";

export interface TemplatePreset {
  id: string;
  name: string;
  category: "Business" | "Retail" | "Services" | "Education" | "Healthcare" | "Property" | "NGO" | "Personal" | "Custom";
  docType: DocumentType;
  description: string;
  themeColor: string;
  pageSize: "a4" | "a5" | "letter" | "receipt";
  orientation: "portrait" | "landscape";
  columns: DocumentColumnConfig[];
  defaultTerms: string;
  defaultNotes: string;
  previewThumbnail?: string;
}

export const DEFAULT_DOCUMENT_COLUMNS: DocumentColumnConfig[] = [
  { key: "item", label: "Item & Description", enabled: true, width: "42%", align: "left" },
  { key: "hsnSac", label: "HSN/SAC", enabled: false, width: "12%", align: "left" },
  { key: "quantity", label: "Qty", enabled: true, width: "10%", align: "center" },
  { key: "unit", label: "Unit", enabled: true, width: "8%", align: "center" },
  { key: "unitRate", label: "Rate", enabled: true, width: "14%", align: "right" },
  { key: "discount", label: "Disc %", enabled: true, width: "10%", align: "right" },
  { key: "tax", label: "Tax %", enabled: true, width: "10%", align: "right" },
  { key: "amount", label: "Amount", enabled: true, width: "16%", align: "right" }
];

export const TEMPLATE_GALLERY: TemplatePreset[] = [
  // 1. BUSINESS
  {
    id: "std_business_invoice",
    name: "Standard Business Invoice",
    category: "Business",
    docType: "invoice",
    description: "Crisp corporate layout with VAT/GST tax grid, bank info & terms.",
    themeColor: "#FF6A45",
    pageSize: "a4",
    orientation: "portrait",
    columns: DEFAULT_DOCUMENT_COLUMNS,
    defaultTerms: "1. Payment is due within 15 days of invoice date.\n2. Overdue balances incur 1.5% monthly interest.\n3. Checks payable to the registered business name.",
    defaultNotes: "Thank you for partnering with us! We appreciate your business."
  },
  {
    id: "modern_tax_invoice",
    name: "Modern Tax Invoice",
    category: "Business",
    docType: "tax_invoice",
    description: "Compliant GST / Tax invoice with dual CGST/SGST breakdowns and digital QR.",
    themeColor: "#0284C7",
    pageSize: "a4",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Description of Goods/Services", enabled: true, width: "35%", align: "left" },
      { key: "hsnSac", label: "HSN / SAC", enabled: true, width: "12%", align: "center" },
      { key: "quantity", label: "Qty", enabled: true, width: "8%", align: "center" },
      { key: "unitRate", label: "Taxable Rate", enabled: true, width: "15%", align: "right" },
      { key: "tax", label: "GST %", enabled: true, width: "10%", align: "right" },
      { key: "amount", label: "Total", enabled: true, width: "20%", align: "right" }
    ],
    defaultTerms: "Certified that the particulars given above are true and correct.",
    defaultNotes: "This is a computer-generated GST tax invoice."
  },

  // 2. RETAIL
  {
    id: "pos_retail_receipt",
    name: "Shop & POS Thermal Bill",
    category: "Retail",
    docType: "sales_receipt",
    description: "Compact 80mm receipt style for supermarket, boutique and retail counters.",
    themeColor: "#0F172A",
    pageSize: "receipt",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Item", enabled: true, width: "50%", align: "left" },
      { key: "quantity", label: "Qty", enabled: true, width: "15%", align: "center" },
      { key: "unitRate", label: "Price", enabled: true, width: "15%", align: "right" },
      { key: "amount", label: "Total", enabled: true, width: "20%", align: "right" }
    ],
    defaultTerms: "Goods once sold cannot be returned without original receipt within 7 days.",
    defaultNotes: "★ THANK YOU FOR VISITING! HAVE A BLESSED DAY! ★"
  },

  // 3. SERVICES
  {
    id: "consultant_freelancer_invoice",
    name: "Freelancer & Consultant Invoice",
    category: "Services",
    docType: "service_invoice",
    description: "Clean hourly / milestone breakdown with project deliverables and UPI/QR code.",
    themeColor: "#7C3AED",
    pageSize: "a4",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Service Deliverables & Milestones", enabled: true, width: "50%", align: "left" },
      { key: "quantity", label: "Hours / Qty", enabled: true, width: "15%", align: "center" },
      { key: "unitRate", label: "Hourly Rate", enabled: true, width: "15%", align: "right" },
      { key: "amount", label: "Amount", enabled: true, width: "20%", align: "right" }
    ],
    defaultTerms: "Payment due within 10 business days via direct wire transfer or online payment link.",
    defaultNotes: "Thank you for the opportunity to collaborate on this project!"
  },

  // 4. EDUCATION
  {
    id: "school_fee_receipt",
    name: "School & Course Fee Receipt",
    category: "Education",
    docType: "fee_receipt",
    description: "Formatted for school terms, coaching academies, student roll no & semester dues.",
    themeColor: "#059669",
    pageSize: "a4",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Fee Particulars & Term", enabled: true, width: "55%", align: "left" },
      { key: "unitRate", label: "Standard Fee", enabled: true, width: "20%", align: "right" },
      { key: "discount", label: "Scholarship Concession", enabled: true, width: "10%", align: "right" },
      { key: "amount", label: "Net Paid", enabled: true, width: "15%", align: "right" }
    ],
    defaultTerms: "Tuition and development fees once deposited are strictly non-refundable.",
    defaultNotes: "Academic Year 2026-2027. Official Institution Stamp."
  },

  // 5. HEALTHCARE
  {
    id: "clinic_consultation_bill",
    name: "Clinic & Doctor Consultation Bill",
    category: "Healthcare",
    docType: "bill",
    description: "Medical consultation, diagnostic lab fees, pharmacy doses & doctor credentials.",
    themeColor: "#DC2626",
    pageSize: "a4",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Medical Service / Prescription / Lab Test", enabled: true, width: "50%", align: "left" },
      { key: "quantity", label: "Doses / Qty", enabled: true, width: "15%", align: "center" },
      { key: "unitRate", label: "Charges", enabled: true, width: "15%", align: "right" },
      { key: "amount", label: "Total", enabled: true, width: "20%", align: "right" }
    ],
    defaultTerms: "Consultation validity: 7 days for review. Pharmacy goods subject to batch verification.",
    defaultNotes: "Wishing you a speedy and holistic recovery!"
  },

  // 6. PROPERTY
  {
    id: "property_rent_invoice",
    name: "Property Rent & Maintenance Invoice",
    category: "Property",
    docType: "rent_invoice",
    description: "Tenant monthly lease, electricity sub-meter units, maintenance & dues.",
    themeColor: "#D97706",
    pageSize: "a4",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Rent & Utility Particulars", enabled: true, width: "50%", align: "left" },
      { key: "quantity", label: "Units / Period", enabled: true, width: "15%", align: "center" },
      { key: "unitRate", label: "Rate / Unit", enabled: true, width: "15%", align: "right" },
      { key: "amount", label: "Amount Due", enabled: true, width: "20%", align: "right" }
    ],
    defaultTerms: "Rent must be settled by the 5th of each calendar month to avoid late penalty charges.",
    defaultNotes: "Lease Unit #402, Green Meadows Residency."
  },

  // 7. NGO / CHARITY
  {
    id: "donation_receipt_ngo",
    name: "Donation & Contribution Receipt",
    category: "NGO",
    docType: "donation_receipt",
    description: "Charitable contribution receipt with tax-exemption section 80G/501(c)(3) certificate.",
    themeColor: "#DB2777",
    pageSize: "a4",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Donation Cause / Fund Description", enabled: true, width: "65%", align: "left" },
      { key: "amount", label: "Contribution Amount", enabled: true, width: "35%", align: "right" }
    ],
    defaultTerms: "Donations are eligible for tax deduction under applicable charity statutes.",
    defaultNotes: "Thank you for your generous heart in building a blessed and uplifted community!"
  },

  // 8. PERSONAL
  {
    id: "simple_personal_bill",
    name: "Simple Bill & Family Expense",
    category: "Personal",
    docType: "bill",
    description: "Straightforward minimalist bill for family dues, shared costs & private sales.",
    themeColor: "#475569",
    pageSize: "a5",
    orientation: "portrait",
    columns: [
      { key: "item", label: "Item / Purpose", enabled: true, width: "60%", align: "left" },
      { key: "quantity", label: "Qty", enabled: true, width: "15%", align: "center" },
      { key: "amount", label: "Amount", enabled: true, width: "25%", align: "right" }
    ],
    defaultTerms: "Private transaction settlement.",
    defaultNotes: "Personal record copy."
  },

  // 9. CUSTOM
  {
    id: "blank_custom_builder",
    name: "Blank Document Canvas",
    category: "Custom",
    docType: "custom_doc",
    description: "Start with an empty structure and configure custom columns, badges and calculations.",
    themeColor: "#FF6A45",
    pageSize: "a4",
    orientation: "portrait",
    columns: DEFAULT_DOCUMENT_COLUMNS,
    defaultTerms: "Standard terms and conditions apply.",
    defaultNotes: "Generated via Paperless Document Engine."
  }
];

export const INITIAL_BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: "biz_1",
    name: "ABC Global Traders & Consulting",
    ownerName: "Eleanor Vance",
    businessType: "Private Limited",
    regNumber: "REG-2024-99881",
    taxId: "VAT-992384102 / GST27ABCDE1234F1Z5",
    phone: "+1 (555) 234-8901",
    email: "billing@abctraders.com",
    website: "www.abctraders.com",
    address: "742 Evergreen Terrace, Suite 400",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94107",
    bankName: "First National Commerce Bank",
    accountName: "ABC Global Traders LLC",
    accountNumber: "987654321098",
    bankBranch: "Market Street Financial Hub",
    swiftCode: "FNCBUSA66XX",
    upiId: "abctraders@upi",
    currency: "USD",
    currencySymbol: "$",
    defaultTerms: "Payment is due within 15 days of invoice date.",
    defaultNotes: "Thank you for your business. We appreciate working with you!",
    isDefault: true
  },
  {
    id: "biz_2",
    name: "Roshan Digital & IT Solutions",
    ownerName: "Roshan Sharma",
    businessType: "Sole Proprietorship",
    regNumber: "PAN-83920194",
    taxId: "PAN: 83920194 / VAT: 30291029",
    phone: "+977 9801234567",
    email: "roshan@roshandigital.io",
    website: "www.roshandigital.io",
    address: "New Baneshwor, Kathmandu",
    city: "Kathmandu",
    country: "Nepal",
    postalCode: "44600",
    bankName: "Nabil Bank Ltd",
    accountName: "Roshan Sharma",
    accountNumber: "0192837465019",
    bankBranch: "New Baneshwor Branch",
    swiftCode: "NABILNPKA",
    upiId: "roshan@esewa",
    currency: "NPR",
    currencySymbol: "रु",
    defaultTerms: "50% advance before project commencement, balance on delivery.",
    defaultNotes: "Digital innovation crafted for your business growth.",
    isDefault: false
  },
  {
    id: "biz_3",
    name: "Prime Store & Supplies",
    ownerName: "Eleanor & Family",
    businessType: "E-Commerce & Retail",
    taxId: "RET-77889900",
    phone: "+1 (555) 888-7766",
    email: "orders@primestore.com",
    address: "100 Broadway Avenue",
    city: "New York",
    country: "USA",
    currency: "USD",
    currencySymbol: "$",
    defaultTerms: "All retail items backed by 30-day warranty.",
    defaultNotes: "Thank you for shopping with Prime Store!",
    isDefault: false
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "cust_1",
    name: "Alex Reynolds",
    companyName: "Nexus Tech Ventures Pvt. Ltd.",
    type: "business",
    email: "alex@nexustech.com",
    phone: "+1 (555) 443-9821",
    billingAddress: "500 Silicon Way, Tech Park 2, San Jose, CA 95112",
    taxId: "US-TIN-88991122",
    paymentTermsDays: 15,
    notes: "VIP corporate client - priority support tier",
    outstandingBalance: 1250,
    totalSpent: 48500,
    currency: "USD"
  },
  {
    id: "cust_2",
    name: "Dr. Maya Thapa",
    companyName: "Care & Cure Multi-Specialty Clinic",
    type: "organization",
    email: "maya.thapa@careclinic.org",
    phone: "+977 9841223344",
    billingAddress: "Jhamsikhel Road, Lalitpur, Nepal",
    taxId: "VAT-601928341",
    paymentTermsDays: 30,
    notes: "Healthcare partner for telemedicine integration",
    outstandingBalance: 0,
    totalSpent: 120000,
    currency: "NPR"
  },
  {
    id: "cust_3",
    name: "Samantha Brooks",
    type: "individual",
    email: "samantha.b@gmail.com",
    phone: "+1 (555) 902-1144",
    billingAddress: "42 Willow Street, Apt 3B, Boston, MA",
    paymentTermsDays: 7,
    outstandingBalance: 320,
    totalSpent: 2800,
    currency: "USD"
  }
];

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "item_1",
    type: "service",
    name: "Website & Web Application Development",
    sku: "SRV-WEB-01",
    category: "Software",
    description: "Full-stack React & TypeScript custom web portal with cloud integration.",
    unit: "Project",
    unitPrice: 1500,
    taxPercent: 13,
    discountPercent: 0
  },
  {
    id: "item_2",
    type: "service",
    name: "Senior Care & Caregiver Retainer (Monthly)",
    sku: "SRV-CARE-30",
    category: "Healthcare",
    description: "Comprehensive 24/7 vitals telemetry, pill schedule tracking & emergency SOS.",
    unit: "Month",
    unitPrice: 450,
    taxPercent: 0,
    discountPercent: 5
  },
  {
    id: "item_3",
    type: "product",
    name: "Digital Medical QR Emergency Pendant",
    sku: "PROD-MED-QR",
    category: "Hardware",
    description: "Laser-engraved titanium NFC & QR emergency medical alert pendant.",
    unit: "pcs",
    unitPrice: 49.99,
    costPrice: 18.00,
    taxPercent: 8,
    stock: 85,
    barcode: "8901234567890"
  },
  {
    id: "item_4",
    type: "service",
    name: "Legal Contract Review & Smart Vault Filing",
    sku: "SRV-LEG-02",
    category: "Legal",
    description: "Property deed, tenant agreement and employment contract notarization.",
    unit: "Document",
    unitPrice: 250,
    taxPercent: 13
  },
  {
    id: "item_5",
    type: "product",
    name: "21-Day Habit Transformation Journal & Cards",
    sku: "PROD-HABIT-BK",
    category: "Stationery",
    description: "Physical scratch card workbook for lifelong habit mastery.",
    unit: "pcs",
    unitPrice: 24.50,
    costPrice: 7.20,
    taxPercent: 5,
    stock: 240
  }
];
