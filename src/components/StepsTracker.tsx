import React, { useState } from "react";
import { Patient } from "../types";
import {
  Footprints,
  Flame,
  CheckCircle2,
  Plus,
  History,
  Settings as SettingsIcon,
  Award,
  Zap,
  Clock,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Filter,
  Trash2,
  Check,
  Play,
  Pause,
  TrendingUp,
  MapPin,
  Share2,
  Lock,
  LayoutGrid,
  Target,
  Compass,
  Sliders,
  Activity
} from "lucide-react";

export type StepsTab =
  | "dashboard"
  | "log_walk"
  | "goal_setup"
  | "reminders"
  | "history"
  | "analytics"
  | "routes"
  | "milestones"
  | "challenge"
  | "calendar"
  | "settings";

interface StepsTrackerProps {
  patient?: Patient;
  onAddSteps?: (patientId: string, steps: number) => void;
}

export const StepsTracker: React.FC<StepsTrackerProps> = ({ patient, onAddSteps }) => {
  const [activeTab, setActiveTab] = useState<StepsTab>("dashboard");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // State
  const [stepsGoal, setStepsGoal] = useState<number>(10000);
  const [customGoal, setCustomGoal] = useState<number>(8500);
  const [goalMode, setGoalMode] = useState<"recommended" | "custom">("recommended");
  const [currentSteps, setCurrentSteps] = useState<number>(6420);
  const [distanceKm, setDistanceKm] = useState<number>(4.2);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(320);
  const [activeTimeMin, setActiveTimeMin] = useState<number>(52);

  // Form State
  const [formSteps, setFormSteps] = useState<number>(2000);
  const [formDistance, setFormDistance] = useState<number>(1.5);
  const [formDuration, setFormDuration] = useState<number>(20);
  const [formCalories, setFormCalories] = useState<number>(110);
  const [formWalkType, setFormWalkType] = useState<"Outdoor" | "Treadmill" | "Indoor" | "Hike">("Outdoor");

  // Reminders State
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderPattern, setReminderPattern] = useState<"smart" | "fixed" | "custom">("smart");
  const [walkReminders, setWalkReminders] = useState([
    { id: "w1", title: "Morning Walk", time: "6:30 AM", enabled: true },
    { id: "w2", title: "Step Break", time: "10:00 AM", enabled: true },
    { id: "w3", title: "Lunch Walk", time: "1:00 PM", enabled: true },
    { id: "w4", title: "Evening Walk", time: "4:00 PM", enabled: true },
    { id: "w5", title: "Step Break", time: "6:00 PM", enabled: false },
    { id: "w6", title: "Light Walk", time: "8:00 PM", enabled: true },
  ]);

  // Routes Filter & List
  const [routeCategory, setRouteCategory] = useState<"All" | "Nearby" | "Outdoor" | "Scenic">("All");
  const [routesList, setRoutesList] = useState([
    { id: "rt1", title: "Riverside Park Loop", dist: "5.2 km", diff: "Easy", time: "55 min", type: "Scenic" },
    { id: "rt2", title: "City Morning Walk", dist: "3.8 km", diff: "Easy", time: "40 min", type: "Nearby" },
    { id: "rt3", title: "Hill Top Trail", dist: "6.4 km", diff: "Medium", time: "1h 15m", type: "Outdoor" },
    { id: "rt4", title: "Lake View Path", dist: "4.6 km", diff: "Easy", time: "48 min", type: "Scenic" },
  ]);

  // Challenge Tasks State
  const [challengeTasks, setChallengeTasks] = useState([
    { id: "ct1", title: "Morning Walk 3,000 steps", completed: true },
    { id: "ct2", title: "Afternoon Walk 3,000 steps", completed: true },
    { id: "ct3", title: "Evening Walk 2,000 steps", completed: false },
    { id: "ct4", title: "Extra Steps 2,000 steps", completed: false },
  ]);

  const navMenuItems: Array<{ id: StepsTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "log_walk", label: "Log Walk", icon: Footprints },
    { id: "goal_setup", label: "Goal Setup", icon: Sliders },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "history", label: "History", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "routes", label: "Routes", icon: Compass },
    { id: "milestones", label: "Milestones", icon: Award },
    { id: "challenge", label: "Challenge", icon: Target },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
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

      {/* TOP HEADER */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Walk & Steps Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Steps & Daily Movement
            </h1>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("log_walk")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Start Walk</span>
        </button>
      </div>

      {/* HORIZONTAL SCROLLING MENU */}
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

      {/* SCREEN 1: STEPS DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Progress</span>
                <p className="text-sm font-black text-slate-800">14 May 2025</p>
              </div>
              <button
                onClick={() => showNotification("Step summary ready to share")}
                className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Share</span>
              </button>
            </div>

            {/* Circular Gauge */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
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
                    strokeDashoffset={427 * (1 - currentSteps / stepsGoal)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{currentSteps.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-400">/ {stepsGoal.toLocaleString()} steps</span>
                  <span className="text-xs font-black text-[#FF5A36] mt-0.5">64%</span>
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="space-y-2.5 w-full sm:w-auto">
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Distance</span>
                    <p className="text-sm font-black text-slate-900">{distanceKm} km</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Calories</span>
                    <p className="text-sm font-black text-slate-900">{caloriesBurned} kcal</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Active Time</span>
                    <p className="text-sm font-black text-slate-900">{activeTimeMin} min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak & Status Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-orange-50/70 border border-orange-200/60 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Step Streak</span>
                  <p className="text-sm font-black text-slate-900">7 Days</p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                  <p className="text-sm font-black text-emerald-800">On Track</p>
                </div>
              </div>
            </div>

            {/* Next Reminder Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF5A36]" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Next Reminder</span>
                  <p className="text-xs font-black text-slate-800">Step Break at 4:00 PM</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("reminders")}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Change
              </button>
            </div>

            <button
              onClick={() => setActiveTab("log_walk")}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Start Walk</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOG WALK */}
      {activeTab === "log_walk" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-900">Log Walk</h2>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
              <ChevronLeft className="w-4 h-4 cursor-pointer" />
              <span>Today, 14 May 2025</span>
              <ChevronRight className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Steps</span>
                <input
                  type="number"
                  value={formSteps}
                  onChange={(e) => setFormSteps(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-black text-slate-900 bg-transparent border-b border-orange-300 focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Distance (km)</span>
                <input
                  type="number"
                  step="0.1"
                  value={formDistance}
                  onChange={(e) => setFormDistance(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-black text-slate-900 bg-transparent border-b border-orange-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Duration (min)</span>
                <input
                  type="number"
                  value={formDuration}
                  onChange={(e) => setFormDuration(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-black text-slate-900 bg-transparent border-b border-orange-300 focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-[#FFF9F5] border border-orange-200 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Calories (kcal)</span>
                <input
                  type="number"
                  value={formCalories}
                  onChange={(e) => setFormCalories(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-black text-slate-900 bg-transparent border-b border-orange-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Walk Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Walk Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Outdoor", "Treadmill", "Indoor", "Hike"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormWalkType(type)}
                    className={`py-2 rounded-2xl text-xs font-bold transition-all border ${
                      formWalkType === type
                        ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentSteps((prev) => prev + formSteps);
                setDistanceKm((prev) => parseFloat((prev + formDistance).toFixed(1)));
                setCaloriesBurned((prev) => prev + formCalories);
                setActiveTimeMin((prev) => prev + formDuration);
                showNotification(`Added ${formSteps} steps!`);
                setActiveTab("dashboard");
              }}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
            >
              Save Walk
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: GOAL SETUP */}
      {activeTab === "goal_setup" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">What's your step goal?</h2>

          <div className="space-y-3">
            <div
              onClick={() => setGoalMode("recommended")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                goalMode === "recommended" ? "bg-orange-50/70 border-[#FF5A36] shadow-xs" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <span className="text-xs font-black text-slate-900 block">Recommended Goal</span>
                <span className="text-[11px] text-slate-500 block">Based on health guidelines</span>
                <span className="text-xl font-black text-[#FF5A36] mt-1 block">10,000 <span className="text-xs font-bold text-slate-400">Steps / Day</span></span>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${goalMode === "recommended" ? "text-[#FF5A36]" : "text-slate-300"}`} />
            </div>

            <div
              onClick={() => setGoalMode("custom")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                goalMode === "custom" ? "bg-orange-50/70 border-[#FF5A36] shadow-xs" : "bg-white border-slate-200"
              }`}
            >
              <span className="text-xs font-black text-slate-900 block mb-1">Custom Goal</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="3000"
                  max="25000"
                  step="500"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(parseInt(e.target.value))}
                  className="flex-1 accent-[#FF5A36]"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">{customGoal.toLocaleString()} steps</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setStepsGoal(goalMode === "recommended" ? 10000 : customGoal);
              showNotification("Step goal updated!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Goal
          </button>
        </div>
      )}

      {/* SCREEN 4: REMINDERS SETUP */}
      {activeTab === "reminders" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Reminders</h2>
              <p className="text-xs text-slate-500">Automate your step notifications.</p>
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

          <div className="space-y-3">
            {walkReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-900">{rem.title}</h4>
                  <p className="text-[10px] text-slate-500">{rem.time}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rem.enabled}
                  onChange={() => {
                    setWalkReminders((prev) =>
                      prev.map((r) => (r.id === rem.id ? { ...r, enabled: !r.enabled } : r))
                    );
                  }}
                  className="accent-[#FF5A36] w-4 h-4 cursor-pointer"
                />
              </div>
            ))}
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

      {/* SCREEN 5: HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Step History</h2>
            <span className="text-xs font-black text-slate-800">May 2025</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Steps</span>
              <p className="text-sm font-black text-slate-900">8,320</p>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Best Day</span>
              <p className="text-sm font-black text-slate-900">14,528</p>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Distance</span>
              <p className="text-sm font-black text-[#FF5A36]">86.4 km</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">Analytics</h2>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <span className="text-xs font-black text-slate-800 block">7 Days Movement</span>
            <div className="h-32 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
              {[
                { day: "Mon", steps: 9200 },
                { day: "Tue", steps: 11400 },
                { day: "Wed", steps: 8300 },
                { day: "Thu", steps: 10200 },
                { day: "Fri", steps: 9600 },
                { day: "Sat", steps: 14500 },
                { day: "Sun", steps: 6420 },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[24px] bg-[#FF5A36] rounded-t-md"
                    style={{ height: `${(bar.steps / 15000) * 100}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 7: ROUTES */}
      {activeTab === "routes" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Walking Routes</h2>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {(["All", "Nearby", "Outdoor", "Scenic"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setRouteCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    routeCategory === cat ? "bg-[#FF5A36] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {routesList
              .filter((r) => routeCategory === "All" || r.type === routeCategory)
              .map((route) => (
                <div
                  key={route.id}
                  className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:border-orange-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{route.title}</h4>
                      <p className="text-[11px] text-slate-500">{route.dist} • {route.time} • {route.diff}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showNotification(`Started route: ${route.title}`)}
                    className="px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl"
                  >
                    Start
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SCREEN 8: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Achievements</h2>

          <div className="space-y-3">
            {[
              { title: "First Steps", desc: "Completed your first 5,000 steps", completed: true, badge: "👟" },
              { title: "Step Starter", desc: "Hit 10,000 steps in a day", completed: true, badge: "⚡" },
              { title: "7-Day Walker", desc: "Hit daily goal for 7 consecutive days", completed: true, badge: "🔥" },
              { title: "21-Day Walker", desc: "21 days habit formation", progress: "18/21", completed: false, badge: "🏆" },
              { title: "30-Day Champion", desc: "30 days consistency", locked: true, badge: "🔒" },
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
                  {m.progress && !m.completed && (
                    <span className="text-xs font-black text-[#FF5A36] bg-orange-100 px-2.5 py-1 rounded-xl">
                      {m.progress}
                    </span>
                  )}
                  {m.locked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 9: CHALLENGE */}
      {activeTab === "challenge" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div>
            <span className="text-[11px] font-black text-[#FF5A36] uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full">
              Day 7 of 21 • Foundation Phase (33%)
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-2">Daily Step Challenge</h2>
            <p className="text-xs text-slate-500">Target: 10,000 steps per day</p>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Today's Tasks</span>
            {challengeTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  setChallengeTasks((prev) =>
                    prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                  );
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  task.completed ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className={`text-xs font-bold ${task.completed ? "text-emerald-900" : "text-slate-800"}`}>
                  {task.title}
                </span>
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    task.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 10: CALENDAR */}
      {activeTab === "calendar" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Step Calendar</h2>
            <span className="text-xs font-black text-slate-800">May 2025</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {/* Render 31 days with step stats */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const stepsK = (6 + ((day * 3) % 9)).toFixed(1) + "K";
              return (
                <div
                  key={day}
                  className={`p-1.5 rounded-xl border text-center ${
                    day === 14 ? "bg-[#FF5A36] text-white border-[#FF5A36] font-black" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-black block">{day}</span>
                  <span className="text-[9px] block opacity-80">{stepsK}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 11: SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Step Settings</h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Daily Step Goal</span>
              <span className="font-black text-slate-900">{stepsGoal.toLocaleString()} steps</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Units</span>
              <span className="font-black text-slate-900">Kilometers (km)</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Reminders</span>
              <span className="font-black text-emerald-600">5 Active</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => showNotification("Step data exported")}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200"
            >
              Export Walk Data
            </button>
            <button
              onClick={() => showNotification("Step data reset")}
              className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs hover:bg-rose-100"
            >
              Reset Walk Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
