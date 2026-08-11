import React, { useState, useEffect, useRef } from "react";
import { Home, Droplets, Camera, Calendar, Menu, Plus, Bot, Sparkles, Mic, ChevronUp, ChevronDown } from "lucide-react";
import { t } from "../lib/i18n";

export type NavTab = "home" | "track" | "plan" | "care" | "more";

interface BottomNavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenQuickMenu: () => void;
  onOpenCamera: () => void;
  onOpenAiAssistant?: () => void;
  onOpenVoiceAssistant?: () => void;
  currentLanguage?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickMenu,
  onOpenCamera,
  onOpenAiAssistant,
  onOpenVoiceAssistant,
  currentLanguage = "en",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 4000);
  };

  useEffect(() => {
    if (isExpanded) {
      resetTimer();
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isExpanded]);

  return (
    <>
      {/* FLOATING STACK ON BOTTOM RIGHT (AUTO-COLLAPSES WHEN INACTIVE OR MOUSE LEAVES) */}
      <div className="fixed bottom-20 right-4 sm:right-8 z-40">
        {!isExpanded ? (
          /* Collapsed Compact Floating Trigger Pill */
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              resetTimer();
            }}
            onMouseEnter={() => {
              setIsExpanded(true);
              resetTimer();
            }}
            className="px-3.5 py-2.5 rounded-full bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white font-black text-xs shadow-2xl border-2 border-white/80 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Hover or click to expand AI Voice, AI Bot & Quick Tools"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="tracking-tight text-[11px]">AI & Tools</span>
            <ChevronUp className="w-3.5 h-3.5 text-emerald-300 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        ) : (
          /* Expanded Floating Tools Stack */
          <div
            onMouseEnter={resetTimer}
            onMouseMove={resetTimer}
            onMouseLeave={() => setIsExpanded(false)}
            className="flex flex-col items-center gap-2.5 p-2 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            {/* 1. VOICE ASSISTANT FLOATING BUTTON */}
            {onOpenVoiceAssistant && (
              <button
                onClick={() => {
                  onOpenVoiceAssistant();
                  resetTimer();
                }}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-700 via-teal-600 to-cyan-500 hover:from-emerald-600 hover:to-teal-400 text-white flex items-center justify-center shadow-lg ring-2 ring-emerald-300/80 active:scale-95 transition-all cursor-pointer group relative"
                title="Voice Assistant & Audio Dictation"
              >
                <Mic className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </button>
            )}

            {/* 2. CARE2CARE AI ASSISTANT FLOATING BUTTON */}
            {onOpenAiAssistant && (
              <button
                onClick={() => {
                  onOpenAiAssistant();
                  resetTimer();
                }}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-800 via-purple-700 to-amber-500 hover:from-indigo-700 hover:to-amber-400 text-white flex items-center justify-center shadow-lg ring-2 ring-amber-300/80 active:scale-95 transition-all cursor-pointer group relative"
                title="Care2Care AI Assistant"
              >
                <Bot className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </button>
            )}

            {/* 3. GLOBAL QUICK ACTION (+) BUTTON */}
            <button
              onClick={() => {
                onOpenQuickMenu();
                setIsExpanded(false);
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white flex items-center justify-center shadow-lg ring-2 ring-white active:scale-95 transition-all cursor-pointer group"
              title="Global Quick Action Menu (+)"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Collapse Trigger */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[9px] font-bold text-slate-300 hover:text-white px-2 py-0.5 bg-white/10 rounded-full flex items-center gap-0.5 cursor-pointer mt-0.5"
            >
              <ChevronDown className="w-3 h-3" /> Hide
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* HOME */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "home" ? "text-emerald-600 font-extrabold scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t("home", currentLanguage)}</span>
          </button>

          {/* CARE */}
          <button
            onClick={() => setActiveTab("care")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "care" ? "text-emerald-600 font-extrabold scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Droplets className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t("careSuite", currentLanguage)}</span>
          </button>

          {/* CENTRAL CAMERA / SCANNER BUTTON */}
          <button
            onClick={onOpenCamera}
            className="flex flex-col items-center gap-0.5 transition-all cursor-pointer group text-slate-400 hover:text-emerald-600"
            title="Camera: Capture Medicine & Scan QR Code"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-emerald-400 flex items-center justify-center shadow-md ring-2 ring-emerald-500/30 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] tracking-tight font-bold text-slate-500 group-hover:text-emerald-600">{t("scan", currentLanguage)}</span>
          </button>

          {/* PLAN */}
          <button
            onClick={() => setActiveTab("plan")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "plan" ? "text-emerald-600 font-extrabold scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t("plan", currentLanguage)}</span>
          </button>

          {/* MORE */}
          <button
            onClick={() => setActiveTab("more")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "more" ? "text-emerald-600 font-extrabold scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t("more", currentLanguage)}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
