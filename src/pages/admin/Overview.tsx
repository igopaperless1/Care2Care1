import React from "react";
import {
  Users,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Database,
  CreditCard,
  Tv,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  Send,
  DollarSign,
  Activity,
  FileCheck2,
  UserCheck
} from "lucide-react";
import { AdminConsoleMode } from "../../layouts/AdminLayout";

interface OverviewProps {
  consoleMode: AdminConsoleMode;
  onNavigateTab: (tab: any) => void;
  totalUsersCount: number;
  totalWorkspacesCount: number;
  pendingPayoutsCount: number;
  pendingPayrollCount: number;
  supabaseConnected: boolean;
  paddleConfigured: boolean;
}

export const OverviewPage: React.FC<OverviewProps> = ({
  consoleMode,
  onNavigateTab,
  totalUsersCount,
  totalWorkspacesCount,
  pendingPayoutsCount,
  pendingPayrollCount,
  supabaseConnected,
  paddleConfigured
}) => {
  return (
    <div className="space-y-6 pb-20">
      {/* MODE HEAD BANNER */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-900/60 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                {consoleMode === "superadmin" ? "Super Admin Executive Overview" : "Workspace / Business Owner Control Hub"}
              </span>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                Live Metrics
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {consoleMode === "superadmin" ? "Blessikaa Global Life OS Engine" : "Workspace Sub-Accounts & Operations"}
            </h1>
            <p className="text-xs text-indigo-200 font-medium">
              Real-time monitoring across Health Vitals, Retail POS, HR Payroll, Family Sub-Accounts & Finance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab("users")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Manage Users</span>
            </button>
            <button
              onClick={() => onNavigateTab("finance")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black rounded-2xl transition-all cursor-pointer border border-slate-700 flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Payouts Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI GRID (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: ACTIVE USERS */}
        <div
          onClick={() => onNavigateTab("users")}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Total Active Accounts</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{totalUsersCount || 1428}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-emerald-600 font-extrabold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span>Personal: 1,120</span>
            <span className="text-indigo-600">Business/Family: 308</span>
          </div>
        </div>

        {/* CARD 2: WORKSPACES & SUB-ACCOUNTS */}
        <div
          onClick={() => onNavigateTab("workspaces")}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Workspaces & Shops</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{totalWorkspacesCount || 184}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-indigo-600 font-extrabold">892 Sub-Accounts</span>
              <span className="text-slate-400">linked</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span>Retail Shops: 64</span>
            <span className="text-emerald-700">Families: 120</span>
          </div>
        </div>

        {/* CARD 3: PENDING ACTIONS */}
        <div
          onClick={() => onNavigateTab("finance")}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Pending Approvals</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">
              {pendingPayoutsCount + pendingPayrollCount || 35}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-amber-600 font-extrabold">{pendingPayoutsCount} Cash Payouts</span>
              <span className="text-slate-400">• {pendingPayrollCount} HR Clock-ins</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-amber-700 font-black">
            <span>Requires Action</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* CARD 4: SYSTEM HEALTH & AI QUOTA */}
        <div
          onClick={() => onNavigateTab("system")}
          className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>System Health & AI</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>99.9% Online</span>
            </p>
            <p className="text-[11px] text-slate-500 font-bold mt-1">
              Gemini AI: 14.8k calls / day
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span>Supabase: {supabaseConnected ? "Active ✓" : "Local"}</span>
            <span>Paddle: {paddleConfigured ? "Ready ✓" : "Demo"}</span>
          </div>
        </div>
      </div>

      {/* API GATEWAYS & SYSTEM SERVICES ROW */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2E7D32]" />
            <span>Core API Gateways & Service Status</span>
          </h2>
          <button
            onClick={() => onNavigateTab("system")}
            className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
          >
            Manage Configurations →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Supabase Cloud DB</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                supabaseConnected ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
              }`}>
                {supabaseConnected ? "CONNECTED" : "LOCAL CACHE"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time synchronization for Vitals, Payroll, Retail inventory & family tree data.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Paddle Billing Gateway</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                paddleConfigured ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {paddleConfigured ? "LIVE READY" : "SANDBOX / DEMO"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Subscriptions for Free, Premium ($4.99), Family ($9.99), and Enterprise ($29.99) plans.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Tv className="w-4 h-4 text-cyan-600" />
                <span>AdMob Monetization</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-100 text-cyan-800">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Interstitial frequency: 1x per session. Automatically disabled for paid subscribers.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab("workspaces")}
          className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl shadow-md hover:scale-[1.01] transition-all cursor-pointer text-left space-y-2 border border-emerald-700/50 group"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-white/10 rounded-2xl">
              <Plus className="w-5 h-5 text-emerald-300" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="font-black text-sm">Onboard New Workspace / Shop</p>
            <p className="text-xs text-emerald-100/80 font-medium mt-0.5">
              Generate invite link & set custom sub-account limits.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("system")}
          className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl shadow-md hover:scale-[1.01] transition-all cursor-pointer text-left space-y-2 border border-indigo-700/50 group"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-white/10 rounded-2xl">
              <Send className="w-5 h-5 text-indigo-300" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="font-black text-sm">Send Global Alert Broadcast</p>
            <p className="text-xs text-indigo-100/80 font-medium mt-0.5">
              Send system announcements directly to all user apps.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("finance")}
          className="p-5 bg-gradient-to-r from-amber-800 to-slate-900 text-white rounded-3xl shadow-md hover:scale-[1.01] transition-all cursor-pointer text-left space-y-2 border border-amber-700/50 group"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 bg-white/10 rounded-2xl">
              <DollarSign className="w-5 h-5 text-amber-300" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <p className="font-black text-sm">Process Cash Payout Requests</p>
            <p className="text-xs text-amber-100/80 font-medium mt-0.5">
              Review and mark retail sales withdrawals as completed.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
