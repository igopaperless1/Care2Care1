import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LifelongServiceProfile } from "../../types";
import { startGentleRecoveryReset } from "../../lib/lifelongEngine";
import {
  RotateCcw,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
  Calendar,
  ArrowRight
} from "lucide-react";

interface GentleRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LifelongServiceProfile;
  onRecoveryStarted: (updatedProfile: LifelongServiceProfile) => void;
}

export const GentleRecoveryModal: React.FC<GentleRecoveryModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRecoveryStarted
}) => {
  const [selectedPlanDays, setSelectedPlanDays] = useState<3 | 7>(7);

  if (!isOpen) return null;

  const handleStartReset = () => {
    const updated = startGentleRecoveryReset(profile.serviceId, selectedPlanDays);
    onRecoveryStarted(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-3xl p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-teal-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md text-xl">
                🌱
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Gentle Recovery & Rhythm Reset
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {profile.serviceName} • Zero Guilt, Pure Support
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

          {/* Philosophy Statement */}
          <div className="p-4 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-800/60 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-300 font-black text-xs">
              <Heart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Life Happens — Your Progress Is Never Lost</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Care2Care is built on continuous care and resilience. A missed day is simply an opportunity to adjust, not a failure. Starting a recovery plan gives you a structured, gentle on-ramp to restore your rhythm.
            </p>
          </div>

          {/* Recovery Plan Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Your Gentle Reset Horizon:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlanDays(3)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPlanDays === 3
                    ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>3-Day Micro Reset</span>
                  {selectedPlanDays === 3 && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Quick focus to re-engage with your daily {profile.dailyTargetLabel.toLowerCase()}.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlanDays(7)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPlanDays === 7
                    ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>7-Day Full Reset</span>
                  {selectedPlanDays === 7 && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Rebuild steady morning and evening habits with gentle reminders.
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleStartReset}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <span>Begin {selectedPlanDays}-Day Gentle Reset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-bold cursor-pointer"
            >
              Cancel & Keep Current Timeline
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
