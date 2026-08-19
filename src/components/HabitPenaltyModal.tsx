import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Flame,
  Coins,
  ShieldCheck,
  Check,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  HeartCrack,
  X,
  Dumbbell,
  Clock,
  Droplets,
  BookOpen
} from "lucide-react";
import { HabitChallenge } from "../types";

interface HabitPenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: HabitChallenge;
  currentDay: number;
  userCoins: number;
  userFreezeTokens: number;
  onPayPenalty: (penaltyTitle: string) => void;
  onUseFreezeToken: () => void;
  onUseCoinsToRescue: (costCoins: number) => void;
}

export const HabitPenaltyModal: React.FC<HabitPenaltyModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentDay,
  userCoins,
  userFreezeTokens,
  onPayPenalty,
  onUseFreezeToken,
  onUseCoinsToRescue
}) => {
  const isBadHabit =
    challenge.category === "Bad Habits to Avoid" ||
    challenge.category === "Recovery" ||
    challenge.title.toLowerCase().includes("quit") ||
    challenge.title.toLowerCase().includes("stop") ||
    challenge.title.toLowerCase().includes("zero");

  // Determine customized penalty for this habit
  const defaultPenalty = isBadHabit
    ? {
        title: "Cold Water Face Plunge & 30 Air Squats",
        description: "Shock the vagus nerve and extinguish dopamine cravings with instant oxygenation and ice water.",
        type: "squats",
        repsOrMins: 30
      }
    : {
        title: "25 Push-ups or 5-Min Plank Hold",
        description: "Re-ignite physical stamina and discipline to bridge the gap for today's skipped habit.",
        type: "pushups",
        repsOrMins: 25
      };

  const customConfig = challenge.dailyPenalties?.[currentDay];
  const activePenalty = customConfig || {
    title: challenge.customPenaltyText || defaultPenalty.title,
    description: defaultPenalty.description,
    type: challenge.customPenaltyType || defaultPenalty.type,
    repsOrMins: challenge.customPenaltyRepsOrMins || defaultPenalty.repsOrMins
  };

  // State for interactive counter and timer
  const [repsDone, setRepsDone] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(
    activePenalty.type === "meditation" || activePenalty.type === "reading"
      ? activePenalty.repsOrMins * 60
      : 300
  );
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Sound generator
  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  if (!isOpen) return null;

  const targetReps = activePenalty.repsOrMins || 25;
  const isRepsComplete = repsDone >= targetReps;
  const isTimerComplete = timerSeconds === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-rose-300 dark:border-rose-900/80 space-y-4 shadow-2xl relative my-6 text-center"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-3xl flex items-center justify-center mb-2 shadow-sm border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Accountability Penalty & Streak Rescue
            </span>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">
              Day {currentDay} Missed or Relapse Encountered
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-xs mt-0.5">
              {isBadHabit
                ? "Don't let a stumble turn into a slide. Execute today's craving-buster penalty to keep your streak intact!"
                : "Real growth happens when you honor your commitment. Fulfill the accountability challenge to rescue your streak!"}
            </p>
          </div>

          {/* Tailored Daily Penalty Details Card */}
          <div className="p-4 bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 rounded-2xl text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-orange-900 dark:text-orange-300 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Today's Prescribed Penalty:</span>
              </span>
              <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-black rounded-full">
                Day {currentDay}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {activePenalty.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {activePenalty.description}
              </p>
            </div>

            {/* Interactive Game: Timer or Reps Counter */}
            {activePenalty.type === "meditation" || activePenalty.type === "reading" ? (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-orange-200 dark:border-slate-700 flex flex-col items-center">
                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {Math.floor(timerSeconds / 60)}:
                  {(timerSeconds % 60).toString().padStart(2, "0")}
                </div>
                <span className="text-[10px] text-slate-500 font-bold mb-2">
                  {isTimerActive ? "⏱️ Session Active..." : "Focus Hold Timer"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsTimerActive(!isTimerActive);
                    }}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerActive ? "Pause" : "Start Timer"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerActive(false);
                      setTimerSeconds(activePenalty.repsOrMins * 60);
                    }}
                    className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-orange-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Reps Logged:
                  </div>
                  <div className="text-xl font-black text-orange-600 font-mono">
                    {repsDone} / {targetReps}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setRepsDone((prev) => Math.min(targetReps, prev + 1));
                    }}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setRepsDone((prev) => Math.min(targetReps, prev + 5));
                    }}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+5 Reps</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Options: Pay Penalty vs Freeze Token vs Coins */}
          <div className="space-y-2 pt-1">
            {/* Primary: Mark Penalty Honored */}
            <button
              type="button"
              onClick={() => onPayPenalty(activePenalty.title)}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark Penalty Completed & Rescue Day {currentDay}</span>
            </button>

            {/* Use Freeze Token */}
            <button
              type="button"
              onClick={onUseFreezeToken}
              disabled={userFreezeTokens <= 0}
              className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Use 1 Freeze Token (Balance: {userFreezeTokens})</span>
            </button>

            {/* Pay 15 Coins to Rescue */}
            <button
              type="button"
              onClick={() => onUseCoinsToRescue(15)}
              disabled={userCoins < 15}
              className="w-full py-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
            >
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Rescue Streak with 15 Coins (You have: {userCoins} 🪙)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
