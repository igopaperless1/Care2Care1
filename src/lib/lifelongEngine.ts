import {
  LifelongServiceProfile,
  ServiceArchetype,
  CareLifecycleStage,
  LifelongSetupConfig
} from "../types";
import { triggerHapticFeedback } from "./supabaseHabits";

const LIFELONG_STORAGE_PREFIX = "care2care_lifelong_profile_";

export const SERVICE_ARCHETYPE_MAP: Record<string, { archetype: ServiceArchetype; name: string; icon: string; defaultUnit: string; defaultValue: number; defaultGoal: string }> = {
  walk: {
    archetype: "nourish",
    name: "Walk & Movement",
    icon: "🚶",
    defaultUnit: "steps",
    defaultValue: 8000,
    defaultGoal: "Build daily energetic movement and cardiovascular endurance"
  },
  steps: {
    archetype: "nourish",
    name: "Walk & Steps",
    icon: "👟",
    defaultUnit: "steps",
    defaultValue: 8000,
    defaultGoal: "Build daily energetic movement and cardiovascular endurance"
  },
  water: {
    archetype: "nourish",
    name: "Water & Hydration",
    icon: "💧",
    defaultUnit: "ml",
    defaultValue: 2500,
    defaultGoal: "Maintain optimal cellular hydration and daily energy"
  },
  sleep: {
    archetype: "nourish",
    name: "Sleep & Wind-down",
    icon: "🌙",
    defaultUnit: "hours",
    defaultValue: 8,
    defaultGoal: "Protect restorative sleep cycles and calming night routines"
  },
  nutrition: {
    archetype: "nourish",
    name: "Nutrition & Nourishment",
    icon: "🥗",
    defaultUnit: "meals",
    defaultValue: 3,
    defaultGoal: "Eat balanced whole foods and mindful meal timings"
  },
  exercise: {
    archetype: "nourish",
    name: "Exercise & Fitness",
    icon: "🏃",
    defaultUnit: "minutes",
    defaultValue: 30,
    defaultGoal: "Build muscular strength and daily physical vitality"
  },
  yoga: {
    archetype: "nourish",
    name: "Yoga & Breathwork",
    icon: "🧘",
    defaultUnit: "minutes",
    defaultValue: 20,
    defaultGoal: "Nurture spinal flexibility and mindful parasympathetic breathing"
  },
  mood: {
    archetype: "heal_protect",
    name: "Mood & Emotional Wellbeing",
    icon: "✨",
    defaultUnit: "check-in",
    defaultValue: 1,
    defaultGoal: "Cultivate emotional balance and daily self-compassion"
  },
  medicine: {
    archetype: "heal_protect",
    name: "Medicine & Health Care",
    icon: "💊",
    defaultUnit: "doses",
    defaultValue: 2,
    defaultGoal: "Follow personalized medical prescriptions on schedule"
  },
  vitals: {
    archetype: "heal_protect",
    name: "Vitals & Body Metrics",
    icon: "🩺",
    defaultUnit: "reading",
    defaultValue: 1,
    defaultGoal: "Track cardiovascular health and biological benchmarks"
  },
  elderly: {
    archetype: "heal_protect",
    name: "Elderly Care",
    icon: "👵",
    defaultUnit: "care logs",
    defaultValue: 3,
    defaultGoal: "Provide warm, structured support for senior family members"
  },
  kids: {
    archetype: "heal_protect",
    name: "Kids Routine & Care",
    icon: "🧸",
    defaultUnit: "routines",
    defaultValue: 4,
    defaultGoal: "Foster nurturing daily milestones and bedtime routines"
  },
  habits: {
    archetype: "heal_protect",
    name: "Habits & Recovery",
    icon: "🛡️",
    defaultUnit: "task",
    defaultValue: 1,
    defaultGoal: "Forge positive routines and overcome impulsive cravings"
  },
  finance: {
    archetype: "build_grow",
    name: "Finance & Budgeting",
    icon: "📊",
    defaultUnit: "log",
    defaultValue: 1,
    defaultGoal: "Accumulate long-term savings and manage daily cash flow"
  },
  jobs: {
    archetype: "build_grow",
    name: "Career & Growth",
    icon: "💼",
    defaultUnit: "action",
    defaultValue: 1,
    defaultGoal: "Advance professional skills and career milestones"
  },
  inventory: {
    archetype: "build_grow",
    name: "Inventory & Retail",
    icon: "📦",
    defaultUnit: "audit",
    defaultValue: 1,
    defaultGoal: "Maintain accurate stock levels and prevent business shortages"
  },
  staff_payroll: {
    archetype: "build_grow",
    name: "Staff & Team Payroll",
    icon: "👥",
    defaultUnit: "shift",
    defaultValue: 1,
    defaultGoal: "Ensure timely employee payments and transparent shifts"
  },
  garden_farm: {
    archetype: "build_grow",
    name: "Garden & Agriculture",
    icon: "🌱",
    defaultUnit: "check",
    defaultValue: 1,
    defaultGoal: "Nurture seasonal crop growth and sustainable harvest"
  },
  vehicle: {
    archetype: "order_protect",
    name: "Vehicle Care & Maintenance",
    icon: "🚗",
    defaultUnit: "inspection",
    defaultValue: 1,
    defaultGoal: "Prevent mechanical wear with proactive vehicle servicing"
  },
  property: {
    archetype: "order_protect",
    name: "Property & Home",
    icon: "🏡",
    defaultUnit: "task",
    defaultValue: 1,
    defaultGoal: "Protect home safety and structural maintenance"
  },
  pets: {
    archetype: "order_protect",
    name: "Pet Care & Companionship",
    icon: "🐾",
    defaultUnit: "walk/feed",
    defaultValue: 2,
    defaultGoal: "Provide loving nutrition and active walks for pets"
  },
  family: {
    archetype: "order_protect",
    name: "Family Tree & Bonds",
    icon: "🌳",
    defaultUnit: "connect",
    defaultValue: 1,
    defaultGoal: "Strengthen multi-generational family bonds"
  },
  passwords: {
    archetype: "order_protect",
    name: "Digital Security Vault",
    icon: "🔐",
    defaultUnit: "audit",
    defaultValue: 1,
    defaultGoal: "Protect critical digital credentials and private files"
  },
  paperless: {
    archetype: "order_protect",
    name: "Paperless Vault",
    icon: "📄",
    defaultUnit: "scan",
    defaultValue: 1,
    defaultGoal: "Digitize and organize all essential personal records"
  }
};

export const ARCHETYPE_META: Record<ServiceArchetype, { title: string; subtitle: string; color: string; badgeBg: string; badgeText: string; icon: string }> = {
  nourish: {
    title: "Nourish",
    subtitle: "Build & Maintain Vitality",
    color: "from-emerald-500 to-teal-600",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    icon: "🌱"
  },
  heal_protect: {
    title: "Heal & Protect",
    subtitle: "Monitor, Support & Recover",
    color: "from-rose-500 to-pink-600",
    badgeBg: "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800",
    badgeText: "text-rose-800 dark:text-rose-300",
    icon: "🛡️"
  },
  build_grow: {
    title: "Build & Grow",
    subtitle: "Accumulate, Learn & Advance",
    color: "from-blue-500 to-indigo-600",
    badgeBg: "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800",
    badgeText: "text-blue-800 dark:text-blue-300",
    icon: "📈"
  },
  order_protect: {
    title: "Order & Protect",
    subtitle: "Maintain & Prevent Neglect",
    color: "from-amber-500 to-orange-600",
    badgeBg: "bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800",
    badgeText: "text-amber-800 dark:text-amber-300",
    icon: "🏛️"
  }
};

export const STAGE_META: Record<CareLifecycleStage, { label: string; rangeLabel: string; badgeBg: string; badgeText: string; desc: string }> = {
  ignite: {
    label: "Ignite (Days 1–21)",
    rangeLabel: "Day 1 to 21",
    badgeBg: "bg-orange-50 dark:bg-orange-950/80 border-orange-200 dark:border-orange-800",
    badgeText: "text-orange-800 dark:text-orange-300",
    desc: "Active momentum, habit formation, progressive daily goals & milestone rewards."
  },
  stabilize: {
    label: "Stabilize (Days 22–60)",
    rangeLabel: "Day 22 to 60",
    badgeBg: "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800",
    badgeText: "text-blue-800 dark:text-blue-300",
    desc: "Consistency calendar, adaptive smart reminders & increasing personal autonomy."
  },
  integrate: {
    label: "Lifelong Maintenance (Day 61+)",
    rangeLabel: "Day 61+",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    desc: "Seamless daily lifestyle, passive health metrics, gentle periodic check-ins."
  },
  recovery: {
    label: "Gentle Recovery Reset",
    rangeLabel: "3-7 Days",
    badgeBg: "bg-teal-50 dark:bg-teal-950/80 border-teal-200 dark:border-teal-800",
    badgeText: "text-teal-800 dark:text-teal-300",
    desc: "Compassionate, zero-shame restart to rebuild your rhythm after life changes."
  },
  review: {
    label: "Periodic Life Review",
    rangeLabel: "Milestone",
    badgeBg: "bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800",
    badgeText: "text-purple-800 dark:text-purple-300",
    desc: "Reflect on long-term compound growth and celebrate your dedication."
  }
};

/**
 * Retrieves or initializes the Lifelong Profile for any Care2Care service
 */
export function getLifelongProfile(serviceId: string): LifelongServiceProfile {
  const normId = serviceId.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const storageKey = `${LIFELONG_STORAGE_PREFIX}${normId}`;

  const meta = SERVICE_ARCHETYPE_MAP[normId] || {
    archetype: "nourish",
    name: serviceId.charAt(0).toUpperCase() + serviceId.slice(1),
    icon: "🌟",
    defaultUnit: "action",
    defaultValue: 1,
    defaultGoal: `Daily dedicated progress in ${serviceId}`
  };

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed: LifelongServiceProfile = JSON.parse(raw);
      return parsed;
    }
  } catch (e) {
    console.warn("Could not parse lifelong profile from localStorage:", e);
  }

  // Default baseline profile
  const initialProfile: LifelongServiceProfile = {
    serviceId: normId,
    serviceName: meta.name,
    archetype: meta.archetype,
    stage: "ignite",
    dayInCurrentStage: 1,
    totalActiveDays: 1,
    currentStreak: 1,
    bestStreak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    consistencyScorePercent: 88,
    primaryGoalText: meta.defaultGoal,
    dailyTargetLabel: "Daily Target",
    dailyTargetUnit: meta.defaultUnit,
    dailyTargetValue: meta.defaultValue,
    careTone: "supportive",
    milestoneHistory: [
      {
        milestoneDay: 1,
        completedAt: new Date().toISOString(),
        stage: "ignite",
        celebrationNote: "Day 1 of your journey initiated with care"
      }
    ]
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(initialProfile));
  } catch {}

  return initialProfile;
}

/**
 * Saves updated Lifelong Profile
 */
export function saveLifelongProfile(profile: LifelongServiceProfile): void {
  const storageKey = `${LIFELONG_STORAGE_PREFIX}${profile.serviceId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save lifelong profile:", e);
  }
}

/**
 * Completes today's service goal and advances lifelong progress
 */
export async function recordServiceGoalCompletion(
  serviceId: string,
  amountAchieved?: number
): Promise<{ profile: LifelongServiceProfile; isMilestone: boolean; milestoneDay?: number }> {
  await triggerHapticFeedback("success");
  const profile = getLifelongProfile(serviceId);
  const todayStr = new Date().toISOString().split("T")[0];

  const wasAlreadyCompletedToday = profile.lastActiveDate === todayStr;
  const nextStreak = wasAlreadyCompletedToday ? profile.currentStreak : profile.currentStreak + 1;
  const nextTotalActive = wasAlreadyCompletedToday ? profile.totalActiveDays : profile.totalActiveDays + 1;
  const nextDayInStage = wasAlreadyCompletedToday ? profile.dayInCurrentStage : profile.dayInCurrentStage + 1;

  let nextStage: CareLifecycleStage = profile.stage;
  let isMilestone = false;
  let milestoneDay: number | undefined;

  // Check stage transitions
  if (profile.stage === "ignite" && nextDayInStage > 21) {
    nextStage = "stabilize";
    isMilestone = true;
    milestoneDay = 21;
  } else if (profile.stage === "stabilize" && nextDayInStage > 60) {
    nextStage = "integrate";
    isMilestone = true;
    milestoneDay = 60;
  } else if ([7, 14, 21, 60, 90, 180, 365].includes(nextDayInStage)) {
    isMilestone = true;
    milestoneDay = nextDayInStage;
  }

  const updatedMilestones = [...profile.milestoneHistory];
  if (isMilestone && milestoneDay) {
    updatedMilestones.push({
      milestoneDay,
      completedAt: new Date().toISOString(),
      stage: nextStage,
      celebrationNote: `Achieved Day ${milestoneDay} in ${profile.serviceName}`
    });
  }

  const updated: LifelongServiceProfile = {
    ...profile,
    stage: nextStage,
    dayInCurrentStage: nextDayInStage,
    totalActiveDays: nextTotalActive,
    currentStreak: nextStreak,
    bestStreak: Math.max(profile.bestStreak, nextStreak),
    lastActiveDate: todayStr,
    consistencyScorePercent: Math.min(100, profile.consistencyScorePercent + 1),
    milestoneHistory: updatedMilestones
  };

  saveLifelongProfile(updated);
  return { profile: updated, isMilestone, milestoneDay };
}

/**
 * Initiates a gentle, compassionate recovery reset
 */
export function startGentleRecoveryReset(
  serviceId: string,
  targetDays: number = 7
): LifelongServiceProfile {
  const profile = getLifelongProfile(serviceId);
  const updated: LifelongServiceProfile = {
    ...profile,
    stage: "recovery",
    dayInCurrentStage: 1,
    careTone: "gentle",
    milestoneHistory: [
      ...profile.milestoneHistory,
      {
        milestoneDay: 1,
        completedAt: new Date().toISOString(),
        stage: "recovery",
        celebrationNote: `Restarted a gentle ${targetDays}-day consistency reset with care`
      }
    ]
  };
  saveLifelongProfile(updated);
  return updated;
}
