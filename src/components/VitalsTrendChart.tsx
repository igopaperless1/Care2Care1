import React, { useState, useMemo } from "react";
import { VitalSign, Patient } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  Heart,
  Droplets,
  Thermometer,
  Zap,
  TrendingUp,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Filter,
} from "lucide-react";
import { generatePatientPDFReport } from "../lib/pdfReportGenerator";

interface VitalsTrendChartProps {
  patient: Patient;
  onAddVitalSign?: () => void;
}

const VitalsTrendChartComponent: React.FC<VitalsTrendChartProps> = ({
  patient,
  onAddVitalSign,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<
    "bp" | "heart_spo2" | "glucose_temp" | "hydration"
  >("bp");
  const [timeRangeDays, setTimeRangeDays] = useState<number>(14);

  // Filter and format vitals data for Recharts
  const chartData = useMemo(() => {
    const rawVitals = patient.vitals || [];
    if (rawVitals.length === 0) return [];

    const now = Date.now();
    const cutoff = now - timeRangeDays * 24 * 60 * 60 * 1000;

    const filtered = rawVitals.filter(
      (v) => (v.timestamp || Date.now()) >= cutoff
    );

    // Sort chronologically ascending for the chart
    const sorted = [...filtered].sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );

    return sorted.map((v) => {
      const dateObj = new Date(v.timestamp || Date.now());
      const label = v.dateStr || `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      return {
        id: v.id,
        label,
        fullDate: dateObj.toLocaleString(),
        systolic: v.bloodPressureSystolic,
        diastolic: v.bloodPressureDiastolic,
        heartRate: v.heartRateBpm,
        spO2: v.spO2Percent,
        temperature: v.temperatureF,
        bloodSugar: v.bloodSugarMgDl,
      };
    });
  }, [patient.vitals, timeRangeDays]);

  // Hydration chart data
  const hydrationChartData = useMemo(() => {
    const rawLogs = patient.waterLogs || [];
    const groupedByDate: Record<string, number> = {};

    rawLogs.forEach((log) => {
      const dateKey = new Date(log.timestamp || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + log.amountMl;
    });

    const result = Object.keys(groupedByDate).map((date) => ({
      date,
      intakeMl: groupedByDate[date],
      goalMl: patient.waterGoalMl || 2000,
    }));

    if (result.length === 0) {
      // Fallback mock current day
      result.push({
        date: "Today",
        intakeMl: patient.waterCurrentMl || 0,
        goalMl: patient.waterGoalMl || 2000,
      });
    }

    return result;
  }, [patient.waterLogs, patient.waterCurrentMl, patient.waterGoalMl]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        avgSys: 120,
        avgDia: 80,
        avgHeart: 72,
        avgSpO2: 98,
        latestSys: 120,
        latestDia: 80,
        isNormal: true,
      };
    }

    const sysSum = chartData.reduce((acc, curr) => acc + curr.systolic, 0);
    const diaSum = chartData.reduce((acc, curr) => acc + curr.diastolic, 0);
    const heartSum = chartData.reduce((acc, curr) => acc + curr.heartRate, 0);
    const spo2Sum = chartData.reduce((acc, curr) => acc + curr.spO2, 0);

    const len = chartData.length;
    const latest = chartData[len - 1];

    const isNormal =
      latest.systolic <= 130 &&
      latest.diastolic <= 85 &&
      latest.heartRate >= 60 &&
      latest.heartRate <= 100 &&
      latest.spO2 >= 95;

    return {
      avgSys: Math.round(sysSum / len),
      avgDia: Math.round(diaSum / len),
      avgHeart: Math.round(heartSum / len),
      avgSpO2: Math.round(spo2Sum / len),
      latestSys: latest.systolic,
      latestDia: latest.diastolic,
      latestHeart: latest.heartRate,
      latestSpO2: latest.spO2,
      isNormal,
    };
  }, [chartData]);

  const handleExportPDF = () => {
    generatePatientPDFReport(patient);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-black text-lg text-slate-900">
                Vital Signs & Health Trends
              </h2>
              <p className="text-xs text-slate-500">
                Interactive historical readings for{" "}
                <span className="font-bold text-slate-800">{patient.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRangeDays(days)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  timeRangeDays === days
                    ? "bg-white text-emerald-700 shadow-2xs font-black"
                    : "hover:text-slate-900"
                }`}
              >
                {days}D
              </button>
            ))}
          </div>

          {/* PDF Export Button */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedMetric("bp")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            selectedMetric === "bp"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Blood Pressure</span>
        </button>

        <button
          onClick={() => setSelectedMetric("heart_spo2")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            selectedMetric === "heart_spo2"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Heart Rate & SpO2</span>
        </button>

        <button
          onClick={() => setSelectedMetric("glucose_temp")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            selectedMetric === "glucose_temp"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Glucose & Temp</span>
        </button>

        <button
          onClick={() => setSelectedMetric("hydration")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            selectedMetric === "hydration"
              ? "bg-cyan-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Hydration Log</span>
        </button>
      </div>

      {/* Quick Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Latest BP
          </p>
          <p className="text-lg font-black text-slate-900 mt-0.5">
            {stats.latestSys}/{stats.latestDia}{" "}
            <span className="text-xs font-medium text-slate-500">mmHg</span>
          </p>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">
            Avg: {stats.avgSys}/{stats.avgDia} mmHg
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Heart Rate
          </p>
          <p className="text-lg font-black text-rose-600 mt-0.5">
            {stats.latestHeart || 72}{" "}
            <span className="text-xs font-medium text-slate-500">BPM</span>
          </p>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">
            Avg: {stats.avgHeart} BPM
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Oxygen Saturation
          </p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">
            {stats.latestSpO2 || 98}%
          </p>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">
            Avg: {stats.avgSpO2}%
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Health Zone
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {stats.isNormal ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-black text-emerald-700">
                  Optimal Zone
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-black text-amber-700">
                  Monitor Closely
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400">Target Range</span>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="h-72 w-full pt-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
        {chartData.length === 0 && selectedMetric !== "hydration" ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
            <Activity className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">
              No vital sign entries recorded for this time frame.
            </p>
            {onAddVitalSign && (
              <button
                onClick={onAddVitalSign}
                className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                + Log Vitals Now
              </button>
            )}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === "bp" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sysColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="diaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis domain={[40, 180]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <ReferenceLine
                  y={120}
                  label="Systolic Target (120)"
                  stroke="#10b981"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={80}
                  label="Diastolic Target (80)"
                  stroke="#0284c7"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic BP (mmHg)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sysColor)"
                />
                <Area
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic BP (mmHg)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#diaColor)"
                />
              </AreaChart>
            ) : selectedMetric === "heart_spo2" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" domain={[40, 140]} stroke="#e11d48" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[85, 100]} stroke="#059669" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="spO2"
                  name="SpO2 Oxygen (%)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            ) : selectedMetric === "glucose_temp" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" domain={[50, 250]} stroke="#d97706" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[95, 105]} stroke="#dc2626" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bloodSugar"
                  name="Blood Glucose (mg/dL)"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  name="Body Temp (°F)"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={hydrationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 3500]} stroke="#0891b2" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <ReferenceLine
                  y={patient.waterGoalMl || 2000}
                  label="Daily Goal"
                  stroke="#0891b2"
                  strokeDasharray="3 3"
                />
                <Bar
                  dataKey="intakeMl"
                  name="Water Intake (mL)"
                  fill="#06b6d4"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export const VitalsTrendChart = React.memo(VitalsTrendChartComponent);
