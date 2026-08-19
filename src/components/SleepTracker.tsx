import React, { useState, useMemo } from "react";
import {
  Moon,
  Sun,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Sliders,
  Award,
  Lock,
  X,
  Check,
  Zap,
  Star,
  RefreshCw,
  HelpCircle,
  FileText,
  Share2,
  ChevronLeft,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  Activity,
  Coffee,
  Bed,
  Eye,
  Flame,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Info,
  Radio,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

export type SleepScreenTab =
  | "dashboard"
  | "log_sleep"
  | "goal_setup"
  | "bedtime_routine"
  | "reminders"
  | "history"
  | "analytics"
  | "calendar"
  | "insights"
  | "milestones"
  | "settings";

export interface SleepLogEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  totalDurationMin: number;
  quality: "very_poor" | "poor" | "okay" | "good" | "excellent";
  feeling: "Refreshed" | "Tired" | "Energetic" | "Normal" | "Groggy";
  notes?: string;
  efficiency: number;
  score: number;
  deepSleepMin: number;
  lightSleepMin: number;
  remSleepMin: number;
  awakeMin: number;
}

export const SleepTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SleepScreenTab>("dashboard");
  const [selectedDate, setSelectedDate] = useState<string>("2025-05-14");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Sleep Goal State
  const [goalHours, setGoalHours] = useState<number>(8.0);
  const [customGoalHours, setCustomGoalHours] = useState<number>(7.5);
  const [goalMode, setGoalMode] = useState<"recommended" | "custom">("recommended");
  const [wakeUpTime, setWakeUpTime] = useState<string>("06:30 AM");
  const [bedTime, setBedTime] = useState<string>("10:30 PM");
  const [activityLevel, setActivityLevel] = useState<string>("Moderate");
  const [exercisePerDay, setExercisePerDay] = useState<string>("30 min");
  const [caffeineIntake, setCaffeineIntake] = useState<string>("Normal");
  const [napsPerDay, setNapsPerDay] = useState<string>("0-1 hour");

  // Routine Steps State
  const [routineEnabled, setRoutineEnabled] = useState<boolean>(true);
  const [routineSteps, setRoutineSteps] = useState([
    { id: "r1", title: "Dim the lights", subtitle: "1:00 before bed", icon: "💡", enabled: true },
    { id: "r2", title: "No screens", subtitle: "45m before bed", icon: "📱", enabled: true },
    { id: "r3", title: "Read a book", subtitle: "30m before bed", icon: "📖", enabled: true },
    { id: "r4", title: "Meditate", subtitle: "15m before bed", icon: "🧘", enabled: false },
    { id: "r5", title: "Warm shower", subtitle: "30m before bed", icon: "🚿", enabled: true },
  ]);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepSubtitle, setNewStepSubtitle] = useState("20m before bed");

  // Reminders State
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [reminderPattern, setReminderPattern] = useState<"smart" | "fixed" | "custom">("smart");
  const [windDownReminder, setWindDownReminder] = useState<string>("9:30 PM");
  const [bedtimeReminder, setBedtimeReminder] = useState<string>("10:00 PM");
  const [wakeUpReminder, setWakeUpReminder] = useState<string>("6:30 AM");
  const [snoozeDuration, setSnoozeDuration] = useState<string>("10 min");

  // Log Sleep Form State
  const [formBedTime, setFormBedTime] = useState<string>("10:30 PM");
  const [formWakeTime, setFormWakeTime] = useState<string>("06:30 AM");
  const [formQuality, setFormQuality] = useState<"very_poor" | "poor" | "okay" | "good" | "excellent">("good");
  const [formFeeling, setFormFeeling] = useState<"Refreshed" | "Tired" | "Energetic" | "Normal" | "Groggy">("Refreshed");
  const [formNotes, setFormNotes] = useState<string>("");

  // Historical Records State
  const [sleepLogs, setSleepLogs] = useState<Record<string, SleepLogEntry>>({
    "2025-05-14": {
      id: "log-14",
      date: "2025-05-14",
      bedTime: "10:30 PM",
      wakeTime: "06:30 AM",
      totalDurationMin: 440, // 7h 20m
      quality: "good",
      feeling: "Refreshed",
      notes: "Deep restful sleep, feeling very energized for the morning!",
      efficiency: 90,
      score: 82,
      deepSleepMin: 105, // 1h 45m
      lightSleepMin: 275, // 4h 35m
      remSleepMin: 60, // 1h 00m
      awakeMin: 15,
    },
    "2025-05-13": {
      id: "log-13",
      date: "2025-05-13",
      bedTime: "11:00 PM",
      wakeTime: "06:00 AM",
      totalDurationMin: 420, // 7h 00m
      quality: "good",
      feeling: "Normal",
      efficiency: 88,
      score: 79,
      deepSleepMin: 95,
      lightSleepMin: 265,
      remSleepMin: 50,
      awakeMin: 10,
    },
    "2025-05-12": {
      id: "log-12",
      date: "2025-05-12",
      bedTime: "10:15 PM",
      wakeTime: "06:40 AM",
      totalDurationMin: 505, // 8h 25m
      quality: "excellent",
      feeling: "Energetic",
      efficiency: 94,
      score: 92,
      deepSleepMin: 130,
      lightSleepMin: 300,
      remSleepMin: 65,
      awakeMin: 10,
    },
    "2025-05-11": {
      id: "log-11",
      date: "2025-05-11",
      bedTime: "11:30 PM",
      wakeTime: "06:00 AM",
      totalDurationMin: 390, // 6h 30m
      quality: "poor",
      feeling: "Tired",
      efficiency: 81,
      score: 68,
      deepSleepMin: 70,
      lightSleepMin: 260,
      remSleepMin: 45,
      awakeMin: 15,
    },
    "2025-05-10": {
      id: "log-10",
      date: "2025-05-10",
      bedTime: "10:30 PM",
      wakeTime: "06:45 AM",
      totalDurationMin: 495, // 8h 15m
      quality: "excellent",
      feeling: "Refreshed",
      efficiency: 92,
      score: 89,
      deepSleepMin: 120,
      lightSleepMin: 300,
      remSleepMin: 65,
      awakeMin: 10,
    },
    "2025-05-09": {
      id: "log-09",
      date: "2025-05-09",
      bedTime: "10:45 PM",
      wakeTime: "06:00 AM",
      totalDurationMin: 435, // 7h 15m
      quality: "good",
      feeling: "Normal",
      efficiency: 87,
      score: 78,
      deepSleepMin: 90,
      lightSleepMin: 280,
      remSleepMin: 55,
      awakeMin: 10,
    },
    "2025-05-08": {
      id: "log-08",
      date: "2025-05-08",
      bedTime: "10:00 PM",
      wakeTime: "06:10 AM",
      totalDurationMin: 490, // 8h 10m
      quality: "excellent",
      feeling: "Refreshed",
      efficiency: 91,
      score: 88,
      deepSleepMin: 115,
      lightSleepMin: 305,
      remSleepMin: 60,
      awakeMin: 10,
    },
    "2025-05-02": {
      id: "log-02",
      date: "2025-05-02",
      bedTime: "10:15 PM",
      wakeTime: "06:30 AM",
      totalDurationMin: 495, // 8h 15m (Best Sleep)
      quality: "excellent",
      feeling: "Refreshed",
      efficiency: 95,
      score: 96,
      deepSleepMin: 140,
      lightSleepMin: 290,
      remSleepMin: 60,
      awakeMin: 5,
    }
  });

  // History & Analytics Filters
  const [historyRange, setHistoryRange] = useState<"Day" | "Week" | "Month" | "Year">("Month");
  const [analyticsRange, setAnalyticsRange] = useState<"7 Days" | "30 Days" | "90 Days" | "Year">("7 Days");

  // Settings State
  const [notificationSound, setNotificationSound] = useState("Chime");
  const [quietHours, setQuietHours] = useState("10:00 PM – 7:00 AM");
  const [sleepStageDetection, setSleepStageDetection] = useState(true);
  const [units, setUnits] = useState("Hours / Minutes");

  // Current selected log
  const currentLog = sleepLogs[selectedDate] || sleepLogs["2025-05-14"];

  const handleSaveSleepLog = (e: React.FormEvent) => {
    e.preventDefault();
    const durationMin = 440; // 7h 20m
    const newLog: SleepLogEntry = {
      id: `log-${Date.now()}`,
      date: selectedDate,
      bedTime: formBedTime,
      wakeTime: formWakeTime,
      totalDurationMin: durationMin,
      quality: formQuality,
      feeling: formFeeling,
      notes: formNotes,
      efficiency: formQuality === "excellent" ? 94 : formQuality === "good" ? 88 : 75,
      score: formQuality === "excellent" ? 92 : formQuality === "good" ? 82 : 65,
      deepSleepMin: 105,
      lightSleepMin: 275,
      remSleepMin: 60,
      awakeMin: 15,
    };
    setSleepLogs((prev) => ({ ...prev, [selectedDate]: newLog }));
    showNotification("Sleep log saved successfully!");
    setActiveTab("dashboard");
  };

  const navMenuItems: Array<{ id: SleepScreenTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "log_sleep", label: "Log Sleep", icon: Moon },
    { id: "goal_setup", label: "Sleep Goal Setup", icon: Sliders },
    { id: "bedtime_routine", label: "Bedtime Routine", icon: Clock },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "history", label: "History", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "calendar", label: "Sleep Calendar", icon: Calendar },
    { id: "insights", label: "Insights", icon: Sparkles },
    { id: "milestones", label: "Milestones", icon: Award },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP HEADER - PASTEL PEACH / CORAL HERO */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Sleep Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sleep & Recovery
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("log_sleep")}
            className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Sleep</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING MENU (AS PER SPECIFIED USER REQUIREMENT) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                  : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF5A36]"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SCREEN 1: SLEEP DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Main Dial Card */}
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Night</span>
                <p className="text-sm font-black text-slate-800">14 May 2025</p>
              </div>
              <button
                onClick={() => showNotification("Sleep summary ready to share")}
                className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              {/* Circular Gauge */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" stroke="#FEE2D5" strokeWidth="12" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#FF5A36"
                    strokeWidth="12"
                    strokeDasharray={427}
                    strokeDashoffset={427 * (1 - 440 / 480)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">7h 20m</span>
                  <span className="text-xs font-bold text-[#FF5A36]">Good Sleep</span>
                </div>
              </div>

              {/* Quick Metrics Column */}
              <div className="space-y-3 w-full sm:w-auto">
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
                  <div className="text-[11px] font-bold text-slate-400">Goal</div>
                  <div className="text-base font-black text-slate-900">8h 0m</div>
                </div>
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
                  <div className="text-[11px] font-bold text-slate-400">Efficiency</div>
                  <div className="text-base font-black text-slate-900">90%</div>
                </div>
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
                  <div className="text-[11px] font-bold text-slate-400">Score</div>
                  <div className="text-base font-black text-emerald-600 flex items-center gap-1">
                    <span>82 / 100</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stages Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 mt-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Deep Sleep</span>
                <p className="text-sm font-black text-indigo-900">1h 45m</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Light Sleep</span>
                <p className="text-sm font-black text-sky-900">4h 35m</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">REM Sleep</span>
                <p className="text-sm font-black text-purple-900">1h 00m</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Awake</span>
                <p className="text-sm font-black text-amber-900">15m</p>
              </div>
            </div>

            {/* Streak & Status Banner */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-orange-50/70 border border-orange-200/60 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Sleep Streak</span>
                  <p className="text-sm font-black text-slate-900">12 Days</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                  <p className="text-sm font-black text-emerald-800">On Track</p>
                </div>
              </div>
            </div>

            {/* Next Reminder Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF5A36]" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Next Reminder</span>
                  <p className="text-xs font-black text-slate-800">Wind-down at 10:00 PM</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("reminders")}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Change
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setActiveTab("log_sleep")}
              className="w-full py-3.5 mt-5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Sleep</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOG SLEEP */}
      {activeTab === "log_sleep" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-900">How did you sleep?</h2>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
              <ChevronLeft className="w-4 h-4 cursor-pointer" />
              <span>Today, 14 May 2025</span>
              <ChevronRight className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          <form onSubmit={handleSaveSleepLog} className="space-y-4 max-w-lg mx-auto">
            {/* Sleep Time Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                  <Moon className="w-3.5 h-3.5 text-[#FF5A36]" /> Bed Time
                </span>
                <input
                  type="text"
                  value={formBedTime}
                  onChange={(e) => setFormBedTime(e.target.value)}
                  className="w-full text-base font-black text-slate-900 bg-transparent border-b border-orange-300 focus:outline-none py-1"
                />
              </div>

              <div className="p-3.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Wake Up
                </span>
                <input
                  type="text"
                  value={formWakeTime}
                  onChange={(e) => setFormWakeTime(e.target.value)}
                  className="w-full text-base font-black text-slate-900 bg-transparent border-b border-orange-300 focus:outline-none py-1"
                />
              </div>
            </div>

            {/* Sleep Quality Smileys */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Sleep Quality</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: "very_poor", label: "Very Poor", icon: "😫" },
                  { id: "poor", label: "Poor", icon: "🙁" },
                  { id: "okay", label: "Okay", icon: "😐" },
                  { id: "good", label: "Good", icon: "🙂" },
                  { id: "excellent", label: "Excellent", icon: "😄" },
                ].map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setFormQuality(q.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formQuality === q.id
                        ? "bg-orange-50 border-[#FF5A36] text-[#FF5A36] shadow-xs scale-105"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{q.icon}</span>
                    <span className="text-[10px] font-black">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* How do you feel? */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">How do you feel?</label>
              <select
                value={formFeeling}
                onChange={(e) => setFormFeeling(e.target.value as any)}
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5A36]"
              >
                <option value="Refreshed">Refreshed</option>
                <option value="Energetic">Energetic</option>
                <option value="Normal">Normal</option>
                <option value="Tired">Tired</option>
                <option value="Groggy">Groggy</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes (Optional)</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Add any notes about your sleep, dreams, or room comfort..."
                rows={3}
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#FF5A36]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer transition-all"
            >
              Save Sleep Log
            </button>
          </form>
        </div>
      )}

      {/* SCREEN 3: SLEEP GOAL SETUP */}
      {activeTab === "goal_setup" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">What's your sleep goal?</h2>
            <p className="text-xs text-slate-500">Personalize your ideal sleep target and lifestyle parameters.</p>
          </div>

          <div className="space-y-3">
            {/* Recommended Goal Card */}
            <div
              onClick={() => setGoalMode("recommended")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                goalMode === "recommended"
                  ? "bg-orange-50/70 border-[#FF5A36] shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <div>
                <span className="text-xs font-black text-slate-900 block">Recommended Goal</span>
                <span className="text-[11px] text-slate-500 block">Based on your age & profile</span>
                <span className="text-xl font-black text-[#FF5A36] mt-1 block">8h 0m <span className="text-xs font-bold text-slate-400">/ Night</span></span>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${goalMode === "recommended" ? "text-[#FF5A36]" : "text-slate-300"}`} />
            </div>

            {/* Custom Goal Card */}
            <div
              onClick={() => setGoalMode("custom")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                goalMode === "custom"
                  ? "bg-orange-50/70 border-[#FF5A36] shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900">Custom Goal</span>
                <div className={`w-4 h-4 rounded-full border ${goalMode === "custom" ? "bg-[#FF5A36] border-[#FF5A36]" : "border-slate-300"}`} />
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Set your own target hours</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="11"
                  step="0.5"
                  value={customGoalHours}
                  onChange={(e) => setCustomGoalHours(parseFloat(e.target.value))}
                  className="flex-1 accent-[#FF5A36]"
                />
                <span className="text-sm font-black text-slate-900 w-16 text-right">{customGoalHours}h / night</span>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Additional Info (Helps us personalize)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-500" /> Wake-up Time</span>
                <input
                  type="text"
                  value={wakeUpTime}
                  onChange={(e) => setWakeUpTime(e.target.value)}
                  className="w-24 text-right font-black text-slate-900 bg-transparent border-b border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold flex items-center gap-1.5"><Moon className="w-4 h-4 text-indigo-500" /> Bed Time</span>
                <input
                  type="text"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-24 text-right font-black text-slate-900 bg-transparent border-b border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-500" /> Daily Activity Level</span>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="bg-transparent font-black text-slate-900 text-xs text-right"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold flex items-center gap-1.5"><Zap className="w-4 h-4 text-purple-500" /> Exercise (per day)</span>
                <input
                  type="text"
                  value={exercisePerDay}
                  onChange={(e) => setExercisePerDay(e.target.value)}
                  className="w-24 text-right font-black text-slate-900 bg-transparent border-b border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold flex items-center gap-1.5"><Coffee className="w-4 h-4 text-amber-700" /> Caffeine Intake</span>
                <select
                  value={caffeineIntake}
                  onChange={(e) => setCaffeineIntake(e.target.value)}
                  className="bg-transparent font-black text-slate-900 text-xs text-right"
                >
                  <option value="None">None</option>
                  <option value="Low">Low (1 cup)</option>
                  <option value="Normal">Normal (2-3 cups)</option>
                  <option value="High">High (4+ cups)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> Naps (per day)</span>
                <input
                  type="text"
                  value={napsPerDay}
                  onChange={(e) => setNapsPerDay(e.target.value)}
                  className="w-24 text-right font-black text-slate-900 bg-transparent border-b border-slate-300"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setGoalHours(goalMode === "recommended" ? 8.0 : customGoalHours);
              showNotification("Sleep goal & preferences updated!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Goal
          </button>
        </div>
      )}

      {/* SCREEN 4: BEDTIME ROUTINE */}
      {activeTab === "bedtime_routine" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Bedtime Routine</h2>
              <p className="text-xs text-slate-500">Your routine starts 1h before bedtime.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={routineEnabled}
                onChange={(e) => setRoutineEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Routine Steps</span>

            {routineSteps.map((step) => (
              <div
                key={step.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{step.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{step.title}</h4>
                    <p className="text-[10px] text-slate-500">{step.subtitle}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step.enabled}
                    onChange={() => {
                      setRoutineSteps((prev) =>
                        prev.map((s) => (s.id === step.id ? { ...s, enabled: !s.enabled } : s))
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Add Step */}
          <div className="p-3 bg-orange-50/50 border border-dashed border-orange-300 rounded-2xl flex items-center gap-2">
            <input
              type="text"
              placeholder="Step name (e.g. Listen to ambient music)"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              className="flex-1 bg-transparent text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newStepTitle.trim()) {
                  setRoutineSteps((prev) => [
                    ...prev,
                    {
                      id: `r-${Date.now()}`,
                      title: newStepTitle.trim(),
                      subtitle: newStepSubtitle,
                      icon: "✨",
                      enabled: true,
                    },
                  ]);
                  setNewStepTitle("");
                  showNotification("Routine step added!");
                }
              }}
              className="px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl"
            >
              + Add Step
            </button>
          </div>

          <button
            onClick={() => {
              showNotification("Bedtime routine saved!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Routine
          </button>
        </div>
      )}

      {/* SCREEN 5: REMINDERS SETUP */}
      {activeTab === "reminders" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Reminders</h2>
              <p className="text-xs text-slate-500">Automate your night & morning notifications.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">Reminder Pattern</span>
            <div className="grid grid-cols-3 gap-2">
              {(["smart", "fixed", "custom"] as const).map((pat) => (
                <button
                  key={pat}
                  onClick={() => setReminderPattern(pat)}
                  className={`py-2 rounded-2xl text-xs font-black capitalize transition-all cursor-pointer border ${
                    reminderPattern === pat
                      ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Care2Care will automatically adjust reminders based on your sleep schedule.
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Wind-down Reminder</span>
              <input
                type="text"
                value={windDownReminder}
                onChange={(e) => setWindDownReminder(e.target.value)}
                className="font-black text-slate-900 bg-transparent text-right w-24 border-b border-slate-300"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Bedtime Reminder</span>
              <input
                type="text"
                value={bedtimeReminder}
                onChange={(e) => setBedtimeReminder(e.target.value)}
                className="font-black text-slate-900 bg-transparent text-right w-24 border-b border-slate-300"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Wake-up Reminder</span>
              <input
                type="text"
                value={wakeUpReminder}
                onChange={(e) => setWakeUpReminder(e.target.value)}
                className="font-black text-slate-900 bg-transparent text-right w-24 border-b border-slate-300"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Snooze Duration</span>
              <select
                value={snoozeDuration}
                onChange={(e) => setSnoozeDuration(e.target.value)}
                className="font-black text-slate-900 bg-transparent text-right text-xs"
              >
                <option value="5 min">5 min</option>
                <option value="10 min">10 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              showNotification("Reminder settings saved!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Reminder Settings
          </button>
        </div>
      )}

      {/* SCREEN 6: SLEEP HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Sleep History</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-black">
              {(["Day", "Week", "Month", "Year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setHistoryRange(r)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    historyRange === r ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Month Header */}
          <div className="flex items-center justify-between px-2">
            <ChevronLeft className="w-5 h-5 text-slate-400 cursor-pointer" />
            <span className="text-sm font-black text-slate-900">May 2025</span>
            <ChevronRight className="w-5 h-5 text-slate-400 cursor-pointer" />
          </div>

          {/* Interactive Monthly Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {/* Empty days / trailing days */}
            {[28, 29, 30].map((d) => (
              <div key={`p-${d}`} className="p-2 text-slate-300 font-bold">{d}</div>
            ))}

            {/* Month Days 1-31 */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dateStr = `2025-05-${day.toString().padStart(2, "0")}`;
              const log = sleepLogs[dateStr];
              const isSelected = selectedDate === dateStr;

              let dotColor = "bg-transparent";
              if (log) {
                if (log.totalDurationMin >= 420) dotColor = "bg-emerald-500";
                else if (log.totalDurationMin >= 300) dotColor = "bg-amber-500";
                else dotColor = "bg-rose-500";
              }

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF5A36] text-white font-black shadow-xs"
                      : "hover:bg-orange-50 font-bold text-slate-700"
                  }`}
                >
                  <span>{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-500 pt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Good (≥ 7h)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Average (5–7h)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Poor (&lt; 5h)</span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg. Sleep</span>
              <p className="text-sm font-black text-slate-900">7h 08m</p>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Best Day</span>
              <p className="text-sm font-black text-slate-900">8h 45m</p>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Current Streak</span>
              <p className="text-sm font-black text-[#FF5A36]">12 Days</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 7: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Analytics</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-black">
              {(["7 Days", "30 Days", "90 Days", "Year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAnalyticsRange(r)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    analyticsRange === r ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Average Sleep</span>
              <p className="text-xl font-black text-slate-900">7h 12m</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase">Goal</span>
              <p className="text-sm font-black text-slate-700">8h 0m</p>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-2 pt-2">
            <div className="h-44 flex items-end justify-between gap-2 px-2 border-b border-slate-200 pb-2 relative">
              {/* 8h Goal Guideline */}
              <div className="absolute top-8 left-0 right-0 border-b border-dashed border-orange-400/80 z-0">
                <span className="text-[9px] font-bold text-orange-600 bg-white px-1 absolute right-2 -top-2">Goal: 8h</span>
              </div>

              {[
                { day: "Mon", hrs: 7.2 },
                { day: "Tue", hrs: 7.0 },
                { day: "Wed", hrs: 8.4 },
                { day: "Thu", hrs: 6.5 },
                { day: "Fri", hrs: 7.25 },
                { day: "Sat", hrs: 8.1 },
                { day: "Sun", hrs: 6.5 },
              ].map((bar) => {
                const heightPct = (bar.hrs / 10) * 100;
                return (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-1 z-10">
                    <div
                      className="w-full max-w-[28px] bg-gradient-to-t from-[#FF5A36] to-[#FFA07A] rounded-t-xl transition-all duration-700"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Efficiency Breakdown Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Efficiency</span>
              <p className="text-base font-black text-emerald-600">89%</p>
              <span className="text-[10px] text-slate-400">Good</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Deep Sleep</span>
              <p className="text-base font-black text-slate-900">1h 48m</p>
              <span className="text-[10px] text-slate-400">Healthy</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Awake</span>
              <p className="text-base font-black text-slate-900">18m</p>
              <span className="text-[10px] text-slate-400">REM Sleep</span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 8: SLEEP CALENDAR WITH RECORDED DURATION ON EACH CELL */}
      {activeTab === "calendar" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Sleep Calendar</h2>
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#FF5A36]" /> May 2025
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {/* Prior month days */}
            {[
              { day: 28, hrs: "7h 10m" },
              { day: 29, hrs: "6h 20m" },
              { day: 30, hrs: "7h 30m" },
            ].map((p) => (
              <div key={`cal-p-${p.day}`} className="p-1.5 text-slate-300 rounded-xl border border-transparent">
                <span className="font-bold">{p.day}</span>
                <span className="block text-[8px]">{p.hrs}</span>
              </div>
            ))}

            {/* Month days 1 to 31 with durations */}
            {[
              { day: 1, hrs: "6h 10m" },
              { day: 2, hrs: "8h 00m" },
              { day: 3, hrs: "7h 15m" },
              { day: 4, hrs: "6h 30m" },
              { day: 5, hrs: "7h 00m" },
              { day: 6, hrs: "6h 40m" },
              { day: 7, hrs: "7h 30m" },
              { day: 8, hrs: "8h 10m" },
              { day: 9, hrs: "7h 15m" },
              { day: 10, hrs: "6h 50m" },
              { day: 11, hrs: "6h 30m" },
              { day: 12, hrs: "7h 25m" },
              { day: 13, hrs: "7h 00m" },
              { day: 14, hrs: "7h 20m", highlight: true },
              { day: 15, hrs: "6h 45m" },
              { day: 16, hrs: "7h 10m" },
              { day: 17, hrs: "8h 05m" },
              { day: 18, hrs: "5h 50m" },
              { day: 19, hrs: "7h 00m" },
              { day: 20, hrs: "6h 30m" },
              { day: 21, hrs: "7h 25m" },
              { day: 22, hrs: "6h 20m" },
              { day: 23, hrs: "7h 40m" },
              { day: 24, hrs: "7h 05m" },
              { day: 25, hrs: "6h 40m" },
              { day: 26, hrs: "7h 30m" },
              { day: 27, hrs: "6h 55m" },
              { day: 28, hrs: "7h 10m" },
              { day: 29, hrs: "6h 45m" },
              { day: 30, hrs: "8h 10m" },
              { day: 31, hrs: "7h 05m" },
            ].map((cell) => (
              <button
                key={`cal-c-${cell.day}`}
                onClick={() => {
                  setSelectedDate(`2025-05-${cell.day.toString().padStart(2, "0")}`);
                  showNotification(`Selected May ${cell.day}: ${cell.hrs}`);
                }}
                className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                  cell.highlight
                    ? "bg-[#FF5A36] text-white border-[#FF5A36] font-black shadow-xs"
                    : "bg-slate-50 hover:bg-orange-50 border-slate-200/80 text-slate-700"
                }`}
              >
                <span className="font-black text-xs block">{cell.day}</span>
                <span className={`block text-[9px] font-bold ${cell.highlight ? "text-white" : "text-slate-500"}`}>
                  {cell.hrs}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-500 pt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Good (≥ 7h)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Average (5–7h)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Poor (&lt; 5h)</span>
          </div>
        </div>
      )}

      {/* SCREEN 9: INSIGHTS */}
      {activeTab === "insights" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Sleep Insights</h2>

          <div className="space-y-3">
            <div className="p-4 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Best Sleep</h4>
                <p className="text-xs text-slate-600">You slept the best on May 2: <span className="font-bold text-[#FF5A36]">8h 15m</span> with 95% efficiency.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Average Sleep</h4>
                <p className="text-xs text-slate-600">Your 30-day average is <span className="font-bold">7h 12m</span> (90% of your 8h goal).</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Deep Sleep</h4>
                <p className="text-xs text-slate-600">You get enough deep sleep: <span className="font-bold">1h 48m on average</span> per cycle.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Consistency</h4>
                <p className="text-xs text-slate-600">You maintain a consistent sleep schedule <span className="font-bold">78% of the time</span>.</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50/70 border border-orange-300 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Recommendation</h4>
                <p className="text-xs text-slate-700">Try to sleep 30 min earlier tonight for deeper slow-wave sleep & recovery.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 10: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Achievements</h2>

          <div className="space-y-3">
            {[
              { title: "First Good Night", desc: "Slept for 7+ hours", completed: true, badge: "🌟" },
              { title: "7-Day Consistency", desc: "Completed 7 days in a row", completed: true, badge: "🔥" },
              { title: "Early Bird", desc: "Woke up before 7 AM for 7 days", completed: true, badge: "🌅" },
              { title: "21-Day Challenge", desc: "Completed 21 days of good sleep", progress: "18/21", completed: false, badge: "🏆" },
              { title: "30-Day Champion", desc: "Complete 30 days", locked: true, badge: "🔒" },
              { title: "100-Day Legend", desc: "Complete 100 days", locked: true, badge: "🔒" },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.badge}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{m.title}</h4>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </div>
                </div>

                <div>
                  {m.completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {m.progress && <span className="text-xs font-black text-[#FF5A36] bg-orange-100 px-2 py-1 rounded-xl">{m.progress}</span>}
                  {m.locked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 11: SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Sleep Settings</h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Daily Sleep Goal</span>
              <span className="font-black text-slate-900">{goalHours}h 0m</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Sleep Schedule</span>
              <span className="font-black text-slate-900">10:30 PM – 6:30 AM</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Units</span>
              <span className="font-black text-slate-900">{units}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Reminders</span>
              <span className="font-black text-emerald-600">3 Active</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Bedtime Routine</span>
              <span className="font-black text-slate-900">{routineSteps.filter(s => s.enabled).length} Steps</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Notification Sound</span>
              <span className="font-black text-slate-900">{notificationSound}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Quiet Hours</span>
              <span className="font-black text-slate-900">{quietHours}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Sleep Stage Detection</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sleepStageDetection}
                  onChange={(e) => setSleepStageDetection(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => showNotification("Sleep data reset to default")}
              className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs hover:bg-rose-100 transition-colors"
            >
              Reset Sleep Data
            </button>
            <button
              onClick={() => showNotification("Hidden from home feed")}
              className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-200 transition-colors"
            >
              Hide from Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
