import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Sparkles,
  Trophy,
  Coins,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Play,
  RotateCcw,
  Compass,
  AlertTriangle,
  Gift,
  Award,
  AlertCircle,
  Activity,
  BarChart3,
  HeartPulse
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { HabitChallenge, ChallengeDayTask, UrgeLog } from "../types";
import { ScratchCard } from "./ScratchCard";
import { HabitEncouragementModal } from "./HabitEncouragementModal";
import { PenaltyModal } from "./PenaltyModal";
import { PositiveWheel } from "./PositiveWheel";
import { UrgeModal } from "./UrgeModal";
import { WeeklyBehaviorSummaryCard } from "./WeeklyBehaviorSummaryCard";
import { PRESET_CHALLENGES, getInitialChallenges } from "../data/challengePresets";
import {
  triggerHapticFeedback,
  logUrgeEpisodeAndAwardPoints,
  recordDailyBehaviorMetric
} from "../lib/supabaseHabits";

interface DailyHabitScratchHeroWidgetProps {
  onNavigateToChallengesHub: () => void;
  onOpenWheel?: () => void;
}

export const DailyHabitScratchHeroWidget: React.FC<DailyHabitScratchHeroWidgetProps> = ({
  onNavigateToChallengesHub,
  onOpenWheel
}) => {
  const [challenges, setChallenges] = useState<HabitChallenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<HabitChallenge | null>(null);
  const [userCoins, setUserCoins] = useState<number>(50);
  const [userFreezeTokens, setUserFreezeTokens] = useState<number>(2);

  // Modals state
  const [showScratchModal, setShowScratchModal] = useState<boolean>(false);
  const [showEncouragementModal, setShowEncouragementModal] = useState<boolean>(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState<boolean>(false);
  const [showWheelModal, setShowWheelModal] = useState<boolean>(false);
  const [showUrgeModal, setShowUrgeModal] = useState<boolean>(false);
  const [lastPointsEarned, setLastPointsEarned] = useState<number>(2);

  // Daily Spin Status
  const [alreadySpunToday, setAlreadySpunToday] = useState<boolean>(() => {
    try {
      const lastSpin = localStorage.getItem("care2care_last_daily_spin");
      const today = new Date().toISOString().split("T")[0];
      return lastSpin === today;
    } catch {
      return false;
    }
  });

  // Load from localStorage
  const loadData = () => {
    try {
      const saved = localStorage.getItem("care2care_habit_challenges");
      if (saved) {
        const parsed = JSON.parse(saved);
        setChallenges(parsed);
        const active = parsed.find((c: HabitChallenge) => c.status === "Active") || parsed[0] || null;
        setActiveChallenge(active);
      } else {
        const initial = getInitialChallenges();
        localStorage.setItem("care2care_habit_challenges", JSON.stringify(initial));
        setChallenges(initial);
        setActiveChallenge(initial[0]);
      }

      const savedCoins = localStorage.getItem("care2care_habit_coins") || localStorage.getItem("care2care_user_coins");
      if (savedCoins) setUserCoins(parseInt(savedCoins, 10));

      const savedTokens = localStorage.getItem("care2care_habit_freeze_tokens") || localStorage.getItem("care2care_user_freeze_tokens");
      if (savedTokens) setUserFreezeTokens(parseInt(savedTokens, 10));

      const lastSpin = localStorage.getItem("care2care_last_daily_spin");
      const today = new Date().toISOString().split("T")[0];
      setAlreadySpunToday(lastSpin === today);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const saveChallenges = (updated: HabitChallenge[]) => {
    setChallenges(updated);
    localStorage.setItem("care2care_habit_challenges", JSON.stringify(updated));
    const active = updated.find((c) => c.id === activeChallenge?.id) || updated[0] || null;
    setActiveChallenge(active);
  };

  const updateCoins = (amount: number) => {
    const next = Math.max(0, userCoins + amount);
    setUserCoins(next);
    localStorage.setItem("care2care_habit_coins", next.toString());
    localStorage.setItem("care2care_user_coins", next.toString());
  };

  const updateFreezeTokens = (amount: number) => {
    const next = Math.max(0, userFreezeTokens + amount);
    setUserFreezeTokens(next);
    localStorage.setItem("care2care_habit_freeze_tokens", next.toString());
    localStorage.setItem("care2care_user_freeze_tokens", next.toString());
  };

  const handleStartPreset = (presetId: string) => {
    const preset = PRESET_CHALLENGES.find((p) => p.id === presetId);
    if (!preset) return;
    const newChallenge: HabitChallenge = {
      id: preset.id,
      title: `${preset.icon} ${preset.title}`,
      description: preset.description,
      category: preset.category,
      icon: preset.icon,
      color: preset.color,
      totalDays: 21,
      status: "Active",
      currentDay: 1,
      streakCount: 0,
      completedDays: [],
      missedDays: 0,
      createdAt: new Date().toISOString()
    };
    saveChallenges([newChallenge, ...challenges]);
  };

  if (!activeChallenge) {
    return (
      <div className="bg-gradient-to-r from-[#FFF5EE] via-[#FDE7D6] to-[#FED7AA] dark:from-slate-800 dark:to-slate-900 border-2 border-[#FDBA74] rounded-3xl p-5 text-slate-900 dark:text-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h3 className="text-base font-black">21-Day Habit Transformation Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Build positive neural anchors or break addictive urge cycles with daily scratch cards & spin wheel!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToChallengesHub}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span>Explore 40+</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleStartPreset("preset-water-2l")}
            className="p-3 bg-white/70 hover:bg-white dark:bg-slate-800/80 rounded-2xl text-left border border-orange-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-xl">💧</span>
            <div className="text-xs font-black mt-1">2L Hydration Quest</div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">Good Habit • 21 Days</span>
          </button>

          <button
            type="button"
            onClick={() => handleStartPreset("preset-quit-smoking")}
            className="p-3 bg-white/70 hover:bg-white dark:bg-slate-800/80 rounded-2xl text-left border border-orange-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-xl">🚭</span>
            <div className="text-xs font-black mt-1">Quit Smoking & Vape</div>
            <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold">Bad Habit Detox</span>
          </button>

          <button
            type="button"
            onClick={() => handleStartPreset("preset-5am-club")}
            className="p-3 bg-white/70 hover:bg-white dark:bg-slate-800/80 rounded-2xl text-left border border-orange-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-xl">🌅</span>
            <div className="text-xs font-black mt-1">5:00 AM Morning Club</div>
            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">Good Habit • Energy</span>
          </button>

          <button
            type="button"
            onClick={() => handleStartPreset("preset-doomscrolling")}
            className="p-3 bg-white/70 hover:bg-white dark:bg-slate-800/80 rounded-2xl text-left border border-orange-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-xl">📵</span>
            <div className="text-xs font-black mt-1">Stop Doomscrolling</div>
            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">Dopamine Reset</span>
          </button>
        </div>
      </div>
    );
  }

  const currentDay = activeChallenge.currentDay || 1;
  const completedDays = activeChallenge.completedDays || [];
  const isTodayCompleted = completedDays.includes(currentDay);
  const isBadHabit =
    activeChallenge.category === "Bad Habits to Avoid" ||
    activeChallenge.category === "Recovery" ||
    activeChallenge.title.toLowerCase().includes("quit") ||
    activeChallenge.title.toLowerCase().includes("stop") ||
    activeChallenge.title.toLowerCase().includes("zero");

  const todayTask = activeChallenge.tasks?.find((t) => t.dayNumber === currentDay) || {
    dayNumber: currentDay,
    title: `Day ${currentDay} Action Protocol`,
    description: isBadHabit
      ? "Identify and suppress automated craving cues. Drink 500ml ice water and breathe deeply for 3 minutes."
      : "Execute your core habit routine for today with 100% conscious focus.",
    isCompleted: isTodayCompleted
  };

  // Complete Day Handler
  const handleCompleteDay = async (points: number = 2) => {
    if (isTodayCompleted) return;
    await triggerHapticFeedback("medium");
    const nextCompleted = Array.from(new Set([...completedDays, currentDay]));
    const nextDay = Math.min(21, currentDay + 1);
    const updated = challenges.map((c) => {
      if (c.id === activeChallenge.id) {
        return {
          ...c,
          completedDays: nextCompleted,
          currentDay: nextDay,
          streakCount: (c.streakCount || 0) + 1,
          lastCompletedDate: new Date().toISOString().split("T")[0]
        };
      }
      return c;
    });
    saveChallenges(updated);
    updateCoins(points);
    setLastPointsEarned(points);
    setShowScratchModal(false);
    setShowEncouragementModal(true);

    // Record daily metric
    recordDailyBehaviorMetric(activeChallenge.id, currentDay, {
      goalCompleted: true,
      points
    });
  };

  // Urge Logged Handler
  const handleUrgeLogged = async (urgeLog: UrgeLog, pointsAwarded: number) => {
    await triggerHapticFeedback("heavy");
    updateCoins(pointsAwarded);
    // Refresh active challenges
    loadData();
  };

  // Penalty Resolved Handler
  const handlePenaltyResolved = async (penaltyTitle: string) => {
    await triggerHapticFeedback("light");
    const nextCompleted = Array.from(new Set([...completedDays, currentDay]));
    const nextDay = Math.min(21, currentDay + 1);
    const updated = challenges.map((c) => {
      if (c.id === activeChallenge.id) {
        return {
          ...c,
          completedDays: nextCompleted,
          currentDay: nextDay,
          streakCount: (c.streakCount || 0) + 1,
          penaltyCount: (c.penaltyCount || 0) + 1,
          missedDays: Math.max(0, (c.missedDays || 0) - 1)
        };
      }
      return c;
    });
    saveChallenges(updated);
    setShowPenaltyModal(false);
  };

  const progressPercent = Math.round((completedDays.length / 21) * 100);

  return (
    <div className="space-y-3">
      {/* Top Gamification Header Bar */}
      <div className="bg-[#FFFDFB] dark:bg-slate-900 border-2 border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-orange-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FDE7D6] dark:bg-orange-950/60 border border-orange-300 text-orange-950 dark:text-orange-200 flex items-center justify-center text-2xl shadow-xs">
              {activeChallenge.icon || (isBadHabit ? "🛡️" : "🎯")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  isBadHabit ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                }`}>
                  {isBadHabit ? "🛡️ Bad Habit Detox" : "✨ Good Habit Builder"}
                </span>
                <span className="text-[11px] font-black text-slate-500">
                  Day {currentDay} of 21
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                {activeChallenge.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-amber-50 dark:bg-slate-800 rounded-xl text-amber-800 dark:text-amber-400 text-xs font-black flex items-center gap-1 border border-amber-200 dark:border-slate-700">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>{userCoins} 🪙</span>
            </div>

            <div className="px-3 py-1 bg-orange-50 dark:bg-slate-800 rounded-xl text-orange-700 dark:text-orange-400 text-xs font-black flex items-center gap-1 border border-orange-200 dark:border-slate-700">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>{activeChallenge.streakCount || 0} Streak</span>
            </div>

            <button
              type="button"
              onClick={onNavigateToChallengesHub}
              className="px-3 py-1 bg-[#FDE7D6] hover:bg-orange-200 text-orange-950 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-colors border border-orange-300"
              title="Open 40+ Habit Challenges Hub"
            >
              <span>Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Circular Progress Chart */}
        <div className="pt-3 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>21-Day Habit Formation Progress</span>
              <span className="font-mono text-orange-950 dark:text-orange-200 font-black">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-orange-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-orange-200 dark:border-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-orange-500 via-amber-500 to-[#2E7D32]"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Recharts Circular Progress Chart */}
          <div className="flex items-center gap-3 shrink-0 bg-white/70 dark:bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-orange-200/80 dark:border-slate-700 shadow-2xs">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: completedDays.length || 0.1 },
                      { name: "Remaining", value: Math.max(0, 21 - completedDays.length) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={22}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#1a73e8" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-white">
                {progressPercent}%
              </div>
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black text-slate-900 dark:text-white">Daily Target</div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {completedDays.length}/21 Days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIDE-BY-SIDE: SCRATCH CARD BESIDE DAILY SPIN WHEEL & VICE VERSA */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* CARD 1: ✨ DAILY SCRATCH CARD */}
        <div className="bg-[#FFF9F5] dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900/60 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="text-xs font-black text-orange-800 dark:text-orange-300 uppercase tracking-wider">
                  Daily Scratch Card
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#FDE7D6] text-orange-950 text-[10px] font-black rounded-full border border-orange-300">
                Day {currentDay} Card
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                {todayTask.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 mt-0.5">
                {todayTask.description}
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2 border-t border-orange-100 dark:border-slate-800">
            {isTodayCompleted ? (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Today's Card Completed ✅ (+2 Coins)</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowScratchModal(true)}
                  className="py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-2xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scratch Card ✨</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCompleteDay(2)}
                  className="py-2.5 bg-[#2E7D32] hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Done (+2 🪙)</span>
                </button>
              </div>
            )}

            {/* ⚡ PROMINENT URGE MODAL BUTTON (Below Scratch Card) */}
            <button
              type="button"
              onClick={() => {
                triggerHapticFeedback("medium");
                setShowUrgeModal(true);
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-2xl shadow-sm flex items-center justify-between gap-2 cursor-pointer transition-all hover:scale-[1.01] border border-blue-400/40"
              title="Experiencing a craving or urge? Launch 4-step micro-pause protocol"
            >
              <div className="flex items-center gap-2 text-left">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-sm shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="leading-tight font-black">Experiencing an Urge?</div>
                  <div className="text-[10px] text-blue-100 font-semibold">4-Step Craving Reset & Shield</div>
                </div>
              </div>
              <span className="px-2 py-1 bg-white/20 rounded-xl text-[10px] font-black shrink-0">
                +2 🪙 Points
              </span>
            </button>

            {!isTodayCompleted && (
              <button
                type="button"
                onClick={() => setShowPenaltyModal(true)}
                className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-[11px] rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Missed Today? Resolve Penalty</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: 🎡 DAILY LUCKY SPIN WHEEL (BESIDE SCRATCH CARD) */}
        <div className="bg-gradient-to-br from-amber-50 via-[#FFF9F5] to-orange-100 dark:from-slate-900 dark:to-slate-800 border-2 border-amber-200 dark:border-amber-900/60 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600 animate-bounce" />
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  Daily Lucky Spin Wheel
                </span>
              </div>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-950 text-[10px] font-black rounded-full">
                Win up to 50 🪙
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                🎡
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  Spin & Claim Daily Rewards
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Win Bonus Coins, Jackpot Drops & Freeze Shield Tokens!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                if (onOpenWheel) onOpenWheel();
                else setShowWheelModal(true);
              }}
              className={`w-full py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                alreadySpunToday
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-102"
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>
                {alreadySpunToday
                  ? "Daily Spin Claimed (View Rewards 🎡)"
                  : "SPIN THE WHEEL (FREE) 🎡"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: WEEKLY BEHAVIORAL CHALLENGES AGGREGATE SUMMARY & D3 HEATMAP */}
      {/* ========================================================================= */}
      <WeeklyBehaviorSummaryCard
        challenges={challenges}
        onOpenTriggerProfiles={() => setShowUrgeModal(true)}
      />

      {/* ===================== POPUP SCRATCH MODAL ===================== */}
      <AnimatePresence>
        {showScratchModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-[#FFF9F5] dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-2 border-orange-300 dark:border-slate-800 space-y-4 shadow-2xl relative my-6 text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-orange-800 dark:text-orange-300 uppercase">
                  {activeChallenge.title}
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Day {currentDay} of 21
                </span>
              </div>

              <div>
                <h3 className="text-base font-black">
                  {isBadHabit ? "🛡️ Scratch Urge-Buster Card" : "✨ Scratch Today's Habit Card"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Swipe finger or mouse across the card to unlock today's custom routine!
                </p>
              </div>

              {/* Interactive Scratch Component */}
              <div className="rounded-3xl overflow-hidden shadow-inner border border-orange-200">
                <ScratchCard
                  habitType={isBadHabit ? "bad" : "good"}
                  height={190}
                  revealContent={
                    <div className="p-4 flex flex-col items-center justify-center text-center space-y-2 h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-900">
                      <span className="text-3xl">{activeChallenge.icon || "🎯"}</span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {todayTask.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {todayTask.description}
                      </p>
                    </div>
                  }
                  onComplete={() => {}}
                />
              </div>

              {/* Action buttons inside scratch modal with Spin Wheel beside */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCompleteDay(2)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed | Earn 2 Coins 🪙</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScratchModal(false);
                      setShowWheelModal(true);
                    }}
                    className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Daily Spin Wheel 🎡</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowScratchModal(false);
                      setShowPenaltyModal(true);
                    }}
                    className="py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800 cursor-pointer"
                  >
                    ⚠️ Missed / Penalty
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowScratchModal(false)}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== PENALTY MODAL ===================== */}
      <PenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        challenge={activeChallenge}
        currentDay={currentDay}
        userCoins={userCoins}
        userFreezeTokens={userFreezeTokens}
        onPenaltyCompletedAndDayUnlocked={handlePenaltyResolved}
        onUseFreezeToken={() => updateFreezeTokens(-1)}
        onUseCoinsToRescue={(cost) => updateCoins(-cost)}
      />

      {/* ===================== ENCOURAGEMENT CELEBRATION MODAL ===================== */}
      <HabitEncouragementModal
        isOpen={showEncouragementModal}
        onClose={() => setShowEncouragementModal(false)}
        challenge={activeChallenge}
        dayNumber={currentDay}
        dayTask={todayTask}
        pointsEarned={lastPointsEarned}
      />

      {/* ===================== POSITIVE WHEEL MODAL ===================== */}
      <PositiveWheel
        isOpen={showWheelModal}
        onClose={() => {
          setShowWheelModal(false);
          loadData();
        }}
        onRewardClaimed={(coins, tokens) => {
          if (coins > 0) updateCoins(coins);
          if (tokens > 0) updateFreezeTokens(tokens);
          setAlreadySpunToday(true);
        }}
        userCoins={userCoins}
        userFreezeTokens={userFreezeTokens}
      />

      {/* ===================== ⚡ 4-STEP URGE / CRAVING RESET MODAL ===================== */}
      <UrgeModal
        isOpen={showUrgeModal}
        onClose={() => {
          setShowUrgeModal(false);
          loadData();
        }}
        challenge={activeChallenge}
        currentDay={currentDay}
        onUrgeLogged={handleUrgeLogged}
      />
    </div>
  );
};
