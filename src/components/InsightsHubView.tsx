import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Calendar,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Footprints,
  Moon,
  Pill,
  CreditCard,
  Heart,
  Smile,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Patient } from "../types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface InsightsHubViewProps {
  patient?: Patient;
  onNavigateToCareSubTab?: (subTab: string) => void;
}

export const InsightsHubView: React.FC<InsightsHubViewProps> = ({
  patient,
  onNavigateToCareSubTab
}) => {
  const [selectedPastRange, setSelectedPastRange] = useState<"yesterday" | "7d" | "30d" | "monthly">("7d");

  // Today's Real-time Values
  const todayWater = patient?.waterCurrentMl || 1400;
  const todayWaterGoal = patient?.waterGoalMl || 2500;
  const todayWaterPercent = Math.min(100, Math.round((todayWater / todayWaterGoal) * 100));

  const todaySteps = 6420;
  const todayStepsGoal = 8000;
  const todayStepsPercent = Math.min(100, Math.round((todaySteps / todayStepsGoal) * 100));

  // 7-Day Trend Chart Data
  const trendData7D = [
    { day: "Mon", score: 82, water: 2200, steps: 7100, sleep: 7.2, systolic: 118 },
    { day: "Tue", score: 88, water: 2400, steps: 8300, sleep: 7.8, systolic: 116 },
    { day: "Wed", score: 76, water: 1800, steps: 6200, sleep: 6.5, systolic: 122 },
    { day: "Thu", score: 94, water: 2500, steps: 9100, sleep: 8.1, systolic: 115 },
    { day: "Fri", score: 90, water: 2450, steps: 8400, sleep: 7.6, systolic: 117 },
    { day: "Sat", score: 85, water: 2100, steps: 7800, sleep: 8.4, systolic: 119 },
    { day: "Sun (Today)", score: 91, water: todayWater, steps: todaySteps, sleep: 7.5, systolic: 118 }
  ];

  // 30-Day Trend Chart Data
  const trendData30D = [
    { day: "W1", score: 79, avgWater: 2100, avgSteps: 6800 },
    { day: "W2", score: 84, avgWater: 2250, avgSteps: 7400 },
    { day: "W3", score: 89, avgWater: 2400, avgSteps: 8100 },
    { day: "W4", score: 92, avgWater: 2480, avgSteps: 8600 }
  ];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden border border-indigo-800/40">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-black uppercase tracking-wider text-indigo-200">
              Analytics & Predictive Engine
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              ✓ 91% Daily Health Score
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Comprehensive Insights Hub
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 font-medium max-w-xl">
            Real-time biometric tracking for Today, scrollable historic trends for the Past, and predictive AI forecasting for the Future.
          </p>
        </div>

        {/* Decorative Background Icons */}
        <div className="absolute -right-6 -bottom-6 text-8xl text-white/5 select-none pointer-events-none">
          📊
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SCROLLABLE SECTION 1: TODAY'S LIVE INSIGHTS */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#FF6A45] flex items-center justify-center font-black text-sm">
              ⚡
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                1. Today's Real-Time Insights & Vitals
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Live metrics synced from your daily routines, vitals and activities
              </p>
            </div>
          </div>
          <span className="text-[11px] font-black text-[#FF6A45]">Live Today</span>
        </div>

        {/* Horizontal Right-to-Left Scrollable Metrics Carousel */}
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 px-0.5">
          {/* Card 1: Health Adherence Score */}
          <div className="min-w-[240px] max-w-[260px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Overall Score</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-black text-xs">
                91%
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Optimal</h3>
              <p className="text-xs text-slate-500 font-medium">5/6 routines completed</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "91%" }} />
            </div>
          </div>

          {/* Card 2: Water Hydration */}
          <div
            onClick={() => onNavigateToCareSubTab?.("water")}
            className="min-w-[240px] max-w-[260px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between shrink-0 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Hydration</span>
              <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xs">
                💧
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {(todayWater / 1000).toFixed(1)}L / {(todayWaterGoal / 1000).toFixed(1)}L
              </h3>
              <p className="text-xs text-sky-600 font-bold">{todayWaterPercent}% of daily goal</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${todayWaterPercent}%` }} />
            </div>
          </div>

          {/* Card 3: Steps Activity */}
          <div
            onClick={() => onNavigateToCareSubTab?.("steps")}
            className="min-w-[240px] max-w-[260px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between shrink-0 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Activity</span>
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                🚶
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {todaySteps.toLocaleString()} Steps
              </h3>
              <p className="text-xs text-blue-600 font-bold">{todayStepsPercent}% of 8,000 goal</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${todayStepsPercent}%` }} />
            </div>
          </div>

          {/* Card 4: Blood Pressure & SpO2 */}
          <div
            onClick={() => onNavigateToCareSubTab?.("vitals")}
            className="min-w-[240px] max-w-[260px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between shrink-0 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Vitals & SpO2</span>
              <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xs">
                🩺
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                118/78 <span className="text-sm font-bold text-slate-400">mmHg</span>
              </h3>
              <p className="text-xs text-rose-600 font-bold">SpO2: 98% • Pulse: 72 bpm</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 className="w-3 h-3" /> Normal Range
            </div>
          </div>

          {/* Card 5: Sleep Quality */}
          <div
            onClick={() => onNavigateToCareSubTab?.("sleep")}
            className="min-w-[240px] max-w-[260px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between shrink-0 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Sleep</span>
              <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                🌙
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                7h 45m
              </h3>
              <p className="text-xs text-indigo-600 font-bold">Deep Sleep: 2h 10m (88%)</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "88%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCROLLABLE SECTION 2: PAST HISTORIC INSIGHTS (SCROLLABLE BACK IN TIME) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-black text-sm">
              📈
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                2. Past Historic Insights & Trend Curves
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Scroll back across previous days, weeks and monthly averages
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {(["yesterday", "7d", "30d", "monthly"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedPastRange(range)}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedPastRange === range
                    ? "bg-[#FF6A45] text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {range === "yesterday"
                  ? "Yesterday"
                  : range === "7d"
                  ? "Last 7 Days"
                  : range === "30d"
                  ? "Last 30 Days"
                  : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Historic Trend Chart Container */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Weekly Health Score & Biometric Consistency
              </h3>
              <p className="text-[11px] text-slate-500">
                Average Score: <strong className="text-emerald-600">86.7%</strong> (Up +4.2% from prior period)
              </p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
              <ArrowUpRight className="w-4 h-4" /> +4.2%
            </div>
          </div>

          {/* Chart View */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData7D} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6A45" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF6A45" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700 }} stroke="#94A3B8" />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fontWeight: 700 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "1rem",
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: 800
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#FF6A45"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Past History Quick Cards Carousel */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="min-w-[170px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Hydration</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">2.28 L / day</p>
              <span className="text-[10px] text-emerald-600 font-bold">92% Consistency</span>
            </div>
            <div className="min-w-[170px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Daily Steps</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">7,900 steps</p>
              <span className="text-[10px] text-emerald-600 font-bold">55,300 total steps</span>
            </div>
            <div className="min-w-[170px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Blood Pressure</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">117 / 77 mmHg</p>
              <span className="text-[10px] text-emerald-600 font-bold">In Target Zone</span>
            </div>
            <div className="min-w-[170px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Medication Taken</span>
              <p className="text-sm font-black text-slate-900 dark:text-white">100% Adherence</p>
              <span className="text-[10px] text-emerald-600 font-bold">14/14 Doses</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SCROLLABLE SECTION 3: FUTURE PREDICTIVE FORECAST (LOCKED / PREVIEW) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black text-sm">
              🔮
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>3. Future Predictive AI Forecasting</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked Preview
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                AI foresight activates automatically after 14 days of sustained routine logs
              </p>
            </div>
          </div>
          <span className="text-[11px] font-black text-purple-600">
            Predictive Engine
          </span>
        </div>

        {/* Horizontal Right-to-Left Scrollable Locked Predictive Cards */}
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 px-0.5">
          {/* Predictive Card 1: 14-Day Vitals Anomaly Forecaster */}
          <div className="min-w-[260px] max-w-[280px] p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700 shadow-2xs flex flex-col justify-between shrink-0 relative overflow-hidden group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  🩺
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                14-Day Vitals & Anomaly Forecast
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-detects fatigue spikes, elevated blood pressure patterns, and predicts hydration shortfalls before symptoms appear.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400">
              Requires 7 more days of logs
            </div>
          </div>

          {/* Predictive Card 2: Cash Flow & Expense Forecaster */}
          <div className="min-w-[260px] max-w-[280px] p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700 shadow-2xs flex flex-col justify-between shrink-0 relative overflow-hidden group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  💰
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                30-Day Cash Flow & Bill Forecaster
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Projects recurring subscription renewals, utility cycles, salary cash-flow balances and optimizes household budgets.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400">
              Unlocks with Bill Sync
            </div>
          </div>

          {/* Predictive Card 3: 21-Day Habit Mastery Projection */}
          <div className="min-w-[260px] max-w-[280px] p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700 shadow-2xs flex flex-col justify-between shrink-0 relative overflow-hidden group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  🏆
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Habit Retention & Dopamine Curve
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculates likelihood of permanent neural habit formation and triggers proactive coaching nudges during high-relapse hours.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400">
              Unlocks at Day 21
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
