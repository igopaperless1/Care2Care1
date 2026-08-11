import React, { useState } from "react";
import { Patient, VitalSign } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import {
  TrendingUp,
  Droplets,
  ArrowRight,
  Activity,
  Pill,
  ListTodo,
  Moon,
  Smile,
  Sparkles,
  RefreshCw,
  HeartPulse,
  Brain,
  Check,
  X,
  Plus,
  Clock,
  Footprints,
  Flame,
  CheckCircle2,
  FileText,
  Mic,
  UserPlus,
  Download
} from "lucide-react";
import { VitalsTrendChart } from "./VitalsTrendChart";
import { FamilyInviteModal } from "./FamilyInviteModal";
import { VoiceAssistantModal } from "./VoiceAssistantModal";
import { generatePatientPDFReport } from "../lib/pdfReportGenerator";

interface TrackProgressViewProps {
  patient: Patient;
  onNavigateToWater: () => void;
  onNavigateToSubTab?: (subTab: string) => void;
  onToggleMedication?: (patientId: string, medId: string) => void;
  onAddVitalSign?: (patientId: string, vital: VitalSign) => void;
  onUpdateSleep?: (patientId: string, sleepHours: number) => void;
  onUpdateMood?: (patientId: string, mood: Patient["mood"]) => void;
  onUpdateCaregiverNotes?: (patientId: string, notes: string) => void;
}

export const TrackProgressView: React.FC<TrackProgressViewProps> = ({
  patient,
  onNavigateToWater,
  onNavigateToSubTab,
  onToggleMedication,
  onAddVitalSign,
  onUpdateSleep,
  onUpdateMood,
  onUpdateCaregiverNotes,
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [clinicalInsight, setClinicalInsight] = useState<string>(
    "Drinking water consistently throughout the day can improve your focus by up to 15%."
  );
  const [actionableTip, setActionableTip] = useState<string>(
    "Hydrating within 30 minutes of waking optimizes metabolic rate."
  );
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showWaterChart, setShowWaterChart] = useState(false);

  const get7DayWaterData = () => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayLabel = i === 0 ? "Today" : d.toLocaleDateString(undefined, { weekday: "short" });
      const dateStr = d.toLocaleDateString();

      let logSum = 0;
      if (patient.waterLogs && patient.waterLogs.length > 0) {
        logSum = patient.waterLogs
          .filter((l) => {
            if (!l.time && !l.timestamp) return false;
            const logDate = l.timestamp ? new Date(l.timestamp).toLocaleDateString() : "";
            return logDate === dateStr;
          })
          .reduce((acc, l) => acc + (l.amountMl || 0), 0);
      }

      if (logSum === 0) {
        if (i === 0) {
          logSum = patient.waterCurrentMl || 1500;
        } else {
          const seed = (patient.name.length + i * 350) % 750;
          logSum = Math.max(800, (patient.waterGoalMl || 2000) - 450 + seed);
        }
      }

      days.push({
        day: dayLabel,
        intake: logSum,
        goal: patient.waterGoalMl || 2000,
      });
    }
    return days;
  };

  // Exercise State
  const [exerciseLog, setExerciseLog] = useState<{
    activity: string;
    durationMins: number;
    steps: number;
    completed: boolean;
  }>({
    activity: "Morning Walk",
    durationMins: 20,
    steps: 4200,
    completed: true,
  });

  // Tasks Checklist State
  const [careTasks, setCareTasks] = useState([
    { id: "ct1", title: "Morning Hydration & Hydrate 500ml", time: "08:00 AM", done: true },
    { id: "ct2", title: "Post-Op Analgesic & Light Stretch", time: "12:00 PM", done: false },
    { id: "ct3", title: "Evening Vitals Logging & Tea", time: "05:00 PM", done: false },
  ]);

  // Modal Visibility States
  const [activeModal, setActiveModal] = useState<"exercise" | "vitals" | "sleep" | "mood" | "tasks" | null>(null);

  // Form States for Modals
  // 1. Exercise Form
  const [exActivity, setExActivity] = useState("Walking / Light Jog");
  const [exDuration, setExDuration] = useState("25");
  const [exSteps, setExSteps] = useState("4500");
  const [exIntensity, setExIntensity] = useState("Moderate");

  // 2. Vitals Form
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [heartRate, setHeartRate] = useState("72");
  const [spO2, setSpO2] = useState("98");
  const [temp, setTemp] = useState("98.6");
  const [sugar, setSugar] = useState("105");

  // 3. Sleep Form
  const [sleepVal, setSleepVal] = useState(patient.sleepHours ? String(patient.sleepHours) : "7.5");
  const [sleepQuality, setSleepQuality] = useState("Restful & Deep");

  // 4. Mood Form
  const [selectedMood, setSelectedMood] = useState<Patient["mood"]>(patient.mood || "Calm");
  const [moodNotes, setMoodNotes] = useState("");

  // 5. Custom Task Form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("02:00 PM");

  const percentage = Math.min(100, Math.round((patient.waterCurrentMl / patient.waterGoalMl) * 100));

  const handleFetchAiInsight = async () => {
    setIsLoadingInsight(true);
    try {
      const res = await fetch("/api/gemini/clinical-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waterIntake: patient.waterCurrentMl,
          goal: patient.waterGoalMl,
          mood: patient.mood,
          sleepHours: patient.sleepHours,
          medsTaken: patient.medications.filter((m) => m.takenToday).length,
          totalMeds: patient.medications.length,
          patientType: patient.category,
        }),
      });
      const data = await res.json();
      if (data.insight) setClinicalInsight(data.insight);
      if (data.actionableTip) setActionableTip(data.actionableTip);
    } catch {
      setClinicalInsight("Balanced hydration and regular movement reduce joint strain and support cardiovascular health.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExerciseLog({
      activity: exActivity,
      durationMins: parseInt(exDuration, 10) || 20,
      steps: parseInt(exSteps, 10) || 3000,
      completed: true,
    });
    setActiveModal(null);
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddVitalSign) {
      const newVital: VitalSign = {
        id: "vital-" + Date.now(),
        timestamp: Date.now(),
        dateStr: "Just now",
        bloodPressureSystolic: parseInt(systolic, 10) || 120,
        bloodPressureDiastolic: parseInt(diastolic, 10) || 80,
        heartRateBpm: parseInt(heartRate, 10) || 72,
        spO2Percent: parseInt(spO2, 10) || 98,
        temperatureF: parseFloat(temp) || 98.6,
        bloodSugarMgDl: parseInt(sugar, 10) || 100,
      };
      onAddVitalSign(patient.id, newVital);
    }
    setActiveModal(null);
  };

  const handleSleepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = parseFloat(sleepVal) || 7.5;
    if (onUpdateSleep) {
      onUpdateSleep(patient.id, hrs);
    }
    setActiveModal(null);
  };

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateMood) {
      onUpdateMood(patient.id, selectedMood);
    }
    setActiveModal(null);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setCareTasks((prev) => [
      ...prev,
      {
        id: "task-" + Date.now(),
        title: newTaskTitle,
        time: newTaskTime || "12:00 PM",
        done: false,
      },
    ]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setCareTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const latestVital = patient.vitals[0] || {
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRateBpm: 72,
    spO2Percent: 98,
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Headline & Quick Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Track Your Progress</h1>
          </div>
          <p className="text-xs text-slate-500">
            Stay on top of daily wellness goals for <span className="font-bold text-slate-800">{patient.name}</span>.
          </p>
        </div>

        {/* Action Buttons: Voice Assistant, Invite Family, Export PDF */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-200" />
            <span>Voice Assistant</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Invite Family</span>
          </button>

          <button
            onClick={() => generatePatientPDFReport(patient)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Hydration Station Card */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-5 space-y-4 shadow-xs relative">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-2xs border border-emerald-100">
            <Droplets className="w-5 h-5 fill-emerald-500" />
          </div>
          <button
            onClick={onNavigateToWater}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 flex items-center justify-center border border-emerald-100 shadow-2xs transition-transform active:scale-95 cursor-pointer"
            title="Open Hydration Details"
          >
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-600">Hydration Station</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {patient.waterCurrentMl}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ {patient.waterGoalMl} ml</span>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-emerald-100/80 rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800">
            <span className="bg-emerald-100/90 text-emerald-800 px-2 py-0.5 rounded-md uppercase text-[9px] tracking-wider">
              ACTIVE GOAL
            </span>
            <span>{percentage}% Completed</span>
          </div>
        </div>

        {/* Generate Recharts Water Intake Line Chart Button */}
        <button
          onClick={() => setShowWaterChart(!showWaterChart)}
          className="w-full py-2.5 px-3 bg-white hover:bg-emerald-100/70 border border-emerald-200/90 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          {showWaterChart ? "Hide 7-Day Water Chart" : "Generate 7-Day Water Intake Line Chart"}
        </button>

        {/* Recharts 7-Day Water Intake Line Chart Visualization */}
        {showWaterChart && (
          <div className="bg-white p-4 rounded-2xl border border-emerald-100/90 shadow-2xs space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-teal-600 fill-teal-500" /> 7-Day Hydration History for {patient.name}
              </h4>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-100">
                Recharts Line Chart
              </span>
            </div>
            <div className="w-full h-52 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={get7DayWaterData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} unit="ml" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                    formatter={(val: any) => [`${val} ml`]}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                  <Line
                    type="monotone"
                    dataKey="intake"
                    name="Logged Intake (ml)"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0284c7" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="goal"
                    name="Daily Target (ml)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modules Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Exercise Card - Clickable */}
        <button
          onClick={() => setActiveModal("exercise")}
          className="bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100/80 rounded-3xl p-4 space-y-2 text-left relative shadow-2xs transition-all cursor-pointer active:scale-98"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Exercise & Walk</h4>
            <p className="text-[10px] text-slate-500 leading-tight">Tap to log workouts</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> {exerciseLog.durationMins} Mins • {exerciseLog.steps} Steps
          </span>
        </button>

        {/* Medication Card - Clickable */}
        <button
          onClick={() => {
            const el = document.getElementById("prescribed-meds");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100/80 rounded-3xl p-4 space-y-2 text-left relative shadow-2xs transition-all cursor-pointer active:scale-98"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Medications</h4>
            <p className="text-[10px] text-slate-500 leading-tight">Tap to view schedule</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full">
            {patient.medications.filter((m) => m.takenToday).length} / {patient.medications.length} Taken
          </span>
        </button>

        {/* Daily Tasks Span Card - Clickable */}
        <button
          onClick={() => setActiveModal("tasks")}
          className="col-span-2 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100/80 rounded-3xl p-4 flex items-center justify-between text-left shadow-2xs transition-all cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Daily Care Checklist</h4>
              <p className="text-[11px] text-slate-500">Tap to manage tasks & daily habits</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full">
            {careTasks.filter((t) => !t.done).length} Pending
          </span>
        </button>
      </div>

      {/* Interactive Vitals Overview Row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Vital Signs & Mood (Tap to Update)
          </span>
          <button
            onClick={() => setActiveModal("vitals")}
            className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 cursor-pointer"
          >
            + Log Vitals
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* BP Card */}
          <button
            onClick={() => setActiveModal("vitals")}
            className="bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center shadow-2xs space-y-1 transition-all cursor-pointer active:scale-95"
          >
            <HeartPulse className="w-4 h-4 text-red-500 mx-auto" />
            <div className="text-xs font-bold text-slate-800">
              {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}
            </div>
            <p className="text-[9px] text-slate-400 font-medium">BP (mmHg)</p>
          </button>

          {/* Sleep Card */}
          <button
            onClick={() => setActiveModal("sleep")}
            className="bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center shadow-2xs space-y-1 transition-all cursor-pointer active:scale-95"
          >
            <Moon className="w-4 h-4 text-indigo-500 mx-auto" />
            <div className="text-xs font-bold text-slate-800">{patient.sleepHours || 7.5} hrs</div>
            <p className="text-[9px] text-slate-400 font-medium">Sleep Log</p>
          </button>

          {/* Mood Card */}
          <button
            onClick={() => setActiveModal("mood")}
            className="bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center shadow-2xs space-y-1 transition-all cursor-pointer active:scale-95"
          >
            <Smile className="w-4 h-4 text-emerald-500 mx-auto" />
            <div className="text-xs font-bold text-slate-800">{patient.mood || "Calm"}</div>
            <p className="text-[9px] text-slate-400 font-medium">Mood Journal</p>
          </button>
        </div>
      </div>

      {/* Visual Recharts Trend Chart Component for Vital Signs */}
      <VitalsTrendChart
        patient={patient}
        onAddVitalSign={() => setActiveModal("vitals")}
      />

      {/* Dark Clinical Insight Card */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 space-y-3 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
              CLINICAL INSIGHT
            </span>
          </div>
          <button
            onClick={handleFetchAiInsight}
            disabled={isLoadingInsight}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh AI Clinical Advice"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsight ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>

        <p className="text-sm font-semibold leading-snug text-slate-200">
          "{clinicalInsight}"
        </p>

        {actionableTip && (
          <div className="bg-slate-800/80 rounded-xl p-3 text-xs text-slate-300 border border-slate-700/50 flex items-start gap-2">
            <Brain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-emerald-300">Tip:</strong> {actionableTip}</span>
          </div>
        )}
      </div>

      {/* Today's Prescribed Medications List */}
      <div id="prescribed-meds" className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Today's Prescribed Medications
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
            {patient.medications.length} Prescribed
          </span>
        </div>

        <div className="space-y-2">
          {patient.medications.map((med) => (
            <div
              key={med.id}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleMedication && onToggleMedication(patient.id, med.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    med.takenToday
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 hover:border-emerald-500 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <div>
                  <p className={`text-xs font-bold ${med.takenToday ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {med.name} ({med.dosage})
                  </p>
                  <p className="text-[10px] text-slate-400">{med.frequency} • {med.time}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  med.takenToday
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {med.takenToday ? "Taken" : "Scheduled"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}

      {/* 1. EXERCISE MODAL */}
      {activeModal === "exercise" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" /> Log Exercise & Walk
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExerciseSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400">Activity Type</label>
                <select
                  value={exActivity}
                  onChange={(e) => setExActivity(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option value="Walking / Light Jog">Walking / Light Jog</option>
                  <option value="Yoga & Stretching">Yoga & Stretching</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Physical Therapy">Physical Therapy Exercises</option>
                  <option value="Gardening & Yard Work">Gardening & Yard Work</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Duration (Mins)</label>
                  <input
                    type="number"
                    value={exDuration}
                    onChange={(e) => setExDuration(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Steps Count</label>
                  <input
                    type="number"
                    value={exSteps}
                    onChange={(e) => setExSteps(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400">Intensity</label>
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
                  {["Light", "Moderate", "Vigorous"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExIntensity(lvl)}
                      className={`py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        exIntensity === lvl
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Save Workout Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. VITALS MODAL */}
      {activeModal === "vitals" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-500" /> Record Vital Signs
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVitalsSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={spO2}
                    onChange={(e) => setSpO2(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Save Vitals Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SLEEP MODAL */}
      {activeModal === "sleep" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" /> Sleep Log & Quality
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSleepSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400">Hours Slept</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepVal}
                  onChange={(e) => setSleepVal(e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400">Sleep Quality</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option value="Restful & Deep">😴 Restful & Deep</option>
                  <option value="Normal">😌 Normal Sleep</option>
                  <option value="Interrupted">🥱 Interrupted Sleep</option>
                  <option value="Poor / Insomnia">😣 Poor / Insomnia</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Update Sleep Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. MOOD MODAL */}
      {activeModal === "mood" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-600" /> Mood Journal Check-In
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMoodSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400">Select Current Mood</label>
                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  {[
                    { label: "Great", icon: "😃" },
                    { label: "Calm", icon: "😌" },
                    { label: "Tired", icon: "😔" },
                    { label: "Anxious", icon: "😟" },
                    { label: "In Pain", icon: "😣" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedMood(item.label as Patient["mood"])}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 font-bold border transition-all cursor-pointer ${
                        selectedMood === item.label
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-2xs"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Write a brief journal note..."
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Save Mood Check-In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. TASKS CHECKLIST MODAL */}
      {activeModal === "tasks" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" /> Daily Care Habits
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {careTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        t.done ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                      }`}
                    >
                      {t.done && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`font-semibold ${t.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {t.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{t.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add new care habit or task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-2xs"
              >
                + Add Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shareable Family Invitation Link Modal */}
      <FamilyInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        patient={patient}
      />

      {/* AI Voice Assistant & Audio Dictation Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateService={(subTab) => {
          if (onNavigateToSubTab) onNavigateToSubTab(subTab);
        }}
        onTriggerAction={(action) => {
          if (action === "EXPORT_PDF") {
            generatePatientPDFReport(patient);
          }
        }}
        currentNotes={patient.caregiverNotes}
        onUpdateCaregiverNotes={(notes) => {
          if (onUpdateCaregiverNotes) onUpdateCaregiverNotes(patient.id, notes);
        }}
      />
    </div>
  );
};
