import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  HeartPulse,
  Pill,
  Droplets,
  Dumbbell,
  Smile,
  Users,
  Briefcase,
  Wallet,
  Car,
  Leaf,
  Moon,
  FolderLock,
  Calendar,
  Ticket,
  Bot,
  Shield,
  FileCheck,
  Package,
  Baby,
  Dog,
  Network,
  Home,
  ShieldAlert,
  Flame,
  Clock,
  Compass,
  LayoutGrid
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  category: "health" | "finance" | "family" | "assets" | "productivity" | "tools";
  categoryLabel: string;
  icon: string;
  description: string;
  subTabTarget: string;
  badge?: string;
  popular?: boolean;
}

export const ALL_SERVICES_CATALOG: ServiceItem[] = [
  // Health & Vitals
  {
    id: "vitals",
    title: "Health Vitals & SpO2",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🩺",
    description: "Real-time blood pressure, pulse, SpO2 & glucose telemetry tracker.",
    subTabTarget: "vitals",
    popular: true
  },
  {
    id: "medicine",
    title: "Medicine & Prescriptions",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "💊",
    description: "Daily dosage reminders, pill schedule & pharmacy refill alerts.",
    subTabTarget: "medicine",
    popular: true
  },
  {
    id: "water",
    title: "Hydration & Water Goal",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "💧",
    description: "Interactive daily hydration target with hourly drinking notifications.",
    subTabTarget: "water",
    popular: true
  },
  {
    id: "steps",
    title: "Steps & Calorie Tracker",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🏃",
    description: "Pedometer step counts, active distance & daily fitness goals.",
    subTabTarget: "steps"
  },
  {
    id: "yoga",
    title: "Yoga & Mindfulness",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🧘",
    description: "Guided 4-7-8 diaphragmatic breathing, meditation timers & poses.",
    subTabTarget: "yoga"
  },
  {
    id: "mood",
    title: "Mood & Recovery Journal",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "😊",
    description: "Emotional well-being log, urge interruption & gratitude diary.",
    subTabTarget: "mood"
  },
  {
    id: "mental",
    title: "Mental Health Support",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🧠",
    description: "Stress assessments, guided reflection prompts & therapy check-ins.",
    subTabTarget: "mental"
  },
  {
    id: "sleep",
    title: "Sleep Quality & Soundscapes",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🌙",
    description: "Sleep duration logs, circadian rhythm analysis & ambient noise.",
    subTabTarget: "sleep"
  },
  {
    id: "nutrition",
    title: "Nutrition & Meal Planner",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🍽️",
    description: "Macronutrient breakdown, dietary restrictions & calorie logs.",
    subTabTarget: "nutrition"
  },
  {
    id: "menstrual",
    title: "Menstrual Cycle Tracker",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🌸",
    description: "Period cycle forecasting, symptom trends & fertility predictions.",
    subTabTarget: "menstrual"
  },
  {
    id: "exercise",
    title: "Exercise & Workout Hub",
    category: "health",
    categoryLabel: "Health & Vitals",
    icon: "🏋️",
    description: "Strength workout routines, cardio logs & repetition records.",
    subTabTarget: "exercise"
  },

  // Productivity & Gamification
  {
    id: "habit_challenges",
    title: "21-Day Habit Challenges",
    category: "productivity",
    categoryLabel: "Productivity & Habits",
    icon: "🏆",
    description: "Scratch daily cards, spin positive reward wheels & 21-day streaks.",
    subTabTarget: "habit_challenges",
    badge: "Hot 🔥",
    popular: true
  },
  {
    id: "habit",
    title: "Habit & Recovery Engine",
    category: "productivity",
    categoryLabel: "Productivity & Habits",
    icon: "📈",
    description: "Daily routine building, trigger analysis & habit streak counters.",
    subTabTarget: "habit"
  },
  {
    id: "life_dates",
    title: "Life Dates & Anniversaries",
    category: "productivity",
    categoryLabel: "Productivity & Habits",
    icon: "💝",
    description: "Birthdays, important milestones, gift ideas & countdowns.",
    subTabTarget: "life_dates"
  },
  {
    id: "calendar",
    title: "40+ Global Calendars",
    category: "tools",
    categoryLabel: "Tools & Utilities",
    icon: "🌍",
    description: "Instant converter between Gregorian, Nepali Bikram Sambat, Hijri & more.",
    subTabTarget: "calendar"
  },

  // Finance & Business
  {
    id: "finance",
    title: "Finance & Cash Flow",
    category: "finance",
    categoryLabel: "Finance & Business",
    icon: "💰",
    description: "Income/expense ledgers, budget caps, receipts & savings tracker.",
    subTabTarget: "finance",
    popular: true
  },
  {
    id: "staff_payroll",
    title: "Staff HR & Payroll",
    category: "finance",
    categoryLabel: "Finance & Business",
    icon: "💼",
    description: "Employee attendance, timesheets, salary payouts & proof of work.",
    subTabTarget: "staff_payroll"
  },
  {
    id: "inventory",
    title: "Retail POS & Stock Inventory",
    category: "finance",
    categoryLabel: "Finance & Business",
    icon: "📦",
    description: "Product inventory, barcode lookups, low stock alerts & suppliers.",
    subTabTarget: "inventory"
  },
  {
    id: "contracts",
    title: "Contract & Legal Vault",
    category: "finance",
    categoryLabel: "Finance & Business",
    icon: "📜",
    description: "Digital legal contracts, biometric thumbprint capture & witness sign.",
    subTabTarget: "contracts"
  },
  {
    id: "jobs",
    title: "Career & Job Search Hub",
    category: "finance",
    categoryLabel: "Finance & Business",
    icon: "👔",
    description: "Application tracker, interview schedules, resume versions & offers.",
    subTabTarget: "jobs"
  },
  {
    id: "custom_store",
    title: "Custom E-Commerce Store",
    category: "finance",
    categoryLabel: "Finance & Business",
    icon: "🛒",
    description: "Digital product catalog, shopping cart checkout & store orders.",
    subTabTarget: "custom_store"
  },

  // Family & Senior Care
  {
    id: "elderly",
    title: "Elderly & Senior Portal",
    category: "family",
    categoryLabel: "Family & Senior Care",
    icon: "👴",
    description: "Mobility logs, caregiver notes, fall detection alerts & medications.",
    subTabTarget: "elderly",
    popular: true
  },
  {
    id: "kids",
    title: "Kids & Pediatric Care",
    category: "family",
    categoryLabel: "Family & Senior Care",
    icon: "👶",
    description: "Growth milestones, vaccination dates, school events & emergency IDs.",
    subTabTarget: "kids"
  },
  {
    id: "family_tree",
    title: "Family Tree & Heritage",
    category: "family",
    categoryLabel: "Family & Senior Care",
    icon: "👨‍👩‍👧‍👦",
    description: "Multi-generation visual lineage, ancestry tree & heritage archive.",
    subTabTarget: "family_tree"
  },
  {
    id: "pets",
    title: "Pet & Vet Records",
    category: "family",
    categoryLabel: "Family & Senior Care",
    icon: "🐾",
    description: "Vet visits, rabies vaccine certificates, diet & grooming log.",
    subTabTarget: "pets"
  },

  // Assets & Tools
  {
    id: "vehicles",
    title: "Vehicle Care & Mileage",
    category: "assets",
    categoryLabel: "Assets & Tools",
    icon: "🚗",
    description: "Fuel efficiency logs, maintenance reminders, insurance & PUC expiry.",
    subTabTarget: "vehicles"
  },
  {
    id: "property",
    title: "Property, Land & Farm",
    category: "assets",
    categoryLabel: "Assets & Tools",
    icon: "🏡",
    description: "Land plot deeds, irrigation schedule, crop harvest & tenancy records.",
    subTabTarget: "property"
  },
  {
    id: "garden",
    title: "Garden & Crop Harvest",
    category: "assets",
    categoryLabel: "Assets & Tools",
    icon: "🌿",
    description: "Botanical watering logs, soil health, planting seasons & yields.",
    subTabTarget: "garden"
  },
  {
    id: "paperless",
    title: "Paperless Digital Vault",
    category: "tools",
    categoryLabel: "Tools & Utilities",
    icon: "📄",
    description: "OCR scanned IDs, cards, medical reports & encrypted document vault.",
    subTabTarget: "paperless"
  },
  {
    id: "passwords",
    title: "Encrypted Password Manager",
    category: "tools",
    categoryLabel: "Tools & Utilities",
    icon: "🔐",
    description: "Zero-knowledge encrypted logins, PINs & master vault security.",
    subTabTarget: "passwords"
  },
  {
    id: "hybrid_storage",
    title: "Hybrid Cloud Storage Drive",
    category: "tools",
    categoryLabel: "Tools & Utilities",
    icon: "📁",
    description: "Cross-device encrypted file manager, backup archives & photo sync.",
    subTabTarget: "hybrid_storage"
  },
  {
    id: "ticket_queue",
    title: "Digital Queue & Token Counter",
    category: "tools",
    categoryLabel: "Tools & Utilities",
    icon: "🎫",
    description: "Token number dispenser, customer calling board & ticket desk.",
    subTabTarget: "ticket_queue"
  },
  {
    id: "sos",
    title: "SOS Emergency Panic Hub",
    category: "tools",
    categoryLabel: "Tools & Utilities",
    icon: "🆘",
    description: "One-touch emergency siren, GPS broadcast & next-of-kin alert.",
    subTabTarget: "sos"
  }
];

const CATEGORIES: Array<{ id: string; label: string; icon: string }> = [
  { id: "all", label: "All Services (30+)", icon: "✨" },
  { id: "health", label: "Health & Vitals", icon: "🩺" },
  { id: "productivity", label: "Habits & Quests", icon: "🏆" },
  { id: "finance", label: "Finance & Business", icon: "💰" },
  { id: "family", label: "Family & Senior", icon: "👨‍👩‍👧‍👦" },
  { id: "assets", label: "Assets & Vehicles", icon: "🏡" },
  { id: "tools", label: "Vault & Utilities", icon: "🔐" }
];

interface ServiceLibraryProps {
  onBackToHome: () => void;
  onSelectService: (subTabTarget: string) => void;
}

export const ServiceLibrary: React.FC<ServiceLibraryProps> = ({
  onBackToHome,
  onSelectService
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = useMemo(() => {
    return ALL_SERVICES_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 animate-in fade-in duration-300">
      {/* Top Header Card (Pastel Peach Aesthetic #FDE7D6 / #FFF9F5) */}
      <div className="bg-[#FFF9F5] dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 hover:bg-orange-50 text-slate-800 dark:text-white flex items-center justify-center shadow-xs cursor-pointer transition-all hover:scale-105"
              title="Back to Command Center"
            >
              <ArrowLeft className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-300 text-[11px] font-black rounded-full border border-orange-300 dark:border-orange-800 shadow-2xs mb-1">
                <Compass className="w-3.5 h-3.5 text-orange-600" />
                <span>COMPLETE SERVICE DIRECTORY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Service Library & Ecosystem
              </h2>
            </div>
          </div>

          <div className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 rounded-2xl text-xs font-black text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-orange-500" />
            <span>{ALL_SERVICES_CATALOG.length} Services Available</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
          Access every specialized module in Care2Care. Filter by category or search by keywords to jump directly into your tools, health logs, or business dashboards.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-orange-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 30+ services (e.g. Yoga, Medicine, Finance, Inventory, Pets, Paperless)..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-orange-200/80 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                  isActive
                    ? "bg-orange-600 text-white border-orange-600 shadow-md scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-orange-200/70 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700/60"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Responsive Grid of White Cards */}
      {filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            No services matched "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try checking for spelling errors, clearing the search query, or switching to the "All Services" category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectService(service.subTabTarget)}
              className="bg-white dark:bg-slate-900 border border-orange-100/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] dark:bg-slate-800 border border-orange-200/80 dark:border-slate-700 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {service.badge && (
                      <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-[10px] rounded-full border border-rose-300 dark:border-rose-800">
                        {service.badge}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 bg-orange-50 dark:bg-slate-800 text-orange-800 dark:text-orange-300 text-[10px] font-black rounded-full border border-orange-200/80 dark:border-slate-700">
                      {service.categoryLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center justify-between">
                    <span>{service.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                <span className="text-[11px] font-semibold text-slate-400">Open Dashboard</span>
                <span className="w-7 h-7 rounded-xl bg-orange-50 dark:bg-slate-800 group-hover:bg-orange-600 text-orange-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Return to Command Center Footer */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-xs cursor-pointer transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Command Center</span>
        </button>
      </div>
    </div>
  );
};
