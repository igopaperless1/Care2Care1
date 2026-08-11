import React, { useState, useEffect, useRef } from "react";
import { AccountType, Patient } from "../types";
import { UserAccount } from "./AdminDashboard";
import {
  Heart,
  Globe,
  Sliders,
  Check,
  Sparkles,
  Wifi,
  Sun,
  Moon,
  UserCheck,
  User,
  Settings
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../lib/i18n";

interface NavigationHeaderProps {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  onTriggerSOS: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onToggleAdminView: () => void;
  isAdminViewActive: boolean;
  onOpenPaddleModal: () => void;
  onOpenSplashAnimation?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
  onOpenUserProfileModal?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  accountType,
  setAccountType,
  patients,
  selectedPatientId,
  setSelectedPatientId,
  onTriggerSOS,
  currentUser,
  onOpenAuth,
  onToggleAdminView,
  isAdminViewActive,
  onOpenPaddleModal,
  onOpenSplashAnimation,
  isDarkMode,
  onToggleDarkMode,
  currentLanguage,
  onSelectLanguage,
  onOpenUserProfileModal
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Auto-collapse / auto-close settings menu after 4s inactivity
  const resetSettingsInactivityTimer = () => {
    if (settingsTimerRef.current) clearTimeout(settingsTimerRef.current);
    settingsTimerRef.current = setTimeout(() => {
      setIsSettingsOpen(false);
    }, 4000);
  };

  useEffect(() => {
    if (isSettingsOpen) {
      resetSettingsInactivityTimer();
    } else if (settingsTimerRef.current) {
      clearTimeout(settingsTimerRef.current);
    }
    return () => {
      if (settingsTimerRef.current) clearTimeout(settingsTimerRef.current);
    };
  }, [isSettingsOpen]);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3 shadow-2xs transition-colors duration-200 ${
      isDarkMode ? "bg-slate-900/95 border-slate-800 text-white" : "bg-white/95 border-slate-100 text-slate-900"
    }`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & App Title (Interactive Click triggers Welcome Onboarding Screen) */}
        <div className="flex items-center gap-2.5">
          {/* App Icon Button */}
          <button
            type="button"
            onClick={onOpenSplashAnimation}
            className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-2xl p-0.5 transition-transform hover:scale-105 active:scale-95 shrink-0"
            title="Click Care2Care App Icon to open Welcome Onboarding Screen"
            aria-label="Click Care2Care App Icon to open Welcome Onboarding Screen"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center text-white shadow-md font-bold text-lg">
              <Heart className="w-5 h-5 fill-white animate-pulse" />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
          </button>

          {/* App Title & Tagline */}
          <button
            type="button"
            onClick={onOpenSplashAnimation}
            className="text-left group cursor-pointer focus:outline-none"
            title="Click to open Welcome Onboarding Screen"
          >
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-base tracking-tight group-hover:text-emerald-500 transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Care2Care
              </span>
            </div>
            <p className={`hidden sm:block text-[10px] font-semibold tracking-tight ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Everything Matters. Track & Succeed.
            </p>
          </button>
        </div>

        {/* Action Controls: Clean Header containing ONLY Settings (Gear icon) and Auth / Login */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Comprehensive Settings Menu Dropdown */}
          <div
            className="relative"
            onMouseLeave={() => setIsSettingsOpen(false)}
          >
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${
                isSettingsOpen
                  ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300/50"
                  : isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
              }`}
              title="Settings & Navigation Options (Auto-collapses when inactive)"
            >
              <Settings className={`w-4 h-4 ${isSettingsOpen ? "text-white animate-spin-slow" : "text-emerald-500"}`} />
              <span className="hidden sm:inline text-xs font-black">Settings</span>
            </button>

            {/* Dropdown Menu Container */}
            {isSettingsOpen && (
              <div
                onMouseEnter={resetSettingsInactivityTimer}
                onMouseMove={resetSettingsInactivityTimer}
                className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl z-50 p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 border ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                {/* Title & Auto-collapse Badge */}
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-500 tracking-wider">
                    <Settings className="w-3.5 h-3.5" /> Navigation & Settings
                  </div>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700">
                    Auto-collapses
                  </span>
                </div>

                {/* 1. User Profile & AI Analysis Button */}
                {onOpenUserProfileModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onOpenUserProfileModal();
                    }}
                    className="w-full p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 text-left transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">Profile & AI Analysis</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Personal Vitals, Forms & AI Suite</div>
                      </div>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                )}

                {/* 2. Language Selector Grid */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-500" /> Select Language / भाषा
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {activeLangObj.flag} {activeLangObj.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-0.5">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            onSelectLanguage(lang.code);
                            resetSettingsInactivityTimer();
                          }}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : isDarkMode
                              ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="text-sm">{lang.flag}</span>
                            <span className="truncate">{lang.name}</span>
                          </span>
                          {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Dark Mode Toggle Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    )}
                    <div>
                      <div className="text-xs font-bold">Dark Mode</div>
                      <div className="text-[9px] text-slate-400">Night vs Day Theme</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleDarkMode();
                      resetSettingsInactivityTimer();
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isDarkMode ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                    role="switch"
                    aria-checked={isDarkMode}
                    title="Toggle Dark Mode"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Welcome Intro Guide Button */}
                {onOpenSplashAnimation && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onOpenSplashAnimation();
                    }}
                    className="w-full py-2 px-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-between hover:bg-indigo-500/20 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500 animate-pulse" />
                      <span>Replay Welcome Intro</span>
                    </span>
                    <span className="text-[9px] bg-indigo-500/20 px-1.5 py-0.5 rounded-md font-extrabold">Guide</span>
                  </button>
                )}

                {/* 5. Admin View Switcher */}
                {currentUser && currentUser.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onToggleAdminView();
                    }}
                    className="w-full py-2 px-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-between hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-amber-500" />
                      <span>Admin Dashboard Mode</span>
                    </span>
                    <span className="text-[9px] bg-amber-500/20 font-black px-1.5 py-0.5 rounded-md">
                      {isAdminViewActive ? "Admin Active" : "Switch View"}
                    </span>
                  </button>
                )}

                {/* Footer Info */}
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="flex items-center gap-1 font-medium">
                    <Wifi className="w-3 h-3 text-emerald-500" /> Care2Care Suite v2.5
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {accountType}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Compact Auth / Profile trigger */}
          <button
            onClick={onOpenAuth}
            className={`p-2 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              currentUser
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-slate-100 border-slate-200 text-slate-800"
            }`}
            title={currentUser ? `Logged in as ${currentUser.name}` : "Sign In / Welcome"}
          >
            {currentUser ? (
              <UserCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <span className="text-xs font-bold px-1">Login</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

