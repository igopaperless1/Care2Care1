import React, { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Star,
  X,
  Lock,
  ExternalLink,
  HelpCircle,
  Copy,
  Check,
  FileCode,
  Building2,
  QrCode
} from "lucide-react";
import { getSavedPaddleConfig, savePaddleConfig, PaddleConfig, REFINED_CARE2CARE_PADDLE_PROMPT } from "../lib/paddle";
import { ManualPaymentWizardModal } from "./ManualPaymentWizardModal";

interface PaddlePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionSuccess: (plan: "Free" | "Premium" | "Family" | "Enterprise") => void;
  currentPlan: string;
}

export const PaddlePaymentModal: React.FC<PaddlePaymentModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionSuccess,
  currentPlan
}) => {
  const [paddleConfig, setPaddleConfig] = useState<PaddleConfig>(getSavedPaddleConfig());
  const [activeTab, setActiveTab] = useState<"checkout" | "config" | "prompt">("checkout");
  const [selectedTier, setSelectedTier] = useState<"Premium" | "Family" | "Enterprise">("Family");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const [clientTokenInput, setClientTokenInput] = useState(paddleConfig.clientToken);
  const [vendorIdInput, setVendorIdInput] = useState(paddleConfig.vendorId);
  const [environmentInput, setEnvironmentInput] = useState<"sandbox" | "production">(paddleConfig.environment);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [selectedGateway, setSelectedGateway] = useState<"esewa" | "khalti" | "fonepay" | "imepay" | "paddle">("esewa");
  const [walletPhone, setWalletPhone] = useState("9841000000");
  const [isManualWizardOpen, setIsManualWizardOpen] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(REFINED_CARE2CARE_PADDLE_PROMPT);
    setCopiedPrompt(true);
    showToast("Refined Paddle Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = savePaddleConfig(clientTokenInput, vendorIdInput, environmentInput);
    setPaddleConfig(updated);
    showToast("Paddle configuration saved successfully!");
  };

  const handleSimulatePaymentCheckout = () => {
    if (selectedGateway === "paddle") {
      showToast("⏳ International Gateway (Paddle / Cards) is Coming Soon! Please select eSewa, Khalti, or Fonepay.");
      return;
    }

    setIsProcessing(true);
    const gatewayNames = { esewa: "eSewa Direct", khalti: "Khalti Wallet", fonepay: "Fonepay QR", imepay: "IME Pay / ConnectIPS" };
    setTimeout(() => {
      setIsProcessing(false);
      onSubscriptionSuccess(selectedTier);
      showToast(`✅ Paid via ${gatewayNames[selectedGateway]}! Upgraded to Care2Care ${selectedTier} tier (${billingCycle}).`);
      onClose();
    }, 1200);
  };

  const getPriceDisplay = (tier: "Premium" | "Family" | "Enterprise") => {
    if (tier === "Premium") {
      return billingCycle === "monthly" ? "$4.99 / mo" : "$49.99 / yr (Save 17%)";
    }
    if (tier === "Family") {
      return billingCycle === "monthly" ? "$9.99 / mo" : "$99.99 / yr (Save 17%)";
    }
    return billingCycle === "monthly" ? "$29.99 / mo" : "$299.99 / yr (Save 17%)";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 relative flex justify-between items-start shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
              Paddle Payment Gateway Integration
            </span>
            <h2 className="text-xl font-black text-white">
              Upgrade Subscription & Remove All Ads
            </h2>
            <p className="text-xs text-indigo-200">
              Current Active Plan: <span className="font-bold text-amber-300">{currentPlan}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-100 p-1 border-b text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("checkout")}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "checkout" ? "bg-white text-indigo-900 font-black shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            💳 Select Plan & Checkout
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "prompt" ? "bg-white text-indigo-900 font-black shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📋 Refined Paddle Prompt
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "config" ? "bg-white text-indigo-900 font-black shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ⚙️ Paddle API Setup
          </button>
        </div>

        {/* TAB 1: CHECKOUT & TIERS */}
        {activeTab === "checkout" && (
          <div className="p-6 space-y-5 text-xs overflow-y-auto">
            {/* Monthly / Yearly Toggle */}
            <div className="flex justify-center items-center gap-3 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-xl font-black cursor-pointer transition-all ${
                  billingCycle === "monthly" ? "bg-white text-indigo-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-xl font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly" ? "bg-indigo-900 text-amber-300 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                  Save ~17%
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* PREMIUM */}
              <div
                onClick={() => setSelectedTier("Premium")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
                  selectedTier === "Premium"
                    ? "bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900">Premium Single</h4>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-base font-black text-indigo-900">
                  {billingCycle === "monthly" ? "$4.99" : "$49.99"}
                  <span className="text-[10px] text-slate-500 font-normal"> /{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
                <ul className="text-[10px] space-y-1 text-slate-600 font-medium">
                  <li>✓ 100% Ad-Free</li>
                  <li>✓ Single Caregiver</li>
                  <li>✓ Gemini AI Vitals Insights</li>
                  <li>✓ 7-Day Free Trial</li>
                </ul>
              </div>

              {/* FAMILY */}
              <div
                onClick={() => setSelectedTier("Family")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
                  selectedTier === "Family"
                    ? "bg-indigo-900 text-white border-indigo-900 ring-2 ring-amber-400"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  Best Value
                </span>
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-amber-300">Family Suite</h4>
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </div>
                <div className="text-base font-black text-white">
                  {billingCycle === "monthly" ? "$9.99" : "$99.99"}
                  <span className="text-[10px] text-indigo-200 font-normal"> /{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
                <ul className="text-[10px] space-y-1 text-indigo-100 font-medium">
                  <li>✓ 100% Ad-Free for All</li>
                  <li>✓ Up to 5 Member Accounts</li>
                  <li>✓ Staff Payroll & Attendance</li>
                  <li>✓ 7-Day Free Trial</li>
                </ul>
              </div>

              {/* ENTERPRISE */}
              <div
                onClick={() => setSelectedTier("Enterprise")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
                  selectedTier === "Enterprise"
                    ? "bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900">Enterprise Clinic</h4>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-base font-black text-indigo-900">
                  {billingCycle === "monthly" ? "$29.99" : "$299.99"}
                  <span className="text-[10px] text-slate-500 font-normal"> /{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
                <ul className="text-[10px] space-y-1 text-slate-600 font-medium">
                  <li>✓ 100% Ad-Free</li>
                  <li>✓ Unlimited Senior Patients</li>
                  <li>✓ Dedicated Account Mgr</li>
                  <li>✓ 7-Day Free Trial</li>
                </ul>
              </div>
            </div>

            {/* PAYMENT GATEWAY SELECTION */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-800 text-xs">Select Payment Method (भुक्तानीको माध्यम):</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Instant Verification
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* ESEWA */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway("esewa")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedGateway === "esewa"
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-xs">eSewa</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${selectedGateway === "esewa" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                      Accepted
                    </span>
                  </div>
                  <p className={`text-[10px] ${selectedGateway === "esewa" ? "text-emerald-100" : "text-slate-500"}`}>
                    eSewa Wallet / QR
                  </p>
                </button>

                {/* KHALTI */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway("khalti")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedGateway === "khalti"
                      ? "bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-400"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-xs">Khalti</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${selectedGateway === "khalti" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-800"}`}>
                      Accepted
                    </span>
                  </div>
                  <p className={`text-[10px] ${selectedGateway === "khalti" ? "text-purple-100" : "text-slate-500"}`}>
                    Khalti SDK / Web
                  </p>
                </button>

                {/* FONEPAY */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway("fonepay")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedGateway === "fonepay"
                      ? "bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-xs">Fonepay</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${selectedGateway === "fonepay" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800"}`}>
                      Accepted
                    </span>
                  </div>
                  <p className={`text-[10px] ${selectedGateway === "fonepay" ? "text-rose-100" : "text-slate-500"}`}>
                    Fonepay Direct QR
                  </p>
                </button>

                {/* IME PAY / CONNECTIPS */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway("imepay")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedGateway === "imepay"
                      ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-400"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-xs">IME Pay</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${selectedGateway === "imepay" ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-800"}`}>
                      Accepted
                    </span>
                  </div>
                  <p className={`text-[10px] ${selectedGateway === "imepay" ? "text-cyan-100" : "text-slate-500"}`}>
                    ConnectIPS / Wallet
                  </p>
                </button>
              </div>

              {/* INTERNATIONAL GATEWAYS - COMING SOON */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">⏳</span>
                  <div>
                    <p className="font-bold text-xs">International Gateways (Paddle / Stripe / Visa / Mastercard)</p>
                    <p className="text-[10px] text-amber-700">Currently in sandbox mode • International card processing coming soon</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGateway("paddle")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer border ${
                    selectedGateway === "paddle"
                      ? "bg-amber-600 text-white border-amber-700"
                      : "bg-white text-amber-800 border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  {selectedGateway === "paddle" ? "Selected (Coming Soon)" : "Select Coming Soon"}
                </button>
              </div>

              {/* MANUAL BANK TRANSFER / OFFLINE QR OPTION */}
              <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-indigo-950 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-indigo-900 text-amber-300 rounded-xl">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-extrabold text-xs">Offline Bank Transfer & UPI QR</p>
                    <p className="text-[10px] text-indigo-700">Pay directly to Bank Account or UPI and upload receipt proof</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManualWizardOpen(true)}
                  className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Manual Pay Wizard</span>
                </button>
              </div>

              {/* WALLET INPUT FORM IF LOCAL GATEWAY */}
              {selectedGateway !== "paddle" && (
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5 uppercase">
                      Registered Mobile / Wallet ID ({selectedGateway.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full text-xs p-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500">Instant OTP Verification</p>
                    <span className="text-[11px] font-bold text-emerald-600">No Extra Convenience Fee</span>
                  </div>
                </div>
              )}
            </div>

            {/* CHECKOUT CALL TO ACTION */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-300">
                    Selected Tier: <span className="text-amber-300 font-black">{selectedTier} ({billingCycle})</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Gateway: <span className="text-emerald-300 font-bold capitalize">{selectedGateway} Direct Pay</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Billed</p>
                  <p className="text-base font-black text-emerald-400">
                    {getPriceDisplay(selectedTier)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulatePaymentCheckout}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-98"
              >
                {isProcessing ? (
                  <span>Authenticating Gateway & Processing...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>
                      {selectedGateway === "paddle"
                        ? "Pay via Paddle (Coming Soon ⏳)"
                        : `Pay Now with ${selectedGateway.toUpperCase()} Wallet`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REFINED PROMPT FOR PADDLE INTEGRATION */}
        {activeTab === "prompt" && (
          <div className="p-6 space-y-4 text-xs overflow-y-auto">
            <div className="p-3.5 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <div>
                <h4 className="font-black text-emerald-900 text-xs">Care2Care Paddle Sandbox Catalog Prompt</h4>
                <p className="text-[10px] text-emerald-800">
                  Refined prompt configured for Care2Care pricing, lowest denomination strings, 7-day trials, and country price overrides.
                </p>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt ? "Copied!" : "Copy Prompt"}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-emerald-300 rounded-2xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap border border-slate-800 max-h-72 overflow-y-auto">
              {REFINED_CARE2CARE_PADDLE_PROMPT}
            </pre>
          </div>
        )}

        {/* TAB 3: PADDLE API CONFIGURATION */}
        {activeTab === "config" && (
          <form onSubmit={handleSaveConfig} className="p-6 space-y-4 text-xs overflow-y-auto">
            <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-200">
              💡 <span className="font-black">Paddle Configuration Instructions:</span> Enter your Paddle Vendor ID & Client Token from the Paddle Dashboard (or use defaults for sandbox testing).
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Paddle Client Token (Public)</label>
              <input
                type="text"
                value={clientTokenInput}
                onChange={(e) => setClientTokenInput(e.target.value)}
                placeholder="test_73a98f7129b01c238491..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Paddle Vendor / Account ID</label>
              <input
                type="text"
                value={vendorIdInput}
                onChange={(e) => setVendorIdInput(e.target.value)}
                placeholder="104859"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gateway Environment</label>
              <select
                value={environmentInput}
                onChange={(e) => setEnvironmentInput(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="sandbox">Sandbox (Testing)</option>
                <option value="production">Production (Live)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
            >
              Save Paddle Configuration
            </button>
          </form>
        )}
      </div>

      {/* MANUAL PAYMENT WIZARD MODAL */}
      <ManualPaymentWizardModal
        isOpen={isManualWizardOpen}
        onClose={() => setIsManualWizardOpen(false)}
        selectedPlan={selectedTier}
        planPrice={
          selectedTier === "Premium"
            ? billingCycle === "monthly" ? 4.99 : 49.99
            : selectedTier === "Family"
            ? billingCycle === "monthly" ? 9.99 : 99.99
            : billingCycle === "monthly" ? 29.99 : 299.99
        }
        billingCycle={billingCycle}
        onSuccess={() => {
          setIsManualWizardOpen(false);
          showToast(`⏳ Payment request submitted! Pending Admin Verification.`);
          onClose();
        }}
      />
    </div>
  );
};

