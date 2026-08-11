import React, { useMemo } from "react";
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Activity,
  Droplets,
  Pill,
  Thermometer,
  Zap,
  TrendingUp,
  Info
} from "lucide-react";
import { Patient, VitalSign, Medication } from "../types";

interface HealthInsightsModuleProps {
  patients: Patient[];
  selectedPatientId?: string;
  onSelectPatient?: (id: string) => void;
  onTriggerAction?: (actionName: string, detail?: string) => void;
}

export const HealthInsightsModuleComponent: React.FC<HealthInsightsModuleProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onTriggerAction
}) => {
  const currentPatient = useMemo(() => {
    if (!patients || patients.length === 0) return null;
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Heavy-lifting heuristic calculations memoized to prevent re-renders
  const analysis = useMemo(() => {
    if (!currentPatient) return null;

    const vitals = currentPatient.vitals || [];
    const medications = currentPatient.medications || [];
    const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : null;

    const concerns: Array<{
      id: string;
      level: "critical" | "warning" | "info";
      title: string;
      description: string;
      recommendation: string;
      metric: string;
    }> = [];

    // 1. Blood Pressure Analysis
    if (latestVital) {
      const sys = latestVital.bloodPressureSystolic;
      const dia = latestVital.bloodPressureDiastolic;
      if (sys >= 140 || dia >= 90) {
        concerns.push({
          id: "bp-high",
          level: "critical",
          title: "Stage 2 Hypertension Risk",
          description: `Blood pressure reading is elevated at ${sys}/${dia} mmHg.`,
          recommendation: "Re-check blood pressure in 30 minutes. Ensure patient is resting and avoid caffeine.",
          metric: `${sys}/${dia} mmHg`
        });
      } else if (sys >= 130 || dia >= 85) {
        concerns.push({
          id: "bp-elevated",
          level: "warning",
          title: "Elevated Blood Pressure",
          description: `Blood pressure is ${sys}/${dia} mmHg (slightly above optimal).`,
          recommendation: "Monitor sodium intake and ensure low-stress environment.",
          metric: `${sys}/${dia} mmHg`
        });
      }

      // 2. Heart Rate Analysis
      if (latestVital.heartRateBpm > 100) {
        concerns.push({
          id: "hr-tachy",
          level: "warning",
          title: "Tachycardia Alert (High Heart Rate)",
          description: `Heart rate recorded at ${latestVital.heartRateBpm} BPM.`,
          recommendation: "Check for fever or dehydration. Re-measure resting pulse.",
          metric: `${latestVital.heartRateBpm} BPM`
        });
      } else if (latestVital.heartRateBpm < 60) {
        concerns.push({
          id: "hr-brady",
          level: "warning",
          title: "Bradycardia Alert (Low Heart Rate)",
          description: `Heart rate recorded at ${latestVital.heartRateBpm} BPM.`,
          recommendation: "Verify medication side effects or consult physician if symptomatic.",
          metric: `${latestVital.heartRateBpm} BPM`
        });
      }

      // 3. Oxygen SpO2 Analysis
      if (latestVital.spO2Percent < 90) {
        concerns.push({
          id: "spo2-critical",
          level: "critical",
          title: "Severe Hypoxia Warning",
          description: `Blood oxygen saturation is critically low at ${latestVital.spO2Percent}%.`,
          recommendation: "Administer supplemental oxygen if prescribed and notify doctor immediately.",
          metric: `${latestVital.spO2Percent}% SpO2`
        });
      } else if (latestVital.spO2Percent < 95) {
        concerns.push({
          id: "spo2-low",
          level: "warning",
          title: "Mild Oxygen Desaturation",
          description: `Blood oxygen saturation is ${latestVital.spO2Percent}%.`,
          recommendation: "Encourage deep breathing exercises and reposition patient upright.",
          metric: `${latestVital.spO2Percent}% SpO2`
        });
      }

      // 4. Body Temperature
      if (latestVital.temperatureF >= 100.4) {
        concerns.push({
          id: "temp-fever",
          level: "warning",
          title: "Fever Detected",
          description: `Body temperature is ${latestVital.temperatureF}°F.`,
          recommendation: "Ensure hydration, apply cool compresses, and check for infection markers.",
          metric: `${latestVital.temperatureF}°F`
        });
      }

      // 5. Blood Sugar
      if (latestVital.bloodSugarMgDl > 180) {
        concerns.push({
          id: "sugar-high",
          level: "warning",
          title: "Hyperglycemia Alert",
          description: `Blood glucose is elevated at ${latestVital.bloodSugarMgDl} mg/dL.`,
          recommendation: "Check diabetes medication dosage and review recent carbohydrate intake.",
          metric: `${latestVital.bloodSugarMgDl} mg/dL`
        });
      } else if (latestVital.bloodSugarMgDl < 70) {
        concerns.push({
          id: "sugar-low",
          level: "critical",
          title: "Hypoglycemia Risk (Low Glucose)",
          description: `Blood glucose is low at ${latestVital.bloodSugarMgDl} mg/dL.`,
          recommendation: "Provide 15g fast-acting carbohydrates (e.g., fruit juice or glucose tablets).",
          metric: `${latestVital.bloodSugarMgDl} mg/dL`
        });
      }
    }

    // 6. Medication Compliance Heuristic
    const totalMeds = medications.length;
    const takenMeds = medications.filter((m) => m.takenToday).length;
    const missedMeds = medications.filter((m) => !m.takenToday);
    const complianceRate = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;

    if (totalMeds > 0 && complianceRate < 100) {
      concerns.push({
        id: "med-missed",
        level: complianceRate < 50 ? "critical" : "warning",
        title: `Medication Non-Compliance (${complianceRate}%)`,
        description: `Patient missed ${missedMeds.length} out of ${totalMeds} scheduled medications today: ${missedMeds.map((m) => m.name).join(", ")}.`,
        recommendation: `Prompt patient to take ${missedMeds[0]?.name || "scheduled doses"} now.`,
        metric: `${takenMeds}/${totalMeds} Taken`
      });
    }

    // 7. Hydration Deficit
    const currentWater = currentPatient.waterCurrentMl || 0;
    const goalWater = currentPatient.waterGoalMl || 2000;
    if (currentWater < goalWater * 0.5) {
      concerns.push({
        id: "water-deficit",
        level: "info",
        title: "Hydration Deficit",
        description: `Patient has logged ${currentWater} ml out of target ${goalWater} ml today.`,
        recommendation: "Offer water or electrolyte solution to prevent dehydration.",
        metric: `${currentWater}/${goalWater} ml`
      });
    }

    // Health Score (0 - 100)
    let score = 100;
    concerns.forEach((c) => {
      if (c.level === "critical") score -= 25;
      else if (c.level === "warning") score -= 12;
      else score -= 5;
    });
    score = Math.max(20, Math.min(100, score));

    return {
      currentPatient,
      latestVital,
      complianceRate,
      takenMeds,
      totalMeds,
      missedMeds,
      concerns,
      score
    };
  }, [currentPatient]);

  if (!analysis) return null;

  const { score, concerns, complianceRate, latestVital, missedMeds } = analysis;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md font-bold text-xl">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Health Insights & Vitals Heuristics
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                AI Analytics Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time heuristic evaluation of vitals, blood pressure, oxygen, and medication compliance.
            </p>
          </div>
        </div>

        {/* Patient Switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPatient && onSelectPatient(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                p.id === currentPatient?.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Score & Vitals Snapshot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Risk Score */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Health Stability Index
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              <span>{score}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold mt-1">
              {score >= 85
                ? "🟢 Excellent - Vitals Stable"
                : score >= 65
                ? "🟡 Moderate Concern - Review Vitals"
                : "🔴 High Concern - Immediate Attention"}
            </p>
          </div>
        </div>

        {/* Medication Compliance Snapshot */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Medication Compliance
            </span>
            <Pill className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 flex items-baseline gap-2">
              <span>{complianceRate}%</span>
              <span className="text-xs text-slate-500 font-normal">
                ({analysis.takenMeds}/{analysis.totalMeds} Taken)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-300 ${
                  complianceRate === 100
                    ? "bg-emerald-500"
                    : complianceRate >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Vitals Overview */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Latest Vitals
            </span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          {latestVital ? (
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
              <div>
                <span className="text-slate-400 font-normal text-[10px] block">BP:</span>
                <span>{latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}</span>
              </div>
              <div>
                <span className="text-slate-400 font-normal text-[10px] block">SpO2:</span>
                <span>{latestVital.spO2Percent}%</span>
              </div>
              <div>
                <span className="text-slate-400 font-normal text-[10px] block">Heart Rate:</span>
                <span>{latestVital.heartRateBpm} BPM</span>
              </div>
              <div>
                <span className="text-slate-400 font-normal text-[10px] block">Temp:</span>
                <span>{latestVital.temperatureF}°F</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No vitals logged yet today.</p>
          )}
        </div>
      </div>

      {/* Concerns & Actions List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Caregiver Alerts & Heuristic Recommendations ({concerns.length})</span>
        </h3>

        {concerns.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">All Vitals & Compliance Normal!</p>
              <p className="text-emerald-700 font-medium">
                No acute health concerns detected for {currentPatient.name}. All parameters are within healthy thresholds.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {concerns.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  c.level === "critical"
                    ? "bg-rose-50 border-rose-200 text-rose-950"
                    : c.level === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-950"
                    : "bg-blue-50 border-blue-200 text-blue-950"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase ${
                        c.level === "critical"
                          ? "bg-rose-600 text-white"
                          : c.level === "warning"
                          ? "bg-amber-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {c.level}
                    </span>
                    <h4 className="font-black text-sm">{c.title}</h4>
                    <span className="font-mono text-[11px] font-bold opacity-80">({c.metric})</span>
                  </div>
                  <p className="font-medium text-xs opacity-90">{c.description}</p>
                  <p className="text-[11px] font-bold text-slate-700 bg-white/70 p-2 rounded-xl border border-black/5 mt-1">
                    👉 <strong>Action:</strong> {c.recommendation}
                  </p>
                </div>

                {onTriggerAction && (
                  <button
                    onClick={() => onTriggerAction(c.title, c.recommendation)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-black text-[11px] hover:bg-slate-800 transition-colors shrink-0 shadow-xs cursor-pointer self-start sm:self-center"
                  >
                    Resolve Alert
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const HealthInsightsModule = React.memo(HealthInsightsModuleComponent);
