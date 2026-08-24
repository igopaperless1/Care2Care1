import React, { useState } from "react";
import {
  Users,
  Crown,
  Wallet,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Download,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Eye,
  MoreVertical,
  Globe,
  Droplets,
  Heart,
  Moon,
  Pill,
  Apple,
  Activity,
  UserPlus,
  FileSpreadsheet,
  Megaphone,
  Check,
  X,
  Trophy,
  Bell,
  Headset,
  FileText
} from "lucide-react";
import { AdminTab, UserAccount } from "../../types/adminTypes";

interface OverviewPageProps {
  onNavigateTab: (tab: AdminTab) => void;
  showToast?: (msg: string) => void;
  users?: UserAccount[];
  isDarkMode?: boolean;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateTab,
  showToast,
  isDarkMode = false
}) => {
  const [revenuePeriod, setRevenuePeriod] = useState("This Month");
  const [demographicsMode, setDemographicsMode] = useState("By Country");
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any | null>(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isExportReportsOpen, setIsExportReportsOpen] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"user" | "admin">("user");
  const [newUserPlan, setNewUserPlan] = useState<"Free" | "Premium" | "Family" | "Enterprise">("Premium");

  // Announcement State
  const [announcementMsg, setAnnouncementMsg] = useState("");

  // Verification Queue State
  const [verificationList, setVerificationList] = useState([
    { id: "v1", user: "Olivia Harris", amount: "NPR 500", proof: "/payment-qr-sample.png", status: "pending" },
    { id: "v2", user: "Liam Clark", amount: "NPR 5,000", proof: "/app-icon.jpg", status: "pending" },
    { id: "v3", user: "Emma White", amount: "NPR 500", proof: "/payment-qr-sample.png", status: "pending" },
    { id: "v4", user: "Noah Scott", amount: "NPR 5,000", proof: "/app-icon.jpg", status: "pending" }
  ]);

  const handleApproveVerification = (id: string, name: string) => {
    setVerificationList((prev) => prev.filter((item) => item.id !== id));
    if (showToast) showToast(`Payment for ${name} verified and subscription activated!`);
  };

  const handleRejectVerification = (id: string, name: string) => {
    setVerificationList((prev) => prev.filter((item) => item.id !== id));
    if (showToast) showToast(`Payment proof for ${name} marked as rejected.`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    if (showToast) showToast(`Account created for ${newUserName} (${newUserEmail})!`);
    setIsCreateUserOpen(false);
    setNewUserName("");
    setNewUserEmail("");
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg) return;
    if (showToast) showToast("Platform announcement broadcasted to all active devices!");
    setIsAnnouncementOpen(false);
    setAnnouncementMsg("");
  };

  const handleExportReport = (type: string) => {
    setIsExportReportsOpen(false);
    if (showToast) showToast(`Master ${type} Report generated and downloaded!`);
  };

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* 1. TOP STATS ROW & PLATFORM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 4 Main KPI Cards (Span 9 on lg) */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Platform Users */}
          <div
            onClick={() => onNavigateTab("users")}
            className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Platform Users</span>
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                24,680
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>12.5% from last month</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Active Premium Users */}
          <div
            onClick={() => onNavigateTab("plans_pricing")}
            className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Premium Users</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                7,842
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>9.3% from last month</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Current Month's Revenue */}
          <div
            onClick={() => onNavigateTab("transactions")}
            className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Month's Revenue</span>
              <div className="w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-[#FF5A36] flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                NPR 18,54,320
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>15.8% from last month</span>
              </div>
            </div>
          </div>

          {/* KPI 4: Total Active Services */}
          <div
            onClick={() => onNavigateTab("services")}
            className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Active Services</span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                42 <span className="text-sm font-bold text-slate-400">/ 46</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>2 new this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Health Widget (Span 3 on lg) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Platform Health</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Live
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Gauge */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="32" cy="32" r="28" stroke="#10B981" strokeWidth="5" strokeDasharray="175" strokeDashoffset="4" strokeLinecap="round" fill="transparent" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-black text-slate-900 dark:text-white block leading-none">98%</span>
                <span className="text-[8px] text-emerald-600 font-bold">Healthy</span>
              </div>
            </div>

            {/* Status list */}
            <div className="text-[11px] space-y-1 font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Server Status</span>
                <span className="text-emerald-600 text-[10px]">Operational</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Database</span>
                <span className="text-emerald-600 text-[10px]">Operational</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Storage</span>
                <span className="text-emerald-600 text-[10px]">Operational</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>API Services</span>
                <span className="text-emerald-600 text-[10px]">Operational</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Backup</span>
                <span className="text-emerald-600 text-[10px]">Up to date</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("system_health")}
            className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-black rounded-2xl transition-colors cursor-pointer text-center"
          >
            View System Health
          </button>
        </div>
      </div>

      {/* 2. QUICK ACTIONS & LIVE ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick Actions (Span 5 on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Quick Actions</span>
            <div className="relative">
              <button
                onClick={() => setIsExportReportsOpen(!isExportReportsOpen)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Export Reports</span>
                <Download className="w-3.5 h-3.5" />
              </button>
              {isExportReportsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a274c] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-30 text-xs font-bold space-y-1 animate-in zoom-in-95">
                  <button onClick={() => handleExportReport("Master PDF")} className="w-full text-left p-2 hover:bg-orange-50 dark:hover:bg-slate-700 rounded-xl">Master PDF Report</button>
                  <button onClick={() => handleExportReport("CSV Data")} className="w-full text-left p-2 hover:bg-orange-50 dark:hover:bg-slate-700 rounded-xl">Users & Revenue CSV</button>
                  <button onClick={() => handleExportReport("IRD Tax Audit")} className="w-full text-left p-2 hover:bg-orange-50 dark:hover:bg-slate-700 rounded-xl">IRD VAT Audit Report</button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsCreateUserOpen(true)}
              className="py-3 px-4 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Create New User</span>
            </button>

            <button
              onClick={() => {
                if (showToast) showToast("Bulk import wizard ready: drag & drop CSV or JSON");
              }}
              className="py-3 px-4 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bulk Import Data</span>
            </button>

            <button
              onClick={() => handleExportReport("Full Executive")}
              className="py-3 px-4 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Master Report</span>
            </button>

            <button
              onClick={() => setIsAnnouncementOpen(true)}
              className="py-3 px-4 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>Send Announcement</span>
            </button>
          </div>
        </div>

        {/* Live Activity Feed (Span 7 on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Live Activity Feed</span>
            <button
              onClick={() => onNavigateTab("user_activity")}
              className="text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-blue-500">💧</span>
                <span className="text-slate-800 dark:text-slate-200">
                  <strong className="font-bold">John Doe</strong> logged 2L of water
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  Health
                </span>
              </div>
              <span className="text-[11px] text-slate-400">2m ago</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500">💲</span>
                <span className="text-slate-800 dark:text-slate-200">
                  <strong className="font-bold">Jane Smith</strong> paid NPR 500 for Premium (Annual Plan)
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Payment
                </span>
              </div>
              <span className="text-[11px] text-slate-400">5m ago</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-purple-500">🧘</span>
                <span className="text-slate-800 dark:text-slate-200">
                  <strong className="font-bold">Mike Johnson</strong> completed 7-Day Yoga Challenge
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  Challenge
                </span>
              </div>
              <span className="text-[11px] text-slate-400">12m ago</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-amber-500">💊</span>
                <span className="text-slate-800 dark:text-slate-200">
                  <strong className="font-bold">Sarah Brown</strong> added new medicine reminder
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  Medicine
                </span>
              </div>
              <span className="text-[11px] text-slate-400">15m ago</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-indigo-500">👥</span>
                <span className="text-slate-800 dark:text-slate-200">
                  <strong className="font-bold">Robert Wilson</strong> created a new sub-account (Child)
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  User
                </span>
              </div>
              <span className="text-[11px] text-slate-400">25m ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT USERS TABLE & SERVICE USAGE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Users Table (Span 7 on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Recent Users</span>
            <button
              onClick={() => onNavigateTab("users")}
              className="text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer"
            >
              View All Users
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                <tr>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Plan Status</th>
                  <th className="pb-2">Coins</th>
                  <th className="pb-2">Last Active</th>
                  <th className="pb-2">Joined Date</th>
                  <th className="pb-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {/* User 1 */}
                <tr className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-[11px] flex items-center justify-center">
                      JD
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">John Doe</div>
                      <div className="text-[10px] text-slate-400">johndoe@gmail.com</div>
                    </div>
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600">User</span></td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">Premium</span></td>
                  <td className="font-bold text-amber-500">🪙 1,250</td>
                  <td className="text-slate-400">5m ago</td>
                  <td className="text-slate-400">12 May 2025</td>
                  <td className="text-center">
                    <button
                      onClick={() => setSelectedUserDetails({ name: "John Doe", email: "johndoe@gmail.com", role: "User", plan: "Premium", coins: 1250 })}
                      className="p-1 text-slate-400 hover:text-[#FF5A36] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>

                {/* User 2 */}
                <tr className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 font-bold text-[11px] flex items-center justify-center">
                      JS
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Jane Smith</div>
                      <div className="text-[10px] text-slate-400">jane.smith@gmail.com</div>
                    </div>
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600">User</span></td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Free</span></td>
                  <td className="font-bold text-amber-500">🪙 320</td>
                  <td className="text-slate-400">15m ago</td>
                  <td className="text-slate-400">10 May 2025</td>
                  <td className="text-center">
                    <button
                      onClick={() => setSelectedUserDetails({ name: "Jane Smith", email: "jane.smith@gmail.com", role: "User", plan: "Free", coins: 320 })}
                      className="p-1 text-slate-400 hover:text-[#FF5A36] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>

                {/* User 3 */}
                <tr className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 font-bold text-[11px] flex items-center justify-center">
                      MJ
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Mike Johnson</div>
                      <div className="text-[10px] text-slate-400">mike.johnson@gmail.com</div>
                    </div>
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600">User</span></td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">Premium</span></td>
                  <td className="font-bold text-amber-500">🪙 860</td>
                  <td className="text-slate-400">1h ago</td>
                  <td className="text-slate-400">08 May 2025</td>
                  <td className="text-center">
                    <button
                      onClick={() => setSelectedUserDetails({ name: "Mike Johnson", email: "mike.johnson@gmail.com", role: "User", plan: "Premium", coins: 860 })}
                      className="p-1 text-slate-400 hover:text-[#FF5A36] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>

                {/* User 4 */}
                <tr className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 font-bold text-[11px] flex items-center justify-center">
                      SB
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Sarah Brown</div>
                      <div className="text-[10px] text-slate-400">sarah.brown@gmail.com</div>
                    </div>
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600">Admin</span></td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">Premium</span></td>
                  <td className="font-bold text-amber-500">🪙 2,150</td>
                  <td className="text-slate-400">2h ago</td>
                  <td className="text-slate-400">05 May 2025</td>
                  <td className="text-center">
                    <button
                      onClick={() => setSelectedUserDetails({ name: "Sarah Brown", email: "sarah.brown@gmail.com", role: "Admin", plan: "Premium", coins: 2150 })}
                      className="p-1 text-slate-400 hover:text-[#FF5A36] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>

                {/* User 5 */}
                <tr className="hover:bg-orange-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-[11px] flex items-center justify-center">
                      RW
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Robert Wilson</div>
                      <div className="text-[10px] text-slate-400">robert.wilson@gmail.com</div>
                    </div>
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600">User</span></td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Free</span></td>
                  <td className="font-bold text-amber-500">🪙 150</td>
                  <td className="text-slate-400">3h ago</td>
                  <td className="text-slate-400">04 May 2025</td>
                  <td className="text-center">
                    <button
                      onClick={() => setSelectedUserDetails({ name: "Robert Wilson", email: "robert.wilson@gmail.com", role: "User", plan: "Free", coins: 150 })}
                      className="p-1 text-slate-400 hover:text-[#FF5A36] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Usage Overview & Top 5 Active Services (Span 5 on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Service Usage Overview</span>
            <button
              onClick={() => onNavigateTab("service_analytics")}
              className="text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer"
            >
              View All Services
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Donut Chart & Legend */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90">
                  {/* Segment 1: Green High (18/46 = ~39%) */}
                  <circle cx="56" cy="56" r="42" stroke="#10B981" strokeWidth="12" strokeDasharray="103 264" strokeDashoffset="0" fill="transparent" />
                  {/* Segment 2: Orange Moderate (16/46 = ~35%) */}
                  <circle cx="56" cy="56" r="42" stroke="#F59E0B" strokeWidth="12" strokeDasharray="92 264" strokeDashoffset="-103" fill="transparent" />
                  {/* Segment 3: Red/Coral Low (12/46 = ~26%) */}
                  <circle cx="56" cy="56" r="42" stroke="#EF4444" strokeWidth="12" strokeDasharray="69 264" strokeDashoffset="-195" fill="transparent" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-black text-slate-900 dark:text-white block leading-none">46</span>
                  <span className="text-[9px] text-slate-400 font-bold">Total Services</span>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 w-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>High Usage (1000+)</span>
                  <span className="text-slate-900 dark:text-white font-black">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Moderate (100 - 1000)</span>
                  <span className="text-slate-900 dark:text-white font-black">16</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Low Usage (&lt; 100)</span>
                  <span className="text-slate-900 dark:text-white font-black">12</span>
                </div>
              </div>
            </div>

            {/* Top 5 Active Services Table */}
            <div className="space-y-2 text-xs border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-4 pt-3 sm:pt-0">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">Top 5 Active Services</span>
              
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">1 &nbsp; Walk</span>
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">12,540 <ArrowUpRight className="w-3 h-3 text-emerald-500" /></span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">2 &nbsp; Water</span>
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">11,230 <ArrowUpRight className="w-3 h-3 text-emerald-500" /></span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">3 &nbsp; Sleep</span>
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">9,875 <ArrowUpRight className="w-3 h-3 text-emerald-500" /></span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">4 &nbsp; Medicine</span>
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">7,420 <ArrowUpRight className="w-3 h-3 text-emerald-500" /></span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">5 &nbsp; Nutrition</span>
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">6,890 <ArrowUpRight className="w-3 h-3 text-emerald-500" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM 4-PANEL ROW: Payment Requests, Revenue Overview, Demographics, Verification Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Payment Requests [12] */}
        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Payment Requests</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">12</span>
            </div>
            <button onClick={() => onNavigateTab("payment_requests")} className="text-xs text-[#FF5A36] font-bold hover:underline cursor-pointer">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-bold uppercase text-[9px] border-b border-slate-100 dark:border-slate-800 pb-1">
                <tr>
                  <th className="pb-1">User</th>
                  <th className="pb-1">Plan</th>
                  <th className="pb-1">Amount</th>
                  <th className="pb-1">Time Elapsed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                <tr>
                  <td className="py-2 font-bold text-slate-900 dark:text-white">Emily Parker</td>
                  <td className="text-slate-500 text-[11px]">Annual Plan</td>
                  <td className="font-black text-[#FF5A36]">NPR 5,000</td>
                  <td className="text-slate-400 text-[11px]">2h 15m</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-900 dark:text-white">David Lee</td>
                  <td className="text-slate-500 text-[11px]">Monthly Plan</td>
                  <td className="font-black text-[#FF5A36]">NPR 500</td>
                  <td className="text-slate-400 text-[11px]">5h 30m</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-900 dark:text-white">Sophia Martinez</td>
                  <td className="text-slate-500 text-[11px]">Annual Plan</td>
                  <td className="font-black text-[#FF5A36]">NPR 5,000</td>
                  <td className="text-slate-400 text-[11px]">1d 2h</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-slate-900 dark:text-white">Daniel Taylor</td>
                  <td className="text-slate-500 text-[11px]">Monthly Plan</td>
                  <td className="font-black text-[#FF5A36]">NPR 500</td>
                  <td className="text-slate-400 text-[11px]">1d 5h</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={() => onNavigateTab("payment_requests")}
            className="w-full pt-2 text-center text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1"
          >
            <span>Go to Payment Requests</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panel 2: Revenue Overview Area Chart */}
        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Revenue Overview</span>
            <select
              value={revenuePeriod}
              onChange={(e) => setRevenuePeriod(e.target.value)}
              className="text-[11px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-0.5 text-slate-700 dark:text-slate-300"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">NPR 18,54,320</div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.8% from last month
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full h-24">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDarkMode ? "#8B5CF6" : "#FF5A36"} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isDarkMode ? "#8B5CF6" : "#FF5A36"} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,65 Q 40,75 80,45 T 160,30 T 240,40 T 300,10 L 300,80 L 0,80 Z"
                fill="url(#revGrad)"
              />
              <path
                d="M 0,65 Q 40,75 80,45 T 160,30 T 240,40 T 300,10"
                fill="none"
                stroke={isDarkMode ? "#A78BFA" : "#FF5A36"}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Day Points */}
              <circle cx="0" cy="65" r="3" fill={isDarkMode ? "#A78BFA" : "#FF5A36"} />
              <circle cx="80" cy="45" r="3" fill={isDarkMode ? "#A78BFA" : "#FF5A36"} />
              <circle cx="160" cy="30" r="3" fill={isDarkMode ? "#A78BFA" : "#FF5A36"} />
              <circle cx="240" cy="40" r="3" fill={isDarkMode ? "#A78BFA" : "#FF5A36"} />
              <circle cx="300" cy="10" r="4" fill={isDarkMode ? "#A78BFA" : "#FF5A36"} className="animate-pulse" />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* Panel 3: User Demographics */}
        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">User Demographics</span>
            <select
              value={demographicsMode}
              onChange={(e) => setDemographicsMode(e.target.value)}
              className="text-[11px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-0.5 text-slate-700 dark:text-slate-300"
            >
              <option value="By Country">By Country</option>
              <option value="By City">By City</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            {/* World Map SVG with radar pins */}
            <div className="relative h-24 bg-slate-50 dark:bg-slate-900/60 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <Globe className="w-16 h-16 text-slate-300 dark:text-slate-700 opacity-60" />
              {/* Radar Pins */}
              <span className="absolute top-8 left-14 w-2 h-2 rounded-full bg-[#FF5A36] animate-ping" />
              <span className="absolute top-8 left-14 w-2 h-2 rounded-full bg-[#FF5A36]" />
              <span className="absolute top-9 left-16 w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="absolute top-6 left-6 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="absolute top-14 left-20 w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>

            {/* Country Breakdown list */}
            <div className="text-[11px] space-y-1 font-bold text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Nepal</span>
                <span className="font-black text-slate-900 dark:text-white">32.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>India</span>
                <span className="font-black text-slate-900 dark:text-white">24.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>USA</span>
                <span className="font-black text-slate-900 dark:text-white">15.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>UK</span>
                <span className="font-black text-slate-900 dark:text-white">8.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Australia</span>
                <span className="font-black text-slate-900 dark:text-white">6.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Others</span>
                <span className="font-black text-slate-900 dark:text-white">13.0%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("user_activity")}
            className="w-full pt-2 text-center text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1"
          >
            <span>View Full Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panel 4: Verification Queue [7] */}
        <div className="bg-white dark:bg-[#131d38] p-5 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Verification Queue</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                {verificationList.length}
              </span>
            </div>
            <button onClick={() => onNavigateTab("verification_queue")} className="text-xs text-[#FF5A36] font-bold hover:underline cursor-pointer">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-bold uppercase text-[9px] border-b border-slate-100 dark:border-slate-800 pb-1">
                <tr>
                  <th className="pb-1">User</th>
                  <th className="pb-1">Amount</th>
                  <th className="pb-1 text-center">Proof</th>
                  <th className="pb-1 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {verificationList.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 font-bold text-slate-900 dark:text-white">{item.user}</td>
                    <td className="font-black text-[#FF5A36]">{item.amount}</td>
                    <td className="text-center">
                      <button
                        onClick={() => setSelectedProofUrl(item.proof)}
                        className="w-6 h-6 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 mx-auto block hover:scale-110 transition-transform cursor-pointer"
                        title="Click to zoom proof receipt"
                      >
                        <img src={item.proof} alt="Proof" className="w-full h-full object-cover" />
                      </button>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleApproveVerification(item.id, item.user)}
                          className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                          title="Approve & Activate"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRejectVerification(item.id, item.user)}
                          className="p-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          title="Reject Proof"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => onNavigateTab("verification_queue")}
            className="w-full pt-2 text-center text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1"
          >
            <span>Go to Verification Queue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. BOTTOM 6-CARD SUMMARY METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Transactions */}
        <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-[#FF5A36] flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Total Transactions</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">2,458</span>
            <span className="text-[10px] text-emerald-500 font-bold ml-1">↑ 18.6%</span>
          </div>
        </div>

        {/* Card 2: Total Revenue (All Time) */}
        <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-[10px] text-slate-400 font-bold block">Total Revenue (All Time)</span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">NPR 2,65,47,890</span>
          </div>
        </div>

        {/* Card 3: Active Sub-Accounts */}
        <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Active Sub-Accounts</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">12,850</span>
            <span className="text-[10px] text-emerald-500 font-bold ml-1">↑ 11.2%</span>
          </div>
        </div>

        {/* Card 4: Challenges Completed */}
        <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Challenges Completed</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">8,420</span>
            <span className="text-[10px] text-emerald-500 font-bold ml-1">↑ 14.3%</span>
          </div>
        </div>

        {/* Card 5: Total Notifications Sent */}
        <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Total Notifications Sent</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">45,210</span>
          </div>
        </div>

        {/* Card 6: Support Tickets */}
        <div className="bg-white dark:bg-[#131d38] p-4 rounded-3xl border border-slate-200/80 dark:border-[#1e294b] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
            <Headset className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Support Tickets</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">36 <span className="text-[10px] font-bold text-amber-500">Open</span></span>
          </div>
        </div>
      </div>

      {/* POPUP MODALS */}

      {/* 1. Zoom Proof Image Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d38] rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95 text-center">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Payment Receipt Proof</h4>
            <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <img src={selectedProofUrl} alt="Receipt Proof" className="w-full h-full object-contain" />
            </div>
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="w-full py-2.5 bg-[#FF5A36] text-white font-black rounded-2xl text-xs shadow-xs cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* 2. User Details Modal */}
      {selectedUserDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d38] rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">User Profile Details</h4>
              <button onClick={() => setSelectedUserDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Name:</span><span className="font-bold text-slate-900 dark:text-white">{selectedUserDetails.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email:</span><span className="font-bold text-slate-900 dark:text-white">{selectedUserDetails.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Role:</span><span className="font-bold text-blue-600">{selectedUserDetails.role}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Plan:</span><span className="font-bold text-emerald-600">{selectedUserDetails.plan}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Reward Coins:</span><span className="font-bold text-amber-500">🪙 {selectedUserDetails.coins}</span></div>
            </div>
            <button
              onClick={() => setSelectedUserDetails(null)}
              className="w-full py-2.5 bg-[#FF5A36] text-white font-black rounded-2xl text-xs shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Create User Modal */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-white dark:bg-[#131d38] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95">
            <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#FF5A36]" /> Create New Platform User
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Shrestha"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. maya@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Plan</label>
                  <select
                    value={newUserPlan}
                    onChange={(e) => setNewUserPlan(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                    <option value="Family">Family</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl font-black text-xs shadow-xs"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Send Announcement Modal */}
      {isAnnouncementOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSendAnnouncement} className="bg-white dark:bg-[#131d38] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-[#1e294b] shadow-2xl space-y-4 animate-in zoom-in-95">
            <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FF5A36]" /> Broadcast System Announcement
            </h4>
            <div className="space-y-3 text-xs">
              <textarea
                rows={3}
                placeholder="Type global notification message for all 24,680 registered users..."
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAnnouncementOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF5A36] text-white rounded-xl font-black text-xs shadow-xs"
              >
                Send Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
