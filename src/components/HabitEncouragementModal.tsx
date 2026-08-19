import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Sparkles,
  Flame,
  Coins,
  Brain,
  ArrowRight,
  Share2,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  Smile
} from "lucide-react";
import { HabitChallenge, ChallengeDayTask } from "../types";

interface HabitEncouragementModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: HabitChallenge;
  dayNumber: number;
  dayTask?: ChallengeDayTask;
  pointsEarned: number;
  onShare?: () => void;
  onNextDayPreview?: () => void;
}

export const HabitEncouragementModal: React.FC<HabitEncouragementModalProps> = ({
  isOpen,
  onClose,
  challenge,
  dayNumber,
  dayTask,
  pointsEarned,
  onShare,
  onNextDayPreview
}) => {
  const isBadHabit =
    challenge.category === "Bad Habits to Avoid" ||
    challenge.category === "Recovery" ||
    challenge.title.toLowerCase().includes("quit") ||
    challenge.title.toLowerCase().includes("stop") ||
    challenge.title.toLowerCase().includes("zero");

  // Web Audio chime synthesis
  useEffect(() => {
    if (!isOpen) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [392.0, 523.25, 659.25, 783.99, 1046.5]; // Victory chime chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
      });
    } catch {
      // Audio fallback
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Good Habit vs Bad Habit Neuroscience Insights
  const neuroplasticityInsights = isBadHabit
    ? [
        "🧠 Prefrontal Cortex Mastery: You successfully suppressed an automated dopamine urge today. This physically weakens the old neural pathway in your basal ganglia!",
        "⚡ Urge Surfing Victory: Cravings peak at 3-5 minutes and drop. By waiting it out today, you re-wired your brain's tolerance threshold.",
        "🛡️ Dopamine Baseline Reset: Each day of abstinence restores natural dopamine receptor sensitivity, bringing true sustained energy.",
        "🔥 Willpower Capital: Resisting an addictive loop expands your executive control reservoir for every other area of life."
      ]
    : [
        "🧠 Synaptic Long-Term Potentiation (LTP): Repeating this action today strengthened myelin sheaths around this neural circuit, bringing it closer to effortless auto-pilot!",
        "⚡ Dopamine Stacking: Celebrating your win floods your hippocampus with positive reinforcement, solidifying tomorrow's morning drive.",
        "🌱 Identity Shifting: Every repetition is a vote for the person you wish to become. Day by day, your subconscious aligns.",
        "✨ Habit Loop Anchor: Cue -> Routine -> Reward is locking in. You are moving from conscious effort to automatic muscle memory."
      ];

  const randomInsight = neuroplasticityInsights[dayNumber % neuroplasticityInsights.length];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-amber-200 dark:border-amber-900/60 space-y-5 shadow-2xl relative my-6 text-center"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebratory Icon & Badge */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: [0, 10, -10, 0], scale: 1 }}
              transition={{ duration: 0.6 }}
              className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg mb-3 ${
                isBadHabit
                  ? "bg-gradient-to-tr from-rose-600 to-rose-400 text-white"
                  : "bg-gradient-to-tr from-amber-500 to-emerald-500 text-white"
              }`}
            >
              {isBadHabit ? <ShieldCheck className="w-9 h-9" /> : <Trophy className="w-9 h-9" />}
            </motion.div>

            <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
              isBadHabit
                ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            }`}>
              {isBadHabit ? "🛡️ Urge Crushed & Cycle Broken" : "✨ Positive Habit Anchor Built"}
            </span>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
              Day {dayNumber} Conquered! 🎉
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-xs mt-0.5">
              {challenge.title} • {Math.round((dayNumber / 21) * 100)}% of 21-Day Neural Rewiring Complete
            </p>
          </div>

          {/* Gamified Rewards Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                <span>Points Earned</span>
              </span>
              <span className="text-xl font-black text-amber-900 dark:text-amber-200 mt-0.5">
                +{pointsEarned} Coins 🪙
              </span>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800/60 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Active Streak</span>
              </span>
              <span className="text-xl font-black text-orange-900 dark:text-orange-200 mt-0.5">
                {challenge.streakCount + 1} Days 🔥
              </span>
            </div>
          </div>

          {/* Neuroplasticity & Habit Psychology Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-700 dark:text-indigo-400">
              <Brain className="w-4 h-4" />
              <span>Neuroscience of Habit Formation</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {randomInsight}
            </p>
          </div>

          {/* Encouragement Quote / Task Summary */}
          {dayTask && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-left space-y-1">
              <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase block">
                Completed Task:
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {dayTask.title}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Awesome! Keep Momentum Going</span>
            </button>

            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Share Day {dayNumber} Milestone</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
