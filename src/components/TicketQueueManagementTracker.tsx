import React, { useState, useMemo, useEffect } from "react";
import {
  Ticket,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Share2,
  Building2,
  Stethoscope,
  Landmark,
  GraduationCap,
  Briefcase,
  Smartphone,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Star
} from "lucide-react";

// Safe access helpers
const safeStr = (val: any, fallback = ""): string =>
  val && typeof val === "string" ? val : fallback;
const safeNum = (val: any, fallback = 0): number =>
  val !== null && val !== undefined && !isNaN(Number(val)) ? Number(val) : fallback;

export interface QueueServiceProvider {
  id: string;
  name: string;
  category: "hospital" | "government" | "embassy" | "education" | "corporate" | "bank" | "utility";
  department: string;
  counterNumber: string;
  prefix: string;
  currentServingNumber: number;
  lastIssuedNumber: number;
  avgWaitTimeMinutes: number;
  isPaused: boolean;
  address: string;
  phone: string;
}

export interface QueueTicket {
  id: string;
  ticketNumber: string; // e.g. "A-048"
  numericSeq: number;
  providerId: string;
  providerName: string;
  department: string;
  counterNumber: string;
  priorityType: "regular" | "senior" | "emergency" | "disabled";
  customerName: string;
  phone: string;
  status: "waiting" | "almost_there" | "serving" | "completed" | "missed" | "rescheduled" | "cancelled";
  issuedAt: string;
  servingAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  notes?: string;
}

const DEFAULT_PROVIDERS: QueueServiceProvider[] = [
  {
    id: "prov-01",
    name: "Bir Hospital Central OPD",
    category: "hospital",
    department: "General Medicine & Cardiology",
    counterNumber: "Counter 04",
    prefix: "H",
    currentServingNumber: 42,
    lastIssuedNumber: 48,
    avgWaitTimeMinutes: 5,
    isPaused: false,
    address: "Kanti Path, Kathmandu",
    phone: "+977 1 4221119"
  },
  {
    id: "prov-02",
    name: "Department of Passports",
    category: "government",
    department: "e-Passport Biometric Verification",
    counterNumber: "Counter 12",
    prefix: "P",
    currentServingNumber: 115,
    lastIssuedNumber: 122,
    avgWaitTimeMinutes: 4,
    isPaused: false,
    address: "Tripureshwor, Kathmandu",
    phone: "+977 1 4261707"
  },
  {
    id: "prov-03",
    name: "Consular Services Embassy Center",
    category: "embassy",
    department: "Visa Application & Document Attestation",
    counterNumber: "Counter 02",
    prefix: "V",
    currentServingNumber: 28,
    lastIssuedNumber: 31,
    avgWaitTimeMinutes: 8,
    isPaused: false,
    address: "Baluwatar, Kathmandu",
    phone: "+977 1 4410000"
  },
  {
    id: "prov-04",
    name: "Tribhuvan University Exam Controller",
    category: "education",
    department: "Transcript & Migration Clearance",
    counterNumber: "Counter 07",
    prefix: "E",
    currentServingNumber: 65,
    lastIssuedNumber: 70,
    avgWaitTimeMinutes: 6,
    isPaused: false,
    address: "Balkhu, Kathmandu",
    phone: "+977 1 4330844"
  },
  {
    id: "prov-05",
    name: "Nabil Bank Main Branch",
    category: "bank",
    department: "Cash Deposit & Forex Exchange",
    counterNumber: "Counter 03",
    prefix: "B",
    currentServingNumber: 88,
    lastIssuedNumber: 90,
    avgWaitTimeMinutes: 3,
    isPaused: false,
    address: "Durbar Marg, Kathmandu",
    phone: "+977 1 4227181"
  }
];

const DEFAULT_TICKETS: QueueTicket[] = [
  {
    id: "tkt-101",
    ticketNumber: "H-048",
    numericSeq: 48,
    providerId: "prov-01",
    providerName: "Bir Hospital Central OPD",
    department: "General Medicine & Cardiology",
    counterNumber: "Counter 04",
    priorityType: "regular",
    customerName: "Aarav Sharma",
    phone: "+977 9841234567",
    status: "almost_there",
    issuedAt: "10:15 AM",
    estimatedWaitMinutes: 12,
    notes: "Routine health checkup token"
  },
  {
    id: "tkt-102",
    ticketNumber: "P-122",
    numericSeq: 122,
    providerId: "prov-02",
    providerName: "Department of Passports",
    department: "e-Passport Biometric Verification",
    counterNumber: "Counter 12",
    priorityType: "regular",
    customerName: "Sujata Adhikari",
    phone: "+977 9851098765",
    status: "waiting",
    issuedAt: "10:30 AM",
    estimatedWaitMinutes: 28,
    notes: "Urgent renewal token"
  }
];

export const TicketQueueManagementTracker: React.FC = () => {
  const [providers, setProviders] = useState<QueueServiceProvider[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_queue_providers");
      return saved ? JSON.parse(saved) : DEFAULT_PROVIDERS;
    } catch {
      return DEFAULT_PROVIDERS;
    }
  });

  const [tickets, setTickets] = useState<QueueTicket[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_queue_tickets");
      return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
    } catch {
      return DEFAULT_TICKETS;
    }
  });

  const [viewMode, setViewMode] = useState<"user" | "admin">("user");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(true);

  // New Ticket Modal State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(DEFAULT_PROVIDERS[0].id);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [priorityType, setPriorityType] = useState<"regular" | "senior" | "emergency" | "disabled">("regular");
  const [notes, setNotes] = useState("");

  // Persistence helpers
  const saveProviders = (data: QueueServiceProvider[]) => {
    setProviders(data);
    localStorage.setItem("care2care_queue_providers", JSON.stringify(data));
  };

  const saveTickets = (data: QueueTicket[]) => {
    setTickets(data);
    localStorage.setItem("care2care_queue_tickets", JSON.stringify(data));
  };

  // Sound announcement simulation
  const speakToken = (text: string) => {
    if (!soundAlertEnabled) return;
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log("Speech synthesis error", e);
    }
  };

  // Provider Call Next Handler
  const handleCallNextToken = (providerId: string) => {
    const provIndex = providers.findIndex((p) => p.id === providerId);
    if (provIndex === -1) return;

    const prov = providers[provIndex];
    if (prov.isPaused) {
      alert("⚠️ Queue is currently paused for this counter!");
      return;
    }

    const nextServing = prov.currentServingNumber + 1;
    const updatedProv = { ...prov, currentServingNumber: nextServing };
    const newProviders = [...providers];
    newProviders[provIndex] = updatedProv;
    saveProviders(newProviders);

    const targetTokenNum = `${prov.prefix}-${String(nextServing).padStart(3, "0")}`;

    // Update tickets status
    const updatedTickets = tickets.map((t) => {
      if (t.providerId === providerId) {
        if (t.ticketNumber === targetTokenNum) {
          return {
            ...t,
            status: "serving" as const,
            servingAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
        }
        if (t.numericSeq < nextServing && t.status === "serving") {
          return {
            ...t,
            status: "completed" as const,
            completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
        }
        if (t.numericSeq > nextServing) {
          const diff = t.numericSeq - nextServing;
          return {
            ...t,
            status: diff <= 3 ? ("almost_there" as const) : ("waiting" as const),
            estimatedWaitMinutes: diff * prov.avgWaitTimeMinutes
          };
        }
      }
      return t;
    });

    saveTickets(updatedTickets);
    speakToken(`Attention please. Token number ${targetTokenNum}, please proceed to ${prov.counterNumber}`);
  };

  // Issue New Ticket
  const handleIssueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const provIndex = providers.findIndex((p) => p.id === selectedProviderId);
    if (provIndex === -1) return;

    const prov = providers[provIndex];
    const newSeq = prov.lastIssuedNumber + 1;
    const ticketNumStr = `${prov.prefix}-${String(newSeq).padStart(3, "0")}`;

    // Update provider's last issued number
    const updatedProv = { ...prov, lastIssuedNumber: newSeq };
    const newProviders = [...providers];
    newProviders[provIndex] = updatedProv;
    saveProviders(newProviders);

    const aheadCount = Math.max(0, newSeq - prov.currentServingNumber - 1);
    const estMinutes = (aheadCount + 1) * prov.avgWaitTimeMinutes;

    const newTicket: QueueTicket = {
      id: "tkt-" + Date.now(),
      ticketNumber: ticketNumStr,
      numericSeq: newSeq,
      providerId: prov.id,
      providerName: prov.name,
      department: prov.department,
      counterNumber: prov.counterNumber,
      priorityType,
      customerName: customerName || "Valued Visitor",
      phone: customerPhone || "+977 9800000000",
      status: aheadCount <= 3 ? "almost_there" : "waiting",
      issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      estimatedWaitMinutes: estMinutes,
      notes
    };

    saveTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");

    alert(`🎟️ Token Issued: ${newTicket.ticketNumber}\n${aheadCount} people ahead of you. Estimated wait: ${estMinutes} mins.`);
  };

  // Cancel or Reschedule Ticket
  const handleUpdateTicketStatus = (ticketId: string, newStatus: QueueTicket["status"]) => {
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t));
    saveTickets(updated);
  };

  // Toggle Provider Pause
  const handleTogglePause = (providerId: string) => {
    const updated = providers.map((p) => (p.id === providerId ? { ...p, isPaused: !p.isPaused } : p));
    saveProviders(updated);
  };

  // Filtered Providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [providers, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-700/50 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-white/10 backdrop-blur-md text-amber-300 rounded-2xl border border-white/20 shadow-inner">
              <Ticket className="w-8 h-8" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ticket & Queue Management System
                </h1>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  LIVE REAL-TIME
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium mt-0.5">
                Hospital OPD, Passport, Consular, University & Bank Token Dispatch with Vocal Audio Announcements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSoundAlertEnabled(!soundAlertEnabled)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                soundAlertEnabled
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md"
                  : "bg-white/10 text-slate-300 border-white/20"
              }`}
            >
              {soundAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundAlertEnabled ? "Audio On" : "Audio Off"}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode(viewMode === "user" ? "admin" : "user")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "admin"
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20 border-white/20"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{viewMode === "admin" ? "Switch to Visitor View" : "Counter Admin View"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowNewTicketModal(true)}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-300"
            >
              <Plus className="w-4 h-4" />
              <span>Get New Token</span>
            </button>
          </div>
        </div>

        {/* ACTIVE TICKET LIVE STATUS STRIP */}
        {tickets.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs overflow-x-auto gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-extrabold text-amber-300">Your Active Tokens:</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {tickets.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-indigo-500/40 flex items-center gap-2"
                >
                  <span className="font-black text-emerald-300 font-mono text-sm">{t.ticketNumber}</span>
                  <span className="text-[10px] text-slate-300 font-bold max-w-[120px] truncate">{t.providerName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      t.status === "serving"
                        ? "bg-emerald-400 text-slate-950"
                        : t.status === "almost_there"
                        ? "bg-amber-400 text-slate-950"
                        : "bg-indigo-800 text-indigo-200"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CATEGORY & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs font-bold">
          {[
            { id: "all", label: "All Hubs 🏛️" },
            { id: "hospital", label: "Hospitals & OPD 🏥" },
            { id: "government", label: "Govt & Passport 🇳🇵" },
            { id: "embassy", label: "Embassy & Visa ✈️" },
            { id: "education", label: "Education & TU 🎓" },
            { id: "bank", label: "Banks & Forex 🏦" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-900 text-white font-black shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider or office..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* VIEW MODE 1: VISITOR / CUSTOMER DASHBOARD */}
      {viewMode === "user" && (
        <div className="space-y-6">
          {/* USER MY TICKETS BOARD */}
          {tickets.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                My Issued Tokens & Live Position
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickets.map((t) => {
                  const prov = providers.find((p) => p.id === t.providerId);
                  const servingNum = prov ? prov.currentServingNumber : 0;
                  const aheadCount = Math.max(0, t.numericSeq - servingNum);

                  return (
                    <div
                      key={t.id}
                      className={`rounded-3xl p-5 border shadow-md space-y-4 transition-all relative overflow-hidden ${
                        t.status === "serving"
                          ? "bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-emerald-500 ring-2 ring-emerald-400"
                          : t.status === "almost_there"
                          ? "bg-gradient-to-br from-amber-900 via-slate-900 to-slate-950 text-white border-amber-400"
                          : "bg-white text-slate-900 border-slate-200/90"
                      }`}
                    >
                      {/* Status Tag */}
                      <div className="flex items-center justify-between border-b pb-3 border-slate-200/20">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider opacity-80">
                            {t.providerName}
                          </div>
                          <div className="text-xs font-extrabold">{t.department}</div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            t.status === "serving"
                              ? "bg-emerald-400 text-slate-950 shadow-md"
                              : t.status === "almost_there"
                              ? "bg-amber-400 text-slate-950 shadow-md animate-pulse"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Main Ticket Display */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Your Token Number</div>
                          <div
                            className={`text-3xl font-black font-mono tracking-tight ${
                              t.status === "serving" ? "text-emerald-300" : "text-indigo-600"
                            }`}
                          >
                            {t.ticketNumber}
                          </div>
                          <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                            Counter: <span className="text-slate-900 font-extrabold">{t.counterNumber}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Now Serving</div>
                          <div className="text-2xl font-black font-mono text-amber-500">
                            {prov ? `${prov.prefix}-${String(prov.currentServingNumber).padStart(3, "0")}` : "---"}
                          </div>
                          <div className="text-[10px] font-extrabold text-emerald-600">
                            {aheadCount === 0
                              ? "🎉 YOUR TURN!"
                              : aheadCount <= 3
                              ? `⚠️ ALMOST THERE (${aheadCount} ahead)`
                              : `${aheadCount} People Ahead`}
                          </div>
                        </div>
                      </div>

                      {/* Progress & Time */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/20 text-xs">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Est. Wait Time: ~{t.estimatedWaitMinutes} mins</span>
                          <span>Issued at: {t.issuedAt}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              t.status === "serving" ? "bg-emerald-400 w-full" : "bg-indigo-600 w-1/2"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Ticket Action Controls */}
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Token: ${t.ticketNumber} for ${t.providerName} (${t.counterNumber})`
                            );
                            alert("📋 Token details copied to clipboard!");
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateTicketStatus(t.id, "cancelled")}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALL PROVIDERS QUEUE HUB LIST */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Available Queue Counters & Live Display Boards ({filteredProviders.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((prov) => {
                const waitingCount = Math.max(0, prov.lastIssuedNumber - prov.currentServingNumber);

                return (
                  <div
                    key={prov.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full border border-indigo-200">
                            {prov.category}
                          </span>
                          <h3 className="font-black text-slate-900 text-base mt-1">{prov.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">{prov.department}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-black bg-slate-900 text-white px-2.5 py-1 rounded-xl">
                            {prov.counterNumber}
                          </span>
                        </div>
                      </div>

                      {/* Live Token Status Box */}
                      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 border border-slate-800">
                        <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold border-b border-slate-800 pb-2">
                          <span>NOW SERVING</span>
                          <span>LAST ISSUED</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-2xl font-black font-mono text-emerald-400">
                            {prov.prefix}-{String(prov.currentServingNumber).padStart(3, "0")}
                          </div>
                          <div className="text-xl font-black font-mono text-amber-400">
                            {prov.prefix}-{String(prov.lastIssuedNumber).padStart(3, "0")}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 pt-1">
                          <span>{waitingCount} People Waiting</span>
                          <span>Est. ~{prov.avgWaitTimeMinutes}m / person</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prov.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProviderId(prov.id);
                          setShowNewTicketModal(true);
                        }}
                        className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Get Token Now</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ADMIN COUNTER CONTROL VIEW */}
      {viewMode === "admin" && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 text-amber-900 text-xs font-bold flex items-center justify-between">
            <span>
              🛠️ Counter Administrator View: Call next token, pause queues, and view counter efficiency.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((prov) => {
              const waitingCount = Math.max(0, prov.lastIssuedNumber - prov.currentServingNumber);

              return (
                <div
                  key={prov.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{prov.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {prov.department} • <span className="font-bold text-indigo-600">{prov.counterNumber}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePause(prov.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1 ${
                        prov.isPaused ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {prov.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{prov.isPaused ? "Queue Paused" : "Queue Active"}</span>
                    </button>
                  </div>

                  {/* Counter Screen */}
                  <div className="bg-slate-950 text-white rounded-2xl p-6 text-center space-y-2 border border-slate-800">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      CURRENTLY SERVING AT COUNTER
                    </div>
                    <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                      {prov.prefix}-{String(prov.currentServingNumber).padStart(3, "0")}
                    </div>
                    <div className="text-xs font-bold text-slate-300">
                      Total Waiting in Queue: <span className="text-amber-400 font-black">{waitingCount}</span>
                    </div>
                  </div>

                  {/* Call Next Button */}
                  <button
                    type="button"
                    onClick={() => handleCallNextToken(prov.id)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Bell className="w-5 h-5 fill-slate-950" />
                    <span>CALL NEXT TOKEN ({prov.prefix}-{String(prov.currentServingNumber + 1).padStart(3, "0")})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                Dispatch New Ticket Token
              </h3>
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Service Counter *</label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.department} ({p.counterNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "regular", label: "Regular Visitor" },
                    { id: "senior", label: "Senior Citizen (60+)" },
                    { id: "emergency", label: "Emergency / Urgent" },
                    { id: "disabled", label: "Differently Abled" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriorityType(p.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        priorityType === p.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Visitor Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Thapa"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Phone (for SMS / Alerts)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+977 9841000000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-black rounded-xl shadow-md"
                >
                  Confirm & Print Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
