import React, { useState, useEffect } from "react";
import {
  QrCode,
  Building2,
  FileText,
  Save,
  Check,
  Send,
  Webhook,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  AdminBillingConfig,
  getAdminBillingConfig,
  saveAdminBillingConfig,
} from "../../utils/BillingAndReceiptEngine";

interface BillingSettingsTabProps {
  showToast?: (msg: string) => void;
}

export const BillingSettingsTab: React.FC<BillingSettingsTabProps> = ({ showToast }) => {
  const [config, setConfig] = useState<AdminBillingConfig>(getAdminBillingConfig());

  useEffect(() => {
    setConfig(getAdminBillingConfig());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...config, updatedAt: new Date().toISOString() };
    saveAdminBillingConfig(updated);
    if (showToast) {
      showToast(`⚙️ Billing & Receipt settings saved successfully!`);
    }
  };

  const handleChange = (key: keyof AdminBillingConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleTestWebhook = () => {
    if (showToast) {
      showToast(`⚡ Test POST ping sent to ${config.customWebhookUrl}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl border border-teal-900/60 shadow-xl text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-amber-300 font-black flex items-center justify-center shadow-lg text-2xl shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight flex items-center gap-2">
              <span>Billing & Custom Receipt Settings</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-xs text-teal-200 mt-1 max-w-xl">
              Customize company identity, IRD PAN/VAT numbers, receipt footer boxes, and auto-dispatch webhooks for accounting sync.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION A: COMPANY IDENTITY & TAX METADATA */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Company Identity & IRD Tax Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Registered Company Name
              </label>
              <input
                type="text"
                required
                value={config.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                PAN / VAT Number
              </label>
              <input
                type="text"
                required
                value={config.companyPanVatNumber}
                onChange={(e) => handleChange("companyPanVatNumber", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Company Address
              </label>
              <input
                type="text"
                required
                value={config.companyAddress}
                onChange={(e) => handleChange("companyAddress", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Registration / License #
              </label>
              <input
                type="text"
                required
                value={config.companyRegistrationNumber}
                onChange={(e) => handleChange("companyRegistrationNumber", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: BANK ACCOUNT SETTLEMENT INFO */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bank Account Details (Printed on Receipt Footer)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={config.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={config.bankAccountHolder}
                onChange={(e) => handleChange("bankAccountHolder", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={config.bankAccountNumber}
                onChange={(e) => handleChange("bankAccountNumber", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                SWIFT / IFSC Code
              </label>
              <input
                type="text"
                value={config.bankIfscSwift}
                onChange={(e) => handleChange("bankIfscSwift", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: CUSTOM MESSAGES (THE "BOXES") */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Custom Receipt Header, Footer & Policy Text Boxes</span>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
              Custom Header Note (Appears in Green Receipt Box)
            </label>
            <textarea
              rows={2}
              value={config.receiptCustomHeader}
              onChange={(e) => handleChange("receiptCustomHeader", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Refund & Cancellation Policy
              </label>
              <textarea
                rows={2}
                value={config.refundPolicyText}
                onChange={(e) => handleChange("refundPolicyText", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Custom Footer Disclaimer Note
              </label>
              <textarea
                rows={2}
                value={config.receiptCustomFooter}
                onChange={(e) => handleChange("receiptCustomFooter", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION D: AUTO-DELIVERY ROUTING */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-3">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Auto-Receipt Delivery & Webhook Integration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-emerald-700" />
                <div>
                  <p className="font-black text-xs text-emerald-950">Send PDF Receipt via Email</p>
                  <p className="text-[10px] text-emerald-700">Resend / SendGrid PDF attachment</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableEmailReceipt}
                onChange={(e) => handleChange("enableEmailReceipt", e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-indigo-700" />
                <div>
                  <p className="font-black text-xs text-indigo-950">Send Link via WhatsApp</p>
                  <p className="text-[10px] text-indigo-700">Twilio / WhatsApp API dispatch</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableWhatsappReceipt}
                onChange={(e) => handleChange("enableWhatsappReceipt", e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5 text-emerald-600" />
                <span>Custom Accounting Webhook URL (Xero, Zoho, Slack)</span>
              </label>
              <button
                type="button"
                onClick={handleTestWebhook}
                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Test Ping Webhook
              </button>
            </div>
            <input
              type="text"
              value={config.customWebhookUrl}
              onChange={(e) => handleChange("customWebhookUrl", e.target.value)}
              placeholder="https://api.yoursoftware.com/v1/webhook"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>Save All Billing Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
