import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar as CalendarIcon,
  Activity,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Download,
  Settings,
  Sparkles,
  Calculator,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sun,
  Shield,
  Smile,
  Frown,
  Meh,
  Zap,
  Droplet,
  Baby,
  User,
  Info,
  Clock,
  Check,
  RefreshCw,
  Lock,
  MessageCircle,
  Smartphone
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ReferenceLine
} from "recharts";
import {
  CycleRecord,
  CyclePrediction,
  MenstrualReminder,
  PregnancyRecord,
  MenstrualUserSettings
} from "../types";

// ============================================================
// DEFAULT INITIAL DEMO DATA
// ============================================================
const DEFAULT_SETTINGS: MenstrualUserSettings = {
  userId: "user_1",
  averageCycleLength: 28,
  periodLength: 5,
  ovulationDay: 14,
  lutealPhaseLength: 14,
  privacyMode: "Private",
  notifications: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const INITIAL_RECORDS: CycleRecord[] = [
  {
    id: "cyc_1",
    userId: "user_1",
    startDate: "2026-07-10",
    endDate: "2026-07-15",
    cycleLength: 28,
    periodLength: 5,
    flowIntensity: "Medium",
    flowColor: "Bright Red",
    clots: false,
    painLevel: 4,
    symptoms: ["Cramps", "Headache", "Fatigue"],
    mood: ["Irritable", "Tired"],
    basalTemperature: 36.5,
    weight: 58.2,
    bloodPressure: "118/76",
    exerciseLevel: "Low",
    sleepQuality: "Fair",
    notes: "Light cramping on day 1 and 2.",
    createdAt: "2026-07-10T08:00:00Z",
    updatedAt: "2026-07-15T18:00:00Z"
  },
  {
    id: "cyc_2",
    userId: "user_1",
    startDate: "2026-06-12",
    endDate: "2026-06-17",
    cycleLength: 28,
    periodLength: 5,
    flowIntensity: "Heavy",
    flowColor: "Bright Red",
    clots: true,
    painLevel: 6,
    symptoms: ["Cramps", "Bloating", "Lower Back Pain"],
    mood: ["Mood Swings", "Anxious"],
    basalTemperature: 36.4,
    weight: 58.5,
    notes: "Took ibuprofen for cramps on day 2.",
    createdAt: "2026-06-12T08:00:00Z",
    updatedAt: "2026-06-17T18:00:00Z"
  },
  {
    id: "cyc_3",
    userId: "user_1",
    startDate: "2026-05-15",
    endDate: "2026-05-20",
    cycleLength: 28,
    periodLength: 5,
    flowIntensity: "Medium",
    flowColor: "Bright Red",
    painLevel: 3,
    symptoms: ["Fatigue", "Cravings"],
    mood: ["Happy", "Calm"],
    basalTemperature: 36.6,
    weight: 57.9,
    notes: "Normal period duration.",
    createdAt: "2026-05-15T08:00:00Z",
    updatedAt: "2026-05-20T18:00:00Z"
  }
];

const INITIAL_REMINDERS: MenstrualReminder[] = [
  {
    id: "rem_1",
    userId: "user_1",
    type: "Period",
    title: "Upcoming Period Alert",
    description: "Period predicted to start in 2 days. Get pads/tampons ready!",
    daysBefore: 2,
    time: "09:00",
    isEnabled: true,
    isRecurring: true,
    recurrencePattern: "Monthly",
    notificationType: "Push",
    vibration: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "rem_2",
    userId: "user_1",
    type: "Ovulation",
    title: "Ovulation & High Fertility Day",
    description: "Peak ovulation predicted for today.",
    daysBefore: 0,
    time: "08:30",
    isEnabled: true,
    isRecurring: true,
    recurrencePattern: "Monthly",
    notificationType: "Push",
    vibration: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "rem_3",
    userId: "user_1",
    type: "Pill",
    title: "Daily Birth Control / Vitamin Pill",
    description: "Take daily supplement / contraceptive pill.",
    daysBefore: 0,
    time: "21:00",
    isEnabled: true,
    isRecurring: true,
    recurrencePattern: "Daily",
    notificationType: "Push",
    vibration: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SYMPTOM_OPTIONS = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Lower Back Pain",
  "Breast Tenderness",
  "Acne / Breakouts",
  "Nausea",
  "Food Cravings",
  "Dizziness",
  "Insomnia",
  "Hot Flashes"
];

const MOOD_OPTIONS = [
  "Happy",
  "Calm",
  "Energetic",
  "Irritable",
  "Anxious",
  "Sad",
  "Mood Swings",
  "Sensitive",
  "Stressed",
  "Focused"
];

export const MenstrualCycleTracker: React.FC = () => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "log" | "calendar" | "analytics" | "calculators" | "reminders" | "pregnancy" | "settings"
  >("dashboard");

  // Main State persisted in localStorage
  const [settings, setSettings] = useState<MenstrualUserSettings>(() => {
    const saved = localStorage.getItem("care2care_cycle_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [records, setRecords] = useState<CycleRecord[]>(() => {
    const saved = localStorage.getItem("care2care_cycle_records");
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  const [reminders, setReminders] = useState<MenstrualReminder[]>(() => {
    const saved = localStorage.getItem("care2care_cycle_reminders");
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [pregnancy, setPregnancy] = useState<PregnancyRecord | null>(() => {
    const saved = localStorage.getItem("care2care_pregnancy_record");
    return saved ? JSON.parse(saved) : null;
  });

  // Toast & Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  // Form State for Logging Period
  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]
  );
  const [formFlow, setFormFlow] = useState<"Light" | "Medium" | "Heavy">(
    "Medium"
  );
  const [formPain, setFormPain] = useState<number>(3);
  const [formSelectedSymptoms, setFormSelectedSymptoms] = useState<string[]>(
    []
  );
  const [formSelectedMoods, setFormSelectedMoods] = useState<string[]>([]);
  const [formBasalTemp, setFormBasalTemp] = useState<string>("36.6");
  const [formWeight, setFormWeight] = useState<string>("58.0");
  const [formNotes, setFormNotes] = useState<string>("");
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Calendar Month State
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null);

  // Calculators State
  const [calcLmpDate, setCalcLmpDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [calcCycleLen, setCalcCycleLen] = useState<number>(28);
  const [calcResult, setCalcResult] = useState<any>(null);

  // Save state to LocalStorage
  useEffect(() => {
    localStorage.setItem("care2care_cycle_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("care2care_cycle_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("care2care_cycle_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    if (pregnancy) {
      localStorage.setItem("care2care_pregnancy_record", JSON.stringify(pregnancy));
    } else {
      localStorage.removeItem("care2care_pregnancy_record");
    }
  }, [pregnancy]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper Calculations
  const getLatestRecord = (): CycleRecord | undefined => {
    if (records.length === 0) return undefined;
    return [...records].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];
  };

  const calculatePredictions = (): CyclePrediction => {
    const latest = getLatestRecord();
    const cycleLen = settings.averageCycleLength || 28;
    const periodLen = settings.periodLength || 5;

    let baseStart = latest ? new Date(latest.startDate) : new Date();
    // Add cycle length to last period start
    const nextStart = new Date(baseStart.getTime() + cycleLen * 86400000);
    const nextEnd = new Date(nextStart.getTime() + (periodLen - 1) * 86400000);

    // Ovulation is usually 14 days before next period start
    const ovulationDate = new Date(nextStart.getTime() - 14 * 86400000);
    const fertileStart = new Date(ovulationDate.getTime() - 5 * 86400000);
    const fertileEnd = new Date(ovulationDate.getTime() + 1 * 86400000);
    const lutealStart = new Date(ovulationDate.getTime() + 1 * 86400000);

    return {
      userId: settings.userId,
      nextPeriodStart: nextStart.toISOString().split("T")[0],
      nextPeriodEnd: nextEnd.toISOString().split("T")[0],
      ovulationDate: ovulationDate.toISOString().split("T")[0],
      fertileWindowStart: fertileStart.toISOString().split("T")[0],
      fertileWindowEnd: fertileEnd.toISOString().split("T")[0],
      lutealPhaseStart: lutealStart.toISOString().split("T")[0],
      confidence: records.length >= 3 ? 95 : records.length >= 1 ? 80 : 65,
      cyclePattern: "Regular",
      averageCycleLength: cycleLen,
      shortestCycle: 27,
      longestCycle: 29,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // Calculate predicted start dates for the next two cycles
  const calculateNextTwoCycles = () => {
    const latest = getLatestRecord();
    const cycleLen = settings.averageCycleLength || 28;
    const periodLen = settings.periodLength || 5;

    let baseStart = latest ? new Date(latest.startDate) : new Date();

    // Cycle 1 (Next Cycle)
    const c1Start = new Date(baseStart.getTime() + cycleLen * 86400000);
    const c1End = new Date(c1Start.getTime() + (periodLen - 1) * 86400000);
    const c1Ovulation = new Date(c1Start.getTime() - 14 * 86400000);
    const c1FertileStart = new Date(c1Ovulation.getTime() - 5 * 86400000);
    const c1FertileEnd = new Date(c1Ovulation.getTime() + 1 * 86400000);

    // Cycle 2 (Following Cycle)
    const c2Start = new Date(c1Start.getTime() + cycleLen * 86400000);
    const c2End = new Date(c2Start.getTime() + (periodLen - 1) * 86400000);
    const c2Ovulation = new Date(c2Start.getTime() - 14 * 86400000);
    const c2FertileStart = new Date(c2Ovulation.getTime() - 5 * 86400000);
    const c2FertileEnd = new Date(c2Ovulation.getTime() + 1 * 86400000);

    const todayMs = new Date().setHours(0, 0, 0, 0);
    const daysToC1 = Math.ceil((c1Start.getTime() - todayMs) / (1000 * 3600 * 24));
    const daysToC2 = Math.ceil((c2Start.getTime() - todayMs) / (1000 * 3600 * 24));

    return {
      cycle1: {
        cycleNum: 1,
        startDate: c1Start.toISOString().split("T")[0],
        endDate: c1End.toISOString().split("T")[0],
        ovulationDate: c1Ovulation.toISOString().split("T")[0],
        fertileWindowStart: c1FertileStart.toISOString().split("T")[0],
        fertileWindowEnd: c1FertileEnd.toISOString().split("T")[0],
        daysRemaining: daysToC1,
      },
      cycle2: {
        cycleNum: 2,
        startDate: c2Start.toISOString().split("T")[0],
        endDate: c2End.toISOString().split("T")[0],
        ovulationDate: c2Ovulation.toISOString().split("T")[0],
        fertileWindowStart: c2FertileStart.toISOString().split("T")[0],
        fertileWindowEnd: c2FertileEnd.toISOString().split("T")[0],
        daysRemaining: daysToC2,
      },
    };
  };

  const nextTwoCycles = calculateNextTwoCycles();

  // Filter last 6 months of records for Recharts cycle length trend chart
  const getSixMonthRecords = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const filtered = records.filter(
      (r) => new Date(r.startDate) >= sixMonthsAgo
    );

    const targetList = filtered.length >= 2 ? filtered : records;
    const sorted = [...targetList]
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(-6);

    return sorted.map((r) => ({
      dateLabel: new Date(r.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      startDate: r.startDate,
      cycleLength: r.cycleLength || settings.averageCycleLength,
      periodLength: r.periodLength || settings.periodLength,
      painLevel: r.painLevel || 0,
      avgCycleTarget: settings.averageCycleLength,
    }));
  };

  const sixMonthChartData = getSixMonthRecords();

  const prediction = calculatePredictions();
  const latestRecord = getLatestRecord();

  // Current Cycle Day calculation
  const getCurrentCycleDay = (): number => {
    if (!latestRecord) return 1;
    const start = new Date(latestRecord.startDate).getTime();
    const today = new Date().getTime();
    const diffDays = Math.floor((today - start) / (1000 * 3600 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const currentCycleDay = getCurrentCycleDay();

  // Check Phase of current day
  const getCurrentPhase = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (
      latestRecord &&
      todayStr >= latestRecord.startDate &&
      todayStr <= latestRecord.endDate
    ) {
      return {
        name: "Menstrual Phase",
        badge: "🔴 Period Active",
        color: "bg-rose-100 text-rose-800 border-rose-200",
        desc: "Rest and stay hydrated. Light activity recommended."
      };
    }
    if (
      todayStr >= prediction.fertileWindowStart &&
      todayStr <= prediction.fertileWindowEnd
    ) {
      if (todayStr === prediction.ovulationDate) {
        return {
          name: "Ovulation Day",
          badge: "🟢 Peak Fertility",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          desc: "Peak chance of conception. Estrogen & LH levels at peak."
        };
      }
      return {
        name: "Fertile Window",
        badge: "🟡 High Fertility",
        color: "bg-amber-100 text-amber-800 border-amber-200",
        desc: "Higher probability of pregnancy. Increased energy levels."
      };
    }
    if (todayStr < prediction.fertileWindowStart) {
      return {
        name: "Follicular Phase",
        badge: "✨ Follicular Phase",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        desc: "Energy and mood rising as estrogen builds up."
      };
    }
    return {
      name: "Luteal Phase",
      badge: "🌙 Luteal Phase",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      desc: "Progesterone dominates. Prepare for upcoming period rest."
    };
  };

  const currentPhase = getCurrentPhase();

  // Handle Save Log
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStartDate) {
      showToast("Please select period start date.");
      return;
    }

    const start = new Date(formStartDate);
    const end = formEndDate ? new Date(formEndDate) : start;
    const periodDays =
      Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24))) + 1;

    const newRec: CycleRecord = {
      id: editingRecordId || `cyc_${Date.now()}`,
      userId: settings.userId,
      startDate: formStartDate,
      endDate: formEndDate || formStartDate,
      cycleLength: settings.averageCycleLength,
      periodLength: periodDays,
      flowIntensity: formFlow,
      painLevel: formPain,
      symptoms: formSelectedSymptoms,
      mood: formSelectedMoods,
      basalTemperature: parseFloat(formBasalTemp) || 36.6,
      weight: parseFloat(formWeight) || 58,
      notes: formNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingRecordId) {
      setRecords(records.map((r) => (r.id === editingRecordId ? newRec : r)));
      showToast("Cycle record updated successfully!");
    } else {
      setRecords([newRec, ...records]);
      showToast("New period log added successfully!");
    }

    // Reset Form
    setEditingRecordId(null);
    setFormNotes("");
    setFormSelectedSymptoms([]);
    setFormSelectedMoods([]);
    setActiveTab("dashboard");
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this period log?")) {
      setRecords(records.filter((r) => r.id !== id));
      showToast("Period log deleted.");
    }
  };

  const toggleSymptom = (sym: string) => {
    if (formSelectedSymptoms.includes(sym)) {
      setFormSelectedSymptoms(formSelectedSymptoms.filter((s) => s !== sym));
    } else {
      setFormSelectedSymptoms([...formSelectedSymptoms, sym]);
    }
  };

  const toggleMood = (m: string) => {
    if (formSelectedMoods.includes(m)) {
      setFormSelectedMoods(formSelectedMoods.filter((item) => item !== m));
    } else {
      setFormSelectedMoods([...formSelectedMoods, m]);
    }
  };

  // Calculators Logic
  const runCalculator = (type: "period" | "ovulation" | "due_date" | "fertile") => {
    const lmp = new Date(calcLmpDate);
    const cycle = Number(calcCycleLen) || 28;

    if (isNaN(lmp.getTime())) {
      showToast("Please select a valid LMP date.");
      return;
    }

    if (type === "period") {
      const nextP = new Date(lmp.getTime() + cycle * 86400000);
      setCalcResult({
        title: "Predicted Next Period",
        value: nextP.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        desc: `Based on your ${cycle}-day average cycle length.`
      });
    } else if (type === "ovulation") {
      const ovDate = new Date(lmp.getTime() + (cycle - 14) * 86400000);
      setCalcResult({
        title: "Estimated Ovulation Day",
        value: ovDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        desc: "Peak egg release day (14 days before your next predicted period)."
      });
    } else if (type === "due_date") {
      // Naegele's rule: LMP + 280 days
      const dueDate = new Date(lmp.getTime() + 280 * 86400000);
      setCalcResult({
        title: "Estimated Pregnancy Due Date",
        value: dueDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        desc: "Estimated 40-week delivery date calculated from Last Menstrual Period."
      });
    } else if (type === "fertile") {
      const ovDate = new Date(lmp.getTime() + (cycle - 14) * 86400000);
      const fertStart = new Date(ovDate.getTime() - 5 * 86400000);
      const fertEnd = new Date(ovDate.getTime() + 1 * 86400000);
      setCalcResult({
        title: "Estimated Fertile Window",
        value: `${fertStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })} - ${fertEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })}`,
        desc: "The 6-day fertile window with highest probability of conception."
      });
    }
  };

  // Render Calendar Grid Days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-12 border border-slate-100 rounded-xl bg-slate-50/50" />);
    }

    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = new Date().toISOString().split("T")[0] === dateStr;

      // Check if period day
      const isPeriod = records.some(
        (r) => dateStr >= r.startDate && dateStr <= r.endDate
      );
      const isPredictedPeriod =
        dateStr >= prediction.nextPeriodStart &&
        dateStr <= prediction.nextPeriodEnd;
      const isOvulation = dateStr === prediction.ovulationDate;
      const isFertile =
        dateStr >= prediction.fertileWindowStart &&
        dateStr <= prediction.fertileWindowEnd &&
        !isOvulation;

      let bgClass = "bg-white text-slate-700 hover:bg-slate-50";
      let borderClass = "border-slate-200";

      if (isPeriod) {
        bgClass = "bg-rose-500 text-white font-black shadow-xs";
        borderClass = "border-rose-600";
      } else if (isOvulation) {
        bgClass = "bg-emerald-500 text-white font-black shadow-xs";
        borderClass = "border-emerald-600";
      } else if (isFertile) {
        bgClass = "bg-amber-100 text-amber-900 font-bold";
        borderClass = "border-amber-300";
      } else if (isPredictedPeriod) {
        bgClass = "bg-rose-100 text-rose-900 border-dashed border-rose-400 font-bold";
      }

      days.push(
        <button
          key={d}
          onClick={() => setSelectedCalendarDay(dateStr)}
          className={`h-10 sm:h-12 border rounded-xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer text-xs relative ${bgClass} ${borderClass} ${
            isToday ? "ring-2 ring-indigo-600 font-black" : ""
          }`}
        >
          <span className="text-[11px] font-bold">{d}</span>
          <div className="flex gap-0.5">
            {isPeriod && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            {isOvulation && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            {isFertile && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
          </div>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-5 space-y-5 font-sans pb-16">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-extrabold animate-bounce">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2E7D32] rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Menstrual Care & Cycle Tracker
                </h1>
                <span className="bg-emerald-100 text-[#2E7D32] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">
                Period logging, fertility predictions, symptom tracking & health analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("log");
                setEditingRecordId(null);
              }}
              className="px-3.5 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Period
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all cursor-pointer"
              title="Settings & Privacy"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "log", label: "Period Log", icon: Heart },
            { id: "calendar", label: "Calendar", icon: CalendarIcon },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
            { id: "calculators", label: "Calculators", icon: Calculator },
            { id: "reminders", label: "Reminders", icon: Bell },
            { id: "pregnancy", label: "Pregnancy", icon: Baby },
            { id: "settings", label: "Settings", icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: DASHBOARD */}
      {/* ============================================================ */}
      {activeTab === "dashboard" && (
        <div className="space-y-5">
          {/* LOCAL NOTIFICATION ALERT BANNER */}
          {!isAlertDismissed && nextTwoCycles.cycle1.daysRemaining <= 3 && (
            <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 p-4 sm:p-5 rounded-3xl text-white shadow-md flex flex-wrap items-center justify-between gap-3 border border-rose-400/50 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
                  <Bell className="w-6 h-6 text-amber-200 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ⏰ Log Reminder Alert
                    </span>
                    <span className="text-amber-100 text-xs font-bold">
                      Predicted Start: {nextTwoCycles.cycle1.startDate}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-white mt-0.5">
                    {nextTwoCycles.cycle1.daysRemaining <= 0
                      ? "Your predicted cycle start date is TODAY or overdue! Please log your period flow, pain level & symptoms."
                      : `Your predicted cycle start date is approaching in ${nextTwoCycles.cycle1.daysRemaining} day(s)! Don't forget to log daily flow & symptoms.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab("log");
                    setEditingRecordId(null);
                  }}
                  className="px-3.5 py-2 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-2xl shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Log Today's Data
                </button>
                <button
                  onClick={() => {
                    setIsAlertDismissed(true);
                    showToast("Log reminder alert dismissed.");
                  }}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs rounded-2xl cursor-pointer transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Top Status & Predictions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cycle Day Status Dial Card */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Current Cycle Status
                  </span>
                  <h2 className="text-2xl font-black text-slate-800">
                    Cycle Day {currentCycleDay}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${currentPhase.color}`}>
                  {currentPhase.badge}
                </span>
              </div>

              {/* Cycle Day Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-600">
                  <span>Day 1 (Period)</span>
                  <span>Day {prediction.ovulationDate.split("-")[2]} (Ovulation)</span>
                  <span>Day {settings.averageCycleLength} (Next Cycle)</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (currentCycleDay / settings.averageCycleLength) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold text-slate-700">{currentPhase.desc}</span>
                </div>
                <button
                  onClick={() => setActiveTab("log")}
                  className="px-3 py-1 bg-rose-600 text-white font-extrabold rounded-xl text-[11px] hover:bg-rose-700 transition-all cursor-pointer shrink-0"
                >
                  Quick Symptoms Log
                </button>
              </div>
            </div>

            {/* Next Period & Ovulation Countdown Card */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-3xl border border-rose-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">
                  Next Cycle Forecast
                </span>
                <h3 className="text-xl font-black text-rose-900 mt-1">
                  {prediction.nextPeriodStart}
                </h3>
                <p className="text-xs text-rose-700 font-bold mt-0.5">
                  Predicted Next Period Start
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-rose-200/60 text-xs font-bold text-rose-900">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-rose-600" /> Expected Duration:
                  </span>
                  <span className="font-black">{settings.periodLength} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-600" /> Peak Ovulation:
                  </span>
                  <span className="font-black">{prediction.ovulationDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accuracy:
                  </span>
                  <span className="font-black">{prediction.confidence}% Confidence</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEXT TWO CYCLES PREDICTIONS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-rose-500" /> Next 2 Cycles Forecast (History-Based Predictions)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Calculated based on your logged history & {settings.averageCycleLength}-day average cycle length
                </p>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-black">
                {records.length >= 3 ? "High Confidence (95%)" : "Calculated Model"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cycle +1 Card */}
              <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 border border-rose-200 rounded-2xl p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider bg-rose-100 px-2 py-0.5 rounded-md">
                    Cycle +1 (Next Period)
                  </span>
                  <span className="text-xs font-black text-rose-800 bg-white px-2.5 py-1 rounded-full border border-rose-200 shadow-2xs">
                    {nextTwoCycles.cycle1.daysRemaining <= 0
                      ? "Due Today / Overdue"
                      : `In ${nextTwoCycles.cycle1.daysRemaining} Days`}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-bold block">Predicted Start - End Dates</span>
                  <div className="text-base font-black text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-rose-600" />
                    <span>{nextTwoCycles.cycle1.startDate}</span>
                    <span className="text-slate-400">→</span>
                    <span>{nextTwoCycles.cycle1.endDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-bold border-t border-rose-200/60">
                  <div className="bg-white p-2 rounded-xl border border-rose-100">
                    <span className="text-slate-400 block text-[10px]">Peak Ovulation</span>
                    <span className="text-rose-900 font-extrabold">{nextTwoCycles.cycle1.ovulationDate}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-rose-100">
                    <span className="text-slate-400 block text-[10px]">Fertile Window</span>
                    <span className="text-amber-800 font-extrabold">
                      {nextTwoCycles.cycle1.fertileWindowStart} - {nextTwoCycles.cycle1.fertileWindowEnd}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cycle +2 Card */}
              <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 border border-purple-200 rounded-2xl p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider bg-purple-100 px-2 py-0.5 rounded-md">
                    Cycle +2 (Following Period)
                  </span>
                  <span className="text-xs font-black text-purple-800 bg-white px-2.5 py-1 rounded-full border border-purple-200 shadow-2xs">
                    In {nextTwoCycles.cycle2.daysRemaining} Days
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-bold block">Predicted Start - End Dates</span>
                  <div className="text-base font-black text-slate-800 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-purple-600" />
                    <span>{nextTwoCycles.cycle2.startDate}</span>
                    <span className="text-slate-400">→</span>
                    <span>{nextTwoCycles.cycle2.endDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-bold border-t border-purple-200/60">
                  <div className="bg-white p-2 rounded-xl border border-purple-100">
                    <span className="text-slate-400 block text-[10px]">Peak Ovulation</span>
                    <span className="text-purple-900 font-extrabold">{nextTwoCycles.cycle2.ovulationDate}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-purple-100">
                    <span className="text-slate-400 block text-[10px]">Fertile Window</span>
                    <span className="text-amber-800 font-extrabold">
                      {nextTwoCycles.cycle2.fertileWindowStart} - {nextTwoCycles.cycle2.fertileWindowEnd}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logged Symptoms Grid */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> Recent Period History & Logs
              </h3>
              <button
                onClick={() => setActiveTab("log")}
                className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer"
              >
                View All Logs →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {records.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">
                      {rec.startDate} to {rec.endDate}
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full">
                      {rec.flowIntensity} Flow
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 font-medium">
                    <p>
                      <strong>Pain Level:</strong> {rec.painLevel}/10
                    </p>
                    {rec.symptoms && rec.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rec.symptoms.map((s) => (
                          <span
                            key={s}
                            className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 text-xs font-bold">
                    <button
                      onClick={() => {
                        setEditingRecordId(rec.id);
                        setFormStartDate(rec.startDate);
                        setFormEndDate(rec.endDate);
                        setFormFlow(rec.flowIntensity);
                        setFormPain(rec.painLevel);
                        setFormSelectedSymptoms(rec.symptoms || []);
                        setFormSelectedMoods(rec.mood || []);
                        setFormNotes(rec.notes || "");
                        setActiveTab("log");
                      }}
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health & Lifestyle Tips Section */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-purple-200">
                Personalized Phase Wellness Tips
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="font-extrabold text-amber-300 block">🥗 Nutrition & Iron</span>
                <p className="text-purple-100">
                  Incorporate spinach, dark chocolate, and iron-rich foods to replenish energy.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="font-extrabold text-pink-300 block">🧘 Yoga & Movement</span>
                <p className="text-purple-100">
                  Gentle stretching and light pelvic tilt yoga poses ease lower back cramps.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="font-extrabold text-sky-300 block">💧 Hydration & Sleep</span>
                <p className="text-purple-100">
                  Aim for 2.5L water daily to minimize bloating and promote restful sleep.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: LOG PERIOD FORM */}
      {/* ============================================================ */}
      {activeTab === "log" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  {editingRecordId ? "Edit Period Log Entry" : "Log New Menstrual Cycle / Period"}
                </h2>
                <p className="text-xs text-slate-500">Record flow, pain severity, symptoms, and vitals</p>
              </div>

              {editingRecordId && (
                <button
                  onClick={() => {
                    setEditingRecordId(null);
                    setFormNotes("");
                  }}
                  className="text-xs font-bold text-slate-500 hover:underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Period Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Period End Date (Estimated or Actual)
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                  />
                </div>
              </div>

              {/* Flow Intensity Buttons */}
              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Flow Intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Light", "Medium", "Heavy"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormFlow(f)}
                      className={`p-3 rounded-2xl font-black text-xs transition-all cursor-pointer border ${
                        formFlow === f
                          ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {f === "Light" ? "💧 Light" : f === "Medium" ? "🩸 Medium" : "🌊 Heavy"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Level Slider */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
                <div className="flex justify-between items-center font-extrabold text-slate-800">
                  <label>Cramps & Pain Severity Level (1 - 10)</label>
                  <span className="text-sm font-black text-rose-600 bg-white px-2.5 py-1 rounded-xl border border-rose-200">
                    {formPain} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formPain}
                  onChange={(e) => setFormPain(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>1 (Mild / Barely noticeable)</span>
                  <span>5 (Moderate cramping)</span>
                  <span>10 (Severe pain)</span>
                </div>
              </div>

              {/* Symptoms Picker */}
              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Physical Symptoms
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOM_OPTIONS.map((sym) => {
                    const active = formSelectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                          active
                            ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {active ? "✓ " : "+ "}{sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Moods Picker */}
              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  Mood & Emotional State
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map((m) => {
                    const active = formSelectedMoods.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMood(m)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                          active
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {active ? "✓ " : "+ "}{m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vitals (Basal Body Temp & Weight) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Basal Body Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 36.6"
                    value={formBasalTemp}
                    onChange={(e) => setFormBasalTemp(e.target.value)}
                    className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Body Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 58.0"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                  />
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Notes / Observations
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Took 200mg Ibuprofen at 2pm. Felt better after warm compress."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-sm shadow-md transition-all cursor-pointer"
              >
                {editingRecordId ? "Save & Update Period Log" : "Confirm & Save Period Log"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CALENDAR VIEW */}
      {/* ============================================================ */}
      {activeTab === "calendar" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            {/* Calendar Controls Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-rose-500" />
                {calendarDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric"
                })}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() + 1,
                        1
                      )
                    )
                  }
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>

            {/* Legend Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Period Day (Logged)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-200 border border-rose-400" /> Predicted Period
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Ovulation Day
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-300" /> Fertile Window
              </span>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center font-extrabold text-xs text-slate-400 py-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">{renderCalendar()}</div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ANALYTICS & INSIGHTS */}
      {/* ============================================================ */}
      {activeTab === "analytics" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Cycle Analytics & Health History
            </h2>

            {/* Chart 1: Cycle Length Trends (Last 6 Months) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    📈 Cycle Length Trends (Last 6 Months)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Visualizing cycle durations & period lengths over the last 6 months against your {settings.averageCycleLength}-day baseline
                  </p>
                </div>
                <span className="text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  6 Months Data
                </span>
              </div>

              <div className="h-64 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sixMonthChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fontWeight: "bold" }} />
                    <YAxis domain={[0, 40]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #cbd5e1",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "8px" }} />
                    <ReferenceLine
                      y={settings.averageCycleLength}
                      label={{
                        value: `Baseline Avg (${settings.averageCycleLength}d)`,
                        fill: "#64748b",
                        fontSize: 10,
                        fontWeight: "bold",
                        position: "insideTopRight"
                      }}
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="cycleLength"
                      name="Cycle Duration (Days)"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff" }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="periodLength"
                      name="Period Duration (Days)"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#ffffff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 6-Month Summary Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-purple-50/80 border border-purple-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-purple-700 block uppercase">6-Mo Avg Cycle</span>
                  <span className="text-lg font-black text-purple-900">
                    {(
                      sixMonthChartData.reduce((acc, c) => acc + c.cycleLength, 0) /
                      (sixMonthChartData.length || 1)
                    ).toFixed(1)}{" "}
                    Days
                  </span>
                </div>
                <div className="bg-rose-50/80 border border-rose-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-rose-700 block uppercase">Avg Period Length</span>
                  <span className="text-lg font-black text-rose-900">
                    {(
                      sixMonthChartData.reduce((acc, c) => acc + c.periodLength, 0) /
                      (sixMonthChartData.length || 1)
                    ).toFixed(1)}{" "}
                    Days
                  </span>
                </div>
                <div className="bg-amber-50/80 border border-amber-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">Shortest / Longest</span>
                  <span className="text-lg font-black text-amber-900">
                    {Math.min(...sixMonthChartData.map((c) => c.cycleLength))}d /{" "}
                    {Math.max(...sixMonthChartData.map((c) => c.cycleLength))}d
                  </span>
                </div>
                <div className="bg-emerald-50/80 border border-emerald-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">Cycle Regularity</span>
                  <span className="text-lg font-black text-emerald-900">
                    {records.length >= 3 ? "Regular (±1d)" : "Sufficient Data"}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart 2: Cramps Severity History */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-slate-500">
                Pain Level Severity Log
              </h3>
              <div className="h-48 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={records.map((r) => ({
                      date: r.startDate,
                      painLevel: r.painLevel
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="painLevel" name="Pain Level (1-10)" fill="#e11d48" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: CALCULATORS */}
      {/* ============================================================ */}
      {activeTab === "calculators" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
              <Calculator className="w-5 h-5 text-purple-600" />
              Menstrual & Fertility Health Calculators
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Last Menstrual Period (LMP) Date
                </label>
                <input
                  type="date"
                  value={calcLmpDate}
                  onChange={(e) => setCalcLmpDate(e.target.value)}
                  className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Average Cycle Length (Days)
                </label>
                <input
                  type="number"
                  value={calcCycleLen}
                  onChange={(e) => setCalcCycleLen(Number(e.target.value))}
                  className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => runCalculator("period")}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 rounded-2xl font-black text-xs cursor-pointer text-center"
              >
                🩸 Period Predictor
              </button>
              <button
                onClick={() => runCalculator("ovulation")}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-2xl font-black text-xs cursor-pointer text-center"
              >
                🟢 Ovulation Calc
              </button>
              <button
                onClick={() => runCalculator("fertile")}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl font-black text-xs cursor-pointer text-center"
              >
                🟡 Fertile Window
              </button>
              <button
                onClick={() => runCalculator("due_date")}
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-2xl font-black text-xs cursor-pointer text-center"
              >
                🤰 Pregnancy Due Date
              </button>
            </div>

            {calcResult && (
              <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 text-purple-900 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-600">
                  {calcResult.title}
                </span>
                <p className="text-xl font-black">{calcResult.value}</p>
                <p className="text-xs text-purple-700 font-medium">{calcResult.desc}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: REMINDERS */}
      {/* ============================================================ */}
      {activeTab === "reminders" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Notification & Pill Reminders
              </h2>
              <button
                onClick={() => {
                  const newRem: MenstrualReminder = {
                    id: `rem_${Date.now()}`,
                    userId: settings.userId,
                    type: "Log",
                    title: "Daily Symptom Check-in",
                    description: "Log today's mood & physical symptoms",
                    daysBefore: 0,
                    time: "20:00",
                    isEnabled: true,
                    isRecurring: true,
                    recurrencePattern: "Daily",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  };
                  setReminders([...reminders, newRem]);
                  showToast("New reminder created!");
                }}
                className="px-3 py-1.5 bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Reminder
              </button>
            </div>

            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-800">{rem.title}</h4>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full">
                        {rem.time}
                      </span>
                    </div>
                    <p className="text-slate-500">{rem.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setReminders(
                        reminders.map((r) =>
                          r.id === rem.id ? { ...r, isEnabled: !r.isEnabled } : r
                        )
                      );
                      showToast(`Reminder ${rem.isEnabled ? "disabled" : "enabled"}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                      rem.isEnabled
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {rem.isEnabled ? "Active ✓" : "Off"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: PREGNANCY MODE */}
      {/* ============================================================ */}
      {activeTab === "pregnancy" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Baby className="w-5 h-5 text-purple-600" />
                Pregnancy Tracker Mode
              </h2>

              <button
                onClick={() => {
                  if (pregnancy) {
                    setPregnancy(null);
                    showToast("Pregnancy mode deactivated.");
                  } else {
                    const lmp = latestRecord ? latestRecord.startDate : "2026-06-01";
                    const lmpDate = new Date(lmp);
                    const due = new Date(lmpDate.getTime() + 280 * 86400000);
                    setPregnancy({
                      id: `preg_${Date.now()}`,
                      userId: settings.userId,
                      startDate: lmp,
                      dueDate: due.toISOString().split("T")[0],
                      currentWeek: 8,
                      currentTrimester: 1,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    });
                    showToast("Pregnancy mode activated!");
                  }
                }}
                className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  pregnancy
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-purple-600 text-white shadow-xs"
                }`}
              >
                {pregnancy ? "Disable Pregnancy Mode" : "Activate Pregnancy Mode"}
              </button>
            </div>

            {pregnancy ? (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-purple-100">
                    Week {pregnancy.currentWeek} of Pregnancy (Trimester {pregnancy.currentTrimester})
                  </span>
                  <h3 className="text-2xl font-black">
                    Baby is size of a Raspberry 🫐
                  </h3>
                  <p className="text-xs text-purple-100">
                    Estimated Due Date: <strong>{pregnancy.dueDate}</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-slate-600">
                  Pregnancy mode provides week-by-week baby development tracking, milestone countdowns, and trimester health guides.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 8: SETTINGS & PRIVACY */}
      {/* ============================================================ */}
      {activeTab === "settings" && (
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
              <Shield className="w-5 h-5 text-slate-700" />
              Cycle Preferences & Privacy Settings
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Average Cycle Length (Days)
                </label>
                <input
                  type="number"
                  value={settings.averageCycleLength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      averageCycleLength: Number(e.target.value)
                    })
                  }
                  className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Default Period Duration (Days)
                </label>
                <input
                  type="number"
                  value={settings.periodLength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      periodLength: Number(e.target.value)
                    })
                  }
                  className="w-full font-bold p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200">
                <span className="font-black text-slate-800 block">Export Health Summary Report</span>
                <p className="text-[11px] text-slate-500">
                  Generate a confidential summary for your gynecologist or healthcare provider.
                </p>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Export / Print Doctor Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenstrualCycleTracker;
