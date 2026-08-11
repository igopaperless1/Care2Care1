import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAccountDashboard } from "../hooks/useAccountDashboard";
import { GreetingHeader } from "./GreetingHeader";
import { CreateSubAccountModal, SubAccountData } from "./CreateSubAccountModal";
import { SubAccountManagerModal } from "./SubAccountManagerModal";
import { ProfessionalQrRenderer } from "./ProfessionalQrRenderer";
import { Patient, AccountType } from "../types";
import {
  User,
  Briefcase,
  Check,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Droplets,
  HeartPulse,
  Pill,
  Star,
  ShieldAlert,
  Bot,
  Plus,
  X,
  SlidersHorizontal,
  LayoutGrid,
  Search,
  UserPlus,
  Users,
  Clock,
  Filter,
  CheckCircle2,
  FileText,
  Package,
  Calendar,
  Building,
  QrCode,
  Share2,
  Copy,
  Wallet,
  CreditCard,
  Car,
  Leaf,
  Bell,
  Settings,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Eye,
  Trash2,
  Edit3,
  Smartphone,
  Activity,
  Zap,
  Mic,
  Dumbbell,
  CheckSquare,
  Flame,
  PieChart,
  Grid
} from "lucide-react";

// Safe string & numeric helpers
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);

export interface RoutineItem {
  id: string;
  title: string;
  time: string;
  category: "medicine" | "water" | "workout" | "therapy" | "diet";
  isCompleted: boolean;
  assignedToProfileId?: string;
}

export interface DashboardBentoConfig {
  id: string;
  title: string;
  category: "operations" | "wellness" | "living" | "assets";
  iconName: string;
  width: "full" | "half" | "third";
  enabled: boolean;
  description: string;
}

const DEFAULT_BENTO_CONFIGS: DashboardBentoConfig[] = [
  {
    id: "routine_wellness",
    title: "Routine & Wellness Ledger",
    category: "wellness",
    iconName: "CheckSquare",
    width: "full",
    enabled: true,
    description: "Daily task checklist, medication timers & hydration logs"
  },
  {
    id: "digital_vault_qr",
    title: "Digital Vault & Visiting QR",
    category: "operations",
    iconName: "QrCode",
    width: "half",
    enabled: true,
    description: "Virtual visiting card, emergency QR & biometrics"
  },
  {
    id: "system_finances",
    title: "System Finances & Cash Flow",
    category: "operations",
    iconName: "Wallet",
    width: "half",
    enabled: true,
    description: "Personal wallet balance, corporate ledger & daily expense stats"
  },
  {
    id: "fleet_assets",
    title: "Fleet & Asset Maintenance",
    category: "assets",
    iconName: "Car",
    width: "half",
    enabled: true,
    description: "Vehicle mileage, fuel logs & service due countdowns"
  },
  {
    id: "property_farm",
    title: "Property, Land & Farm Upkeep",
    category: "assets",
    iconName: "Leaf",
    width: "half",
    enabled: true,
    description: "Crop sectors, irrigation timers & property notices"
  },
  {
    id: "vitals_tracker",
    title: "Health Vitals & Heart Rate",
    category: "wellness",
    iconName: "HeartPulse",
    width: "half",
    enabled: true,
    description: "Real-time SpO2, blood pressure, glucose & pulse rate"
  },
  {
    id: "caregiver_sos",
    title: "Caregiver & SOS Emergency",
    category: "living",
    iconName: "ShieldAlert",
    width: "half",
    enabled: true,
    description: "Urgent instructions, 1-tap emergency trigger & contacts"
  }
];

const INITIAL_ROUTINE_ITEMS: RoutineItem[] = [
  { id: "rt-1", title: "Blood Pressure & Heart Meds (Amlodipine 5mg)", time: "08:00 AM", category: "medicine", isCompleted: true },
  { id: "rt-2", title: "Morning Hydration Goal (500 ml)", time: "09:30 AM", category: "water", isCompleted: true },
  { id: "rt-3", title: "Mid-day Hydration Goal (500 ml)", time: "12:30 PM", category: "water", isCompleted: false },
  { id: "rt-4", title: "Light Physical Therapy & Stretching (15 min)", time: "04:00 PM", category: "workout", isCompleted: false },
  { id: "rt-5", title: "Evening Diabetes Check & Multivitamin", time: "07:30 PM", category: "medicine", isCompleted: false }
];

interface HomeViewProps {
  accountType?: AccountType;
  setAccountType?: (type: AccountType) => void;
  patient: Patient;
  patients: Patient[];
  onSelectPatient: (id: string) => void;
  onAddPatient?: (newPatient: Patient) => void;
  onNavigateToTab: (tab: "home" | "track" | "plan" | "care" | "more") => void;
  onNavigateToCareSubTab?: (subTab: string) => void;
  onAddWater: (patientId: string, amountMl: number) => void;
  onOpenSosModal: () => void;
  onOpenQuickMenu?: () => void;
  onOpenAiAssistantModal?: () => void;
  onOpenVoiceAssistantModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  accountType = "family",
  setAccountType,
  patient,
  patients = [],
  onSelectPatient,
  onAddPatient,
  onNavigateToTab,
  onNavigateToCareSubTab,
  onAddWater,
  onOpenSosModal,
  onOpenQuickMenu,
  onOpenAiAssistantModal,
  onOpenVoiceAssistantModal,
  onOpenAuthModal
}) => {
  // Toast notifications state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Multi-Persona Context Engine state
  const [activePersona, setActivePersona] = useState<"personal" | "professional" | "sub_account">(() => {
    try {
      if (accountType === "professional") return "professional";
      if ((accountType as string) === "staff" || (accountType as string) === "caregiver") return "sub_account";
      return "personal";
    } catch {
      return "personal";
    }
  });

  const [showProfileSwitcherDropdown, setShowProfileSwitcherDropdown] = useState(false);

  // Custom Account Dashboard Hook
  const {
    isPersonalMode,
    switchProfileChoice,
    activeSubTab,
    setActiveSubTab
  } = useAccountDashboard(accountType, setAccountType);

  // Bento Modules Configuration State
  const [bentoConfigs, setBentoConfigs] = useState<DashboardBentoConfig[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_bento_dashboard_configs");
      return saved ? JSON.parse(saved) : DEFAULT_BENTO_CONFIGS;
    } catch {
      return DEFAULT_BENTO_CONFIGS;
    }
  });

  // Modal States
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showQuickActionSheet, setShowQuickActionSheet] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showQrCardModal, setShowQrCardModal] = useState(false);
  const [showSubAccountManagerModal, setShowSubAccountManagerModal] = useState(false);
  const [showCreateSubAccountModal, setShowCreateSubAccountModal] = useState(false);
  const [showTaskDelegationModal, setShowTaskDelegationModal] = useState(false);
  const [selectedSubAccountForTask, setSelectedSubAccountForTask] = useState<Patient | null>(null);

  // Routine Checklist State
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_routine_items");
      return saved ? JSON.parse(saved) : INITIAL_ROUTINE_ITEMS;
    } catch {
      return INITIAL_ROUTINE_ITEMS;
    }
  });

  // Save Bento Configs
  const saveBentoConfigs = (newConfigs: DashboardBentoConfig[]) => {
    setBentoConfigs(newConfigs);
    try {
      localStorage.setItem("care2care_bento_dashboard_configs", JSON.stringify(newConfigs));
    } catch (e) {
      console.error("Failed to save bento configs", e);
    }
  };

  // Save Routines
  const saveRoutines = (newItems: RoutineItem[]) => {
    setRoutineItems(newItems);
    try {
      localStorage.setItem("care2care_routine_items", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save routine items", e);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Routine Toggle
  const handleToggleRoutine = (id: string) => {
    const updated = routineItems.map((item) => {
      if (item.id === id) {
        const nextState = !item.isCompleted;
        if (nextState) triggerToast(`✅ "${item.title}" marked as completed!`);
        return { ...item, isCompleted: nextState };
      }
      return item;
    });
    saveRoutines(updated);
  };

  // Navigation Helper
  const handleNavigateSubTab = (subTabName: string) => {
    if (onNavigateToCareSubTab) {
      onNavigateToCareSubTab(subTabName);
    } else {
      onNavigateToTab("care");
    }
  };

  // Sync persona change with dashboard accountType
  const handleSwitchPersona = (persona: "personal" | "professional" | "sub_account") => {
    setActivePersona(persona);
    setShowProfileSwitcherDropdown(false);

    if (persona === "personal") {
      switchProfileChoice("personal");
      triggerToast("Switched to Personal Profile (Emerald Theme)");
    } else if (persona === "professional") {
      switchProfileChoice("professional");
      triggerToast("Switched to Professional Profile (Navy Theme)");
    } else {
      switchProfileChoice("personal");
      triggerToast("Switched to Sub-Account / Staff Profile");
    }
  };

  // Hydration & Progress Stats
  const waterCurrent = patient?.waterCurrentMl || 1750;
  const waterGoal = patient?.waterGoalMl || 2500;
  const waterPct = Math.min(100, Math.round((waterCurrent / waterGoal) * 100));

  const completedRoutinesCount = routineItems.filter((r) => r.isCompleted).length;
  const routinePct = Math.round((completedRoutinesCount / Math.max(1, routineItems.length)) * 100);

  // Sub-Accounts List (derived from patients array excluding current)
  const subAccountsList = (patients || []).filter((p) => p.id !== patient?.id);

  // Theme Accent Helper
  const themeAccentBg = activePersona === "personal" 
    ? "bg-emerald-900 border-emerald-700/60 text-white" 
    : activePersona === "professional" 
    ? "bg-slate-900 border-slate-700/60 text-white" 
    : "bg-indigo-950 border-indigo-700/60 text-white";

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-1 sm:px-3 font-sans">
      {/* TOAST NOTIFICATION BADGE */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-slate-900 text-white font-black text-xs px-4 py-2.5 rounded-2xl border border-emerald-500/60 shadow-2xl flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ZONE A: IDENTITY HEADER & MULTI-PERSONA CONTEXT ENGINE */}
      {/* ========================================================================= */}
      <GreetingHeader
        patient={patient}
        patients={patients}
        onSelectPatient={onSelectPatient}
        accountType={accountType}
        activePersona={activePersona}
        onSwitchPersona={handleSwitchPersona}
        onOpenAiAssistantModal={onOpenAiAssistantModal}
        onOpenVoiceAssistantModal={onOpenVoiceAssistantModal}
        onOpenAuthModal={onOpenAuthModal}
        onNavigateToTab={onNavigateToTab}
        onOpenNotifications={() => setShowNotificationDrawer(true)}
        notificationsCount={3}
      />

      {/* ========================================================================= */}
      {/* ZONE B: SUB-ACCOUNT QUICK-STRIP & TASK DELEGATION ROW */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2E7D32]" />
            <h2 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Sub-Accounts & Staff Operations Quick-Strip
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              {subAccountsList.length} Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateSubAccountModal(true)}
              className="px-3 py-1.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-[11px] rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSubAccountManagerModal(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl cursor-pointer"
            >
              Manager
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Row of Sub-Account Avatars */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {/* Active Primary Profile */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300/80 p-2 rounded-2xl shrink-0">
            <img
              src={patient?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt="Primary"
              className="w-9 h-9 rounded-xl object-cover border border-emerald-400"
            />
            <div className="text-xs">
              <div className="font-black text-slate-900 flex items-center gap-1">
                {patient?.name} <span className="text-[9px] bg-emerald-600 text-white px-1.5 rounded-md">Master</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-extrabold">Active Controller</div>
            </div>
          </div>

          {/* Sub-Accounts Strip */}
          {subAccountsList.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => {
                setSelectedSubAccountForTask(sub);
                setShowTaskDelegationModal(true);
              }}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded-2xl shrink-0 cursor-pointer transition-all text-left"
            >
              <div className="relative">
                <img
                  src={sub.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                  alt={sub.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-300"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-white" />
              </div>

              <div className="text-xs">
                <div className="font-bold text-slate-800 max-w-[100px] truncate">{sub.name}</div>
                <div className="text-[10px] text-slate-500 font-medium capitalize">
                  {sub.relationship || "Staff / Family"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE C: MODULAR DYNAMIC DASHBOARD (BENTO BOX GRID LAYOUT) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Dashboard Title & Customize Toggle Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-[#2E7D32]" />
              Things You Care
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tailored widgets for routines, QR vault, cash flow, fleet & property assets
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomizeModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-2xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            title="Customise widgets and dashboard view"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2E7D32]" />
            <span>Custom</span>
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* BENTO CARD 1: ROUTINE & WELLNESS LEDGER (Full width / 2-col) */}
          {bentoConfigs.find((c) => c.id === "routine_wellness")?.enabled && (
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-[#2E7D32] rounded-2xl">
                      <CheckSquare className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm sm:text-base">
                        Routine & Wellness Checklist
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {completedRoutinesCount} of {routineItems.length} tasks completed today ({routinePct}%)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateSubTab("medication")}
                    className="text-xs font-black text-[#2E7D32] hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${routinePct}%` }}
                  />
                </div>

                {/* Interactive Routine Checklist */}
                <div className="space-y-2">
                  {routineItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleRoutine(item.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        item.isCompleted
                          ? "bg-emerald-50/60 border-emerald-200 text-slate-600"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          item.isCompleted ? "bg-[#2E7D32] border-[#2E7D32] text-white" : "border-slate-400 bg-white"
                        }`}>
                          {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                        </span>

                        <div>
                          <span className={`text-xs font-black block ${item.isCompleted ? "line-through opacity-70" : ""}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.time}
                          </span>
                        </div>
                      </div>

                      {item.category === "water" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddWater(patient?.id || "p1", 250);
                            triggerToast("💧 +250 ml Water Intake Logged!");
                          }}
                          className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-black rounded-xl border border-blue-300"
                        >
                          +250ml
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hydration Quick Bar */}
              <div className="bg-blue-50/80 border border-blue-200/80 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-extrabold text-blue-900">Hydration Target: </span>
                    <span className="font-black text-blue-700">{waterCurrent} / {waterGoal} ml ({waterPct}%)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onAddWater(patient?.id || "p1", 250);
                      triggerToast("💧 Logged 250ml Water!");
                    }}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[10px]"
                  >
                    +250ml
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddWater(patient?.id || "p1", 500);
                      triggerToast("💧 Logged 500ml Water!");
                    }}
                    className="px-2.5 py-1 bg-blue-800 hover:bg-blue-900 text-white font-black rounded-xl text-[10px]"
                  >
                    +500ml
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BENTO CARD 2: DIGITAL VAULT & VISITING QR (1-col) */}
          {bentoConfigs.find((c) => c.id === "digital_vault_qr")?.enabled && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl">
                      <QrCode className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Digital Vault & QR</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Visiting card & Emergency ID</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQrCardModal(true)}
                    className="p-1.5 text-indigo-700 hover:bg-indigo-50 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* QR Preview Component */}
                <div className="flex flex-col items-center justify-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <ProfessionalQrRenderer
                    value={`https://care2care.org/u/${patient?.id || "user101"}`}
                    size={110}
                    fgColor="#0f172a"
                    bgColor="#ffffff"
                    patternStyle="rounded"
                    eyeStyle="rounded"
                    showLogo={true}
                  />
                  <div className="text-[11px] font-black text-slate-900 mt-2">{patient?.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold">Emergency Medical Contact Pass</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowQrCardModal(true)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" /> Full Card View
                </button>
              </div>
            </div>
          )}

          {/* BENTO CARD 3: SYSTEM FINANCES & CASH FLOW (1-col) */}
          {bentoConfigs.find((c) => c.id === "system_finances")?.enabled && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-[#2E7D32] rounded-2xl">
                      <Wallet className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">System Finances</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Cash flow & Budget Summary</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateSubTab("finance")}
                    className="text-xs font-black text-[#2E7D32] hover:underline"
                  >
                    Open Ledger
                  </button>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Available Balance</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">Rs. 1,48,500.00</div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px]">
                    <div>
                      <span className="text-slate-400 block font-bold">Monthly Income</span>
                      <span className="text-emerald-400 font-black font-mono">+Rs. 65,000</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Expenses</span>
                      <span className="text-rose-400 font-black font-mono">-Rs. 18,250</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigateSubTab("finance")}
                className="w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-[#2E7D32] font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <PieChart className="w-3.5 h-3.5" /> Detailed Financial Reports
              </button>
            </div>
          )}

          {/* BENTO CARD 4: FLEET & ASSET MAINTENANCE (1-col) */}
          {bentoConfigs.find((c) => c.id === "fleet_assets")?.enabled && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-800 rounded-2xl">
                      <Car className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Fleet & Asset Care</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Mileage & Maintenance Due</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateSubTab("vehicles")}
                    className="text-xs font-black text-amber-800 hover:underline"
                  >
                    View
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 flex items-center gap-1.5">
                      🚗 Toyota Hilux (BA 21 PA 8092)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-md">
                      OK
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Odometer: <span className="font-mono font-bold text-slate-900">42,150 km</span> • Service in <span className="font-bold text-amber-700">850 km</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigateSubTab("vehicles")}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                Log Mileage & Fuel
              </button>
            </div>
          )}

          {/* BENTO CARD 5: PROPERTY & FARM LAND UPKEEP (1-col) */}
          {bentoConfigs.find((c) => c.id === "property_farm")?.enabled && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 text-[#2E7D32] rounded-2xl">
                      <Leaf className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Property & Farm</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Crop sectors & Land records</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateSubTab("garden")}
                    className="text-xs font-black text-[#2E7D32] hover:underline"
                  >
                    Manage
                  </button>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">🌱 Organic Farm Sector A</span>
                    <span className="text-[10px] font-bold text-emerald-800">Moisture 82%</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Next Irrigation Cycle: <span className="font-bold text-slate-900">06:00 PM Today</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigateSubTab("garden")}
                className="w-full py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                Garden & Crop Log
              </button>
            </div>
          )}

          {/* BENTO CARD 6: HEALTH VITALS & HEART RATE (1-col) */}
          {bentoConfigs.find((c) => c.id === "vitals_tracker")?.enabled && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-rose-100 text-rose-700 rounded-2xl">
                      <HeartPulse className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Health Vitals</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Pulse, BP & Oxygen Sync</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigateSubTab("elderly")}
                    className="text-xs font-black text-rose-700 hover:underline"
                  >
                    Charts
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-rose-50/80 p-2.5 rounded-2xl border border-rose-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Heart Rate</span>
                    <span className="text-lg font-black font-mono text-rose-700">72 bpm</span>
                  </div>
                  <div className="bg-blue-50/80 p-2.5 rounded-2xl border border-blue-200">
                    <span className="text-[10px] text-slate-500 font-bold block">SpO2 Level</span>
                    <span className="text-lg font-black font-mono text-blue-700">98 %</span>
                  </div>
                  <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Blood Pressure</span>
                    <span className="text-base font-black font-mono text-emerald-800">120/80</span>
                  </div>
                  <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Blood Glucose</span>
                    <span className="text-base font-black font-mono text-amber-800">95 mg/dL</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigateSubTab("elderly")}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                + Record Vitals
              </button>
            </div>
          )}

          {/* BENTO CARD 7: CAREGIVER & SOS EMERGENCY ALERTS (1-col) */}
          {bentoConfigs.find((c) => c.id === "caregiver_sos")?.enabled && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-rose-100 text-rose-700 rounded-2xl">
                      <ShieldAlert className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Caregiver & Emergency</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Instructions & SOS Trigger</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenSosModal}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg"
                  >
                    SOS Mode
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="font-extrabold text-slate-900">Caregiver Note:</div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    "{patient?.caregiverNotes || "Keep hydration high during afternoon hours. Take BP reading at 6 PM."}"
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenSosModal}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md animate-pulse"
              >
                <ShieldAlert className="w-4 h-4" /> 1-TAP EMERGENCY SOS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE D: FLOATING ACTION CONTROL (+ UNIVERSAL QUICK ACTION BUTTON) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-20 right-6 z-40">
        <button
          type="button"
          onClick={() => setShowQuickActionSheet(!showQuickActionSheet)}
          className="w-14 h-14 bg-[#2E7D32] hover:bg-emerald-800 text-white rounded-full shadow-2xl border-2 border-white flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          title="Universal Quick Action"
        >
          <Plus className={`w-8 h-8 transition-transform duration-300 ${showQuickActionSheet ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Quick Action Overlay Sheet Modal */}
      {showQuickActionSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#2E7D32]" />
                  Universal Quick Actions
                </h3>
                <p className="text-xs text-slate-500 font-medium">Instant shortcuts & logging tools</p>
              </div>

              <button
                type="button"
                onClick={() => setShowQuickActionSheet(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  onAddWater(patient?.id || "p1", 250);
                  triggerToast("💧 Logged 250ml Water!");
                  setShowQuickActionSheet(false);
                }}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-blue-900 cursor-pointer"
              >
                <Droplets className="w-6 h-6 text-blue-600" />
                <span>Log Water (+250ml)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionSheet(false);
                  handleNavigateSubTab("medication");
                }}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-emerald-900 cursor-pointer"
              >
                <Pill className="w-6 h-6 text-[#2E7D32]" />
                <span>Log Medication</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionSheet(false);
                  handleNavigateSubTab("finance");
                }}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-amber-900 cursor-pointer"
              >
                <Wallet className="w-6 h-6 text-amber-600" />
                <span>Add Expense / Bill</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionSheet(false);
                  setShowQrCardModal(true);
                }}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-indigo-900 cursor-pointer"
              >
                <QrCode className="w-6 h-6 text-indigo-600" />
                <span>Visiting QR Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionSheet(false);
                  handleNavigateSubTab("ticket_queue");
                }}
                className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-teal-900 cursor-pointer"
              >
                <FileText className="w-6 h-6 text-teal-600" />
                <span>Queue Token</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQuickActionSheet(false);
                  onOpenSosModal();
                }}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-rose-900 cursor-pointer"
              >
                <ShieldAlert className="w-6 h-6 text-rose-600" />
                <span>Emergency SOS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CUSTOMIZE BENTO DASHBOARD */}
      {/* ========================================================================= */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#2E7D32]" />
                  Configure "Things You Care" Widgets
                </h3>
                <p className="text-xs text-slate-500 font-medium">Turn modules on or off for custom display</p>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {bentoConfigs.map((config) => (
                <div
                  key={config.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-black text-slate-900">{config.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{config.description}</div>
                  </div>

                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => {
                      const updated = bentoConfigs.map((c) => (c.id === config.id ? { ...c, enabled: e.target.checked } : c));
                      saveBentoConfigs(updated);
                    }}
                    className="w-5 h-5 text-[#2E7D32] rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => saveBentoConfigs(DEFAULT_BENTO_CONFIGS)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCustomizeModal(false);
                  triggerToast("✨ Dashboard layout updated!");
                }}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FULL-SCREEN DIGITAL VISITING QR CARD */}
      {/* ========================================================================= */}
      {showQrCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-black text-slate-900 text-sm">Virtual Medical & Emergency Pass</h3>
              <button type="button" onClick={() => setShowQrCardModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={patient?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div className="text-left">
                  <div className="font-black text-sm">{patient?.name}</div>
                  <div className="text-[10px] text-slate-400">Care2Care Verified Pass</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
                <ProfessionalQrRenderer
                  value={`https://care2care.org/u/${patient?.id || "user101"}`}
                  size={180}
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                  patternStyle="rounded"
                  eyeStyle="rounded"
                  showLogo={true}
                />
              </div>

              <div className="text-[10px] text-slate-400 font-mono">ID: C2C-{patient?.id || "88901"}</div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://care2care.org/u/${patient?.id || "user101"}`);
                triggerToast("📋 Profile Pass Link Copied!");
              }}
              className="w-full py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" /> Copy Pass URL
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TASK DELEGATION TO SUB-ACCOUNT */}
      {/* ========================================================================= */}
      {showTaskDelegationModal && selectedSubAccountForTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Delegate Task to Sub-Account</h3>
                <p className="text-xs text-slate-500 font-medium">Assign routine or operational task to {selectedSubAccountForTask.name}</p>
              </div>
              <button type="button" onClick={() => setShowTaskDelegationModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Routine Task to Assign</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                  {routineItems.map((r) => (
                    <option key={r.id} value={r.id}>{r.title} ({r.time})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delegation Instructions / Notes</label>
                <textarea rows={2} placeholder="e.g. Please verify medication intake photo before logging..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowTaskDelegationModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTaskDelegationModal(false);
                  triggerToast(`✅ Task delegated to ${selectedSubAccountForTask.name}!`);
                }}
                className="px-5 py-2 bg-[#2E7D32] text-white font-black rounded-xl text-xs shadow-md"
              >
                Confirm Delegation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ACCOUNT MANAGER MODAL */}
      <SubAccountManagerModal
        isOpen={showSubAccountManagerModal}
        onClose={() => setShowSubAccountManagerModal(false)}
        patients={patients}
        selectedPatientId={patient?.id || "p1"}
        onSelectPatient={onSelectPatient}
        onOpenCreateNewModal={() => {
          setShowSubAccountManagerModal(false);
          setShowCreateSubAccountModal(true);
        }}
      />

      {/* CREATE SUB-ACCOUNT MODAL */}
      <CreateSubAccountModal
        isOpen={showCreateSubAccountModal}
        onClose={() => setShowCreateSubAccountModal(false)}
        onSubAccountCreated={(newPat: Patient) => {
          if (onAddPatient) {
            onAddPatient(newPat);
          }
          setShowCreateSubAccountModal(false);
          triggerToast(`🎉 Sub-Account "${newPat.name}" created successfully!`);
        }}
      />
    </div>
  );
};
