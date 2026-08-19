import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Wallet,
  Settings,
  Shield,
  ShieldCheck,
  Search,
  Bell,
  LogOut,
  User,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  Sparkles,
  FileText,
  Clock,
  RefreshCw,
  QrCode,
  CreditCard,
  Globe
} from "lucide-react";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "Free" | "Premium" | "Family" | "Enterprise";
  status: "Active" | "Suspended" | "Banned";
  createdAt: string;
  lastLogin: string;
  businessName?: string;
  subAccountsCount?: number;
}

export type AdminTab = "overview" | "users" | "workspaces" | "permissions" | "finance" | "payment_verification" | "payment_settings" | "international_billing" | "billing_settings" | "system" | "audit" | "synclogs";
export type AdminConsoleMode = "superadmin" | "workspace";

interface AdminLayoutProps {
  currentUser: UserAccount;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onCloseAdmin?: () => void;
  children: React.ReactNode;
  consoleMode: AdminConsoleMode;
  onConsoleModeChange: (mode: AdminConsoleMode) => void;
  toastMsg: string | null;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onCloseAdmin,
  children,
  consoleMode,
  onConsoleModeChange,
  toastMsg
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Auto-collapse mobile left menu bar after 5 seconds of inactivity
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    let timer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsMobileMenuOpen(false);
      }, 5000);
    };

    resetInactivityTimer();

    const activityEvents = ["mousemove", "mousedown", "touchstart", "keydown", "scroll", "pointermove"];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetInactivityTimer));

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "users", label: "User Management", icon: Users, badge: "Global" },
    { id: "workspaces", label: "Workspaces & Shops", icon: Building2, badge: "Multi-Tenant" },
    { id: "payment_verification", label: "Payment Verification", icon: ShieldCheck, badge: "Live Proofs" },
    { id: "payment_settings", label: "Payment Settings", icon: QrCode, badge: "Bank/QR" },
    { id: "international_billing", label: "International Billing", icon: Globe, badge: "Khalti/Stripe" },
    { id: "billing_settings", label: "Receipt & Tax Settings", icon: FileText, badge: "IRD Custom" },
    { id: "permissions", label: "Permission Templates", icon: ShieldCheck, badge: "Rules" },
    { id: "synclogs", label: "Sync Logs", icon: RefreshCw, badge: "Engine" },
    { id: "finance", label: "Finance & Payouts", icon: Wallet, badge: "Wallet" },
    { id: "system", label: "System & Compliance", icon: Settings, badge: "APIs" },
    { id: "audit", label: "Audit Logs", icon: Shield, badge: "Live" }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center font-black text-white text-lg shadow-md border border-emerald-400/30">
                C2C
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-tight text-white">Care2Care Enterprise</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Console v3.2
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Multi-Tenant Life OS Admin Console
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Switch (Super Admin vs Workspace View) */}
          <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => onConsoleModeChange("superadmin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                consoleMode === "superadmin"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Super Admin View</span>
            </button>
            <button
              onClick={() => onConsoleModeChange("workspace")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                consoleMode === "workspace"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Workspace View</span>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl relative cursor-pointer transition-colors border border-slate-700"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-xs z-50 text-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-extrabold text-slate-200">System Alerts & Notifications</span>
                    <span className="text-[10px] text-emerald-400 font-mono">3 New</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <p className="font-bold text-amber-300">💵 Payout Request Pending</p>
                      <p className="text-[11px] text-slate-300">Apex Medical Shop requested $2,450 withdrawal.</p>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <p className="font-bold text-cyan-300">🏢 New Enterprise Workspace Onboarded</p>
                      <p className="text-[11px] text-slate-300">Valley Senior Home activated 12 sub-accounts.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Return to User App Button */}
            {onCloseAdmin && (
              <button
                onClick={onCloseAdmin}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                title="Switch back to User App"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">User App</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="p-2 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-300 rounded-xl cursor-pointer transition-colors border border-slate-700"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH PERSISTENT SIDEBAR & MAIN CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 p-4 shrink-0 space-y-6">
          {/* User Account Context Banner */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center justify-between">
              <span>{consoleMode === "superadmin" ? "Super Admin" : "Workspace Mode"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="font-extrabold text-sm truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              Console Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2E7D32] text-white shadow-md shadow-emerald-900/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Console Mode Switcher Mobile/Sidebar */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Dashboard View Mode
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => onConsoleModeChange("superadmin")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  consoleMode === "superadmin" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-500"
                }`}
              >
                Super Admin
              </button>
              <button
                onClick={() => onConsoleModeChange("workspace")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  consoleMode === "workspace" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-500"
                }`}
              >
                Workspace
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SLIDE-OUT MENU OVERLAY */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex">
            <div className="w-72 bg-slate-900 text-white p-5 flex flex-col justify-between h-full border-r border-slate-800">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="font-black text-sm block">Care2Care Admin</span>
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 animate-pulse text-amber-400" />
                      Auto-closes in 5s inactivity
                    </span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id as AdminTab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs cursor-pointer ${
                          isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* MAIN PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AdminTab)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl cursor-pointer ${
                isActive ? "text-emerald-400 font-extrabold" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] truncate max-w-[60px]">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
