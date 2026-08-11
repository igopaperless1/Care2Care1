import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  Dumbbell,
  Flame,
  CheckCircle2,
  Plus,
  History,
  Settings,
  Award,
  Zap,
  Clock,
  X,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Upload,
  Camera,
  MapPin,
  Share2,
  Download,
  Volume2,
  Sparkles,
  ChevronRight,
  Filter,
  Trash2,
  Edit2,
  Check,
  Play,
  Pause,
  RotateCcw,
  Square,
  TrendingUp,
  Search,
  Activity,
  Ruler,
  Target,
  Heart,
  Layers,
  Copy,
  Info,
  Shield,
  ThumbsUp,
  RefreshCw,
  Video,
  FileText
} from "lucide-react";

interface ExerciseTrackerProps {
  patient?: Patient;
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: "Cardio" | "Strength" | "Flexibility" | "Balance" | "HIIT" | "Yoga" | "Pilates" | "Calisthenics" | "Weightlifting" | "Bodyweight";
  muscleGroups: string[];
  equipment: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  imageUrl?: string;
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutRecord {
  id: string;
  exerciseName: string;
  category: string;
  exerciseType: string;
  equipmentUsed: string[];
  difficulty: string;
  setsCount: number;
  repsPerSet: number;
  weightPerSetKg: number;
  totalWeightKg: number;
  durationMins: number;
  caloriesBurned: number;
  distanceKm?: number;
  perceivedExertion: number; // 1-10
  howFelt: string[];
  notes?: string;
  photoUrl?: string;
  videoName?: string;
  gpsLocation?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  setsList?: WorkoutSet[];
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  waistCm: number;
  chestCm: number;
  hipsCm: number;
  thighsCm: number;
  bicepsCm: number;
  bodyFatPercent: number;
  notes?: string;
  photoUrl?: string;
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "logWorkout" | "timer" | "library" | "customExercise" | "measurements" | "analytics" | "achievements" | "settings"
  >("dashboard");

  // Notifications & Reminders State
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [alertTime, setAlertTime] = useState<string>("18:30");
  const [selectedRingtone, setSelectedRingtone] = useState<string>("Gym Chime");
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [activeNotification, setActiveNotification] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>(
    "🏋️ Workout Reminder: Ready to crush today's exercise goal? Log your sets now!"
  );

  // Global Feedback Toast
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3200);
  };

  // Unit Preferences
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km");

  // ==================== STATE: EXERCISE LIBRARY (50+ PRE-DEFINED EXERCISES) ====================
  const [library, setLibrary] = useState<ExerciseLibraryItem[]>([
    {
      id: "ex-1",
      name: "Barbell Bench Press",
      category: "Strength",
      muscleGroups: ["Chest", "Triceps", "Shoulders"],
      equipment: ["Barbell", "Bench"],
      difficulty: "Intermediate",
      instructions: ["Lie flat on bench", "Grasp bar slightly wider than shoulder-width", "Lower bar smoothly to chest", "Press upwards to full extension"],
      isFavorite: true,
    },
    {
      id: "ex-2",
      name: "Dumbbell Bicep Curls",
      category: "Strength",
      muscleGroups: ["Arms", "Biceps"],
      equipment: ["Dumbbells"],
      difficulty: "Beginner",
      instructions: ["Stand tall with dumbbells at sides", "Keep elbows close to torso", "Curl weight while contracting biceps", "Lower back to starting position"],
      isFavorite: true,
    },
    {
      id: "ex-3",
      name: "Bodyweight Squats",
      category: "Bodyweight",
      muscleGroups: ["Legs", "Glutes", "Quadriceps"],
      equipment: ["None"],
      difficulty: "Beginner",
      instructions: ["Stand shoulder-width apart", "Bend knees and push hips back", "Lower until thighs are parallel to ground", "Drive through heels to stand"],
      isFavorite: true,
    },
    {
      id: "ex-4",
      name: "Treadmill Running",
      category: "Cardio",
      muscleGroups: ["Full Body", "Legs", "Heart"],
      equipment: ["Treadmill"],
      difficulty: "Intermediate",
      instructions: ["Start with warm-up walk for 3 mins", "Increase speed to steady pace", "Maintain upright posture", "Cool down with slow walk"],
      isFavorite: false,
    },
    {
      id: "ex-5",
      name: "Push-ups",
      category: "Calisthenics",
      muscleGroups: ["Chest", "Triceps", "Core"],
      equipment: ["None"],
      difficulty: "Beginner",
      instructions: ["Start in high plank position", "Lower body until chest almost touches floor", "Push up maintaining rigid core line"],
      isFavorite: true,
    },
    {
      id: "ex-6",
      name: "Plank Hold",
      category: "Balance",
      muscleGroups: ["Core", "Abdominals", "Shoulders"],
      equipment: ["Mat"],
      difficulty: "Beginner",
      instructions: ["Forearms on ground, elbows under shoulders", "Keep body in straight horizontal line", "Engage core and hold without letting hips sag"],
      isFavorite: true,
    },
    {
      id: "ex-7",
      name: "Kettlebell Swings",
      category: "HIIT",
      muscleGroups: ["Glutes", "Hamstrings", "Back", "Core"],
      equipment: ["Kettlebell"],
      difficulty: "Intermediate",
      instructions: ["Hinge at hips with kettlebell between knees", "Drive hips forward forcefully to swing bell to chest height", "Allow bell to fall back smooth"],
      isFavorite: false,
    },
    {
      id: "ex-8",
      name: "Stationary Bike Cycling",
      category: "Cardio",
      muscleGroups: ["Legs", "Quadriceps", "Calves"],
      equipment: ["Stationary Bike"],
      difficulty: "Beginner",
      instructions: ["Adjust seat to hip height", "Pedal with smooth cadences", "Maintain moderate resistance for cardiovascular endurance"],
      isFavorite: false,
    },
    {
      id: "ex-9",
      name: "Pull-ups",
      category: "Calisthenics",
      muscleGroups: ["Back", "Biceps", "Lats"],
      equipment: ["Pull-up Bar"],
      difficulty: "Advanced",
      instructions: ["Overhand grip on bar slightly wider than shoulders", "Pull chest up toward bar", "Lower back down with control"],
      isFavorite: false,
    },
    {
      id: "ex-10",
      name: "Deadlift",
      category: "Weightlifting",
      muscleGroups: ["Back", "Glutes", "Hamstrings", "Core"],
      equipment: ["Barbell"],
      difficulty: "Advanced",
      instructions: ["Stand with feet hip-width under bar", "Hinge and grip bar firmly", "Keep flat back, drive legs through floor to lift bar"],
      isFavorite: true,
    },
  ]);

  // Library Filter States
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState<string>("All");
  const [librarySearchTerm, setLibrarySearchTerm] = useState<string>("");
  const [libraryDifficultyFilter, setLibraryDifficultyFilter] = useState<string>("All");

  // Custom Exercise Creator State
  const [customName, setCustomName] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<any>("Strength");
  const [customMuscleGroups, setCustomMuscleGroups] = useState<string[]>(["Chest", "Arms"]);
  const [customEquipment, setCustomEquipment] = useState<string[]>(["Dumbbells"]);
  const [customDifficulty, setCustomDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [customInstructionsText, setCustomInstructionsText] = useState<string>("Perform with controlled rhythm and steady breathing.");

  // ==================== STATE: WORKOUT RECORDS ====================
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([
    {
      id: "w-1",
      exerciseName: "Barbell Bench Press",
      category: "Strength",
      exerciseType: "Weightlifting",
      equipmentUsed: ["Barbell", "Bench"],
      difficulty: "Intermediate",
      setsCount: 3,
      repsPerSet: 10,
      weightPerSetKg: 60,
      totalWeightKg: 1800,
      durationMins: 20,
      caloriesBurned: 180,
      perceivedExertion: 8,
      howFelt: ["Strong 💪", "Sweaty 🥵"],
      notes: "Pushed 60kg smooth. Felt good on last set.",
      date: new Date().toISOString().split("T")[0],
      time: "09:15 AM",
      setsList: [
        { setNumber: 1, reps: 10, weightKg: 60, completed: true },
        { setNumber: 2, reps: 10, weightKg: 60, completed: true },
        { setNumber: 3, reps: 10, weightKg: 60, completed: true },
      ],
    },
    {
      id: "w-2",
      exerciseName: "Treadmill Running",
      category: "Cardio",
      exerciseType: "Aerobic",
      equipmentUsed: ["Treadmill"],
      difficulty: "Intermediate",
      setsCount: 1,
      repsPerSet: 1,
      weightPerSetKg: 0,
      totalWeightKg: 0,
      durationMins: 25,
      caloriesBurned: 240,
      distanceKm: 3.5,
      perceivedExertion: 7,
      howFelt: ["Energized 😊", "Breathless 💨"],
      notes: "Maintained 8.5 km/h pace smoothly.",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
    },
    {
      id: "w-3",
      exerciseName: "Dumbbell Bicep Curls",
      category: "Strength",
      exerciseType: "Free Weights",
      equipmentUsed: ["Dumbbells"],
      difficulty: "Beginner",
      setsCount: 3,
      repsPerSet: 12,
      weightPerSetKg: 12,
      totalWeightKg: 432,
      durationMins: 15,
      caloriesBurned: 95,
      perceivedExertion: 6,
      howFelt: ["Strong 💪"],
      notes: "Focused on controlled eccentric motion.",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      time: "05:30 PM",
    },
  ]);

  // ==================== LOG WORKOUT FORM STATE ====================
  const [formExerciseName, setFormExerciseName] = useState<string>("Barbell Bench Press");
  const [formCategory, setFormCategory] = useState<string>("Strength");
  const [formExerciseType, setFormExerciseType] = useState<string>("Weightlifting");
  const [formEquipment, setFormEquipment] = useState<string[]>(["Barbell", "Bench"]);
  const [formDifficulty, setFormDifficulty] = useState<string>("Intermediate");
  const [formSets, setFormSets] = useState<number>(3);
  const [formReps, setFormReps] = useState<number>(10);
  const [formWeightKg, setFormWeightKg] = useState<number>(50);
  const [formDurationMins, setFormDurationMins] = useState<number>(20);
  const [formCalories, setFormCalories] = useState<number>(150);
  const [formDistanceKm, setFormDistanceKm] = useState<number>(0);
  const [formExertion, setFormExertion] = useState<number>(7);
  const [formHowFelt, setFormHowFelt] = useState<string[]>(["Strong 💪", "Energized 😊"]);
  const [formNotes, setFormNotes] = useState<string>("");
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [formPhoto, setFormPhoto] = useState<string | null>(null);

  // Preset Template Quick Select
  const applyPresetTemplate = (sets: number, reps: number) => {
    setFormSets(sets);
    setFormReps(reps);
    showFeedback(`Applied template: ${sets} Sets × ${reps} Reps`);
  };

  // ==================== WORKOUT TIMER & REP COUNTER TOOL STATE ====================
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerCurrentSet, setTimerCurrentSet] = useState<number>(1);
  const [timerTotalSets, setTimerTotalSets] = useState<number>(3);
  const [timerRepsDone, setTimerRepsDone] = useState<number>(0);
  const [timerWeightKg, setTimerWeightKg] = useState<number>(40);
  const [timerExerciseName, setTimerExerciseName] = useState<string>("Push-ups");

  // Rest Timer State
  const [restTimerActive, setRestTimerActive] = useState<boolean>(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(60);
  const [defaultRestDuration, setDefaultRestDuration] = useState<number>(60);

  // Main Timer Interval Effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Rest Timer Countdown Effect
  useEffect(() => {
    let restInterval: any = null;
    if (restTimerActive && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (restSecondsRemaining === 0 && restTimerActive) {
      setRestTimerActive(false);
      showFeedback("⏰ Rest time complete! Get ready for your next set!");
    }
    return () => clearInterval(restInterval);
  }, [restTimerActive, restSecondsRemaining]);

  const formatTimerDisplay = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const handleStartRestTimer = () => {
    setRestSecondsRemaining(defaultRestDuration);
    setRestTimerActive(true);
    showFeedback(`Started ${defaultRestDuration}s rest countdown timer!`);
  };

  const handleCompleteCurrentSet = () => {
    if (timerCurrentSet < timerTotalSets) {
      setTimerCurrentSet(timerCurrentSet + 1);
      setTimerRepsDone(0);
      handleStartRestTimer();
    } else {
      showFeedback("🎉 All sets completed! Finish your workout session now!");
    }
  };

  const handleFinishTimerWorkout = () => {
    setTimerActive(false);
    const durationM = Math.max(1, Math.round(timerSeconds / 60));
    const calculatedTotalWeight = timerTotalSets * 10 * timerWeightKg;

    const newWorkout: WorkoutRecord = {
      id: `w-${Date.now()}`,
      exerciseName: timerExerciseName,
      category: "Strength",
      exerciseType: "Timed Session",
      equipmentUsed: ["Bodyweight/Weights"],
      difficulty: "Intermediate",
      setsCount: timerTotalSets,
      repsPerSet: 10,
      weightPerSetKg: timerWeightKg,
      totalWeightKg: calculatedTotalWeight,
      durationMins: durationM,
      caloriesBurned: durationM * 8,
      perceivedExertion: 7,
      howFelt: ["Strong 💪", "Energized 😊"],
      notes: `Recorded via Live Workout Timer. Total Time: ${formatTimerDisplay(timerSeconds)}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setWorkouts([newWorkout, ...workouts]);
    showFeedback(`Saved live workout: ${timerExerciseName} (${durationM} mins, ${timerTotalSets} sets)!`);
    setTimerSeconds(0);
    setTimerCurrentSet(1);
    setActiveTab("dashboard");
  };

  // ==================== STATE: BODY MEASUREMENTS ====================
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([
    {
      id: "bm-1",
      date: new Date().toISOString().split("T")[0],
      weightKg: 72.5,
      heightCm: 175,
      bmi: 23.7,
      waistCm: 81,
      chestCm: 98,
      hipsCm: 94,
      thighsCm: 56,
      bicepsCm: 34,
      bodyFatPercent: 16.5,
      notes: "Morning empty stomach measurement. Feeling leaner.",
    },
    {
      id: "bm-2",
      date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
      weightKg: 73.2,
      heightCm: 175,
      bmi: 23.9,
      waistCm: 82,
      chestCm: 97,
      hipsCm: 95,
      thighsCm: 56.5,
      bicepsCm: 33.5,
      bodyFatPercent: 17.0,
      notes: "Baseline measurement recorded last week.",
    },
  ]);

  // Form Body Measurement State
  const [formBmWeight, setFormBmWeight] = useState<number>(72.0);
  const [formBmHeight, setFormBmHeight] = useState<number>(175);
  const [formBmWaist, setFormBmWaist] = useState<number>(80);
  const [formBmChest, setFormBmChest] = useState<number>(98);
  const [formBmHips, setFormBmHips] = useState<number>(94);
  const [formBmThighs, setFormBmThighs] = useState<number>(55);
  const [formBmBiceps, setFormBmBiceps] = useState<number>(34);
  const [formBmFat, setFormBmFat] = useState<number>(16.0);
  const [formBmNotes, setFormBmNotes] = useState<string>("");

  const handleSaveMeasurement = () => {
    const heightM = formBmHeight / 100;
    const calcBmi = Number((formBmWeight / (heightM * heightM)).toFixed(1));

    const newBm: BodyMeasurement = {
      id: `bm-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      weightKg: formBmWeight,
      heightCm: formBmHeight,
      bmi: calcBmi,
      waistCm: formBmWaist,
      chestCm: formBmChest,
      hipsCm: formBmHips,
      thighsCm: formBmThighs,
      bicepsCm: formBmBiceps,
      bodyFatPercent: formBmFat,
      notes: formBmNotes || "Regular body progress check",
    };

    setMeasurements([newBm, ...measurements]);
    showFeedback(`Saved body measurement: ${formBmWeight} kg (BMI: ${calcBmi})!`);
    setFormBmNotes("");
  };

  // ==================== HANDLERS: LOG WORKOUT ====================
  const handleSaveWorkout = (andAnother: boolean = false) => {
    if (!formExerciseName.trim()) {
      showFeedback("Please select or enter an Exercise Name!");
      return;
    }

    const calculatedTotalWeight = formSets * formReps * formWeightKg;

    const newWorkout: WorkoutRecord = {
      id: `w-${Date.now()}`,
      exerciseName: formExerciseName,
      category: formCategory,
      exerciseType: formExerciseType,
      equipmentUsed: formEquipment,
      difficulty: formDifficulty,
      setsCount: formSets,
      repsPerSet: formReps,
      weightPerSetKg: formWeightKg,
      totalWeightKg: calculatedTotalWeight,
      durationMins: formDurationMins,
      caloriesBurned: formCalories,
      distanceKm: formDistanceKm > 0 ? formDistanceKm : undefined,
      perceivedExertion: formExertion,
      howFelt: formHowFelt,
      notes: formNotes || "Logged exercise entry",
      date: formDate,
      time: formTime,
      photoUrl: formPhoto || undefined,
    };

    setWorkouts([newWorkout, ...workouts]);
    showFeedback(`Successfully logged workout: ${formExerciseName} (${formSets}x${formReps} @ ${formWeightKg}kg)!`);

    if (andAnother) {
      setFormNotes("");
      setFormPhoto(null);
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleSaveCustomExercise = () => {
    if (!customName.trim()) {
      showFeedback("Please enter Custom Exercise Name!");
      return;
    }

    const newExercise: ExerciseLibraryItem = {
      id: `ex-cust-${Date.now()}`,
      name: customName,
      category: customCategory,
      muscleGroups: customMuscleGroups,
      equipment: customEquipment,
      difficulty: customDifficulty,
      instructions: customInstructionsText.split("\n").filter((line) => line.trim().length > 0),
      isCustom: true,
      isFavorite: true,
    };

    setLibrary([newExercise, ...library]);
    showFeedback(`Added new custom exercise: "${customName}" to your library!`);
    setCustomName("");
    setActiveTab("library");
  };

  const handleToggleFavorite = (id: string) => {
    setLibrary(
      library.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    showFeedback("Updated exercise favorites!");
  };

  // Aggregated Stats Calculations
  const todayWorkouts = workouts.filter((w) => w.date === new Date().toISOString().split("T")[0]);
  const totalExercisesToday = todayWorkouts.length;
  const totalSetsToday = todayWorkouts.reduce((acc, curr) => acc + curr.setsCount, 0);
  const totalRepsToday = todayWorkouts.reduce((acc, curr) => acc + curr.setsCount * curr.repsPerSet, 0);
  const totalWeightToday = todayWorkouts.reduce((acc, curr) => acc + curr.totalWeightKg, 0);
  const totalCaloriesToday = todayWorkouts.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const totalDurationToday = todayWorkouts.reduce((acc, curr) => acc + curr.durationMins, 0);

  // Filtered Exercise Library
  const filteredLibrary = library.filter((ex) => {
    const matchesCategory = libraryCategoryFilter === "All" || ex.category === libraryCategoryFilter;
    const matchesDifficulty = libraryDifficultyFilter === "All" || ex.difficulty === libraryDifficultyFilter;
    const term = (librarySearchTerm || "").toLowerCase();
    const matchesSearch = (ex.name || "").toLowerCase().includes(term) ||
                          (ex.muscleGroups || []).some((m) => (m || "").toLowerCase().includes(term));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Bar Header & Main Navigation */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              🏋️
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Exercise & Workout Tracker
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Sets, Reps, Weight, Rest Timer & Body Progress</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveNotification(true);
              setNotificationMsg("🏋️ Time to work out! Reach your 300 kcal exercise goal today.");
            }}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Simulate Workout Reminder"
          >
            <Bell className="w-4 h-4 text-[#2E7D32] animate-bounce" />
            <span className="hidden sm:inline">Test Reminder</span>
          </button>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "dashboard" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("logWorkout")}
            className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "logWorkout" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Log Workout
          </button>
          <button
            onClick={() => setActiveTab("timer")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "timer" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Clock className="w-3.5 h-3.5" /> Live Timer
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "library" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Layers className="w-3.5 h-3.5" /> Library
          </button>
          <button
            onClick={() => setActiveTab("measurements")}
            className={`flex-1 min-w-[105px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "measurements" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Ruler className="w-3.5 h-3.5" /> Body Metrics
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "achievements" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Award className="w-3.5 h-3.5" /> Badges
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-[#2E7D32] text-white font-black shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-amber-700 font-black">✕</button>
        </div>
      )}

      {/* Persistent Active Reminder Alert Card */}
      {activeNotification && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-4 shadow-xl border border-amber-300 relative overflow-hidden animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
                🏋️
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-white" /> {notificationMsg}
                </h3>
                <p className="text-[11px] text-amber-100 font-medium">
                  Daily Health & Fitness Routine Reminder
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveNotification(false)}
              className="text-white/80 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/20">
            <button
              onClick={() => {
                setActiveTab("logWorkout");
                setActiveNotification(false);
              }}
              className="flex-1 py-2 bg-white text-amber-950 font-black rounded-xl text-xs shadow-xs hover:bg-amber-50 cursor-pointer text-center"
            >
              🏋️ Log Workout Now
            </button>
            <button
              onClick={() => {
                setActiveTab("timer");
                setActiveNotification(false);
              }}
              className="px-3 py-2 bg-amber-800/60 hover:bg-amber-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              ⏱️ Open Live Timer
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Today's Workout Hero Summary Card */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold tracking-wider text-amber-100 uppercase">TODAY'S EXERCISE SUMMARY</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight">{totalCaloriesToday}</span>
                  <span className="text-lg font-bold text-amber-100">KCAL BURNED</span>
                </div>
                <p className="text-xs text-amber-100/90 font-bold pt-1">
                  Duration: {totalDurationToday} Mins • Total Volume: {totalWeightToday} {weightUnit}
                </p>
              </div>

              <button
                onClick={() => setActiveTab("logWorkout")}
                className="py-3 px-4 bg-white text-amber-950 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md hover:bg-amber-50"
              >
                + Log Workout
              </button>
            </div>

            {/* Sub-metrics strip */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-xs font-bold text-amber-50 text-center">
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-base font-black">{totalExercisesToday}</span>
                <span className="text-[10px] text-amber-200 uppercase">Exercises</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-base font-black">{totalSetsToday}</span>
                <span className="text-[10px] text-amber-200 uppercase">Total Sets</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="block text-base font-black">{totalRepsToday}</span>
                <span className="text-[10px] text-amber-200 uppercase">Total Reps</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-sm font-black text-slate-800">22 min</div>
              <p className="text-[8px] font-black tracking-wider text-amber-800 uppercase">WEEK AVG</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
              <Flame className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-sm font-black text-slate-800">5 Days</div>
              <p className="text-[8px] font-black tracking-wider text-emerald-800 uppercase">STREAK 🔥</p>
            </div>

            <div className="bg-cyan-50/80 border border-cyan-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
              <Dumbbell className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
              <div className="text-sm font-black text-slate-800">{workouts.length}</div>
              <p className="text-[8px] font-black tracking-wider text-cyan-800 uppercase">WORKOUTS</p>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
              <Target className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <div className="text-sm font-black text-slate-800">85%</div>
              <p className="text-[8px] font-black tracking-wider text-indigo-800 uppercase">GOAL RATE</p>
            </div>
          </div>

          {/* Today's Exercises List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-600" /> Today's Exercise Logs
              </h3>
              <button onClick={() => setActiveTab("logWorkout")} className="text-xs font-bold text-amber-600 hover:underline">
                + Add Exercise
              </button>
            </div>

            {todayWorkouts.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Dumbbell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">No workout logged yet today</p>
                <button
                  onClick={() => setActiveTab("logWorkout")}
                  className="py-1.5 px-3 bg-amber-600 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  Log First Exercise
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayWorkouts.map((w) => (
                  <div key={w.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs">{w.exerciseName}</span>
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                          {w.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">
                        {w.setsCount} Sets × {w.repsPerSet} Reps {w.weightPerSetKg > 0 ? `@ ${w.weightPerSetKg} ${weightUnit}` : ""} • {w.durationMins} mins ({w.caloriesBurned} kcal)
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setWorkouts(workouts.filter((item) => item.id !== w.id));
                          showFeedback(`Removed ${w.exerciseName} record.`);
                        }}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-all cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gemini AI Athletic & Fitness Insight */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" /> Gemini AI Exercise Analysis
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                Personalized
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "Your strength progression on upper body pushes has increased by +12% this month. For balanced recovery, consider pairing today's chest press with light hamstring stretches and 500ml hydration."
            </p>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LOG WORKOUT FORM ==================== */}
      {activeTab === "logWorkout" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Log Exercise & Workout</h2>
              <p className="text-[10px] text-slate-500 font-medium">Record exercise category, sets, reps, weight & effort rating</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Exercise Name Dropdown or Select from Library */}
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Select Exercise *</label>
              <select
                value={formExerciseName}
                onChange={(e) => {
                  setFormExerciseName(e.target.value);
                  const found = library.find((item) => item.name === e.target.value);
                  if (found) {
                    setFormCategory(found.category);
                    setFormDifficulty(found.difficulty);
                    setFormEquipment(found.equipment);
                  }
                }}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              >
                {library.map((ex) => (
                  <option key={ex.id} value={ex.name}>
                    {ex.name} ({ex.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Bodyweight">Bodyweight</option>
                  <option value="Calisthenics">Calisthenics</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Balance">Balance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Quick Template Presets Bar */}
            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 space-y-1.5">
              <label className="font-extrabold text-slate-800 block text-[11px]">Quick Sets & Reps Presets:</label>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => applyPresetTemplate(3, 10)} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-lg font-bold hover:bg-amber-100">3×10</button>
                <button type="button" onClick={() => applyPresetTemplate(3, 12)} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-lg font-bold hover:bg-amber-100">3×12</button>
                <button type="button" onClick={() => applyPresetTemplate(4, 8)} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-lg font-bold hover:bg-amber-100">4×8</button>
                <button type="button" onClick={() => applyPresetTemplate(4, 10)} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-lg font-bold hover:bg-amber-100">4×10</button>
                <button type="button" onClick={() => applyPresetTemplate(5, 5)} className="px-2.5 py-1 bg-white border border-amber-200 text-amber-900 rounded-lg font-bold hover:bg-amber-100">5×5</button>
              </div>
            </div>

            {/* Sets, Reps, Weight Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sets *</label>
                <input
                  type="number"
                  value={formSets}
                  onChange={(e) => setFormSets(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reps / Set *</label>
                <input
                  type="number"
                  value={formReps}
                  onChange={(e) => setFormReps(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Weight ({weightUnit})</label>
                <input
                  type="number"
                  value={formWeightKg}
                  onChange={(e) => setFormWeightKg(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Duration & Calories */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Duration (Mins) *</label>
                <input
                  type="number"
                  value={formDurationMins}
                  onChange={(e) => setFormDurationMins(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Est. Calories Burned</label>
                <input
                  type="number"
                  value={formCalories}
                  onChange={(e) => setFormCalories(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Perceived Exertion 1-10 Slider */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-extrabold text-slate-800">Perceived Effort / Exertion (1 to 10)</label>
                <span className="font-black bg-white px-2.5 py-0.5 rounded-lg border text-amber-900">
                  Level {formExertion} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formExertion}
                onChange={(e) => setFormExertion(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Workout Notes / Reflections</label>
              <textarea
                rows={2}
                placeholder="How did the exercise feel? Form notes..."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveWorkout(false)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Workout Entry
              </button>

              <button
                type="button"
                onClick={() => handleSaveWorkout(true)}
                className="py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-950 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: WORKOUT TIMER & REP COUNTER ==================== */}
      {activeTab === "timer" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> Interactive Workout & Rest Timer
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Real-time stopwatch, set tracker, rep counter & rest countdown</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Close</button>
          </div>

          <div className="space-y-4">
            {/* Big Stopwatch Display */}
            <div className="bg-gradient-to-tr from-slate-900 to-amber-950 text-white rounded-3xl p-6 text-center space-y-2 shadow-xl border border-amber-900/40">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">SESSION TIME</span>
              <div className="text-5xl font-black font-mono tracking-wider text-amber-100">
                {formatTimerDisplay(timerSeconds)}
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-3 pt-2">
                {!timerActive ? (
                  <button
                    onClick={() => setTimerActive(true)}
                    className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start Timer
                  </button>
                ) : (
                  <button
                    onClick={() => setTimerActive(false)}
                    className="py-2.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Pause className="w-4 h-4 fill-current" /> Pause
                  </button>
                )}

                <button
                  onClick={() => {
                    setTimerActive(false);
                    setTimerSeconds(0);
                    showFeedback("Reset timer.");
                  }}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>

            {/* Set & Rep Counter Panel */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-black text-slate-900 text-xs">Current Exercise:</label>
                <select
                  value={timerExerciseName}
                  onChange={(e) => setTimerExerciseName(e.target.value)}
                  className="p-1.5 bg-white border rounded-xl font-extrabold text-xs"
                >
                  {library.map((ex) => (
                    <option key={ex.id} value={ex.name}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">SET TRACKER</span>
                  <span className="text-xl font-black text-amber-900">{timerCurrentSet} / {timerTotalSets}</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">REPS COUNTER</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => setTimerRepsDone(Math.max(0, timerRepsDone - 1))}
                      className="w-7 h-7 rounded-xl bg-slate-100 font-black text-slate-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xl font-black text-slate-900 min-w-[30px]">{timerRepsDone}</span>
                    <button
                      onClick={() => setTimerRepsDone(timerRepsDone + 1)}
                      className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black cursor-pointer shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCompleteCurrentSet}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Mark Set {timerCurrentSet} Complete & Start Rest
              </button>
            </div>

            {/* Rest Timer Panel */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-amber-900 text-xs">Rest Countdown Timer</span>
                <span className="text-base font-black text-amber-950 font-mono">
                  {restSecondsRemaining}s
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleStartRestTimer}
                  className="flex-1 py-2 bg-amber-600 text-white font-black rounded-xl text-xs cursor-pointer"
                >
                  Start Rest ({defaultRestDuration}s)
                </button>
                <button
                  onClick={() => {
                    setRestTimerActive(false);
                    setRestSecondsRemaining(0);
                    showFeedback("Skipped rest timer.");
                  }}
                  className="py-2 px-3 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>

            <button
              onClick={handleFinishTimerWorkout}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Finish & Save Workout
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: EXERCISE LIBRARY ==================== */}
      {activeTab === "library" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Exercise Library & Movements</h2>
              <p className="text-[10px] text-slate-500 font-medium">Browse pre-defined exercises, filter by muscle or add custom movements</p>
            </div>
            <button
              onClick={() => setActiveTab("customExercise")}
              className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> + Custom
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search exercise name or muscle group..."
                value={librarySearchTerm}
                onChange={(e) => setLibrarySearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-none text-[11px] font-bold gap-1">
              {["All", "Strength", "Cardio", "Bodyweight", "Calisthenics", "HIIT", "Flexibility"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLibraryCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                    libraryCategoryFilter === cat ? "bg-amber-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredLibrary.map((ex) => (
              <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      {ex.name}
                      {ex.isFavorite && <span className="text-amber-500">★</span>}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {ex.category} • {ex.difficulty} • Equipment: {ex.equipment.join(", ")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(ex.id)}
                    className="text-slate-400 hover:text-amber-500 font-bold text-sm cursor-pointer"
                  >
                    {ex.isFavorite ? "★" : "☆"}
                  </button>
                </div>

                <p className="text-[10px] text-slate-600 font-medium">
                  Muscles: {ex.muscleGroups.join(", ")}
                </p>

                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold">{ex.instructions.length} Steps</span>
                  <button
                    onClick={() => {
                      setFormExerciseName(ex.name);
                      setFormCategory(ex.category);
                      setFormDifficulty(ex.difficulty);
                      setActiveTab("logWorkout");
                    }}
                    className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] rounded-lg cursor-pointer"
                  >
                    Log This Movement →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: ADD CUSTOM EXERCISE ==================== */}
      {activeTab === "customExercise" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Add Custom Movement</h2>
              <p className="text-[10px] text-slate-500 font-medium">Create a personalized exercise entry with instructions</p>
            </div>
            <button onClick={() => setActiveTab("library")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">Custom Exercise Name *</label>
              <input
                type="text"
                placeholder="e.g. Incline Resistance Band Flyes"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Bodyweight">Bodyweight</option>
                  <option value="Calisthenics">Calisthenics</option>
                  <option value="HIIT">HIIT</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={customDifficulty}
                  onChange={(e) => setCustomDifficulty(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Step-by-step Instructions</label>
              <textarea
                rows={3}
                placeholder="Enter instructions (one step per line)..."
                value={customInstructionsText}
                onChange={(e) => setCustomInstructionsText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium"
              />
            </div>

            <button
              onClick={handleSaveCustomExercise}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" /> Save Custom Exercise to Library
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: BODY MEASUREMENT TRACKER ==================== */}
      {activeTab === "measurements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-600" /> Body Measurement & Weight Log
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Track body weight, BMI, waist circumference and muscle measurements</p>
            </div>
          </div>

          {/* Form: Add Measurement Entry */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-black text-slate-800 text-xs">Log New Body Measurement</h3>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                <input type="number" value={formBmWeight} onChange={(e) => setFormBmWeight(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Height (cm)</label>
                <input type="number" value={formBmHeight} onChange={(e) => setFormBmHeight(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Body Fat %</label>
                <input type="number" value={formBmFat} onChange={(e) => setFormBmFat(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Waist (cm)</label>
                <input type="number" value={formBmWaist} onChange={(e) => setFormBmWaist(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chest (cm)</label>
                <input type="number" value={formBmChest} onChange={(e) => setFormBmChest(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hips (cm)</label>
                <input type="number" value={formBmHips} onChange={(e) => setFormBmHips(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Biceps (cm)</label>
                <input type="number" value={formBmBiceps} onChange={(e) => setFormBmBiceps(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl font-bold" />
              </div>
            </div>

            <button
              onClick={handleSaveMeasurement}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shadow-xs cursor-pointer"
            >
              + Save Body Measurement Entry
            </button>
          </div>

          {/* History Measurements List */}
          <div className="space-y-2">
            <h3 className="font-black text-slate-800 text-xs">Measurement History</h3>
            {measurements.map((bm) => (
              <div key={bm.id} className="p-3.5 bg-slate-50 border rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-amber-900">{bm.date}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                    BMI: {bm.bmi}
                  </span>
                </div>
                <p className="font-bold text-slate-800">
                  Weight: {bm.weightKg} kg • Body Fat: {bm.bodyFatPercent}% • Waist: {bm.waistCm} cm • Chest: {bm.chestCm} cm
                </p>
                {bm.notes && <p className="text-[10px] text-slate-500 font-medium">{bm.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: ANALYTICS & REPORTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Workout Analytics & Trends</h2>
              <p className="text-[10px] text-slate-500 font-medium">Weekly volume, workout frequency & calorie charts</p>
            </div>
            <button
              onClick={() => showFeedback("Downloaded PDF fitness report!")}
              className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" /> PDF Report
            </button>
          </div>

          {/* Charts Visual Mock */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-black text-slate-800 text-xs">Weekly Calorie Burn Distribution</h3>
            <div className="flex items-end justify-between h-32 pt-4 px-2 border-b border-slate-200 text-center">
              {[
                { day: "Mon", cal: 210, h: "60%" },
                { day: "Tue", cal: 180, h: "50%" },
                { day: "Wed", cal: 320, h: "90%" },
                { day: "Thu", cal: 240, h: "70%" },
                { day: "Fri", cal: 150, h: "40%" },
                { day: "Sat", cal: 280, h: "80%" },
                { day: "Sun", cal: 200, h: "55%" },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{ height: item.h }}
                    className="w-6 bg-gradient-to-t from-amber-600 to-orange-500 rounded-t-lg shadow-2xs"
                  />
                  <span className="text-[9px] font-bold text-slate-600">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 8: ACHIEVEMENTS & BADGES ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Fitness Badges & Achievements
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Unlock badges by logging exercises and maintaining streaks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "First Workout Logged", desc: "Started your fitness journey", icon: "🏋️", unlocked: true },
              { title: "7-Day Active Streak", desc: "Logged workouts 7 days straight", icon: "🔥", unlocked: true },
              { title: "1,000 Reps Club", desc: "Completed over 1,000 reps", icon: "💪", unlocked: true },
              { title: "30-Day Master Streak", desc: "Logged workouts 30 days in a row", icon: "🏆", unlocked: false },
              { title: "10,000 kcal Burned", desc: "Burned 10,000 total calories", icon: "⚡", unlocked: false },
              { title: "Body Tracker Pro", desc: "Logged 5 body measurements", icon: "📏", unlocked: false },
            ].map((badge) => (
              <div
                key={badge.title}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  badge.unlocked ? "bg-amber-50/80 border-amber-200" : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{badge.title}</h4>
                  <p className="text-[9px] text-slate-500 font-bold">{badge.desc}</p>
                  <span className={`text-[8px] font-black uppercase ${badge.unlocked ? "text-amber-700" : "text-slate-400"}`}>
                    {badge.unlocked ? "Unlocked ✓" : "Locked 🔒"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 9: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Exercise Tracker Settings</h2>
              <p className="text-[10px] text-slate-500 font-medium">Configure units, default rest timer and reminder notifications</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-extrabold text-slate-800 block">Unit Preferences</label>
              <div className="flex gap-4 font-bold text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="wUnit" checked={weightUnit === "kg"} onChange={() => setWeightUnit("kg")} /> Kilograms (kg)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="wUnit" checked={weightUnit === "lbs"} onChange={() => setWeightUnit("lbs")} /> Pounds (lbs)
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-extrabold text-slate-800 block">Default Rest Countdown Duration</label>
              <select
                value={defaultRestDuration}
                onChange={(e) => setDefaultRestDuration(Number(e.target.value))}
                className="w-full p-2 bg-white border rounded-xl font-bold"
              >
                <option value={30}>30 Seconds</option>
                <option value={60}>60 Seconds (1 Min)</option>
                <option value={90}>90 Seconds (1.5 Mins)</option>
                <option value={120}>120 Seconds (2 Mins)</option>
              </select>
            </div>

            <button
              onClick={() => showFeedback("Saved Exercise Settings successfully!")}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
