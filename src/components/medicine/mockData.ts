import {
  MedicineItemModel,
  DoseLogModel,
  JournalEntryModel,
  DrugInteractionModel,
  DependentCareModel,
  MedicineSettingsModel
} from "./types";

export const INITIAL_MEDICINES: MedicineItemModel[] = [
  {
    id: "med-1",
    name: "Atorvastatin",
    brandName: "Lipitor",
    activeIngredient: "Atorvastatin Calcium",
    type: "Tablet",
    strength: "10mg",
    purpose: "For Cholesterol",
    prescribingDoctor: "Dr. Sandeep Shah",
    doctorPhone: "+977 9801234567",
    hospitalClinic: "Norvic International Hospital",
    scheduleType: "fixed",
    dosesPerDay: 1,
    doseTimes: ["08:00 PM"],
    takeWith: "Water",
    foodRelation: "Before Bed",
    instructions: "Take 1 tablet every night at bedtime.",
    totalPrescribed: 30,
    remainingStock: 30,
    lowStockThreshold: 7,
    refillReminderEnabled: true,
    prescriptionExpiryDate: "2026-10-15",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80",
    status: "Active",
    sideEffects: "Mild muscle soreness or headache",
    warnings: "Avoid consuming grapefruit juice while taking statins.",
    notes: "Cardiac protective regimen.",
    colorTag: "#FF5A36",
    createdAt: "2026-05-01"
  },
  {
    id: "med-2",
    name: "Levothyroxine",
    brandName: "Eltroxin",
    activeIngredient: "Levothyroxine Sodium",
    type: "Tablet",
    strength: "50mcg",
    purpose: "For Thyroid",
    prescribingDoctor: "Dr. Anita Patel",
    doctorPhone: "+977 9812345678",
    hospitalClinic: "Grande International Hospital",
    scheduleType: "meal_relative",
    dosesPerDay: 1,
    doseTimes: ["07:00 AM"],
    takeWith: "Water",
    foodRelation: "Empty Stomach",
    instructions: "Take first thing in the morning on empty stomach with plain water. Wait 30 mins before breakfast.",
    totalPrescribed: 30,
    remainingStock: 20,
    lowStockThreshold: 5,
    refillReminderEnabled: true,
    prescriptionExpiryDate: "2026-11-20",
    image: "https://images.unsplash.com/photo-1550572017-ed240b904996?w=300&auto=format&fit=crop&q=80",
    status: "Active",
    sideEffects: "Palpitations if overdosed",
    warnings: "Do not take with calcium or iron supplements at the same time.",
    notes: "Thyroid hormone replacement.",
    colorTag: "#3B82F6",
    createdAt: "2026-05-01"
  },
  {
    id: "med-3",
    name: "Amoxicillin",
    brandName: "Moxikind",
    activeIngredient: "Amoxicillin Trihydrate",
    type: "Capsule",
    strength: "500mg",
    purpose: "Antibiotic",
    prescribingDoctor: "Dr. Sandeep Shah",
    doctorPhone: "+977 9801234567",
    hospitalClinic: "Norvic International Hospital",
    scheduleType: "interval",
    dosesPerDay: 3,
    doseTimes: ["08:00 AM", "02:00 PM", "08:00 PM"],
    takeWith: "Water",
    foodRelation: "After Food",
    instructions: "Complete entire 7-day course. Take after food.",
    totalPrescribed: 30,
    remainingStock: 12,
    lowStockThreshold: 10,
    refillReminderEnabled: true,
    prescriptionExpiryDate: "2026-06-20",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80",
    status: "Active",
    sideEffects: "Mild stomach upset, nausea",
    warnings: "Complete full antibiotic course even if you feel better.",
    notes: "Bacterial infection treatment.",
    colorTag: "#10B981",
    createdAt: "2026-05-10"
  },
  {
    id: "med-4",
    name: "Vitamin D3 60K",
    brandName: "Calcirol",
    activeIngredient: "Cholecalciferol",
    type: "Capsule",
    strength: "60,000 IU",
    purpose: "Supplement",
    prescribingDoctor: "Dr. R. K. Gupta",
    doctorPhone: "+977 9845678901",
    hospitalClinic: "Mediciti Hospital",
    scheduleType: "alternating",
    dosesPerDay: 1,
    doseTimes: ["01:00 PM"],
    takeWith: "Milk",
    foodRelation: "With Food",
    instructions: "Take once weekly after Sunday lunch with milk.",
    totalPrescribed: 8,
    remainingStock: 4,
    lowStockThreshold: 5,
    refillReminderEnabled: true,
    prescriptionExpiryDate: "2026-09-30",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop&q=80",
    status: "Active",
    sideEffects: "None known at recommended dosage",
    warnings: "Weekly dosage only, do not take daily.",
    notes: "Bone density and immunity boost.",
    colorTag: "#F59E0B",
    createdAt: "2026-05-02"
  },
  {
    id: "med-5",
    name: "Paracetamol",
    brandName: "Crocin Advance",
    activeIngredient: "Acetaminophen",
    type: "Tablet",
    strength: "500mg",
    purpose: "Pain Relief",
    prescribingDoctor: "Dr. Sandeep Shah",
    doctorPhone: "+977 9801234567",
    hospitalClinic: "Norvic International Hospital",
    scheduleType: "prn",
    dosesPerDay: 1,
    doseTimes: ["As Needed"],
    takeWith: "Water",
    foodRelation: "After Food",
    instructions: "Take 1 tablet as needed for headache or fever. Max 3 tablets in 24 hours.",
    totalPrescribed: 20,
    remainingStock: 15,
    lowStockThreshold: 5,
    refillReminderEnabled: true,
    prescriptionExpiryDate: "2027-01-01",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&auto=format&fit=crop&q=80",
    status: "Active",
    sideEffects: "Rare; mild drowsiness",
    warnings: "Do not exceed 3000mg in 24 hours.",
    notes: "Emergency pain & fever relief.",
    colorTag: "#8B5CF6",
    createdAt: "2026-05-05"
  },
  {
    id: "med-6",
    name: "Metformin ER",
    brandName: "Glycomet SR",
    activeIngredient: "Metformin Hydrochloride",
    type: "Tablet",
    strength: "500mg",
    purpose: "Blood Sugar Control",
    prescribingDoctor: "Dr. Anita Patel",
    doctorPhone: "+977 9812345678",
    hospitalClinic: "Grande International Hospital",
    scheduleType: "fixed",
    dosesPerDay: 2,
    doseTimes: ["08:30 AM", "08:30 PM"],
    takeWith: "Water",
    foodRelation: "With Food",
    instructions: "Swallow whole with food. Do not crush.",
    totalPrescribed: 60,
    remainingStock: 8,
    lowStockThreshold: 10,
    refillReminderEnabled: true,
    prescriptionExpiryDate: "2026-08-30",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80",
    status: "Active",
    sideEffects: "Gastrointestinal discomfort initially",
    warnings: "Drink plenty of water.",
    notes: "Diabetes glycemic management.",
    colorTag: "#EC4899",
    createdAt: "2026-04-15"
  }
];

export const INITIAL_TODAY_DOSES: DoseLogModel[] = [
  {
    id: "dose-1",
    medicineId: "med-2",
    medicineName: "Levothyroxine 50mcg",
    dosage: "1 Tablet",
    type: "Tablet",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "07:00 AM",
    slot: "Morning",
    status: "Taken",
    takenAt: "07:05 AM",
    note: "Taken with 1 glass of lukewarm water."
  },
  {
    id: "dose-2",
    medicineId: "med-3",
    medicineName: "Amoxicillin 500mg",
    dosage: "1 Capsule",
    type: "Capsule",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "08:00 AM",
    slot: "Morning",
    status: "Taken",
    takenAt: "08:05 AM",
    photoProofUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "dose-3",
    medicineId: "med-3",
    medicineName: "Amoxicillin 500mg",
    dosage: "1 Capsule",
    type: "Capsule",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "02:00 PM",
    slot: "Afternoon",
    status: "Pending" // Due Now!
  },
  {
    id: "dose-4",
    medicineId: "med-3",
    medicineName: "Amoxicillin 500mg",
    dosage: "1 Capsule",
    type: "Capsule",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "08:00 PM",
    slot: "Evening",
    status: "Pending"
  },
  {
    id: "dose-5",
    medicineId: "med-1",
    medicineName: "Atorvastatin 10mg",
    dosage: "1 Tablet",
    type: "Tablet",
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "08:00 PM",
    slot: "Evening",
    status: "Pending"
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntryModel[] = [
  {
    id: "j-1",
    date: new Date().toISOString().split("T")[0],
    mood: "Good",
    energyLevel: 8,
    symptoms: ["Mild Nausea"],
    notes: "Feeling energetic today after morning walk. Slight stomach discomfort after Amoxicillin dose.",
    createdAt: new Date().toISOString()
  },
  {
    id: "j-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    mood: "Okay",
    energyLevel: 6,
    symptoms: ["Headache", "Drowsiness"],
    notes: "Work pressure caused headache, took rest at 4pm.",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "j-3",
    date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    mood: "Very Good",
    energyLevel: 9,
    symptoms: [],
    notes: "Perfect day! No adverse reactions.",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const INITIAL_DRUG_INTERACTIONS: DrugInteractionModel[] = [
  {
    id: "int-1",
    drugA: "Clarithromycin 500mg",
    drugB: "Atorvastatin 10mg",
    riskLevel: "High Risk",
    title: "High Risk: Clarithromycin + Atorvastatin",
    details: "Clarithromycin inhibits CYP3A4 metabolism of Atorvastatin, substantially increasing statin blood concentrations. This significantly increases the risk of severe myopathy, muscle breakdown (rhabdomyolysis), and acute kidney damage.",
    recommendation: "Please consult your prescribing doctor immediately before taking these medicines together. Usually Atorvastatin is temporarily withheld during macrolide antibiotic therapy."
  },
  {
    id: "int-2",
    drugA: "Metformin ER",
    drugB: "Alcohol / Contrast Dye",
    riskLevel: "Moderate Risk",
    title: "Moderate Risk: Metformin + Alcohol",
    details: "Excessive alcohol consumption while on Metformin can elevate the risk of lactic acidosis and cause unpredictable hypoglycemia.",
    recommendation: "Avoid heavy alcohol ingestion and notify your radiologist if undergoing contrast imaging."
  },
  {
    id: "int-3",
    drugA: "Levothyroxine",
    drugB: "Calcium D3 / Iron",
    riskLevel: "Moderate Risk",
    title: "Absorption Interference: Levothyroxine + Calcium",
    details: "Calcium carbonate and iron supplements bind to Levothyroxine in the gut, reducing thyroid hormone absorption by up to 40%.",
    recommendation: "Separate doses by at least 4 hours. Take Levothyroxine on waking up and Calcium after lunch."
  },
  {
    id: "int-4",
    drugA: "Paracetamol",
    drugB: "Amoxicillin",
    riskLevel: "Safe",
    title: "Safe Combination: Paracetamol + Amoxicillin",
    details: "No clinically significant pharmacokinetic interactions known. Safe to co-administer as directed.",
    recommendation: "Safe to take together. Follow meal guidelines."
  }
];

export const INITIAL_DEPENDENTS: DependentCareModel[] = [
  {
    id: "dep-1",
    name: "Maa",
    relation: "Mother (Age 64)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+977 9801122334",
    hasMissedAlert: true,
    missedMedName: "Levothyroxine 50mcg",
    missedTimeAgo: "2 hours ago",
    recentActivities: [
      {
        id: "act-1",
        medName: "Amoxicillin 500mg",
        dosage: "1 Capsule",
        action: "took",
        time: "Today, 08:05 AM",
        timestamp: "08:05 AM"
      },
      {
        id: "act-2",
        medName: "Levothyroxine 50mcg",
        dosage: "1 Tablet",
        action: "skipped",
        time: "Today, 02:10 PM",
        timestamp: "02:10 PM",
        isAlert: true,
        alertReason: "Skipped scheduled morning dose"
      }
    ]
  },
  {
    id: "dep-2",
    name: "Dad",
    relation: "Father (Age 68)",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    phone: "+977 9802233445",
    hasMissedAlert: false,
    recentActivities: [
      {
        id: "act-3",
        medName: "Atorvastatin 10mg",
        dosage: "1 Tablet",
        action: "took",
        time: "Yesterday, 09:00 PM",
        timestamp: "09:00 PM"
      },
      {
        id: "act-4",
        medName: "Metformin 500mg",
        dosage: "1 Tablet",
        action: "took",
        time: "Today, 08:30 AM",
        timestamp: "08:30 AM"
      }
    ]
  }
];

export const INITIAL_SETTINGS: MedicineSettingsModel = {
  reminderSound: "Gentle Chime",
  soundVolume: 85,
  vibration: true,
  criticalAlertsDnd: true,
  defaultSnoozeMinutes: 10,
  timeFormat24h: false,
  customVoiceEnabled: false,
  refillAlertsEnabled: true,
  themeStyle: "warm_coral"
};
