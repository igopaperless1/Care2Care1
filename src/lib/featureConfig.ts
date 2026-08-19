export type FeatureStatus = "active" | "disabled" | "coming_soon";
export type RegionalScope = "ALL" | "US_CA" | "EU_UK" | "APAC" | "LATAM_AFRICA" | "RESTRICTED";
export type UserTierScope = "ALL" | "PREMIUM_ENTERPRISE" | "ENTERPRISE_ONLY";

export interface FeatureConfigItem {
  id: string;
  name: string;
  category: "Personal Care" | "Retail & Business" | "Family & Care" | "Assets & Vault" | "Enterprise & AI";
  status: FeatureStatus;
  countryAvailability: RegionalScope;
  userTier: UserTierScope;
  description: string;
  comingSoonMessage?: string;
  iconEmoji: string;
}

export const INITIAL_FEATURE_CONFIGS: FeatureConfigItem[] = [
  {
    id: "sos_emergency",
    name: "SOS Emergency Panic & GPS",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "1-tap emergency panic trigger with GPS broadcasts & caregiver SMS alerts.",
    iconEmoji: "🚨"
  },
  {
    id: "health_vitals",
    name: "Health Vitals & Blood Pressure",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Track blood pressure, heart rate, oxygen levels & glucose logs.",
    iconEmoji: "🩺"
  },
  {
    id: "medicine",
    name: "Medicine Refill & Pill Alerts",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Pill adherence logs, pharmacy refill reminders & dose history.",
    iconEmoji: "💊"
  },
  {
    id: "water_hydration",
    name: "Hydration & Water Goal",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Hourly hydration tracker with customized intake goals.",
    iconEmoji: "💧"
  },
  {
    id: "steps_exercise",
    name: "Steps & Fitness Tracker",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Daily step goal, calorie burn estimate & workout logger.",
    iconEmoji: "🏃"
  },
  {
    id: "yoga_meditation",
    name: "Yoga & Breathing Timer",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Diaphragmatic breathing, posture timer & mindfulness logs.",
    iconEmoji: "🧘"
  },
  {
    id: "mood_habits",
    name: "Mood & Recovery Journal",
    category: "Personal Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Daily mood checks, habit streaks & trigger journals.",
    iconEmoji: "😊"
  },
  {
    id: "retail_inventory_pos",
    name: "Retail POS & Stock Inventory",
    category: "Retail & Business",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Barcode scanning, cash register, stock alert & sales receipting.",
    iconEmoji: "📦"
  },
  {
    id: "staff_payroll",
    name: "Staff Clock-In & HR Payroll",
    category: "Retail & Business",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Attendance timekeeping, daily rate logs & salary payout tracking.",
    iconEmoji: "💼"
  },
  {
    id: "finance_budget",
    name: "Cash Flow & Finance Ledger",
    category: "Retail & Business",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Income/expense logging, budget caps & cash flow ledger.",
    iconEmoji: "💰"
  },
  {
    id: "ticket_queue",
    name: "Digital Queue & Ticket Counter",
    category: "Retail & Business",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Token counter, customer waiting queue & ticket issuance.",
    iconEmoji: "🎟️"
  },
  {
    id: "elderly_care",
    name: "Elderly & Senior Care Portal",
    category: "Family & Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Mobility logs, caregiver notes & senior resident check-ins.",
    iconEmoji: "👴"
  },
  {
    id: "kids_care",
    name: "Kids & Pediatric Growth",
    category: "Family & Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Vaccination charts, school activity logs & growth tracking.",
    iconEmoji: "👶"
  },
  {
    id: "family_tree",
    name: "Family Tree & Heritage",
    category: "Family & Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Multi-generation lineage, ancestor stories & legacy trees.",
    iconEmoji: "🌳"
  },
  {
    id: "pets_care",
    name: "Pet Health & Vet Records",
    category: "Family & Care",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Vet appointment reminders, pet meals & vaccination logs.",
    iconEmoji: "🐾"
  },
  {
    id: "vehicles_care",
    name: "Vehicle Maintenance & Fuel",
    category: "Assets & Vault",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Fuel mileage logs, PUC renewal alerts & service reminders.",
    iconEmoji: "🚗"
  },
  {
    id: "property_farm",
    name: "Property, Land & Crop Plot",
    category: "Assets & Vault",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Land deed records, crop harvest logs & plot boundaries.",
    iconEmoji: "🏡"
  },
  {
    id: "contract_legal",
    name: "Contract & Legal Vault",
    category: "Assets & Vault",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Digital contract agreements, signee thumbprints & witness logs.",
    iconEmoji: "📑"
  },
  {
    id: "passwords_vault",
    name: "Encrypted Password Manager",
    category: "Assets & Vault",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Zero-knowledge encrypted password storage & security strength score.",
    iconEmoji: "🔑"
  },
  {
    id: "paperless_docs",
    name: "Paperless Digital Scanner",
    category: "Assets & Vault",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Document camera scanner, automatic tagging & offline file vault.",
    iconEmoji: "📁"
  },
  {
    id: "gemini_ai_assistant",
    name: "Gemini AI Prescription & OCR",
    category: "Enterprise & AI",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Prescription OCR scanner, AI health assistant & document summarizer.",
    iconEmoji: "✨"
  },
  {
    id: "telehealth_eprescription",
    name: "Telehealth Consultation & E-Prescription",
    category: "Enterprise & AI",
    status: "coming_soon",
    countryAvailability: "US_CA",
    userTier: "PREMIUM_ENTERPRISE",
    description: "Live Video Doctor Consultations, HIPAA E-Prescriptions & Direct Pharmacy Transmission.",
    comingSoonMessage: "Launching Q4 2026 pending regional medical board licensing.",
    iconEmoji: "🩺"
  },
  {
    id: "lab_diagnostics_sync",
    name: "Lab Diagnostic & Bloodwork Sync",
    category: "Enterprise & AI",
    status: "coming_soon",
    countryAvailability: "EU_UK",
    userTier: "ENTERPRISE_ONLY",
    description: "Automated HL7/FHIR lab results sync, biomarker trend graphs & pathology alerts.",
    comingSoonMessage: "Expected Q1 2027 in partnership with Quest & LabCorp networks.",
    iconEmoji: "🧪"
  },
  {
    id: "custom_store_marketplace",
    name: "Custom E-Commerce Store & Marketplace",
    category: "Retail & Business",
    status: "active",
    countryAvailability: "ALL",
    userTier: "ALL",
    description: "Online storefront builder, customer catalog & order management.",
    iconEmoji: "🏪"
  }
];

const LOCAL_STORAGE_KEY = "care2care_global_feature_config";

export function getSavedFeatureConfigs(): FeatureConfigItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with initial list in case new default items were added
        const savedMap = new Map(parsed.map((item: FeatureConfigItem) => [item.id, item]));
        return INITIAL_FEATURE_CONFIGS.map((initItem) => savedMap.get(initItem.id) || initItem);
      }
    }
  } catch (e) {
    console.error("Error reading saved feature configs:", e);
  }
  return INITIAL_FEATURE_CONFIGS;
}

export function saveFeatureConfigs(configs: FeatureConfigItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configs));
    // Trigger custom event so reactive components can update instantly
    window.dispatchEvent(new Event("care2care_feature_config_changed"));
  } catch (e) {
    console.error("Error saving feature configs:", e);
  }
}

export function checkFeatureAvailability(featureId: string, userCountry: string = "US"): {
  isAvailable: boolean;
  status: FeatureStatus;
  reason?: string;
  config?: FeatureConfigItem;
} {
  const configs = getSavedFeatureConfigs();
  const config = configs.find((c) => c.id === featureId);

  if (!config) {
    return { isAvailable: true, status: "active" };
  }

  if (config.status === "disabled") {
    return {
      isAvailable: false,
      status: "disabled",
      reason: `The service "${config.name}" has been turned OFF globally by System Administrator settings.`,
      config
    };
  }

  if (config.status === "coming_soon") {
    return {
      isAvailable: false,
      status: "coming_soon",
      reason: config.comingSoonMessage || `"${config.name}" is coming soon to your platform!`,
      config
    };
  }

  // Country restriction check
  if (config.countryAvailability !== "ALL") {
    if (config.countryAvailability === "RESTRICTED") {
      return {
        isAvailable: false,
        status: "disabled",
        reason: `"${config.name}" is restricted in your current country region.`,
        config
      };
    }
  }

  return { isAvailable: true, status: "active", config };
}
