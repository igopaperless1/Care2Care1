import React, { useState, useEffect, useRef } from "react";
import { AccountType } from "../types";
import {
  User,
  Briefcase,
  Users,
  Building,
  Globe,
  ChevronDown,
  Check,
  RefreshCw,
  Plus,
  Sparkles,
  ShieldCheck,
  Layers
} from "lucide-react";

interface AccountSwitcherProps {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  isDarkMode?: boolean;
  className?: string;
  onProfileChange?: (newType: AccountType) => void;
  onOpenProfileModal?: () => void;
}

export interface ProfileOption {
  id: AccountType;
  name: string;
  labelNp: string;
  description: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  activeColor: string;
  hoverBg: string;
}

export const PROFILE_OPTIONS: ProfileOption[] = [
  {
    id: "personal",
    name: "Personal Profile",
    labelNp: "व्यक्तिगत प्रोफाइल",
    description: "My Health, Hydration, Habits, Vitals & Fitness",
    icon: User,
    badgeBg: "bg-emerald-500/10 border-emerald-500/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    activeColor: "bg-emerald-600 text-white",
    hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
  },
  {
    id: "professional",
    name: "Professional Profile",
    labelNp: "व्यावसायिक प्रोफाइल",
    description: "Staff Management, Payroll, Contracts & Business Services",
    icon: Briefcase,
    badgeBg: "bg-indigo-500/10 border-indigo-500/30",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    activeColor: "bg-indigo-600 text-white",
    hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
  },
  {
    id: "family",
    name: "Family Profile",
    labelNp: "पारिवारिक प्रोफाइल",
    description: "Family Members, Kids Care, Senior Care & Shared Records",
    icon: Users,
    badgeBg: "bg-amber-500/10 border-amber-500/30",
    badgeText: "text-amber-600 dark:text-amber-400",
    activeColor: "bg-amber-600 text-white",
    hoverBg: "hover:bg-amber-50 dark:hover:bg-amber-950/40"
  },
  {
    id: "property",
    name: "Property & Assets",
    labelNp: "जग्गा तथा सम्पत्ति",
    description: "Land, Deeds, Valuation, Buildings & Farm Records",
    icon: Building,
    badgeBg: "bg-cyan-500/10 border-cyan-500/30",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    activeColor: "bg-cyan-600 text-white",
    hoverBg: "hover:bg-cyan-50 dark:hover:bg-cyan-950/40"
  },
  {
    id: "community",
    name: "Community & Network",
    labelNp: "समुदाय र सञ्जाल",
    description: "Local Service Providers, Caregivers & Emergency SOS",
    icon: Globe,
    badgeBg: "bg-rose-500/10 border-rose-500/30",
    badgeText: "text-rose-600 dark:text-rose-400",
    activeColor: "bg-rose-600 text-white",
    hoverBg: "hover:bg-rose-50 dark:hover:bg-rose-950/40"
  }
];

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  accountType,
  setAccountType,
  isDarkMode = false,
  className = "",
  onProfileChange,
  onOpenProfileModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refetchMessage, setRefetchMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 4000);
  };

  useEffect(() => {
    if (isOpen) {
      resetInactivityTimer();
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const currentOption = PROFILE_OPTIONS.find((p) => p.id === accountType) || PROFILE_OPTIONS[0];
  const IconComponent = currentOption.icon;

  const handleSelect = (option: ProfileOption) => {
    if (option.id === accountType) {
      setIsOpen(false);
      return;
    }

    setIsRefreshing(true);
    setRefetchMessage(`Syncing ${option.name} data...`);

    // Update global state & persistence
    setAccountType(option.id);
    try {
      localStorage.setItem("care2care_account_type", option.id);
      // Dispatch custom event for data re-fetch subscribers
      window.dispatchEvent(
        new CustomEvent("care2care_account_switched", {
          detail: { accountType: option.id, name: option.name }
        })
      );
    } catch (e) {
      console.error("Failed to save accountType", e);
    }

    if (onProfileChange) {
      onProfileChange(option.id);
    }

    setIsOpen(false);

    // Simulate re-fetching profile specific data
    setTimeout(() => {
      setIsRefreshing(false);
      setRefetchMessage(`Loaded ${option.name} context successfully!`);
      setTimeout(() => setRefetchMessage(null), 2500);
    }, 600);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Account Switcher Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all shadow-2xs ${
          currentOption.badgeBg
        } ${currentOption.badgeText} ${
          isDarkMode
            ? "border-slate-700 hover:border-slate-600"
            : "border-slate-200 hover:border-slate-300"
        }`}
        title={`Current Profile: ${currentOption.name}. Click to switch profiles.`}
      >
        <div className="flex items-center gap-1.5">
          {isRefreshing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <IconComponent className="w-3.5 h-3.5" />
          )}
          <span className="font-extrabold text-[11px] sm:text-xs tracking-tight">
            {currentOption.name.replace(" Profile", "")}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Refetching Notification Toast Indicator */}
      {refetchMessage && (
        <div className="absolute left-0 top-full mt-1 z-50 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{refetchMessage}</span>
        </div>
      )}

      {/* Profile Switcher Popover Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop Overlay to Close Dropdown */}
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />

          <div
            onMouseEnter={resetInactivityTimer}
            onMouseMove={resetInactivityTimer}
            onMouseLeave={() => setIsOpen(false)}
            className={`absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl shadow-2xl z-50 p-2 space-y-1.5 border animate-in fade-in zoom-in-95 duration-150 ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Header Title */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Switch Profile Context
                </span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Active: {currentOption.name.split(" ")[0]}
              </span>
            </div>

            {/* Profile Options List */}
            <div className="space-y-1 max-h-80 overflow-y-auto pr-0.5">
              {PROFILE_OPTIONS.map((option) => {
                const isSelected = option.id === accountType;
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 border ${
                      isSelected
                        ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-2xs"
                        : `${option.hoverBg} border-transparent hover:border-slate-200 dark:hover:border-slate-800`
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isSelected
                          ? option.activeColor
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {option.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {option.description}
                      </p>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                        {option.labelNp}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2 flex flex-col gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              {onOpenProfileModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenProfileModal();
                  }}
                  className="w-full py-1.5 px-2 bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 text-[#2E7D32] dark:text-emerald-400 font-extrabold rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Edit Profile Forms & AI Analysis
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </button>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Context-sensitive Dashboard
                </span>
                <span className="font-mono text-[9px] text-slate-400">Care2Care v2.5</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
