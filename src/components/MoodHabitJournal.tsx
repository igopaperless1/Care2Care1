import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  Smile,
  Frown,
  Meh,
  Heart,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  History,
  Settings,
  Award,
  BarChart3,
  Bell,
  Camera,
  Upload,
  Sparkles,
  Download,
  Trash2,
  Check,
  Volume2,
  FileText,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  Zap,
  Filter,
  CheckSquare,
  XCircle,
  HelpCircle,
  Smartphone,
  Shield,
  Target,
  Flame,
  X,
  Edit2,
  Share2,
  TrendingUp,
  Sliders,
  Feather,
  Lock,
  Mic,
  Moon,
  Sun,
  Coffee,
  Activity,
  ThumbsUp,
  Brain
} from "lucide-react";

interface MoodHabitJournalProps {
  patient: Patient;
  onLogMood?: (patientId: string, emotion: string, intensity: number) => void;
  onCheckHabit?: (patientId: string, habitId: string) => void;
}

export interface MoodEntry {
  id: string;
  emotion: string; // "Happy" | "Calm" | "Neutral" | "Anxious" | "Sad" | "Angry" | "Tired" | "Grateful"
  emoji: string;
  intensity: number; // 1-10
  triggers: string[];
  notes: string;
  date: string;
  time: string;
  location?: string;
  withWhom?: string;
  photoUrl?: string;
  color: string;
}

export interface HabitEntry {
  id: string;
  name: string;
  type: "Good" | "Bad";
  category: string;
  frequency: string;
  targetCount: number;
  completedToday: boolean;
  streakDays: number;
  bestStreak: number;
  notes?: string;
  icon: string;
  color: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  linkedMood?: string;
  tags: string[];
  photoUrl?: string;
  privacy: "Private" | "Shared" | "Public";
  isAiGenerated?: boolean;
}

export interface ScreenTimeApp {
  id: string;
  appName: string;
  category: string;
  usedMins: number;
  limitMins: number;
  icon: string;
  isBlocked: boolean;
}

export const MoodHabitJournal: React.FC<MoodHabitJournalProps> = ({
  patient,
  onLogMood,
  onCheckHabit,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "tracker" | "moodForm" | "habits" | "badHabits" | "habitForm" | "journal" | "journalForm" | "screenTime" | "detox" | "history" | "analytics" | "achievements" | "settings"
  >("tracker");

  // Notifications & Reminders
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("20:30");
  const [activeAlert, setActiveAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>(
    "😊 Evening Reflection: How are you feeling right now? Take a quick mood check-in!"
  );

  // Global Feedback
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // ==================== STATE: MOOD LOGS ====================
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([
    {
      id: "m1",
      emotion: "Happy",
      emoji: "😊",
      intensity: 8,
      triggers: ["Exercise", "Family", "Health"],
      notes: "Had a great morning walk in the park with sunny weather.",
      date: new Date().toISOString().split("T")[0],
      time: "09:30 AM",
      location: "Central Park",
      withWhom: "Family",
      color: "bg-emerald-500",
    },
    {
      id: "m2",
      emotion: "Calm",
      emoji: "😌",
      intensity: 9,
      triggers: ["Meditation", "Sleep"],
      notes: "Felt very peaceful after doing 10 mins of breathing exercises.",
      date: new Date().toISOString().split("T")[0],
      time: "02:00 PM",
      location: "Home",
      withWhom: "Alone",
      color: "bg-cyan-500",
    },
    {
      id: "m3",
      emotion: "Anxious",
      emoji: "😟",
      intensity: 5,
      triggers: ["Work", "News/Social"],
      notes: "Work deadlines felt slightly overwhelming in the afternoon.",
      date: new Date().toISOString().split("T")[0],
      time: "05:15 PM",
      location: "Office",
      withWhom: "Colleagues",
      color: "bg-amber-500",
    },
  ]);

  // Mood Check-in Form State
  const [selectedEmotion, setSelectedEmotion] = useState<{ name: string; emoji: string; color: string }>({
    name: "Happy",
    emoji: "😊",
    color: "bg-emerald-500",
  });
  const [formIntensity, setFormIntensity] = useState<number>(7);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(["Health", "Exercise"]);
  const [formMoodNotes, setFormMoodNotes] = useState<string>("");
  const [formLocation, setFormLocation] = useState<string>("Home");
  const [formWithWhom, setFormWithWhom] = useState<string>("Family");
  const [formMoodPhoto, setFormMoodPhoto] = useState<string | null>(null);

  // Available Emotions List
  const availableEmotions = [
    { name: "Happy", emoji: "😊", color: "bg-emerald-500", border: "border-emerald-300 text-emerald-800 bg-emerald-50" },
    { name: "Calm", emoji: "😌", color: "bg-cyan-500", border: "border-cyan-300 text-cyan-800 bg-cyan-50" },
    { name: "Grateful", emoji: "🤗", color: "bg-teal-500", border: "border-teal-300 text-teal-800 bg-teal-50" },
    { name: "Excited", emoji: "😍", color: "bg-pink-500", border: "border-pink-300 text-pink-800 bg-pink-50" },
    { name: "Neutral", emoji: "😐", color: "bg-slate-400", border: "border-slate-300 text-slate-800 bg-slate-50" },
    { name: "Anxious", emoji: "😟", color: "bg-amber-500", border: "border-amber-300 text-amber-800 bg-amber-50" },
    { name: "Tired", emoji: "🥱", color: "bg-indigo-400", border: "border-indigo-300 text-indigo-800 bg-indigo-50" },
    { name: "Sad", emoji: "😢", color: "bg-blue-500", border: "border-blue-300 text-blue-800 bg-blue-50" },
    { name: "Angry", emoji: "😡", color: "bg-rose-500", border: "border-rose-300 text-rose-800 bg-rose-50" },
  ];

  const triggerOptions = ["Work", "Relationships", "Health", "Finance", "Family", "Social", "Exercise", "Sleep", "Weather", "Food/Diet"];

  // ==================== STATE: HABITS ====================
  const [habits, setHabits] = useState<HabitEntry[]>([
    {
      id: "h1",
      name: "Drink 2.5L Water",
      type: "Good",
      category: "Health",
      frequency: "Daily",
      targetCount: 1,
      completedToday: true,
      streakDays: 7,
      bestStreak: 12,
      icon: "💧",
      color: "bg-cyan-500",
    },
    {
      id: "h2",
      name: "Walk 10,000 Steps",
      type: "Good",
      category: "Fitness",
      frequency: "Daily",
      targetCount: 1,
      completedToday: true,
      streakDays: 5,
      bestStreak: 10,
      icon: "🚶",
      color: "bg-emerald-500",
    },
    {
      id: "h3",
      name: "10-Min Meditation",
      type: "Good",
      category: "Mental",
      frequency: "Daily",
      targetCount: 1,
      completedToday: false,
      streakDays: 4,
      bestStreak: 8,
      icon: "🧘",
      color: "bg-teal-500",
    },
    {
      id: "h4",
      name: "Read 15 Pages",
      type: "Good",
      category: "Personal",
      frequency: "Daily",
      targetCount: 1,
      completedToday: false,
      streakDays: 2,
      bestStreak: 6,
      icon: "📖",
      color: "bg-purple-500",
    },
    {
      id: "h5",
      name: "No Junk Food",
      type: "Bad",
      category: "Health",
      frequency: "Daily",
      targetCount: 1,
      completedToday: true,
      streakDays: 6,
      bestStreak: 14,
      icon: "🍔",
      color: "bg-amber-500",
      notes: "Avoiding processed sugary snacks after 8 PM",
    },
    {
      id: "h6",
      name: "Limit Social Media < 45m",
      type: "Bad",
      category: "Mental",
      frequency: "Daily",
      targetCount: 1,
      completedToday: false,
      streakDays: 3,
      bestStreak: 9,
      icon: "📱",
      color: "bg-rose-500",
      notes: "Keep phone away during meal times",
    },
  ]);

  // Habit Form State
  const [formHabitName, setFormHabitName] = useState<string>("");
  const [formHabitType, setFormHabitType] = useState<"Good" | "Bad">("Good");
  const [formHabitCategory, setFormHabitCategory] = useState<string>("Health");
  const [formHabitFrequency, setFormHabitFrequency] = useState<string>("Daily");
  const [formHabitNotes, setFormHabitNotes] = useState<string>("");
  const [formHabitIcon, setFormHabitIcon] = useState<string>("🎯");

  // ==================== STATE: JOURNALS ====================
  const [journals, setJournals] = useState<JournalEntry[]>([
    {
      id: "j1",
      title: "Reflections on a Peaceful Sunday",
      content: "Started the day with a gentle walk in nature. Spent quality time with family over lunch and finished reading a great chapter on mindfulness.",
      date: new Date().toISOString().split("T")[0],
      time: "08:30 PM",
      linkedMood: "Happy 😊",
      tags: ["gratitude", "weekend", "nature"],
      privacy: "Private",
    },
    {
      id: "j2",
      title: "Mid-week Progress & Energy Check",
      content: "Felt very productive today at work. Managed to hit my daily step goal and drink enough water. Keeping the momentum going!",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      time: "09:00 PM",
      linkedMood: "Calm 😌",
      tags: ["productivity", "health"],
      privacy: "Private",
    },
  ]);

  // Journal Form State
  const [formJournalTitle, setFormJournalTitle] = useState<string>("");
  const [formJournalContent, setFormJournalContent] = useState<string>("");
  const [formJournalTags, setFormJournalTags] = useState<string>("reflection, mindfulness");
  const [formJournalPrivacy, setFormJournalPrivacy] = useState<"Private" | "Shared" | "Public">("Private");
  const [formJournalPhoto, setFormJournalPhoto] = useState<string | null>(null);

  // ==================== STATE: SCREEN TIME & DETOX ====================
  const [screenTimeApps, setScreenTimeApps] = useState<ScreenTimeApp[]>([
    { id: "a1", appName: "Social Media Feed", category: "Entertainment", usedMins: 42, limitMins: 45, icon: "💬", isBlocked: false },
    { id: "a2", appName: "Video Streaming", category: "Entertainment", usedMins: 55, limitMins: 60, icon: "📺", isBlocked: false },
    { id: "a3", appName: "Casual Games", category: "Gaming", usedMins: 20, limitMins: 30, icon: "🎮", isBlocked: false },
    { id: "a4", appName: "Health & Care2Care", category: "Health", usedMins: 25, limitMins: 120, icon: "🏥", isBlocked: false },
  ]);

  const [focusModeActive, setFocusModeActive] = useState<boolean>(false);
  const totalScreenTimeMins = screenTimeApps.reduce((acc, curr) => acc + curr.usedMins, 0);

  // Digital Detox Plan
  const [detoxTitle, setDetoxTitle] = useState<string>("Sunday Evening Digital Silence");
  const [detoxType, setDetoxType] = useState<string>("No Phone After 9 PM");
  const [detoxActive, setDetoxActive] = useState<boolean>(false);

  // ==================== HANDLERS ====================
  const handleSaveMood = (andAnother: boolean = false) => {
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      emotion: selectedEmotion.name,
      emoji: selectedEmotion.emoji,
      intensity: formIntensity,
      triggers: selectedTriggers,
      notes: formMoodNotes || "Recorded check-in",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: formLocation,
      withWhom: formWithWhom,
      photoUrl: formMoodPhoto || undefined,
      color: selectedEmotion.color,
    };

    setMoodLogs([newEntry, ...moodLogs]);
    if (onLogMood) onLogMood(patient.id, selectedEmotion.name, formIntensity);
    showFeedback(`Logged mood: ${selectedEmotion.emoji} ${selectedEmotion.name} (Level ${formIntensity}/10)!`);

    if (andAnother) {
      setFormMoodNotes("");
      setFormMoodPhoto(null);
    } else {
      setActiveTab("tracker");
    }
  };

  const handleToggleHabit = (id: string) => {
    setHabits(
      habits.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          const nextStreak = nextCompleted ? h.streakDays + 1 : Math.max(0, h.streakDays - 1);
          return {
            ...h,
            completedToday: nextCompleted,
            streakDays: nextStreak,
            bestStreak: Math.max(h.bestStreak, nextStreak),
          };
        }
        return h;
      })
    );
    if (onCheckHabit) onCheckHabit(patient.id, id);
    showFeedback("Updated habit check-in status!");
  };

  const handleSaveHabit = (andAnother: boolean = false) => {
    if (!formHabitName.trim()) {
      showFeedback("Please enter a Habit Name!");
      return;
    }

    const newHabit: HabitEntry = {
      id: `h-${Date.now()}`,
      name: formHabitName,
      type: formHabitType,
      category: formHabitCategory,
      frequency: formHabitFrequency,
      targetCount: 1,
      completedToday: false,
      streakDays: 0,
      bestStreak: 0,
      notes: formHabitNotes,
      icon: formHabitIcon || (formHabitType === "Good" ? "🎯" : "🚫"),
      color: formHabitType === "Good" ? "bg-emerald-500" : "bg-rose-500",
    };

    setHabits([...habits, newHabit]);
    showFeedback(`Added new ${formHabitType} habit: "${formHabitName}"!`);

    if (andAnother) {
      setFormHabitName("");
      setFormHabitNotes("");
    } else {
      setActiveTab("habits");
    }
  };

  const handleSaveJournal = (andAnother: boolean = false) => {
    if (!formJournalTitle.trim() || !formJournalContent.trim()) {
      showFeedback("Please enter title and content for your journal!");
      return;
    }

    const tagList = formJournalTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newJournal: JournalEntry = {
      id: `j-${Date.now()}`,
      title: formJournalTitle,
      content: formJournalContent,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      linkedMood: `${selectedEmotion.name} ${selectedEmotion.emoji}`,
      tags: tagList,
      photoUrl: formJournalPhoto || undefined,
      privacy: formJournalPrivacy,
    };

    setJournals([newJournal, ...journals]);
    showFeedback(`Saved journal entry: "${formJournalTitle}"!`);

    if (andAnother) {
      setFormJournalTitle("");
      setFormJournalContent("");
      setFormJournalPhoto(null);
    } else {
      setActiveTab("journal");
    }
  };

  const handleGenerateAiJournal = () => {
    const todayMoodStr = moodLogs.length > 0 ? `${moodLogs[0].emotion} (${moodLogs[0].emoji})` : "Positive";
    const completedHabitsCount = habits.filter((h) => h.completedToday).length;

    setFormJournalTitle("AI Daily Care Summary");
    setFormJournalContent(
      `Today was a balanced day with a overall mood of ${todayMoodStr}. Successfully completed ${completedHabitsCount} wellness habits including hydration and activity. Felt grounded and grateful for progress made.`
    );
    setActiveTab("journalForm");
    showFeedback("Generated intelligent AI Journal draft from your daily logs!");
  };

  // Aggregated Stats
  const latestMood = moodLogs.length > 0 ? moodLogs[0] : null;
  const goodHabits = habits.filter((h) => h.type === "Good");
  const badHabits = habits.filter((h) => h.type === "Bad");
  const habitsDoneCount = habits.filter((h) => h.completedToday).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((habitsDoneCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Navigation Sub-Menu Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] flex items-center justify-center text-white font-black text-xl shadow-xs">
              😊
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Mood & Habit Journal
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Emotions, Habits, Screen Time & AI Reflection</p>
            </div>
          </div>

          {/* Test Alert Button */}
          <button
            onClick={() => {
              setActiveAlert(true);
              setAlertMsg("😊 Mood Check-in: How are you feeling this evening?");
            }}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
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
            className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "tracker" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Smile className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("moodForm")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "moodForm" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Check-in
          </button>
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "habits" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Target className="w-3.5 h-3.5" /> Habits
          </button>
          <button
            onClick={() => setActiveTab("badHabits")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "badHabits" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Shield className="w-3.5 h-3.5" /> Quit Bad
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "journal" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <FileText className="w-3.5 h-3.5" /> Journal
          </button>
          <button
            onClick={() => setActiveTab("screenTime")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "screenTime" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Screen Time
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "achievements" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Award className="w-3.5 h-3.5" /> Badges
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-amber-700 font-black">✕</button>
        </div>
      )}

      {/* Persistent Reminder Alert Card */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl p-4 shadow-xl border border-amber-300 relative overflow-hidden animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
                😊
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-white" /> {alertMsg}
                </h3>
                <p className="text-[11px] text-amber-100 font-medium">
                  Reminder: Daily Reflection & Habit Tracker
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
                setActiveTab("moodForm");
                setActiveAlert(false);
              }}
              className="flex-1 py-2 bg-white text-amber-950 font-black rounded-xl text-xs shadow-xs hover:bg-amber-50 cursor-pointer text-center"
            >
              😊 Log Mood Check-in Now
            </button>
            <button
              onClick={() => {
                showFeedback("Snoozed mood reminder for 15 minutes.");
                setActiveAlert(false);
              }}
              className="px-3 py-2 bg-amber-800/60 hover:bg-amber-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              ⏰ Snooze 15m
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
      {activeTab === "tracker" && (
        <div className="space-y-4">
          {/* Hero Today's Mood Card */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold tracking-wider text-amber-100 uppercase">TODAY'S MOOD CHECK-IN</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">{latestMood ? latestMood.emoji : "😊"}</span>
                  <span className="text-2xl font-extrabold text-white">{latestMood ? latestMood.emotion : "Happy"}</span>
                </div>
                <p className="text-xs text-amber-100/90 font-bold pt-1">
                  Intensity: {latestMood ? latestMood.intensity : 8}/10 • Triggers: {latestMood ? latestMood.triggers.join(", ") : "Health"}
                </p>
              </div>

              <button
                onClick={() => setActiveTab("moodForm")}
                className="py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-black backdrop-blur-xs transition-all cursor-pointer shadow-xs"
              >
                + Update Mood
              </button>
            </div>

            {/* Habit Completion Mini Progress */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-amber-50">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-200" /> Habits Today: {habitsDoneCount}/{habits.length} ({habitCompletionRate}%)
              </span>
              <button
                onClick={() => setActiveTab("habits")}
                className="text-amber-100 font-extrabold hover:underline text-[10px]"
              >
                Check Habits →
              </button>
            </div>
          </div>

          {/* 3 Mini Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3 text-center shadow-2xs">
              <Smile className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{moodLogs.length} Entries</div>
              <p className="text-[9px] font-black tracking-wider text-amber-700 uppercase">MOOD LOGS</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 text-center shadow-2xs">
              <Target className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{habitCompletionRate}%</div>
              <p className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">HABIT RATE</p>
            </div>

            <div className="bg-cyan-50/80 border border-cyan-100 rounded-2xl p-3 text-center shadow-2xs">
              <Smartphone className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{Math.floor(totalScreenTimeMins / 60)}h {totalScreenTimeMins % 60}m</div>
              <p className="text-[9px] font-black tracking-wider text-cyan-700 uppercase">SCREEN TIME</p>
            </div>
          </div>

          {/* Today's Habits Quick Checklist */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" /> Today's Wellness Habits
              </h3>
              <button onClick={() => setActiveTab("habits")} className="text-xs font-bold text-amber-600 hover:underline">
                View All ({habits.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {habits.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  onClick={() => handleToggleHabit(h.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${h.completedToday ? "bg-emerald-50/80 border-emerald-200" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{h.icon}</span>
                    <div>
                      <h4 className={`font-extrabold text-xs ${h.completedToday ? "text-emerald-900 line-through" : "text-slate-800"}`}>
                        {h.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Streak: {h.streakDays} days 🔥
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs ${h.completedToday ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                    {h.completedToday ? "✓" : "+"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Emotional Insight Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" /> Gemini AI Psychological Insight
              </div>
              <button onClick={handleGenerateAiJournal} className="text-[10px] font-extrabold text-amber-700 underline">
                Auto-Journal Draft
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your mood scores peak by +25% on days when you complete both physical walk habits and water intake. Staying consistent with morning hydration continues to boost your overall daily energy."
            </p>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MOOD CHECK-IN FORM ==================== */}
      {activeTab === "moodForm" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Record Mood Check-in</h2>
              <p className="text-[10px] text-slate-500 font-medium">Select emotion, intensity rating and trigger factors</p>
            </div>
            <button onClick={() => setActiveTab("tracker")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-4">
            {/* Emotion Selector Grid */}
            <div>
              <label className="font-extrabold text-slate-800 block text-xs mb-2">How are you feeling right now? *</label>
              <div className="grid grid-cols-3 gap-2">
                {availableEmotions.map((emo) => (
                  <button
                    key={emo.name}
                    type="button"
                    onClick={() => setSelectedEmotion(emo)}
                    className={`p-2.5 rounded-2xl border font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedEmotion.name === emo.name ? "bg-amber-500 text-white border-amber-600 shadow-md scale-102" : `${emo.border} hover:opacity-90`}`}
                  >
                    <span className="text-xl">{emo.emoji}</span>
                    <span>{emo.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider 1-10 */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-extrabold text-slate-800 text-xs">Emotion Intensity Level (1 to 10)</label>
                <span className="text-base font-black text-amber-900 bg-white px-3 py-0.5 rounded-xl border border-amber-200">
                  {formIntensity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formIntensity}
                onChange={(e) => setFormIntensity(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Triggers Selection */}
            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1.5">What's influencing your mood today? (Triggers)</label>
              <div className="flex flex-wrap gap-1.5">
                {triggerOptions.map((trig) => {
                  const isSelected = selectedTriggers.includes(trig);
                  return (
                    <button
                      key={trig}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTriggers(selectedTriggers.filter((t) => t !== trig));
                        } else {
                          setSelectedTriggers([...selectedTriggers, trig]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${isSelected ? "bg-amber-600 text-white border-amber-700 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                    >
                      {isSelected ? "✓ " : "+ "}{trig}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood Notes */}
            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Check-in Reflection Notes</label>
              <textarea
                rows={2}
                placeholder="What made you feel this way? Any specific thoughts..."
                value={formMoodNotes}
                onChange={(e) => setFormMoodNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveMood(false)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Mood Entry
              </button>

              <button
                type="button"
                onClick={() => handleSaveMood(true)}
                className="py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-950 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: GOOD HABITS TRACKER ==================== */}
      {activeTab === "habits" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Good Habits Tracker & Streaks</h2>
              <p className="text-[10px] text-slate-500 font-medium">Build positive daily health routines and track consistency</p>
            </div>
            <button
              onClick={() => {
                setFormHabitType("Good");
                setActiveTab("habitForm");
              }}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" /> Add Habit
            </button>
          </div>

          <div className="space-y-3">
            {goodHabits.map((h) => (
              <div key={h.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
                      {h.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{h.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold">
                        Category: {h.category} • Frequency: {h.frequency}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleHabit(h.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-black cursor-pointer transition-all ${h.completedToday ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50"}`}
                  >
                    {h.completedToday ? "Completed ✓" : "Mark Done +"}
                  </button>
                </div>

                {/* Streak Progress Indicator */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Flame className="w-4 h-4 text-amber-500" /> Current Streak: {h.streakDays} Days
                  </span>
                  <span className="text-[10px] text-slate-400">Best Record: {h.bestStreak} Days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: BAD HABIT BREAKER ==================== */}
      {activeTab === "badHabits" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-rose-600" /> Bad Habit Breaker & Quitting Journal
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Reduce junk food, smoking, screen time and track clean days</p>
            </div>
            <button
              onClick={() => {
                setFormHabitType("Bad");
                setActiveTab("habitForm");
              }}
              className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" /> Track Bad Habit
            </button>
          </div>

          <div className="space-y-3">
            {badHabits.map((h) => (
              <div key={h.id} className="p-4 bg-rose-50/40 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-bold">
                      {h.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{h.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold">{h.notes || "Clean tracking"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleHabit(h.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all ${h.completedToday ? "bg-emerald-600 text-white" : "bg-rose-100 text-rose-900 border border-rose-300"}`}
                  >
                    {h.completedToday ? "Clean Today ✓" : "Relapsed Today?"}
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-rose-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-600" /> Clean Streak: {h.streakDays} Days
                  </span>
                  <span className="text-slate-400 text-[10px]">Max Clean: {h.bestStreak} Days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: ADD HABIT FORM ==================== */}
      {activeTab === "habitForm" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Add New Habit Entry</h2>
              <p className="text-[10px] text-slate-500 font-medium">Create a good habit to build or a bad habit to quit</p>
            </div>
            <button onClick={() => setActiveTab("habits")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3">
            <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setFormHabitType("Good")}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${formHabitType === "Good" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600"}`}
              >
                🎯 Build Good Habit
              </button>
              <button
                type="button"
                onClick={() => setFormHabitType("Bad")}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${formHabitType === "Bad" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600"}`}
              >
                🚫 Quit Bad Habit
              </button>
            </div>

            <div>
              <label className="font-extrabold text-slate-800 block text-xs mb-1">Habit Name *</label>
              <input
                type="text"
                placeholder="e.g., Read 15 pages, Limit Sugar, Morning Jog"
                value={formHabitName}
                onChange={(e) => setFormHabitName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Category</label>
                <select
                  value={formHabitCategory}
                  onChange={(e) => setFormHabitCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Health">Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Mental">Mental</option>
                  <option value="Personal">Personal</option>
                  <option value="Financial">Financial</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Frequency</label>
                <select
                  value={formHabitFrequency}
                  onChange={(e) => setFormHabitFrequency(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Notes / Motivation</label>
              <textarea
                rows={2}
                placeholder="Why do you want to build or quit this habit?"
                value={formHabitNotes}
                onChange={(e) => setFormHabitNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveHabit(false)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Habit
              </button>

              <button
                type="button"
                onClick={() => handleSaveHabit(true)}
                className="py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-950 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: DAILY JOURNAL ==================== */}
      {activeTab === "journal" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Daily Reflection Journal</h2>
              <p className="text-[10px] text-slate-500 font-medium">Write thoughts, link mood state & review past entries</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleGenerateAiJournal}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Draft
              </button>
              <button
                onClick={() => setActiveTab("journalForm")}
                className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Write
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {journals.map((j) => (
              <div key={j.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{j.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {j.date} at {j.time} • Linked Mood: {j.linkedMood || "Calm 😌"}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                    {j.privacy}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {j.content}
                </p>

                <div className="flex justify-between items-center text-[10px] text-amber-800 font-bold pt-1">
                  <span>Tags: {j.tags.join(", ")}</span>
                  <button
                    onClick={() => {
                      setJournals(journals.filter((item) => item.id !== j.id));
                      showFeedback("Deleted journal entry.");
                    }}
                    className="text-rose-500 hover:underline cursor-pointer"
                  >
                    Delete Entry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: JOURNAL FORM ==================== */}
      {activeTab === "journalForm" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Write Journal Entry</h2>
              <p className="text-[10px] text-slate-500 font-medium">Record personal reflections, photos and grateful thoughts</p>
            </div>
            <button onClick={() => setActiveTab("journal")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-extrabold text-slate-800 block text-xs mb-1">Journal Title *</label>
              <input
                type="text"
                placeholder="e.g., Reflections on my walk, Evening peace"
                value={formJournalTitle}
                onChange={(e) => setFormJournalTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-800 block text-xs mb-1">Content / Journal Text *</label>
              <textarea
                rows={5}
                placeholder="Write your thoughts here..."
                value={formJournalContent}
                onChange={(e) => setFormJournalContent(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g., gratitude, walk, work"
                  value={formJournalTags}
                  onChange={(e) => setFormJournalTags(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Privacy Level</label>
                <select
                  value={formJournalPrivacy}
                  onChange={(e) => setFormJournalPrivacy(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Private">🔒 Private (Only Me)</option>
                  <option value="Shared">👥 Shared with Caregiver</option>
                  <option value="Public">🌐 Public</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveJournal(false)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Journal Entry
              </button>

              <button
                type="button"
                onClick={() => handleSaveJournal(true)}
                className="py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-950 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: SCREEN TIME & DETOX ==================== */}
      {activeTab === "screenTime" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-cyan-600" /> Screen Time & Digital Detox
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Monitor daily screen usage, set app limits and activate focus mode</p>
            </div>
            <button
              onClick={() => {
                setFocusModeActive(!focusModeActive);
                showFeedback(focusModeActive ? "Focus mode deactivated." : "Focus mode activated! Notifications silenced.");
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all ${focusModeActive ? "bg-cyan-600 text-white shadow-xs" : "bg-slate-100 text-slate-700"}`}
            >
              {focusModeActive ? "Focus Mode ON 🎯" : "Enable Focus Mode"}
            </button>
          </div>

          {/* Today's Usage Bar */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">TOTAL SCREEN TIME TODAY</span>
              <span className="text-cyan-400 font-extrabold">Limit: 3 Hours</span>
            </div>
            <div className="text-3xl font-black text-cyan-300 font-mono">
              {Math.floor(totalScreenTimeMins / 60)}h {totalScreenTimeMins % 60}m
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.round((totalScreenTimeMins / 180) * 100))}%` }}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* App Usage List */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-800">App Usage Breakdown</h3>
            {screenTimeApps.map((app) => (
              <div key={app.id} className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{app.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{app.appName}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">Category: {app.category}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-800">{app.usedMins} mins</span>
                  <span className="text-[10px] text-slate-400 block font-bold">Limit: {app.limitMins}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 9: ANALYTICS & EXPORT ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Mood & Habit Analytics</h2>
              <p className="text-[10px] text-slate-500 font-medium">Weekly emotional trends, habit completion rate and reports</p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => showFeedback("Exported Mood & Habit Report to PDF!")}
                className="p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => showFeedback("Exported Mood & Habit Data to CSV!")}
                className="p-2 bg-orange-50 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2 text-xs">
            <span className="font-black text-amber-950 block">📊 Weekly Mood Distribution</span>
            <div className="h-24 flex items-end justify-between gap-2 pt-2">
              {[
                { day: "M", val: "7.5", color: "bg-emerald-400" },
                { day: "T", val: "8.2", color: "bg-emerald-500" },
                { day: "W", val: "6.0", color: "bg-cyan-400" },
                { day: "T", val: "8.8", color: "bg-emerald-600" },
                { day: "F", val: "7.0", color: "bg-amber-400" },
                { day: "S", val: "9.0", color: "bg-emerald-500" },
                { day: "S", val: "8.5", color: "bg-emerald-500" },
              ].map((b, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-600">{b.val}</span>
                  <div className={`w-full ${b.color} rounded-t-lg`} style={{ height: `${Number(b.val) * 8}px` }} />
                  <span className="text-[10px] font-bold text-slate-700">{b.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 10: ACHIEVEMENTS & BADGES ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Achievements & Badges</h2>
              <p className="text-[10px] text-slate-500 font-medium">Earn badges for daily mood logging and habit streaks</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "😊 First Check-in", desc: "Log your first mood", unlocked: true },
              { name: "🔥 7-Day Habit Streak", desc: "Keep habits for 7 days", unlocked: true },
              { name: "📖 Passionate Writer", desc: "Write 10 journal entries", unlocked: false },
              { name: "🛡️ Digital Detox Hero", desc: "Complete 1 detox day", unlocked: false },
            ].map((b, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${b.unlocked ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200 opacity-60"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.unlocked ? "🏆" : "🔒"}</span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs">{b.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 11: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Mood & Journal Settings</h2>
              <p className="text-[10px] text-slate-500 font-medium">Notification times, privacy preferences and data backup</p>
            </div>
            <Settings className="w-5 h-5 text-slate-500" />
          </div>

          <div className="space-y-3 text-xs font-bold text-slate-800">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border">
              <span>Daily Reminder Alerts</span>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border">
              <span>Reminder Notification Time</span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="p-1 bg-white border rounded-xl text-xs font-bold"
              />
            </div>

            <div className="pt-2 border-t flex justify-between">
              <button
                onClick={() => showFeedback("Reset all Mood & Journal settings to defaults!")}
                className="text-rose-600 font-black cursor-pointer hover:underline"
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
