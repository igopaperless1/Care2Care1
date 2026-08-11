import { useState, useMemo } from "react";
import { AccountType } from "../types";

export interface SubTabOption {
  id: string;
  label: string;
  labelNp: string;
  icon: string;
  description: string;
  favId: string;
  careSubTab: string;
  countLabel?: string;
}

export interface ServiceConfig {
  id: string;
  title: string;
  titleNp: string;
  description: string;
  category: "personal" | "professional";
  iconName: string;
  badge?: string;
  careSubTab: string;
  colorClass: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  category: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  statusColor: string;
  actionSubTab: string;
}

export interface AccountStats {
  personal: {
    title: string;
    waterIntake: string;
    waterProgress: number;
    pendingMedsCount: number;
    medsStatus: string;
    vitalsStatus: string;
    familyCount: number;
    primaryBadge: string;
    secondaryBadge: string;
  };
  professional: {
    title: string;
    activeContracts: number;
    clockedInStaff: number;
    totalStaff: number;
    lowStockSkus: number;
    openJobPosts: number;
    primaryBadge: string;
    secondaryBadge: string;
  };
}

export function useAccountDashboard(
  accountType: AccountType | string = "family",
  setAccountType?: (type: any) => void
) {
  // Determine if active profile mode is Personal or Professional
  const isPersonalMode = useMemo(() => {
    return accountType === "personal" || accountType === "family" || accountType === "property";
  }, [accountType]);

  const mainCategoryMode: "personal" | "professional" = isPersonalMode ? "personal" : "professional";

  // Remember view preferences for Personal profile
  const [personalSubTab, setPersonalSubTabState] = useState<string>(() => {
    try {
      return localStorage.getItem("care2care_last_subtab_personal") || "vitals";
    } catch {
      return "vitals";
    }
  });

  // Remember view preferences for Professional profile
  const [profSubTab, setProfSubTabState] = useState<string>(() => {
    try {
      return localStorage.getItem("care2care_last_subtab_professional") || "staff";
    } catch {
      return "staff";
    }
  });

  // Save to localStorage whenever user picks a subtab
  const setActiveSubTab = (tabId: string) => {
    if (isPersonalMode) {
      setPersonalSubTabState(tabId);
      try {
        localStorage.setItem("care2care_last_subtab_personal", tabId);
      } catch (e) {
        console.error("Failed to save personal view preference", e);
      }
    } else {
      setProfSubTabState(tabId);
      try {
        localStorage.setItem("care2care_last_subtab_professional", tabId);
      } catch (e) {
        console.error("Failed to save professional view preference", e);
      }
    }
  };

  const activeSubTab = isPersonalMode ? personalSubTab : profSubTab;

  // Switch between Personal & Professional profile choices
  const switchProfileChoice = (choice: "personal" | "professional") => {
    const targetType: AccountType = choice === "personal" ? "personal" : "professional";
    if (setAccountType) {
      setAccountType(targetType);
    }
    try {
      localStorage.setItem("care2care_account_type", targetType);
    } catch (e) {
      console.error(e);
    }
  };

  // Sub-tabs for Personal mode
  const personalSubTabs: SubTabOption[] = [
    {
      id: "vitals",
      label: "Health & Vitals",
      labelNp: "स्वास्थ्य तथा भिटल्स",
      icon: "❤️",
      description: "BP, Pulse, Blood Sugar, Oxygen & SpO2",
      favId: "personal-vitals",
      careSubTab: "elderly",
      countLabel: "98% Score"
    },
    {
      id: "water",
      label: "Hydration & Meds",
      labelNp: "पानी र औषधि",
      icon: "💧",
      description: "Water intake tracking & daily prescription reminders",
      favId: "personal-water",
      careSubTab: "water",
      countLabel: "2,150 ml"
    },
    {
      id: "sleep",
      label: "Sleep & Mind",
      labelNp: "निद्रा र मानसिक स्वास्थ्य",
      icon: "🌙",
      description: "Sleep quality, white noise & breathing exercises",
      favId: "personal-sleep",
      careSubTab: "sleep",
      countLabel: "8.2 hrs"
    },
    {
      id: "family",
      label: "Family & Pets",
      labelNp: "परिवार र घरपालुवा",
      icon: "🐾",
      description: "Family lineage, kids care, senior care & pet vaccinations",
      favId: "personal-family",
      careSubTab: "family_tree",
      countLabel: "14 Members"
    },
    {
      id: "passes",
      label: "Passes & IDs",
      labelNp: "पास र मेडिकल आईडी",
      icon: "🎟️",
      description: "Digital health cards, passes & Emergency QR IDs",
      favId: "personal-passes",
      careSubTab: "paperless",
      countLabel: "12 Passes"
    }
  ];

  // Sub-tabs for Professional mode
  const professionalSubTabs: SubTabOption[] = [
    {
      id: "staff",
      label: "Staff & Payroll",
      labelNp: "कर्मचारी तथा तलब",
      icon: "👨‍⚕️",
      description: "Clock-in attendance, trial probation & salary receipts",
      favId: "prof-staff",
      careSubTab: "staff_payroll",
      countLabel: "8 On Duty"
    },
    {
      id: "contracts",
      label: "Contracts & Deeds",
      labelNp: "कागजात तथा सम्झौता",
      icon: "📜",
      description: "Legal paperless deeds, signatures & thumb stamps",
      favId: "prof-contracts",
      careSubTab: "contracts",
      countLabel: "12 Deeds"
    },
    {
      id: "inventory",
      label: "Inventory Stock",
      labelNp: "जिन्सी तथा स्टक",
      icon: "📦",
      description: "SKU tracking, reorder alerts & supplier directory",
      favId: "prof-inventory",
      careSubTab: "inventory",
      countLabel: "45 SKUs"
    },
    {
      id: "property",
      label: "Property & Rental",
      labelNp: "सम्पत्ति तथा भाडा",
      icon: "🏢",
      description: "Real estate plots, boundary records & tenant rent logs",
      favId: "prof-property",
      careSubTab: "property",
      countLabel: "4 Plots"
    },
    {
      id: "career",
      label: "Job & Career",
      labelNp: "रोजगारी तथा करियर",
      icon: "💼",
      description: "Caregiver job portal, zero fee policy & CV builder",
      favId: "prof-career",
      careSubTab: "jobs",
      countLabel: "5 Openings"
    }
  ];

  const currentSubTabOptions = isPersonalMode ? personalSubTabs : professionalSubTabs;

  // Available Care Services filtered by active Profile Choice
  const personalServices: ServiceConfig[] = [
    {
      id: "vital-care",
      title: "Senior & Patient Vitals",
      titleNp: "जेष्ठ नागरिक तथा बिरामी भिटल्स",
      description: "Log blood pressure, pulse, glucose and vision tests.",
      category: "personal",
      iconName: "HeartPulse",
      badge: "1 Patient • 120/80",
      careSubTab: "elderly",
      colorClass: "from-rose-500 to-pink-600"
    },
    {
      id: "hydration-tracker",
      title: "Water Intake & Meds",
      titleNp: "पिउने पानी र औषधिको ट्र्याकर",
      description: "Daily hydration goals & dosage reminders.",
      category: "personal",
      iconName: "Droplets",
      badge: "2,150 / 2,500 ml",
      careSubTab: "water",
      colorClass: "from-cyan-500 to-blue-600"
    },
    {
      id: "sleep-wellness",
      title: "Sleep Quality & Meditation",
      titleNp: "निद्रा तथा ध्यान प्रणाली",
      description: "Track sleep cycles, white noise and relaxation.",
      category: "personal",
      iconName: "Moon",
      badge: "8.2 hrs • 94%",
      careSubTab: "sleep",
      colorClass: "from-indigo-500 to-purple-600"
    },
    {
      id: "family-lineage",
      title: "Family Tree & Kids Care",
      titleNp: "पारिवारिक वंश र बालबालिका स्याहार",
      description: "Genealogy records, growth percentiles and care logs.",
      category: "personal",
      iconName: "Users",
      badge: "14 Mapped Members",
      careSubTab: "family_tree",
      colorClass: "from-amber-500 to-orange-600"
    },
    {
      id: "pet-care",
      title: "Pet Care & Vaccines",
      titleNp: "घरपालुवा जनावर स्याहार",
      description: "Vaccination schedule, vet visits & feeding routine.",
      category: "personal",
      iconName: "Dog",
      badge: "3 Pets Tracked",
      careSubTab: "pets",
      colorClass: "from-emerald-500 to-teal-600"
    },
    {
      id: "garden-farm",
      title: "Garden & Agriculture",
      titleNp: "बगैंचा तथा कृषि ट्र्याकर",
      description: "Crops, watering frequency and yield records.",
      category: "personal",
      iconName: "Sprout",
      badge: "6 Crops Logged",
      careSubTab: "garden",
      colorClass: "from-lime-500 to-emerald-600"
    }
  ];

  const professionalServices: ServiceConfig[] = [
    {
      id: "staff-payroll",
      title: "Staff Attendance & Payroll",
      titleNp: "कर्मचारी हाजिरी र तलब खाता",
      description: "Time-stamped clock-ins, trial tracking & salary receipts.",
      category: "professional",
      iconName: "Briefcase",
      badge: "8 Staff Clocked In",
      careSubTab: "staff_payroll",
      colorClass: "from-indigo-600 to-slate-800"
    },
    {
      id: "contracts-deeds",
      title: "Legal Deeds & Contracts",
      titleNp: "कानुनी सम्झौता र कागजात",
      description: "IGOPaperless contracts with photo witness & thumb stamps.",
      category: "professional",
      iconName: "FileText",
      badge: "12 Verified Deeds",
      careSubTab: "contracts",
      colorClass: "from-purple-600 to-indigo-900"
    },
    {
      id: "inventory-stock",
      title: "Inventory & Stock Control",
      titleNp: "जिन्सी तथा स्टक व्यवस्थापन",
      description: "Stock SKUs, reorder thresholds & vendor terms.",
      category: "professional",
      iconName: "Package",
      badge: "45 Active SKUs",
      careSubTab: "inventory",
      colorClass: "from-amber-600 to-slate-800"
    },
    {
      id: "property-land",
      title: "Property & Real Estate",
      titleNp: "जग्गा जमिन र घर भाडा",
      description: "Plot boundaries, tenant lease terms & rent collection.",
      category: "professional",
      iconName: "HomeIcon",
      badge: "4 Land Plots",
      careSubTab: "property",
      colorClass: "from-cyan-600 to-blue-900"
    },
    {
      id: "career-jobs",
      title: "Caregiver Job Network",
      titleNp: "केयरगिभर रोजगारी सञ्जाल",
      description: "Zero-fee job portal, candidate screening & bio generator.",
      category: "professional",
      iconName: "Briefcase",
      badge: "5 Openings",
      careSubTab: "jobs",
      colorClass: "from-emerald-600 to-teal-900"
    },
    {
      id: "finance-budget",
      title: "Financial Ledger & Budget",
      titleNp: "वित्तीय हिसाव र बजेट",
      description: "Income, expenses, debt schedules and monthly reports.",
      category: "professional",
      iconName: "DollarSign",
      badge: "$14,250 Balance",
      careSubTab: "finance",
      colorClass: "from-green-600 to-emerald-800"
    }
  ];

  // Custom Added Services State with localStorage Persistence
  const ALL_MASTER_SERVICES: ServiceConfig[] = [
    {
      id: "elderly",
      title: "Senior & Patient Vitals",
      titleNp: "जेष्ठ नागरिक तथा बिरामी भिटल्स",
      description: "Log blood pressure, pulse, glucose and vision tests.",
      category: "personal",
      iconName: "HeartPulse",
      badge: "1 Patient • 120/80",
      careSubTab: "elderly",
      colorClass: "from-emerald-600 to-teal-800"
    },
    {
      id: "water",
      title: "Water Intake & Hydration",
      titleNp: "पिउने पानी ट्र्याकर",
      description: "Daily hydration goals & dosage reminders.",
      category: "personal",
      iconName: "Droplets",
      badge: "2,150 / 2,500 ml",
      careSubTab: "water",
      colorClass: "from-cyan-600 to-emerald-700"
    },
    {
      id: "medicine",
      title: "Medicine & Prescriptions",
      titleNp: "औषधि तथा प्रेस्किप्सन",
      description: "Pill schedules, dosage tracking & refills.",
      category: "personal",
      iconName: "Pill",
      badge: "3 Daily Meds",
      careSubTab: "medicine",
      colorClass: "from-emerald-700 to-teal-900"
    },
    {
      id: "sleep",
      title: "Sleep Quality & Meditation",
      titleNp: "निद्रा र ध्यान ट्र्याकर",
      description: "White noise soundscapes, sleep depth & breathing.",
      category: "personal",
      iconName: "Moon",
      badge: "8.2 hrs • 94%",
      careSubTab: "sleep",
      colorClass: "from-emerald-800 to-slate-900"
    },
    {
      id: "family_tree",
      title: "Family Tree & Lineage",
      titleNp: "वंशवृक्ष तथा नातागोता",
      description: "Multi-generation lineage mapping & family updates.",
      category: "personal",
      iconName: "Users",
      badge: "14 Mapped Members",
      careSubTab: "family_tree",
      colorClass: "from-emerald-600 to-green-800"
    },
    {
      id: "kids",
      title: "Kids Care & Growth",
      titleNp: "बालबालिकाको हेरचाह",
      description: "Pediatric growth charts, milestone logs & vaccinations.",
      category: "personal",
      iconName: "Smile",
      badge: "2 Kids Logged",
      careSubTab: "kids",
      colorClass: "from-teal-600 to-emerald-800"
    },
    {
      id: "pets",
      title: "Pet Care & Veterinary",
      titleNp: "घरपालुवा जनावरको हेरचाह",
      description: "Pet vaccination records, grooming schedules & nutrition.",
      category: "personal",
      iconName: "Dog",
      badge: "3 Pets Tracked",
      careSubTab: "pets",
      colorClass: "from-emerald-600 to-green-700"
    },
    {
      id: "menstrual",
      title: "Menstrual Cycle & Wellness",
      titleNp: "महिनावारी ट्र्याकर",
      description: "Cycle prediction, symptom tracking & ovulation insights.",
      category: "personal",
      iconName: "Heart",
      badge: "Day 14 • 28 Cycle",
      careSubTab: "menstrual",
      colorClass: "from-emerald-600 to-rose-700"
    },
    {
      id: "steps",
      title: "Steps & Fitness Activity",
      titleNp: "पाइला र व्यायाम",
      description: "Daily step counter, calorie burn & active minutes.",
      category: "personal",
      iconName: "Footprints",
      badge: "8,420 Steps",
      careSubTab: "steps",
      colorClass: "from-emerald-500 to-teal-700"
    },
    {
      id: "yoga",
      title: "Yoga & Meditation Routine",
      titleNp: "योग तथा ध्यान",
      description: "Guided posture routines & diaphragmatic breathwork.",
      category: "personal",
      iconName: "Activity",
      badge: "15 mins • 3 Sessions",
      careSubTab: "yoga",
      colorClass: "from-teal-600 to-emerald-900"
    },
    {
      id: "mood",
      title: "Mood & Habit Journal",
      titleNp: "मनोभाव र बानी ट्र्याकर",
      description: "Daily emotional check-ins, gratitude logs & habit streaks.",
      category: "personal",
      iconName: "Smile",
      badge: "7 Day Streak",
      careSubTab: "mood",
      colorClass: "from-emerald-600 to-teal-800"
    },
    {
      id: "life_dates",
      title: "Important Life Dates",
      titleNp: "महत्वपूर्ण तिथि र जन्मदिन",
      description: "Birthdays, anniversaries, ritual dates & custom alerts.",
      category: "personal",
      iconName: "Clock",
      badge: "4 Events Saved",
      careSubTab: "life_dates",
      colorClass: "from-emerald-600 to-teal-900"
    },
    {
      id: "staff",
      title: "Staff Attendance & Payroll",
      titleNp: "कर्मचारी हाजिरी र तलब",
      description: "Clock-in attendance, trial probation & salary receipts.",
      category: "professional",
      iconName: "Briefcase",
      badge: "8 Staff Clocked In",
      careSubTab: "staff_payroll",
      colorClass: "from-emerald-800 to-teal-950"
    },
    {
      id: "contracts",
      title: "Legal Deeds & Contracts",
      titleNp: "कानुनी सम्झौता र कागजात",
      description: "IGOPaperless contracts with photo witness & thumb stamps.",
      category: "professional",
      iconName: "FileText",
      badge: "12 Verified Deeds",
      careSubTab: "contracts",
      colorClass: "from-emerald-700 to-slate-900"
    },
    {
      id: "inventory",
      title: "Inventory & Stock Control",
      titleNp: "जिन्सी तथा स्टक व्यवस्थापन",
      description: "Stock SKUs, reorder thresholds & vendor terms.",
      category: "professional",
      iconName: "Package",
      badge: "45 SKUs Active",
      careSubTab: "inventory",
      colorClass: "from-emerald-800 to-teal-900"
    },
    {
      id: "property",
      title: "Property & Real Estate",
      titleNp: "जग्गा जमिन र घर भाडा",
      description: "Plot boundaries, tenant lease terms & rent collection.",
      category: "professional",
      iconName: "HomeIcon",
      badge: "4 Land Plots",
      careSubTab: "property",
      colorClass: "from-emerald-700 to-teal-900"
    },
    {
      id: "jobsearch",
      title: "Caregiver Job Network",
      titleNp: "केयरगिभर रोजगारी सञ्जाल",
      description: "Zero-fee job portal, candidate screening & bio generator.",
      category: "professional",
      iconName: "Briefcase",
      badge: "5 Openings",
      careSubTab: "jobs",
      colorClass: "from-emerald-600 to-teal-900"
    },
    {
      id: "finance",
      title: "Financial Ledger & Budget",
      titleNp: "वित्तीय हिसाव र बजेट",
      description: "Income, expenses, debt schedules and monthly reports.",
      category: "professional",
      iconName: "DollarSign",
      badge: "$14,250 Balance",
      careSubTab: "finance",
      colorClass: "from-emerald-600 to-green-900"
    },
    {
      id: "vehicles",
      title: "Vehicle Care & Fleet",
      titleNp: "सवारी साधन र मर्मत",
      description: "Service intervals, fuel logs, tax & insurance renewal.",
      category: "professional",
      iconName: "Car",
      badge: "2 Vehicles Active",
      careSubTab: "vehicles",
      colorClass: "from-emerald-700 to-teal-800"
    },
    {
      id: "garden",
      title: "Garden & Farm Records",
      titleNp: "बगैंचा र कृषि अभिलेख",
      description: "Crop cycles, soil condition, livestock & harvest logs.",
      category: "professional",
      iconName: "TreePine",
      badge: "6 Crop Batches",
      careSubTab: "garden",
      colorClass: "from-green-700 to-emerald-900"
    },
    {
      id: "hybrid_storage",
      title: "Hybrid Cloud Storage Drive",
      titleNp: "हाइब्रिड क्लाउड ड्राइभ",
      description: "Encrypted document vault, offline cache & cloud sync.",
      category: "professional",
      iconName: "Layers",
      badge: "18 Vault Files",
      careSubTab: "hybrid_storage",
      colorClass: "from-emerald-800 to-slate-900"
    },
    {
      id: "paperless",
      title: "IGOPaperless Digital Cards",
      titleNp: "डिजिटल कार्ड तथा QR",
      description: "Encrypted QR identity cards, gate passes & certificates.",
      category: "professional",
      iconName: "ShieldCheck",
      badge: "12 Digital Passes",
      careSubTab: "paperless",
      colorClass: "from-teal-700 to-emerald-900"
    }
  ];

  // Favorites and Feed Filter state
  const [favoriteServiceIds, setFavoriteServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_favorite_service_ids");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ["elderly", "water", "staff", "contracts"];
  });

  const [feedFilter, setFeedFilter] = useState<"selected" | "frequent" | "favorites" | "recent">("selected");

  const toggleFavoriteService = (serviceId: string) => {
    setFavoriteServiceIds((prev) => {
      const next = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
      try {
        localStorage.setItem("care2care_favorite_service_ids", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // User-enabled services in localStorage
  const [userEnabledServiceIds, setUserEnabledServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_enabled_service_ids");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback default initial services
    }
    return [
      "elderly", "water", "medicine", "sleep", "family_tree", "passes",
      "staff", "contracts", "inventory", "property", "jobsearch", "finance"
    ];
  });

  const toggleService = (serviceId: string) => {
    setUserEnabledServiceIds((prev) => {
      const next = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
      try {
        localStorage.setItem("care2care_enabled_service_ids", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const activeServices = ALL_MASTER_SERVICES.filter((s) => userEnabledServiceIds.includes(s.id));
  const availableServices = activeServices.filter((s) =>
    isPersonalMode ? s.category === "personal" : s.category === "professional"
  );

  // Custom Dashboard Widgets according to Active Mode
  const personalWidgets: DashboardWidget[] = [
    {
      id: "vitals-bp",
      title: "Blood Pressure",
      category: "Vitals",
      value: "120/80 mmHg",
      subtitle: "Optimal range • 72 BPM Pulse",
      statusColor: "text-emerald-500",
      actionSubTab: "elderly"
    },
    {
      id: "hydration-level",
      title: "Daily Hydration",
      category: "Water",
      value: "1,500 / 2,000 ml",
      subtitle: "75% of daily target reached",
      statusColor: "text-cyan-500",
      actionSubTab: "water"
    },
    {
      id: "meds-count",
      title: "Today's Prescriptions",
      category: "Medications",
      value: "3 / 4 Taken",
      subtitle: "Next: Evening Multivitamin",
      statusColor: "text-indigo-500",
      actionSubTab: "water"
    },
    {
      id: "family-members",
      title: "Family Tree Members",
      category: "Lineage",
      value: "14 People",
      subtitle: "7 Generations mapped",
      statusColor: "text-amber-500",
      actionSubTab: "family_tree"
    }
  ];

  const professionalWidgets: DashboardWidget[] = [
    {
      id: "staff-clockin",
      title: "Active Staff On Duty",
      category: "Attendance",
      value: "8 Staff Clocked In",
      subtitle: "100% on-time attendance today",
      statusColor: "text-emerald-400",
      actionSubTab: "staff_payroll"
    },
    {
      id: "staff-probation",
      title: "Caregivers in Probation",
      category: "Trial Evaluation",
      value: "2 Caregivers",
      subtitle: "14 days remaining for review",
      statusColor: "text-amber-400",
      actionSubTab: "staff_payroll"
    },
    {
      id: "legal-deeds",
      title: "Registered Deeds",
      category: "Contracts",
      value: "12 Verified Deeds",
      subtitle: "Thumb stamps & witness photos bound",
      statusColor: "text-indigo-400",
      actionSubTab: "contracts"
    },
    {
      id: "stock-alerts",
      title: "Inventory Stock",
      category: "Warehouse",
      value: "45 SKUs Active",
      subtitle: "3 low stock items need reorder",
      statusColor: "text-rose-400",
      actionSubTab: "inventory"
    }
  ];

  const dashboardWidgets = isPersonalMode ? personalWidgets : professionalWidgets;

  // Aggregate account-specific statistics for profile choice cards
  const accountStats: AccountStats = {
    personal: {
      title: "Personal Care Profile",
      waterIntake: "1,500 / 2,000 ml",
      waterProgress: 75,
      pendingMedsCount: 1,
      medsStatus: "3 of 4 Taken Today",
      vitalsStatus: "BP: 120/80 • 99% SpO2",
      familyCount: 14,
      primaryBadge: "💧 1,500ml Water",
      secondaryBadge: "❤️ Normal Vitals"
    },
    professional: {
      title: "Professional & Staff Profile",
      activeContracts: 12,
      clockedInStaff: 8,
      totalStaff: 10,
      lowStockSkus: 3,
      openJobPosts: 4,
      primaryBadge: "📜 12 Verified Deeds",
      secondaryBadge: "👨‍⚕️ 8 On Duty"
    }
  };

  return {
    isPersonalMode,
    mainCategoryMode,
    activeSubTab,
    setActiveSubTab,
    switchProfileChoice,
    subTabOptions: currentSubTabOptions,
    availableServices,
    allMasterServices: ALL_MASTER_SERVICES,
    userEnabledServiceIds,
    toggleService,
    favoriteServiceIds,
    toggleFavoriteService,
    feedFilter,
    setFeedFilter,
    dashboardWidgets,
    accountStats
  };
}
