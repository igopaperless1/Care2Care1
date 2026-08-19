import React from "react";
import {
  HeartPulse,
  Pill,
  Droplets,
  Dumbbell,
  Sparkles,
  Smile,
  Wallet,
  Package,
  Users,
  User,
  Baby,
  Network,
  Dog,
  Car,
  Leaf,
  FileCheck,
  Shield,
  Moon,
  Heart,
  Briefcase,
  FolderLock,
  Ticket,
  Calendar,
  ShieldAlert
} from "lucide-react";

export interface ServiceModuleDef {
  id: string;
  label: string;
  category: "personal" | "business" | "family" | "assets";
  iconName: string;
  emojiIcon: string;
  description: string;
  tabTarget: "home" | "track" | "plan" | "care" | "more";
  subTabTarget?: string;
  defaultActive: boolean;
  quickActions: Array<{
    id: string;
    label: string;
    actionType: string;
  }>;
}

export const ALL_SERVICE_MODULES: Record<string, ServiceModuleDef> = {
  health_vitals: {
    id: "health_vitals",
    label: "Health Vitals & SpO2",
    category: "personal",
    iconName: "HeartPulse",
    emojiIcon: "🩺",
    description: "Track blood pressure, heart rate, blood sugar & pulse vitals",
    tabTarget: "care",
    subTabTarget: "vitals",
    defaultActive: true,
    quickActions: [
      { id: "log_vitals", label: "Log Vitals", actionType: "log_vitals" }
    ]
  },
  medicine: {
    id: "medicine",
    label: "Medicine & Prescriptions",
    category: "personal",
    iconName: "Pill",
    emojiIcon: "💊",
    description: "Medication adherence alerts, refill warnings & dose history",
    tabTarget: "care",
    subTabTarget: "medicine",
    defaultActive: true,
    quickActions: [
      { id: "take_medicine", label: "Log Dose Taken", actionType: "take_medicine" },
      { id: "add_medicine", label: "Add Medicine", actionType: "add_medicine" }
    ]
  },
  water: {
    id: "water",
    label: "Hydration & Water",
    category: "personal",
    iconName: "Droplets",
    emojiIcon: "💧",
    description: "Daily water intake tracker with hourly hydration alerts",
    tabTarget: "care",
    subTabTarget: "water",
    defaultActive: true,
    quickActions: [
      { id: "add_250ml", label: "+250 ml Water", actionType: "add_water_250" },
      { id: "add_500ml", label: "+500 ml Water", actionType: "add_water_500" }
    ]
  },
  steps_exercise: {
    id: "steps_exercise",
    label: "Steps & Exercise",
    category: "personal",
    iconName: "Dumbbell",
    emojiIcon: "🏃",
    description: "Daily step counting, calorie burner & fitness activity log",
    tabTarget: "care",
    subTabTarget: "steps",
    defaultActive: true,
    quickActions: [
      { id: "log_workout", label: "Log Workout", actionType: "log_workout" }
    ]
  },
  yoga_meditation: {
    id: "yoga_meditation",
    label: "Yoga & Mindfulness",
    category: "personal",
    iconName: "Sparkles",
    emojiIcon: "🧘",
    description: "Guided breathing, meditation timer & posture exercises",
    tabTarget: "care",
    subTabTarget: "yoga",
    defaultActive: false,
    quickActions: [
      { id: "start_breathing", label: "Start 5m Breathing", actionType: "start_breathing" }
    ]
  },
  mood_habits: {
    id: "mood_habits",
    label: "Mood & Habit Recovery",
    category: "personal",
    iconName: "Smile",
    emojiIcon: "😊",
    description: "Daily mood journal, habit streak counters & trigger logs",
    tabTarget: "care",
    subTabTarget: "mood",
    defaultActive: true,
    quickActions: [
      { id: "checkin_mood", label: "Log Mood", actionType: "checkin_mood" }
    ]
  },
  finance_budget: {
    id: "finance_budget",
    label: "Finance & Cash Flow",
    category: "business",
    iconName: "Wallet",
    emojiIcon: "💰",
    description: "Income/expense ledger, daily budget caps & money tracking",
    tabTarget: "more",
    subTabTarget: "finance",
    defaultActive: true,
    quickActions: [
      { id: "add_expense", label: "+ Add Expense", actionType: "add_expense" },
      { id: "add_income", label: "+ Add Income", actionType: "add_income" }
    ]
  },
  inventory: {
    id: "inventory",
    label: "Stock & Inventory",
    category: "business",
    iconName: "Package",
    emojiIcon: "📦",
    description: "Product inventory, stock count alerts & warranty manager",
    tabTarget: "more",
    subTabTarget: "inventory",
    defaultActive: false,
    quickActions: [
      { id: "add_item", label: "+ Add Stock Item", actionType: "add_stock" }
    ]
  },
  staff_payroll: {
    id: "staff_payroll",
    label: "Staff & Payroll HR",
    category: "business",
    iconName: "Users",
    emojiIcon: "💼",
    description: "Employee attendance, timesheets, salary payouts & proof of work",
    tabTarget: "more",
    subTabTarget: "staff_payroll",
    defaultActive: false,
    quickActions: [
      { id: "clock_in", label: "Clock In Staff", actionType: "clock_in_staff" }
    ]
  },
  elderly_care: {
    id: "elderly_care",
    label: "Elderly & Senior Care",
    category: "family",
    iconName: "User",
    emojiIcon: "👴",
    description: "Mobility logs, proxy caregiver notes & senior health records",
    tabTarget: "care",
    subTabTarget: "elderly",
    defaultActive: true,
    quickActions: [
      { id: "log_care_note", label: "Add Caregiver Note", actionType: "add_care_note" }
    ]
  },
  kids_care: {
    id: "kids_care",
    label: "Kids & Pediatric Care",
    category: "family",
    iconName: "Baby",
    emojiIcon: "👶",
    description: "Growth charts, vaccination schedules & school activity log",
    tabTarget: "more",
    subTabTarget: "kids",
    defaultActive: false,
    quickActions: [
      { id: "log_vaccine", label: "Log Growth / Vaccine", actionType: "log_growth" }
    ]
  },
  family_tree: {
    id: "family_tree",
    label: "Family Tree & Legacy",
    category: "family",
    iconName: "Network",
    emojiIcon: "🌳",
    description: "Multi-generation lineage, heritage stories & ancestor tree",
    tabTarget: "more",
    subTabTarget: "family_tree",
    defaultActive: false,
    quickActions: [
      { id: "add_member", label: "+ Add Family Member", actionType: "add_family_member" }
    ]
  },
  pets: {
    id: "pets",
    label: "Pet & Vet Records",
    category: "family",
    iconName: "Dog",
    emojiIcon: "🐾",
    description: "Vaccination dates, vet appointments & pet meal logs",
    tabTarget: "more",
    subTabTarget: "pets",
    defaultActive: false,
    quickActions: [
      { id: "log_pet_meal", label: "Log Pet Feed", actionType: "log_pet_feed" }
    ]
  },
  vehicles: {
    id: "vehicles",
    label: "Vehicle Care & Fuel",
    category: "assets",
    iconName: "Car",
    emojiIcon: "🚗",
    description: "Fuel mileage logs, PUC renewal alerts & service due countdowns",
    tabTarget: "more",
    subTabTarget: "vehicles",
    defaultActive: false,
    quickActions: [
      { id: "log_fuel", label: "Log Fuel Fillup", actionType: "log_fuel" }
    ]
  },
  property_farm: {
    id: "property_farm",
    label: "Property, Land & Farm",
    category: "assets",
    iconName: "Leaf",
    emojiIcon: "🏡",
    description: "Land plot deed logs, irrigation schedules & farm harvest records",
    tabTarget: "more",
    subTabTarget: "property",
    defaultActive: false,
    quickActions: [
      { id: "log_harvest", label: "Log Crop / Plot", actionType: "log_plot" }
    ]
  },
  contract_legal: {
    id: "contract_legal",
    label: "Contract & Legal Vault",
    category: "business",
    iconName: "FileCheck",
    emojiIcon: "📑",
    description: "Digital legal contracts, thumbprint capture & witness sign",
    tabTarget: "more",
    subTabTarget: "contracts",
    defaultActive: false,
    quickActions: [
      { id: "new_contract", label: "+ New Contract", actionType: "new_contract" }
    ]
  },
  passwords: {
    id: "passwords",
    label: "Password Manager",
    category: "personal",
    iconName: "Shield",
    emojiIcon: "🔑",
    description: "Zero-knowledge encrypted password vault & security audit",
    tabTarget: "more",
    subTabTarget: "passwords",
    defaultActive: false,
    quickActions: [
      { id: "add_password", label: "+ Save Password", actionType: "add_password" }
    ]
  },
  sleep: {
    id: "sleep",
    label: "Sleep Quality & Sound",
    category: "personal",
    iconName: "Moon",
    emojiIcon: "🌙",
    description: "Sleep duration, REM tracking & ambient relaxing soundscapes",
    tabTarget: "care",
    subTabTarget: "sleep",
    defaultActive: false,
    quickActions: [
      { id: "log_sleep", label: "Log Sleep Hours", actionType: "log_sleep" }
    ]
  },
  menstrual_cycle: {
    id: "menstrual_cycle",
    label: "Cycle & Fertility",
    category: "personal",
    iconName: "Heart",
    emojiIcon: "🌸",
    description: "Menstrual period tracker, fertility predictions & symptom log",
    tabTarget: "more",
    subTabTarget: "menstrual",
    defaultActive: false,
    quickActions: [
      { id: "log_period", label: "Log Period Start", actionType: "log_period" }
    ]
  },
  job_career: {
    id: "job_career",
    label: "Job & Career Builder",
    category: "personal",
    iconName: "Briefcase",
    emojiIcon: "💼",
    description: "Resume builder, job application status & career goal tracker",
    tabTarget: "more",
    subTabTarget: "career",
    defaultActive: false,
    quickActions: [
      { id: "add_job_app", label: "+ Add Application", actionType: "add_job_app" }
    ]
  },
  paperless_docs: {
    id: "paperless_docs",
    label: "Paperless Digital Vault",
    category: "personal",
    iconName: "FolderLock",
    emojiIcon: "📁",
    description: "Encrypted document scanner, categorizer & offline backup",
    tabTarget: "more",
    subTabTarget: "paperless",
    defaultActive: false,
    quickActions: [
      { id: "scan_doc", label: "Scan / Upload Doc", actionType: "scan_doc" }
    ]
  },
  ticket_queue: {
    id: "ticket_queue",
    label: "Ticket & Queue Counter",
    category: "business",
    iconName: "Ticket",
    emojiIcon: "🎟️",
    description: "Customer token counter, waiting list & digital ticket queue",
    tabTarget: "more",
    subTabTarget: "ticket_queue",
    defaultActive: false,
    quickActions: [
      { id: "issue_token", label: "Issue Token", actionType: "issue_token" }
    ]
  },
  life_dates: {
    id: "life_dates",
    label: "Life Dates & Anniversaries",
    category: "family",
    iconName: "Calendar",
    emojiIcon: "🗓️",
    description: "Important birthday countdowns, milestones & memory archives",
    tabTarget: "more",
    subTabTarget: "life_dates",
    defaultActive: false,
    quickActions: [
      { id: "add_life_date", label: "+ Add Important Date", actionType: "add_life_date" }
    ]
  },
  sos_emergency: {
    id: "sos_emergency",
    label: "Caregiver & SOS Emergency",
    category: "personal",
    iconName: "ShieldAlert",
    emojiIcon: "🚨",
    description: "1-tap emergency panic button, caregiver alerts & GPS broadcast",
    tabTarget: "care",
    subTabTarget: "sos",
    defaultActive: true,
    quickActions: [
      { id: "trigger_sos", label: "🚨 TRIGGER SOS", actionType: "trigger_sos" }
    ]
  }
};

export const DEFAULT_ACTIVE_MODULE_IDS = Object.values(ALL_SERVICE_MODULES)
  .filter((mod) => mod.defaultActive)
  .map((mod) => mod.id);
