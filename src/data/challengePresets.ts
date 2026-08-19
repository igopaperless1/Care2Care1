import { HabitChallenge, ChallengeCategory } from "../types";

export interface PresetChallengeTemplate {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  icon: string;
  color: string;
  defaultTasks: {
    day: number;
    title: string;
    description: string;
    penalty: {
      title: string;
      description: string;
      type: "pushups" | "squats" | "meditation" | "hydration" | "walk" | "freeze_token" | "cold_shower" | "reading" | "custom";
      repsOrMins: number;
    };
  }[];
}

interface RawChallengeMeta {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  icon: string;
  color: string;
  actionFocus: string;
  penaltyType: "pushups" | "squats" | "meditation" | "hydration" | "walk" | "freeze_token" | "cold_shower" | "reading" | "custom";
  penaltyRepsOrMins: number;
  penaltyName: string;
}

// 71 Curated Challenges across 8 Categories
const RAW_CHALLENGES: RawChallengeMeta[] = [
  // ===================== 1. PERSONAL GROWTH (9) =====================
  {
    id: "preset-escape-loneliness",
    title: "Escape Loneliness",
    description: "21 days of connection prompts, warm outreach, and genuine social re-engagement.",
    category: "Personal Growth",
    icon: "🤝",
    color: "#f97316",
    actionFocus: "social outreach and building supportive human connections",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min mindful connection walk"
  },
  {
    id: "preset-gratitude-challenge",
    title: "Gratitude Challenge",
    description: "Rewire your brain for appreciation with daily intentional gratitude rituals.",
    category: "Personal Growth",
    icon: "🙏",
    color: "#eab308",
    actionFocus: "acknowledging 3 distinct blessings and writing thank-you notes",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min gratitude reflection"
  },
  {
    id: "preset-creativity-sparks",
    title: "Creativity Sparks",
    description: "Daily micro-experiments to unlock imagination, lateral thinking, and artistic flow.",
    category: "Personal Growth",
    icon: "🎨",
    color: "#a855f7",
    actionFocus: "drawing, creative writing, freestyle brain-mapping, and novel problem solving",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 mins reading poetry or art history"
  },
  {
    id: "preset-solo-dates",
    title: "Solo Dates & Self-Connection",
    description: "Learn to cherish your own company with mindful solo adventures and self-dates.",
    category: "Personal Growth",
    icon: "☕",
    color: "#ec4899",
    actionFocus: "enjoying self-led outings, cafes, museums, and screen-free solo reflection",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min quiet self-grounding"
  },
  {
    id: "preset-public-speaking",
    title: "Public Speaking & Voice Confidence",
    description: "Overcome stage fright and speak with authority, clarity, and authentic conviction.",
    category: "Personal Growth",
    icon: "🎙️",
    color: "#3b82f6",
    actionFocus: "vocal warmups, recorded 2-minute impromptu talks, and posture alignment",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 power pushups"
  },
  {
    id: "preset-overcoming-procrastination",
    title: "Overcoming Procrastination",
    description: "Break the friction loop and master the art of starting immediately without hesitation.",
    category: "Personal Growth",
    icon: "⏳",
    color: "#ef4444",
    actionFocus: "applying the 2-minute trigger rule and tackling high-resistance tasks first",
    penaltyType: "squats",
    penaltyRepsOrMins: 30,
    penaltyName: "30 disciplinary squats"
  },
  {
    id: "preset-comfort-zone",
    title: "Stepping Out of Comfort Zone",
    description: "Expand your courage horizon with 1 daily bold micro-action outside familiarity.",
    category: "Personal Growth",
    icon: "🧗",
    color: "#10b981",
    actionFocus: "facing harmless social fears, trying new routines, and embracing discomfort",
    penaltyType: "cold_shower",
    penaltyRepsOrMins: 2,
    penaltyName: "2 min cold shower awakening"
  },
  {
    id: "preset-daily-journaling",
    title: "Daily Journaling & Reflection",
    description: "Gain clarity, emotional regulation, and deep self-insight through written thought.",
    category: "Personal Growth",
    icon: "📖",
    color: "#6366f1",
    actionFocus: "writing 1 full page of stream-of-consciousness thoughts and evening debrief",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min philosophy reading"
  },
  {
    id: "preset-habit-replacement",
    title: "Habit Replacement Mastery",
    description: "Systematically substitute unwanted urges with constructive physical and mental habits.",
    category: "Personal Growth",
    icon: "🔄",
    color: "#06b6d4",
    actionFocus: "identifying cue-routine loops and deploying instant replacement protocols",
    penaltyType: "hydration",
    penaltyRepsOrMins: 1000,
    penaltyName: "Drink 1 Liter Electrolyte Water"
  },

  // ===================== 2. HEALTH (9) =====================
  {
    id: "preset-hydration-master",
    title: "Hydration Master (2.5L Daily)",
    description: "Flush toxins, optimize cognitive stamina, and maintain peak cellular hydration.",
    category: "Health",
    icon: "💧",
    color: "#0284c7",
    actionFocus: "drinking scheduled intervals of water to hit 2500ml daily target",
    penaltyType: "squats",
    penaltyRepsOrMins: 25,
    penaltyName: "25 hydration squats"
  },
  {
    id: "preset-10000-steps",
    title: "10,000 Daily Steps",
    description: "Build daily metabolic health, cardiovascular resilience, and joint mobility.",
    category: "Health",
    icon: "🏃",
    color: "#16a34a",
    actionFocus: "accumulating 10,000 active steps through walks, stairs, and brisk pacing",
    penaltyType: "pushups",
    penaltyRepsOrMins: 25,
    penaltyName: "25 bodyweight pushups"
  },
  {
    id: "preset-sugar-detox",
    title: "Sugar Detox & Clean Diet",
    description: "Eliminate refined sugars, stabilize insulin sensitivity, and end sugar crashes.",
    category: "Health",
    icon: "🥗",
    color: "#84cc16",
    actionFocus: "consuming zero refined sugar, sodas, or processed candies for 21 full days",
    penaltyType: "walk",
    penaltyRepsOrMins: 20,
    penaltyName: "20 min brisk metabolism walk"
  },
  {
    id: "preset-clean-eating",
    title: "Clean Eating & Whole Foods",
    description: "Nourish your gut microbiome with colorful whole foods, legumes, and lean proteins.",
    category: "Health",
    icon: "🥑",
    color: "#22c55e",
    actionFocus: "cooking freshly prepared whole-food meals free from ultra-processed additives",
    penaltyType: "hydration",
    penaltyRepsOrMins: 800,
    penaltyName: "Drink 800ml lemon mineral water"
  },
  {
    id: "preset-core-strength",
    title: "Core Strength & Daily Posture",
    description: "Strengthen your core foundation and protect spinal alignment with 10-min workouts.",
    category: "Health",
    icon: "🧘",
    color: "#0d9488",
    actionFocus: "performing planks, hollow holds, bird-dogs, and conscious posture checks",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 strict form pushups"
  },
  {
    id: "preset-restorative-sleep",
    title: "7-8 Hours Restorative Sleep",
    description: "Rebuild circadian rhythm with pitch-dark room, cool temp, and steady wake times.",
    category: "Health",
    icon: "🛌",
    color: "#6366f1",
    actionFocus: "sleeping 7.5+ continuous hours and shutting screens 45 mins before bedtime",
    penaltyType: "meditation",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min relaxing sleep breathwork"
  },
  {
    id: "preset-cold-shower",
    title: "Cold Shower Awakening",
    description: "Ignite norepinephrine, brown fat thermogenesis, and mental toughness every morning.",
    category: "Health",
    icon: "🚿",
    color: "#0ea5e9",
    actionFocus: "taking 90 to 180 seconds of cold water exposure at the end of morning shower",
    penaltyType: "squats",
    penaltyRepsOrMins: 30,
    penaltyName: "30 explosive air squats"
  },
  {
    id: "preset-daily-yoga",
    title: "Daily Yoga & Full Body Flexibility",
    description: "Relieve chronic tension, increase hip and shoulder mobility, and calm nervous system.",
    category: "Health",
    icon: "🤸",
    color: "#d946ef",
    actionFocus: "15 minutes of dynamic morning vinyasa flow and deep evening hamstring stretches",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min posture meditation"
  },
  {
    id: "preset-zero-alcohol",
    title: "Zero Alcohol & Liver Reset",
    description: "Experience 21 days of total sobriety, enhanced REM sleep, and restored gut health.",
    category: "Health",
    icon: "🌿",
    color: "#059669",
    actionFocus: "zero alcohol intake replaced with sparkling water, teas, or herbal mocktails",
    penaltyType: "pushups",
    penaltyRepsOrMins: 30,
    penaltyName: "30 sober power pushups"
  },

  // ===================== 3. MENTAL HEALTH (9) =====================
  {
    id: "preset-anxiety-calming",
    title: "Anxiety Calming & Grounding",
    description: "Master 5-4-3-2-1 sensory grounding and vagus nerve stimulation to dispel anxiety.",
    category: "Mental Health",
    icon: "🧠",
    color: "#8b5cf6",
    actionFocus: "daily somatic grounding exercises and somatic release journaling",
    penaltyType: "meditation",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min somatic stillness"
  },
  {
    id: "preset-stress-release",
    title: "Stress Release & 4-7-8 Breathwork",
    description: "Downregulate sympathetic nervous system with physiological sighs and box breathing.",
    category: "Mental Health",
    icon: "💨",
    color: "#06b6d4",
    actionFocus: "completing 3 rounds of 4-7-8 deep breathing during midday transitions",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min quiet decompression walk"
  },
  {
    id: "preset-digital-detox",
    title: "Digital Detox & Dopamine Fast",
    description: "Reclaim attention span by capping social media and spending offline evenings.",
    category: "Mental Health",
    icon: "📵",
    color: "#f43f5e",
    actionFocus: "staying screen-free for the first 60 mins of morning and last 60 mins before bed",
    penaltyType: "reading",
    penaltyRepsOrMins: 20,
    penaltyName: "20 min physical book reading"
  },
  {
    id: "preset-mindful-meditation",
    title: "Mindful Meditation (15 Mins)",
    description: "Cultivate non-judgmental present-moment awareness through silent breath focus.",
    category: "Mental Health",
    icon: "🧘‍♂️",
    color: "#10b981",
    actionFocus: "sitting quietly for 15 minutes observing thoughts without getting hooked",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min silent nature walk"
  },
  {
    id: "preset-overcoming-overthinking",
    title: "Overcoming Overthinking & Rumination",
    description: "Identify catastrophic cognitive loops and practice thought diffusion techniques.",
    category: "Mental Health",
    icon: "💡",
    color: "#f59e0b",
    actionFocus: "performing a 10-minute worry dump and challenging irrational assumptions",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min thought letting-go meditation"
  },
  {
    id: "preset-emotional-expression",
    title: "Emotional Expression Journal",
    description: "Name, honor, and integrate difficult feelings rather than suppressing them.",
    category: "Mental Health",
    icon: "📝",
    color: "#84cc16",
    actionFocus: "writing down your honest emotional weather report and validating your experience",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min emotional reflection walk"
  },
  {
    id: "preset-boundary-setting",
    title: "Boundary Setting & Saying No",
    description: "Protect your peace, time, and emotional bandwidth with polite and firm boundaries.",
    category: "Mental Health",
    icon: "🛡️",
    color: "#ef4444",
    actionFocus: "saying 'No' to one draining commitment or request without over-explaining",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 boundary pushups"
  },
  {
    id: "preset-inner-child-healing",
    title: "Inner Child Healing & Play",
    description: "Rekindle lighthearted wonder, curiosity, and soothing words for your younger self.",
    category: "Mental Health",
    icon: "🧸",
    color: "#ec4899",
    actionFocus: "spending 15 minutes doing something playful, uninhibited, and joyous",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min loving-kindness for younger self"
  },
  {
    id: "preset-grief-acceptance",
    title: "Grief & Acceptance Processing",
    description: "Safe, compassionate space to grieve losses, life transitions, and unmet hopes.",
    category: "Mental Health",
    icon: "🕊️",
    color: "#64748b",
    actionFocus: "holding gentle space for sorrow, lighting a candle, and writing letters of release",
    penaltyType: "walk",
    penaltyRepsOrMins: 20,
    penaltyName: "20 min contemplative nature walk"
  },

  // ===================== 4. LEARNING (9) =====================
  {
    id: "preset-read-20-pages",
    title: "Read 20 Pages Daily",
    description: "Consume 1-2 dense, high-impact non-fiction books per month with steady daily reading.",
    category: "Learning",
    icon: "📚",
    color: "#f97316",
    actionFocus: "reading 20 continuous pages of non-fiction or literature and taking 1 note",
    penaltyType: "squats",
    penaltyRepsOrMins: 30,
    penaltyName: "30 learning squats"
  },
  {
    id: "preset-speed-reading",
    title: "Speed Reading & Retention Mastery",
    description: "Double your reading velocity using pacing guides, chunking, and active recall.",
    category: "Learning",
    icon: "⚡",
    color: "#eab308",
    actionFocus: "practicing 15 mins of pointer-assisted speed reading and immediate Feynman test",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min extra comprehension drill"
  },
  {
    id: "preset-language-vocab",
    title: "Language Learning Vocab (15 Words/Day)",
    description: "Acquire 300+ core foreign language vocabulary words using spaced repetition.",
    category: "Learning",
    icon: "🗣️",
    color: "#3b82f6",
    actionFocus: "reviewing 15 new flashcards and creating 5 spoken example sentences",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 linguistic pushups"
  },
  {
    id: "preset-coding-sprint",
    title: "Coding & Logic Daily Sprint",
    description: "Sharpen algorithmic thinking and software engineering intuition through daily builds.",
    category: "Learning",
    icon: "💻",
    color: "#6366f1",
    actionFocus: "solving 1 algorithmic challenge or committing code to your personal repo",
    penaltyType: "squats",
    penaltyRepsOrMins: 25,
    penaltyName: "25 focus squats"
  },
  {
    id: "preset-financial-literacy",
    title: "Financial Literacy & Investing Basics",
    description: "Understand compound interest, asset allocation, budgeting, and tax strategies.",
    category: "Learning",
    icon: "💰",
    color: "#10b981",
    actionFocus: "reading 1 financial concept breakdown and logging your personal daily expenses",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min economics reading"
  },
  {
    id: "preset-mental-math",
    title: "Mental Math & Brain Training",
    description: "Boost working memory and calculation speed with daily mental arithmetic drills.",
    category: "Learning",
    icon: "🧩",
    color: "#8b5cf6",
    actionFocus: "doing 10 minutes of rapid mental multiplication, percentages, and logic puzzles",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 cognitive pushups"
  },
  {
    id: "preset-daily-philosophy",
    title: "Daily Philosophy Reflection",
    description: "Absorb timeless wisdom from Stoicism, Eastern philosophy, and existential thought.",
    category: "Learning",
    icon: "🏛️",
    color: "#78716c",
    actionFocus: "reading 1 passage from Seneca, Marcus Aurelius, or Lao Tzu and applying it",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min stoic virtue meditation"
  },
  {
    id: "preset-tech-ai-skills",
    title: "Tech & AI Skill Upgrading",
    description: "Master modern AI tools, prompt engineering, workflows, and automation scripts.",
    category: "Learning",
    icon: "🤖",
    color: "#06b6d4",
    actionFocus: "testing 1 new AI workflow or automation tool to save 30 minutes of manual labor",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min offline ideation walk"
  },
  {
    id: "preset-history-culture",
    title: "History & Culture Deep Dive",
    description: "Understand the monumental turning points of civilization and global traditions.",
    category: "Learning",
    icon: "🏺",
    color: "#d97706",
    actionFocus: "exploring a historical documentary, archive, or cultural monograph for 20 mins",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min historical archive reading"
  },

  // ===================== 5. LIFESTYLE (9) =====================
  {
    id: "preset-decluttering-minimalism",
    title: "Decluttering & Minimalist Living",
    description: "Free physical and mental space by donating, recycling, or discarding 5 items daily.",
    category: "Lifestyle",
    icon: "✨",
    color: "#14b8a6",
    actionFocus: "clearing 1 drawer, desk, or wardrobe zone and removing unnecessary clutter",
    penaltyType: "squats",
    penaltyRepsOrMins: 25,
    penaltyName: "25 tidy squats"
  },
  {
    id: "preset-pamper-skin",
    title: "Pamper Yourself & Skin Radiance",
    description: "Nourish your skin barrier with daily SPF, hydration routines, and relaxing gua sha.",
    category: "Lifestyle",
    icon: "🧖",
    color: "#f472b6",
    actionFocus: "completing your full morning/evening skincare ritual and face massage",
    penaltyType: "hydration",
    penaltyRepsOrMins: 1000,
    penaltyName: "Drink 1L pure filtered water"
  },
  {
    id: "preset-meaningful-conversations",
    title: "Meaningful Conversations & Deep Listening",
    description: "Elevate your relationships by asking deep questions and practicing active listening.",
    category: "Lifestyle",
    icon: "💬",
    color: "#3b82f6",
    actionFocus: "engaging in a 15-minute conversation without interrupting or checking your phone",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min active listening silence"
  },
  {
    id: "preset-morning-routine",
    title: "Morning Routine Architecture",
    description: "Win the morning with sunlight exposure, hydration, movement, and zero phone scrolling.",
    category: "Lifestyle",
    icon: "🌅",
    color: "#f59e0b",
    actionFocus: "executing your non-negotiable 30-minute morning sequence right after waking",
    penaltyType: "pushups",
    penaltyRepsOrMins: 25,
    penaltyName: "25 early bird pushups"
  },
  {
    id: "preset-evening-wind-down",
    title: "Evening Wind-Down Ritual",
    description: "Prepare your brain for deep restorative sleep with dim warm lights and warm tea.",
    category: "Lifestyle",
    icon: "🌙",
    color: "#6366f1",
    actionFocus: "initiating your 45-minute bedtime sequence with stretching and soft lighting",
    penaltyType: "meditation",
    penaltyRepsOrMins: 12,
    penaltyName: "12 min night tranquility breath"
  },
  {
    id: "preset-cooking-homemade",
    title: "Cooking Homemade Meals",
    description: "Develop culinary self-sufficiency by preparing nutritious dishes from scratch.",
    category: "Lifestyle",
    icon: "🍳",
    color: "#ea580c",
    actionFocus: "cooking at least 1 wholesome homemade breakfast or dinner using fresh ingredients",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min digestion stroll"
  },
  {
    id: "preset-eco-friendly",
    title: "Eco-Friendly & Zero-Waste Living",
    description: "Reduce your environmental footprint with reusable containers, composting, and zero plastic.",
    category: "Lifestyle",
    icon: "🌱",
    color: "#22c55e",
    actionFocus: "avoiding single-use plastics, conserving energy, and minimizing food waste",
    penaltyType: "walk",
    penaltyRepsOrMins: 20,
    penaltyName: "20 min eco park walk"
  },
  {
    id: "preset-nature-walks",
    title: "Outdoor Nature Walks",
    description: "Immerse yourself in forest bathing, fresh air, and birdsong for mental rejuvenation.",
    category: "Lifestyle",
    icon: "🌲",
    color: "#15803d",
    actionFocus: "spending 20 continuous minutes walking in a park, garden, or natural trail",
    penaltyType: "squats",
    penaltyRepsOrMins: 30,
    penaltyName: "30 outdoor bodyweight squats"
  },
  {
    id: "preset-capsule-wardrobe",
    title: "Capsule Wardrobe & Style Simplicity",
    description: "Eliminate decision fatigue by organizing timeless, cohesive outfit combinations.",
    category: "Lifestyle",
    icon: "👗",
    color: "#ec4899",
    actionFocus: "wearing minimalist coordinated outfits and keeping clothing neatly hung",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min design or architecture reading"
  },

  // ===================== 6. PRODUCTIVITY (9) =====================
  {
    id: "preset-deep-work",
    title: "Deep Work Sprint (90 Mins)",
    description: "Achieve extraordinary output in single 90-minute distraction-free flow state blocks.",
    category: "Productivity",
    icon: "⚡",
    color: "#f97316",
    actionFocus: "working for 90 uninterrupted minutes with notifications off on high-value goal",
    penaltyType: "pushups",
    penaltyRepsOrMins: 25,
    penaltyName: "25 deep work pushups"
  },
  {
    id: "preset-zero-inbox",
    title: "Zero Inbox & Email Mastery",
    description: "Tame your inbox with 2-touch triage: reply immediately, delegate, or archive.",
    category: "Productivity",
    icon: "📥",
    color: "#3b82f6",
    actionFocus: "clearing unread emails and sorting action items to achieve 0 inbox by 5 PM",
    penaltyType: "squats",
    penaltyRepsOrMins: 20,
    penaltyName: "20 inbox cleansing squats"
  },
  {
    id: "preset-eat-the-frog",
    title: "Eat The Frog (Hardest Task First)",
    description: "Knock out your most intimidating project task before checking messages in the AM.",
    category: "Productivity",
    icon: "🐸",
    color: "#16a34a",
    actionFocus: "finishing your #1 hardest high-leverage task within the first 2 hours of work",
    penaltyType: "cold_shower",
    penaltyRepsOrMins: 2,
    penaltyName: "2 min cold shower reset"
  },
  {
    id: "preset-time-blocking",
    title: "Time Blocking & Calendar Discipline",
    description: "Stop working reactively; map every work hour to an intentional, bounded time block.",
    category: "Productivity",
    icon: "📅",
    color: "#6366f1",
    actionFocus: "scheduling tomorrow's calendar in 30-min intervals and executing accurately",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min calendar pacing walk"
  },
  {
    id: "preset-eliminate-multitasking",
    title: "Eliminate Multitasking",
    description: "Mono-task with laser intensity; close browser tabs and focus on 1 single tab at a time.",
    category: "Productivity",
    icon: "🎯",
    color: "#ef4444",
    actionFocus: "completing all daily assignments sequentially with zero tab-switching",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 mono-task pushups"
  },
  {
    id: "preset-5-min-rule",
    title: "5-Minute Rule Against Procrastination",
    description: "If a task takes less than 5 minutes, execute it immediately without logging it.",
    category: "Productivity",
    icon: "⏱️",
    color: "#eab308",
    actionFocus: "instantly executing every micro-task (replies, dishes, files) within 300 seconds",
    penaltyType: "squats",
    penaltyRepsOrMins: 25,
    penaltyName: "25 rapid squats"
  },
  {
    id: "preset-daily-standup",
    title: "Daily Standup & Evening Review",
    description: "Align your daily compass every morning and score your execution each night.",
    category: "Productivity",
    icon: "📋",
    color: "#0d9488",
    actionFocus: "writing your Top 3 daily priorities at 8 AM and grading results at 8 PM",
    penaltyType: "reading",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min productivity strategy reading"
  },
  {
    id: "preset-distraction-shield",
    title: "Laser Focus & Distraction Shield",
    description: "Block time-wasting apps, website rabbit holes, and gossip traps during work hours.",
    category: "Productivity",
    icon: "🛡️",
    color: "#8b5cf6",
    actionFocus: "utilizing full app blockers and zero notifications across all work blocks",
    penaltyType: "pushups",
    penaltyRepsOrMins: 25,
    penaltyName: "25 focus shield pushups"
  },
  {
    id: "preset-energy-management",
    title: "Energy Management vs Time",
    description: "Align complex creative tasks to your peak circadian biological chronotype windows.",
    category: "Productivity",
    icon: "🔋",
    color: "#10b981",
    actionFocus: "taking deliberate rest breaks every 50 mins and honoring physical energy dips",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min energy restoration breath"
  },

  // ===================== 7. SELF LOVE (9) =====================
  {
    id: "preset-radical-self-acceptance",
    title: "Radical Self-Acceptance",
    description: "Embrace your whole humanity, quirks, and imperfections with unconditional grace.",
    category: "Self Love",
    icon: "💖",
    color: "#ec4899",
    actionFocus: "writing down 3 self-compassion statements and releasing harsh inner critique",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min self-acceptance meditation"
  },
  {
    id: "preset-mirror-affirmations",
    title: "Positive Mirror Affirmations",
    description: "Look into your own eyes each morning and declare empowering truth and love.",
    category: "Self Love",
    icon: "🪞",
    color: "#f43f5e",
    actionFocus: "standing in front of mirror for 3 minutes speaking loving, grounded affirmations",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min affirmation walk"
  },
  {
    id: "preset-forgiving-past-mistakes",
    title: "Forgiving Your Past Mistakes",
    description: "Release shame and regret; realize that you did the best with the wisdom you had.",
    category: "Self Love",
    icon: "🕊️",
    color: "#8b5cf6",
    actionFocus: "writing a compassionate letter of forgiveness to your past younger self",
    penaltyType: "meditation",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min forgiveness breathwork"
  },
  {
    id: "preset-body-positivity",
    title: "Body Positivity & Appreciation",
    description: "Honor everything your miraculous body does for you daily instead of critiquing it.",
    category: "Self Love",
    icon: "🧘‍♀️",
    color: "#d946ef",
    actionFocus: "thanking your lungs, heart, legs, and hands through conscious body scan",
    penaltyType: "hydration",
    penaltyRepsOrMins: 800,
    penaltyName: "Drink 800ml nourishing mineral water"
  },
  {
    id: "preset-guilt-free-rest",
    title: "Guilt-Free Rest & Relaxation",
    description: "Rest is not a reward you earn; it is a vital prerequisite for human flourishing.",
    category: "Self Love",
    icon: "🛋️",
    color: "#14b8a6",
    actionFocus: "taking 30 minutes of completely guilt-free downtime with zero productivity pressure",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min gentle relaxation stroll"
  },
  {
    id: "preset-celebrating-micro-victories",
    title: "Celebrating Micro-Victories",
    description: "Train your brain to register small daily wins and build momentum without waiting.",
    category: "Self Love",
    icon: "🎉",
    color: "#f59e0b",
    actionFocus: "logging and celebrating 3 micro-wins accomplished throughout your day",
    penaltyType: "squats",
    penaltyRepsOrMins: 20,
    penaltyName: "20 celebratory squats"
  },
  {
    id: "preset-self-compassion-failure",
    title: "Self-Compassion in Failure",
    description: "Treat yourself like your dearest friend when plans go wrong or setbacks strike.",
    category: "Self Love",
    icon: "🌱",
    color: "#22c55e",
    actionFocus: "speaking to yourself in comforting, encouraging words after any small stumble",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min self-kindness meditation"
  },
  {
    id: "preset-unapologetic-expression",
    title: "Unapologetic Self-Expression",
    description: "Stop shrinking to fit others' expectations; share your authentic voice boldly.",
    category: "Self Love",
    icon: "🌟",
    color: "#eab308",
    actionFocus: "expressing an honest preference, creative project, or belief with confidence",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 confidence pushups"
  },
  {
    id: "preset-nourishing-rituals",
    title: "Nourishing Self-Care Rituals",
    description: "Create sacred personal time with baths, aromatherapy, music, and physical care.",
    category: "Self Love",
    icon: "🛁",
    color: "#06b6d4",
    actionFocus: "indulging in 20 minutes of restorative bath, warm tea, or soothing acoustic music",
    penaltyType: "hydration",
    penaltyRepsOrMins: 600,
    penaltyName: "Drink 600ml warm chamomile tea"
  },

  // ===================== 8. POSITIVITY (8) =====================
  {
    id: "preset-random-acts-kindness",
    title: "Random Acts of Kindness",
    description: "Brighten the world around you with 1 daily deliberate, selfless act of generosity.",
    category: "Positivity",
    icon: "🎁",
    color: "#f97316",
    actionFocus: "leaving a generous tip, giving someone flowers, or helping a stranger in need",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 kindness pushups"
  },
  {
    id: "preset-complaint-free-21",
    title: "Complaint-Free 21 Days",
    description: "Eliminate gossip, venting, and complaining; redirect energy toward solutions.",
    category: "Positivity",
    icon: "🤐",
    color: "#ef4444",
    actionFocus: "catching complaints before speaking and instantly re-framing with a constructive solution",
    penaltyType: "squats",
    penaltyRepsOrMins: 30,
    penaltyName: "30 complaint-detox squats"
  },
  {
    id: "preset-finding-silver-linings",
    title: "Finding Silver Linings",
    description: "Discover the hidden lesson, strength, and opportunity in every unexpected obstacle.",
    category: "Positivity",
    icon: "☀️",
    color: "#eab308",
    actionFocus: "identifying the silver lining and growth lesson in today's most frustrating event",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min optimism reframing meditation"
  },
  {
    id: "preset-uplifting-compliments",
    title: "Uplifting Community Compliments",
    description: "Notice and praise the efforts, character, and talents of colleagues and family members.",
    category: "Positivity",
    icon: "💌",
    color: "#ec4899",
    actionFocus: "giving 2 specific, heartfelt, unsolicited compliments to people around you",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min uplifting walk"
  },
  {
    id: "preset-daily-smile-energy",
    title: "Daily Smile & Good Energy",
    description: "Bring radiant, uplifting energy into every room you enter through smiling and warmth.",
    category: "Positivity",
    icon: "😊",
    color: "#f59e0b",
    actionFocus: "sharing warm smiles and positive body language with 5 people today",
    penaltyType: "squats",
    penaltyRepsOrMins: 20,
    penaltyName: "20 smile energy squats"
  },
  {
    id: "preset-laughter-joy",
    title: "Laughter & Joy Cultivation",
    description: "Intentionally cultivate lighthearted humor, funny stories, and belly laughs.",
    category: "Positivity",
    icon: "😄",
    color: "#10b981",
    actionFocus: "watching a comedy clip, sharing a funny anecdote, and laughing out loud for 10 mins",
    penaltyType: "walk",
    penaltyRepsOrMins: 15,
    penaltyName: "15 min cheerful walking session"
  },
  {
    id: "preset-abundance-mindset",
    title: "Abundance Mindset Wiring",
    description: "Shift from scarcity and comparison to feeling that there is more than enough for all.",
    category: "Positivity",
    icon: "🌈",
    color: "#8b5cf6",
    actionFocus: "celebrating someone else's major success and recognizing abundance in your life",
    penaltyType: "meditation",
    penaltyRepsOrMins: 10,
    penaltyName: "10 min abundance visualization"
  },
  {
    id: "preset-spreading-hope",
    title: "Spreading Hope & Optimism",
    description: "Be the voice of encouragement and possibility when others feel disheartened.",
    category: "Positivity",
    icon: "🕊️",
    color: "#3b82f6",
    actionFocus: "sharing an encouraging message, article, or perspective with someone in need",
    penaltyType: "pushups",
    penaltyRepsOrMins: 20,
    penaltyName: "20 hope pushups"
  }
];

// Helper to generate full 21 progressive days for each challenge
function build21DaysForChallenge(meta: RawChallengeMeta) {
  const milestoneThemes = [
    "Foundation & Intention Setting",
    "First Habit Repetition",
    "Overcoming Initial Friction",
    "Building Neural Pathways",
    "Mid-Week Resilience Check",
    "Deepening Consistency",
    "Week 1 Milestone Celebration",
    "Leveling Up Intensity",
    "Refining Daily Technique",
    "Handling Unexpected Distractions",
    "Halfway Mastery Horizon",
    "Strengthening Willpower Reserve",
    "Anchoring the Routine",
    "Week 2 Mastery Milestone",
    "Pivoting into Peak Performance",
    "Overcoming Late Resistance",
    "Second-Nature Flow State",
    "Elevating Mind-Body Integration",
    "Final Sprint Preparation",
    "Consolidating Life-Long Habit",
    "Day 21 Ultimate Mastery & Celebration"
  ];

  return Array.from({ length: 21 }, (_, i) => {
    const day = i + 1;
    const theme = milestoneThemes[i] || `Day ${day} Dedication`;
    return {
      day,
      title: `Day ${day}: ${theme}`,
      description: `Commit 100% to ${meta.actionFocus}. Focus on building automaticity and neural grit.`,
      penalty: {
        title: meta.penaltyName,
        description: `Execute ${meta.penaltyName} if today's milestone is missed to maintain accountability.`,
        type: meta.penaltyType,
        repsOrMins: meta.penaltyRepsOrMins
      }
    };
  });
}

// Full 71 Catalog Export
export const PRESET_CHALLENGES: PresetChallengeTemplate[] = RAW_CHALLENGES.map((meta) => ({
  id: meta.id,
  title: meta.title,
  description: meta.description,
  category: meta.category,
  icon: meta.icon,
  color: meta.color,
  defaultTasks: build21DaysForChallenge(meta)
}));

// Helper to get initial pre-populated challenges for new users
export function getInitialChallenges(): HabitChallenge[] {
  return PRESET_CHALLENGES.slice(0, 6).map((template, idx) => ({
    id: `chal-${idx + 1}`,
    title: `${template.icon} ${template.title}`,
    description: template.description,
    category: template.category,
    currentDay: idx === 0 ? 4 : idx === 2 ? 8 : idx === 3 ? 12 : idx === 5 ? 21 : 1,
    totalDays: 21,
    status: idx === 5 ? "Completed" : idx === 1 || idx === 4 ? "Not Started" : "Active",
    streakCount: idx === 0 ? 3 : idx === 2 ? 7 : idx === 3 ? 11 : idx === 5 ? 21 : 0,
    icon: template.icon,
    color: template.color,
    missedDays: 0,
    completedDays:
      idx === 0
        ? [1, 2, 3]
        : idx === 2
        ? [1, 2, 3, 4, 5, 6, 7]
        : idx === 3
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        : idx === 5
        ? Array.from({ length: 21 }, (_, i) => i + 1)
        : [],
    customPenaltyType: "pushups",
    customPenaltyRepsOrMins: 20
  }));
}
