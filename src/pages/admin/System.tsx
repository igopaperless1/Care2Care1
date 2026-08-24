import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  CreditCard,
  Send,
  Copy,
  Sliders,
  Shield,
  AlertTriangle,
  FileText,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Lock,
  Globe,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Filter,
  AlertCircle
} from "lucide-react";
import { getSavedSupabaseConfig, saveSupabaseConfig, SUPABASE_SQL_SCHEMA_FULL } from "../../lib/supabase";
import { getSavedPaddleConfig, savePaddleConfig } from "../../lib/paddle";
import {
  getSavedFeatureConfigs,
  saveFeatureConfigs,
  FeatureConfigItem,
  FeatureStatus,
  RegionalScope,
  UserTierScope
} from "../../lib/featureConfig";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  details: string;
  targetUser?: string;
}

interface SystemPageProps {
  showToast: (msg: string) => void;
  onSendGlobalBroadcast: (title: string, message: string) => void;
}

export const SystemPage: React.FC<SystemPageProps> = ({
  showToast,
  onSendGlobalBroadcast
}) => {
  const [supabaseConfig, setSupabaseConfig] = useState(getSavedSupabaseConfig());
  const [paddleConfig, setPaddleConfig] = useState(getSavedPaddleConfig());

  const [supUrl, setSupUrl] = useState(supabaseConfig.url);
  const [supKey, setSupKey] = useState(supabaseConfig.anonKey);

  const [padToken, setPadToken] = useState(paddleConfig.clientToken);
  const [padVendor, setPadVendor] = useState(paddleConfig.vendorId);

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // Comprehensive Feature Configuration State
  const [featureConfigs, setFeatureConfigs] = useState<FeatureConfigItem[]>(() => getSavedFeatureConfigs());
  const [featureSearch, setFeatureSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Add Custom Service Feature Modal State
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureCat, setNewFeatureCat] = useState<FeatureConfigItem["category"]>("Personal Care");
  const [newFeatureDesc, setNewFeatureDesc] = useState("");
  const [newFeatureEmoji, setNewFeatureEmoji] = useState("✨");
  const [newFeatureStatus, setNewFeatureStatus] = useState<FeatureStatus>("coming_soon");
  const [newFeatureRegion, setNewFeatureRegion] = useState<RegionalScope>("ALL");

  // Maintenance Mode & Legal Compliance State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [termsOfService, setTermsOfService] = useState(
    "Terms of Service (Updated 2026): All sub-account activities are logged and monitored under HIPAA and GDPR compliance regulations."
  );
  const [privacyPolicy, setPrivacyPolicy] = useState(
    "Privacy Policy (Updated 2026): Patient health records and retail POS transactions are strictly encrypted at rest and in transit."
  );

  // Global Quotas & Limits State
  const [aiDailyQuota, setAiDailyQuota] = useState("100");
  const [maxSubAccounts, setMaxSubAccounts] = useState("10");
  const [idleTimeoutMins, setIdleTimeoutMins] = useState("30");

  const handleUpdateFeatureStatus = (id: string, newStatus: FeatureStatus) => {
    const updated = featureConfigs.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setFeatureConfigs(updated);
    saveFeatureConfigs(updated);
    showToast(`Feature status changed to "${newStatus.toUpperCase()}"!`);
  };

  const handleUpdateFeatureRegion = (id: string, newRegion: RegionalScope) => {
    const updated = featureConfigs.map((item) =>
      item.id === id ? { ...item, countryAvailability: newRegion } : item
    );
    setFeatureConfigs(updated);
    saveFeatureConfigs(updated);
    showToast(`Regional availability updated to ${newRegion}!`);
  };

  const handleUpdateFeatureTier = (id: string, newTier: UserTierScope) => {
    const updated = featureConfigs.map((item) =>
      item.id === id ? { ...item, userTier: newTier } : item
    );
    setFeatureConfigs(updated);
    saveFeatureConfigs(updated);
    showToast(`Access tier set to ${newTier}!`);
  };

  const handleUpdateComingSoonNote = (id: string, note: string) => {
    const updated = featureConfigs.map((item) =>
      item.id === id ? { ...item, comingSoonMessage: note } : item
    );
    setFeatureConfigs(updated);
    saveFeatureConfigs(updated);
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;

    const newId = `custom_${Date.now()}`;
    const newEntry: FeatureConfigItem = {
      id: newId,
      name: newFeatureName.trim(),
      category: newFeatureCat,
      status: newFeatureStatus,
      countryAvailability: newFeatureRegion,
      userTier: "ALL",
      description: newFeatureDesc.trim() || "Custom service module configured by administrator.",
      iconEmoji: newFeatureEmoji || "⚡",
      comingSoonMessage: newFeatureStatus === "coming_soon" ? "Launching soon for selected members." : undefined
    };

    const updated = [newEntry, ...featureConfigs];
    setFeatureConfigs(updated);
    saveFeatureConfigs(updated);

    showToast(`Added new custom service: "${newFeatureName}"!`);
    setIsAddFeatureOpen(false);
    setNewFeatureName("");
    setNewFeatureDesc("");
  };

  const handleToggleMaintenance = () => {
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    showToast(
      nextState
        ? "⚠️ MAINTENANCE MODE ENABLED: Global notification banner broadcasted to all users!"
        : "✅ Maintenance mode disabled. App resumed normal operation."
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSupabaseConfig(supUrl, supKey);
    setSupabaseConfig(updated);
    showToast("Supabase credentials saved successfully!");
  };

  const handleSavePaddle = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = savePaddleConfig(padToken, padVendor);
    setPaddleConfig(updated);
    showToast("Paddle billing gateway credentials saved!");
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    onSendGlobalBroadcast(broadcastTitle || "Care2Care Global Broadcast", broadcastMessage);
    showToast("Broadcast message transmitted to all active users!");
    setBroadcastTitle("");
    setBroadcastMessage("");
  };

  const handleSaveGlobalQuotas = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Saved Global Limits: ${aiDailyQuota} AI calls/day, ${maxSubAccounts} sub-accounts max.`);
  };

  const handleSaveLegalTerms = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Updated platform Terms of Service & Privacy Policy texts!");
  };

  const filteredFeatures = featureConfigs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(featureSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(featureSearch.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* PAGE HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>System Settings, Module Switches & Compliance Controls</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage global feature toggles, maintenance mode, system-wide quotas, legal terms, and API gateway integrations.
          </p>
        </div>
      </div>

      {/* SECTION 1: GLOBAL FEATURE SWITCHES & SERVICE AVAILABILITY CONTROL */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Global Service & Feature Availability Switches
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Configure platform modules as Active, Disabled, or Coming Soon, and set country regional restrictions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddFeatureOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Service</span>
            </button>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={featureSearch}
              onChange={(e) => setFeatureSearch(e.target.value)}
              placeholder="Search services (e.g. SOS, POS, Vitals, Telehealth, Lab)..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["All", "Personal Care", "Retail & Business", "Family & Care", "Assets & Vault", "Enterprise & AI"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* FEATURE ITEMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeatures.map((feat) => {
            const isComingSoon = feat.status === "coming_soon";
            const isDisabled = feat.status === "disabled";
            const isActive = feat.status === "active";

            return (
              <div
                key={feat.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  isActive
                    ? "bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300"
                    : isComingSoon
                    ? "bg-amber-50/40 border-amber-200/80 hover:border-amber-300"
                    : "bg-slate-50 border-slate-200 opacity-90"
                }`}
              >
                {/* Header info */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        {feat.iconEmoji || "⚡"}
                      </span>
                      <div>
                        <h3 className="font-extrabold text-xs text-slate-900 leading-tight">{feat.name}</h3>
                        <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {feat.category}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0 ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : isComingSoon
                          ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                      }`}
                    >
                      {isActive ? "● Active" : isComingSoon ? "⏳ Coming Soon" : "✕ Disabled"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">{feat.description}</p>
                </div>

                {/* Controls Form */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2 text-[10px]">
                  {/* Status Toggle Selector */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-600">Service Status:</span>
                    <select
                      value={feat.status}
                      onChange={(e) => handleUpdateFeatureStatus(feat.id, e.target.value as FeatureStatus)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 text-[10px] focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active (Enabled)</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="disabled">Disabled (Off)</option>
                    </select>
                  </div>

                  {/* Country & Regional Availability Selector */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-600">Region Availability:</span>
                    <select
                      value={feat.countryAvailability}
                      onChange={(e) => handleUpdateFeatureRegion(feat.id, e.target.value as RegionalScope)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 text-[10px] focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ALL">Global (All Countries)</option>
                      <option value="US_CA">US & Canada Only</option>
                      <option value="EU_UK">EU & UK Only (GDPR)</option>
                      <option value="APAC">Asia-Pacific (APAC)</option>
                      <option value="LATAM_AFRICA">LATAM & Africa</option>
                      <option value="RESTRICTED">Restricted Region</option>
                    </select>
                  </div>

                  {/* User Tier Scope Selector */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-600">Access Tier:</span>
                    <select
                      value={feat.userTier}
                      onChange={(e) => handleUpdateFeatureTier(feat.id, e.target.value as UserTierScope)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 text-[10px] focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ALL">All Users (Free & Paid)</option>
                      <option value="PREMIUM_ENTERPRISE">Premium & Enterprise</option>
                      <option value="ENTERPRISE_ONLY">Enterprise Only</option>
                    </select>
                  </div>

                  {/* Custom Coming Soon Note Input */}
                  {isComingSoon && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={feat.comingSoonMessage || ""}
                        onChange={(e) => handleUpdateComingSoonNote(feat.id, e.target.value)}
                        placeholder="Coming Soon release note (e.g. Launching Q4)..."
                        className="w-full px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 font-medium placeholder-amber-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD CUSTOM SERVICE FEATURE MODAL */}
      {isAddFeatureOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Add Custom Service Feature
              </h3>
              <button onClick={() => setIsAddFeatureOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs font-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomFeature} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Name:</label>
                <input
                  type="text"
                  required
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  placeholder="e.g. Tele-Ambulance Booking, Insurance Vault..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={newFeatureCat}
                    onChange={(e) => setNewFeatureCat(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Personal Care">Personal Care</option>
                    <option value="Retail & Business">Retail & Business</option>
                    <option value="Family & Care">Family & Care</option>
                    <option value="Assets & Vault">Assets & Vault</option>
                    <option value="Enterprise & AI">Enterprise & AI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emoji Icon:</label>
                  <input
                    type="text"
                    value={newFeatureEmoji}
                    onChange={(e) => setNewFeatureEmoji(e.target.value)}
                    placeholder="🩺"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Status:</label>
                <select
                  value={newFeatureStatus}
                  onChange={(e) => setNewFeatureStatus(e.target.value as FeatureStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="coming_soon">Coming Soon</option>
                  <option value="active">Active Immediately</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Regional Scope:</label>
                <select
                  value={newFeatureRegion}
                  onChange={(e) => setNewFeatureRegion(e.target.value as RegionalScope)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="ALL">Global (All Countries)</option>
                  <option value="US_CA">US & Canada Only</option>
                  <option value="EU_UK">EU & UK Only</option>
                  <option value="APAC">APAC</option>
                  <option value="RESTRICTED">Restricted</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description:</label>
                <textarea
                  value={newFeatureDesc}
                  onChange={(e) => setNewFeatureDesc(e.target.value)}
                  rows={2}
                  placeholder="Short description of what this service module provides..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFeatureOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-black rounded-xl shadow-md"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 2: MAINTENANCE MODE & LEGAL COMPLIANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MAINTENANCE MODE CONTROL */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                System Maintenance Mode
              </h2>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                maintenanceMode ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
              }`}
            >
              {maintenanceMode ? "Active Maintenance" : "Online & Operational"}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Toggling maintenance mode broadcasts a persistent alert banner to all active users and restricts non-admin database write operations during system updates.
          </p>

          <button
            onClick={handleToggleMaintenance}
            className={`w-full py-3 px-4 font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              maintenanceMode
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{maintenanceMode ? "Disable Maintenance Mode (Resume Online)" : "Enable Global Maintenance Mode"}</span>
          </button>
        </div>

        {/* LEGAL COMPLIANCE & TERMS TEXT EDITORS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Compliance & Legal Policy Terms
              </h2>
            </div>
          </div>

          <form onSubmit={handleSaveLegalTerms} className="space-y-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Terms of Service:</label>
              <textarea
                value={termsOfService}
                onChange={(e) => setTermsOfService(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Privacy Policy:</label>
              <textarea
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Update Compliance Policy Text
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 3: GLOBAL QUOTAS & LIMITS CARD */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Global Platform Quotas & Resource Limits
            </h2>
          </div>
        </div>

        <form onSubmit={handleSaveGlobalQuotas} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Default AI Quota / User / Day:</label>
            <input
              type="number"
              value={aiDailyQuota}
              onChange={(e) => setAiDailyQuota(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Max Sub-Accounts / Workspace:</label>
            <input
              type="number"
              value={maxSubAccounts}
              onChange={(e) => setMaxSubAccounts(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Idle Security Timeout (Mins):</label>
            <input
              type="number"
              value={idleTimeoutMins}
              onChange={(e) => setIdleTimeoutMins(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              Save Global Limits & Quotas
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: GLOBAL BROADCAST ANNOUNCEMENT TOOL */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-900/60 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Send Global System Broadcast Notification
          </h2>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="Announcement Title (e.g. System Maintenance at 10 PM GMT)"
              className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="text"
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Broadcast Message Content..."
              className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Transmit System Broadcast</span>
          </button>
        </form>
      </div>

      {/* SECTION 5: API GATEWAYS CONFIG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SUPABASE CONFIG */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>Supabase Database Credentials</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                supabaseConfig.isConnected ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              {supabaseConfig.isConnected ? "Connected" : "Local Mode"}
            </span>
          </div>

          <form onSubmit={handleSaveSupabase} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Project URL:</label>
              <input
                type="text"
                value={supUrl}
                onChange={(e) => setSupUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Anon Public Key:</label>
              <input
                type="password"
                value={supKey}
                onChange={(e) => setSupKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(SUPABASE_SQL_SCHEMA_FULL, "Supabase Schema SQL")}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Schema SQL</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Supabase Credentials
              </button>
            </div>
          </form>
        </div>

        {/* PADDLE CONFIG */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Paddle Billing Gateway Settings</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-800">
              Payments Gateway
            </span>
          </div>

          <form onSubmit={handleSavePaddle} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Paddle Client Token:</label>
              <input
                type="text"
                value={padToken}
                onChange={(e) => setPadToken(e.target.value)}
                placeholder="test_live_token_..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Paddle Vendor ID:</label>
              <input
                type="text"
                value={padVendor}
                onChange={(e) => setPadVendor(e.target.value)}
                placeholder="102931"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Billing Config
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
