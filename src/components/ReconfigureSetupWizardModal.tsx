import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sliders,
  User,
  HeartPulse,
  Pill,
  Droplets,
  Wallet,
  Car,
  QrCode,
  Leaf,
  Dumbbell,
  FileText,
  Zap,
  AlertCircle,
  Clock,
  Layers,
  Settings,
  ShieldCheck,
  Globe,
  RotateCcw,
  Check,
  CreditCard,
  Building2,
  DollarSign,
  Award,
  Lock,
  ExternalLink
} from "lucide-react";
import { ManualPaymentWizardModal } from "./ManualPaymentWizardModal";
import { PaddlePaymentModal } from "./PaddlePaymentModal";

export interface HomeDashboardConfig {
  wizardCompleted: boolean;
  wizardSavedStep: number; // 1 to 6
  selectedRole: "personal" | "caregiver" | "family_manager" | "professional";
  language: "en" | "np" | "bn";
  selectedPlan: "Free" | "Premium" | "Family" | "Enterprise";
  paymentGateway: "esewa" | "khalti" | "fonepay" | "imepay" | "bank" | "paddle";
  sections: {
    commandCenter: boolean;
    forgottenTasks: boolean;
    todaysLog: boolean;
    quickForms: boolean;
  };
  activeServices: {
    vitals: boolean;
    medicine: boolean;
    water: boolean;
    finance: boolean;
    vehicles: boolean;
    vault: boolean;
    garden: boolean;
    habits: boolean;
    careNotes: boolean;
  };
}

export const DEFAULT_HOME_CONFIG: HomeDashboardConfig = {
  wizardCompleted: false,
  wizardSavedStep: 1,
  selectedRole: "personal",
  language: "en",
  selectedPlan: "Family",
  paymentGateway: "esewa",
  sections: {
    commandCenter: true,
    forgottenTasks: true,
    todaysLog: true,
    quickForms: true,
  },
  activeServices: {
    vitals: true,
    medicine: true,
    water: true,
    finance: true,
    vehicles: true,
    vault: true,
    garden: false,
    habits: true,
    careNotes: true,
  },
};

/**
 * Failsafe Normalizer to guarantee NO null/undefined crash when reading config
 */
export const normalizeHomeConfig = (raw: any): HomeDashboardConfig => {
  if (!raw || typeof raw !== "object") return DEFAULT_HOME_CONFIG;
  return {
    wizardCompleted: typeof raw.wizardCompleted === "boolean" ? raw.wizardCompleted : DEFAULT_HOME_CONFIG.wizardCompleted,
    wizardSavedStep: typeof raw.wizardSavedStep === "number" && raw.wizardSavedStep >= 1 ? raw.wizardSavedStep : DEFAULT_HOME_CONFIG.wizardSavedStep,
    selectedRole: raw.selectedRole && ["personal", "caregiver", "family_manager", "professional"].includes(raw.selectedRole) ? raw.selectedRole : DEFAULT_HOME_CONFIG.selectedRole,
    language: raw.language && ["en", "np", "bn"].includes(raw.language) ? raw.language : DEFAULT_HOME_CONFIG.language,
    selectedPlan: raw.selectedPlan && ["Free", "Premium", "Family", "Enterprise"].includes(raw.selectedPlan) ? raw.selectedPlan : DEFAULT_HOME_CONFIG.selectedPlan,
    paymentGateway: raw.paymentGateway && ["esewa", "khalti", "fonepay", "imepay", "bank", "paddle"].includes(raw.paymentGateway) ? raw.paymentGateway : DEFAULT_HOME_CONFIG.paymentGateway,
    sections: {
      ...DEFAULT_HOME_CONFIG.sections,
      ...(raw.sections && typeof raw.sections === "object" ? raw.sections : {}),
    },
    activeServices: {
      ...DEFAULT_HOME_CONFIG.activeServices,
      ...(raw.activeServices && typeof raw.activeServices === "object" ? raw.activeServices : {}),
    },
  };
};

interface ReconfigureSetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HomeDashboardConfig;
  onSaveConfig: (newConfig: HomeDashboardConfig) => void;
  showToast?: (msg: string) => void;
}

export const ReconfigureSetupWizardModal: React.FC<ReconfigureSetupWizardModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  showToast,
}) => {
  const normalizedInit = normalizeHomeConfig(config);
  const [localConfig, setLocalConfig] = useState<HomeDashboardConfig>(normalizedInit);
  const [currentStep, setCurrentStep] = useState<number>(normalizedInit.wizardSavedStep || 1);

  // Sub-Payment Modal Controls
  const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
  const [isPaddleModalOpen, setIsPaddleModalOpen] = useState(false);

  useEffect(() => {
    const norm = normalizeHomeConfig(config);
    setLocalConfig(norm);
    setCurrentStep(norm.wizardSavedStep || 1);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const saveProgressStep = (stepNum: number, updatedConfig?: HomeDashboardConfig) => {
    const cfg = updatedConfig || localConfig;
    const newCfg: HomeDashboardConfig = {
      ...cfg,
      wizardSavedStep: stepNum,
    };
    setLocalConfig(newCfg);
    setCurrentStep(stepNum);
    
    // Save to localStorage immediately so returning later resumes from this exact step!
    try {
      localStorage.setItem("care2care_home_dashboard_config", JSON.stringify(newCfg));
    } catch (e) {
      console.error("Failed saving wizard step progress:", e);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      const nextStep = currentStep + 1;
      saveProgressStep(nextStep);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      saveProgressStep(prevStep);
    }
  };

  const handleFinishAndApply = () => {
    const finalizedConfig: HomeDashboardConfig = {
      ...localConfig,
      wizardCompleted: true,
      wizardSavedStep: 6,
    };
    onSaveConfig(finalizedConfig);
    if (showToast) {
      showToast("🎉 Setup wizard saved! Home screen dynamically updated.");
    }
    onClose();
  };

  const handleRestartWizard = () => {
    saveProgressStep(1);
    if (showToast) {
      showToast("🔄 Setup wizard restarted from Step 1.");
    }
  };

  const toggleSection = (key: keyof HomeDashboardConfig["sections"]) => {
    const updated: HomeDashboardConfig = {
      ...localConfig,
      sections: {
        ...localConfig.sections,
        [key]: !localConfig.sections[key],
      },
    };
    setLocalConfig(updated);
    saveProgressStep(currentStep, updated);
  };

  const toggleService = (key: keyof HomeDashboardConfig["activeServices"]) => {
    const updated: HomeDashboardConfig = {
      ...localConfig,
      activeServices: {
        ...localConfig.activeServices,
        [key]: !localConfig.activeServices[key],
      },
    };
    setLocalConfig(updated);
    saveProgressStep(currentStep, updated);
  };

  const setRole = (role: HomeDashboardConfig["selectedRole"]) => {
    const updated: HomeDashboardConfig = { ...localConfig, selectedRole: role };
    setLocalConfig(updated);
    saveProgressStep(currentStep, updated);
  };

  const setLang = (lang: HomeDashboardConfig["language"]) => {
    const updated: HomeDashboardConfig = { ...localConfig, language: lang };
    setLocalConfig(updated);
    localStorage.setItem("care2care_lang", lang);
    window.dispatchEvent(new CustomEvent("care2care_lang_change", { detail: lang }));
    saveProgressStep(currentStep, updated);
  };

  const setPlan = (plan: HomeDashboardConfig["selectedPlan"]) => {
    const updated: HomeDashboardConfig = { ...localConfig, selectedPlan: plan };
    setLocalConfig(updated);
    saveProgressStep(currentStep, updated);
  };

  const setPaymentGateway = (gateway: HomeDashboardConfig["paymentGateway"]) => {
    const updated: HomeDashboardConfig = { ...localConfig, paymentGateway: gateway };
    setLocalConfig(updated);
    saveProgressStep(currentStep, updated);
  };

  const rolesList = [
    {
      id: "personal",
      title: "Personal Life & Health",
      desc: "Tailored for individuals managing personal health, daily habits & expenses",
      icon: "👤",
    },
    {
      id: "caregiver",
      title: "Caregiver & Family Nurse",
      desc: "Optimized for tracking medications, vitals & care notes for family members",
      icon: "🩺",
    },
    {
      id: "family_manager",
      title: "Family Lead & Household Manager",
      desc: "Focused on multi-profile coordination, bills, vehicles & property assets",
      icon: "🏡",
    },
    {
      id: "professional",
      title: "Fleet & Asset Supervisor",
      desc: "Geared towards vehicle mileage, vault documents, inventory & cash ledgers",
      icon: "💼",
    },
  ];

  const sectionsList = [
    {
      id: "commandCenter" as const,
      title: "Config-Driven Command Center",
      desc: "Top bar with greeting, role switcher, quick stats & reconfigure shortcut",
      icon: Layers,
      badge: "Header Control",
    },
    {
      id: "forgottenTasks" as const,
      title: "Forgotten Tasks & Overdue Reminders",
      desc: "Priority banner showing missed medications, hydration gaps & overdue checks",
      icon: AlertCircle,
      badge: "Overdue Alert",
    },
    {
      id: "todaysLog" as const,
      title: "Today's Log & Service Activity Ledger",
      desc: "Real-time timeline and active cards for your selected services",
      icon: Clock,
      badge: "Core Activity",
    },
    {
      id: "quickForms" as const,
      title: "Quick Forms & Frequently Used Actions",
      desc: "1-tap quick logging shortcuts and favorite service cards",
      icon: Zap,
      badge: "Quick Shortcuts",
    },
  ];

  const servicesList = [
    { id: "vitals" as const, label: "Health Vitals & Heart Rate", icon: HeartPulse, color: "text-rose-600 bg-rose-50" },
    { id: "medicine" as const, label: "Medication & Pill Checklist", icon: Pill, color: "text-emerald-700 bg-emerald-50" },
    { id: "water" as const, label: "Hydration & Water Target", icon: Droplets, color: "text-blue-600 bg-blue-50" },
    { id: "finance" as const, label: "Financial Cash Flow & Budget", icon: Wallet, color: "text-emerald-800 bg-emerald-50" },
    { id: "vehicles" as const, label: "Fleet & Vehicle Maintenance", icon: Car, color: "text-amber-700 bg-amber-50" },
    { id: "vault" as const, label: "Digital Vault & Visiting QR", icon: QrCode, color: "text-indigo-700 bg-indigo-50" },
    { id: "garden" as const, label: "Garden, Crop & Land Assets", icon: Leaf, color: "text-emerald-600 bg-emerald-50" },
    { id: "habits" as const, label: "Habits & Routine Checklist", icon: Dumbbell, color: "text-purple-600 bg-purple-50" },
    { id: "careNotes" as const, label: "Caregiver Notes & Logs", icon: FileText, color: "text-slate-700 bg-slate-100" },
  ];

  const planTiers = [
    { id: "Free" as const, name: "Free Tier", price: "Rs. 0 / mo", desc: "Basic single profile tracking", tag: "Basic" },
    { id: "Premium" as const, name: "Pro Individual", price: "Rs. 499 / mo", desc: "Full health vitals & vehicle logs", tag: "Popular" },
    { id: "Family" as const, name: "Family Care Plus", price: "Rs. 1,299 / mo", desc: "Multi-profile subaccounts & QR cards", tag: "Recommended" },
    { id: "Enterprise" as const, name: "Enterprise Fleet", price: "Rs. 3,499 / mo", desc: "Unlimited fleet, staff & cash ledger", tag: "Ultimate" },
  ];

  const gatewaysList = [
    { id: "esewa" as const, name: "eSewa Direct QR", flag: "🇳🇵", desc: "Instant mobile wallet scan" },
    { id: "khalti" as const, name: "Khalti Wallet", flag: "🇳🇵", desc: "Instant PIN & OTP pay" },
    { id: "fonepay" as const, name: "FonePay / Bank QR", flag: "🇳🇵", desc: "Inter-bank mobile QR" },
    { id: "imepay" as const, name: "IME Pay", flag: "🇳🇵", desc: "IME mobile wallet" },
    { id: "bank" as const, name: "Swift / Direct Deposit", flag: "🏦", desc: "Upload bank deposit receipt" },
    { id: "paddle" as const, name: "Credit Card / Paddle", flag: "💳", desc: "Visa, MasterCard & Global Cards" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Wizard Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight">
                    Reconfigure Setup Wizard
                  </h2>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black rounded-full uppercase">
                    Step {currentStep} of 6
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {currentStep === 1 && "Select your primary role & usage archetype"}
                  {currentStep === 2 && "Choose your preferred interface language"}
                  {currentStep === 3 && "Select which major sections to show on Home Screen"}
                  {currentStep === 4 && "Choose active services to render inside Today's Log"}
                  {currentStep === 5 && "Select plan & configure local QR payment gateway"}
                  {currentStep === 6 && "Review & launch your updated Home Screen layout"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleRestartWizard}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                  title="Restart Wizard from Step 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Wizard Progress Stepper (Steps 1 to 6) */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between overflow-x-auto gap-1">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => saveProgressStep(s)}
                className={`flex items-center gap-1 text-[11px] font-black transition-all cursor-pointer shrink-0 ${
                  s === currentStep
                    ? "text-emerald-700 dark:text-emerald-400 font-black"
                    : s < currentStep
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                    s === currentStep
                      ? "bg-emerald-600 text-white shadow-xs"
                      : s < currentStep
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {s < currentStep ? <Check className="w-3 h-3" /> : s}
                </span>
                <span className="hidden md:inline">
                  {s === 1 && "Role"}
                  {s === 2 && "Language"}
                  {s === 3 && "Sections"}
                  {s === 4 && "Services"}
                  {s === 5 && "Payment"}
                  {s === 6 && "Review"}
                </span>
              </button>
            ))}
          </div>

          {/* Wizard Step Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* STEP 1: ROLE SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Step 1: Choose Your Primary Role
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    This tailors your default command center actions and dashboard priorities.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rolesList.map((r) => {
                    const isSelected = localConfig.selectedRole === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setRole(r.id as any)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                            {r.icon}
                          </span>
                          {isSelected && (
                            <span className="p-1 bg-emerald-600 text-white rounded-full">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-xs">{r.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-snug">
                            {r.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: LANGUAGE SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Step 2: Choose Interface Language
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Select your preferred language for dashboard UI and text descriptions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { code: "en", name: "English", native: "English", flag: "🇬🇧" },
                    { code: "np", name: "Nepali", native: "नेपाली", flag: "🇳🇵" },
                    { code: "bn", name: "Bangla", native: "বাংলা", flag: "🇧🇩" },
                  ].map((lang) => {
                    const isSelected = localConfig.language === lang.code;
                    return (
                      <div
                        key={lang.code}
                        onClick={() => setLang(lang.code as any)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-3xl">{lang.flag}</span>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-xs">{lang.native}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{lang.name}</div>
                        </div>
                        {isSelected && (
                          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full">
                            Active Language
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: HOME SECTIONS SELECTION */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Step 3: Select Home Screen Major Sections
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Toggle which major structural sections you want to display on your Home screen.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {sectionsList.map((sec) => {
                    const isChecked = localConfig.sections[sec.id];
                    const IconComp = sec.icon;
                    return (
                      <div
                        key={sec.id}
                        onClick={() => toggleSection(sec.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl border shrink-0 ${
                              isChecked
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-500 border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 dark:text-white text-xs">
                                {sec.title}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-black rounded-md">
                                {sec.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                              {sec.desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-400 bg-white dark:bg-slate-900"
                            }`}
                          >
                            {isChecked && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: SERVICES SELECTION */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Step 4: Select Active Services to Include
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Choose which services you want rendered inside Today's Log & Quick Forms on Home.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {servicesList.map((srv) => {
                    const isChecked = localConfig.activeServices[srv.id];
                    const IconComp = srv.icon;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isChecked
                            ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`p-2 rounded-xl border shrink-0 ${srv.color}`}>
                            <IconComp className="w-4 h-4" />
                          </span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                            {srv.label}
                          </span>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                            isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-400 bg-white dark:bg-slate-900"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT & PLAN SETUP */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Step 5: Select Plan & QR Payment Gateway
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Configure your subscription tier and linked payment method for system verification.
                  </p>
                </div>

                {/* Plan Tier Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {planTiers.map((p) => {
                    const isSelected = localConfig.selectedPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col justify-between ${
                          isSelected
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-300 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 inline-block mb-1">
                            {p.tag}
                          </span>
                          <h4 className="font-black text-xs text-slate-900 dark:text-white">{p.name}</h4>
                          <div className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                            {p.price}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="mt-2 text-[10px] font-black text-emerald-700 flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> Selected
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Payment Gateway Selection */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Preferred Payment Method:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {gatewaysList.map((gw) => {
                      const isSelected = localConfig.paymentGateway === gw.id;
                      return (
                        <div
                          key={gw.id}
                          onClick={() => setPaymentGateway(gw.id as any)}
                          className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600"
                              : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg">{gw.flag}</span>
                            <div className="truncate">
                              <div className="text-xs font-black text-slate-900 dark:text-white truncate">{gw.name}</div>
                              <div className="text-[9px] text-slate-400 font-bold truncate">{gw.desc}</div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action to Launch Direct Payment Verification Wizard */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-black text-xs text-white">Manual & QR Payment Verification Wizard</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">
                      Scan Bank QR code, copy SWIFT details, or upload transfer receipt to verify account instantly.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsManualPaymentModalOpen(true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Open Payment QR Wizard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPaddleModalOpen(true)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-xl border border-slate-700 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & FINAL APPLY */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Step 6: Setup Summary & Final Confirmation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Review your selected configuration before applying it to your Home screen.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Primary Role:</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 capitalize">
                      {localConfig.selectedRole.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Interface Language:</span>
                    <span className="font-black text-slate-900 dark:text-white uppercase">
                      {localConfig.language === "en" && "🇬🇧 English"}
                      {localConfig.language === "np" && "🇳🇵 Nepali (नेपाली)"}
                      {localConfig.language === "bn" && "🇧🇩 Bangla (বাংলা)"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Subscription Tier & Gateway:</span>
                    <span className="font-black text-emerald-800 dark:text-emerald-300">
                      {localConfig.selectedPlan} ({localConfig.paymentGateway.toUpperCase()})
                    </span>
                  </div>

                  <div className="space-y-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400 block">
                      Active Home Sections ({Object.values(localConfig.sections).filter(Boolean).length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {localConfig.sections.commandCenter && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black rounded-md text-[10px]">
                          ⚡ Command Center
                        </span>
                      )}
                      {localConfig.sections.forgottenTasks && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black rounded-md text-[10px]">
                          🚨 Forgotten Tasks
                        </span>
                      )}
                      {localConfig.sections.todaysLog && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-black rounded-md text-[10px]">
                          📊 Today's Log
                        </span>
                      )}
                      {localConfig.sections.quickForms && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-black rounded-md text-[10px]">
                          ⚡ Quick Forms
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-500 dark:text-slate-400 block">
                      Selected Services ({Object.values(localConfig.activeServices).filter(Boolean).length}):
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {Object.entries(localConfig.activeServices)
                        .filter(([_, active]) => active)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-md text-[10px] capitalize"
                          >
                            ✓ {key}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                currentStep === 1
                  ? "opacity-30 cursor-not-allowed text-slate-400"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishAndApply}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save & Launch Redesigned Home</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* MANUAL PAYMENT & QR VERIFICATION WIZARD MODAL */}
      <ManualPaymentWizardModal
        isOpen={isManualPaymentModalOpen}
        onClose={() => setIsManualPaymentModalOpen(false)}
        selectedPlan={localConfig.selectedPlan === "Free" ? "Family" : localConfig.selectedPlan as any}
        planPrice={
          localConfig.selectedPlan === "Premium" ? 499 : localConfig.selectedPlan === "Enterprise" ? 3499 : 1299
        }
        billingCycle="monthly"
        onSuccess={() => {
          if (showToast) showToast("🎉 Payment verification receipt uploaded successfully!");
          setIsManualPaymentModalOpen(false);
        }}
      />

      {/* PADDLE PAYMENT MODAL */}
      <PaddlePaymentModal
        isOpen={isPaddleModalOpen}
        onClose={() => setIsPaddleModalOpen(false)}
        currentPlan={localConfig.selectedPlan}
        onSubscriptionSuccess={(plan) => {
          setPlan(plan as any);
          if (showToast) showToast(`🎉 Upgraded to ${plan} Plan!`);
          setIsPaddleModalOpen(false);
        }}
      />
    </>
  );
};
