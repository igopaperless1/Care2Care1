import React, { useState } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Shield,
  Star,
  Plus,
  Edit2,
  Save,
  Sparkles,
  DollarSign,
  Globe,
  Tag
} from "lucide-react";

interface PlansAndPricingPageProps {
  showToast?: (msg: string) => void;
}

interface PlanItem {
  id: string;
  name: string;
  priceNPR: number;
  priceUSD: number;
  period: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  activeSubscribers: number;
  status: "Active" | "Draft" | "Archived";
}

const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "plan-free",
    name: "Free Forever",
    priceNPR: 0,
    priceUSD: 0,
    period: "Lifetime",
    features: [
      "Basic Water, Walk & Steps Tracker",
      "1 Patient / Family Profile",
      "Manual Local Storage Backup",
      "Standard Reminders & Alarms"
    ],
    activeSubscribers: 16838,
    status: "Active"
  },
  {
    id: "plan-monthly",
    name: "Premium Monthly",
    priceNPR: 500,
    priceUSD: 4.99,
    period: "per month",
    isPopular: false,
    features: [
      "All 46+ Life & Health Services",
      "Up to 5 Family Sub-Accounts",
      "Real-time Supabase Cloud Sync",
      "Medical PDF Report Generator",
      "Priority SOS Emergency Relay"
    ],
    activeSubscribers: 3420,
    status: "Active"
  },
  {
    id: "plan-annual",
    name: "Premium Annual (Best Value)",
    priceNPR: 5000,
    priceUSD: 44.99,
    period: "per year (2 Months Free)",
    badge: "Most Popular",
    isPopular: true,
    features: [
      "Everything in Premium Monthly",
      "Up to 10 Family & Dependent Profiles",
      "24/7 AI Medical & Health Consultation",
      "Custom Store & Retail POS Module",
      "Zero Ads & Priority Support"
    ],
    activeSubscribers: 4422,
    status: "Active"
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Clinic / Care Home",
    priceNPR: 25000,
    priceUSD: 199.99,
    period: "per month",
    badge: "Organizations",
    features: [
      "Unlimited Caregivers & Patients",
      "Multi-Tenant Workspace & Staff Payroll",
      "Custom IRD Tax & VAT Invoice Billing",
      "Dedicated Database & SLA Guarantee",
      "White-label Branding & Custom Domain"
    ],
    activeSubscribers: 240,
    status: "Active"
  }
];

export const PlansAndPricingPage: React.FC<PlansAndPricingPageProps> = ({ showToast }) => {
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);
  const [currency, setCurrency] = useState<"NPR" | "USD">("NPR");
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  const handleSavePlan = () => {
    if (!editingPlan) return;
    setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
    setEditingPlan(null);
    if (showToast) showToast(`Plan "${editingPlan.name}" updated successfully!`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#FFF9F5] dark:bg-[#131d38] border border-orange-200/80 dark:border-[#1e294b] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                Monetization & Plans
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                7,842 Active Paid Subs
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Subscription Plans & Pricing Matrix
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <div className="bg-white dark:bg-[#1a274c] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center shadow-xs">
            <button
              onClick={() => setCurrency("NPR")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                currency === "NPR"
                  ? "bg-[#FF5A36] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              NPR (Rs.)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                currency === "USD"
                  ? "bg-[#FF5A36] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isSelected = editingPlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-5 border flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? "bg-gradient-to-b from-orange-50/70 to-white dark:from-[#1e294b] dark:to-[#131d38] border-orange-300 dark:border-orange-500 shadow-md scale-102"
                  : "bg-white dark:bg-[#131d38] border-slate-200/80 dark:border-[#1e294b] shadow-xs hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5A36] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 dark:text-white">{plan.name}</h3>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-[#FF5A36] hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {currency === "NPR"
                        ? plan.priceNPR === 0
                          ? "Free"
                          : `NPR ${plan.priceNPR.toLocaleString()}`
                        : plan.priceUSD === 0
                        ? "Free"
                        : `$${plan.priceUSD}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">{plan.period}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Included Features:
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Active Users:</span>
                <span className="font-black text-[#FF5A36]">{plan.activeSubscribers.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d38] w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Plan: {editingPlan.name}</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Price NPR (Rs.)</label>
                  <input
                    type="number"
                    value={editingPlan.priceNPR}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceNPR: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Price USD ($)</label>
                  <input
                    type="number"
                    value={editingPlan.priceUSD}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceUSD: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Billing Period Tag</label>
                <input
                  type="text"
                  value={editingPlan.period}
                  onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl font-black text-xs shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
