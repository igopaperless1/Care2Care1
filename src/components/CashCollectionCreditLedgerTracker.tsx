import React, { useState, useMemo } from "react";
import {
  Wallet,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  Printer,
  Sparkles,
  Receipt,
  Building2,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Eye,
  Camera,
  Check,
  TrendingDown,
  Phone,
  Tag
} from "lucide-react";

// ==========================================
// TYPES & INTERFACES
// ==========================================
export type CollectionStatus = "paid" | "missed" | "pending";

export interface CashCollectorPerson {
  id: string;
  sn: number;
  name: string;
  phone?: string;
  reference?: string;
  dailyTargetAmount: number;
  // Day status indexed by day number (1 to 31)
  dailyStatus: Record<number, CollectionStatus>;
  notes?: string;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreditDayBill {
  id: string;
  invoiceNo: string;
  type: "credit_sale" | "credit_purchase" | "cash_payment";
  date: string;
  dayNumber: number;
  retailerName: string;
  boughtBy?: string; // In case someone else buys on behalf of account holder
  items: BillItem[];
  amount: number;
  paidAmount: number;
  balanceDue: number;
  status: "paid" | "partial" | "credit";
  reference?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface RetailerCreditRecord {
  id: string;
  sn: number;
  name: string;
  storeName?: string;
  phone?: string;
  city?: string;
  // Bills indexed by day number (1 to 31)
  dailyBills: Record<number, CreditDayBill[]>;
  notes?: string;
}

interface Props {
  onBackToFinance?: () => void;
}

// ==========================================
// INITIAL DEMO DATA MATCHING HANDWRITTEN NOTE
// ==========================================
const INITIAL_COLLECTOR_PEOPLE: CashCollectorPerson[] = [
  {
    id: "cp-1",
    sn: 1,
    name: "RK (Rajesh Kumar)",
    phone: "+977 9841234567",
    reference: "Shop #12 - Kathmandu",
    dailyTargetAmount: 500,
    dailyStatus: {
      1: "paid",
      2: "paid",
      3: "missed",
      4: "paid",
      5: "missed",
      6: "pending",
      7: "paid",
      8: "paid",
      9: "paid",
      10: "missed",
      11: "pending",
      12: "paid",
      15: "paid"
    },
    notes: "Daily morning 10 AM collection."
  },
  {
    id: "cp-2",
    sn: 2,
    name: "MP (Mahesh Patel)",
    phone: "+977 9801987654",
    reference: "Grocery Store - Lalitpur",
    dailyTargetAmount: 1000,
    dailyStatus: {
      1: "paid",
      2: "paid",
      3: "paid",
      4: "paid",
      5: "paid",
      6: "paid",
      7: "missed",
      8: "pending",
      9: "paid"
    },
    notes: "Prefers digital bank transfer."
  },
  {
    id: "cp-3",
    sn: 3,
    name: "CB (Chandra Bahadur)",
    phone: "+977 9812340000",
    reference: "Medical Pharmacy - Bhaktapur",
    dailyTargetAmount: 750,
    dailyStatus: {
      1: "paid",
      2: "missed",
      3: "missed",
      4: "paid",
      5: "pending",
      6: "paid",
      7: "paid"
    },
    notes: "Weekly settlement on Friday."
  },
  {
    id: "cp-4",
    sn: 4,
    name: "SK (Suresh Shrestha)",
    phone: "+977 9860112233",
    reference: "Hardware Mart - Thamel",
    dailyTargetAmount: 1200,
    dailyStatus: {
      1: "pending",
      2: "paid",
      3: "paid",
      4: "paid",
      5: "paid"
    },
    notes: "Prompt payment history."
  },
  {
    id: "cp-5",
    sn: 5,
    name: "AM (Anil Maharjan)",
    phone: "+977 9849887766",
    reference: "Textile Emporium",
    dailyTargetAmount: 2000,
    dailyStatus: {
      1: "paid",
      2: "paid",
      3: "paid",
      4: "missed",
      5: "pending"
    },
    notes: "Evening 5 PM collection."
  }
];

const INITIAL_RETAILERS: RetailerCreditRecord[] = [
  {
    id: "ret-1",
    sn: 1,
    name: "MK (Manoj Karki)",
    storeName: "MK Superstore",
    phone: "+977 9851099887",
    city: "Kathmandu",
    dailyBills: {
      1: [
        {
          id: "bill-101",
          invoiceNo: "INV-2026-001",
          type: "credit_sale",
          date: "2026-08-01",
          dayNumber: 1,
          retailerName: "MK (Manoj Karki)",
          items: [
            { id: "i1", description: "Wholesale Medicine Pack A", quantity: 10, unitPrice: 850, total: 8500 },
            { id: "i2", description: "Surgical Gloves Box", quantity: 5, unitPrice: 400, total: 2000 }
          ],
          amount: 10500,
          paidAmount: 2000,
          balanceDue: 8500,
          status: "credit",
          reference: "PO #8812",
          notes: "Partial payment received at delivery."
        }
      ],
      2: [
        {
          id: "bill-102",
          invoiceNo: "INV-2026-002",
          type: "cash_payment",
          date: "2026-08-02",
          dayNumber: 2,
          retailerName: "MK (Manoj Karki)",
          items: [
            { id: "i3", description: "Payment for previous ledger", quantity: 1, unitPrice: 5000, total: 5000 }
          ],
          amount: 5000,
          paidAmount: 5000,
          balanceDue: 0,
          status: "paid",
          reference: "E-Sewa Ref #9921",
          notes: "Full payment for day 2."
        }
      ],
      3: [
        {
          id: "bill-103",
          invoiceNo: "INV-2026-003",
          type: "cash_payment",
          date: "2026-08-03",
          dayNumber: 3,
          retailerName: "MK (Manoj Karki)",
          items: [
            { id: "i4", description: "Cash Settlement", quantity: 1, unitPrice: 3500, total: 3500 }
          ],
          amount: 3500,
          paidAmount: 3500,
          balanceDue: 0,
          status: "paid",
          reference: "Cash Receipt #441",
          notes: "Collected by Field Agent."
        }
      ],
      4: [
        {
          id: "bill-104",
          invoiceNo: "INV-2026-004",
          type: "credit_sale",
          date: "2026-08-04",
          dayNumber: 4,
          retailerName: "MK (Manoj Karki)",
          items: [
            { id: "i5", description: "Hydration Supplements Carton", quantity: 20, unitPrice: 1100, total: 22011 }
          ],
          amount: 22011,
          paidAmount: 0,
          balanceDue: 22011,
          status: "credit",
          reference: "Batch #9021",
          notes: "Credit given till end of month."
        }
      ]
    },
    notes: "Total pending ledger balance verified: 30,511/-"
  },
  {
    id: "ret-2",
    sn: 2,
    name: "RP (Ramesh Paudel)",
    storeName: "Paudel Traders",
    phone: "+977 9841882211",
    city: "Patan",
    dailyBills: {
      1: [
        {
          id: "bill-201",
          invoiceNo: "INV-2026-010",
          type: "credit_sale",
          date: "2026-08-01",
          dayNumber: 1,
          retailerName: "RP (Ramesh Paudel)",
          items: [{ id: "i6", description: "First Aid Kits Bulk", quantity: 15, unitPrice: 900, total: 13500 }],
          amount: 13500,
          paidAmount: 3500,
          balanceDue: 10000,
          status: "credit",
          reference: "PO #101"
        }
      ]
    },
    notes: "15-day credit limit."
  },
  {
    id: "ret-3",
    sn: 3,
    name: "GT (Gita Thapa)",
    storeName: "Thapa Medicals",
    phone: "+977 9803114422",
    city: "Bhaktapur",
    dailyBills: {
      2: [
        {
          id: "bill-301",
          invoiceNo: "INV-2026-015",
          type: "credit_purchase",
          date: "2026-08-02",
          dayNumber: 2,
          retailerName: "GT (Gita Thapa)",
          items: [{ id: "i7", description: "Raw Material Supplies", quantity: 10, unitPrice: 1500, total: 15000 }],
          amount: 15000,
          paidAmount: 5000,
          balanceDue: 10000,
          status: "credit",
          reference: "Supplier Bill #882"
        }
      ]
    },
    notes: "Wholesale stock supplier."
  }
];

export const CashCollectionCreditLedgerTracker: React.FC<Props> = ({ onBackToFinance }) => {
  // Main view tab: "cash_collection" | "credit_sales"
  const [activeTab, setActiveTab] = useState<"cash_collection" | "credit_sales">("cash_collection");

  // Local storage persistence
  const [collectorPeople, setCollectorPeople] = useState<CashCollectorPerson[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_cash_collector_people");
      return saved ? JSON.parse(saved) : INITIAL_COLLECTOR_PEOPLE;
    } catch {
      return INITIAL_COLLECTOR_PEOPLE;
    }
  });

  const [retailers, setRetailers] = useState<RetailerCreditRecord[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_credit_retailers");
      return saved ? JSON.parse(saved) : INITIAL_RETAILERS;
    } catch {
      return INITIAL_RETAILERS;
    }
  });

  // Number of days in current month view (default 30)
  const [totalDays, setTotalDays] = useState<number>(30);
  const [monthName, setMonthName] = useState<string>("August 2026");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);
  const [showAddRetailerModal, setShowAddRetailerModal] = useState<boolean>(false);
  const [showAddBillModal, setShowAddBillModal] = useState<boolean>(false);
  const [selectedRetailerForBill, setSelectedRetailerForBill] = useState<{ retailer: RetailerCreditRecord; day: number } | null>(null);

  // Pop-up Detail Modal for (*) Bill Inspection
  const [inspectBillModal, setInspectBillModal] = useState<{ retailer: RetailerCreditRecord; dayNumber: number; bills: CreditDayBill[] } | null>(null);

  // Save to LocalStorage helpers
  const saveCollectors = (data: CashCollectorPerson[]) => {
    setCollectorPeople(data);
    localStorage.setItem("care2care_cash_collector_people", JSON.stringify(data));
  };

  const saveRetailers = (data: RetailerCreditRecord[]) => {
    setRetailers(data);
    localStorage.setItem("care2care_credit_retailers", JSON.stringify(data));
  };

  // ==========================================
  // HANDLERS FOR CASH COLLECTION MATRIX
  // ==========================================
  const handleToggleCellStatus = (personId: string, dayNum: number) => {
    const updated = collectorPeople.map((p) => {
      if (p.id !== personId) return p;
      const current = p.dailyStatus[dayNum];
      let next: CollectionStatus = "paid";
      if (!current || current === "pending") next = "paid";
      else if (current === "paid") next = "missed";
      else if (current === "missed") next = "pending";

      return {
        ...p,
        dailyStatus: {
          ...p.dailyStatus,
          [dayNum]: next
        }
      };
    });
    saveCollectors(updated);
  };

  const handleMarkAllPaidForDay = (dayNum: number) => {
    const updated = collectorPeople.map((p) => ({
      ...p,
      dailyStatus: {
        ...p.dailyStatus,
        [dayNum]: "paid" as CollectionStatus
      }
    }));
    saveCollectors(updated);
  };

  const handleCreatePerson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string) || "New Client";
    const phone = (formData.get("phone") as string) || "";
    const reference = (formData.get("reference") as string) || "";
    const dailyTargetAmount = Number(formData.get("target") || 500);

    const newP: CashCollectorPerson = {
      id: "cp-" + Date.now(),
      sn: collectorPeople.length + 1,
      name,
      phone,
      reference,
      dailyTargetAmount,
      dailyStatus: {},
      notes: "Newly added client"
    };

    saveCollectors([...collectorPeople, newP]);
    setShowAddPersonModal(false);
  };

  // ==========================================
  // HANDLERS FOR CREDIT RETAILER MATRIX & BILLS
  // ==========================================
  const handleCreateRetailer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string) || "New Retailer";
    const storeName = (formData.get("storeName") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const city = (formData.get("city") as string) || "Kathmandu";

    const newR: RetailerCreditRecord = {
      id: "ret-" + Date.now(),
      sn: retailers.length + 1,
      name,
      storeName,
      phone,
      city,
      dailyBills: {},
      notes: "Active credit customer"
    };

    saveRetailers([...retailers, newR]);
    setShowAddRetailerModal(false);
  };

  // Form state for creating detailed bill / credit transaction
  const [billType, setBillType] = useState<"credit_sale" | "credit_purchase" | "cash_payment">("credit_sale");
  const [billItems, setBillItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
    { description: "Primary Goods / Service Pack", quantity: 1, unitPrice: 1000 }
  ]);
  const [billBoughtBy, setBillBoughtBy] = useState<string>("");
  const [billPaidAmount, setBillPaidAmount] = useState<number>(0);
  const [billReference, setBillReference] = useState<string>("");
  const [billNotes, setBillNotes] = useState<string>("");

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRetailerForBill) return;

    const { retailer, day } = selectedRetailerForBill;
    const computedItems: BillItem[] = billItems.map((item, idx) => ({
      id: `bi-${Date.now()}-${idx}`,
      description: item.description || "General Item",
      quantity: Math.max(1, item.quantity),
      unitPrice: Math.max(0, item.unitPrice),
      total: Math.max(1, item.quantity) * Math.max(0, item.unitPrice)
    }));

    const totalAmount = computedItems.reduce((acc, curr) => acc + curr.total, 0);
    const balance = Math.max(0, totalAmount - billPaidAmount);

    let status: "paid" | "partial" | "credit" = "credit";
    if (balance === 0 && totalAmount > 0) status = "paid";
    else if (billPaidAmount > 0) status = "partial";

    const newBill: CreditDayBill = {
      id: "bill-" + Date.now(),
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: billType,
      date: new Date().toISOString().split("T")[0],
      dayNumber: day,
      retailerName: retailer.name,
      boughtBy: billBoughtBy || undefined,
      items: computedItems,
      amount: totalAmount,
      paidAmount: billPaidAmount,
      balanceDue: balance,
      status,
      reference: billReference || "Direct Entry",
      notes: billNotes || "Recorded via Credit Ledger Matrix"
    };

    const updated = retailers.map((r) => {
      if (r.id !== retailer.id) return r;
      const existingBillsForDay = r.dailyBills[day] || [];
      return {
        ...r,
        dailyBills: {
          ...r.dailyBills,
          [day]: [...existingBillsForDay, newBill]
        }
      };
    });

    saveRetailers(updated);
    setShowAddBillModal(false);
    setSelectedRetailerForBill(null);
    // Reset bill form
    setBillItems([{ description: "Primary Goods / Service Pack", quantity: 1, unitPrice: 1000 }]);
    setBillPaidAmount(0);
    setBillReference("");
    setBillNotes("");
  };

  // Helper stats for Cash Collectors
  const collectorStats = useMemo(() => {
    let totalPaidCount = 0;
    let totalMissedCount = 0;
    let totalPendingCount = 0;

    collectorPeople.forEach((p) => {
      Object.values(p.dailyStatus).forEach((st) => {
        if (st === "paid") totalPaidCount++;
        else if (st === "missed") totalMissedCount++;
        else if (st === "pending") totalPendingCount++;
      });
    });

    return {
      totalPersons: collectorPeople.length,
      totalPaidCount,
      totalMissedCount,
      totalPendingCount
    };
  }, [collectorPeople]);

  // Filtered Collectors
  const filteredCollectors = useMemo(() => {
    return collectorPeople.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.reference && p.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.phone && p.phone.includes(searchQuery));
      return matchSearch;
    });
  }, [collectorPeople, searchQuery]);

  // Helper stats for Retailers Credit Ledger
  const retailerStats = useMemo(() => {
    let grandTotalPending = 0;
    let grandTotalPaid = 0;
    let totalBillsCount = 0;

    retailers.forEach((r) => {
      Object.values(r.dailyBills).forEach((dayBillsList) => {
        dayBillsList.forEach((b) => {
          totalBillsCount++;
          if (b.type === "credit_sale") {
            grandTotalPending += b.balanceDue;
            grandTotalPaid += b.paidAmount;
          } else if (b.type === "cash_payment") {
            grandTotalPaid += b.paidAmount;
          }
        });
      });
    });

    return {
      totalRetailers: retailers.length,
      grandTotalPending,
      grandTotalPaid,
      totalBillsCount
    };
  }, [retailers]);

  // Filtered Retailers
  const filteredRetailers = useMemo(() => {
    return retailers.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.storeName && r.storeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.phone && r.phone.includes(searchQuery));
      return matchSearch;
    });
  }, [retailers, searchQuery]);

  // Days Array [1, 2, 3, ... 30]
  const daysArray = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalDays; i++) {
      arr.push(i);
    }
    return arr;
  }, [totalDays]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-700/50 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
                <Receipt className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Cash Collectors & Retailer Credit Ledger Matrix
                </h1>
                <p className="text-xs text-emerald-200/90 font-medium">
                  Field Cash Collection Matrix • Credit Sales & Purchase Ledger • Daily Detailed Bills
                </p>
              </div>
            </div>
          </div>

          {onBackToFinance && (
            <button
              type="button"
              onClick={onBackToFinance}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer border border-white/20 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Finance</span>
            </button>
          )}
        </div>

        {/* TOP TAB CONTROLS (Cash Collection vs Credit Sales) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-700/50">
          <div className="flex items-center gap-2 bg-emerald-950/70 p-1.5 rounded-2xl border border-emerald-600/40">
            <button
              type="button"
              onClick={() => setActiveTab("cash_collection")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "cash_collection"
                  ? "bg-[#2E7D32] text-white shadow-md border border-emerald-400/40"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-800/50"
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-300" />
              <span>1. Cash Collection Matrix</span>
              <span className="text-[10px] bg-emerald-900 text-emerald-200 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {collectorStats.totalPersons} Persons
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("credit_sales")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "credit_sales"
                  ? "bg-[#2E7D32] text-white shadow-md border border-emerald-400/40"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-800/50"
              }`}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>2. Credit Sales & Purchase Ledger</span>
              <span className="text-[10px] bg-amber-900/80 text-amber-200 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                {retailerStats.totalRetailers} Retailers
              </span>
            </button>
          </div>

          {/* Quick Action Add Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {activeTab === "cash_collection" ? (
              <button
                type="button"
                onClick={() => setShowAddPersonModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Collector Person</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddRetailerModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>+ Add Retailer / Customer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "cash_collection"
                ? "Search Person by name, phone, or location reference..."
                : "Search Retailer or Customer by store name, contact..."
            }
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 text-slate-800 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-xs font-bold text-slate-500">Month Days:</span>
          <select
            value={totalDays}
            onChange={(e) => setTotalDays(Number(e.target.value))}
            className="text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value={28}>28 Days (Feb)</option>
            <option value={30}>30 Days (Aug)</option>
            <option value={31}>31 Days (Full Month)</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CASH COLLECTION MATRIX */}
      {/* ========================================================================= */}
      {activeTab === "cash_collection" && (
        <div className="space-y-4">
          {/* Top Summary Banner & Handwritten Legend */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#2E7D32] text-white rounded-2xl font-black text-sm shrink-0 shadow-xs">
                {collectorStats.totalPersons}
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-950">
                  Total Persons Registered for Collection: {collectorStats.totalPersons}
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  Scroll days horizontally (Left/Right). Person name remains sticky on the left.
                </p>
              </div>
            </div>

            {/* Handwritten Color Key Indicators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-black bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-slate-600 font-bold mr-1">Legend:</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300">
                <span className="w-4 h-4 bg-emerald-600 text-white rounded-md flex items-center justify-center text-[10px] font-black">
                  ✓
                </span>
                <span>Paid (Green)</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg border border-rose-300">
                <span className="w-4 h-4 bg-rose-600 text-white rounded-md flex items-center justify-center text-[10px] font-black">
                  X
                </span>
                <span>Missed (Red)</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                <span className="w-4 h-4 bg-amber-500 text-white rounded-md flex items-center justify-center text-[10px] font-black">
                  ...
                </span>
                <span>Pending (Yellow)</span>
              </div>
            </div>
          </div>

          {/* CASH COLLECTION MATRIX TABLE WITH STICKY NAME & HORIZONTALLY SCROLLABLE DAYS */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
            <div className="overflow-x-auto relative max-w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white uppercase text-[10px] font-black tracking-wider">
                    {/* Sticky S/N & Name Column */}
                    <th className="p-3 sticky left-0 z-20 bg-slate-900 shadow-md min-w-[140px] border-r border-slate-700">
                      S/N & Name
                    </th>

                    {/* Scrollable Days Header (1 to 30) */}
                    {daysArray.map((day) => (
                      <th
                        key={day}
                        className="p-2 text-center min-w-[42px] max-w-[42px] border-r border-slate-700/80 bg-slate-800/90"
                      >
                        <div className="text-[9px] text-slate-400 font-medium">Day</div>
                        <div className="text-xs font-black text-emerald-400">{day}</div>
                      </th>
                    ))}

                    {/* Summary Columns */}
                    <th className="p-3 text-center bg-rose-950 text-rose-300 min-w-[65px] border-r border-slate-700">
                      Missed
                    </th>
                    <th className="p-3 text-center bg-emerald-950 text-emerald-300 min-w-[80px] border-r border-slate-700">
                      Paid / Total
                    </th>
                    <th className="p-3 text-center bg-amber-950 text-amber-300 min-w-[70px] border-r border-slate-700">
                      Pending
                    </th>
                    <th className="p-3 min-w-[160px] bg-slate-900 border-r border-slate-700">
                      Reference / Note
                    </th>
                    <th className="p-3 text-center bg-slate-900 min-w-[60px]">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {filteredCollectors.map((person, idx) => {
                    // Compute stats per person
                    let paidCount = 0;
                    let missedCount = 0;
                    let pendingCount = 0;

                    daysArray.forEach((d) => {
                      const st = person.dailyStatus[d];
                      if (st === "paid") paidCount++;
                      else if (st === "missed") missedCount++;
                      else if (st === "pending") pendingCount++;
                    });

                    return (
                      <tr key={person.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Sticky Name Column */}
                        <td className="p-3 sticky left-0 z-10 bg-white shadow-md border-r border-slate-200 min-w-[140px]">
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono">#{person.sn}</span>
                            <span className="truncate">{person.name}</span>
                          </div>
                          {person.phone && (
                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{person.phone}</span>
                            </div>
                          )}
                          <div className="text-[9px] font-extrabold text-[#2E7D32] mt-0.5">
                            Target: NPR {person.dailyTargetAmount}/day
                          </div>
                        </td>

                        {/* Days Grid Cells (1 to 30) */}
                        {daysArray.map((day) => {
                          const status = person.dailyStatus[day];

                          return (
                            <td
                              key={day}
                              onClick={() => handleToggleCellStatus(person.id, day)}
                              className="p-1 text-center border-r border-slate-100 cursor-pointer select-none hover:opacity-90 transition-all min-w-[42px] max-w-[42px] h-[48px]"
                              title={`Day ${day}: Click to toggle Paid [✓] -> Missed [X] -> Pending [...]`}
                            >
                              {status === "paid" && (
                                <div className="w-full h-full min-h-[36px] bg-emerald-500 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-xs border border-emerald-600">
                                  ✓
                                </div>
                              )}

                              {status === "missed" && (
                                <div className="w-full h-full min-h-[36px] bg-rose-500 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-xs border border-rose-600">
                                  X
                                </div>
                              )}

                              {status === "pending" && (
                                <div className="w-full h-full min-h-[36px] bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center font-black text-xs shadow-xs border border-amber-500">
                                  ...
                                </div>
                              )}

                              {!status && (
                                <div className="w-full h-full min-h-[36px] bg-slate-100 text-slate-400 hover:bg-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-200">
                                  -
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Summary Columns */}
                        <td className="p-3 text-center bg-rose-50/80 font-black text-rose-700 border-r border-slate-200 min-w-[65px]">
                          {missedCount}
                        </td>

                        <td className="p-3 text-center bg-emerald-50/80 font-black text-emerald-800 border-r border-slate-200 min-w-[80px]">
                          {paidCount} / {totalDays}
                        </td>

                        <td className="p-3 text-center bg-amber-50/80 font-black text-amber-800 border-r border-slate-200 min-w-[70px]">
                          {pendingCount}
                        </td>

                        <td className="p-3 text-slate-600 text-[11px] border-r border-slate-200 min-w-[160px]">
                          <span className="truncate block max-w-[150px]" title={person.reference || person.notes}>
                            {person.reference || person.notes || "-"}
                          </span>
                        </td>

                        <td className="p-3 text-center min-w-[60px]">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = collectorPeople.filter((p) => p.id !== person.id);
                              saveCollectors(updated);
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredCollectors.length === 0 && (
                    <tr>
                      <td colSpan={totalDays + 6} className="p-8 text-center text-slate-500">
                        No cash collection clients found. Click <strong>+ Add Collector Person</strong> to register clients.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CREDIT SALES & PURCHASE LEDGER MATRIX */}
      {/* ========================================================================= */}
      {activeTab === "credit_sales" && (
        <div className="space-y-4">
          {/* Top Summary Banner */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-600 text-white rounded-2xl font-black text-sm shrink-0 shadow-xs">
                रु {retailerStats.grandTotalPending.toLocaleString()}
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-950">
                  Total Pending Credit Outstanding Balance: NPR {retailerStats.grandTotalPending.toLocaleString()}
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  Click any day cell or <strong>(*) Bill Badge</strong> to pop up detailed itemized invoices and receipt logs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white p-2 rounded-xl border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Each day supports itemized bills, cash collections & credit receipts</span>
            </div>
          </div>

          {/* RETAILER CREDIT LEDGER MATRIX TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
            <div className="overflow-x-auto relative max-w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                    {/* Sticky Retailer Name Column */}
                    <th className="p-3 sticky left-0 z-20 bg-slate-950 shadow-md min-w-[160px] border-r border-slate-800">
                      S/N & Retailer Name
                    </th>

                    {/* Scrollable Days Header (1 to 30) */}
                    {daysArray.map((day) => (
                      <th
                        key={day}
                        className="p-2 text-center min-w-[70px] max-w-[70px] border-r border-slate-800 bg-slate-900/90"
                      >
                        <div className="text-[9px] text-slate-400 font-medium">Day</div>
                        <div className="text-xs font-black text-amber-400">{day}</div>
                      </th>
                    ))}

                    {/* Total Pending Balance Column */}
                    <th className="p-3 text-right bg-amber-950 text-amber-200 min-w-[140px] border-l border-slate-800">
                      Total Pending / Outstanding
                    </th>
                    <th className="p-3 text-center bg-slate-950 min-w-[70px]">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {filteredRetailers.map((retailer) => {
                    // Compute total pending balance for this retailer
                    let totalPendingForRetailer = 0;
                    let totalPaidForRetailer = 0;

                    Object.values(retailer.dailyBills).forEach((dayBills) => {
                      dayBills.forEach((b) => {
                        totalPendingForRetailer += b.balanceDue;
                        totalPaidForRetailer += b.paidAmount;
                      });
                    });

                    return (
                      <tr key={retailer.id} className="hover:bg-amber-50/30 transition-colors">
                        {/* Sticky Name Column */}
                        <td className="p-3 sticky left-0 z-10 bg-white shadow-md border-r border-slate-200 min-w-[160px]">
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono">#{retailer.sn}</span>
                            <span className="truncate">{retailer.name}</span>
                          </div>
                          {retailer.storeName && (
                            <div className="text-[10px] font-bold text-amber-800 truncate mt-0.5">
                              🏪 {retailer.storeName}
                            </div>
                          )}
                          {retailer.phone && (
                            <div className="text-[9px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{retailer.phone}</span>
                            </div>
                          )}
                        </td>

                        {/* Days Grid Cells (1 to 30) */}
                        {daysArray.map((day) => {
                          const dayBills = retailer.dailyBills[day] || [];
                          const totalBillAmount = dayBills.reduce((acc, b) => acc + b.amount, 0);
                          const totalDue = dayBills.reduce((acc, b) => acc + b.balanceDue, 0);
                          const hasBills = dayBills.length > 0;

                          return (
                            <td
                              key={day}
                              className="p-1 text-center border-r border-slate-100 min-w-[70px] max-w-[70px] h-[52px]"
                            >
                              {hasBills ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setInspectBillModal({
                                      retailer,
                                      dayNumber: day,
                                      bills: dayBills
                                    })
                                  }
                                  className={`w-full h-full p-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                                    totalDue > 0
                                      ? "bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-900"
                                      : "bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900"
                                  }`}
                                  title={`Day ${day}: ${dayBills.length} Bill(s). Click to pop up detailed bill!`}
                                >
                                  <div className="text-[9px] font-black uppercase tracking-tight flex items-center gap-0.5">
                                    <span>{totalDue > 0 ? "Credit" : "Paid"}</span>
                                    <span className="text-[10px] text-amber-600 font-extrabold">(*)</span>
                                  </div>
                                  <div className="text-[10px] font-black">
                                    रु {totalDue > 0 ? totalDue.toLocaleString() : totalBillAmount.toLocaleString()}
                                  </div>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRetailerForBill({ retailer, day });
                                    setShowAddBillModal(true);
                                  }}
                                  className="w-full h-full border border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl text-[10px] text-slate-400 hover:text-amber-800 font-bold transition-all flex items-center justify-center gap-0.5"
                                  title={`Add credit sale/purchase bill for Day ${day}`}
                                >
                                  <span>+ Bill</span>
                                </button>
                              )}
                            </td>
                          );
                        })}

                        {/* Total Pending Balance Column */}
                        <td className="p-3 text-right bg-amber-50/90 border-l border-slate-200 min-w-[140px]">
                          <div className="font-black text-rose-700 text-sm">
                            रु {totalPendingForRetailer.toLocaleString()} /-
                          </div>
                          <div className="text-[9px] font-bold text-slate-500">
                            Paid: रु {totalPaidForRetailer.toLocaleString()}
                          </div>
                        </td>

                        <td className="p-3 text-center min-w-[70px]">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRetailerForBill({ retailer, day: 1 });
                                setShowAddBillModal(true);
                              }}
                              className="p-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg text-[10px] font-extrabold transition-all"
                              title="Add Bill"
                            >
                              + Bill
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRetailers.length === 0 && (
                    <tr>
                      <td colSpan={totalDays + 3} className="p-8 text-center text-slate-500">
                        No credit retailers found. Click <strong>+ Add Retailer / Customer</strong> to record retailer accounts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CASH COLLECTOR CLIENT */}
      {/* ========================================================================= */}
      {showAddPersonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#2E7D32]" />
                Add Cash Collection Client
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPersonModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePerson} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name / Initials *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. RK (Rajesh Kumar)"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. +977 9841234567"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Store Reference</label>
                <input
                  type="text"
                  name="reference"
                  placeholder="e.g. Shop #12 - New Road, Kathmandu"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Daily Target Collection (NPR)</label>
                <input
                  type="number"
                  name="target"
                  defaultValue={500}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPersonModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md"
                >
                  Save Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD RETAILER ACCOUNT */}
      {/* ========================================================================= */}
      {showAddRetailerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                Add Retailer / Credit Customer
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRetailerModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRetailer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Retailer / Person Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. MK (Manoj Karki)"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store / Business Name</label>
                <input
                  type="text"
                  name="storeName"
                  placeholder="e.g. MK Superstore"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. +977 9851099887"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City / Address</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Kathmandu, Patan"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRetailerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md"
                >
                  Save Retailer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD ITEMIZED CREDIT BILL FOR SPECIFIC DAY */}
      {/* ========================================================================= */}
      {showAddBillModal && selectedRetailerForBill && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  Create Credit / Sales Bill - Day {selectedRetailerForBill.day}
                </h3>
                <p className="text-xs text-slate-500">
                  Retailer: <strong>{selectedRetailerForBill.retailer.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddBillModal(false);
                  setSelectedRetailerForBill(null);
                }}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="space-y-4">
              {/* Bill Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillType("credit_sale")}
                    className={`p-2.5 rounded-xl text-xs font-black border text-center cursor-pointer ${
                      billType === "credit_sale"
                        ? "bg-amber-100 border-amber-500 text-amber-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Credit Sale (Out)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillType("credit_purchase")}
                    className={`p-2.5 rounded-xl text-xs font-black border text-center cursor-pointer ${
                      billType === "credit_purchase"
                        ? "bg-purple-100 border-purple-500 text-purple-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Credit Purchase (In)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillType("cash_payment")}
                    className={`p-2.5 rounded-xl text-xs font-black border text-center cursor-pointer ${
                      billType === "cash_payment"
                        ? "bg-emerald-100 border-emerald-500 text-emerald-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Cash Collected
                  </button>
                </div>
              </div>

              {/* Itemized Goods List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Itemized Bill Items</label>
                  <button
                    type="button"
                    onClick={() =>
                      setBillItems([...billItems, { description: "New Item", quantity: 1, unitPrice: 500 }])
                    }
                    className="text-[10px] font-black text-amber-700 hover:text-amber-800"
                  >
                    + Add Item Row
                  </button>
                </div>

                <div className="space-y-2 max-h-[180px] overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50">
                  {billItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...billItems];
                          updated[idx].description = e.target.value;
                          setBillItems(updated);
                        }}
                        placeholder="Item name"
                        className="flex-1 text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...billItems];
                          updated[idx].quantity = Number(e.target.value);
                          setBillItems(updated);
                        }}
                        placeholder="Qty"
                        className="w-14 text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center"
                      />
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...billItems];
                          updated[idx].unitPrice = Number(e.target.value);
                          setBillItems(updated);
                        }}
                        placeholder="Rate"
                        className="w-20 text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right"
                      />
                      <span className="text-xs font-black text-slate-800 min-w-[50px] text-right">
                        {(item.quantity * item.unitPrice).toLocaleString()}
                      </span>
                      {billItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBillItems(billItems.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:bg-rose-50 p-1 rounded-md"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Math & Payments */}
              <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Grand Total Bill Amount:</span>
                  <span className="font-black text-slate-900">
                    NPR {billItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="text-slate-700">Instant Cash Paid / Received:</label>
                  <input
                    type="number"
                    value={billPaidAmount}
                    onChange={(e) => setBillPaidAmount(Number(e.target.value))}
                    className="w-28 text-xs p-1.5 bg-white border border-amber-300 rounded-xl text-right font-black"
                  />
                </div>

                <div className="flex justify-between text-xs font-black border-t border-amber-200/80 pt-2 text-rose-700">
                  <span>Remaining Credit Balance Due:</span>
                  <span>
                    NPR{" "}
                    {Math.max(
                      0,
                      billItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0) - billPaidAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bought By (In case someone else buys on behalf of Account Holder)
                </label>
                <input
                  type="text"
                  value={billBoughtBy}
                  onChange={(e) => setBillBoughtBy(e.target.value)}
                  placeholder="e.g. Caregiver Brother / Agent Rajesh / Representative"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bill Reference / Invoice #</label>
                <input
                  type="text"
                  value={billReference}
                  onChange={(e) => setBillReference(e.target.value)}
                  placeholder="e.g. PO #9021 / Bill #104"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Terms</label>
                <input
                  type="text"
                  value={billNotes}
                  onChange={(e) => setBillNotes(e.target.value)}
                  placeholder="e.g. Credit allowed till month end."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBillModal(false);
                    setSelectedRetailerForBill(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md"
                >
                  Save Bill Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: POP-UP DETAILED BILL INSPECTION (* AS HANDWRITTEN IN SKETCH) */}
      {/* ========================================================================= */}
      {inspectBillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  Detailed Bill Record (*) - Day {inspectBillModal.dayNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Retailer: <strong>{inspectBillModal.retailer.name}</strong> ({inspectBillModal.retailer.storeName || "Store"})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectBillModal(null)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {inspectBillModal.bills.map((bill, index) => (
                <div
                  key={bill.id || index}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{bill.invoiceNo}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          bill.type === "credit_sale"
                            ? "bg-amber-100 text-amber-900"
                            : bill.type === "credit_purchase"
                            ? "bg-purple-100 text-purple-900"
                            : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        {bill.type.replace("_", " ")}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-500">{bill.date}</span>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Itemized Particulars</div>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {bill.items.map((item) => (
                        <div key={item.id} className="p-2 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{item.description}</span>
                            <span className="text-[10px] text-slate-400 block">
                              Qty: {item.quantity} x NPR {item.unitPrice.toLocaleString()}
                            </span>
                          </div>
                          <span className="font-black text-slate-900">
                            रु {item.total.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Total Amount:</span>
                      <span>रु {bill.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700">
                      <span>Amount Paid:</span>
                      <span>रु {bill.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-rose-700 border-t border-slate-100 pt-1 text-sm">
                      <span>Pending Balance Due:</span>
                      <span>रु {bill.balanceDue.toLocaleString()}</span>
                    </div>
                  </div>

                  {bill.reference && (
                    <div className="text-[10px] text-slate-500 font-medium">
                      Reference: <span className="font-bold text-slate-700">{bill.reference}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedRetailerForBill({
                    retailer: inspectBillModal.retailer,
                    day: inspectBillModal.dayNumber
                  });
                  setInspectBillModal(null);
                  setShowAddBillModal(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-xs"
              >
                + Add Another Bill for Day {inspectBillModal.dayNumber}
              </button>

              <button
                type="button"
                onClick={() => setInspectBillModal(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
