import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  User,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame,
  Pill,
  Droplets,
  Trophy,
  Smile,
  Compass,
  Play,
  RotateCcw,
  Check,
  Plus,
  Coins,
  ShieldCheck,
  Clock,
  LayoutGrid,
  Sliders,
  CreditCard,
  Calendar,
  Briefcase,
  Layers,
  Settings2,
  X,
  Target,
  Moon,
  Footprints,
  Utensils
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Patient,
  AccountType,
  AppState,
  DashboardPreferences,
  DEFAULT_PERSONAL_DASHBOARD_PREFS,
  DEFAULT_PROFESSIONAL_DASHBOARD_PREFS,
  DEFAULT_SUBACCOUNT_DASHBOARD_PREFS
} from "../types";
import { useLanguage } from "../context/LanguageContext";
import { ALL_SERVICES_CATALOG } from "../pages/ServiceLibrary";
import { DashboardCustomization } from "./DashboardCustomization";
import { CareChip, CareButton, CareCard } from "../design-system";

interface RoutineTodayItem {
  id: string;
  type: "medicine" | "challenge" | "water" | "finance" | "calendar" | "staff" | "habit" | "sleep" | "walk";
  icon: string;
  title: string;
  subtitle: string;
  progressPercent?: number;
  time?: string;
  isCompleted: boolean;
  targetSubTab: string;
  actionLabel?: string;
}

interface HomeViewProps {
  appState?: AppState;
  onUpdateAppState?: (updater: (prev: AppState) => AppState) => void;
  accountType?: AccountType;
  setAccountType?: (type: AccountType) => void;
  patient: Patient;
  patients?: Patient[];
  currentUser?: any;
  onSelectPatient?: (id: string) => void;
  onAddPatient?: (newPatient: Patient) => void;
  onNavigateToTab: (tab: "home" | "track" | "plan" | "care" | "more" | "services") => void;
  onNavigateToCareSubTab?: (subTab: string) => void;
  onNavigateToServicesLibrary?: () => void;
  onNavigateToChallenges?: () => void;
  onAddWater?: (patientId: string, amountMl: number) => void;
  onOpenSosModal?: () => void;
  onOpenQuickMenu?: () => void;
  onOpenAiAssistantModal?: () => void;
  onOpenVoiceAssistantModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenUserProfileModal?: (tab?: "personal" | "professional" | "dependents" | "dashboard_customization") => void;
  isAiToolsExpanded?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  accountType = "family",
  setAccountType,
  patient,
  patients = [],
  currentUser,
  onSelectPatient,
  onNavigateToTab,
  onNavigateToCareSubTab,
  onNavigateToServicesLibrary,
  onNavigateToChallenges,
  onAddWater,
  onOpenAuthModal,
  onOpenUserProfileModal
}) => {
  const { t } = useLanguage();

  // Notification popup trigger state
  const [showNotificationsToast, setShowNotificationsToast] = useState<boolean>(false);
  const [isQuickCustomizeOpen, setIsQuickCustomizeOpen] = useState<boolean>(false);

  // Active Profile Lens ("personal" | "professional" | "subaccount")
  const activeProfileMode: "personal" | "professional" | "subaccount" = useMemo(() => {
    if (accountType === "professional") return "professional";
    if (accountType === "family" && patient?.category && patient.category !== "General") return "subaccount";
    if (currentUser?.role === "employee" || currentUser?.role === "patient") return "subaccount";
    if (currentUser?.role === "doctor" || currentUser?.role === "staff") return "professional";
    return "personal";
  }, [accountType, patient, currentUser]);

  // Load active Dashboard Preferences from localStorage or defaults
  const [dashboardPrefs, setDashboardPrefs] = useState<DashboardPreferences>(() => {
    try {
      const saved = localStorage.getItem(`care2care_dashboard_preferences_${activeProfileMode}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    if (activeProfileMode === "professional") return DEFAULT_PROFESSIONAL_DASHBOARD_PREFS;
    if (activeProfileMode === "subaccount") return DEFAULT_SUBACCOUNT_DASHBOARD_PREFS;
    return DEFAULT_PERSONAL_DASHBOARD_PREFS;
  });

  // Reload preferences whenever profile mode changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`care2care_dashboard_preferences_${activeProfileMode}`);
      if (saved) {
        setDashboardPrefs(JSON.parse(saved));
        return;
      }
    } catch (e) {
      console.error(e);
    }
    if (activeProfileMode === "professional") {
      setDashboardPrefs(DEFAULT_PROFESSIONAL_DASHBOARD_PREFS);
    } else if (activeProfileMode === "subaccount") {
      setDashboardPrefs(DEFAULT_SUBACCOUNT_DASHBOARD_PREFS);
    } else {
      setDashboardPrefs(DEFAULT_PERSONAL_DASHBOARD_PREFS);
    }
  }, [activeProfileMode]);

  // Formatted real date (e.g., "Wednesday, 14 May")
  const formattedTodayDate = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
  }, []);

  // Time of Day Greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  }, []);

  const displayName = useMemo(() => {
    if (currentUser?.name && currentUser.name.trim() !== "") {
      return currentUser.name.split(" ")[0];
    }
    if (patient?.name && patient.name.trim() !== "") {
      return patient.name.split(" ")[0];
    }
    return "Alex";
  }, [currentUser, patient]);

  // Read Water intake
  const currentWaterMl = patient?.waterCurrentMl ?? 1400;
  const targetWaterMl = patient?.waterGoalMl ?? 2500;
  const waterPercent = Math.min(100, Math.round((currentWaterMl / (targetWaterMl || 2500)) * 100));

  // Dynamic Action items state
  const [medicationDoseTaken, setMedicationDoseTaken] = useState<boolean>(false);
  const [invoicePaid, setInvoicePaid] = useState<boolean>(false);
  const [staffApproved, setStaffApproved] = useState<boolean>(false);

  // Active Challenge info
  const activeChallenge = useMemo(() => {
    try {
      const saved = localStorage.getItem("care2care_habit_challenges");
      if (saved) {
        const parsed = JSON.parse(saved);
        const active = parsed.find((c: any) => c.status === "Active") || parsed[0];
        if (active) return active;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      title: "21-Day Mindful Hydration & Detox",
      currentDay: 3,
      streakCount: 7,
      completedDays: [1, 2],
    };
  }, []);

  const isLifelongHabit = activeChallenge.isLifelongContinuation || (activeChallenge.completedDays?.length >= 21 && (activeChallenge.lifelongDayCount || 0) >= 22);
  const lifelongDayNumber = activeChallenge.lifelongDayCount || 22;
  const daysContinuing = Math.max(1, lifelongDayNumber - 21);
  const challengeCurrentDay = activeChallenge.currentDay || 3;
  const challengeStreak = activeChallenge.streakCount || 7;
  const challengePercent = isLifelongHabit ? 100 : Math.round(((challengeCurrentDay - 1) / 21) * 100);

  const handleOpenService = (subTab: string) => {
    if (subTab === "dashboard_customizer") {
      setIsQuickCustomizeOpen(true);
      return;
    }
    if (onNavigateToCareSubTab) {
      onNavigateToCareSubTab(subTab);
    } else {
      onNavigateToTab("care");
    }
  };

  const handleOpenChallenges = () => {
    if (onNavigateToChallenges) {
      onNavigateToChallenges();
    } else if (onNavigateToCareSubTab) {
      onNavigateToCareSubTab("habit_challenges");
    } else {
      onNavigateToTab("care");
    }
  };

  const handleOpenAllServices = () => {
    if (onNavigateToServicesLibrary) {
      onNavigateToServicesLibrary();
    } else {
      onNavigateToTab("services");
    }
  };

  const handleAddWaterQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddWater) {
      onAddWater(patient?.id || "default", 250);
    } else {
      handleOpenService("water");
    }
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification Alert */}
      {showNotificationsToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span>🔔</span>
          <span>You have 3 active health reminders scheduled for today!</span>
          <button
            type="button"
            onClick={() => setShowNotificationsToast(false)}
            className="text-slate-400 hover:text-white ml-2 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* QUICK CUSTOMIZATION MODAL */}
      {isQuickCustomizeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-orange-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsQuickCustomizeOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <DashboardCustomization
              currentProfileMode={activeProfileMode}
              patients={patients}
              onClose={() => setIsQuickCustomizeOpen(false)}
              onSavePreferences={(prefs) => {
                setDashboardPrefs(prefs);
                setIsQuickCustomizeOpen(false);
              }}
              onPreviewHome={() => setIsQuickCustomizeOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & GREETING (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-4 py-1">
        {/* Left Side: Dynamic Greeting & User Name */}
        <div className="space-y-0.5 min-w-0 text-left">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <span>{greetingText}, {displayName}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {formattedTodayDate}
          </p>
        </div>

        {/* Right Side: Calendar, Notification Bell with Red Badge & Profile Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Calendar Button */}
          <button
            type="button"
            onClick={() => onNavigateToTab("plan")}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#FF6A45] hover:bg-orange-50 dark:hover:bg-slate-700 flex items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105"
            title="Calendar & Schedule"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* 🔔 Notification Bell with Badge (3) */}
          <button
            type="button"
            onClick={() => setShowNotificationsToast(true)}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#FF6A45] hover:bg-orange-50 dark:hover:bg-slate-700 flex items-center justify-center shadow-2xs relative cursor-pointer transition-all hover:scale-105"
            title="3 New Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-black absolute -top-1 -right-1 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              3
            </span>
          </button>

          {/* 👤 Profile Avatar */}
          <button
            type="button"
            onClick={() => {
              if (onOpenUserProfileModal) {
                onOpenUserProfileModal("personal");
              } else if (onOpenAuthModal) {
                onOpenAuthModal();
              }
            }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A45] to-[#FB923C] text-white flex items-center justify-center font-black text-sm shadow-2xs hover:scale-105 transition-all cursor-pointer ring-2 ring-orange-200 dark:ring-slate-700"
            title="User Profile & Settings"
          >
            {displayName.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TODAY'S FOCUS CARD (MATCHING WARM PEACH HERO SCREENSHOT) */}
      {/* ========================================================================= */}
      <div className="bg-[#FFEEDB] dark:bg-orange-950/40 border border-[#FDD9CB] dark:border-orange-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-orange-400 block">
              Today's Focus
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Drink {(targetWaterMl / 1000).toFixed(1)}L of Water
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              You've completed {(currentWaterMl / 1000).toFixed(1)}L
            </p>
          </div>

          {/* Water Glass Illustration */}
          <div className="w-14 h-14 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs flex items-center justify-center text-3xl shadow-xs shrink-0 border border-orange-200 dark:border-orange-900">
            💧
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Daily Hydration Progress</span>
            <span className="text-[#C2410C] dark:text-orange-400 font-black">{waterPercent}%</span>
          </div>
          <div className="w-full h-3 bg-white/90 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-orange-200/80 dark:border-orange-900">
            <div
              className="h-full bg-gradient-to-r from-[#FF6A45] to-[#FB923C] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, waterPercent))}%` }}
            />
          </div>
        </div>

        {/* Primary "+ Add Water" Action Button */}
        <button
          type="button"
          onClick={handleAddWaterQuick}
          className="w-full py-3 bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Water (+250 ml)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. 21-DAY / LIFELONG CHALLENGE PROGRESS CARD (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      <div
        onClick={handleOpenChallenges}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-2xs space-y-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all cursor-pointer text-left"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFEEDB] dark:bg-orange-950/60 text-[#FF6A45] flex items-center justify-center text-lg font-black shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {isLifelongHabit
                  ? `21/21 Complete ✓ • Lifelong Day ${lifelongDayNumber}`
                  : `Day ${challengeCurrentDay} of 21 – Foundation Phase`}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {isLifelongHabit
                  ? `Lifelong Habit • ${daysContinuing} days continuing`
                  : activeChallenge.title || "21-Day Habit Challenge"}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${
            isLifelongHabit
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-[#2E7D32] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-orange-50 dark:bg-orange-950/50 text-[#C2410C] dark:text-orange-400 border-orange-200 dark:border-orange-800"
          }`}>
            {isLifelongHabit ? "Lifelong ✓" : `${challengePercent}%`}
          </span>
        </div>

        {/* 21 Numbered Pills Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{isLifelongHabit ? "21-Day Foundation (Mastered)" : "21-Day Cycle"}</span>
            <span>{isLifelongHabit ? `Day ${lifelongDayNumber} Active` : `Day ${challengeCurrentDay} Active`}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
              const isPast = isLifelongHabit || day < challengeCurrentDay;
              const isCurrent = !isLifelongHabit && day === challengeCurrentDay;
              return (
                <div
                  key={day}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 transition-all ${
                    isCurrent
                      ? "bg-[#FF6A45] text-white shadow-xs scale-110 ring-2 ring-orange-200 dark:ring-orange-800"
                      : isPast
                      ? "bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {isPast ? "✓" : day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Info Footnote */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-black text-[#EA580C] dark:text-orange-400">
            <Flame className="w-4 h-4 fill-current" />
            <span>Streak: {challengeStreak} Days (Lifelong mastery! 🔥)</span>
          </div>
          <span className="text-xs font-black text-[#FF6A45] flex items-center gap-1">
            {isLifelongHabit ? `Scratch Day ${lifelongDayNumber}` : `Scratch Day ${challengeCurrentDay}`}{" "}
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. QUICK ACTIONS ROW (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      <div className="space-y-2 text-left">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Quick Actions
          </span>
          <button
            type="button"
            onClick={() => handleOpenAllServices()}
            className="text-[11px] font-bold text-[#FF6A45] hover:underline cursor-pointer"
          >
            All Services
          </button>
        </div>

        {/* Horizontal Scrollable Action Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <CareChip
            label="Log Mood"
            icon={<Smile className="w-3.5 h-3.5 text-amber-500" />}
            onClick={() => handleOpenService("mood")}
          />
          <CareChip
            label="Track Sleep"
            icon={<Moon className="w-3.5 h-3.5 text-indigo-500" />}
            onClick={() => handleOpenService("sleep")}
          />
          <CareChip
            label="Log Food"
            icon={<Utensils className="w-3.5 h-3.5 text-emerald-500" />}
            onClick={() => handleOpenService("nutrition")}
          />
          <CareChip
            label="Walk"
            icon={<Footprints className="w-3.5 h-3.5 text-blue-500" />}
            onClick={() => handleOpenService("steps")}
          />
          <CareChip
            label="Meditate"
            icon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />}
            onClick={() => handleOpenService("yoga")}
          />
          <CareChip
            label="Medicine"
            icon={<Pill className="w-3.5 h-3.5 text-rose-500" />}
            onClick={() => handleOpenService("medicine")}
          />
          <CareChip
            label="Expense"
            icon={<CreditCard className="w-3.5 h-3.5 text-teal-500" />}
            onClick={() => handleOpenService("finance")}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TODAY'S ATTENTION & REMINDERS LIST */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-2xs space-y-3.5 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Today's Schedule & Attention
            </h3>
            <p className="text-[11px] font-bold text-slate-500">
              Personalized routines scheduled for today
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsQuickCustomizeOpen(true)}
            className="text-[11px] font-bold text-[#FF6A45] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>Customize</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Medicine Item */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F5] dark:bg-slate-850 border border-[#FFE2D6] dark:border-slate-700">
            <div
              onClick={() => handleOpenService("medicine")}
              className="flex items-center gap-3 cursor-pointer min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-rose-500 flex items-center justify-center text-base shadow-2xs shrink-0 border border-rose-100 dark:border-slate-700">
                💊
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  Take Morning Vitamins & Metformin
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Scheduled at 08:30 AM</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMedicationDoseTaken(!medicationDoseTaken)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-xs shrink-0 ${
                medicationDoseTaken
                  ? "bg-[#22C55E] text-white"
                  : "bg-[#FF6A45] hover:bg-[#EA580C] text-white"
              }`}
            >
              {medicationDoseTaken ? <><Check className="w-3.5 h-3.5" /> Taken</> : "Take"}
            </button>
          </div>

          {/* Evening Walk Item */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F5] dark:bg-slate-850 border border-[#FFE2D6] dark:border-slate-700">
            <div
              onClick={() => handleOpenService("steps")}
              className="flex items-center gap-3 cursor-pointer min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-blue-500 flex items-center justify-center text-base shadow-2xs shrink-0 border border-blue-100 dark:border-slate-700">
                🚶
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  Evening Walk – 7,000 Steps Goal
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Scheduled at 06:00 PM</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenService("steps")}
              className="px-3 py-1.5 bg-[#FF6A45] hover:bg-[#EA580C] text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1 transition-all shrink-0"
            >
              Start
            </button>
          </div>

          {/* Bill / Finance Item */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F5] dark:bg-slate-850 border border-[#FFE2D6] dark:border-slate-700">
            <div
              onClick={() => handleOpenService("finance")}
              className="flex items-center gap-3 cursor-pointer min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-teal-500 flex items-center justify-center text-base shadow-2xs shrink-0 border border-teal-100 dark:border-slate-700">
                💳
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  Review Monthly Budget & Bills
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Due today • $145.00 scheduled</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInvoicePaid(!invoicePaid)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-xs shrink-0 ${
                invoicePaid
                  ? "bg-[#22C55E] text-white"
                  : "bg-slate-800 text-white"
              }`}
            >
              {invoicePaid ? "Paid" : "Review"}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. ALL SERVICES DISCOVERY BANNER */}
      {/* ========================================================================= */}
      <div>
        <button
          type="button"
          onClick={() => onNavigateToTab("services")}
          className="w-full py-4 px-6 bg-white dark:bg-slate-900 hover:bg-orange-50/40 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xs transition-all cursor-pointer flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFEEDB] dark:bg-slate-800 text-xl flex items-center justify-center text-[#FF6A45] group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-[#FF6A45] transition-colors">
                Explore All Care & Lifestyle Services
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Health, Fitness, Mind, Career, Finance, Pets, Farm & Family tools
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-slate-800 group-hover:bg-[#FF6A45] text-[#FF6A45] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs shrink-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};
