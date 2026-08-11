import React, { useState, useEffect } from "react";
import {
  Sliders,
  CheckCircle2,
  Clock,
  Bell,
  HardDrive,
  Cloud,
  Shield,
  Sparkles,
  Droplets,
  Pill,
  DollarSign,
  FileText,
  Home,
  Moon,
  Heart,
  Package,
  Activity,
  Smile,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronRight,
  Zap,
  Lock,
  Volume2,
  Share2,
  Target
} from "lucide-react";

export interface ServicePreference {
  serviceId: string;
  serviceName: string;
  category: string;
  enabled: boolean;
  presetMode: "minimal" | "standard" | "pro" | "custom";
  dailyTarget?: number;
  targetUnit?: string;
  reminderFrequencyMinutes?: number;
  notificationTone?: string;
  requirePhotoProof?: boolean;
  requireBiometricSignature?: boolean;
  autoSyncCloud?: boolean;
  actionOnCompletion?: "notify" | "log_and_reward" | "sound_chime" | "silent";
  actionOnMissed?: "alert_emergency_contact" | "reschedule" | "flag_warning" | "ignore";
  customNotes?: string;
}

const DEFAULT_SERVICE_PREFERENCES: Record<string, ServicePreference> = {
  habit: {
    serviceId: "habit",
    serviceName: "Habit & Goal Tracker",
    category: "Wellness",
    enabled: true,
    presetMode: "standard",
    dailyTarget: 3,
    targetUnit: "habits/day",
    reminderFrequencyMinutes: 120,
    notificationTone: "gentle_bell",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: true,
    actionOnCompletion: "log_and_reward",
    actionOnMissed: "reschedule",
    customNotes: "Daily wellness habit tracker with streak tracking and badge rewards."
  },
  water: {
    serviceId: "water",
    serviceName: "Water Drink Notifier",
    category: "Hydration",
    enabled: true,
    presetMode: "standard",
    dailyTarget: 2500,
    targetUnit: "ml",
    reminderFrequencyMinutes: 60,
    notificationTone: "water_droplet",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: true,
    actionOnCompletion: "sound_chime",
    actionOnMissed: "flag_warning",
    customNotes: "Tracks daily water intake with hourly hydration chimes."
  },
  medicine: {
    serviceId: "medicine",
    serviceName: "Medicine & Prescription Reminder",
    category: "Health",
    enabled: true,
    presetMode: "pro",
    dailyTarget: 2,
    targetUnit: "doses/day",
    reminderFrequencyMinutes: 240,
    notificationTone: "urgent_chime",
    requirePhotoProof: true,
    requireBiometricSignature: false,
    autoSyncCloud: true,
    actionOnCompletion: "log_and_reward",
    actionOnMissed: "alert_emergency_contact",
    customNotes: "Medication adherence log with dosage alerts and refill warnings."
  },
  contract: {
    serviceId: "contract",
    serviceName: "Contract & Legal Deed Management",
    category: "Legal & Deeds",
    enabled: true,
    presetMode: "pro",
    dailyTarget: 1,
    targetUnit: "deeds",
    reminderFrequencyMinutes: 1440,
    notificationTone: "official_beep",
    requirePhotoProof: true,
    requireBiometricSignature: true,
    autoSyncCloud: true,
    actionOnCompletion: "log_and_reward",
    actionOnMissed: "flag_warning",
    customNotes: "Legal agreements with 7-generation detail, witness photo, drawing signature, and left/right thumb prints."
  },
  property: {
    serviceId: "property",
    serviceName: "Property & Land Deed Tracking",
    category: "Legal & Assets",
    enabled: true,
    presetMode: "pro",
    dailyTarget: 1,
    targetUnit: "properties",
    reminderFrequencyMinutes: 43200,
    notificationTone: "gentle_bell",
    requirePhotoProof: true,
    requireBiometricSignature: true,
    autoSyncCloud: true,
    actionOnCompletion: "log_and_reward",
    actionOnMissed: "flag_warning",
    customNotes: "Real estate deeds, tenant leases, and biometric party verification."
  },
  finance: {
    serviceId: "finance",
    serviceName: "Financial Care & Budgeting",
    category: "Finance",
    enabled: true,
    presetMode: "standard",
    dailyTarget: 500,
    targetUnit: "NPR budget limit",
    reminderFrequencyMinutes: 1440,
    notificationTone: "gentle_bell",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: true,
    actionOnCompletion: "notify",
    actionOnMissed: "flag_warning",
    customNotes: "Income and expense logging with daily budget limit alerts."
  },
  sleep: {
    serviceId: "sleep",
    serviceName: "Sleep & Ambient Soundscapes",
    category: "Wellness",
    enabled: true,
    presetMode: "minimal",
    dailyTarget: 8,
    targetUnit: "hours/night",
    reminderFrequencyMinutes: 1440,
    notificationTone: "gentle_bell",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: false,
    actionOnCompletion: "sound_chime",
    actionOnMissed: "ignore",
    customNotes: "Sleep quality tracking with relaxing soundscape generators."
  },
  menstrual: {
    serviceId: "menstrual",
    serviceName: "Menstrual & Ovulation Care",
    category: "Health",
    enabled: true,
    presetMode: "standard",
    dailyTarget: 28,
    targetUnit: "days cycle",
    reminderFrequencyMinutes: 1440,
    notificationTone: "gentle_bell",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: false,
    actionOnCompletion: "notify",
    actionOnMissed: "ignore",
    customNotes: "Cycle predictions, symptom log, and fertility window alerts."
  },
  inventory: {
    serviceId: "inventory",
    serviceName: "Inventory & Home Asset Manager",
    category: "Management",
    enabled: true,
    presetMode: "standard",
    dailyTarget: 10,
    targetUnit: "items tracked",
    reminderFrequencyMinutes: 10080,
    notificationTone: "gentle_bell",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: true,
    actionOnCompletion: "notify",
    actionOnMissed: "ignore",
    customNotes: "Home inventory tracking with warranty and low-stock alerts."
  },
  hybrid_storage: {
    serviceId: "hybrid_storage",
    serviceName: "Hybrid Local & Cloud Storage",
    category: "System",
    enabled: true,
    presetMode: "pro",
    dailyTarget: 100,
    targetUnit: "MB quota",
    reminderFrequencyMinutes: 1440,
    notificationTone: "gentle_bell",
    requirePhotoProof: false,
    requireBiometricSignature: false,
    autoSyncCloud: true,
    actionOnCompletion: "notify",
    actionOnMissed: "reschedule",
    customNotes: "Stores offline records locally or syncs with personal Google Drive."
  }
};

export const MasterServiceOptionChoiceScreen: React.FC = () => {
  const [preferences, setPreferences] = useState<Record<string, ServicePreference>>(() => {
    try {
      const saved = localStorage.getItem("care2care_service_preferences");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SERVICE_PREFERENCES;
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string>("habit");
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Save changes to localStorage
  const handleSavePreferences = (updated: Record<string, ServicePreference>) => {
    setPreferences(updated);
    try {
      localStorage.setItem("care2care_service_preferences", JSON.stringify(updated));
      setSavedSuccessMsg("Service configurations updated & activated successfully!");
      setTimeout(() => setSavedSuccessMsg(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const activePref = preferences[selectedServiceId] || DEFAULT_SERVICE_PREFERENCES.habit;

  const handleUpdateActiveField = <K extends keyof ServicePreference>(field: K, value: ServicePreference[K]) => {
    const updated = {
      ...preferences,
      [selectedServiceId]: {
        ...activePref,
        [field]: value
      }
    };
    handleSavePreferences(updated);
  };

  const serviceCategories = ["all", "Wellness", "Hydration", "Health", "Legal & Deeds", "Finance", "Management", "System"];

  const filteredServices = (Object.values(preferences) as ServicePreference[]).filter(s => {
    if (filterCategory === "all") return true;
    return s.category === filterCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Master Option Choice Hub
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                All Care2Care Services
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Service Operations & Logic Configuration Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Choose what to do in every specific service — customize daily targets, reminder logic, photo requirements, biometric verification, and automated completion actions.
            </p>
          </div>

          <button
            onClick={() => handleSavePreferences(preferences)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4" /> Save & Activate All Logic
          </button>
        </div>

        {savedSuccessMsg && (
          <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {savedSuccessMsg}
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {serviceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              filterCategory === cat
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat === "all" ? "All Services" : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Services Selector + Right Active Service Choice Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SERVICE CARDS SELECTION (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">
            Select Service to Configure ({filteredServices.length})
          </h3>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredServices.map((service) => {
              const isSelected = service.serviceId === selectedServiceId;

              return (
                <div
                  key={service.serviceId}
                  onClick={() => setSelectedServiceId(service.serviceId)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/60 shadow-md scale-[1.01]"
                      : "border-slate-200 hover:border-slate-300 bg-white shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl font-bold text-xs ${isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                      {service.serviceId === "habit" && <Target className="w-5 h-5" />}
                      {service.serviceId === "water" && <Droplets className="w-5 h-5" />}
                      {service.serviceId === "medicine" && <Pill className="w-5 h-5" />}
                      {service.serviceId === "contract" && <FileText className="w-5 h-5" />}
                      {service.serviceId === "property" && <Home className="w-5 h-5" />}
                      {service.serviceId === "finance" && <DollarSign className="w-5 h-5" />}
                      {service.serviceId === "sleep" && <Moon className="w-5 h-5" />}
                      {service.serviceId === "menstrual" && <Heart className="w-5 h-5" />}
                      {service.serviceId === "inventory" && <Package className="w-5 h-5" />}
                      {service.serviceId === "hybrid_storage" && <HardDrive className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900">{service.serviceName}</h4>
                        {service.enabled ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" title="Disabled" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{service.category} • Mode: <span className="font-bold capitalize text-slate-700">{service.presetMode}</span></p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE SERVICE CHOICE & LOGIC CUSTOMIZER (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl font-black">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {activePref.category}
                </span>
                <h2 className="text-base font-black text-slate-900 mt-0.5">{activePref.serviceName} Settings</h2>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Service Status:</span>
              <button
                type="button"
                onClick={() => handleUpdateActiveField("enabled", !activePref.enabled)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  activePref.enabled
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {activePref.enabled ? "Active Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            {activePref.customNotes}
          </p>

          {/* PRESET OPERATIONAL MODE */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              1. Choose Preset Operational Mode:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "minimal", label: "Minimal", desc: "Basic tracking & quiet alerts" },
                { id: "standard", label: "Standard", desc: "Balanced goal & reminder mode" },
                { id: "pro", label: "Pro Care", desc: "Strict verification & auto-backups" },
                { id: "custom", label: "Custom", desc: "User tailored parameters" }
              ].map((m) => {
                const isCurrent = activePref.presetMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleUpdateActiveField("presetMode", m.id as any)}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer space-y-1 ${
                      isCurrent
                        ? "border-emerald-600 bg-emerald-50/70 text-slate-900 font-bold"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <p className="text-xs font-black">{m.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TARGETS & REMINDER FREQUENCY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1">Daily Target Goal</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={activePref.dailyTarget || ""}
                  onChange={(e) => handleUpdateActiveField("dailyTarget", Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
                <span className="text-xs font-bold text-slate-500 shrink-0">{activePref.targetUnit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1">Reminder Alert Interval</label>
              <select
                value={activePref.reminderFrequencyMinutes}
                onChange={(e) => handleUpdateActiveField("reminderFrequencyMinutes", Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
              >
                <option value={30}>Every 30 Minutes</option>
                <option value={60}>Every 1 Hour (60 min)</option>
                <option value={120}>Every 2 Hours (120 min)</option>
                <option value={240}>Every 4 Hours (240 min)</option>
                <option value={1440}>Once Daily (1440 min)</option>
                <option value={10080}>Weekly Check-in</option>
              </select>
            </div>
          </div>

          {/* WHAT TO DO LOGIC RULES */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              2. Logic Rules & Actions Behind Service:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                <label className="text-xs font-bold text-emerald-900 block">When Task / Goal Completed:</label>
                <select
                  value={activePref.actionOnCompletion}
                  onChange={(e) => handleUpdateActiveField("actionOnCompletion", e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl border border-emerald-300 bg-white font-semibold text-slate-800"
                >
                  <option value="log_and_reward">🏆 Log Record & Reward Badge</option>
                  <option value="sound_chime">🔔 Play Hydration / Success Chime</option>
                  <option value="notify">📱 Push System Notification</option>
                  <option value="silent">🤫 Log Silently</option>
                </select>
              </div>

              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 space-y-1.5">
                <label className="text-xs font-bold text-amber-900 block">When Task / Dose Missed:</label>
                <select
                  value={activePref.actionOnMissed}
                  onChange={(e) => handleUpdateActiveField("actionOnMissed", e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white font-semibold text-slate-800"
                >
                  <option value="reschedule">⏰ Reschedule Reminder Alert</option>
                  <option value="flag_warning">⚠️ Flag Compliance Warning</option>
                  <option value="alert_emergency_contact">🚨 Alert Caregiver / Emergency Contact</option>
                  <option value="ignore">🙈 Ignore & Continue</option>
                </select>
              </div>
            </div>
          </div>

          {/* VERIFICATION & SECURITY OPTIONS */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              3. Security & Biometric Verification Settings:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Require Photo Proof Attachment</span>
                <input
                  type="checkbox"
                  checked={activePref.requirePhotoProof}
                  onChange={(e) => handleUpdateActiveField("requirePhotoProof", e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Require Biometric Signature / Thumb</span>
                <input
                  type="checkbox"
                  checked={activePref.requireBiometricSignature}
                  onChange={(e) => handleUpdateActiveField("requireBiometricSignature", e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer sm:col-span-2">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Auto-Sync to Google Drive & Cloud Backups</span>
                </div>
                <input
                  type="checkbox"
                  checked={activePref.autoSyncCloud}
                  onChange={(e) => handleUpdateActiveField("autoSyncCloud", e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleSavePreferences(preferences)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save Preferences for {activePref.serviceName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
