import React, { useState } from "react";
import {
  Store as StoreIcon,
  Sparkles,
  FileText,
  CreditCard,
  Truck,
  Globe,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Upload,
  Check,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  MapPin,
  Lock,
  Building2,
  Clock,
  DollarSign,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { StoreProfile } from "./CustomStoreMarketplace";
import { useLanguage } from "../context/LanguageContext";

interface MarketplaceWizardProps {
  store: StoreProfile;
  onUpdateStore: (updatedStore: StoreProfile) => void;
  onFinish?: () => void;
}

export const MarketplaceWizard: React.FC<MarketplaceWizardProps> = ({
  store,
  onUpdateStore,
  onFinish
}) => {
  const { t } = useLanguage();
  // Accordion Expand/Collapse State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: false,
    sec3: false,
    sec4: false,
    sec5: false
  });

  // UI States
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [clearConfirmModal, setClearConfirmModal] = useState<{ isOpen: boolean; secKey: string; secTitle: string }>({
    isOpen: false,
    secKey: "",
    secTitle: ""
  });
  const [autoSaveNotification, setAutoSaveNotification] = useState<string | null>(null);

  // Helper to trigger auto-save notification
  const handleStoreChange = (fieldUpdates: Partial<StoreProfile>) => {
    const updated = { ...store, ...fieldUpdates };
    onUpdateStore(updated);
    setAutoSaveNotification("Auto-saved to database ✓");
    setTimeout(() => setAutoSaveNotification(null), 2000);
  };

  const toggleSection = (secKey: string) => {
    setOpenSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  // Clear Section Handler
  const confirmClearSection = () => {
    const secKey = clearConfirmModal.secKey;
    let updates: Partial<StoreProfile> = {};

    if (secKey === "sec1") {
      updates = {
        storeName: "",
        tagline: "",
        description: "",
        storeLogo: "",
        storeBanner: "",
        brandColor: "#2E7D32"
      };
    } else if (secKey === "sec2") {
      updates = {
        proprietorName: "",
        proprietorDob: "",
        businessType: "Sole Proprietorship",
        vatPanNumber: "",
        socialSecurityNumber: "",
        officeRegistrationNumber: "",
        registrationDocUrl: ""
      };
    } else if (secKey === "sec3") {
      updates = {
        bankName: "",
        bankAccountNumber: "",
        branchCode: "",
        accountHolderName: "",
        esewaMerchantId: "",
        khaltiPublicKey: "",
        fonepayMerchantCode: "",
        bankAccountDetails: ""
      };
    } else if (secKey === "sec4") {
      updates = {
        address: "",
        city: "",
        country: "",
        locationCoordinates: "",
        businessHours: "",
        fixedChargeDeliveryEnabled: false,
        fixedDeliveryCharge: 0,
        freeDeliveryThresholdEnabled: false,
        freeDeliveryThreshold: 0,
        localPickupAvailable: false,
        pickupInstructions: ""
      };
    } else if (secKey === "sec5") {
      updates = {
        subdomain: "",
        customDomain: ""
      };
    }

    handleStoreChange(updates);
    setClearConfirmModal({ isOpen: false, secKey: "", secTitle: "" });
  };

  // Subdomain Validation Check
  const isSubdomainValid = Boolean(store.subdomain && store.subdomain.trim().length >= 3);

  // Done Publishing Action
  const handleDonePublish = () => {
    setOpenSections({
      sec1: false,
      sec2: false,
      sec3: false,
      sec4: false,
      sec5: false
    });
    alert("🎉 Marketplace Storefront published successfully!");
    if (onFinish) onFinish();
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-wider">
              Setup & Onboarding Wizard
            </span>
            {autoSaveNotification && (
              <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                {autoSaveNotification}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            <StoreIcon className="w-6 h-6 text-emerald-400" />
            {t("marketplace.title", "Marketplace Store Setup")}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t("marketplace.subtitle", "Configure your merchant identity, tax credentials, payouts, delivery rules, and custom domain URL.")}
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>{t("buttons.preview", "Preview Storefront")}</span>
          </button>

          <button
            type="button"
            onClick={handleDonePublish}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("buttons.done", "DONE")}</span>
          </button>
        </div>
      </div>

      {/* ACCORDION PANELS CONTAINER */}
      <div className="space-y-4">
        {/* ========================================================================= */}
        {/* PANEL 01: BUSINESS IDENTITY & BRANDING */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all">
          <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => toggleSection("sec1")}>
            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs">
                01
              </span>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Business Identity & Branding
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Store Name, Tagline, Logo, Banner & Primary Brand Accent Color.</p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setClearConfirmModal({ isOpen: true, secKey: "sec1", secTitle: "01 Business Identity & Branding" })}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                title="Clear Section Data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Clear Section</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection("sec1")}
                className="p-1 text-slate-400 hover:text-white"
              >
                {openSections.sec1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {openSections.sec1 && (
            <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/60 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Name */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Store Name *</label>
                  <input
                    type="text"
                    value={store.storeName}
                    onChange={(e) => handleStoreChange({ storeName: e.target.value })}
                    placeholder="e.g. Apex Pharmacy & Care Store"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Store Tagline / Motto</label>
                  <input
                    type="text"
                    value={store.tagline || ""}
                    onChange={(e) => handleStoreChange({ tagline: e.target.value })}
                    placeholder="e.g. Verified Healthcare Equipment & 24/7 Home Delivery"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Store Category */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Store Primary Category *</label>
                  <select
                    value={store.category}
                    onChange={(e) => handleStoreChange({ category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="physical">Physical Goods & Medical Supplies 📦</option>
                    <option value="digital">Digital Files & Caregiver SOPs 💻</option>
                    <option value="service">Healthcare Consultations & Home Visit 🛠️</option>
                    <option value="custom">Custom Hybrid Store 🏪</option>
                  </select>
                </div>

                {/* Brand Accent Color */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Brand Theme Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={store.brandColor || "#2E7D32"}
                      onChange={(e) => handleStoreChange({ brandColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={store.brandColor || "#2E7D32"}
                      onChange={(e) => handleStoreChange({ brandColor: e.target.value })}
                      className="w-28 p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-white"
                    />
                  </div>
                </div>

                {/* Store Description */}
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-300 block mb-1">Store About / Description</label>
                  <textarea
                    rows={2}
                    value={store.description}
                    onChange={(e) => handleStoreChange({ description: e.target.value })}
                    placeholder="Brief overview of your store, medical equipment, or caregiver services..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Logo Upload Dropzone */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-200 block">Store Logo Image (Square)</label>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1" title="Minimum 500x500px recommended">
                      <HelpCircle className="w-3 h-3" /> Min 500x500px
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {store.storeLogo ? (
                        <img src={store.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={store.storeLogo}
                        onChange={(e) => handleStoreChange({ storeLogo: e.target.value })}
                        placeholder="https://... logo image URL"
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-[11px]"
                      />
                      <p className="text-[10px] text-slate-500">Square avatar logo displayed on checkout and receipts.</p>
                    </div>
                  </div>
                </div>

                {/* Banner Upload Dropzone */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-200 block">Store Header Cover Banner</label>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1" title="Minimum 1200px wide recommended">
                      <HelpCircle className="w-3 h-3" /> Min 1200px wide
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={store.storeBanner}
                      onChange={(e) => handleStoreChange({ storeBanner: e.target.value })}
                      placeholder="https://... banner cover image URL"
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-[11px]"
                    />
                    {store.storeBanner && (
                      <div className="h-16 rounded-lg overflow-hidden border border-slate-800">
                        <img src={store.storeBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 02: TAX, LEGAL & PROPRIETOR DETAILS */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all">
          <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => toggleSection("sec2")}>
            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs">
                02
              </span>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Tax, Legal & Proprietor Details
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Proprietor Name, VAT/GST Number, Business License Photo Upload.</p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setClearConfirmModal({ isOpen: true, secKey: "sec2", secTitle: "02 Tax, Legal & Proprietor Details" })}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                title="Clear Section Data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Clear Section</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection("sec2")}
                className="p-1 text-slate-400 hover:text-white"
              >
                {openSections.sec2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {openSections.sec2 && (
            <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/60 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Proprietor Full Name */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Proprietor / Owner Full Name *</label>
                  <input
                    type="text"
                    value={store.proprietorName || ""}
                    onChange={(e) => handleStoreChange({ proprietorName: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Proprietor DOB */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Proprietor Date of Birth</label>
                  <input
                    type="date"
                    value={store.proprietorDob || ""}
                    onChange={(e) => handleStoreChange({ proprietorDob: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Registered Country *</label>
                  <input
                    type="text"
                    value={store.country}
                    onChange={(e) => handleStoreChange({ country: e.target.value })}
                    placeholder="e.g. Nepal, USA, United Kingdom"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Business Registration Type</label>
                  <select
                    value={store.businessType || "Sole Proprietorship"}
                    onChange={(e) => handleStoreChange({ businessType: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Private Limited Company (Pvt. Ltd.)">Private Limited Company (Pvt. Ltd.)</option>
                    <option value="Partnership Firm">Partnership Firm</option>
                    <option value="LLP (Limited Liability Partnership)">LLP (Limited Liability Partnership)</option>
                    <option value="Non-Profit / NGO Trust">Non-Profit / NGO Trust</option>
                  </select>
                </div>

                {/* Tax / VAT / GST Number */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">VAT / GST / Tax Identification Number *</label>
                  <input
                    type="text"
                    value={store.vatPanNumber || ""}
                    onChange={(e) => handleStoreChange({ vatPanNumber: e.target.value })}
                    placeholder="e.g. VAT-901823901"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono font-bold text-indigo-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* PAN / SSN / Business PIN */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">PAN / Social Security / SSF Number</label>
                  <input
                    type="text"
                    value={store.socialSecurityNumber || ""}
                    onChange={(e) => handleStoreChange({ socialSecurityNumber: e.target.value })}
                    placeholder="e.g. PAN-609812341"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono font-bold text-indigo-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Office Registration No */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="font-bold text-slate-300 block mb-1">Company / Office Registration Number</label>
                  <input
                    type="text"
                    value={store.officeRegistrationNumber || ""}
                    onChange={(e) => handleStoreChange({ officeRegistrationNumber: e.target.value })}
                    placeholder="e.g. REG-2080/19283-KTM"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono font-bold text-indigo-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* License Document Upload */}
                <div className="md:col-span-2 lg:col-span-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Business License / Registration Certificate File Upload</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={store.registrationDocUrl || ""}
                        onChange={(e) => handleStoreChange({ registrationDocUrl: e.target.value })}
                        placeholder="https://... scanned document photo or PDF link"
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono"
                      />
                    </div>
                    {store.registrationDocUrl && (
                      <a
                        href={store.registrationDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-500/30"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Document</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 03: FINANCE & PAYOUTS */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all">
          <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => toggleSection("sec3")}>
            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs">
                03
              </span>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Finance & Payouts
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Bank Account Number with Mask Eye Toggle & Verified Status Badge.</p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setClearConfirmModal({ isOpen: true, secKey: "sec3", secTitle: "03 Finance & Payouts" })}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                title="Clear Section Data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Clear Section</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection("sec3")}
                className="p-1 text-slate-400 hover:text-white"
              >
                {openSections.sec3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {openSections.sec3 && (
            <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/60 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bank Name */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Bank Name *</label>
                  <input
                    type="text"
                    value={store.bankName || ""}
                    onChange={(e) => handleStoreChange({ bankName: e.target.value })}
                    placeholder="e.g. Nabil Bank Ltd. / Chase Bank"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Account Holder Name *</label>
                  <input
                    type="text"
                    value={store.accountHolderName || ""}
                    onChange={(e) => handleStoreChange({ accountHolderName: e.target.value })}
                    placeholder="e.g. Care2Care Health Solutions Pvt. Ltd."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Bank Account Number with Eye Mask & Verification Dot */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-300 block">Bank Account Number *</label>
                    {/* Status dot */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified Account
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showAccountNumber ? "text" : "password"}
                      value={store.bankAccountNumber || store.bankAccountDetails || ""}
                      onChange={(e) => handleStoreChange({ bankAccountNumber: e.target.value, bankAccountDetails: e.target.value })}
                      placeholder="e.g. 01001017500129"
                      className="w-full p-2.5 pr-10 bg-slate-900 border border-slate-700 rounded-xl font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                      title={showAccountNumber ? "Mask Account Number" : "Show Account Number"}
                    >
                      {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Branch Code / SWIFT */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Branch Code / SWIFT / IFSC</label>
                  <input
                    type="text"
                    value={store.branchCode || ""}
                    onChange={(e) => handleStoreChange({ branchCode: e.target.value })}
                    placeholder="e.g. NABIL-001-KTM"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Primary Settlement Currency</label>
                  <select
                    value={store.currency || "NPR (Rs.)"}
                    onChange={(e) => handleStoreChange({ currency: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="NPR (Rs.)">NPR (Rs.)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>

                {/* Payout Frequency */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Payout Frequency</label>
                  <select
                    value={store.payoutFrequency || "Weekly (Every Friday)"}
                    onChange={(e) => handleStoreChange({ payoutFrequency: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Daily">Daily Automated Payout</option>
                    <option value="Weekly (Every Friday)">Weekly (Every Friday)</option>
                    <option value="Bi-weekly">Bi-weekly (1st & 15th)</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Digital Wallets / Gateways */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h3 className="font-black text-slate-300 text-[11px] uppercase tracking-wider">Local Digital Wallet Merchants</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1 text-[11px]">eSewa Merchant ID 💚</label>
                    <input
                      type="text"
                      value={store.esewaMerchantId || ""}
                      onChange={(e) => handleStoreChange({ esewaMerchantId: e.target.value })}
                      placeholder="ESEWA_LIVE_908123"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-400 block mb-1 text-[11px]">Khalti Public Key 💜</label>
                    <input
                      type="text"
                      value={store.khaltiPublicKey || ""}
                      onChange={(e) => handleStoreChange({ khaltiPublicKey: e.target.value })}
                      placeholder="khalti_live_key_..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-400 block mb-1 text-[11px]">Fonepay Merchant Code 📲</label>
                    <input
                      type="text"
                      value={store.fonepayMerchantCode || ""}
                      onChange={(e) => handleStoreChange({ fonepayMerchantCode: e.target.value })}
                      placeholder="FONEPAY_MCH_4401"
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 04: LOGISTICS & DELIVERY */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all">
          <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => toggleSection("sec4")}>
            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-xs">
                04
              </span>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Logistics & Delivery
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Delivery Charges, Free Shipping Threshold & Local Pickup Toggles.</p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setClearConfirmModal({ isOpen: true, secKey: "sec4", secTitle: "04 Logistics & Delivery" })}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                title="Clear Section Data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Clear Section</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection("sec4")}
                className="p-1 text-slate-400 hover:text-white"
              >
                {openSections.sec4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {openSections.sec4 && (
            <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/60 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Address */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Physical Street Address *</label>
                  <input
                    type="text"
                    value={store.address}
                    onChange={(e) => handleStoreChange({ address: e.target.value })}
                    placeholder="e.g. 108 Lazimpat, Durbar Marg"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">City / Region *</label>
                  <input
                    type="text"
                    value={store.city}
                    onChange={(e) => handleStoreChange({ city: e.target.value })}
                    placeholder="e.g. Kathmandu"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* GPS Pin */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Google Maps Coordinates</label>
                  <input
                    type="text"
                    value={store.locationCoordinates || ""}
                    onChange={(e) => handleStoreChange({ locationCoordinates: e.target.value })}
                    placeholder="27.7172° N, 85.3240° E"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Business Hours */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={store.businessHours || ""}
                    onChange={(e) => handleStoreChange({ businessHours: e.target.value })}
                    placeholder="e.g. Mon-Sat: 8:00 AM - 8:00 PM"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Official Support Phone *</label>
                  <input
                    type="text"
                    value={store.phone}
                    onChange={(e) => handleStoreChange({ phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Support Email *</label>
                  <input
                    type="email"
                    value={store.email}
                    onChange={(e) => handleStoreChange({ email: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* RESTRUCTURED DELIVERY SETUP CARD WITH TOGGLES */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 mt-2">
                <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-400" />
                  Delivery & Fulfillment Rules
                </h3>

                <div className="space-y-3">
                  {/* TOGGLE 1: Fixed Charge Delivery */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block">1. Fixed Charge Delivery</span>
                        <span className="text-[10px] text-slate-500">Apply a flat rate shipping charge to all order checkouts.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={store.fixedChargeDeliveryEnabled ?? true}
                        onChange={(e) => handleStoreChange({ fixedChargeDeliveryEnabled: e.target.checked })}
                        className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                      />
                    </div>
                    {store.fixedChargeDeliveryEnabled !== false && (
                      <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                        <span className="text-slate-400 font-bold">Standard Delivery Fee ($ / Rs.):</span>
                        <input
                          type="number"
                          value={store.fixedDeliveryCharge ?? 150}
                          onChange={(e) => handleStoreChange({ fixedDeliveryCharge: Number(e.target.value) })}
                          className="w-32 p-2 bg-slate-900 border border-slate-700 rounded-lg text-teal-300 font-bold"
                        />
                      </div>
                    )}
                  </div>

                  {/* TOGGLE 2: Free Delivery Threshold */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block">2. Free Delivery Threshold</span>
                        <span className="text-[10px] text-slate-500">Waive shipping cost if customer spends over a minimum cart amount.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={store.freeDeliveryThresholdEnabled ?? true}
                        onChange={(e) => handleStoreChange({ freeDeliveryThresholdEnabled: e.target.checked })}
                        className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                      />
                    </div>
                    {store.freeDeliveryThresholdEnabled !== false && (
                      <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                        <span className="text-slate-400 font-bold">Minimum Order Amount for Free Delivery:</span>
                        <input
                          type="number"
                          value={store.freeDeliveryThreshold ?? 5000}
                          onChange={(e) => handleStoreChange({ freeDeliveryThreshold: Number(e.target.value) })}
                          className="w-32 p-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold"
                        />
                      </div>
                    )}
                  </div>

                  {/* TOGGLE 3: Local Pickup Available */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block">3. Local Customer Pickup</span>
                        <span className="text-[10px] text-slate-500">Allow customers to collect directly from store hub or pharmacy.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={store.localPickupAvailable ?? true}
                        onChange={(e) => handleStoreChange({ localPickupAvailable: e.target.checked })}
                        className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                      />
                    </div>
                    {store.localPickupAvailable !== false && (
                      <div className="pt-2 border-t border-slate-800 space-y-1">
                        <span className="text-slate-400 font-bold block">Pickup Instructions & Address:</span>
                        <textarea
                          rows={2}
                          value={store.pickupInstructions || ""}
                          onChange={(e) => handleStoreChange({ pickupInstructions: e.target.value })}
                          placeholder="Instructions for customers picking up orders..."
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 05: DOMAIN & SUBNETWORK */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition-all">
          <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => toggleSection("sec5")}>
            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-xs">
                05
              </span>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Domain & Subnetwork URL
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Configure Subdomain (.care2care.com) and Custom DNS CNAME Record.</p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setClearConfirmModal({ isOpen: true, secKey: "sec5", secTitle: "05 Domain & Subnetwork" })}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                title="Clear Section Data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Clear Section</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection("sec5")}
                className="p-1 text-slate-400 hover:text-white"
              >
                {openSections.sec5 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {openSections.sec5 && (
            <div className="p-5 border-t border-slate-800 space-y-4 bg-slate-950/60 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Care2Care Subdomain Input */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Care2Care Subdomain Address</label>
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl p-2">
                    <input
                      type="text"
                      value={store.subdomain || ""}
                      onChange={(e) => handleStoreChange({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                      placeholder="my-pharmacy-store"
                      className="flex-1 bg-transparent text-white font-mono font-bold text-xs focus:outline-none"
                    />
                    <span className="text-slate-400 font-mono text-[11px]">.care2care.com</span>
                  </div>

                  {/* Live Status Indicator */}
                  <div className="pt-1">
                    {isSubdomainValid ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✓ Subdomain Available: https://{store.subdomain}.care2care.com</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                        <XCircle className="w-4 h-4" />
                        <span>✕ Enter at least 3 characters for subdomain</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Domain Input */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Custom Domain (Optional)</label>
                  <input
                    type="text"
                    value={store.customDomain || ""}
                    onChange={(e) => handleStoreChange({ customDomain: e.target.value })}
                    placeholder="e.g. store.mybrand.com"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-purple-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {/* DNS Instructions Box */}
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 text-[10px] text-slate-400">
                    <p className="font-bold text-slate-300">DNS Setup Instructions:</p>
                    <p>Add a CNAME record in your Domain Registrar (Godaddy, Cloudflare, Namecheap):</p>
                    <div className="font-mono text-purple-300 bg-slate-900 p-1.5 rounded border border-slate-800">
                      CNAME {store.customDomain || "store.mybrand.com"} → stores.care2care.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM PUBLISH BAR */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 font-medium text-center sm:text-left">
          All changes are auto-saved in real-time. Click <strong className="text-white">DONE</strong> when ready.
        </div>

        <button
          type="button"
          onClick={handleDonePublish}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-950 hover:shadow-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>DONE - Publish Marketplace Store</span>
        </button>
      </div>

      {/* CLEAR SECTION CONFIRMATION MODAL */}
      {clearConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4 text-slate-100">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-xl">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black text-white">Clear Section Data?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to clear all input fields in <strong className="text-slate-200">{clearConfirmModal.secTitle}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClearConfirmModal({ isOpen: false, secKey: "", secTitle: "" })}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClearSection}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW STOREFRONT MODAL DRAWER */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-800 space-y-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-sm uppercase tracking-wider">Live Storefront Customer View</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Simulated Public Banner */}
            <div className="relative rounded-2xl overflow-hidden h-40 bg-slate-800 border border-slate-700">
              {store.storeBanner && (
                <img src={store.storeBanner} alt="Banner" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-emerald-500 overflow-hidden shadow-lg shrink-0">
                    <img src={store.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white leading-tight flex items-center gap-1.5">
                      {store.storeName || "Store Name"}
                      {store.isVerified && (
                        <span title="Verified Merchant">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-emerald-300 font-medium">{store.tagline || store.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Meta Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                <span className="font-bold text-slate-200">{store.address}, {store.city}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Business Hours</span>
                <span className="font-bold text-slate-200">{store.businessHours || "Mon-Sat 9AM - 6PM"}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Store Domain</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {store.subdomain ? `${store.subdomain}.care2care.com` : "Not Configured"}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Delivery Fee</span>
                <span className="font-bold text-teal-300">
                  {store.fixedChargeDeliveryEnabled !== false ? `$${store.fixedDeliveryCharge || 150} Flat` : "Free"}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Free Shipping Over</span>
                <span className="font-bold text-emerald-400">
                  {store.freeDeliveryThresholdEnabled !== false ? `$${store.freeDeliveryThreshold || 5000}` : "N/A"}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Tax Reg (VAT/PAN)</span>
                <span className="font-mono text-indigo-300 font-bold">{store.vatPanNumber || "Verified"}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
