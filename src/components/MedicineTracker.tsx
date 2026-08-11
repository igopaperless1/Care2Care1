import React, { useState, useEffect } from "react";
import { Patient, Medication } from "../types";
import { ServiceSetupModal } from "./ServiceSetupModal";
import {
  Pill,
  Clock,
  Plus,
  History,
  Settings,
  Award,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Camera,
  Upload,
  Sparkles,
  Download,
  Trash2,
  Check,
  Volume2,
  FileText,
  AlertTriangle,
  RefreshCw,
  Search,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Filter,
  CheckSquare,
  XCircle,
  HelpCircle,
  Sliders
} from "lucide-react";

interface MedicineTrackerProps {
  patient: Patient;
  onToggleMedication?: (patientId: string, medId: string) => void;
  onAddMedication?: (patientId: string, medication: Medication) => void;
}

export interface DetailedMedicineEntry {
  id: string;
  name: string;
  dosage: string;
  type: string;
  purpose?: string;
  prescribedBy?: string;
  frequency: string;
  timesPerDay: number;
  timings: string[];
  takeWith: string;
  foodRelation: string;
  instructions?: string;
  remainingCount: number;
  refillReminderEnabled: boolean;
  refillThreshold: number;
  sideEffects?: string;
  warnings?: string;
  notes?: string;
  photoUrl?: string;
  prescriptionPhotoUrl?: string;
  status: "Taken" | "Pending" | "Skipped" | "Missed";
  lastTakenTime?: string;
  takenDates: string[];
}

export const MedicineTracker: React.FC<MedicineTrackerProps> = ({
  patient,
  onToggleMedication,
  onAddMedication,
}) => {
  // Active Tab View
  const [activeTab, setActiveTab] = useState<
    "tracker" | "form" | "ocr" | "schedule" | "history" | "analytics" | "achievements" | "settings"
  >("tracker");
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Notifications & Reminders State
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [reminderSound, setReminderSound] = useState<string>("Soft Chime");
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [activeAlert, setActiveAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>(
    "💊 Dose Reminder: Lisinopril 10mg is due now!"
  );

  // Settings State
  const [refillNoticeThreshold, setRefillNoticeThreshold] = useState<number>(5); // pills left
  const [autoOcrEnabled, setAutoOcrEnabled] = useState<boolean>(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Local Rich Medication List initialized from patient.medications
  const [medicines, setMedicines] = useState<DetailedMedicineEntry[]>([
    {
      id: "m1",
      name: "Lisinopril",
      dosage: "10 mg",
      type: "Tablet",
      purpose: "Blood Pressure & Cardiac Protection",
      prescribedBy: "Dr. Sharma (Cardiologist)",
      frequency: "Daily",
      timesPerDay: 1,
      timings: ["08:00 AM"],
      takeWith: "Water",
      foodRelation: "After Food",
      instructions: "Take every morning with a full glass of water.",
      remainingCount: 14,
      refillReminderEnabled: true,
      refillThreshold: 5,
      sideEffects: "Dry cough, mild dizziness",
      warnings: "Do not stop suddenly without consulting doctor.",
      notes: "Keep stored in a cool dry place.",
      status: "Taken",
      lastTakenTime: "08:05 AM Today",
      takenDates: [new Date().toISOString().split("T")[0]],
    },
    {
      id: "m2",
      name: "Metformin ER",
      dosage: "500 mg",
      type: "Pill",
      purpose: "Blood Sugar & Diabetes Management",
      prescribedBy: "Dr. Anita Patel",
      frequency: "Twice Daily",
      timesPerDay: 2,
      timings: ["08:30 AM", "08:00 PM"],
      takeWith: "Water",
      foodRelation: "With Food",
      instructions: "Swallow whole, do not crush or chew extended release.",
      remainingCount: 4,
      refillReminderEnabled: true,
      refillThreshold: 7,
      warnings: "Low refill count! Order refill soon.",
      status: "Pending",
      takenDates: [],
    },
    {
      id: "m3",
      name: "Calcium D3",
      dosage: "1000 IU",
      type: "Capsule",
      purpose: "Bone Strength & Vitamin Supplementation",
      prescribedBy: "Dr. Mehta",
      frequency: "Daily",
      timesPerDay: 1,
      timings: ["01:00 PM"],
      takeWith: "Milk / Water",
      foodRelation: "After Food",
      instructions: "Best taken after lunch.",
      remainingCount: 22,
      refillReminderEnabled: true,
      refillThreshold: 5,
      status: "Pending",
      takenDates: [],
    },
    {
      id: "m4",
      name: "Atorvastatin",
      dosage: "20 mg",
      type: "Tablet",
      purpose: "Cholesterol Regulation",
      prescribedBy: "Dr. Sharma",
      frequency: "Daily",
      timesPerDay: 1,
      timings: ["09:00 PM"],
      takeWith: "Water",
      foodRelation: "Before Bed",
      instructions: "Take once daily at bedtime.",
      remainingCount: 18,
      refillReminderEnabled: true,
      refillThreshold: 5,
      status: "Pending",
      takenDates: [],
    },
  ]);

  // Form State
  const [formName, setFormName] = useState<string>("");
  const [formDosage, setFormDosage] = useState<string>("500 mg");
  const [formType, setFormType] = useState<string>("Tablet");
  const [formPurpose, setFormPurpose] = useState<string>("");
  const [formDoctor, setFormDoctor] = useState<string>("");
  const [formFrequency, setFormFrequency] = useState<string>("Daily");
  const [formTimesPerDay, setFormTimesPerDay] = useState<number>(1);
  const [formTimings, setFormTimings] = useState<string>("08:00 AM");
  const [formTakeWith, setFormTakeWith] = useState<string>("Water");
  const [formFoodRelation, setFormFoodRelation] = useState<string>("After Food");
  const [formInstructions, setFormInstructions] = useState<string>("");
  const [formRemaining, setFormRemaining] = useState<number>(30);
  const [formRefillThreshold, setFormRefillThreshold] = useState<number>(5);
  const [formSideEffects, setFormSideEffects] = useState<string>("");
  const [formWarnings, setFormWarnings] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");
  const [formPhotoUrl, setFormPhotoUrl] = useState<string | null>(null);
  const [formPrescriptionUrl, setFormPrescriptionUrl] = useState<string | null>(null);

  // OCR Scanner Simulated State
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [isOcrAnalyzing, setIsOcrAnalyzing] = useState<boolean>(false);
  const [ocrResults, setOcrResults] = useState<{
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    doctor: string;
    instructions: string;
    confidence: number;
  } | null>(null);

  // Quick Add State & Feedback banner state
  const [quickMedInput, setQuickMedInput] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Quick Add standard daily medication directly without modal
  const handleQuickAdd = (medName: string, dosage = "1 Tablet / Standard", timing = "08:00 AM") => {
    if (!medName.trim()) return;

    const newMed: DetailedMedicineEntry = {
      id: `med-quick-${Date.now()}`,
      name: medName.trim(),
      dosage: dosage,
      type: "Tablet",
      purpose: "Standard Daily Supplement / Medication",
      prescribedBy: "Self / Family Care",
      frequency: "Daily",
      timesPerDay: 1,
      timings: [timing],
      takeWith: "Water",
      foodRelation: "With Food",
      instructions: "Take once daily with water.",
      remainingCount: 30,
      refillReminderEnabled: true,
      refillThreshold: 5,
      status: "Pending",
      takenDates: [],
    };

    setMedicines(prev => [newMed, ...prev]);

    if (onAddMedication) {
      onAddMedication(patient.id, {
        id: newMed.id,
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency,
        time: timing,
        takenToday: false,
        purpose: newMed.purpose,
      });
    }

    showFeedback(`⚡ Quick Added standard medication: "${medName.trim()}"!`);
  };

  // Aggregated Stats
  const totalMeds = medicines.length;
  const takenMedsCount = medicines.filter((m) => m.status === "Taken").length;
  const pendingMedsCount = medicines.filter((m) => m.status === "Pending").length;
  const missedMedsCount = medicines.filter((m) => m.status === "Missed" || m.status === "Skipped").length;
  const compliancePercentage = totalMeds > 0 ? Math.round((takenMedsCount / totalMeds) * 100) : 100;
  const lowStockMeds = medicines.filter((m) => m.remainingCount <= m.refillThreshold);

  // Handlers
  const handleMarkStatus = (id: string, newStatus: "Taken" | "Pending" | "Skipped" | "Missed") => {
    const todayStr = new Date().toISOString().split("T")[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMedicines(
      medicines.map((m) => {
        if (m.id === id) {
          const isTaking = newStatus === "Taken";
          const updatedCount = isTaking ? Math.max(0, m.remainingCount - 1) : m.remainingCount;
          const updatedDates = isTaking
            ? Array.from(new Set([...m.takenDates, todayStr]))
            : m.takenDates;

          return {
            ...m,
            status: newStatus,
            remainingCount: updatedCount,
            lastTakenTime: isTaking ? nowTimeStr : m.lastTakenTime,
            takenDates: updatedDates,
          };
        }
        return m;
      })
    );

    if (onToggleMedication) {
      onToggleMedication(patient.id, id);
    }

    showFeedback(`Marked dose as ${newStatus}!`);
  };

  const handleFormSubmit = (andAnother: boolean = false) => {
    if (!formName.trim()) {
      showFeedback("Please enter the Medicine Name!");
      return;
    }

    const timingArray = formTimings
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newMed: DetailedMedicineEntry = {
      id: `med-${Date.now()}`,
      name: formName,
      dosage: formDosage,
      type: formType,
      purpose: formPurpose,
      prescribedBy: formDoctor,
      frequency: formFrequency,
      timesPerDay: formTimesPerDay,
      timings: timingArray.length > 0 ? timingArray : ["08:00 AM"],
      takeWith: formTakeWith,
      foodRelation: formFoodRelation,
      instructions: formInstructions,
      remainingCount: formRemaining,
      refillReminderEnabled: true,
      refillThreshold: formRefillThreshold,
      sideEffects: formSideEffects,
      warnings: formWarnings,
      notes: formNotes,
      photoUrl: formPhotoUrl || undefined,
      prescriptionPhotoUrl: formPrescriptionUrl || undefined,
      status: "Pending",
      takenDates: [],
    };

    setMedicines([newMed, ...medicines]);

    if (onAddMedication) {
      onAddMedication(patient.id, {
        id: newMed.id,
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency,
        time: newMed.timings[0] || "08:00 AM",
        takenToday: false,
        purpose: newMed.purpose,
      });
    }

    showFeedback(`Successfully added medication "${formName}"!`);

    if (andAnother) {
      setFormName("");
      setFormPurpose("");
      setFormNotes("");
      setFormPhotoUrl(null);
      setFormPrescriptionUrl(null);
    } else {
      setActiveTab("tracker");
    }
  };

  // Handle Gemini OCR Simulated Processing
  const handleOcrAnalyze = () => {
    if (!ocrImage) {
      showFeedback("Please select or capture a prescription image first.");
      return;
    }

    setIsOcrAnalyzing(true);
    setOcrResults(null);

    setTimeout(() => {
      setIsOcrAnalyzing(false);
      setOcrResults({
        name: "Amoxicillin Trihydrate",
        dosage: "500 mg",
        frequency: "Thrice Daily",
        timing: "08:00 AM, 02:00 PM, 08:00 PM",
        doctor: "Dr. R. K. Gupta (General Physician)",
        instructions: "Take complete 7-day course with full glass of water after food.",
        confidence: 96,
      });
      showFeedback("Gemini AI successfully extracted prescription details!");
    }, 2000);
  };

  const handleApplyOcrResults = () => {
    if (!ocrResults) return;
    setFormName(ocrResults.name);
    setFormDosage(ocrResults.dosage);
    setFormFrequency(ocrResults.frequency);
    setFormDoctor(ocrResults.doctor);
    setFormInstructions(ocrResults.instructions);
    setFormTimings(ocrResults.timing);
    setActiveTab("form");
    showFeedback("Applied extracted prescription values to Add Medicine form!");
  };

  // Filtered List
  const filteredMedicines = medicines.filter((m) => {
    const term = (searchTerm || "").toLowerCase();
    const matchesSearch =
      (m.name || "").toLowerCase().includes(term) ||
      (m.purpose ? m.purpose.toLowerCase().includes(term) : false);
    if (filterCategory === "All") return matchesSearch;
    if (filterCategory === "Pending") return matchesSearch && m.status === "Pending";
    if (filterCategory === "Taken") return matchesSearch && m.status === "Taken";
    if (filterCategory === "Low Stock") return matchesSearch && m.remainingCount <= m.refillThreshold;
    return matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Navigation Sub-Menu Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md">
              <Pill className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Medicine Reminder & OCR
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Smart Pill Schedule, Prescriptions & Refills</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSetupOpen(true)}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-[#2E7D32]/30 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Setup Service Features & Options"
            >
              <Sliders className="w-4 h-4 text-[#2E7D32]" />
              <span className="hidden sm:inline">Setup</span>
            </button>
            <button
              onClick={() => {
                setActiveAlert(true);
                setAlertMessage("💊 Dose Alert: Metformin 500mg is due for dinner!");
              }}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-[#2E7D32]/30 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Simulate Dose Reminder"
            >
              <Bell className="w-4 h-4 text-[#2E7D32] animate-bounce" />
              <span className="hidden sm:inline">Test Alert</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "tracker" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Pill className="w-3.5 h-3.5" /> Today
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "form" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Pill
          </button>
          <button
            onClick={() => setActiveTab("ocr")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "ocr" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Scan className="w-3.5 h-3.5" /> OCR Scan
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "schedule" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <CalendarIcon className="w-3.5 h-3.5" /> Calendar
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "history" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <History className="w-3.5 h-3.5" /> Log
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "achievements" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Award className="w-3.5 h-3.5" /> Streaks
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" /> {feedbackMsg}
          </span>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-700 font-black">✕</button>
        </div>
      )}

      {/* Persistent Active Reminder Alert Card */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-[#1b5e20] via-[#2E7D32] to-[#0f291e] text-white rounded-3xl p-4 shadow-xl border border-emerald-300 relative overflow-hidden animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
                💊
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-white" /> {alertMessage}
                </h3>
                <p className="text-[11px] text-indigo-100 font-medium">
                  Ringtone: {reminderSound} • Vibration: {vibrationEnabled ? "ON" : "OFF"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveAlert(false)}
              className="text-white/80 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/20">
            <button
              onClick={() => {
                if (medicines.length > 0) handleMarkStatus(medicines[0].id, "Taken");
                setActiveAlert(false);
              }}
              className="flex-1 py-2 bg-white text-indigo-900 font-black rounded-xl text-xs shadow-xs hover:bg-indigo-50 cursor-pointer text-center"
            >
              ✅ Mark as Taken Now
            </button>
            <button
              onClick={() => {
                showFeedback("Snoozed dose reminder for 15 minutes.");
                setActiveAlert(false);
              }}
              className="px-3 py-2 bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              ⏰ Snooze 15m
            </button>
          </div>
        </div>
      )}

      {/* Low Stock Warning Banner */}
      {lowStockMeds.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Refill Warning:</strong> {lowStockMeds.map((m) => `${m.name} (${m.remainingCount} pills left)`).join(", ")}
            </span>
          </div>
          <button
            onClick={() => showFeedback("Refill request sent to local pharmacy!")}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold text-[10px] cursor-pointer shadow-2xs"
          >
            Refill Order
          </button>
        </div>
      )}

      {/* ==================== TAB 1: MAIN TODAY'S MEDICATION TRACKER ==================== */}
      {activeTab === "tracker" && (
        <div className="space-y-4">
          {/* Main Compliance Hero Card */}
          <div className="bg-white text-slate-900 border border-[#2E7D32]/20 border-l-4 border-l-[#2E7D32] rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black tracking-wider text-[#2E7D32] uppercase">TODAY'S MEDICINE COMPLIANCE</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{takenMedsCount} / {totalMeds}</span>
                  <span className="text-sm font-bold text-slate-600">doses taken</span>
                </div>
                <p className="text-xs text-slate-500 font-bold pt-0.5">
                  Compliance Rate: <span className="text-[#2E7D32] font-black">{compliancePercentage}%</span> • {pendingMedsCount} pending dose(s)
                </p>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-[#2E7D32] transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 - (compliancePercentage / 100) * (2 * Math.PI * 38)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-base sm:text-lg font-black text-[#2E7D32]">{compliancePercentage}%</span>
              </div>
            </div>

            {/* Quick Next Dose Indicator */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2E7D32]" /> Next Dose: <span className="font-extrabold text-slate-900">08:00 PM (Metformin ER)</span>
              </span>
              <button
                onClick={() => setActiveTab("ocr")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
              >
                <Scan className="w-3 h-3 text-[#2E7D32]" /> Scan Prescription
              </button>
            </div>
          </div>

          {/* Quick Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab("form")}
              className="py-2.5 px-3 bg-[#2E7D32] hover:bg-[#1b5e20] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-white" /> Full Medicine Form
            </button>
            <button
              onClick={() => setActiveTab("ocr")}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-[#2E7D32]/30 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Scan className="w-4 h-4 text-[#2E7D32]" /> Gemini Prescription Scan
            </button>
          </div>

          {/* QUICK ADD STANDARD DAILY MEDICATION SECTION (DIRECT FROM MAIN VIEW WITHOUT MODAL) */}
          <div className="bg-white border border-[#2E7D32]/20 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                    Quick Add Daily Medication
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Instantly add standard daily medications directly from main view without opening modals
                  </p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-100 text-[#2E7D32] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                Direct Add
              </span>
            </div>

            {/* Inline Quick Input & Quick Add Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type medicine name (e.g. Multivitamin, Aspirin)..."
                value={quickMedInput}
                onChange={(e) => setQuickMedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && quickMedInput.trim()) {
                    handleQuickAdd(quickMedInput);
                    setQuickMedInput("");
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
              <button
                onClick={() => {
                  if (quickMedInput.trim()) {
                    handleQuickAdd(quickMedInput);
                    setQuickMedInput("");
                  }
                }}
                className="px-3.5 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-xs shrink-0 flex items-center gap-1.5 active:scale-95"
                title="Quick Add Medication directly from main view"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Quick Add</span>
              </button>
            </div>

            {/* Quick Add Presets Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
              <span className="text-[10px] text-slate-400 font-extrabold shrink-0">Standard Presets:</span>
              <button
                onClick={() => handleQuickAdd("Daily Multivitamin", "1 Tablet")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] rounded-xl border border-[#2E7D32]/20 shrink-0 cursor-pointer transition-all"
              >
                + Multivitamin
              </button>
              <button
                onClick={() => handleQuickAdd("Aspirin 81mg", "1 Tablet")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] rounded-xl border border-[#2E7D32]/20 shrink-0 cursor-pointer transition-all"
              >
                + Aspirin 81mg
              </button>
              <button
                onClick={() => handleQuickAdd("Vitamin D3 1000 IU", "1 Softgel")}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-xl border border-indigo-200/80 dark:border-indigo-800 shrink-0 cursor-pointer transition-all"
              >
                + Vitamin D3
              </button>
              <button
                onClick={() => handleQuickAdd("Omega 3 Fish Oil", "1 Capsule")}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-xl border border-indigo-200/80 dark:border-indigo-800 shrink-0 cursor-pointer transition-all"
              >
                + Omega 3
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medication by name or purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-1.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Taken">Taken</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
          </div>

          {/* Today's Medication Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-indigo-600" /> Scheduled Medications ({filteredMedicines.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">Tap action to log</span>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-white border border-dashed rounded-3xl">
                No medications matched your filter.
              </div>
            ) : (
              filteredMedicines.map((med) => (
                <div
                  key={med.id}
                  className={`bg-white p-4 rounded-3xl border transition-all shadow-xs space-y-3 ${med.status === "Taken" ? "border-emerald-200 bg-emerald-50/20" : med.remainingCount <= med.refillThreshold ? "border-amber-200 bg-amber-50/20" : "border-slate-100"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${med.status === "Taken" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}
                      >
                        💊
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{med.name}</h4>
                          <span className="text-xs font-black bg-indigo-50 border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold pt-0.5">
                          {med.timings.join(", ")} • {med.foodRelation} • {med.takeWith}
                        </p>
                        {med.purpose && (
                          <p className="text-[10px] text-slate-600 font-medium pt-1">
                            🎯 Purpose: {med.purpose}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remaining pill count badge */}
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-1 rounded-full ${med.remainingCount <= med.refillThreshold ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse" : "bg-slate-100 text-slate-700"}`}
                      >
                        {med.remainingCount} left
                      </span>
                    </div>
                  </div>

                  {med.instructions && (
                    <div className="bg-slate-50 p-2.5 rounded-2xl text-[11px] font-bold text-slate-700 border border-slate-100">
                      📋 Instructions: {med.instructions}
                    </div>
                  )}

                  {/* Dose Logging Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400">
                      Status:{" "}
                      <strong
                        className={
                          med.status === "Taken"
                            ? "text-emerald-600"
                            : med.status === "Skipped"
                            ? "text-amber-600"
                            : "text-slate-600"
                        }
                      >
                        {med.status} {med.lastTakenTime ? `(${med.lastTakenTime})` : ""}
                      </strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {med.status !== "Taken" ? (
                        <button
                          onClick={() => handleMarkStatus(med.id, "Taken")}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Taken
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkStatus(med.id, "Pending")}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Reset Status
                        </button>
                      )}

                      <button
                        onClick={() => handleMarkStatus(med.id, "Skipped")}
                        className="py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl text-[11px] cursor-pointer"
                      >
                        Skip
                      </button>

                      <button
                        onClick={() => {
                          setMedicines(medicines.filter((m) => m.id !== med.id));
                          showFeedback(`Removed ${med.name} from list.`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 font-black cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: ADD MEDICINE FORM ==================== */}
      {activeTab === "form" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Add Detailed Medication & Schedule</h2>
              <p className="text-[10px] text-slate-500 font-medium">Specify dosage, timings, refill limits & doctor instructions</p>
            </div>
            <button onClick={() => setActiveTab("tracker")} className="text-xs font-bold text-slate-400 hover:text-slate-700">
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-extrabold text-slate-800 block text-xs mb-1">Medicine Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Lisinopril, Paracetamol"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block text-xs mb-1">Dosage *</label>
                <input
                  type="text"
                  placeholder="e.g., 10 mg, 500 mg, 5 ml"
                  value={formDosage}
                  onChange={(e) => setFormDosage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Medicine Form / Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Tablet">💊 Tablet</option>
                  <option value="Pill">💊 Pill</option>
                  <option value="Capsule">💊 Capsule</option>
                  <option value="Liquid / Syrup">🧪 Liquid / Syrup</option>
                  <option value="Injection">💉 Injection</option>
                  <option value="Drops">💧 Eye / Ear Drops</option>
                  <option value="Inhaler">💨 Inhaler</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Prescribed By Doctor</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Sharma"
                  value={formDoctor}
                  onChange={(e) => setFormDoctor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Medical Purpose / Treatment For</label>
              <input
                type="text"
                placeholder="e.g., High Blood Pressure, Pain Relief, Diabetes"
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            {/* 2. Schedule & Frequency */}
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-3">
              <label className="font-extrabold text-indigo-950 block text-xs">Frequency & Timings *</label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block text-[11px] mb-1">Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Thrice Daily">Thrice Daily</option>
                    <option value="Alternate Days">Alternate Days</option>
                    <option value="As Needed">As Needed (PRN)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block text-[11px] mb-1">Timing Alerts (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="08:00 AM, 08:00 PM"
                    value={formTimings}
                    onChange={(e) => setFormTimings(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block text-[11px] mb-1">Take With</label>
                  <select
                    value={formTakeWith}
                    onChange={(e) => setFormTakeWith(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                  >
                    <option value="Water">💧 Water</option>
                    <option value="Milk">🥛 Milk</option>
                    <option value="Juice">🧃 Juice</option>
                    <option value="Directly">Directly</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block text-[11px] mb-1">Food Relation</label>
                  <select
                    value={formFoodRelation}
                    onChange={(e) => setFormFoodRelation(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl font-bold text-xs"
                  >
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="With Food">With Food</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Refill Inventory & Threshold */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Current Pill Count in Stock</label>
                <input
                  type="number"
                  value={formRemaining}
                  onChange={(e) => setFormRemaining(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs text-center"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">Refill Alert Threshold</label>
                <input
                  type="number"
                  value={formRefillThreshold}
                  onChange={(e) => setFormRefillThreshold(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs text-center"
                />
              </div>
            </div>

            {/* 4. Instructions & Warnings */}
            <div>
              <label className="font-bold text-slate-700 block text-xs mb-1">Special Instructions / Warnings</label>
              <textarea
                rows={2}
                placeholder="e.g., Do not crush tablet, store below 25°C..."
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
              />
            </div>

            {/* 5. Proof Attachment */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-800 text-xs block">📸 Upload Medicine / Prescription Photo</span>
              <div className="grid grid-cols-2 gap-2">
                <label className="p-2.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-bold text-xs text-slate-700 transition-all">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>{formPhotoUrl ? "Pill Photo Attached" : "Pill Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormPhotoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <label className="p-2.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-bold text-xs text-slate-700 transition-all">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>{formPrescriptionUrl ? "Prescription Attached" : "Prescription Slip"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormPrescriptionUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleFormSubmit(false)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Medicine
              </button>

              <button
                type="button"
                onClick={() => handleFormSubmit(true)}
                className="py-3 px-4 bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: GEMINI AI OCR PRESCRIPTION SCANNER ==================== */}
      {activeTab === "ocr" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" /> Gemini AI Prescription OCR Scanner
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Scan handwritten or printed doctor slips to extract details</p>
            </div>
            <button onClick={() => setActiveTab("tracker")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          {/* Photo Capture / Upload Box */}
          <div className="bg-purple-50/50 border-2 border-dashed border-purple-200 rounded-3xl p-6 text-center space-y-3">
            {ocrImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-purple-200 max-h-48 bg-slate-900 flex justify-center">
                <img src={ocrImage} alt="Scanned Prescription" className="h-48 object-contain" />
                <button
                  onClick={() => {
                    setOcrImage(null);
                    setOcrResults(null);
                  }}
                  className="absolute top-2 right-2 bg-slate-900/80 text-white font-bold text-xs w-6 h-6 rounded-full"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-xl">
                  📸
                </div>
                <p className="text-xs font-extrabold text-purple-950">Upload or Capture Doctor Prescription Slip</p>
                <p className="text-[10px] text-slate-500 font-medium">Supports JPG, PNG handwritten or digital prescriptions</p>
              </div>
            )}

            <div className="flex justify-center gap-2 pt-2">
              <label className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Camera className="w-4 h-4" /> Capture Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setOcrImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  // Use a placeholder prescription image demo
                  setOcrImage("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60");
                  showFeedback("Loaded sample prescription slip for demonstration.");
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Use Sample Slip
              </button>
            </div>
          </div>

          {/* Analyze Button */}
          {ocrImage && !ocrResults && (
            <button
              onClick={handleOcrAnalyze}
              disabled={isOcrAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isOcrAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Extract Prescription Details
                </>
              )}
            </button>
          )}

          {/* Extracted Results Panel */}
          {ocrResults && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-3xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Extracted Prescription ({ocrResults.confidence}% AI Confidence)
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Medicine Name</span>
                  <span className="text-sm font-black text-indigo-950">{ocrResults.name}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Dosage</span>
                  <span className="text-sm font-black text-indigo-950">{ocrResults.dosage}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Frequency</span>
                  <span className="text-xs font-extrabold">{ocrResults.frequency}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Timings</span>
                  <span className="text-xs font-extrabold">{ocrResults.timing}</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs font-bold text-slate-800">
                <span className="text-[10px] text-slate-400 block">Prescribing Doctor</span>
                <span>{ocrResults.doctor}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs font-bold text-slate-800">
                <span className="text-[10px] text-slate-400 block">Instructions</span>
                <span>{ocrResults.instructions}</span>
              </div>

              <button
                onClick={handleApplyOcrResults}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Populate Add Medicine Form
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: CALENDAR & SCHEDULE ==================== */}
      {activeTab === "schedule" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Medication Calendar & Weekly Schedule</h2>
              <p className="text-[10px] text-slate-500 font-medium">View medication coverage across the week</p>
            </div>
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border space-y-2">
            <div className="grid grid-cols-7 gap-1 text-center font-black text-[11px] text-slate-600">
              <span>Mon</span>
              <span>Tue</span>
              <span className="text-indigo-600">Wed (Today)</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-xs">
              {["24", "25", "26", "27", "28", "29", "30"].map((d, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl border ${i === 2 ? "bg-indigo-600 text-white border-indigo-700 shadow-xs" : "bg-white text-slate-800"}`}
                >
                  {d}
                  <div className="flex justify-center gap-0.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${i === 2 ? "bg-emerald-300" : "bg-emerald-500"}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${i === 2 ? "bg-amber-300" : "bg-amber-500"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: HISTORY & EXPORT LOG ==================== */}
      {activeTab === "history" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Medication History Log & Reports</h2>
              <p className="text-[10px] text-slate-500 font-medium">Export compliance logs for doctor visits</p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => showFeedback("Exported Medication Log to PDF!")}
                className="p-2 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={() => showFeedback("Exported Medication Log to CSV!")}
                className="p-2 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {medicines.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-slate-900 font-black">{m.name} ({m.dosage})</span>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Status: {m.status} {m.lastTakenTime ? `at ${m.lastTakenTime}` : ""}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${m.status === "Taken" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: ANALYTICS & INSIGHTS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Adherence Analytics & AI Insights</h2>
              <p className="text-[10px] text-slate-500 font-medium">Weekly dose compliance & intake patterns</p>
            </div>
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-2xl border space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-indigo-950">
              <span>Weekly Dose Compliance</span>
              <span className="text-indigo-700 font-extrabold">Overall: 92%</span>
            </div>

            <div className="h-28 flex items-end justify-between gap-2 pt-2">
              {[
                { day: "M", height: "100%", value: "100%" },
                { day: "T", height: "100%", value: "100%" },
                { day: "W", height: "75%", value: "75%", active: true },
                { day: "T", height: "100%", value: "100%" },
                { day: "F", height: "100%", value: "100%" },
                { day: "S", height: "80%", value: "80%" },
                { day: "S", height: "90%", value: "90%" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-bold text-slate-500">{bar.value}</span>
                  <div className="w-full bg-slate-200 rounded-t-lg h-20 relative flex items-end overflow-hidden">
                    <div
                      style={{ height: bar.height }}
                      className={`w-full transition-all rounded-t-lg ${bar.active ? "bg-indigo-600" : "bg-purple-400"}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Gemini AI Doctor Summary
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "You have maintained an excellent 92% dose adherence this week. Remember to request a refill for Metformin ER before Friday as stock is running low."
            </p>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: STREAKS & BADGES ==================== */}
      {activeTab === "achievements" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Medication Streaks & Achievements</h2>
              <p className="text-[10px] text-slate-500 font-medium">Build a habit of on-time dose compliance</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center">
              <span className="text-2xl font-black text-amber-900">7 Days 🔥</span>
              <p className="text-[10px] font-extrabold text-amber-700 uppercase pt-1">CURRENT STREAK</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center">
              <span className="text-2xl font-black text-indigo-900">14 Days 🏆</span>
              <p className="text-[10px] font-extrabold text-indigo-700 uppercase pt-1">LONGEST STREAK</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { title: "First Pill Logged", icon: "💊", unlocked: true },
              { title: "7-Day Perfect Streak", icon: "🔥", unlocked: true },
              { title: "100% Adherence Week", icon: "⭐", unlocked: true },
              { title: "30-Day Master", icon: "🏆", unlocked: false },
              { title: "Prescription OCR Hero", icon: "📸", unlocked: true },
              { title: "Zero Missed Doses", icon: "🏅", unlocked: false },
            ].map((b, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-center space-y-1 ${b.unlocked ? "bg-indigo-50/80 border-indigo-200 text-indigo-900" : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"}`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="text-[11px] font-black">{b.title}</div>
                <span className="text-[9px] font-bold">{b.unlocked ? "Unlocked" : "Locked"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 8: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Medication Settings & Alerts</h2>
              <p className="text-[10px] text-slate-500 font-medium">Configure custom ringtones, vibration & refill limits</p>
            </div>
            <Settings className="w-5 h-5 text-slate-600" />
          </div>

          <div className="space-y-3 text-xs font-bold text-slate-800">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border">
              <div>
                <span>Alert Notifications</span>
                <p className="text-[10px] text-slate-400 font-medium">Receive popups & audio when dose is due</p>
              </div>
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border">
              <div>
                <span>Alert Ringtone Sound</span>
                <p className="text-[10px] text-slate-400 font-medium">Select custom chime audio</p>
              </div>
              <select
                value={reminderSound}
                onChange={(e) => setReminderSound(e.target.value)}
                className="p-1.5 bg-white border rounded-xl font-bold text-xs"
              >
                <option value="Soft Chime">Soft Chime</option>
                <option value="Gentle Bell">Gentle Bell</option>
                <option value="Medical Siren">Medical Siren</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border">
              <div>
                <span>Refill Notice Threshold</span>
                <p className="text-[10px] text-slate-400 font-medium">Alert when remaining pills drop below</p>
              </div>
              <input
                type="number"
                value={refillNoticeThreshold}
                onChange={(e) => setRefillNoticeThreshold(Number(e.target.value))}
                className="w-16 p-1.5 bg-white border rounded-xl text-center font-bold"
              />
            </div>

            <button
              onClick={() => showFeedback("Settings saved successfully!")}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs cursor-pointer shadow-md"
            >
              Save Medication Settings
            </button>
          </div>
        </div>
      )}

      {/* Service Setup Modal */}
      <ServiceSetupModal
        serviceId="medicine"
        serviceName="Medicine Reminder"
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />
    </div>
  );
};
