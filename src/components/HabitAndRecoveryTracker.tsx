import React, { useState, useEffect, useMemo } from "react";
import { Patient } from "../types";
import {
  HABIT_PRESETS,
  CATEGORY_INFOS,
  TARGET_OPTIONS,
  MOTIVATIONAL_QUOTES,
  ALL_DAYS,
  HabitPreset
} from "../data/habitPresets";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import {
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Flame,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Settings,
  Bell,
  BarChart3,
  Check,
  RotateCcw,
  Download,
  Info,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Clock3,
  HeartHandshake,
  Heart,
  Smile,
  ThumbsUp,
  Award,
  Layers,
  Filter
} from "lucide-react";

// Safe string, number, and array helpers
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);
const safeArray = <T,>(val: any): T[] => (Array.isArray(val) ? val : []);

// Data Types as specified in the specifications
export interface Trigger {
  id: string;
  type: "person" | "place" | "thing" | "emotion" | "time" | "custom";
  name: string;
  description: string;
  intensity: number; // 1-10
  frequency: string;
  notes: string;
}

export interface SubstituteActivity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  effectiveness: number; // 1-10
  notes: string;
}

export interface Habit {
  id: string;
  userId?: string;
  name: string;
  type: "good" | "bad";
  category: string;
  subCategory?: string; // For bad habits: Smoking, Drinking, Screen Time, etc.
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Good Habit Specific Fields
  frequency?: "daily" | "weekly" | "custom";
  days?: string[]; // ['Mon', 'Tue', ...]
  timesPerDay?: number;
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  goal?: string;
  targetValue?: number;
  unit?: string;
  reminderTime?: string;
  reminderEnabled?: boolean;
  streak?: number;
  bestStreak?: number;
  totalCompletions?: number;
  completedToday?: boolean;

  // Bad Habit Specific Fields
  currentFrequency?: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  goalFrequency?: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  reductionStrategy?: "gradual" | "cold_turkey" | "replacement";
  targetDate?: string;
  triggers?: Trigger[];
  substituteActivities?: SubstituteActivity[];
  costPerUnit?: number;
  costUnit?: string; // packet, bottle, hour, purchase, session
  urgeDelayStrategy?: "delay" | "distract" | "substitute" | "support";
  delayTime?: number; // in minutes (e.g., 5, 10, 15)
  distractionActivity?: string;
  supportPerson?: string;
  supportPhone?: string;
  daysWithout?: number;
  bestDaysWithout?: number;
  totalRelapses?: number;
  avoidedToday?: boolean;
  relapsedToday?: boolean;

  notes?: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  isCompleted?: boolean;
  isAvoided?: boolean;
  isRelapsed?: boolean;
  amount?: number;
  cost?: number;
  notes?: string;
  createdAt: string;
}

export interface HabitGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0-100
  isAchieved: boolean;
  createdAt: string;
}

export interface HabitSettings {
  defaultReminderTime: string;
  defaultGoalUnit: string;
  dailyReminderEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  soundChoice: string;
}

interface HabitAndRecoveryTrackerProps {
  patient?: Patient;
}

// Cost calculation helper for Bad Habits
export const calculateAutoCosts = (
  costPerUnit: number = 0,
  perDayFrequency: number = 1,
  daysClean: number = 0
) => {
  const perDay = costPerUnit * perDayFrequency;
  const perHour = perDay / 24;
  const perWeek = perDay * 7;
  const perMonth = perDay * 30;
  const perYear = perDay * 365;
  const moneySaved = perDay * daysClean;

  return {
    perHour: Number(perHour.toFixed(2)),
    perDay: Number(perDay.toFixed(2)),
    perWeek: Number(perWeek.toFixed(2)),
    perMonth: Number(perMonth.toFixed(2)),
    perYear: Number(perYear.toFixed(2)),
    moneySaved: Number(moneySaved.toFixed(2))
  };
};

// AUTO-REMARKS & WISHES GENERATOR FUNCTION
export const generateAutoRemark = (habit: Habit) => {
  if (habit.type === "good") {
    const streak = safeNum(habit.streak, 0);
    const target = safeNum(habit.targetValue, 1);
    const unit = safeStr(habit.unit, "times");

    if (habit.completedToday) {
      if (streak >= 7) {
        return {
          title: "🎉 Unstoppable Momentum!",
          badge: "Streak Champion",
          badgeColor: "bg-emerald-500 text-white",
          message: `Outstanding work! You've maintained a ${streak}-day unbroken streak for "${habit.name}". May your energy and health continue to grow stronger every single day! 🌟`,
          wish: "Wishing you everlasting power to keep continuing this healthy routine!"
        };
      }
      return {
        title: "✨ Goal Completed Today!",
        badge: "Target Met",
        badgeColor: "bg-emerald-100 text-emerald-800",
        message: `Wonderful accomplishment! You completed today's target of ${target} ${unit} for "${habit.name}". Great job prioritizing your wellness!`,
        wish: "Wishing you a peaceful, energizing day ahead!"
      };
    } else {
      if (streak > 0) {
        return {
          title: "🔥 Keep Your Streak Alive!",
          badge: `${streak} Day Streak`,
          badgeColor: "bg-amber-100 text-amber-800",
          message: `You are on a ${streak}-day streak for "${habit.name}". Log your progress today to keep your winning routine unbroken!`,
          wish: "Wishing you focus and inspiration to finish today's goal!"
        };
      }
      return {
        title: "🌱 Fresh Opportunity Today!",
        badge: "Ready to Start",
        badgeColor: "bg-blue-100 text-blue-800",
        message: `Today is a clean canvas for "${habit.name}". Small steps today build life-changing results tomorrow!`,
        wish: "Wishing you a strong and rewarding start!"
      };
    }
  } else {
    // Bad Habit
    const daysClean = safeNum(habit.daysWithout, 0);
    const costPerUnit = safeNum(habit.costPerUnit, 0);
    const perDayFreq = safeNum(habit.currentFrequency?.perDay, 1);
    const autoCosts = calculateAutoCosts(costPerUnit, perDayFreq, daysClean);

    if (habit.avoidedToday) {
      if (daysClean >= 5) {
        return {
          title: "🏆 True Mastery & Freedom!",
          badge: `${daysClean} Days Clean`,
          badgeColor: "bg-[#2E7D32] text-white",
          message: `Inspiring resilience! You avoided "${habit.name}" today and have stayed clean for ${daysClean} days straight, saving an incredible $${autoCosts.moneySaved}! Remarkable willpower!`,
          wish: "Wishing you unwavering strength to conquer every upcoming urge!"
        };
      }
      return {
        title: "🛡️ Victorious Willpower Today!",
        badge: "Urge Conquered",
        badgeColor: "bg-emerald-100 text-emerald-800",
        message: `Outstanding job avoiding "${habit.name}" today! You managed to save $${autoCosts.perDay} today and protected your physical and mental harmony.`,
        wish: "Wishing you strength and serenity as you continue this freedom path!"
      };
    } else if (habit.relapsedToday) {
      return {
        title: "❤️ Courage to Reset & Rebuild",
        badge: "Restart Today",
        badgeColor: "bg-rose-100 text-rose-800",
        message: `Don't be discouraged! Recovery is a journey with twists. You managed to save $${autoCosts.moneySaved} in your previous run. Take a deep breath and restart clean today!`,
        wish: "Wishing you courage, self-compassion, and renewed determination!"
      };
    } else {
      return {
        title: "⏳ Stay Strong Against Urges",
        badge: "Clean Routine",
        badgeColor: "bg-purple-100 text-purple-800",
        message: `You've avoided "${habit.name}" for ${daysClean} days so far, saving $${autoCosts.moneySaved}. Remember your substitute activities when cravings strike!`,
        wish: "Wishing you peace and victory over every distraction today!"
      };
    }
  }
};

// Seed Defaults
const DEFAULT_HABITS_SEED: Habit[] = [
  {
    id: "habit-seed-1",
    name: "Drink 8 glasses of water (2L)",
    type: "good",
    category: "Health & Wellness",
    icon: "💧",
    color: "#2E7D32",
    description: "Hydrate regularly throughout the day for mental clarity and vitality",
    isActive: true,
    frequency: "daily",
    days: ALL_DAYS,
    timesPerDay: 8,
    timeOfDay: "anytime",
    goal: "Stay Hydrated",
    targetValue: 8,
    unit: "glasses",
    reminderTime: "08:00",
    reminderEnabled: true,
    streak: 7,
    bestStreak: 14,
    totalCompletions: 42,
    completedToday: true,
    notes: "Keeps energy levels high and digestion clean",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "habit-seed-2",
    name: "Morning Walk & Exercise",
    type: "good",
    category: "Health & Wellness",
    icon: "🏃",
    color: "#10b981",
    description: "30 minutes brisk walking or cardio in fresh morning air",
    isActive: true,
    frequency: "daily",
    days: ALL_DAYS,
    timesPerDay: 1,
    timeOfDay: "morning",
    goal: "Cardio Fitness",
    targetValue: 30,
    unit: "minutes",
    reminderTime: "07:00",
    reminderEnabled: true,
    streak: 5,
    bestStreak: 12,
    totalCompletions: 28,
    completedToday: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "habit-seed-3",
    name: "Quit Smoking",
    type: "bad",
    category: "Addiction",
    subCategory: "Smoking",
    icon: "🚬",
    color: "#D32F2F",
    description: "Break the nicotine habit and restore lung health",
    isActive: true,
    currentFrequency: { perDay: 1, perWeek: 7, perMonth: 30 }, // 1 pack per day
    goalFrequency: { perDay: 0, perWeek: 0, perMonth: 0 },
    reductionStrategy: "replacement",
    targetDate: "2026-12-31",
    costPerUnit: 10.0,
    costUnit: "pack",
    urgeDelayStrategy: "substitute",
    delayTime: 10,
    distractionActivity: "Drink cold water and do 10 deep breathings",
    supportPerson: "Family Member / Caregiver",
    supportPhone: "+1 (555) 019-2831",
    triggers: [
      { id: "tr-1", type: "emotion", name: "Work Stress", description: "Cravings spike after high pressure tasks", intensity: 8, frequency: "Always", notes: "Use 4-7-8 breathing" },
      { id: "tr-2", type: "person", name: "Social breaks", description: "Joining smoking area with colleagues", intensity: 7, frequency: "Sometimes", notes: "Carry chewing gum" }
    ],
    substituteActivities: [
      { id: "sub-1", name: "Chewing Sugar-Free Gum", description: "Keeps mouth busy during urge spikes", duration: 10, effectiveness: 8, notes: "Effective replacement" },
      { id: "sub-2", name: "10-Minute Walk", description: "Steps outside without cigarettes", duration: 10, effectiveness: 9, notes: "Resets mind" }
    ],
    daysWithout: 6,
    bestDaysWithout: 15,
    totalRelapses: 2,
    avoidedToday: true,
    relapsedToday: false,
    notes: "Saved $60 so far in this clean run!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "habit-seed-4",
    name: "Limit Social Media Screen Time",
    type: "bad",
    category: "Digital Addiction",
    subCategory: "Screen Time",
    icon: "📱",
    color: "#9C27B0",
    description: "Reduce endless scrolling to under 30 minutes daily",
    isActive: true,
    currentFrequency: { perDay: 3, perWeek: 21, perMonth: 90 }, // 3 hours per day
    goalFrequency: { perDay: 0.5, perWeek: 3.5, perMonth: 15 },
    reductionStrategy: "gradual",
    targetDate: "2026-09-30",
    costPerUnit: 5.0, // Value of lost hourly focus
    costUnit: "hour",
    urgeDelayStrategy: "delay",
    delayTime: 15,
    distractionActivity: "Read 5 pages of a physical book",
    triggers: [
      { id: "tr-3", type: "emotion", name: "Boredom in evening", description: "Reaching for phone automatically before bed", intensity: 9, frequency: "Always", notes: "Put phone across room" }
    ],
    substituteActivities: [
      { id: "sub-3", name: "Reading a book", description: "Physical reading before sleep", duration: 20, effectiveness: 9, notes: "Improves sleep quality" }
    ],
    daysWithout: 4,
    bestDaysWithout: 9,
    totalRelapses: 1,
    avoidedToday: true,
    relapsedToday: false,
    notes: "Sleep quality improved significantly",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_GOALS_SEED: HabitGoal[] = [
  {
    id: "goal-1",
    title: "30 Consecutive Days Clean & Healthy",
    description: "Maintain unbroken hydration, exercise, and smoke-free days",
    targetDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    targetValue: 30,
    currentValue: 18,
    unit: "days",
    progress: 60,
    isAchieved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "goal-2",
    title: "Save $300 from Breaking Bad Habits",
    description: "Accumulate cost savings by avoiding cigarettes and impulse purchases",
    targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    targetValue: 300,
    currentValue: 180,
    unit: "dollars",
    progress: 60,
    isAchieved: false,
    createdAt: new Date().toISOString()
  }
];

type HabitViewMode =
  | "dashboard"
  | "good_habits"
  | "bad_habits"
  | "create_edit"
  | "details"
  | "analytics"
  | "goals"
  | "reminders"
  | "settings";

export const HabitAndRecoveryTracker: React.FC<HabitAndRecoveryTrackerProps> = ({ patient }) => {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<HabitViewMode>("dashboard");
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "good" | "bad">("all");

  // State Declarations
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_habits_redesign_v1");
      return saved ? JSON.parse(saved) : DEFAULT_HABITS_SEED;
    } catch {
      return DEFAULT_HABITS_SEED;
    }
  });

  const [logs, setLogs] = useState<HabitLog[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_habit_logs_redesign_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [goals, setGoals] = useState<HabitGoal[]>(() => {
    try {
      const saved = localStorage.getItem("care2care_habit_goals_redesign_v1");
      return saved ? JSON.parse(saved) : DEFAULT_GOALS_SEED;
    } catch {
      return DEFAULT_GOALS_SEED;
    }
  });

  const [habitSettings, setHabitSettings] = useState<HabitSettings>({
    defaultReminderTime: "08:00",
    defaultGoalUnit: "times",
    dailyReminderEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    soundChoice: "Gentle Chime"
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);

  // Form State for Creating / Editing Habit
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [formType, setFormType] = useState<"good" | "bad">("good");
  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Health & Wellness");
  const [formSubCategory, setFormSubCategory] = useState<string>("Smoking");
  const [formIcon, setFormIcon] = useState<string>("🎯");
  const [formColor, setFormColor] = useState<string>("#2E7D32");
  const [formDescription, setFormDescription] = useState<string>("");

  // Good Habit Specific Form State
  const [formFrequency, setFormFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [formDays, setFormDays] = useState<string[]>(ALL_DAYS);
  const [formTimesPerDay, setFormTimesPerDay] = useState<number>(1);
  const [formTimeOfDay, setFormTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "anytime">("anytime");
  const [formTargetValue, setFormTargetValue] = useState<number>(1);
  const [formUnit, setFormUnit] = useState<string>("times");
  const [formReminderTime, setFormReminderTime] = useState<string>("08:00");
  const [formReminderEnabled, setFormReminderEnabled] = useState<boolean>(true);

  // Bad Habit Specific Form State
  const [formPerDayFreq, setFormPerDayFreq] = useState<number>(1);
  const [formCostPerUnit, setFormCostPerUnit] = useState<number>(10);
  const [formCostUnit, setFormCostUnit] = useState<string>("packet");
  const [formReductionStrategy, setFormReductionStrategy] = useState<"gradual" | "cold_turkey" | "replacement">("replacement");
  const [formTargetDate, setFormTargetDate] = useState<string>("2026-12-31");
  const [formUrgeStrategy, setFormUrgeStrategy] = useState<"delay" | "distract" | "substitute" | "support">("delay");
  const [formDelayTime, setFormDelayTime] = useState<number>(10);
  const [formDistractionActivity, setFormDistractionActivity] = useState<string>("");
  const [formSupportPerson, setFormSupportPerson] = useState<string>("");
  const [formSupportPhone, setFormSupportPhone] = useState<string>("");
  const [formTriggers, setFormTriggers] = useState<Trigger[]>([]);
  const [formSubstitutes, setFormSubstitutes] = useState<SubstituteActivity[]>([]);

  // Temporary Trigger Form inside Modal
  const [newTrigType, setNewTrigType] = useState<"person" | "place" | "thing" | "emotion" | "time" | "custom">("emotion");
  const [newTrigName, setNewTrigName] = useState<string>("");
  const [newTrigDesc, setNewTrigDesc] = useState<string>("");
  const [newTrigIntensity, setNewTrigIntensity] = useState<number>(7);

  // Temporary Substitute Form inside Modal
  const [newSubName, setNewSubName] = useState<string>("");
  const [newSubDesc, setNewSubDesc] = useState<string>("");
  const [newSubDuration, setNewSubDuration] = useState<number>(10);
  const [newSubEffectiveness, setNewSubEffectiveness] = useState<number>(8);

  // Urge Delay Live Timer State
  const [activeUrgeTimer, setActiveUrgeTimer] = useState<{ habitId: string; secondsLeft: number; totalSeconds: number } | null>(null);

  // Preset search
  const [presetSearchQuery, setPresetSearchQuery] = useState<string>("");

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("care2care_habits_redesign_v1", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("care2care_habit_logs_redesign_v1", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("care2care_habit_goals_redesign_v1", JSON.stringify(goals));
  }, [goals]);

  // Urge Delay Timer Interval
  useEffect(() => {
    let timer: any = null;
    if (activeUrgeTimer && activeUrgeTimer.secondsLeft > 0) {
      timer = setInterval(() => {
        setActiveUrgeTimer((prev) => (prev ? { ...prev, secondsLeft: prev.secondsLeft - 1 } : null));
      }, 1000);
    } else if (activeUrgeTimer && activeUrgeTimer.secondsLeft === 0) {
      showToast("🎉 Urge delay completed! You successfully resisted the temptation!");
    }
    return () => clearInterval(timer);
  }, [activeUrgeTimer]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active Selected Habit
  const activeHabit = useMemo(() => {
    return habits.find((h) => h.id === activeHabitId) || habits[0] || null;
  }, [habits, activeHabitId]);

  // Dashboard Summary Calculations
  const summaryStats = useMemo(() => {
    const totalGood = habits.filter((h) => h.type === "good").length;
    const totalBad = habits.filter((h) => h.type === "bad").length;

    const completedGoodToday = habits.filter((h) => h.type === "good" && h.completedToday).length;
    const avoidedBadToday = habits.filter((h) => h.type === "bad" && h.avoidedToday).length;

    const maxStreak = habits.length > 0
      ? Math.max(...habits.map((h) => (h.type === "good" ? safeNum(h.streak) : safeNum(h.daysWithout))))
      : 0;

    // Total Money Saved calculation across bad habits
    const totalSaved = habits
      .filter((h) => h.type === "bad")
      .reduce((acc, h) => {
        const cost = safeNum(h.costPerUnit, 0);
        const freq = safeNum(h.currentFrequency?.perDay, 1);
        const daysClean = safeNum(h.daysWithout, 0);
        return acc + calculateAutoCosts(cost, freq, daysClean).moneySaved;
      }, 0);

    const overallScore = habits.length > 0
      ? Math.round(((completedGoodToday + avoidedBadToday) / habits.length) * 100)
      : 0;

    return {
      totalGood,
      totalBad,
      completedGoodToday,
      avoidedBadToday,
      maxStreak,
      totalSaved: Number(totalSaved.toFixed(2)),
      overallScore
    };
  }, [habits]);

  // Filtered Habits list
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      if (activeTabFilter === "good" && h.type !== "good") return false;
      if (activeTabFilter === "bad" && h.type !== "bad") return false;

      if (
        selectedCategoryFilter !== "All" &&
        !h.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [habits, activeTabFilter, selectedCategoryFilter]);

  // Toggle Good Habit Check-in
  const handleToggleGoodHabit = (id: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const isNowDone = !h.completedToday;
        const newStreak = isNowDone ? safeNum(h.streak) + 1 : Math.max(0, safeNum(h.streak) - 1);
        const newBest = Math.max(safeNum(h.bestStreak), newStreak);
        const newCompletions = isNowDone ? safeNum(h.totalCompletions) + 1 : Math.max(0, safeNum(h.totalCompletions) - 1);

        showToast(
          isNowDone
            ? `🎉 Outstanding! Completed "${h.name}"! Streak: ${newStreak} Days 🔥`
            : `Unchecked "${h.name}"`
        );

        return {
          ...h,
          completedToday: isNowDone,
          streak: newStreak,
          bestStreak: newBest,
          totalCompletions: newCompletions,
          updatedAt: new Date().toISOString()
        };
      })
    );

    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        habitId: id,
        date: todayStr,
        isCompleted: true,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Toggle Bad Habit Avoided / Relapsed
  const handleLogBadHabit = (id: string, isRelapse: boolean) => {
    const todayStr = new Date().toISOString().split("T")[0];

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        if (isRelapse) {
          showToast(`❤️ Reset streak for "${h.name}". You managed to save before—restart clean today!`);
          return {
            ...h,
            relapsedToday: true,
            avoidedToday: false,
            daysWithout: 0,
            totalRelapses: safeNum(h.totalRelapses) + 1,
            updatedAt: new Date().toISOString()
          };
        } else {
          const newDaysWithout = safeNum(h.daysWithout) + 1;
          const newBest = Math.max(safeNum(h.bestDaysWithout), newDaysWithout);
          const costs = calculateAutoCosts(safeNum(h.costPerUnit), safeNum(h.currentFrequency?.perDay, 1), newDaysWithout);

          showToast(`🛡️ Victory! Avoided "${h.name}" today! Saved $${costs.perDay} today!`);

          return {
            ...h,
            avoidedToday: true,
            relapsedToday: false,
            daysWithout: newDaysWithout,
            bestDaysWithout: newBest,
            updatedAt: new Date().toISOString()
          };
        }
      })
    );

    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        habitId: id,
        date: todayStr,
        isAvoided: !isRelapse,
        isRelapsed: isRelapse,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Open Create Form
  const handleOpenCreateForm = (type: "good" | "bad" = "good", preset?: HabitPreset) => {
    setEditingHabitId(null);
    setFormType(type);

    if (preset) {
      setFormName(preset.name);
      setFormCategory(preset.category);
      setFormIcon(preset.icon);
      setFormColor(type === "good" ? "#2E7D32" : "#D32F2F");
      setFormDescription(preset.description);
      setFormTargetValue(preset.defaultGoal || 1);
      setFormUnit(preset.goalUnit || "times");
    } else {
      setFormName("");
      setFormCategory(type === "good" ? "Health & Wellness" : "Addiction");
      setFormSubCategory("Smoking");
      setFormIcon(type === "good" ? "🎯" : "🚬");
      setFormColor(type === "good" ? "#2E7D32" : "#D32F2F");
      setFormDescription("");
      setFormTargetValue(1);
      setFormUnit("times");
    }

    setFormFrequency("daily");
    setFormDays(ALL_DAYS);
    setFormTimesPerDay(1);
    setFormTimeOfDay("anytime");
    setFormReminderTime("08:00");
    setFormReminderEnabled(true);

    setFormPerDayFreq(1);
    setFormCostPerUnit(10);
    setFormCostUnit("packet");
    setFormReductionStrategy("replacement");
    setFormTargetDate("2026-12-31");
    setFormUrgeStrategy("delay");
    setFormDelayTime(10);
    setFormDistractionActivity("Drink 1 glass of cold water and do 10 deep breathings");
    setFormSupportPerson("");
    setFormSupportPhone("");
    setFormTriggers([]);
    setFormSubstitutes([]);

    setViewMode("create_edit");
  };

  // Open Edit Form
  const handleOpenEditForm = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setFormType(habit.type);
    setFormName(habit.name);
    setFormCategory(habit.category);
    setFormSubCategory(habit.subCategory || "Smoking");
    setFormIcon(habit.icon);
    setFormColor(habit.color);
    setFormDescription(habit.description);

    setFormFrequency(habit.frequency || "daily");
    setFormDays(habit.days || ALL_DAYS);
    setFormTimesPerDay(habit.timesPerDay || 1);
    setFormTimeOfDay(habit.timeOfDay || "anytime");
    setFormTargetValue(habit.targetValue || 1);
    setFormUnit(habit.unit || "times");
    setFormReminderTime(habit.reminderTime || "08:00");
    setFormReminderEnabled(habit.reminderEnabled ?? true);

    setFormPerDayFreq(habit.currentFrequency?.perDay || 1);
    setFormCostPerUnit(habit.costPerUnit || 10);
    setFormCostUnit(habit.costUnit || "packet");
    setFormReductionStrategy(habit.reductionStrategy || "replacement");
    setFormTargetDate(habit.targetDate || "2026-12-31");
    setFormUrgeStrategy(habit.urgeDelayStrategy || "delay");
    setFormDelayTime(habit.delayTime || 10);
    setFormDistractionActivity(habit.distractionActivity || "");
    setFormSupportPerson(habit.supportPerson || "");
    setFormSupportPhone(habit.supportPhone || "");
    setFormTriggers(habit.triggers || []);
    setFormSubstitutes(habit.substituteActivities || []);

    setViewMode("create_edit");
  };

  // Save Habit (Create or Update)
  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast("Please enter a habit name!");
      return;
    }

    if (editingHabitId) {
      // Update
      setHabits((prev) =>
        prev.map((h) =>
          h.id === editingHabitId
            ? {
                ...h,
                name: formName.trim(),
                type: formType,
                category: formCategory,
                subCategory: formSubCategory,
                icon: formIcon,
                color: formColor,
                description: formDescription,
                frequency: formFrequency,
                days: formDays,
                timesPerDay: formTimesPerDay,
                timeOfDay: formTimeOfDay,
                targetValue: formTargetValue,
                unit: formUnit,
                reminderTime: formReminderTime,
                reminderEnabled: formReminderEnabled,
                currentFrequency: { perDay: formPerDayFreq, perWeek: formPerDayFreq * 7, perMonth: formPerDayFreq * 30 },
                costPerUnit: formCostPerUnit,
                costUnit: formCostUnit,
                reductionStrategy: formReductionStrategy,
                targetDate: formTargetDate,
                urgeDelayStrategy: formUrgeStrategy,
                delayTime: formDelayTime,
                distractionActivity: formDistractionActivity,
                supportPerson: formSupportPerson,
                supportPhone: formSupportPhone,
                triggers: formTriggers,
                substituteActivities: formSubstitutes,
                updatedAt: new Date().toISOString()
              }
            : h
        )
      );
      showToast(`✨ Updated "${formName}" successfully!`);
    } else {
      // Create New
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: formName.trim(),
        type: formType,
        category: formCategory,
        subCategory: formSubCategory,
        icon: formIcon,
        color: formColor,
        description: formDescription,
        isActive: true,
        frequency: formFrequency,
        days: formDays,
        timesPerDay: formTimesPerDay,
        timeOfDay: formTimeOfDay,
        targetValue: formTargetValue,
        unit: formUnit,
        reminderTime: formReminderTime,
        reminderEnabled: formReminderEnabled,
        streak: 0,
        bestStreak: 0,
        totalCompletions: 0,
        completedToday: false,
        currentFrequency: { perDay: formPerDayFreq, perWeek: formPerDayFreq * 7, perMonth: formPerDayFreq * 30 },
        costPerUnit: formCostPerUnit,
        costUnit: formCostUnit,
        reductionStrategy: formReductionStrategy,
        targetDate: formTargetDate,
        urgeDelayStrategy: formUrgeStrategy,
        delayTime: formDelayTime,
        distractionActivity: formDistractionActivity,
        supportPerson: formSupportPerson,
        supportPhone: formSupportPhone,
        triggers: formTriggers,
        substituteActivities: formSubstitutes,
        daysWithout: 0,
        bestDaysWithout: 0,
        totalRelapses: 0,
        avoidedToday: false,
        relapsedToday: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setHabits((prev) => [newHabit, ...prev]);
      showToast(`🎯 Created new ${formType === "good" ? "Good" : "Bad"} Habit "${formName}"!`);
    }

    setViewMode(formType === "good" ? "good_habits" : "bad_habits");
  };

  // Delete Habit
  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLogs((prev) => prev.filter((l) => l.habitId !== id));
    showToast("🗑️ Habit deleted successfully.");
    setViewMode("dashboard");
  };

  // Add Trigger Helper in Form
  const handleAddTrigger = () => {
    if (!newTrigName.trim()) return;
    const newTrig: Trigger = {
      id: `trig-${Date.now()}`,
      type: newTrigType,
      name: newTrigName.trim(),
      description: newTrigDesc,
      intensity: newTrigIntensity,
      frequency: "Sometimes",
      notes: ""
    };
    setFormTriggers((prev) => [...prev, newTrig]);
    setNewTrigName("");
    setNewTrigDesc("");
  };

  // Add Substitute Helper in Form
  const handleAddSubstitute = () => {
    if (!newSubName.trim()) return;
    const newSub: SubstituteActivity = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      description: newSubDesc,
      duration: newSubDuration,
      effectiveness: newSubEffectiveness,
      notes: ""
    };
    setFormSubstitutes((prev) => [...prev, newSub]);
    setNewSubName("");
    setNewSubDesc("");
  };

  // Start Urge Timer
  const handleStartUrgeTimer = (habit: Habit) => {
    const timeInSec = (habit.delayTime || 10) * 60;
    setActiveUrgeTimer({
      habitId: habit.id,
      secondsLeft: timeInSec,
      totalSeconds: timeInSec
    });
    showToast(`⏳ Started ${habit.delayTime || 10}-Minute Urge Delay Timer! Breathe deep.`);
  };

  // Filter Presets Library
  const filteredPresets = useMemo(() => {
    return HABIT_PRESETS.filter((p) => {
      const matchQuery =
        !presetSearchQuery.trim() ||
        p.name.toLowerCase().includes(presetSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(presetSearchQuery.toLowerCase());
      return matchQuery;
    });
  }, [presetSearchQuery]);

  // Recharts Data Prep
  const barChartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => ({
      day,
      goodCompleted: Math.max(1, (summaryStats.completedGoodToday + idx) % 5 + 1),
      badAvoided: Math.max(1, (summaryStats.avoidedBadToday + idx) % 4 + 1)
    }));
  }, [summaryStats]);

  const pieChartData = useMemo(() => {
    const catMap: Record<string, number> = {};
    habits.forEach((h) => {
      catMap[h.category] = (catMap[h.category] || 0) + 1;
    });
    const colors = ["#2E7D32", "#D32F2F", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#9C27B0"];
    return Object.keys(catMap).map((cat, i) => ({
      name: cat,
      value: catMap[cat],
      color: colors[i % colors.length]
    }));
  }, [habits]);

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6 text-slate-900 font-sans">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR & TOP NAVIGATION */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#2E7D32]/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-2xl shadow-md">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Habit Builder & Breaker
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black uppercase tracking-wider border border-[#2E7D32]/30">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold">
                Build good habits, eliminate bad triggers, track cost savings & receive auto-wishes.
              </p>
            </div>
          </div>

          {/* ADD HABIT BUTTONS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenCreateForm("good")}
              className="px-3.5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-black rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Good Habit
            </button>
            <button
              onClick={() => handleOpenCreateForm("bad")}
              className="px-3.5 py-2.5 bg-[#D32F2F] hover:bg-rose-800 text-white text-xs font-black rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Bad Habit
            </button>
          </div>
        </div>

        {/* SUB-NAV NAVIGATION STRIP */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setViewMode("dashboard")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "dashboard"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setViewMode("good_habits")}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "good_habits"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Good Habits ({summaryStats.totalGood})
          </button>
          <button
            onClick={() => setViewMode("bad_habits")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "bad_habits"
                ? "bg-[#D32F2F] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-300" /> Bad Habits ({summaryStats.totalBad})
          </button>
          <button
            onClick={() => setViewMode("analytics")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "analytics"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setViewMode("goals")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "goals"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Goals
          </button>
          <button
            onClick={() => setViewMode("settings")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === "settings"
                ? "bg-[#2E7D32] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: DASHBOARD */}
      {/* ========================================================= */}
      {viewMode === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* QUICK STATS (4 CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
              <span className="p-3 bg-emerald-100 text-[#2E7D32] rounded-2xl text-2xl font-black">✅</span>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Good Habits</span>
                <span className="text-xl font-black text-slate-900">
                  {summaryStats.completedGoodToday} / {summaryStats.totalGood}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">Completed Today</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
              <span className="p-3 bg-rose-100 text-[#D32F2F] rounded-2xl text-2xl font-black">🛡️</span>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Bad Habits</span>
                <span className="text-xl font-black text-slate-900">
                  {summaryStats.avoidedBadToday} / {summaryStats.totalBad}
                </span>
                <span className="text-[10px] text-rose-700 font-bold block">Avoided Today</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
              <span className="p-3 bg-amber-100 text-amber-700 rounded-2xl text-2xl font-black">🔥</span>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Max Streak</span>
                <span className="text-xl font-black text-slate-900">{summaryStats.maxStreak} Days</span>
                <span className="text-[10px] text-amber-700 font-bold block">Active Unbroken</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
              <span className="p-3 bg-emerald-100 text-[#2E7D32] rounded-2xl text-2xl font-black">💰</span>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Money Saved</span>
                <span className="text-xl font-black text-[#2E7D32]">${summaryStats.totalSaved}</span>
                <span className="text-[10px] text-slate-500 font-bold block">Auto-Calculated Total</span>
              </div>
            </div>
          </div>

          {/* TODAY'S PROGRESS HERO CARD & PATIENT PROGRESS TRACKER */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Care2Care Patient Routine Tracker
                </span>
                <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {patient?.name ? `${patient.name}'s Daily Routine Progress` : "Daily Routine Task Execution"}
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <div>
                  <span className="text-[9px] text-slate-400 block font-black leading-tight">OVERALL SCORE</span>
                  <span className="text-xs font-black text-amber-300">{summaryStats.overallScore}% Completed</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500 shadow-md flex items-center justify-end pr-2 text-[9px] font-black text-slate-950"
                  style={{ width: `${Math.max(8, summaryStats.overallScore)}%` }}
                >
                  {summaryStats.overallScore}%
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                <span>0% Pending</span>
                <span className="text-emerald-400 font-extrabold">{summaryStats.overallScore}% Overall Routine Achieved</span>
                <span>100% Complete</span>
              </div>
            </div>
          </div>

          {/* ACTIVE HABITS LIST WITH AUTO REMARKS & WISHES */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                🎯 Active Habits & Daily Check-ins
              </h2>

              {/* FILTER BUTTONS */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setActiveTabFilter("all")}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    activeTabFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-black" : "text-slate-600"
                  }`}
                >
                  All ({habits.length})
                </button>
                <button
                  onClick={() => setActiveTabFilter("good")}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    activeTabFilter === "good" ? "bg-[#2E7D32] text-white shadow-2xs font-black" : "text-slate-600"
                  }`}
                >
                  Good ({summaryStats.totalGood})
                </button>
                <button
                  onClick={() => setActiveTabFilter("bad")}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    activeTabFilter === "bad" ? "bg-[#D32F2F] text-white shadow-2xs font-black" : "text-slate-600"
                  }`}
                >
                  Bad ({summaryStats.totalBad})
                </button>
              </div>
            </div>

            {filteredHabits.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <span className="text-4xl p-3 bg-slate-100 rounded-full inline-block">🎯</span>
                <h3 className="text-sm font-black text-slate-900">No habits found in this view</h3>
                <p className="text-xs text-slate-500">Click the buttons above to create a Good or Bad Habit!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHabits.map((habit) => {
                  const remark = generateAutoRemark(habit);
                  const isGood = habit.type === "good";
                  const costs = isGood
                    ? null
                    : calculateAutoCosts(safeNum(habit.costPerUnit), safeNum(habit.currentFrequency?.perDay, 1), safeNum(habit.daysWithout));

                  return (
                    <div
                      key={habit.id}
                      className={`p-5 rounded-3xl bg-white border shadow-xs space-y-4 transition-all ${
                        isGood
                          ? habit.completedToday
                            ? "border-emerald-400 bg-emerald-50/20"
                            : "border-slate-200"
                          : habit.avoidedToday
                          ? "border-emerald-400 bg-emerald-50/20"
                          : habit.relapsedToday
                          ? "border-rose-300 bg-rose-50/30"
                          : "border-slate-200"
                      }`}
                    >
                      {/* CARD HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-2xs"
                            style={{ backgroundColor: `${habit.color}20` }}
                          >
                            {habit.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  isGood ? "bg-emerald-100 text-[#2E7D32]" : "bg-rose-100 text-[#D32F2F]"
                                }`}
                              >
                                {isGood ? "Good Habit" : `Bad Habit (${habit.subCategory || "Breaker"})`}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">{habit.category}</span>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 mt-0.5">{habit.name}</h3>
                          </div>
                        </div>

                        {/* ACTIONS EDIT & DETAILS */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditForm(habit)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit Habit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete Habit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-medium line-clamp-2">{habit.description}</p>

                      {/* STATS STRIP */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                        {isGood ? (
                          <>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">CURRENT STREAK</span>
                              <span className="font-black text-amber-600 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 fill-amber-500" /> {habit.streak || 0} Days
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">DAILY GOAL</span>
                              <span className="font-black text-slate-900">
                                {habit.targetValue} {habit.unit}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">CLEAN STREAK</span>
                              <span className="font-black text-emerald-700 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {habit.daysWithout || 0} Days Clean
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">MONEY SAVED</span>
                              <span className="font-black text-[#2E7D32]">${costs?.moneySaved || 0}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* USER REQUESTED SPECIAL FEATURE: AUTO REMARK & WISHING BANNER */}
                      <div className="p-3.5 rounded-2xl bg-[#E8F5E9]/80 border border-[#2E7D32]/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#2E7D32] tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#2E7D32]" /> {remark.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${remark.badgeColor}`}>
                            {remark.badge}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">{remark.message}</p>
                        <p className="text-[11px] font-extrabold text-[#2E7D32] italic">
                          💌 Wish: "{remark.wish}"
                        </p>
                      </div>

                      {/* ACTION CHECK-IN BUTTONS */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        {isGood ? (
                          <button
                            onClick={() => handleToggleGoodHabit(habit.id)}
                            className={`w-full py-2.5 rounded-2xl font-black text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-2 ${
                              habit.completedToday
                                ? "bg-[#2E7D32] text-white"
                                : "bg-emerald-100 hover:bg-emerald-200 text-[#1B5E20]"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            {habit.completedToday ? "Completed Today! ✅" : "Mark Completed Today"}
                          </button>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <button
                              onClick={() => handleLogBadHabit(habit.id, false)}
                              className={`py-2.5 rounded-2xl font-black text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                                habit.avoidedToday
                                  ? "bg-[#2E7D32] text-white"
                                  : "bg-emerald-100 hover:bg-emerald-200 text-[#1B5E20]"
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {habit.avoidedToday ? "Avoided ✅" : "Log Avoided"}
                            </button>
                            <button
                              onClick={() => handleLogBadHabit(habit.id, true)}
                              className="py-2.5 bg-rose-100 hover:bg-rose-200 text-[#D32F2F] rounded-2xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Log Relapse
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: GOOD HABITS TAB */}
      {/* ========================================================= */}
      {viewMode === "good_habits" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                ✅ Good Habits (Build & Continue)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Focus on positive routines to improve health, mental peace, and productivity.
              </p>
            </div>
            <button
              onClick={() => handleOpenCreateForm("good")}
              className="px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-black rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Good Habit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits
              .filter((h) => h.type === "good")
              .map((habit) => {
                const remark = generateAutoRemark(habit);
                return (
                  <div key={habit.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center text-2xl font-black">
                          {habit.icon}
                        </span>
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#2E7D32]">{habit.category}</span>
                          <h3 className="text-base font-black text-slate-900">{habit.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenEditForm(habit)} className="p-1.5 text-slate-400 hover:text-slate-800">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">{habit.description}</p>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">STREAK</span>
                        <span className="font-black text-amber-600">{habit.streak || 0} Days</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">TARGET</span>
                        <span className="font-black text-slate-900">
                          {habit.targetValue} {habit.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">TOTAL</span>
                        <span className="font-black text-emerald-700">{habit.totalCompletions || 0} Times</span>
                      </div>
                    </div>

                    {/* AUTO REMARK & WISH */}
                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-black text-[#2E7D32] uppercase">{remark.title}</span>
                      <p className="text-xs font-bold text-slate-800">{remark.message}</p>
                      <p className="text-[11px] font-extrabold text-[#2E7D32] italic">💌 Wish: "{remark.wish}"</p>
                    </div>

                    <button
                      onClick={() => handleToggleGoodHabit(habit.id)}
                      className={`w-full py-2.5 rounded-2xl font-black text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-2 ${
                        habit.completedToday
                          ? "bg-[#2E7D32] text-white"
                          : "bg-emerald-100 hover:bg-emerald-200 text-[#1B5E20]"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {habit.completedToday ? "Completed Today! ✅" : "Mark Completed Today"}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: BAD HABITS TAB */}
      {/* ========================================================= */}
      {viewMode === "bad_habits" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                🛡️ Bad Habits & Addiction Breaker
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Eliminate cravings, manage triggers, track auto cost savings, and use urge delay strategies.
              </p>
            </div>
            <button
              onClick={() => handleOpenCreateForm("bad")}
              className="px-4 py-2.5 bg-[#D32F2F] hover:bg-rose-800 text-white text-xs font-black rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Bad Habit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits
              .filter((h) => h.type === "bad")
              .map((habit) => {
                const remark = generateAutoRemark(habit);
                const costs = calculateAutoCosts(
                  safeNum(habit.costPerUnit),
                  safeNum(habit.currentFrequency?.perDay, 1),
                  safeNum(habit.daysWithout)
                );

                return (
                  <div key={habit.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-2xl bg-rose-100 text-[#D32F2F] flex items-center justify-center text-2xl font-black">
                          {habit.icon}
                        </span>
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#D32F2F]">
                            {habit.subCategory || "Bad Habit"}
                          </span>
                          <h3 className="text-base font-black text-slate-900">{habit.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenEditForm(habit)} className="p-1.5 text-slate-400 hover:text-slate-800">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">{habit.description}</p>

                    {/* COST BREAKDOWN BOX */}
                    <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Auto-Calculated Savings</span>
                        <span className="text-emerald-400 font-black">${costs.moneySaved} Total Saved</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-300">
                        <div>Per Day: ${costs.perDay}</div>
                        <div>Per Week: ${costs.perWeek}</div>
                        <div>Per Year: ${costs.perYear}</div>
                      </div>
                    </div>

                    {/* TRIGGERS & SUBSTITUTES PREVIEW */}
                    {safeArray(habit.triggers).length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Triggers ({habit.triggers?.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {habit.triggers?.map((tr) => (
                            <span key={tr.id} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                              ⚠️ {tr.name} (Intensity: {tr.intensity}/10)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {safeArray(habit.substituteActivities).length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Substitutes ({habit.substituteActivities?.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {habit.substituteActivities?.map((sub) => (
                            <span key={sub.id} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                              🌱 {sub.name} ({sub.duration}m)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* URGE DELAY STRATEGY BUTTON */}
                    <button
                      onClick={() => handleStartUrgeTimer(habit)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Clock className="w-3.5 h-3.5" /> Start {habit.delayTime || 10}-Min Urge Delay Strategy
                    </button>

                    {/* AUTO REMARK & WISH */}
                    <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-1">
                      <span className="text-[10px] font-black text-[#D32F2F] uppercase">{remark.title}</span>
                      <p className="text-xs font-bold text-slate-800">{remark.message}</p>
                      <p className="text-[11px] font-extrabold text-[#D32F2F] italic">💌 Wish: "{remark.wish}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleLogBadHabit(habit.id, false)}
                        className={`py-2.5 rounded-2xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                          habit.avoidedToday ? "bg-[#2E7D32] text-white" : "bg-emerald-100 hover:bg-emerald-200 text-[#1B5E20]"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Log Avoided
                      </button>
                      <button
                        onClick={() => handleLogBadHabit(habit.id, true)}
                        className="py-2.5 bg-rose-100 hover:bg-rose-200 text-[#D32F2F] rounded-2xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Log Relapse
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: CREATE / EDIT HABIT FORM MODAL */}
      {/* ========================================================= */}
      {viewMode === "create_edit" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setViewMode("dashboard")} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {editingHabitId ? "Edit Habit" : `Add New ${formType === "good" ? "Good Habit" : "Bad Habit"}`}
                </h2>
                <p className="text-xs text-slate-500">Configure parameters, schedules, cost calculations & triggers.</p>
              </div>
            </div>

            {/* TYPE TOGGLE */}
            <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFormType("good")}
                className={`px-4 py-2 rounded-xl cursor-pointer ${formType === "good" ? "bg-[#2E7D32] text-white font-black" : "text-slate-600"}`}
              >
                Good Habit
              </button>
              <button
                type="button"
                onClick={() => setFormType("bad")}
                className={`px-4 py-2 rounded-xl cursor-pointer ${formType === "bad" ? "bg-[#D32F2F] text-white font-black" : "text-slate-600"}`}
              >
                Bad Habit
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveHabit} className="space-y-6">
            {/* SECTION 1: BASIC INFO */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">1. Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Habit Name *</label>
                  <input
                    type="text"
                    required
                    placeholder={formType === "good" ? "e.g. Drink 8 Glasses Water" : "e.g. Quit Smoking"}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Mental & Emotional">Mental & Emotional</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Relationships">Relationships & Social</option>
                    <option value="Financial">Financial Habits</option>
                    <option value="Addiction">Addiction (Smoking/Alcohol/Drugs)</option>
                    <option value="Digital Addiction">Digital Addiction (Screen Time/Gaming)</option>
                    <option value="Behavioral">Behavioral (Junk Food/Spending)</option>
                  </select>
                </div>
              </div>

              {formType === "bad" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Sub-Category *</label>
                    <select
                      value={formSubCategory}
                      onChange={(e) => setFormSubCategory(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                    >
                      <option value="Smoking">🚬 Smoking</option>
                      <option value="Drinking">🍷 Drinking / Alcohol</option>
                      <option value="Drugs">💊 Prescription / Substance</option>
                      <option value="Pornography">🔞 Pornography</option>
                      <option value="Masturbation">💔 Masturbation</option>
                      <option value="Screen Time">📱 Screen Time / Social Media</option>
                      <option value="Gaming">🎮 Gaming Addiction</option>
                      <option value="Over Spending">💰 Over Spending / Impulse Buy</option>
                      <option value="Junk Food">🍔 Junk Food / Fast Food</option>
                      <option value="Procrastination">💤 Procrastination</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Reduction Strategy *</label>
                    <select
                      value={formReductionStrategy}
                      onChange={(e) => setFormReductionStrategy(e.target.value as any)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                    >
                      <option value="replacement">Habit Replacement (Substitute)</option>
                      <option value="gradual">Gradual Reduction</option>
                      <option value="cold_turkey">Cold Turkey (Immediate Stop)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description & Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Why do you want to build or break this habit?"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* SECTION 2: SCHEDULE & GOALS */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                2. Schedule & Target Metric
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom Days</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Value</label>
                  <input
                    type="number"
                    min={1}
                    value={formTargetValue}
                    onChange={(e) => setFormTargetValue(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="times">times</option>
                    <option value="minutes">minutes</option>
                    <option value="glasses">glasses</option>
                    <option value="hours">hours</option>
                    <option value="km">km</option>
                    <option value="dollars">dollars</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3 (BAD HABITS ONLY): COST TRACKING & AUTO CALCULATIONS */}
            {formType === "bad" && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  3. Cost Tracking & Auto Calculations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Cost Per Unit ($) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={formCostPerUnit}
                      onChange={(e) => setFormCostPerUnit(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Cost Unit *</label>
                    <input
                      type="text"
                      placeholder="e.g. packet, bottle, hour, session"
                      value={formCostUnit}
                      onChange={(e) => setFormCostUnit(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Units Per Day *</label>
                    <input
                      type="number"
                      min={1}
                      value={formPerDayFreq}
                      onChange={(e) => setFormPerDayFreq(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* AUTO CALCULATIONS DISPLAY */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-400">
                    Auto-Calculated Cost Impact Preview
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-200">
                    <div>Per Day: ${calculateAutoCosts(formCostPerUnit, formPerDayFreq).perDay}</div>
                    <div>Per Week: ${calculateAutoCosts(formCostPerUnit, formPerDayFreq).perWeek}</div>
                    <div>Per Month: ${calculateAutoCosts(formCostPerUnit, formPerDayFreq).perMonth}</div>
                    <div>Per Year: ${calculateAutoCosts(formCostPerUnit, formPerDayFreq).perYear}</div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4 (BAD HABITS ONLY): TRIGGER MANAGEMENT */}
            {formType === "bad" && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  4. Trigger Management (People, Places, Things, Emotions)
                </h3>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">+ Add New Trigger</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={newTrigType}
                      onChange={(e) => setNewTrigType(e.target.value as any)}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    >
                      <option value="emotion">Emotion (Stress, Boredom)</option>
                      <option value="person">Person (Friends, Group)</option>
                      <option value="place">Place (Bar, Social setting)</option>
                      <option value="thing">Thing (Phone, Lighter)</option>
                      <option value="time">Time (Late night, Evening)</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Trigger name..."
                      value={newTrigName}
                      onChange={(e) => setNewTrigName(e.target.value)}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />

                    <button
                      type="button"
                      onClick={handleAddTrigger}
                      className="px-4 py-2 bg-[#2E7D32] text-white font-black text-xs rounded-xl cursor-pointer"
                    >
                      Add Trigger
                    </button>
                  </div>
                </div>

                {formTriggers.length > 0 && (
                  <div className="space-y-2">
                    {formTriggers.map((tr) => (
                      <div key={tr.id} className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-rose-900">{tr.name} ({tr.type})</span>
                          <span className="text-[10px] text-slate-500 block">Intensity: {tr.intensity}/10</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormTriggers((prev) => prev.filter((t) => t.id !== tr.id))}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5 (BAD HABITS ONLY): SUBSTITUTE ACTIVITIES */}
            {formType === "bad" && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  5. Substitute Healthy Activities
                </h3>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">+ Add Substitute Activity</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Activity name (e.g. Chewing gum)"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />

                    <input
                      type="number"
                      placeholder="Duration (mins)"
                      value={newSubDuration}
                      onChange={(e) => setNewSubDuration(Number(e.target.value))}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />

                    <button
                      type="button"
                      onClick={handleAddSubstitute}
                      className="px-4 py-2 bg-[#2E7D32] text-white font-black text-xs rounded-xl cursor-pointer"
                    >
                      Add Substitute
                    </button>
                  </div>
                </div>

                {formSubstitutes.length > 0 && (
                  <div className="space-y-2">
                    {formSubstitutes.map((sub) => (
                      <div key={sub.id} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-emerald-900">{sub.name} ({sub.duration} mins)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormSubstitutes((prev) => prev.filter((s) => s.id !== sub.id))}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 6: PRESETS LIBRARY AUTO-FILL */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  6. Auto-Fill from Presets Library (100+ Presets)
                </h3>
                <input
                  type="text"
                  placeholder="Search preset habits..."
                  value={presetSearchQuery}
                  onChange={(e) => setPresetSearchQuery(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 w-full sm:w-64"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                {filteredPresets.slice(0, 18).map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleOpenCreateForm(formType, preset)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg p-1 bg-white rounded-lg">{preset.icon}</span>
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded-md">
                      Select
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMode("dashboard")}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-8 py-2.5 text-white text-xs font-black rounded-2xl shadow-md cursor-pointer ${
                  formType === "good" ? "bg-[#2E7D32] hover:bg-[#1B5E20]" : "bg-[#D32F2F] hover:bg-rose-800"
                }`}
              >
                {editingHabitId ? "Update Habit" : "Save Habit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 5: ANALYTICS & AI COACH */}
      {/* ========================================================= */}
      {viewMode === "analytics" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">📊 Habit Analytics & Performance</h2>
              <p className="text-xs text-slate-500">Visualization of habit completion frequency and category balance.</p>
            </div>
            <button
              onClick={() => setViewMode("dashboard")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl cursor-pointer"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Weekly Habits Performance</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="goodCompleted" fill="#2E7D32" radius={[6, 6, 0, 0]} name="Good Habits Completed" />
                    <Bar dataKey="badAvoided" fill="#D32F2F" radius={[6, 6, 0, 0]} name="Bad Habits Avoided" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Habit Category Distribution</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={4}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 6: GOALS */}
      {/* ========================================================= */}
      {viewMode === "goals" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">🎯 Personal Habit Goals & Milestones</h2>
              <p className="text-xs text-slate-500">Long-term targets and streak achievements.</p>
            </div>
            <button
              onClick={() => setViewMode("dashboard")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-[#2E7D32]">
                      ON TRACK
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{goal.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Target: {goal.targetDate}</span>
                </div>

                <p className="text-xs text-slate-500">{goal.description}</p>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    <span className="text-[#2E7D32] font-black">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 7: SETTINGS & DATA PERSISTENCE */}
      {/* ========================================================= */}
      {viewMode === "settings" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">⚙️ Habit System Settings</h2>
              <p className="text-xs text-slate-500">Manage data persistence, backup JSON, and default habit presets.</p>
            </div>
            <button onClick={() => setViewMode("dashboard")} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl cursor-pointer">
              ← Back
            </button>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-black text-slate-900">Data Persistence & Backup</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ habits, logs, goals }, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `care2care-habits-backup-${new Date().toISOString().split("T")[0]}.json`;
                    a.click();
                    showToast("📥 Exported Habit JSON data backup!");
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Data JSON
                </button>

                <button
                  onClick={() => {
                    setHabits(DEFAULT_HABITS_SEED);
                    setGoals(DEFAULT_GOALS_SEED);
                    setLogs([]);
                    showToast("🔄 Reset default habit suite!");
                  }}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Default Presets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
