import React, { useState } from "react";
import {
  Users,
  Shield,
  Activity,
  DollarSign,
  Lock,
  Database,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  TrendingUp,
  Key,
  Smartphone,
  Server,
  Download,
  Terminal,
  RefreshCw,
  LogOut,
  Sliders,
  Bell,
  CreditCard,
  Tv,
  HelpCircle,
  ExternalLink
} from "lucide-react";

import { getSavedSupabaseConfig, saveSupabaseConfig, SUPABASE_SQL_SCHEMA_FULL } from "../lib/supabase";
import { getSavedPaddleConfig, savePaddleConfig, PADDLE_WEBHOOK_SETUP_GUIDE } from "../lib/paddle";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "Free" | "Premium" | "Family" | "Enterprise";
  status: "Active" | "Suspended";
  createdAt: string;
  lastLogin: string;
}

interface AdminDashboardProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onCloseAdmin?: () => void;
}

const DEMO_USERS: UserAccount[] = [
  {
    id: "usr-1",
    name: "Admin Superuser",
    email: "admin@care2care.org",
    role: "admin",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2026-01-01",
    lastLogin: "Just now"
  },
  {
    id: "usr-2",
    name: "Eleanor Vance",
    email: "eleanor.vance@family.com",
    role: "user",
    plan: "Family",
    status: "Active",
    createdAt: "2026-02-14",
    lastLogin: "2 hours ago"
  },
  {
    id: "usr-3",
    name: "Dr. Robert Sterling",
    email: "robert.sterling@clinic.org",
    role: "user",
    plan: "Enterprise",
    status: "Active",
    createdAt: "2026-03-10",
    lastLogin: "Yesterday"
  },
  {
    id: "usr-4",
    name: "Marcus Miller",
    email: "marcus.miller@gmail.com",
    role: "user",
    plan: "Free",
    status: "Active",
    createdAt: "2026-05-01",
    lastLogin: "3 days ago"
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onCloseAdmin
}) => {
  const [users, setUsers] = useState<UserAccount[]>(DEMO_USERS);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "supabase" | "paddle" | "ads" | "prompt_export">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Credentials State
  const [supabaseConfig, setSupabaseConfig] = useState(getSavedSupabaseConfig());
  const [paddleConfig, setPaddleConfig] = useState(getSavedPaddleConfig());

  const [supUrl, setSupUrl] = useState(supabaseConfig.url);
  const [supKey, setSupKey] = useState(supabaseConfig.anonKey);

  const [padToken, setPadToken] = useState(paddleConfig.clientToken);
  const [padVendor, setPadVendor] = useState(paddleConfig.vendorId);

  // AdMob State
  const [admobEnabled, setAdmobEnabled] = useState(true);
  const [interstitialFrequency, setInterstitialFrequency] = useState("1x per session");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
    showToast("User status updated successfully!");
  };

  const changeUserRole = (userId: string, newRole: "user" | "admin") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast("User role updated successfully!");
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSupabaseConfig(supUrl, supKey);
    setSupabaseConfig(updated);
    showToast("Supabase credentials saved!");
  };

  const handleSavePaddle = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = savePaddleConfig(padToken, padVendor);
    setPaddleConfig(updated);
    showToast("Paddle configuration saved!");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PROJECT_SPEC_EXPORT = `Care2Care Project Architecture Specification for DeepSeek & Supabase:
- Frontend: React 18, Vite, Tailwind CSS, TypeScript
- Authentication: Dual Role (User Dashboard & Admin Dashboard)
- Database: Supabase PostgreSQL
- Tables: profiles, patients, vitals_logs, water_logs, medications, staff_payroll
- Billing Gateway: Paddle SDK Subscriptions (Free, Premium $4.99/mo, Family $9.99/mo, Enterprise $29.99/mo)
- Ads Engine: AdMob (Banner, Interstitial 1x/session, Native, Rewarded) - Auto-removed on Paid Tiers`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* ADMIN HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md">
                Admin Control Panel
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                {supabaseConfig.isConnected ? "Supabase Connected" : "Local State Mode"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              System Administration & API Gateway
            </h1>
            <p className="text-xs text-indigo-200 font-medium">
              Logged in as <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onCloseAdmin && (
              <button
                onClick={onCloseAdmin}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl transition-all cursor-pointer border border-slate-700"
              >
                Switch to User Dashboard 👤
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap bg-slate-900/90 p-1.5 rounded-2xl border border-indigo-800/80 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "overview" ? "bg-indigo-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "users" ? "bg-indigo-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("supabase")}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "supabase" ? "bg-indigo-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" /> Supabase DB
          </button>
          <button
            onClick={() => setActiveTab("paddle")}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "paddle" ? "bg-indigo-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Paddle Billing
          </button>
          <button
            onClick={() => setActiveTab("ads")}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "ads" ? "bg-indigo-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-cyan-400" /> AdMob Engine
          </button>
          <button
            onClick={() => setActiveTab("prompt_export")}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "prompt_export" ? "bg-indigo-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" /> DeepSeek Details Prompt
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>Active Users</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">1,428</p>
              <p className="text-[10px] text-emerald-600 font-bold">↑ +14.2% from last month</p>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>SOS Dispatch Alerts</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">38</p>
              <p className="text-[10px] text-slate-500 font-bold">100% Geo-routed accurately</p>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>Paddle ARR Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">$12,840</p>
              <p className="text-[10px] text-emerald-600 font-bold">Family & Enterprise tiers</p>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
                <span>AdMob Ad Impressions</span>
                <Tv className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">48.2k</p>
              <p className="text-[10px] text-slate-500 font-bold">Free tier ad engine active</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">System Health & Services Operational Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200">
                🟢 Geo SOS Dispatch Engine: 100% Operational
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200">
                🟢 40+ Calendar Engine: 100% Operational
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200">
                🟢 Supabase PostgreSQL Sync: {supabaseConfig.isConnected ? "Live Connected" : "Local Mode"}
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200">
                🟢 Paddle Payment Gateway: {paddleConfig.isConfigured ? "Live Configured" : "Sandbox Test Mode"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h3 className="font-black text-slate-900 text-sm">Registered Accounts & Access Controls</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-black text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Subscription</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <p className="font-black text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value as any)}
                        className={`p-1 rounded-lg font-extrabold text-[10px] cursor-pointer border ${
                          u.role === "admin" ? "bg-indigo-100 text-indigo-900 border-indigo-300" : "bg-slate-100 text-slate-800 border-slate-300"
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border">
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        u.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{u.lastLogin}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-3 py-1.5 rounded-xl font-black text-[10px] cursor-pointer transition-colors ${
                          u.status === "Active"
                            ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUPABASE DB */}
      {activeTab === "supabase" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <form onSubmit={handleSaveSupabase} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-black text-slate-900 text-xs flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Live Supabase API Credentials Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Supabase URL</label>
                <input
                  type="text"
                  value={supUrl}
                  onChange={(e) => setSupUrl(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Supabase Anon Key</label>
                <input
                  type="text"
                  value={supKey}
                  onChange={(e) => setSupKey(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Save & Test Supabase Connection
            </button>
          </form>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-slate-900 text-xs">PostgreSQL Full DDL SQL Schema Script</h4>
              <button
                onClick={() => copyToClipboard(SUPABASE_SQL_SCHEMA_FULL, "Supabase SQL Script")}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" /> Copy SQL Script
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-indigo-200 rounded-xl font-mono text-[10px] whitespace-pre-wrap max-h-60 overflow-y-auto">
              {SUPABASE_SQL_SCHEMA_FULL}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: PADDLE BILLING */}
      {activeTab === "paddle" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <form onSubmit={handleSavePaddle} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-black text-slate-900 text-xs flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Paddle Payment Gateway Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Client Token</label>
                <input
                  type="text"
                  value={padToken}
                  onChange={(e) => setPadToken(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vendor ID</label>
                <input
                  type="text"
                  value={padVendor}
                  onChange={(e) => setPadVendor(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Save Paddle Configuration
            </button>
          </form>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-slate-900 text-xs">Paddle Express Webhook Server Script</h4>
              <button
                onClick={() => copyToClipboard(PADDLE_WEBHOOK_SETUP_GUIDE, "Paddle Webhook Script")}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Webhook Script
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-[10px] whitespace-pre-wrap max-h-48 overflow-y-auto">
              {PADDLE_WEBHOOK_SETUP_GUIDE}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: ADMOB AD ENGINE */}
      {activeTab === "ads" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">AdMob Ad Placement Rules & Frequency Control</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Banner Ads (Free Tier Only)</h4>
              <p className="text-[11px] text-slate-500">Rendered at top/bottom of main screens. Rotates every 30 seconds.</p>
              <div className="p-2 bg-slate-200 rounded-xl font-mono text-[10px]">
                Unit ID: ca-app-pub-3940256099942544/6300978111
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Interstitial Ads (1x per Session)</h4>
              <p className="text-[11px] text-slate-500">Triggered after saving logs or navigating pages. 5-sec countdown skip.</p>
              <div className="p-2 bg-slate-200 rounded-xl font-mono text-[10px]">
                Unit ID: ca-app-pub-3940256099942544/1033173712
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200">
            ✅ <span className="font-bold">Ad Removal Rule:</span> Upgrading to Premium ($4.99/mo), Family ($9.99/mo), or Enterprise ($29.99/mo) automatically suppresses all banner and interstitial ads for the user!
          </div>
        </div>
      )}

      {/* TAB 6: PROMPT EXPORT FOR DEEPSEEK */}
      {activeTab === "prompt_export" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-slate-900 text-sm">DeepSeek Architecture Prompt Exporter</h3>
              <p className="text-slate-500 text-[11px]">Copy this formatted prompt to send to DeepSeek or external AI tools for further backend extensions!</p>
            </div>
            <button
              onClick={() => copyToClipboard(PROJECT_SPEC_EXPORT, "DeepSeek Specification Prompt")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Copy className="w-4 h-4" /> Copy Spec Prompt
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-emerald-300 rounded-2xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-slate-800">
            {PROJECT_SPEC_EXPORT}
          </pre>
        </div>
      )}
    </div>
  );
};
