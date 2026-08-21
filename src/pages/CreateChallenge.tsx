import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HabitChallenge,
  ChallengeCategory,
  BehaviorDirection,
  ChallengeArchetype,
  MeasurementType
} from "../types";
import {
  interpretGoal,
  generate21DayPlan,
  GoalInterpretation
} from "../lib/behaviorEngine";
import {
  evaluateContentSafety,
  getAgeConsentStatus,
  ContentSafetyEvaluation
} from "../lib/safetyEngine";
import { AgeConsentModal } from "../components/AgeConsentModal";
import { PinProtectionModal } from "../components/PinProtectionModal";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Edit3,
  Calendar,
  AlertTriangle,
  Flame,
  ChevronDown,
  Clock,
  Wind,
  ShieldCheck,
  Brain,
  Sliders,
  EyeOff,
  BellRing,
  ArrowRight,
  RefreshCw,
  Lock,
  KeyRound,
  LifeBuoy
} from "lucide-react";

interface CreateChallengeProps {
  onBack: () => void;
  onCreate: (challenge: HabitChallenge) => void;
}

const DIRECTION_CARDS: Array<{
  id: BehaviorDirection;
  label: string;
  sub: string;
  icon: string;
  type: "build" | "reduce" | "custom";
}> = [
  { id: "build", label: "Build a good habit", sub: "Start a positive daily routine", icon: "🌱", type: "build" },
  { id: "strengthen", label: "Strengthen an existing habit", sub: "Take a routine to the next level", icon: "💪", type: "build" },
  { id: "reduce", label: "Reduce an unwanted habit", sub: "Lower frequency & consumption", icon: "📉", type: "reduce" },
  { id: "control", label: "Improve control over urges", sub: "Build mindful pauses & delays", icon: "🧠", type: "reduce" },
  { id: "stop", label: "Work toward stopping a behavior", sub: "Guided safe taper & phase out", icon: "🚫", type: "reduce" },
  { id: "replace", label: "Replace an unwanted behavior", sub: "Swap with a healthier substitute", icon: "🔁", type: "reduce" },
  { id: "pause", label: "Take intentional pauses", sub: "Periodic reset & detox intervals", icon: "⏸️", type: "reduce" },
  { id: "maintain", label: "Maintain a habit", sub: "Preserve consistency & rhythm", icon: "🔄", type: "build" },
  { id: "custom", label: "Create something completely custom", sub: "Full manual control", icon: "🛠️", type: "custom" }
];

const PRESET_BEHAVIOR_CHIPS: Array<{
  name: string;
  category: ChallengeCategory;
  direction: BehaviorDirection;
  icon: string;
  sensitive?: boolean;
}> = [
  // Good habits
  { name: "Morning Exercise", category: "Fitness", direction: "build", icon: "🏃" },
  { name: "Daily Meditation", category: "Mindfulness", direction: "build", icon: "🧘" },
  { name: "2.5L Daily Hydration", category: "Health", direction: "build", icon: "💧" },
  { name: "Deep Work & Study", category: "Productivity", direction: "build", icon: "⚡" },
  { name: "Daily Reading", category: "Learning", direction: "build", icon: "📚" },
  { name: "Gratitude Journaling", category: "Personal Growth", direction: "build", icon: "✍️" },
  { name: "Sleep by 10:30 PM", category: "Health", direction: "build", icon: "🌙" },
  { name: "Healthy Eating / Whole Foods", category: "Health", direction: "build", icon: "🥗" },
  // Unwanted habits
  { name: "Social Media & Screen Time", category: "Bad Habits to Avoid", direction: "reduce", icon: "📱" },
  { name: "Smoking / Tobacco Taper", category: "Bad Habits to Avoid", direction: "reduce", icon: "🚭" },
  { name: "Impulse Shopping & Spending", category: "Bad Habits to Avoid", direction: "control", icon: "💳" },
  { name: "Late-Night Phone Use", category: "Bad Habits to Avoid", direction: "reduce", icon: "📵" },
  { name: "Compulsive Urge Control", category: "Bad Habits to Avoid", direction: "control", icon: "🧠", sensitive: true },
  { name: "Porn & Sexual Urge Reset", category: "Bad Habits to Avoid", direction: "control", icon: "🛡️", sensitive: true },
  { name: "Alcohol & Substance Step-Down", category: "Bad Habits to Avoid", direction: "reduce", icon: "🌱", sensitive: true },
  { name: "Junk Food & Late Snacking", category: "Bad Habits to Avoid", direction: "reduce", icon: "🥑" },
  { name: "Procrastination Loop", category: "Productivity", direction: "reduce", icon: "⏳" }
];

const TRIGGER_CHIPS = [
  "Stress / High Pressure",
  "Boredom / Idle Time",
  "Anxiety / Restlessness",
  "After Meals",
  "Workplace / Fatigue",
  "Phone Notifications",
  "Late Night / Alone",
  "Social Settings",
  "Morning Routine"
];

const URGE_INTERVENTIONS = [
  "2-5 Min Micro-Delay Timer",
  "4-7-8 Deep Breathing Reset",
  "Drink Tall Glass of Cold Water",
  "2-Minute Walk & Stretch",
  "Cognitive Trigger Reflection",
  "Leave Current Room"
];

export const CreateChallenge: React.FC<CreateChallengeProps> = ({ onBack, onCreate }) => {
  // Step state (1: Direction & Category, 2: Goal & Baseline, 3: Triggers & Delays, 4: Preview 21 Days)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Form selections
  const [direction, setDirection] = useState<BehaviorDirection>("build");
  const [goalText, setGoalText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<ChallengeCategory>("Personal Growth");
  const [icon, setIcon] = useState<string>("🌱");
  const [dailyTimeMinutes, setDailyTimeMinutes] = useState<number>(15);
  const [initialDelayMinutes, setInitialDelayMinutes] = useState<number>(3);
  const [baselineDescription, setBaselineDescription] = useState<string>("Daily baseline assessment");
  const [baselineUrgeLevel, setBaselineUrgeLevel] = useState<number>(6);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([
    "Stress / High Pressure",
    "Boredom / Idle Time"
  ]);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([
    "2-5 Min Micro-Delay Timer",
    "4-7-8 Deep Breathing Reset"
  ]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [discreetNotifications, setDiscreetNotifications] = useState<boolean>(false);
  const [safetyText, setSafetyText] = useState<string | undefined>(undefined);
  const [strategySummary, setStrategySummary] = useState<string>("");

  // Safety & PIN Lock Protection state
  const [safetyEval, setSafetyEval] = useState<ContentSafetyEvaluation>({
    isSensitive: false,
    category: "none",
    matchedTerms: [],
    requiresAgeGate: false,
    safetyAdvisory: "",
    helplineInfo: null
  });
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [isPinProtected, setIsPinProtected] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingPreset, setPendingPreset] = useState<typeof PRESET_BEHAVIOR_CHIPS[0] | null>(null);

  // 21 Day Plan state
  const [tasks, setTasks] = useState<any[]>([]);

  // Check initial safety evaluation when goal text changes
  const runSafetyCheck = (text: string): ContentSafetyEvaluation => {
    const evalResult = evaluateContentSafety(text);
    setSafetyEval(evalResult);
    if (evalResult.isSensitive) {
      setIsPrivate(true);
      setDiscreetNotifications(true);
      if (evalResult.safetyAdvisory) {
        setSafetyText(evalResult.safetyAdvisory);
      }
    }
    return evalResult;
  };

  // When goal text changes or user selects preset, run AI interpretation
  const handleApplyPreset = async (preset: typeof PRESET_BEHAVIOR_CHIPS[0]) => {
    const sEval = runSafetyCheck(preset.name);
    if (sEval.requiresAgeGate && !isAgeVerified) {
      const consentStatus = await getAgeConsentStatus(sEval.category);
      if (!consentStatus.isVerifiedAdult) {
        setPendingPreset(preset);
        setIsAgeModalOpen(true);
        return;
      } else {
        setIsAgeVerified(true);
      }
    }

    applyPresetInternal(preset);
  };

  const applyPresetInternal = (preset: typeof PRESET_BEHAVIOR_CHIPS[0]) => {
    setDirection(preset.direction);
    setCategory(preset.category);
    setIcon(preset.icon);
    setTitle(preset.name);
    setGoalText(`I want to work on ${preset.name.toLowerCase()} for the next 21 days.`);
    const interp = interpretGoal(preset.name);
    setStrategySummary(interp.strategySummary);
    setSafetyText(interp.safetyText);
    setDailyTimeMinutes(interp.recommendedTimeMinutes);
    setWizardStep(2);
  };

  const handleGoalBlurOrAnalyze = () => {
    if (!goalText.trim()) return;
    runSafetyCheck(goalText);
    const interp = interpretGoal(goalText);
    if (!title) setTitle(interp.suggestedTitle);
    setIcon(interp.icon);
    setDirection(interp.direction);
    setStrategySummary(interp.strategySummary);
    if (interp.safetyText) setSafetyText(interp.safetyText);
    setDailyTimeMinutes(interp.recommendedTimeMinutes);
  };

  const handleStep1Continue = async () => {
    if (goalText) {
      const sEval = runSafetyCheck(goalText);
      if (sEval.requiresAgeGate && !isAgeVerified) {
        const consentStatus = await getAgeConsentStatus(sEval.category);
        if (!consentStatus.isVerifiedAdult) {
          setIsAgeModalOpen(true);
          return;
        } else {
          setIsAgeVerified(true);
        }
      }
    }
    setWizardStep(2);
  };

  const handleStep2Continue = async () => {
    const sEval = runSafetyCheck(goalText || title);
    if (sEval.requiresAgeGate && !isAgeVerified) {
      const consentStatus = await getAgeConsentStatus(sEval.category);
      if (!consentStatus.isVerifiedAdult) {
        setIsAgeModalOpen(true);
        return;
      } else {
        setIsAgeVerified(true);
      }
    }
    setWizardStep(3);
  };

  // Generate 21 Day Plan whenever proceeding to Step 4
  const handlePrepare21Days = () => {
    const finalTitle = title.trim() || goalText.slice(0, 30) || "21-Day Habit Milestone";
    const interp = interpretGoal(goalText || finalTitle);

    const generated = generate21DayPlan({
      title: finalTitle,
      direction,
      archetype: interp.archetype,
      measurementType: interp.measurementType,
      dailyTimeMinutes,
      initialDelayMinutes,
      triggers: selectedTriggers
    });

    setTasks(generated);
    setWizardStep(4);
  };

  const toggleTrigger = (trig: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trig) ? prev.filter((t) => t !== trig) : [...prev, trig]
    );
  };

  const handleConsentConfirmed = () => {
    setIsAgeVerified(true);
    setIsAgeModalOpen(false);
    if (pendingPreset) {
      applyPresetInternal(pendingPreset);
      setPendingPreset(null);
    } else {
      if (wizardStep === 1) setWizardStep(2);
      else if (wizardStep === 2) setWizardStep(3);
    }
  };

  const handleUnderAgeRedirect = () => {
    setIsAgeVerified(false);
    setIsAgeModalOpen(false);
    setPendingPreset(null);
    // Smoothly redirect to a youth-safe digital wellness challenge
    setDirection("reduce");
    setCategory("Bad Habits to Avoid");
    setIcon("📱");
    setTitle("Digital Screen Balance & Focus");
    setGoalText("I want to balance my daily screen time and build healthy daytime focus.");
    const interp = interpretGoal("Digital Screen Balance & Focus");
    setStrategySummary(interp.strategySummary);
    setSafetyText("Youth Wellness Mode: Fostering positive digital boundaries, healthy sleep routines, and calm focus.");
    setDailyTimeMinutes(15);
    setSafetyEval({
      isSensitive: false,
      category: "none",
      matchedTerms: [],
      requiresAgeGate: false,
      safetyAdvisory: "",
      helplineInfo: null
    });
    setWizardStep(2);
  };

  const handleFinalCreate = () => {
    const finalTitle = title.trim() || goalText.slice(0, 30) || "21-Day Habit Milestone";
    const interp = interpretGoal(goalText || finalTitle);
    const finalSafety = evaluateContentSafety(goalText || finalTitle);

    const newChallenge: HabitChallenge = {
      id: `custom-chal-${Date.now()}`,
      title: `${icon} ${finalTitle}`,
      description: strategySummary || `21 days of customized ${direction} progression in ${category}.`,
      category,
      currentDay: 1,
      totalDays: 21,
      status: "Active",
      streakCount: 0,
      icon,
      color: "#FFC9A7",
      completedDays: [],
      missedDays: 0,
      createdAt: new Date().toISOString(),
      tasks: tasks.length === 21 ? tasks : generate21DayPlan({
        title: finalTitle,
        direction,
        archetype: interp.archetype,
        measurementType: interp.measurementType,
        dailyTimeMinutes,
        initialDelayMinutes,
        triggers: selectedTriggers
      }),
      behaviorDirection: direction,
      challengeArchetype: interp.archetype,
      measurementType: interp.measurementType,
      dailyTimeAvailableMinutes: dailyTimeMinutes,
      initialDelayMinutes,
      safetyPathwayText: safetyText,
      triggers: selectedTriggers,
      urgeInterventions: selectedInterventions,
      isPrivate,
      discreetNotifications,
      // Age & Safety metadata
      isSensitive: finalSafety.isSensitive,
      sensitiveCategory: finalSafety.category,
      requiresAgeGate: finalSafety.requiresAgeGate,
      isAgeVerified: isAgeVerified || !finalSafety.requiresAgeGate,
      isPinProtected: isPinProtected && !!pinCode,
      pinCode: isPinProtected ? pinCode : undefined,
      isLocked: isPinProtected && !!pinCode
    };

    onCreate(newChallenge);
  };

  return (
    <div className="max-w-3xl mx-auto pb-28 space-y-4 animate-in fade-in duration-200">
      {/* Header Bar with Step Progress */}
      <div className="bg-[#FFF8F3] dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (wizardStep > 1) setWizardStep((prev) => (prev - 1) as any);
              else onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center cursor-pointer shadow-2xs hover:bg-orange-50 transition-all"
            title="Return"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Adaptive Challenge Builder
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Step {wizardStep} of 4 • {wizardStep === 1 ? "Intent & Direction" : wizardStep === 2 ? "Goal & Baseline" : wizardStep === 3 ? "Triggers & Privacy" : "21-Day Blueprint"}
            </p>
          </div>
        </div>

        {/* Step Indicator Bubbles */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                s === wizardStep
                  ? "bg-orange-500 w-6"
                  : s < wizardStep
                  ? "bg-emerald-500"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: INTENT & DIRECTION */}
      {/* ========================================================================= */}
      {wizardStep === 1 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Main Question Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                What would you like to do?
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                This configures the underlying 21-day behavioral engine for building positive habits or reducing unwanted urges.
              </p>
            </div>

            {/* Direction Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {DIRECTION_CARDS.map((card) => {
                const isSelected = direction === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setDirection(card.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 shadow-xs ring-2 ring-orange-300"
                        : "bg-[#FFF8F3] dark:bg-slate-850 border-[#FDE7D6] dark:border-slate-800 hover:bg-orange-50"
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{card.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {card.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {card.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Or pick a popular behavioral preset:
              </span>
              <span className="text-[11px] font-bold text-orange-600">Quick Start</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_BEHAVIOR_CHIPS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    preset.sensitive
                      ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                      : "bg-[#FFF8F3] dark:bg-slate-850 hover:bg-orange-100 dark:hover:bg-slate-800 border-[#FDE7D6] dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                  {preset.sensitive && (
                    <span className="text-[9px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-1 rounded-sm font-black">
                      18+
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Next Action */}
          <button
            type="button"
            onClick={handleStep1Continue}
            className="w-full py-4 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Continue to Goal & Baseline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: GOAL & BASELINE SETUP */}
      {/* ========================================================================= */}
      {wizardStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Natural Language Goal Input */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Tell us about your goal in your own words
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                e.g., "I want to stop checking Instagram every 10 minutes" or "I want to exercise 20 minutes every morning"
              </p>
            </div>

            <textarea
              rows={3}
              placeholder="Describe what you want to achieve or change..."
              value={goalText}
              onChange={(e) => {
                setGoalText(e.target.value);
                runSafetyCheck(e.target.value);
              }}
              onBlur={handleGoalBlurOrAnalyze}
              className="w-full bg-[#FFF8F3] dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium rounded-2xl p-3.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* AI Understanding Badge */}
            {strategySummary && (
              <div className="p-3.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-orange-900 dark:text-orange-200">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Here's how the engine interprets your challenge:</span>
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {strategySummary}
                </div>
              </div>
            )}

            {/* Sensitive / Age Gate Clinical Badge */}
            {safetyEval.isSensitive && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Confidential & Sensitive Focus Area (18+ Age Gated)</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                  {safetyEval.safetyAdvisory || safetyText}
                </p>
                {safetyEval.helplineInfo && (
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 p-2 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
                    <strong>Support Helpline:</strong> {safetyEval.helplineInfo.name} • {safetyEval.helplineInfo.contact} ({safetyEval.helplineInfo.hours})
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title & Customization Fields */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Challenge Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Social Media Mindful Reset"
                  className="w-full bg-[#FFF8F3] dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Badge Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-[#FFF8F3] dark:bg-slate-800 border border-[#FDE7D6] dark:border-slate-700 text-slate-900 dark:text-white text-center text-lg font-bold rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Daily Time Slider */}
            <div className="space-y-2 pt-2 border-t border-[#FDE7D6] dark:border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  How much time can you realistically spend daily?
                </span>
                <span className="text-orange-600 font-black">{dailyTimeMinutes} Minutes / Day</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={dailyTimeMinutes}
                onChange={(e) => setDailyTimeMinutes(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>5 mins (Micro)</span>
                <span>15 mins (Standard)</span>
                <span>30 mins</span>
                <span>60 mins (Intensive)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-200 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleStep2Continue}
              className="py-3.5 bg-[#FFC9A7] hover:bg-[#ffb68c] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Triggers & Privacy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: TRIGGERS, URGES & PRIVACY */}
      {/* ========================================================================= */}
      {wizardStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Triggers Selection */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                When are you most likely to experience urges or friction?
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Blessikaa will calibrate your daily prompts around these key trigger windows.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TRIGGER_CHIPS.map((chip) => {
                const isSelected = selectedTriggers.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleTrigger(chip)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300 text-rose-900 dark:text-rose-200"
                        : "bg-[#FFF8F3] dark:bg-slate-850 border-[#FDE7D6] dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Micro-Delay & Alternative Setting */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  Initial Urge Delay Window:
                </span>
                <span className="text-orange-600 font-black">{initialDelayMinutes} Minutes</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={initialDelayMinutes}
                onChange={(e) => setInitialDelayMinutes(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                You will practice delaying the impulse for {initialDelayMinutes} mins in Phase 1 before deciding.
              </p>
            </div>

            {/* Privacy & Notification Settings */}
            <div className="pt-3 border-t border-[#FDE7D6] dark:border-slate-800 space-y-3">
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Privacy & PIN Security
              </span>

              {/* 4-Digit PIN Lock Protection */}
              <div className="p-3.5 bg-orange-50/70 dark:bg-slate-850 rounded-2xl border border-orange-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-200/70 dark:bg-orange-950/60 flex items-center justify-center text-orange-800 dark:text-orange-300">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        4-Digit PIN Lock Protection
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isPinProtected && pinCode
                          ? `PIN is set (${pinCode.replace(/./g, "•")})`
                          : "Require a secret PIN code before opening this challenge"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isPinProtected || !pinCode) {
                        setIsPinModalOpen(true);
                      } else {
                        setIsPinProtected(false);
                        setPinCode("");
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isPinProtected && pinCode
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-slate-800 border border-slate-300 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isPinProtected && pinCode ? "Protected ✓" : "Set PIN"}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 p-2.5 bg-[#FFF8F3] dark:bg-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Private Challenge</div>
                  <div className="text-[10px] text-slate-500">Hide details from shared community feeds</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 bg-[#FFF8F3] dark:bg-slate-850 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={discreetNotifications}
                  onChange={(e) => setDiscreetNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Discreet Notifications</div>
                  <div className="text-[10px] text-slate-500">Shows "Your check-in is ready" instead of explicit behavior names</div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-200 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handlePrepare21Days}
              className="py-3.5 bg-[#FFC9A7] hover:bg-[#ffb68c] text-orange-950 font-black text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Generate 21-Day Plan</span>
              <Sparkles className="w-4 h-4 text-orange-700" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: 21-DAY BLUEPRINT PREVIEW & ACTIVATION */}
      {/* ========================================================================= */}
      {wizardStep === 4 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Summary Banner */}
          <div className="bg-[#FFF8F3] dark:bg-slate-900 border-2 border-orange-300 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    {title || "21-Day Behavioral Challenge"}
                  </h2>
                  <p className="text-xs text-orange-800 dark:text-orange-300 font-bold">
                    {direction.toUpperCase()} • {dailyTimeMinutes} Mins/Day • {initialDelayMinutes}m Urge Delay
                  </p>
                </div>
              </div>

              {isPinProtected && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-black rounded-lg flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>PIN Protected</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {strategySummary || "4-Phase Progression: Baseline Awareness → Active Intervention & Delays → High Stress Resilience → 21-Day Neural Rewiring"}
            </p>
          </div>

          {/* 21-Day Interactive Task List Preview */}
          <div className="bg-white dark:bg-slate-900 border border-[#FDE7D6] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                21-Day Progressive Roadmap ({tasks.length} Days)
              </span>
              <span className="text-[11px] font-bold text-slate-400">Phase 1 to 4</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {tasks.map((task, idx) => (
                <div
                  key={task.dayNumber}
                  className="p-3 bg-[#FFF8F3] dark:bg-slate-850 rounded-2xl border border-[#FDE7D6] dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-orange-950 dark:text-orange-200">
                      Day {task.dayNumber}: {task.title.replace(/^Day \d+:\s*/, "")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {task.dayNumber <= 7 ? "Phase 1: Awareness" : task.dayNumber <= 14 ? "Phase 2: Delays" : task.dayNumber <= 20 ? "Phase 3: Resilience" : "Phase 4: Milestone"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {task.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-200 cursor-pointer"
            >
              Back & Adjust
            </button>
            <button
              type="button"
              onClick={handleFinalCreate}
              className="py-4 bg-[#FFC9A7] hover:bg-[#ffb68c] active:bg-[#fca576] text-orange-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Activate My 21-Day Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* Age Consent Modal */}
      <AgeConsentModal
        isOpen={isAgeModalOpen}
        safetyEval={safetyEval}
        onClose={() => setIsAgeModalOpen(false)}
        onConsentConfirmed={handleConsentConfirmed}
        onUnderAgeRedirect={handleUnderAgeRedirect}
      />

      {/* PIN Setup Modal */}
      <PinProtectionModal
        isOpen={isPinModalOpen}
        mode="set_pin"
        challengeTitle={title || "Custom Challenge"}
        onSuccess={(newPin) => {
          if (newPin) {
            setPinCode(newPin);
            setIsPinProtected(true);
          }
          setIsPinModalOpen(false);
        }}
        onClose={() => setIsPinModalOpen(false)}
      />
    </div>
  );
};
