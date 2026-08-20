export type PetNavTab =
  | "dashboard"
  | "profile"
  | "health_records"
  | "reminders"
  | "nutrition"
  | "walk_tracker"
  | "bathroom_log"
  | "grooming"
  | "insights"
  | "notes_media"
  | "products"
  | "community"
  | "settings";

export interface PetProfile {
  id: string;
  name: string;
  gender: "Male" | "Female";
  breed: string;
  ageYears: number;
  ageMonths: number;
  dob: string;
  weight: number;
  weightUnit: string;
  color: string;
  microchipId: string;
  isSpayedNeutered: boolean;
  bloodGroup: string;
  allergies: string[];
  dietType: string;
  healthScore: number;
  healthStatus: "Excellent" | "Good" | "Needs Attention";
  avatarUrl?: string;
  primaryVet: string;
  vetClinic: string;
  vetPhone: string;
}

export interface PetOverviewMetrics {
  walkMinutes: number;
  foodMealsDone: number;
  foodMealsTotal: number;
  waterTimesDone: number;
  waterTimesTotal: number;
  bathroomTimes: number;
}

export interface PetHealthRecordItem {
  id: string;
  title: string;
  category: "Vaccinations" | "Checkups" | "Tests";
  date: string;
  dueDateStr: string;
  isUpcoming: boolean;
  statusText?: string;
  photoProofUrl?: string;
  notes?: string;
  doctorName?: string;
}

export interface PetReminderItem {
  id: string;
  title: string;
  scheduleText: string;
  dueInText: string;
  enabled: boolean;
  categoryIcon: string;
  category: string;
}

export interface PetMealItem {
  id: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;
  description: string;
  isCompleted: boolean;
  calories?: number;
}

export interface PetNutritionSummary {
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
  fiberPercent: number;
}

export interface PetWalkSession {
  id: string;
  dateStr: string;
  durationMinutes: number;
  durationSeconds: number;
  distanceKm: number;
  caloriesKcal: number;
  mood: "Very Bad" | "Bad" | "Okay" | "Good" | "Excellent";
  notes?: string;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
}

export interface PetBathroomEntry {
  id: string;
  dateStr: string;
  type: "Poop" | "Urine";
  time: string;
  status: "Normal" | "Soft" | "Hard" | "Diarrhea" | "Slight Yellow" | "Clear" | "Dark";
  notes?: string;
}

export interface PetGroomingTask {
  id: string;
  name: string;
  frequencyText: string;
  dueText: string;
  enabled: boolean;
  isDoneToday: boolean;
  icon: string;
}

export interface PetNoteMediaItem {
  id: string;
  category: "Vet Advice" | "Allergy Note" | "Behavior Note" | "General Note";
  title: string;
  content: string;
  dateStr: string;
  mediaType: "note" | "photo" | "video";
  mediaUrl?: string;
}

export interface PetProductItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  description: string;
  rating: number;
  price?: string;
  badge?: string;
}

export interface PetCommunityTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  memberCount: string;
  actionText: string;
  category: "moments" | "playmates" | "qa" | "events";
}
