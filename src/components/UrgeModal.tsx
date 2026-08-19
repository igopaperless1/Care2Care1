import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UrgeLog, TriggerProfile, HabitChallenge } from "../types";
import {
  AlertCircle,
  Clock,
  Heart,
  Wind,
  Sparkles,
  CheckCircle2,
  X,
  Droplets,
  Footprints,
  FileText,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2
} from "lucide-react";

interface UrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: HabitChallenge;
  currentDay: number;
  onUrgeLogged: (urgeLog: UrgeLog, pointsAwarded: number) => void;
}

const TRIGGER_CHIPS = [
  { label: "Stress & Tension", type: "emotion", icon: "⚡" },
  { label: "Boredom & Restlessness", type: "emotion", icon: "🥱" },
  { label: "Anxiety or Worry", type: "emotion", icon: "💭" },
  { label: "Fatigue / Exhaustion", type: "emotion", icon: "😴" },
  { label: "Social Setting / Peers", type: "situation", icon: "👥" },
  { label: "After a Meal", type: "routine", icon: "🍽️" },
  { label: "Work Pressure / Frustration", type: "situation", icon: "💼" },
  { label: "Phone Notification / App", type: "digital", icon: "📱" },
  { label: "Being Alone / Late Night", type: "environment", icon: "🌙" },
  { label: "Specific Location / Environment", type: "environment", icon: "📍" }
];

const ALTERNATIVE_ACTIONS = [
  { title: "4-7-8 Breathing Reset", desc: "4 deep cycles of parasympathetic breathing", icon: "🧘" },
  { title: "Drink Cold Water", desc: "A tall glass of iced water to stimulate vagus nerve", icon: "💧" },
  { title: "2-Minute Walk & Stretch", desc: "Step outside or walk down the hallway", icon: "🚶" },
  { title: "Wash Face with Cold Water", desc: "Mammalian dive reflex lowers heart rate immediately", icon: "🌊" },
  { title: "Write Down What You Feel", desc: "Put the urge into 2 sentences on paper", icon: "✍️" }
];

export const UrgeModal: React.FC<UrgeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentDay,
  onUrgeLogged
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [urgeIntensity, setUrgeIntensity] = useState<number>(6);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState<string>("");
  const [actionChoice, setActionChoice] = useState<"delay" | "alternative" | "episode" | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<string>("");
  
  // Timer State for Delay
  const [delaySecondsRemaining, setDelaySecondsRemaining] = useState<number>(120); // 2 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setUrgeIntensity(6);
      setSelectedTriggers([]);
      setCustomTrigger("");
      setActionChoice(null);
      setSelectedAlternative("");
      setDelaySecondsRemaining((challenge.initialDelayMinutes || 2) * 60);
      setIsTimerRunning(false);
      setTimerFinished(false);
    }
  }, [isOpen, challenge]);

  // Live Timer Countdown for Delay
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && delaySecondsRemaining > 0) {
      interval = setInterval(() => {
        setDelaySecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && delaySecondsRemaining <= 0) {
      setIsTimerRunning(false);
      setTimerFinished(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, delaySecondsRemaining]);

  if (!isOpen) return null;

  const toggleTrigger = (triggerName: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(triggerName) ? prev.filter((t) => t !== triggerName) : [...prev, triggerName]
    );
  };

  const handleStartDelayTimer = () => {
    setActionChoice("delay");
    setIsTimerRunning(true);
  };

  const handleFinishIntervention = (type: "delay" | "alternative" | "episode") => {
    const triggerDesc = [
      ...selectedTriggers,
      customTrigger.trim() ? customTrigger.trim() : ""
    ]
      .filter(Boolean)
      .join(", ");

    const newLog: UrgeLog = {
      id: `urge-${Date.now()}`,
      challengeId: challenge.id,
      timestamp: new Date().toISOString(),
      dayNumber: currentDay,
      urgeIntensity,
      triggerType: selectedTriggers[0] || "emotion",
      triggerDescription: triggerDesc || "Sudden craving",
      actionTaken: type === "episode" ? "episode_occurred" : type === "delay" ? "delay" : "alternative",
      delayMinutes: type === "delay" ? Math.round(((challenge.initialDelayMinutes || 2) * 60 - delaySecondsRemaining) / 60) || 2 : undefined,
      alternativeAction: type === "alternative" ? selectedAlternative : undefined,
      isOvercome: type !== "episode",
      recoveryPointsEarned: type === "episode" ? 1 : 2
    };

    onUrgeLogged(newLog, newLog.recoveryPointsEarned);
    setStep(4);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 2) return "Mild Awareness (1-2)";
    if (val <= 4) return "Manageable Pull (3-4)";
    if (val <= 6) return "Noticeable Craving (5-6)";
    if (val <= 8) return "Intense Pressure (7-8)";
    return "Peak Urgent Craving (9-10)";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="bg-[#FFF8F3] dark:bg-slate-900 border-t-2 sm:border-2 border-[#FDE7D6] dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#FDE7D6] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Urge Mode & Micro-Pause
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Day {currentDay} • {challenge.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: URGE INTENSITY (0 - 10) */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-2xl">🧠</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                How intense is this urge right now?
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Rating the craving engages your prefrontal cortex and weakens impulse autopilot.
              </p>
            </div>

            {/* Scale Visual */}
            <div className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Intensity:</span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {getIntensityLabel(urgeIntensity)}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={urgeIntensity}
                onChange={(e) => setUrgeIntensity(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />

              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>1 (Mild)</span>
                <span>5 (Noticeable)</span>
                <span>10 (Overwhelming)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Next: Identify Trigger</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: TRIGGER IDENTIFICATION */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-2xl">🎯</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                What triggered this craving?
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Select any factors that apply. This builds your behavioral trigger profile.
              </p>
            </div>

            {/* Chips Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {TRIGGER_CHIPS.map((chip) => {
                const isSelected = selectedTriggers.includes(chip.label);
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => toggleTrigger(chip.label)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-100 dark:bg-rose-950/80 border-rose-300 text-rose-900 dark:text-rose-200 shadow-2xs"
                        : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50"
                    }`}
                  >
                    <span>{chip.icon}</span>
                    <span className="truncate">{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Trigger Input */}
            <input
              type="text"
              placeholder="Or type custom trigger (e.g. argument with boss)..."
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-850 border border-[#FDE7D6] dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-200 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 bg-[#FFC9A7] hover:bg-[#ffb68c] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-xs cursor-pointer"
              >
                Choose Action
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: INTERVENTION STRATEGY */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-2xl">⏳</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Choose your intervention strategy
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                You don't have to decide right now. Give yourself a 2-minute pause.
              </p>
            </div>

            {/* Active Delay Timer Screen */}
            {actionChoice === "delay" && (
              <div className="p-5 bg-gradient-to-br from-orange-50 via-rose-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl border-2 border-orange-200 dark:border-slate-700 text-center space-y-3">
                <span className="text-xs font-black uppercase text-orange-800 dark:text-orange-300">
                  Mindful Pause In Progress
                </span>

                <div className="text-4xl font-black font-mono text-slate-900 dark:text-white">
                  {formatTime(delaySecondsRemaining)}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {isTimerRunning
                    ? "Inhale slowly for 4 seconds... Exhale for 6 seconds. The craving wave will crest and decline."
                    : timerFinished
                    ? "🎉 You successfully completed the pause! Notice how the urge has reduced."
                    : "Tap to begin your 2-minute pause."}
                </p>

                {timerFinished ? (
                  <button
                    type="button"
                    onClick={() => handleFinishIntervention("delay")}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
                  >
                    Lock In Pause (+2 Recovery Points)
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFinishIntervention("delay")}
                      className="flex-1 py-2.5 bg-[#FFC9A7] text-orange-950 font-black text-xs rounded-xl shadow-xs"
                    >
                      Urge Passed Early ✨
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Alternative Action Picker Screen */}
            {actionChoice === "alternative" && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-500">Pick an immediate substitute:</span>
                {ALTERNATIVE_ACTIONS.map((alt) => (
                  <button
                    key={alt.title}
                    type="button"
                    onClick={() => {
                      setSelectedAlternative(alt.title);
                      handleFinishIntervention("alternative");
                    }}
                    className="w-full p-3 bg-white dark:bg-slate-850 hover:bg-orange-50 border border-[#FDE7D6] dark:border-slate-700 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all shadow-2xs"
                  >
                    <span className="text-2xl">{alt.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {alt.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{alt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 3 Main Action Tiles (if neither chosen yet) */}
            {actionChoice === null && (
              <div className="space-y-2">
                {/* 1. Delay Timer */}
                <button
                  type="button"
                  onClick={handleStartDelayTimer}
                  className="w-full p-3.5 bg-white dark:bg-slate-850 hover:bg-orange-50 dark:hover:bg-slate-700 border-2 border-orange-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        Delay {challenge.initialDelayMinutes || 2} Minutes
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Ride the urge wave with interactive breathing
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-orange-700 bg-orange-100 px-2 py-1 rounded-lg">
                    +2 🪙
                  </span>
                </button>

                {/* 2. Alternative Action */}
                <button
                  type="button"
                  onClick={() => setActionChoice("alternative")}
                  className="w-full p-3.5 bg-white dark:bg-slate-850 hover:bg-orange-50 dark:hover:bg-slate-700 border-2 border-teal-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        Do a Replacement Action
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Cold water, 4-7-8 breath, or physical stretch
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-teal-700 bg-teal-100 px-2 py-1 rounded-lg">
                    +2 🪙
                  </span>
                </button>

                {/* 3. Non-Judgmental Episode Log */}
                <button
                  type="button"
                  onClick={() => handleFinishIntervention("episode")}
                  className="w-full p-3 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        I engaged in the behavior
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Log data non-judgmentally to track your patterns
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    +1 🪙
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SUCCESS & AFFIRMATION */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="text-center space-y-4 py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Awareness Logged Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium px-4 leading-relaxed">
                Every time you pause, observe your trigger, or log your state, you weaken the automated impulse loop.
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>+2 Awareness & Recovery Points Awarded 🪙</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#FFC9A7] hover:bg-[#ffb68c] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-xs cursor-pointer"
            >
              Return to 21-Day Journey
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
