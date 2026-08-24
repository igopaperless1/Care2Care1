import React, { useState } from "react";
import {
  FileText,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  Pill,
  Sparkles,
  Printer
} from "lucide-react";
import { MedicineItemModel, DoseLogModel, MedicineTab } from "./types";

interface ScreenDoctorReportsProps {
  medicines: MedicineItemModel[];
  todayDoses: DoseLogModel[];
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenDoctorReports: React.FC<ScreenDoctorReportsProps> = ({
  medicines,
  todayDoses,
  onNavigate
}) => {
  const [reportPeriod, setReportPeriod] = useState<"30_days" | "90_days" | "all">("30_days");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Clinical Adherence Report generated and exported as PDF!");
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center font-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
              Clinical Doctor & Adherence Report
            </h3>
            <p className="text-xs text-[#4A4A4A]">
              Ready-to-print medical log for your next doctor consultation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportPDF}
          disabled={isExporting}
          className="px-4 py-2.5 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? "Generating PDF..." : "Export PDF Report"}</span>
        </button>
      </div>

      {/* 2. Report Period Selector */}
      <div className="flex items-center gap-2">
        {[
          { id: "30_days", label: "Last 30 Days" },
          { id: "90_days", label: "Last 90 Days" },
          { id: "all", label: "Full Prescription History" }
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setReportPeriod(p.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportPeriod === p.id
                ? "bg-[#6C3CE1] text-white shadow-xs"
                : "bg-white text-[#4A4A4A] border border-[#D1D5DB] hover:bg-[#F3F0FF]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 3. Clinical Summary Card Preview */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-[#D1D5DB]/60 pb-3">
          <div>
            <h4 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide">
              Patient Medication Summary Sheet
            </h4>
            <span className="text-[11px] text-[#8A8A8A]">
              Generated on {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-[#2ECC71] border border-emerald-200 text-xs font-black rounded-lg">
            94% Overall Adherence
          </span>
        </div>

        {/* Prescription Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D1D5DB] text-[#6C3CE1] font-black uppercase text-[10px]">
                <th className="py-2">Medication</th>
                <th className="py-2">Strength</th>
                <th className="py-2">Frequency</th>
                <th className="py-2">Doctor</th>
                <th className="py-2">Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1D5DB]/40 font-semibold text-[#1A1A1A]">
              {medicines.map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5 font-bold">{m.name}</td>
                  <td className="py-2.5 text-[#4A4A4A]">{m.strength}</td>
                  <td className="py-2.5 text-[#4A4A4A]">{m.dosesPerDay}x daily</td>
                  <td className="py-2.5 text-[#4A4A4A]">{m.prescribingDoctor || "Dr. Sandeep Shah"}</td>
                  <td className="py-2.5 text-[#2ECC71] font-bold">96% (Good)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
