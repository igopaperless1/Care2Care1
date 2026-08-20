export type MentalScreen =
  | "dashboard"
  | "mood"
  | "therapy"
  | "meditation"
  | "sleep"
  | "journal"
  | "journaling"
  | "assessments"
  | "goals"
  | "courses"
  | "community"
  | "reminders"
  | "insights"
  | "crisis"
  | "settings";

export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  moodIndex: number; // 0: Very Bad, 1: Bad, 2: Okay, 3: Good, 4: Excellent
  moodLabel: string;
  emoji: string;
  intensity: number; // 1-10
  note?: string;
  tags: string[];
}

export interface TherapistSession {
  id: string;
  therapistName: string;
  title: string;
  role: string;
  date: string;
  time: string;
  avatar: string;
  status: "upcoming" | "completed";
  notes?: string;
}

export interface MeditationItem {
  id: string;
  title: string;
  category: "For You" | "Sleep" | "Anxiety" | "Focus" | "Stress";
  duration: string;
  durationMinutes: number;
  completedPercent?: number;
  description: string;
  audioUrl?: string;
}

export interface AssessmentTest {
  id: string;
  title: string;
  code: string;
  questionCount: number;
  duration: string;
  lastTaken?: string;
  lastScore?: number;
  lastSeverity?: string;
  description: string;
}

export interface AssessmentResult {
  id: string;
  title: string;
  code: "PHQ-9" | "GAD-7" | "PSS-10" | "WHO-5";
  lastTaken: string;
  score: number;
  maxScore: number;
  severity: string;
  status: "Mild" | "Moderate" | "Severe" | "Good" | "Minimal";
  description: string;
}

export interface MentalGoal {
  id: string;
  title: string;
  targetDays: number;
  completedDays: number;
  streak: number;
  frequency?: string;
  category: string;
  isCompleted?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  tag: string;
  content: string;
  likes: number;
  comments: number;
  hasLiked?: boolean;
}

export interface JournalItem {
  id: string;
  title: string;
  date: string;
  time: string;
  prompt?: string;
  content: string;
  category: "Journal" | "Gratitude" | "Thoughts" | "CBT";
  moodTag?: string;
}

export interface CBTThoughtItem {
  id: string;
  date: string;
  situation: string;
  automaticThought: string;
  emotion?: string;
  beliefBefore?: number;
  cognitiveDistortion?: string;
  evidenceFor?: string;
  evidenceAgainst: string;
  alternativeThought: string;
  beliefAfter?: number;
  initialBelief?: number;
  newBelief?: number;
}
