import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LifelongServiceProfile } from "../../types";
import {
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Heart,
  ShieldCheck,
  ArrowRight,
  X,
  Flame,
  Clock,
  Calendar
} from "lucide-react";

interface PeriodicLifeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LifelongServiceProfile;
  onTransitionStage?: (nextStage: "stabilize" | "integrate" | "ignite") => void;
}

export const PeriodicLifeReviewModal: React.FC<PeriodicLifeReviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  onTransitionStage
}) => {
  if (!isOpen) return null;

  const isDay21OrMore = profile.dayInCurrentStage >= 21;
  const isDay60OrMore = profile.totalActiveDays >= 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 rounded-3xl p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md text-xl">
                🏆
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Periodic Life Review & Milestones
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {profile.serviceName} • Lifelong Health & Consistency
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Celebration Banner */}
          <div className="p-4 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-pink-50/30 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-purple-100 dark:border-purple-800/60 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-black text-sm">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                {profile.stage === "ignite"
                  ? `Day ${profile.dayInCurrentStage} of Ignite Milestone`
                  : profile.stage === "stabilize"
                  ? "Stabilization & Habit Integration Progress"
                  : "Lifelong Mastery & Maintenance Rhythm"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Every day you invest in your {profile.serviceName.toLowerCase()} compounds into lasting mental and physical resilience. Here is your holistic growth snapshot:
            </p>
          </div>

          {/* 4-Stat Metric Box */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-[11px] font-bold text-slate-500">Total Active Days</div>
              <div className="text-xl font-black text-purple-700 dark:text-purple-300">
                {profile.totalActiveDays} Days
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">Compound dedication</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-[11px] font-bold text-slate-500">Current Best Streak</div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                  {profile.bestStreak}
                </span>
                <span className="text-xs text-slate-400 font-bold">days</span>
              </div>
              <div className="text-[10px] text-slate-500">Unbroken momentum</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-[11px] font-bold text-slate-500">Consistency Score</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {profile.consistencyScorePercent}%
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">Optimal reliability</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-[11px] font-bold text-slate-500">Care Tone & Mode</div>
              <div className="text-sm font-black text-slate-800 dark:text-slate-200 capitalize">
                {profile.careTone}
              </div>
              <div className="text-[10px] text-slate-500">Non-fear based care</div>
            </div>
          </div>

          {/* Next Phase Transition Guide */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Next Progression Milestone</span>
            </div>

            {profile.stage === "ignite" ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You are currently in <strong>Ignite (Days 1–21)</strong>. Once you finish Day 21, you can smoothly transition to <strong>Stabilization (Days 22–60)</strong> with fewer gamified prompts and smart lifestyle reminders.
                </p>
                {isDay21OrMore && onTransitionStage && (
                  <button
                    type="button"
                    onClick={() => {
                      onTransitionStage("stabilize");
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>Transition to Stabilization (Days 22–60)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : profile.stage === "stabilize" ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You are in <strong>Stabilization</strong>. On Day 61, your routine graduates into <strong>Lifelong Maintenance</strong>.
                </p>
                {isDay60OrMore && onTransitionStage && (
                  <button
                    type="button"
                    onClick={() => {
                      onTransitionStage("integrate");
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>Graduate to Lifelong Maintenance (Day 61+)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You are in <strong>Lifelong Maintenance</strong>. Your routine is now a natural, steady part of your lifestyle.
              </p>
            )}
          </div>

          {/* Close / Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-2xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Continue Today's Routine
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
