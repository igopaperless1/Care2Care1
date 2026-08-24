import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Users,
  Camera,
  TrendingUp,
  MoreHorizontal,
  Plus,
  Activity,
  User,
  Bot,
  Sparkles,
  Mic,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export type NavTab = "services" | "community" | "camera" | "insight" | "more" | "home" | "track" | "plan" | "care" | "library";

interface BottomNavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenQuickMenu: () => void;
  onOpenCamera: () => void;
  onOpenAiAssistant?: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenProfile?: () => void;
  currentLanguage?: string;
  onExpandChange?: (expanded: boolean) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickMenu,
  onOpenCamera,
  onOpenAiAssistant,
  onOpenVoiceAssistant,
  onOpenProfile,
  onExpandChange,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navToolsRef = useRef<HTMLDivElement | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 3000);
  };

  useEffect(() => {
    onExpandChange?.(isExpanded);
    if (isExpanded) {
      resetTimer();

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (navToolsRef.current && !navToolsRef.current.contains(event.target as Node)) {
          setIsExpanded(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [isExpanded, onExpandChange]);

  return (
    <>
      {/* FLOATING STACK ON BOTTOM RIGHT (AI VOICE & SCANNER TOOLS) */}
      <div ref={navToolsRef} className="fixed bottom-20 sm:bottom-22 right-4 sm:right-6 z-40">
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
            className="px-3.5 py-2 rounded-full bg-gradient-to-r from-[#FF6A45] via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg shadow-orange-900/20 border border-orange-300/40 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="AI Tools & Scanner"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span className="tracking-tight text-xs font-black">AI Tools</span>
            <ChevronUp className="w-3.5 h-3.5 text-orange-100 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        ) : (
          /* Expanded Floating Tools Stack */
          <div
            onMouseEnter={resetTimer}
            onMouseMove={resetTimer}
            onMouseLeave={() => setIsExpanded(false)}
            className="flex flex-col items-center gap-2.5 p-2.5 rounded-3xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            {/* 1. VOICE ASSISTANT FLOATING BUTTON */}
            {onOpenVoiceAssistant && (
              <button
                onClick={() => {
                  onOpenVoiceAssistant();
                  setIsExpanded(false);
                }}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 active:scale-95 transition-all cursor-pointer group"
                title="Voice Assistant & Audio Dictation"
              >
                <Mic className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </button>
            )}

            {/* 2. CARE2CARE AI ASSISTANT FLOATING BUTTON */}
            {onOpenAiAssistant && (
              <button
                onClick={() => {
                  onOpenAiAssistant();
                  setIsExpanded(false);
                }}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 active:scale-95 transition-all cursor-pointer group"
                title="Care2Care AI Assistant"
              >
                <Bot className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
              </button>
            )}

            {/* 3. CAMERA / SCANNER BUTTON */}
            <button
              onClick={() => {
                onOpenCamera();
                setIsExpanded(false);
              }}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 active:scale-95 transition-all cursor-pointer group"
              title="Camera: Capture Medicine & Scan QR"
            >
              <Camera className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between relative px-2">
          {/* 1. SERVICES (HOME) */}
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "services" || activeTab === "home" || activeTab === "care" || activeTab === "library"
                ? "text-[#FF6A45] font-black scale-105"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t("nav.services", "Services")}</span>
          </button>

          {/* 2. COMMUNITY / FEED / MESSAGES */}
          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "community"
                ? "text-[#FF6A45] font-black scale-105"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Community</span>
          </button>

          {/* 3. CENTRAL CAMERA SCANNER (IN PLACE OF + QUICK ADD) */}
          <button
            type="button"
            onClick={onOpenCamera}
            className="flex flex-col items-center -mt-5 transition-all cursor-pointer group"
            title="Camera & OCR Scanner"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6A45] to-[#FB923C] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 active:scale-95 transition-transform">
              <Camera className="w-6 h-6 group-hover:scale-105 transition-transform duration-200" />
            </div>
            <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#FF6A45] mt-0.5">Camera</span>
          </button>

          {/* 4. INSIGHT */}
          <button
            type="button"
            onClick={() => setActiveTab("insight")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "insight" || activeTab === "track"
                ? "text-[#FF6A45] font-black scale-105"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Insight</span>
          </button>

          {/* 5. MORE */}
          <button
            type="button"
            onClick={() => setActiveTab("more")}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              activeTab === "more"
                ? "text-[#FF6A45] font-black scale-105"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{t("nav.more", "More")}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
