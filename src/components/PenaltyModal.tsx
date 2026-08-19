import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Coins,
  LockOpen,
  Dumbbell,
  Heart,
  Timer,
  BookOpen,
  Coffee,
  Smile,
  X,
  Zap,
  Sliders,
  Droplets,
  CheckCircle2,
  Wind,
  Brain
} from "lucide-react";
import { HabitChallenge } from "../types";
import {
  DAILY_PENALTY_CONFIG,
  PenaltyTaskConfig,
  validateAndUnlockDayAfterPenaltyInSupabase
} from "../lib/supabaseHabits";

interface PenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: HabitChallenge;
  currentDay: number;
  userCoins?: number;
  userFreezeTokens?: number;
  onPenaltyCompletedAndDayUnlocked?: (penaltyTitle: string) => void;
  onPayPenalty?: (penaltyTitle: string) => void;
  onUseFreezeToken?: () => void;
  onUseCoinsToRescue?: (cost: number) => void;
}

export const PenaltyModal: React.FC<PenaltyModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentDay,
  userCoins = 50,
  userFreezeTokens = 1,
  onPenaltyCompletedAndDayUnlocked,
  onPayPenalty,
  onUseFreezeToken,
  onUseCoinsToRescue
}) => {
  // Selected recovery action configuration
  const penaltyList: PenaltyTaskConfig[] = Object.values(DAILY_PENALTY_CONFIG);
  const [selectedPenaltyType, setSelectedPenaltyType] = useState<string>("meditation");
  const [customTarget, setCustomTarget] = useState<number>(3);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  // Execution state
  const [completedValue, setCompletedValue] = useState<number>(0);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isPenaltyVerified, setIsPenaltyVerified] = useState<boolean>(false);
  const [isSavingDatabase, setIsSavingDatabase] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const selectedPenalty: PenaltyTaskConfig =
    DAILY_PENALTY_CONFIG[selectedPenaltyType] || penaltyList[0];

  // Initialize values when opening or selecting task
  useEffect(() => {
    if (isOpen) {
      setCompletedValue(0);
      setIsPenaltyVerified(false);
      setIsSavingDatabase(false);
      setIsTimerRunning(false);
      setFeedbackMessage(null);

      const target = selectedPenalty.targetValue || 3;
      setCustomTarget(target);

      if (selectedPenalty.unit === "minutes") {
        setTimerSecondsRemaining(target * 60);
      }
    }
  }, [isOpen, selectedPenaltyType]);

  // Audio cue
  const playChime = (success: boolean = true) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(success ? 523.25 : 300, ctx.currentTime);
      if (success) {
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.35);
      }
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  };

  // Timer countdown hook for mindfulness/meditation
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setCompletedValue(customTarget);
            setIsPenaltyVerified(true);
            playChime(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsRemaining, customTarget]);

  // Check target value fulfillment
  useEffect(() => {
    if (completedValue >= customTarget && !isPenaltyVerified) {
      setIsPenaltyVerified(true);
      playChime(true);
    }
  }, [completedValue, customTarget, isPenaltyVerified]);

  if (!isOpen) return null;

  // Execute database/storage update mechanism to unlock current day
  const handleCompleteAndUnlock = async () => {
    if (!isPenaltyVerified) return;
    setIsSavingDatabase(true);

    try {
      const effectivePenalty: PenaltyTaskConfig = {
        ...selectedPenalty,
        targetValue: customTarget
      };
      await validateAndUnlockDayAfterPenaltyInSupabase(
        challenge,
        currentDay,
        effectivePenalty,
        completedValue >= customTarget ? completedValue : customTarget
      );
      if (onPenaltyCompletedAndDayUnlocked) {
        onPenaltyCompletedAndDayUnlocked(selectedPenalty.title);
      }
      if (onPayPenalty) {
        onPayPenalty(selectedPenalty.title);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (onPenaltyCompletedAndDayUnlocked) {
        onPenaltyCompletedAndDayUnlocked(selectedPenalty.title);
      }
      onClose();
    } finally {
      setIsSavingDatabase(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="bg-[#FFF8F3] dark:bg-slate-900 border-2 border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 my-auto"
      >
        {/* Supportive Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FDE7D6] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Mindful Recovery Action
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Day {currentDay} • Missed Day Reset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Non-judgmental Framing Card */}
        <div className="p-3.5 bg-white dark:bg-slate-850 rounded-2xl border border-amber-200 dark:border-slate-700 flex items-start gap-3">
          <span className="text-xl">🌱</span>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white">
              Missing a day is just data, not failure.
            </p>
            <p className="leading-relaxed text-[11px] text-slate-500">
              Complete a gentle 2-3 minute recovery action below to re-anchor your mindfulness and unblock today's milestone.
            </p>
          </div>
        </div>

        {/* Action Type Selector Chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">
            Choose Your Recovery Action:
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
            {penaltyList.map((p) => {
              const isSelected = selectedPenaltyType === p.type;
              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setSelectedPenaltyType(p.type)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-100 dark:bg-amber-950/80 border-amber-300 text-amber-950 dark:text-amber-200 shadow-2xs"
                      : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Action Player (Timer or Rep Counter) */}
        <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border-2 border-orange-200 dark:border-slate-700 text-center space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-orange-800 dark:text-orange-300">
            {selectedPenalty.title} ({customTarget} {selectedPenalty.unit})
          </div>

          {selectedPenalty.unit === "minutes" ? (
            <div className="space-y-2">
              <div className="text-4xl font-black font-mono text-slate-900 dark:text-white">
                {formatTimer(timerSecondsRemaining)}
              </div>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`py-2 px-6 rounded-xl font-black text-xs cursor-pointer shadow-xs transition-all ${
                  isTimerRunning
                    ? "bg-rose-500 text-white"
                    : "bg-[#FFC9A7] text-orange-950 hover:bg-[#ffb68c]"
                }`}
              >
                {isTimerRunning ? "Pause" : "Start Timer"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {completedValue} / {customTarget} {selectedPenalty.unit}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompletedValue((prev) => Math.max(0, prev - 5))}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 font-black text-slate-700 dark:text-white"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setCompletedValue((prev) => prev + 5)}
                  className="px-4 h-10 rounded-xl bg-[#FFC9A7] font-black text-orange-950 hover:bg-[#ffb68c]"
                >
                  +5 Completed
                </button>
              </div>
            </div>
          )}

          {isPenaltyVerified && (
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recovery Action Verified!</span>
            </div>
          )}
        </div>

        {/* Primary Unblock Button */}
        <button
          type="button"
          disabled={!isPenaltyVerified || isSavingDatabase}
          onClick={handleCompleteAndUnlock}
          className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
            isPenaltyVerified
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          }`}
        >
          <LockOpen className="w-4 h-4" />
          <span>{isSavingDatabase ? "Unlocking Day..." : "Unblock Today & Continue"}</span>
        </button>

        {/* Rescue token / coins alternative bypass */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-500">
          {userFreezeTokens > 0 && onUseFreezeToken && (
            <button
              type="button"
              onClick={onUseFreezeToken}
              className="text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>❄️ Use Streak Freeze Token ({userFreezeTokens} left)</span>
            </button>
          )}
          {onUseCoinsToRescue && (
            <button
              type="button"
              onClick={() => onUseCoinsToRescue(10)}
              className="text-amber-700 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1 ml-auto"
            >
              <span>🪙 Rescue with 10 Coins</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
