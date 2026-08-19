// Comprehensive i18n & Auto Geo-Location Currency Engine for Care2Care

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "np", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "bn", name: "Bangla", nativeName: "বাংলা", flag: "🇧🇩" }
];

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  NPR: { code: "NPR", symbol: "रु", name: "Nepali Rupee", flag: "🇳🇵" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" }
};

/**
 * Auto-detect user's location based on Timezone & Locale to select default currency and language.
 */
export function getAutoDetectedGeoConfig() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const navLang = typeof navigator !== "undefined" ? navigator.language || "" : "";

    if (tz.includes("Kathmandu") || tz.includes("Nepal") || navLang.startsWith("ne")) {
      return {
        detectedLanguage: "np",
        detectedCurrency: "NPR",
        currencySymbol: "रु"
      };
    }
    if (tz.includes("Kolkata") || tz.includes("India") || navLang.startsWith("hi")) {
      return {
        detectedLanguage: "hi",
        detectedCurrency: "INR",
        currencySymbol: "₹"
      };
    }
    if (tz.includes("London") || tz.includes("United_Kingdom")) {
      return {
        detectedLanguage: "en",
        detectedCurrency: "GBP",
        currencySymbol: "£"
      };
    }
    if (tz.includes("Europe")) {
      return {
        detectedLanguage: "en",
        detectedCurrency: "EUR",
        currencySymbol: "€"
      };
    }
    if (tz.includes("Australia")) {
      return {
        detectedLanguage: "en",
        detectedCurrency: "AUD",
        currencySymbol: "A$"
      };
    }
  } catch (e) {
    console.error("Geo-detection fallback", e);
  }

  return {
    detectedLanguage: "en",
    detectedCurrency: "USD",
    currencySymbol: "$"
  };
}

// Translations Dictionary
const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Navigation & General
  home: {
    en: "Home",
    np: "गृहपृष्ठ",
    bn: "হোমপেজ"
  },
  careSuite: {
    en: "Care Suite",
    np: "हेरचाह सुइट",
    bn: "কেয়ার স্যুট"
  },
  scan: {
    en: "Scan",
    np: "स्क्यान",
    bn: "স্ক্যান"
  },
  plan: {
    en: "Plan",
    np: "योजना",
    bn: "পরিকল্পনা"
  },
  more: {
    en: "More",
    np: "थप",
    bn: "আরও"
  },
  welcomeScreen: {
    en: "Welcome Screen",
    np: "स्वागत स्क्रिन",
    bn: "স্বাগতম স্ক্রিন"
  },
  signIn: {
    en: "Sign In",
    np: "साइन इन गर्नुहोस्",
    bn: "সাইন ইন করুন"
  },
  signUp: {
    en: "Sign Up Free",
    np: "निःशुल्क साइन अप गर्नुहोस्",
    bn: "বিনামূল্যে সাইন আপ"
  },
  adminDashboard: {
    en: "Admin Dashboard",
    np: "व्यवस्थापक ड्यासबोर्ड",
    bn: "এডমিন ড্যাশবোর্ড"
  },
  userDashboard: {
    en: "User Dashboard",
    np: "प्रयोगकर्ता ड्यासबोर्ड",
    bn: "ইউজার ড্যাশবোর্ড"
  },
  upgrade: {
    en: "Upgrade / Billing",
    np: "अपग्रेड / भुक्तानी",
    bn: "আপগ্রেড / বিলিং"
  },
  sosEmergency: {
    en: "SOS Emergency",
    np: "आपत्कालीन SOS",
    bn: "জরুরি SOS"
  },
  payrollAndStaff: {
    en: "Staff & Payroll",
    np: "कर्मचारी र तलब",
    bn: "স্টাফ ও পে-রোল"
  },
  cashManagement: {
    en: "Cash & Finance",
    np: "नगद र वित्त व्यवस्थापन",
    bn: "নগদ ও অর্থ"
  },
  qrGenerator: {
    en: "Paperless QR & Card Studio",
    np: "कागजविहीन QR र कार्ड स्टुडियो",
    bn: "পেপারলেস QR ও কার্ড স্টুডিও"
  },
  allRightsReserved: {
    en: "All rights reserved. Encrypted & Local-First Privacy.",
    np: "सर्वाधिकार सुरक्षित। इन्क्रिप्टेड र गोपनीयता सुरक्षित।",
    bn: "সর্বস্বত্ব সংরক্ষিত। এনক্রিপ্ট করা প্রাইভেসি।"
  }
};

/**
 * Main translation getter function
 */
export function t(key: string, lang: string = "en"): string {
  if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
    return TRANSLATIONS[key][lang];
  }
  if (TRANSLATIONS[key] && TRANSLATIONS[key]["en"]) {
    return TRANSLATIONS[key]["en"];
  }
  return key;
}

/**
 * Format currency amounts nicely with symbol
 */
export function formatCurrencyAmount(amount: number, currencyCode: string = "NPR"): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.NPR;
  const formattedNum = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${config.symbol} ${formattedNum}`;
}
