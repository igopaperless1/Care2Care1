import React, { useState, useRef, useEffect } from "react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "../context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "pills" | "compact";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = "dropdown", className = "" }) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "pills") {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              language === lang.code
                ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
          title={t("nav.language", "Select Language")}
        >
          <span className="text-base">{currentLangObj.flag}</span>
          <span className="uppercase font-mono">{currentLangObj.code}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {t("nav.language", "Select Language")}
            </div>
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  language === lang.code
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-extrabold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2 cursor-pointer text-xs font-bold"
      >
        <span className="text-base">{currentLangObj.flag}</span>
        <span>{currentLangObj.nativeName}</span>
        <span className="text-slate-400 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1">
          <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            {t("nav.language", "Select Language")}
          </div>
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                language === lang.code
                  ? "bg-emerald-600 text-white font-extrabold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </div>
              <span className={`text-[10px] uppercase font-mono ${language === lang.code ? "text-emerald-100" : "text-slate-400"}`}>
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
