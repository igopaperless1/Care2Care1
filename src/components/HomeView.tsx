import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  User,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame,
  Pill,
  Droplets,
  Trophy,
  Smile,
  Compass,
  Play,
  RotateCcw,
  Check,
  Plus,
  Coins,
  ShieldCheck,
  Clock,
  LayoutGrid,
  Sliders,
  CreditCard,
  Calendar,
  Briefcase,
  Layers,
  Settings2,
  X,
  Target,
  Moon,
  Footprints,
  Utensils,
  Heart,
  FileText,
  AlertTriangle,
  QrCode,
  Users,
  ShieldAlert,
  Building,
  Key,
  Search,
  ChevronDown
} from "lucide-react";
import {
  Patient,
  AccountType,
  AppState,
  DashboardPreferences,
  DEFAULT_PERSONAL_DASHBOARD_PREFS,
  DEFAULT_PROFESSIONAL_DASHBOARD_PREFS,
  DEFAULT_SUBACCOUNT_DASHBOARD_PREFS
} from "../types";
import { useLanguage } from "../context/LanguageContext";
import { ALL_SERVICES_CATALOG } from "../pages/ServiceLibrary";
import { DashboardCustomization } from "./DashboardCustomization";
import { CareChip, CareButton, CareCard } from "../design-system";

interface HomeViewProps {
  appState?: AppState;
  onUpdateAppState?: (updater: (prev: AppState) => AppState) => void;
  accountType?: AccountType;
  setAccountType?: (type: AccountType) => void;
  patient: Patient;
  patients?: Patient[];
  currentUser?: any;
  onSelectPatient?: (id: string) => void;
  onAddPatient?: (newPatient: Patient) => void;
  onNavigateToTab: (tab: "services" | "community" | "camera" | "insight" | "more" | "care" | "track" | "plan") => void;
  onNavigateToCareSubTab?: (subTab: string) => void;
  onNavigateToServicesLibrary?: () => void;
  onNavigateToChallenges?: () => void;
  onAddWater?: (patientId: string, amountMl: number) => void;
  onOpenSosModal?: () => void;
  onOpenQuickMenu?: () => void;
  onOpenAiAssistantModal?: () => void;
  onOpenVoiceAssistantModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenUserProfileModal?: (tab?: "personal" | "professional" | "dependents" | "dashboard_customization") => void;
  isAiToolsExpanded?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  accountType = "family",
  setAccountType,
  patient,
  patients = [],
  currentUser,
  onSelectPatient,
  onNavigateToTab,
  onNavigateToCareSubTab,
  onNavigateToServicesLibrary,
  onNavigateToChallenges,
  onAddWater,
  onOpenSosModal,
  onOpenAuthModal,
  onOpenUserProfileModal
}) => {
  const { t } = useLanguage();

  // Notification toast state
  const [showNotificationsToast, setShowNotificationsToast] = useState<boolean>(false);
  const [isQuickCustomizeOpen, setIsQuickCustomizeOpen] = useState<boolean>(false);

  // Formatted date
  const formattedTodayDate = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
  }, []);

  // Greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  }, []);

  const displayName = useMemo(() => {
    if (currentUser?.name && currentUser.name.trim() !== "") {
      return currentUser.name.split(" ")[0];
    }
    if (patient?.name && patient.name.trim() !== "") {
      return patient.name.split(" ")[0];
    }
    return "Eleanor";
  }, [currentUser, patient]);

  // Water intake
  const currentWaterMl = patient?.waterCurrentMl ?? 1400;
  const targetWaterMl = patient?.waterGoalMl ?? 2500;
  const waterPercent = Math.min(100, Math.round((currentWaterMl / (targetWaterMl || 2500)) * 100));

  // Dynamic state for task items
  const [medicationDoseTaken, setMedicationDoseTaken] = useState<boolean>(false);
  const [invoicePaid, setInvoicePaid] = useState<boolean>(false);
  const [nightWalkStarted, setNightWalkStarted] = useState<boolean>(false);

  // Pinned widgets selection state
  const [pinnedWidgets, setPinnedWidgets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("blessikaa_home_pinned_widgets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State for customize modal search & category
  const [customizeSearch, setCustomizeSearch] = useState("");
  const [customizeCategory, setCustomizeCategory] = useState("all");

  // State for categorized scrollable services menu
  const [servicesMenuCategory, setServicesMenuCategory] = useState("all");

  const togglePinWidget = (id: string) => {
    setPinnedWidgets((prev) => {
      const next = prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id];
      try {
        localStorage.setItem("blessikaa_home_pinned_widgets", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Comprehensive Main Services & Sub-Services Catalog
  const AVAILABLE_HOME_WIDGETS = [
    // 🩺 Health & Care Suite
    {
      id: "vitals",
      label: "Health Vitals & SpO2",
      icon: "🩺",
      desc: "Blood pressure, SpO2, heart rate & pulse logs",
      subTab: "vitals",
      category: "health",
      subServices: ["Blood Pressure Log", "SpO2 Oxygen", "Heart Rate & Pulse", "Blood Glucose", "Clinical Telemetry PDF"]
    },
    {
      id: "water",
      label: "Hydration Station",
      icon: "💧",
      desc: "Daily water target & quick +250ml logging",
      subTab: "water",
      category: "health",
      subServices: ["Daily 2.5L Target", "+250ml Quick Log", "Hourly Alerts", "Electrolyte Balance"]
    },
    {
      id: "medicine",
      label: "Medicine & Pillbox",
      icon: "💊",
      desc: "Prescription schedule, refill alerts & doses",
      subTab: "medicine",
      category: "health",
      subServices: ["Smart Pillbox Schedule", "Refill Alerts", "Daily Dose Logs", "Doctor Prescriptions"]
    },
    {
      id: "nutrition",
      label: "Nutrition & Meal Planner",
      icon: "🍽️",
      desc: "Dietary logging, macro targets & recipes",
      subTab: "nutrition",
      category: "health",
      subServices: ["Calorie Counter", "Macro Ratios", "Meal Scheduler", "Allergy Guard"]
    },
    {
      id: "sleep",
      label: "Sleep & Circadian Rhythm",
      icon: "🌙",
      desc: "Sleep duration, rest quality & sleep score",
      subTab: "sleep",
      category: "health",
      subServices: ["Sleep Score", "Circadian Curve", "Deep / REM Rest", "Wind-down Audio"]
    },
    {
      id: "mood",
      label: "Mood & Habit Journal",
      icon: "😊",
      desc: "Daily emotional check-ins & reflections",
      subTab: "mood",
      category: "health",
      subServices: ["Emotional Check-in", "CBT Prompts", "Gratitude Log", "Stress Triggers"]
    },
    {
      id: "steps",
      label: "Step & Movement Tracker",
      icon: "🚶",
      desc: "Daily 10k step goals, distance & burn logs",
      subTab: "steps",
      category: "health",
      subServices: ["10k Step Goal", "Distance (km)", "Calorie Burn", "Hourly Stand Alert"]
    },
    {
      id: "exercise",
      label: "Fitness & Workout Hub",
      icon: "🏋️",
      desc: "HIIT routines, cardio & strength sets",
      subTab: "exercise",
      category: "health",
      subServices: ["Strength Sets", "Cardio Workouts", "HIIT Timers", "Rep Counters"]
    },
    {
      id: "yoga",
      label: "Mindful Yoga & Breathwork",
      icon: "🧘",
      desc: "Guided asanas, pranayama & zen timers",
      subTab: "yoga",
      category: "health",
      subServices: ["Guided Asanas", "Pranayama Timer", "Zen Meditations", "Posture Guide"]
    },
    {
      id: "mental",
      label: "Mental Health & Relief",
      icon: "🧠",
      desc: "Anxiety grounding, therapy notes & coping tools",
      subTab: "mental",
      category: "health",
      subServices: ["5-4-3-2-1 Grounding", "Therapist Notes", "Panic Ease", "Affirmations"]
    },
    {
      id: "menstrual",
      label: "Menstrual & Cycle Tracker",
      icon: "🌸",
      desc: "Period calendar, symptoms & ovulation windows",
      subTab: "menstrual",
      category: "health",
      subServices: ["Cycle Calendar", "Ovulation Window", "Symptom Logging", "PMS Predictor"]
    },
    {
      id: "elderly",
      label: "Elderly & Senior Care Portal",
      icon: "👴",
      desc: "Fall detection, mobility aid & caregiver logs",
      subTab: "elderly",
      category: "health",
      subServices: ["Fall Detection", "Mobility Aide", "Caregiver Notes", "Emergency Call"]
    },
    {
      id: "kids",
      label: "Kids & Pediatric Care",
      icon: "👶",
      desc: "Vaccinations, milestones, school & growth logs",
      subTab: "kids",
      category: "health",
      subServices: ["Vaccination Chart", "Milestones", "Growth Curves", "School Schedules"]
    },
    {
      id: "habit_challenges",
      label: "21-Day Habit Challenge",
      icon: "🏆",
      desc: "Scratch cards, streak quests & rewards",
      subTab: "habit_challenges",
      category: "health",
      subServices: ["Daily Scratch Card", "21-Day Quest", "Streak Badges", "Lifetime Habit"]
    },
    {
      id: "habit",
      label: "Habit & Recovery Tracker",
      icon: "📈",
      desc: "Relapse prevention & streak milestones",
      subTab: "habit",
      category: "health",
      subServices: ["Streak Vault", "Milestone Badges", "Trigger Analysis", "Relapse Prevention"]
    },

    // 💰 Finance, Commerce & Work Suite
    {
      id: "billing",
      label: "Billing & Invoice Suite",
      icon: "🧾",
      desc: "Create invoices, receipts & track payment status",
      subTab: "billing",
      category: "finance",
      subServices: ["Invoice Generator", "PDF Export", "Receipt Vault", "Payment Status"]
    },
    {
      id: "finance",
      label: "Finance & Budget Ledger",
      icon: "💰",
      desc: "Income, expense ledgers & savings envelopes",
      subTab: "finance",
      category: "finance",
      subServices: ["Income / Expense", "Savings Envelopes", "Cash Flow Chart", "Tax Categorizer"]
    },
    {
      id: "staff_payroll",
      label: "Staff HR & Payroll",
      icon: "💼",
      desc: "Employee records, attendance & pay slips",
      subTab: "staff_payroll",
      category: "finance",
      subServices: ["Attendance Clock", "Salary Slip Generator", "Staff Roster", "Leave Manager"]
    },
    {
      id: "contracts",
      label: "Contracts & Legal Vault",
      icon: "📜",
      desc: "Smart agreements, signatures & deed records",
      subTab: "contracts",
      category: "finance",
      subServices: ["E-Signatures", "Agreement Templates", "Expiry Alerts", "Deed Vault"]
    },
    {
      id: "inventory",
      label: "POS & Stock Inventory",
      icon: "📦",
      desc: "Barcodes, warehouse stock & low-stock alerts",
      subTab: "inventory",
      category: "finance",
      subServices: ["Barcode Scanner", "Stock In/Out", "Low-Stock Alerts", "Supplier Contacts"]
    },
    {
      id: "custom_store",
      label: "Custom Store Marketplace",
      icon: "🛒",
      desc: "Product catalog, orders & payment checkout",
      subTab: "custom_store",
      category: "finance",
      subServices: ["Item Catalog", "Customer Orders", "Payment QR", "Digital Deliveries"]
    },
    {
      id: "jobs",
      label: "Jobs & Freelance Gigs",
      icon: "👔",
      desc: "Job listings, applications & earnings tracker",
      subTab: "jobs",
      category: "finance",
      subServices: ["Application Tracker", "Client Contracts", "Gig Timesheets", "Earnings Payout"]
    },

    // 📄 Paperless Vault & Physical Assets
    {
      id: "paperless",
      label: "Paperless Digital Vault",
      icon: "📄",
      desc: "Visiting cards, degrees, IDs & certificate passes",
      subTab: "paperless",
      category: "paperless",
      subServices: ["Digital ID Cards", "Degree Certificates", "Smart QR Cards", "Passports & Visas"]
    },
    {
      id: "visiting_cards",
      label: "Visiting & Business Cards",
      icon: "📇",
      desc: "One-tap NFC & QR shareable identity pass",
      subTab: "paperless",
      category: "paperless",
      subServices: ["NFC Share", "QR Contact Card", "vCard Download", "Custom Themes"]
    },
    {
      id: "ticket_pass",
      label: "Tickets, Passes & Boarding",
      icon: "🎟️",
      desc: "Concert tickets, gate passes & travel itineraries",
      subTab: "paperless",
      category: "paperless",
      subServices: ["Gate Passes", "Boarding Pass", "Event Tickets", "Barcode Validation"]
    },
    {
      id: "certificates_vault",
      label: "Degrees & Certificates",
      icon: "🎓",
      desc: "Digital diplomas, licenses & verified achievements",
      subTab: "paperless",
      category: "paperless",
      subServices: ["Academic Degrees", "Trade Licenses", "Verification QR", "PDF Export"]
    },
    {
      id: "coupons_vault",
      label: "Coupons & Loyalty Passes",
      icon: "🏷️",
      desc: "Store discounts, gift cards & reward stamps",
      subTab: "paperless",
      category: "paperless",
      subServices: ["Discount Codes", "Gift Vouchers", "Stamp Cards", "Expiry Alert"]
    },
    {
      id: "qr_studio",
      label: "Dynamic QR Code Studio",
      icon: "📱",
      desc: "Custom branded QR codes with colors and logos",
      subTab: "paperless",
      category: "paperless",
      subServices: ["Branded QR", "Color Customizer", "UPI / WiFi QR", "High-Res SVG"]
    },
    {
      id: "signatures_vault",
      label: "Digital Biometric Signatures",
      icon: "✍️",
      desc: "Thumbprint capture & tamper-evident signatures",
      subTab: "paperless",
      category: "paperless",
      subServices: ["Thumbprint Capture", "Touch Signatures", "Witness Verification", "Timestamp Lock"]
    },
    {
      id: "property",
      label: "Property & Real Estate",
      icon: "🏠",
      desc: "Land deeds, tenant rents & property records",
      subTab: "property",
      category: "paperless",
      subServices: ["Land Deeds", "Tenant Lease", "Rent Ledgers", "Maintenance Logs"]
    },
    {
      id: "vehicles",
      label: "Vehicle & Fleet Care",
      icon: "🚗",
      desc: "Mileage, service logs, insurance & RC papers",
      subTab: "vehicles",
      category: "paperless",
      subServices: ["Mileage Logs", "Insurance Expiry", "Service History", "RC & Pollution Docs"]
    },
    {
      id: "pets",
      label: "Pet & Vet Ecosystem",
      icon: "🐾",
      desc: "Vet vaccinations, diet schedules & pet health",
      subTab: "pets",
      category: "paperless",
      subServices: ["Vaccination Records", "Vet Appointments", "Diet Portions", "Deworming Schedule"]
    },
    {
      id: "garden",
      label: "Farm & Garden Tracker",
      icon: "🌿",
      desc: "Planting calendars, soil health & harvest logs",
      subTab: "garden",
      category: "paperless",
      subServices: ["Planting Calendar", "Harvest Weight", "Soil / Water Logs", "Composting Timer"]
    },
    {
      id: "passwords",
      label: "Encrypted Password Vault",
      icon: "🔐",
      desc: "AES-256 password manager & 2FA authenticator",
      subTab: "passwords",
      category: "paperless",
      subServices: ["AES-256 Vault", "2FA Authenticator", "Password Generator", "Biometric Unlock"]
    },
    {
      id: "hybrid_storage",
      label: "Hybrid Cloud & Local Storage",
      icon: "📁",
      desc: "Offline storage sync & cloud document backups",
      subTab: "hybrid_storage",
      category: "paperless",
      subServices: ["Offline Sync", "Encrypted Cloud", "Auto-Backup", "Storage Quota"]
    },

    // 👨‍👩‍👧‍👦 Family, Safety & Schedules
    {
      id: "sos",
      label: "Emergency SOS & Panic Hub",
      icon: "🆘",
      desc: "1-Tap emergency broadcast & emergency contacts",
      subTab: "sos",
      category: "family",
      subServices: ["1-Tap Siren", "GPS Location SMS", "Emergency Contacts", "Hospital Speed Dial"]
    },
    {
      id: "community",
      label: "Community Feed & Care Groups",
      icon: "💬",
      desc: "Caregiver support groups, discussions & shared advice",
      subTab: "community",
      category: "family",
      subServices: ["Caregiver Network", "Peer Discussions", "Wellness Tips", "Shared Q&A"]
    },
    {
      id: "insight",
      label: "Health Insights & Analytics",
      icon: "📈",
      desc: "Telemetry correlation graphs & trends",
      subTab: "insight",
      category: "family",
      subServices: ["Vitals Correlator", "Sleep-Mood Index", "Hydration Trends", "Monthly Summary"]
    },
    {
      id: "ai_assistant_service",
      label: "Care2Care AI Health Concierge",
      icon: "✨",
      desc: "24/7 AI wellness assistant & medication guidelines",
      subTab: "vitals",
      category: "family",
      subServices: ["AI Medication Q&A", "Symptom Check", "Voice Interaction", "Daily Briefing"]
    },
    {
      id: "family_tree",
      label: "Family Tree & Kinship",
      icon: "👨‍👩‍👧‍👦",
      desc: "Genealogy, family relations & ancestry tree",
      subTab: "family_tree",
      category: "family",
      subServices: ["Ancestry Tree", "Relative Roles", "Shared Family Hub", "Kinship Dates"]
    },
    {
      id: "life_dates",
      label: "Life Dates & Anniversaries",
      icon: "💝",
      desc: "Birthdays, milestones & celebration reminders",
      subTab: "life_dates",
      category: "family",
      subServices: ["Birthdays", "Anniversaries", "Milestones", "Smart Gift Wishlist"]
    },
    {
      id: "calendar",
      label: "40+ World Calendars",
      icon: "🌍",
      desc: "Gregorian, Hijri, Lunar, Solar & schedules",
      subTab: "calendar",
      category: "family",
      subServices: ["Gregorian / Hijri", "Solar / Lunar", "Multi-Timezone", "Event Conversion"]
    },
    {
      id: "ticket_queue",
      label: "Digital Ticket & Queue Token",
      icon: "🎫",
      desc: "Queue tokens, appointment booking & pass slips",
      subTab: "ticket_queue",
      category: "family",
      subServices: ["Token Number Generator", "Queue Position", "Appointment Slip", "QR Gate Pass"]
    }
  ];

  // Helper methods for whole service vs sub-service selection
  const isMainServiceFullySelected = (service: (typeof AVAILABLE_HOME_WIDGETS)[0]) => {
    if (pinnedWidgets.includes(service.id)) return true;
    if (!service.subServices || service.subServices.length === 0) return false;
    return service.subServices.every((sub) => pinnedWidgets.includes(`${service.id}::${sub}`));
  };

  const isMainServicePartiallySelected = (service: (typeof AVAILABLE_HOME_WIDGETS)[0]) => {
    if (isMainServiceFullySelected(service)) return false;
    if (!service.subServices || service.subServices.length === 0) return false;
    return service.subServices.some((sub) => pinnedWidgets.includes(`${service.id}::${sub}`));
  };

  const getSelectedSubServicesCount = (service: (typeof AVAILABLE_HOME_WIDGETS)[0]) => {
    if (pinnedWidgets.includes(service.id)) return service.subServices.length;
    return service.subServices.filter((sub) => pinnedWidgets.includes(`${service.id}::${sub}`)).length;
  };

  const isSubServiceSelected = (serviceId: string, subName: string) => {
    return pinnedWidgets.includes(serviceId) || pinnedWidgets.includes(`${serviceId}::${subName}`);
  };

  const toggleMainService = (service: (typeof AVAILABLE_HOME_WIDGETS)[0]) => {
    const isFullySelected = isMainServiceFullySelected(service);
    setPinnedWidgets((prev) => {
      let next: string[];
      if (isFullySelected) {
        // Uncheck: Remove main service and all its sub-services
        next = prev.filter((id) => id !== service.id && !id.startsWith(`${service.id}::`));
      } else {
        // Check: Add main service AND all sub-services (adds whole service)
        const subKeys = service.subServices.map((sub) => `${service.id}::${sub}`);
        const filtered = prev.filter((id) => id !== service.id && !id.startsWith(`${service.id}::`));
        next = [...filtered, service.id, ...subKeys];
      }
      try {
        localStorage.setItem("blessikaa_home_pinned_widgets", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const toggleSubService = (service: (typeof AVAILABLE_HOME_WIDGETS)[0], subName: string) => {
    const subKey = `${service.id}::${subName}`;
    const isCurrentlySelected = isSubServiceSelected(service.id, subName);

    setPinnedWidgets((prev) => {
      let next: string[];
      if (isCurrentlySelected) {
        // If whole service was in pinned list, expand to individual sub-services excluding this one
        if (prev.includes(service.id)) {
          const otherSubs = service.subServices
            .filter((s) => s !== subName)
            .map((s) => `${service.id}::${s}`);
          next = prev.filter((id) => id !== service.id && id !== subKey);
          for (const s of otherSubs) {
            if (!next.includes(s)) next.push(s);
          }
        } else {
          next = prev.filter((id) => id !== subKey);
        }
      } else {
        // Add this specific sub-service
        const withNewSub = prev.includes(subKey) ? prev : [...prev, subKey];
        // If now all sub-services of this main service are checked, add main service ID
        const allSelected = service.subServices.every(
          (s) => s === subName || withNewSub.includes(`${service.id}::${s}`)
        );
        if (allSelected && !withNewSub.includes(service.id)) {
          next = [...withNewSub, service.id];
        } else {
          next = withNewSub;
        }
      }

      try {
        localStorage.setItem("blessikaa_home_pinned_widgets", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // State to track expanded accordion state in the customize modal
  const [expandedCustomizerServices, setExpandedCustomizerServices] = useState<Record<string, boolean>>({});

  const toggleExpandCustomizerService = (serviceId: string) => {
    setExpandedCustomizerServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Filtered widgets for customize modal (matches main label, desc, or any sub-service)
  const filteredAvailableWidgets = useMemo(() => {
    return AVAILABLE_HOME_WIDGETS.filter((w) => {
      const matchesCategory = customizeCategory === "all" || w.category === customizeCategory;
      const query = customizeSearch.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesMain =
        w.label.toLowerCase().includes(query) ||
        w.desc.toLowerCase().includes(query);
      const matchesSub = w.subServices.some((sub) =>
        sub.toLowerCase().includes(query)
      );

      return matchesCategory && (matchesMain || matchesSub);
    });
  }, [customizeCategory, customizeSearch]);

  // Resolved list of active shortcuts to display on the Home Screen
  const resolvedPinnedShortcuts = useMemo(() => {
    const list: Array<{
      uniqueKey: string;
      isSubService: boolean;
      mainServiceId: string;
      subServiceName?: string;
      label: string;
      parentLabel: string;
      icon: string;
      desc: string;
      subTab: string;
      category: string;
    }> = [];

    AVAILABLE_HOME_WIDGETS.forEach((service) => {
      const isWholeSelected = pinnedWidgets.includes(service.id);
      if (isWholeSelected) {
        // Whole main service is pinned
        list.push({
          uniqueKey: service.id,
          isSubService: false,
          mainServiceId: service.id,
          label: service.label,
          parentLabel: service.label,
          icon: service.icon,
          desc: service.desc,
          subTab: service.subTab,
          category: service.category
        });
      } else {
        // Check for individually pinned sub-services
        service.subServices.forEach((subName) => {
          const subKey = `${service.id}::${subName}`;
          if (pinnedWidgets.includes(subKey)) {
            list.push({
              uniqueKey: subKey,
              isSubService: true,
              mainServiceId: service.id,
              subServiceName: subName,
              label: subName,
              parentLabel: service.label,
              icon: service.icon,
              desc: `${service.label} • ${subName}`,
              subTab: service.subTab,
              category: service.category
            });
          }
        });
      }
    });

    return list;
  }, [pinnedWidgets]);

  // Filtered widgets for categorized scrollable services menu
  const menuServices = useMemo(() => {
    if (servicesMenuCategory === "all") return AVAILABLE_HOME_WIDGETS;
    return AVAILABLE_HOME_WIDGETS.filter((w) => w.category === servicesMenuCategory);
  }, [servicesMenuCategory]);

  // Active Challenge info
  const activeChallenge = useMemo(() => {
    try {
      const saved = localStorage.getItem("care2care_habit_challenges");
      if (saved) {
        const parsed = JSON.parse(saved);
        const active = parsed.find((c: any) => c.status === "Active") || parsed[0];
        if (active) return active;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      title: "21-Day Mindful Hydration & Detox",
      currentDay: 5,
      totalDays: 21,
      streak: 5,
      status: "Active"
    };
  }, []);

  const challengeCurrentDay = activeChallenge?.currentDay ?? 5;
  const challengeStreak = activeChallenge?.streak ?? 5;
  const isLifelongHabit = challengeCurrentDay > 21;
  const lifelongDayNumber = isLifelongHabit ? challengeCurrentDay : 22;
  const daysContinuing = isLifelongHabit ? challengeCurrentDay - 21 : 0;
  const challengePercent = Math.min(100, Math.round((Math.min(21, challengeCurrentDay) / 21) * 100));

  const handleAddWaterQuick = () => {
    if (onAddWater && patient?.id) {
      onAddWater(patient.id, 250);
    }
  };

  const handleOpenService = (subTab: string) => {
    if (onNavigateToCareSubTab) {
      onNavigateToCareSubTab(subTab);
    }
  };

  const handleOpenChallenges = () => {
    if (onNavigateToChallenges) {
      onNavigateToChallenges();
    } else if (onNavigateToCareSubTab) {
      onNavigateToCareSubTab("habit_challenges");
    }
  };

  // 12 Main Service Categories for Carousel
  const serviceSuites = [
    { id: "vitals", name: "Health & Medical", icon: "🩺", desc: "SpO2, BP, Medical QR, Pill Refill, Doctor Vault", color: "from-rose-500 to-red-600" },
    { id: "elderly", name: "Elderly & Senior Portal", icon: "👴", desc: "Fall detection, Caregiver daily log, Mobility tracker", color: "from-amber-500 to-orange-600" },
    { id: "paperless", name: "Paperless & Digital Cards", icon: "📄", desc: "Digital ID cards, Deeds, Diplomas, QR Badges", color: "from-blue-500 to-indigo-600" },
    { id: "finance", name: "Finance & Cash Flow", icon: "💰", desc: "Budgeting, Bill reminders, Receipt vault, Invoices", color: "from-emerald-500 to-teal-600" },
    { id: "contracts", name: "Contracts & Legal Vault", icon: "📜", desc: "Smart agreements, Land deeds, Signatures & Lineage", color: "from-purple-500 to-violet-600" },
    { id: "property", name: "Property & Real Estate", icon: "🏠", desc: "Land titles, Tenant dues, Maintenance & Blueprints", color: "from-sky-500 to-cyan-600" },
    { id: "vehicles", name: "Vehicle & Fleet Care", icon: "🚗", desc: "Mileage, Fuel expenses, Insurance & RC papers", color: "from-orange-500 to-amber-600" },
    { id: "kids", name: "Kids & Pediatric Care", icon: "👶", desc: "Growth charts, Vaccinations, School & Hobbies", color: "from-pink-500 to-rose-600" },
    { id: "pets", name: "Pet & Vet Ecosystem", icon: "🐾", desc: "Vaccinations, Diet schedules, Vet appointments", color: "from-yellow-500 to-amber-600" },
    { id: "garden", name: "Garden & Farm Tracker", icon: "🌿", desc: "Crops, Irrigation, Soil health, Harvest log", color: "from-green-500 to-emerald-600" },
    { id: "inventory", name: "Retail Inventory & POS", icon: "📦", desc: "Stock management, Barcode scanning, Billing", color: "from-indigo-500 to-blue-600" },
    { id: "passwords", name: "Encrypted Password Vault", icon: "🔐", desc: "AES-256 Vault, 2FA codes, Secure PIN lock", color: "from-slate-700 to-slate-900" }
  ];

  // Paperless Card Highlights
  const paperlessCards = [
    { id: "visiting_card", title: "Digital Visiting Card", icon: "📇", desc: "One-tap NFC & QR shareable identity pass" },
    { id: "contract_deed", title: "Deeds & Real Estate Papers", icon: "📜", desc: "Tamper-proof digital land registry" },
    { id: "diploma_cert", title: "Academic & Professional Degrees", icon: "🎓", desc: "Verified digital diplomas & licenses" },
    { id: "ticket_pass", title: "Events & Boarding Passes", icon: "🎟️", desc: "Flight itineraries & conference passes" },
    { id: "emergency_badge", title: "Medical Emergency QR Badge", icon: "🆘", desc: "Instant first-responder access card" }
  ];

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto text-left">
      {/* ========================================================================= */}
      {/* 1. UNIFIED WELCOME & SERVICES HUB HEADER CARD */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-slate-900 dark:via-orange-950/20 dark:to-slate-900 border border-orange-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs">
        {/* TOP ROW: GREETING & HEADER CONTROLS (MOVED IN PLACE OF DAILY GUIDANCE) */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0 text-left">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>{greetingText}, {displayName}</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {formattedTodayDate}
            </p>
          </div>

          {/* Right Side: Calendar, Notification Bell with Red Badge & Profile Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Calendar Button */}
            <button
              type="button"
              onClick={() => onNavigateToCareSubTab?.("calendar")}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#FF6A45] hover:bg-orange-50 dark:hover:bg-slate-700 flex items-center justify-center shadow-2xs cursor-pointer transition-all hover:scale-105"
              title="40+ World Calendars & Schedule"
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* 🔔 Notification Bell with Badge (3) */}
            <button
              type="button"
              onClick={() => setShowNotificationsToast(!showNotificationsToast)}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#FF6A45] hover:bg-orange-50 dark:hover:bg-slate-700 flex items-center justify-center shadow-2xs relative cursor-pointer transition-all hover:scale-105"
              title="3 New Reminders"
            >
              <Bell className="w-4 h-4" />
              <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-black absolute -top-1 -right-1 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                3
              </span>
            </button>

            {/* 👤 Profile Avatar */}
            <button
              type="button"
              onClick={() => {
                if (onOpenUserProfileModal) {
                  onOpenUserProfileModal("personal");
                } else if (onOpenAuthModal) {
                  onOpenAuthModal();
                }
              }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6A45] to-[#FB923C] text-white flex items-center justify-center font-black text-sm shadow-2xs hover:scale-105 transition-all cursor-pointer ring-2 ring-orange-200 dark:ring-slate-700"
              title="User Profile & Settings"
            >
              {displayName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS POPUP TOAST */}
        {showNotificationsToast && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-orange-200 dark:border-slate-700 shadow-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                Active Alerts & Reminders (3)
              </h4>
              <button
                onClick={() => setShowNotificationsToast(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="p-2 rounded-xl bg-orange-50 dark:bg-slate-800 flex items-center justify-between">
                <span>💊 Morning Vitamins & Metformin due (08:30 AM)</span>
                <button
                  onClick={() => {
                    setMedicationDoseTaken(true);
                    setShowNotificationsToast(false);
                  }}
                  className="text-[11px] px-2 py-0.5 bg-[#FF6A45] text-white rounded-lg"
                >
                  Take
                </button>
              </div>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-slate-800 flex items-center justify-between">
                <span>💧 Midday Hydration Goal: 1.1L remaining</span>
                <button
                  onClick={() => {
                    handleAddWaterQuick();
                    setShowNotificationsToast(false);
                  }}
                  className="text-[11px] px-2 py-0.5 bg-sky-500 text-white rounded-lg"
                >
                  +250ml
                </button>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-between">
                <span>💳 Utility Bill scheduled for review ($145.00)</span>
                <button
                  onClick={() => {
                    handleOpenService("finance");
                    setShowNotificationsToast(false);
                  }}
                  className="text-[11px] px-2 py-0.5 bg-emerald-600 text-white rounded-lg"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: WELCOME TO SERVICES & CARE HUB + COMMUNITY BUTTON */}
        <div className="pt-2 border-t border-orange-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 max-w-md sm:max-w-[58%]">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Welcome to Services & Care Hub
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your health vitals, daily routines, contracts and paperless asset vaults are organized in clean, scrollable horizontal sections below for a tidy and stress-free experience.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab("community")}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-black border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-orange-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#FF6A45]" />
            <span>Community & Feed</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CUSTOMIZE HOME SERVICES & SHORTCUTS BAR (CLEANED PER USER ANNOTATION) */}
      {/* ========================================================================= */}
      <div
        onClick={() => setIsQuickCustomizeOpen(true)}
        className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-orange-200 dark:hover:border-orange-900/60 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl bg-orange-500 group-hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center font-black text-xl shadow-xs transition-transform shrink-0"
            title="Add & Customize Home Services"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
              Customize Home Shortcuts
            </h3>
            <p className="text-[11px] text-slate-500 truncate">
              Tap (+) to select and organize your favorite main & sub-services on home
            </p>
          </div>
        </div>

        {/* BLUE-MARKED COUNTER BADGE MOVED IN PLACE OF RED-MARKED BUTTON */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/70 dark:border-orange-800/80 text-[#FF6A45] font-black text-xs shrink-0 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/60 transition-colors">
          <span>{pinnedWidgets.length} Active</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2B. CATEGORIZED SERVICES & SUB-SERVICES SCROLLABLE MENU */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
        {/* Section Title & Quick Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#FF6A45] flex items-center justify-center font-black text-sm">
              ⚡
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Categorized Services Directory
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Browse all 40+ main services & detailed sub-services
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToServicesLibrary) {
                onNavigateToServicesLibrary();
              } else {
                onNavigateToTab("library" as any);
              }
            }}
            className="text-[11px] font-black text-[#FF6A45] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Catalog</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Category Filter Pills (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "✨ All Services (40+)" },
            { id: "health", label: "🩺 Health & Care (15)" },
            { id: "finance", label: "💰 Finance & Work (8)" },
            { id: "paperless", label: "📄 Paperless & Assets (13)" },
            { id: "family", label: "👨‍👩‍👧‍👦 Family & Safety (9)" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setServicesMenuCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                servicesMenuCategory === cat.id
                  ? "bg-[#FF6A45] text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Horizontal Scrollable Menu Cards for Services & Sub-Services */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-1 px-1 snap-x">
          {menuServices.map((service) => {
            const isPinned = pinnedWidgets.includes(service.id);
            return (
              <div
                key={service.id}
                className="w-72 shrink-0 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-orange-300 dark:hover:border-orange-800 transition-all snap-start shadow-2xs space-y-2.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shrink-0">
                        {service.icon}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                          {service.label}
                        </h4>
                        <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinWidget(service.id);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors cursor-pointer shrink-0 ${
                        isPinned
                          ? "bg-[#FF6A45] text-white"
                          : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-600"
                      }`}
                      title={isPinned ? "Pinned to Home" : "Pin to Home Shortcuts"}
                    >
                      {isPinned ? "✓" : "+"}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Sub-services breakdown badges */}
                  {service.subServices && service.subServices.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Sub-Services ({service.subServices.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.subServices.slice(0, 3).map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700"
                          >
                            {sub}
                          </span>
                        ))}
                        {service.subServices.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold">
                            +{service.subServices.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToCareSubTab?.(service.subTab)}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-900 dark:text-white hover:text-[#FF6A45] font-black text-xs border border-slate-200 dark:border-slate-700 hover:border-orange-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Launch Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PINNED HOME SHORTCUTS ROW (CLEAN VIEW - NO REDUNDANT HEADER/LOGO/MANAGE) */}
      {/* ========================================================================= */}
      {resolvedPinnedShortcuts.length > 0 && (
        <div className="pt-0.5">
          <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1 px-0.5 snap-x">
            {resolvedPinnedShortcuts.map((shortcut) => {
              // Special Interactive Hydration Widget
              if (shortcut.mainServiceId === "water" && !shortcut.isSubService) {
                return (
                  <div
                    key={shortcut.uniqueKey}
                    className="min-w-[220px] max-w-[240px] p-3.5 rounded-3xl bg-[#FFEEDB] dark:bg-orange-950/40 border border-[#FDD9CB] dark:border-orange-900/60 shadow-2xs flex flex-col justify-between shrink-0 space-y-2.5 snap-start"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase text-[#C2410C] dark:text-orange-400">
                          Hydration
                        </span>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {(currentWaterMl / 1000).toFixed(1)}L / {(targetWaterMl / 1000).toFixed(1)}L
                        </h4>
                      </div>
                      <span className="text-xl">💧</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/90 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6A45] rounded-full" style={{ width: `${waterPercent}%` }} />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddWaterQuick}
                      className="w-full py-1.5 bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black text-[11px] rounded-xl shadow-xs cursor-pointer"
                    >
                      +250 ml
                    </button>
                  </div>
                );
              }

              // Special Invoices Widget
              if (shortcut.mainServiceId === "billing" && !shortcut.isSubService) {
                return (
                  <div
                    key={shortcut.uniqueKey}
                    onClick={() => handleOpenService("billing")}
                    className="min-w-[220px] max-w-[240px] p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between shrink-0 space-y-2 snap-start"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[9px] font-black uppercase text-orange-600">
                        Invoices & Bills
                      </span>
                      <span className="text-xl">🧾</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        Billing Suite
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        Invoices, receipts & payments
                      </p>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-[#FF6A45] flex items-center justify-between">
                      <span>Launch Studio</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              }

              // Standard Pinned Shortcut (Main Service or Specific Sub-Service)
              return (
                <div
                  key={shortcut.uniqueKey}
                  onClick={() => {
                    if (shortcut.subTab === "sos") {
                      if (onOpenSosModal) onOpenSosModal();
                    } else if (shortcut.subTab === "habit_challenges") {
                      handleOpenChallenges();
                    } else {
                      handleOpenService(shortcut.subTab);
                    }
                  }}
                  className="min-w-[200px] max-w-[230px] p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-orange-300 dark:hover:border-orange-900/60 transition-all cursor-pointer flex flex-col justify-between shrink-0 space-y-2 snap-start group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-black uppercase text-orange-600 dark:text-orange-400 truncate max-w-[130px]">
                      {shortcut.parentLabel}
                    </span>
                    <span className="text-xl p-1 rounded-lg bg-slate-50 dark:bg-slate-800 shrink-0">
                      {shortcut.icon}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-[#FF6A45] transition-colors">
                      {shortcut.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {shortcut.isSubService ? `Direct ${shortcut.label}` : shortcut.desc}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-[#FF6A45] flex items-center justify-between">
                    <span>{shortcut.isSubService ? "Open Sub-Service" : "Launch"}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOME SCREEN CUSTOMIZATION MODAL (SUB-SERVICES & WHOLE SERVICE SELECTION) */}
      {/* ========================================================================= */}
      {isQuickCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-orange-100 text-[#FF6A45] flex items-center justify-center font-black text-lg shadow-2xs">
                  +
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Customize Home Shortcuts
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Check individual sub-services or select the whole main service
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickCustomizeOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search & Category Filters */}
            <div className="space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customizeSearch}
                  onChange={(e) => setCustomizeSearch(e.target.value)}
                  placeholder="Search main services or sub-services (e.g. Blood Pressure, Visiting Cards, Billing)..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-orange-500"
                />
                {customizeSearch && (
                  <button
                    type="button"
                    onClick={() => setCustomizeSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { id: "all", label: "✨ All Services" },
                  { id: "health", label: "🩺 Health & Care" },
                  { id: "finance", label: "💰 Finance & Work" },
                  { id: "paperless", label: "📄 Paperless & Assets" },
                  { id: "family", label: "👨‍👩‍👧‍👦 Family & Safety" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCustomizeCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                      customizeCategory === cat.id
                        ? "bg-[#FF6A45] text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Services & Sub-Services Accordion Checklist */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
              {filteredAvailableWidgets.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs font-medium">
                  No services matching "{customizeSearch}"
                </div>
              ) : (
                filteredAvailableWidgets.map((service) => {
                  const isWholeSelected = isMainServiceFullySelected(service);
                  const isPartiallySelected = isMainServicePartiallySelected(service);
                  const selectedSubCount = getSelectedSubServicesCount(service);
                  const isExpanded =
                    expandedCustomizerServices[service.id] !== undefined
                      ? expandedCustomizerServices[service.id]
                      : true; // Default expanded for ease of sub-service selection

                  return (
                    <div
                      key={service.id}
                      className={`rounded-2xl border transition-all ${
                        isWholeSelected
                          ? "bg-orange-50/70 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700"
                          : isPartiallySelected
                          ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                          : "bg-slate-50 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800"
                      }`}
                    >
                      {/* Main Service Header Card */}
                      <div className="p-3.5 flex items-center justify-between gap-3">
                        <div
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                          onClick={() => toggleExpandCustomizerService(service.id)}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shrink-0">
                            {service.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                                {service.label}
                              </h4>
                              {isWholeSelected && (
                                <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white font-black text-[9px] uppercase tracking-wide">
                                  Whole Service Active
                                </span>
                              )}
                              {!isWholeSelected && isPartiallySelected && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase tracking-wide">
                                  {selectedSubCount} / {service.subServices.length} Sub-Services
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {service.desc}
                            </p>
                          </div>
                        </div>

                        {/* Right Actions: Whole Service Checkbox Button + Accordion Toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleMainService(service)}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isWholeSelected
                                ? "bg-[#FF6A45] hover:bg-[#EA580C] text-white"
                                : isPartiallySelected
                                ? "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700"
                                : "bg-white dark:bg-slate-800 hover:bg-orange-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300"
                            }`}
                            title={isWholeSelected ? "Remove Whole Service" : "Add Whole Service (All Sub-Services)"}
                          >
                            <span className="text-xs">
                              {isWholeSelected ? "✓" : isPartiallySelected ? "–" : "+"}
                            </span>
                            <span className="hidden sm:inline">
                              {isWholeSelected ? "Whole Service" : isPartiallySelected ? "Select All" : "Whole Service"}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpandCustomizerService(service.id)}
                            className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                            title={isExpanded ? "Collapse sub-services" : "Expand sub-services"}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Sub-Services Checklist (Expandable) */}
                      {isExpanded && service.subServices && service.subServices.length > 0 && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Check Sub-Services Only:
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {selectedSubCount} of {service.subServices.length} selected
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.subServices.map((subName) => {
                              const isSubChecked = isSubServiceSelected(service.id, subName);
                              return (
                                <div
                                  key={subName}
                                  onClick={() => toggleSubService(service, subName)}
                                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                    isSubChecked
                                      ? "bg-white dark:bg-slate-800 border-orange-400 dark:border-orange-500 shadow-2xs font-bold text-slate-900 dark:text-white"
                                      : "bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-white text-slate-600 dark:text-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                                        isSubChecked
                                          ? "bg-[#FF6A45] text-white"
                                          : "border border-slate-300 dark:border-slate-600 text-transparent"
                                      }`}
                                    >
                                      ✓
                                    </div>
                                    <span className="text-xs font-semibold truncate">
                                      {subName}
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 shrink-0">
                                    Sub-service
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                  {resolvedPinnedShortcuts.length} active shortcuts
                </span>
                {pinnedWidgets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPinnedWidgets([]);
                      try {
                        localStorage.setItem("blessikaa_home_pinned_widgets", JSON.stringify([]));
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-500 cursor-pointer underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsQuickCustomizeOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#FF6A45] hover:bg-[#EA580C] text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Done ({resolvedPinnedShortcuts.length} Active)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
