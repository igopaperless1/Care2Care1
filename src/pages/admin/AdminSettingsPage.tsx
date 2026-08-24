import React, { useState } from "react";
import {
  Settings,
  QrCode,
  Globe,
  FileText,
  Shield,
  Server,
  Save,
  CheckCircle2,
  Lock,
  Building2,
  DollarSign
} from "lucide-react";
import { PaymentSettingsTab } from "../../components/admin/PaymentSettingsTab";
import { InternationalBillingTab } from "../../components/admin/InternationalBillingTab";
import { BillingSettingsTab } from "../../components/admin/BillingSettingsTab";

interface AdminSettingsPageProps {
  showToast?: (msg: string) => void;
  onSendGlobalBroadcast?: (title: string, message: string) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({
  showToast,
  onSendGlobalBroadcast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "payment_settings" | "international_billing" | "billing_settings" | "general"
  >("payment_settings");

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                System Engine Configuration
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Administrative & Financial Settings
            </h1>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="bg-white dark:bg-[#1a274c] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("payment_settings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "payment_settings"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Bank & QR</span>
          </button>
          <button
            onClick={() => setActiveSubTab("international_billing")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "international_billing"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Stripe / Khalti</span>
          </button>
          <button
            onClick={() => setActiveSubTab("billing_settings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "billing_settings"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>IRD Tax & VAT</span>
          </button>
          <button
            onClick={() => setActiveSubTab("general")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "general"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>General & Security</span>
          </button>
        </div>
      </div>

      {/* RENDER SUB-TAB */}
      {activeSubTab === "payment_settings" && <PaymentSettingsTab showToast={showToast} />}
      {activeSubTab === "international_billing" && <InternationalBillingTab showToast={showToast} />}
      {activeSubTab === "billing_settings" && <BillingSettingsTab showToast={showToast} />}
      {activeSubTab === "general" && (
        <div className="bg-white dark:bg-[#131d38] p-6 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs space-y-6">
          <h3 className="font-black text-base text-slate-900 dark:text-white">Platform Security & Retention Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Auto Inactivity Timeout</span>
              <p className="text-slate-500">Automatically logs out unprivileged sessions after 30 minutes of inactivity.</p>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Enforced</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">Supabase Real-time Cloud Sync</span>
              <p className="text-slate-500">Debounced AES-256 cloud sync enabled for all authenticated family records.</p>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Online & Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
