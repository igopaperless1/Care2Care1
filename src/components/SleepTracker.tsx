import React, { useState, useEffect } from "react";
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
  FileText
} from "lucide-react";

export interface SleepRecord {
  id: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  sleepDuration: number; // minutes
  qualityRating: number; // 1-10
  timesWoke: number;
  timeToFallAsleep: number; // minutes
  restLevel: number; // 1-10
  nightmares: boolean;
  vividDreams: boolean;
  snored: boolean;
  sleepTalked: boolean;
  moodBeforeSleep: string;
  exercisedYesterday: boolean;
  caffeineBeforeBed: boolean;
  alcoholBeforeBed: boolean;
  screenBeforeBed: boolean;
  environmentComfort: number; // 1-10
  medications: string;
  stressLevel: number; // 1-10
  notes: string;
  dreamNotes: string;
  sleepSound: string;
  smartAlarmUsed: boolean;
  createdAt: string;
}

export interface SleepGoal {
  targetSleepHours: number;
  targetBedtime: string;
  targetWakeTime: string;
  targetSleepQuality: number;
  remindersEnabled: boolean;
  reminderTime: string;
  soundscapeDefault: string;
  smartAlarmEnabled: boolean;
  smartAlarmWindow: number;
}

export const SleepTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "logSleep" | "timer" | "analytics" | "goals" | "soundscapes" | "settings"
  >("dashboard");

  // Premium / Subscription Modal
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userPlan, setUserPlan] = useState<"Free" | "Premium" | "Family">("Free");

  // Legal Disclaimer Modal
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true);

  // Global Feedback Message
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Sleep Goal State
  const [goals, setGoals] = useState<SleepGoal>({
    targetSleepHours: 8.0,
    targetBedtime: "10:30 PM",
    targetWakeTime: "06:30 AM",
    targetSleepQuality: 8,
    remindersEnabled: true,
    reminderTime: "10:00 PM",
    soundscapeDefault: "Calming Rain",
    smartAlarmEnabled: true,
    smartAlarmWindow: 30,
  });

  // Sleep Records State
  const [records, setRecords] = useState<SleepRecord[]>([
    {
      id: "sr-1",
      userId: "u-1",
      date: new Date().toISOString().split("T")[0],
      bedtime: "10:30 PM",
      wakeTime: "06:45 AM",
      sleepDuration: 495, // 8h 15m
      qualityRating: 9,
      timesWoke: 1,
      timeToFallAsleep: 15,
      restLevel: 9,
      nightmares: false,
      vividDreams: true,
      snored: false,
      sleepTalked: false,
      moodBeforeSleep: "Relaxed",
      exercisedYesterday: true,
      caffeineBeforeBed: false,
      alcoholBeforeBed: false,
      screenBeforeBed: false,
      environmentComfort: 9,
      medications: "Magnesium 200mg",
      stressLevel: 2,
      notes: "Slept deeply with ocean soundscape. Felt energized in the morning.",
      dreamNotes: "Dreamt of walking on a serene mountain trail with clear skies.",
      sleepSound: "Ocean Waves",
      smartAlarmUsed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "sr-2",
      userId: "u-1",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      bedtime: "11:15 PM",
      wakeTime: "06:30 AM",
      sleepDuration: 435, // 7h 15m
      qualityRating: 7,
      timesWoke: 2,
      timeToFallAsleep: 25,
      restLevel: 7,
      nightmares: false,
      vividDreams: false,
      snored: true,
      sleepTalked: false,
      moodBeforeSleep: "Tired",
      exercisedYesterday: false,
      caffeineBeforeBed: true,
      alcoholBeforeBed: false,
      screenBeforeBed: true,
      environmentComfort: 7,
      medications: "",
      stressLevel: 4,
      notes: "Caffeine after 6 PM made it slightly hard to fall asleep.",
      dreamNotes: "",
      sleepSound: "Calming Rain",
      smartAlarmUsed: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  // Log Sleep Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formBedtime, setFormBedtime] = useState("10:30 PM");
  const [formWakeTime, setFormWakeTime] = useState("06:30 AM");
  const [formDurationHours, setFormDurationHours] = useState(8.0);
  const [formQuality, setFormQuality] = useState(8);
  const [formTimesWoke, setFormTimesWoke] = useState(1);
  const [formTimeToFallAsleep, setFormTimeToFallAsleep] = useState(15);
  const [formRestLevel, setFormRestLevel] = useState(8);
  const [formNightmares, setFormNightmares] = useState(false);
  const [formVividDreams, setFormVividDreams] = useState(false);
  const [formSnored, setFormSnored] = useState(false);
  const [formSleepTalked, setFormSleepTalked] = useState(false);
  const [formMood, setFormMood] = useState("Relaxed");
  const [formExercised, setFormExercised] = useState(true);
  const [formCaffeine, setFormCaffeine] = useState(false);
  const [formAlcohol, setFormAlcohol] = useState(false);
  const [formScreenTime, setFormScreenTime] = useState(false);
  const [formEnvironmentComfort, setFormEnvironmentComfort] = useState(9);
  const [formMeds, setFormMeds] = useState("");
  const [formStress, setFormStress] = useState(2);
  const [formNotes, setFormNotes] = useState("");
  const [formDreamNotes, setFormDreamNotes] = useState("");
  const [formSoundscape, setFormSoundscape] = useState("Calming Rain");

  // Timer & Soundscape State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>("Calming Rain");
  const [soundVolume, setSoundVolume] = useState(75);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveSleepLog = () => {
    const totalMinutes = Math.round(formDurationHours * 60);
    const newRecord: SleepRecord = {
      id: `sr-${Date.now()}`,
      userId: "u-1",
      date: formDate,
      bedtime: formBedtime,
      wakeTime: formWakeTime,
      sleepDuration: totalMinutes,
      qualityRating: formQuality,
      timesWoke: formTimesWoke,
      timeToFallAsleep: formTimeToFallAsleep,
      restLevel: formRestLevel,
      nightmares: formNightmares,
      vividDreams: formVividDreams,
      snored: formSnored,
      sleepTalked: formSleepTalked,
      moodBeforeSleep: formMood,
      exercisedYesterday: formExercised,
      caffeineBeforeBed: formCaffeine,
      alcoholBeforeBed: formAlcohol,
      screenBeforeBed: formScreenTime,
      environmentComfort: formEnvironmentComfort,
      medications: formMeds,
      stressLevel: formStress,
      notes: formNotes || "Logged sleep entry",
      dreamNotes: formDreamNotes,
      sleepSound: formSoundscape,
      smartAlarmUsed: true,
      createdAt: new Date().toISOString(),
    };

    setRecords([newRecord, ...records]);
    showFeedback(`Successfully logged ${formDurationHours} hrs sleep with Quality ${formQuality}/10! 🌙`);
    setActiveTab("dashboard");
  };

  const latestRecord = records[0] || null;
  const avgDurationHrs = (records.reduce((acc, r) => acc + r.sleepDuration, 0) / (records.length || 1) / 60).toFixed(1);
  const avgQuality = (records.reduce((acc, r) => acc + r.qualityRating, 0) / (records.length || 1)).toFixed(1);

  // Calculate overall sleep score (0-100)
  const calcSleepScore = (record: SleepRecord | null) => {
    if (!record) return 85;
    const durScore = Math.min(100, (record.sleepDuration / 480) * 50); // 8h = 50 pts
    const qualScore = (record.qualityRating / 10) * 30; // 30 pts
    const wakePenalty = Math.max(0, 20 - record.timesWoke * 5); // 20 pts
    return Math.round(durScore + qualScore + wakePenalty);
  };

  const currentScore = calcSleepScore(latestRecord);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Navigation */}
      <div className="bg-white text-slate-900 rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              🌙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Sleep Tracker & Soundscapes
                </h1>
                <span className="text-[10px] font-black bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Care2Care Suite
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">
                Track Duration, Quality, Soundscapes, Smart Alarms & AI Sleep Insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] font-black border border-[#2E7D32]/30 rounded-xl text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-current text-[#2E7D32]" />
              <span>{userPlan === "Free" ? "Go VIP" : "VIP Member"}</span>
            </button>
            <button
              onClick={() => setShowDisclaimer(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
              title="Legal & Health Disclaimer"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "dashboard" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("logSleep")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "logSleep" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Log Sleep
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "timer" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Sleep Timer
          </button>
          <button
            onClick={() => setActiveTab("soundscapes")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "soundscapes" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" /> Soundscapes
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "analytics" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "goals" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Goals
          </button>
        </div>
      </div>

      {/* Free Tier Simulated Ad Banner */}
      {userPlan === "Free" && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-300/40 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">AD</span>
            <span className="font-bold">Upgrade to Premium for Unlimited Sleep Soundscapes & AI Dream Analysis!</span>
          </div>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="text-[11px] font-black text-amber-700 hover:underline cursor-pointer"
          >
            Remove Ads →
          </button>
        </div>
      )}

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-950 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-indigo-700 font-black">✕</button>
        </div>
      )}

      {/* ==================== TAB 1: DASHBOARD ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Main Sleep Score Card */}
          <div className="bg-white text-slate-900 p-5 rounded-3xl shadow-sm space-y-4 border border-[#2E7D32]/20 border-l-4 border-l-[#2E7D32]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2E7D32] block">
                  NIGHTLY SLEEP PERFORMANCE
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">Sleep Score & Rest Index</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black text-[#2E7D32]">{currentScore} <span className="text-xs font-bold text-slate-400">/ 100</span></div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentScore >= 85 ? "🌟 Excellent Sleep" : currentScore >= 70 ? "😴 Good Sleep" : "😫 Needs Rest"}
                </span>
              </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-indigo-500/20 text-center">
                <span className="text-[9px] font-black text-indigo-200 uppercase block mb-1">Total Duration</span>
                <span className="text-sm font-black text-white">
                  {latestRecord ? `${Math.floor(latestRecord.sleepDuration / 60)}h ${latestRecord.sleepDuration % 60}m` : "8h 15m"}
                </span>
              </div>

              <div className="bg-slate-800/70 p-3 rounded-2xl border border-indigo-500/20 text-center">
                <span className="text-[9px] font-black text-indigo-200 uppercase block mb-1">Quality Rating</span>
                <span className="text-sm font-black text-amber-300">
                  {latestRecord ? `${latestRecord.qualityRating} / 10 ⭐` : "9 / 10 ⭐"}
                </span>
              </div>

              <div className="bg-slate-800/70 p-3 rounded-2xl border border-indigo-500/20 text-center">
                <span className="text-[9px] font-black text-indigo-200 uppercase block mb-1">Bedtime</span>
                <span className="text-xs font-black text-white">
                  {latestRecord ? latestRecord.bedtime : "10:30 PM"}
                </span>
              </div>

              <div className="bg-slate-800/70 p-3 rounded-2xl border border-indigo-500/20 text-center">
                <span className="text-[9px] font-black text-indigo-200 uppercase block mb-1">Wake Time</span>
                <span className="text-xs font-black text-white">
                  {latestRecord ? latestRecord.wakeTime : "06:45 AM"}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-800/50">
              <button
                onClick={() => setActiveTab("logSleep")}
                className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs cursor-pointer shadow-md text-center"
              >
                + Log Night Sleep
              </button>
              <button
                onClick={() => setActiveTab("timer")}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/40 font-bold rounded-2xl text-xs cursor-pointer text-center"
              >
                ⏰ Bedtime Timer
              </button>
              <button
                onClick={() => setActiveTab("soundscapes")}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/40 font-bold rounded-2xl text-xs cursor-pointer text-center"
              >
                🎵 Soundscapes
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/40 font-bold rounded-2xl text-xs cursor-pointer text-center"
              >
                📊 AI Insights
              </button>
            </div>
          </div>

          {/* Recent Sleep Logs List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" /> Recent Sleep History Logs
              </h3>
              <span className="text-xs font-bold text-slate-400">{records.length} Records Logged</span>
            </div>

            <div className="space-y-3">
              {records.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-indigo-950 text-xs">
                      📅 {r.date} • {r.bedtime} → {r.wakeTime}
                    </span>
                    <span className="font-black text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full text-[10px]">
                      Quality: {r.qualityRating}/10 ⭐
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 font-bold bg-white p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block uppercase">Duration</span>
                      <span className="text-slate-900 font-black">{Math.floor(r.sleepDuration / 60)}h {r.sleepDuration % 60}m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Times Woke</span>
                      <span className="text-slate-900 font-black">{r.timesWoke} time(s)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Mood / Stress</span>
                      <span className="text-indigo-900 font-black">{r.moodBeforeSleep} • Stress {r.stressLevel}/10</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase">Soundscape</span>
                      <span className="text-slate-900 font-black">{r.sleepSound || "None"}</span>
                    </div>
                  </div>

                  {r.notes && <p className="text-slate-700 text-[11px] font-medium">📝 {r.notes}</p>}
                  {r.dreamNotes && (
                    <p className="text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-100 text-[10px] font-medium italic">
                      🔮 Dream Notes: {r.dreamNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LOG SLEEP FORM ==================== */}
      {activeTab === "logSleep" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-600" /> Log Sleep Entry & Questionnaire
              </h2>
              <p className="text-[10px] text-slate-500 font-bold">Comprehensive 10+ question sleep health evaluation</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">
              Cancel
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* SECTION 1: SLEEP TIMES */}
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
              <span className="font-black text-indigo-950 text-xs uppercase tracking-wider block">
                1. Sleep Times & Duration *
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Log Date *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bedtime Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 PM"
                    value={formBedtime}
                    onChange={(e) => setFormBedtime(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Wake Up Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:30 AM"
                    value={formWakeTime}
                    onChange={(e) => setFormWakeTime(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    step="0.25"
                    value={formDurationHours}
                    onChange={(e) => setFormDurationHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold text-indigo-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SLEEP QUESTIONNAIRE */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <span className="font-black text-slate-900 text-xs uppercase tracking-wider block">
                2. Sleep Quality & Questionnaire (10+ Questions)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-slate-800 block mb-1">
                    Q1: Quality Rating (1-10) *: <span className="text-amber-600 font-black">{formQuality} ⭐</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={formQuality}
                    onChange={(e) => setFormQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-800 block mb-1">
                    Q2: Rested Feeling (1-10): <span className="text-emerald-600 font-black">{formRestLevel}/10</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={formRestLevel}
                    onChange={(e) => setFormRestLevel(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Q3: Times Woken During Night</label>
                  <input
                    type="number"
                    value={formTimesWoke}
                    onChange={(e) => setFormTimesWoke(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Q4: Time to Fall Asleep (Minutes)</label>
                  <input
                    type="number"
                    value={formTimeToFallAsleep}
                    onChange={(e) => setFormTimeToFallAsleep(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Q5: Mood Before Sleep</label>
                  <select
                    value={formMood}
                    onChange={(e) => setFormMood(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  >
                    <option value="Relaxed">Relaxed & Calm</option>
                    <option value="Happy">Happy & Content</option>
                    <option value="Tired">Exhausted / Tired</option>
                    <option value="Anxious">Anxious / Overthinking</option>
                    <option value="Stressed">Stressed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Q6: Stress Level Before Bed (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formStress}
                    onChange={(e) => setFormStress(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Checkboxes Questions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="p-3 bg-white border rounded-xl flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input type="checkbox" checked={formExercised} onChange={(e) => setFormExercised(e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
                  Exercised Yesterday
                </label>
                <label className="p-3 bg-white border rounded-xl flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input type="checkbox" checked={formCaffeine} onChange={(e) => setFormCaffeine(e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
                  Caffeine Before Bed
                </label>
                <label className="p-3 bg-white border rounded-xl flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input type="checkbox" checked={formAlcohol} onChange={(e) => setFormAlcohol(e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
                  Alcohol Before Bed
                </label>
                <label className="p-3 bg-white border rounded-xl flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input type="checkbox" checked={formScreenTime} onChange={(e) => setFormScreenTime(e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
                  Screen Before Bed
                </label>
              </div>
            </div>

            {/* SECTION 3: DREAM JOURNAL & NOTES */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-black text-slate-900 text-xs uppercase tracking-wider block">
                3. Dream Journal & Sleep Notes
              </span>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dream Journal / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Describe vivid dreams, nightmares, or themes..."
                  value={formDreamNotes}
                  onChange={(e) => setFormDreamNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">General Sleep Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Room temperature was cold, used extra blanket..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSleepLog}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Night Sleep Entry
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: SLEEP TIMER & SOUNDSCAPES ==================== */}
      {activeTab === "timer" && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-indigo-900 shadow-xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Bedtime Sleep Timer & Smart Alarm
              </h2>
              <p className="text-[10px] text-indigo-300">Play soothing soundscapes while measuring sleep duration</p>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full border border-indigo-400/30">
              Active Sound: {activeSound || "None"}
            </span>
          </div>

          {/* Clock Timer Display */}
          <div className="text-center p-8 bg-slate-800/80 rounded-3xl border border-indigo-500/30 space-y-3">
            <span className="text-4xl sm:text-6xl font-black text-indigo-300 font-mono tracking-wider block">
              {formatTimer(timerSeconds)}
            </span>
            <p className="text-xs text-slate-400 font-bold">Elapsed Bedtime Session Duration</p>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`py-3 px-6 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 cursor-pointer ${
                  isTimerRunning ? "bg-amber-500 text-slate-950" : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTimerRunning ? "Pause Sleep Timer" : "Start Sleep Timer"}
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-2xl text-xs cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Soundscapes Select */}
          <div className="space-y-3">
            <span className="text-xs font-black text-indigo-200 block uppercase tracking-wider">
              🎵 Select Calming Bedtime Soundscape
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {["Calming Rain 🌧️", "Ocean Waves 🌊", "Forest Birds 🌲", "Campfire 🔥", "White Noise 🎵", "Lullaby 🎶", "Meditation Tones 🧘"].map((snd) => (
                <button
                  key={snd}
                  onClick={() => {
                    setActiveSound(snd);
                    showFeedback(`Playing soundscape: ${snd}`);
                  }}
                  className={`p-3 rounded-2xl border text-left font-bold cursor-pointer transition-all ${
                    activeSound === snd
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-md"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {snd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SOUNDSCAPES ==================== */}
      {activeTab === "soundscapes" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b pb-2 flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600" /> Sleep Soundscape Library
            </h3>
            <span className="text-xs text-slate-500 font-bold">7 Premium Soundscapes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: "Calming Rain 🌧️", desc: "Soft ambient rainfall on window glass" },
              { name: "Ocean Waves 🌊", desc: "Gentle rhythmic beach ocean tide" },
              { name: "Forest Birds 🌲", desc: "Pine forest breeze & quiet morning birds" },
              { name: "Campfire Crackle 🔥", desc: "Warm cozy wood fire crackling" },
              { name: "White Noise 🎵", desc: "Constant soothing static for deep sleep" },
              { name: "Soft Lullaby 🎶", desc: "Peaceful acoustic harp & piano notes" },
              { name: "Meditation Tones 🧘", desc: "432Hz deep relaxation acoustic frequency" },
            ].map((snd) => (
              <div key={snd.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-black text-slate-900">{snd.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{snd.desc}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveSound(snd.name);
                    showFeedback(`Now playing: ${snd.name}`);
                  }}
                  className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-2xs"
                >
                  Play
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: ANALYTICS & AI INSIGHTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b pb-2 flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> AI Sleep Analytics & Trends
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-900 font-black px-2.5 py-0.5 rounded-full">
              7-Day Analysis
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Average Duration</span>
              <span className="text-base font-black text-indigo-950">{avgDurationHrs} Hours</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Average Quality</span>
              <span className="text-base font-black text-amber-900">{avgQuality} / 10 ⭐</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Consistency</span>
              <span className="text-base font-black text-emerald-900">92% Consistent</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Deep Sleep Ratio</span>
              <span className="text-base font-black text-purple-900">28% Deep Sleep</span>
            </div>
          </div>

          {/* Gemini AI Recommendations */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
              <Sparkles className="w-3 h-3 text-amber-300" /> Gemini AI Personalized Sleep Insights
            </span>
            <ul className="text-xs space-y-1.5 pt-1 text-indigo-100 font-medium list-disc pl-4">
              <li>Going to bed at 10:30 PM consistently yields 18% higher morning energy levels.</li>
              <li>Avoiding screen usage 30 mins before bed reduces night awakenings by 50%.</li>
              <li>Using Ocean & Rain soundscapes improved deep sleep ratio by 12%.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: GOALS & REMINDERS ==================== */}
      {activeTab === "goals" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b pb-2 flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" /> Sleep Goals & Reminders
            </h3>
            <span className="text-xs text-slate-500 font-bold">Target: 8.0 Hours</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Sleep Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={goals.targetSleepHours}
                  onChange={(e) => setGoals({ ...goals, targetSleepHours: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Bedtime</label>
                <input
                  type="text"
                  value={goals.targetBedtime}
                  onChange={(e) => setGoals({ ...goals, targetBedtime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Wake Time</label>
                <input
                  type="text"
                  value={goals.targetWakeTime}
                  onChange={(e) => setGoals({ ...goals, targetWakeTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
            </div>

            <button
              onClick={() => showFeedback("Sleep goals saved persistently!")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs shadow-xs"
            >
              Save Sleep Goals
            </button>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION MODAL */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-indigo-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-indigo-950 text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" /> Care2Care Premium & Family Plans
              </h3>
              <button onClick={() => setShowSubscriptionModal(false)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <h4 className="font-black text-slate-800">FREE</h4>
                <div className="text-xl font-black text-slate-900">$0 <span className="text-[10px] font-normal text-slate-500">/mo</span></div>
                <p className="text-[10px] text-slate-500">Basic Sleep Log & 5 Soundscapes with Ads.</p>
                <button
                  onClick={() => {
                    setUserPlan("Free");
                    setShowSubscriptionModal(false);
                    showFeedback("Switched to Free Tier");
                  }}
                  className="w-full py-1.5 bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Current Plan
                </button>
              </div>

              <div className="p-4 bg-indigo-50/80 rounded-2xl border-2 border-indigo-600 text-center space-y-2 relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">POPULAR</span>
                <h4 className="font-black text-indigo-950">PREMIUM</h4>
                <div className="text-xl font-black text-indigo-900">$4.99 <span className="text-[10px] font-normal text-slate-500">/mo</span></div>
                <p className="text-[10px] text-indigo-800">No Ads, Unlimited Soundscapes & AI Insights.</p>
                <button
                  onClick={() => {
                    setUserPlan("Premium");
                    setShowSubscriptionModal(false);
                    showFeedback("🎉 Welcome to Care2Care Premium!");
                  }}
                  className="w-full py-1.5 bg-indigo-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  Upgrade $4.99
                </button>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-2">
                <h4 className="font-black text-purple-950">FAMILY</h4>
                <div className="text-xl font-black text-purple-900">$9.99 <span className="text-[10px] font-normal text-slate-500">/mo</span></div>
                <p className="text-[10px] text-purple-800">Up to 5 Family Accounts & Shared Goals.</p>
                <button
                  onClick={() => {
                    setUserPlan("Family");
                    setShowSubscriptionModal(false);
                    showFeedback("🎉 Welcome to Family VIP Plan!");
                  }}
                  className="w-full py-1.5 bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Upgrade $9.99
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEGAL DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" /> Care2Care Platform Disclaimer
              </h3>
              <button onClick={() => setShowDisclaimer(false)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-2xl border">
              <p className="font-bold text-slate-800">⚠️ IMPORTANT LEGAL & MEDICAL NOTICE:</p>
              <p>1. Care2Care is a tracking and care-taking platform for lifestyle, health logs, and personal productivity management.</p>
              <p>2. Care2Care is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment. Always consult a certified physician for medical concerns.</p>
              <p>3. All AI insights are generated for informational purposes only. Care2Care assumes no liability for user health or lifestyle decisions.</p>
            </div>

            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-black rounded-xl text-xs cursor-pointer"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
