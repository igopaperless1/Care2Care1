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
  Settings,
  FileText
} from "lucide-react";
import { SUPPORTED_LANGUAGES, useLanguage } from "../context/LanguageContext";

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
  onOpenReceiptVault?: () => void;
  onOpenReconfigWizard?: () => void;
  onOpenAddMember?: () => void;
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
  onOpenUserProfileModal,
  onOpenReceiptVault,
  onOpenReconfigWizard,
  onOpenAddMember
}) => {
  const { t, setLanguage: setContextLanguage } = useLanguage();
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
      isDarkMode ? "bg-slate-900/95 border-slate-800 text-white" : "bg-white/95 border-slate-200/80 text-slate-900"
    }`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5">
          {/* App Icon Button */}
          <button
            type="button"
            onClick={onOpenSplashAnimation}
            className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-2xl p-0.5 transition-transform hover:scale-105 active:scale-95 shrink-0"
            title="Blessikaa – Build Blessed Life"
            aria-label="Blessikaa Home"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md border border-orange-200/60 dark:border-orange-500/30 flex items-center justify-center bg-gradient-to-tr from-[#FF6A45] via-[#FB923C] to-[#F59E0B]">
              <img
                src="/app-icon.jpg"
                alt="Blessikaa"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 drop-shadow" />
          </button>

          {/* App Title & Tagline */}
          <button
            type="button"
            onClick={onOpenSplashAnimation}
            className="text-left group cursor-pointer focus:outline-none"
            title="Blessikaa – Build Blessed Life"
          >
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-base tracking-tight group-hover:text-[#FF6A45] transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Blessikaa
              </span>
            </div>
            <p className={`hidden sm:block text-[10px] font-bold tracking-tight ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Build Blessed Life
            </p>
          </button>
        </div>

        {/* Action Controls: Clean Header containing Auth / Login and Dark Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center cursor-pointer transition-all shadow-2xs ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Compact Auth / Profile trigger */}
          <button
            onClick={onOpenAuth}
            className={`p-2 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              currentUser
                ? "bg-orange-500/10 border-orange-500/30 text-[#FF6A45] dark:text-orange-400"
                : isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
            }`}
            title={currentUser ? `Logged in as ${currentUser.name}` : "Sign In / Welcome"}
          >
            {currentUser ? (
              <UserCheck className="w-4 h-4 text-[#FF6A45]" />
            ) : (
              <span className="text-xs font-bold px-1">Login</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
