import React, { useState, useEffect, useMemo } from "react";
import { Patient } from "../types";
import {
  Calendar as CalendarIcon,
  Heart,
  Droplet,
  Sun,
  Flame,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Bell,
  Settings as SettingsIcon,
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  LayoutGrid,
  Activity,
  Smile,
  Frown,
  Meh,
  Zap,
  Info,
  Shield,
  Clock,
  Download,
  Trash2,
  Check,
  X,
  Share2,
  BookOpen,
  ShoppingBag,
  Sliders,
  Filter,
  Thermometer,
  Scale
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export type MenstrualTab =
  | "dashboard"
  | "log"
  | "calendar"
  | "symptoms"
  | "flow"
  | "insights"
  | "analytics"
  | "fertility"
  | "reminders"
  | "products"
  | "settings"
  | "programs";

export interface MenstrualCycleProps {
  patient?: Patient;
}

export interface DayFlowLog {
  morning: "None" | "Light" | "Moderate" | "Heavy" | "Very Heavy";
  afternoon: "None" | "Light" | "Moderate" | "Heavy" | "Very Heavy";
  evening: "None" | "Light" | "Moderate" | "Heavy" | "Very Heavy";
  night: "None" | "Light" | "Moderate" | "Heavy" | "Very Heavy";
  notes?: string;
}

export interface MenstrualCycleRecord {
  id: string;
  startDate: string;
  endDate: string;
  cycleLength: number;
  periodLength: number;
  flowIntensity: "Light" | "Moderate" | "Heavy" | "Very Heavy";
  painLevel: number;
  symptoms: string[];
  moods: string[];
  basalTemp?: number;
  weight?: number;
  notes?: string;
}

export interface MenstrualProduct {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  description: string;
  benefits: string[];
  usageTip: string;
}

export interface MenstrualProgram {
  id: string;
  title: string;
  subtitle: string;
  totalDays: number;
  completedDays: number;
  category: string;
  icon: string;
  description: string;
  tips: string[];
}

export const MenstrualCycleTracker: React.FC<MenstrualCycleProps> = ({ patient }) => {
  const userName = patient ? patient.name.split(" ")[0] : "Roshan";

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<MenstrualTab>("dashboard");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Cycle Configuration Settings
  const [cycleLength, setCycleLength] = useState<number>(() => {
    const saved = localStorage.getItem("care2care_menstrual_cycle_len");
    return saved ? parseInt(saved, 10) : 28;
  });
  const [periodLength, setPeriodLength] = useState<number>(() => {
    const saved = localStorage.getItem("care2care_menstrual_period_len");
    return saved ? parseInt(saved, 10) : 5;
  });
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(() => {
    const saved = localStorage.getItem("care2care_menstrual_last_start");
    if (saved) return saved;
    const d = new Date();
    d.setDate(d.getDate() - 7); // Default 8th day of cycle
    return d.toISOString().split("T")[0];
  });

  // Cycle History Records
  const [cycleRecords, setCycleRecords] = useState<MenstrualCycleRecord[]>(() => {
    const saved = localStorage.getItem("care2care_menstrual_records");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "cyc_1",
        startDate: "2026-04-10",
        endDate: "2026-04-15",
        cycleLength: 28,
        periodLength: 5,
        flowIntensity: "Moderate",
        painLevel: 3,
        symptoms: ["Cramps", "Bloating", "Fatigue"],
        moods: ["Calm", "Mood Swings"],
        notes: "Mild cramping on day 1."
      },
      {
        id: "cyc_2",
        startDate: "2026-03-13",
        endDate: "2026-03-18",
        cycleLength: 28,
        periodLength: 5,
        flowIntensity: "Heavy",
        painLevel: 6,
        symptoms: ["Cramps", "Headache", "Back Pain"],
        moods: ["Irritability", "Sad"],
        notes: "Heavy flow on day 2."
      },
      {
        id: "cyc_3",
        startDate: "2026-02-14",
        endDate: "2026-02-19",
        cycleLength: 27,
        periodLength: 5,
        flowIntensity: "Moderate",
        painLevel: 4,
        symptoms: ["Fatigue", "Breast Tenderness"],
        moods: ["Happy", "Calm"],
        notes: "Smooth cycle."
      },
      {
        id: "cyc_4",
        startDate: "2026-01-18",
        endDate: "2026-01-22",
        cycleLength: 29,
        periodLength: 4,
        flowIntensity: "Moderate",
        painLevel: 3,
        symptoms: ["Bloating", "Acne"],
        moods: ["Anxiety", "Mood Swings"],
        notes: "Took warm herbal tea."
      },
      {
        id: "cyc_5",
        startDate: "2025-12-21",
        endDate: "2025-12-26",
        cycleLength: 28,
        periodLength: 5,
        flowIntensity: "Moderate",
        painLevel: 4,
        symptoms: ["Cramps", "Fatigue"],
        moods: ["Calm"],
        notes: "Normal flow."
      },
      {
        id: "cyc_6",
        startDate: "2025-11-23",
        endDate: "2025-11-28",
        cycleLength: 27,
        periodLength: 5,
        flowIntensity: "Light",
        painLevel: 2,
        symptoms: ["Breast Tenderness"],
        moods: ["Happy", "Calm"],
        notes: "Light and easy cycle."
      }
    ];
  });

  // Calculate current cycle day & phase
  const cycleDayNumber = useMemo(() => {
    const start = new Date(lastPeriodStart);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return ((diffDays - 1) % cycleLength) + 1;
  }, [lastPeriodStart, cycleLength]);

  const currentPhaseInfo = useMemo(() => {
    if (cycleDayNumber <= periodLength) {
      return {
        name: "Menstrual Phase",
        description: "Your period is active. Focus on rest, hydration, and gentle care.",
        color: "text-[#FF5A36] bg-rose-50 border-rose-200",
        badge: "🔴 Period Active",
        daysToNextPeriod: cycleLength - cycleDayNumber,
        icon: "🩸"
      };
    } else if (cycleDayNumber <= 13) {
      return {
        name: "Follicular Phase",
        description: "Estrogen is rising. Energy and creativity are naturally peaking.",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        badge: "🌱 Follicular Phase",
        daysToNextPeriod: cycleLength - cycleDayNumber,
        icon: "🌸"
      };
    } else if (cycleDayNumber <= 16) {
      return {
        name: "Ovulation Phase",
        description: "Peak fertility window. High chances of conception.",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        badge: "☀️ Ovulation Window",
        daysToNextPeriod: cycleLength - cycleDayNumber,
        icon: "✨"
      };
    } else {
      return {
        name: "Luteal Phase",
        description: "Progesterone rises. Prioritize magnesium-rich nutrition and stress relief.",
        color: "text-purple-700 bg-purple-50 border-purple-200",
        badge: "🌙 Luteal Phase",
        daysToNextPeriod: cycleLength - cycleDayNumber,
        icon: "🕯️"
      };
    }
  }, [cycleDayNumber, periodLength, cycleLength]);

  // Next Period & Fertile Window Dates
  const nextPeriodDateStr = useMemo(() => {
    const start = new Date(lastPeriodStart);
    start.setDate(start.getDate() + cycleLength);
    return start.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }, [lastPeriodStart, cycleLength]);

  const fertileWindowStr = useMemo(() => {
    const start = new Date(lastPeriodStart);
    const fertStart = new Date(start);
    fertStart.setDate(start.getDate() + 9);
    const fertEnd = new Date(start);
    fertEnd.setDate(start.getDate() + 15);
    return `${fertStart.toLocaleDateString("en-US", { day: "numeric" })} - ${fertEnd.toLocaleDateString("en-US", { day: "numeric", month: "short" })}`;
  }, [lastPeriodStart]);

  // -----------------------------------------------------------------
  // 📝 LOG PERIOD STATE
  // -----------------------------------------------------------------
  const [isOnPeriod, setIsOnPeriod] = useState<boolean>(cycleDayNumber <= periodLength);
  const [logFlowIntensity, setLogFlowIntensity] = useState<"Light" | "Moderate" | "Heavy" | "Very Heavy">("Moderate");
  const [logPeriodDay, setLogPeriodDay] = useState<number>(cycleDayNumber <= periodLength ? cycleDayNumber : 1);
  const [logNotes, setLogNotes] = useState<string>("");

  const handleSavePeriodLog = () => {
    if (isOnPeriod) {
      showToast(`🩸 Period Day ${logPeriodDay} (${logFlowIntensity} flow) logged successfully!`);
    } else {
      showToast("✅ Period log updated: Not currently bleeding.");
    }
  };

  // -----------------------------------------------------------------
  // 🤒 SYMPTOMS & MOODS LOGGING STATE
  // -----------------------------------------------------------------
  const [selectedPhysicalSymptoms, setSelectedPhysicalSymptoms] = useState<string[]>(["Cramps", "Fatigue"]);
  const [selectedEmotionalSymptoms, setSelectedEmotionalSymptoms] = useState<string[]>(["Calm"]);
  const [symptomIntensity, setSymptomIntensity] = useState<number>(7);

  const PHYSICAL_SYMPTOMS_LIST = [
    { id: "cramps", label: "Cramps", icon: "🩸" },
    { id: "headache", label: "Headache", icon: "🤕" },
    { id: "bloating", label: "Bloating", icon: "🎈" },
    { id: "fatigue", label: "Fatigue", icon: "💤" },
    { id: "back_pain", label: "Back Pain", icon: "🔙" },
    { id: "breast_tender", label: "Breast Tenderness", icon: "🍈" },
    { id: "acne", label: "Acne", icon: "🧖‍♀️" },
    { id: "nausea", label: "Nausea", icon: "🤢" },
    { id: "dizziness", label: "Dizziness", icon: "💫" },
    { id: "cravings", label: "Cravings", icon: "🍫" }
  ];

  const EMOTIONAL_SYMPTOMS_LIST = [
    { id: "mood_swings", label: "Mood Swings", icon: "🎭" },
    { id: "anxiety", label: "Anxiety", icon: "😟" },
    { id: "irritability", label: "Irritability", icon: "⚡" },
    { id: "sad", label: "Sad", icon: "😢" },
    { id: "happy", label: "Happy", icon: "😊" },
    { id: "calm", label: "Calm", icon: "🧘" }
  ];

  const togglePhysicalSymptom = (label: string) => {
    setSelectedPhysicalSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const toggleEmotionalSymptom = (label: string) => {
    setSelectedEmotionalSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSaveSymptoms = () => {
    showToast(`✨ Saved ${selectedPhysicalSymptoms.length} physical & ${selectedEmotionalSymptoms.length} emotional symptoms (Intensity: ${symptomIntensity}/10)!`);
  };

  // -----------------------------------------------------------------
  // 💧 FLOW TRACKING STATE (THROUGHOUT THE DAY)
  // -----------------------------------------------------------------
  const [dayFlow, setDayFlow] = useState<DayFlowLog>({
    morning: "Light",
    afternoon: "Moderate",
    evening: "Moderate",
    night: "Light",
    notes: ""
  });

  const getDropletCount = (intensity: DayFlowLog["morning"]) => {
    switch (intensity) {
      case "Light":
        return 1;
      case "Moderate":
        return 2;
      case "Heavy":
        return 3;
      case "Very Heavy":
        return 4;
      default:
        return 0;
    }
  };

  const setFlowForTime = (time: keyof Omit<DayFlowLog, "notes">, val: DayFlowLog["morning"]) => {
    setDayFlow((prev) => ({ ...prev, [time]: val }));
  };

  // -----------------------------------------------------------------
  // 📅 CYCLE CALENDAR PERPETUAL GENERATOR
  // -----------------------------------------------------------------
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);
  const currentCalendarDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + calendarMonthOffset);
    return d;
  }, [calendarMonthOffset]);

  const [selectedCalendarDayStr, setSelectedCalendarDayStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjusted for Mon-Sun (0 is Monday, 6 is Sunday)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      status: "period" | "fertile" | "ovulation" | "predicted" | "normal";
      dateStr: string;
    }> = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthDays - i,
        isCurrentMonth: false,
        status: "normal",
        dateStr: ""
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      let status: "period" | "fertile" | "ovulation" | "predicted" | "normal" = "normal";

      // Period days (e.g. 1st - 5th)
      if (day >= 1 && day <= 5) {
        status = "period";
      } else if (day >= 8 && day <= 13) {
        status = "fertile";
      } else if (day === 14) {
        status = "ovulation";
      } else if (day >= 28 && day <= 30) {
        status = "predicted";
      }

      days.push({
        dayNumber: day,
        isCurrentMonth: true,
        status,
        dateStr
      });
    }

    return days;
  }, [currentCalendarDate]);

  // -----------------------------------------------------------------
  // 🔔 REMINDERS CONFIGURATION
  // -----------------------------------------------------------------
  const [masterRemindersEnabled, setMasterRemindersEnabled] = useState<boolean>(true);
  const [reminderList, setReminderList] = useState([
    { id: "rem_1", title: "Period Start Reminder", frequency: "1 day before", enabled: true, icon: "🩸" },
    { id: "rem_2", title: "Painkiller Reminder", frequency: "Every 6 hours during period", enabled: true, icon: "💊" },
    { id: "rem_3", title: "Mood Check-in", frequency: "Daily", enabled: true, icon: "😊" },
    { id: "rem_4", title: "Hydration Reminder", frequency: "Every 2 hours", enabled: true, icon: "💧" },
    { id: "rem_5", title: "Fertile Window Alert", frequency: "On fertile window days", enabled: true, icon: "🌸" }
  ]);

  const toggleReminder = (id: string) => {
    setReminderList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // -----------------------------------------------------------------
  // 🛍️ PRODUCTS & CARE ITEMS
  // -----------------------------------------------------------------
  const [selectedProductModal, setSelectedProductModal] = useState<MenstrualProduct | null>(null);

  const PRODUCTS_DATA: MenstrualProduct[] = [
    {
      id: "prod_pads",
      title: "Sanitary Pads",
      subtitle: "Soft & Comfortable Organic Cotton",
      category: "Sanitary Protection",
      icon: "🩸",
      description: "100% GOTS certified organic cotton top-sheet with breathable plant-based core. Free of chlorine, fragrances, and toxic dyes.",
      benefits: ["Gentle on sensitive skin", "Leak-proof side barriers", "Ultra-absorbent natural fibers"],
      usageTip: "Change every 4 to 6 hours to maintain freshness and prevent bacterial growth."
    },
    {
      id: "prod_cup",
      title: "Menstrual Cup",
      subtitle: "Eco-Friendly & 12hr Protection",
      category: "Sustainable Care",
      icon: "🌙",
      description: "Medical-grade platinum silicone cup providing up to 12 hours of zero-leak protection. Reusable for up to 5-10 years.",
      benefits: ["Zero waste footprint", "Maintains natural vaginal pH", "Ideal for swimming, sports, and sleep"],
      usageTip: "Sterilize in boiling water for 3-5 minutes before each cycle."
    },
    {
      id: "prod_tea",
      title: "Period Pain Relief Tea",
      subtitle: "Natural & Safe Herbal Formula",
      category: "Cramp Relief",
      icon: "🌿",
      description: "Carefully formulated blend of Chamomile, Ginger root, Raspberry leaf, and Peppermint to soothe uterine smooth muscle contractions.",
      benefits: ["Relieves menstrual cramps naturally", "Reduces gastrointestinal bloating", "Promotes calm relaxation"],
      usageTip: "Drink 1-2 warm cups daily starting 2 days before your expected period."
    },
    {
      id: "prod_heating",
      title: "Heating Pad",
      subtitle: "Soothes Cramps & Lower Back Pain",
      category: "Thermotherapy",
      icon: "🔥",
      description: "Cordless ergonomic heating belt with 3 rapid thermal levels (45°C, 55°C, 65°C) and gentle pulsating acupressure vibrations.",
      benefits: ["Increases pelvic micro-circulation", "Fast cramp relaxation in 5 seconds", "Soft velvet skin-friendly lining"],
      usageTip: "Use 20-30 minutes on abdomen or lower lumbar area for instant soothing."
    },
    {
      id: "prod_wash",
      title: "Intimate Wash",
      subtitle: "pH Balanced & Prebiotic Care",
      category: "Intimate Hygiene",
      icon: "🧴",
      description: "Gynaecologist-tested gentle cleanser calibrated to optimal feminine pH 3.8. Infused with lactic acid, tea tree, and aloe vera.",
      benefits: ["Supports protective lactobacilli flora", "Prevents odor and irritation", "100% soap-free formula"],
      usageTip: "Use externally during daily shower, especially during menstruation."
    }
  ];

  // -----------------------------------------------------------------
  // 📚 GUIDED CARE PROGRAMS
  // -----------------------------------------------------------------
  const [selectedProgramModal, setSelectedProgramModal] = useState<MenstrualProgram | null>(null);

  const PROGRAMS_DATA: MenstrualProgram[] = [
    {
      id: "prog_pain",
      title: "Period Pain Relief",
      subtitle: "7 Days Holistic Cramp Ease",
      totalDays: 7,
      completedDays: 4,
      category: "Pain Management",
      icon: "🌸",
      description: "A gentle 7-day routine combining pelvic restorative yoga, magnesium nutrition, and acupressure points to diminish menstrual spasms.",
      tips: [
        "Day 4: Perform 10 min Cat-Cow & Child's Pose in the evening.",
        "Drink warm ginger-cinnamon infusion.",
        "Apply heat to lower abdomen for 15 minutes."
      ]
    },
    {
      id: "prog_hormone",
      title: "Hormonal Balance",
      subtitle: "14 Days Cycle Synchronization",
      totalDays: 14,
      completedDays: 7,
      category: "Endocrine Health",
      icon: "⚖️",
      description: "Align your diet, sleep, and workouts with the 4 distinct hormonal phases of your menstrual rhythm for stable mood and stamina.",
      tips: [
        "Day 7: Follicular focus on sprouted seeds and leafy greens.",
        "Engage in strength-building resistance exercises.",
        "Prioritize 8 hours of uninterrupted sleep."
      ]
    },
    {
      id: "prog_mood",
      title: "Mood & Energy Boost",
      subtitle: "10 Days Premenstrual Vitality",
      totalDays: 10,
      completedDays: 3,
      category: "Mental Wellness",
      icon: "⚡",
      description: "Overcome PMS lethargy and emotional swings through targeted breathwork, sunlight exposure, and B-complex superfoods.",
      tips: [
        "Day 3: 15 minutes of morning sunlight walk.",
        "Practice 4-7-8 parasympathetic breathwork.",
        "Snack on dark chocolate (85%) and pumpkin seeds."
      ]
    },
    {
      id: "prog_pcos",
      title: "PCOS Support",
      subtitle: "21 Days Insulin & Ovarian Health",
      totalDays: 21,
      completedDays: 10,
      category: "Specialized Care",
      icon: "🩺",
      description: "Evidence-backed protocol targeting insulin sensitivity, stress hormone reduction, and regular ovarian ovulation support.",
      tips: [
        "Day 10: Low glycemic index balanced lunch with high fiber.",
        "Daily inositol and vitamin D supplementation.",
        "20 minutes steady-state low-impact cardio."
      ]
    },
    {
      id: "prog_healthy",
      title: "Healthy Cycle",
      subtitle: "30 Days Complete Lifestyle Flow",
      totalDays: 30,
      completedDays: 12,
      category: "Comprehensive Care",
      icon: "🌿",
      description: "The ultimate 360-degree menstrual wellness journey covering hydration, stress optimization, sleep architecture, and symptom tracking.",
      tips: [
        "Day 12: Maintain daily 2.5L structured water intake.",
        "Log cervical fluid texture and energy rating.",
        "Evening digital detox 1 hour before bedtime."
      ]
    }
  ];

  // -----------------------------------------------------------------
  // 📊 ANALYTICS DATA (LAST 6 CYCLES)
  // -----------------------------------------------------------------
  const [analyticsSubTab, setAnalyticsSubTab] = useState<"Overview" | "Symptoms" | "Flow" | "Moods">("Overview");

  const cycleLengthChartData = [
    { month: "Dec", days: 27 },
    { month: "Jan", days: 28 },
    { month: "Feb", days: 28 },
    { month: "Mar", days: 29 },
    { month: "Apr", days: 27 },
    { month: "May", days: 28 }
  ];

  const periodLengthChartData = [
    { month: "Dec", days: 5 },
    { month: "Jan", days: 5 },
    { month: "Feb", days: 4 },
    { month: "Mar", days: 5 },
    { month: "Apr", days: 4 },
    { month: "May", days: 5 }
  ];

  // Horizontal Scrolling Navigation Menu List
  const navMenuItems: Array<{ id: MenstrualTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "log", label: "Log Period", icon: Droplet },
    { id: "calendar", label: "Cycle Calendar", icon: CalendarIcon },
    { id: "symptoms", label: "Symptoms", icon: Activity },
    { id: "flow", label: "Flow Tracking", icon: Flame },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "fertility", label: "Fertility Tracker", icon: Sparkles },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "products", label: "Products & Care", icon: ShoppingBag },
    { id: "programs", label: "Programs", icon: Award },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FF5A36] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300 border border-orange-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 TOP HEADER (CARE2CARE CORAL / PEACH BRANDING) */}
      {/* ============================================================ */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs text-xl">
            🩸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Menstruation Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Menstrual & Cycle Tracker
            </h1>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("log")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Droplet className="w-3.5 h-3.5 fill-white" />
          <span>+ Log Period</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 🧭 HORIZONTAL SCROLLING MENU (AS PER WATER & YOGA PATTERN) */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-xs font-black scale-[1.02]"
                  : "bg-white text-slate-600 hover:bg-orange-50 hover:text-[#FF5A36] border border-slate-200/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. SCREEN: DASHBOARD */}
      {/* ============================================================ */}
      {activeTab === "dashboard" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Greeting Banner */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                Good Morning, {userName} 🌸
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Let's understand your cycle better.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5A36] flex items-center justify-center font-bold text-lg">
              ✨
            </div>
          </div>

          {/* Today's Phase Card */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="space-y-3 max-w-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36] bg-white px-2.5 py-1 rounded-full border border-orange-200">
                Today's Phase
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{currentPhaseInfo.name}</h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">
                  Day {cycleDayNumber} of {cycleLength}
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPhaseInfo.description}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {/* Circular Day Ring */}
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FF5A36] flex flex-col items-center justify-center shadow-md">
                <span className="text-2xl font-black text-slate-900">{cycleDayNumber}</span>
                <span className="text-[10px] font-bold text-slate-500">Days</span>
              </div>
              {/* Female Illustration Graphic */}
              <div className="w-24 h-24 bg-white/80 rounded-2xl border border-orange-200/60 flex items-center justify-center text-4xl shadow-inner">
                🧘‍♀️
              </div>
            </div>
          </div>

          {/* Next Period & Next Fertile Window Prediction Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl shrink-0">
                🩸
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">Next Period</p>
                <p className="text-xs text-slate-500 font-medium">
                  Expected in <span className="font-black text-slate-900">{currentPhaseInfo.daysToNextPeriod} Days</span>
                </p>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">{nextPeriodDateStr}</h4>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl shrink-0">
                🌱
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">Next Fertile Window</p>
                <h4 className="text-sm font-black text-slate-900">{fertileWindowStr}</h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                  High chance
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics (3 Columns: Cycle Length, Period Length, Avg Flow) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs text-center">
              <p className="text-[10px] font-bold text-slate-500">Cycle Length</p>
              <h4 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{cycleLength} Days</h4>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs text-center">
              <p className="text-[10px] font-bold text-slate-500">Period Length</p>
              <h4 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{periodLength} Days</h4>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs text-center">
              <p className="text-[10px] font-bold text-slate-500">Avg. Flow</p>
              <h4 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">Moderate</h4>
            </div>
          </div>

          {/* Today's Log Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Today's Log</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {selectedPhysicalSymptoms.length > 0
                  ? `${selectedPhysicalSymptoms.join(", ")} • ${dayFlow.morning} flow`
                  : "No data logged yet"}
              </p>
            </div>
            <button
              onClick={() => setActiveTab("log")}
              className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white border border-orange-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. SCREEN: LOG PERIOD */}
      {/* ============================================================ */}
      {activeTab === "log" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-slate-900">Are you on your period?</h2>
            <p className="text-xs text-slate-500 font-bold">
              Today, {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Yes / No Toggle Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => setIsOnPeriod(true)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                isOnPeriod
                  ? "bg-rose-50 border-[#FF5A36] text-[#FF5A36] shadow-sm font-black"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
              }`}
            >
              <Droplet className={`w-6 h-6 ${isOnPeriod ? "fill-[#FF5A36] text-[#FF5A36]" : "text-slate-400"}`} />
              <span className="text-sm">Yes</span>
            </button>

            <button
              onClick={() => setIsOnPeriod(false)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                !isOnPeriod
                  ? "bg-slate-100 border-slate-400 text-slate-900 shadow-sm font-black"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
              }`}
            >
              <Moon className={`w-6 h-6 ${!isOnPeriod ? "text-slate-800" : "text-slate-400"}`} />
              <span className="text-sm">No</span>
            </button>
          </div>

          {isOnPeriod && (
            <div className="space-y-5 pt-2 border-t border-slate-100">
              {/* Flow Intensity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Flow Intensity
                </label>
                <p className="text-[11px] text-slate-500">How is your flow today?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "Light", count: 1 },
                    { label: "Moderate", count: 2 },
                    { label: "Heavy", count: 3 },
                    { label: "Very Heavy", count: 4 }
                  ].map((f) => (
                    <button
                      key={f.label}
                      onClick={() => setLogFlowIntensity(f.label as any)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        logFlowIntensity === f.label
                          ? "bg-rose-50 border-[#FF5A36] text-[#FF5A36] font-black shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: f.count }).map((_, i) => (
                          <Droplet key={i} className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" />
                        ))}
                      </div>
                      <span className="text-xs">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Period Day Stepper */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Period Day</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLogPeriodDay((d) => Math.max(1, d - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-black flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-base font-black text-slate-900 w-6 text-center">{logPeriodDay}</span>
                  <button
                    onClick={() => setLogPeriodDay((d) => Math.min(10, d + 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-black flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Add any notes, cramps level, or medication..."
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={handleSavePeriodLog}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            Save Period Log
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SCREEN: CYCLE CALENDAR */}
      {/* ============================================================ */}
      {activeTab === "calendar" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button
              onClick={() => setCalendarMonthOffset((m) => m - 1)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-[#FF5A36] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-slate-900">
              {currentCalendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button
              onClick={() => setCalendarMonthOffset((m) => m + 1)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-[#FF5A36] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="text-[11px] font-black text-slate-400 uppercase">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div key={idx} className="h-10 sm:h-12 rounded-xl flex items-center justify-center text-slate-300 text-xs font-bold">
                    {item.dayNumber}
                  </div>
                );
              }

              let bgClass = "bg-slate-50 text-slate-700 hover:bg-slate-100";
              let badgeDot = null;

              if (item.status === "period") {
                bgClass = "bg-rose-100 text-rose-700 font-black border border-rose-300";
                badgeDot = <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-0.5" />;
              } else if (item.status === "fertile") {
                bgClass = "bg-emerald-100 text-emerald-800 font-black border border-emerald-300";
                badgeDot = <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />;
              } else if (item.status === "ovulation") {
                bgClass = "bg-amber-100 text-amber-800 font-black border border-amber-300";
                badgeDot = <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-0.5" />;
              } else if (item.status === "predicted") {
                bgClass = "bg-orange-50 text-orange-700 font-bold border border-dashed border-orange-300";
                badgeDot = <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-0.5" />;
              }

              const isSelected = selectedCalendarDayStr === item.dateStr;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCalendarDayStr(item.dateStr)}
                  className={`h-10 sm:h-12 rounded-2xl flex flex-col items-center justify-center text-xs transition-all cursor-pointer ${bgClass} ${
                    isSelected ? "ring-2 ring-[#FF5A36] shadow-sm scale-105" : ""
                  }`}
                >
                  <span>{item.dayNumber}</span>
                  {badgeDot}
                </button>
              );
            })}
          </div>

          {/* Calendar Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Period
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Fertile Window
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Ovulation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-300" /> Predicted
            </span>
          </div>

          {/* Selected Date Details Box */}
          <div className="bg-[#FFF9F5] border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center text-lg font-bold">
                🩸
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">
                  {new Date(selectedCalendarDayStr).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="text-[11px] text-slate-600 font-bold">
                  {currentPhaseInfo.name} • Day {cycleDayNumber} of {cycleLength}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SCREEN: SYMPTOMS */}
      {/* ============================================================ */}
      {activeTab === "symptoms" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-0.5">
            <h2 className="text-lg font-black text-slate-900">How are you feeling today?</h2>
            <p className="text-xs text-slate-500 font-bold">Select all that apply</p>
          </div>

          {/* Physical Symptoms Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Physical Symptoms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PHYSICAL_SYMPTOMS_LIST.map((sym) => {
                const isSelected = selectedPhysicalSymptoms.includes(sym.label);
                return (
                  <button
                    key={sym.id}
                    onClick={() => togglePhysicalSymptom(sym.label)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-50 border-[#FF5A36] text-[#FF5A36] font-black shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">{sym.icon}</span>
                    <span>{sym.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotional Symptoms Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Emotional Symptoms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EMOTIONAL_SYMPTOMS_LIST.map((emo) => {
                const isSelected = selectedEmotionalSymptoms.includes(emo.label);
                return (
                  <button
                    key={emo.id}
                    onClick={() => toggleEmotionalSymptom(emo.label)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-orange-50 border-[#FF5A36] text-[#FF5A36] font-black shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">{emo.icon}</span>
                    <span>{emo.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symptom Intensity Slider (1 Mild -> 10 Severe) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Symptom Intensity</h3>
              <span className="text-xs font-black text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                {symptomIntensity} / 10
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Overall, how intense are your symptoms today?</p>
            <div className="space-y-1">
              <input
                type="range"
                min="1"
                max="10"
                value={symptomIntensity}
                onChange={(e) => setSymptomIntensity(parseInt(e.target.value, 10))}
                className="w-full accent-[#FF5A36] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>1 Mild</span>
                <span>5 Moderate</span>
                <span>10 Severe</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSymptoms}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            Save Symptoms
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SCREEN: FLOW TRACKING */}
      {/* ============================================================ */}
      {activeTab === "flow" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-0.5">
            <h2 className="text-lg font-black text-slate-900">Track your flow throughout the day</h2>
            <p className="text-xs text-slate-500 font-bold">
              {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Time of Day Rows */}
          <div className="space-y-3">
            {[
              { key: "morning", label: "Morning", timeDesc: "06:00 AM - 12:00 PM" },
              { key: "afternoon", label: "Afternoon", timeDesc: "12:00 PM - 05:00 PM" },
              { key: "evening", label: "Evening", timeDesc: "05:00 PM - 09:00 PM" },
              { key: "night", label: "Night", timeDesc: "09:00 PM - 06:00 AM" }
            ].map((slot) => {
              const currentVal = dayFlow[slot.key as keyof Omit<DayFlowLog, "notes">];
              const filledCount = getDropletCount(currentVal);

              return (
                <div key={slot.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{slot.label}</h3>
                    <p className="text-[10px] text-slate-500 font-bold">{currentVal}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((dropIdx) => {
                      const isFilled = dropIdx <= filledCount;
                      const intensityLabels: DayFlowLog["morning"][] = ["Light", "Moderate", "Heavy", "Very Heavy"];
                      return (
                        <button
                          key={dropIdx}
                          onClick={() => setFlowForTime(slot.key as any, intensityLabels[dropIdx - 1])}
                          className="p-1.5 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Droplet
                            className={`w-5 h-5 ${
                              isFilled ? "fill-[#FF5A36] text-[#FF5A36]" : "fill-slate-200 text-slate-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" /> Light
            </span>
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" />
              <Droplet className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" /> Moderate
            </span>
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" />
              <Droplet className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" />
              <Droplet className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" /> Heavy
            </span>
          </div>

          <button
            onClick={() => showToast("💧 Daily flow pattern saved successfully!")}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            Save Flow Tracking
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. SCREEN: INSIGHTS */}
      {/* ============================================================ */}
      {activeTab === "insights" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <h2 className="text-base font-black text-slate-900">Your Menstrual Insights</h2>
            <p className="text-xs text-slate-500 font-bold">Based on your historical logs</p>
          </div>

          {/* Cycle Overview (Last 6 Cycles) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg. Cycle Length</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">28</h3>
              <p className="text-[10px] text-slate-400 font-bold">Days</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg. Period Length</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">5</h3>
              <p className="text-[10px] text-slate-400 font-bold">Days</p>
            </div>
          </div>

          {/* Cycle Regularity Card with Ring */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Cycle Regularity
              </span>
              <h3 className="text-lg font-black text-slate-900">Very Regular</h3>
              <p className="text-xs text-slate-500 font-medium">Your cycles vary by less than 1.5 days on average.</p>
            </div>

            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center font-black text-emerald-700 shrink-0">
              <span className="text-base">92%</span>
            </div>
          </div>

          {/* Most Common Symptom Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl shrink-0">
              🩸
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400">Most Common Symptom</span>
              <h4 className="text-sm font-black text-slate-900">Cramps</h4>
              <p className="text-xs text-slate-500 font-medium">Logged in 65% of your recorded cycles.</p>
            </div>
          </div>

          {/* Best Time of the Month */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-2xl shrink-0">
              ☀️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400">Best Time of the Month</span>
              <h4 className="text-sm font-black text-slate-900">Follicular Phase (Days 6–13)</h4>
              <p className="text-xs text-slate-500 font-medium">You feel most energetic and creative during this phase.</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. SCREEN: ANALYTICS */}
      {/* ============================================================ */}
      {activeTab === "analytics" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Sub Tab Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {(["Overview", "Symptoms", "Flow", "Moods"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAnalyticsSubTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  analyticsSubTab === tab
                    ? "bg-[#FF5A36] text-white font-black shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cycle Length Histogram */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Cycle Length (Days)</h3>
              <span className="text-[11px] font-bold text-slate-500">Last 6 Cycles</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleLengthChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[20, 35]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                    formatter={(val: any) => [`${val} days`, "Cycle Length"]}
                  />
                  <Bar dataKey="days" fill="#FF5A36" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Period Length Line Graph */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Period Length (Days)</h3>
              <span className="text-[11px] font-bold text-slate-500">Last 6 Cycles</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={periodLengthChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 8]} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                    formatter={(val: any) => [`${val} days`, "Period Length"]}
                  />
                  <Line type="monotone" dataKey="days" stroke="#FF5A36" strokeWidth={3} dot={{ r: 4, fill: "#FF5A36" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. SCREEN: FERTILITY TRACKER */}
      {/* ============================================================ */}
      {activeTab === "fertility" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Fertile Window Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                🌸
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600">Fertile Window</span>
                <h3 className="text-base font-black text-slate-900">{fertileWindowStr}</h3>
                <p className="text-xs text-slate-500 font-bold">High chance of pregnancy</p>
              </div>
            </div>
          </div>

          {/* Ovulation Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-2xl shrink-0">
                ☀️
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600">Ovulation Date</span>
                <h3 className="text-base font-black text-slate-900">
                  {new Date(Date.now() + 6 * 86400000).toLocaleDateString("en-US", { day: "numeric", month: "short" })} (Predicted)
                </h3>
                <p className="text-xs text-slate-500 font-bold">Peak probability</p>
              </div>
            </div>
          </div>

          {/* Chance of Pregnancy Gauge */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Chance of Pregnancy</h4>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Today: <span className="text-emerald-600 font-black">Low</span></p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-700 text-sm shadow-xs">
              18%
            </div>
          </div>

          {/* Fertility Tips Card */}
          <div className="bg-gradient-to-r from-orange-50 to-[#FFF9F5] border border-orange-200 p-5 rounded-3xl space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              💡 Fertility & Ovulation Tips
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-[#FF5A36] font-bold">•</span>
                <span>You are in your follicular / fertile phase. Keep hydrated and maintain balanced nutrition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF5A36] font-bold">•</span>
                <span>Track basal body temperature (BBT) each morning before getting out of bed for ovulation verification.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. SCREEN: REMINDERS */}
      {/* ============================================================ */}
      {activeTab === "reminders" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Menstruation Reminders</h2>
              <p className="text-xs text-slate-500 font-bold">Personalized alerts for your cycle</p>
            </div>
            <button
              onClick={() => setMasterRemindersEnabled(!masterRemindersEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                masterRemindersEnabled ? "bg-[#FF5A36]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  masterRemindersEnabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="space-y-3">
            {reminderList.map((rem) => (
              <div key={rem.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{rem.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{rem.title}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{rem.frequency}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    rem.enabled && masterRemindersEnabled ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      rem.enabled && masterRemindersEnabled ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast("🔔 Reminder settings saved successfully!")}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            Save Reminder Settings
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. SCREEN: PRODUCTS & CARE */}
      {/* ============================================================ */}
      {activeTab === "products" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Recommended for You</h2>
            <span className="text-xs text-slate-500 font-bold">Curated Wellness Items</span>
          </div>

          <div className="space-y-3">
            {PRODUCTS_DATA.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProductModal(prod)}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl shrink-0">
                    {prod.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{prod.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{prod.subtitle}</p>
                    <span className="text-[10px] font-bold text-[#FF5A36] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 mt-1 inline-block">
                      {prod.category}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>

          {/* Product Detail Modal */}
          {selectedProductModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{selectedProductModal.icon}</span>
                    <h3 className="text-base font-black text-slate-900">{selectedProductModal.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProductModal(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedProductModal.description}</p>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Key Benefits</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {selectedProductModal.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl">
                  <p className="text-[11px] text-orange-800 font-medium">
                    <span className="font-black">Usage Tip:</span> {selectedProductModal.usageTip}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProductModal(null)}
                  className="w-full py-2.5 bg-[#FF5A36] text-white rounded-2xl text-xs font-black cursor-pointer hover:bg-[#E04826]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 11. SCREEN: PROGRAMS */}
      {/* ============================================================ */}
      {activeTab === "programs" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Programs for You</h2>
            <span className="text-xs text-slate-500 font-bold">Guided Cycles</span>
          </div>

          <div className="space-y-3">
            {PROGRAMS_DATA.map((prog) => (
              <div
                key={prog.id}
                onClick={() => setSelectedProgramModal(prog)}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl shrink-0">
                    {prog.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{prog.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{prog.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FF5A36] h-full rounded-full"
                          style={{ width: `${(prog.completedDays / prog.totalDays) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {prog.completedDays}/{prog.totalDays}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>

          {/* Program Detail Modal */}
          {selectedProgramModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{selectedProgramModal.icon}</span>
                    <h3 className="text-base font-black text-slate-900">{selectedProgramModal.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProgramModal(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedProgramModal.description}</p>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Today's Protocol</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {selectedProgramModal.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FF5A36] font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    showToast(`✨ Continued day in ${selectedProgramModal.title}!`);
                    setSelectedProgramModal(null);
                  }}
                  className="w-full py-2.5 bg-[#FF5A36] text-white rounded-2xl text-xs font-black cursor-pointer hover:bg-[#E04826]"
                >
                  Mark Today Completed
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 12. SCREEN: SETTINGS */}
      {/* ============================================================ */}
      {activeTab === "settings" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900">Cycle & Period Settings</h2>
            <p className="text-xs text-slate-500 font-bold">Customize your cycle calculations</p>
          </div>

          <div className="space-y-3">
            {/* Cycle Length Setting */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Cycle Length</span>
              <div className="flex items-center gap-2">
                <select
                  value={cycleLength}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setCycleLength(val);
                    localStorage.setItem("care2care_menstrual_cycle_len", val.toString());
                  }}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-black text-slate-800 focus:outline-none"
                >
                  {[21, 24, 26, 28, 30, 32, 35, 40].map((len) => (
                    <option key={len} value={len}>
                      {len} Days
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Period Length Setting */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Period Length</span>
              <div className="flex items-center gap-2">
                <select
                  value={periodLength}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setPeriodLength(val);
                    localStorage.setItem("care2care_menstrual_period_len", val.toString());
                  }}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-black text-slate-800 focus:outline-none"
                >
                  {[3, 4, 5, 6, 7, 8, 9].map((len) => (
                    <option key={len} value={len}>
                      {len} Days
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Flow Tracking Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Flow Tracking</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Enabled
              </span>
            </div>

            {/* Fertility Tracking Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Fertility Tracking</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Enabled
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Preferences</h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Theme Color</span>
              <span className="text-xs font-black text-[#FF5A36]">Coral / Peach</span>
            </div>

            <div
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cycleRecords, null, 2));
                const downloadAnchor = document.createElement("a");
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `care2care_menstrual_data_${new Date().toISOString().split("T")[0]}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast("📥 Exported menstrual records JSON!");
              }}
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-orange-50 rounded-2xl border border-slate-200 cursor-pointer transition-colors"
            >
              <span className="text-xs font-bold text-slate-700">Export Cycle Data (JSON / Doctor)</span>
              <Download className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset your logged menstrual data?")) {
                localStorage.removeItem("care2care_menstrual_records");
                showToast("🔄 Menstruation data reset to defaults.");
              }
            }}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Reset Menstruation Data
          </button>
        </div>
      )}
    </div>
  );
};
