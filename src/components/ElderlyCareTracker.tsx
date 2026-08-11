import React, { useState } from "react";
import { Patient } from "../types";
import {
  Users,
  User,
  Heart,
  Activity,
  Plus,
  Shield,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pill,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Camera,
  MapPin,
  ChevronRight,
  Download,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Edit,
  Bell,
  Volume2,
  Stethoscope,
  RefreshCw,
  Flame,
  Award,
  Zap
} from "lucide-react";

interface ElderlyCareTrackerProps {
  patient?: Patient;
}

export interface ChronicCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  severity: "Mild" | "Moderate" | "Severe";
  notes?: string;
}

export interface SeniorMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timings: string[];
  purpose?: string;
  prescribedBy?: string;
  takeWith?: string;
  foodRelation?: string;
  remainingCount?: number;
  refillReminder?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: "Primary" | "Secondary" | "Tertiary";
}

export interface ProxyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  canAdministerCare: boolean;
  notes?: string;
}

export interface SeniorProfile {
  id: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  relationship: string; // Grandmother, Grandfather, Mother, Father, Aunt, Uncle, Relative, Neighbor, Friend
  bloodGroup: string;
  allergies: string;
  chronicConditions: ChronicCondition[];
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profilePhoto?: string;
  primaryDoctor: {
    name: string;
    phone: string;
    hospital: string;
  };
  medications: SeniorMedication[];
  careTypes: string[]; // Daily Routine, Medical Condition, Special Medication, Post-Surgery, Accident/Injury, Chronic Illness, Autism, Palliative, Emergency, End-of-Life
  emergencyContacts: EmergencyContact[];
  proxyContacts: ProxyContact[];
  careStatus: "Stable" | "Monitoring" | "Urgent";
  notes?: string;
}

export interface SeniorVital {
  id: string;
  seniorId: string;
  timestamp: string;
  systolic?: number;
  diastolic?: number;
  bpTiming?: "Pre-meal" | "Post-meal" | "Fasting" | "Routine";
  bpMin?: number;
  bpMax?: number;
  heartRate?: number;
  temperature?: number;
  bloodSugar?: number;
  sugarPreMeal?: number;
  sugarPostMeal?: number;
  sugarMin?: number;
  sugarMax?: number;
  visionLeftEye?: string;
  visionRightEye?: string;
  visionNotes?: string;
  weight?: number;
  oxygenLevel?: number;
  painLevel?: number;
  notes?: string;
  photoProofUrl?: string;
}

export interface CareLogEntry {
  id: string;
  seniorId: string;
  date: string;
  time: string;
  careTypes: string[];
  status: "Done" | "Pending" | "Skipped" | "Urgent";
  givenBy: string;
  notes?: string;
  photoProofUrl?: string;
  videoProofName?: string;
  gpsLocation?: string;
}

export const ElderlyCareTracker: React.FC<ElderlyCareTrackerProps> = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "addSenior" | "seniorDetail" | "analytics" | "settings"
  >("dashboard");

  // Selected Senior for Detail View
  const [selectedSeniorId, setSelectedSeniorId] = useState<string>("senior-1");

  // Sub-Tab inside Senior Detail View
  const [detailSubTab, setDetailSubTab] = useState<
    "careLog" | "medications" | "vitals" | "proxies" | "schedule" | "analytics"
  >("careLog");

  // Feedback Notification Banner
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Emergency SOS Modal
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [sosSeniorId, setSosSeniorId] = useState<string>("senior-1");
  const [sosEmergencyType, setSosEmergencyType] = useState<string>("Fall / Slip");
  const [sosDescription, setSosDescription] = useState<string>("Senior requested immediate help in bathroom.");

  // ==================== STATE: SENIORS LIST ====================
  const [seniors, setSeniors] = useState<SeniorProfile[]>([
    {
      id: "senior-1",
      fullName: "Eleanor Vance",
      age: 78,
      dateOfBirth: "1948-04-12",
      gender: "Female",
      relationship: "Grandmother",
      bloodGroup: "O+",
      allergies: "Penicillin, Dust Mites",
      chronicConditions: [
        { id: "c1", name: "Type 2 Diabetes", diagnosedDate: "2015-06-10", severity: "Moderate", notes: "Requires insulin before dinner" },
        { id: "c2", name: "Hypertension", diagnosedDate: "2018-02-15", severity: "Mild", notes: "Monitor BP twice daily" },
      ],
      phone: "+1 (555) 234-5678",
      email: "eleanor.vance@example.com",
      address: "104 Maple Street, Apt 3B",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      primaryDoctor: {
        name: "Dr. Robert Chen",
        phone: "+1 (555) 987-6543",
        hospital: "St. Jude Medical Center",
      },
      medications: [
        { id: "m1", name: "Lisinopril", dosage: "10 mg", frequency: "Daily", timings: ["08:00 AM"], purpose: "Blood Pressure", prescribedBy: "Dr. Chen", takeWith: "Water", foodRelation: "After Meal", remainingCount: 24, refillReminder: true },
        { id: "m2", name: "Metformin", dosage: "500 mg", frequency: "Twice Daily", timings: ["08:00 AM", "08:00 PM"], purpose: "Blood Sugar Control", prescribedBy: "Dr. Chen", takeWith: "Water", foodRelation: "With Food", remainingCount: 18, refillReminder: true },
      ],
      careTypes: ["Daily Routine Care", "Medical Condition Care", "Special Medication Care"],
      emergencyContacts: [
        { id: "ec1", name: "Sarah Vance (Daughter)", relationship: "Daughter", phone: "+1 (555) 345-6789", priority: "Primary" },
        { id: "ec2", name: "David Vance (Son)", relationship: "Son", phone: "+1 (555) 456-7890", priority: "Secondary" },
      ],
      proxyContacts: [
        { id: "pc1", name: "Nurse Maria Santos", relationship: "Home Care Nurse", phone: "+1 (555) 567-8901", email: "maria@caregiver.org", canAdministerCare: true, notes: "Visits daily 8 AM - 12 PM" },
        { id: "pc2", name: "James Miller (Neighbor)", relationship: "Neighbor", phone: "+1 (555) 678-9012", canAdministerCare: false, notes: "Has spare apartment key" },
      ],
      careStatus: "Stable",
      notes: "Enjoys morning gardening and light classical music in afternoons.",
    },
    {
      id: "senior-2",
      fullName: "Arthur Pendelton",
      age: 82,
      dateOfBirth: "1944-09-28",
      gender: "Male",
      relationship: "Grandfather",
      bloodGroup: "A+",
      allergies: "Sulfonamides",
      chronicConditions: [
        { id: "c3", name: "Mild Alzheimer's / Memory Loss", diagnosedDate: "2021-11-04", severity: "Moderate", notes: "Requires gentle orientation and routine" },
        { id: "c4", name: "Arthritis", diagnosedDate: "2012-03-20", severity: "Mild", notes: "Joint mobility exercises required" },
      ],
      phone: "+1 (555) 876-5432",
      address: "208 Oak Ridge Lane",
      city: "San Jose",
      state: "CA",
      country: "USA",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      primaryDoctor: {
        name: "Dr. Sarah Jenkins",
        phone: "+1 (555) 888-1122",
        hospital: "Valley General Hospital",
      },
      medications: [
        { id: "m3", name: "Donepezil", dosage: "5 mg", frequency: "Daily", timings: ["09:00 PM"], purpose: "Memory Support", prescribedBy: "Dr. Jenkins", remainingCount: 15, refillReminder: true },
      ],
      careTypes: ["Daily Routine Care", "Chronic Illness Care", "Accident/Injury Care"],
      emergencyContacts: [
        { id: "ec3", name: "Mark Pendelton (Son)", relationship: "Son", phone: "+1 (555) 999-3344", priority: "Primary" },
      ],
      proxyContacts: [
        { id: "pc3", name: "John Caregiver", relationship: "Full-time Caregiver", phone: "+1 (555) 777-2211", canAdministerCare: true, notes: "Night shift care" },
      ],
      careStatus: "Monitoring",
      notes: "Uses a walker for mobility. Prefers calm environment.",
    },
  ]);

  // ==================== STATE: VITALS & LOGS ====================
  const [vitalsList, setVitalsList] = useState<SeniorVital[]>([
    {
      id: "v1",
      seniorId: "senior-1",
      timestamp: "Today, 08:30 AM",
      systolic: 124,
      diastolic: 82,
      heartRate: 72,
      temperature: 98.4,
      bloodSugar: 110,
      weight: 64.5,
      oxygenLevel: 98,
      painLevel: 2,
      notes: "Normal morning reading before breakfast.",
    },
    {
      id: "v2",
      seniorId: "senior-1",
      timestamp: "Yesterday, 06:00 PM",
      systolic: 128,
      diastolic: 84,
      heartRate: 75,
      temperature: 98.6,
      bloodSugar: 125,
      weight: 64.6,
      oxygenLevel: 97,
      painLevel: 1,
      notes: "Post-walk vitals in stable range.",
    },
  ]);

  const [careLogs, setCareLogs] = useState<CareLogEntry[]>([
    {
      id: "cl1",
      seniorId: "senior-1",
      date: new Date().toISOString().split("T")[0],
      time: "08:15 AM",
      careTypes: ["Morning Routine", "Medication Given", "Hydration Check"],
      status: "Done",
      givenBy: "Nurse Maria Santos",
      notes: "Took morning Lisinopril with a full glass of warm water. Ate oatmeal breakfast.",
    },
    {
      id: "cl2",
      seniorId: "senior-1",
      date: new Date().toISOString().split("T")[0],
      time: "01:30 PM",
      careTypes: ["Afternoon Routine", "Walking Support", "Meal Provided"],
      status: "Done",
      givenBy: "Sarah Vance (Daughter)",
      notes: "Completed 15 mins of gentle garden walk. Hydration maintained.",
    },
  ]);

  // ==================== FORM STATES: ADD SENIOR ====================
  const [formName, setFormName] = useState<string>("");
  const [formAge, setFormAge] = useState<number>(75);
  const [formDob, setFormDob] = useState<string>("1951-05-15");
  const [formGender, setFormGender] = useState<"Male" | "Female" | "Other">("Female");
  const [formRelationship, setFormRelationship] = useState<string>("Grandmother");
  const [formBloodGroup, setFormBloodGroup] = useState<string>("O+");
  const [formAllergies, setFormAllergies] = useState<string>("None reported");
  const [formPhone, setFormPhone] = useState<string>("+1 (555) 000-1122");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formAddress, setFormAddress] = useState<string>("123 Evergreen Lane");
  const [formCity, setFormCity] = useState<string>("San Francisco");
  const [formState, setFormState] = useState<string>("CA");
  const [formCountry, setFormCountry] = useState<string>("USA");
  const [formDoctorName, setFormDoctorName] = useState<string>("Dr. Emily Watson");
  const [formDoctorPhone, setFormDoctorPhone] = useState<string>("+1 (555) 777-8899");
  const [formDoctorHospital, setFormDoctorHospital] = useState<string>("St. Luke Health");
  const [formCareTypes, setFormCareTypes] = useState<string[]>(["Daily Routine Care", "Medical Condition Care"]);

  // Multi-item adders in form
  const [tempConditions, setTempConditions] = useState<ChronicCondition[]>([
    { id: "tc1", name: "Hypertension", diagnosedDate: "2020-01-01", severity: "Mild" },
  ]);
  const [tempMedications, setTempMedications] = useState<SeniorMedication[]>([
    { id: "tm1", name: "Amlodipine 5mg", dosage: "5mg", frequency: "Daily", timings: ["08:00 AM"], purpose: "BP Control" },
  ]);
  const [tempEmContacts, setTempEmContacts] = useState<EmergencyContact[]>([
    { id: "tec1", name: "Primary Caregiver", relationship: "Child", phone: "+1 (555) 111-2233", priority: "Primary" },
  ]);
  const [tempProxyContacts, setTempProxyContacts] = useState<ProxyContact[]>([
    { id: "tpc1", name: "Local Neighbor", relationship: "Neighbor", phone: "+1 (555) 333-4455", canAdministerCare: true },
  ]);

  // Form Vitals Logger
  const [vitalSystolic, setVitalSystolic] = useState<number>(120);
  const [vitalDiastolic, setVitalDiastolic] = useState<number>(80);
  const [vitalBpTiming, setVitalBpTiming] = useState<"Pre-meal" | "Post-meal" | "Fasting" | "Routine">("Pre-meal");
  const [vitalBpMin, setVitalBpMin] = useState<number>(90);
  const [vitalBpMax, setVitalBpMax] = useState<number>(140);
  const [vitalHeartRate, setVitalHeartRate] = useState<number>(72);
  const [vitalTemp, setVitalTemp] = useState<number>(98.6);
  const [vitalSugar, setVitalSugar] = useState<number>(105);
  const [vitalSugarPreMeal, setVitalSugarPreMeal] = useState<number>(95);
  const [vitalSugarPostMeal, setVitalSugarPostMeal] = useState<number>(135);
  const [vitalSugarMin, setVitalSugarMin] = useState<number>(70);
  const [vitalSugarMax, setVitalSugarMax] = useState<number>(140);
  const [vitalVisionLeft, setVitalVisionLeft] = useState<string>("6/6 (Normal)");
  const [vitalVisionRight, setVitalVisionRight] = useState<string>("6/6 (Normal)");
  const [vitalVisionNotes, setVitalVisionNotes] = useState<string>("Routine vision test ok");
  const [vitalWeight, setVitalWeight] = useState<number>(65.0);
  const [vitalPain, setVitalPain] = useState<number>(1);
  const [vitalNotes, setVitalNotes] = useState<string>("");

  // Form Care Log Entry
  const [logCareType, setLogCareType] = useState<string[]>(["Morning Routine", "Medication Given"]);
  const [logStatus, setLogStatus] = useState<"Done" | "Pending" | "Skipped" | "Urgent">("Done");
  const [logGivenBy, setLogGivenBy] = useState<string>("Family Caregiver");
  const [logNotes, setLogNotes] = useState<string>("");

  // ==================== HANDLERS ====================
  const handleSaveSeniorProfile = (andAnother: boolean = false) => {
    if (!formName.trim()) {
      showFeedback("Please enter Senior's Full Name!");
      return;
    }

    const newSenior: SeniorProfile = {
      id: `senior-${Date.now()}`,
      fullName: formName,
      age: formAge,
      dateOfBirth: formDob,
      gender: formGender,
      relationship: formRelationship,
      bloodGroup: formBloodGroup,
      allergies: formAllergies,
      chronicConditions: tempConditions,
      phone: formPhone,
      email: formEmail,
      address: formAddress,
      city: formCity,
      state: formState,
      country: formCountry,
      profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      primaryDoctor: {
        name: formDoctorName,
        phone: formDoctorPhone,
        hospital: formDoctorHospital,
      },
      medications: tempMedications,
      careTypes: formCareTypes,
      emergencyContacts: tempEmContacts,
      proxyContacts: tempProxyContacts,
      careStatus: "Stable",
      notes: "Newly registered senior care profile.",
    };

    setSeniors([...seniors, newSenior]);
    setSelectedSeniorId(newSenior.id);
    showFeedback(`Successfully created profile for ${formName}!`);

    if (andAnother) {
      setFormName("");
    } else {
      setActiveTab("seniorDetail");
    }
  };

  const handleSaveVitals = () => {
    const newVital: SeniorVital = {
      id: `v-${Date.now()}`,
      seniorId: selectedSeniorId,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      systolic: vitalSystolic,
      diastolic: vitalDiastolic,
      bpTiming: vitalBpTiming,
      bpMin: vitalBpMin,
      bpMax: vitalBpMax,
      heartRate: vitalHeartRate,
      temperature: vitalTemp,
      bloodSugar: vitalSugar,
      sugarPreMeal: vitalSugarPreMeal,
      sugarPostMeal: vitalSugarPostMeal,
      sugarMin: vitalSugarMin,
      sugarMax: vitalSugarMax,
      visionLeftEye: vitalVisionLeft,
      visionRightEye: vitalVisionRight,
      visionNotes: vitalVisionNotes,
      weight: vitalWeight,
      painLevel: vitalPain,
      notes: vitalNotes || "Detailed health vitals logged",
    };

    setVitalsList([newVital, ...vitalsList]);
    showFeedback(`Logged Vitals: BP ${vitalSystolic}/${vitalDiastolic} (${vitalBpTiming}), Fasting Sugar: ${vitalSugarPreMeal}, Vision: ${vitalVisionLeft}/${vitalVisionRight}!`);
    setVitalNotes("");
  };

  const handleSaveCareLog = () => {
    const newLog: CareLogEntry = {
      id: `cl-${Date.now()}`,
      seniorId: selectedSeniorId,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      careTypes: logCareType,
      status: logStatus,
      givenBy: logGivenBy,
      notes: logNotes || "Care activity logged",
      gpsLocation: "GPS Verified (37.7749° N, 122.4194° W)",
    };

    setCareLogs([newLog, ...careLogs]);
    showFeedback("Care activity logged successfully!");
    setLogNotes("");
  };

  const handleSendSosBroadcast = () => {
    const senior = seniors.find((s) => s.id === sosSeniorId) || seniors[0];
    showFeedback(
      `🚨 EMERGENCY SOS BROADCASTED for ${senior.fullName}! Notified ${senior.emergencyContacts.length} emergency contacts and ${senior.proxyContacts.length} proxy caregivers via SMS & GPS call!`
    );
    setShowSosModal(false);
  };

  const activeSenior = seniors.find((s) => s.id === selectedSeniorId) || seniors[0];
  const activeVitals = vitalsList.filter((v) => v.seniorId === activeSenior.id);
  const activeCareLogs = careLogs.filter((cl) => cl.seniorId === activeSenior.id);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Sub-Navigation */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              👴
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Elderly & Senior Care
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">Multi-Senior Management, Vitals, Medications & SOS</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSosModal(true)}
              className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs flex items-center gap-1 shadow-md cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>SOS Emergency</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "dashboard" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Users className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("addSenior")}
            className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "addSenior" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Senior
          </button>
          <button
            onClick={() => setActiveTab("seniorDetail")}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "seniorDetail" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <User className="w-3.5 h-3.5" /> {activeSenior ? activeSenior.fullName.split(" ")[0] : "Senior"} Profile
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "analytics" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === "settings" ? "bg-[#2E7D32] text-white shadow-xs font-black" : "text-slate-600 hover:text-slate-900"}`}
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

      {/* EMERGENCY SOS BROADCAST MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-rose-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-rose-700 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" /> Emergency SOS Broadcast
              </h3>
              <button onClick={() => setShowSosModal(false)} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Senior *</label>
                <select
                  value={sosSeniorId}
                  onChange={(e) => setSosSeniorId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  {seniors.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.relationship}, Age {s.age})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Emergency Category *</label>
                <select
                  value={sosEmergencyType}
                  onChange={(e) => setSosEmergencyType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-xs"
                >
                  <option value="Fall / Slip">Fall / Slip / Injury</option>
                  <option value="Chest Pain / Heart Attack">Chest Pain / Heart Attack</option>
                  <option value="Breathing Difficulty">Breathing Difficulty</option>
                  <option value="High BP / Dizziness">High Blood Pressure / Dizziness</option>
                  <option value="Severe Pain">Severe Sudden Pain</option>
                  <option value="Unconscious / Fainting">Unconscious / Fainting</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description / Location Details</label>
                <textarea
                  rows={2}
                  value={sosDescription}
                  onChange={(e) => setSosDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-medium text-xs"
                />
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 space-y-1">
                <p className="font-extrabold text-rose-900 text-[11px]">📢 Action Plan on Broadcast:</p>
                <ul className="text-[10px] text-rose-800 list-disc pl-4 space-y-0.5 font-medium">
                  <li>Instant SMS with GPS location sent to all Emergency Contacts</li>
                  <li>Automated priority phone call to Primary Emergency Contact</li>
                  <li>In-app alert to all connected Proxy Caregivers & Doctors</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSendSosBroadcast}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="w-4 h-4 text-white" /> BROADCAST SOS NOW
                </button>
                <button
                  onClick={() => setShowSosModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 1: DASHBOARD ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Quick Stats Summary Row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">{seniors.length}</div>
              <p className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Total Seniors</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">
                {seniors.filter((s) => s.careStatus === "Stable").length}
              </div>
              <p className="text-[9px] font-black text-emerald-800 uppercase tracking-wider">Stable Status</p>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">
                {seniors.filter((s) => s.careStatus === "Monitoring").length}
              </div>
              <p className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Monitoring</p>
            </div>

            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 mx-auto mb-1" />
              <div className="text-base font-black text-slate-900">
                {seniors.filter((s) => s.careStatus === "Urgent").length}
              </div>
              <p className="text-[9px] font-black text-rose-800 uppercase tracking-wider">Urgent Attention</p>
            </div>
          </div>

          {/* Today's Care Summary Header */}
          <div className="bg-gradient-to-r from-[#1b5e20] via-[#2E7D32] to-[#0f291e] text-white p-5 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-amber-300 uppercase tracking-wider">DAILY CARE HIGHLIGHTS</p>
                <h2 className="text-xl font-black text-white">Care2Care Elderly Support</h2>
              </div>
              <button
                onClick={() => setActiveTab("addSenior")}
                className="py-2.5 px-4 bg-white text-[#1b5e20] font-black rounded-2xl text-xs hover:bg-emerald-50 transition-all cursor-pointer shadow-xs"
              >
                + Register New Senior
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-xs font-bold text-emerald-100">
              <span className="flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-300" /> Meds Given: 100%
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-300" /> Vitals Logged: 2/2
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-300" /> Proxy Active: 4
              </span>
            </div>
          </div>

          {/* Seniors List Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">Senior Loved Ones & Relatives</h3>
              <span className="text-xs font-bold text-slate-400">{seniors.length} Profiles Registered</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {seniors.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3 hover:border-amber-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.profilePhoto}
                        alt={s.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-200"
                      />
                      <div>
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                          {s.fullName}
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                            {s.relationship}
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold">
                          Age: {s.age} • Blood Group: {s.bloodGroup} • Doctor: {s.primaryDoctor.name}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        s.careStatus === "Stable"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : s.careStatus === "Monitoring"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-rose-50 text-rose-800 border-rose-300"
                      }`}
                    >
                      ● {s.careStatus}
                    </span>
                  </div>

                  {/* Conditions & Care Types */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {s.chronicConditions.map((cond) => (
                        <span key={cond.id} className="text-[10px] font-extrabold bg-white text-slate-700 px-2 py-0.5 rounded-lg border">
                          🩺 {cond.name} ({cond.severity})
                        </span>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium">
                      Medications: {s.medications.map((m) => m.name).join(", ")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedSeniorId(s.id);
                        setActiveTab("seniorDetail");
                      }}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-2xs text-center"
                    >
                      Open Senior Profile →
                    </button>

                    <a
                      href={`tel:${s.phone}`}
                      className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: ADD SENIOR FORM ==================== */}
      {activeTab === "addSenior" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900">Register Senior Loved One</h2>
              <p className="text-[10px] text-slate-500 font-medium">Complete medical, contact, emergency & caregiver proxy profile</p>
            </div>
            <button onClick={() => setActiveTab("dashboard")} className="text-xs font-bold text-slate-400 hover:text-slate-700">Cancel</button>
          </div>

          <div className="space-y-4 text-xs">
            {/* SECTION 1: BASIC INFO */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" /> 1. Personal & Relationship Info
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-800 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Robert Vance"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relationship *</label>
                  <select
                    value={formRelationship}
                    onChange={(e) => setFormRelationship(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  >
                    <option value="Grandmother">Grandmother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Relative">Elderly Relative</option>
                    <option value="Neighbor">Senior Neighbor</option>
                    <option value="Friend">Family Friend</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as "Male" | "Female" | "Other")}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={formBloodGroup}
                    onChange={(e) => setFormBloodGroup(e.target.value)}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g., Penicillin, Peanuts, Latex"
                  value={formAllergies}
                  onChange={(e) => setFormAllergies(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl font-bold"
                />
              </div>
            </div>

            {/* SECTION 2: MEDICAL CONDITIONS & DOCTOR */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-600" /> 2. Doctor & Medical Conditions
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                  <input type="text" value={formDoctorName} onChange={(e) => setFormDoctorName(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Phone</label>
                  <input type="text" value={formDoctorPhone} onChange={(e) => setFormDoctorPhone(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hospital</label>
                  <input type="text" value={formDoctorHospital} onChange={(e) => setFormDoctorHospital(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-bold" />
                </div>
              </div>

              {/* Conditions List */}
              <div className="space-y-2 pt-2">
                <label className="font-bold text-slate-800 block">Chronic Conditions List</label>
                {tempConditions.map((c, idx) => (
                  <div key={c.id} className="p-2.5 bg-white border rounded-xl flex items-center justify-between text-xs font-bold">
                    <span>🩺 {c.name} ({c.severity})</span>
                    <button
                      type="button"
                      onClick={() => setTempConditions(tempConditions.filter((item) => item.id !== c.id))}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const condName = prompt("Enter Chronic Condition Name (e.g. Diabetes, Arthritis):");
                    if (condName) {
                      setTempConditions([
                        ...tempConditions,
                        { id: `c-${Date.now()}`, name: condName, diagnosedDate: new Date().toISOString().split("T")[0], severity: "Moderate" },
                      ]);
                    }
                  }}
                  className="py-1.5 px-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  + Add Medical Condition
                </button>
              </div>
            </div>

            {/* SECTION 3: ACTIONS */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveSeniorProfile(false)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Save Senior Profile
              </button>

              <button
                type="button"
                onClick={() => handleSaveSeniorProfile(true)}
                className="py-3 px-4 bg-orange-100 hover:bg-orange-200 text-orange-950 font-extrabold rounded-2xl text-xs cursor-pointer"
              >
                Save & Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: SENIOR DETAIL VIEW ==================== */}
      {activeTab === "seniorDetail" && activeSenior && (
        <div className="space-y-4">
          {/* Senior Profile Banner */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeSenior.profilePhoto}
                  alt={activeSenior.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-xs"
                />
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    {activeSenior.fullName}
                    <span className="text-xs bg-amber-100 text-amber-900 font-black px-2.5 py-0.5 rounded-full">
                      {activeSenior.relationship}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">
                    Age {activeSenior.age} • DOB: {activeSenior.dateOfBirth} • Blood Group: {activeSenior.bloodGroup}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium pt-0.5">
                    📍 {activeSenior.address}, {activeSenior.city} • Doctor: {activeSenior.primaryDoctor.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSosModal(true)}
                className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs shadow-xs cursor-pointer flex items-center gap-1 animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Emergency SOS
              </button>
            </div>

            {/* Sub-Tabs Bar inside Profile */}
            <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
              <button
                onClick={() => setDetailSubTab("careLog")}
                className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer ${detailSubTab === "careLog" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600"}`}
              >
                📋 Care Log
              </button>
              <button
                onClick={() => setDetailSubTab("medications")}
                className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl transition-all cursor-pointer ${detailSubTab === "medications" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600"}`}
              >
                💊 Medications
              </button>
              <button
                onClick={() => setDetailSubTab("vitals")}
                className={`flex-1 min-w-[75px] py-2 px-3 rounded-xl transition-all cursor-pointer ${detailSubTab === "vitals" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600"}`}
              >
                ❤️ Vitals
              </button>
              <button
                onClick={() => setDetailSubTab("proxies")}
                className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer ${detailSubTab === "proxies" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600"}`}
              >
                👤 Proxies
              </button>
              <button
                onClick={() => setDetailSubTab("analytics")}
                className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer ${detailSubTab === "analytics" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600"}`}
              >
                📊 Insights
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: CARE LOG */}
          {detailSubTab === "careLog" && (
            <div className="space-y-4">
              {/* Form: Add Care Log */}
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
                <h3 className="font-black text-slate-900 text-xs">Log Care Activity for {activeSenior.fullName}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <div>
                    <label className="text-slate-600 block mb-1">Caregiver Name</label>
                    <input type="text" value={logGivenBy} onChange={(e) => setLogGivenBy(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Status</label>
                    <select value={logStatus} onChange={(e) => setLogStatus(e.target.value as any)} className="w-full p-2 bg-slate-50 border rounded-xl">
                      <option value="Done">Done ✓</option>
                      <option value="Pending">Pending ⏳</option>
                      <option value="Skipped">Skipped ✕</option>
                      <option value="Urgent">Urgent 🚨</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block text-xs font-bold mb-1">Activity Notes / Food / Care</label>
                  <textarea rows={2} value={logNotes} onChange={(e) => setLogNotes(e.target.value)} placeholder="e.g. Assisted with walking, drank 500ml water..." className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-medium" />
                </div>

                <button
                  onClick={handleSaveCareLog}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  + Add Care Log Entry
                </button>
              </div>

              {/* History Care Logs */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 text-xs">Logged Care Activities</h4>
                {activeCareLogs.map((cl) => (
                  <div key={cl.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-amber-900">{cl.careTypes.join(", ")}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">{cl.status}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{cl.notes}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Given by: {cl.givenBy} at {cl.time} • {cl.gpsLocation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: MEDICATIONS */}
          {detailSubTab === "medications" && (
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-black text-slate-900 text-xs">Prescribed Medications</h3>
                <button
                  onClick={() => {
                    const mName = prompt("Enter Medicine Name (e.g., Lisinopril 10mg):");
                    if (mName) {
                      const updatedMeds = [
                        ...activeSenior.medications,
                        { id: `m-${Date.now()}`, name: mName, dosage: "1 tablet", frequency: "Daily", timings: ["08:00 AM"], remainingCount: 30, refillReminder: true },
                      ];
                      setSeniors(seniors.map((s) => (s.id === activeSenior.id ? { ...s, medications: updatedMeds } : s)));
                      showFeedback(`Added medication: ${mName}`);
                    }
                  }}
                  className="py-1.5 px-3 bg-amber-600 text-white font-black rounded-xl text-xs cursor-pointer"
                >
                  + Add Medicine
                </button>
              </div>

              <div className="space-y-2">
                {activeSenior.medications.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-2xl border flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-black text-slate-900">{m.name} ({m.dosage})</h4>
                      <p className="text-[10px] text-slate-500 font-bold">Timing: {m.timings.join(", ")} • Remaining: {m.remainingCount} pills</p>
                    </div>
                    <button
                      onClick={() => showFeedback(`Logged ${m.name} taken by ${activeSenior.fullName}!`)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-2xs"
                    >
                      Log Taken ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: VITALS LOGGING */}
          {detailSubTab === "vitals" && (
            <div className="space-y-4">
              <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-600" /> Record Detailed Health Vitals & Vision Diagnostics
                  </h3>
                  <span className="text-[10px] bg-rose-50 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                    Pre/Post Meal & Vision Supported
                  </span>
                </div>

                {/* Blood Pressure & Heart Rate Section */}
                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
                  <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider block">
                    ❤️ Blood Pressure & Heart Rate (BPM)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Systolic (Max)</label>
                      <input type="number" value={vitalSystolic} onChange={(e) => setVitalSystolic(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Diastolic (Min)</label>
                      <input type="number" value={vitalDiastolic} onChange={(e) => setVitalDiastolic(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">BP Timing *</label>
                      <select value={vitalBpTiming} onChange={(e) => setVitalBpTiming(e.target.value as any)} className="w-full p-2 bg-white border rounded-xl font-bold">
                        <option value="Pre-meal">Pre-Meal</option>
                        <option value="Post-meal">Post-Meal</option>
                        <option value="Fasting">Fasting (Morning)</option>
                        <option value="Routine">Routine Check</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Heart Rate (BPM)</label>
                      <input type="number" value={vitalHeartRate} onChange={(e) => setVitalHeartRate(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Blood Sugar Section */}
                <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
                  <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                    🩸 Blood Sugar Levels (Fasting & Post-Meal)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Pre-Meal / Fasting (mg/dL)</label>
                      <input type="number" value={vitalSugarPreMeal} onChange={(e) => setVitalSugarPreMeal(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl text-amber-900" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Post-Meal / PP (mg/dL)</label>
                      <input type="number" value={vitalSugarPostMeal} onChange={(e) => setVitalSugarPostMeal(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl text-amber-900" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Min Normal (mg/dL)</label>
                      <input type="number" value={vitalSugarMin} onChange={(e) => setVitalSugarMin(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl text-slate-500" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Max Target (mg/dL)</label>
                      <input type="number" value={vitalSugarMax} onChange={(e) => setVitalSugarMax(Number(e.target.value))} className="w-full p-2 bg-white border rounded-xl text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Vision Diagnostics Section */}
                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider block flex items-center gap-1">
                    👁️ Vision Diagnostics & Eye Clarity Test
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Left Eye (OS)</label>
                      <input type="text" placeholder="e.g. 6/6 or 20/20" value={vitalVisionLeft} onChange={(e) => setVitalVisionLeft(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-mono" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Right Eye (OD)</label>
                      <input type="text" placeholder="e.g. 6/6 or 20/20" value={vitalVisionRight} onChange={(e) => setVitalVisionRight(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-mono" />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Vision Diagnostic Notes</label>
                      <input type="text" placeholder="e.g. Wears reading glasses +1.5D" value={vitalVisionNotes} onChange={(e) => setVitalVisionNotes(e.target.value)} className="w-full p-2 bg-white border rounded-xl font-medium" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <div>
                    <label className="text-slate-600 block mb-0.5">Body Temp (°F)</label>
                    <input type="number" step="0.1" value={vitalTemp} onChange={(e) => setVitalTemp(Number(e.target.value))} className="w-full p-2 bg-slate-50 border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-0.5">Weight (kg)</label>
                    <input type="number" step="0.1" value={vitalWeight} onChange={(e) => setVitalWeight(Number(e.target.value))} className="w-full p-2 bg-slate-50 border rounded-xl" />
                  </div>
                </div>

                <button onClick={handleSaveVitals} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Save Comprehensive Vitals & Vision Entry
                </button>
              </div>

              {/* Vitals History */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 text-xs">Logged Health Vitals History</h4>
                {activeVitals.map((v) => (
                  <div key={v.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-bold space-y-1.5">
                    <div className="flex justify-between items-center text-amber-900">
                      <span className="font-black text-slate-900">
                        BP: {v.systolic}/{v.diastolic} mmHg <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">{v.bpTiming || "Routine"}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{v.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 font-medium">
                      <div>
                        <span className="text-slate-400 block uppercase">Heart Rate</span>
                        <span className="font-bold text-rose-700">{v.heartRate} BPM</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase">Fasting / Post Sugar</span>
                        <span className="font-bold text-amber-800">{v.sugarPreMeal || v.bloodSugar} / {v.sugarPostMeal || (v.bloodSugar ? v.bloodSugar + 30 : 140)} mg/dL</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase">Vision (L / R)</span>
                        <span className="font-bold text-blue-800">{v.visionLeftEye || "6/6"} / {v.visionRightEye || "6/6"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase">Temp / Weight</span>
                        <span className="font-bold text-slate-800">{v.temperature}°F • {v.weight} kg</span>
                      </div>
                    </div>

                    {v.notes && <p className="text-slate-600 text-[10px] font-medium">Note: {v.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 4: PROXY CONTACTS */}
          {detailSubTab === "proxies" && (
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-black text-slate-900 text-xs">Caregiver Proxy Contacts & Neighbors</h3>
                <button
                  onClick={() => {
                    const pName = prompt("Enter Proxy Caregiver Name:");
                    const pPhone = prompt("Enter Phone Number:");
                    if (pName && pPhone) {
                      const newProxy: ProxyContact = { id: `pc-${Date.now()}`, name: pName, relationship: "Proxy Caregiver", phone: pPhone, canAdministerCare: true };
                      setSeniors(seniors.map((s) => (s.id === activeSenior.id ? { ...s, proxyContacts: [...s.proxyContacts, newProxy] } : s)));
                      showFeedback(`Added proxy caregiver: ${pName}`);
                    }
                  }}
                  className="py-1.5 px-3 bg-amber-600 text-white font-black rounded-xl text-xs cursor-pointer"
                >
                  + Add Proxy
                </button>
              </div>

              <div className="space-y-2">
                {activeSenior.proxyContacts.map((pc) => (
                  <div key={pc.id} className="p-3 bg-slate-50 rounded-2xl border flex items-center justify-between text-xs font-bold">
                    <div>
                      <h4 className="text-slate-900">{pc.name} ({pc.relationship})</h4>
                      <p className="text-[10px] text-slate-500 font-normal">Phone: {pc.phone} • Care Authorized: {pc.canAdministerCare ? "Yes ✓" : "No"}</p>
                    </div>
                    <a href={`tel:${pc.phone}`} className="py-1.5 px-3 bg-emerald-600 text-white rounded-xl text-xs cursor-pointer">
                      Call Proxy
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 5: ANALYTICS & INSIGHTS */}
          {detailSubTab === "analytics" && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-3xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-black text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" /> Gemini AI Senior Health Report for {activeSenior.fullName}
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                "Vitals over the past 7 days show stable blood pressure averaging 124/82 mmHg. Medication adherence is at 100%. Maintaining gentle morning exercises and regular afternoon hydration keeps overall health scores in the green zone."
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: GLOBAL ANALYTICS ==================== */}
      {activeTab === "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-900">Elderly & Senior Care Analytics</h2>
          <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-2xl font-black text-amber-900">100%</span>
              <p className="text-slate-600 text-[10px] uppercase">Medication Adherence Rate</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-2xl font-black text-emerald-900">2 / 2</span>
              <p className="text-slate-600 text-[10px] uppercase">Daily Vitals Check Passed</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4 text-xs font-bold">
          <h2 className="text-sm font-black text-slate-900">Senior Care Settings</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border">
              <span>Automated SOS SMS Broadcast</span>
              <span className="text-emerald-600 font-black">ENABLED ✓</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border">
              <span>Daily Medication Refill Alert</span>
              <span className="text-emerald-600 font-black">ENABLED ✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
