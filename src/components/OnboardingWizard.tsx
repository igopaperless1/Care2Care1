import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Building,
  Users,
  Heart,
  Briefcase,
  Store,
  User,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  Wallet,
  Pill,
  Droplets,
  Search
} from "lucide-react";
import { AppState } from "../types";
import { ALL_SERVICE_MODULES, ServiceModuleDef } from "../utils/ServiceFactory";

interface OnboardingWizardProps {
  appState: AppState;
  onUpdateAppState: (updater: (prev: AppState) => AppState) => void;
  onCompleteOnboarding: () => void;
  isModalMode?: boolean; // When opened from "+" Floating button or Settings
  onCloseModal?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  appState,
  onUpdateAppState,
  onCompleteOnboarding,
  isModalMode = false,
  onCloseModal
}) => {
  const [step, setStep] = useState<number>(isModalMode ? 2 : appState.onboardingStep || 0);
  const [motivation, setMotivation] = useState<string>(appState.primaryMotivation || "personal");
  const [roles, setRoles] = useState<string[]>(appState.selectedRoles.length > 0 ? appState.selectedRoles : ["Single Adult"]);
  const [selectedModules, setSelectedModules] = useState<string[]>(
    appState.activeModules.length > 0
      ? appState.activeModules
      : Object.values(ALL_SERVICE_MODULES)
          .filter((m) => m.defaultActive)
          .map((m) => m.id)
  );

  // Category filter for step 2/3
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Essentials form state
  const [startingBalance, setStartingBalance] = useState<string>(
    appState.essentialsData?.startingBalance ? String(appState.essentialsData.startingBalance) : ""
  );
  const [monthlyBudget, setMonthlyBudget] = useState<string>(
    appState.essentialsData?.monthlyBudget ? String(appState.essentialsData.monthlyBudget) : ""
  );
  const [firstMedicineName, setFirstMedicineName] = useState<string>(
    appState.essentialsData?.firstMedicineName || ""
  );
  const [firstMedicineDosage, setFirstMedicineDosage] = useState<string>(
    appState.essentialsData?.firstMedicineDosage || ""
  );
  const [waterGoal, setWaterGoal] = useState<string>(
    appState.essentialsData?.waterGoalMl ? String(appState.essentialsData.waterGoalMl) : "2500"
  );
  const [staffCount, setStaffCount] = useState<string>(
    appState.essentialsData?.staffCount ? String(appState.essentialsData.staffCount) : ""
  );

  // Save changes instantly to global AppState
  const saveModules = (modules: string[]) => {
    setSelectedModules(modules);
    onUpdateAppState((prev) => ({
      ...prev,
      activeModules: modules,
      onboardingStep: step
    }));
  };

  const toggleModule = (modId: string) => {
    const updated = selectedModules.includes(modId)
      ? selectedModules.filter((id) => id !== modId)
      : [...selectedModules, modId];
    saveModules(updated);
  };

  const toggleRole = (role: string) => {
    const updated = roles.includes(role)
      ? roles.filter((r) => r !== role)
      : [...roles, role];
    setRoles(updated);
    onUpdateAppState((prev) => ({
      ...prev,
      selectedRoles: updated
    }));

    // Auto add suggested modules based on role
    let recommended = [...selectedModules];
    if (role === "Parent" && !recommended.includes("kids_care")) recommended.push("kids_care");
    if (role === "Caregiver" && !recommended.includes("elderly_care")) recommended.push("elderly_care");
    if ((role === "Retailer / Shop Owner" || role === "Employer") && !recommended.includes("inventory")) {
      recommended.push("inventory", "staff_payroll", "finance_budget");
    }
    saveModules(Array.from(new Set(recommended)));
  };

  const handleMotivationSelect = (mot: string) => {
    setMotivation(mot);
    onUpdateAppState((prev) => ({
      ...prev,
      primaryMotivation: mot
    }));

    // Preset active modules based on motivation
    let presets = ["health_vitals", "medicine", "water", "steps_exercise", "sos_emergency"];
    if (mot === "business") {
      presets.push("finance_budget", "inventory", "staff_payroll", "ticket_queue");
    } else if (mot === "family") {
      presets.push("elderly_care", "kids_care", "pets", "family_tree");
    } else {
      presets.push("mood_habits", "finance_budget", "sleep");
    }
    saveModules(Array.from(new Set(presets)));
    setStep(1);
  };

  const handleComplete = () => {
    const essentials = {
      startingBalance: startingBalance ? parseFloat(startingBalance) : undefined,
      monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : undefined,
      firstMedicineName: firstMedicineName || undefined,
      firstMedicineDosage: firstMedicineDosage || undefined,
      waterGoalMl: waterGoal ? parseInt(waterGoal) : 2500,
      staffCount: staffCount ? parseInt(staffCount) : undefined
    };

    onUpdateAppState((prev) => ({
      ...prev,
      onboardingStep: 4,
      isOnboardingComplete: true,
      activeModules: selectedModules.length > 0 ? selectedModules : ["health_vitals", "medicine", "water"],
      selectedRoles: roles,
      primaryMotivation: motivation,
      essentialsData: essentials
    }));

    onCompleteOnboarding();
    if (onCloseModal) onCloseModal();
  };

  const availableModulesList = Object.values(ALL_SERVICE_MODULES).filter((mod) => {
    const matchesCat = categoryFilter === "all" || mod.category === categoryFilter;
    const matchesSearch =
      mod.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`w-full max-w-4xl mx-auto ${isModalMode ? "p-2" : "p-4 sm:p-6"}`}>
      {/* Step Indicator Header */}
      {!isModalMode && (
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-sm shadow-sm">
              {step + 1}
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Step {step + 1} of 4 • Smart Setup
              </span>
              <h2 className="text-base font-black text-slate-900">
                {step === 0 && "Welcome & Motivation"}
                {step === 1 && "Choose Your Context & Roles"}
                {step === 2 && "Select Active Life Modules"}
                {step === 3 && "Quick Essentials Setup"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`w-8 h-2 rounded-full transition-all ${
                  s === step ? "bg-[#2E7D32] w-12" : s < step ? "bg-emerald-300" : "bg-slate-200"
                }`}
                title={`Go to Step ${s + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 0: WELCOME & LANGUAGE SELECTION */}
      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Multi-Language Selector Cards */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Language Selection / भाषा चयन
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Choose Your App Language</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              {[
                { code: "en", label: "English", flag: "🇬🇧", name: "English" },
                { code: "np", label: "नेपाली", flag: "🇳🇵", name: "Nepali" },
                { code: "bn", label: "বাংলা", flag: "🇧🇩", name: "Bangla" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    localStorage.setItem("care2care_lang", lang.code);
                    window.dispatchEvent(new CustomEvent("care2care_lang_change", { detail: lang.code }));
                  }}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group hover:scale-105"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{lang.label}</span>
                  <span className="text-[9px] text-slate-400 font-bold">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personalized Life OS Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              What brings you here today?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Care2Care adapts dynamically to your lifestyle. Pick your primary goal to streamline your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Card 1: Personal Life */}
            <button
              type="button"
              onClick={() => handleMotivationSelect("personal")}
              className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-56 ${
                motivation === "personal"
                  ? "border-[#2E7D32] bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center text-2xl mb-3 shadow-inner">
                  🧘
                </div>
                <h3 className="font-black text-slate-900 text-base mb-1">Get Life Organized</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Track daily hydration, medications, step counts, workouts, mood habits and personal vitals.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-emerald-700">Personal & Wellness</span>
                <ArrowRight className="w-4 h-4 text-[#2E7D32]" />
              </div>
            </button>

            {/* Card 2: Small Business */}
            <button
              type="button"
              onClick={() => handleMotivationSelect("business")}
              className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-56 ${
                motivation === "business"
                  ? "border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  💼
                </div>
                <h3 className="font-black text-slate-900 text-base mb-1">Manage Business & Store</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Manage product inventory, daily cash flow ledger, staff payroll, contracts and client queue tokens.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-blue-700">Business & Operations</span>
                <ArrowRight className="w-4 h-4 text-blue-700" />
              </div>
            </button>

            {/* Card 3: Family & Care */}
            <button
              type="button"
              onClick={() => handleMotivationSelect("family")}
              className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-56 ${
                motivation === "family"
                  ? "border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  👨‍👩‍👧
                </div>
                <h3 className="font-black text-slate-900 text-base mb-1">Take Care of Family</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Monitor senior parent care, pediatric logs, pets, property, family lineage and emergency SOS alerts.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-amber-700">Family & Household Care</span>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </div>
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>Next: Choose Your Roles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 1: CHOOSE YOUR ROLES */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Select Your Daily Roles</h2>
            <p className="text-xs text-slate-600 font-medium">
              You can pick multiple roles. This enables tailored sub-accounts and default module recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { role: "Single Adult", icon: "🚶", desc: "Personal health, budget & habits" },
              { role: "Parent", icon: "👶", desc: "Kids care, growth & school records" },
              { role: "Caregiver", icon: "👴", desc: "Elderly vitals, meds & proxy care" },
              { role: "Retailer / Shop Owner", icon: "🏪", desc: "Inventory, sales ledger & queue" },
              { role: "Employer / Business Owner", icon: "💼", desc: "Staff attendance, salary & contracts" },
              { role: "Employee / Worker", icon: "🛠️", desc: "Timesheets, salary proof & tasks" }
            ].map((item) => {
              const isSelected = roles.includes(item.role);
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => toggleRole(item.role)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#2E7D32] bg-emerald-50/80 shadow-sm ring-1 ring-emerald-500/30"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? "bg-[#2E7D32] text-white" : "border border-slate-300 bg-slate-100"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs mb-0.5">{item.role}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>Next: Select Modules ({selectedModules.length} Active)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: MODULE SELECTION ("TAKE IT OR LEAVE IT") */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Select Your Active Modules</h2>
              <p className="text-xs text-slate-500 font-medium">
                Toggle ON what you care about today. Unselected services stay hidden in your background Module Store.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {selectedModules.length} Modules Active
              </span>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search modules (e.g., Medicine, Finance, Inventory)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {[
                { id: "all", label: "All" },
                { id: "personal", label: "Personal" },
                { id: "business", label: "Business" },
                { id: "family", label: "Family" },
                { id: "assets", label: "Assets" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {availableModulesList.map((mod) => {
              const isActive = selectedModules.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isActive
                      ? "border-[#2E7D32] bg-emerald-50/70 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-slate-100 flex-shrink-0">
                      {mod.emojiIcon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-900 text-xs truncate">{mod.label}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug font-medium mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModule(mod.id);
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer flex-shrink-0 ${
                      isActive ? "bg-[#2E7D32]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {!isModalMode && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => {
                  if (isModalMode) {
                    if (onCloseModal) onCloseModal();
                  } else {
                    setStep(3);
                  }
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Skip for Later
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isModalMode) {
                    if (onCloseModal) onCloseModal();
                  } else {
                    setStep(3);
                  }
                }}
                className="px-6 py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: QUICK ESSENTIALS SETUP */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Quick Essentials Setup</h2>
            <p className="text-xs text-slate-600 font-medium">
              Optional setup fields based on your selected active modules. All fields are optional and can be updated anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* If Finance is active */}
            {selectedModules.includes("finance_budget") && (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-black text-xs">
                  <Wallet className="w-4 h-4 text-blue-700" />
                  <span>Finance & Budget Essentials</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 block mb-1">Starting Balance</label>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={startingBalance}
                      onChange={(e) => setStartingBalance(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 block mb-1">Monthly Budget Cap</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If Medicine is active */}
            {selectedModules.includes("medicine") && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                  <Pill className="w-4 h-4 text-[#2E7D32]" />
                  <span>Medicine Reminder Setup</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 block mb-1">First Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amlodipine"
                      value={firstMedicineName}
                      onChange={(e) => setFirstMedicineName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-700 block mb-1">Dosage / Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 5mg 08:00 AM"
                      value={firstMedicineDosage}
                      onChange={(e) => setFirstMedicineDosage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If Water is active */}
            {selectedModules.includes("water") && (
              <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-200 space-y-3">
                <div className="flex items-center gap-2 text-cyan-900 font-black text-xs">
                  <Droplets className="w-4 h-4 text-cyan-700" />
                  <span>Daily Hydration Goal</span>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 block mb-1">Target Water Goal (ml)</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={waterGoal}
                    onChange={(e) => setWaterGoal(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* If Staff Payroll is active */}
            {selectedModules.includes("staff_payroll") && (
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-black text-xs">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>Staff & Team Size</span>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-700 block mb-1">Estimated Employee / Staff Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={staffCount}
                    onChange={(e) => setStaffCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">Your Care2Care OS is Ready!</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedModules.length} active modules configured for your personal dashboard.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-3 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
