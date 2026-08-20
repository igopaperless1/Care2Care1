export type ExerciseTab =
  | "dashboard"
  | "body_parts"
  | "exercises"
  | "details"
  | "builder"
  | "setup"
  | "in_progress"
  | "programs"
  | "plans"
  | "progress"
  | "measurements"
  | "insights";

export interface ExerciseItem {
  id: string;
  name: string;
  category: string;
  bodyPart: "Chest" | "Back" | "Shoulders" | "Arms" | "Legs" | "Abs" | "Glutes" | "Full Body";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string[];
  musclesWorked: string[];
  instructions: string[];
  sets: number;
  reps: number;
  weightKg?: number;
  restSeconds?: number;
  imageUrl?: string;
  isFavorite?: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  daysPerWeek: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  activeDays: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  targetMuscles: string[];
  exercises: ExerciseItem[];
  isCurrent?: boolean;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  durationWeeks: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  description: string;
  enrolledCount: number;
  rating: number;
  color: string;
}

export interface BodyStatMeasurement {
  id: string;
  label: string;
  currentValue: number;
  unit: string;
  change: number; // positive or negative
  trend: "up" | "down" | "neutral";
  date: string;
}

export interface ActiveWorkoutState {
  planName: string;
  currentExerciseIndex: number;
  currentSet: number;
  totalSets: number;
  isResting: boolean;
  restTimeRemaining: number;
  totalRestTime: number;
  elapsedSeconds: number;
  isPaused: boolean;
}
