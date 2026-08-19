import React, { useState } from "react";
import { VitalsTrendChart } from "./VitalsTrendChart";
import { HealthInsightsModule } from "./HealthInsightsModule";
import { FamilyInviteModal } from "./FamilyInviteModal";
import { VoiceAssistantModal } from "./VoiceAssistantModal";
import { generatePatientPDFReport } from "../lib/pdfReportGenerator";
import {
  Patient,
  VitalSign,
  FamilyMember,
  VehicleItem,
  FarmRecord,
  FinancialRecord,
  PetItem
} from "../types";
import {
  Users,
  User,
  Briefcase,
  TrendingUp,
  Droplets,
  Footprints,
  Pill,
  Moon,
  Car,
  Mic,
  UserPlus,
  TreePine,
  DollarSign,
  Dog,
  Plus,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Clock,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  Activity,
  Bell,
  Settings,
  Lock,
  Sparkles,
  Heart,
  Smile,
  Utensils,
  BookOpen,
  Flame,
  Check,
  Search,
  RefreshCw,
  Smartphone,
  Target,
  Award,
  Zap,
  ChevronDown,
  Layers,
  Upload,
  Download
} from "lucide-react";

interface CaregiverDashboardProps {
  patients: Patient[];
  familyMembers: FamilyMember[];
  vehicles: VehicleItem[];
  farmRecords: FarmRecord[];
  financialRecords: FinancialRecord[];
  pets: PetItem[];
  onAddFamilyMember: (member: FamilyMember) => void;
  onAddVehicle: (vehicle: VehicleItem) => void;
  onAddFarmRecord: (farm: FarmRecord) => void;
  onAddFinancialRecord: (fin: FinancialRecord) => void;
  onAddPet: (pet: PetItem) => void;
  onSelectPatient: (id: string) => void;
  onAddVitalSign: (patientId: string, vital: VitalSign) => void;
  onAddWater: (patientId: string, amountMl: number) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  patients,
  familyMembers,
  vehicles,
  farmRecords,
  financialRecords,
  pets,
  onAddFamilyMember,
  onAddVehicle,
  onAddFarmRecord,
  onAddFinancialRecord,
  onAddPet,
  onSelectPatient,
  onAddVitalSign,
  onAddWater,
}) => {
  // Service mode: Personal vs Professional
  const [serviceMode, setServiceMode] = useState<"personal" | "professional">("personal");

  // Selected Quick Action Chip Modal
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  // Expanded Main Service Module in Grid
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Active Service Modal for deep management
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Top Bar & Feature Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Floating Plus (+) Add Service Modal
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [addServiceSearch, setAddServiceSearch] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set(["water", "medicine", "yoga", "mood", "exercise", "finance", "pets", "vehicles", "family", "farm", "staff", "contracts"])
  );

  // Master Service Configuration State for Modals
  const [setupMode, setSetupMode] = useState<"manual" | "ai">("manual");
  const [serviceCategorySelect, setServiceCategorySelect] = useState<string>("Health & Care");
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");
  const [serviceTimings, setServiceTimings] = useState<string[]>(["08:00 AM", "01:00 PM", "08:00 PM"]);
  const [newTimingInput, setNewTimingInput] = useState<string>("");
  const [remindBefore, setRemindBefore] = useState<string>("15 mins before");
  const [ringtoneChoice, setRingtoneChoice] = useState<string>("Gentle Bell");
  const [customAudioFileName, setCustomAudioFileName] = useState<string>("");
  const [vibrationChoice, setVibrationChoice] = useState<string>("Gentle Pulse");
  const [alertMediaType, setAlertMediaType] = useState<string>("Text Banner + Sound");
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string | null>(null);
  const [proofVideoName, setProofVideoName] = useState<string | null>(null);
  const [proofAudioName, setProofAudioName] = useState<string | null>(null);
  const [locationStamp, setLocationStamp] = useState<string>("GPS: 37.7749° N, 122.4194° W");
  const [serviceNotes, setServiceNotes] = useState<string>("");
  const [extraFields, setExtraFields] = useState<Array<{ id: string; label: string; value: string }>>([]);

  // Form Modals for Data Models
  const [activeDataModal, setActiveDataModal] = useState<"family" | "vehicle" | "farm" | "finance" | "pet" | "vitals" | "activity" | null>(null);

  // Quick Action Input States
  const [quickWaterMl, setQuickWaterMl] = useState<number>(250);
  const [quickStepsCount, setQuickStepsCount] = useState<number>(1500);
  const [quickFoodCal, setQuickFoodCal] = useState<number>(450);
  const [quickMood, setQuickMood] = useState<string>("😃 Energetic");
  const [quickJournalNote, setQuickJournalNote] = useState<string>("");

  // Habit Builder State
  const [habitGoodList, setHabitGoodList] = useState([
    { id: "h1", title: "Morning Exercise", streak: 12, target: "30 mins", done: true },
    { id: "h2", title: "Read 15 Pages", streak: 5, target: "15 mins", done: false },
    { id: "h3", title: "Hydrate 2.5L", streak: 18, target: "2500 ml", done: true },
    { id: "h4", title: "Meditation", streak: 8, target: "10 mins", done: false },
    { id: "h5", title: "Daily Journaling", streak: 4, target: "1 entry", done: true },
  ]);

  const [habitBadList, setHabitBadList] = useState([
    { id: "b1", title: "Smoking Cessation", cleanDays: 45, maxClean: 45, avoidedToday: true },
    { id: "b2", title: "Alcohol Reduction", cleanDays: 12, maxClean: 20, avoidedToday: true },
    { id: "b3", title: "Screen Time Control", cleanDays: 3, maxClean: 10, avoidedToday: false },
    { id: "b4", title: "Late Night Junk Food", cleanDays: 7, maxClean: 14, avoidedToday: true },
    { id: "b5", title: "Procrastination", cleanDays: 5, maxClean: 12, avoidedToday: true },
  ]);

  const [screenTimeLimit, setScreenTimeLimit] = useState("2 hrs 30 mins");
  const [productiveHours, setProductiveHours] = useState("6.5 hrs");

  // Recent Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    { id: "act-1", icon: "💧", text: "Logged 250ml water intake", time: "5 min ago", category: "Hydration" },
    { id: "act-2", icon: "💊", text: "Took Lisinopril 10mg (After Meal)", time: "1 hour ago", category: "Medication" },
    { id: "act-3", icon: "🚶", text: "Completed 2,400 brisk steps", time: "2 hours ago", category: "Fitness" },
    { id: "act-4", icon: "🧘", text: "Finished 10 min Guided Meditation", time: "4 hours ago", category: "Wellness" },
  ]);

  // Activity Log Form State
  const [newActIcon, setNewActIcon] = useState("📝");
  const [newActText, setNewActText] = useState("");
  const [newActCategory, setNewActCategory] = useState("General");

  // Domain Forms
  const [famName, setFamName] = useState("");
  const [famRelation, setFamRelation] = useState("");
  const [famAge, setFamAge] = useState("35");
  const [famPhone, setFamPhone] = useState("");
  const [famCategory, setFamCategory] = useState<FamilyMember["healthCategory"]>("General");

  const [vehName, setVehName] = useState("");
  const [vehPlate, setVehPlate] = useState("");
  const [vehType, setVehType] = useState<VehicleItem["vehicleType"]>("Car");
  const [vehServiceDate, setVehServiceDate] = useState("2026-09-01");

  const [farmPlot, setFarmPlot] = useState("");
  const [farmCrop, setFarmCrop] = useState("");
  const [farmAcres, setFarmAcres] = useState("2.5");

  const [finTitle, setFinTitle] = useState("");
  const [finType, setFinType] = useState<"income" | "expense">("expense");
  const [finAmount, setFinAmount] = useState("120");

  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState<PetItem["species"]>("Dog");

  const [bpSystolic, setBpSystolic] = useState("120");
  const [bpDiastolic, setBpDiastolic] = useState("80");
  const [heartRate, setHeartRate] = useState("72");

  // Primary Patient reference
  const activePatient = patients[0] || {
    id: "pat-1",
    name: "John Doe",
    waterCurrentMl: 2100,
    waterGoalMl: 2500,
  };

  // Handler for Modal Feedback
  const triggerSuccessFeedback = (msg: string) => {
    setModalFeedback(msg);
    setTimeout(() => {
      setModalFeedback(null);
      setActiveServiceModal(null);
      setActiveQuickAction(null);
    }, 1200);
  };

  // Add Activity Log
  const handleAddActivityLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActText) return;
    const entry = {
      id: "act-" + Date.now(),
      icon: newActIcon,
      text: newActText,
      time: "Just now",
      category: newActCategory,
    };
    setActivityLogs([entry, ...activityLogs]);
    setNewActText("");
    setActiveDataModal(null);
  };

  // Form Submissions
  const handleAddFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!famName) return;
    onAddFamilyMember({
      id: "fam-" + Date.now(),
      name: famName,
      relation: famRelation || "Family Member",
      age: parseInt(famAge, 10) || 30,
      phone: famPhone || "+1 (555) 000-1122",
      healthCategory: famCategory,
      status: "Healthy",
      notes: "Health & family record.",
    });
    setFamName("");
    setActiveDataModal(null);
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName) return;
    onAddVehicle({
      id: "v-" + Date.now(),
      name: vehName,
      plateNumber: vehPlate || "ABC-1234",
      vehicleType: vehType,
      nextServiceDate: vehServiceDate,
      fuelStatus: "85% Full",
      pucExpiry: "2027-01-01",
      notes: "Inspection log.",
    });
    setVehName("");
    setActiveDataModal(null);
  };

  const handleAddFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmPlot) return;
    onAddFarmRecord({
      id: "farm-" + Date.now(),
      plotName: farmPlot,
      cropType: farmCrop || "Seasonal Crops",
      areaAcres: parseFloat(farmAcres) || 1.0,
      wateringIntervalDays: 2,
      fertilizerUsed: "Organic Compost",
      expectedHarvestDate: "2026-10-15",
      notes: "Optimal growth.",
    });
    setFarmPlot("");
    setActiveDataModal(null);
  };

  const handleAddFinanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finTitle) return;
    onAddFinancialRecord({
      id: "fin-" + Date.now(),
      title: finTitle,
      type: finType,
      amount: parseFloat(finAmount) || 0,
      category: "General Care",
      date: new Date().toISOString().split("T")[0],
      accountMode: serviceMode,
    });
    setFinTitle("");
    setActiveDataModal(null);
  };

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName) return;
    onAddPet({
      id: "pet-" + Date.now(),
      name: petName,
      species: petSpecies,
      breed: "Standard",
      ageYears: 2,
      vaccinationStatus: "Up to date",
      lastVetVisit: new Date().toISOString().split("T")[0],
      medicationNotes: "Healthy condition.",
    });
    setPetName("");
    setActiveDataModal(null);
  };

  const handleVitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVitalSign(activePatient.id, {
      id: "v-" + Date.now(),
      timestamp: Date.now(),
      dateStr: "Just now",
      bloodPressureSystolic: parseInt(bpSystolic, 10) || 120,
      bloodPressureDiastolic: parseInt(bpDiastolic, 10) || 80,
      heartRateBpm: parseInt(heartRate, 10) || 72,
      spO2Percent: 98,
      temperatureF: 98.6,
      bloodSugarMgDl: 100,
    });
    setActiveDataModal(null);
  };

  // Download Patient Vital Signs & Caregiver Notes Summary
  const handleDownloadSummary = () => {
    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const patientName = activePatient.name || "Patient";
    const waterIntake = activePatient.waterCurrentMl ? `${activePatient.waterCurrentMl}ml / ${activePatient.waterGoalMl || 2500}ml` : "2100ml / 2500ml";
    
    // Recent Vitals
    const vitalsInfo = (activePatient as any).vitals && (activePatient as any).vitals.length > 0
      ? (activePatient as any).vitals.map((v: any) => 
          `• [${v.dateStr || "Today"}] BP: ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic} mmHg | Heart Rate: ${v.heartRateBpm} BPM | SpO2: ${v.spO2Percent || 98}% | Temp: ${v.temperatureF || 98.6}°F`
        ).join("\n")
      : `• [Latest Log] Blood Pressure: ${bpSystolic}/${bpDiastolic} mmHg
• Heart Rate: ${heartRate} BPM
• SpO2 Oxygen Level: 98%
• Body Temperature: 98.6°F
• Fasting Blood Sugar: 100 mg/dL`;

    const notesText = serviceNotes || "Patient is stable and following daily routine. Hydration level is good. All morning medications taken on schedule.";
    const activitySummary = activityLogs.map(a => `• [${a.time}] ${a.icon} ${a.text} (${a.category})`).join("\n");

    const fileContent = `===========================================================
CARE2CARE PATIENT VITAL SIGNS & CAREGIVER SUMMARY
Generated On: ${todayStr}
===========================================================

[ PATIENT DETAILS ]
• Patient Name: ${patientName}
• Patient ID: ${activePatient.id}
• Daily Water Intake: ${waterIntake}
• Active Care Mode: ${serviceMode.toUpperCase()}

-----------------------------------------------------------
[ CURRENT VITAL SIGNS ]
${vitalsInfo}

-----------------------------------------------------------
[ CAREGIVER NOTES & OBSERVATIONS ]
${notesText}

-----------------------------------------------------------
[ RECENT ACTIVITY LOG ]
${activitySummary}

===========================================================
Downloaded from Care2Care Suite • Local Encrypted Health Summary
===========================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${patientName.replace(/\s+/g, "_")}_Vitals_Caregiver_Summary_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setModalFeedback("Summary downloaded successfully!");
    setTimeout(() => setModalFeedback(null), 3000);
  };

  // Quick Action Chips definitions
  const quickActionChips = [
    { id: "personal", icon: "👤", label: "Personal", type: "toggle", mode: "personal" },
    { id: "professional", icon: "💼", label: "Prof.", type: "toggle", mode: "professional" },
    { id: "water", icon: "💧", label: "Water", value: "2.1L" },
    { id: "walk", icon: "🚶", label: "Walk", value: "6.8k" },
    { id: "food", icon: "🍽️", label: "Food", value: "1.4k" },
    { id: "medicine", icon: "💊", label: "Medicine", value: "3/3" },
    { id: "mood", icon: "😊", label: "Mood", value: "85%" },
    { id: "journal", icon: "📝", label: "Journal", value: "Today" },
    { id: "yoga", icon: "🧘", label: "Yoga", value: "10m" },
    { id: "exercise", icon: "🏋️", label: "Exercise", value: "Active" },
    { id: "habits", icon: "📈", label: "Habits", value: "5 Streaks" },
    { id: "finance", icon: "💰", label: "Finance", value: "$420" },
    { id: "pets", icon: "🐾", label: "Pets", value: `${pets.length} Saved` },
    { id: "vehicles", icon: "🚗", label: "Vehicle", value: `${vehicles.length} Saved` },
    { id: "farm", icon: "🌾", label: "Farm", value: `${farmRecords.length} Saved` },
    { id: "family", icon: "👨‍👩‍👧‍👦", label: "Family", value: `${familyMembers.length} Members` },
  ];

  // All Available Services grouped by category for Plus Button
  const allAvailableServiceCategories = [
    {
      category: "❤️ Health & Fitness",
      services: [
        { id: "water", icon: "💧", name: "Water Drink Notifier", desc: "Goal tracking & hourly alerts" },
        { id: "medicine", icon: "💊", name: "Medicine Reminder", desc: "OCR scanner & schedule alarms" },
        { id: "yoga", icon: "🧘", name: "Yoga & Meditation", desc: "Guided breathing & mindfulness" },
        { id: "mood", icon: "😊", name: "Mood & Habit Journal", desc: "Daily emotional check-ins & streaks" },
        { id: "exercise", icon: "🏋️", name: "Exercise Tracker", desc: "Workouts, calories & progress" },
        { id: "sleep", icon: "🛌", name: "Sleep Tracker", desc: "Sleep pattern & bedtime alarm" },
        { id: "nutrition", icon: "🍽️", name: "Nutrition Tracker", desc: "Calorie counter & macro log" },
        { id: "journal", icon: "📝", name: "Daily Diary / Journal", desc: "Memoirs, photos & reflections" },
        { id: "habits", icon: "📈", name: "Habit Builder", desc: "Build good habits & break bad ones" },
      ],
    },
    {
      category: "💰 Finance & Money",
      services: [
        { id: "finance", icon: "💰", name: "Personal Finance", desc: "Income, budget & savings" },
        { id: "budget", icon: "📊", name: "Budget Management", desc: "Category limits & spending alerts" },
        { id: "expenses", icon: "💳", name: "Expense Tracker", desc: "Daily receipt & expense log" },
        { id: "investments", icon: "📈", name: "Investment Tracker", desc: "Stocks, portfolio & SIPs" },
        { id: "loans", icon: "🏦", name: "Loan Management", desc: "EMI schedule & payment logs" },
      ],
    },
    {
      category: "🐾 Pet Care",
      services: [
        { id: "pets", icon: "🐶", name: "Pet Care & Profile", desc: "Vaccine, vet & feeding schedule" },
        { id: "pet_vaccine", icon: "💉", name: "Vaccination Schedule", desc: "Automated pet immunization alerts" },
        { id: "vet_appts", icon: "🏥", name: "Vet Appointments", desc: "Prescriptions & doctor logs" },
      ],
    },
    {
      category: "🌾 Farm & Garden",
      services: [
        { id: "farm", icon: "🌾", name: "Farm Management", desc: "Plot acreage, crops & yield" },
        { id: "garden", icon: "🌺", name: "Garden Tracker", desc: "Bed watering & soil logs" },
        { id: "crop", icon: "🌱", name: "Crop Planning", desc: "Planting calendar & fertilizers" },
      ],
    },
    {
      category: "🚗 Vehicle Care",
      services: [
        { id: "vehicles", icon: "🚗", name: "Vehicle Care", desc: "Service, oil & PUC renewal" },
        { id: "fuel", icon: "⛽", name: "Fuel Tracking", desc: "Liters, costs & mileage calculator" },
        { id: "insurance", icon: "🚦", name: "Insurance & PUC", desc: "Renewal alerts & document vault" },
      ],
    },
    {
      category: "👨‍👩‍👧‍👦 Family & Care",
      services: [
        { id: "family", icon: "👨‍👩‍👧‍👦", name: "Family Tree Ancestry", desc: "7 generations archive & relatives" },
        { id: "elderly", icon: "👴", name: "Elderly & Senior Care", desc: "Vitals, mobility & proxy contacts" },
        { id: "kids", icon: "👶", name: "Kids & Pediatric Care", desc: "Pediatric growth & vaccines" },
        { id: "patient", icon: "🤕", name: "Sick & Post-Op Care", desc: "Pain index, temp & symptom logs" },
      ],
    },
    {
      category: "👥 Professional & Staff",
      services: [
        { id: "staff", icon: "👥", name: "Staff Management", desc: "Employees, roles & salaries" },
        { id: "payroll", icon: "💰", name: "Payroll & Salary Slips", desc: "Monthly payouts & tax records" },
        { id: "contracts", icon: "📄", name: "Contract Management", desc: "Digital signatures & agreements" },
        { id: "invoices", icon: "💳", name: "Bills & Invoices", desc: "Billing, receipts & PDF exports" },
        { id: "idcards", icon: "🪪", name: "ID Card Generator", desc: "Staff & visitor digital badges" },
      ],
    },
  ];

  // Personal Modules to render in Grid
  const personalModules = [
    {
      id: "m-health",
      icon: "❤️",
      title: "Health & Wellness",
      color: "from-rose-500 to-pink-600",
      desc: "Hydration, Medicines, Yoga, Exercises, Sleep & Habit Builder",
      subServices: [
        { icon: "💧", name: "Water Drink Notifier", status: "2.1L / 2.5L" },
        { icon: "💊", name: "Medicine Reminder", status: "3/3 Taken" },
        { icon: "🧘", name: "Yoga & Meditation", status: "10 min Today" },
        { icon: "😊", name: "Mood & Habit Journal", status: "😃 Great" },
        { icon: "🏋️", name: "Exercise Tracker", status: "2,400 Steps" },
        { icon: "🛌", name: "Sleep Tracker", status: "7h 45m" },
        { icon: "🍽️", name: "Nutrition Tracker", status: "1,400 cal" },
        { icon: "📝", name: "Daily Diary/Journal", status: "Logged" },
        { icon: "📈", name: "Habit Builder", status: "5 Good / 5 Avoided" },
      ],
    },
    {
      id: "m-finance",
      icon: "💰",
      title: "Finance & Money",
      color: "from-emerald-500 to-teal-600",
      desc: "Income, Expense Logs, Budgets, Investments & Loans",
      subServices: [
        { icon: "💰", name: "Personal Finance", status: `$${financialRecords.reduce((acc, f) => acc + f.amount, 0)} Total` },
        { icon: "📊", name: "Budget Management", status: "Under Limit" },
        { icon: "💳", name: "Expense Tracker", status: `${financialRecords.filter(f => f.type === 'expense').length} Expenses` },
        { icon: "📈", name: "Investment Tracker", status: "Portfolio Active" },
        { icon: "🏦", name: "Loan Management", status: "All Up to Date" },
      ],
    },
    {
      id: "m-pets",
      icon: "🐾",
      title: "Pet Care",
      color: "from-purple-500 to-indigo-600",
      desc: "Vaccination alerts, Vet visits & pet food schedule",
      subServices: [
        { icon: "🐶", name: "Pet Care & Profile", status: `${pets.length} Pets Registered` },
        { icon: "💉", name: "Vaccination Schedule", status: "Rabies Due Sep 2026" },
        { icon: "🏥", name: "Vet Appointments", status: "Dr. Smith Scheduled" },
        { icon: "💊", name: "Pet Medications", status: "Flea & Tick Active" },
      ],
    },
    {
      id: "m-farm",
      icon: "🌾",
      title: "Farm & Garden",
      color: "from-amber-500 to-orange-600",
      desc: "Plot acreage, Soil fertility, Fertilizers & Crops",
      subServices: [
        { icon: "🌾", name: "Farm Management", status: `${farmRecords.length} Plots Tracked` },
        { icon: "🌺", name: "Garden Tracker", status: "Watering Every 2 Days" },
        { icon: "🌱", name: "Crop Planning", status: "Organic Wheat" },
        { icon: "💧", name: "Irrigation & Soil", status: "Drip System Active" },
      ],
    },
    {
      id: "m-vehicles",
      icon: "🚗",
      title: "Vehicle Care",
      color: "from-blue-500 to-cyan-600",
      desc: "Service history, PUC certificates & Fuel logs",
      subServices: [
        { icon: "🚗", name: "Vehicle Care", status: `${vehicles.length} Vehicles Saved` },
        { icon: "⛽", name: "Fuel Tracking", status: "85% Tank Full" },
        { icon: "🔧", name: "Service Reminders", status: "Oil Change Sep 2026" },
        { icon: "📋", name: "PUC & Insurance", status: "Valid till Jan 2027" },
      ],
    },
    {
      id: "m-family",
      icon: "👨‍👩‍👧‍👦",
      title: "Family & Care",
      color: "from-sky-500 to-blue-600",
      desc: "7 Generations Ancestry, Seniors, Kids & Patients",
      subServices: [
        { icon: "👨‍👩‍👧‍👦", name: "Family Tree Ancestry", status: `${familyMembers.length} Ancestors` },
        { icon: "👴", name: "Elderly & Senior Care", status: "Vitals Monitored" },
        { icon: "👶", name: "Kids & Pediatric Care", status: "Pediatric Active" },
        { icon: "🤕", name: "Sick & Post-Op Care", status: "Recovery Phase" },
      ],
    },
  ];

  // Professional Modules to render in Grid
  const professionalModules = [
    {
      id: "pm-staff",
      icon: "👥",
      title: "Staff & Payroll",
      color: "from-purple-600 to-indigo-700",
      desc: "Employees, Timesheets, Payroll Slips & Digital ID Cards",
      subServices: [
        { icon: "👥", name: "Staff Management", status: "12 Active Employees" },
        { icon: "💰", name: "Payroll & Salary", status: "Processed for July" },
        { icon: "⏰", name: "Timesheets", status: "98% Attendance" },
        { icon: "🪪", name: "ID Card Generator", status: "QR Badges Ready" },
      ],
    },
    {
      id: "pm-tasks",
      icon: "📋",
      title: "Task & Proof of Work",
      color: "from-amber-600 to-orange-700",
      desc: "Task assignments, Proof photos & Location stamps",
      subServices: [
        { icon: "📋", name: "Task Manager", status: "8 Pending / 24 Done" },
        { icon: "📝", name: "Proof of Work", status: "GPS & Photo Verified" },
        { icon: "📊", name: "Performance Reports", status: "94% Efficiency" },
      ],
    },
    {
      id: "pm-docs",
      icon: "📄",
      title: "Documents & Invoices",
      color: "from-blue-600 to-cyan-700",
      desc: "Contracts, Client Bills, Inventory & Business Analytics",
      subServices: [
        { icon: "📄", name: "Contract Management", status: "4 Active Contracts" },
        { icon: "💳", name: "Bills & Invoices", status: "$2,450 Invoiced" },
        { icon: "📦", name: "Inventory Management", status: "Stock Level Optimal" },
        { icon: "📊", name: "Business Analytics", status: "Growth +18%" },
      ],
    },
    {
      id: "pm-clients",
      icon: "💼",
      title: "Clients & Sales",
      color: "from-emerald-600 to-teal-700",
      desc: "Lead pipeline, Client contacts & Revenue tracking",
      subServices: [
        { icon: "💼", name: "Client Management", status: "18 Key Accounts" },
        { icon: "📞", name: "Lead Tracking", status: "5 New Inquiries" },
        { icon: "📈", name: "Revenue Tracking", status: "+12% MoM" },
      ],
    },
  ];

  const currentModules = serviceMode === "personal" ? personalModules : professionalModules;

  return (
    <div className="space-y-4 pb-12">
      {/* 1. HEADER BANNER / TOP SECTION */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-emerald-700/30 space-y-3 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/20">
              🌟
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Care2Care
              </h1>
              <p className="text-[11px] font-medium text-emerald-200/90">
                Everything Matters. Track & Succeed.
              </p>
            </div>
          </div>

          {/* Right Action Icons: Profile, Notifications, Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-white/40 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              title="User Profile"
            >
              JD
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-semibold text-emerald-100">
          <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 font-bold">Encrypted 🔒 Active</span>
          </div>

          <span className="text-[11px] text-emerald-200/80 font-medium">
            Local Cloud Sync • Protected
          </span>
        </div>
      </div>

      {/* PATIENT VITAL SIGNS & CAREGIVER SUMMARY CARD WITH DOWNLOAD & FEATURE BUTTONS */}
      <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-lg shrink-0">
            🩺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {activePatient.name || "Patient"}'s Health & Vitals Summary
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200/60">
                BP {bpSystolic}/{bpDiastolic} | HR {heartRate}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Contains current vital signs, caregiver notes, water intake & activity history.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowVoiceModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95 shrink-0"
            title="Voice Commands & Audio Dictation"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-200" />
            <span>Voice Mic</span>
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95 shrink-0"
            title="Shareable Family Invitation Link"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Invite Family</span>
          </button>

          <button
            onClick={() => {
              if (patients && patients[0]) {
                generatePatientPDFReport(patients[0]);
              } else {
                handleDownloadSummary();
              }
            }}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95 shrink-0"
            title="Download Formatted PDF Health Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* HEALTH INSIGHTS & VITALS HEURISTICS MODULE */}
      {patients && patients.length > 0 && (
        <HealthInsightsModule
          patients={patients}
          selectedPatientId={activePatient?.id}
          onSelectPatient={onSelectPatient}
        />
      )}

      {/* RECHARTS VISUAL TREND CHART COMPONENT */}
      {patients && patients[0] && (
        <VitalsTrendChart
          patient={patients[0]}
          onAddVitalSign={() => setActiveDataModal("vitals")}
        />
      )}

      {/* 2. QUICK ACTION ROW / MODULE SWITCHER */}
      <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Quick View Switcher
            </span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
            16 Quick Controls
          </span>
        </div>

        {/* Scrollable Quick Action Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {quickActionChips.map((chip) => {
            if (chip.type === "toggle") {
              const isSelected = serviceMode === chip.mode;
              return (
                <button
                  key={chip.id}
                  onClick={() => setServiceMode(chip.mode as "personal" | "professional")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-102"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            }

            return (
              <button
                key={chip.id}
                onClick={() => setActiveQuickAction(chip.label)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 whitespace-nowrap transition-all cursor-pointer shadow-2xs group"
              >
                <span className="text-sm group-hover:scale-110 transition-transform">{chip.icon}</span>
                <span>{chip.label}</span>
                {chip.value && (
                  <span className="text-[9px] bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 px-1.5 py-0.5 rounded-full">
                    {chip.value}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. QUICK STATS BAR */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-cyan-50/80 border border-cyan-100 rounded-2xl p-2.5 space-y-0.5">
          <div className="text-sm">💧</div>
          <div className="font-extrabold text-cyan-950 text-xs">2.1L / 2.5L</div>
          <div className="text-[9px] text-cyan-700 font-bold">Water Intake</div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-2.5 space-y-0.5">
          <div className="text-sm">🚶</div>
          <div className="font-extrabold text-emerald-950 text-xs">6,800</div>
          <div className="text-[9px] text-emerald-700 font-bold">Steps Goal</div>
        </div>

        <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-2.5 space-y-0.5">
          <div className="text-sm">💊</div>
          <div className="font-extrabold text-rose-950 text-xs">3 / 3 Taken</div>
          <div className="text-[9px] text-rose-700 font-bold">Medicines</div>
        </div>

        <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-2.5 space-y-0.5">
          <div className="text-sm">😊</div>
          <div className="font-extrabold text-amber-950 text-xs">85% Pos.</div>
          <div className="text-[9px] text-amber-700 font-bold">Mood Score</div>
        </div>
      </div>

      {/* 4. MAIN SERVICES GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            📌 {serviceMode === "personal" ? "Personal Modules" : "Professional Work Modules"}
          </h2>
          <span className="text-[10px] text-slate-500 font-bold">
            Tap card to manage sub-services
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentModules.map((mod) => {
            const isExpanded = expandedModule === mod.id;

            return (
              <div
                key={mod.id}
                className="bg-white border border-slate-100 hover:border-slate-300 rounded-3xl p-4 shadow-2xs transition-all space-y-3"
              >
                {/* Module Header */}
                <div
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${mod.color} text-white flex items-center justify-center text-xl shadow-xs font-black`}>
                      {mod.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Sub-services Grid (Always visible compact or expandable) */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                  {mod.subServices.slice(0, isExpanded ? mod.subServices.length : 3).map((sub, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveServiceModal(sub.name)}
                      className="bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-100 rounded-2xl p-2.5 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm group-hover:scale-110 transition-transform">{sub.icon}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600" />
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-900">
                        {sub.name}
                      </div>
                      <div className="text-[9px] font-semibold text-slate-400 group-hover:text-emerald-700">
                        {sub.status}
                      </div>
                    </button>
                  ))}
                </div>

                {mod.subServices.length > 3 && (
                  <button
                    onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                    className="w-full text-center text-[11px] font-bold text-emerald-700 hover:text-emerald-900 pt-1 cursor-pointer"
                  >
                    {isExpanded ? "Show Less ↑" : `+ ${mod.subServices.length - 3} More Sub-services ↓`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. HABIT BUILDER SECTION (Good Habits & Bad Habits to Break + Time Utilization) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Habit Builder & Time Utilization
              </h3>
              <p className="text-[10px] text-slate-400">Build good habits & break bad addictions</p>
            </div>
          </div>
          <button
            onClick={() => setActiveServiceModal("Habit Builder")}
            className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full cursor-pointer"
          >
            Manage All Habits
          </button>
        </div>

        {/* Good Habits */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span>✨ Good Habits to Build</span>
            <span className="text-[10px] text-emerald-600 font-bold">5 Active Streaks</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {habitGoodList.slice(0, 3).map((h) => (
              <div key={h.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setHabitGoodList(prev => prev.map(item => item.id === h.id ? { ...item, done: !item.done, streak: item.done ? item.streak - 1 : item.streak + 1 } : item));
                    }}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                      h.done ? "bg-emerald-600 text-white" : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {h.done && "✓"}
                  </button>
                  <div>
                    <span className={`font-bold ${h.done ? "line-through text-slate-400" : "text-slate-800"}`}>{h.title}</span>
                    <span className="text-[10px] text-slate-400 block">{h.target}</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  🔥 {h.streak} Day Streak
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bad Habits (Break) & Time Utilization */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span>🛡️ Bad Habits to Break</span>
            <span className="text-[10px] text-rose-600 font-bold">Recovery Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {habitBadList.slice(0, 2).map((b) => (
              <div key={b.id} className="bg-rose-50/60 border border-rose-100 rounded-2xl p-2.5 space-y-1">
                <div className="font-bold text-rose-950 text-[11px]">{b.title}</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-rose-700 font-extrabold">{b.cleanDays} Days Clean</span>
                  <span className="text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded-md">
                    {b.avoidedToday ? "✓ Safe" : "Action"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Time Utilization Meter */}
          <div className="bg-slate-900 text-white rounded-2xl p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Clock className="w-3.5 h-3.5" /> Productive Time Index
              </span>
              <span className="text-amber-300">{productiveHours} Productive</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[70%]" title="Productive" />
              <div className="bg-amber-500 h-full w-[20%]" title="Rest/Personal" />
              <div className="bg-rose-500 h-full w-[10%]" title="Wasted" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>Screen Limit: {screenTimeLimit}</span>
              <span className="text-emerald-400 font-bold">Focus Mode Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. RECENT ACTIVITY LOG */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Recent Activity Log
            </h3>
          </div>
          <button
            onClick={() => setActiveDataModal("activity")}
            className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Log Activity
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {activityLogs.map((act) => (
            <div key={act.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-2.5 hover:bg-slate-100/80 transition-all">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{act.icon}</span>
                <div>
                  <div className="font-bold text-slate-800">{act.text}</div>
                  <span className="text-[9px] font-semibold text-slate-400">{act.category}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>



      {/* ================= MODALS & DRAWERS ================= */}

      {/* TOP BAR MODAL 1: USER PROFILE */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> User Profile & Security
              </h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center">JD</div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">John Doe</h4>
                  <p className="text-slate-500 font-medium">Primary Caregiver & Admin</p>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">Encrypted Cloud Key Active</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Registered Email</label>
                <input type="text" readOnly value="yudley.ai@gmail.com" className="w-full p-2 bg-slate-100 rounded-xl font-bold" />
              </div>
              <button onClick={() => setShowProfileModal(false)} className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-2xl cursor-pointer">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR MODAL 2: NOTIFICATIONS */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" /> Care Alerts & Notifications
              </h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-2xl">
                <div className="font-bold text-cyan-900">💧 Water Hourly Reminder</div>
                <div className="text-[10px] text-cyan-700">Time to log your next 250ml water goal.</div>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-2xl">
                <div className="font-bold text-rose-900">💊 Evening Medicine Scheduled</div>
                <div className="text-[10px] text-rose-700">Lisinopril 10mg due at 08:00 PM.</div>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="font-bold text-emerald-900">✅ Daily Step Milestone</div>
                <div className="text-[10px] text-emerald-700">You reached 85% of today's walking goal!</div>
              </div>
              <button onClick={() => setShowNotificationModal(false)} className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-2xl cursor-pointer">Dismiss Notifications</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR MODAL 3: SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" /> Application Preferences
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-2xl">
                <span className="font-bold text-slate-800">Sound & Haptic Alerts</span>
                <input type="checkbox" defaultChecked className="accent-emerald-600" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-2xl">
                <span className="font-bold text-slate-800">Auto Local Storage Backup</span>
                <input type="checkbox" defaultChecked className="accent-emerald-600" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-2xl">
                <span className="font-bold text-slate-800">Dark Mode Contrast</span>
                <input type="checkbox" className="accent-emerald-600" />
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-2xl cursor-pointer">Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTION DRAWER MODAL */}
      {activeQuickAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                ⚡ Quick Action: {activeQuickAction}
              </h3>
              <button onClick={() => setActiveQuickAction(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            {modalFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl">
                {modalFeedback}
              </div>
            )}

            <div className="space-y-3 text-xs">
              {activeQuickAction === "Water" && (
                <div className="space-y-3">
                  <div className="bg-cyan-50 p-3 rounded-2xl border border-cyan-100">
                    <div className="font-bold text-cyan-950">Logged Today: 2,100 ml / 2,500 ml</div>
                    <div className="w-full bg-cyan-200 h-2 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-cyan-600 h-full w-[84%]" />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Quick Add Water (ml)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 150, 200, 250].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            onAddWater(activePatient.id, amt);
                            triggerSuccessFeedback(`Added +${amt}ml water!`);
                          }}
                          className="py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl cursor-pointer"
                        >
                          +{amt}ml
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeQuickAction === "Walk" && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <div className="font-bold text-emerald-950">Walked Today: 6,800 / 8,000 steps</div>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Calories Burned: ~280 kcal • 4.2 km</p>
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Log Steps</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={quickStepsCount}
                        onChange={(e) => setQuickStepsCount(Number(e.target.value))}
                        className="flex-1 p-2.5 bg-slate-50 border rounded-xl font-bold"
                      />
                      <button
                        onClick={() => triggerSuccessFeedback(`Logged +${quickStepsCount} steps!`)}
                        className="py-2.5 px-4 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeQuickAction === "Food" && (
                <div className="space-y-3">
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                    <div className="font-bold text-amber-950">Calories Today: 1,400 / 2,000 kcal</div>
                    <p className="text-[10px] text-amber-700 mt-0.5">Breakfast: 450 kcal • Lunch: 550 kcal</p>
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Log Snack / Meal Calorie</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={quickFoodCal}
                        onChange={(e) => setQuickFoodCal(Number(e.target.value))}
                        className="flex-1 p-2.5 bg-slate-50 border rounded-xl font-bold"
                      />
                      <button
                        onClick={() => triggerSuccessFeedback(`Logged +${quickFoodCal} kcal!`)}
                        className="py-2.5 px-4 bg-amber-600 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeQuickAction === "Mood" && (
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Select Today's Emotion</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["😃 Energetic", "😌 Relaxed", "😔 Tired", "😟 Stressed", "😣 In Pain", "😊 Joyful"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setQuickMood(m)}
                          className={`p-2 rounded-xl text-xs font-bold border ${quickMood === m ? "bg-amber-100 border-amber-400 text-amber-900" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => triggerSuccessFeedback(`Saved Mood: ${quickMood}`)}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-2xl cursor-pointer"
                  >
                    Confirm Mood Log
                  </button>
                </div>
              )}

              {/* Fallback for other Quick Actions */}
              {!["Water", "Walk", "Food", "Mood"].includes(activeQuickAction) && (
                <div className="space-y-3">
                  <p className="text-slate-600 font-medium">
                    Manage records for <strong>{activeQuickAction}</strong> service.
                  </p>
                  <button
                    onClick={() => triggerSuccessFeedback(`Updated ${activeQuickAction} records!`)}
                    className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-2xl cursor-pointer"
                  >
                    Apply Quick Setup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SERVICE MODAL FOR INDIVIDUAL SUB-SERVICES & TOOLS */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col my-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" /> {activeServiceModal}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Full Setup, Schedule, Reminders & Proof Capture</p>
              </div>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer">✕</button>
            </div>

            {modalFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl flex items-center gap-2 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {modalFeedback}
              </div>
            )}

            {/* Scrollable Form Body */}
            <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* 1. SETUP MODE SWITCHER */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-800 block text-[11px]">Configuration Mode</span>
                  <span className="text-[10px] text-slate-500">Choose manual setup or AI monitoring</span>
                </div>
                <div className="flex bg-white rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => setSetupMode("manual")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[10px] cursor-pointer ${setupMode === "manual" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    ⚙️ Manual
                  </button>
                  <button
                    onClick={() => setSetupMode("ai")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[10px] cursor-pointer ${setupMode === "ai" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    🤖 AI Auto
                  </button>
                </div>
              </div>

              {/* 2. CATEGORY SELECTION WITH "OTHERS" CUSTOM OPTION */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-[11px]">Category Assignment *</label>
                <select
                  value={serviceCategorySelect}
                  onChange={(e) => setServiceCategorySelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Health & Care">🏥 Health & Medical Care</option>
                  <option value="Family & Senior">👴 Family & Senior Care</option>
                  <option value="Kids & Pediatric">👶 Kids & Pediatric Care</option>
                  <option value="Vehicle & Fleet">🚗 Vehicle & Maintenance</option>
                  <option value="Farm & Crop">🌾 Farm, Garden & Crops</option>
                  <option value="Financial & Income">💰 Financial & Expense Tracking</option>
                  <option value="Pets & Animals">🐾 Pets & Animal Care</option>
                  <option value="Staff & Business">👥 Staff, Payroll & Contracts</option>
                  <option value="Others">➕ Others (Custom Category...)</option>
                </select>

                {serviceCategorySelect === "Others" && (
                  <div className="pt-1 space-y-1">
                    <label className="text-[10px] font-extrabold text-amber-700">Specify Custom Category Name:</label>
                    <input
                      type="text"
                      placeholder="e.g., Community Service, Equipment Maintenance, Personal Hobbies"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="w-full p-2.5 bg-amber-50/50 border border-amber-300 rounded-xl font-bold text-slate-900 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* 3. TIME, TIMINGS & REMINDER SETUP */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Timing & Multi-Schedule Setup
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    {serviceTimings.length} Times Set
                  </span>
                </div>

                {/* Multiple Timings List */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Alert Timings List</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {serviceTimings.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 font-extrabold text-slate-800 px-2.5 py-1 rounded-xl text-[11px]">
                        ⏰ {t}
                        <button
                          onClick={() => setServiceTimings(serviceTimings.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 font-black ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add New Time Slot */}
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newTimingInput}
                      onChange={(e) => setNewTimingInput(e.target.value)}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                    />
                    <button
                      onClick={() => {
                        if (newTimingInput) {
                          setServiceTimings([...serviceTimings, newTimingInput]);
                          setNewTimingInput("");
                        }
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer text-xs"
                    >
                      + Add Time
                    </button>
                  </div>
                </div>

                {/* Remind Before */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Remind Before</label>
                    <select
                      value={remindBefore}
                      onChange={(e) => setRemindBefore(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="At exact time">At exact time</option>
                      <option value="5 mins before">5 mins before</option>
                      <option value="15 mins before">15 mins before</option>
                      <option value="30 mins before">30 mins before</option>
                      <option value="1 hour before">1 hour before</option>
                      <option value="1 day before">1 day before</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Vibration Pattern</label>
                    <select
                      value={vibrationChoice}
                      onChange={(e) => setVibrationChoice(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="None">None (Silent)</option>
                      <option value="Gentle Pulse">Gentle Pulse</option>
                      <option value="Strong Vibration">Strong Vibration</option>
                      <option value="Double Pulse">Double Pulse</option>
                      <option value="Continuous">Continuous Alert</option>
                    </select>
                  </div>
                </div>

                {/* Ringtone / Audio Alert Selection & Custom Upload */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Ringtone & Audio Alert Sound</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={ringtoneChoice}
                      onChange={(e) => setRingtoneChoice(e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="Gentle Bell">🔔 Gentle Bell</option>
                      <option value="Alarm Chime">⏰ Alarm Chime</option>
                      <option value="Water Splash">💧 Water Splash</option>
                      <option value="Siren Alert">🚨 High Pitch Siren</option>
                      <option value="Soft Melody">🎵 Soft Melody</option>
                      <option value="Custom Audio">🎙️ Custom Audio Upload</option>
                    </select>

                    <label className="p-2 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer text-[10px]">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      {customAudioFileName ? customAudioFileName.slice(0, 12) + "..." : "Upload Audio"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCustomAudioFileName(file.name);
                            setRingtoneChoice("Custom Audio");
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. PROOF CAPTURE & EVIDENCE UPLOAD (PHOTO, VIDEO, AUDIO, GPS) */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2.5">
                <span className="font-extrabold text-slate-800 text-[11px] block">
                  📸 Proof Capture, Media & Verification
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {/* Image Upload / Capture */}
                  <label className="p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer space-y-1 hover:bg-emerald-50/30 transition-all">
                    <span className="text-base">📷</span>
                    <span className="font-bold text-[10px] text-slate-700">Photo Proof</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setProofPhotoUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Video Upload */}
                  <label className="p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer space-y-1 hover:bg-emerald-50/30 transition-all">
                    <span className="text-base">📹</span>
                    <span className="font-bold text-[10px] text-slate-700">{proofVideoName ? "Video Added" : "Video Proof"}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProofVideoName(file.name);
                      }}
                    />
                  </label>

                  {/* Audio Recording */}
                  <label className="p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer space-y-1 hover:bg-emerald-50/30 transition-all">
                    <span className="text-base">🎙️</span>
                    <span className="font-bold text-[10px] text-slate-700">{proofAudioName ? "Audio Added" : "Audio Note"}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProofAudioName(file.name);
                      }}
                    />
                  </label>
                </div>

                {/* Photo Live Thumbnail Preview */}
                {proofPhotoUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-300 max-h-36 bg-slate-900 flex justify-center">
                    <img src={proofPhotoUrl} alt="Proof" className="h-36 object-cover w-full" />
                    <button
                      onClick={() => setProofPhotoUrl(null)}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white font-bold text-xs p-1 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Verified Photo Attachment
                    </span>
                  </div>
                )}

                {/* GPS Location Stamp */}
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 text-[10px] flex items-center gap-1">
                    📍 {locationStamp}
                  </span>
                  <button
                    onClick={() => setLocationStamp("GPS: 37.7749° N, 122.4194° W (Refreshed)")}
                    className="text-emerald-700 font-extrabold text-[10px] hover:underline cursor-pointer"
                  >
                    Stamp GPS
                  </button>
                </div>
              </div>

              {/* 5. DETAILS FILLER & CUSTOM NOTES */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-[11px]">Details, Instructions & Observations</label>
                <textarea
                  rows={2}
                  placeholder={`Write full details, dosage instructions, or observations for ${activeServiceModal}...`}
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs"
                />
              </div>

              {/* 6. MULTIPLE ITEMS / CUSTOM EXTRA FIELDS ("ADD OTHER / MULTIPLE THINGS") */}
              <div className="space-y-2 border-t border-slate-100 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 text-[11px]">Custom Attributes & Multiple Fields</span>
                  <button
                    onClick={() => setExtraFields([...extraFields, { id: String(Date.now()), label: "Custom Label", value: "" }])}
                    className="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg cursor-pointer"
                  >
                    + Add Field
                  </button>
                </div>

                {extraFields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g., Serial No, Doctor Name)"
                      value={field.label}
                      onChange={(e) => {
                        const updated = [...extraFields];
                        updated[idx].label = e.target.value;
                        setExtraFields(updated);
                      }}
                      className="w-1/3 p-2 bg-slate-50 border rounded-xl font-bold text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => {
                        const updated = [...extraFields];
                        updated[idx].value = e.target.value;
                        setExtraFields(updated);
                      }}
                      className="flex-1 p-2 bg-slate-50 border rounded-xl font-bold text-xs"
                    />
                    <button
                      onClick={() => setExtraFields(extraFields.filter((_, i) => i !== idx))}
                      className="text-rose-500 font-bold px-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setActiveServiceModal(null)}
                className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-2xl cursor-pointer hover:bg-slate-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const cat = serviceCategorySelect === "Others" ? (customCategoryInput || "Custom Service") : serviceCategorySelect;
                  setActivityLogs([
                    {
                      id: `act-${Date.now()}`,
                      icon: "✨",
                      text: `Configured ${activeServiceModal} (${cat}) - ${serviceTimings.length} timings, ${ringtoneChoice}`,
                      time: "Just now",
                      category: cat,
                    },
                    ...activityLogs,
                  ]);
                  triggerSuccessFeedback(`Successfully saved complete setup for ${activeServiceModal}!`);
                  setTimeout(() => setActiveServiceModal(null), 1200);
                }}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl cursor-pointer shadow-md text-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Complete Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING (+) ADD SERVICE DIALOG */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  ➕ Add Services & Shortcuts
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Select services to display on Home</p>
              </div>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            {/* Quick Add Domain Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Add New Entry</span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                <button
                  onClick={() => { setShowAddServiceModal(false); setActiveDataModal("family"); }}
                  className="p-2 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl hover:bg-sky-100 transition-all cursor-pointer text-center"
                >
                  + Family
                </button>
                <button
                  onClick={() => { setShowAddServiceModal(false); setActiveDataModal("vehicle"); }}
                  className="p-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all cursor-pointer text-center"
                >
                  + Vehicle
                </button>
                <button
                  onClick={() => { setShowAddServiceModal(false); setActiveDataModal("farm"); }}
                  className="p-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all cursor-pointer text-center"
                >
                  + Farm
                </button>
                <button
                  onClick={() => { setShowAddServiceModal(false); setActiveDataModal("finance"); }}
                  className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer text-center"
                >
                  + Finance
                </button>
                <button
                  onClick={() => { setShowAddServiceModal(false); setActiveDataModal("pet"); }}
                  className="p-2 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all cursor-pointer text-center"
                >
                  + Pet
                </button>
                <button
                  onClick={() => { setShowAddServiceModal(false); setActiveDataModal("vitals"); }}
                  className="p-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all cursor-pointer text-center"
                >
                  + Vitals
                </button>
              </div>
            </div>

            {/* Select All / Deselect All Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <input
                type="text"
                placeholder="Search services..."
                value={addServiceSearch}
                onChange={(e) => setAddServiceSearch(e.target.value)}
                className="flex-1 p-2 bg-slate-50 border rounded-xl text-xs font-semibold mr-2"
              />
              <button
                onClick={() => {
                  const allIds = new Set<string>();
                  allAvailableServiceCategories.forEach(cat => cat.services.forEach(s => allIds.add(s.id)));
                  setSelectedServiceIds(allIds);
                }}
                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 mr-1 cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedServiceIds(new Set())}
                className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg hover:bg-rose-100 cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Scrollable Categories & Checkboxes */}
            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs">
              {allAvailableServiceCategories.map((cat, cIdx) => (
                <div key={cIdx} className="space-y-1.5">
                  <div className="font-extrabold text-slate-800 text-[11px] bg-slate-100 p-1.5 rounded-lg">
                    {cat.category}
                  </div>
                  <div className="space-y-1">
                    {cat.services
                      .filter(s => (s.name || "").toLowerCase().includes((addServiceSearch || "").toLowerCase()))
                      .map((serv) => {
                        const isChecked = selectedServiceIds.has(serv.id);
                        return (
                          <label
                            key={serv.id}
                            className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                              isChecked ? "bg-emerald-50/70 border-emerald-300" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{serv.icon}</span>
                              <div>
                                <div className="font-bold text-slate-800">{serv.name}</div>
                                <div className="text-[9px] text-slate-400">{serv.desc}</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const next = new Set(selectedServiceIds);
                                if (isChecked) next.delete(serv.id);
                                else next.add(serv.id);
                                setSelectedServiceIds(next);
                              }}
                              className="accent-emerald-600 w-4 h-4"
                            />
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowAddServiceModal(false);
                alert(`Added ${selectedServiceIds.size} active services to your Home dashboard!`);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl cursor-pointer shadow-md text-xs"
            >
              Add Selected Services ({selectedServiceIds.size})
            </button>
          </div>
        </div>
      )}

      {/* DATA MODAL: ACTIVITY LOG */}
      {activeDataModal === "activity" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Log New Care Activity</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddActivityLog} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Activity Description (e.g. Took 250ml water)"
                value={newActText}
                onChange={(e) => setNewActText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <select value={newActIcon} onChange={(e) => setNewActIcon(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold">
                  <option value="💧">💧 Water</option>
                  <option value="💊">💊 Medicine</option>
                  <option value="🚶">🚶 Walk</option>
                  <option value="🧘">🧘 Yoga</option>
                  <option value="📝">📝 Note</option>
                </select>
                <select value={newActCategory} onChange={(e) => setNewActCategory(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold">
                  <option value="Hydration">Hydration</option>
                  <option value="Medication">Medication</option>
                  <option value="Fitness">Fitness</option>
                  <option value="General">General</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Save Log</button>
            </form>
          </div>
        </div>
      )}

      {/* DATA MODAL: FAMILY */}
      {activeDataModal === "family" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Add Family Member</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddFamilySubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Full Name *" value={famName} onChange={(e) => setFamName(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Relation" value={famRelation} onChange={(e) => setFamRelation(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold" />
                <input type="number" placeholder="Age" value={famAge} onChange={(e) => setFamAge(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-sky-600 text-white font-bold rounded-xl">Save Member</button>
            </form>
          </div>
        </div>
      )}

      {/* DATA MODAL: VEHICLE */}
      {activeDataModal === "vehicle" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Add Vehicle Record</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Vehicle Name / Model *" value={vehName} onChange={(e) => setVehName(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" required />
              <input type="text" placeholder="License Plate" value={vehPlate} onChange={(e) => setVehPlate(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save Vehicle</button>
            </form>
          </div>
        </div>
      )}

      {/* DATA MODAL: FARM */}
      {activeDataModal === "farm" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Add Farm Plot</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddFarmSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Plot Field Name *" value={farmPlot} onChange={(e) => setFarmPlot(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" required />
              <input type="text" placeholder="Crop Type" value={farmCrop} onChange={(e) => setFarmCrop(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
              <button type="submit" className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl">Save Farm Plot</button>
            </form>
          </div>
        </div>
      )}

      {/* DATA MODAL: FINANCE */}
      {activeDataModal === "finance" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Log Financial Record</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddFinanceSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Transaction Title *" value={finTitle} onChange={(e) => setFinTitle(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" required />
              <div className="grid grid-cols-2 gap-2">
                <select value={finType} onChange={(e: any) => setFinType(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold">
                  <option value="expense">Expense (-)</option>
                  <option value="income">Income (+)</option>
                </select>
                <input type="number" placeholder="Amount ($)" value={finAmount} onChange={(e) => setFinAmount(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Save Transaction</button>
            </form>
          </div>
        </div>
      )}

      {/* DATA MODAL: PET */}
      {activeDataModal === "pet" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Add Pet Profile</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddPetSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Pet Name *" value={petName} onChange={(e) => setPetName(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" required />
              <button type="submit" className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl">Save Pet</button>
            </form>
          </div>
        </div>
      )}

      {/* DATA MODAL: VITALS */}
      {activeDataModal === "vitals" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Log Patient Vitals</h3>
              <button onClick={() => setActiveDataModal(null)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleVitalSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="BP Systolic" value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold" />
                <input type="number" placeholder="BP Diastolic" value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} className="p-2.5 bg-slate-50 border rounded-xl font-bold" />
              </div>
              <input type="number" placeholder="Heart Rate (BPM)" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
              <button type="submit" className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-xl">Save Vitals</button>
            </form>
          </div>
        </div>
      )}

      {/* Shareable Family Invitation Link Modal */}
      {patients && patients[0] && (
        <FamilyInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          patient={patients[0]}
        />
      )}

      {/* AI Voice Assistant & Audio Dictation Modal */}
      {patients && patients[0] && (
        <VoiceAssistantModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onNavigateService={(subTab) => {
            setActiveQuickAction(subTab);
          }}
          onTriggerAction={(action) => {
            if (action === "EXPORT_PDF") {
              generatePatientPDFReport(patients[0]);
            }
          }}
          currentNotes={patients[0].caregiverNotes}
          onUpdateCaregiverNotes={(notes) => {
            patients[0].caregiverNotes = notes;
          }}
        />
      )}
    </div>
  );
};
