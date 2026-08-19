import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
  User,
  Briefcase,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  Pill,
  Trophy,
  Droplets,
  CreditCard,
  Calendar,
  ClipboardList,
  Shield,
  Layers,
  ArrowRight,
  Pin,
  Clock,
  Flame,
  ChevronRight,
  Save,
  HelpCircle
} from "lucide-react";
import {
  DashboardPreferences,
  DEFAULT_PERSONAL_DASHBOARD_PREFS,
  DEFAULT_PROFESSIONAL_DASHBOARD_PREFS,
  DEFAULT_SUBACCOUNT_DASHBOARD_PREFS,
  Patient
} from "../types";
import { ALL_SERVICES_CATALOG } from "../pages/ServiceLibrary";

interface DashboardCustomizationProps {
  currentProfileMode?: "personal" | "professional" | "subaccount";
  currentPatient?: Patient;
  patients?: Patient[];
  onSavePreferences?: (prefs: DashboardPreferences, mode: string, syncToSubAccounts: boolean) => void;
  onClose?: () => void;
  onPreviewHome?: () => void;
}

export const DashboardCustomization: React.FC<DashboardCustomizationProps> = ({
  currentProfileMode = "personal",
  currentPatient,
  patients = [],
  onSavePreferences,
  onClose,
  onPreviewHome
}) => {
  // Selected Profile Mode Lens
  const [selectedMode, setSelectedMode] = useState<"personal" | "professional" | "subaccount">(currentProfileMode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences state based on selected profile mode
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    try {
      const saved = localStorage.getItem(`care2care_dashboard_preferences_${currentProfileMode}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    if (currentProfileMode === "professional") return DEFAULT_PROFESSIONAL_DASHBOARD_PREFS;
    if (currentProfileMode === "subaccount") return DEFAULT_SUBACCOUNT_DASHBOARD_PREFS;
    return DEFAULT_PERSONAL_DASHBOARD_PREFS;
  });

  // When selectedMode changes, reload corresponding preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`care2care_dashboard_preferences_${selectedMode}`);
      if (saved) {
        setPreferences(JSON.parse(saved));
        return;
      }
    } catch (e) {
      console.error(e);
    }

    if (selectedMode === "professional") {
      setPreferences(DEFAULT_PROFESSIONAL_DASHBOARD_PREFS);
    } else if (selectedMode === "subaccount") {
      setPreferences(DEFAULT_SUBACCOUNT_DASHBOARD_PREFS);
    } else {
      setPreferences(DEFAULT_PERSONAL_DASHBOARD_PREFS);
    }
  }, [selectedMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle helper for Today's Attention filters
  const toggleTodayFilter = (key: keyof DashboardPreferences["today_attention_filters"]) => {
    setPreferences((prev) => ({
      ...prev,
      today_attention_filters: {
        ...prev.today_attention_filters,
        [key]: !prev.today_attention_filters[key]
      }
    }));
  };

  // Toggle helper for Continue enabled services
  const toggleContinueService = (serviceId: string) => {
    setPreferences((prev) => {
      const current = prev.continue_resume_logic.enabled_services;
      const exists = current.includes(serviceId);
      let updated: string[];
      if (exists) {
        // Must keep at least 1
        if (current.length <= 1) {
          showToast("⚠️ Keep at least 1 service active in Continue.");
          return prev;
        }
        updated = current.filter((s) => s !== serviceId);
      } else {
        updated = [...current, serviceId];
      }
      return {
        ...prev,
        continue_resume_logic: {
          ...prev.continue_resume_logic,
          enabled_services: updated
        }
      };
    });
  };

  // Toggle helper for Pinned Services
  const togglePinnedService = (serviceSubTab: string) => {
    setPreferences((prev) => {
      const current = prev.pinned_services.custom_list;
      const exists = current.includes(serviceSubTab);
      let updated: string[];
      if (exists) {
        if (current.length <= 1) {
          showToast("⚠️ Keep at least 1 pinned tool.");
          return prev;
        }
        updated = current.filter((s) => s !== serviceSubTab);
      } else {
        if (current.length >= 6) {
          showToast("⚠️ Maximum 6 pinned tools allowed on Home Screen.");
          return prev;
        }
        updated = [...current, serviceSubTab];
      }
      return {
        ...prev,
        pinned_services: {
          ...prev.pinned_services,
          custom_list: updated
        }
      };
    });
  };

  // Save Preferences Action
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Save to LocalStorage for instant reactive load
      localStorage.setItem(`care2care_dashboard_preferences_${selectedMode}`, JSON.stringify(preferences));

      // 2. If sync to subaccounts is checked, also update subaccount key
      if (preferences.sync_sub_accounts) {
        localStorage.setItem("care2care_dashboard_preferences_subaccount", JSON.stringify(preferences));
      }

      // 3. Update backend API endpoint
      try {
        await fetch("/api/profile/update-dashboard-preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: selectedMode,
            preferences,
            syncToSubAccounts: Boolean(preferences.sync_sub_accounts)
          })
        });
      } catch (err) {
        console.warn("Backend API sync notice (offline mode active):", err);
      }

      // 4. Trigger Parent Callback
      if (onSavePreferences) {
        onSavePreferences(preferences, selectedMode, Boolean(preferences.sync_sub_accounts));
      }

      showToast(`✨ Dashboard preferences saved for ${selectedMode.toUpperCase()} mode!`);
    } catch (e: any) {
      showToast("❌ Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Default Preset
  const handleResetDefaults = () => {
    let defaultPreset = DEFAULT_PERSONAL_DASHBOARD_PREFS;
    if (selectedMode === "professional") defaultPreset = DEFAULT_PROFESSIONAL_DASHBOARD_PREFS;
    if (selectedMode === "subaccount") defaultPreset = DEFAULT_SUBACCOUNT_DASHBOARD_PREFS;

    setPreferences(defaultPreset);
    showToast(`🔄 Reset to standard ${selectedMode} default layout.`);
  };

  // Available services for Continue logic
  const continueAvailableServices = [
    { id: "mood", label: "Mood & Recovery Journal", icon: "😊", subTab: "mood" },
    { id: "habit", label: "Habit & Routine Engine", icon: "📈", subTab: "habit" },
    { id: "finance", label: "Finance & Cash Flow", icon: "💰", subTab: "finance" },
    { id: "inventory", label: "Retail POS & Inventory", icon: "📦", subTab: "inventory" },
    { id: "water", label: "Hydration Tracker", icon: "💧", subTab: "water" },
    { id: "medicine", label: "Medicine & Dosage", icon: "💊", subTab: "medicine" },
    { id: "yoga", label: "Yoga & Mindfulness", icon: "🧘", subTab: "yoga" },
    { id: "vitals", label: "Health Vitals & SpO2", icon: "🩺", subTab: "vitals" },
    { id: "elderly", label: "Elderly & Senior Care", icon: "👴", subTab: "elderly" },
    { id: "vehicles", label: "Vehicles & Mileage", icon: "🚗", subTab: "vehicles" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER: Pastel Peach Dashboard Customizer Shell */}
      {/* ========================================================================= */}
      <div className="bg-[#FFF9F5] dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-slate-800 border border-orange-200 dark:border-slate-700 flex items-center justify-center text-2xl text-orange-600 shadow-2xs">
              <Sliders className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-300 text-[11px] font-black rounded-full border border-orange-300 dark:border-orange-800 shadow-2xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>INTELLIGENT LIFE OS ENGINE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Home & Dashboard Customization
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-orange-600 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all hover:scale-105"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            {onPreviewHome && (
              <button
                type="button"
                onClick={onPreviewHome}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer transition-all hover:scale-105"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Home</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
          Configure the exact data feeds and services that populate your Command Center. Choose between Personal, Professional, or Sub-Account profiles to dynamically tailor your daily workflow.
        </p>

        {/* PROFILE MODE LENS SWITCHER */}
        <div className="pt-2">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
            Viewing Profile Lens:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMode("personal")}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedMode === "personal"
                  ? "bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-orange-200/70 dark:border-slate-700 hover:bg-orange-50"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                selectedMode === "personal" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black">Personal Mode</div>
                <div className={`text-[10px] font-medium truncate ${
                  selectedMode === "personal" ? "text-orange-100" : "text-slate-400"
                }`}>
                  Health, habits & daily wellness
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode("professional")}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedMode === "professional"
                  ? "bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-orange-200/70 dark:border-slate-700 hover:bg-orange-50"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                selectedMode === "professional" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
              }`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black">Professional Mode</div>
                <div className={`text-[10px] font-medium truncate ${
                  selectedMode === "professional" ? "text-orange-100" : "text-slate-400"
                }`}>
                  Finance, staff HR & inventory
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode("subaccount")}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedMode === "subaccount"
                  ? "bg-orange-600 text-white border-orange-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-orange-200/70 dark:border-slate-700 hover:bg-orange-50"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                selectedMode === "subaccount" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black">Sub-Accounts & Family</div>
                <div className={`text-[10px] font-medium truncate ${
                  selectedMode === "subaccount" ? "text-orange-100" : "text-slate-400"
                }`}>
                  Dependents, kids & employees
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: "What needs my attention today?" (The Toggle Matrix) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-orange-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 text-sm font-black">
              A
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Section A: "What needs my attention today?"
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Select which alert cards and pending items are eligible to render in Today's Attention.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Matrix of Toggle Rows */}
        <div className="space-y-2.5">
          {/* 1. Medicine Reminders */}
          <div className="p-3.5 bg-[#FFFDFB] dark:bg-slate-800/60 border border-orange-100/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 border border-rose-200/60 dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                💊
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Medicine & Prescription Reminders
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Show upcoming dosage schedules, timing alerts & refill statuses.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.today_attention_filters.medicine}
                onChange={() => toggleTodayFilter("medicine")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>

          {/* 2. Daily Challenges & Quests */}
          <div className="p-3.5 bg-[#FFFDFB] dark:bg-slate-800/60 border border-orange-100/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 border border-amber-200/60 dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                🏆
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  21-Day Daily Challenges & Quests
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Scratch daily streak cards, maintain momentum & complete penalty resets.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.today_attention_filters.challenges}
                onChange={() => toggleTodayFilter("challenges")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>

          {/* 3. Water & Sleep Habits */}
          <div className="p-3.5 bg-[#FFFDFB] dark:bg-slate-800/60 border border-orange-100/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 border border-blue-200/60 dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                💧
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Hydration & Habit Targets
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Show progress bar for daily 2.5L water intake and routine checks.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.today_attention_filters.water_habits}
                onChange={() => toggleTodayFilter("water_habits")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>

          {/* 4. Upcoming Bill Payments */}
          <div className="p-3.5 bg-[#FFFDFB] dark:bg-slate-800/60 border border-orange-100/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 border border-emerald-200/60 dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                💳
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Upcoming Bill Payments & Invoices
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Alert when recurring utilities, rent, or supplier invoices are due today.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.today_attention_filters.finance_bills}
                onChange={() => toggleTodayFilter("finance_bills")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>

          {/* 5. Calendar Events */}
          <div className="p-3.5 bg-[#FFFDFB] dark:bg-slate-800/60 border border-orange-100/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-600 border border-purple-200/60 dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                📅
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Calendar Events & Milestones
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Show today's festival holidays, family birthdays & life date countdowns.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.today_attention_filters.calendar_events}
                onChange={() => toggleTodayFilter("calendar_events")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>

          {/* 6. Staff Pending Approvals (Professional mode focus) */}
          <div className="p-3.5 bg-[#FFFDFB] dark:bg-slate-800/60 border border-orange-100/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-between gap-3 hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 border border-indigo-200/60 dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                💼
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Staff Tasks & Timesheet Approvals</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full">
                    Pro Role
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Show pending staff payroll timesheets, attendance audits & stock low-limit alerts.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.today_attention_filters.staff_pending_tasks}
                onChange={() => toggleTodayFilter("staff_pending_tasks")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: "What was I doing?" (Continue Settings) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-orange-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 text-sm font-black">
              B
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Section B: "What was I doing?" (Continue Settings)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Define which tools the Home screen scans for unfinished actions and resume logs.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Selector Grid */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-800 dark:text-slate-200">
            Select Services Permitted in "Continue":
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {continueAvailableServices.map((svc) => {
              const isSelected = preferences.continue_resume_logic.enabled_services.includes(svc.id);
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => toggleContinueService(svc.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-950 dark:text-orange-200 font-black shadow-2xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{svc.icon}</span>
                    <span className="text-xs truncate">{svc.label}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-orange-600 text-white" : "border border-slate-300 dark:border-slate-600"
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Max Items Selector */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Max Resume Cards to Display:
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Keep to 2 for a clean minimalist card, or up to 4 for dense view.
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {[2, 3, 4].map((count) => {
                const isCurrent = preferences.continue_resume_logic.max_items === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        continue_resume_logic: {
                          ...prev.continue_resume_logic,
                          max_items: count
                        }
                      }))
                    }
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "bg-orange-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION C: "What do I commonly use?" (Pinned Services) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-orange-100/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 text-sm font-black">
              C
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Section C: "What do I commonly use?" (Pinned Services)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pin up to 6 priority tools to the circular icon row on your Home Command Center.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-orange-50 dark:bg-slate-800 text-orange-800 dark:text-orange-300 text-xs font-black rounded-xl border border-orange-200/80">
            {preferences.pinned_services.custom_list.length} / 6 Pinned
          </span>
        </div>

        {/* Interactive Service Catalog Selector */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {ALL_SERVICES_CATALOG.map((item) => {
              const isPinned = preferences.pinned_services.custom_list.includes(item.subTabTarget);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePinnedService(item.subTabTarget)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                    isPinned
                      ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-950 dark:text-orange-200 font-black shadow-xs ring-1 ring-orange-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl">{item.icon}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      isPinned ? "bg-orange-600 text-white" : "border border-slate-300 dark:border-slate-600 text-transparent"
                    }`}>
                      ✓
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-black truncate">{item.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.categoryLabel}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auto Update Fallback Toggle */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Auto-Adaptive High Usage Promotion
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Allow AI to automatically suggest and substitute unused pinned items with frequently accessed services.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.pinned_services.auto_update ?? true}
                onChange={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    pinned_services: {
                      ...prev.pinned_services,
                      auto_update: !(prev.pinned_services.auto_update ?? true)
                    }
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION D: Sub-Account & Role Permissions (The "Lens" for others) */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border-2 border-orange-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-orange-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-orange-600 text-sm font-black">
              D
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Section D: Sub-Account & Role Synchronization
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Control whether changes made here automatically propagate to your family & staff sub-accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Sync Sub-Accounts Toggle Box */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-orange-200 dark:border-slate-700 flex items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1 min-w-0">
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Sync preferences with my Family & Staff Sub-Accounts</span>
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-slate-700 text-orange-800 dark:text-orange-300 text-[10px] font-black rounded-full">
                Multi-User
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              When turned ON, saving will automatically update the dashboard display preferences for all linked sub-accounts and dependents ({patients.length > 0 ? `${patients.length} active profiles` : "all dependents"}). If turned OFF, sub-accounts maintain their own independent layouts.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={preferences.sync_sub_accounts ?? false}
              onChange={() =>
                setPreferences((prev) => ({
                  ...prev,
                  sync_sub_accounts: !prev.sync_sub_accounts
                }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
          </label>
        </div>

        {/* Challenge Button Visibility Toggle */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-orange-200 dark:border-slate-700 flex items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1 min-w-0">
            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              Show Gamification & Streak Banner on Home
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Enable or disable the 21-Day Habit Challenge banner on this profile's command center.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={preferences.challenge_visibility.show_challenge_button}
              onChange={() =>
                setPreferences((prev) => ({
                  ...prev,
                  challenge_visibility: {
                    ...prev.challenge_visibility,
                    show_challenge_button: !prev.challenge_visibility.show_challenge_button
                  }
                }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
          </label>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING ACTION BAR: Save Changes */}
      {/* ========================================================================= */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          💡 Preferences are immediately stored and synced across all devices.
        </div>

        <div className="flex items-center gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs hover:bg-slate-50 cursor-pointer shadow-xs transition-all"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md cursor-pointer transition-all hover:scale-105 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save {selectedMode.toUpperCase()} Layout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
