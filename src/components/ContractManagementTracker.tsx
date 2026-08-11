import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  Shield,
  UserCheck,
  Building,
  Briefcase,
  Home,
  ShoppingBag,
  Heart,
  Lock,
  Globe,
  Upload,
  Camera,
  PenTool,
  Printer,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  DollarSign,
  PieChart,
  BarChart2,
  Info,
  Check,
  FileCheck,
  Languages,
  Award,
  Sliders
} from "lucide-react";
import { Patient } from "../types";
import { PartyBiometricCaptureCard, PartyBiometricData } from "./PartyBiometricCaptureCard";
import { ServiceSetupModal } from "./ServiceSetupModal";

export interface ContractParty {
  fullName: string;
  grandfatherName?: string;
  grandmotherName?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  childrenNames?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  officeBusiness?: string;
  officePosition?: string;
  referredBy?: string;
  citizenshipNo?: string;
  citizenshipIssueDate?: string;
  citizenshipIssueDistrict?: string;
  passportNo?: string;
  passportExpiry?: string;
  drivingLicenseNo?: string;
  nationalIdNo?: string;
  panNo?: string;
  photoUrl?: string;
  signatureData?: string;
  rightThumbData?: string;
  leftThumbData?: string;
  companyStampUrl?: string;
  customFields?: { id: string; label: string; value: string }[];
}

export interface ContractWitness {
  id: string;
  partySide: "first" | "second";
  fullName: string;
  grandfatherName?: string;
  fatherName?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  citizenshipNo?: string;
  passportNo?: string;
  drivingLicenseNo?: string;
  nationalIdNo?: string;
  panNo?: string;
  officeName?: string;
  position?: string;
  photoUrl?: string;
  signatureData?: string;
  leftThumbData?: string;
  rightThumbData?: string;
  thumbSide?: "right" | "left";
  officeStampUrl?: string;
  customFields?: { id: string; label: string; value: string }[];
}

export type ContractType =
  | "loan"
  | "employment"
  | "rental"
  | "service"
  | "partnership"
  | "abroad_job"
  | "sale_purchase"
  | "marriage"
  | "confidentiality"
  | "custom";

export type ContractStatus = "draft" | "pending_signature" | "active" | "expired" | "terminated";

export interface ContractItem {
  id: string;
  contractNumber: string;
  type: ContractType;
  subType: string;
  title: string;
  language: "nepali" | "english";
  status: ContractStatus;
  createdDate: string;
  startDate: string;
  endDate?: string;
  amount?: number;
  currency: string;
  interestRate?: number;
  repaymentFrequency?: string;
  purpose?: string;
  termsAndConditions?: string;
  
  firstPartyRoleTitle: string; // e.g., "ऋणी / Borrower"
  secondPartyRoleTitle: string; // e.g., "साहु / Lender"
  
  firstParty: ContractParty;
  secondParty: ContractParty;
  witnesses: ContractWitness[];
  
  transactionPhotoUrl?: string;
  evidenceVideoNote?: string;
  evidenceAudioNote?: string;
  
  draftedByName?: string;
  draftedByAdvocateCertNo?: string;
  wardRegistrationRequired: boolean;
  isWardRegistered?: boolean;
}

const CONTRACT_TYPE_CONFIG: Record<ContractType, { labelNp: string; labelEn: string; icon: any; color: string; subTypes: string[] }> = {
  loan: {
    labelNp: "ऋण सम्झौता (कपाली तमसुक)",
    labelEn: "Loan Contract",
    icon: DollarSign,
    color: "bg-emerald-500 text-white",
    subTypes: ["Personal Loan", "Business Loan", "Microfinance Loan", "Mortgage Loan"]
  },
  employment: {
    labelNp: "रोजगार सम्झौता",
    labelEn: "Employment Contract",
    icon: Briefcase,
    color: "bg-blue-500 text-white",
    subTypes: ["Permanent Employment", "Contract Employment", "Freelance Agreement", "Internship Agreement"]
  },
  rental: {
    labelNp: "भाडा सम्झौता",
    labelEn: "Rental / Lease Contract",
    icon: Home,
    color: "bg-amber-500 text-white",
    subTypes: ["House/Apartment Rental", "Commercial Space Rental", "Vehicle Rental", "Equipment Rental"]
  },
  service: {
    labelNp: "सेवा सम्झौता",
    labelEn: "Service Agreement",
    icon: ShoppingBag,
    color: "bg-purple-500 text-white",
    subTypes: ["Service Provider Agreement", "Maintenance Contract", "Consulting Agreement", "Outsourcing Agreement"]
  },
  partnership: {
    labelNp: "साझेदारी सम्झौता",
    labelEn: "Partnership Contract",
    icon: Building,
    color: "bg-indigo-500 text-white",
    subTypes: ["Business Partnership", "Joint Venture", "Shareholder Agreement"]
  },
  abroad_job: {
    labelNp: "वैदेशिक रोजगार सम्झौता",
    labelEn: "Abroad Job Promise Agreement",
    icon: Globe,
    color: "bg-cyan-500 text-white",
    subTypes: ["Job Offer Letter", "Employment Promise", "Work Abroad Agreement"]
  },
  sale_purchase: {
    labelNp: "खरीद/बिक्री सम्झौता",
    labelEn: "Sale / Purchase Contract",
    icon: Award,
    color: "bg-rose-500 text-white",
    subTypes: ["Property Sale", "Vehicle Sale", "Goods Sale", "Business Sale"]
  },
  marriage: {
    labelNp: "विवाह सम्झौता",
    labelEn: "Marriage Contract",
    icon: Heart,
    color: "bg-pink-500 text-white",
    subTypes: ["Prenuptial Agreement", "Postnuptial Agreement", "Marriage Settlement"]
  },
  confidentiality: {
    labelNp: "गोपनीयता सम्झौता (NDA)",
    labelEn: "Confidentiality / NDA",
    icon: Lock,
    color: "bg-slate-700 text-white",
    subTypes: ["Non-Disclosure Agreement (NDA)", "Non-Compete Agreement", "Non-Solicitation"]
  },
  custom: {
    labelNp: "अन्य/कस्टम सम्झौता",
    labelEn: "Custom Agreement",
    icon: FileText,
    color: "bg-teal-600 text-white",
    subTypes: ["General Mutual Agreement", "Settlement Deed", "Custom Accord"]
  }
};

const INITIAL_CONTRACTS: ContractItem[] = [
  {
    id: "cnt-101",
    contractNumber: "C2C-2026-0089",
    type: "loan",
    subType: "Personal Loan",
    title: "कपाली तमसुक (व्यक्तिगत ऋण सम्झौता)",
    language: "nepali",
    status: "active",
    createdDate: "2026-01-15",
    startDate: "2026-01-15",
    endDate: "2027-01-15",
    amount: 250000,
    currency: "NPR",
    interestRate: 12,
    repaymentFrequency: "Monthly Interest, Lump Sum Principal",
    purpose: "घरायसी तथा साना व्यवसाय विस्तारका लागि",
    termsAndConditions: "प्रथम पक्षले द्वितीय पक्षबाट रु २५०,०००/- सावाँ नगद बुझिलिएको सत्य साँचो हो। वार्षिक १२% का दरले प्रत्येक महिनाको मसान्तभित्र ब्याज र भाकाभित्र सावाँ चुक्ता गर्ने प्रतिबद्धता व्यक्त गर्दछु।",
    firstPartyRoleTitle: "प्रथम पक्ष (ऋणी/Borrower)",
    secondPartyRoleTitle: "द्वितीय पक्ष (साहु/Lender)",
    firstParty: {
      fullName: "रामबहादुर श्रेष्ठ",
      grandfatherName: "हरिबहादुर श्रेष्ठ",
      grandmotherName: "लक्ष्मीमाया श्रेष्ठ",
      fatherName: "गोपाल श्रेष्ठ",
      motherName: "सुमित्रा श्रेष्ठ",
      spouseName: "गीता श्रेष्ठ",
      childrenNames: "सुजन श्रेष्ठ, अनिता श्रेष्ठ",
      permanentAddress: "काठमाडौँ जिल्ला, काठमाडौँ महानगरपालिका वडा नं. १०",
      temporaryAddress: "काठमाडौँ महानगरपालिका वडा नं. ३१, नयाँ बानेश्वर",
      officeBusiness: "श्रेष्ठ किराना स्टोर",
      officePosition: "प्रोप्राईटर",
      citizenshipNo: "27-01-75-08912",
      citizenshipIssueDate: "2068-04-12",
      citizenshipIssueDistrict: "Kathmandu",
      nationalIdNo: "129-847-920-1",
      panNo: "601928374"
    },
    secondParty: {
      fullName: "कृष्णप्रसाद अधिकारी",
      grandfatherName: "नरबहादुर अधिकारी",
      grandmotherName: "पार्वती अधिकारी",
      fatherName: "दीपक अधिकारी",
      motherName: "सरस्वती अधिकारी",
      spouseName: "रेणुका अधिकारी",
      permanentAddress: "ललितपुर जिल्ला, ललितपुर महानगरपालिका वडा नं. ४",
      temporaryAddress: "ललितपुर महानगरपालिका वडा नं. ४, जावलाखेल",
      officeBusiness: "अधिकारी इन्भेस्टमेन्ट प्रा.लि.",
      officePosition: "प्रबन्ध निर्देशक",
      citizenshipNo: "28-01-70-11029",
      citizenshipIssueDate: "2065-08-20",
      citizenshipIssueDistrict: "Lalitpur",
      panNo: "102938475"
    },
    witnesses: [
      {
        id: "w1",
        partySide: "first",
        fullName: "श्यामकाजी महर्जन",
        grandfatherName: "बुद्धिलाल महर्जन",
        fatherName: "ज्ञानकाजी महर्जन",
        permanentAddress: "काठमाडौँ-१०, बानेश्वर",
        citizenshipNo: "27-01-72-9901"
      },
      {
        id: "w2",
        partySide: "second",
        fullName: "विष्णुप्रसाद पाण्डे",
        grandfatherName: "केशव पाण्डे",
        fatherName: "राजेन्द्र पाण्डे",
        permanentAddress: "ललितपुर-४, जावलाखेल",
        citizenshipNo: "28-02-74-4501"
      }
    ],
    draftedByName: "अधिवक्ता रमेश शर्मा",
    draftedByAdvocateCertNo: "ADV-9081-NBA",
    wardRegistrationRequired: strokeAmountRequiresWard(250000),
    isWardRegistered: true
  },
  {
    id: "cnt-102",
    contractNumber: "C2C-2026-0120",
    type: "employment",
    subType: "Permanent Employment",
    title: "वरिष्ठ हेरचाहकर्ता नियुक्ति सम्झौता पत्र",
    language: "english",
    status: "active",
    createdDate: "2026-02-01",
    startDate: "2026-02-01",
    endDate: "2028-02-01",
    amount: 45000,
    currency: "NPR",
    purpose: "Full-time Elder Care and Medical Assistance Services",
    termsAndConditions: "The Employee agrees to provide dedicated elderly caregiving services including vital sign tracking, medication administration, and companionship. Monthly salary set to NPR 45,000.",
    firstPartyRoleTitle: "Employer / सेवाग्राही",
    secondPartyRoleTitle: "Employee / कर्मचारी",
    firstParty: {
      fullName: "Care2Care Healthcare Services Pvt. Ltd.",
      permanentAddress: "Lazimpat, Kathmandu Ward No. 2",
      panNo: "609812341"
    },
    secondParty: {
      fullName: "Suntali Maya Tamang",
      fatherName: "Som Bahadur Tamang",
      permanentAddress: "Kavrepalanchok, Dhulikhel Ward 3",
      citizenshipNo: "30-01-76-0291",
      nationalIdNo: "901-283-112-9"
    },
    witnesses: [],
    wardRegistrationRequired: false,
    isWardRegistered: false
  },
  {
    id: "cnt-103",
    contractNumber: "C2C-2026-0205",
    type: "rental",
    subType: "Commercial Space Rental",
    title: "व्यापारिक भवन भाडा सम्झौता (Commercial Lease)",
    language: "nepali",
    status: "pending_signature",
    createdDate: "2026-03-01",
    startDate: "2026-03-15",
    endDate: "2029-03-14",
    amount: 75000,
    currency: "NPR",
    purpose: "स्वास्थ्य क्लिनिक तथा थेरापी सेन्टर सञ्चालन गर्न",
    termsAndConditions: "प्रथम पक्ष (घरधनी) ले द्वितीय पक्ष (भाडामा लिने) लाई मासिक रु ७५,०००/- मा २ तलाको व्यावसायिक सटर प्रयोग गर्न दिने गरी सम्झौता गरिएको हो।",
    firstPartyRoleTitle: "प्रथम पक्ष (घरधनी / Landlord)",
    secondPartyRoleTitle: "द्वितीय पक्ष (भाडामा लिने / Tenant)",
    firstParty: {
      fullName: "दिनेशकुमार क्षेत्री",
      permanentAddress: "काठमाडौँ, बालुवाटार वडा नं. ४",
      citizenshipNo: "27-01-65-11092"
    },
    secondParty: {
      fullName: "केयर एन्ड क्योर फिजियोथेरापी क्लिनिक",
      permanentAddress: "काठमाडौँ, महाराजगञ्ज वडा नं. ३",
      panNo: "602189304"
    },
    witnesses: [],
    wardRegistrationRequired: false
  }
];

function strokeAmountRequiresWard(amount?: number): boolean {
  if (!amount) return false;
  return amount >= 500000; // NPR 5 Lakhs legally requires Ward Office registration in Nepal
}

interface Props {
  patient?: Patient;
}

export function ContractManagementTracker({ patient }: Props) {
  // Persistence
  const [contracts, setContracts] = useState<ContractItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_contracts");
      return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
    } catch {
      return INITIAL_CONTRACTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("care2care_contracts", JSON.stringify(contracts));
    } catch (e) {
      console.error("Failed to save contracts", e);
    }
  }, [contracts]);

  // View Navigation
  const [currentScreen, setCurrentScreen] = useState<"dashboard" | "create" | "view" | "analytics">("dashboard");
  const [selectedContractId, setSelectedContractId] = useState<string | null>("cnt-101");
  const [selectedLanguagePreview, setSelectedLanguagePreview] = useState<"nepali" | "english">("nepali");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Create Contract Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [newContractType, setNewContractType] = useState<ContractType>("loan");
  const [newSubType, setNewSubType] = useState<string>("Personal Loan");
  const [newLanguage, setNewLanguage] = useState<"nepali" | "english">("nepali");
  
  // Contract Details Form
  const [newTitle, setNewTitle] = useState("");
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [newEndDate, setNewEndDate] = useState("");
  const [newAmount, setNewAmount] = useState<number | "">("");
  const [newCurrency, setNewCurrency] = useState("NPR");
  const [newInterestRate, setNewInterestRate] = useState<number | "">("");
  const [newRepaymentFreq, setNewRepaymentFreq] = useState("Monthly Interest, Maturity Principal");
  const [newPurpose, setNewPurpose] = useState("");
  const [newTerms, setNewTerms] = useState("");
  const [newDraftedBy, setNewDraftedBy] = useState("");
  const [newAdvocateCertNo, setNewAdvocateCertNo] = useState("");

  // Party Details Form
  const [firstPartyRole, setFirstPartyRole] = useState("प्रथम पक्ष (ऋणी/Borrower)");
  const [firstParty, setFirstParty] = useState<ContractParty>({
    fullName: "",
    grandfatherName: "",
    grandmotherName: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    childrenNames: "",
    permanentAddress: "",
    temporaryAddress: "",
    officeBusiness: "",
    officePosition: "",
    citizenshipNo: "",
    citizenshipIssueDate: "",
    citizenshipIssueDistrict: "",
    passportNo: "",
    passportExpiry: "",
    drivingLicenseNo: "",
    nationalIdNo: "",
    panNo: ""
  });

  const [secondPartyRole, setSecondPartyRole] = useState("द्वितीय पक्ष (साहु/Lender)");
  const [secondParty, setSecondParty] = useState<ContractParty>({
    fullName: "",
    grandfatherName: "",
    grandmotherName: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    childrenNames: "",
    permanentAddress: "",
    temporaryAddress: "",
    officeBusiness: "",
    officePosition: "",
    citizenshipNo: "",
    citizenshipIssueDate: "",
    citizenshipIssueDistrict: "",
    passportNo: "",
    passportExpiry: "",
    drivingLicenseNo: "",
    nationalIdNo: "",
    panNo: ""
  });

  // Witnesses Form
  const [witnesses, setWitnesses] = useState<ContractWitness[]>([
    { id: "w-1", partySide: "first", fullName: "", fatherName: "", permanentAddress: "", citizenshipNo: "" },
    { id: "w-2", partySide: "first", fullName: "", fatherName: "", permanentAddress: "", citizenshipNo: "" },
    { id: "w-3", partySide: "second", fullName: "", fatherName: "", permanentAddress: "", citizenshipNo: "" },
    { id: "w-4", partySide: "second", fullName: "", fatherName: "", permanentAddress: "", citizenshipNo: "" }
  ]);

  // Evidence Photos
  const [transactionPhoto, setTransactionPhoto] = useState<string | undefined>();
  const [videoNote, setVideoNote] = useState("");
  const [audioNote, setAudioNote] = useState("");

  // AI Assistant State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Auto set role titles based on Contract Type
  useEffect(() => {
    if (newContractType === "loan") {
      setFirstPartyRole(newLanguage === "nepali" ? "प्रथम पक्ष (ऋणी)" : "First Party (Borrower)");
      setSecondPartyRole(newLanguage === "nepali" ? "द्वितीय पक्ष (साहु)" : "Second Party (Lender)");
    } else if (newContractType === "employment") {
      setFirstPartyRole(newLanguage === "nepali" ? "प्रथम पक्ष (नियुक्तिकर्ता/रोजगारदाता)" : "First Party (Employer)");
      setSecondPartyRole(newLanguage === "nepali" ? "द्वितीय पक्ष (कर्मचारी)" : "Second Party (Employee)");
    } else if (newContractType === "rental") {
      setFirstPartyRole(newLanguage === "nepali" ? "प्रथम पक्ष (घरधनी/भाडामा दिने)" : "First Party (Landlord)");
      setSecondPartyRole(newLanguage === "nepali" ? "द्वितीय पक्ष (भाडामा लिने)" : "Second Party (Tenant)");
    } else if (newContractType === "service") {
      setFirstPartyRole(newLanguage === "nepali" ? "प्रथम पक्ष (सेवाग्राही/Client)" : "First Party (Client)");
      setSecondPartyRole(newLanguage === "nepali" ? "द्वितीय पक्ष (सेवाप्रदायक)" : "Second Party (Service Provider)");
    } else {
      setFirstPartyRole(newLanguage === "nepali" ? "प्रथम पक्ष (First Party)" : "First Party");
      setSecondPartyRole(newLanguage === "nepali" ? "द्वितीय पक्ष (Second Party)" : "Second Party");
    }
  }, [newContractType, newLanguage]);

  // Handle Save Contract
  const handleSaveContract = () => {
    if (!firstParty.fullName || !secondParty.fullName) {
      alert("Please provide names for both First Party and Second Party!");
      return;
    }

    const numericAmount = typeof newAmount === "number" ? newAmount : undefined;
    const isWardReq = strokeAmountRequiresWard(numericAmount);

    const generatedContractNumber = `C2C-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newContractObj: ContractItem = {
      id: `cnt-${Date.now()}`,
      contractNumber: generatedContractNumber,
      type: newContractType,
      subType: newSubType,
      title: newTitle || `${CONTRACT_TYPE_CONFIG[newContractType].labelNp} - ${firstParty.fullName}`,
      language: newLanguage,
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
      startDate: newStartDate,
      endDate: newEndDate || undefined,
      amount: numericAmount,
      currency: newCurrency,
      interestRate: typeof newInterestRate === "number" ? newInterestRate : undefined,
      repaymentFrequency: newRepaymentFreq,
      purpose: newPurpose,
      termsAndConditions: newTerms || "दुवै पक्ष आपसमा मञ्जुर भई प्रचलित कानुनको अधीनमा रही यो सम्झौता तयार गरिएको छ।",
      firstPartyRoleTitle: firstPartyRole,
      secondPartyRoleTitle: secondPartyRole,
      firstParty,
      secondParty,
      witnesses: witnesses.filter(w => w.fullName.trim().length > 0),
      transactionPhotoUrl: transactionPhoto,
      evidenceVideoNote: videoNote,
      evidenceAudioNote: audioNote,
      draftedByName: newDraftedBy,
      draftedByAdvocateCertNo: newAdvocateCertNo,
      wardRegistrationRequired: isWardReq,
      isWardRegistered: false
    };

    setContracts([newContractObj, ...contracts]);
    setSelectedContractId(newContractObj.id);
    setCurrentScreen("view");
    resetWizardForm();
  };

  const resetWizardForm = () => {
    setWizardStep(1);
    setNewTitle("");
    setNewAmount("");
    setNewInterestRate("");
    setNewPurpose("");
    setNewTerms("");
    setFirstParty({ fullName: "", permanentAddress: "", citizenshipNo: "" });
    setSecondParty({ fullName: "", permanentAddress: "", citizenshipNo: "" });
    setTransactionPhoto(undefined);
  };

  const handleDeleteContract = (id: string) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      setContracts(contracts.filter(c => c.id !== id));
      if (selectedContractId === id) {
        setSelectedContractId(null);
        setCurrentScreen("dashboard");
      }
    }
  };

  const handleRunAiAnalysis = (contract: ContractItem) => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      if (contract.type === "loan") {
        setAiSuggestions(
          `⚖️ **Nepalese Legal Compliance Insights:**\n\n` +
          `1. **Muluki Civil Code 2074 Rules**: Personal loan interest rate is legally capped at **10% - 12% per annum**. Rates exceeding 10% may require specific bank or microfinance authorization.\n` +
          `2. **Mandatory Ward Registration**: ${
            contract.amount && contract.amount >= 500000
              ? "⚠️ **ALERT**: Amount is NPR " + contract.amount.toLocaleString() + " (≥ 5 Lakhs). Legally requires official Ward Office registration (वडा कार्यालय दर्ता) to be enforceable in Nepalese courts."
              : "✓ Amount is under NPR 5 Lakhs, standard notarized signatures apply."
          }\n` +
          `3. **Witness Coverage**: Ensure at least 2 witnesses have attached citizenship copy and thumb impressions.\n` +
          `4. **Fingerprint Validity**: Both left & right thumb impressions on the contract edges are recommended.`
        );
      } else {
        setAiSuggestions(
          `⚖️ **Smart Contract Guidance:**\n\n` +
          `• Title: ${contract.title}\n` +
          `• Standard dispute resolution clause is recommended under Nepal Arbitration Act 2055.\n` +
          `• Both parties have declared verified legal documents.`
        );
      }
    }, 1200);
  };

  // Filtered Contracts
  const filteredContracts = contracts.filter(c => {
    const q = (searchQuery || "").toLowerCase();
    const matchesSearch =
      (c.title || "").toLowerCase().includes(q) ||
      (c.contractNumber || "").toLowerCase().includes(q) ||
      (c.firstParty?.fullName || "").toLowerCase().includes(q) ||
      (c.secondParty?.fullName || "").toLowerCase().includes(q);

    const matchesType = filterType === "all" || c.type === filterType;
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const activeSelectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* TOP HEADER & NAVIGATION BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">📜 Care2Care Contract System</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full">
                Bilingual Legal Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Nepali (कपाली तमसुक) & English Templates • 7-Generation Lineage • Optional Fields • Ward Registration Alert
            </p>
          </div>
        </div>

        {/* SCREEN NAVIGATION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentScreen === "dashboard"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => {
              resetWizardForm();
              setCurrentScreen("create");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentScreen === "create"
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50"
            }`}
          >
            <Plus className="w-4 h-4" /> Create Contract
          </button>
          <button
            onClick={() => setCurrentScreen("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentScreen === "analytics"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <PieChart className="w-4 h-4" /> Analytics & Reports
          </button>
          <button
            onClick={() => setIsSetupOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
            title="Setup Legal Service Features & Options"
          >
            <Sliders className="w-4 h-4 text-amber-400" /> Setup
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {currentScreen === "dashboard" && (
        <div className="space-y-6">
          {/* STATS SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Contracts</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{contracts.length}</p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Recorded
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Contracts</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {contracts.filter(c => c.status === "active").length}
                </p>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">Legally Enforceable</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Signatures</p>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {contracts.filter(c => c.status === "pending_signature").length}
                </p>
                <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting Parties/Witnesses</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ward Req (&ge; 5L)</p>
                <p className="text-2xl font-black text-rose-600 mt-1">
                  {contracts.filter(c => c.wardRegistrationRequired).length}
                </p>
                <span className="text-[11px] text-rose-600 font-bold mt-1 block">वडा कार्यालय दर्ता</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contract, party name, or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 font-semibold">Type:</span>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {Object.entries(CONTRACT_TYPE_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 font-semibold">Status:</span>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending_signature">Pending Signature</option>
                  <option value="draft">Draft</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* CONTRACTS LIST TABLE / GRID */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Recorded Legal Contracts & Deeds
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredContracts.length} of {contracts.length}
              </span>
            </div>

            {filteredContracts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <FileText className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">No contracts match your search filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                    setFilterStatus("all");
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredContracts.map(contract => {
                  const typeCfg = CONTRACT_TYPE_CONFIG[contract.type];
                  const Icon = typeCfg.icon;

                  return (
                    <div
                      key={contract.id}
                      className="p-4 sm:p-5 hover:bg-slate-50/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-3 rounded-xl ${typeCfg.color} shadow-xs mt-0.5 shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {contract.contractNumber}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                contract.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : contract.status === "pending_signature"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {contract.status.replace("_", " ")}
                            </span>
                            {contract.wardRegistrationRequired && (
                              <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Building className="w-3 h-3" /> Ward Reg Required
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900">{contract.title}</h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>
                              <strong>Party A:</strong> {contract.firstParty.fullName}
                            </span>
                            <span>•</span>
                            <span>
                              <strong>Party B:</strong> {contract.secondParty.fullName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        {contract.amount !== undefined && (
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium">Contract Value</p>
                            <p className="text-sm font-black text-slate-800">
                              {contract.currency} {(contract.amount || 0).toLocaleString()}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedContractId(contract.id);
                              setCurrentScreen("view");
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => handleDeleteContract(contract.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete"
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

      {/* ========================================================================= */}
      {/* SCREEN 2: CREATE CONTRACT WIZARD */}
      {/* ========================================================================= */}
      {currentScreen === "create" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
          {/* WIZARD HEADER */}
          <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step {wizardStep} of 8</span>
              <h2 className="text-lg font-black mt-0.5">
                {wizardStep === 1 && "1. Select Contract Type & Category"}
                {wizardStep === 2 && "2. Choose Template Language"}
                {wizardStep === 3 && `3. First Party Details (${firstPartyRole} - Party A)`}
                {wizardStep === 4 && `4. Second Party Details (${secondPartyRole} - Party B)`}
                {wizardStep === 5 && "5. Value, Financial Terms & Schedule"}
                {wizardStep === 6 && "6. Legal Witness Records (Party A & B Sides)"}
                {wizardStep === 7 && "7. Evidence, Handover & Legal Drafter Details"}
                {wizardStep === 8 && "8. Final Review & Save Legal Deed"}
              </h2>
            </div>
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Cancel & Exit
            </button>
          </div>

          {/* WIZARD PROGRESS BAR */}
          <div className="w-full bg-slate-100 h-1.5">
            <div
              className="bg-emerald-500 h-1.5 transition-all duration-300"
              style={{ width: `${(wizardStep / 8) * 100}%` }}
            />
          </div>

          {/* STEP BADGES NAVIGATION PILLS */}
          <div className="flex items-center overflow-x-auto gap-1.5 bg-slate-100 p-2 border-b border-slate-200 scrollbar-none">
            {[
              { step: 1, label: "1. Type" },
              { step: 2, label: "2. Language" },
              { step: 3, label: `3. Party A (${firstPartyRole.slice(0, 8)})` },
              { step: 4, label: `4. Party B (${secondPartyRole.slice(0, 8)})` },
              { step: 5, label: "5. Terms" },
              { step: 6, label: "6. Witnesses" },
              { step: 7, label: "7. Evidence" },
              { step: 8, label: "8. Review & Save" }
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setWizardStep(s.step)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  wizardStep === s.step
                    ? "bg-emerald-600 text-white shadow-xs"
                    : wizardStep > s.step
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-white text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* STEP 1: CONTRACT TYPE */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Choose the type of legal agreement:</h3>
                  <p className="text-xs text-slate-500">Select a contract template to automatically populate legal clauses.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(CONTRACT_TYPE_CONFIG).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isSelected = newContractType === key;

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setNewContractType(key as ContractType);
                          setNewSubType(cfg.subTypes[0]);
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${cfg.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">{cfg.labelNp}</p>
                            <p className="text-[11px] text-slate-500">{cfg.labelEn}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="pt-2 border-t border-emerald-200/60">
                            <label className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">
                              Select Sub-Type:
                            </label>
                            <select
                              value={newSubType}
                              onChange={e => setNewSubType(e.target.value)}
                              className="w-full text-xs bg-white border border-emerald-300 rounded-lg p-1.5 font-semibold text-slate-800 focus:outline-none"
                            >
                              {cfg.subTypes.map(st => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: LANGUAGE SELECTION */}
            {wizardStep === 2 && (
              <div className="space-y-6 max-w-xl mx-auto py-4">
                <div className="text-center space-y-2">
                  <Languages className="w-12 h-12 mx-auto text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900">Select Legal Template Language</h3>
                  <p className="text-xs text-slate-500">
                    Care2Care generates authentic Nepalese Legal format (मञ्जुरीनामा तथा कपाली तमसुक) or standard international English contracts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setNewLanguage("nepali")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all text-center space-y-2 ${
                      newLanguage === "nepali"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-3xl">🇳🇵</span>
                    <h4 className="text-sm font-black text-slate-900">नेपाली (Nepali Template)</h4>
                    <p className="text-[11px] text-slate-500">
                      मुलुकी देवानी संहिता अनुसार कपाली तमसुक, ७ पुस्ताको विवरण र वडा दर्ता व्यवस्था सहित।
                    </p>
                  </div>

                  <div
                    onClick={() => setNewLanguage("english")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all text-center space-y-2 ${
                      newLanguage === "english"
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-3xl">🇬🇧</span>
                    <h4 className="text-sm font-black text-slate-900">English Template</h4>
                    <p className="text-[11px] text-slate-500">
                      Standard English Deed of Acknowledgment, clear terms, and legal witness signature clauses.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PARTY A DETAILS */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" /> First Party ({firstPartyRole} - Party A)
                    </h3>
                    <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                      Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (पूरा नाम) *</label>
                      <input
                        type="text"
                        value={firstParty.fullName}
                        onChange={e => setFirstParty({ ...firstParty, fullName: e.target.value })}
                        placeholder="e.g. Ram Bahadur Shrestha"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Father's Name (बुबाको नाम)</label>
                      <input
                        type="text"
                        value={firstParty.fatherName || ""}
                        onChange={e => setFirstParty({ ...firstParty, fatherName: e.target.value })}
                        placeholder="Father Name"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Grandfather's Name (बाजेको नाम)</label>
                      <input
                        type="text"
                        value={firstParty.grandfatherName || ""}
                        onChange={e => setFirstParty({ ...firstParty, grandfatherName: e.target.value })}
                        placeholder="Grandfather Name"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Permanent Address (स्थायी ठेगाना)</label>
                      <input
                        type="text"
                        value={firstParty.permanentAddress || ""}
                        onChange={e => setFirstParty({ ...firstParty, permanentAddress: e.target.value })}
                        placeholder="District, Municipality, Ward No."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Citizenship No. (नागरिकता नं.)</label>
                      <input
                        type="text"
                        value={firstParty.citizenshipNo || ""}
                        onChange={e => setFirstParty({ ...firstParty, citizenshipNo: e.target.value })}
                        placeholder="27-01-75-XXXX"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">PAN / NID No.</label>
                      <input
                        type="text"
                        value={firstParty.panNo || ""}
                        onChange={e => setFirstParty({ ...firstParty, panNo: e.target.value })}
                        placeholder="PAN or National ID"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* PARTY A BIOMETRIC CAPTURE & CUSTOM FILLERS */}
                  <div className="pt-3 border-t border-slate-200/80 space-y-3">
                    <PartyBiometricCaptureCard
                      partyTitle={`${firstPartyRole} Photo & Biometric Records`}
                      partyRoleSubtitle="Attach photo of Party A identity record, signature & thumb impressions"
                      accentColor="emerald"
                      data={{
                        photoUrl: firstParty.photoUrl,
                        signatureData: firstParty.signatureData,
                        leftThumbData: firstParty.leftThumbData,
                        rightThumbData: firstParty.rightThumbData
                      }}
                      onChange={(bio) => {
                        setFirstParty({
                          ...firstParty,
                          photoUrl: bio.photoUrl,
                          signatureData: bio.signatureData,
                          leftThumbData: bio.leftThumbData,
                          rightThumbData: bio.rightThumbData
                        });
                      }}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Party A Custom Deed Fillers</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newF = { id: `cf-${Date.now()}`, label: "", value: "" };
                          setFirstParty({ ...firstParty, customFields: [...(firstParty.customFields || []), newF] });
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Detail Filler
                      </button>
                    </div>

                    {/* Party A Custom Fillers List */}
                    {(firstParty.customFields || []).length > 0 && (
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <p className="text-[11px] font-black uppercase text-slate-600 tracking-wider">Party A Custom Fillers ({firstParty.customFields?.length}):</p>
                        {firstParty.customFields?.map((cf) => (
                          <div key={cf.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Field Name (e.g. Land Plot No, Spouse Father)"
                              value={cf.label}
                              onChange={(e) => {
                                const updated = (firstParty.customFields || []).map(f => f.id === cf.id ? { ...f, label: e.target.value } : f);
                                setFirstParty({ ...firstParty, customFields: updated });
                              }}
                              className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Field Value / Specification"
                              value={cf.value}
                              onChange={(e) => {
                                const updated = (firstParty.customFields || []).map(f => f.id === cf.id ? { ...f, value: e.target.value } : f);
                                setFirstParty({ ...firstParty, customFields: updated });
                              }}
                              className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (firstParty.customFields || []).filter(f => f.id !== cf.id);
                                setFirstParty({ ...firstParty, customFields: updated });
                              }}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PARTY B DETAILS */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" /> Second Party ({secondPartyRole} - Party B)
                    </h3>
                    <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                      Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (पूरा नाम) *</label>
                      <input
                        type="text"
                        value={secondParty.fullName}
                        onChange={e => setSecondParty({ ...secondParty, fullName: e.target.value })}
                        placeholder="e.g. Krishna Prasad Adhikari"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Father's Name (बुबाको नाम)</label>
                      <input
                        type="text"
                        value={secondParty.fatherName || ""}
                        onChange={e => setSecondParty({ ...secondParty, fatherName: e.target.value })}
                        placeholder="Father Name"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Grandfather's Name (बाजेको नाम)</label>
                      <input
                        type="text"
                        value={secondParty.grandfatherName || ""}
                        onChange={e => setSecondParty({ ...secondParty, grandfatherName: e.target.value })}
                        placeholder="Grandfather Name"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Permanent Address (स्थायी ठेगाना)</label>
                      <input
                        type="text"
                        value={secondParty.permanentAddress || ""}
                        onChange={e => setSecondParty({ ...secondParty, permanentAddress: e.target.value })}
                        placeholder="District, Municipality, Ward No."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Citizenship No. (नागरिकता नं.)</label>
                      <input
                        type="text"
                        value={secondParty.citizenshipNo || ""}
                        onChange={e => setSecondParty({ ...secondParty, citizenshipNo: e.target.value })}
                        placeholder="28-01-70-XXXX"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">PAN / NID No.</label>
                      <input
                        type="text"
                        value={secondParty.panNo || ""}
                        onChange={e => setSecondParty({ ...secondParty, panNo: e.target.value })}
                        placeholder="PAN or National ID"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* PARTY B BIOMETRIC CAPTURE & CUSTOM FILLERS */}
                  <div className="pt-3 border-t border-slate-200/80 space-y-3">
                    <PartyBiometricCaptureCard
                      partyTitle={`${secondPartyRole} Photo & Biometric Records`}
                      partyRoleSubtitle="Attach photo of Party B identity record, signature & thumb impressions"
                      accentColor="indigo"
                      data={{
                        photoUrl: secondParty.photoUrl,
                        signatureData: secondParty.signatureData,
                        leftThumbData: secondParty.leftThumbData,
                        rightThumbData: secondParty.rightThumbData
                      }}
                      onChange={(bio) => {
                        setSecondParty({
                          ...secondParty,
                          photoUrl: bio.photoUrl,
                          signatureData: bio.signatureData,
                          leftThumbData: bio.leftThumbData,
                          rightThumbData: bio.rightThumbData
                        });
                      }}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Party B Custom Deed Fillers</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newF = { id: `cf-${Date.now()}`, label: "", value: "" };
                          setSecondParty({ ...secondParty, customFields: [...(secondParty.customFields || []), newF] });
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Detail Filler
                      </button>
                    </div>

                    {/* Party B Custom Fillers List */}
                    {(secondParty.customFields || []).length > 0 && (
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <p className="text-[11px] font-black uppercase text-slate-600 tracking-wider">Party B Custom Fillers ({secondParty.customFields?.length}):</p>
                        {secondParty.customFields?.map((cf) => (
                          <div key={cf.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Field Name (e.g. Bank Account, Witness Relation)"
                              value={cf.label}
                              onChange={(e) => {
                                const updated = (secondParty.customFields || []).map(f => f.id === cf.id ? { ...f, label: e.target.value } : f);
                                setSecondParty({ ...secondParty, customFields: updated });
                              }}
                              className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Field Value / Specification"
                              value={cf.value}
                              onChange={(e) => {
                                const updated = (secondParty.customFields || []).map(f => f.id === cf.id ? { ...f, value: e.target.value } : f);
                                setSecondParty({ ...secondParty, customFields: updated });
                              }}
                              className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (secondParty.customFields || []).filter(f => f.id !== cf.id);
                                setSecondParty({ ...secondParty, customFields: updated });
                              }}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: CONTRACT TERMS */}
            {wizardStep === 5 && (
              <div className="space-y-5 max-w-3xl mx-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contract Title (सम्झौताको शीर्षक)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder={`e.g. ${CONTRACT_TYPE_CONFIG[newContractType].labelNp}`}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Amount / Value (रकम)</label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value ? Number(e.target.value) : "")}
                      placeholder="e.g. 500000"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Currency</label>
                    <select
                      value={newCurrency}
                      onChange={e => setNewCurrency(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                    >
                      <option value="NPR">NPR (रु.)</option>
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  {newContractType === "loan" && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Annual Interest % (ब्याजदर)</label>
                      <input
                        type="number"
                        value={newInterestRate}
                        onChange={e => setNewInterestRate(e.target.value ? Number(e.target.value) : "")}
                        placeholder="e.g. 10 (Max 12%)"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* WARD REGISTRATION WARNING IF >= 5 LAKHS */}
                {typeof newAmount === "number" && newAmount >= 500000 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
                    <Building className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">⚠️ वडा कार्यालय दर्ता अनिवार्य (Ward Registration Alert)</p>
                      <p className="text-[11px] mt-0.5 text-rose-700">
                        नेपालको कानुन बमोजिम रु. ५ लाख वा सोभन्दा बढीको कपाली तमसुक/व्यक्तिगत ऋण सम्झौतालाई सम्बन्धित वडा कार्यालयमा दर्ता गराउनु अनिवार्य छ।
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Start Date (मिति)</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={e => setNewStartDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Repayment/End Date (भाका मिति)</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={e => setNewEndDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Purpose / Objective (उद्देश्य)</label>
                  <input
                    type="text"
                    value={newPurpose}
                    onChange={e => setNewPurpose(e.target.value)}
                    placeholder="e.g. घरायसी तथा व्यापारिक व्यवहार चलाउन"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Terms & Clauses (सर्तहरू)</label>
                  <textarea
                    rows={4}
                    value={newTerms}
                    onChange={e => setNewTerms(e.target.value)}
                    placeholder="Enter customized agreement clauses or terms..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: WITNESS MANAGEMENT */}
            {wizardStep === 6 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Witness Details (साक्षीहरू):</h3>
                  <p className="text-xs text-slate-500">Provide details for witnesses representing both parties.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {witnesses.map((w, idx) => (
                    <div key={w.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          👤 Witness {idx + 1} ({w.partySide === "first" ? "Party A Side" : "Party B Side"})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {w.id}</span>
                      </div>

                      {/* WITNESS BIOMETRICS */}
                      <PartyBiometricCaptureCard
                        partyTitle={`Witness ${idx + 1} (${w.partySide === "first" ? "Party A Side" : "Party B Side"})`}
                        partyRoleSubtitle="Attach photo of witness identity record, signature & thumb impressions"
                        accentColor="cyan"
                        data={{
                          photoUrl: w.photoUrl,
                          signatureData: w.signatureData,
                          leftThumbData: w.leftThumbData,
                          rightThumbData: w.rightThumbData
                        }}
                        onChange={(bio) => {
                          const updated = [...witnesses];
                          updated[idx] = {
                            ...updated[idx],
                            photoUrl: bio.photoUrl,
                            signatureData: bio.signatureData,
                            leftThumbData: bio.leftThumbData,
                            rightThumbData: bio.rightThumbData
                          };
                          setWitnesses(updated);
                        }}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block">Full Name *</label>
                          <input
                            type="text"
                            value={w.fullName}
                            onChange={e => {
                              const updated = [...witnesses];
                              updated[idx].fullName = e.target.value;
                              setWitnesses(updated);
                            }}
                            placeholder="Witness Name"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block">Citizenship No.</label>
                          <input
                            type="text"
                            value={w.citizenshipNo || ""}
                            onChange={e => {
                              const updated = [...witnesses];
                              updated[idx].citizenshipNo = e.target.value;
                              setWitnesses(updated);
                            }}
                            placeholder="Citizenship #"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block">Father's Name</label>
                          <input
                            type="text"
                            value={w.fatherName || ""}
                            onChange={e => {
                              const updated = [...witnesses];
                              updated[idx].fatherName = e.target.value;
                              setWitnesses(updated);
                            }}
                            placeholder="Father Name"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block">Address</label>
                          <input
                            type="text"
                            value={w.permanentAddress || ""}
                            onChange={e => {
                              const updated = [...witnesses];
                              updated[idx].permanentAddress = e.target.value;
                              setWitnesses(updated);
                            }}
                            placeholder="Address / District"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      {/* WITNESS CUSTOM FILLERS */}
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-700">Custom Witness Detail Fillers</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...witnesses];
                              const cfList = updated[idx].customFields || [];
                              updated[idx].customFields = [...cfList, { id: `wcf-${Date.now()}`, label: "", value: "" }];
                              setWitnesses(updated);
                            }}
                            className="py-1 px-2 bg-slate-800 text-amber-300 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Witness Detail
                          </button>
                        </div>

                        {(w.customFields || []).map((cf) => (
                          <div key={cf.id} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Detail Label (e.g. Phone, Relation)"
                              value={cf.label}
                              onChange={(e) => {
                                const updated = [...witnesses];
                                updated[idx].customFields = (updated[idx].customFields || []).map(f => f.id === cf.id ? { ...f, label: e.target.value } : f);
                                setWitnesses(updated);
                              }}
                              className="flex-1 text-[11px] p-1.5 rounded-md border border-slate-200 bg-white font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Detail Value"
                              value={cf.value}
                              onChange={(e) => {
                                const updated = [...witnesses];
                                updated[idx].customFields = (updated[idx].customFields || []).map(f => f.id === cf.id ? { ...f, value: e.target.value } : f);
                                setWitnesses(updated);
                              }}
                              className="flex-1 text-[11px] p-1.5 rounded-md border border-slate-200 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...witnesses];
                                updated[idx].customFields = (updated[idx].customFields || []).filter(f => f.id !== cf.id);
                                setWitnesses(updated);
                              }}
                              className="p-1.5 bg-rose-50 text-rose-600 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: EVIDENCE & SIGNATURES */}
            {wizardStep === 7 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-center space-y-1">
                  <Camera className="w-10 h-10 mx-auto text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-900">Evidence & Signature Captures</h3>
                  <p className="text-xs text-slate-500">Attach photos of parties/transaction for enhanced transparency.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-xs font-bold text-slate-700">Transaction/Handover Photo (लेनदेन/सम्झौता फोटो):</p>
                  {transactionPhoto ? (
                    <div className="relative w-48 h-32 mx-auto rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm">
                      <img src={transactionPhoto} alt="Transaction" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setTransactionPhoto(undefined)}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setTransactionPhoto("https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80")}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-2 mx-auto"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" /> Capture / Upload Photo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Drafted By Advocate / Drafter Name</label>
                    <input
                      type="text"
                      value={newDraftedBy}
                      onChange={e => setNewDraftedBy(e.target.value)}
                      placeholder="e.g. Advocate Ramesh Sharma"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Advocate Cert / License No.</label>
                    <input
                      type="text"
                      value={newAdvocateCertNo}
                      onChange={e => setNewAdvocateCertNo(e.target.value)}
                      placeholder="e.g. ADV-9081"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: REVIEW & FINAL SAVE */}
            {wizardStep === 8 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-black text-sm">Ready to Finalize Legal Deed!</p>
                      <p className="text-xs text-emerald-700">Please review key contract summary points before saving.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-emerald-200 text-slate-800 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Agreement Type</p>
                      <p className="font-bold text-slate-900">{CONTRACT_TYPE_CONFIG[newContractType]?.labelNp} ({newSubType})</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Template Language</p>
                      <p className="font-bold text-slate-900">{newLanguage === "nepali" ? "🇳🇵 नेपाली (Muluki Civil Code)" : "🇬🇧 English"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">{firstPartyRole} (Party A)</p>
                      <p className="font-bold text-slate-900">{firstParty.fullName || "Not Specified"}</p>
                      {firstParty.citizenshipNo && <p className="text-[11px] text-slate-500">Citizenship: {firstParty.citizenshipNo}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">{secondPartyRole} (Party B)</p>
                      <p className="font-bold text-slate-900">{secondParty.fullName || "Not Specified"}</p>
                      {secondParty.citizenshipNo && <p className="text-[11px] text-slate-500">Citizenship: {secondParty.citizenshipNo}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Contract Amount & Interest</p>
                      <p className="font-bold text-slate-900">
                        {newAmount ? `${newCurrency} ${Number(newAmount).toLocaleString()}` : "N/A"}
                        {newInterestRate ? ` @ ${newInterestRate}% p.a.` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Witnesses & Drafter</p>
                      <p className="font-bold text-slate-900">
                        {witnesses.filter(w => w.fullName.trim().length > 0).length} Witnesses Registered
                      </p>
                      {newDraftedBy && <p className="text-[11px] text-slate-500">Drafter: {newDraftedBy}</p>}
                    </div>
                  </div>

                  {typeof newAmount === "number" && newAmount >= 500000 && (
                    <div className="bg-rose-100 text-rose-800 p-3 rounded-xl border border-rose-300 text-xs font-bold flex items-center gap-2">
                      <Building className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Note: Contract value is ≥ 5 Lakhs. Ward Registration (वडा दर्ता) notice will be attached automatically.</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveContract}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Save & Generate Legal Contract
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WIZARD FOOTER NAVIGATION */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <button
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back Step
              </button>

              {wizardStep < 8 ? (
                <button
                  onClick={() => setWizardStep(prev => Math.min(8, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveContract}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-md flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Confirm & Save Contract
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: CONTRACT DETAILS & LIVE LEGAL PREVIEW */}
      {/* ========================================================================= */}
      {currentScreen === "view" && activeSelectedContract && (
        <div className="space-y-6">
          {/* CONTROLS HEADER */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSelectedLanguagePreview("nepali")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLanguagePreview === "nepali" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  🇳🇵 नेपाली
                </button>
                <button
                  onClick={() => setSelectedLanguagePreview("english")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLanguagePreview === "english" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>

              <button
                onClick={() => handleRunAiAnalysis(activeSelectedContract)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-purple-700"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Legal Audit
              </button>
            </div>
          </div>

          {/* AI SUGGESTIONS BANNER */}
          {aiAnalyzing && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
              <span>Analyzing contract terms against Nepal Muluki Civil Code 2074...</span>
            </div>
          )}

          {aiSuggestions && !aiAnalyzing && (
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs space-y-2 relative">
              <button
                onClick={() => setAiSuggestions(null)}
                className="absolute top-3 right-3 text-purple-400 hover:text-purple-800 text-xs"
              >
                ✕
              </button>
              <p className="font-black text-purple-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" /> Care2Care AI Compliance Audit
              </p>
              <div className="whitespace-pre-wrap leading-relaxed text-purple-900 font-medium">
                {aiSuggestions}
              </div>
            </div>
          )}

          {/* FORMAL LEGAL PAPER DOCUMENT DISPLAY */}
          <div className="bg-amber-50/20 border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 font-serif text-slate-900 max-w-4xl mx-auto">
            {/* DOCUMENT TITLE */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-900">
                {selectedLanguagePreview === "nepali"
                  ? "मञ्जुरीनामा तथा कपाली तमसुक (सम्झौता पत्र)"
                  : "LOAN AGREEMENT & DEED OF ACKNOWLEDGMENT"}
              </h1>
              <p className="text-xs font-mono font-bold text-slate-600">
                {selectedLanguagePreview === "nepali" ? "लिखत नं.: " : "Deed Reference No.: "}
                {activeSelectedContract.contractNumber}
              </p>
            </div>

            {/* PARTIES STATEMENT WITH CUSTOM PHOTOS & CUSTOM FILLERS */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800 font-sans">
              <div className="p-4 bg-white/90 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-slate-900 font-serif">
                      {selectedLanguagePreview === "nepali" ? "लिखितम् (First Party Declaration)" : "THIS DEED IS EXECUTED BY AND BETWEEN:"}
                    </p>
                    <p>
                      <strong>{activeSelectedContract.firstPartyRoleTitle}:</strong> {activeSelectedContract.firstParty.fullName}
                      {activeSelectedContract.firstParty.fatherName && `, बुबा: ${activeSelectedContract.firstParty.fatherName}`}
                      {activeSelectedContract.firstParty.grandfatherName && `, बाजे: ${activeSelectedContract.firstParty.grandfatherName}`}
                      {activeSelectedContract.firstParty.permanentAddress && `, ठेगाना: ${activeSelectedContract.firstParty.permanentAddress}`}
                      {activeSelectedContract.firstParty.citizenshipNo && `, नागरिकता नं.: ${activeSelectedContract.firstParty.citizenshipNo}`}।
                    </p>
                  </div>

                  {activeSelectedContract.firstParty.photoUrl && (
                    <img
                      src={activeSelectedContract.firstParty.photoUrl}
                      alt="First Party"
                      className="w-16 h-16 rounded-lg object-cover border-2 border-emerald-600 shadow-sm shrink-0"
                    />
                  )}
                </div>

                {/* First Party Custom Fillers */}
                {(activeSelectedContract.firstParty.customFields || []).length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                    {activeSelectedContract.firstParty.customFields?.map((cf) => (
                      <span key={cf.id} className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                        <strong>{cf.label}:</strong> {cf.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white/90 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <p>
                      <strong>{activeSelectedContract.secondPartyRoleTitle}:</strong> {activeSelectedContract.secondParty.fullName}
                      {activeSelectedContract.secondParty.fatherName && `, बुबा: ${activeSelectedContract.secondParty.fatherName}`}
                      {activeSelectedContract.secondParty.grandfatherName && `, बाजे: ${activeSelectedContract.secondParty.grandfatherName}`}
                      {activeSelectedContract.secondParty.permanentAddress && `, ठेगाना: ${activeSelectedContract.secondParty.permanentAddress}`}
                      {activeSelectedContract.secondParty.citizenshipNo && `, नागरिकता नं.: ${activeSelectedContract.secondParty.citizenshipNo}`}।
                    </p>
                  </div>

                  {activeSelectedContract.secondParty.photoUrl && (
                    <img
                      src={activeSelectedContract.secondParty.photoUrl}
                      alt="Second Party"
                      className="w-16 h-16 rounded-lg object-cover border-2 border-emerald-600 shadow-sm shrink-0"
                    />
                  )}
                </div>

                {/* Second Party Custom Fillers */}
                {(activeSelectedContract.secondParty.customFields || []).length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                    {activeSelectedContract.secondParty.customFields?.map((cf) => (
                      <span key={cf.id} className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                        <strong>{cf.label}:</strong> {cf.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TERMS & CONDITIONS CLAUSES */}
            <div className="space-y-3 border-t border-slate-300 pt-4 text-xs sm:text-sm">
              <h3 className="font-black text-slate-900 text-sm">
                {selectedLanguagePreview === "nepali" ? "सम्झौताका मुख्य सर्तहरू (Key Terms & Conditions):" : "Terms & Conditions:"}
              </h3>
              <p className="leading-relaxed whitespace-pre-wrap bg-white/60 p-4 rounded-xl border border-slate-200 font-sans">
                {activeSelectedContract.termsAndConditions}
              </p>
            </div>

            {/* WITNESS SECTION */}
            {activeSelectedContract.witnesses.length > 0 && (
              <div className="border-t border-slate-300 pt-4 space-y-3">
                <h3 className="font-black text-slate-900 text-sm">
                  {selectedLanguagePreview === "nepali" ? "रोहवरका साक्षीहरू (Witnesses in Presence):" : "Witnesses in Presence:"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  {activeSelectedContract.witnesses.map((w, i) => (
                    <div key={w.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">
                             Witness {i + 1} ({w.partySide === "first" ? "Party A Side" : "Party B Side"}): {w.fullName}
                          </p>
                          {w.fatherName && <p className="text-slate-600 text-[11px]">Father: {w.fatherName}</p>}
                          {w.permanentAddress && <p className="text-slate-600 text-[11px]">Address: {w.permanentAddress}</p>}
                          {w.citizenshipNo && <p className="text-slate-600 text-[11px]">Citizenship: {w.citizenshipNo}</p>}
                        </div>
                        {w.photoUrl && (
                          <img
                            src={w.photoUrl}
                            alt="Witness Photo"
                            className="w-12 h-12 rounded-lg object-cover border border-cyan-500 shrink-0 shadow-2xs"
                          />
                        )}
                      </div>

                      {/* Custom Witness Fillers */}
                      {(w.customFields || []).length > 0 && (
                        <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px]">
                          {w.customFields?.map((cf) => (
                            <span key={cf.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                              <strong>{cf.label}:</strong> {cf.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WARD REGISTRATION REMINDER BOX */}
            {activeSelectedContract.wardRegistrationRequired && (
              <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl text-rose-950 text-xs space-y-1 font-sans">
                <p className="font-black text-rose-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-rose-600" /> नेपालको कानुन बमोजिम सूचना (Ward Office Registration Mandatory)
                </p>
                <p className="text-[11px] leading-relaxed">
                  यो लेनदेन रु. ५ लाख वा सोभन्दा बढी भएकाले मुलुकी देवानी संहिता अनुसार स्थानीय वडा कार्यालयमा दर्ता गराउनु अनिवार्य छ।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: ANALYTICS & REPORTS */}
      {/* ========================================================================= */}
      {currentScreen === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-emerald-600" /> Contract System Analytics
                </h2>
                <p className="text-xs text-slate-500">Legal Portfolio Breakdown & Financial Metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <p className="text-xs font-bold text-emerald-800 uppercase">Total Active Loan Volume</p>
                <p className="text-2xl font-black text-emerald-900">
                  NPR{" "}
                  {contracts
                    .filter(c => c.type === "loan" && c.amount)
                    .reduce((acc, c) => acc + (c.amount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <p className="text-xs font-bold text-blue-800 uppercase">Active Employment Contracts</p>
                <p className="text-2xl font-black text-blue-900">
                  {contracts.filter(c => c.type === "employment").length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <p className="text-xs font-bold text-amber-800 uppercase">Pending Signature Tasks</p>
                <p className="text-2xl font-black text-amber-900">
                  {contracts.filter(c => c.status === "pending_signature").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE SETUP MODAL */}
      <ServiceSetupModal
        serviceId="contract"
        serviceName="Contract & Deed Management"
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
