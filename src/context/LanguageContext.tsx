import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "np";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation & General
    "app.title": "Care2Care",
    "app.subtitle": "Family Health & Paperless Digital Management Platform",
    "nav.home": "Home",
    "nav.track": "Track Vitals",
    "nav.care": "Care & Modules",
    "nav.plan": "Plan & Schedule",
    "nav.services": "Services & Tools",
    "nav.sos": "Emergency SOS",
    "nav.search": "Search patients, records...",
    "btn.save": "Save Changes",
    "btn.cancel": "Cancel",
    "btn.add": "Add New",
    "btn.edit": "Edit",
    "btn.delete": "Delete",
    "btn.download": "Download",
    "btn.share": "Share",
    "btn.upload": "Upload Photo",
    "btn.scan": "Scan QR / Camera",
    "btn.search": "Search",
    "btn.close": "Close",
    "btn.confirm": "Confirm",
    "placeholder.search": "Search anything...",
    "placeholder.name": "Enter full name",
    "placeholder.phone": "Enter phone number",
    "placeholder.email": "Enter email address",
    "placeholder.notes": "Add notes or comments...",
    
    // Modules
    "module.paperless": "IGOPaperless Cards & Tickets",
    "module.medicine": "Medicine Tracker",
    "module.water": "Water Intake Tracker",
    "module.steps": "Step Counter",
    "module.finance": "Finance & Budget",
    "module.calendar": "40+ World Calendars",
    "module.sos": "Emergency SOS Center",

    // Digital Tickets & Organiser
    "ticket.title": "Digital Tickets & Organiser Scanning Check-In",
    "ticket.subtitle": "Issue event passes, delegate scanner rights to staff, and validate attendee tickets",
    "ticket.user_view": "User Ticket Pass",
    "ticket.manager_view": "Organiser & Validator Portal",
    "ticket.scan_btn": "Organiser Check-In Scanner",
    "ticket.validate": "Validate / Check-In Attendee",
    "ticket.already_used": "TICKET ALREADY USED / CHECKED IN",
    "ticket.issue_new": "Issue New Event Pass / Healthcare Voucher",
    "ticket.attendee": "Attendee Name",
    "ticket.event": "Event Name",
    "ticket.seat": "Seat / Pass Number",
    "ticket.date": "Event Date",
    "ticket.location": "Venue Location",

    // Visiting Card
    "card.title": "Digital Visiting Card Studio",
    "card.orientation": "Card Orientation",
    "card.horizontal": "Horizontal",
    "card.vertical": "Vertical",
    "card.sides": "Card Sides",
    "card.font": "Font Style",
    "card.front": "Front Side",
    "card.back": "Back Side",

    // Currency
    "currency.label": "Currency",
    "currency.npr": "Nepali Rupee (NPR)",
    "currency.usd": "US Dollar (USD)",
  },
  np: {
    // Navigation & General
    "app.title": "केयर टू केयर (Care2Care)",
    "app.subtitle": "परिवार स्वास्थ्य र डिजिटल व्यवस्थापन प्लेटफर्म",
    "nav.home": "गृहपृष्ठ",
    "nav.track": "ट्रयाकिङ",
    "nav.care": "सेवा तथा मोड्युल",
    "nav.plan": "योजना तथा तालिका",
    "nav.services": "सेवा तथा औजारहरू",
    "nav.sos": "आपतकालीन SOS",
    "nav.search": "बिरामी, रेकर्ड खोज्नुहोस्...",
    "btn.save": "सेभ गर्नुहोस्",
    "btn.cancel": "रद्द गर्नुहोस्",
    "btn.add": "नयाँ थप्नुहोस्",
    "btn.edit": "सम्पादन गर्नुहोस्",
    "btn.delete": "हटाउनुहोस्",
    "btn.download": "डाउनलोड गर्नुहोस्",
    "btn.share": "सेयर गर्नुहोस्",
    "btn.upload": "फोटो अपलोड गर्नुहोस्",
    "btn.scan": "स्क्यान गर्नुहोस्",
    "btn.search": "खोज्नुहोस्",
    "btn.close": "बन्द गर्नुहोस्",
    "btn.confirm": "पुष्टि गर्नुहोस्",
    "placeholder.search": "खोज्नुहोस्...",
    "placeholder.name": "पूरा नाम राख्नुहोस्",
    "placeholder.phone": "फोन नम्बर राख्नुहोस्",
    "placeholder.email": "इमेल ठेगाना राख्नुहोस्",
    "placeholder.notes": "टिप्पणी थप्नुहोस्...",

    // Modules
    "module.paperless": "डिजिटल भिजिटिङ कार्ड र टिकटहरू",
    "module.medicine": "औषधि ट्रयाकर",
    "module.water": "पानी पिउने ट्रयाकर",
    "module.steps": "पाइला (Step) गणना",
    "module.finance": "आर्थिक बजेट व्यवस्थापन",
    "module.calendar": "४०+ पात्रो तथा क्यालेन्डर",
    "module.sos": "आपतकालीन SOS केन्द्र",

    // Digital Tickets & Organiser
    "ticket.title": "डिजिटल टिकट तथा आयोजक स्क्यानिङ चेक-इन",
    "ticket.subtitle": "कार्यक्रम पास जारी गर्नुहोस् र टिकट स्क्यान/प्रमाणित गर्नुहोस्",
    "ticket.user_view": "प्रयोगकर्ता टिकट पास",
    "ticket.manager_view": "आयोजक र व्यवस्थापक पोर्टल",
    "ticket.scan_btn": "आयोजक चेक-इन स्क्यानर",
    "ticket.validate": "टिकट प्रमाणित / चेक-इन गर्नुहोस्",
    "ticket.already_used": "टिकट प्रयोग भइसकेको छ",
    "ticket.issue_new": "नयाँ कार्यक्रम पास जारी गर्नुहोस्",
    "ticket.attendee": "सहभागीको नाम",
    "ticket.event": "कार्यक्रमको नाम",
    "ticket.seat": "सिट / पास नम्बर",
    "ticket.date": "मिति",
    "ticket.location": "स्थान",

    // Visiting Card
    "card.title": "डिजिटल भिजिटिङ कार्ड स्टुडियो",
    "card.orientation": "कार्डको दिशा (Orientation)",
    "card.horizontal": "तेर्सो (Horizontal)",
    "card.vertical": "ठाडो (Vertical)",
    "card.sides": "कार्डका पक्ष (Sides)",
    "card.font": "फन्ट शैली",
    "card.front": "अगाडिको भाग",
    "card.back": "पछाडिको भाग",

    // Currency
    "currency.label": "मुद्रा",
    "currency.npr": "नेपाली रुपैयाँ (NPR)",
    "currency.usd": "अमेरिकी डलर (USD)",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: LanguageCode }> = ({
  children,
  initialLanguage = "en",
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("care2care_lang") as LanguageCode;
      if (saved && (saved === "en" || saved === "np")) return saved;
    } catch (e) {
      console.error(e);
    }
    return initialLanguage;
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("care2care_lang", lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations["en"];
    return langDict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export const useTranslation = () => useContext(LanguageContext);
