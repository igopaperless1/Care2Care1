import { PaperlessMainCategory, PaperlessAsset, PaperlessUserContact, PaperlessVerificationRequest } from "./paperlessTypes";

export const PAPERLESS_CATEGORIES: PaperlessMainCategory[] = [
  {
    id: "medical_healthcare",
    name: "Medical & Healthcare",
    iconName: "Stethoscope",
    color: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
    totalAssets: 18540,
    subServices: [
      { id: "prescriptions", name: "Prescriptions", count: 4820 },
      { id: "lab_reports", name: "Lab Reports", count: 3950 },
      { id: "diagnostic_reports", name: "Diagnostic & MRI Reports", count: 2640 },
      { id: "vaccine_cards", name: "Vaccination Cards", count: 1890 },
      { id: "insurance_claims", name: "Insurance Claims", count: 2120 },
      { id: "doctor_notes", name: "Doctor & Clinical Notes", count: 3120 }
    ]
  },
  {
    id: "business_corporate",
    name: "Business & Corporate",
    iconName: "Building2",
    color: "from-blue-600 to-indigo-700",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40",
    totalAssets: 22300,
    subServices: [
      { id: "contracts", name: "Contracts & Agreements", count: 5890 },
      { id: "ndas", name: "NDAs & Confidentiality", count: 4120 },
      { id: "pitch_decks", name: "Pitch Decks & Presentations", count: 2780 },
      { id: "meeting_minutes", name: "Meeting Minutes", count: 3450 },
      { id: "compliance_docs", name: "Compliance & Audits", count: 2980 },
      { id: "corporate_policies", name: "Corporate Policies", count: 3080 }
    ]
  },
  {
    id: "finance_banking",
    name: "Finance & Banking",
    iconName: "CreditCard",
    color: "from-emerald-600 to-teal-700",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    totalAssets: 28490,
    subServices: [
      { id: "invoices", name: "Invoices", count: 7420 },
      { id: "bank_statements", name: "Bank Statements", count: 5120 },
      { id: "tax_documents", name: "Tax Documents & Returns", count: 4890 },
      { id: "investment_records", name: "Investment Records", count: 2840 },
      { id: "loan_documents", name: "Loan Documents", count: 2150 },
      { id: "receipts", name: "Receipts & Vouchers", count: 3240 },
      { id: "insurance_policies", name: "Insurance Policies", count: 1890 },
      { id: "kyc_documents", name: "KYC Documents", count: 940 }
    ]
  },
  {
    id: "retail_consumer",
    name: "Retail & Consumer",
    iconName: "ShoppingBag",
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    totalAssets: 14200,
    subServices: [
      { id: "purchase_bills", name: "Purchase Bills", count: 5210 },
      { id: "warranty_cards", name: "Warranty Cards", count: 3490 },
      { id: "return_receipts", name: "Return Receipts", count: 1840 },
      { id: "membership_cards", name: "Membership Cards", count: 2120 },
      { id: "loyalty_vouchers", name: "Loyalty Vouchers", count: 1540 }
    ]
  },
  {
    id: "transport_travel",
    name: "Transport & Travel",
    iconName: "Plane",
    color: "from-sky-500 to-cyan-600",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40",
    totalAssets: 11840,
    subServices: [
      { id: "boarding_passes", name: "Boarding Passes", count: 3120 },
      { id: "vehicle_rc", name: "Vehicle RC & Bluebook", count: 2450 },
      { id: "driving_license", name: "Driving License", count: 2100 },
      { id: "travel_tickets", name: "Travel Tickets", count: 2310 },
      { id: "hotel_bookings", name: "Hotel Bookings", count: 1240 },
      { id: "visas_permits", name: "Visas & Travel Permits", count: 620 }
    ]
  },
  {
    id: "education_academics",
    name: "Education & Academics",
    iconName: "GraduationCap",
    color: "from-violet-600 to-purple-700",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/40",
    totalAssets: 12120,
    subServices: [
      { id: "certificates", name: "Certificates & Degrees", count: 3890 },
      { id: "marksheets", name: "Marksheets & Transcripts", count: 3120 },
      { id: "diplomas", name: "Diplomas", count: 1840 },
      { id: "student_ids", name: "Student ID Cards", count: 1520 },
      { id: "research_papers", name: "Research Papers & Theses", count: 1750 }
    ]
  },
  {
    id: "government_legal",
    name: "Government & Legal",
    iconName: "Scale",
    color: "from-slate-700 to-slate-900",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700",
    totalAssets: 16850,
    subServices: [
      { id: "citizenship_id", name: "Citizenship & National ID", count: 4890 },
      { id: "passports", name: "Passports", count: 3950 },
      { id: "land_deeds", name: "Land Deeds (Lalpurja)", count: 2840 },
      { id: "power_of_attorney", name: "Power of Attorney", count: 1890 },
      { id: "affidavits", name: "Affidavits & Notary", count: 1980 },
      { id: "legal_permits", name: "Government Permits", count: 1300 }
    ]
  },
  {
    id: "hospitality_events",
    name: "Hospitality & Events",
    iconName: "Calendar",
    color: "from-fuchsia-600 to-pink-600",
    badgeColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800/40",
    totalAssets: 8940,
    subServices: [
      { id: "event_passes", name: "Event Passes & Invites", count: 3120 },
      { id: "booking_confirmations", name: "Booking Confirmations", count: 2450 },
      { id: "banquet_invoices", name: "Banquet & Hall Invoices", count: 1890 },
      { id: "guest_lists", name: "Guest Lists & Schedules", count: 1480 }
    ]
  },
  {
    id: "logistics_supply_chain",
    name: "Logistics & Supply Chain",
    iconName: "Truck",
    color: "from-orange-600 to-amber-700",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/40",
    totalAssets: 7850,
    subServices: [
      { id: "bills_of_lading", name: "Bills of Lading", count: 2450 },
      { id: "waybills", name: "Waybills & Consignment", count: 2120 },
      { id: "delivery_receipts", name: "Delivery Receipts (POD)", count: 1890 },
      { id: "warehouse_manifests", name: "Warehouse Manifests", count: 1390 }
    ]
  },
  {
    id: "real_estate_property",
    name: "Real Estate & Property",
    iconName: "Home",
    color: "from-teal-600 to-emerald-700",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
    totalAssets: 9640,
    subServices: [
      { id: "property_deeds", name: "Property Ownership Deeds", count: 3120 },
      { id: "rent_agreements", name: "Tenancy & Rent Agreements", count: 2840 },
      { id: "utility_bills", name: "Electricity & Water Bills", count: 2150 },
      { id: "blueprints_maps", name: "Architectural Blueprints", count: 1530 }
    ]
  },
  {
    id: "insurance",
    name: "Insurance",
    iconName: "Shield",
    color: "from-blue-700 to-cyan-800",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40",
    totalAssets: 8120,
    subServices: [
      { id: "health_insurance", name: "Health Insurance Policy", count: 2840 },
      { id: "life_insurance", name: "Life Insurance Policy", count: 2150 },
      { id: "vehicle_insurance", name: "Vehicle Comprehensive Cover", count: 1890 },
      { id: "claim_forms", name: "Claim Settlement Forms", count: 1240 }
    ]
  },
  {
    id: "personal_lifestyle",
    name: "Personal & Lifestyle",
    iconName: "Heart",
    color: "from-pink-500 to-rose-600",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/40",
    totalAssets: 10450,
    subServices: [
      { id: "birth_certificates", name: "Birth Certificates", count: 3450 },
      { id: "family_photos", name: "Family Vault Keepsakes", count: 2890 },
      { id: "personal_diaries", name: "Personal Journal & Notes", count: 2150 },
      { id: "letters_wills", name: "Letters & Personal Wills", count: 1960 }
    ]
  }
];

export const MOCK_CONTACTS: PaperlessUserContact[] = [
  {
    id: "cnt-1",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    department: "Medical Staff"
  },
  {
    id: "cnt-2",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    department: "Finance"
  },
  {
    id: "cnt-3",
    name: "Sarah Brown",
    email: "sarah@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    department: "Operations"
  },
  {
    id: "cnt-4",
    name: "Robert Wilson",
    email: "robert@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    department: "Legal Affairs"
  },
  {
    id: "cnt-5",
    name: "Eleanor Vance",
    email: "eleanor.vance@family.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    department: "Family Member"
  }
];

export const INITIAL_PAPERLESS_ASSETS: PaperlessAsset[] = [
  {
    id: "ast-1",
    name: "Prescription.pdf",
    fileName: "Prescription_Aug2026.pdf",
    fileSize: "1.2 MB",
    fileSizeBytes: 1258291,
    fileType: "pdf",
    category: "Medical & Healthcare",
    subService: "Prescriptions",
    status: "verified",
    uploadedBy: {
      id: "usr-1",
      name: "John Doe",
      email: "johndoe@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    },
    uploadDate: "Today • 2m ago",
    uploadTimestamp: Date.now() - 120000,
    isFavorite: true,
    tags: ["Doctor", "Prescription", "Cardio"],
    description: "Prescription issued by Dr. Sterling for monthly cardio checkup.",
    accessLevel: "private",
    sharedWith: [
      { userId: "cnt-1", name: "Jane Smith", email: "jane@example.com", role: "view" }
    ],
    activityLog: [
      { id: "act-1", action: "Uploaded asset", performedBy: "John Doe", timestamp: "Today 10:30 AM" },
      { id: "act-2", action: "Verified by system OCR", performedBy: "Automated OCR Engine", timestamp: "Today 10:31 AM" }
    ]
  },
  {
    id: "ast-2",
    name: "Invoice_2025.pdf",
    fileName: "Invoice_Dec2025_Sterling.pdf",
    fileSize: "3.4 MB",
    fileSizeBytes: 3565158,
    fileType: "pdf",
    category: "Finance & Banking",
    subService: "Invoices",
    status: "verified",
    uploadedBy: {
      id: "usr-2",
      name: "Mike Johnson",
      email: "mike@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    uploadDate: "Today • 15m ago",
    uploadTimestamp: Date.now() - 900000,
    isFavorite: true,
    tags: ["Invoice", "Quarterly", "Taxes"],
    description: "Official Q4 VAT invoice with QR verification code.",
    accessLevel: "workspace",
    sharedWith: [],
    activityLog: [
      { id: "act-3", action: "Uploaded asset", performedBy: "Mike Johnson", timestamp: "Today 10:15 AM" }
    ]
  },
  {
    id: "ast-3",
    name: "Passport.pdf",
    fileName: "Passport_ColorScan_HighRes.pdf",
    fileSize: "4.8 MB",
    fileSizeBytes: 5033164,
    fileType: "pdf",
    category: "Government & Legal",
    subService: "Passports",
    status: "encrypted",
    uploadedBy: {
      id: "usr-3",
      name: "Sarah Brown",
      email: "sarah@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    uploadDate: "Yesterday",
    uploadTimestamp: Date.now() - 86400000,
    isFavorite: false,
    tags: ["Passport", "Identity", "Legal"],
    description: "Official bio-metric passport encrypted with AES-GCM.",
    accessLevel: "private",
    sharedWith: [],
    activityLog: [
      { id: "act-4", action: "Encrypted & Saved to Vault", performedBy: "Sarah Brown", timestamp: "Yesterday 04:20 PM" }
    ]
  },
  {
    id: "ast-4",
    name: "Contract.pdf",
    fileName: "Service_Agreement_2026.pdf",
    fileSize: "5.1 MB",
    fileSizeBytes: 5347737,
    fileType: "pdf",
    category: "Business & Corporate",
    subService: "Contracts & Agreements",
    status: "verified",
    uploadedBy: {
      id: "usr-4",
      name: "Robert Wilson",
      email: "robert@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    },
    uploadDate: "Yesterday",
    uploadTimestamp: Date.now() - 90000000,
    isFavorite: false,
    tags: ["Contract", "Business", "Vendor"],
    description: "B2B partnership and vendor SLA contract with digital signatures.",
    accessLevel: "workspace",
    sharedWith: [
      { userId: "cnt-2", name: "Mike Johnson", email: "mike@example.com", role: "edit" }
    ],
    activityLog: [
      { id: "act-5", action: "Uploaded & Signed", performedBy: "Robert Wilson", timestamp: "Yesterday 03:00 PM" }
    ]
  },
  {
    id: "ast-5",
    name: "MRI Report.pdf",
    fileName: "MRI_Brain_Scan_Report.pdf",
    fileSize: "2.4 MB",
    fileSizeBytes: 2516582,
    fileType: "pdf",
    category: "Medical & Healthcare",
    subService: "Diagnostic & MRI Reports",
    status: "verified",
    uploadedBy: {
      id: "usr-1",
      name: "John Doe",
      email: "johndoe@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    },
    uploadDate: "14 May 2026, 10:30 AM",
    uploadTimestamp: Date.now() - 172800000,
    isFavorite: true,
    tags: ["MRI", "Brain", "Report"],
    description: "MRI scan report for neurological analysis and clinical review.",
    accessLevel: "private",
    sharedWith: [
      { userId: "cnt-1", name: "Jane Smith", email: "jane@example.com", role: "view" },
      { userId: "cnt-2", name: "Mike Johnson", email: "mike@example.com", role: "view" },
      { userId: "cnt-3", name: "Sarah Brown", email: "sarah@example.com", role: "view" }
    ],
    activityLog: [
      { id: "act-6", action: "Uploaded document", performedBy: "John Doe", timestamp: "14 May 2026, 10:30 AM" },
      { id: "act-7", action: "Shared with 3 doctors", performedBy: "John Doe", timestamp: "14 May 2026, 10:35 AM" }
    ]
  },
  {
    id: "ast-6",
    name: "Lab Report.pdf",
    fileName: "Complete_Blood_Count_Report.pdf",
    fileSize: "1.8 MB",
    fileSizeBytes: 1887436,
    fileType: "pdf",
    category: "Medical & Healthcare",
    subService: "Lab Reports",
    status: "verified",
    uploadedBy: {
      id: "usr-5",
      name: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    uploadDate: "15m ago",
    uploadTimestamp: Date.now() - 900000,
    isFavorite: false,
    tags: ["Blood", "Pathology", "Vitals"],
    description: "Bi-annual lipid and CBC blood panel report.",
    accessLevel: "family",
    sharedWith: [],
    activityLog: [
      { id: "act-8", action: "Uploaded lab test", performedBy: "Jane Smith", timestamp: "Today 10:45 AM" }
    ]
  },
  {
    id: "ast-7",
    name: "Vehicle_RC_Bluebook.jpg",
    fileName: "Vehicle_Registration_Certificate.jpg",
    fileSize: "3.2 MB",
    fileSizeBytes: 3355443,
    fileType: "image",
    category: "Transport & Travel",
    subService: "Vehicle RC & Bluebook",
    status: "verified",
    uploadedBy: {
      id: "usr-1",
      name: "John Doe",
      email: "johndoe@gmail.com"
    },
    uploadDate: "3 days ago",
    uploadTimestamp: Date.now() - 259200000,
    isFavorite: false,
    tags: ["Vehicle", "Transport", "Registration"],
    description: "Official vehicle registration card scan.",
    accessLevel: "private",
    sharedWith: [],
    activityLog: []
  },
  {
    id: "ast-8",
    name: "Degree_Certificate.pdf",
    fileName: "BSc_Computer_Science_Degree.pdf",
    fileSize: "2.1 MB",
    fileSizeBytes: 2202009,
    fileType: "pdf",
    category: "Education & Academics",
    subService: "Certificates & Degrees",
    status: "verified",
    uploadedBy: {
      id: "usr-1",
      name: "John Doe",
      email: "johndoe@gmail.com"
    },
    uploadDate: "5 days ago",
    uploadTimestamp: Date.now() - 432000000,
    isFavorite: true,
    tags: ["Degree", "Academics", "University"],
    description: "Graduation diploma with university seal and registrar signature.",
    accessLevel: "private",
    sharedWith: [],
    activityLog: []
  }
];

export const INITIAL_VERIFICATION_REQUESTS: PaperlessVerificationRequest[] = [
  {
    id: "req-1",
    assetId: "ast-2",
    documentName: "Payment_Receipt_eSewa_NPR5000.png",
    category: "payment_receipts",
    submittedBy: "Liam Clark",
    submitterEmail: "liam.clark@care2care.org",
    date: "2026-08-22 18:20",
    amount: "NPR 5,000",
    status: "pending",
    proofUrl: "/app-icon.jpg",
    notes: "Annual Enterprise Plan activation payment proof."
  },
  {
    id: "req-2",
    assetId: "ast-3",
    documentName: "National_ID_Card_Front_Back.pdf",
    category: "identity_documents",
    submittedBy: "Eleanor Vance",
    submitterEmail: "eleanor.vance@family.com",
    date: "2026-08-22 17:45",
    status: "pending",
    proofUrl: "/app-icon.jpg",
    notes: "Family Admin identity verification."
  },
  {
    id: "req-3",
    assetId: "ast-4",
    documentName: "Corporate_Registration_PAN.pdf",
    category: "business_documents",
    submittedBy: "Dr. Robert Sterling",
    submitterEmail: "robert.sterling@clinic.org",
    date: "2026-08-22 16:10",
    status: "pending",
    proofUrl: "/app-icon.jpg",
    notes: "Clinic registration proof for IRD VAT billing."
  },
  {
    id: "req-4",
    assetId: "ast-5",
    documentName: "Medical_Clinic_License.pdf",
    category: "other_requests",
    submittedBy: "Noah Scott",
    submitterEmail: "noah.scott@health.org",
    date: "2026-08-22 14:05",
    status: "pending",
    proofUrl: "/app-icon.jpg",
    notes: "Caregiver clinic certification renewal."
  }
];
