import { useState, useEffect } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  country: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  NPR: { code: "NPR", symbol: "Rs.", name: "Nepalese Rupee", country: "NP" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", country: "US" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", country: "IN" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", country: "EU" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", country: "GB" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "AU" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "CA" },
};

export function detectUserCurrency(): CurrencyInfo {
  try {
    // 1. Try detecting via timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (timeZone.includes("Kathmandu") || timeZone.includes("Nepal")) {
      return CURRENCIES.NPR;
    }
    if (timeZone.includes("Kolkata") || timeZone.includes("Calcutta") || timeZone.includes("India")) {
      return CURRENCIES.INR;
    }
    if (timeZone.includes("Europe/London")) {
      return CURRENCIES.GBP;
    }
    if (timeZone.includes("Europe/")) {
      return CURRENCIES.EUR;
    }
    if (timeZone.includes("Australia/")) {
      return CURRENCIES.AUD;
    }

    // 2. Try locale
    const userLocale = navigator.language || navigator.languages?.[0] || "";
    if (userLocale.includes("np") || userLocale.includes("NP")) {
      return CURRENCIES.NPR;
    }
    if (userLocale.includes("in") || userLocale.includes("IN")) {
      return CURRENCIES.INR;
    }
  } catch (e) {
    console.error("Currency detection error:", e);
  }

  // Default to NPR if in Nepal context, or USD
  return CURRENCIES.NPR;
}

export function useAutoCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(() => {
    try {
      const saved = localStorage.getItem("care2care_currency");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return detectUserCurrency();
  });

  useEffect(() => {
    try {
      localStorage.setItem("care2care_currency", JSON.stringify(currency));
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  const setCurrencyByCode = (code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyState(CURRENCIES[code]);
    }
  };

  return { currency, setCurrency: setCurrencyState, setCurrencyByCode };
}
