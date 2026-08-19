import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LifelongServiceProfile,
  LifelongSetupConfig,
  ServiceArchetype
} from "../../types";
import { saveLifelongProfile, getLifelongProfile } from "../../lib/lifelongEngine";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Bell,
  Target,
  Activity,
  Heart
} from "lucide-react";

interface ServiceSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  onSetupComplete?: (config: LifelongSetupConfig) => void;
}

export const ServiceSetupWizard: React.FC<ServiceSetupWizardProps> = ({
  isOpen,
  onClose,
  serviceId,
  onSetupComplete
}) => {
  const currentProfile = getLifelongProfile(serviceId);

  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>(currentProfile.primaryGoalText);
  const [baseline, setBaseline] = useState<string>("Current moderate routine");
  const [targetValue, setTargetValue] = useState<number>(currentProfile.dailyTargetValue);
  const [targetUnit, setTargetUnit] = useState<string>(currentProfile.dailyTargetUnit);
  const [frequency, setFrequency] = useState<"daily" | "weekdays" | "weekends" | "multiple_daily" | "weekly" | "custom">("daily");
  const [preferredTime, setPreferredTime] = useState<string>("08:00");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderStyle, setReminderStyle] = useState<"gentle" | "motivational" | "minimal" | "direct" | "encouraging">("gentle");

  if (!isOpen) return null;

  const handleFinish = () => {
    const config: LifelongSetupConfig = {
      serviceId,
      goal,
      currentBaseline: baseline,
      targetValue,
      targetUnit,
      frequency,
      preferredTime,
      reminderEnabled,
      reminderStyle,
      careArchetype: currentProfile.archetype
    };

    const updatedProfile: LifelongServiceProfile = {
      ...currentProfile,
      primaryGoalText: goal,
      dailyTargetValue: targetValue,
      dailyTargetUnit: targetUnit,
      careTone: reminderStyle === "gentle" ? "gentle" : reminderStyle === "encouraging" ? "supportive" : "empowering"
    };
    saveLifelongProfile(updatedProfile);

    if (onSetupComplete) {
      onSetupComplete(config);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Step {step} of 6
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Personalize Your {currentProfile.serviceName} Journey
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Care2Care 21-Day & Lifelong Rhythm Setup
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  1. What is your primary aspiration in this area?
                </label>
                <p className="text-xs text-slate-500">
                  Define what success and care look like for you.
                </p>
              </div>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Walk 8,000 steps daily for sustained energy and calm..."
              />
            </div>
          )}

          {/* Step 2: Baseline */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  2. What is your current comfortable baseline?
                </label>
                <p className="text-xs text-slate-500">
                  Knowing your current routine helps us set an encouraging, sustainable pace without overwhelm.
                </p>
              </div>
              <input
                type="text"
                value={baseline}
                onChange={(e) => setBaseline(e.target.value)}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Currently averaging ~4,000 steps 3 days a week"
              />
            </div>
          )}

          {/* Step 3: Target */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  3. Set your daily target
                </label>
                <p className="text-xs text-slate-500">
                  Choose a manageable daily threshold that feels rewarding to hit.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Target Quantity</label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block">Unit of Measurement</label>
                  <input
                    type="text"
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Frequency */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  4. How frequently do you want to practice this?
                </label>
                <p className="text-xs text-slate-500">
                  Daily consistency builds automatic habits, but choose what fits your week.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: "daily", label: "Everyday (Daily)" },
                  { value: "weekdays", label: "Weekdays (Mon-Fri)" },
                  { value: "weekends", label: "Weekends Only" },
                  { value: "multiple_daily", label: "Multiple Times/Day" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrequency(opt.value as any)}
                    className={`p-3 rounded-2xl border text-xs font-black text-left transition-all cursor-pointer ${
                      frequency === opt.value
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Schedule / Time */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  5. Preferred Time / Window
                </label>
                <p className="text-xs text-slate-500">
                  When during your day does this action feel most natural?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 6: Supportive Reminders */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  6. Supportive Reminders & Care Tone
                </label>
                <p className="text-xs text-slate-500">
                  Care2Care uses supportive, non-fear based reminders to keep you engaged.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Enable Friendly Daily Check-in</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 block">Reminder Style:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "gentle", label: "Gentle & Calm" },
                    { value: "encouraging", label: "Encouraging" },
                    { value: "minimal", label: "Minimal" }
                  ].map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setReminderStyle(style.value as any)}
                      className={`p-2.5 rounded-xl border text-[11px] font-black text-center cursor-pointer transition-all ${
                        reminderStyle === style.value
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-900 dark:text-blue-200"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Begin 21-Day Rhythm</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
