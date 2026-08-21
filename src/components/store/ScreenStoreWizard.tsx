import React, { useState } from "react";
import {
  Sparkles,
  Building2,
  FileCheck,
  Wallet,
  Truck,
  Globe,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Image,
  Palette,
  ShieldCheck,
  Save,
  Check
} from "lucide-react";
import { StoreProfileModel, StoreTab } from "./types";

interface ScreenStoreWizardProps {
  profile: StoreProfileModel;
  onUpdateProfile: (updated: Partial<StoreProfileModel>) => void;
  onNavigate: (tab: StoreTab) => void;
}

export const ScreenStoreWizard: React.FC<ScreenStoreWizardProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<StoreProfileModel>(profile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const steps = [
    { num: 1, label: "Business", icon: Building2 },
    { num: 2, label: "Legal & KYC", icon: FileCheck },
    { num: 3, label: "Payouts", icon: Wallet },
    { num: 4, label: "Logistics", icon: Truck },
    { num: 5, label: "Domain", icon: Globe }
  ];

  const colorPalettes = [
    { name: "Coral Orange", hex: "#FF5A36" },
    { name: "Emerald Green", hex: "#10B981" },
    { name: "Ocean Blue", hex: "#3B82F6" },
    { name: "Royal Purple", hex: "#8B5CF6" },
    { name: "Rose Pink", hex: "#EC4899" },
    { name: "Golden Amber", hex: "#F59E0B" }
  ];

  const handleSave = () => {
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogoUpload = () => {
    const newLogos = [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&auto=format&fit=crop&q=80"
    ];
    const picked = newLogos[Math.floor(Math.random() * newLogos.length)];
    setFormData({ ...formData, logoUrl: picked });
  };

  const handleBannerUpload = () => {
    const newBanners = [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1000&auto=format&fit=crop&q=80"
    ];
    const picked = newBanners[Math.floor(Math.random() * newBanners.length)];
    setFormData({ ...formData, bannerUrl: picked });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* 1. Stepper Navigation */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = step.num < currentStep;
            const isCurrent = step.num === currentStep;

            return (
              <div key={step.num} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#FF5A36] text-white shadow-xs shadow-orange-500/25"
                      : isDone
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-50 text-slate-500 hover:bg-orange-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? "bg-white text-[#FF5A36]"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
                {idx < steps.length - 1 && <div className="w-4 h-0.5 bg-orange-100 hidden sm:block" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-5">
        {/* STEP 1: BUSINESS IDENTITY */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FF5A36]" /> Business Identity & Branding
              </h3>
              <p className="text-xs text-slate-500">
                Set up your public brand identity, logo, colors, and visual storefront assets.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Store Name <span className="text-[#FF5A36]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="e.g. Healthy Life Store"
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Tagline</label>
                <input
                  type="text"
                  value={formData.storeTagline}
                  onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                  placeholder="e.g. Natural Products for a Better You"
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
                />
              </div>

              {/* Logo & Banner Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Store Logo</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-orange-200"
                    />
                    <button
                      type="button"
                      onClick={handleLogoUpload}
                      className="px-3 py-1.5 bg-white hover:bg-orange-50 text-xs font-bold text-[#FF5A36] border border-orange-200 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Logo</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Banner Image</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.bannerUrl}
                      alt="Banner"
                      referrerPolicy="no-referrer"
                      className="w-24 h-14 rounded-2xl object-cover border border-orange-200"
                    />
                    <button
                      type="button"
                      onClick={handleBannerUpload}
                      className="px-3 py-1.5 bg-white hover:bg-orange-50 text-xs font-bold text-[#FF5A36] border border-orange-200 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Banner</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Brand Accent Color */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF5A36]" /> Brand Accent Color
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {colorPalettes.map((c) => {
                    const isSelected = formData.brandAccentColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, brandAccentColor: c.hex })}
                        style={{ backgroundColor: c.hex }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-transform cursor-pointer ${
                          isSelected ? "ring-3 ring-offset-2 ring-slate-800 scale-110" : "opacity-85 hover:opacity-100"
                        }`}
                        title={c.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LEGAL & KYC */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#FF5A36]" /> Legal Registration & Tax Compliance
              </h3>
              <p className="text-xs text-slate-500">
                Official business PAN/VAT details for tax invoices and statutory compliance in Nepal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PAN / VAT Registration No.</label>
                <input
                  type="text"
                  value={formData.vatPanNumber}
                  onChange={(e) => setFormData({ ...formData, vatPanNumber: e.target.value })}
                  placeholder="e.g. PAN-601294819"
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Legal Entity</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Private Limited">Private Limited (Pvt. Ltd.)</option>
                  <option value="Sole Proprietorship">Sole Proprietorship (Firm)</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Organic Cooperative">Organic Farm / Wellness Cooperative</option>
                  <option value="Individual Practitioner">Certified Yoga / Wellness Practitioner</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Registered Office Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Ward 3, Lazimpat Road, Kathmandu"
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-800">
                <strong>KYC Verified:</strong> Company documents verified by Care2Care Compliance Desk on 10 May 2025.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PAYOUTS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#FF5A36]" /> Payouts & Settlement Accounts
              </h3>
              <p className="text-xs text-slate-500">
                Choose how and where you receive automated weekly or on-demand settlements.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Settlement Gateway</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "esewa", label: "eSewa Wallet", color: "border-green-400 bg-green-50/50" },
                    { id: "khalti", label: "Khalti ID", color: "border-purple-400 bg-purple-50/50" },
                    { id: "bank", label: "Direct Bank", color: "border-blue-400 bg-blue-50/50" },
                    { id: "fonepay", label: "Fonepay QR", color: "border-red-400 bg-red-50/50" }
                  ].map((g) => {
                    const isSelected = formData.payoutMethod === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, payoutMethod: g.id as any })}
                        className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          isSelected ? `${g.color} ring-2 ring-[#FF5A36] text-slate-900` : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account ID / Number / Phone</label>
                <input
                  type="text"
                  value={formData.payoutAccount}
                  onChange={(e) => setFormData({ ...formData, payoutAccount: e.target.value })}
                  placeholder="e.g. 9812345678 or Nabil Bank A/C 01200000000000"
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LOGISTICS */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF5A36]" /> Shipping Rates & Logistics SLA
              </h3>
              <p className="text-xs text-slate-500">
                Configure delivery rates, free shipping criteria, and partner carriers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Standard Flat Shipping (NPR)</label>
                <input
                  type="number"
                  value={formData.flatShippingCharge}
                  onChange={(e) => setFormData({ ...formData, flatShippingCharge: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Free Shipping Threshold (NPR)</label>
                <input
                  type="number"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Enable Free In-Store Pickup (Kathmandu)</span>
                <input
                  type="checkbox"
                  checked={formData.enableLocalPickup}
                  onChange={(e) => setFormData({ ...formData, enableLocalPickup: e.target.checked })}
                  className="w-4 h-4 accent-[#FF5A36] rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOMAIN */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FF5A36]" /> Online Store Subdomain & Web Address
              </h3>
              <p className="text-xs text-slate-500">
                Your direct shopping link accessible worldwide with instant checkout.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Storefront URL</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-orange-50/40 border border-orange-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Preview live at: <span className="font-bold text-[#FF5A36]">https://{formData.subdomain}</span>
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Buttons */}
        <div className="pt-3 border-t border-orange-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </>
              )}
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shadow-orange-500/25 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleSave();
                  onNavigate("storefront_preview");
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publish Storefront</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
