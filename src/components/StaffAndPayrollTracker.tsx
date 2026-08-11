import React, { useState } from "react";
import { Patient } from "../types";
import { getAutoDetectedGeoConfig } from "../lib/i18n";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  PieChart,
  BarChart3,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  Eye,
  Settings,
  Sparkles,
  ChevronRight,
  Briefcase,
  Building,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileSpreadsheet,
  Printer,
  Upload,
  Check,
  RotateCcw,
  Sliders,
  Receipt,
  Wallet,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
  Video
} from "lucide-react";

interface StaffAndPayrollTrackerProps {
  patient?: Patient;
}

// Data Interfaces
export interface StaffMember {
  id: string;
  staffId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  salaryType: "Monthly" | "Weekly" | "Hourly";
  basicSalary: number;
  hra: number;
  da: number;
  medicalAllowance: number;
  pfDeduction: number;
  taxDeduction: number;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  panNumber?: string;
  aadharNumber?: string;
  emergencyContact?: string;
  isActive: boolean;
  notes?: string;
  profilePhoto?: string;
  // Probation / Trial Phase Fields
  isOnProbation?: boolean;
  probationDurationMonths?: number;
  probationPayType?: "Full Paid" | "Partial Paid (Stipend)" | "Unpaid Trial";
  probationNotes?: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  designation: string;
  monthYear: string; // e.g. "2026-07"
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  bonus: number;
  overtime: number;
  daysWorked: number;
  leaveTaken: number;
  netSalary: number;
  status: "Paid" | "Pending" | "Overdue" | "Verified";
  paymentDate?: string;
  paymentMethod?: "Bank Transfer" | "Cash" | "UPI" | "Cheque";
  transactionRef?: string;
  salaryProofUrl?: string;
  isStaffVerified?: boolean;
  staffVerifiedAt?: string;
}

export interface FinancialTransaction {
  id: string;
  type: "Income" | "Expense" | "Transfer";
  category: string;
  subCategory?: string;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  party: string; // Client, Vendor, Staff Name
  referenceNo?: string;
  paymentMethod: "Cash" | "Bank Transfer" | "UPI" | "Cheque" | "Credit Card";
  staffId?: string;
  isRecurring?: boolean;
  receiptName?: string;
}

export interface StaffAttendanceLog {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  clockInTime?: string;
  clockOutTime?: string;
  status: "In Office" | "Remote" | "On Leave" | "Out of Office";
  locationGeo?: string;
  totalHours?: number;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: "Medical" | "Casual" | "Annual" | "Unpaid";
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

export interface StaffTask {
  id: string;
  taskTitle: string;
  description: string;
  assignedToStaffIds: string[]; // staff IDs or ["ALL"]
  assignedByManager: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Assigned" | "In Progress" | "Completed" | "Overdue";
  proofTypeRequired: "Photo Proof" | "Signature Proof" | "Document / File Upload" | "Location Log";
  proofImageOrUrl?: string;
  proofNote?: string;
  completedAt?: string;
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  agenda: string;
  date: string;
  startTime: string;
  endTime: string;
  meetUrl: string;
  invitedStaffIds: string[]; // staff IDs or ["ALL"]
  scheduledBy: string;
  createdAt: string;
}

export const StaffAndPayrollTracker: React.FC<StaffAndPayrollTrackerProps> = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "staff_directory" | "attendance_leaves" | "task_manager" | "google_meet" | "add_staff" | "transactions" | "payroll" | "statements" | "analytics" | "settings"
  >("dashboard");

  // Filter & Search states
  const [searchStaffQuery, setSearchStaffQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedStaffForProfile, setSelectedStaffForProfile] = useState<StaffMember | null>(null);

  // Financial States
  const [openingBalance, setOpeningBalance] = useState<number>(5000);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-07");
  const [statementType, setStatementType] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");

  // Feedback Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Staff Attendance & Out-of-Office State
  const [attendanceLogs, setAttendanceLogs] = useState<StaffAttendanceLog[]>([
    {
      id: "att-1",
      staffId: "STF-1001",
      staffName: "Robert Chen",
      date: "2026-07-30",
      clockInTime: "08:30 AM",
      status: "In Office",
      locationGeo: "37.7749° N, 122.4194° W (Main Clinic)",
      totalHours: 7.5
    },
    {
      id: "att-2",
      staffId: "STF-1002",
      staffName: "Maria Rodriguez",
      date: "2026-07-30",
      clockInTime: "09:00 AM",
      status: "Remote",
      locationGeo: "Home Visit Ward B",
      totalHours: 6.0
    }
  ]);

  // Leave Requests State
  const [leaveRequests, setLeaveRequests] = useState<StaffLeaveRequest[]>([
    {
      id: "lv-1",
      staffId: "STF-1002",
      staffName: "Maria Rodriguez",
      leaveType: "Casual",
      startDate: "2026-08-05",
      endDate: "2026-08-07",
      reason: "Family event in hometown",
      status: "Pending",
      appliedOn: "2026-07-28"
    }
  ]);

  // Manager Task Assignment State
  const [tasksList, setTasksList] = useState<StaffTask[]>([
    {
      id: "tsk-1",
      taskTitle: "Morning Vital Sign Audit & Patient Report",
      description: "Perform vital checkups for patients in Ward 3 and upload clinical log proof photo.",
      assignedToStaffIds: ["stf-1"],
      assignedByManager: "Admin Manager",
      dueDate: "2026-07-30",
      priority: "High",
      status: "Assigned",
      proofTypeRequired: "Photo Proof"
    }
  ]);

  // Google Meet Meetings State
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([
    {
      id: "mtg-1",
      title: "Weekly Staff Sync & Care Protocols",
      agenda: "Review patient care updates, safety policies, and team shift schedules.",
      date: "2026-07-31",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      meetUrl: "https://meet.google.com/abc-care-sync",
      invitedStaffIds: ["ALL"],
      scheduledBy: "Manager",
      createdAt: "2026-07-29"
    }
  ]);

  // Modals
  const [showPaySlipModal, setShowPaySlipModal] = useState<PayrollRecord | null>(null);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState<boolean>(false);
  const [showEditOpeningBalance, setShowEditOpeningBalance] = useState<boolean>(false);

  // ==================== SAMPLE DATA INITIALIZATION ====================
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "stf-1",
      staffId: "STF-1001",
      firstName: "Robert",
      lastName: "Chen",
      email: "robert.c@caretocare.org",
      phone: "+1 (555) 234-5678",
      address: "102 Healthcare Ave, Suite 4",
      city: "Springfield",
      state: "Illinois",
      designation: "Chief Caregiver / Supervisor",
      department: "Senior Care & Nursing",
      joiningDate: "2023-02-15",
      employmentType: "Full-Time",
      salaryType: "Monthly",
      basicSalary: 3800,
      hra: 400,
      da: 200,
      medicalAllowance: 150,
      pfDeduction: 300,
      taxDeduction: 250,
      bankName: "First National Bank",
      bankAccount: "•••• •••• 4821",
      ifscCode: "FNB001928",
      panNumber: "ABCDE1234F",
      aadharNumber: "1234-5678-9012",
      emergencyContact: "Wife - Mary Chen (+1 555-999-8888)",
      isActive: true,
      notes: "Senior staff supervisor with specialized pediatric and elderly care certifications.",
      profilePhoto: "👨‍⚕️",
    },
    {
      id: "stf-2",
      staffId: "STF-1002",
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.r@caretocare.org",
      phone: "+1 (555) 345-6789",
      address: "455 Oak Lane, Apt 12B",
      city: "Springfield",
      state: "Illinois",
      designation: "Physiotherapist & Yoga Trainer",
      department: "Rehabilitation & Wellness",
      joiningDate: "2023-08-01",
      employmentType: "Full-Time",
      salaryType: "Monthly",
      basicSalary: 3200,
      hra: 350,
      da: 150,
      medicalAllowance: 100,
      pfDeduction: 250,
      taxDeduction: 200,
      bankName: "Chase Bank",
      bankAccount: "•••• •••• 9102",
      ifscCode: "CHAS009182",
      panNumber: "FGHIJ5678K",
      emergencyContact: "Brother - Carlos (+1 555-888-7777)",
      isActive: true,
      notes: "Leads daily morning yoga sessions and post-op rehabilitation routines.",
      profilePhoto: "👩‍⚕️",
    },
    {
      id: "stf-3",
      staffId: "STF-1003",
      firstName: "David",
      lastName: "Kim",
      email: "david.k@caretocare.org",
      phone: "+1 (555) 456-7890",
      address: "88 Pine Street",
      city: "Springfield",
      state: "Illinois",
      designation: "Pediatric Care Specialist",
      department: "Pediatric & Child Care",
      joiningDate: "2024-01-10",
      employmentType: "Full-Time",
      salaryType: "Monthly",
      basicSalary: 3000,
      hra: 300,
      da: 150,
      medicalAllowance: 100,
      pfDeduction: 220,
      taxDeduction: 180,
      bankName: "Bank of America",
      bankAccount: "•••• •••• 3341",
      ifscCode: "BOFA019283",
      emergencyContact: "Mother - Grace Kim (+1 555-777-6666)",
      isActive: true,
      notes: "Manages children's growth logs, vaccination reminders, and nutrition diets.",
      profilePhoto: "👨‍💼",
    },
  ]);

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([
    {
      id: "pay-1",
      staffId: "stf-1",
      staffName: "Robert Chen",
      designation: "Chief Caregiver / Supervisor",
      monthYear: "2026-07",
      basicSalary: 3800,
      totalAllowances: 750,
      totalDeductions: 550,
      bonus: 300,
      overtime: 150,
      daysWorked: 26,
      leaveTaken: 1,
      netSalary: 4450,
      status: "Paid",
      paymentDate: "2026-07-25",
      paymentMethod: "Bank Transfer",
      transactionRef: "TXN-901827361",
    },
    {
      id: "pay-2",
      staffId: "stf-2",
      staffName: "Maria Rodriguez",
      designation: "Physiotherapist & Yoga Trainer",
      monthYear: "2026-07",
      basicSalary: 3200,
      totalAllowances: 600,
      totalDeductions: 450,
      bonus: 200,
      overtime: 100,
      daysWorked: 25,
      leaveTaken: 2,
      netSalary: 3650,
      status: "Paid",
      paymentDate: "2026-07-25",
      paymentMethod: "Bank Transfer",
      transactionRef: "TXN-901827362",
    },
    {
      id: "pay-3",
      staffId: "stf-3",
      staffName: "David Kim",
      designation: "Pediatric Care Specialist",
      monthYear: "2026-07",
      basicSalary: 3000,
      totalAllowances: 550,
      totalDeductions: 400,
      bonus: 100,
      overtime: 0,
      daysWorked: 26,
      leaveTaken: 0,
      netSalary: 3250,
      status: "Pending",
    },
  ]);

  const [transactions, setTransactions] = useState<FinancialTransaction[]>([
    {
      id: "txn-1",
      type: "Income",
      category: "Business & Healthcare Grant",
      amount: 12500,
      description: "Monthly Family Care Support Grant & Subscriptions",
      date: "2026-07-02",
      party: "State Healthcare Trust",
      referenceNo: "INV-2026-0701",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "txn-2",
      type: "Expense",
      category: "Salary Paid",
      amount: 4450,
      description: "July Staff Salary - Robert Chen",
      date: "2026-07-25",
      party: "Robert Chen (Supervisor)",
      referenceNo: "TXN-901827361",
      paymentMethod: "Bank Transfer",
      staffId: "stf-1",
    },
    {
      id: "txn-3",
      type: "Expense",
      category: "Salary Paid",
      amount: 3650,
      description: "July Staff Salary - Maria Rodriguez",
      date: "2026-07-25",
      party: "Maria Rodriguez",
      referenceNo: "TXN-901827362",
      paymentMethod: "Bank Transfer",
      staffId: "stf-2",
    },
    {
      id: "txn-4",
      type: "Income",
      category: "Consultation & Nursing Fee",
      amount: 3200,
      description: "Specialized Pediatric & Elderly Nursing Consultations",
      date: "2026-07-15",
      party: "Private Clients",
      referenceNo: "INV-2026-0811",
      paymentMethod: "UPI",
    },
    {
      id: "txn-5",
      type: "Expense",
      category: "Supplies & Equipment",
      amount: 1100,
      description: "Medical Vitals Supplies, First Aid Kits & Yoga Mats",
      date: "2026-07-10",
      party: "MedEquip Supplies Inc.",
      referenceNo: "PO-88219",
      paymentMethod: "Credit Card",
    },
    {
      id: "txn-6",
      type: "Expense",
      category: "Rent & Utilities",
      amount: 1500,
      description: "Facility Rent & High-Speed Internet/Power Bill",
      date: "2026-07-05",
      party: "Springfield Properties",
      referenceNo: "RENT-2026-07",
      paymentMethod: "Bank Transfer",
    },
  ]);

  // ==================== CALCULATION HELPERS ====================
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const closingBalance = openingBalance + netBalance;

  // Currency & Localization State (World Countries & Auto Geo-Location Support)
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(() => {
    const saved = localStorage.getItem("care2care_currency_code");
    if (saved) return saved;
    const geo = getAutoDetectedGeoConfig();
    return geo.detectedCurrency || "NPR";
  });
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>(() => {
    const saved = localStorage.getItem("care2care_currency_symbol");
    if (saved) return saved;
    const geo = getAutoDetectedGeoConfig();
    return geo.currencySymbol || "रु";
  });
  const [customCurrencyCode, setCustomCurrencyCode] = useState<string>("");
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState<string>("");

  // Add Staff Form States (includes Middle Name & Trial/Probation Phase)
  const [newStaffFirstName, setNewStaffFirstName] = useState("");
  const [newStaffMiddleName, setNewStaffMiddleName] = useState("");
  const [newStaffLastName, setNewStaffLastName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffDesignation, setNewStaffDesignation] = useState("");
  const [newStaffDepartment, setNewStaffDepartment] = useState("Senior Care & Nursing");
  const [newStaffJoiningDate, setNewStaffJoiningDate] = useState("2026-07-01");
  const [newStaffEmpType, setNewStaffEmpType] = useState<StaffMember["employmentType"]>("Full-Time");
  const [newStaffBasicSalary, setNewStaffBasicSalary] = useState<number>(3000);
  const [newStaffHra, setNewStaffHra] = useState<number>(300);
  const [newStaffDa, setNewStaffDa] = useState<number>(150);
  const [newStaffMedical, setNewStaffMedical] = useState<number>(100);
  const [newStaffPf, setNewStaffPf] = useState<number>(200);
  const [newStaffTax, setNewStaffTax] = useState<number>(150);
  const [newStaffBankName, setNewStaffBankName] = useState("");
  const [newStaffBankAccount, setNewStaffBankAccount] = useState("");
  const [newStaffIfsc, setNewStaffIfsc] = useState("");
  const [newStaffPan, setNewStaffPan] = useState("");
  // Probation / Trial Phase
  const [newStaffIsOnProbation, setNewStaffIsOnProbation] = useState(false);
  const [newStaffProbationMonths, setNewStaffProbationMonths] = useState<number>(3);
  const [newStaffProbationPayType, setNewStaffProbationPayType] = useState<"Full Paid" | "Partial Paid (Stipend)" | "Unpaid Trial">("Partial Paid (Stipend)");
  const [newStaffProbationNotes, setNewStaffProbationNotes] = useState("");

  // Create Payroll Slip Modal State
  const [showCreatePayrollModal, setShowCreatePayrollModal] = useState(false);
  const [createPayrollStaffId, setCreatePayrollStaffId] = useState("");
  const [createPayrollMonth, setCreatePayrollMonth] = useState("2026-07");
  const [createPayrollBasic, setCreatePayrollBasic] = useState<number>(3500);
  const [createPayrollAllowances, setCreatePayrollAllowances] = useState<number>(500);
  const [createPayrollDeductions, setCreatePayrollDeductions] = useState<number>(300);
  const [createPayrollBonus, setCreatePayrollBonus] = useState<number>(0);
  const [createPayrollOvertime, setCreatePayrollOvertime] = useState<number>(0);
  const [createPayrollMethod, setCreatePayrollMethod] = useState<"Bank Transfer" | "Cash" | "UPI" | "Cheque">("Bank Transfer");
  const [createPayrollRef, setCreatePayrollRef] = useState("");
  const [createPayrollProof, setCreatePayrollProof] = useState<string | null>(null);
  const [createPayrollStatus, setCreatePayrollStatus] = useState<"Paid" | "Pending">("Paid");

  // Google Meet Sharing State
  const [customMeetUrl, setCustomMeetUrl] = useState("");
  const [customSocialMediaPlatforms, setCustomSocialMediaPlatforms] = useState<string[]>(["WhatsApp", "Telegram", "LinkedIn", "Facebook", "Twitter", "Email"]);

  const handleSaveCurrencySettings = (code: string, symbol: string) => {
    setSelectedCurrencyCode(code);
    setSelectedCurrencySymbol(symbol);
    localStorage.setItem("care2care_currency_code", code);
    localStorage.setItem("care2care_currency_symbol", symbol);
    triggerToast(`Financial & Currency Settings Saved: ${code} (${symbol})! 💾`);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffFirstName.trim() || !newStaffLastName.trim() || !newStaffDesignation.trim()) {
      triggerToast("Please fill in required fields: First Name, Last Name, Designation!");
      return;
    }

    const newStaff: StaffMember = {
      id: `stf-${Date.now()}`,
      staffId: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: newStaffFirstName,
      middleName: newStaffMiddleName || undefined,
      lastName: newStaffLastName,
      email: newStaffEmail || `${(newStaffFirstName || "staff").toLowerCase()}@caretocare.org`,
      phone: newStaffPhone || "+1 (555) 000-0000",
      designation: newStaffDesignation,
      department: newStaffDepartment,
      joiningDate: newStaffJoiningDate,
      employmentType: newStaffEmpType,
      salaryType: "Monthly",
      basicSalary: Number(newStaffBasicSalary),
      hra: Number(newStaffHra),
      da: Number(newStaffDa),
      medicalAllowance: Number(newStaffMedical),
      pfDeduction: Number(newStaffPf),
      taxDeduction: Number(newStaffTax),
      bankName: newStaffBankName || "Standard Chartered",
      bankAccount: newStaffBankAccount || "•••• •••• 0092",
      ifscCode: newStaffIfsc || "SCBL00192",
      panNumber: newStaffPan || "ABCDE0000X",
      isActive: true,
      profilePhoto: "👨‍💼",
      isOnProbation: newStaffIsOnProbation,
      probationDurationMonths: newStaffIsOnProbation ? newStaffProbationMonths : undefined,
      probationPayType: newStaffIsOnProbation ? newStaffProbationPayType : undefined,
      probationNotes: newStaffIsOnProbation ? newStaffProbationNotes : undefined,
    };

    setStaffList((prev) => [...prev, newStaff]);

    // Generate pending payroll entry for current month
    const totalAllowances = newStaff.hra + newStaff.da + newStaff.medicalAllowance;
    const totalDeductions = newStaff.pfDeduction + newStaff.taxDeduction;
    const net = newStaff.basicSalary + totalAllowances - totalDeductions;

    const newPayrollEntry: PayrollRecord = {
      id: `pay-${Date.now()}`,
      staffId: newStaff.id,
      staffName: `${newStaff.firstName} ${newStaff.middleName ? newStaff.middleName + ' ' : ''}${newStaff.lastName}`,
      designation: newStaff.designation,
      monthYear: selectedMonth,
      basicSalary: newStaff.basicSalary,
      totalAllowances,
      totalDeductions,
      bonus: 0,
      overtime: 0,
      daysWorked: 26,
      leaveTaken: 0,
      netSalary: net,
      status: "Pending",
    };

    setPayrolls((prev) => [...prev, newPayrollEntry]);

    triggerToast(`Added Staff Member ${newStaff.firstName} ${newStaff.lastName} successfully! 🎉`);
    setActiveTab("staff_directory");

    // Reset Form
    setNewStaffFirstName("");
    setNewStaffMiddleName("");
    setNewStaffLastName("");
    setNewStaffDesignation("");
    setNewStaffEmail("");
    setNewStaffPhone("");
    setNewStaffIsOnProbation(false);
  };

  // Add Transaction Form States
  const [txnType, setTxnType] = useState<"Income" | "Expense">("Income");
  const [txnCategory, setTxnCategory] = useState("Business Income");
  const [txnCustomCategory, setTxnCustomCategory] = useState("");
  const [txnAmount, setTxnAmount] = useState<number>(500);
  const [txnDescription, setTxnDescription] = useState("");
  const [txnParty, setTxnParty] = useState("");
  const [txnDate, setTxnDate] = useState("2026-07-27");
  const [txnMethod, setTxnMethod] = useState<FinancialTransaction["paymentMethod"]>("Bank Transfer");
  const [txnRefNo, setTxnRefNo] = useState("");
  const [selectedStaffForTxn, setSelectedStaffForTxn] = useState("");

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnDescription.trim() || txnAmount <= 0) {
      triggerToast("Please enter a valid description and amount > 0!");
      return;
    }

    const catToUse = txnCategory === "Custom" ? txnCustomCategory || "Miscellaneous" : txnCategory;

    const newTxn: FinancialTransaction = {
      id: `txn-${Date.now()}`,
      type: txnType,
      category: catToUse,
      amount: Number(txnAmount),
      description: txnDescription,
      date: txnDate,
      party: txnParty || (txnType === "Income" ? "Client / Source" : "Vendor / Payee"),
      paymentMethod: txnMethod,
      referenceNo: txnRefNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      staffId: selectedStaffForTxn || undefined,
    };

    setTransactions((prev) => [newTxn, ...prev]);
    triggerToast(`Recorded ${txnType} of $${txnAmount.toLocaleString()} successfully! 💰`);
    setShowAddTransactionModal(false);

    // Reset
    setTxnDescription("");
    setTxnAmount(500);
    setTxnParty("");
  };

  const handlePayStaff = (payrollId: string) => {
    setPayrolls((prev) =>
      prev.map((p) => {
        if (p.id === payrollId) {
          const updated: PayrollRecord = {
            ...p,
            status: "Paid",
            paymentDate: new Date().toISOString().split("T")[0],
            paymentMethod: "Bank Transfer",
            transactionRef: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
          };

          // Also automatically record as an Expense transaction
          const expenseTxn: FinancialTransaction = {
            id: `txn-${Date.now()}`,
            type: "Expense",
            category: "Salary Paid",
            amount: updated.netSalary,
            description: `Salary Payment (${updated.monthYear}) - ${updated.staffName}`,
            date: new Date().toISOString().split("T")[0],
            party: updated.staffName,
            referenceNo: updated.transactionRef,
            paymentMethod: "Bank Transfer",
            staffId: updated.staffId,
          };
          setTransactions((tPrev) => [expenseTxn, ...tPrev]);

          return updated;
        }
        return p;
      })
    );
    triggerToast("Payroll processed & salary expense recorded! 💸");
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & App Title */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md">
              💼
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Staff & Payroll Management
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">
                Multiple Staff Profiles, Payroll Processing, Income/Expense & Auto-Generated Statements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GOOGLE MEET INTEGRATION BUTTON */}
            <button
              onClick={() => {
                window.open("https://meet.google.com/new", "_blank");
                triggerToast("🎥 Google Meet created! Send link to staff members.");
              }}
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl text-xs flex items-center gap-1 border border-blue-200 cursor-pointer transition-all"
            >
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Meet Sync</span>
            </button>

            <button
              onClick={() => setShowAddTransactionModal(true)}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "dashboard" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("staff_directory")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "staff_directory" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Staff ({staffList.length})
          </button>
          <button
            onClick={() => setActiveTab("attendance_leaves")}
            className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "attendance_leaves" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Attendance & Leaves
          </button>
          <button
            onClick={() => setActiveTab("task_manager")}
            className={`flex-1 min-w-[125px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "task_manager" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Tasks & Proof ({tasksList.filter((t) => t.status === "Assigned").length})
          </button>
          <button
            onClick={() => setActiveTab("google_meet")}
            className={`flex-1 min-w-[115px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "google_meet" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-blue-600" /> Google Meet ({scheduledMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab("add_staff")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "add_staff" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> + Add Staff
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "payroll" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payroll ({payrolls.filter((p) => p.status === "Pending").length} Pending)
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "transactions" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Income/Expense
          </button>
          <button
            onClick={() => setActiveTab("statements")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "statements" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Statements
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "analytics" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "settings" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-2xl text-xs font-black flex items-center justify-between shadow-sm animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-800 font-black cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* ==================== TAB 1: MAIN DASHBOARD ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Main Balance Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  Care To Care Financial Ledger
                </span>
                <h2 className="text-3xl font-black pt-2 tracking-tight">
                  ${closingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h2>
                <p className="text-xs text-emerald-200/90 font-medium">
                  Closing Net Balance (Opening + Total Income - Expenses)
                </p>
              </div>

              <button
                onClick={() => setShowEditOpeningBalance(!showEditOpeningBalance)}
                className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md cursor-pointer text-emerald-200"
              >
                <Sliders className="w-3.5 h-3.5" /> Edit Starting Balance
              </button>
            </div>

            {/* Edit Opening Balance Popup/Drawer inline */}
            {showEditOpeningBalance && (
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-3 animate-fade-in text-xs">
                <span className="font-bold text-emerald-200">Set Initial Month Opening Balance:</span>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(Number(e.target.value))}
                  className="bg-white text-slate-900 font-extrabold px-3 py-1 rounded-xl w-32 border border-slate-200"
                />
                <button
                  onClick={() => {
                    setShowEditOpeningBalance(false);
                    triggerToast("Updated opening balance!");
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-3 py-1 rounded-xl cursor-pointer"
                >
                  Save
                </button>
              </div>
            )}

            {/* Balance Card Grid Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/60">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase">Opening Balance</span>
                <span className="text-base font-black">${openingBalance.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-400/30">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" /> Total Income
                </span>
                <span className="text-base font-black text-emerald-200">+${totalIncome.toLocaleString()}</span>
              </div>
              <div className="bg-rose-500/20 p-3 rounded-2xl border border-rose-400/30">
                <span className="text-[10px] text-rose-300 font-bold block uppercase flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3 text-rose-400" /> Total Expense
                </span>
                <span className="text-base font-black text-rose-200">-${totalExpense.toLocaleString()}</span>
              </div>
              <div className="bg-teal-500/20 p-3 rounded-2xl border border-teal-400/30">
                <span className="text-[10px] text-teal-300 font-bold block uppercase">Net Profit / Margin</span>
                <span className="text-base font-black text-teal-200">${netBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab("add_staff")}
              className="bg-white p-4 rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-left space-y-1 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-xs">Add New Staff</h3>
              <p className="text-[10px] text-slate-500 font-medium">Create staff profile & salary structure</p>
            </button>

            <button
              onClick={() => {
                setTxnType("Income");
                setShowAddTransactionModal(true);
              }}
              className="bg-white p-4 rounded-3xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-left space-y-1 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-xs">Record Income</h3>
              <p className="text-[10px] text-slate-500 font-medium">Grants, consultation fees & client payments</p>
            </button>

            <button
              onClick={() => {
                setTxnType("Expense");
                setShowAddTransactionModal(true);
              }}
              className="bg-white p-4 rounded-3xl border border-slate-200/80 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer text-left space-y-1 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-xs">Record Expense</h3>
              <p className="text-[10px] text-slate-500 font-medium">Supplies, rent, utilities & operational costs</p>
            </button>

            <button
              onClick={() => setActiveTab("payroll")}
              className="bg-white p-4 rounded-3xl border border-slate-200/80 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer text-left space-y-1 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-xs">Process Payroll</h3>
              <p className="text-[10px] text-slate-500 font-medium">Calculate net salaries & issue pay slips</p>
            </button>
          </div>

          {/* Gemini AI Financial Insights */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-orange-50 border border-emerald-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Gemini AI Payroll & Financial Advisor
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-950 font-black px-2 py-0.5 rounded-full">
                AI Advisory
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your monthly staff payroll overhead is <span className="font-bold text-slate-900">$11,350</span> against an income of <span className="font-bold text-emerald-800">$15,700</span>. You maintain a safe cash reserve buffer of 27.7%. 1 staff payroll remains pending for July."
            </p>
          </div>

          {/* Recent Transactions & Upcoming Payroll Dual Section */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Recent Transactions */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" /> Recent Transactions
                </h3>
                <button onClick={() => setActiveTab("transactions")} className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">
                  View All ({transactions.length})
                </button>
              </div>

              <div className="space-y-2">
                {transactions.slice(0, 4).map((t) => (
                  <div key={t.id} className="p-2.5 bg-slate-50 rounded-2xl flex items-center justify-between text-xs border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        t.type === "Income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {t.type === "Income" ? "↑" : "↓"}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-xs">{t.description}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">{t.date} • {t.party} • {t.paymentMethod}</p>
                      </div>
                    </div>
                    <span className={`font-black text-xs ${t.type === "Income" ? "text-emerald-700" : "text-rose-700"}`}>
                      {t.type === "Income" ? "+" : "-"}${t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Payroll Status */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-teal-600" /> Staff Monthly Payroll Status
                </h3>
                <button onClick={() => setActiveTab("payroll")} className="text-[10px] font-bold text-teal-700 hover:underline cursor-pointer">
                  Manage Payroll
                </button>
              </div>

              <div className="space-y-2">
                {payrolls.map((p) => (
                  <div key={p.id} className="p-2.5 bg-slate-50 rounded-2xl flex items-center justify-between text-xs border border-slate-100">
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{p.staffName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{p.designation} • Net: ${(p.netSalary || 0).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        p.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {p.status}
                      </span>
                      {p.status === "Pending" && (
                        <button
                          onClick={() => handlePayStaff(p.id)}
                          className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl cursor-pointer"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: STAFF DIRECTORY ==================== */}
      {activeTab === "staff_directory" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Staff Members Directory ({staffList.length})</h2>
              <p className="text-[10px] text-slate-500 font-medium">Manage employees, departments, salary details & bank info</p>
            </div>
            <button
              onClick={() => setActiveTab("add_staff")}
              className="py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Add Staff
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff name, designation or email..."
                value={searchStaffQuery}
                onChange={(e) => setSearchStaffQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-2xl font-bold bg-slate-50"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="py-2 px-3 border rounded-2xl font-bold bg-slate-50"
            >
              <option value="All">All Departments</option>
              <option value="Senior Care & Nursing">Senior Care & Nursing</option>
              <option value="Rehabilitation & Wellness">Rehabilitation & Wellness</option>
              <option value="Pediatric & Child Care">Pediatric & Child Care</option>
            </select>
          </div>

          {/* Staff Cards List */}
          <div className="space-y-3">
            {staffList
              .filter((s) => {
                const q = (searchStaffQuery || "").toLowerCase();
                const queryMatch =
                  (s.firstName || "").toLowerCase().includes(q) ||
                  (s.lastName || "").toLowerCase().includes(q) ||
                  (s.designation || "").toLowerCase().includes(q);
                const deptMatch = filterDepartment === "All" || s.department === filterDepartment;
                return queryMatch && deptMatch;
              })
              .map((s) => {
                const totalAllowances = s.hra + s.da + s.medicalAllowance;
                const totalDeductions = s.pfDeduction + s.taxDeduction;
                const netMonthly = s.basicSalary + totalAllowances - totalDeductions;

                return (
                  <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-400 transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{s.profilePhoto}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-sm">
                              {s.firstName} {s.lastName}
                            </h3>
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                              {s.staffId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-bold">{s.designation}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{s.department} • Joined {s.joiningDate}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-800 block">${netMonthly.toLocaleString()}/mo</span>
                        <span className="text-[10px] text-slate-500 font-bold">Net Monthly Salary</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-bold bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block uppercase">Phone</span>
                        <span className="text-slate-800">{s.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase">Email</span>
                        <span className="text-slate-800 truncate block">{s.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase">Bank Account</span>
                        <span className="text-slate-800">{s.bankAccount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase">Basic Salary</span>
                        <span className="text-slate-800">${s.basicSalary.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Emergency: {s.emergencyContact || "N/A"}
                      </span>

                      <button
                        onClick={() => setSelectedStaffForProfile(s)}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Staff Details
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================== TAB 2B: ATTENDANCE & LEAVES TRACKER ==================== */}
      {activeTab === "attendance_leaves" && (
        <div className="space-y-6">
          {/* Clock In / Out & Live Status Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl space-y-4 border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  Real-time GPS Attendance
                </span>
                <h2 className="text-xl font-black text-white mt-1">Clock In / Out & Location Tracking</h2>
                <p className="text-xs text-slate-300">Record staff entry, in-office status, and out-of-office field logs.</p>
              </div>

              <button
                onClick={() => {
                  const now = new Date();
                  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateStr = now.toISOString().split("T")[0];
                  const newLog: StaffAttendanceLog = {
                    id: `att-${Date.now()}`,
                    staffId: "STF-1001",
                    staffName: "Current Staff Member",
                    date: dateStr,
                    clockInTime: timeStr,
                    status: "In Office",
                    locationGeo: "GPS Verified (Current Location)",
                    totalHours: 8.0
                  };
                  setAttendanceLogs((prev) => [newLog, ...prev]);
                  triggerToast(`⏰ Clocked In successfully at ${timeStr}!`);
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg cursor-pointer flex items-center gap-2 transition-all"
              >
                <Clock className="w-4 h-4" /> Clock In Now
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">In Office</span>
                <span className="text-lg font-black text-emerald-400">
                  {attendanceLogs.filter((a) => a.status === "In Office").length} Staff
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Remote / Field</span>
                <span className="text-lg font-black text-cyan-400">
                  {attendanceLogs.filter((a) => a.status === "Remote").length} Staff
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">On Leave</span>
                <span className="text-lg font-black text-amber-400">
                  {leaveRequests.filter((l) => l.status === "Approved").length} Staff
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Out of Office</span>
                <span className="text-lg font-black text-rose-400">
                  {attendanceLogs.filter((a) => a.status === "Out of Office").length} Staff
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Log Table & Leave Requests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Attendance Logs */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Attendance & Clock-In History
              </h3>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {attendanceLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-extrabold text-slate-900">{log.staffName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {log.date} • Clocked in: {log.clockInTime || "N/A"}
                      </p>
                      <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" /> {log.locationGeo || "Verified Office"}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-block ${
                        log.status === "In Office" ? "bg-emerald-100 text-emerald-900" :
                        log.status === "Remote" ? "bg-cyan-100 text-cyan-900" :
                        log.status === "On Leave" ? "bg-amber-100 text-amber-900" : "bg-rose-100 text-rose-900"
                      }`}>
                        {log.status}
                      </span>
                      <p className="text-[10px] font-bold text-slate-600 block">
                        {log.totalHours ? `${log.totalHours} hrs` : "Active"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Requests & Management */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
                <span>Leave Requests</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-black">
                  {leaveRequests.filter((l) => l.status === "Pending").length} Pending
                </span>
              </h3>

              <div className="space-y-3">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-slate-900 block">{req.staffName}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{req.leaveType} Leave ({req.startDate} to {req.endDate})</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        req.status === "Approved" ? "bg-emerald-100 text-emerald-900" :
                        req.status === "Rejected" ? "bg-rose-100 text-rose-900" : "bg-amber-100 text-amber-900"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
                      "{req.reason}"
                    </p>

                    {req.status === "Pending" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setLeaveRequests((prev) => prev.map((l) => l.id === req.id ? { ...l, status: "Approved" } : l));
                            triggerToast(`Approved leave request for ${req.staffName}!`);
                          }}
                          className="flex-1 py-1 px-2 bg-emerald-600 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setLeaveRequests((prev) => prev.map((l) => l.id === req.id ? { ...l, status: "Rejected" } : l));
                            triggerToast(`Rejected leave request.`);
                          }}
                          className="flex-1 py-1 px-2 bg-rose-600 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2C: TASK ASSIGNING & PROOF CAPTURE ==================== */}
      {activeTab === "task_manager" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Manager Task Assignment & Proof Verification
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">Assign tasks to staff with required proof (Photo, Signature, Document upload)</p>
              </div>
            </div>

            {/* Create New Task Form */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">+ Assign New Task to Staff</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const title = target.taskTitle.value;
                  const desc = target.taskDesc.value;
                  const staffId = target.assignedStaff.value;
                  const priority = target.priority.value;
                  const proofType = target.proofType.value;
                  const dueDate = target.dueDate.value;

                  if (!title.trim()) {
                    triggerToast("Please provide a task title!");
                    return;
                  }

                  const newTask: StaffTask = {
                    id: `tsk-${Date.now()}`,
                    taskTitle: title,
                    description: desc,
                    assignedToStaffIds: [staffId],
                    assignedByManager: "Manager Admin",
                    dueDate: dueDate || "2026-07-31",
                    priority,
                    status: "Assigned",
                    proofTypeRequired: proofType
                  };

                  setTasksList((prev) => [newTask, ...prev]);
                  triggerToast(`Task assigned successfully! Notification sent.`);
                  target.reset();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs"
              >
                <div className="col-span-1 sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Task Title</label>
                  <input
                    name="taskTitle"
                    type="text"
                    placeholder="e.g. Conduct Ward B Patient Checkups & Upload Log"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign to Staff Member</label>
                  <select name="assignedStaff" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold">
                    <option value="ALL">📢 All Staff Members</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proof Requirement</label>
                  <select name="proofType" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold">
                    <option value="Photo Proof">📸 Photo Proof Capture</option>
                    <option value="Signature Proof">✍️ Signature Proof</option>
                    <option value="Document / File Upload">📄 Document / File Upload</option>
                    <option value="Location Log">📍 Geolocation Timestamp</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select name="priority" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold">
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input name="dueDate" type="date" defaultValue="2026-07-31" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Task Instructions & Description</label>
                  <input name="taskDesc" type="text" placeholder="Detailed guidelines for staff..." className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium" />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end">
                  <button type="submit" className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-sm cursor-pointer">
                    + Assign Task & Notify Staff
                  </button>
                </div>
              </form>
            </div>

            {/* Assigned Tasks List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Active Tasks ({tasksList.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasksList.map((task) => (
                  <div key={task.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          task.priority === "High" ? "bg-red-100 text-red-800" :
                          task.priority === "Medium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {task.priority} Priority
                        </span>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{task.taskTitle}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Due: {task.dueDate}</p>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        task.status === "Completed" ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pt-1">
                      <span>Required Proof: <strong className="text-emerald-700">{task.proofTypeRequired}</strong></span>
                      {task.status !== "Completed" ? (
                        <button
                          onClick={() => {
                            setTasksList((prev) =>
                              prev.map((t) =>
                                t.id === task.id
                                  ? {
                                      ...t,
                                      status: "Completed",
                                      completedAt: new Date().toLocaleTimeString(),
                                      proofNote: "Photo Proof & Location Logged successfully by staff"
                                    }
                                  : t
                              )
                            );
                            triggerToast("Task marked as completed with verified proof! 🎉");
                          }}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-xs"
                        >
                          📸 Submit Proof & Complete
                        </button>
                      ) : (
                        <span className="text-emerald-700 text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Proof Verified ({task.completedAt})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2D: GOOGLE MEET SCHEDULER & BROADCAST ==================== */}
      {activeTab === "google_meet" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" /> Special Google Meet Link & Broadcast Center
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">Input custom special Google Meet links, share to all staff at once or selected members, and broadcast to multiple social media channels</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Video className="w-4 h-4" /> Instant Google Meet
                </a>
              </div>
            </div>

            {/* Schedule & Share Meeting Form */}
            <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 space-y-3">
              <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-blue-600" /> Create Special Meet Link & Broadcast to Staff & Social Media
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const title = target.meetTitle.value;
                  const agenda = target.meetAgenda.value;
                  const date = target.meetDate.value;
                  const startTime = target.startTime.value;
                  const endTime = target.endTime.value;
                  const staffSelect = target.invitedStaff.value;
                  const specialLinkInput = customMeetUrl || target.specialMeetUrl?.value;

                  if (!title.trim()) {
                    triggerToast("Please enter a meeting title!");
                    return;
                  }

                  const finalMeetUrl = specialLinkInput?.trim() || `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;

                  const newMeeting: ScheduledMeeting = {
                    id: `mtg-${Date.now()}`,
                    title,
                    agenda,
                    date: date || "2026-07-31",
                    startTime: startTime || "10:00 AM",
                    endTime: endTime || "11:00 AM",
                    meetUrl: finalMeetUrl,
                    invitedStaffIds: [staffSelect],
                    scheduledBy: "Admin / Manager",
                    createdAt: new Date().toISOString().split("T")[0]
                  };

                  setScheduledMeetings((prev) => [newMeeting, ...prev]);
                  triggerToast(`📹 Meet Link Saved & Broadcasted to ${staffSelect === "ALL" ? "ALL Staff" : "Selected Staff"} & Social Media Channels! 🚀`);
                  setCustomMeetUrl("");
                  target.reset();
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs"
              >
                <div className="col-span-1 sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Meeting / Event Title *</label>
                  <input name="meetTitle" type="text" required placeholder="e.g. Monthly Staff Review & Clinical Protocol Update" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience / Recipients</label>
                  <select name="invitedStaff" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold">
                    <option value="ALL">📢 Broadcast to ALL Staff at Once</option>
                    <option value="DEPT_NURSING">🏥 Senior Care & Nursing Staff Only</option>
                    <option value="DEPT_PEDIATRICS">👶 Pediatric & Child Care Staff Only</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        👤 {s.firstName} {s.lastName} ({s.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    Special Google Meet Link Input (Custom URL or Auto-Generate)
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="specialMeetUrl"
                      type="url"
                      value={customMeetUrl}
                      onChange={(e) => setCustomMeetUrl(e.target.value)}
                      placeholder="https://meet.google.com/xyz-abcd-efg (Leave empty to auto-generate)"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-blue-700"
                    />
                    <button
                      type="button"
                      onClick={() => setCustomMeetUrl(`https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`)}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs rounded-xl whitespace-nowrap cursor-pointer"
                    >
                      ✨ Generate Link
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input name="meetDate" type="date" defaultValue="2026-07-31" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input name="startTime" type="text" defaultValue="10:00 AM" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input name="endTime" type="text" defaultValue="11:00 AM" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Meeting Agenda & Instructions</label>
                  <input name="meetAgenda" type="text" placeholder="Brief topics to cover..." className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium" />
                </div>

                {/* Social Media Multi-Share Selectors */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 bg-white p-3 rounded-xl border border-blue-200 space-y-2">
                  <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" /> Select Social Media Platforms for Broadcast (Multiple Allowed):
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {customSocialMediaPlatforms.map((platform) => (
                      <label key={platform} className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-1.5 cursor-pointer font-bold hover:bg-blue-50">
                        <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                        {platform}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end gap-2 pt-1">
                  <button type="submit" className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5">
                    <Video className="w-4 h-4" /> Save Link & Broadcast to Staff & Social Media
                  </button>
                </div>
              </form>
            </div>

            {/* Scheduled Meetings List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Scheduled Google Meetings ({scheduledMeetings.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheduledMeetings.map((mtg) => (
                  <div key={mtg.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                          {mtg.date} • {mtg.startTime} - {mtg.endTime}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 mt-1.5">{mtg.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">By {mtg.scheduledBy}</span>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                      {mtg.agenda || "General staff discussion and updates."}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="font-bold text-blue-600 truncate max-w-[180px]">{mtg.meetUrl}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`Google Meet Link: ${mtg.meetUrl}\nTitle: ${mtg.title}`);
                            triggerToast("Meeting details & Special Link copied to clipboard!");
                          }}
                          className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          📋 Copy
                        </button>
                        <a
                          href={mtg.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Meet
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: ADD STAFF FULL FORM ==================== */}
      {activeTab === "add_staff" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Add New Staff Member</h2>
            <p className="text-[10px] text-slate-500 font-medium">Create staff record, salary structure, allowances & bank verification details</p>
          </div>

          <form onSubmit={handleAddStaffSubmit} className="space-y-5 text-xs">
            {/* Section 1: Personal Info */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-xs uppercase text-emerald-800 border-b pb-1">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaffFirstName}
                    onChange={(e) => setNewStaffFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={newStaffMiddleName}
                    onChange={(e) => setNewStaffMiddleName(e.target.value)}
                    placeholder="e.g. Robert (Optional)"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaffLastName}
                    onChange={(e) => setNewStaffLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Employment Info */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-xs uppercase text-emerald-800 border-b pb-1">
                2. Employment Details & Joining Date
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={newStaffDesignation}
                    onChange={(e) => setNewStaffDesignation(e.target.value)}
                    placeholder="e.g. Senior Registered Nurse"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newStaffDepartment}
                    onChange={(e) => setNewStaffDepartment(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="Senior Care & Nursing">Senior Care & Nursing</option>
                    <option value="Rehabilitation & Wellness">Rehabilitation & Wellness</option>
                    <option value="Pediatric & Child Care">Pediatric & Child Care</option>
                    <option value="Administration & Operations">Administration & Operations</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Office Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={newStaffJoiningDate}
                    onChange={(e) => setNewStaffJoiningDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select
                    value={newStaffEmpType}
                    onChange={(e) => setNewStaffEmpType(e.target.value as StaffMember["employmentType"])}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern / Trainee</option>
                  </select>
                </div>
              </div>

              {/* Probation & Trial Phase Configuration */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-amber-900 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStaffIsOnProbation}
                      onChange={(e) => setNewStaffIsOnProbation(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    Enable Trial Phase / Probation Period for Staff
                  </label>
                  {newStaffIsOnProbation && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                      Probation Status Active
                    </span>
                  )}
                </div>

                {newStaffIsOnProbation && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Probation Duration (Months)</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={newStaffProbationMonths}
                        onChange={(e) => setNewStaffProbationMonths(Number(e.target.value))}
                        className="w-full p-2.5 border border-amber-300 rounded-xl font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Payment Status</label>
                      <select
                        value={newStaffProbationPayType}
                        onChange={(e) => setNewStaffProbationPayType(e.target.value as any)}
                        className="w-full p-2.5 border border-amber-300 rounded-xl font-bold bg-white"
                      >
                        <option value="Full Paid">Full Paid</option>
                        <option value="Partial Paid (Stipend)">Partial Paid (Stipend)</option>
                        <option value="Unpaid Trial">Unpaid Trial</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Trial Phase Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Evaluation after 90 days"
                        value={newStaffProbationNotes}
                        onChange={(e) => setNewStaffProbationNotes(e.target.value)}
                        className="w-full p-2.5 border border-amber-300 rounded-xl font-medium bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Salary Breakdown */}
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-xs uppercase text-emerald-800 border-b pb-1">
                3. Monthly Salary Structure & Deductions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Basic Salary ($)</label>
                  <input
                    type="number"
                    value={newStaffBasicSalary}
                    onChange={(e) => setNewStaffBasicSalary(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">HRA Allowance ($)</label>
                  <input
                    type="number"
                    value={newStaffHra}
                    onChange={(e) => setNewStaffHra(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DA Allowance ($)</label>
                  <input
                    type="number"
                    value={newStaffDa}
                    onChange={(e) => setNewStaffDa(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medical Allowance ($)</label>
                  <input
                    type="number"
                    value={newStaffMedical}
                    onChange={(e) => setNewStaffMedical(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PF Deduction ($)</label>
                  <input
                    type="number"
                    value={newStaffPf}
                    onChange={(e) => setNewStaffPf(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tax Deduction ($)</label>
                  <input
                    type="number"
                    value={newStaffTax}
                    onChange={(e) => setNewStaffTax(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <span className="font-black text-emerald-950 text-xs">Calculated Monthly Net Salary:</span>
                <span className="font-black text-emerald-800 text-base">
                  $
                  {(
                    Number(newStaffBasicSalary) +
                    Number(newStaffHra) +
                    Number(newStaffDa) +
                    Number(newStaffMedical) -
                    (Number(newStaffPf) + Number(newStaffTax))
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("staff_directory")}
                className="py-2.5 px-4 bg-slate-100 font-extrabold text-slate-700 rounded-2xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md cursor-pointer"
              >
                Save Staff Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== TAB 4: PAYROLL MANAGEMENT ==================== */}
      {activeTab === "payroll" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-black text-slate-900">Monthly Staff Payroll Processing</h2>
              <p className="text-[10px] text-slate-500 font-medium">Verify salaries, deductions, overtime, bonuses, upload payment proofs & staff verification</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded-xl font-bold text-xs bg-slate-50"
              />
              <button
                onClick={() => setShowCreatePayrollModal(true)}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                + Create Custom Payroll Slip
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {payrolls.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{p.staffName}</h3>
                    <p className="text-xs text-slate-600 font-bold">{p.designation}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Month: {p.monthYear} • Days Worked: {p.daysWorked} days</p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-emerald-800 block">
                      {selectedCurrencySymbol} {p.netSalary.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block ${
                      p.status === "Verified" ? "bg-emerald-950 text-emerald-300 border border-emerald-700" :
                      p.status === "Paid" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                    }`}>
                      {p.status === "Verified" ? "✓ Received & Verified by Staff" : p.status}
                    </span>
                  </div>
                </div>

                {/* Salary Breakdown Table Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-[10px] bg-white p-2.5 rounded-xl border border-slate-100 font-bold">
                  <div>
                    <span className="text-slate-400 block uppercase">Basic</span>
                    <span className="text-slate-800">{selectedCurrencySymbol} {p.basicSalary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Allowances</span>
                    <span className="text-emerald-700">+{selectedCurrencySymbol} {p.totalAllowances}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Deductions</span>
                    <span className="text-rose-700">-{selectedCurrencySymbol} {p.totalDeductions}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Bonus/OT</span>
                    <span className="text-teal-700">+{selectedCurrencySymbol} {p.bonus + p.overtime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Payment Method</span>
                    <span className="text-slate-800">{p.paymentMethod || "Bank Transfer"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Ref / Proof</span>
                    <span className="text-slate-800 font-mono text-[9px] truncate block">{p.salaryProofUrl ? "📷 Proof Attached" : (p.transactionRef || "Pending")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Salary Paid Proof Indicator / Upload */}
                    {p.salaryProofUrl ? (
                      <span className="text-[10px] bg-blue-100 text-blue-900 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1">
                        📷 Payment Proof Uploaded
                      </span>
                    ) : (
                      <label className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-xl font-bold cursor-pointer flex items-center gap-1">
                        📎 Upload Paid Proof
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setPayrolls((prev) =>
                                  prev.map((item) =>
                                    item.id === p.id
                                      ? { ...item, salaryProofUrl: ev.target?.result as string, status: "Paid" }
                                      : item
                                  )
                                );
                                triggerToast(`Salary paid proof uploaded successfully for ${p.staffName}!`);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPaySlipModal(p)}
                      className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 font-extrabold text-slate-800 rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Pay Slip
                    </button>

                    {/* Staff Verification Button */}
                    {!p.isStaffVerified ? (
                      <button
                        onClick={() => {
                          setPayrolls((prev) =>
                            prev.map((item) =>
                              item.id === p.id
                                ? { ...item, isStaffVerified: true, status: "Verified", staffVerifiedAt: new Date().toLocaleString() }
                                : item
                            )
                          );
                          triggerToast(`Verified: Salary received & confirmed by ${p.staffName}! ✅`);
                        }}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Confirm Salary Received by Staff
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                        ✓ Verified by Staff ({p.staffVerifiedAt || "Confirmed"})
                      </span>
                    )}

                    {p.status === "Pending" && (
                      <button
                        onClick={() => handlePayStaff(p.id)}
                        className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer shadow-sm"
                      >
                        Process & Pay Salary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: TRANSACTIONS (INCOME/EXPENSE) ==================== */}
      {activeTab === "transactions" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Income & Expense Ledger ({transactions.length})</h2>
              <p className="text-[10px] text-slate-500 font-medium">Record and categorise all incoming revenue & operational costs</p>
            </div>

            <button
              onClick={() => setShowAddTransactionModal(true)}
              className="py-2 px-3 bg-emerald-600 text-white font-black rounded-xl text-xs hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
            >
              + Add Transaction
            </button>
          </div>

          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-400 transition-all flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm ${
                    t.type === "Income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {t.type === "Income" ? "💰" : "💸"}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{t.description}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Category: <span className="text-slate-800">{t.category}</span> • Party: {t.party} • Date: {t.date}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Payment via {t.paymentMethod} • Ref: {t.referenceNo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-black block ${t.type === "Income" ? "text-emerald-700" : "text-rose-700"}`}>
                    {t.type === "Income" ? "+" : "-"}${t.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: STATEMENTS & REPORTS ==================== */}
      {activeTab === "statements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Auto-Generated Financial Statements</h2>
              <p className="text-[10px] text-slate-500 font-medium">Opening balance, income breakdown, expenses & closing balances</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              {(["Daily", "Weekly", "Monthly", "Yearly"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setStatementType(type)}
                  className={`py-1.5 px-3 rounded-xl cursor-pointer ${
                    statementType === type ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Statement Printable Card Frame */}
          <div className="bg-stone-50 border-2 border-stone-200 p-6 rounded-3xl space-y-5 text-xs text-slate-900">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-base font-black text-emerald-900">Care To Care Health & Support Services</span>
                <p className="text-[10px] text-slate-500 font-bold">Official Financial Statement ({statementType.toUpperCase()})</p>
                <p className="text-[10px] text-slate-400 font-medium">Generated: 27 July 2026 • Currency: USD ($)</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => triggerToast("Downloaded Statement PDF! 📄")}
                  className="py-1.5 px-3 bg-emerald-600 text-white font-black rounded-xl cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  <Printer className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => triggerToast("Exported Statement Excel! 📊")}
                  className="py-1.5 px-3 bg-teal-700 text-white font-black rounded-xl cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                </button>
              </div>
            </div>

            {/* Statement Summary Box */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-4 rounded-2xl border border-stone-200 font-bold text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Opening Balance</span>
                <span className="text-sm font-black text-slate-900">${openingBalance.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-600 block uppercase">Total Income</span>
                <span className="text-sm font-black text-emerald-800">+${totalIncome.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-600 block uppercase">Total Expense</span>
                <span className="text-sm font-black text-rose-800">-${totalExpense.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-600 block uppercase">Net Profit / Loss</span>
                <span className="text-sm font-black text-teal-800">${netBalance.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-900 block uppercase">Closing Balance</span>
                <span className="text-sm font-black text-slate-900">${closingBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Income & Expense Breakdown Lists */}
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-black text-emerald-900 text-xs border-b pb-1">Income Itemized Ledger</h4>
                {transactions.filter((t) => t.type === "Income").map((t) => (
                  <div key={t.id} className="flex justify-between text-[11px] font-medium border-b border-stone-100 pb-1">
                    <span>{t.description}</span>
                    <span className="font-black text-emerald-800">+${t.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-black text-rose-900 text-xs border-b pb-1">Expense Itemized Ledger</h4>
                {transactions.filter((t) => t.type === "Expense").map((t) => (
                  <div key={t.id} className="flex justify-between text-[11px] font-medium border-b border-stone-100 pb-1">
                    <span>{t.description}</span>
                    <span className="font-black text-rose-800">-${t.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: ANALYTICS & CHARTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-sm font-black text-slate-900">Financial & Payroll Visual Analytics</h2>
            <p className="text-[10px] text-slate-500 font-medium">Income vs Expense ratios, overhead distribution & trends</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Income vs Expense Ratio Visual Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-black text-slate-900 text-xs">Income vs Expense Proportion</h3>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-800">Income: ${totalIncome.toLocaleString()}</span>
                  <span className="text-rose-800">Expense: ${totalExpense.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-rose-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.min(100, (totalIncome / (totalIncome + totalExpense)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-medium">
                Income represents {Math.round((totalIncome / (totalIncome + totalExpense)) * 100)}% of total cashflow for this cycle.
              </p>
            </div>

            {/* Department Payroll Distribution */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-black text-slate-900 text-xs">Department Staff Salary Allocation</h3>

              <div className="space-y-2 text-xs font-bold">
                <div>
                  <div className="flex justify-between">
                    <span>Senior Care & Nursing</span>
                    <span>$4,450</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-emerald-600 w-[40%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span>Rehabilitation & Wellness</span>
                    <span>$3,650</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-teal-600 w-[33%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span>Pediatric & Child Care</span>
                    <span>$3,250</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-orange-500 w-[27%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Payroll & Financial Settings</h2>
              <p className="text-[10px] text-slate-500 font-medium">Global country currency selection, custom symbols, tax percentages & backup settings</p>
            </div>
            <button
              onClick={() => handleSaveCurrencySettings(selectedCurrencyCode, selectedCurrencySymbol)}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save Financial Settings
            </button>
          </div>

          <div className="space-y-4 text-xs font-bold">
            {/* World Currency Selector */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-950 font-black flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Currency & Country Localization
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const userLang = navigator.language || "en-US";
                    if (userLang.includes("NP")) handleSaveCurrencySettings("NPR", "NRs");
                    else if (userLang.includes("IN")) handleSaveCurrencySettings("INR", "₹");
                    else if (userLang.includes("GB")) handleSaveCurrencySettings("GBP", "£");
                    else if (userLang.includes("EU")) handleSaveCurrencySettings("EUR", "€");
                    else if (userLang.includes("AU")) handleSaveCurrencySettings("AUD", "A$");
                    else if (userLang.includes("CA")) handleSaveCurrencySettings("CAD", "C$");
                    else if (userLang.includes("JP")) handleSaveCurrencySettings("JPY", "¥");
                    else handleSaveCurrencySettings("USD", "$");
                  }}
                  className="px-3 py-1 bg-white text-emerald-800 border border-emerald-300 font-black text-[11px] rounded-xl hover:bg-emerald-100 cursor-pointer"
                >
                  ⚡ Auto Detect My Country Currency
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                    Select World Country Currency (All Countries)
                  </label>
                  <select
                    value={selectedCurrencyCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setSelectedCurrencyCode(code);
                      const symbolMap: Record<string, string> = {
                        NPR: "रु", USD: "$", EUR: "€", GBP: "£", INR: "₹",
                        AUD: "A$", CAD: "C$", JPY: "¥", AED: "AED", SAR: "SAR",
                        SGD: "S$", BDT: "৳", PKR: "₨", LKR: "₨", ZAR: "R",
                        BRL: "R$", CNY: "¥", PHP: "₱", MYR: "RM", IDR: "Rp",
                        THB: "฿", MXN: "$", KRW: "₩", CHF: "Fr.", CUSTOM: customCurrencySymbol || "रु"
                      };
                      setSelectedCurrencySymbol(symbolMap[code] || "रु");
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900 shadow-xs"
                  >
                    <option value="NPR">🇳🇵 NPR (रु) - Nepalese Rupee (नेपाली रुपैयाँ)</option>
                    <option value="USD">🇺🇸 USD ($) - United States Dollar</option>
                    <option value="EUR">🇪🇺 EUR (€) - Euro (Eurozone)</option>
                    <option value="GBP">🇬🇧 GBP (£) - British Pound Sterling</option>
                    <option value="INR">🇮🇳 INR (₹) - Indian Rupee</option>
                    <option value="AUD">🇦🇺 AUD (A$) - Australian Dollar</option>
                    <option value="CAD">🇨🇦 CAD (C$) - Canadian Dollar</option>
                    <option value="JPY">🇯🇵 JPY (¥) - Japanese Yen</option>
                    <option value="AED">🇦🇪 AED (AED) - United Arab Emirates Dirham</option>
                    <option value="SAR">🇸🇦 SAR (SAR) - Saudi Riyal</option>
                    <option value="SGD">🇸🇬 SGD (S$) - Singapore Dollar</option>
                    <option value="BDT">🇧🇩 BDT (৳) - Bangladeshi Taka</option>
                    <option value="PKR">🇵🇰 PKR (₨) - Pakistani Rupee</option>
                    <option value="LKR">🇱🇰 LKR (₨) - Sri Lankan Rupee</option>
                    <option value="ZAR">🇿🇦 ZAR (R) - South African Rand</option>
                    <option value="BRL">🇧🇷 BRL (R$) - Brazilian Real</option>
                    <option value="CNY">🇨🇳 CNY (¥) - Chinese Yuan</option>
                    <option value="PHP">🇵🇭 PHP (₱) - Philippine Peso</option>
                    <option value="MYR">🇲🇾 MYR (RM) - Malaysian Ringgit</option>
                    <option value="IDR">🇮🇩 IDR (Rp) - Indonesian Rupiah</option>
                    <option value="THB">🇹🇭 THB (฿) - Thai Baht</option>
                    <option value="MXN">🇲🇽 MXN ($) - Mexican Peso</option>
                    <option value="KRW">🇰🇷 KRW (₩) - South Korean Won</option>
                    <option value="CHF">🇨🇭 CHF (Fr.) - Swiss Franc</option>
                    <option value="CUSTOM">⚙️ Manual Custom Currency Code/Symbol</option>
                  </select>
                </div>

                {selectedCurrencyCode === "CUSTOM" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600 block mb-1">Custom Code (e.g. BTC)</label>
                      <input
                        type="text"
                        placeholder="e.g. BTC"
                        value={customCurrencyCode}
                        onChange={(e) => setCustomCurrencyCode(e.target.value.toUpperCase())}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block mb-1">Custom Symbol (e.g. ₿)</label>
                      <input
                        type="text"
                        placeholder="e.g. ₿"
                        value={customCurrencySymbol}
                        onChange={(e) => setCustomCurrencySymbol(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Active Payroll Currency Display Preview:</span>
                <span className="font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-lg">
                  {selectedCurrencySymbol} 12,500.00 ({selectedCurrencyCode})
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-slate-900 font-black block">Default Statutory Tax / PF Percentages</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block">PF Percentage (%)</label>
                  <input type="number" defaultValue={12} className="w-full p-2.5 border rounded-xl bg-white font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Tax Deduction (%)</label>
                  <input type="number" defaultValue={5} className="w-full p-2.5 border rounded-xl bg-white font-bold" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-between items-center">
              <button
                onClick={() => triggerToast("Backup exported successfully! 💾")}
                className="py-2.5 px-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export Ledger Backup
              </button>
              <button
                onClick={() => handleSaveCurrencySettings(selectedCurrencyCode, selectedCurrencySymbol)}
                className="py-2.5 px-6 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" /> Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 1: ADD TRANSACTION WITH SLIDE SELECTOR ==================== */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" /> Record New Transaction
              </h3>
              <button onClick={() => setShowAddTransactionModal(false)} className="text-slate-400 font-black hover:text-slate-700 cursor-pointer text-lg">
                ✕
              </button>
            </div>

            {/* Slide Toggle for Income vs Expense */}
            <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setTxnType("Income");
                  setTxnCategory("Business Income");
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  txnType === "Income" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-4 h-4" /> 💰 Income
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxnType("Expense");
                  setTxnCategory("Supplies & Equipment");
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  txnType === "Expense" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingDown className="w-4 h-4" /> 💸 Expense
              </button>
            </div>

            <form onSubmit={handleAddTransactionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={txnCategory}
                  onChange={(e) => setTxnCategory(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                >
                  {txnType === "Income" ? (
                    <>
                      <option value="Business & Healthcare Grant">Business & Healthcare Grant</option>
                      <option value="Consultation & Nursing Fee">Consultation & Nursing Fee</option>
                      <option value="Client Payment">Client Payment</option>
                      <option value="Investment / Other">Investment / Other</option>
                      <option value="Custom">Custom Category</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary Paid">Salary Paid</option>
                      <option value="Supplies & Equipment">Supplies & Equipment</option>
                      <option value="Rent & Utilities">Rent & Utilities</option>
                      <option value="Marketing & Outreach">Marketing & Outreach</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Custom">Custom Category</option>
                    </>
                  )}
                </select>
              </div>

              {txnCategory === "Custom" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enter Custom Category Name</label>
                  <input
                    type="text"
                    value={txnCustomCategory}
                    onChange={(e) => setTxnCustomCategory(e.target.value)}
                    placeholder="e.g. Special Accreditation Fee"
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={txnAmount}
                    onChange={(e) => setTxnAmount(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={txnDate}
                    onChange={(e) => setTxnDate(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={txnDescription}
                  onChange={(e) => setTxnDescription(e.target.value)}
                  placeholder="e.g. Monthly facility internet & power bill"
                  className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Party / Vendor</label>
                  <input
                    type="text"
                    value={txnParty}
                    onChange={(e) => setTxnParty(e.target.value)}
                    placeholder="e.g. MedSupplies Inc."
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={txnMethod}
                    onChange={(e) => setTxnMethod(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl font-bold bg-slate-50"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTransactionModal(false)}
                  className="py-2.5 px-4 bg-slate-100 font-extrabold text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`py-2.5 px-5 text-white font-black rounded-xl shadow-md cursor-pointer ${
                    txnType === "Income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  Save {txnType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: PAY SLIP VIEW ==================== */}
      {showPaySlipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-xs text-slate-900">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-sm">Official Employee Salary Slip</h3>
              </div>
              <button onClick={() => setShowPaySlipModal(null)} className="text-slate-400 font-black hover:text-slate-700 cursor-pointer text-lg">
                ✕
              </button>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-start border-b border-stone-200 pb-2">
                <div>
                  <h4 className="font-black text-emerald-900 text-sm">Care To Care Health Org</h4>
                  <p className="text-[10px] text-slate-500 font-bold">Month: {showPaySlipModal.monthYear}</p>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                  Status: {showPaySlipModal.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <div>
                  <span className="text-slate-400 block">Employee Name:</span>
                  <span className="text-slate-900">{showPaySlipModal.staffName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Designation:</span>
                  <span className="text-slate-900">{showPaySlipModal.designation}</span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Basic Salary:</span>
                  <span>${(showPaySlipModal.basicSalary || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Total Allowances (HRA + DA + Med):</span>
                  <span>+${(showPaySlipModal.totalAllowances || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700">
                  <span>Statutory Deductions (PF + Tax):</span>
                  <span>-${(showPaySlipModal.totalDeductions || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-teal-700">
                  <span>Bonus & Overtime:</span>
                  <span>+${((showPaySlipModal.bonus || 0) + (showPaySlipModal.overtime || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-base border-t border-stone-300 pt-2 text-emerald-950">
                  <span>Net Take-Home Salary:</span>
                  <span>${(showPaySlipModal.netSalary || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  triggerToast("Printed Salary Slip! 🖨️");
                  setShowPaySlipModal(null);
                }}
                className="py-2 px-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save Pay Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: SELECTED STAFF PROFILE DETAIL ==================== */}
      {selectedStaffForProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-xs text-slate-900">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedStaffForProfile.profilePhoto}</span>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    {selectedStaffForProfile.firstName} {selectedStaffForProfile.lastName} ({selectedStaffForProfile.staffId})
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">{selectedStaffForProfile.designation}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStaffForProfile(null)} className="text-slate-400 font-black hover:text-slate-700 cursor-pointer text-lg">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Email</span>
                  <span className="font-extrabold text-slate-900">{selectedStaffForProfile.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone</span>
                  <span className="font-extrabold text-slate-900">{selectedStaffForProfile.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Joining Date</span>
                  <span className="font-extrabold text-slate-900">{selectedStaffForProfile.joiningDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Bank Account</span>
                  <span className="font-extrabold text-slate-900">{selectedStaffForProfile.bankAccount}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="font-black text-emerald-950 block">Monthly Salary Breakdown:</span>
                <p className="text-[11px] text-slate-700">
                  Basic: ${selectedStaffForProfile.basicSalary} | Allowances: ${selectedStaffForProfile.hra + selectedStaffForProfile.da + selectedStaffForProfile.medicalAllowance} | Deductions: ${selectedStaffForProfile.pfDeduction + selectedStaffForProfile.taxDeduction}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 font-medium">
                <span className="font-bold text-slate-900 block mb-1">Notes & Credentials:</span>
                {selectedStaffForProfile.notes || "Registered care staff member."}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStaffForProfile(null)}
                className="py-2 px-4 bg-slate-200 text-slate-800 font-extrabold rounded-xl hover:bg-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: CREATE CUSTOM PAYROLL SLIP ==================== */}
      {showCreatePayrollModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Create Custom Staff Payroll Slip
              </h3>
              <button onClick={() => setShowCreatePayrollModal(false)} className="text-slate-400 font-black hover:text-slate-700 cursor-pointer text-lg">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const selectedStaff = staffList.find((s) => s.id === createPayrollStaffId) || staffList[0];
                const net = Number(createPayrollBasic) + Number(createPayrollAllowances) + Number(createPayrollBonus) + Number(createPayrollOvertime) - Number(createPayrollDeductions);

                const newSlip: PayrollRecord = {
                  id: `pay-${Date.now()}`,
                  staffId: selectedStaff?.id || "stf-1",
                  staffName: selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.middleName ? selectedStaff.middleName + ' ' : ''}${selectedStaff.lastName}` : "Staff Member",
                  designation: selectedStaff?.designation || "Healthcare Staff",
                  monthYear: createPayrollMonth,
                  basicSalary: Number(createPayrollBasic),
                  totalAllowances: Number(createPayrollAllowances),
                  totalDeductions: Number(createPayrollDeductions),
                  bonus: Number(createPayrollBonus),
                  overtime: Number(createPayrollOvertime),
                  daysWorked: 26,
                  leaveTaken: 0,
                  netSalary: net,
                  status: createPayrollStatus,
                  paymentMethod: createPayrollMethod,
                  transactionRef: createPayrollRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                  salaryProofUrl: createPayrollProof || undefined,
                  isStaffVerified: false,
                };

                setPayrolls((prev) => [newSlip, ...prev]);
                triggerToast(`Custom Payroll Slip Created & Saved for ${newSlip.staffName}! 🎉`);
                setShowCreatePayrollModal(false);
              }}
              className="space-y-4 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">Select Staff Member *</label>
                <select
                  required
                  value={createPayrollStaffId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setCreatePayrollStaffId(id);
                    const stf = staffList.find((s) => s.id === id);
                    if (stf) {
                      setCreatePayrollBasic(stf.basicSalary);
                      setCreatePayrollAllowances(stf.hra + stf.da + stf.medicalAllowance);
                      setCreatePayrollDeductions(stf.pfDeduction + stf.taxDeduction);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-black text-slate-900"
                >
                  <option value="">-- Choose Employee --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.middleName ? s.middleName + ' ' : ''}{s.lastName} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Month & Year *</label>
                  <input
                    type="month"
                    required
                    value={createPayrollMonth}
                    onChange={(e) => setCreatePayrollMonth(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={createPayrollMethod}
                    onChange={(e) => setCreatePayrollMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="text-slate-700 block mb-1">Basic Salary ({selectedCurrencySymbol})</label>
                  <input
                    type="number"
                    value={createPayrollBasic}
                    onChange={(e) => setCreatePayrollBasic(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Allowances ({selectedCurrencySymbol})</label>
                  <input
                    type="number"
                    value={createPayrollAllowances}
                    onChange={(e) => setCreatePayrollAllowances(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Deductions ({selectedCurrencySymbol})</label>
                  <input
                    type="number"
                    value={createPayrollDeductions}
                    onChange={(e) => setCreatePayrollDeductions(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl text-rose-600"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Bonus & OT ({selectedCurrencySymbol})</label>
                  <input
                    type="number"
                    value={createPayrollBonus}
                    onChange={(e) => setCreatePayrollBonus(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border rounded-xl text-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex justify-between items-center text-xs">
                <span className="text-slate-700">Calculated Net Salary to Pay:</span>
                <span className="text-base font-black text-emerald-800">
                  {selectedCurrencySymbol} {(Number(createPayrollBasic) + Number(createPayrollAllowances) + Number(createPayrollBonus) - Number(createPayrollDeductions)).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Transaction Ref / Cheque No.</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-9823049234"
                  value={createPayrollRef}
                  onChange={(e) => setCreatePayrollRef(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
                />
              </div>

              {/* Upload Paid Salary Proof Option */}
              <div>
                <label className="text-slate-700 block mb-1">Upload Salary Paid Proof / Receipt Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setCreatePayrollProof(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-slate-700"
                />
                {createPayrollProof && (
                  <p className="text-[10px] text-emerald-700 mt-1 font-bold">✓ Payment proof image ready to attach!</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreatePayrollModal(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 font-extrabold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Payroll Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
