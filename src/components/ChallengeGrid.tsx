import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HabitChallenge, ChallengeDayTask, UrgeLog, TriggerProfile } from "../types";
import { ScratchCard } from "./ScratchCard";
import { HabitEncouragementModal } from "./HabitEncouragementModal";
import { PenaltyModal } from "./PenaltyModal";
import { PositiveWheel } from "./PositiveWheel";
import { UrgeModal } from "./UrgeModal";
import { PinProtectionModal } from "./PinProtectionModal";
import { PRESET_CHALLENGES } from "../data/challengePresets";
import { syncHabitChallengeToSupabase } from "../lib/supabaseHabits";
import {
  CheckCircle2,
  Lock,
  Flame,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  ArrowLeft,
  X,
  Play,
  Heart,
  Coins,
  Share2,
  Bell,
  EyeOff,
  Menu,
  Gift,
  Check,
  Calendar,
  ShieldCheck,
  Activity,
  AlertCircle,
  KeyRound,
  LifeBuoy,
  Unlock,
  Shield,
  TrendingUp,
  Infinity,
  Plus
} from "lucide-react";

interface ChallengeGridProps {
  challenge: HabitChallenge;
  onUpdateChallenge: (updated: HabitChallenge) => void;
  onBack?: () => void;
  userFreezeTokens?: number;
  onUseFreezeToken?: () => boolean;
  userCoins?: number;
  onAddCoins?: (amount: number) => void;
  onOpenWheel?: () => void;
}

export const ChallengeGrid: React.FC<ChallengeGridProps> = ({
  challenge,
  onUpdateChallenge,
  onBack,
  userFreezeTokens = 0,
  onUseFreezeToken,
  userCoins = 120,
  onAddCoins,
  onOpenWheel
}) => {
  const [selectedDayToScratch, setSelectedDayToScratch] = useState<number | null>(null);
  const [showPenaltyModal, setShowPenaltyModal] = useState<boolean>(false);
  const [showEncouragementModal, setShowEncouragementModal] = useState<boolean>(false);
  const [showWheelModal, setShowWheelModal] = useState<boolean>(false);
  const [showUrgeModal, setShowUrgeModal] = useState<boolean>(false);
  const [encouragedDay, setEncouragedDay] = useState<number>(1);
  const [pointsEarnedLast, setPointsEarnedLast] = useState<number>(2);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isFormationGridExpanded, setIsFormationGridExpanded] = useState<boolean>(false);

  // PIN Lock & Confidential Protection State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    !challenge.isPinProtected || !challenge.pinCode
  );
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinModalMode, setPinModalMode] = useState<"unlock" | "set_pin" | "change_pin">("unlock");
  const [showHelplineModal, setShowHelplineModal] = useState<boolean>(false);

  // Stage 3: "No Permission" Alert Modal State
  const [noPermissionDay, setNoPermissionDay] = useState<number | null>(null);

  // Stage 4: Management Bottom-Sheet Menu & Restart Modal State
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>(challenge.reminderTime || "08:00");

  const completedDays = challenge.completedDays || [];
  const currentDay = challenge.currentDay || 1;
  const isPenaltyActive = (challenge.missedDays || 0) > 0;
  const isFormationComplete = completedDays.length >= 21 || completedDays.includes(21);
  const isLifelong = challenge.isLifelongContinuation || (isFormationComplete && (challenge.lifelongDayCount || 0) >= 22);

  const lifelongDayNumber = challenge.lifelongDayCount || 22;
  const daysContinuing = Math.max(1, lifelongDayNumber - 21);

  const isReductionOrControl =
    challenge.behaviorDirection === "reduce" ||
    challenge.behaviorDirection === "stop" ||
    challenge.behaviorDirection === "control" ||
    challenge.behaviorDirection === "pause" ||
    challenge.challengeArchetype === "addiction" ||
    challenge.challengeArchetype === "screen_time" ||
    challenge.category === "Bad Habits to Avoid" ||
    challenge.isSensitive;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getDayTaskInfo = (day: number): ChallengeDayTask => {
    // If in Lifelong mode for days > 21
    if (day > 21) {
      return {
        dayNumber: day,
        title: isReductionOrControl ? `Lifelong Day ${day} • Mindful Control & Delay` : `Lifelong Day ${day} • Daily Milestone`,
        description: isReductionOrControl
          ? `Sustain your permanent self-regulation. Keep urge intervals wide and stay within your target.`
          : `Day ${day} of your lifelong mastery. Continue your conscious daily habit loop with consistency and focus.`,
        isCompleted: false,
        uniquePenalty: {
          title: `5-Min Mindful Reset`,
          description: `Reset stress response with 5-minute 4-7-8 breathwork and cold hydration.`,
          type: "meditation",
          repsOrMins: 5
        }
      };
    }

    // If customized 21-day plan is stored inside challenge.tasks, use it
    if (challenge.tasks && challenge.tasks.length >= day && challenge.tasks[day - 1]) {
      const task = challenge.tasks[day - 1];
      return {
        dayNumber: task.dayNumber || day,
        title: task.title,
        description: task.description,
        isCompleted: completedDays.includes(day),
        uniquePenalty: task.uniquePenalty
      };
    }

    const preset = PRESET_CHALLENGES.find((p) => p.id === challenge.id || p.title === challenge.title);
    if (preset && preset.defaultTasks && preset.defaultTasks[day - 1]) {
      const task = preset.defaultTasks[day - 1];
      return {
        dayNumber: task.day,
        title: task.title,
        description: task.description,
        isCompleted: completedDays.includes(day),
        uniquePenalty: task.penalty
          ? {
              title: task.penalty.title,
              description: task.penalty.description,
              type: (task.penalty.type as any) || "meditation",
              repsOrMins: task.penalty.repsOrMins || 5
            }
          : undefined
      };
    }

    return {
      dayNumber: day,
      title: `Day ${day} Mindful Milestone`,
      description: `Dedicate 15-20 minutes of conscious focus to strengthen your daily self-regulation.`,
      isCompleted: completedDays.includes(day),
      uniquePenalty: {
        title: `5-Min Mindful Reset`,
        description: `Reset stress response with 5-minute 4-7-8 breathwork and cold hydration.`,
        type: "meditation",
        repsOrMins: 5
      }
    };
  };

  // Quick lock / unlock handlers
  const handleQuickLock = () => {
    setIsUnlocked(false);
    triggerToast("🔒 Challenge Locked");
  };

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    triggerToast("🔓 Challenge Unlocked");
  };

  // Grid Day Tap Handler: Check if locked
  const handleDayClick = (day: number) => {
    const isCompleted = completedDays.includes(day);
    const isCurrent = day === currentDay;

    if (isCompleted || isCurrent || day > 21) {
      if (isCurrent && isPenaltyActive) {
        setShowPenaltyModal(true);
      } else {
        setSelectedDayToScratch(day);
      }
    } else {
      setNoPermissionDay(day);
    }
  };

  // Activate Lifelong Habit Continuation Mode
  const handleStartLifelongContinuation = async () => {
    const updated: HabitChallenge = {
      ...challenge,
      isLifelongContinuation: true,
      lifelongDayCount: Math.max(22, challenge.lifelongDayCount || 22),
      formationCompletedAt: challenge.formationCompletedAt || new Date().toISOString(),
      status: "Active"
    };

    onUpdateChallenge(updated);
    await syncHabitChallengeToSupabase(updated);
    triggerToast(
      isReductionOrControl
        ? "🎯 Lifelong Reduction Mode Activated! Track forever."
        : "🌱 Lifelong Habit Continuation Activated! Track forever."
    );
  };

  // Daily Logger Completion
  const handleMarkDayCompleted = async (earnedPoints: number = 2) => {
    if (!selectedDayToScratch) return;
    const day = selectedDayToScratch;
    const todayDateStr = new Date().toISOString().split("T")[0];

    if (day > 21 || isLifelong) {
      // Lifelong habit completion
      const nextLifelongDay = (challenge.lifelongDayCount || 22) + 1;
      const newStreak = (challenge.streakCount || 0) + 1;
      const updated: HabitChallenge = {
        ...challenge,
        isLifelongContinuation: true,
        lifelongDayCount: nextLifelongDay,
        streakCount: newStreak,
        lastCompletedDate: todayDateStr,
        lifelongLogsCount: (challenge.lifelongLogsCount || 0) + 1
      };

      onUpdateChallenge(updated);
      await syncHabitChallengeToSupabase(updated);

      if (onAddCoins) onAddCoins(earnedPoints);

      setSelectedDayToScratch(null);
      setEncouragedDay(day);
      setPointsEarnedLast(earnedPoints);
      setShowEncouragementModal(true);
      triggerToast(`🎉 Lifelong Day ${day} Logged! +${earnedPoints} Points 🪙 (Streak: ${newStreak} 🔥)`);
      return;
    }

    const newCompleted = Array.from(new Set([...completedDays, day]));
    const newDay = Math.min(21, Math.max(currentDay, day + 1));
    const newStreak = (challenge.streakCount || 0) + 1;

    // Check if Day 21 just completed
    const justCompleted21 = day === 21 || newCompleted.length >= 21;

    const updated: HabitChallenge = {
      ...challenge,
      completedDays: newCompleted,
      currentDay: newDay,
      streakCount: newStreak,
      lastCompletedDate: todayDateStr,
      isLifelongContinuation: justCompleted21 ? true : challenge.isLifelongContinuation,
      lifelongDayCount: justCompleted21 ? (challenge.lifelongDayCount || 22) : challenge.lifelongDayCount,
      formationCompletedAt: justCompleted21 ? (challenge.formationCompletedAt || new Date().toISOString()) : challenge.formationCompletedAt
    };

    onUpdateChallenge(updated);
    await syncHabitChallengeToSupabase(updated);

    if (onAddCoins) {
      onAddCoins(earnedPoints);
    }

    setSelectedDayToScratch(null);
    setEncouragedDay(day);
    setPointsEarnedLast(earnedPoints);
    setShowEncouragementModal(true);
    triggerToast(`🎉 Day ${day} Completed! +${earnedPoints} Points 🪙 (Streak: ${newStreak} 🔥)`);
  };

  // Urge Log Handler
  const handleUrgeLogged = async (urgeLog: UrgeLog, pointsAwarded: number) => {
    const existingLogs = challenge.urgeLogs || [];
    const updatedLogs = [urgeLog, ...existingLogs];

    // Update trigger profiles
    const profiles = [...(challenge.triggerProfiles || [])];
    const existingProfile = profiles.find((p) => p.triggerType === urgeLog.triggerType);
    if (existingProfile) {
      existingProfile.count += 1;
      existingProfile.lastOccurred = new Date().toISOString();
    } else {
      profiles.push({
        id: `tp-${Date.now()}`,
        challengeId: challenge.id,
        triggerType: urgeLog.triggerType,
        description: urgeLog.triggerDescription || urgeLog.triggerType,
        count: 1,
        lastOccurred: new Date().toISOString()
      });
    }

    const updated: HabitChallenge = {
      ...challenge,
      urgeLogs: updatedLogs,
      triggerProfiles: profiles,
      currentIntervalMinutes: (challenge.currentIntervalMinutes || 0) + (urgeLog.delayMinutes || 2)
    };

    onUpdateChallenge(updated);
    await syncHabitChallengeToSupabase(updated);

    if (onAddCoins) {
      onAddCoins(pointsAwarded);
    }

    triggerToast(`🧠 Mindful Pause Logged! +${pointsAwarded} Coins!`);
  };

  // Restart Logic
  const handleConfirmRestart = async () => {
    const restarted: HabitChallenge = {
      ...challenge,
      completedDays: [],
      currentDay: 1,
      streakCount: 0,
      missedDays: 0,
      status: "Active",
      isLifelongContinuation: false,
      lifelongDayCount: 22
    };

    onUpdateChallenge(restarted);
    await syncHabitChallengeToSupabase(restarted);
    setShowRestartModal(false);
    setIsMenuOpen(false);
    triggerToast("🔄 Challenge restarted to Day 1!");
  };

  // Hide Logic
  const handleHideChallenge = async () => {
    const hidden: HabitChallenge = {
      ...challenge,
      status: "Paused"
    };
    onUpdateChallenge(hidden);
    await syncHabitChallengeToSupabase(hidden);
    setIsMenuOpen(false);
    triggerToast("👁️ Challenge hidden from primary feed");
    if (onBack) onBack();
  };

  // Notifications Save Logic
  const handleSaveNotifications = async () => {
    const updated: HabitChallenge = {
      ...challenge,
      notificationsEnabled: true,
      reminderTime
    };
    onUpdateChallenge(updated);
    await syncHabitChallengeToSupabase(updated);
    setShowNotificationModal(false);
    setIsMenuOpen(false);
    triggerToast(`🔔 Daily reminder set for ${reminderTime}`);
  };

  // PIN Save Logic
  const handlePinUpdated = async (newPin?: string) => {
    const updated: HabitChallenge = {
      ...challenge,
      isPinProtected: !!newPin,
      pinCode: newPin || undefined
    };
    onUpdateChallenge(updated);
    await syncHabitChallengeToSupabase(updated);
    setShowPinModal(false);
    setIsUnlocked(true);
    triggerToast(newPin ? "🔒 PIN Protection Enabled" : "🔓 PIN Protection Disabled");
  };

  const percentProgress = Math.round((completedDays.length / 21) * 100);
  const activeDayTask = selectedDayToScratch ? getDayTaskInfo(selectedDayToScratch) : null;

  // =========================================================================
  // VIEW: LOCKED GUARD SCREEN (IF PIN PROTECTED & NOT UNLOCKED)
  // =========================================================================
  if (!isUnlocked && challenge.isPinProtected && challenge.pinCode) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6 text-center animate-in fade-in">
        <div className="bg-[#FFF8F3] dark:bg-slate-900 border-2 border-orange-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-950/80 px-2.5 py-1 rounded-full">
              Confidential Challenge
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {challenge.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This challenge is PIN-protected for your privacy. Enter your 4-digit PIN to access your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPinModalMode("unlock");
              setShowPinModal(true);
            }}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter PIN to Unlock</span>
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              ← Back to Discovery Library
            </button>
          )}
        </div>

        {/* PIN Setup & Unlock Modal */}
        <PinProtectionModal
          isOpen={showPinModal}
          mode={pinModalMode}
          challengeTitle={challenge.title}
          correctPin={challenge.pinCode}
          onSuccess={handleUnlockSuccess}
          onClose={() => setShowPinModal(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN ACTIVE CHALLENGE INTERFACE
  // =========================================================================
  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-24 text-left animate-in fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-2xl shadow-2xl border border-slate-700 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Safety Notice Banner if Sensitive Behavior */}
      {challenge.safetyPathwayText && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-800 rounded-3xl flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div className="text-xs space-y-0.5">
              <p className="font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                Safe & Supportive Care Protocol
              </p>
              <p className="text-rose-800 dark:text-rose-300 font-medium leading-relaxed">
                {challenge.safetyPathwayText}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHelplineModal(true)}
            className="shrink-0 px-2.5 py-1.5 bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-black text-[10px] rounded-xl flex items-center gap-1 hover:bg-rose-300 cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Helplines</span>
          </button>
        </div>
      )}

      {/* Header Bar (Pastel Peach Aesthetic with Universal Back Button) */}
      <div className="bg-gradient-to-r from-[#FFF5EE] via-[#FDE7D6] to-[#FED7AA] dark:from-slate-800 dark:to-slate-900 border-2 border-[#FDBA74]/60 dark:border-orange-900/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1 font-bold text-xs"
                title="Back to Previous Screen"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{challenge.icon || "🏆"}</span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {challenge.title}
                </h2>
                {challenge.isPinProtected && (
                  <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-black rounded-lg flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>PIN</span>
                  </span>
                )}
                {isLifelong && (
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-[#2E7D32] dark:text-emerald-300 text-[10px] font-black rounded-lg flex items-center gap-1 border border-emerald-300 dark:border-emerald-700">
                    <Infinity className="w-3 h-3" />
                    <span>Lifelong Continuous</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 max-w-lg line-clamp-1">
                {challenge.description || "21 consecutive days to build a permanent positive neural pathway."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {challenge.isPinProtected && (
              <button
                type="button"
                onClick={handleQuickLock}
                className="p-2 bg-white dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl border border-orange-200 dark:border-slate-700 cursor-pointer shadow-2xs text-xs font-bold flex items-center gap-1"
                title="Quick Lock Challenge"
              >
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                <span>Lock</span>
              </button>
            )}
            <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 shadow-2xs">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{userCoins} 🪙</span>
            </div>
            <div className="px-3 py-1.5 bg-orange-600 text-white rounded-2xl flex items-center gap-1.5 text-xs font-black shadow-2xs">
              <Flame className="w-4 h-4 fill-white" />
              <span>{challenge.streakCount || 0} Streak</span>
            </div>
            <div className="px-3 py-1.5 bg-[#2E7D32] text-white rounded-2xl flex items-center gap-1.5 text-xs font-black shadow-2xs">
              <Award className="w-4 h-4" />
              <span>{isLifelong ? `21/21 Foundation ✓` : `${completedDays.length}/21 Days`}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROGRESS TRACKER: FORMATION OR LIFELONG CONTINUATION */}
        {/* ========================================================================= */}
        {isLifelong ? (
          /* LIFELONG CONTINUATION HEADER CARD */
          <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2E7D32] dark:text-emerald-400 block">
                  21-Day Foundation Complete ✓
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Lifelong Day {lifelongDayNumber} • {daysContinuing} {daysContinuing === 1 ? "day" : "days"} continuing
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-black rounded-xl border border-orange-200 dark:border-orange-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{challenge.streakCount || 0}-Day Active Streak</span>
                </span>
              </div>
            </div>

            {/* Reduction / Goal Info if Bad Habit or Reduction */}
            {isReductionOrControl ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 bg-orange-50/60 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Goal & Metric</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">Continuous Reduction</span>
                </div>
                <div className="p-2.5 bg-orange-50/60 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Best Interval Delay</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {challenge.currentIntervalMinutes || 15} Mins Between Impulses
                  </span>
                </div>
                <div className="p-2.5 bg-orange-50/60 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Target Consistency</span>
                  <span className="font-black text-[#2E7D32]">Within Healthy Target</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Your 21-day neural foundation is permanently established. Log your daily milestone below to keep your lifetime streak flourishing.
              </p>
            )}
          </div>
        ) : (
          /* 21-DAY FORMATION PROGRESS BAR */
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
              <span>Formation Progress: Day {currentDay} of 21</span>
              <span>{percentProgress}% Completed</span>
            </div>
            <div className="w-full h-3 bg-white dark:bg-slate-800 rounded-full overflow-hidden border border-orange-200 dark:border-slate-700 p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-[#2E7D32] rounded-full transition-all duration-500"
                style={{ width: `${percentProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Milestone Indicator Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {isReductionOrControl ? (
            <>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Delay Interval</span>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {challenge.currentIntervalMinutes || 5} Mins
                </div>
              </div>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Urge Pauses Logged</span>
                <div className="text-lg font-black text-orange-600 dark:text-orange-400 mt-0.5">
                  {challenge.urgeLogs?.length || 0}
                </div>
              </div>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Top Trigger</span>
                <div className="text-xs font-black text-slate-800 dark:text-slate-200 truncate mt-1">
                  {challenge.triggerProfiles?.[0]?.description || challenge.triggers?.[0] || "Stress & Routine"}
                </div>
              </div>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Phase</span>
                <div className="text-xs font-black text-amber-700 dark:text-amber-400 mt-1">
                  {isLifelong ? "Lifelong Mastery" : currentDay <= 7 ? "1: Awareness" : currentDay <= 14 ? "2: Interventions" : "3: Resilience"}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Consistency Score</span>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {isLifelong ? "100%" : `${percentProgress}%`}
                </div>
              </div>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Daily Target</span>
                <div className="text-lg font-black text-orange-600 dark:text-orange-400 mt-0.5">
                  {challenge.dailyTimeAvailableMinutes || 15} Mins/Day
                </div>
              </div>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Active Streak</span>
                <div className="text-lg font-black text-orange-600 dark:text-orange-400 mt-0.5">
                  {challenge.streakCount || 0} Days 🔥
                </div>
              </div>
              <div className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-500">Milestone Stage</span>
                <div className="text-xs font-black text-amber-700 dark:text-amber-400 mt-1">
                  {isLifelong ? "Lifelong Continuation" : currentDay <= 7 ? "1: Foundation" : currentDay <= 14 ? "2: Expansion" : "3: Lock-In"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TODAY'S ACTIVE LOGGING CARD (LIFELONG OR CURRENT FORMATION DAY) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border-2 border-orange-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEEDB] dark:bg-orange-950/60 text-[#FF6A45] flex items-center justify-center text-xl font-black shrink-0">
              {challenge.icon || "🎯"}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C2410C] dark:text-orange-400 block">
                {isLifelong ? `Lifelong Daily Milestone • Day ${lifelongDayNumber}` : `Today's Action • Day ${currentDay} of 21`}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {getDayTaskInfo(isLifelong ? lifelongDayNumber : currentDay).title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDayClick(isLifelong ? lifelongDayNumber : currentDay)}
            className="px-4 py-2.5 bg-[#FF6A45] hover:bg-[#EA580C] text-white font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Scratch Card (+2 🪙)</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {getDayTaskInfo(isLifelong ? lifelongDayNumber : currentDay).description}
        </p>

        {/* Urge & Impulse Logging Quick Action for Reduction / Control */}
        {isReductionOrControl && (
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowUrgeModal(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Log Urge / Delay Impulse (+5 🪙)</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 21-DAY FORMATION GRID (HISTORICAL JOURNEY OR ACTIVE FORMATION) */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFDFB] dark:bg-slate-900 border-2 border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="text-xs sm:text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">
              {isLifelong ? "21-Day Foundation Journey (Completed ✓)" : "21-Day Formation Grid"}
            </h3>
          </div>
          {isLifelong ? (
            <span className="text-xs font-black text-[#2E7D32] bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300">
              21/21 Mastered ✓
            </span>
          ) : (
            <span className="text-xs font-black text-orange-800 dark:text-orange-300 bg-[#FFC9A7]/40 px-3 py-1 rounded-full border border-orange-300">
              Active: Day {currentDay} of 21
            </span>
          )}
        </div>

        {/* 5x4 Grid: 20 Days */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((day) => {
            const isCompleted = completedDays.includes(day) || isLifelong;
            const isCurrent = day === currentDay && !isCompleted && !isLifelong;
            const isLocked = day > currentDay && !isLifelong;

            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDayClick(day)}
                className={`relative rounded-3xl p-3.5 flex flex-col justify-between items-start aspect-square transition-all border shadow-2xs cursor-pointer ${
                  isCompleted
                    ? "bg-[#2E7D32] text-white border-emerald-600 shadow-xs"
                    : isCurrent
                    ? "bg-[#EA580C] text-white border-2 border-orange-600 ring-4 ring-orange-300/60 shadow-md scale-102"
                    : "bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-300"
                }`}
              >
                {/* Day Header */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs font-black ${
                      isCompleted || isCurrent ? "text-white" : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    Day {day}
                  </span>
                  {isCompleted && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </div>

                {/* Center Icon */}
                <div className="w-full flex items-center justify-center my-auto">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Status Label */}
                <div className="text-[10px] font-black truncate w-full">
                  {isCompleted ? (
                    <span className="text-emerald-100">Completed</span>
                  ) : isCurrent ? (
                    <span className="text-white underline decoration-amber-300">Active</span>
                  ) : (
                    <span className="text-slate-400">Locked</span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* +1: Day 21 Master Finale Card */}
          {(() => {
            const isCompleted21 = completedDays.includes(21) || isLifelong;
            const isCurrent21 = currentDay === 21 && !isCompleted21 && !isLifelong;

            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleDayClick(21)}
                className={`sm:col-span-5 relative rounded-3xl p-4 flex items-center justify-between text-left transition-all border shadow-2xs cursor-pointer ${
                  isCompleted21
                    ? "bg-[#2E7D32] text-white border-emerald-600"
                    : isCurrent21
                    ? "bg-[#EA580C] text-white border-2 border-orange-600 ring-4 ring-orange-300/50 shadow-md"
                    : "bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs ${
                      isCompleted21 || isCurrent21
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isCompleted21 ? "🏆" : isCurrent21 ? "✨" : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      Day 21 Master Finale
                    </span>
                    <h4 className="text-sm font-black mt-0.5">
                      {isCompleted21 ? "21-Day Neural Pathway Mastered!" : "Day 21: Neural Pathway Lock-In"}
                    </h4>
                  </div>
                </div>

                <div className="text-xs font-black">
                  {isCompleted21 ? (
                    <span className="px-3 py-1.5 bg-white text-emerald-800 rounded-xl">Mastered 🥇</span>
                  ) : isCurrent21 ? (
                    <span className="px-3 py-1.5 bg-white text-orange-900 rounded-xl animate-pulse">
                      Scratch Final Day ✨
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl">
                      Locked 🔒
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* PROMINENT "CONTINUE HABIT" BUTTON (AFTER DAY 21) */}
        {isFormationComplete && !isLifelong && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-700 rounded-3xl text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-md">
              🌱
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                21-Day Foundation Complete! Ready for Lifelong Continuation?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto mt-1">
                Real life doesn't stop on Day 21. Continue your daily streak, rewards, and habit loop seamlessly forever without restarting.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartLifelongContinuation}
              className="px-6 py-3 bg-[#2E7D32] hover:bg-[#256327] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              {isReductionOrControl ? "Continue Reduction Forever →" : "Continue Habit Forever →"}
            </button>
          </motion.div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CIRCULAR HAMBURGER MANAGEMENT BUTTON (BOTTOM RIGHT) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="w-14 h-14 rounded-full bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 cursor-pointer"
          title="Challenge Management Options"
        >
          <Menu className="w-6 h-6 text-orange-950" />
        </motion.button>
      </div>

      {/* ========================================================================= */}
      {/* STAGE 4: CIRCULAR PEACH BOTTOM-SHEET MANAGEMENT MENU */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#FFF8F3] dark:bg-slate-900 border-t-2 sm:border-2 border-[#FDE7D6] dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#FDE7D6] dark:border-slate-800">
                <h3 className="text-sm font-black text-orange-950 dark:text-orange-200 uppercase">
                  Challenge Settings
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Management Options */}
              <div className="space-y-2">
                {/* 1. PIN Protection Toggle/Change */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setPinModalMode("set_pin");
                    setShowPinModal(true);
                  }}
                  className="w-full p-3.5 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700/50 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-slate-700 text-orange-900 dark:text-orange-300 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Protect with PIN</div>
                    <div className="text-[11px] text-slate-500">
                      {challenge.isPinProtected ? "Change or disable your PIN code" : "Lock this challenge behind a PIN"}
                    </div>
                  </div>
                </button>

                {/* 2. Hide Challenge */}
                <button
                  type="button"
                  onClick={handleHideChallenge}
                  className="w-full p-3.5 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700/50 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-slate-700 text-orange-900 dark:text-orange-300 flex items-center justify-center shrink-0">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Hide Challenge</div>
                    <div className="text-[11px] text-slate-500">Pause and hide from the main feed</div>
                  </div>
                </button>

                {/* 3. Notifications */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowNotificationModal(true);
                  }}
                  className="w-full p-3.5 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700/50 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-slate-700 text-orange-900 dark:text-orange-300 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Notifications</div>
                    <div className="text-[11px] text-slate-500">Set daily habit reminder time</div>
                  </div>
                </button>

                {/* 4. Restart Formation */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowRestartModal(true);
                  }}
                  className="w-full p-3.5 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-rose-700 dark:text-rose-300">Restart Formation</div>
                    <div className="text-[11px] text-slate-500">Reset progress back to Day 1</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* STAGE 3: "NO PERMISSION" ALERT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {noPermissionDay !== null && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-amber-300 dark:border-slate-800"
            >
              {/* Yellow Alert Warning Icon */}
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 flex items-center justify-center mx-auto text-3xl shadow-sm">
                <AlertTriangle className="w-8 h-8 text-amber-500 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  No permission
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium px-2 leading-relaxed">
                  You don't have permission to view this challenge, come back on day {noPermissionDay}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setNoPermissionDay(null)}
                className="w-full py-3 bg-[#FFC9A7] hover:bg-[#ffb68c] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-xs cursor-pointer transition-all"
              >
                Ok
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* STAGE 4: "RESTART" CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showRestartModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#FDE7D6] dark:border-slate-800"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
                <RotateCcw className="w-7 h-7 text-orange-600" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Restart Challenge
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Do you want to restart this challenge from Day 1?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestartModal(false)}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-2xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRestart}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer"
                >
                  Yes, Restart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* NOTIFICATIONS TIME MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showNotificationModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#FDE7D6] dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto text-xl shadow-xs">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Daily Habit Reminder
                </h3>
                <p className="text-xs text-slate-500">
                  Select what time you want to be reminded each day.
                </p>
              </div>

              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFF8F3] dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl text-center text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-2xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotifications}
                  className="py-2.5 px-4 bg-[#FFC9A7] hover:bg-[#ffb68c] text-orange-950 text-xs font-black rounded-2xl shadow-xs cursor-pointer"
                >
                  Save Time
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CONFIDENTIAL HELPLINE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showHelplineModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-rose-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Confidential Crisis & Support Helplines
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelplineModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800">
                  <div className="font-black text-rose-950 dark:text-rose-200">
                    SAMHSA Substance & Mental Health Helpline
                  </div>
                  <div className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5">
                    1-800-662-4357 • Free, Confidential, 24/7 Treatment Referral
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="font-black text-slate-900 dark:text-white">
                    988 Suicide & Crisis Lifeline
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Dial or Text 988 • Available 24 hours in English & Spanish
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="font-black text-slate-900 dark:text-white">
                    Crisis Text Line
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Text HOME to 741741 • Free, 24/7 SMS Support
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHelplineModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* STAGE 3: DAILY INTERACTIVE SCRATCH CARD MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedDayToScratch !== null && activeDayTask && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-[#FFF8F3] dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 max-w-md w-full border-2 border-[#FDE7D6] dark:border-slate-800 space-y-4 shadow-2xl relative my-6 text-center"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#FDE7D6] dark:border-slate-800">
                <span className="text-xs font-black text-orange-900 dark:text-orange-300 uppercase">
                  {challenge.title}
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {selectedDayToScratch > 21 ? `Lifelong Day ${selectedDayToScratch}` : `Day ${selectedDayToScratch} of 21`}
                </span>
              </div>

              {/* Interactive 1:1 Scratch Card Component */}
              <ScratchCard
                dayNumber={selectedDayToScratch}
                challengeTitle={challenge.title}
                isAlreadyCompleted={selectedDayToScratch <= 21 ? completedDays.includes(selectedDayToScratch) : false}
                onCompleteDay={(points) => handleMarkDayCompleted(points)}
                onClose={() => setSelectedDayToScratch(null)}
                revealContent={
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-3 h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl w-full">
                    <span className="text-4xl">{challenge.icon || "🎯"}</span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {activeDayTask.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {activeDayTask.description}
                    </p>
                  </div>
                }
              />

              {/* Urge Mode Button inside active day modal for reduction / control challenges */}
              {isReductionOrControl && (
                <button
                  type="button"
                  onClick={() => {
                    setShowUrgeModal(true);
                  }}
                  className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs rounded-2xl border border-rose-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>I'm feeling an impulse right now (Log Urge / Delay)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedDayToScratch(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-time Urge Intervention Modal */}
      <UrgeModal
        isOpen={showUrgeModal}
        onClose={() => setShowUrgeModal(false)}
        challenge={challenge}
        currentDay={currentDay}
        onUrgeLogged={handleUrgeLogged}
      />

      {/* Accountability Recovery Modal */}
      <PenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        challenge={challenge}
        currentDay={currentDay}
        userCoins={userCoins}
        userFreezeTokens={userFreezeTokens}
        onPenaltyCompletedAndDayUnlocked={async () => {
          const updated: HabitChallenge = {
            ...challenge,
            missedDays: Math.max(0, (challenge.missedDays || 0) - 1),
            penaltyCount: (challenge.penaltyCount || 0) + 1
          };
          onUpdateChallenge(updated);
          await syncHabitChallengeToSupabase(updated);
          setShowPenaltyModal(false);
          triggerToast(`🛡️ Recovery action completed: Day ${currentDay} unlocked!`);
        }}
        onUseFreezeToken={onUseFreezeToken}
        onUseCoinsToRescue={(cost) => {
          if (onAddCoins) onAddCoins(-cost);
        }}
      />

      {/* Encouragement Celebration Modal */}
      <HabitEncouragementModal
        isOpen={showEncouragementModal}
        onClose={() => setShowEncouragementModal(false)}
        challenge={challenge}
        dayNumber={encouragedDay}
        dayTask={getDayTaskInfo(encouragedDay)}
        pointsEarned={pointsEarnedLast}
      />

      {/* Positive Spin Wheel Modal */}
      <PositiveWheel
        isOpen={showWheelModal}
        onClose={() => setShowWheelModal(false)}
        onRewardClaimed={(coinsEarned) => {
          if (coinsEarned > 0 && onAddCoins) onAddCoins(coinsEarned);
        }}
        userCoins={userCoins}
        userFreezeTokens={userFreezeTokens}
      />

      {/* PIN Setup & Change Modal */}
      <PinProtectionModal
        isOpen={showPinModal}
        mode={pinModalMode}
        challengeTitle={challenge.title}
        correctPin={challenge.pinCode}
        onSuccess={handlePinUpdated}
        onClose={() => setShowPinModal(false)}
      />
    </div>
  );
};
