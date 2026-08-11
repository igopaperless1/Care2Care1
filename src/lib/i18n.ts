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
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪" }
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
    es: "Inicio",
    fr: "Accueil",
    de: "Startseite",
    hi: "मुख्य पृष्ठ",
    ar: "الرئيسية"
  },
  careSuite: {
    en: "Care Suite",
    np: "हेरचाह सुइट",
    es: "Suite de Cuidado",
    fr: "Suite de Soins",
    de: "Pflegetools",
    hi: "देखभाल सुइट",
    ar: "جناح الرعاية"
  },
  scan: {
    en: "Scan",
    np: "स्क्यान",
    es: "Escanear",
    fr: "Scanner",
    de: "Scannen",
    hi: "स्कैन",
    ar: "مسح"
  },
  plan: {
    en: "Plan",
    np: "योजना",
    es: "Planificar",
    fr: "Planifier",
    de: "Planen",
    hi: "योजना",
    ar: "خطة"
  },
  more: {
    en: "More",
    np: "थप",
    es: "Más",
    fr: "Plus",
    de: "Mehr",
    hi: "अधिक",
    ar: "المزيد"
  },
  welcomeScreen: {
    en: "Welcome Screen",
    np: "स्वागत स्क्रिन",
    es: "Pantalla de Bienvenida",
    fr: "Écran de Bienvenue",
    de: "Willkommensbildschirm",
    hi: "स्वागत स्क्रीन",
    ar: "شاشة الترحيب"
  },
  signIn: {
    en: "Sign In",
    np: "साइन इन गर्नुहोस्",
    es: "Iniciar Sesión",
    fr: "Se Connecter",
    de: "Anmelden",
    hi: "साइन इन करें",
    ar: "تسجيل الدخول"
  },
  signUp: {
    en: "Sign Up Free",
    np: "निःशुल्क साइन अप गर्नुहोस्",
    es: "Registrarse Gratis",
    fr: "Inscription Gratuite",
    de: "Kostenlos Registrieren",
    hi: "निःशुल्क साइन अप करें",
    ar: "تسجيل مجاني"
  },
  adminDashboard: {
    en: "Admin Dashboard",
    np: "व्यवस्थापक ड्यासबोर्ड",
    es: "Panel de Admin",
    fr: "Tableau de Bord Admin",
    de: "Admin-Dashboard",
    hi: "एडमिन डैशबोर्ड",
    ar: "لوحة التحكم"
  },
  userDashboard: {
    en: "User Dashboard",
    np: "प्रयोगकर्ता ड्यासबोर्ड",
    es: "Panel de Usuario",
    fr: "Tableau de Bord Utilisateur",
    de: "Benutzer-Dashboard",
    hi: "उपयोगकर्ता डैशबोर्ड",
    ar: "لوحة المستخدم"
  },
  upgrade: {
    en: "Upgrade / Billing",
    np: "अपग्रेड / भुक्तानी",
    es: "Mejorar / Facturación",
    fr: "Améliorer / Facturation",
    de: "Upgrade / Abrechnung",
    hi: "अपग्रेड / बिलिंग",
    ar: "ترقية / الفواتير"
  },
  sosEmergency: {
    en: "SOS Emergency",
    np: "आत्त्कालीन SOS",
    es: "Emergencia SOS",
    fr: "Urgence SOS",
    de: "SOS Notfall",
    hi: "आपातकालीन SOS",
    ar: "طوارئ SOS"
  },
  payrollAndStaff: {
    en: "Staff & Payroll",
    np: "कर्मचारी र तलब",
    es: "Personal y Nomina",
    fr: "Personnel et Paie",
    de: "Personal & Gehalt",
    hi: "स्टाफ और पेरोल",
    ar: "الموظفين والرواتب"
  },
  cashManagement: {
    en: "Cash & Finance",
    np: "नगद र वित्त व्यवस्थापन",
    es: "Efectivo y Finanzas",
    fr: "Trésorerie et Finance",
    de: "Bargeld & Finanzen",
    hi: "नकद और वित्त",
    ar: "النقدية والمالية"
  },
  qrGenerator: {
    en: "Paperless QR & Card Studio",
    np: "कागजविहीन QR र कार्ड स्टुडियो",
    es: "Estudio de Tarjetas y QR",
    fr: "Studio QR et Cartes",
    de: "QR & Karten Studio",
    hi: "कागज रहित QR और कार्ड स्टूडियो",
    ar: "استوديو البطاقات و QR"
  },
  allRightsReserved: {
    en: "All rights reserved. Encrypted & Local-First Privacy.",
    np: "सर्वाधिकार सुरक्षित। इन्क्रिप्टेड र गोपनीयता सुरक्षित।",
    es: "Todos los derechos reservados. Privacidad encriptada.",
    fr: "Tous droits réservés. Confidentialité chiffrée.",
    de: "Alle Rechte vorbehalten. Verschlüsselte Privatsphäre.",
    hi: "सर्वाधिकार सुरक्षित। एन्क्रिप्टेड गोपनीयता।",
    ar: "جميع الحقوق محفوظة. الخصوصية المشفرة."
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
