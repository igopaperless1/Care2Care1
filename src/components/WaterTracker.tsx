import React, { useState } from "react";
import { Patient, WaterLog } from "../types";
import {
  Droplets,
  Plus,
  History,
  Settings as SettingsIcon,
  Award,
  Flame,
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
  CheckCircle2,
  Lock,
  LayoutGrid,
  Target,
  Sliders,
  Share2,
  Sun,
  Moon,
  Coffee,
  Activity
} from "lucide-react";

export type WaterTab =
  | "dashboard"
  | "add_water"
  | "goal_setup"
  | "reminders"
  | "history"
  | "analytics"
  | "calendar"
  | "milestones"
  | "challenge"
  | "settings";

interface WaterTrackerProps {
  patient: Patient;
  onAddWater: (patientId: string, amountMl: number) => void;
  onRemoveWaterLog?: (patientId: string, logId: string) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  patient,
  onAddWater,
}) => {
  const [activeTab, setActiveTab] = useState<WaterTab>("dashboard");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // State
  const [dailyGoalMl, setDailyGoalMl] = useState<number>(2500);
  const [customGoalMl, setCustomGoalMl] = useState<number>(2200);
  const [goalMode, setGoalMode] = useState<"recommended" | "custom">("recommended");
  const [consumedMl, setConsumedMl] = useState<number>(1400);

  // Form State
  const [formAmountMl, setFormAmountMl] = useState<number>(250);
  const [formDrinkType, setFormDrinkType] = useState<"Water" | "Tea" | "Juice" | "Coffee">("Water");
  const [formTime, setFormTime] = useState<string>("10:30 AM");
  const [formUnit, setFormUnit] = useState<"ml" | "L" | "oz" | "cups">("ml");

  // Timeline Logs
  const [timelineLogs, setTimelineLogs] = useState<Array<{ id: string; time: string; amount: number; drink: string }>>([
    { id: "w1", time: "8:00 AM", amount: 250, drink: "Water" },
    { id: "w2", time: "10:30 AM", amount: 300, drink: "Lemon Water" },
    { id: "w3", time: "1:15 PM", amount: 250, drink: "Green Tea" },
    { id: "w4", time: "4:00 PM", amount: 300, drink: "Water" },
    { id: "w5", time: "6:00 PM", amount: 300, drink: "Water" },
  ]);

  // Reminders
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderPattern, setReminderPattern] = useState<"smart" | "fixed" | "custom">("fixed");
  const [fixedReminders, setFixedReminders] = useState([
    { id: "r1", time: "8:00 AM", amount: "250 ml", enabled: true },
    { id: "r2", time: "10:00 AM", amount: "250 ml", enabled: true },
    { id: "r3", time: "12:00 PM", amount: "250 ml", enabled: true },
    { id: "r4", time: "2:00 PM", amount: "250 ml", enabled: true },
    { id: "r5", time: "4:00 PM", amount: "250 ml", enabled: true },
    { id: "r6", time: "6:00 PM", amount: "250 ml", enabled: true },
    { id: "r7", time: "8:00 PM", amount: "250 ml", enabled: true },
  ]);

  // Challenge Tasks State
  const [challengeTasks, setChallengeTasks] = useState([
    { id: "ct1", title: "500ml after waking up", completed: true },
    { id: "ct2", title: "500ml before lunch", completed: true },
    { id: "ct3", title: "500ml in the afternoon", completed: true },
    { id: "ct4", title: "500ml before evening", completed: false },
  ]);

  const navMenuItems: Array<{ id: WaterTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "add_water", label: "Add Water", icon: Droplets },
    { id: "goal_setup", label: "Goal Setup", icon: Sliders },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "history", label: "History", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "milestones", label: "Milestones", icon: Award },
    { id: "challenge", label: "Challenge", icon: Target },
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
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Water Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Hydration & Water Intake
            </h1>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("add_water")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Water</span>
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

      {/* SCREEN 1: WATER DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Water Goal</span>
                <p className="text-sm font-black text-slate-800">14 May 2025</p>
              </div>
              <button
                onClick={() => showNotification("Hydration summary ready to share")}
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
                    strokeDashoffset={427 * (1 - consumedMl / dailyGoalMl)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{(consumedMl / 1000).toFixed(1)}L</span>
                  <span className="text-[10px] font-bold text-slate-400">/ {(dailyGoalMl / 1000).toFixed(1)}L</span>
                  <span className="text-xs font-black text-[#FF5A36] mt-0.5">
                    {Math.round((consumedMl / dailyGoalMl) * 100)}%
                  </span>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="space-y-2.5 w-full sm:w-auto">
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target</div>
                  <div className="text-sm font-black text-slate-900">{(dailyGoalMl / 1000).toFixed(1)} L</div>
                </div>
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Consumed</div>
                  <div className="text-sm font-black text-slate-900">{(consumedMl / 1000).toFixed(1)} L</div>
                </div>
                <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Remaining</div>
                  <div className="text-sm font-black text-[#FF5A36]">{((dailyGoalMl - consumedMl) / 1000).toFixed(1)} L</div>
                </div>
              </div>
            </div>

            {/* Quick Add Pills */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Quick Add</span>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "+250ml", amount: 250 },
                  { label: "+500ml", amount: 500 },
                  { label: "+750ml", amount: 750 },
                  { label: "+1L", amount: 1000 },
                  { label: "Custom", amount: 0, custom: true },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (btn.custom) {
                        setActiveTab("add_water");
                      } else {
                        setConsumedMl((prev) => prev + btn.amount);
                        onAddWater(patient.id, btn.amount);
                        setTimelineLogs((prev) => [
                          { id: `w-${Date.now()}`, time: "Just now", amount: btn.amount, drink: "Water" },
                          ...prev,
                        ]);
                        showNotification(`Added ${btn.label} of water!`);
                      }
                    }}
                    className="py-2.5 rounded-2xl bg-orange-50/70 border border-orange-200 hover:bg-[#FF5A36] hover:text-white text-slate-800 text-xs font-black transition-all cursor-pointer text-center"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Reminder */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF5A36]" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Next Reminder</span>
                  <p className="text-xs font-black text-slate-800">Drink 250ml in 35 minutes</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("reminders")}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Change
              </button>
            </div>

            {/* Today's Timeline */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Today's Timeline</span>
              <div className="space-y-2">
                {timelineLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                        <Droplets className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900">{log.drink}</span>
                        <span className="text-[10px] text-slate-400 block">{log.time}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">+{log.amount} ml</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab("add_water")}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Water</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: ADD WATER */}
      {activeTab === "add_water" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-900">Log Water</h2>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
              <ChevronLeft className="w-4 h-4 cursor-pointer" />
              <span>Today, 14 May 2025</span>
              <ChevronRight className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            {/* Big Amount Selector */}
            <div className="p-6 bg-[#FFF9F5] border border-orange-200 rounded-3xl text-center space-y-3">
              <span className="text-xs font-bold text-slate-500">Amount to log</span>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setFormAmountMl((prev) => Math.max(50, prev - 50))}
                  className="w-10 h-10 rounded-2xl bg-white border border-orange-200 text-slate-800 font-black text-lg hover:bg-orange-100 cursor-pointer shadow-xs"
                >
                  -
                </button>
                <div className="text-3xl font-black text-[#FF5A36]">
                  {formAmountMl} <span className="text-sm font-bold text-slate-500">{formUnit}</span>
                </div>
                <button
                  onClick={() => setFormAmountMl((prev) => prev + 50)}
                  className="w-10 h-10 rounded-2xl bg-white border border-orange-200 text-slate-800 font-black text-lg hover:bg-orange-100 cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {[100, 250, 500, 750, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFormAmountMl(amt)}
                  className={`py-2 rounded-2xl text-xs font-bold transition-all border ${
                    formAmountMl === amt
                      ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {amt}ml
                </button>
              ))}
            </div>

            {/* Drink Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Drink Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Water", "Tea", "Juice", "Coffee"] as const).map((drink) => (
                  <button
                    key={drink}
                    type="button"
                    onClick={() => setFormDrinkType(drink)}
                    className={`py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                      formDrinkType === drink
                        ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setConsumedMl((prev) => prev + formAmountMl);
                onAddWater(patient.id, formAmountMl);
                setTimelineLogs((prev) => [
                  { id: `w-${Date.now()}`, time: formTime, amount: formAmountMl, drink: formDrinkType },
                  ...prev,
                ]);
                showNotification(`Logged ${formAmountMl} ml of ${formDrinkType}!`);
                setActiveTab("dashboard");
              }}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
            >
              Add Water
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: GOAL SETUP */}
      {activeTab === "goal_setup" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">What's your water goal?</h2>

          <div className="space-y-3">
            <div
              onClick={() => setGoalMode("recommended")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                goalMode === "recommended" ? "bg-orange-50/70 border-[#FF5A36] shadow-xs" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <span className="text-xs font-black text-slate-900 block">Recommended Goal</span>
                <span className="text-[11px] text-slate-500 block">Based on weight & activity</span>
                <span className="text-xl font-black text-[#FF5A36] mt-1 block">2.5 <span className="text-xs font-bold text-slate-400">L / Day</span></span>
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
                  min="1000"
                  max="5000"
                  step="100"
                  value={customGoalMl}
                  onChange={(e) => setCustomGoalMl(parseInt(e.target.value))}
                  className="flex-1 accent-[#FF5A36]"
                />
                <span className="text-sm font-black text-slate-900 w-24 text-right">{(customGoalMl / 1000).toFixed(1)} L / day</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setDailyGoalMl(goalMode === "recommended" ? 2500 : customGoalMl);
              showNotification("Water goal updated!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Water Goal
          </button>
        </div>
      )}

      {/* SCREEN 4: REMINDERS SETUP */}
      {activeTab === "reminders" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Reminders</h2>
              <p className="text-xs text-slate-500">Hydration alerts to keep you energized.</p>
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

          <div className="space-y-2.5">
            {fixedReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-900">{rem.time}</h4>
                  <p className="text-[10px] text-slate-500">Target: {rem.amount}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rem.enabled}
                  onChange={() => {
                    setFixedReminders((prev) =>
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
            <h2 className="text-lg font-black text-slate-900">Hydration History</h2>
            <span className="text-xs font-black text-slate-800">May 2025</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Intake</span>
              <p className="text-sm font-black text-[#FF5A36]">52.4 L</p>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg / Day</span>
              <p className="text-sm font-black text-slate-900">1.75 L</p>
            </div>
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Best Day</span>
              <p className="text-sm font-black text-emerald-600">2.8 L</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">Analytics</h2>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <span className="text-xs font-black text-slate-800 block">7 Days Hydration</span>
            <div className="h-32 flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
              {[
                { day: "Mon", ml: 2400 },
                { day: "Tue", ml: 2500 },
                { day: "Wed", ml: 2100 },
                { day: "Thu", ml: 2800 },
                { day: "Fri", ml: 2200 },
                { day: "Sat", ml: 2500 },
                { day: "Sun", ml: 1400 },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[24px] bg-[#FF5A36] rounded-t-md"
                    style={{ height: `${(bar.ml / 3000) * 100}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-500">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 7: CALENDAR */}
      {activeTab === "calendar" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Hydration Calendar</h2>
            <span className="text-xs font-black text-slate-800">May 2025</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const pct = 60 + ((day * 7) % 41);
              return (
                <div
                  key={day}
                  className={`p-1.5 rounded-xl border text-center ${
                    day === 14 ? "bg-[#FF5A36] text-white border-[#FF5A36] font-black" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-black block">{day}</span>
                  <span className="text-[9px] block opacity-80">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 8: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Achievements</h2>

          <div className="space-y-3">
            {[
              { title: "First Drop", desc: "Logged first glass of water", completed: true, badge: "💧" },
              { title: "Hydration Starter", desc: "Hit 2.5L goal in a day", completed: true, badge: "⚡" },
              { title: "7-Day Hydration", desc: "Met daily goal for 7 consecutive days", completed: true, badge: "🔥" },
              { title: "21-Day Hydration", desc: "21 days habit formation", progress: "18/21", completed: false, badge: "🏆" },
              { title: "30-Day Consistency", desc: "30 days hydration streak", locked: true, badge: "🔒" },
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
            <h2 className="text-lg font-black text-slate-900 mt-2">Hydration Challenge</h2>
            <p className="text-xs text-slate-500">Target: 2.0L per day</p>
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

      {/* SCREEN 10: SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Water Settings</h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Daily Water Goal</span>
              <span className="font-black text-slate-900">{(dailyGoalMl / 1000).toFixed(1)} Liters</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Units</span>
              <span className="font-black text-slate-900">Milliliters (ml) / Liters (L)</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Reminders</span>
              <span className="font-black text-emerald-600">7 Active</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => showNotification("Hydration data exported")}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200"
            >
              Export Water Data
            </button>
            <button
              onClick={() => showNotification("Water data reset")}
              className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs hover:bg-rose-100"
            >
              Reset Water Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
