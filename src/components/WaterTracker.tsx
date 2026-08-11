import React, { useState, useEffect } from "react";
import { Patient, WaterLog } from "../types";
import { ServiceSetupModal } from "./ServiceSetupModal";
import {
  Droplets,
  History,
  Settings,
  Plus,
  MoreVertical,
  CheckCircle2,
  Award,
  Flame,
  Zap,
  Clock,
  GlassWater,
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
  Coffee,
  Check,
  AlertCircle,
  Sliders
} from "lucide-react";

interface WaterTrackerProps {
  patient: Patient;
  onAddWater: (patientId: string, amountMl: number) => void;
  onRemoveWaterLog?: (patientId: string, logId: string) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  patient,
  onAddWater,
  onRemoveWaterLog,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"tracker" | "form" | "history" | "analytics" | "achievements" | "settings">("tracker");
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Notifications & Hourly Alert State
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [alertIntervalMins, setAlertIntervalMins] = useState<number>(60);
  const [alertStartTime, setAlertStartTime] = useState<string>("08:00");
  const [alertEndTime, setAlertEndTime] = useState<string>("22:00");
  const [selectedRingtone, setSelectedRingtone] = useState<string>("Water Splash");
  const [customRingtoneName, setCustomRingtoneName] = useState<string>("");
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [activeNotification, setActiveNotification] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>("Time to hydrate! Keep your energy level high.");

  // Daily Goal State
  const [dailyGoalMl, setDailyGoalMl] = useState<number>(patient.waterGoalMl || 2500);

  // Form State for Detailed Water Entry
  const [formAmount, setFormAmount] = useState<number>(250);
  const [formDrinkType, setFormDrinkType] = useState<string>("Plain Water");
  const [formCustomDrink, setFormCustomDrink] = useState<string>("");
  const [formSource, setFormSource] = useState<string>("Bottle");
  const [formCustomSource, setFormCustomSource] = useState<string>("");
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [formNotes, setFormNotes] = useState<string>("");
  const [formTags, setFormTags] = useState<string>("workout, morning");
  const [formPhotoUrl, setFormPhotoUrl] = useState<string | null>(null);
  const [formGpsLocation, setFormGpsLocation] = useState<string>("GPS: 37.7749° N, 122.4194° W");

  // Local Water History State
  const [logs, setLogs] = useState<Array<WaterLog & { drinkType?: string; source?: string; notes?: string; photo?: string }>>([
    { id: "w1", amountMl: 250, time: "08:00 AM", timestamp: Date.now() - 28800000, drinkType: "Plain Water", source: "Glass", notes: "Morning booster" },
    { id: "w2", amountMl: 300, time: "10:30 AM", timestamp: Date.now() - 19800000, drinkType: "Lemon Water", source: "Bottle", notes: "Post-workout" },
    { id: "w3", amountMl: 200, time: "01:15 PM", timestamp: Date.now() - 10000000, drinkType: "Green Tea", source: "Cup", notes: "After lunch" },
    { id: "w4", amountMl: 250, time: "04:00 PM", timestamp: Date.now() - 3600000, drinkType: "Coconut Water", source: "Glass", notes: "Afternoon refreshment" },
  ]);

  // History Filter
  const [historyPeriod, setHistoryPeriod] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Success Feedback Banner
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Synchronize logs with parent patient logs if available
  useEffect(() => {
    if (patient.waterLogs && patient.waterLogs.length > 0) {
      const merged = patient.waterLogs.map((pl) => ({
        ...pl,
        drinkType: "Plain Water",
        source: "Glass",
      }));
      setLogs(merged);
    }
  }, [patient.waterLogs]);

  // Calculate stats
  const currentTotalMl = logs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const percentage = Math.min(100, Math.round((currentTotalMl / dailyGoalMl) * 100));
  const glasses = Math.round(currentTotalMl / 200);

  // Quick Add handler
  const handleQuickAdd = (amount: number, type: string = "Plain Water") => {
    const newLog = {
      id: `w-${Date.now()}`,
      amountMl: amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      drinkType: type,
      source: "Bottle",
    };
    setLogs([newLog, ...logs]);
    onAddWater(patient.id, amount);
    showFeedback(`Logged ${amount}ml of ${type}! Great job staying hydrated.`);
  };

  // Submit Detailed Form
  const handleFormSubmit = (andAnother: boolean = false) => {
    const finalDrink = formDrinkType === "Other" ? (formCustomDrink || "Custom Drink") : formDrinkType;
    const finalSource = formSource === "Other" ? (formCustomSource || "Custom Container") : formSource;

    const newLog = {
      id: `w-${Date.now()}`,
      amountMl: formAmount,
      time: `${formTime}`,
      timestamp: Date.now(),
      drinkType: finalDrink,
      source: finalSource,
      notes: formNotes,
      photo: formPhotoUrl || undefined,
    };

    setLogs([newLog, ...logs]);
    onAddWater(patient.id, formAmount);
    showFeedback(`Successfully saved ${formAmount}ml (${finalDrink}) entry!`);

    if (andAnother) {
      setFormNotes("");
      setFormPhotoUrl(null);
    } else {
      setActiveTab("tracker");
    }
  };

  // SVG Ring calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Drink Type options
  const drinkTypes = [
    { name: "Plain Water", icon: "💧", bg: "bg-cyan-50 border-cyan-200 text-cyan-800" },
    { name: "Sparkling Water", icon: "🧊", bg: "bg-blue-50 border-blue-200 text-blue-800" },
    { name: "Lemon Water", icon: "🍋", bg: "bg-amber-50 border-amber-200 text-amber-800" },
    { name: "Coconut Water", icon: "🥥", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    { name: "Green Tea", icon: "🍵", bg: "bg-teal-50 border-teal-200 text-teal-800" },
    { name: "Fruit Juice", icon: "🧃", bg: "bg-orange-50 border-orange-200 text-orange-800" },
    { name: "Coffee", icon: "☕", bg: "bg-amber-100 border-amber-300 text-amber-900" },
    { name: "Milk", icon: "🥛", bg: "bg-indigo-50 border-indigo-200 text-indigo-800" },
    { name: "Smoothie", icon: "🥤", bg: "bg-purple-50 border-purple-200 text-purple-800" },
    { name: "Protein Shake", icon: "🏋️", bg: "bg-rose-50 border-rose-200 text-rose-800" },
    { name: "Soup / Broth", icon: "🥣", bg: "bg-yellow-50 border-yellow-200 text-yellow-800" },
    { name: "Other", icon: "➕", bg: "bg-slate-100 border-slate-300 text-slate-800" },
  ];

  const sources = ["Bottle", "Glass", "Cup", "Mug", "Jug", "Water Filter", "Tap", "Other"];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Sub-Navigation Menu Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md">
              <Droplets className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Water Drink Notifier
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Hydration, Hourly Alerts & Proof Capture</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSetupOpen(true)}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-[#2E7D32]/30 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Setup Service Features & Options"
            >
              <Sliders className="w-4 h-4 text-[#2E7D32]" />
              <span className="hidden sm:inline">Setup</span>
            </button>
            <button
              onClick={() => {
                setActiveNotification(true);
                setNotificationMsg("⏰ Hydration Alert: Time to drink a glass of water!");
              }}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-[#2E7D32]/30 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Simulate Reminder Alert"
            >
              <Bell className="w-4 h-4 text-[#2E7D32] animate-bounce" />
              <span className="hidden sm:inline">Test Alert</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "tracker" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Droplets className="w-3.5 h-3.5" /> Tracker
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

      {/* Persistent Active Hydration Notification Simulator Banner */}
      {activeNotification && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-4 shadow-xl border border-amber-300 relative overflow-hidden animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
                💧
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-white" /> {notificationMsg}
                </h3>
                <p className="text-[11px] text-amber-100 font-medium">Sound: {selectedRingtone} • Vibration: {vibrationEnabled ? "ON" : "OFF"}</p>
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
                handleQuickAdd(250, "Plain Water");
                setActiveNotification(false);
              }}
              className="flex-1 py-2 bg-white text-amber-900 font-black rounded-xl text-xs shadow-xs hover:bg-amber-50 cursor-pointer text-center"
            >
              💧 Drink 250ml Now
            </button>
            <button
              onClick={() => {
                showFeedback("Alarm snoozed for 15 minutes.");
                setActiveNotification(false);
              }}
              className="px-3 py-2 bg-amber-700/60 hover:bg-amber-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              ⏰ Snooze 15m
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: MAIN TRACKER ==================== */}
      {activeTab === "tracker" && (
        <div className="space-y-4">
          {/* Main Intake Gradient Hero Card */}
          <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold tracking-wider text-cyan-100 uppercase">TODAY'S TOTAL INTAKE</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">{currentTotalMl.toLocaleString()}</span>
                  <span className="text-lg font-bold text-cyan-100">ml</span>
                </div>
                <p className="text-xs text-cyan-100/90 font-bold pt-1">
                  Daily Target: {dailyGoalMl.toLocaleString()} ml ({glasses} glasses)
                </p>
              </div>

              {/* Circular Ring Percentage Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} className="stroke-white/20" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-white transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-lg font-black text-white">{percentage}%</span>
              </div>
            </div>

            {/* Next Scheduled Reminder Countdown Banner */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-cyan-50">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Next Alert: 02:30 PM (in 42 mins)
              </span>
              <button
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${alertsEnabled ? "bg-white text-emerald-800" : "bg-white/20 text-white"}`}
              >
                {alertsEnabled ? "🔔 Alerts Active" : "🔕 Muted"}
              </button>
            </div>
          </div>

          {/* Quick Add Buttons Row (50ml, 100ml, 150ml, 200ml, 250ml, 300ml, 500ml) */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-black text-slate-800">Quick Drink Presets</p>
              <span className="text-[10px] text-slate-400 font-bold">Tap to add instantly</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 150, 200, 250, 300, 400, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickAdd(preset)}
                  className="py-2.5 px-2 bg-cyan-50/80 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-2xl text-xs font-extrabold transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>💧</span> {preset}ml
                </button>
              ))}
            </div>
          </div>

          {/* 3 Mini Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3 text-center shadow-2xs">
              <GlassWater className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">{glasses}</div>
              <p className="text-[9px] font-black tracking-wider text-blue-700 uppercase">GLASSES</p>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3 text-center shadow-2xs">
              <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">Every {alertIntervalMins}m</div>
              <p className="text-[9px] font-black tracking-wider text-amber-700 uppercase">ALERT RATE</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 text-center shadow-2xs">
              <Flame className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-base font-black text-slate-800">5 Days</div>
              <p className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">STREAK</p>
            </div>
          </div>

          {/* Today's Log List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-600" /> Today's Hydration Log ({logs.length})
              </h3>
              <button onClick={() => setActiveTab("history")} className="text-xs font-bold text-cyan-600 hover:underline">
                Full Log
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 border border-dashed rounded-2xl">
                No hydration entries logged today yet.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 font-extrabold flex items-center justify-center text-sm">
                        💧
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                          <span>{log.amountMl} ml</span>
                          <span className="text-[10px] bg-cyan-50 border border-cyan-200 text-cyan-800 px-2 py-0.5 rounded-full font-bold">
                            {log.drinkType || "Plain Water"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{log.time} • Container: {log.source || "Glass"} {log.notes ? `• ${log.notes}` : ""}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setLogs(logs.filter((l) => l.id !== log.id));
                        if (onRemoveWaterLog) onRemoveWaterLog(patient.id, log.id);
                        showFeedback("Removed water log entry.");
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

      {/* ==================== TAB 2: ADD MANUAL ENTRY FORM ==================== */}
      {activeTab === "form" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Add Detailed Water & Drink Log</h2>
              <p className="text-[10px] text-slate-500 font-medium">Capture exact drink volume, container, time & photo proof</p>
            </div>
            <button onClick={() => setActiveTab("tracker")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-4">
            {/* 1. Volume Slider & Manual Field */}
            <div className="bg-cyan-50/60 p-4 rounded-2xl border border-cyan-100 space-y-2">
              <label className="font-extrabold text-slate-800 block text-xs">Drink Volume (ml) *</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="flex-1 accent-cyan-600 cursor-pointer"
                />
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-24 p-2 bg-white border border-cyan-300 rounded-xl font-black text-slate-900 text-center text-base"
                />
              </div>
            </div>

            {/* 2. Drink Type Selection & Custom Other Option */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block text-xs">Select Beverage / Drink Type *</label>
              <div className="grid grid-cols-3 gap-2">
                {drinkTypes.map((dt) => (
                  <button
                    key={dt.name}
                    type="button"
                    onClick={() => setFormDrinkType(dt.name)}
                    className={`p-2 rounded-xl text-left border font-extrabold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${formDrinkType === dt.name ? "bg-cyan-600 text-white border-cyan-700 shadow-xs" : `${dt.bg} hover:opacity-90`}`}
                  >
                    <span>{dt.icon}</span>
                    <span className="truncate">{dt.name}</span>
                  </button>
                ))}
              </div>

              {formDrinkType === "Other" && (
                <input
                  type="text"
                  placeholder="Specify custom drink type..."
                  value={formCustomDrink}
                  onChange={(e) => setFormCustomDrink(e.target.value)}
                  className="w-full p-2.5 mt-2 bg-amber-50 border border-amber-300 rounded-xl font-bold text-xs"
                />
              )}
            </div>

            {/* 3. Container / Source */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block text-xs">Container / Source</label>
              <div className="flex flex-wrap gap-1.5">
                {sources.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setFormSource(src)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${formSource === src ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                  >
                    {src}
                  </button>
                ))}
              </div>

              {formSource === "Other" && (
                <input
                  type="text"
                  placeholder="Specify custom container..."
                  value={formCustomSource}
                  onChange={(e) => setFormCustomSource(e.target.value)}
                  className="w-full p-2.5 mt-1 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              )}
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
                <label className="font-bold text-slate-700 block text-xs mb-1">Notes / Activity Context</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Drank after morning jog, warm lemon tea before sleep..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g., morning, workout, post-lunch"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            {/* 6. Proof Capture (Photo & GPS) */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-800 text-xs block">📸 Photo Proof & GPS Attachment</span>
              <div className="flex gap-2">
                <label className="flex-1 p-3 bg-white border border-slate-200 hover:border-cyan-500 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-xs text-slate-700 transition-all">
                  <Camera className="w-4 h-4 text-cyan-600" />
                  <span>{formPhotoUrl ? "Change Photo" : "Upload Drink Photo"}</span>
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

                <button
                  type="button"
                  onClick={() => setFormGpsLocation("GPS: 37.7749° N, 122.4194° W (Stamped)")}
                  className="px-3 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 flex items-center gap-1 cursor-pointer hover:bg-slate-100"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" /> GPS Stamp
                </button>
              </div>

              {formPhotoUrl && (
                <div className="relative rounded-xl overflow-hidden border max-h-32 bg-slate-900 flex justify-center">
                  <img src={formPhotoUrl} alt="Water Proof" className="h-32 object-cover w-full" />
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
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Drink Log
              </button>

              <button
                type="button"
                onClick={() => handleFormSubmit(true)}
                className="py-3 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: HISTORY & CALENDAR ==================== */}
      {activeTab === "history" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Hydration History & Export</h2>
              <p className="text-[10px] text-slate-500 font-medium">Filter by daily, weekly, or monthly periods</p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => showFeedback("Exported Hydration Report to PDF successfully!")}
                className="p-2 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => showFeedback("Exported Hydration Data to CSV successfully!")}
                className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
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

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-cyan-600" />
            <input
              type="date"
              value={selectedHistoryDate}
              onChange={(e) => setSelectedHistoryDate(e.target.value)}
              className="p-2 bg-slate-50 border rounded-xl font-bold text-xs flex-1"
            />
          </div>

          {/* History Item Cards */}
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs">{log.amountMl} ml ({log.drinkType || "Plain Water"})</span>
                  <p className="text-[10px] text-slate-500 font-medium">{log.time} • Container: {log.source || "Glass"} {log.notes ? `• ${log.notes}` : ""}</p>
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

      {/* ==================== TAB 4: ANALYTICS & CHARTS ==================== */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-600" /> Weekly Hydration Consumption
              </h3>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                Avg: 2.1L / Day
              </span>
            </div>

            {/* Weekly Bars Mock Visualizer */}
            <div className="h-32 flex items-end justify-between gap-2 px-2 pt-2">
              {[
                { day: "Mon", height: "65%", val: "2.1L" },
                { day: "Tue", height: "80%", val: "2.5L" },
                { day: "Wed", height: "50%", val: "1.8L" },
                { day: "Thu", height: "95%", val: "2.8L", active: true },
                { day: "Fri", height: "70%", val: "2.2L" },
                { day: "Sat", height: "60%", val: "1.9L" },
                { day: "Sun", height: "45%", val: "1.5L" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-extrabold text-slate-500">{bar.val}</span>
                  <div className="w-full bg-slate-100 rounded-full flex items-end h-24 overflow-hidden">
                    <div
                      style={{ height: bar.height }}
                      className={`w-full rounded-full transition-all ${bar.active ? "bg-gradient-to-t from-cyan-600 to-teal-400 shadow-xs" : "bg-cyan-200"}`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${bar.active ? "text-cyan-700" : "text-slate-400"}`}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Hydration Insights */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-3 border border-indigo-700">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-amber-300" /> Gemini AI Hydration Insights
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
              "Your water consumption peaks between 08:00 AM and 11:00 AM on workout days. To maintain afternoon energy, consider setting 60-minute reminders between 02:00 PM and 05:00 PM."
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold">
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                <span className="text-indigo-300 block text-[9px]">BEST HYDRATED DAY</span>
                <span>Thursday (2,800 ml)</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                <span className="text-indigo-300 block text-[9px]">COMPLIANCE SCORE</span>
                <span>92% Weekly Average</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: ACHIEVEMENTS & BADGES ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Hydration Milestones & Badges</h2>
              <p className="text-[10px] text-slate-500 font-medium">Earn badges by staying consistently hydrated</p>
            </div>
            <button
              onClick={() => showFeedback("Shared hydration streak with friends!")}
              className="p-2 bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "First Drink", desc: "Logged first glass of water", icon: "💧", unlocked: true },
              { title: "Goal Reached", desc: "Hit 100% daily target", icon: "🎯", unlocked: true },
              { title: "7-Day Streak", desc: "7 consecutive goal days", icon: "🔥", unlocked: true },
              { title: "30-Day Streak", desc: "30 consecutive goal days", icon: "🏆", unlocked: false },
              { title: "Water Expert", desc: "Logged 100 total entries", icon: "🧊", unlocked: true },
              { title: "Early Hydrator", desc: "Drank water before 8 AM", icon: "🌅", unlocked: true },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${badge.unlocked ? "bg-emerald-50/80 border-emerald-200 text-emerald-950" : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"}`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <h4 className="font-black text-xs">{badge.title}</h4>
                <p className="text-[9px] font-bold">{badge.desc}</p>
                <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full ${badge.unlocked ? "bg-emerald-200 text-emerald-900" : "bg-slate-200 text-slate-600"}`}>
                  {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: SETTINGS & ALERTS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900">Hydration & Reminder Settings</h2>
            <p className="text-[10px] text-slate-500 font-medium">Configure daily target, hourly alerts, ringtones & backup</p>
          </div>

          {/* 1. Daily Target Slider */}
          <div className="bg-slate-50 p-3 rounded-2xl border space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-extrabold text-xs text-slate-800">Daily Water Target (ml)</label>
              <span className="font-black text-cyan-700 text-sm">{dailyGoalMl} ml</span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={dailyGoalMl}
              onChange={(e) => setDailyGoalMl(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
          </div>

          {/* 2. Alert Interval & Active Times */}
          <div className="bg-slate-50 p-3 rounded-2xl border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-xs text-slate-800">Hourly Reminder Interval</span>
              <select
                value={alertIntervalMins}
                onChange={(e) => setAlertIntervalMins(Number(e.target.value))}
                className="p-1.5 bg-white border rounded-xl font-bold text-xs"
              >
                <option value={30}>Every 30 Mins</option>
                <option value={45}>Every 45 Mins</option>
                <option value={60}>Every 1 Hour</option>
                <option value={90}>Every 1.5 Hours</option>
                <option value={120}>Every 2 Hours</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Start Alert Time</label>
                <input
                  type="time"
                  value={alertStartTime}
                  onChange={(e) => setAlertStartTime(e.target.value)}
                  className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">End Alert Time</label>
                <input
                  type="time"
                  value={alertEndTime}
                  onChange={(e) => setAlertEndTime(e.target.value)}
                  className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Audio Ringtone & Vibration */}
          <div className="bg-slate-50 p-3 rounded-2xl border space-y-2.5">
            <span className="font-extrabold text-xs text-slate-800 block">Ringtone & Sound Alert</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedRingtone}
                onChange={(e) => setSelectedRingtone(e.target.value)}
                className="p-2 bg-white border rounded-xl font-bold text-xs"
              >
                <option value="Water Splash">💧 Water Splash</option>
                <option value="Gentle Chime">🔔 Gentle Chime</option>
                <option value="Soft Melody">🎵 Soft Melody</option>
                <option value="Custom Audio">🎙️ Custom Sound Upload</option>
              </select>

              <label className="p-2 bg-white border border-dashed rounded-xl font-bold text-[10px] text-slate-700 flex items-center justify-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-cyan-600" />
                {customRingtoneName ? customRingtoneName.slice(0, 10) + "..." : "Upload Sound"}
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCustomRingtoneName(file.name);
                      setSelectedRingtone("Custom Audio");
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700">Vibration Feedback</span>
              <button
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${vibrationEnabled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}
              >
                {vibrationEnabled ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Save Settings */}
          <button
            onClick={() => {
              showFeedback("Settings saved & alert timers recalculated!");
              setActiveTab("tracker");
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      )}

      {/* Service Setup Modal */}
      <ServiceSetupModal
        serviceId="water"
        serviceName="Water Drink Notifier"
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
};

