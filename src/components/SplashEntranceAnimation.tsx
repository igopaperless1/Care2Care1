import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  ChevronRight,
  Globe,
  Check,
  Bell,
  Activity,
  Dumbbell,
  Users,
  ShieldCheck,
  Lock,
  Cloud,
  CheckCircle2,
  X,
  Phone,
  BarChart2,
  ThumbsUp,
  WifiOff,
  UserPlus,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../lib/i18n";
import { UserAccount } from "./AdminDashboard";

interface SplashEntranceAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWelcome: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLoginSuccess?: (user: UserAccount) => void;
  onSelectLanguage?: (lang: string) => void;
  currentLanguage?: string;
}

export const SplashEntranceAnimation: React.FC<SplashEntranceAnimationProps> = ({
  isOpen,
  onClose,
  onOpenWelcome,
  onOpenLogin,
  onOpenSignup,
  onLoginSuccess,
  onSelectLanguage,
  currentLanguage = "en"
}) => {
  // Slides: 0 = Language Selection, 1 = 4-Service Box, 2 = Analytics, 3 = Multi-Patient, 4 = Offline/Online, 5 = Security
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLangCode, setSelectedLangCode] = useState(currentLanguage);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextSlide = () => {
    if (currentSlide < 5) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleSkipToAuth = () => {
    handleCompleteOnboarding();
  };

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem("care2care_welcome_seen", "true");
    } catch (e) {
      console.error(e);
    }
    if (onSelectLanguage) {
      onSelectLanguage(selectedLangCode);
    }
    
    // Open consolidated login/signup modal
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      onClose();
    }
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLangCode) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between p-4 sm:p-6 overflow-y-auto select-none transition-colors duration-300">
      
      {/* TOP BAR HEADER */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-1 pb-3">
        {/* BRAND LOGO */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md border border-orange-200 dark:border-orange-500/30 flex items-center justify-center bg-gradient-to-tr from-[#FF6A45] via-[#FB923C] to-[#F59E0B]">
            <img
              src="/app-icon.jpg"
              alt="Blessikaa"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
            Blessikaa
          </span>
        </div>

        {/* TOP RIGHT CONTROLS: LANGUAGE PICKER & SKIP BUTTON */}
        <div className="flex items-center gap-2">
          {/* LANGUAGE SELECTOR DROPDOWN */}
          <div className="relative">
            <select
              value={selectedLangCode}
              onChange={(e) => {
                setSelectedLangCode(e.target.value);
                if (onSelectLanguage) onSelectLanguage(e.target.value);
              }}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 pl-2.5 pr-6 rounded-xl cursor-pointer shadow-2xs focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* SKIP BUTTON */}
          <button
            onClick={handleSkipToAuth}
            className="px-3.5 py-1.5 bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Skip
          </button>
        </div>
      </div>

      {/* MAIN CENTER CONTENT AREA */}
      <div className="w-full max-w-md mx-auto my-auto py-2 space-y-6">

        {/* ==================================================================== */}
        {/* SLIDE 0: SELECT LANGUAGE (MATCHING REFERENCE IMAGE 1) */}
        {/* ==================================================================== */}
        {currentSlide === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-1 text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Select Language
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                You can change it later from settings
              </p>
            </div>

            {/* LANGUAGE OPTIONS LIST */}
            <div className="space-y-3">
              {[
                { code: "en", name: "English", native: "English" },
                { code: "ne", name: "Nepali", native: "नेपाली" },
                { code: "bn", name: "Bangla", native: "বাংলা" }
              ].map((lang) => {
                const isSelected = selectedLangCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLangCode(lang.code);
                      if (onSelectLanguage) onSelectLanguage(lang.code);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {lang.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {lang.native}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE 1: FOUR SERVICES IN ONE BOX (MATCHING REFERENCE IMAGE 2) */}
        {/* ==================================================================== */}
        {currentSlide === 1 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            {/* PHONE MOCKUP FRAME WITH 4 SERVICES IN A BOX */}
            <div className="relative mx-auto w-64 sm:w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[36px] p-4 shadow-xl">
              {/* Phone Top Notch Bar */}
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-4 px-1">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <span className="text-[8px]">5G</span>
                  <div className="w-3.5 h-2 border border-slate-400 rounded-2xs p-0.5">
                    <div className="w-full h-full bg-slate-400" />
                  </div>
                </div>
              </div>

              {/* 4 SERVICES BOX GRID */}
              <div className="grid grid-cols-3 gap-2.5 my-2">
                {/* 1. Reminders & Medicines */}
                <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 leading-tight">Reminders</span>
                </div>

                {/* 2. Vitals & Health Biometrics */}
                <div className="bg-sky-50 dark:bg-sky-950/60 p-2.5 rounded-2xl border border-sky-200/80 dark:border-sky-800/80 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 leading-tight">Vitals Track</span>
                </div>

                {/* 3. Physical Exercise & Recovery */}
                <div className="bg-purple-50 dark:bg-purple-950/60 p-2.5 rounded-2xl border border-purple-200/80 dark:border-purple-800/80 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 leading-tight">Physical</span>
                </div>

                {/* 4. Caring Setup & Family */}
                <div className="bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-2xl border border-amber-200/80 dark:border-amber-800/80 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 leading-tight">Caring Suite</span>
                </div>

                {/* 5. Emergency SOS */}
                <div className="bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-2xl border border-rose-200/80 dark:border-rose-800/80 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 leading-tight">SOS Dispatch</span>
                </div>

                {/* 6. AI Assistant */}
                <div className="bg-teal-50 dark:bg-teal-950/60 p-2.5 rounded-2xl border border-teal-200/80 dark:border-teal-800/80 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <div className="w-7 h-7 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 leading-tight">Blessikaa AI</span>
                </div>
              </div>

              {/* CONNECTED "ALL IN ONE PLACE" CHECK BADGE */}
              <div className="my-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[11px] rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>All In One Care Solution</span>
                </div>
              </div>
            </div>

            {/* TITLE & DESCRIPTION */}
            <div className="space-y-2 px-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Care & Health on Your Mobile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Manage your health reminders, vital tracking, physical recovery & caring setup easily from your mobile at your fingertips.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE 2: INSIGHTFUL HEALTH & VITAL ANALYTICS (MATCHING REFERENCE IMAGE 3) */}
        {/* ==================================================================== */}
        {currentSlide === 2 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            {/* PHONE MOCKUP FRAME WITH BAR GRAPH & PIE CHART */}
            <div className="relative mx-auto w-64 sm:w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[36px] p-4 shadow-xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-4 px-1">
                <span>9:41</span>
                <span className="text-[9px]">5G</span>
              </div>

              {/* GRAPH CONTAINER */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between text-left">
                  <div className="w-16 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                  <div className="w-10 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>

                {/* BARS CHART */}
                <div className="flex items-end justify-between h-24 pt-4 px-2 border-b border-dashed border-slate-300 dark:border-slate-700 gap-2">
                  <div className="w-5 bg-emerald-500 rounded-t-lg h-[40%]" />
                  <div className="w-5 bg-rose-500 rounded-t-lg h-[70%]" />
                  <div className="w-5 bg-sky-500 rounded-t-lg h-[90%]" />
                  <div className="w-5 bg-amber-400 rounded-t-lg h-[100%]" />
                </div>

                {/* CIRCULAR DONUT CHART OVERLAY BADGE */}
                <div className="absolute right-2 bottom-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lg flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-full border-4 border-emerald-500 border-t-rose-500 flex items-center justify-center text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    %
                  </div>
                  <div className="text-left text-[10px] font-black leading-tight">
                    <span className="text-emerald-600 dark:text-emerald-400">92%</span>
                    <p className="text-[8px] text-slate-400">Adherence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TITLE & DESCRIPTION */}
            <div className="space-y-2 px-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Insightful Health Reports
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Make better health decisions with your daily vital trends, medication progress & physical recovery reports.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE 3: MULTI-PATIENT & CAREGIVER SETUP (MATCHING REFERENCE IMAGE 4) */}
        {/* ==================================================================== */}
        {currentSlide === 3 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            {/* PHONE MOCKUP FRAME WITH MULTI-PROFILE AVATARS */}
            <div className="relative mx-auto w-64 sm:w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[36px] p-4 shadow-xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-4 px-1">
                <span>9:41</span>
                <span className="text-[9px]">5G</span>
              </div>

              {/* LIST OF CARING PROFILES */}
              <div className="space-y-2 text-left relative">
                <div className="flex items-center gap-2.5 p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/60">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">👴</div>
                  <div className="w-20 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="flex items-center gap-2.5 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/60">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">👵</div>
                  <div className="w-24 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="flex items-center gap-2.5 p-2 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200/60">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">👧</div>
                  <div className="w-16 h-2 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>

                {/* OVERLAY AVATARS POPUP BOX */}
                <div className="absolute right-0 top-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-xl grid grid-cols-2 gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">👨‍💼</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">👩‍⚕️</div>
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-black">👴</div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center text-xs font-black">+</div>
                </div>
              </div>
            </div>

            {/* TITLE & DESCRIPTION */}
            <div className="space-y-2 px-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Multi-Patient & Family Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Create & manage multiple family members, senior parents, kids & personal caregivers under one account.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE 4: USE BOTH OFFLINE & ONLINE SYNC (MATCHING REFERENCE IMAGE 5) */}
        {/* ==================================================================== */}
        {currentSlide === 4 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            {/* PHONE MOCKUP FRAME WITH OFFLINE STATUS & CHECKLIST */}
            <div className="relative mx-auto w-64 sm:w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[36px] p-4 shadow-xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-3 px-1">
                <span>9:41</span>
                <span className="text-[9px]">Offline Mode</span>
              </div>

              {/* OFFLINE WIFI ICON WITH RED ALERT */}
              <div className="relative w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300">
                <WifiOff className="w-6 h-6" />
                <span className="w-3.5 h-3.5 bg-rose-500 text-white rounded-full absolute -top-0.5 -right-0.5 text-[8px] font-black flex items-center justify-center">!</span>
              </div>

              {/* CHECKLIST */}
              <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl text-[10px] font-bold">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Local Medicine Alarms</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Offline Vitals Logging</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Auto Cloud Sync on Wi-Fi</span>
                </div>
              </div>

              {/* THUMBS UP OVERLAY BADGE */}
              <div className="absolute -right-2 top-10 bg-amber-400 text-slate-950 p-2 rounded-2xl shadow-lg font-black text-xs flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 fill-current" />
              </div>
            </div>

            {/* TITLE & DESCRIPTION */}
            <div className="space-y-2 px-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Use Both Offline & Online
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Run your health reminders & vital tracking anytime seamlessly even without an active internet connection.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE 5: SECURE & RELIABLE CARE VAULT (MATCHING REFERENCE IMAGE 6) */}
        {/* ==================================================================== */}
        {currentSlide === 5 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            {/* PHONE MOCKUP FRAME WITH SECURE SHIELD & RECOVERY BOXES */}
            <div className="relative mx-auto w-64 sm:w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[36px] p-4 shadow-xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-3 px-1">
                <span>9:41</span>
                <span className="text-[9px]">Encrypted</span>
              </div>

              {/* CENTRAL SHIELD */}
              <div className="w-14 h-14 mx-auto bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>

              {/* 4 SUB-BOXES */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-extrabold text-slate-700 dark:text-slate-300">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1">
                  <Cloud className="w-3.5 h-3.5 text-sky-500" />
                  <span>Cloud Backup</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Encrypted</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  <span>Care Records</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  <span>Vitals Vault</span>
                </div>
              </div>
            </div>

            {/* TITLE & DESCRIPTION */}
            <div className="space-y-2 px-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Secure & Reliable Care Vault
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                Your health records, vital logs & care documents are securely stored and backed up, which you can recover anytime.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM FOOTER NAVIGATION BAR */}
      <div className="w-full max-w-md mx-auto pt-2 pb-1 space-y-4">

        {/* PROGRESS INDICATOR DOTS */}
        {currentSlide > 0 && (
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((slideNum) => {
              const isActive = currentSlide === slideNum;
              return (
                <button
                  key={slideNum}
                  onClick={() => setCurrentSlide(slideNum)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isActive ? "w-6 bg-emerald-500" : "w-2 bg-slate-300 dark:bg-slate-700"
                  }`}
                  aria-label={`Slide ${slideNum}`}
                />
              );
            })}
          </div>
        )}

        {/* BOTTOM BUTTONS */}
        <div className="flex items-center gap-3">
          {/* SKIP / CANCEL BUTTON (For Slide 0 or general) */}
          {currentSlide === 0 ? (
            <button
              onClick={handleSkipToAuth}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-sm rounded-2xl cursor-pointer transition-all text-center"
            >
              Skip Language
            </button>
          ) : (
            <button
              onClick={handleSkipToAuth}
              className="flex-1 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm rounded-2xl cursor-pointer transition-all text-center shadow-2xs"
            >
              Skip
            </button>
          )}

          {/* CONTINUE / NEXT BUTTON */}
          <button
            onClick={handleNextSlide}
            className={`${
              currentSlide === 0 ? "w-full" : "flex-1"
            } py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2 active:scale-98`}
          >
            <span>{currentSlide === 5 ? "Get Started" : "Continue"}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
