import React, { useState, useEffect, useMemo } from "react";
import { CashCollectionCreditLedgerTracker } from "./CashCollectionCreditLedgerTracker";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  Filter,
  Search,
  Trash2,
  Edit3,
  Download,
  Share2,
  Check,
  X,
  CreditCard,
  Building,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertTriangle,
  Clock,
  Tag,
  Camera,
  RefreshCw,
  Sliders,
  Bell,
  Layers,
  ChevronRight,
  Repeat
} from "lucide-react";
import {
  Patient,
  FinancialTransaction,
  FinancialBudget,
  FinancialSavingsGoal,
  FinancialRecurringTransaction
} from "../types";

// ==========================================
// SAFE UTILITY FUNCTIONS
// ==========================================
function safeStr(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function safeArray<T>(val: any): T[] {
  return Array.isArray(val) ? val : [];
}

function safeDate(val: any): string {
  if (!val) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

// ==========================================
// CATEGORY DEFINITIONS
// ==========================================
const INCOME_CATEGORIES = [
  { name: "Salary", icon: "💼", bg: "bg-emerald-100 text-emerald-800" },
  { name: "Freelance", icon: "💰", bg: "bg-blue-100 text-blue-800" },
  { name: "Investment Returns", icon: "📈", bg: "bg-purple-100 text-purple-800" },
  { name: "Rental Income", icon: "🏠", bg: "bg-amber-100 text-amber-800" },
  { name: "Business Income", icon: "🏢", bg: "bg-teal-100 text-teal-800" },
  { name: "Interest & Dividends", icon: "🏦", bg: "bg-cyan-100 text-cyan-800" },
  { name: "Gift & Grants", icon: "🎁", bg: "bg-pink-100 text-pink-800" },
  { name: "Pension & Social Security", icon: "📜", bg: "bg-indigo-100 text-indigo-800" },
  { name: "Caregiving Support", icon: "🤝", bg: "bg-emerald-100 text-emerald-800" },
  { name: "Other Income", icon: "💵", bg: "bg-slate-100 text-slate-800" }
];

const EXPENSE_CATEGORIES = [
  { name: "Housing (Rent/Mortgage)", icon: "🏠", bg: "bg-slate-100 text-slate-800" },
  { name: "Food & Groceries", icon: "🍽️", bg: "bg-amber-100 text-amber-800" },
  { name: "Transportation & Fuel", icon: "🚗", bg: "bg-blue-100 text-blue-800" },
  { name: "Health & Medical", icon: "🏥", bg: "bg-rose-100 text-rose-800" },
  { name: "Caregiving & Senior Needs", icon: "👵", bg: "bg-emerald-100 text-emerald-800" },
  { name: "Utilities (Water/Elec)", icon: "💡", bg: "bg-yellow-100 text-yellow-800" },
  { name: "Communication & Web", icon: "📱", bg: "bg-cyan-100 text-cyan-800" },
  { name: "Education & Tuition", icon: "🎓", bg: "bg-indigo-100 text-indigo-800" },
  { name: "Shopping & Clothes", icon: "🛍️", bg: "bg-fuchsia-100 text-fuchsia-800" },
  { name: "Entertainment & Leisure", icon: "🎉", bg: "bg-purple-100 text-purple-800" },
  { name: "Travel & Vacations", icon: "✈️", bg: "bg-sky-100 text-sky-800" },
  { name: "Fitness & Wellness", icon: "🏋️", bg: "bg-teal-100 text-teal-800" },
  { name: "Insurance Premiums", icon: "🛡️", bg: "bg-slate-100 text-slate-800" },
  { name: "Savings & Investments", icon: "🐖", bg: "bg-emerald-100 text-emerald-800" },
  { name: "Debt Repayment & EMI", icon: "💳", bg: "bg-red-100 text-red-800" },
  { name: "Pet & Animal Care", icon: "🐾", bg: "bg-orange-100 text-orange-800" },
  { name: "Other Expenses", icon: "📦", bg: "bg-gray-100 text-gray-800" }
];

const CURRENCIES = ["NPR (रु)", "USD ($)", "EUR (€)", "GBP (£)", "INR (₹)", "CAD ($)", "AUD ($)", "SGD ($)"];

const PAYMENT_METHODS = ["Bank Transfer", "Credit Card", "Debit Card", "Cash", "UPI / Digital Wallet", "Check"];

// ==========================================
// DEMO INITIAL DATA
// ==========================================
const TODAY_STR = safeDate(new Date());
const CURRENT_MONTH_STR = TODAY_STR.substring(0, 7); // YYYY-MM

const DEMO_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "tx-101",
    userId: "pat-1",
    type: "income",
    category: "Salary",
    subCategory: "Primary Job",
    amount: 4500,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "Monthly salary payout",
    paymentMethod: "Bank Transfer",
    merchant: "Apex Health Corp",
    receiptPhoto: "",
    isRecurring: true,
    recurrencePattern: "Monthly",
    recurrenceEndDate: "",
    tags: ["salary", "payroll", "primary"],
    notes: "Direct deposit completed.",
    createdAt: `${TODAY_STR}T09:00:00`,
    updatedAt: `${TODAY_STR}T09:00:00`
  },
  {
    id: "tx-102",
    userId: "pat-1",
    type: "expense",
    category: "Housing (Rent/Mortgage)",
    subCategory: "Rent",
    amount: 1400,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "Monthly Apartment Rent",
    paymentMethod: "Bank Transfer",
    merchant: "Grand view Apartments",
    receiptPhoto: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    isRecurring: true,
    recurrencePattern: "Monthly",
    recurrenceEndDate: "",
    tags: ["rent", "housing"],
    notes: "Receipt saved.",
    createdAt: `${TODAY_STR}T10:15:00`,
    updatedAt: `${TODAY_STR}T10:15:00`
  },
  {
    id: "tx-103",
    userId: "pat-1",
    type: "expense",
    category: "Food & Groceries",
    subCategory: "Supermarket",
    amount: 245,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "Weekly fresh groceries & organic produce",
    paymentMethod: "Credit Card",
    merchant: "Whole Foods Market",
    receiptPhoto: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
    isRecurring: false,
    recurrencePattern: "",
    recurrenceEndDate: "",
    tags: ["groceries", "food"],
    notes: "Stocked up for the week.",
    createdAt: `${TODAY_STR}T12:30:00`,
    updatedAt: `${TODAY_STR}T12:30:00`
  },
  {
    id: "tx-104",
    userId: "pat-1",
    type: "expense",
    category: "Health & Medical",
    subCategory: "Pharmacy",
    amount: 85,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "Monthly maintenance medications & vitamins",
    paymentMethod: "Debit Card",
    merchant: "CVS Care Pharmacy",
    receiptPhoto: "",
    isRecurring: true,
    recurrencePattern: "Monthly",
    recurrenceEndDate: "",
    tags: ["medication", "pharmacy"],
    notes: "Rx refill.",
    createdAt: `${TODAY_STR}T14:20:00`,
    updatedAt: `${TODAY_STR}T14:20:00`
  },
  {
    id: "tx-105",
    userId: "pat-1",
    type: "income",
    category: "Freelance",
    subCategory: "Consulting",
    amount: 850,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "Health consulting project deliverable",
    paymentMethod: "UPI / Digital Wallet",
    merchant: "BioTech Advisory",
    receiptPhoto: "",
    isRecurring: false,
    recurrencePattern: "",
    recurrenceEndDate: "",
    tags: ["freelance", "consulting"],
    notes: "Payment received.",
    createdAt: `${TODAY_STR}T16:00:00`,
    updatedAt: `${TODAY_STR}T16:00:00`
  },
  {
    id: "tx-106",
    userId: "pat-1",
    type: "expense",
    category: "Utilities (Water/Elec)",
    subCategory: "Electricity",
    amount: 120,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "Electric utility bill",
    paymentMethod: "Credit Card",
    merchant: "City Power & Light",
    receiptPhoto: "",
    isRecurring: true,
    recurrencePattern: "Monthly",
    recurrenceEndDate: "",
    tags: ["electricity", "utilities"],
    notes: "Paid online.",
    createdAt: `${TODAY_STR}T17:10:00`,
    updatedAt: `${TODAY_STR}T17:10:00`
  }
];

const DEMO_BUDGETS: FinancialBudget[] = [
  {
    id: "b-101",
    userId: "pat-1",
    category: "Housing (Rent/Mortgage)",
    subCategory: "Rent",
    amount: 1500,
    spent: 1400,
    month: CURRENT_MONTH_STR,
    year: 2026,
    notes: "Monthly rent target",
    createdAt: `${TODAY_STR}T08:00:00`,
    updatedAt: `${TODAY_STR}T08:00:00`
  },
  {
    id: "b-102",
    userId: "pat-1",
    category: "Food & Groceries",
    subCategory: "Groceries",
    amount: 700,
    spent: 245,
    month: CURRENT_MONTH_STR,
    year: 2026,
    notes: "Food budget limit",
    createdAt: `${TODAY_STR}T08:00:00`,
    updatedAt: `${TODAY_STR}T08:00:00`
  },
  {
    id: "b-103",
    userId: "pat-1",
    category: "Health & Medical",
    subCategory: "Medications",
    amount: 250,
    spent: 85,
    month: CURRENT_MONTH_STR,
    year: 2026,
    notes: "Prescriptions & therapy",
    createdAt: `${TODAY_STR}T08:00:00`,
    updatedAt: `${TODAY_STR}T08:00:00`
  },
  {
    id: "b-104",
    userId: "pat-1",
    category: "Utilities (Water/Elec)",
    subCategory: "Utilities",
    amount: 200,
    spent: 120,
    month: CURRENT_MONTH_STR,
    year: 2026,
    notes: "Power & water caps",
    createdAt: `${TODAY_STR}T08:00:00`,
    updatedAt: `${TODAY_STR}T08:00:00`
  }
];

const DEMO_GOALS: FinancialSavingsGoal[] = [
  {
    id: "g-101",
    userId: "pat-1",
    name: "Medical Emergency Reserve",
    targetAmount: 10000,
    currentAmount: 4200,
    currency: "USD ($)",
    targetDate: "2026-12-31",
    priority: "High",
    category: "Emergency",
    monthlyContribution: 500,
    notes: "Dedicated 6-month safety net.",
    createdAt: "2026-01-01T00:00:00",
    updatedAt: `${TODAY_STR}T08:00:00`
  },
  {
    id: "g-102",
    userId: "pat-1",
    name: "Annual Wellness & Retreat Fund",
    targetAmount: 3500,
    currentAmount: 1800,
    currency: "USD ($)",
    targetDate: "2026-11-15",
    priority: "Medium",
    category: "Vacation",
    monthlyContribution: 300,
    notes: "End-of-year family retreat.",
    createdAt: "2026-02-01T00:00:00",
    updatedAt: `${TODAY_STR}T08:00:00`
  },
  {
    id: "g-103",
    userId: "pat-1",
    name: "Elderly Care Home Renovation",
    targetAmount: 5000,
    currentAmount: 2500,
    currency: "USD ($)",
    targetDate: "2027-03-31",
    priority: "High",
    category: "House",
    monthlyContribution: 400,
    notes: "Ramp and bathroom accessibility upgrades.",
    createdAt: "2026-03-01T00:00:00",
    updatedAt: `${TODAY_STR}T08:00:00`
  }
];

interface Props {
  patient: Patient;
}

export const FinanceBudgetTracker: React.FC<Props> = ({ patient }) => {
  // Screens: "dashboard" | "add_transaction" | "budgets" | "add_budget" | "goals" | "add_goal" | "reports" | "history" | "settings"
  const [currentScreen, setCurrentScreen] = useState<string>("dashboard");

  // LOCAL STORAGE STATE
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_finance_txs");
      return saved ? JSON.parse(saved) : DEMO_TRANSACTIONS;
    } catch {
      return DEMO_TRANSACTIONS;
    }
  });

  const [budgets, setBudgets] = useState<FinancialBudget[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_finance_budgets");
      return saved ? JSON.parse(saved) : DEMO_BUDGETS;
    } catch {
      return DEMO_BUDGETS;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<FinancialSavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_finance_goals");
      return saved ? JSON.parse(saved) : DEMO_GOALS;
    } catch {
      return DEMO_GOALS;
    }
  });

  const [settings, setSettings] = useState({
    defaultCurrency: "USD ($)",
    defaultPaymentMethod: "Bank Transfer",
    dateFormat: "YYYY-MM-DD",
    monthlyBudgetDay: 1,
    autoAddRecurring: true,
    budgetAlert80: true,
    budgetAlert100: true,
    dailySummary: true
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("care2care_finance_txs", JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_finance_budgets", JSON.stringify(budgets));
    } catch (e) {
      console.error(e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem("care2care_finance_goals", JSON.stringify(savingsGoals));
    } catch (e) {
      console.error(e);
    }
  }, [savingsGoals]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Month filter for Dashboard / Reports
  const [selectedMonth, setSelectedMonth] = useState<string>(CURRENT_MONTH_STR);

  // Financial Summaries
  const monthTransactions = useMemo(() => {
    return safeArray<FinancialTransaction>(transactions).filter(
      (tx) => tx && safeStr(tx.date).startsWith(selectedMonth)
    );
  }, [transactions, selectedMonth]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    monthTransactions.forEach((tx) => {
      if (tx.type === "income") income += safeNum(tx.amount);
      if (tx.type === "expense") expense += safeNum(tx.amount);
    });

    const net = income - expense;
    const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

    return {
      income: Math.round(income),
      expense: Math.round(expense),
      net: Math.round(net),
      savingsRate
    };
  }, [monthTransactions]);

  // Categories Breakdown
  const categoryExpenses = useMemo(() => {
    const map: { [key: string]: number } = {};
    monthTransactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        const cat = tx.category || "Uncategorized";
        map[cat] = (map[cat] || 0) + safeNum(tx.amount);
      });

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthTransactions]);

  // ADD TRANSACTION FORM STATE
  const [txForm, setTxForm] = useState({
    type: "expense" as "income" | "expense" | "transfer",
    category: "Food & Groceries",
    subCategory: "General",
    amount: 100,
    currency: "USD ($)",
    date: TODAY_STR,
    description: "",
    paymentMethod: "Credit Card",
    merchant: "",
    receiptPhoto: "",
    isRecurring: false,
    recurrencePattern: "Monthly",
    recurrenceEndDate: "",
    tags: "",
    notes: ""
  });

  const handleSaveTransaction = (addAnother = false) => {
    try {
      if (!txForm.description.trim()) {
        alert("Please enter a description for the transaction.");
        return;
      }
      if (txForm.amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
      }

      const newTx: FinancialTransaction = {
        id: "tx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
        userId: patient.id || "pat-1",
        type: txForm.type,
        category: txForm.category,
        subCategory: txForm.subCategory || "General",
        amount: safeNum(txForm.amount),
        currency: txForm.currency,
        date: safeDate(txForm.date),
        description: txForm.description,
        paymentMethod: txForm.paymentMethod,
        merchant: txForm.merchant || "Standard Vendor",
        receiptPhoto: txForm.receiptPhoto,
        isRecurring: txForm.isRecurring,
        recurrencePattern: txForm.recurrencePattern,
        recurrenceEndDate: txForm.recurrenceEndDate,
        tags: txForm.tags
          ? txForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        notes: txForm.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTransactions((prev) => [newTx, ...prev]);

      // If expense, update spent in matching budget
      if (newTx.type === "expense") {
        setBudgets((prevBudgets) =>
          prevBudgets.map((b) => {
            if (b.category === newTx.category && b.month === selectedMonth) {
              return { ...b, spent: safeNum(b.spent) + newTx.amount };
            }
            return b;
          })
        );
      }

      showToast(`Logged ${newTx.type.toUpperCase()}: ${newTx.currency} ${newTx.amount}`);

      if (addAnother) {
        setTxForm((prev) => ({
          ...prev,
          amount: 50,
          description: "",
          merchant: "",
          receiptPhoto: "",
          notes: ""
        }));
      } else {
        setCurrentScreen("dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction record?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast("Transaction deleted.");
    }
  };

  // BUDGET FORM STATE
  const [budgetForm, setBudgetForm] = useState({
    category: "Food & Groceries",
    subCategory: "General",
    amount: 500,
    month: CURRENT_MONTH_STR,
    notes: ""
  });

  const handleSaveBudget = () => {
    try {
      if (budgetForm.amount <= 0) {
        alert("Please enter a valid budget target amount.");
        return;
      }
      const newBudget: FinancialBudget = {
        id: "b_" + Date.now(),
        userId: patient.id || "pat-1",
        category: budgetForm.category,
        subCategory: budgetForm.subCategory || "General",
        amount: safeNum(budgetForm.amount),
        spent: 0,
        month: budgetForm.month || CURRENT_MONTH_STR,
        year: Number(budgetForm.month.split("-")[0]) || 2026,
        notes: budgetForm.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Calculate current spent from existing month transactions
      const existingSpent = monthTransactions
        .filter((t) => t.type === "expense" && t.category === newBudget.category)
        .reduce((sum, t) => sum + safeNum(t.amount), 0);
      newBudget.spent = existingSpent;

      setBudgets((prev) => [newBudget, ...prev]);
      showToast(`Budget created for ${newBudget.category}`);
      setCurrentScreen("budgets");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBudget = (id: string) => {
    if (confirm("Delete this budget constraint?")) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      showToast("Budget removed.");
    }
  };

  // SAVINGS GOAL FORM STATE
  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: 1000,
    currentAmount: 0,
    currency: "USD ($)",
    targetDate: safeDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)),
    priority: "Medium" as "High" | "Medium" | "Low",
    category: "Emergency",
    monthlyContribution: 100,
    notes: ""
  });

  const handleSaveGoal = () => {
    try {
      if (!goalForm.name.trim()) {
        alert("Please enter a goal name.");
        return;
      }
      if (goalForm.targetAmount <= 0) {
        alert("Please enter a target amount.");
        return;
      }
      const newGoal: FinancialSavingsGoal = {
        id: "g_" + Date.now(),
        userId: patient.id || "pat-1",
        name: goalForm.name,
        targetAmount: safeNum(goalForm.targetAmount),
        currentAmount: safeNum(goalForm.currentAmount),
        currency: goalForm.currency,
        targetDate: safeDate(goalForm.targetDate),
        priority: goalForm.priority,
        category: goalForm.category,
        monthlyContribution: safeNum(goalForm.monthlyContribution),
        notes: goalForm.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setSavingsGoals((prev) => [newGoal, ...prev]);
      showToast(`Savings Goal '${newGoal.name}' added.`);
      setCurrentScreen("goals");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGoalProgress = (id: string, addAmount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = safeNum(g.currentAmount) + safeNum(addAmount);
          return { ...g, currentAmount: Math.min(g.targetAmount, updated) };
        }
        return g;
      })
    );
    showToast("Goal progress updated!");
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Delete this savings goal?")) {
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      showToast("Goal removed.");
    }
  };

  // HISTORY FILTERS
  const [historySearch, setHistorySearch] = useState("");
  const [historyType, setHistoryType] = useState("all");
  const [historyCategory, setHistoryCategory] = useState("all");

  const filteredHistoryTransactions = useMemo(() => {
    return safeArray<FinancialTransaction>(transactions).filter((tx) => {
      const matchSearch =
        safeStr(tx.description).toLowerCase().includes(historySearch.toLowerCase()) ||
        safeStr(tx.merchant).toLowerCase().includes(historySearch.toLowerCase()) ||
        safeStr(tx.category).toLowerCase().includes(historySearch.toLowerCase());
      const matchType = historyType === "all" || tx.type === historyType;
      const matchCat = historyCategory === "all" || tx.category === historyCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, historySearch, historyType, historyCategory]);

  // Export Financial Statement
  const handleExportStatement = (format: "txt" | "csv") => {
    let content = "";
    if (format === "csv") {
      content = "Date,Type,Category,Description,Merchant,Amount,Payment Method,Notes\n";
      transactions.forEach((t) => {
        content += `"${t.date}","${t.type}","${t.category}","${t.description}","${t.merchant}",${t.amount},"${t.paymentMethod}","${t.notes}"\n`;
      });
    } else {
      content = `CARETOCARE - FINANCIAL STATEMENT REPORT
Month: ${selectedMonth}
Patient/User: ${patient.name}
Total Income: $${totals.income}
Total Expenses: $${totals.expense}
Net Balance: $${totals.net}
Savings Rate: ${totals.savingsRate}%

TRANSACTIONS RECORD (${transactions.length}):
${transactions
  .map(
    (t, i) =>
      `${i + 1}. [${t.date}] [${t.type.toUpperCase()}] ${t.category} - ${t.description} ($${t.amount}) via ${t.paymentMethod}`
  )
  .join("\n")}
`;
    }

    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Financial_Report_${selectedMonth}.${format}`;
    a.click();
    showToast(`Exported report as ${format.toUpperCase()}`);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Check className="w-5 h-5 text-emerald-200" />
          {toastMessage}
        </div>
      )}

      {/* HEADER BAR */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-3">
        <header className="bg-white rounded-3xl p-4 sm:p-5 text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md shrink-0">
                💰
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                    Finance & Budget Tracker
                  </h1>
                  <span className="text-[10px] bg-emerald-100 text-[#2E7D32] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Care2Care Suite
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  Patient: {patient.name} • Wealth, Budgeting & Expenses Management
                </p>
              </div>
            </div>

            {/* Month selector & Quick links */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Calendar className="w-4 h-4 text-[#2E7D32] mr-2" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-slate-900 font-extrabold outline-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => setCurrentScreen("history")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentScreen === "history"
                    ? "bg-[#2E7D32] text-white shadow-xs font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> History
              </button>

              <button
                onClick={() => setCurrentScreen("settings")}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentScreen === "settings"
                    ? "bg-[#2E7D32] text-white shadow-xs font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
            </div>
          </div>

          {/* SUB-NAV TABS BAR */}
          <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                currentScreen === "dashboard"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Dashboard
            </button>
            <button
              onClick={() => {
                setTxForm((prev) => ({ ...prev, type: "income" }));
                setCurrentScreen("add_transaction");
              }}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                currentScreen === "add_transaction" && txForm.type === "income"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Income
            </button>
            <button
              onClick={() => {
                setTxForm((prev) => ({ ...prev, type: "expense" }));
                setCurrentScreen("add_transaction");
              }}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                currentScreen === "add_transaction" && txForm.type === "expense"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" /> Expense
            </button>
            <button
              onClick={() => setCurrentScreen("budgets")}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                currentScreen === "budgets"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" /> Budgets
            </button>
            <button
              onClick={() => setCurrentScreen("goals")}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                currentScreen === "goals"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Target className="w-3.5 h-3.5" /> Goals
            </button>
            <button
              onClick={() => setCurrentScreen("reports")}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                currentScreen === "reports"
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" /> Reports
            </button>

            <button
              onClick={() => setCurrentScreen("cash_collector_matrix")}
              className={`flex-1 min-w-[170px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 border ${
                currentScreen === "cash_collector_matrix"
                  ? "bg-[#2E7D32] text-white shadow-md font-black border-emerald-500"
                  : "bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border-emerald-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Cash & Credit Matrix</span>
              <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                NEW
              </span>
            </button>
          </div>
        </header>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ========================================================= */}
        {/* SCREEN 1: MAIN DASHBOARD                                 */}
        {/* ========================================================= */}
        {currentScreen === "dashboard" && (
          <div className="space-y-6">
            {/* TOP METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Net Balance Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-4 h-4 text-indigo-600" /> Net Balance
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {selectedMonth}
                  </span>
                </div>
                <div className="my-1">
                  <span className="text-3xl font-black text-slate-900">
                    ${totals.net.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                  {totals.net >= 0 ? (
                    <span className="text-emerald-600 font-bold flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Positive Surplus
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Monthly Deficit
                    </span>
                  )}
                </p>
              </div>

              {/* Income Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Total Income
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Earned
                  </span>
                </div>
                <div className="my-1">
                  <span className="text-3xl font-black text-emerald-600">
                    +${totals.income.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  From {monthTransactions.filter((t) => t.type === "income").length} deposit entries
                </p>
              </div>

              {/* Expenses Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-rose-600" /> Total Expenses
                  </span>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    Spent
                  </span>
                </div>
                <div className="my-1">
                  <span className="text-3xl font-black text-rose-600">
                    -${totals.expense.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Across {monthTransactions.filter((t) => t.type === "expense").length} expense records
                </p>
              </div>

              {/* Savings Rate Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-4 h-4 text-purple-600" /> Savings Rate
                  </span>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    Target 20%+
                  </span>
                </div>
                <div className="my-1">
                  <span className="text-3xl font-black text-purple-700">
                    {totals.savingsRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, totals.savingsRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS BANNER */}
            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-300" /> Quick Financial Actions
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Record new incomes, track daily receipts, or set new category budget limits
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    setTxForm((prev) => ({ ...prev, type: "income" }));
                    setCurrentScreen("add_transaction");
                  }}
                  className="flex-1 md:flex-initial bg-white text-emerald-900 font-black px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-600" /> Add Income
                </button>
                <button
                  onClick={() => {
                    setTxForm((prev) => ({ ...prev, type: "expense" }));
                    setCurrentScreen("add_transaction");
                  }}
                  className="flex-1 md:flex-initial bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-600 transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-rose-300" /> Add Expense
                </button>
                <button
                  onClick={() => setCurrentScreen("add_budget")}
                  className="flex-1 md:flex-initial bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-600 transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-amber-300" /> Add Budget
                </button>
                <button
                  onClick={() => setCurrentScreen("add_goal")}
                  className="flex-1 md:flex-initial bg-emerald-800 text-emerald-100 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition-all border border-emerald-600 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-4 h-4 text-purple-300" /> Add Savings Goal
                </button>
                <button
                  onClick={() => setCurrentScreen("cash_collector_matrix")}
                  className="flex-1 md:flex-initial bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-900" /> Cash & Credit Matrix
                </button>
              </div>
            </div>

            {/* EXPENSE BREAKDOWN & RECENT TRANSACTIONS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TOP SPENDING CATEGORIES */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-indigo-600" /> Top Expense Categories
                  </h3>
                  <button
                    onClick={() => setCurrentScreen("reports")}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>

                {categoryExpenses.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm font-medium">
                    No expense records logged for {selectedMonth}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categoryExpenses.slice(0, 5).map((item, idx) => {
                      const pct =
                        totals.expense > 0
                          ? Math.round((item.amount / totals.expense) * 100)
                          : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-700">{item.category}</span>
                            <span className="text-slate-900">${item.amount.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RECENT TRANSACTIONS */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" /> Recent Transactions
                  </h3>
                  <button
                    onClick={() => setCurrentScreen("history")}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    View History
                  </button>
                </div>

                {transactions.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-medium">
                    No transactions recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {transactions.slice(0, 6).map((tx) => (
                      <div
                        key={tx.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                              tx.type === "income"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {tx.type === "income" ? "💵" : "🛍️"}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                              {tx.description}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">
                              {tx.category} • {tx.merchant} • {tx.date}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p
                              className={`font-black text-sm ${
                                tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold">{tx.paymentMethod}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* BUDGET PROGRESS & SAVINGS GOALS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BUDGETS SUMMARY */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-amber-500" /> Active Budgets ({selectedMonth})
                  </h3>
                  <button
                    onClick={() => setCurrentScreen("budgets")}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    Manage Budgets
                  </button>
                </div>

                {budgets.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No budget limits configured.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {budgets.map((b) => {
                      const pct = Math.min(100, Math.round((safeNum(b.spent) / (b.amount || 1)) * 100));
                      const isOver = b.spent > b.amount;
                      return (
                        <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-800">{b.category}</span>
                            <span className={isOver ? "text-rose-600" : "text-slate-600"}>
                              ${b.spent} / ${b.amount} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isOver ? "bg-rose-600" : pct > 80 ? "bg-amber-500" : "bg-emerald-600"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SAVINGS GOALS */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" /> Savings Goals Target
                  </h3>
                  <button
                    onClick={() => setCurrentScreen("goals")}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    View All Goals
                  </button>
                </div>

                {savingsGoals.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No savings goals created.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savingsGoals.map((g) => {
                      const pct = Math.min(
                        100,
                        Math.round((safeNum(g.currentAmount) / (g.targetAmount || 1)) * 100)
                      );
                      return (
                        <div key={g.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-800">{g.name}</span>
                            <span className="text-purple-700">
                              ${g.currentAmount} / ${g.targetAmount} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-purple-600 h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: ADD TRANSACTION (INCOME / EXPENSE FORM)        */}
        {/* ========================================================= */}
        {currentScreen === "add_transaction" && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-700" /> Log Financial Transaction
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Record new income streams or expense payments accurately
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TYPE SELECTOR TABS */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTxForm((prev) => ({ ...prev, type: "income", category: "Salary" }))}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  txForm.type === "income" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Income
              </button>
              <button
                type="button"
                onClick={() => setTxForm((prev) => ({ ...prev, type: "expense", category: "Food & Groceries" }))}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  txForm.type === "expense" ? "bg-rose-700 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <TrendingDown className="w-4 h-4" /> Expense
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={txForm.category}
                  onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                >
                  {txForm.type === "income"
                    ? INCOME_CATEGORIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.icon} {c.name}
                        </option>
                      ))
                    : EXPENSE_CATEGORIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: safeNum(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={txForm.currency}
                  onChange={(e) => setTxForm({ ...txForm, currency: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction Date *
                </label>
                <input
                  type="date"
                  value={txForm.date}
                  onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Produce at Whole Foods"
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* Merchant / Vendor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Merchant / Payer
                </label>
                <input
                  type="text"
                  placeholder="e.g. CVS Pharmacy"
                  value={txForm.merchant}
                  onChange={(e) => setTxForm({ ...txForm, merchant: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={txForm.paymentMethod}
                  onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receipt Photo URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receipt Photo URL (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={txForm.receiptPhoto}
                    onChange={(e) => setTxForm({ ...txForm, receiptPhoto: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setTxForm({
                        ...txForm,
                        receiptPhoto:
                          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80"
                      })
                    }
                    className="bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Camera className="w-4 h-4 text-slate-600" /> Sample Receipt
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. rx, health, urgent"
                  value={txForm.tags}
                  onChange={(e) => setTxForm({ ...txForm, tags: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Write details..."
                  value={txForm.notes}
                  onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentScreen("dashboard")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveTransaction(true)}
                  className="px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-800 font-bold text-xs hover:bg-emerald-50"
                >
                  Save & Add Another
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTransaction(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-black text-xs hover:bg-emerald-700 shadow-sm"
                >
                  Save Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: BUDGET MANAGEMENT                              */}
        {/* ========================================================= */}
        {currentScreen === "budgets" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-500" /> Category Budget Constraints ({selectedMonth})
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Set monthly spending limits per category and track alerts in real time
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen("add_budget")}
                  className="bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Budget
                </button>
              </div>
            </div>

            {/* BUDGET LIST */}
            {budgets.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-slate-500 font-medium text-sm">
                  No budget constraints setup for {selectedMonth}.
                </p>
                <button
                  onClick={() => setCurrentScreen("add_budget")}
                  className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Create First Budget
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((b) => {
                  const pct = Math.min(100, Math.round((safeNum(b.spent) / (b.amount || 1)) * 100));
                  const isOver = b.spent > b.amount;
                  return (
                    <div
                      key={b.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{b.category}</h3>
                          <p className="text-xs text-slate-400 font-medium">{b.notes || "Monthly Budget"}</p>
                        </div>
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                            isOver
                              ? "bg-rose-100 text-rose-800"
                              : pct > 80
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isOver ? "Over Budget" : pct > 80 ? "Near Cap" : "On Track"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Spent: ${b.spent}</span>
                          <span className="text-slate-900">Cap: ${b.amount}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOver ? "bg-rose-600" : pct > 80 ? "bg-amber-500" : "bg-emerald-600"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 text-right font-semibold">
                          {b.amount - b.spent >= 0
                            ? `$${b.amount - b.spent} remaining`
                            : `$${Math.abs(b.amount - b.spent)} over limit`}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleDeleteBudget(b.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Budget"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: ADD BUDGET FORM                                */}
        {/* ========================================================= */}
        {currentScreen === "add_budget" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-500" /> Set Category Budget
                </h2>
                <p className="text-xs text-slate-500 font-medium">Define maximum monthly spending cap</p>
              </div>
              <button
                onClick={() => setCurrentScreen("budgets")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Category *
                </label>
                <select
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Budget Cap Amount ($) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm({ ...budgetForm, amount: safeNum(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Month *
                </label>
                <input
                  type="month"
                  value={budgetForm.month}
                  onChange={(e) => setBudgetForm({ ...budgetForm, month: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maximum grocery allowance"
                  value={budgetForm.notes}
                  onChange={(e) => setBudgetForm({ ...budgetForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentScreen("budgets")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-black text-xs hover:bg-emerald-700 shadow-sm"
              >
                Save Budget
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: SAVINGS GOALS                                  */}
        {/* ========================================================= */}
        {currentScreen === "goals" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" /> Savings & Reserve Goals
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Track short-term and long-term financial targets
                </p>
              </div>

              <button
                onClick={() => setCurrentScreen("add_goal")}
                className="bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Savings Goal
              </button>
            </div>

            {/* GOALS GRID */}
            {savingsGoals.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-slate-500 font-medium text-sm">No savings goals created yet.</p>
                <button
                  onClick={() => setCurrentScreen("add_goal")}
                  className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Create First Goal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savingsGoals.map((g) => {
                  const pct = Math.min(
                    100,
                    Math.round((safeNum(g.currentAmount) / (g.targetAmount || 1)) * 100)
                  );
                  return (
                    <div
                      key={g.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {g.priority} Priority
                          </span>
                          <span className="text-xs text-slate-400 font-bold">Target: {g.targetDate}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{g.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{g.notes || "Savings Target"}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between text-xs font-bold">
                          <span className="text-purple-700 text-base font-black">${g.currentAmount}</span>
                          <span className="text-slate-500">/ ${g.targetAmount}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleUpdateGoalProgress(g.id, 100)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          +$100 Deposit
                        </button>

                        <button
                          onClick={() => handleDeleteGoal(g.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 6: ADD SAVINGS GOAL FORM                          */}
        {/* ========================================================= */}
        {currentScreen === "add_goal" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" /> Create Savings Goal
                </h2>
                <p className="text-xs text-slate-500 font-medium">Set target amounts and completion dates</p>
              </div>
              <button
                onClick={() => setCurrentScreen("goals")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Goal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Health Fund"
                  value={goalForm.name}
                  onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Amount ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, targetAmount: safeNum(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Saved ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={goalForm.currentAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, currentAmount: safeNum(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={goalForm.priority}
                    onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Details about this savings target..."
                  value={goalForm.notes}
                  onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentScreen("goals")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoal}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-black text-xs hover:bg-emerald-700 shadow-sm"
              >
                Save Goal
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 7: FINANCIAL REPORTS & GEMINI AI INSIGHTS          */}
        {/* ========================================================= */}
        {currentScreen === "reports" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-cyan-600" /> Financial Reports & Gemini Insights
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Detailed cash flow analysis, expense breakdowns, and automated suggestions
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleExportStatement("txt")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Report
                </button>
                <button
                  onClick={() => handleExportStatement("csv")}
                  className="bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> CSV Export
                </button>
              </div>
            </div>

            {/* AI ADVISORY CARD */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Sparkles className="w-5 h-5" /> Care2Care Gemini AI Financial Advisory
              </div>
              <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                {totals.net >= 0
                  ? `Your overall monthly cash flow for ${selectedMonth} is healthy with a net surplus of $${totals.net}. You achieved a ${totals.savingsRate}% savings rate! We recommend allocating $${Math.round(
                      totals.net * 0.5
                    )} directly toward your high-priority Emergency Reserve.`
                  : `Notice: Expenses exceed income by $${Math.abs(
                      totals.net
                    )} this month. Review your top spending category (${categoryExpenses[0]?.category || "Food & Groceries"}) to trim non-essential items.`}
              </p>
            </div>

            {/* EXPENSE BREAKDOWN TABLE */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Category Breakdown ({selectedMonth})</h3>
              <div className="divide-y divide-slate-100">
                {categoryExpenses.map((c, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{c.category}</span>
                    <span className="text-slate-900">${c.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 8: TRANSACTION HISTORY & FILTER SEARCH            */}
        {/* ========================================================= */}
        {currentScreen === "history" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-700" /> Full Transaction History
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Search and filter all logged records across time
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScreen("add_transaction")}
                  className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  + Log Transaction
                </button>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by vendor, category, or title..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={historyType}
                  onChange={(e) => setHistoryType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expense Only</option>
                </select>
              </div>

              {/* LIST */}
              <div className="divide-y divide-slate-100">
                {filteredHistoryTransactions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm font-medium">
                    No matching transaction records found.
                  </div>
                ) : (
                  filteredHistoryTransactions.map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{tx.description}</h4>
                        <p className="text-xs text-slate-500">
                          {tx.category} • {tx.merchant} • {tx.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-black text-sm ${
                            tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}${tx.amount}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 9: SETTINGS                                       */}
        {/* ========================================================= */}
        {currentScreen === "settings" && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" /> Finance Settings & Preferences
                </h2>
                <p className="text-xs text-slate-500 font-medium">Configure currency, alerts, and recurring tools</p>
              </div>
              <button
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Currency
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">Alerts & Notifications</h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={settings.budgetAlert80}
                    onChange={(e) => setSettings({ ...settings, budgetAlert80: e.target.checked })}
                    className="accent-emerald-700 w-4 h-4"
                  />
                  Alert me when a category budget reaches 80% limit
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={settings.budgetAlert100}
                    onChange={(e) => setSettings({ ...settings, budgetAlert100: e.target.checked })}
                    className="accent-emerald-700 w-4 h-4"
                  />
                  Alert me when a budget limit is exceeded (100%)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset finance data to defaults?")) {
                      setTransactions(DEMO_TRANSACTIONS);
                      setBudgets(DEMO_BUDGETS);
                      setSavingsGoals(DEMO_GOALS);
                      showToast("Reset to initial defaults.");
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Reset All Finance Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast("Settings saved successfully.");
                    setCurrentScreen("dashboard");
                  }}
                  className="bg-emerald-800 text-white font-black px-6 py-2 rounded-xl text-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: CASH COLLECTORS & CREDIT SALES LEDGER MATRIX */}
        {currentScreen === "cash_collector_matrix" && (
          <CashCollectionCreditLedgerTracker onBackToFinance={() => setCurrentScreen("dashboard")} />
        )}
      </main>
    </div>
  );
};
