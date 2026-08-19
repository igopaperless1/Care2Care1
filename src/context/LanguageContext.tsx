import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import i18n from "../i18n";

export type LanguageCode = "en" | "np" | "bn";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "np", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "bn", name: "Bangla", nativeName: "বাংলা", flag: "🇧🇩" },
];

export const LOCALE_MAP: Record<LanguageCode, string> = {
  en: "en-US",
  np: "ne-NP",
  bn: "bn-BD",
};

export const CURRENCY_MAP: Record<LanguageCode, { code: string; symbol: string }> = {
  en: { code: "USD", symbol: "$" },
  np: { code: "NPR", symbol: "रु" },
  bn: { code: "BDT", symbol: "৳" },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, optionsOrFallback?: any) => string;
  formatNumber: (value: number | string, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number) => string;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, optionsOrFallback?: any) => typeof optionsOrFallback === "string" ? optionsOrFallback : key,
  formatNumber: (v) => String(v),
  formatCurrency: (a) => `$${a}`,
  formatDate: (d) => String(d),
  formatTime: (t) => String(t),
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: LanguageCode }> = ({
  children,
  initialLanguage = "en",
}) => {
  const { t: i18nT } = useI18nTranslation();
  
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("care2care_lang") as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    const detected = i18n.language as LanguageCode;
    if (detected && SUPPORTED_LANGUAGES.some((l) => l.code === detected)) {
      return detected;
    }
    return initialLanguage;
  });

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem("care2care_lang", lang);
    } catch (e) {
      console.error(e);
    }

    // Backend sync for notification language preference (cost-effective, zero cost)
    try {
      const authUserRaw = localStorage.getItem("care2care_auth_user");
      const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
      fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authUser?.id || "anonymous_user",
          language_preference: lang,
        }),
      }).catch((err) => console.log("Language pref sync notice:", err.message));
    } catch (e) {
      // Non-blocking
    }
  };

  const locale = LOCALE_MAP[language] || "en-US";

  const formatNumber = (value: number | string, options?: Intl.NumberFormatOptions): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    try {
      return new Intl.NumberFormat(locale, options).format(num);
    } catch {
      return String(num);
    }
  };

  const formatCurrency = (amount: number, currencyCode?: string): string => {
    const defaultCurr = CURRENCY_MAP[language] || CURRENCY_MAP.en;
    const curr = currencyCode || defaultCurr.code;
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency: curr }).format(amount);
    } catch {
      return `${defaultCurr.symbol}${amount.toFixed(2)}`;
    }
  };

  const formatDate = (dateInput: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return String(dateInput);
      const defaultOptions: Intl.DateTimeFormatOptions = options || {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
    } catch {
      return String(dateInput);
    }
  };

  const formatTime = (dateInput: Date | string | number): string => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return String(dateInput);
      return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric" }).format(date);
    } catch {
      return String(dateInput);
    }
  };

  const t = (key: string, optionsOrFallback?: any): string => {
    if (typeof optionsOrFallback === "string") {
      const translation = String(i18nT(key, { defaultValue: optionsOrFallback }));
      return translation !== key ? translation : optionsOrFallback;
    }
    return String(i18nT(key, optionsOrFallback || {}));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber,
        formatCurrency,
        formatDate,
        formatTime,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export const useTranslation = () => useContext(LanguageContext);
