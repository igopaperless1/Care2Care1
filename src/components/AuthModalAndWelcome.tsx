import React, { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  User,
  X,
  ArrowRight,
  Globe,
  HeartPulse,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Grid,
  Layers
} from "lucide-react";
import { UserAccount } from "./AdminDashboard";
import { getSupabaseClient } from "../lib/supabase";

interface AuthModalAndWelcomeProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout?: () => void;
  currentUser?: UserAccount | null;
  initialTab?: "welcome" | "login" | "signup" | "credentials" | "faq";
}

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
}

const ALL_SERVICES: ServiceItem[] = [
  { id: "meds", icon: "⏰", title: "Meds & Pill Reminders", desc: "Timely dosage alerts, refill logs & prescription tracking", badge: "Core Care" },
  { id: "vitals", icon: "🩺", title: "Vitals & Health Logs", desc: "Blood pressure, oxygen level, glucose & heart rate charts", badge: "Core Care" },
  { id: "recovery", icon: "🏃", title: "Physical Recovery & Steps", desc: "Daily mobility goals, steps counter & rehabilitation", badge: "Core Care" },
  { id: "ai", icon: "🤖", title: "Care2Care AI Assistant", desc: "Smart health guidance, symptom checker & WhatsApp bot", badge: "AI Powered" },
  { id: "elder", icon: "👵", title: "Elderly Care & Caregiver", desc: "Caregiver shift notes, medication history & alerts", badge: "Family" },
  { id: "pediatrics", icon: "👶", title: "Kids Care & Milestones", desc: "Pediatric growth charts, vaccination & fever logs", badge: "Family" },
  { id: "womens", icon: "🌸", title: "Women's Health & Cycle", desc: "Period calendar, cycle tracking & wellness insights", badge: "Wellness" },
  { id: "sleep", icon: "😴", title: "Sleep & Rest Quality", desc: "Sleep hygiene, duration analysis & rest metrics", badge: "Wellness" },
  { id: "habits", icon: "🎯", title: "Habits & Goal Tracking", desc: "Recovery routines, hydration & daily habit streaks", badge: "Wellness" },
  { id: "voice", icon: "🎙️", title: "Voice Notes & Dictation", desc: "Hands-free voice transcription for medical observations", badge: "AI Voice" },
  { id: "vehicle", icon: "🚗", title: "Vehicle Care & Service", desc: "Maintenance schedules, fuel logs & insurance alerts", badge: "Asset Care" },
  { id: "property", icon: "🏡", title: "Property & Asset Vault", desc: "Real estate records, land documents & maintenance", badge: "Asset Care" },
  { id: "career", icon: "💼", title: "Career & Job Tracker", desc: "Job application logs, interviews & career goals", badge: "Lifestyle" },
  { id: "inventory", icon: "📦", title: "Pantry & Stock Manager", desc: "Medical supplies, home inventory & auto re-order", badge: "Household" },
  { id: "vault", icon: "🔒", title: "Encrypted Document Vault", desc: "Secure digital storage for health & personal records", badge: "Security" },
  { id: "sos", icon: "🚨", title: "Emergency SOS Alerts", desc: "Instant 1-tap distress signal to emergency contacts", badge: "Safety" },
  { id: "tools", icon: "🧮", title: "Smart Health Tools", desc: "BMI calculator, unit conversion & dosage tools", badge: "Utilities" },
  { id: "multilingual", icon: "🌐", title: "Multi-Language Portal", desc: "Full support for English, Nepali, Spanish & more", badge: "Global" }
];

export const AuthModalAndWelcome: React.FC<AuthModalAndWelcomeProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onLogout,
  currentUser,
  initialTab = "login"
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "welcome">(
    initialTab === "welcome" ? "welcome" : initialTab === "signup" ? "signup" : "login"
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab === "welcome" ? "welcome" : initialTab === "signup" ? "signup" : "login");
    }
  }, [isOpen, initialTab]);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPlan, setSignupPlan] = useState<"Free" | "Premium" | "Family" | "Enterprise">("Family");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AUTO-SCROLLING SERVICES CAROUSEL STATE (3 seconds interval)
  const [serviceSlideIndex, setServiceSlideIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(ALL_SERVICES.length / ITEMS_PER_PAGE);

  // 3-SECOND AUTO-SCROLL TIMER
  useEffect(() => {
    if (isAutoScrollPaused || showAllGrid) return;

    const timer = setInterval(() => {
      setServiceSlideIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoScrollPaused, showAllGrid, totalPages]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    setIsSubmitting(true);
    const client = getSupabaseClient();

    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });

        if (error) {
          setErrorMsg(error.message || "Sign in failed.");
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          const isAdmin = Boolean(
            data.user.email?.toLowerCase().includes("admin") ||
            data.user.user_metadata?.role === "admin"
          );
          const authenticatedUser: UserAccount = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Care User",
            email: data.user.email || loginEmail.trim(),
            role: isAdmin ? "admin" : (data.user.user_metadata?.role || "user"),
            plan: data.user.user_metadata?.plan || "Family",
            status: "Active",
            createdAt: data.user.created_at ? data.user.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            lastLogin: "Just now",
          };

          onLoginSuccess(authenticatedUser);
          showToast(`Welcome back, ${authenticatedUser.name}!`);
          setIsSubmitting(false);
          onClose();
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An authentication error occurred.");
        setIsSubmitting(false);
        return;
      }
    }

    // Fallback if Supabase not configured
    const isAdmin = loginEmail.toLowerCase().includes("admin");
    const authenticatedUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: isAdmin ? "Admin Superuser" : loginEmail.split("@")[0].replace(".", " "),
      email: loginEmail.trim(),
      role: isAdmin ? "admin" : "user",
      plan: isAdmin ? "Enterprise" : "Family",
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Just now"
    };

    onLoginSuccess(authenticatedUser);
    showToast(`Welcome back, ${authenticatedUser.name}!`);
    setIsSubmitting(false);
    onClose();
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    const client = getSupabaseClient();

    if (client) {
      try {
        const isAdmin = signupEmail.toLowerCase().includes("admin");
        const { data, error } = await client.auth.signUp({
          email: signupEmail.trim(),
          password: signupPassword,
          options: {
            data: {
              full_name: signupName.trim(),
              role: isAdmin ? "admin" : "user",
              plan: signupPlan,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || "Failed to create account.");
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          const newUser: UserAccount = {
            id: data.user.id,
            name: signupName.trim(),
            email: data.user.email || signupEmail.trim(),
            role: isAdmin ? "admin" : "user",
            plan: signupPlan,
            status: "Active",
            createdAt: new Date().toISOString().split("T")[0],
            lastLogin: "Just now",
          };

          onLoginSuccess(newUser);
          showToast(`Account created! Welcome, ${newUser.name}!`);
          setIsSubmitting(false);
          onClose();
          return;
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create account.");
        setIsSubmitting(false);
        return;
      }
    }

    const isAdmin = signupEmail.toLowerCase().includes("admin");
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: signupName.trim(),
      email: signupEmail.trim(),
      role: isAdmin ? "admin" : "user",
      plan: signupPlan,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Just now"
    };

    onLoginSuccess(newUser);
    showToast(`Account created! Welcome, ${newUser.name}!`);
    setIsSubmitting(false);
    onClose();
  };

  const handleQuickDemoUser = () => {
    onLoginSuccess({
      id: "usr-demo-user",
      name: "Eleanor Vance (Family Member)",
      email: "eleanor.vance@family.com",
      role: "user",
      plan: "Family",
      status: "Active",
      createdAt: "2026-02-14",
      lastLogin: "Just now"
    });
    showToast("Signed in as Demo User");
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    onLoginSuccess({
      id: "usr-demo-admin",
      name: "Admin Superuser",
      email: "admin@care2care.org",
      role: "admin",
      plan: "Enterprise",
      status: "Active",
      createdAt: "2026-01-01",
      lastLogin: "Just now"
    });
    showToast("Signed in as Demo Admin");
    onClose();
  };

  // Active slide services
  const currentSlideServices = ALL_SERVICES.slice(
    serviceSlideIndex * ITEMS_PER_PAGE,
    (serviceSlideIndex + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-150">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden">
        {/* COMPACT ELEGANT HEADER */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white p-4 shrink-0 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3.5 right-3.5 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl cursor-pointer transition-colors"
            title="Collapse / Close Modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">Care2Care Portal</h2>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-teal-200/90 font-medium">
                Sign in to manage health, vitals & care plans
              </p>
            </div>
          </div>
        </div>

        {/* LOGGED IN USER STATE */}
        {currentUser && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="truncate">
                <p className="font-black text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  showToast("Logged out");
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] rounded-lg cursor-pointer shrink-0 shadow-2xs"
              >
                Log Out
              </button>
            )}
          </div>
        )}

        {/* TABS HEADER */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === "login"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-black shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === "signup"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-black shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("welcome")}
            className={`flex-1 py-1.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === "welcome"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-black shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            Features ({ALL_SERVICES.length})
          </button>
        </div>

        {/* SCROLLABLE FORM / CONTENT BODY */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3.5 text-xs">

          {/* TAB 1: SIGN IN */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {/* Quick 1-Click Demo Users */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                  1-Click Quick Demo:
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleQuickDemoUser}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                  >
                    User Demo
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                  >
                    Admin Demo
                  </button>
                </div>
              </div>

              {/* 3 Core Features Highlight */}
              <div className="p-2 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                  <span>✨ 3 Core Features Included</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("welcome")}
                    className="text-[9px] underline hover:text-emerald-600 cursor-pointer"
                  >
                    View All 18 →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1 truncate">
                    <span className="shrink-0">⏰</span>
                    <span className="truncate">Pills & Meds</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1 truncate">
                    <span className="shrink-0">🩺</span>
                    <span className="truncate">Vitals & Health</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1 truncate">
                    <span className="shrink-0">🤖</span>
                    <span className="truncate">AI Assistant</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold rounded-xl text-[11px]">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="eleanor.vance@family.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                >
                  Need an account?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? "Signing In..." : "Sign In to Care Suite"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {/* Quick 1-Click Demo Users */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                  1-Click Quick Demo:
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleQuickDemoUser}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                  >
                    User Demo
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg text-[10px] cursor-pointer shadow-2xs"
                  >
                    Admin Demo
                  </button>
                </div>
              </div>

              {/* 3 Core Features Highlight */}
              <div className="p-2 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                  <span>✨ 3 Core Features Included</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("welcome")}
                    className="text-[9px] underline hover:text-emerald-600 cursor-pointer"
                  >
                    View All 18 →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1 truncate">
                    <span className="shrink-0">⏰</span>
                    <span className="truncate">Pills & Meds</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1 truncate">
                    <span className="shrink-0">🩺</span>
                    <span className="truncate">Vitals & Health</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1 truncate">
                    <span className="shrink-0">🤖</span>
                    <span className="truncate">AI Assistant</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold rounded-xl text-[11px]">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="sarah.jenkins@care2care.org"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subscription Plan</label>
                <select
                  value={signupPlan}
                  onChange={(e) => setSignupPlan(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Free">Free (Ad Supported)</option>
                  <option value="Premium">Premium Single ($4.99/mo)</option>
                  <option value="Family">Family Suite ($9.99/mo)</option>
                  <option value="Enterprise">Enterprise Clinic ($29.99/mo)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? "Creating Account..." : "Create Account & Start"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px]"
                >
                  Already registered? Sign in here
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FEATURES / SERVICES WITH AUTO-SCROLLING (3s CYCLE) */}
          {activeTab === "welcome" && (
            <div className="space-y-3.5 text-xs">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-full text-[10px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>All-In-One Health & Care Suite</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Our 18 Complete Services</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Auto-scrolling every 3 seconds. Hover to pause or scroll manually.
                </p>
              </div>

              {/* SERVICES CONTAINER WITH 3-SECOND TIMER BAR */}
              <div
                onMouseEnter={() => setIsAutoScrollPaused(true)}
                onMouseLeave={() => setIsAutoScrollPaused(false)}
                className="relative bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 space-y-3 shadow-inner"
              >
                {/* AUTO-SCROLL HEADER TOOLBAR */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 pb-1 border-b border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>
                      Slide {serviceSlideIndex + 1} of {totalPages}
                    </span>
                    {isAutoScrollPaused && (
                      <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-extrabold">
                        Paused
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAutoScrollPaused(!isAutoScrollPaused)}
                      className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                      title={isAutoScrollPaused ? "Resume Auto-Scroll (3s)" : "Pause Auto-Scroll"}
                    >
                      {isAutoScrollPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAllGrid(!showAllGrid)}
                      className={`p-1 rounded text-xs flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                        showAllGrid
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                      }`}
                      title="Toggle grid view of all 18 services"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{showAllGrid ? "Auto-Scroll" : "View All"}</span>
                    </button>
                  </div>
                </div>

                {/* 3-SECOND TIMER PROGRESS BAR (WHEN AUTO-SCROLLING) */}
                {!isAutoScrollPaused && !showAllGrid && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div
                      key={serviceSlideIndex}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-full origin-left animate-in duration-300"
                      style={{
                        animation: "progress 3s linear continuous"
                      }}
                    />
                  </div>
                )}

                {/* SERVICE CARDS GRID */}
                {!showAllGrid ? (
                  /* 3 ITEMS PER SLIDE IN 3-COLUMN GRID */
                  <div
                    key={serviceSlideIndex}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] animate-in fade-in slide-in-from-right-4 duration-300"
                  >
                    {currentSlideServices.map((service) => (
                      <div
                        key={service.id}
                        className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex items-start gap-2.5 group"
                      >
                        <span className="text-xl p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                          {service.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="font-black text-slate-900 dark:text-white text-[11px] truncate">
                              {service.title}
                            </h4>
                            {service.badge && (
                              <span className="text-[8px] font-extrabold px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 shrink-0">
                                {service.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                            {service.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* FULL GRID OF ALL 18 SERVICES */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] max-h-60 overflow-y-auto pr-1">
                    {ALL_SERVICES.map((service) => (
                      <div
                        key={service.id}
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2"
                      >
                        <span className="text-lg shrink-0">{service.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white text-[11px] truncate">
                            {service.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PAGINATION DOTS AND PREV/NEXT CONTROLS */}
                {!showAllGrid && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setServiceSlideIndex((prev) => (prev - 1 + totalPages) % totalPages)
                      }
                      className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 cursor-pointer"
                      title="Previous Services"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setServiceSlideIndex(i)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            i === serviceSlideIndex
                              ? "w-6 bg-emerald-600"
                              : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                          }`}
                          title={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setServiceSlideIndex((prev) => (prev + 1) % totalPages)
                      }
                      className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 cursor-pointer"
                      title="Next Services"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Sign In</span> <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* COMPACT AUTO-SCROLLING TICKER AT BOTTOM OF LOGIN / SIGNUP TABS */}
          {activeTab !== "welcome" && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-emerald-500 font-extrabold text-xs shrink-0">✨ Featured:</span>
                  <div key={serviceSlideIndex} className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-200 animate-in fade-in duration-300">
                    <span>{ALL_SERVICES[serviceSlideIndex % ALL_SERVICES.length].icon} </span>
                    <span>{ALL_SERVICES[serviceSlideIndex % ALL_SERVICES.length].title}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("welcome")}
                  className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                >
                  All Services ({ALL_SERVICES.length}) →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COMPACT FOOTER / DISMISS ACTION */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Safe & Private
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold underline cursor-pointer"
          >
            Collapse & Browse App
          </button>
        </div>
      </div>
    </div>
  );
};
