import React, { useState, useEffect, useMemo, useRef } from "react";
import { Patient } from "../types";
import {
  Sparkles,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  History,
  Settings as SettingsIcon,
  Award,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Volume2,
  VolumeX,
  CheckCircle2,
  Trash2,
  Check,
  Download,
  Flame,
  Heart,
  Share2,
  Layers,
  ChevronRight,
  ChevronLeft,
  Wind,
  Smile,
  Moon,
  Sun,
  Zap,
  Music,
  Sliders,
  Feather,
  Info,
  Filter,
  Search,
  CheckSquare,
  Activity,
  LayoutGrid,
  TrendingUp,
  Target,
  ArrowRight,
  RefreshCw,
  Compass,
  X
} from "lucide-react";

export type YogaTab =
  | "dashboard"
  | "sessions"
  | "poses"
  | "in_progress"
  | "progress"
  | "insights"
  | "calendar"
  | "programs"
  | "breathing"
  | "reminders"
  | "milestones"
  | "settings";

interface YogaMeditationTrackerProps {
  patient: Patient;
  onLogSession?: (patientId: string, durationMins: number, type: string) => void;
}

export interface YogaPoseItem {
  id: string;
  sanskritName: string;
  englishName: string;
  category: "Standing" | "Seated" | "Backbends" | "Balance" | "Twists" | "Inversions";
  level: "Beginner" | "Intermediate" | "Advanced";
  targetArea: string;
  durationSeconds: number;
  benefits: string[];
  instructions: string[];
  cautions: string;
  cue: string;
  svgType: "mountain" | "downward_dog" | "cobra" | "warrior" | "triangle" | "tree" | "lotus" | "bridge" | "child" | "cat_cow";
}

export interface YogaProgram {
  id: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  totalDays: number;
  currentDay: number;
  category: string;
  description: string;
  icon: string;
}

export interface YogaSessionLog {
  id: string;
  title: string;
  category: "Yoga" | "Breathing" | "Meditation";
  durationMins: number;
  date: string;
  time: string;
  focus: "Flexibility" | "Strength" | "Balance" | "Relaxation";
  notes?: string;
  rating?: number;
}

// Web Audio Zen Bell Generator (Synthesizer without external files)
const playZenBell = (frequency: number = 528, duration: number = 1.8) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

// SVG Pose Illustrations Renderer
const PoseIllustration: React.FC<{ type: YogaPoseItem["svgType"]; className?: string }> = ({ type, className = "w-20 h-20" }) => {
  switch (type) {
    case "cobra":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="78" cy="30" r="7" className="fill-orange-400 stroke-orange-500" />
          <path d="M 75 37 C 72 45, 62 55, 45 62 C 28 69, 15 72, 10 75" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 60 52 L 68 75 L 75 75" className="stroke-slate-700" />
          <path d="M 45 62 L 12 75 L 8 75" className="stroke-slate-800" strokeWidth="3" />
          <line x1="5" y1="78" x2="95" y2="78" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
    case "downward_dog":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="28" cy="62" r="6" className="fill-orange-400 stroke-orange-500" />
          <path d="M 32 64 L 50 30 L 75 70" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 50 30 L 52 35" />
          <path d="M 32 64 L 20 72" className="stroke-slate-700" />
          <path d="M 75 70 L 82 72" className="stroke-slate-700" />
          <line x1="5" y1="75" x2="95" y2="75" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
    case "warrior":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="22" r="6" className="fill-orange-400 stroke-orange-500" />
          <path d="M 50 28 L 50 50 L 32 72" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 50 50 L 72 72" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 22 36 L 78 36" className="stroke-orange-600" strokeWidth="3" />
          <line x1="15" y1="75" x2="85" y2="75" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="20" r="6" className="fill-orange-400 stroke-orange-500" />
          <path d="M 50 26 L 50 56 L 50 78" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 50 56 L 68 46 L 50 50" className="stroke-slate-700" />
          <path d="M 40 12 L 50 24 L 60 12" className="stroke-orange-500" />
          <line x1="30" y1="80" x2="70" y2="80" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
    case "lotus":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="30" r="7" className="fill-orange-400 stroke-orange-500" />
          <path d="M 50 37 L 50 62" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 30 68 C 40 75, 60 75, 70 68" className="stroke-slate-700" strokeWidth="3" />
          <path d="M 40 45 L 28 58 L 38 64" className="stroke-orange-500" />
          <path d="M 60 45 L 72 58 L 62 64" className="stroke-orange-500" />
          <line x1="15" y1="76" x2="85" y2="76" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="68" cy="40" r="6" className="fill-orange-400 stroke-orange-500" />
          <path d="M 35 75 L 50 45 L 68 75" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 50 45 L 68 40 L 75 22" className="stroke-orange-600" strokeWidth="3" />
          <path d="M 68 40 L 68 65" className="stroke-slate-700" />
          <line x1="15" y1="78" x2="85" y2="78" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
    default:
      // mountain / general standing
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="20" r="6" className="fill-orange-400 stroke-orange-500" />
          <path d="M 50 26 L 50 56 L 45 78" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 50 56 L 55 78" className="stroke-slate-800" strokeWidth="3" />
          <path d="M 38 34 L 50 30 L 62 34" className="stroke-orange-500" />
          <line x1="30" y1="80" x2="70" y2="80" className="stroke-orange-200" strokeDasharray="3 3" />
        </svg>
      );
  }
};

export const YogaMeditationTracker: React.FC<YogaMeditationTrackerProps> = ({
  patient,
  onLogSession
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<YogaTab>("dashboard");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Master Poses Data
  const ALL_YOGA_POSES: YogaPoseItem[] = [
    {
      id: "p_tadasana",
      sanskritName: "Tadasana",
      englishName: "Mountain Pose",
      category: "Standing",
      level: "Beginner",
      targetArea: "Full Body Posture & Alignment",
      durationSeconds: 30,
      benefits: ["Improves posture", "Strengthens thighs and knees", "Relieves spinal compression"],
      instructions: [
        "Stand tall with feet together or hip-width apart.",
        "Engage your quadriceps, draw tailbone down, align shoulders over hips.",
        "Ground evenly through all four corners of your feet.",
        "Breathe calmly and feel steady like a mountain."
      ],
      cautions: "Avoid if feeling dizzy or with low blood pressure.",
      cue: "Stand tall, ground your feet firmly into the earth, and breathe deeply.",
      svgType: "mountain"
    },
    {
      id: "p_adho_mukha",
      sanskritName: "Adho Mukha Svanasana",
      englishName: "Downward Dog",
      category: "Standing",
      level: "Beginner",
      targetArea: "Hamstrings, Calves & Shoulders",
      durationSeconds: 45,
      benefits: ["Deeply elongates spine", "Strengthens arms and wrists", "Calms the nervous system"],
      instructions: [
        "Start on hands and knees with wrists under shoulders.",
        "Tuck toes, lift knees, and press hips up and back.",
        "Keep spine straight; pedal heels toward the mat.",
        "Spread fingers wide and press palms flat."
      ],
      cautions: "Avoid with carpal tunnel or severe high blood pressure.",
      cue: "Lift hips high, press chest toward your thighs, and relax your neck.",
      svgType: "downward_dog"
    },
    {
      id: "p_bhujangasana",
      sanskritName: "Bhujangasana",
      englishName: "Cobra Pose",
      category: "Backbends",
      level: "Beginner",
      targetArea: "Chest, Spine & Abdominals",
      durationSeconds: 30,
      benefits: ["Opens heart and chest", "Strengthens vertebral column", "Elevates energy"],
      instructions: [
        "Lie flat on your stomach with tops of feet pressed into the mat.",
        "Place hands under shoulders, elbows hugged close to torso.",
        "Inhale and gently peel chest off the floor.",
        "Keep shoulders relaxed away from ears; gaze upward."
      ],
      cautions: "Avoid with acute back injury or pregnancy.",
      cue: "Inhale, lift your chest, keep shoulders away from ears, and look up.",
      svgType: "cobra"
    },
    {
      id: "p_virabhadrasana2",
      sanskritName: "Virabhadrasana II",
      englishName: "Warrior II Pose",
      category: "Standing",
      level: "Intermediate",
      targetArea: "Hips, Groin & Stamina",
      durationSeconds: 45,
      benefits: ["Builds core and leg endurance", "Increases hip flexibility", "Fosters inner focus"],
      instructions: [
        "Step feet 3.5 to 4 feet apart, turn right foot out 90 degrees.",
        "Bend right knee directly over right ankle.",
        "Extend arms parallel to the ground, palms facing down.",
        "Gaze steadily over your front right fingertips."
      ],
      cautions: "Caution with knee injuries; do not allow knee to collapse inward.",
      cue: "Sink into front leg, extend arms wide, and maintain steady warrior breath.",
      svgType: "warrior"
    },
    {
      id: "p_trikonasana",
      sanskritName: "Trikonasana",
      englishName: "Triangle Pose",
      category: "Standing",
      level: "Beginner",
      targetArea: "Side Body, Hamstrings & Torso",
      durationSeconds: 40,
      benefits: ["Stretches legs and groin", "Relieves backache", "Improves lung capacity"],
      instructions: [
        "Stand wide, turn right foot out and left foot slightly in.",
        "Reach right arm forward and hinge sideways at the hip.",
        "Rest right hand on shin, block, or floor; extend left arm straight up.",
        "Rotate chest open toward the ceiling."
      ],
      cautions: "Avoid looking up if experiencing neck pain; gaze neutral instead.",
      cue: "Reach out long through both sides of your waist and stack your shoulders.",
      svgType: "triangle"
    },
    {
      id: "p_vrikshasana",
      sanskritName: "Vrikshasana",
      englishName: "Tree Pose",
      category: "Balance",
      level: "Beginner",
      targetArea: "Ankles, Calves & Mental Focus",
      durationSeconds: 30,
      benefits: ["Sharpens concentration", "Improves neuromuscular balance", "Opens hips gently"],
      instructions: [
        "Shift weight onto left foot, root down.",
        "Place sole of right foot on inner left calf or inner thigh (avoid knee).",
        "Bring hands to heart center or reach them overhead.",
        "Fix gaze on an unmoving spot (Drishti)."
      ],
      cautions: "Do not place foot directly on the knee joint.",
      cue: "Root down through your standing foot and grow tall through your spine.",
      svgType: "tree"
    }
  ];

  // Selected Pose for Detail Modal
  const [selectedPoseModal, setSelectedPoseModal] = useState<YogaPoseItem | null>(null);
  const [poseCategoryFilter, setPoseCategoryFilter] = useState<string>("All");
  const [poseSearchQuery, setPoseSearchQuery] = useState<string>("");

  // Filtered Poses
  const filteredPoses = useMemo(() => {
    return ALL_YOGA_POSES.filter((p) => {
      const matchCat = poseCategoryFilter === "All" || p.category === poseCategoryFilter;
      const matchSearch =
        !poseSearchQuery.trim() ||
        p.englishName.toLowerCase().includes(poseSearchQuery.toLowerCase()) ||
        p.sanskritName.toLowerCase().includes(poseSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [poseCategoryFilter, poseSearchQuery]);

  // Featured Yoga Programs
  const [programs, setPrograms] = useState<YogaProgram[]>([
    {
      id: "prog_7days",
      title: "7 Days Yoga Challenge",
      subtitle: "Build a daily yoga habit",
      level: "Beginner",
      totalDays: 7,
      currentDay: 3,
      category: "Daily Habit",
      description: "Kickstart your mindful physical journey with gentle, daily 15-20 min flows.",
      icon: "🌱"
    },
    {
      id: "prog_flexibility",
      title: "Flexibility Booster",
      subtitle: "Improve your flexibility & release tight hips",
      level: "Intermediate",
      totalDays: 14,
      currentDay: 7,
      category: "Flexibility",
      description: "Targeted hip openers, hamstring stretches, and shoulder releases.",
      icon: "🧘"
    },
    {
      id: "prog_stress_relief",
      title: "Stress Relief Yoga",
      subtitle: "Calm your mind & restore nervous system",
      level: "Beginner",
      totalDays: 10,
      currentDay: 2,
      category: "Mindfulness",
      description: "Gentle restorative yin yoga paired with deep parasympathetic breathing.",
      icon: "🕯️"
    },
    {
      id: "prog_strength",
      title: "Strength & Balance",
      subtitle: "Build strength, core & balance",
      level: "Advanced",
      totalDays: 21,
      currentDay: 10,
      category: "Strength",
      description: "Dynamic Vinyasa flow, warrior sequences, arm balances and core power.",
      icon: "⚡"
    }
  ]);

  // Session Logs State
  const [sessionLogs, setSessionLogs] = useState<YogaSessionLog[]>(() => {
    const saved = localStorage.getItem("care2care_yoga_session_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "log_1",
        title: "Morning Sun Salutation",
        category: "Yoga",
        durationMins: 20,
        date: new Date().toISOString().split("T")[0],
        time: "07:30 AM",
        focus: "Flexibility",
        notes: "Spine felt energized and light.",
        rating: 5
      },
      {
        id: "log_2",
        title: "Anulom Vilom Pranayama",
        category: "Breathing",
        durationMins: 10,
        date: new Date().toISOString().split("T")[0],
        time: "01:15 PM",
        focus: "Relaxation",
        notes: "Cleared midday mental fog.",
        rating: 5
      },
      {
        id: "log_3",
        title: "Warrior Vinyasa Flow",
        category: "Yoga",
        durationMins: 25,
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        time: "08:00 AM",
        focus: "Strength",
        notes: "Great leg engagement.",
        rating: 4
      }
    ];
  });

  // Reminders Configuration
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [scheduledReminders, setScheduledReminders] = useState([
    { id: "rem_1", title: "Morning Yoga", time: "6:00 AM", frequency: "Every day", enabled: true },
    { id: "rem_2", title: "Evening Yoga", time: "7:30 PM", frequency: "Every day", enabled: true },
    { id: "rem_3", title: "Breathing Break", time: "12:00 PM", frequency: "Every day", enabled: true },
    { id: "rem_4", title: "Weekend Practice", time: "8:00 AM", frequency: "Sat, Sun", enabled: true }
  ]);

  // Settings State
  const [yogaLevel, setYogaLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [practiceReminderFreq, setPracticeReminderFreq] = useState("2 times a day");
  const [defaultDurationMins, setDefaultDurationMins] = useState(30);
  const [preferredFocus, setPreferredFocus] = useState<"Flexibility" | "Strength" | "Balance" | "Relaxation">("Flexibility");
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState(true);
  const [ambientMusic, setAmbientMusic] = useState<"Calm" | "Tibetan Bowls" | "Rain & Forest" | "Silence">("Calm");

  // -------------------------------------------------------------
  // 🧘 LIVE INTERACTIVE PRACTICE ENGINE (IN-PROGRESS SESSION)
  // -------------------------------------------------------------
  const [activePracticePlan, setActivePracticePlan] = useState<{
    title: string;
    level: string;
    totalDurationMins: number;
    poses: YogaPoseItem[];
  }>({
    title: "Sun Salutation",
    level: "Beginner",
    totalDurationMins: 20,
    poses: ALL_YOGA_POSES
  });

  const [activePoseIndex, setActivePoseIndex] = useState<number>(0);
  const [poseSecondsLeft, setPoseSecondsLeft] = useState<number>(20);
  const [isSessionPlaying, setIsSessionPlaying] = useState<boolean>(false);
  const [totalSessionElapsedSeconds, setTotalSessionElapsedSeconds] = useState<number>(0);

  const currentPose = activePracticePlan.poses[activePoseIndex] || activePracticePlan.poses[0];

  // Start a specific Practice Session
  const handleStartPractice = (sessionTitle: string, durationMins: number = 20, customPoses?: YogaPoseItem[]) => {
    setActivePracticePlan({
      title: sessionTitle,
      level: yogaLevel,
      totalDurationMins: durationMins,
      poses: customPoses || ALL_YOGA_POSES
    });
    setActivePoseIndex(0);
    setPoseSecondsLeft(customPoses?.[0]?.durationSeconds || ALL_YOGA_POSES[0].durationSeconds);
    setTotalSessionElapsedSeconds(0);
    setIsSessionPlaying(true);
    setActiveTab("in_progress");
    playZenBell(528, 2.0);
    showToast(`🧘 Beginning "${sessionTitle}" practice!`);
  };

  // Timer Tick for In-Progress Practice
  useEffect(() => {
    let timer: any = null;
    if (activeTab === "in_progress" && isSessionPlaying) {
      timer = setInterval(() => {
        setTotalSessionElapsedSeconds((prev) => prev + 1);

        setPoseSecondsLeft((prev) => {
          if (prev <= 1) {
            playZenBell(660, 1.2);
            // Move to next pose or complete
            if (activePoseIndex < activePracticePlan.poses.length - 1) {
              const nextIdx = activePoseIndex + 1;
              setActivePoseIndex(nextIdx);
              return activePracticePlan.poses[nextIdx].durationSeconds || 30;
            } else {
              // Session finished!
              setIsSessionPlaying(false);
              handleCompleteSession();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, isSessionPlaying, activePoseIndex, activePracticePlan]);

  const handleNextPose = () => {
    if (activePoseIndex < activePracticePlan.poses.length - 1) {
      const nextIdx = activePoseIndex + 1;
      setActivePoseIndex(nextIdx);
      setPoseSecondsLeft(activePracticePlan.poses[nextIdx].durationSeconds || 30);
      playZenBell(580, 1.0);
    } else {
      handleCompleteSession();
    }
  };

  const handleSkipPose = () => {
    handleNextPose();
  };

  const handleCompleteSession = () => {
    const elapsedMins = Math.max(1, Math.round(totalSessionElapsedSeconds / 60) || activePracticePlan.totalDurationMins);
    const newLog: YogaSessionLog = {
      id: `log_${Date.now()}`,
      title: activePracticePlan.title,
      category: "Yoga",
      durationMins: elapsedMins,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      focus: preferredFocus,
      notes: `Completed ${activePracticePlan.poses.length} poses flow with mindfulness.`,
      rating: 5
    };

    const updated = [newLog, ...sessionLogs];
    setSessionLogs(updated);
    localStorage.setItem("care2care_yoga_session_logs", JSON.stringify(updated));
    if (onLogSession) onLogSession(patient.id, elapsedMins, "Yoga");

    playZenBell(880, 2.5);
    showToast(`🎉 Namaste! Completed ${elapsedMins} mins of ${activePracticePlan.title}!`);
    setActiveTab("progress");
  };

  // -------------------------------------------------------------
  // 🫁 PRANAYAMA BREATHING ENGINE
  // -------------------------------------------------------------
  const [activeBreathingType, setActiveBreathingType] = useState<string>("Deep Breathing");
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Inhale");
  const [breathingCountdown, setBreathingCountdown] = useState<number>(4);
  const [breathingTotalMinutes, setBreathingTotalMinutes] = useState<number>(5);
  const [breathingRoundsCompleted, setBreathingRoundsCompleted] = useState<number>(0);

  const BREATHING_PRACTICES = [
    {
      id: "b_deep",
      title: "Deep Breathing",
      duration: "5 min",
      mins: 5,
      type: "Basic / 4-7-8",
      inhale: 4,
      hold: 7,
      exhale: 8,
      rest: 1,
      benefits: "Promotes deep parasympathetic calm, lowers heart rate and blood pressure.",
      icon: "🌬️"
    },
    {
      id: "b_anulom",
      title: "Anulom Vilom",
      duration: "7 min",
      mins: 7,
      type: "Nadi Shodhana",
      inhale: 4,
      hold: 4,
      exhale: 4,
      rest: 0,
      benefits: "Balances left and right brain hemispheres and clears energetic channels.",
      icon: "🌿"
    },
    {
      id: "b_bhramari",
      title: "Bhramari Pranayama",
      duration: "7 min",
      mins: 7,
      type: "Bee Breath",
      inhale: 5,
      hold: 2,
      exhale: 7,
      rest: 1,
      benefits: "Stimulates vagus nerve via gentle humming vibration on exhale.",
      icon: "🐝"
    },
    {
      id: "b_kapalbhati",
      title: "Kapalbhati",
      duration: "5 min",
      mins: 5,
      type: "Energizing / Skull Shining",
      inhale: 2,
      hold: 0,
      exhale: 1,
      rest: 1,
      benefits: "Releases toxins, oxygenates bloodstream, and sharpens mental clarity.",
      icon: "🔥"
    },
    {
      id: "b_sheetali",
      title: "Sheetali Pranayama",
      duration: "5 min",
      mins: 5,
      type: "Cooling / Heat Release",
      inhale: 4,
      hold: 4,
      exhale: 6,
      rest: 1,
      benefits: "Cools internal body temperature, reduces agitation and thirst.",
      icon: "❄️"
    }
  ];

  // Breathing Loop Timer
  useEffect(() => {
    let bTimer: any = null;
    if (activeTab === "breathing" && isBreathingActive) {
      const curConfig = BREATHING_PRACTICES.find((b) => b.title === activeBreathingType) || BREATHING_PRACTICES[0];
      bTimer = setInterval(() => {
        setBreathingCountdown((prev) => {
          if (prev <= 1) {
            if (breathingPhase === "Inhale") {
              if (curConfig.hold > 0) {
                setBreathingPhase("Hold");
                return curConfig.hold;
              } else {
                setBreathingPhase("Exhale");
                return curConfig.exhale;
              }
            } else if (breathingPhase === "Hold") {
              setBreathingPhase("Exhale");
              return curConfig.exhale;
            } else if (breathingPhase === "Exhale") {
              if (curConfig.rest > 0) {
                setBreathingPhase("Rest");
                return curConfig.rest;
              } else {
                setBreathingPhase("Inhale");
                setBreathingRoundsCompleted((r) => r + 1);
                playZenBell(440, 0.8);
                return curConfig.inhale;
              }
            } else {
              setBreathingPhase("Inhale");
              setBreathingRoundsCompleted((r) => r + 1);
              playZenBell(440, 0.8);
              return curConfig.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(bTimer);
  }, [activeTab, isBreathingActive, breathingPhase, activeBreathingType]);

  const handleStartBreathing = (practiceTitle: string, mins: number) => {
    setActiveBreathingType(practiceTitle);
    setBreathingTotalMinutes(mins);
    const cfg = BREATHING_PRACTICES.find((p) => p.title === practiceTitle) || BREATHING_PRACTICES[0];
    setBreathingPhase("Inhale");
    setBreathingCountdown(cfg.inhale);
    setBreathingRoundsCompleted(0);
    setIsBreathingActive(true);
    playZenBell(528, 1.5);
    showToast(`🫁 Started ${practiceTitle} (${mins} min)!`);
  };

  // -------------------------------------------------------------
  // 📅 CALENDAR PERPETUAL MONTH GENERATOR
  // -------------------------------------------------------------
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);
  const currentCalendarDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + calendarMonthOffset);
    return d;
  }, [calendarMonthOffset]);

  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjusted for Mon-Sun (0 is Monday, 6 is Sunday)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      status: "completed" | "planned" | "missed" | "no_data";
      dateStr: string;
    }> = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthDays - i,
        isCurrentMonth: false,
        status: "no_data",
        dateStr: ""
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      let status: "completed" | "planned" | "missed" | "no_data" = "no_data";

      if (day <= 7 || day === 14 || day === 21) {
        status = "completed";
      } else if (day === 15 || day === 18) {
        status = "planned";
      } else if (day === 10 || day === 16) {
        status = "missed";
      }

      days.push({
        dayNumber: day,
        isCurrentMonth: true,
        status,
        dateStr
      });
    }

    return days;
  }, [currentCalendarDate]);

  // Aggregated Stats
  const totalMinutesThisMonth = 365;
  const totalSessionsThisMonth = 12;
  const currentStreakDays = 7;
  const todayMinutes = 30;
  const todayGoalMinutes = 30;

  // Horizontal Scrolling Navigation Menu List
  const navMenuItems: Array<{ id: YogaTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "sessions", label: "Sessions", icon: Play },
    { id: "poses", label: "Poses", icon: Feather },
    { id: "in_progress", label: "In-Progress", icon: Activity },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "programs", label: "Programs", icon: Target },
    { id: "breathing", label: "Breathing", icon: Wind },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "milestones", label: "Milestones", icon: Award },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FF5A36] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300 border border-orange-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 TOP HEADER (CARE2CARE WARM PEACH / ORANGE BRANDING) */}
      {/* ============================================================ */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs text-xl">
            🧘
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Yoga & Mindfulness Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mindful Yoga & Pranayama
            </h1>
          </div>
        </div>

        <button
          onClick={() => handleStartPractice("Sun Salutation", 20)}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>+ Start Practice</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 🧭 HORIZONTAL SCROLLING MENU (AS PER WATER SERVICE PATTERN) */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-xs font-black scale-[1.02]"
                  : "bg-white text-slate-600 hover:bg-orange-50 hover:text-[#FF5A36] border border-slate-200/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. SCREEN: YOGA DASHBOARD */}
      {/* ============================================================ */}
      {activeTab === "dashboard" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Greeting Banner */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                Good Morning, {patient.name.split(" ")[0]} 🌿
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Let's begin your mindful journey today.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              ✨
            </div>
          </div>

          {/* Today's Practice Hero Card */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="space-y-3 max-w-sm">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36] bg-white px-2.5 py-1 rounded-full border border-orange-200">
                Today's Practice
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Sun Salutation</h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">20 min • Beginner Level</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flow through 12 dynamic classical postures to stretch your hamstrings, open your chest, and energize your morning.
              </p>
              <button
                onClick={() => handleStartPractice("Sun Salutation", 20)}
                className="px-5 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Start Practice
              </button>
            </div>

            <div className="w-44 h-44 bg-white/80 backdrop-blur-xs rounded-3xl border border-orange-200/60 p-3 flex flex-col items-center justify-center shrink-0 shadow-inner">
              <PoseIllustration type="cobra" className="w-32 h-32 text-[#FF5A36]" />
              <span className="text-[10px] font-black text-slate-500 mt-1">Surya Namaskar Flow</span>
            </div>
          </div>

          {/* Today's Focus Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Today's Focus: Flexibility</h4>
              <p className="text-xs text-slate-600 font-medium">Be gentle with your body, lengthen your spine, and breathe deeply.</p>
            </div>
          </div>

          {/* Two Metric Summary Cards: Streak & Minutes Today */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 text-2xl shrink-0">
                🔥
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">Practice Streak</p>
                <h3 className="text-xl font-black text-slate-900">{currentStreakDays} days</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl shrink-0">
                ⏱️
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">Minutes Today</p>
                <h3 className="text-xl font-black text-slate-900">{todayMinutes} / {todayGoalMinutes} min</h3>
              </div>
            </div>
          </div>

          {/* Upcoming Practice Item */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg">
                🌙
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-purple-600">Upcoming Session</p>
                <h4 className="text-xs font-black text-slate-900">Evening Relaxation Flow</h4>
                <p className="text-[11px] text-slate-500 font-medium">7:30 PM • 15 min</p>
              </div>
            </div>
            <button
              onClick={() => handleStartPractice("Evening Relaxation Flow", 15)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-[#FF5A36] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. SCREEN: SESSIONS (START YOGA SESSION / CHOOSE PRACTICE) */}
      {/* ============================================================ */}
      {activeTab === "sessions" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Choose Your Practice</h2>
            <span className="text-xs text-slate-500 font-bold">Recommended for You</span>
          </div>

          {/* Recommended Session Cards */}
          <div className="space-y-3">
            {[
              { title: "Morning Energizer", duration: 25, level: "Beginner", icon: "☀️", color: "bg-amber-50 border-amber-200 text-amber-700" },
              { title: "Full Body Stretch", duration: 30, level: "Intermediate", icon: "🌿", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
              { title: "Evening Relaxation", duration: 15, level: "Beginner", icon: "🌙", color: "bg-purple-50 border-purple-200 text-purple-700" },
              { title: "Core & Spine Stability", duration: 20, level: "Intermediate", icon: "⚡", color: "bg-orange-50 border-orange-200 text-orange-700" }
            ].map((sess, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl ${sess.color}`}>
                    {sess.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{sess.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{sess.duration} min • {sess.level}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartPractice(sess.title, sess.duration)}
                  className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white border border-orange-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}

            {/* Custom Practice Button */}
            <div
              onClick={() => handleStartPractice("Custom Mindful Practice", 30)}
              className="bg-white p-4 rounded-3xl border border-dashed border-orange-300 hover:bg-orange-50/50 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center text-xl font-black">
                  +
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Custom Practice</h4>
                  <p className="text-[11px] text-slate-500">Create your own session & pose flow</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Filter by Duration */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">By Duration</h3>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[10, 20, 30, 45, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDefaultDurationMins(d)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    defaultDurationMins === d
                      ? "bg-[#FF5A36] text-white font-black shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {d} min{d === 60 ? "+" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Focus */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">By Focus</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: "Flexibility", icon: "🌱" },
                { name: "Strength", icon: "⚡" },
                { name: "Balance", icon: "⚖️" },
                { name: "Relaxation", icon: "🌿" }
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => setPreferredFocus(f.name as any)}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    preferredFocus === f.name
                      ? "bg-orange-50 border-orange-400 text-[#FF5A36] font-black"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SCREEN: YOGA POSES (LIBRARY & CATEGORIES) */}
      {/* ============================================================ */}
      {activeTab === "poses" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search for poses (e.g. Mountain, Downward Dog, Cobra)..."
              value={poseSearchQuery}
              onChange={(e) => setPoseSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Standing", "Seated", "Backbends", "Balance"].map((cat) => (
              <button
                key={cat}
                onClick={() => setPoseCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  poseCategoryFilter === cat
                    ? "bg-[#FF5A36] text-white font-black shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat === "All" ? "All Poses" : cat}
              </button>
            ))}
          </div>

          {/* Poses List Items */}
          <div className="space-y-2.5">
            {filteredPoses.map((pose) => (
              <div
                key={pose.id}
                onClick={() => setSelectedPoseModal(pose)}
                className="bg-white p-4 rounded-3xl border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50/80 border border-orange-200/60 p-1 flex items-center justify-center shrink-0">
                    <PoseIllustration type={pose.svgType} className="w-10 h-10 text-[#FF5A36]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{pose.sanskritName}</h3>
                    <p className="text-xs font-bold text-slate-600">{pose.englishName}</p>
                    <span className="text-[10px] font-bold text-[#FF5A36] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 mt-1 inline-block">
                      {pose.level} • {pose.category}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SCREEN: IN-PROGRESS SESSION (INTERACTIVE LIVE PLAYER) */}
      {/* ============================================================ */}
      {activeTab === "in_progress" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">{activePracticePlan.title}</h2>
              <p className="text-xs text-slate-500 font-bold">
                Step {activePoseIndex + 1} of {activePracticePlan.poses.length}
              </p>
            </div>
            <button
              onClick={() => setIsSessionPlaying(!isSessionPlaying)}
              className="px-4 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FF5A36] font-black text-xs transition-colors cursor-pointer"
            >
              {isSessionPlaying ? "Pause" : "Resume"}
            </button>
          </div>

          {/* Visual Pose Stage & Graphic */}
          <div className="bg-gradient-to-b from-orange-50/60 to-[#FFF9F5] border border-orange-200/70 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
            <PoseIllustration type={currentPose.svgType} className="w-44 h-44 text-[#FF5A36] drop-shadow-md" />

            <div>
              <h3 className="text-xl font-black text-slate-900">{currentPose.sanskritName}</h3>
              <p className="text-xs font-bold text-slate-600">({currentPose.englishName})</p>
            </div>

            {/* Countdown Circular Ring Display */}
            <div className="w-20 h-20 rounded-full bg-white border-4 border-[#FF5A36] flex flex-col items-center justify-center shadow-md">
              <span className="text-2xl font-black text-slate-900">{poseSecondsLeft}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">seconds</span>
            </div>

            {/* Voice Guidance / Cue Box */}
            {voiceGuidanceEnabled && (
              <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-orange-200 max-w-md text-xs font-medium text-slate-700 italic">
                "{currentPose.cue}"
              </div>
            )}
          </div>

          {/* Bottom Player Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Time Left</p>
              <p className="text-xs font-black text-slate-800">
                {String(Math.floor((activePracticePlan.totalDurationMins * 60 - totalSessionElapsedSeconds) / 60)).padStart(2, "0")}:
                {String((activePracticePlan.totalDurationMins * 60 - totalSessionElapsedSeconds) % 60).padStart(2, "0")}
              </p>
            </div>

            <button
              onClick={handleSkipPose}
              className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all"
            >
              {activePoseIndex === activePracticePlan.poses.length - 1 ? "Finish Session" : "Next Pose"}
            </button>

            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Time</p>
              <p className="text-xs font-black text-slate-800">{activePracticePlan.totalDurationMins}:00</p>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {activePracticePlan.poses.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === activePoseIndex
                    ? "w-6 bg-[#FF5A36]"
                    : i < activePoseIndex
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SCREEN: YOGA PROGRESS (ANALYTICS & CHARTS) */}
      {/* ============================================================ */}
      {activeTab === "progress" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Timeframe Filter Pills */}
          <div className="flex items-center justify-center gap-2">
            {["Week", "Month", "Year"].map((tf) => (
              <button
                key={tf}
                className={`px-4 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  tf === "Month"
                    ? "bg-[#FF5A36] text-white font-black shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Practice Overview Cards */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Practice Overview (This Month)</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl text-center border border-slate-100">
                <p className="text-lg font-black text-slate-900">{totalSessionsThisMonth}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Sessions</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl text-center border border-slate-100">
                <p className="text-lg font-black text-emerald-700">{totalMinutesThisMonth}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Minutes</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl text-center border border-slate-100">
                <p className="text-lg font-black text-orange-600 flex items-center justify-center gap-1">
                  🔥 {currentStreakDays}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Days Streak</p>
              </div>
            </div>
          </div>

          {/* Time Spent Histogram / Bar Chart */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Time Spent (Minutes)</h3>
              <span className="text-[11px] font-bold text-slate-400">May 2025</span>
            </div>

            <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
              {[
                { range: "1-5", mins: 65 },
                { range: "6-10", mins: 90 },
                { range: "11-15", mins: 45 },
                { range: "16-20", mins: 75 },
                { range: "21-25", mins: 85 },
                { range: "26-31", mins: 55 }
              ].map((b, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: `${(b.mins / 100) * 100}%` }}
                    className="w-full max-w-[28px] bg-emerald-600 hover:bg-emerald-500 rounded-t-lg transition-all"
                  />
                  <span className="text-[9px] font-bold text-slate-500">{b.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Focus Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <span>🌱 Flexibility</span>
                <span className="font-black">40%</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-center justify-between">
                <span>⚡ Strength</span>
                <span className="font-black">30%</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-orange-900 flex items-center justify-between">
                <span>⚖️ Balance</span>
                <span className="font-black">20%</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 flex items-center justify-between">
                <span>🌿 Relaxation</span>
                <span className="font-black">10%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. SCREEN: YOGA INSIGHTS */}
      {/* ============================================================ */}
      {activeTab === "insights" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Your Yoga Insights</h2>
            <span className="text-xs text-slate-500 font-bold">Based on your practice</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Most Improved */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Most Improved
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Flexibility</h3>
              <p className="text-xs text-slate-500 font-bold">+28% vs last month</p>
            </div>

            {/* Best Time to Practice */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Best Time to Practice
                </span>
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Morning</h3>
              <p className="text-xs text-slate-500 font-bold">Most consistent between 6 AM – 9 AM</p>
            </div>

            {/* Consistency Ring */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4 sm:col-span-2">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-700 text-lg shrink-0">
                85%
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Consistency Score</h3>
                <p className="text-xs text-slate-500">You're doing great! Maintained over 5 sessions every week.</p>
              </div>
            </div>

            {/* Tip for You */}
            <div className="bg-orange-50 border border-orange-200/80 p-5 rounded-3xl shadow-xs flex items-start gap-3.5 sm:col-span-2">
              <div className="w-9 h-9 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tip for You</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Add 5 minutes of breathing practice daily for better focus, nervous system regulation, and mental calm.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. SCREEN: YOGA CALENDAR */}
      {/* ============================================================ */}
      {activeTab === "calendar" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={() => setCalendarMonthOffset((prev) => prev - 1)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-slate-900">
              {currentCalendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button
              onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
              <div key={w} className="py-1">{w}</div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cd, idx) => (
              <div
                key={idx}
                className={`h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                  !cd.isCurrentMonth
                    ? "opacity-30 border-transparent bg-slate-50 text-slate-400"
                    : cd.status === "completed"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-black"
                    : cd.status === "planned"
                    ? "bg-orange-50 border-orange-300 text-orange-950 font-black"
                    : cd.status === "missed"
                    ? "bg-rose-50 border-rose-200 text-rose-950 font-black"
                    : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-xs">{cd.dayNumber}</span>
                {cd.isCurrentMonth && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cd.status === "completed"
                        ? "bg-emerald-600"
                        : cd.status === "planned"
                        ? "bg-[#FF5A36]"
                        : cd.status === "missed"
                        ? "bg-rose-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" /> Planned
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Missed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> No Data
            </span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. SCREEN: YOGA PROGRAMS */}
      {/* ============================================================ */}
      {activeTab === "programs" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Featured Programs</h2>
            <span className="text-xs text-slate-500 font-bold">Structured Journeys</span>
          </div>

          <div className="space-y-3">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 hover:border-orange-300 transition-all shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl">
                      {prog.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{prog.title}</h3>
                      <p className="text-xs text-slate-500 font-bold">{prog.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    {prog.currentDay}/{prog.totalDays}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(prog.currentDay / prog.totalDays) * 100}%` }}
                    className="bg-[#FF5A36] h-full rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-slate-400">{prog.level} • {prog.totalDays} Days</span>
                  <button
                    onClick={() => handleStartPractice(prog.title, 20)}
                    className="px-4 py-1.5 bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    Continue Day {prog.currentDay + 1}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. SCREEN: PRANAYAMA BREATHING */}
      {/* ============================================================ */}
      {activeTab === "breathing" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Active Live Breathing Circle Player if running */}
          {isBreathingActive && (
            <div className="bg-gradient-to-b from-orange-50 via-amber-50 to-white p-6 rounded-3xl border border-orange-200 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-slate-900">{activeBreathingType}</span>
                <button
                  onClick={() => setIsBreathingActive(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Expanding & Contracting Breathing Circle */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-1000 ${
                  breathingPhase === "Inhale"
                    ? "scale-110 bg-emerald-500 text-white"
                    : breathingPhase === "Hold"
                    ? "scale-105 bg-amber-500 text-white"
                    : "scale-90 bg-[#FF5A36] text-white"
                }`}
              >
                <span className="text-xs font-black tracking-widest uppercase">{breathingPhase}</span>
                <span className="text-3xl font-black">{breathingCountdown}</span>
              </div>

              <p className="text-xs font-bold text-slate-600">
                Rounds completed: <span className="text-slate-900 font-black">{breathingRoundsCompleted}</span>
              </p>
            </div>
          )}

          {/* List of Breathing Practices */}
          <div className="space-y-3">
            {BREATHING_PRACTICES.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{b.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{b.duration} • {b.type}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{b.benefits}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartBreathing(b.title, b.mins)}
                  className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-[#FF5A36] text-[#FF5A36] hover:text-white border border-orange-200 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ml-2"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. SCREEN: REMINDERS */}
      {/* ============================================================ */}
      {activeTab === "reminders" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Yoga Reminders</h2>
              <p className="text-xs text-slate-500 font-medium">Daily practice notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div className="space-y-3">
            {scheduledReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{rem.title}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{rem.time} • {rem.frequency}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => {
                      setScheduledReminders(
                        scheduledReminders.map((r) => (r.id === rem.id ? { ...r, enabled: !r.enabled } : r))
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast("Saved reminder preferences!")}
            className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer"
          >
            Save Reminder Settings
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 11. SCREEN: SETTINGS */}
      {/* ============================================================ */}
      {activeTab === "settings" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900">Yoga Settings & Preferences</h2>
            <p className="text-xs text-slate-500 font-medium">Customize your mindfulness environment</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-xs font-black text-slate-800">Yoga Experience Level</p>
                <p className="text-[11px] text-slate-500">Pose complexity and flow pace</p>
              </div>
              <select
                value={yogaLevel}
                onChange={(e) => setYogaLevel(e.target.value as any)}
                className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-800"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-xs font-black text-slate-800">Voice Guidance & Cues</p>
                <p className="text-[11px] text-slate-500">Audio instructions during pose flow</p>
              </div>
              <input
                type="checkbox"
                checked={voiceGuidanceEnabled}
                onChange={(e) => setVoiceGuidanceEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF5A36] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-xs font-black text-slate-800">Ambient Zen Audio</p>
                <p className="text-[11px] text-slate-500">Background soundscape</p>
              </div>
              <select
                value={ambientMusic}
                onChange={(e) => setAmbientMusic(e.target.value as any)}
                className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-800"
              >
                <option value="Calm">Calm</option>
                <option value="Tibetan Bowls">Tibetan Bowls</option>
                <option value="Rain & Forest">Rain & Forest</option>
                <option value="Silence">Silence</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionLogs, null, 2));
                const downloadAnchor = document.createElement("a");
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `yoga_sessions_${new Date().toISOString().slice(0, 10)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast("Yoga data exported successfully!");
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-2xl transition-colors cursor-pointer"
            >
              Export Yoga Data
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset your yoga progress?")) {
                  setSessionLogs([]);
                  localStorage.removeItem("care2care_yoga_session_logs");
                  showToast("Yoga data reset.");
                }
              }}
              className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black rounded-2xl transition-colors cursor-pointer"
            >
              Reset Yoga Data
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 12. SCREEN: STREAKS & ACHIEVEMENTS (MILESTONES) */}
      {/* ============================================================ */}
      {activeTab === "milestones" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Current Streak Hero */}
          <div className="bg-gradient-to-r from-orange-50 to-[#FFF9F5] p-6 rounded-3xl border border-orange-200 text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 text-3xl mx-auto flex items-center justify-center shadow-inner">
              🔥
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase">Current Streak</p>
            <h2 className="text-3xl font-black text-slate-900">{currentStreakDays} days</h2>
            <p className="text-xs text-slate-600 font-medium">Keep it up, you're amazing!</p>
          </div>

          {/* Badges / Achievements List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Achievements</h3>

            {[
              { title: "7 Day Yogi", desc: "Practice for 7 consecutive days", status: "completed", progress: "7/7", icon: "🧘" },
              { title: "21 Day Yogi", desc: "Practice for 21 days", status: "in_progress", progress: "10/21", icon: "🏆" },
              { title: "Early Bird", desc: "Practice 10 mornings between 6 AM – 9 AM", status: "in_progress", progress: "6/10", icon: "🌅" },
              { title: "Master of Balance", desc: "Complete 15 balance poses", status: "in_progress", progress: "5/15", icon: "⚖️" }
            ].map((ach, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl">
                    {ach.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{ach.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{ach.desc}</p>
                  </div>
                </div>

                {ach.status === "completed" ? (
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                    ✓
                  </span>
                ) : (
                  <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {ach.progress}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 📄 POSE DETAIL MODAL */}
      {/* ============================================================ */}
      {selectedPoseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                  <PoseIllustration type={selectedPoseModal.svgType} className="w-10 h-10 text-[#FF5A36]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedPoseModal.sanskritName}</h3>
                  <p className="text-xs font-bold text-slate-600">{selectedPoseModal.englishName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoseModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-orange-50 text-[#FF5A36] px-3 py-1 rounded-xl border border-orange-200">
                {selectedPoseModal.level}
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
                {selectedPoseModal.category}
              </span>
              <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                ⏱️ {selectedPoseModal.durationSeconds}s
              </span>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Instructions</h4>
              <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 leading-relaxed">
                {selectedPoseModal.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            {/* Benefits */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Key Benefits</h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 leading-relaxed">
                {selectedPoseModal.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            {selectedPoseModal.cautions && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-black mr-1">Caution:</span>
                {selectedPoseModal.cautions}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPoseModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPoseModal(null);
                  handleStartPractice(selectedPoseModal.englishName, 10, [selectedPoseModal]);
                }}
                className="px-4 py-2 bg-[#FF5A36] text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Practice Pose
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default YogaMeditationTracker;
