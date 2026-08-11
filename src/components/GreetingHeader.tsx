import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  User,
  Bot,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Clock,
  Globe,
  Check,
  Shield,
  Layers,
  Heart,
  Mic
} from "lucide-react";
import { Patient, AccountType } from "../types";
import { convertDateToSystem } from "./CalendarConverterTracker";

// Safe string & helper utilities
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);

interface GreetingHeaderProps {
  patient: Patient;
  patients: Patient[];
  onSelectPatient: (id: string) => void;
  accountType?: AccountType;
  activePersona?: "personal" | "professional" | "sub_account";
  onSwitchPersona?: (persona: "personal" | "professional" | "sub_account") => void;
  isFirstTimeUser?: boolean;
  isAllExpanded?: boolean;
  onToggleExpandAll?: () => void;
  onOpenAiAssistantModal?: () => void;
  onOpenVoiceAssistantModal?: () => void;
  onOpenAuthModal?: () => void;
  onNavigateToTab?: (tab: "home" | "track" | "plan" | "care" | "more") => void;
  onOpenNotifications?: () => void;
  notificationsCount?: number;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  patient,
  patients = [],
  onSelectPatient,
  accountType = "family",
  activePersona = "personal",
  onSwitchPersona,
  isFirstTimeUser = false,
  isAllExpanded = true,
  onToggleExpandAll,
  onOpenAiAssistantModal,
  onOpenVoiceAssistantModal,
  onOpenAuthModal,
  onNavigateToTab,
  onOpenNotifications,
  notificationsCount = 3
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [currentDayStr, setCurrentDayStr] = useState<string>("");
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [userTimezone, setUserTimezone] = useState<string>("Local Time Zone");
  const [countryFlag, setCountryFlag] = useState<string>("🌐");
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<string>(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Kathmandu") || tz.includes("Nepal")) return "nepali_vs";
      if (tz.includes("Dubai") || tz.includes("Riyadh")) return "islamic_hijri";
      if (tz.includes("Addis_Ababa")) return "ethiopian";
      return "gregorian";
    } catch {
      return "gregorian";
    }
  });

  // Keep live time updated with full date, day, geo time zone, and converted calendar date
  useEffect(() => {
    try {
      const updateClock = () => {
        const now = new Date();
        setCurrentTimeStr(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
        );
        setCurrentDayStr(now.toLocaleDateString([], { weekday: "short" }));

        // Convert Gregorian date to target selected calendar
        const isoDate = now.toISOString().split("T")[0];
        const calendarResult = convertDateToSystem(isoDate, selectedCalendar);
        if (calendarResult && calendarResult.formatted) {
          setCurrentDateStr(calendarResult.formatted);
        } else {
          setCurrentDateStr(now.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" }));
        }

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
          setUserTimezone(tz.replace(/_/g, " ").replace(/Asia\//g, ""));
          if (tz.includes("Kathmandu") || tz.includes("Asia/Calcutta") || tz.includes("Kolkata")) {
            setCountryFlag("🇳🇵");
          } else if (tz.includes("America")) {
            setCountryFlag("🇺🇸");
          } else if (tz.includes("Europe/London")) {
            setCountryFlag("🇬🇧");
          } else if (tz.includes("Dubai") || tz.includes("Riyadh")) {
            setCountryFlag("🇦🇪");
          }
        }
      };
      updateClock();
      const timer = setInterval(updateClock, 1000);
      return () => clearInterval(timer);
    } catch (e) {
      console.error("Error setting time interval", e);
    }
  }, [selectedCalendar]);

  // Time-based Greetings & Salutations
  const getTimeBasedGreeting = () => {
    try {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return { text: "Good Morning 🌅", subText: "Start your morning care & hydration routine" };
      }
      if (hour >= 12 && hour < 17) {
        return { text: "Good Afternoon ☀️", subText: "Check afternoon vitals & staff rosters" };
      }
      if (hour >= 17 && hour < 22) {
        return { text: "Good Evening 🌆", subText: "Review today's care logs & family health goals" };
      }
      return { text: "Good Night 🌙", subText: "Rest well • Emergency SOS active 24/7" };
    } catch {
      return { text: "Welcome to Care2Care 💚", subText: "Track health, family & professional care" };
    }
  };

  const getSalutation = () => {
    try {
      const cat = (patient?.category || "").toLowerCase();
      if (cat === "elderly") return "Elder";
      if (cat === "pediatric" || cat === "kids") return "Champion";
      return "";
    } catch {
      return "";
    }
  };

  const greeting = getTimeBasedGreeting();
  const salutation = getSalutation();
  const patientName = safeStr(patient?.name, "Valued Member");

  return (
    <div className="bg-gradient-to-br from-[#1b5e20] via-[#2E7D32] to-[#0f172a] text-white p-4 sm:p-5 rounded-3xl border border-emerald-500/30 shadow-xl space-y-3.5 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* TOP ROW: Profile Avatar, Name, Persona Pill & Header Actions */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        {/* User Identity Info */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={patient?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt={patientName}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              activePersona === "personal" ? "bg-emerald-400" : activePersona === "professional" ? "bg-blue-400" : "bg-amber-400"
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                {salutation ? `${salutation} ${patientName}` : patientName}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activePersona === "personal"
                  ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                  : activePersona === "professional"
                  ? "bg-blue-400/20 text-blue-300 border border-blue-400/40"
                  : "bg-amber-400/20 text-amber-300 border border-amber-400/40"
              }`}>
                {activePersona === "personal" ? "Personal" : activePersona === "professional" ? "Enterprise" : "Sub-Account"}
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/80 font-medium">
              {greeting.text} • {greeting.subText}
            </p>
          </div>
        </div>

        {/* Right Action Controls: Persona Switcher & Notifications */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Persona Switcher Button */}
          {onSwitchPersona && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1 border border-amber-300"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Switch</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Persona Popover Modal */}
              {showPersonaMenu && createPortal(
                <div
                  className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
                  onClick={() => setShowPersonaMenu(false)}
                >
                  <div
                    className="bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl p-5 max-w-sm w-full space-y-3.5 text-xs font-bold relative z-[10000]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-amber-400/20 text-amber-400 rounded-xl">👤</span>
                        <span className="text-xs text-slate-200 uppercase tracking-wider font-extrabold">Select Active Profile</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPersonaMenu(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchPersona("personal");
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                          activePersona === "personal"
                            ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 shadow-lg"
                            : "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-lg">🌿</span>
                          <div>
                            <div className="text-sm font-extrabold text-white">Personal Care Profile</div>
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">Health, routines & family care</div>
                          </div>
                        </div>
                        {activePersona === "personal" && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSwitchPersona("professional");
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                          activePersona === "professional"
                            ? "bg-blue-600/30 text-blue-300 border border-blue-500/60 shadow-lg"
                            : "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-blue-500/20 text-blue-400 rounded-xl text-lg">💼</span>
                          <div>
                            <div className="text-sm font-extrabold text-white">Professional Enterprise</div>
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">Staff, store & contracts</div>
                          </div>
                        </div>
                        {activePersona === "professional" && <Check className="w-5 h-5 text-blue-400 shrink-0" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSwitchPersona("sub_account");
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                          activePersona === "sub_account"
                            ? "bg-amber-600/30 text-amber-300 border border-amber-500/60 shadow-lg"
                            : "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl text-lg">👥</span>
                          <div>
                            <div className="text-sm font-extrabold text-white">Sub-Account / Staff Mode</div>
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">Task execution & shift logs</div>
                          </div>
                        </div>
                        {activePersona === "sub_account" && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          )}

          {/* Member / Patient Switcher Dropdown */}
          {patients.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs">
              <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={patient.id}
                onChange={(e) => onSelectPatient(e.target.value)}
                className="bg-transparent font-bold text-xs text-white focus:outline-none cursor-pointer pr-1 max-w-[110px] sm:max-w-[150px] truncate"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* SECOND ROW: Live Clock & Calendar Conversion Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-500/20 text-[11px] font-bold">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/70 border border-emerald-400/30 text-amber-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span>{currentDayStr}, {currentDateStr}</span>
            <span className="text-white font-mono bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[10px]">
              {currentTimeStr || "Live Time"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-emerald-200 bg-white/10 px-2 py-1 rounded-xl text-[10px]">
            <span>{countryFlag}</span>
            <span>{userTimezone}</span>
          </div>
        </div>

        {/* Calendar Selector */}
        <select
          value={selectedCalendar}
          onChange={(e) => setSelectedCalendar(e.target.value)}
          className="bg-emerald-950 text-emerald-300 text-[10px] font-extrabold rounded-lg px-2 py-1 border border-emerald-600/50 focus:outline-none cursor-pointer"
        >
          <option value="nepali_vs">🇳🇵 Bikram Sambat (BS)</option>
          <option value="gregorian">🌐 Gregorian (AD)</option>
          <option value="newari_ns">🇳🇵 Nepal Sambat (NS)</option>
          <option value="islamic_hijri">🌙 Islamic Hijri (AH)</option>
          <option value="chinese">🇨🇳 Chinese Lunar</option>
          <option value="hebrew">🇮🇱 Hebrew (AM)</option>
          <option value="ethiopian">🇪🇹 Ethiopian</option>
          <option value="persian">🇮🇷 Solar Hijri</option>
        </select>
      </div>

      {/* THIRD ROW: AI & Voice Assistant Quick Actions Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {onOpenVoiceAssistantModal && (
            <button
              type="button"
              onClick={onOpenVoiceAssistantModal}
              className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-500/40 transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voice Dictation</span>
            </button>
          )}

          {onOpenAiAssistantModal && (
            <button
              type="button"
              onClick={onOpenAiAssistantModal}
              className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Bot className="w-3.5 h-3.5 text-slate-950" />
              <span>Care2Care AI</span>
            </button>
          )}
        </div>

        {onToggleExpandAll && (
          <button
            type="button"
            onClick={onToggleExpandAll}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
          >
            {isAllExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isAllExpanded ? "Compact" : "Expand"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

