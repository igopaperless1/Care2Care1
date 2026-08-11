import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  Sparkles,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  History,
  Settings,
  Award,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Volume2,
  VolumeX,
  CheckCircle2,
  Trash2,
  Check,
  Download,
  Flame,
  Heart,
  Share2,
  Layers,
  ChevronRight,
  Wind,
  Smile,
  Moon,
  Sun,
  Zap,
  Music,
  Sliders,
  Feather,
  Info,
  Filter,
  Search,
  CheckSquare
} from "lucide-react";

interface YogaMeditationTrackerProps {
  patient: Patient;
  onLogSession?: (patientId: string, durationMins: number, type: string) => void;
}

export interface MeditationSessionLog {
  id: string;
  title: string;
  category: string; // "Meditation" | "Yoga" | "Breathing"
  durationMins: number;
  date: string;
  time: string;
  ambientSound?: string;
  notes?: string;
  rating?: number;
}

export interface YogaPose {
  id: string;
  sanskritName: string;
  englishName: string;
  category: "Beginner" | "Intermediate" | "Advanced";
  targetArea: string;
  benefits: string[];
  instructions: string[];
  cautions: string;
  imageUrl?: string;
}

export const YogaMeditationTracker: React.FC<YogaMeditationTrackerProps> = ({
  patient,
  onLogSession,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "tracker" | "timer" | "guided" | "yogaPoses" | "breathing" | "custom" | "history" | "analytics" | "achievements" | "settings"
  >("tracker");

  // Notifications & Reminders
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("07:30");
  const [activeAlert, setActiveAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>(
    "🧘 Morning Zen: Time for your 10-minute mindfulness session!"
  );

  // Settings State
  const [defaultDuration, setDefaultDuration] = useState<number>(10);
  const [selectedAmbientSound, setSelectedAmbientSound] = useState<string>("Rain & Forest");
  const [soundVolume, setSoundVolume] = useState<number>(80);

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // 10 mins initial
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(600);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string>("Mindful Breathing");
  const [activeSessionCategory, setActiveSessionCategory] = useState<string>("Meditation");
  const [timerNotes, setTimerNotes] = useState<string>("");

  // Breathing Exercise State
  const [isBreathingRunning, setIsBreathingRunning] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [breathingPhaseSeconds, setBreathingPhaseSeconds] = useState<number>(4);
  const [breathingRounds, setBreathingRounds] = useState<number>(0);
  const [selectedBreathingType, setSelectedBreathingType] = useState<string>("4-7-8 Calm");

  // Custom Builder Form State
  const [formTitle, setFormTitle] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Meditation");
  const [formDuration, setFormDuration] = useState<number>(15);
  const [formDifficulty, setFormDifficulty] = useState<string>("All Levels");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formSteps, setFormSteps] = useState<string>("Sit comfortably, Close your eyes, Deep breathing");

  // Local Session Logs
  const [logs, setLogs] = useState<MeditationSessionLog[]>([
    {
      id: "y1",
      title: "Morning Zen Meditation",
      category: "Meditation",
      durationMins: 10,
      date: new Date().toISOString().split("T")[0],
      time: "07:30 AM",
      ambientSound: "Rain & Forest",
      notes: "Felt very calm and relaxed after waking up.",
      rating: 5,
    },
    {
      id: "y2",
      title: "Sun Salutation Yoga Flow",
      category: "Yoga",
      durationMins: 15,
      date: new Date().toISOString().split("T")[0],
      time: "08:00 AM",
      ambientSound: "Soft Singing Bowls",
      notes: "Stretched spine and hamstrings gently.",
      rating: 5,
    },
    {
      id: "y3",
      title: "4-7-8 Breathing De-stress",
      category: "Breathing",
      durationMins: 5,
      date: new Date().toISOString().split("T")[0],
      time: "02:15 PM",
      ambientSound: "Ocean Waves",
      notes: "Quick afternoon focus break.",
      rating: 4,
    },
  ]);

  // Search & Filters
  const [guidedCategoryFilter, setGuidedCategoryFilter] = useState<string>("All");
  const [poseLevelFilter, setPoseLevelFilter] = useState<string>("All");

  // Global Feedback
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            showFeedback("Session complete! Great job taking care of your mind.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Breathing Circle Animation Effect
  useEffect(() => {
    let bInterval: any = null;
    if (isBreathingRunning) {
      bInterval = setInterval(() => {
        setBreathingPhaseSeconds((prev) => {
          if (prev <= 1) {
            if (breathingPhase === "Inhale") {
              setBreathingPhase("Hold");
              return 7;
            } else if (breathingPhase === "Hold") {
              setBreathingPhase("Exhale");
              return 8;
            } else {
              setBreathingPhase("Inhale");
              setBreathingRounds((r) => r + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(bInterval);
    }
    return () => clearInterval(bInterval);
  }, [isBreathingRunning, breathingPhase]);

  // Handlers
  const handleStartPresetTimer = (title: string, mins: number, category: string = "Meditation") => {
    setActiveSessionTitle(title);
    setTotalSessionSeconds(mins * 60);
    setTimerSeconds(mins * 60);
    setActiveSessionCategory(category);
    setIsTimerRunning(true);
    setActiveTab("timer");
    showFeedback(`Started ${mins}-minute session: "${title}"`);
  };

  const handleSaveSession = () => {
    const elapsedMins = Math.max(1, Math.round((totalSessionSeconds - timerSeconds) / 60));
    const newEntry: MeditationSessionLog = {
      id: `y-${Date.now()}`,
      title: activeSessionTitle,
      category: activeSessionCategory,
      durationMins: elapsedMins,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ambientSound: selectedAmbientSound,
      notes: timerNotes || "Completed session",
      rating: 5,
    };

    setLogs([newEntry, ...logs]);
    if (onLogSession) onLogSession(patient.id, elapsedMins, activeSessionCategory);
    showFeedback(`Saved ${elapsedMins} mins of ${activeSessionCategory} ("${activeSessionTitle}")!`);

    setIsTimerRunning(false);
    setTimerNotes("");
    setActiveTab("tracker");
  };

  const handleCustomSubmit = () => {
    if (!formTitle.trim()) {
      showFeedback("Please enter a Session Title!");
      return;
    }
    handleStartPresetTimer(formTitle, formDuration, formCategory);
  };

  // Aggregated Stats
  const totalMinutesToday = logs.reduce((acc, curr) => acc + curr.durationMins, 0);
  const totalSessionsCount = logs.length;
  const meditationStreakDays = 5;

  // Yoga Poses Library Data
  const yogaPosesData: YogaPose[] = [
    {
      id: "p1",
      sanskritName: "Tadasana",
      englishName: "Mountain Pose",
      category: "Beginner",
      targetArea: "Full Body Posture",
      benefits: ["Improves posture", "Strengthens thighs and knees", "Relieves tension"],
      instructions: [
        "Stand with feet together, weight distributed evenly.",
        "Engage thighs, draw in abdomen, align spine straight.",
        "Breathe deeply and hold for 30-60 seconds.",
      ],
      cautions: "Avoid if experiencing dizziness or low blood pressure.",
    },
    {
      id: "p2",
      sanskritName: "Adho Mukha Svanasana",
      englishName: "Downward-Facing Dog",
      category: "Beginner",
      targetArea: "Hamstrings, Calves & Shoulders",
      benefits: ["Energizes the body", "Stretches shoulders & hamstrings", "Calms brain"],
      instructions: [
        "Start on hands and knees.",
        "Lift hips up and back forming an inverted V shape.",
        "Press palms flat, pedal heels gently.",
      ],
      cautions: "Caution with wrist injuries or high blood pressure.",
    },
    {
      id: "p3",
      sanskritName: "Virabhadrasana I",
      englishName: "Warrior I",
      category: "Intermediate",
      targetArea: "Legs, Core & Chest",
      benefits: ["Builds stamina", "Opens chest and lungs", "Strengthens legs"],
      instructions: [
        "Step one foot back 3-4 feet, rotate back foot 45 degrees.",
        "Bend front knee over ankle.",
        "Raise arms overhead, gaze forward.",
      ],
      cautions: "Careful with knee alignment.",
    },
    {
      id: "p4",
      sanskritName: "Balasana",
      englishName: "Child's Pose",
      category: "Beginner",
      targetArea: "Hips, Thighs & Lower Back",
      benefits: ["Deeply relaxing", "Relieves back strain", "Calms nervous system"],
      instructions: [
        "Kneel on floor, touch big toes together, sit on heels.",
        "Exhale and fold torso down between thighs.",
        "Extend arms forward or rest alongside body.",
      ],
      cautions: "Pregnancy or knee injury.",
    },
    {
      id: "p5",
      sanskritName: "Vrksasana",
      englishName: "Tree Pose",
      category: "Intermediate",
      targetArea: "Balance, Ankles & Core",
      benefits: ["Improves balance & focus", "Strengthens ankles and calves"],
      instructions: [
        "Shift weight to left foot.",
        "Place right sole on inner left thigh or calf (avoid knee).",
        "Bring hands to prayer position at chest.",
      ],
      cautions: "Use wall support if balance is unsteady.",
    },
  ];

  // Guided Sessions Library
  const guidedSessions = [
    { title: "Morning Zen & Energy", mins: 10, category: "Morning", bg: "from-amber-500 to-orange-600", desc: "Awaken your body and set positive intentions for the day." },
    { title: "Deep Stress Relief", mins: 15, category: "Stress", bg: "from-teal-600 to-emerald-700", desc: "Release mental tightness and physical shoulder tension." },
    { title: "Restful Sleep & Unwind", mins: 20, category: "Sleep", bg: "from-indigo-600 to-purple-800", desc: "Soothing guided body scan to prepare your mind for deep sleep." },
    { title: "Laser Focus & Clarity", mins: 10, category: "Focus", bg: "from-cyan-600 to-blue-700", desc: "Re-center your concentration for work or care tasks." },
    { title: "Loving Kindness Meditation", mins: 12, category: "Mindfulness", bg: "from-pink-500 to-rose-600", desc: "Cultivate compassion towards yourself and loved ones." },
    { title: "Gentle Chair Yoga Stretch", mins: 15, category: "Yoga", bg: "from-emerald-600 to-teal-800", desc: "Easy seated stretches to loosen tight joints and back." },
  ];

  const filteredSessions = guidedSessions.filter((s) => guidedCategoryFilter === "All" || s.category === guidedCategoryFilter);
  const filteredPoses = yogaPosesData.filter((p) => poseLevelFilter === "All" || p.category === poseLevelFilter);

  // Format Timer Display
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Navigation Sub-Menu Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md">
              <Smile className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Yoga & Meditation Tracker
                </h1>
                <span className="text-[10px] font-black bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Mindfulness, Guided Flows, Poses & Breathing</p>
            </div>
          </div>

          {/* Test Alert Button */}
          <button
            onClick={() => {
              setActiveAlert(true);
              setAlertMsg("🧘 Daily Mindfulness Alert: Time to take a 5-minute breather!");
            }}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-[#2E7D32]/30 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Simulate Reminder Alert"
          >
            <Bell className="w-4 h-4 text-[#2E7D32] animate-bounce" />
            <span className="hidden sm:inline">Test Alert</span>
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "tracker" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Smile className="w-3.5 h-3.5" /> Home
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "timer" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Clock className="w-3.5 h-3.5" /> Timer
          </button>
          <button
            onClick={() => setActiveTab("guided")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "guided" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Feather className="w-3.5 h-3.5" /> Guided
          </button>
          <button
            onClick={() => setActiveTab("yogaPoses")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "yogaPoses" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Layers className="w-3.5 h-3.5" /> Poses
          </button>
          <button
            onClick={() => setActiveTab("breathing")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "breathing" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Wind className="w-3.5 h-3.5" /> Breathing
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "custom" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Custom
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "history" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <History className="w-3.5 h-3.5" /> Log
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "achievements" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Award className="w-3.5 h-3.5" /> Badges
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-teal-700 font-black">✕</button>
        </div>
      )}

      {/* Active Reminder Alert Banner Simulator */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-3xl p-4 shadow-xl border border-teal-300 relative overflow-hidden animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
                🧘
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-white" /> {alertMsg}
                </h3>
                <p className="text-[11px] text-teal-100 font-medium">
                  Ambient: {selectedAmbientSound} • Volume: {soundVolume}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveAlert(false)}
              className="text-white/80 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/20">
            <button
              onClick={() => {
                handleStartPresetTimer("Quick Breather", 5, "Meditation");
                setActiveAlert(false);
              }}
              className="flex-1 py-2 bg-white text-teal-950 font-black rounded-xl text-xs shadow-xs hover:bg-teal-50 cursor-pointer text-center"
            >
              🧘 Start 5-Min Session Now
            </button>
            <button
              onClick={() => {
                showFeedback("Mindfulness alert snoozed for 15 minutes.");
                setActiveAlert(false);
              }}
              className="px-3 py-2 bg-teal-800/60 hover:bg-teal-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              ⏰ Snooze 15m
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: MAIN TODAY'S OVERVIEW ==================== */}
      {activeTab === "tracker" && (
        <div className="space-y-4">
          {/* Main Hero Mindfulness Card */}
          <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-sm border border-[#2E7D32]/20 border-l-4 border-l-[#2E7D32] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold tracking-wider text-[#2E7D32] uppercase">TODAY'S MINDFULNESS PRACTICE</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{totalMinutesToday}</span>
                  <span className="text-sm sm:text-base font-bold text-slate-500">mins practiced</span>
                </div>
                <p className="text-xs text-slate-500 font-bold pt-1">
                  {totalSessionsCount} session(s) completed • {meditationStreakDays} day streak 🔥
                </p>
              </div>

              {/* Lotus Visual Graphic */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-xs">
                🧘‍♀️
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-xs font-extrabold text-teal-100 mb-2">Quick Start Duration:</p>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleStartPresetTimer(`Mindful Meditation (${m}m)`, m)}
                    className="py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black transition-all cursor-pointer text-center backdrop-blur-2xs"
                  >
                    ⏱️ {m} Mins
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Mini Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-teal-50/80 border border-teal-100 rounded-2xl p-3 text-center shadow-2xs">
              <Clock className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{totalMinutesToday} m</div>
              <p className="text-[9px] font-black tracking-wider text-teal-700 uppercase">MINUTES TODAY</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 text-center shadow-2xs">
              <Smile className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{totalSessionsCount}</div>
              <p className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">SESSIONS</p>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3 text-center shadow-2xs">
              <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{meditationStreakDays} Days</div>
              <p className="text-[9px] font-black tracking-wider text-amber-700 uppercase">STREAK</p>
            </div>
          </div>

          {/* Quick Guided Sessions Preview */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-teal-600" /> Featured Guided Sessions
              </h3>
              <button onClick={() => setActiveTab("guided")} className="text-xs font-bold text-teal-600 hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guidedSessions.slice(0, 4).map((s, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-r ${s.bg} p-3.5 rounded-2xl text-white shadow-xs flex items-center justify-between`}
                >
                  <div>
                    <h4 className="font-extrabold text-xs">{s.title}</h4>
                    <p className="text-[10px] text-white/80 font-medium">
                      {s.mins} mins • {s.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartPresetTimer(s.title, s.mins, s.category)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Log History */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-teal-600" /> Today's Sessions ({logs.length})
              </h3>
              <button onClick={() => setActiveTab("history")} className="text-xs font-bold text-teal-600 hover:underline">
                Full Log
              </button>
            </div>

            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                      🧘
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs">{log.title}</span>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {log.time} • {log.durationMins} mins • {log.category} {log.notes ? `• ${log.notes}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLogs(logs.filter((l) => l.id !== log.id));
                      showFeedback("Deleted session log.");
                    }}
                    className="text-slate-400 hover:text-rose-600 font-black p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LIVE MEDITATION TIMER ==================== */}
      {activeTab === "timer" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">{activeSessionTitle}</h2>
              <p className="text-[10px] text-slate-500 font-medium">Ambient: {selectedAmbientSound} • Category: {activeSessionCategory}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${isTimerRunning ? "bg-teal-100 text-teal-800 animate-pulse" : "bg-slate-100 text-slate-600"}`}>
              {isTimerRunning ? "● Active" : "Paused"}
            </span>
          </div>

          {/* Animated Circle Breathing Timer */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              {/* Outer Pulsing Aura */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-teal-400/30 transition-all duration-1000 ${isTimerRunning ? "scale-110 opacity-100 animate-ping" : "scale-100 opacity-30"}`}
              />
              <div className="w-36 h-36 rounded-full border-4 border-teal-500 flex flex-col items-center justify-center bg-slate-900 shadow-inner">
                <span className="text-3xl font-black font-mono tracking-tight text-teal-300">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[10px] font-extrabold text-teal-200 uppercase tracking-widest mt-1">
                  REMAINING
                </span>
              </div>
            </div>

            {/* Ambient Sound Dropdown */}
            <div className="max-w-xs mx-auto flex items-center justify-center gap-2 text-xs">
              <Music className="w-4 h-4 text-teal-400" />
              <select
                value={selectedAmbientSound}
                onChange={(e) => setSelectedAmbientSound(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-teal-200 text-xs font-bold rounded-xl p-2"
              >
                <option value="Rain & Forest">🌧️ Rain & Forest</option>
                <option value="Ocean Waves">🌊 Ocean Waves</option>
                <option value="Soft Singing Bowls">🥣 Singing Bowls</option>
                <option value="Night Crickets">🌙 Night Crickets</option>
                <option value="Silent Meditation">🤫 Silent</option>
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Start Practice
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Pause className="w-4 h-4 fill-white" /> Pause Session
              </button>
            )}

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(totalSessionSeconds);
                showFeedback("Reset timer.");
              }}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <button
              onClick={handleSaveSession}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Check className="w-4 h-4" /> Finish & Save
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">Session Reflections / Notes</label>
            <textarea
              rows={2}
              placeholder="How did you feel during this session? e.g., Felt calmer, loose shoulders..."
              value={timerNotes}
              onChange={(e) => setTimerNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
            />
          </div>
        </div>
      )}

      {/* ==================== TAB 3: GUIDED SESSIONS LIBRARY ==================== */}
      {activeTab === "guided" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Guided Meditation & Audio Library</h2>
              <p className="text-[10px] text-slate-500 font-medium">Select a curated mindfulness guide tailored to your goal</p>
            </div>
            <Feather className="w-5 h-5 text-teal-600" />
          </div>

          {/* Category Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold gap-1 overflow-x-auto scrollbar-none">
            {["All", "Morning", "Stress", "Sleep", "Focus", "Mindfulness", "Yoga"].map((cat) => (
              <button
                key={cat}
                onClick={() => setGuidedCategoryFilter(cat)}
                className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${guidedCategoryFilter === cat ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sessions List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSessions.map((s, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-900">{s.title}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-900 font-extrabold px-2 py-0.5 rounded-full">
                      {s.mins} mins
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium pt-1">{s.desc}</p>
                </div>

                <button
                  onClick={() => handleStartPresetTimer(s.title, s.mins, s.category)}
                  className="w-full mt-2 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Start Guided Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: YOGA POSES LIBRARY ==================== */}
      {activeTab === "yogaPoses" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Yoga Asana & Poses Directory</h2>
              <p className="text-[10px] text-slate-500 font-medium">Sanskrit & English names, benefits and step instructions</p>
            </div>
            <Layers className="w-5 h-5 text-teal-600" />
          </div>

          {/* Filter Level */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold gap-1">
            {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setPoseLevelFilter(lvl)}
                className={`flex-1 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${poseLevelFilter === lvl ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Poses List */}
          <div className="space-y-3">
            {filteredPoses.map((pose) => (
              <div key={pose.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{pose.englishName}</h3>
                    <p className="text-[11px] text-teal-700 font-extrabold italic">{pose.sanskritName}</p>
                  </div>
                  <span className="text-[10px] bg-teal-50 border border-teal-200 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">
                    {pose.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 font-bold">Target: {pose.targetArea}</p>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <strong className="text-slate-800 block font-bold">Benefits:</strong>
                  <ul className="list-disc list-inside text-slate-600 font-medium space-y-0.5">
                    {pose.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-[11px]">
                  <strong className="text-emerald-950 block font-bold">Step Instructions:</strong>
                  <ol className="list-decimal list-inside text-slate-700 font-medium space-y-0.5">
                    {pose.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BREATHING EXERCISES ==================== */}
      {activeTab === "breathing" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Breathing Exercises & Pranayama</h2>
              <p className="text-[10px] text-slate-500 font-medium">Visual pace guide for 4-7-8, Box Breathing & Nadi Shodhana</p>
            </div>
            <Wind className="w-5 h-5 text-teal-600" />
          </div>

          {/* Animated Breath Visual Guide */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 text-center space-y-3 relative overflow-hidden border border-slate-800 shadow-xl">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">{selectedBreathingType}</span>

            {/* Expanding Circle */}
            <div className="w-36 h-36 mx-auto rounded-full bg-teal-500/20 border-4 border-teal-400 flex flex-col items-center justify-center transition-all duration-700 shadow-inner">
              <span className="text-2xl font-black text-teal-200">{breathingPhase}</span>
              <span className="text-3xl font-black text-white font-mono mt-1">{breathingPhaseSeconds}s</span>
            </div>

            <p className="text-xs text-slate-300 font-medium">Completed Rounds: {breathingRounds}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isBreathingRunning ? (
              <button
                onClick={() => setIsBreathingRunning(true)}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Start Breathing Guide
              </button>
            ) : (
              <button
                onClick={() => setIsBreathingRunning(false)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Pause className="w-4 h-4 fill-white" /> Pause Breathing
              </button>
            )}

            <button
              onClick={() => {
                setIsBreathingRunning(false);
                setBreathingPhase("Inhale");
                setBreathingPhaseSeconds(4);
                setBreathingRounds(0);
                showFeedback("Reset breathing session.");
              }}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: CUSTOM BUILDER ==================== */}
      {activeTab === "custom" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Build Custom Session</h2>
              <p className="text-[10px] text-slate-500 font-medium">Create custom timers, steps and ambient sounds</p>
            </div>
            <button onClick={() => setActiveTab("tracker")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-extrabold text-slate-800 block text-xs mb-1">Session Title *</label>
              <input
                type="text"
                placeholder="e.g., Evening Gratitude & Stretch"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Meditation">Meditation</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Breathing">Breathing</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={formDuration}
                  onChange={(e) => setFormDuration(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs text-center"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Steps / Guidance Points (Comma separated)</label>
              <textarea
                rows={3}
                placeholder="Sit comfortably, Close eyes, Inhale deeply..."
                value={formSteps}
                onChange={(e) => setFormSteps(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <button
              onClick={handleCustomSubmit}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              <Play className="w-4 h-4 fill-white" /> Start Custom Session
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: HISTORY & LOGS ==================== */}
      {activeTab === "history" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Session History Reports</h2>
              <p className="text-[10px] text-slate-500 font-medium">Export mindfulness practice logs to PDF or CSV</p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => showFeedback("Exported Session History to PDF!")}
                className="p-2 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => showFeedback("Exported Session Data to CSV!")}
                className="p-2 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {log.title} ({log.durationMins} mins)
                  </span>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {log.date} at {log.time} • Ambient: {log.ambientSound || "None"} {log.notes ? `• ${log.notes}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLogs(logs.filter((l) => l.id !== log.id));
                    showFeedback("Deleted entry.");
                  }}
                  className="text-rose-500 font-bold text-xs p-1 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 8: ANALYTICS & AI INSIGHTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Mindfulness Analytics</h2>
              <p className="text-[10px] text-slate-500 font-medium">Weekly minutes, session breakdown & Gemini AI insights</p>
            </div>
            <Sparkles className="w-5 h-5 text-teal-600" />
          </div>

          {/* Gemini AI Recommendation Box */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-teal-900">
              <Sparkles className="w-4 h-4 text-teal-600" /> Gemini AI Wellness Insight
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your 10-minute morning meditation sessions significantly improve focus for the first 4 hours of the day. Consider adding 5 minutes of gentle yoga stretching in the evening to improve sleep quality."
            </p>
          </div>
        </div>
      )}

      {/* ==================== TAB 9: ACHIEVEMENTS & BADGES ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Mindfulness Badges & Streaks</h2>
              <p className="text-[10px] text-slate-500 font-medium">Earn badges for consistent practice</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "🧘 First Zen", desc: "Log your first session", unlocked: true },
              { name: "🔥 5-Day Streak", desc: "5 consecutive days", unlocked: true },
              { name: "🏆 100 Minutes", desc: "Reach 100 mins total", unlocked: false },
              { name: "🌟 Zen Master", desc: "30 consecutive days", unlocked: false },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-center space-y-1 ${badge.unlocked ? "bg-amber-50/80 border-amber-200 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"}`}
              >
                <div className="text-2xl">{badge.name.split(" ")[0]}</div>
                <h4 className="font-extrabold text-xs">{badge.name}</h4>
                <p className="text-[10px] font-medium">{badge.desc}</p>
                <span className="text-[9px] font-black uppercase tracking-wider block pt-1">
                  {badge.unlocked ? "Unlocked ✅" : "Locked 🔒"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 10: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Yoga & Meditation Settings</h2>
              <p className="text-[10px] text-slate-500 font-medium">Reminders, default durations and sound presets</p>
            </div>
            <Settings className="w-5 h-5 text-slate-600" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="font-extrabold text-slate-800 text-xs block">Daily Reminder Alert</span>
                <span className="text-[10px] text-slate-500 font-medium">Notify me to practice daily</span>
              </div>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <button
              onClick={() => showFeedback("Settings saved successfully!")}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
