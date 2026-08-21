export type MedicineTab =
  | "overview"
  | "my_medicines"
  | "add_medicine"
  | "schedule_dosing"
  | "today_doses"
  | "dose_action"
  | "refill_inventory"
  | "medicine_journal"
  | "interactions_safety"
  | "adherence_history"
  | "caregiver_family"
  | "doctor_reports"
  | "settings";

export type MedicineFormType =
  | "Tablet"
  | "Capsule"
  | "Syrup"
  | "Injection"
  | "Drops"
  | "Inhaler"
  | "Ointment"
  | "Patch"
  | "Powder"
  | "Suppository";

export type ScheduleType =
  | "fixed"
  | "interval"
  | "meal_relative"
  | "prn"
  | "cycle"
  | "alternating";

export interface MedicineItemModel {
  id: string;
  name: string;
  brandName?: string;
  activeIngredient?: string;
  type: MedicineFormType;
  strength: string; // e.g., "500 mg", "10 mg", "60K IU"
  purpose?: string; // e.g., "For Cholesterol", "Antibiotic", "For Thyroid"
  prescribingDoctor?: string;
  doctorPhone?: string;
  hospitalClinic?: string;
  scheduleType: ScheduleType;
  dosesPerDay: number;
  doseTimes: string[]; // e.g. ["08:00 AM", "02:00 PM", "08:00 PM"]
  takeWith?: "Water" | "Milk" | "Juice" | "Any";
  foodRelation: "Before Food" | "With Food" | "After Food" | "Empty Stomach" | "Before Bed" | "Anytime";
  instructions?: string;
  totalPrescribed: number;
  remainingStock: number;
  lowStockThreshold: number;
  refillReminderEnabled: boolean;
  prescriptionExpiryDate?: string; // YYYY-MM-DD
  image?: string;
  status: "Active" | "Inactive" | "Expired";
  sideEffects?: string;
  warnings?: string;
  notes?: string;
  colorTag?: string;
  createdAt: string;
}

export type DoseStatus = "Taken" | "Snoozed" | "Skipped" | "MaybeLater" | "Pending";

export interface DoseLogModel {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  type: MedicineFormType;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // e.g. "08:00 AM"
  slot: "Morning" | "Afternoon" | "Evening" | "Night";
  status: DoseStatus;
  takenAt?: string; // e.g. "08:05 AM"
  reason?: string;
  note?: string;
  photoProofUrl?: string;
}

export interface JournalEntryModel {
  id: string;
  date: string; // YYYY-MM-DD
  mood: "Very Bad" | "Bad" | "Okay" | "Good" | "Very Good";
  energyLevel: number; // 1 - 10
  symptoms: string[];
  notes?: string;
  createdAt: string;
}

export interface DrugInteractionModel {
  id: string;
  drugA: string;
  drugB: string;
  riskLevel: "High Risk" | "Moderate Risk" | "Low Risk" | "Safe";
  title: string;
  details: string;
  recommendation: string;
}

export interface DependentActivityItem {
  id: string;
  medName: string;
  dosage: string;
  action: "took" | "skipped" | "missed";
  time: string;
  timestamp: string;
  isAlert?: boolean;
  alertReason?: string;
}

export interface DependentCareModel {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  phone: string;
  recentActivities: DependentActivityItem[];
  hasMissedAlert?: boolean;
  missedMedName?: string;
  missedTimeAgo?: string;
}

export interface MedicineSettingsModel {
  reminderSound: string;
  soundVolume: number;
  vibration: boolean;
  criticalAlertsDnd: boolean;
  defaultSnoozeMinutes: number;
  timeFormat24h: boolean;
  customVoiceEnabled: boolean;
  refillAlertsEnabled: boolean;
  themeStyle: "warm_coral" | "ocean_blue" | "emerald";
}
