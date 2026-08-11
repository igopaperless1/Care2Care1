import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  Footprints,
  Flame,
  CheckCircle2,
  Plus,
  History,
  Settings,
  Award,
  Zap,
  Clock,
  X,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Upload,
  Camera,
  MapPin,
  Share2,
  Download,
  Volume2,
  Sparkles,
  ChevronRight,
  Filter,
  Trash2,
  Edit2,
  Check,
  Play,
  Pause,
  RotateCcw,
  Square,
  Compass,
  TrendingUp,
  Map,
  Video,
  FileText
} from "lucide-react";

interface StepsTrackerProps {
  patient: Patient;
  onAddSteps?: (patientId: string, steps: number) => void;
}

export interface WalkLogEntry {
  id: string;
  steps: number;
  distanceKm: number;
  caloriesKcal: number;
  durationMins: number;
  time: string;
  date: string;
  walkType: string;
  terrain?: string;
  intensity?: string;
  notes?: string;
  tags?: string;
  photoUrl?: string;
  videoName?: string;
  gpsLocation?: string;
}

export const StepsTracker: React.FC<StepsTrackerProps> = ({
  patient,
  onAddSteps,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "tracker" | "timer" | "form" | "history" | "analytics" | "achievements" | "settings" | "routeMap"
  >("tracker");

  // Notifications & Reminders State
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [alertTime, setAlertTime] = useState<string>("20:00");
  const [selectedRingtone, setSelectedRingtone] = useState<string>("Step Chime");
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [activeNotification, setActiveNotification] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>(
    "Time for a quick walk! Reach your 10,000 steps goal today."
  );

  // Settings & Goal State
  const [dailyGoalSteps, setDailyGoalSteps] = useState<number>(10000);
  const [unitSystem, setUnitSystem] = useState<"km" | "miles">("km");
  const [userWeightKg, setUserWeightKg] = useState<number>(70);
  const [userHeightCm, setUserHeightCm] = useState<number>(175);
  const [autoTrackEnabled, setAutoTrackEnabled] = useState<boolean>(true);

  // Calculated stride length in meters (Height * 0.413 / 100)
  const strideLengthMeters = (userHeightCm * 0.413) / 100;

  // Manual Form State
  const [formSteps, setFormSteps] = useState<number>(3000);
  const [formWalkType, setFormWalkType] = useState<string>("Casual Walk");
  const [formCustomWalkType, setFormCustomWalkType] = useState<string>("");
  const [formTerrain, setFormTerrain] = useState<string>("Flat Ground");
  const [formIntensity, setFormIntensity] = useState<string>("Moderate");
  const [formDurationMins, setFormDurationMins] = useState<number>(25);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [formNotes, setFormNotes] = useState<string>("");
  const [formTags, setFormTags] = useState<string>("morning, park");
  const [formPhotoUrl, setFormPhotoUrl] = useState<string | null>(null);
  const [formVideoName, setFormVideoName] = useState<string | null>(null);
  const [formGpsLocation, setFormGpsLocation] = useState<string>("GPS: 37.7749° N, 122.4194° W");

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [liveStepsCount, setLiveStepsCount] = useState<number>(0);

  // Local Walk Logs
  const [logs, setLogs] = useState<WalkLogEntry[]>([
    {
      id: "s1",
      steps: 3200,
      distanceKm: 2.3,
      caloriesKcal: 135,
      durationMins: 25,
      time: "08:15 AM",
      date: new Date().toISOString().split("T")[0],
      walkType: "Brisk Walk",
      terrain: "Park Trail",
      notes: "Morning walk around central park",
      tags: "morning, fresh-air",
    },
    {
      id: "s2",
      steps: 2100,
      distanceKm: 1.5,
      caloriesKcal: 90,
      durationMins: 18,
      time: "01:30 PM",
      date: new Date().toISOString().split("T")[0],
      walkType: "Casual Walk",
      terrain: "City Sidewalk",
      notes: "Lunch break stroll",
    },
    {
      id: "s3",
      steps: 4500,
      distanceKm: 3.2,
      caloriesKcal: 195,
      durationMins: 35,
      time: "06:00 PM",
      date: new Date().toISOString().split("T")[0],
      walkType: "Power Walk",
      terrain: "Uphill",
      notes: "Evening workout walk",
    },
  ]);

  // History Filter
  const [historyPeriod, setHistoryPeriod] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Selected Walk Route Preview
  const [selectedWalkRoute, setSelectedWalkRoute] = useState<WalkLogEntry | null>(null);

  // Feedback Banner State
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Timer interval effect for live step simulator
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
        // Simulate approx 2 steps per second while walking
        setLiveStepsCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto Calculations
  const calculateDistanceKm = (steps: number) => {
    const distMeters = steps * strideLengthMeters;
    return parseFloat((distMeters / 1000).toFixed(2));
  };

  const calculateCalories = (steps: number) => {
    // Approx 0.04 kcal per step for 70kg adult
    const factor = userWeightKg / 70;
    return Math.round(steps * 0.042 * factor);
  };

  // Aggregated Stats
  const totalStepsToday = logs.reduce((acc, curr) => acc + curr.steps, 0);
  const totalDistanceKmToday = calculateDistanceKm(totalStepsToday);
  const totalCaloriesToday = calculateCalories(totalStepsToday);
  const percentageGoal = Math.min(100, Math.round((totalStepsToday / dailyGoalSteps) * 100));

  // Handlers
  const handleQuickAddSteps = (stepsToAdd: number, walkType: string = "Casual Walk") => {
    const dist = calculateDistanceKm(stepsToAdd);
    const cals = calculateCalories(stepsToAdd);
    const newEntry: WalkLogEntry = {
      id: `s-${Date.now()}`,
      steps: stepsToAdd,
      distanceKm: dist,
      caloriesKcal: cals,
      durationMins: Math.round(stepsToAdd / 100),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
      walkType,
      terrain: "Flat Ground",
    };

    setLogs([newEntry, ...logs]);
    if (onAddSteps) onAddSteps(patient.id, stepsToAdd);
    showFeedback(`Logged ${stepsToAdd.toLocaleString()} steps (${dist} km)! Keep moving.`);
  };

  const handleFormSubmit = (andAnother: boolean = false) => {
    const finalType = formWalkType === "Other" ? (formCustomWalkType || "Custom Walk") : formWalkType;
    const dist = calculateDistanceKm(formSteps);
    const cals = calculateCalories(formSteps);

    const newEntry: WalkLogEntry = {
      id: `s-${Date.now()}`,
      steps: formSteps,
      distanceKm: dist,
      caloriesKcal: cals,
      durationMins: formDurationMins,
      time: formTime,
      date: formDate,
      walkType: finalType,
      terrain: formTerrain,
      intensity: formIntensity,
      notes: formNotes,
      tags: formTags,
      photoUrl: formPhotoUrl || undefined,
      videoName: formVideoName || undefined,
      gpsLocation: formGpsLocation,
    };

    setLogs([newEntry, ...logs]);
    if (onAddSteps) onAddSteps(patient.id, formSteps);
    showFeedback(`Successfully saved ${formSteps.toLocaleString()} steps (${finalType})!`);

    if (andAnother) {
      setFormNotes("");
      setFormPhotoUrl(null);
      setFormVideoName(null);
    } else {
      setActiveTab("tracker");
    }
  };

  const handleSaveTimerWalk = () => {
    if (liveStepsCount === 0) {
      showFeedback("No steps recorded in live timer session.");
      return;
    }
    const mins = Math.max(1, Math.round(timerSeconds / 60));
    const dist = calculateDistanceKm(liveStepsCount);
    const cals = calculateCalories(liveStepsCount);

    const newEntry: WalkLogEntry = {
      id: `s-live-${Date.now()}`,
      steps: liveStepsCount,
      distanceKm: dist,
      caloriesKcal: cals,
      durationMins: mins,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
      walkType: "Live Outdoor Walk",
      terrain: "GPS Tracked",
      notes: `Tracked live via GPS Timer (${mins} mins)`,
    };

    setLogs([newEntry, ...logs]);
    if (onAddSteps) onAddSteps(patient.id, liveStepsCount);
    showFeedback(`Saved live walk: ${liveStepsCount} steps (${dist} km)!`);

    // Reset timer
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setLiveStepsCount(0);
    setActiveTab("tracker");
  };

  // Walk Type options
  const walkTypes = [
    { name: "Casual Walk", icon: "🚶", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    { name: "Brisk Walk", icon: "🏃", bg: "bg-cyan-50 border-cyan-200 text-cyan-800" },
    { name: "Power Walk", icon: "⚡", bg: "bg-amber-50 border-amber-200 text-amber-800" },
    { name: "Jogging", icon: "🏃‍♂️", bg: "bg-blue-50 border-blue-200 text-blue-800" },
    { name: "Running", icon: "🏃‍♀️", bg: "bg-purple-50 border-purple-200 text-purple-800" },
    { name: "Treadmill Walk", icon: "🏋️", bg: "bg-indigo-50 border-indigo-200 text-indigo-800" },
    { name: "Hiking / Trail", icon: "🏞️", bg: "bg-teal-50 border-teal-200 text-teal-800" },
    { name: "Other", icon: "➕", bg: "bg-slate-100 border-slate-300 text-slate-800" },
  ];

  // Format Timer
  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, "0") + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Navigation Sub-Menu Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md">
              <Footprints className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Steps & Walk Tracker
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Pedometer, Live GPS Route & Calorie Engine</p>
            </div>
          </div>

          {/* Test Reminder Trigger Button */}
          <button
            onClick={() => {
              setActiveNotification(true);
              setNotificationMsg("🚶 Walk Alert: Reach your daily 10,000 steps target today!");
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
            className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "tracker" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Footprints className="w-3.5 h-3.5" /> Tracker
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "timer" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Clock className="w-3.5 h-3.5" /> Live GPS
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "form" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Manual
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "history" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <History className="w-3.5 h-3.5" /> History
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "achievements" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Award className="w-3.5 h-3.5" /> Badges
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-700 font-black">✕</button>
        </div>
      )}

      {/* Persistent Notification Alert Simulator Banner */}
      {activeNotification && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-4 shadow-xl border border-emerald-300 relative overflow-hidden animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
                🚶
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-white" /> {notificationMsg}
                </h3>
                <p className="text-[11px] text-emerald-100 font-medium">
                  Sound: {selectedRingtone} • Vibration: {vibrationEnabled ? "ON" : "OFF"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveNotification(false)}
              className="text-white/80 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/20">
            <button
              onClick={() => {
                handleQuickAddSteps(1000, "Brisk Walk");
                setActiveNotification(false);
              }}
              className="flex-1 py-2 bg-white text-emerald-900 font-black rounded-xl text-xs shadow-xs hover:bg-emerald-50 cursor-pointer text-center"
            >
              🚶 Log 1,000 Steps Now
            </button>
            <button
              onClick={() => {
                showFeedback("Walk reminder snoozed for 15 minutes.");
                setActiveNotification(false);
              }}
              className="px-3 py-2 bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              ⏰ Snooze 15m
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: MAIN TRACKER ==================== */}
      {activeTab === "tracker" && (
        <div className="space-y-4">
          {/* Main Steps Gradient Hero Card */}
          <div className="bg-white text-slate-900 border border-[#2E7D32]/20 border-l-4 border-l-[#2E7D32] rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black tracking-wider text-[#2E7D32] uppercase">TODAY'S TOTAL STEPS</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{totalStepsToday.toLocaleString()}</span>
                  <span className="text-sm font-bold text-slate-600">steps</span>
                </div>
                <p className="text-xs text-slate-500 font-bold pt-0.5">
                  Target: <span className="text-slate-900 font-black">{dailyGoalSteps.toLocaleString()}</span> steps (<span className="text-[#2E7D32] font-black">{percentageGoal}%</span> completed)
                </p>
              </div>

              {/* Progress Circle Gauge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-[#2E7D32] transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 - (percentageGoal / 100) * (2 * Math.PI * 38)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-base sm:text-lg font-black text-[#2E7D32]">{percentageGoal}%</span>
              </div>
            </div>

            {/* Quick Stat Bar (Distance & Calories) */}
            <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs font-bold text-emerald-50">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-200" /> Distance: {totalDistanceKmToday} {unitSystem}
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-300" /> Burned: {totalCaloriesToday} kcal
              </span>
            </div>
          </div>

          {/* Quick Presets Buttons (500, 1000, 2000, 5000, 10000 steps) */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-black text-slate-800">Quick Walk Presets</p>
              <span className="text-[10px] text-slate-400 font-bold">Tap to add instantly</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[500, 1000, 2000, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickAddSteps(preset)}
                  className="py-2.5 px-2 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-extrabold transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>🚶</span> {preset >= 1000 ? `${preset / 1000}k` : preset}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Mini Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-cyan-50/80 border border-cyan-100 rounded-2xl p-3 text-center shadow-2xs">
              <Compass className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{totalDistanceKmToday} {unitSystem}</div>
              <p className="text-[9px] font-black tracking-wider text-cyan-700 uppercase">DISTANCE</p>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3 text-center shadow-2xs">
              <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{totalCaloriesToday} kcal</div>
              <p className="text-[9px] font-black tracking-wider text-amber-700 uppercase">CALORIES</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 text-center shadow-2xs">
              <Zap className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">5 Days</div>
              <p className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">STREAK</p>
            </div>
          </div>

          {/* Today's Walk Log List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Today's Walk Entries ({logs.length})
              </h3>
              <button onClick={() => setActiveTab("history")} className="text-xs font-bold text-emerald-600 hover:underline">
                Full Log
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 border border-dashed rounded-2xl">
                No walks logged today yet. Use quick add or live GPS tracker above!
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">
                        🚶
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                          <span>{log.steps.toLocaleString()} steps ({log.distanceKm} km)</span>
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            {log.walkType}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {log.time} • {log.durationMins} mins • {log.caloriesKcal} kcal {log.notes ? `• ${log.notes}` : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setLogs(logs.filter((l) => l.id !== log.id));
                        showFeedback("Removed walk entry.");
                      }}
                      className="text-slate-400 hover:text-rose-600 font-black p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LIVE GPS & TIMER ==================== */}
      {activeTab === "timer" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Live Walking Timer & GPS Route Tracker</h2>
              <p className="text-[10px] text-slate-500 font-medium">Real-time step sensor counter, speed & route mapping</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${isTimerRunning ? "bg-emerald-100 text-emerald-800 animate-pulse" : "bg-slate-100 text-slate-600"}`}>
              {isTimerRunning ? "● Live Tracking..." : "Stopped"}
            </span>
          </div>

          {/* Stopwatch Digital Display */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 text-center space-y-3 shadow-lg">
            <p className="text-xs font-bold text-emerald-400 tracking-wider uppercase">ELAPSED DURATION</p>
            <div className="text-5xl font-black tracking-tight font-mono text-emerald-300">
              {formatTimer(timerSeconds)}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">STEPS</span>
                <span className="text-base font-black text-white">{liveStepsCount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">DISTANCE</span>
                <span className="text-base font-black text-white">{calculateDistanceKm(liveStepsCount)} km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">CALORIES</span>
                <span className="text-base font-black text-white">{calculateCalories(liveStepsCount)} kcal</span>
              </div>
            </div>
          </div>

          {/* Timer Controls (Start, Pause, Resume, Reset, Save) */}
          <div className="flex gap-2">
            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Start Walk
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
                setTimerSeconds(0);
                setLiveStepsCount(0);
                showFeedback("Timer reset.");
              }}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-xs cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <button
              onClick={handleSaveTimerWalk}
              className="py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-2xl text-xs cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Check className="w-4 h-4" /> Save Walk
            </button>
          </div>

          {/* Simulated Interactive Route Map */}
          <div className="bg-slate-900 rounded-3xl p-4 text-white space-y-2 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-400">
                <MapPin className="w-4 h-4" /> GPS Route Map Preview
              </span>
              <span className="text-[10px] text-slate-400">Accuracy: 3 meters</span>
            </div>

            {/* Visual SVG Map Path Line Simulation */}
            <div className="h-36 bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full p-4" viewBox="0 0 300 120">
                <path
                  d="M 20 100 Q 60 20, 120 70 T 220 30 T 280 80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="6 2"
                />
                <circle cx="20" cy="100" r="6" fill="#06b6d4" />
                <circle cx="280" cy="80" r="6" fill="#ef4444" />
              </svg>
              <span className="absolute bottom-2 left-3 text-[10px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded-md font-bold">
                📍 Start: Central Avenue
              </span>
              <span className="absolute bottom-2 right-3 text-[10px] bg-slate-900/90 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                🏁 Destination: Riverside Trail
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: ADD MANUAL ENTRY FORM ==================== */}
      {activeTab === "form" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Add Detailed Steps & Walk Log</h2>
              <p className="text-[10px] text-slate-500 font-medium">Specify exact steps, walk type, terrain & photo proof</p>
            </div>
            <button onClick={() => setActiveTab("tracker")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-4">
            {/* 1. Steps Slider & Manual Field */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <label className="font-extrabold text-slate-800 block text-xs">Steps Count *</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="100"
                  max="30000"
                  step="250"
                  value={formSteps}
                  onChange={(e) => setFormSteps(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <input
                  type="number"
                  value={formSteps}
                  onChange={(e) => setFormSteps(Number(e.target.value))}
                  className="w-28 p-2 bg-white border border-emerald-300 rounded-xl font-black text-slate-900 text-center text-base"
                />
              </div>

              {/* Calculated preview */}
              <div className="flex justify-between text-[11px] font-extrabold text-emerald-900 pt-1">
                <span>Approx Distance: {calculateDistanceKm(formSteps)} {unitSystem}</span>
                <span>Approx Calories: {calculateCalories(formSteps)} kcal</span>
              </div>
            </div>

            {/* 2. Walk Type Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block text-xs">Select Walk Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {walkTypes.map((wt) => (
                  <button
                    key={wt.name}
                    type="button"
                    onClick={() => setFormWalkType(wt.name)}
                    className={`p-2 rounded-xl text-left border font-extrabold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${formWalkType === wt.name ? "bg-emerald-600 text-white border-emerald-700 shadow-xs" : `${wt.bg} hover:opacity-90`}`}
                  >
                    <span>{wt.icon}</span>
                    <span className="truncate">{wt.name}</span>
                  </button>
                ))}
              </div>

              {formWalkType === "Other" && (
                <input
                  type="text"
                  placeholder="Specify custom walk type..."
                  value={formCustomWalkType}
                  onChange={(e) => setFormCustomWalkType(e.target.value)}
                  className="w-full p-2.5 mt-2 bg-amber-50 border border-amber-300 rounded-xl font-bold text-xs"
                />
              )}
            </div>

            {/* 3. Duration, Terrain & Intensity */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={formDurationMins}
                  onChange={(e) => setFormDurationMins(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs text-center"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Terrain</label>
                <select
                  value={formTerrain}
                  onChange={(e) => setFormTerrain(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Flat Ground">Flat Ground</option>
                  <option value="Hilly / Uphill">Hilly / Uphill</option>
                  <option value="Treadmill">Treadmill</option>
                  <option value="Park Trail">Park Trail</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Intensity</label>
                <select
                  value={formIntensity}
                  onChange={(e) => setFormIntensity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Light">Light Pace</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High Intensity</option>
                </select>
              </div>
            </div>

            {/* 4. Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Time</label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            {/* 5. Notes & Tags */}
            <div className="space-y-2">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Walk Notes / Context</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Walked along the river trail, felt energetic..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g., morning, park, dog-walk"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            {/* 6. Proof Capture (Photo, Video & GPS) */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-800 text-xs block">📸 Photo / Video Proof & GPS Attachment</span>
              <div className="grid grid-cols-3 gap-2">
                <label className="p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer font-bold text-[10px] text-slate-700 transition-all text-center">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="truncate">{formPhotoUrl ? "Photo Added" : "Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormPhotoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <label className="p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer font-bold text-[10px] text-slate-700 transition-all text-center">
                  <Video className="w-4 h-4 text-cyan-600" />
                  <span className="truncate">{formVideoName ? formVideoName.slice(0, 8) + "..." : "Video"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormVideoName(file.name);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setFormGpsLocation("GPS: 37.7749° N, 122.4194° W (Stamped)")}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-[10px] text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100"
                >
                  <MapPin className="w-4 h-4 text-amber-600" /> GPS Stamp
                </button>
              </div>

              {formPhotoUrl && (
                <div className="relative rounded-xl overflow-hidden border max-h-32 bg-slate-900 flex justify-center">
                  <img src={formPhotoUrl} alt="Walk Proof" className="h-32 object-cover w-full" />
                  <button onClick={() => setFormPhotoUrl(null)} className="absolute top-2 right-2 bg-slate-900/80 text-white font-bold text-xs w-6 h-6 rounded-full">✕</button>
                </div>
              )}

              <p className="text-[10px] text-slate-500 font-bold">Location: {formGpsLocation}</p>
            </div>

            {/* Submit Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleFormSubmit(false)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Walk Log
              </button>

              <button
                type="button"
                onClick={() => handleFormSubmit(true)}
                className="py-3 px-4 bg-teal-100 hover:bg-teal-200 text-teal-900 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: HISTORY & CALENDAR ==================== */}
      {activeTab === "history" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Walk History & Export Reports</h2>
              <p className="text-[10px] text-slate-500 font-medium">Filter walks by daily, weekly, or monthly timelines</p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => showFeedback("Exported Walk History Report to PDF!")}
                className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => showFeedback("Exported Walk Data to CSV!")}
                className="p-2 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold gap-1">
            {(["day", "week", "month", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setHistoryPeriod(p)}
                className={`flex-1 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${historyPeriod === p ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
              >
                {p} View
              </button>
            ))}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <input
              type="date"
              value={selectedHistoryDate}
              onChange={(e) => setSelectedHistoryDate(e.target.value)}
              className="p-2 bg-slate-50 border rounded-xl font-bold text-xs flex-1"
            />
          </div>

          {/* Walk Item Cards */}
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {log.steps.toLocaleString()} steps ({log.distanceKm} km) • {log.walkType}
                  </span>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {log.time} • {log.durationMins} mins • {log.caloriesKcal} kcal {log.notes ? `• ${log.notes}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLogs(logs.filter((l) => l.id !== log.id));
                    showFeedback("Deleted entry.");
                  }}
                  className="text-rose-500 font-bold p-1 hover:bg-rose-50 rounded-lg cursor-pointer text-xs"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: ANALYTICS & CHARTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Walk Analytics & AI Insights</h2>
              <p className="text-[10px] text-slate-500 font-medium">Weekly trends, distance benchmarks & calorie burn</p>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Weekly Bar Chart Visual */}
          <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Weekly Step Distribution</span>
              <span className="text-emerald-700 font-extrabold">Avg: 7,800 steps/day</span>
            </div>

            <div className="h-28 flex items-end justify-between gap-2 pt-2">
              {[
                { day: "M", height: "55%", value: "6.2k" },
                { day: "T", height: "85%", value: "9.5k", active: true },
                { day: "W", height: "70%", value: "7.8k" },
                { day: "T", height: "90%", value: "10.2k", active: true },
                { day: "F", height: "65%", value: "7.1k" },
                { day: "S", height: "40%", value: "4.5k" },
                { day: "S", height: "30%", value: "3.2k" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-bold text-slate-500">{bar.value}</span>
                  <div className="w-full bg-slate-200 rounded-t-lg h-20 relative flex items-end overflow-hidden">
                    <div
                      style={{ height: bar.height }}
                      className={`w-full transition-all rounded-t-lg ${bar.active ? "bg-gradient-to-t from-emerald-600 to-teal-400" : "bg-emerald-300"}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Recommendations Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Gemini AI Health Insight
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your walking consistency peaks on Tuesday and Thursday mornings. Taking a brisk 15-minute walk after lunch can help you hit 10,000 steps easily every weekday."
            </p>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: BADGES & ACHIEVEMENTS ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Walking Badges & Milestones</h2>
              <p className="text-[10px] text-slate-500 font-medium">Unlock badges by staying active daily</p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
              🏆 4 Unlocked
            </span>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "First Steps", desc: "Log 1st Walk", icon: "🚶", unlocked: true },
              { title: "Half Goal", desc: "5,000 Steps", icon: "🎯", unlocked: true },
              { title: "10k Champion", desc: "Hit 10k Steps", icon: "🏆", unlocked: true },
              { title: "7-Day Streak", desc: "7 Days Walking", icon: "🔥", unlocked: true },
              { title: "Marathon 42k", desc: "Walk 42km Total", icon: "🏃", unlocked: false },
              { title: "30-Day Master", desc: "30 Days Streak", icon: "💪", unlocked: false },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center space-y-1 ${badge.unlocked ? "bg-emerald-50/80 border-emerald-200" : "bg-slate-50 border-slate-200 opacity-60"}`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <p className="text-xs font-black text-slate-800">{badge.title}</p>
                <p className="text-[9px] text-slate-500 font-bold">{badge.desc}</p>
                <span className={`text-[9px] font-extrabold block pt-0.5 ${badge.unlocked ? "text-emerald-700" : "text-slate-400"}`}>
                  {badge.unlocked ? "✓ Unlocked" : "🔒 Locked"}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => showFeedback("Shared walking milestone card to family & friends!")}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Share Progress Card
          </button>
        </div>
      )}

      {/* ==================== TAB 7: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900">Step Tracker Settings</h2>
            <p className="text-[10px] text-slate-500 font-medium">Customize daily step goals, body metrics & reminders</p>
          </div>

          <div className="space-y-4">
            {/* Daily Goal Setting */}
            <div className="bg-slate-50 p-4 rounded-2xl border space-y-2">
              <label className="font-extrabold text-slate-800 block text-xs">Daily Steps Goal</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="500"
                  value={dailyGoalSteps}
                  onChange={(e) => setDailyGoalSteps(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="font-black text-slate-900 text-sm">{dailyGoalSteps.toLocaleString()} steps</span>
              </div>
            </div>

            {/* Body Metrics for Calorie Calculation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Body Weight (kg)</label>
                <input
                  type="number"
                  value={userWeightKg}
                  onChange={(e) => setUserWeightKg(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={userHeightCm}
                  onChange={(e) => setUserHeightCm(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            {/* Auto Track Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-2xl">
              <div>
                <span className="font-extrabold text-slate-800 text-xs block">Phone Motion Sensor Auto-Track</span>
                <span className="text-[10px] text-slate-500 font-medium">Automatically count steps in background</span>
              </div>
              <button
                onClick={() => setAutoTrackEnabled(!autoTrackEnabled)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${autoTrackEnabled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
              >
                {autoTrackEnabled ? "ON" : "OFF"}
              </button>
            </div>

            <button
              onClick={() => showFeedback("Step tracker settings saved successfully!")}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-xs cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
