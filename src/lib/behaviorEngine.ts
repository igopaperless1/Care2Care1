import {
  HabitChallenge,
  ChallengeDayTask,
  BehaviorDirection,
  ChallengeArchetype,
  MeasurementType,
  RecoveryAction,
  TriggerProfile
} from "../types";

export interface GoalInterpretation {
  direction: BehaviorDirection;
  archetype: ChallengeArchetype;
  measurementType: MeasurementType;
  strategySummary: string;
  suggestedTitle: string;
  icon: string;
  safetyText?: string;
  recommendedTimeMinutes: number;
}

// Built-in Recovery Actions Library (Non-judgmental & safe)
export const SAFE_RECOVERY_ACTIONS: RecoveryAction[] = [
  {
    id: "rec-1",
    title: "3-Minute Trigger & Emotional Audit",
    description: "Identify what emotion, environment, or thought preceded yesterday's lapse without any judgment.",
    category: "trigger_audit",
    durationMinutes: 3
  },
  {
    id: "rec-2",
    title: "4-7-8 Parasympathetic Reset Breath",
    description: "Inhale 4s, hold 7s, exhale 8s for 4 cycles to lower nervous system cortisol.",
    category: "breathing",
    durationMinutes: 4
  },
  {
    id: "rec-3",
    title: "Cognitive Pause & Re-centering Reflection",
    description: "Write 2 sentences: 'What did this lapse teach me about my triggers?'",
    category: "reflection",
    durationMinutes: 3
  },
  {
    id: "rec-4",
    title: "Hydration & Physical Posture Shift",
    description: "Drink a tall glass of cool water and do 60 seconds of shoulder rolls and spinal stretches.",
    category: "hydration_stretch",
    durationMinutes: 2
  },
  {
    id: "rec-5",
    title: "Micro-Environment Reset",
    description: "Step outside or change your physical room for 5 minutes to break the behavioral loop.",
    category: "environment_shift",
    durationMinutes: 5
  }
];

// Natural Language Goal Interpretation Engine
export function interpretGoal(rawGoal: string): GoalInterpretation {
  const lower = rawGoal.toLowerCase();

  // 1. Check for Unwanted / Addiction / Reduction behaviors
  if (
    lower.includes("smoke") ||
    lower.includes("cigarette") ||
    lower.includes("vape") ||
    lower.includes("tobacco") ||
    lower.includes("nicotine")
  ) {
    return {
      direction: "reduce",
      archetype: "addiction",
      measurementType: "quantity",
      strategySummary: "Awareness → Micro-Delay (2→15m) → Trigger Urge-Busting → Tapered Reduction",
      suggestedTitle: "Smoking & Nicotine Step-Down",
      icon: "🚭",
      safetyText: "Care2Care provides self-management and behavioral habit support, not medical treatment. If you experience intense withdrawal symptoms or need medical cessation therapy, please consult a licensed healthcare professional.",
      recommendedTimeMinutes: 10
    };
  }

  if (
    lower.includes("instagram") ||
    lower.includes("tiktok") ||
    lower.includes("screen") ||
    lower.includes("social media") ||
    lower.includes("phone") ||
    lower.includes("doomscroll")
  ) {
    return {
      direction: "reduce",
      archetype: "screen_time",
      measurementType: "duration",
      strategySummary: "Friction Barriers → Micro-Delays → App Free Windows → Mindful Attention",
      suggestedTitle: "Digital Detox & Social Media Moderation",
      icon: "📱",
      safetyText: undefined,
      recommendedTimeMinutes: 15
    };
  }

  if (
    lower.includes("spend") ||
    lower.includes("shop") ||
    lower.includes("money") ||
    lower.includes("purchase") ||
    lower.includes("buy")
  ) {
    return {
      direction: "control",
      archetype: "finance",
      measurementType: "interval",
      strategySummary: "24-Hour Purchase Delay → Impulse Reflection → Budget Boundary Lock",
      suggestedTitle: "Impulse Spending & Money Control",
      icon: "💳",
      safetyText: undefined,
      recommendedTimeMinutes: 10
    };
  }

  if (
    lower.includes("porn") ||
    lower.includes("masturbat") ||
    lower.includes("compulsive") ||
    lower.includes("sexual") ||
    lower.includes("xxx") ||
    lower.includes("erotica") ||
    lower.includes("onlyfans") ||
    lower.includes("nofap")
  ) {
    return {
      direction: "control",
      archetype: "addiction",
      measurementType: "interval",
      strategySummary: "Urge Recognition → 3-Min Parasympathetic Gap → Environmental Shift → Autonomous Reset",
      suggestedTitle: "Compulsive Urge Control & Mindful Reset",
      icon: "🧠",
      safetyText: "Care2Care provides a private, supportive, and non-judgmental environment for self-regulation. Progress is anchored in self-compassion, impulse awareness, and emotional resilience without shame or moral blame.",
      recommendedTimeMinutes: 15
    };
  }

  if (
    lower.includes("drug") ||
    lower.includes("weed") ||
    lower.includes("cannabis") ||
    lower.includes("marijuana") ||
    lower.includes("alcohol") ||
    lower.includes("drinking") ||
    lower.includes("liquor") ||
    lower.includes("beer") ||
    lower.includes("substance") ||
    lower.includes("sober") ||
    lower.includes("sobriety")
  ) {
    return {
      direction: "reduce",
      archetype: "addiction",
      measurementType: "interval",
      strategySummary: "Trigger Audit → Micro-Delay Windows → Supportive Craving Surfing → Sober Milestones",
      suggestedTitle: "Substance & Craving Step-Down Protocol",
      icon: "🛡️",
      safetyText: "Care2Care provides self-management and behavioral habit routines, not medical detoxification or clinical therapy. If you experience severe withdrawal or need licensed medical help, please consult a healthcare professional or contact the SAMHSA Helpline at 1-800-662-4357.",
      recommendedTimeMinutes: 15
    };
  }

  if (
    lower.includes("eat") ||
    lower.includes("sugar") ||
    lower.includes("snack") ||
    lower.includes("junk") ||
    lower.includes("caffeine")
  ) {
    return {
      direction: "reduce",
      archetype: "nutrition",
      measurementType: "frequency",
      strategySummary: "Craving Gap (5m) → Hydration Swap → Mindful Eating Windows",
      suggestedTitle: "Snacking & Sugar Reset",
      icon: "🥑",
      safetyText: undefined,
      recommendedTimeMinutes: 15
    };
  }

  // 2. Positive / Build habits
  if (
    lower.includes("exercise") ||
    lower.includes("workout") ||
    lower.includes("run") ||
    lower.includes("gym") ||
    lower.includes("walk")
  ) {
    return {
      direction: "build",
      archetype: "fitness",
      measurementType: "duration",
      strategySummary: "Micro-Movement (10m) → Progressive Intensity → Morning Anchoring",
      suggestedTitle: "Daily Morning Movement & Fitness",
      icon: "🏃",
      safetyText: undefined,
      recommendedTimeMinutes: 20
    };
  }

  if (
    lower.includes("meditat") ||
    lower.includes("breath") ||
    lower.includes("mindful") ||
    lower.includes("calm") ||
    lower.includes("peace")
  ) {
    return {
      direction: "build",
      archetype: "mindfulness",
      measurementType: "duration",
      strategySummary: "3-Min Breathwork → Focused Awareness → Body Scan Anchors",
      suggestedTitle: "Daily Mindfulness & Serenity",
      icon: "🧘",
      safetyText: undefined,
      recommendedTimeMinutes: 15
    };
  }

  if (
    lower.includes("study") ||
    lower.includes("read") ||
    lower.includes("focus") ||
    lower.includes("work") ||
    lower.includes("deep work") ||
    lower.includes("code")
  ) {
    return {
      direction: "build",
      archetype: "productivity",
      measurementType: "duration",
      strategySummary: "Pomodoro Focus Block → Zero Distraction Environment → Daily Synthesis",
      suggestedTitle: "Deep Focus & Intellectual Mastery",
      icon: "⚡",
      safetyText: undefined,
      recommendedTimeMinutes: 25
    };
  }

  if (lower.includes("water") || lower.includes("hydrat")) {
    return {
      direction: "build",
      archetype: "habit",
      measurementType: "quantity",
      strategySummary: "Morning 500ml Anchor → Hourly Water Check-ins → Hydration Milestones",
      suggestedTitle: "Optimal 2.5L Daily Hydration",
      icon: "💧",
      safetyText: undefined,
      recommendedTimeMinutes: 5
    };
  }

  // Default interpretation
  return {
    direction: "build",
    archetype: "habit",
    measurementType: "duration",
    strategySummary: "Awareness & Intent → Daily Action Step → Consistency Streak",
    suggestedTitle: rawGoal.trim() ? rawGoal.slice(0, 40) : "21-Day Habit Milestone",
    icon: "🎯",
    safetyText: undefined,
    recommendedTimeMinutes: 15
  };
}

// 21-Day Adaptive Progression Generator
export function generate21DayPlan(params: {
  title: string;
  direction: BehaviorDirection;
  archetype: ChallengeArchetype;
  measurementType: MeasurementType;
  dailyTimeMinutes: number;
  baselineValue?: string | number;
  initialDelayMinutes?: number;
  triggers?: string[];
  progressionStyle?: "gradual" | "balanced" | "aggressive";
  customNotes?: string;
}): ChallengeDayTask[] {
  const {
    title,
    direction,
    archetype,
    dailyTimeMinutes = 15,
    initialDelayMinutes = 3,
    triggers = ["stress", "routine"]
  } = params;

  const isReductionOrStop =
    direction === "reduce" ||
    direction === "stop" ||
    direction === "control" ||
    direction === "pause" ||
    archetype === "addiction" ||
    archetype === "screen_time";

  const triggerString = triggers.length > 0 ? triggers.join(", ") : "stress, fatigue, or boredom";

  return Array.from({ length: 21 }, (_, idx) => {
    const dayNumber = idx + 1;
    let phase = 1;
    let objective = "";
    let taskTitle = "";
    let description = "";
    let whyItMatters = "";
    let possibleRecoveryAction = "3-Minute Trigger & Emotional Audit";
    let alternativeAction = "Drink cold water and do 4-7-8 deep breathing";
    let reflectionPrompt = "";

    // 4 Progression Phases:
    // Phase 1: Days 1-7 (Foundation & Awareness)
    // Phase 2: Days 8-14 (Progression & Intervention / Urge Mode)
    // Phase 3: Days 15-20 (Consolidation & Extended Delays)
    // Phase 4: Day 21 (Master Finale & Long-term Protocol)

    if (dayNumber <= 7) {
      phase = 1;
      if (isReductionOrStop) {
        objective = `Phase 1: Baseline Awareness & Trigger Identification`;
        taskTitle = `Day ${dayNumber}: Log Triggers & Practice ${initialDelayMinutes}-Min Micro-Pause`;
        description = `Observe when the urge to engage in ${title} strikes (especially during ${triggerString}). When the urge hits, tap "I'm having an urge" and wait just ${initialDelayMinutes} minutes before deciding.`;
        whyItMatters = `Neural circuits for automatic impulses lose up to 50% of their peak intensity within the first 3 minutes of mindful observation.`;
        reflectionPrompt = `What emotion or physical sensation immediately preceded your strongest urge today?`;
      } else {
        objective = `Phase 1: Micro-Habit Anchor & Friction Reduction`;
        taskTitle = `Day ${dayNumber}: Initial ${Math.min(10, dailyTimeMinutes)}-Minute Focused Execution`;
        description = `Complete a short, friction-free session of ${title}. Focus purely on starting rather than perfection.`;
        whyItMatters = `Building consistency requires lowering the cognitive barrier of entry until the basal ganglia recognizes the routine.`;
        reflectionPrompt = `How did starting today feel compared to yesterday?`;
      }
    } else if (dayNumber <= 14) {
      phase = 2;
      const delayMins = initialDelayMinutes + (dayNumber - 7) * 2;
      if (isReductionOrStop) {
        objective = `Phase 2: Active Urge Interventions & ${delayMins}-Min Delays`;
        taskTitle = `Day ${dayNumber}: Implement Replacement Action & ${delayMins}-Minute Delay`;
        description = `When an impulse arises, immediately engage your chosen alternative (e.g. 4-7-8 breathing, brisk walk, or cold water) for ${delayMins} full minutes.`;
        whyItMatters = `Replacing a habit loop with a harmless substitute preserves dopamine homeostasis while breaking the compulsive pathway.`;
        reflectionPrompt = `Which replacement action felt most calming when an urge occurred?`;
      } else {
        objective = `Phase 2: Depth, Focus & Technique Expansion`;
        taskTitle = `Day ${dayNumber}: Dedicated ${dailyTimeMinutes}-Minute Practice`;
        description = `Engage in ${dailyTimeMinutes} minutes of focused ${title}. Push your attention span with zero distraction.`;
        whyItMatters = `Intermediate milestones solidify synaptic connections, transitioning conscious effort into habitual automaticity.`;
        reflectionPrompt = `What distraction did you successfully resist during today's practice?`;
      }
    } else if (dayNumber <= 20) {
      phase = 3;
      const extendedDelay = initialDelayMinutes + 12;
      if (isReductionOrStop) {
        objective = `Phase 3: High-Stress Resilience & Extended Control`;
        taskTitle = `Day ${dayNumber}: High-Friction Boundary & ${extendedDelay}-Min Delay Buffer`;
        description = `Maintain behavior-free windows throughout your peak trigger hours. Lean into the Urge Mode timer whenever tension builds.`;
        whyItMatters = `Resilience under real-world emotional stress confirms the formation of new prefrontal executive control.`;
        reflectionPrompt = `Rate your sense of self-control today compared to Day 1 on a scale of 1-10.`;
      } else {
        objective = `Phase 3: Flow State & Identity Lock-In`;
        taskTitle = `Day ${dayNumber}: Flow State Mastery (${dailyTimeMinutes} mins)`;
        description = `Execute ${title} with ease and rhythm. Embody the identity of someone who practices this effortlessly every day.`;
        whyItMatters = `When habit execution aligns with self-identity, motivation becomes self-sustaining.`;
        reflectionPrompt = `How has practicing this habit changed how you view yourself?`;
      }
    } else {
      // Day 21 Finale
      phase = 4;
      if (isReductionOrStop) {
        objective = `Phase 4: 21-Day Neural Rewire Master Milestone`;
        taskTitle = `Day 21: Permanent Self-Mastery & Maintenance Blueprint`;
        description = `Celebrate 21 days of impulse awareness, urge delays, and reclaimed control. Review your trigger profiles and establish your ongoing 90-day maintenance protocol.`;
        whyItMatters = `You have successfully weakened the automatic impulse loop and built durable neuroplastic pathways of conscious autonomy.`;
        reflectionPrompt = `What was your biggest breakthrough during this 21-day journey?`;
      } else {
        objective = `Phase 4: 21-Day Habit Formation Milestone`;
        taskTitle = `Day 21: Permanent Lifestyle Integration & Graduation`;
        description = `Complete your 21st consecutive practice milestone! Reflect on your total time invested and lock in your permanent habit cadence.`;
        whyItMatters = `Scientific neuroplasticity studies demonstrate that 21 days of unbroken rhythm establishes the basal neural scaffold for a lifetime habit.`;
        reflectionPrompt = `How will you maintain this positive rhythm over the next 90 days?`;
      }
    }

    return {
      dayNumber,
      title: taskTitle,
      description,
      isCompleted: false,
      objective,
      whyItMatters,
      estimatedTimeMinutes: dailyTimeMinutes,
      measurementType: params.measurementType,
      possibleRecoveryAction,
      alternativeAction,
      reflectionPrompt,
      urgeStateEnabled: isReductionOrStop
    };
  });
}
