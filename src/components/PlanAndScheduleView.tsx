import React, { useState } from "react";
import { Patient, Medication } from "../types";
import {
  Calendar as CalendarIcon,
  Clock,
  Camera,
  CheckSquare,
  Sparkles,
  Globe,
  FileText,
  Pill,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Copy,
  Check,
  Bell,
  User,
  ShieldCheck,
  Droplets,
  Volume2
} from "lucide-react";

interface PlanAndScheduleViewProps {
  patient: Patient;
  onAddMedication: (patientId: string, med: Medication) => void;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  assignedTo: string;
  status: "Done" | "Upcoming" | "Scheduled";
  priority: "Normal" | "High" | "Urgent";
  soundAlert: string;
}

interface TaskItem {
  id: string;
  title: string;
  time: string;
  assignedStaff: string;
  completed: boolean;
  proofUrl: string | null;
}

export const PlanAndScheduleView: React.FC<PlanAndScheduleViewProps> = ({
  patient,
  onAddMedication,
}) => {
  const [activeTab, setActiveTab] = useState<"schedule" | "tasks" | "meds" | "calendars" | "timetable">("schedule");

  // Time Table Creator States
  const [ttTargetAccount, setTtTargetAccount] = useState<"Kids Sub-Account" | "Elderly & Senior Care" | "Staff & Duty Caregivers" | "Family Member" | "Personal Self">("Kids Sub-Account");
  const [ttTitle, setTtTitle] = useState<string>("Kids Daily School & Habit Routine");
  const [ttScheduleType, setTtScheduleType] = useState<string>("Monday - Friday");
  const [ttFeedback, setTtFeedback] = useState<string | null>(null);

  const [ttSlots, setTtSlots] = useState<Array<{ id: string; time: string; activity: string; category: string; target: string; alertSound: string }>>([
    { id: "tt1", time: "07:00 AM", activity: "Morning Wake Up & Brush Teeth", category: "Hygiene", target: "Kids Sub-Account", alertSound: "Morning Alarm" },
    { id: "tt2", time: "08:00 AM", activity: "Nutritional Breakfast & School Bag Check", category: "Meal & Prep", target: "Kids Sub-Account", alertSound: "Gentle Chime" },
    { id: "tt3", time: "03:30 PM", activity: "Afternoon Snack & Reading Session", category: "Education", target: "Kids Sub-Account", alertSound: "Bell" },
    { id: "tt4", time: "05:00 PM", activity: "Outdoor Play & Exercise", category: "Physical Activity", target: "Kids Sub-Account", alertSound: "Whistle" },
    { id: "tt5", time: "08:30 PM", activity: "Night Bedtime & Sleep Story", category: "Rest & Sleep", target: "Kids Sub-Account", alertSound: "Lullaby" },
  ]);

  const [newSlotTime, setNewSlotTime] = useState<string>("10:00 AM");
  const [newSlotActivity, setNewSlotActivity] = useState<string>("");
  const [newSlotCategory, setNewSlotCategory] = useState<string>("General");

  // Camera & OCR Scan states
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [medInputMode, setMedInputMode] = useState<"ocr" | "manual">("ocr");

  // Manual Medicine Filler States
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("500 mg");
  const [medFrequency, setMedFrequency] = useState("Twice Daily");
  const [medTime, setMedTime] = useState("08:00 AM");
  const [medGapHours, setMedGapHours] = useState("4");
  const [medType, setMedType] = useState("Tablet");
  const [medMethod, setMedMethod] = useState("With Water");
  const [medFood, setMedFood] = useState("After Meal");
  const [medPurpose, setMedPurpose] = useState("Blood Pressure Control");
  const [medWarnings, setMedWarnings] = useState("Do not take on empty stomach.");

  // Schedule Items State
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: "s1", time: "08:00 AM", title: "Morning Water & Lisinopril Medication", assignedTo: patient.name, status: "Done", priority: "High", soundAlert: "Gentle Bell" },
    { id: "s2", time: "12:30 PM", title: "Nutritional Lunch & Hydration Log", assignedTo: "Caregiver Staff", status: "Upcoming", priority: "Normal", soundAlert: "Chime" },
    { id: "s3", time: "05:00 PM", title: "Evening Vitals Logging & Light Walk", assignedTo: "Family Member", status: "Scheduled", priority: "Normal", soundAlert: "Beep Alarm" },
  ]);

  // Tasks & Proof States
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "t1", title: "Morning Hydration & Vitals Check", time: "08:00 AM", assignedStaff: "Nurse Sarah", completed: true, proofUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
    { id: "t2", title: "Administer Post-Op Analgesic", time: "12:00 PM", assignedStaff: "Caregiver John", completed: false, proofUrl: null },
    { id: "t3", title: "Physiotherapy Light Stretching", time: "04:30 PM", assignedStaff: "Physio Staff", completed: false, proofUrl: null },
  ]);

  // Modals Visibility
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // New Schedule Form State
  const [schTitle, setSchTitle] = useState("");
  const [schTime, setSchTime] = useState("09:00 AM");
  const [schAssignee, setSchAssignee] = useState("Caregiver Staff");
  const [schPriority, setSchPriority] = useState<ScheduleItem["priority"]>("Normal");
  const [schSound, setSchSound] = useState("Gentle Bell");

  // New Task Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState("02:00 PM");
  const [taskStaff, setTaskStaff] = useState("Caregiver Staff");

  // Calendar converter states
  const [gregorianInput, setGregorianInput] = useState<string>("2026-07-26");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Handle OCR Scan
  const handleSimulateOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/gemini/analyze-medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || "image/jpeg",
          }),
        });
        const data = await res.json();
        setScanResult(data);

        if (data.medicineName) {
          const newMed: Medication = {
            id: "m-" + Date.now(),
            name: data.medicineName,
            dosage: data.dosage || "As Directed",
            frequency: data.frequency || "Daily",
            time: data.timing || "08:00 AM",
            takenToday: false,
            purpose: data.purpose,
            warnings: data.warnings,
          };
          onAddMedication(patient.id, newMed);
        }
      } catch (err) {
        console.error("Scan error:", err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Manual Medicine Filler
  const handleManualMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    const newMed: Medication = {
      id: "m-" + Date.now(),
      name: medName,
      dosage: medDosage,
      frequency: medFrequency,
      time: medTime,
      takenToday: false,
      purpose: `${medPurpose} (${medMethod}, ${medFood})`,
      warnings: medWarnings,
    };

    onAddMedication(patient.id, newMed);
    alert(`Added ${medName} to ${patient.name}'s medications!`);
    setMedName("");
  };

  // Submit New Schedule Form
  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schTitle) return;

    const newItem: ScheduleItem = {
      id: "sch-" + Date.now(),
      time: schTime,
      title: schTitle,
      assignedTo: schAssignee,
      status: "Scheduled",
      priority: schPriority,
      soundAlert: schSound,
    };

    setSchedules((prev) => [newItem, ...prev]);
    setIsAddScheduleOpen(false);
    setSchTitle("");
  };

  // Toggle Schedule Status
  const toggleScheduleStatus = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === "Done" ? "Scheduled" : "Done";
        return { ...s, status: nextStatus };
      })
    );
  };

  // Submit New Task Form
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: TaskItem = {
      id: "t-" + Date.now(),
      title: taskTitle,
      time: taskTime,
      assignedStaff: taskStaff,
      completed: false,
      proofUrl: null,
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsAddTaskOpen(false);
    setTaskTitle("");
  };

  // Calendar options calculation based on gregorianInput
  const calendarOptions = [
    { name: "Gregorian", value: gregorianInput },
    { name: "Nepali (Vikram Sambat)", value: "2083 Shrawan 11" },
    { name: "Newari (Nepal Sambat)", value: "1146 Chhoya 15" },
    { name: "Chinese Lunar", value: "Year of the Horse (6th Month 13th Day)" },
    { name: "Islamic (Hijri)", value: "1448 Safar 12" },
    { name: "Hebrew (Jewish)", value: "5786 Av 13" },
    { name: "Ethiopian", value: "2018 Hamle 19" },
    { name: "Persian (Solar Hijri)", value: "1405 Mordad 4" },
    { name: "Julian Calendar", value: "2026 July 13" },
    { name: "Coptic Calendar", value: "1742 Mesori 19" },
    { name: "Mayan Long Count", value: "13.0.13.11.9" },
  ];

  const handleCopyCalendar = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" /> Plan & Schedule
        </h1>
        <p className="text-xs text-slate-500">
          Reminders, task proof of work, medicine OCR scanner, and multi-cultural calendars.
        </p>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "schedule" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📅 Schedule
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "tasks" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📋 Tasks & Proof
        </button>
        <button
          onClick={() => setActiveTab("meds")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "meds" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          💊 Pill Scanner & Setup
        </button>
        <button
          onClick={() => setActiveTab("calendars")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "calendars" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🌐 40+ Calendars
        </button>
        <button
          onClick={() => setActiveTab("timetable")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "timetable" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          ⏰ Time Table Creator
        </button>
      </div>

      {/* TAB 1: Schedule */}
      {activeTab === "schedule" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Today's Home Care Agenda</h3>
            <button
              onClick={() => setIsAddScheduleOpen(true)}
              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Schedule
            </button>
          </div>

          <div className="space-y-2">
            {schedules.map((sch) => (
              <div
                key={sch.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center text-xs font-extrabold ${
                      sch.status === "Done"
                        ? "bg-emerald-50 text-emerald-700"
                        : sch.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <span>{sch.time}</span>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${sch.status === "Done" ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {sch.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Assigned: {sch.assignedTo}</span>
                      <span>• Sound: {sch.soundAlert}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleScheduleStatus(sch.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                    sch.status === "Done"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {sch.status === "Done" ? "Done" : "Mark Done"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Tasks & Proof of Work */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Staff & Caregiver Tasks (Proof of Work)
            </h3>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className={`w-4 h-4 ${task.completed ? "text-emerald-500" : "text-slate-300"}`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                      <p className="text-[10px] text-slate-400">{task.time} • Staff: {task.assignedStaff}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      task.completed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.completed ? "Verified Complete" : "Pending Proof"}
                  </span>
                </div>

                {task.proofUrl ? (
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <img src={task.proofUrl} alt="Proof" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Photo Proof Uploaded & Encrypted
                    </span>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Upload Photo Proof of Work</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: true, proofUrl: url } : t));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Pill Photo Scanner & Custom Medicine Setup */}
      {activeTab === "meds" && (
        <div className="space-y-4">
          {/* Picker Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setMedInputMode("ocr")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                medInputMode === "ocr" ? "bg-white text-purple-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📸 AI Prescription Scanner
            </button>
            <button
              onClick={() => setMedInputMode("manual")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                medInputMode === "manual" ? "bg-white text-purple-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✍️ Manual Custom Medicine Filler
            </button>
          </div>

          {medInputMode === "ocr" ? (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-5 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                  <h3 className="text-sm font-bold">AI Medicine Box & Prescription Scanner</h3>
                </div>
                <p className="text-xs text-purple-100">
                  Snap a photo of any medicine bottle or doctor prescription. Gemini AI will extract the medicine name, dosage, frequency, and warnings automatically!
                </p>

                <label className="bg-white text-purple-900 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:bg-purple-50 transition-all cursor-pointer">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span>{isScanning ? "Analyzing Pill Photo with AI..." : "Snap/Upload Prescription Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulateOCR}
                    disabled={isScanning}
                    className="hidden"
                  />
                </label>
              </div>

              {scanResult && (
                <div className="bg-white border border-emerald-200 rounded-3xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> AI OCR Analysis Complete
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p><strong>Medicine Name:</strong> {scanResult.medicineName}</p>
                    <p><strong>Dosage:</strong> {scanResult.dosage}</p>
                    <p><strong>Frequency:</strong> {scanResult.frequency}</p>
                    <p><strong>Timing:</strong> {scanResult.timing}</p>
                    <p><strong>Purpose:</strong> {scanResult.purpose}</p>
                    <p className="text-amber-800 bg-amber-50 p-2 rounded-xl"><strong>Warnings:</strong> {scanResult.warnings}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MANUAL CUSTOM MEDICINE FILLER FORM */
            <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-800">Custom Medicine & Prescription Setup</h3>
              </div>

              <form onSubmit={handleManualMedicineSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g., Amoxicillin)"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 500 mg)"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  />
                  <select
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Thrice Daily">Thrice Daily</option>
                    <option value="Every 4 Hours">Every 4 Hours</option>
                    <option value="As Needed">As Needed / SOS</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Scheduled Time</label>
                    <input
                      type="text"
                      placeholder="08:00 AM"
                      value={medTime}
                      onChange={(e) => setMedTime(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Time Gap (Hours)</label>
                    <input
                      type="number"
                      value={medGapHours}
                      onChange={(e) => setMedGapHours(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={medType}
                    onChange={(e) => setMedType(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="Tablet">Tablet / Pill</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Liquid Syrup">Liquid Syrup</option>
                    <option value="Drops">Eye/Ear Drops</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Injection">Injection</option>
                  </select>

                  <select
                    value={medMethod}
                    onChange={(e) => setMedMethod(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="With Water">With Water</option>
                    <option value="With Milk">With Milk</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                    <option value="With Meal">With Meal</option>
                  </select>
                </div>

                <textarea
                  placeholder="Purpose or Doctor Notes..."
                  value={medPurpose}
                  onChange={(e) => setMedPurpose(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save Medicine Record
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: 40+ Calendar Converter */}
      {activeTab === "calendars" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">40+ Multi-Cultural Calendar System Converter</h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Select Gregorian Date</label>
              <input
                type="date"
                value={gregorianInput}
                onChange={(e) => setGregorianInput(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div className="space-y-2 pt-2">
              {calendarOptions.map((cal, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">{cal.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {cal.value}
                    </span>
                    <button
                      onClick={() => handleCopyCalendar(`${cal.name}: ${cal.value}`, idx)}
                      className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Copy Date"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD SCHEDULE ITEM */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" /> Add Agenda Reminders
              </h3>
              <button onClick={() => setIsAddScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScheduleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Agenda Title (e.g. Afternoon Vitals Log)"
                value={schTitle}
                onChange={(e) => setSchTitle(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Scheduled Time</label>
                  <input
                    type="text"
                    value={schTime}
                    onChange={(e) => setSchTime(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Assigned Person</label>
                  <input
                    type="text"
                    value={schAssignee}
                    onChange={(e) => setSchAssignee(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Priority Level</label>
                  <select
                    value={schPriority}
                    onChange={(e: any) => setSchPriority(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400">Sound Alarm</label>
                  <select
                    value={schSound}
                    onChange={(e) => setSchSound(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  >
                    <option value="Gentle Bell">Gentle Bell</option>
                    <option value="Chime">Soft Chime</option>
                    <option value="Beep Alarm">Beep Alarm</option>
                    <option value="Voice Reminder">Voice Reminder</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Save Schedule Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: Time Table Creator for Sub-Accounts */}
      {activeTab === "timetable" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-400/30">
                  Universal Time Table Generator
                </span>
                <h2 className="text-lg font-black text-white mt-1">Multi-Account Master Time Table</h2>
                <p className="text-xs text-indigo-200 font-medium">
                  Create, assign & sync daily time tables for Kids, Elderly, Staff & Family sub-accounts.
                </p>
              </div>

              <button
                onClick={() => {
                  setTtFeedback(`Published "${ttTitle}" to ${ttTargetAccount}! Sync notification sent to sub-account.`);
                  setTimeout(() => setTtFeedback(null), 4000);
                }}
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Publish to Sub-Account
              </button>
            </div>

            {ttFeedback && (
              <div className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 p-2.5 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in">
                <span>✓ {ttFeedback}</span>
                <button onClick={() => setTtFeedback(null)} className="text-white font-black">✕</button>
              </div>
            )}

            {/* Target Account Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
              <div>
                <label className="font-bold text-indigo-200 block mb-1">Target Account / Role *</label>
                <select
                  value={ttTargetAccount}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setTtTargetAccount(val);
                    if (val === "Kids Sub-Account") {
                      setTtTitle("Kids Daily School & Habit Routine");
                    } else if (val === "Elderly & Senior Care") {
                      setTtTitle("Senior Care Vitals & Daily Routine");
                    } else if (val === "Staff & Duty Caregivers") {
                      setTtTitle("Nurses & Staff Duty Shift Schedule");
                    } else {
                      setTtTitle("Personal / Family Master Plan");
                    }
                  }}
                  className="w-full p-2.5 bg-slate-800 border border-indigo-400/40 rounded-xl font-bold text-white"
                >
                  <option value="Kids Sub-Account">👶 Kids Sub-Account</option>
                  <option value="Elderly & Senior Care">👴 Elderly & Senior Care</option>
                  <option value="Staff & Duty Caregivers">👨‍⚕️ Staff & Duty Caregivers</option>
                  <option value="Family Member">🏠 Family Member</option>
                  <option value="Personal Self">👤 Personal Self</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-indigo-200 block mb-1">Time Table Title</label>
                <input
                  type="text"
                  value={ttTitle}
                  onChange={(e) => setTtTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-indigo-400/40 rounded-xl font-bold text-white"
                />
              </div>

              <div>
                <label className="font-bold text-indigo-200 block mb-1">Schedule Frequency</label>
                <select
                  value={ttScheduleType}
                  onChange={(e) => setTtScheduleType(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-indigo-400/40 rounded-xl font-bold text-white"
                >
                  <option value="Monday - Friday">Monday - Friday (School/Work)</option>
                  <option value="Weekend Special">Weekend Special</option>
                  <option value="7-Day Full Week">7-Day Full Week</option>
                  <option value="Rotational Shift">Rotational Shift</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preset Template Quick-Load Buttons */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-black text-slate-800 block">⚡ Quick Load Preset Time Table Templates</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setTtTargetAccount("Kids Sub-Account");
                  setTtTitle("Kids School & Study Time Table");
                  setTtSlots([
                    { id: "tt1", time: "07:00 AM", activity: "Wake up & Morning Hydration", category: "Hygiene", target: "Kids Sub-Account", alertSound: "Morning Chime" },
                    { id: "tt2", time: "08:30 AM", activity: "School Classes / Online Study", category: "Education", target: "Kids Sub-Account", alertSound: "School Bell" },
                    { id: "tt3", time: "01:30 PM", activity: "Nutritional Lunch & Break", category: "Meal", target: "Kids Sub-Account", alertSound: "Gentle Chime" },
                    { id: "tt4", time: "04:00 PM", activity: "Homework & Creative Drawing", category: "Education", target: "Kids Sub-Account", alertSound: "Bell" },
                    { id: "tt5", time: "06:00 PM", activity: "Outdoor Sports / Swimming", category: "Fitness", target: "Kids Sub-Account", alertSound: "Whistle" },
                    { id: "tt6", time: "08:30 PM", activity: "Bedtime Story & Night Sleep", category: "Rest", target: "Kids Sub-Account", alertSound: "Lullaby" },
                  ]);
                }}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-xl cursor-pointer"
              >
                👶 Kids Routine Template
              </button>

              <button
                onClick={() => {
                  setTtTargetAccount("Elderly & Senior Care");
                  setTtTitle("Senior Care Vitals & Pill Schedule");
                  setTtSlots([
                    { id: "tt10", time: "08:00 AM", activity: "Morning Lisinopril Medication & Vitals Check", category: "Medical", target: "Elderly & Senior Care", alertSound: "Beep Alarm" },
                    { id: "tt11", time: "10:30 AM", activity: "Guided Garden Walk & Sunlight Session", category: "Exercise", target: "Elderly & Senior Care", alertSound: "Gentle Bell" },
                    { id: "tt12", time: "01:00 PM", activity: "Low Sodium Lunch & Afternoon Hydration", category: "Meal", target: "Elderly & Senior Care", alertSound: "Chime" },
                    { id: "tt13", time: "05:00 PM", activity: "Evening Blood Sugar & BP Log", category: "Vitals", target: "Elderly & Senior Care", alertSound: "Beep Alarm" },
                    { id: "tt14", time: "08:30 PM", activity: "Night Time Medication & Rest", category: "Rest", target: "Elderly & Senior Care", alertSound: "Soft Bell" },
                  ]);
                }}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold rounded-xl cursor-pointer"
              >
                👴 Senior Vitals Routine
              </button>

              <button
                onClick={() => {
                  setTtTargetAccount("Staff & Duty Caregivers");
                  setTtTitle("Nurse Duty & Care Shift Plan");
                  setTtSlots([
                    { id: "tt20", time: "08:00 AM", activity: "Shift Handover & Morning Vitals Inspection", category: "Duty", target: "Staff & Duty Caregivers", alertSound: "Beep Alarm" },
                    { id: "tt21", time: "12:00 PM", activity: "Medication Administration & Proof Upload", category: "Medical", target: "Staff & Duty Caregivers", alertSound: "Chime" },
                    { id: "tt22", time: "04:00 PM", activity: "Senior Hygiene & Rehabilitation Exercises", category: "Care", target: "Staff & Duty Caregivers", alertSound: "Bell" },
                    { id: "tt23", time: "08:00 PM", activity: "Evening Log Submission & Night Duty Handover", category: "Admin", target: "Staff & Duty Caregivers", alertSound: "Whistle" },
                  ]);
                }}
                className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold rounded-xl cursor-pointer"
              >
                👨‍⚕️ Staff Shift Template
              </button>
            </div>
          </div>

          {/* Add Slot Form */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-black text-slate-900 block">+ Add Time Slot to Time Table</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-bold">
              <div>
                <label className="text-slate-600 block mb-0.5">Time Slot *</label>
                <input
                  type="text"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  placeholder="e.g. 09:30 AM"
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-600 block mb-0.5">Activity Description *</label>
                <input
                  type="text"
                  value={newSlotActivity}
                  onChange={(e) => setNewSlotActivity(e.target.value)}
                  placeholder="e.g. Math homework or Vitals check"
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-0.5">Category</label>
                <select
                  value={newSlotCategory}
                  onChange={(e) => setNewSlotCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl font-bold"
                >
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Meal">Meal</option>
                  <option value="Hygiene">Hygiene</option>
                  <option value="Rest">Rest</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newSlotActivity.trim()) return;
                const newSlot = {
                  id: `tt-${Date.now()}`,
                  time: newSlotTime,
                  activity: newSlotActivity,
                  category: newSlotCategory,
                  target: ttTargetAccount,
                  alertSound: "Chime",
                };
                setTtSlots([...ttSlots, newSlot]);
                setNewSlotActivity("");
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Time Slot
            </button>
          </div>

          {/* Time Table Slots List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-xs">
                Active Time Table: {ttTitle} ({ttSlots.length} Slots)
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 font-extrabold px-2.5 py-0.5 rounded-full">
                Assigned to: {ttTargetAccount}
              </span>
            </div>

            <div className="space-y-2">
              {ttSlots.map((slot) => (
                <div key={slot.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <span className="py-1 px-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black">
                      {slot.time}
                    </span>
                    <div>
                      <h4 className="font-black text-slate-900">{slot.activity}</h4>
                      <p className="text-[10px] text-slate-500 font-bold">
                        Category: {slot.category} • Target: {slot.target} • Alert: {slot.alertSound}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setTtSlots(ttSlots.filter((s) => s.id !== slot.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" /> Add Caregiver Task
              </h3>
              <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Task Description"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Due Time</label>
                  <input
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Assigned Staff</label>
                  <input
                    type="text"
                    value={taskStaff}
                    onChange={(e) => setTaskStaff(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Save Caregiver Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
