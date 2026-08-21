import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  User,
  Building,
  TrendingUp,
  FileText,
  Sparkles
} from "lucide-react";
import { MedicineItemModel, DoseLogModel, MedicineTab } from "./types";

interface ScreenDoctorReportsProps {
  medicines: MedicineItemModel[];
  todayDoses: DoseLogModel[];
  onNavigate: (tab: MedicineTab) => void;
}

export const ScreenDoctorReports: React.FC<ScreenDoctorReportsProps> = ({
  medicines,
  todayDoses,
  onNavigate
}) => {
  const [reportDateRange, setReportDateRange] = useState("Last 30 Days");
  const [isExporting, setIsExporting] = useState(false);

  const complianceRate = 92;

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Doctor Adherence Summary PDF exported successfully to your downloads folder!");
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Top Report Header Card with Adherence Gauge */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Clinical Adherence Report</h3>
              <p className="text-xs text-slate-500">Prepared for physician consultation</p>
            </div>
          </div>

          <select
            value={reportDateRange}
            onChange={(e) => setReportDateRange(e.target.value)}
            className="text-xs font-bold bg-orange-50 border border-orange-200 rounded-xl px-2.5 py-1 text-slate-700 focus:outline-none"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>
        </div>

        {/* Big Circular Compliance Gauge Display */}
        <div className="py-3 flex flex-col items-center justify-center">
          <div className="w-36 h-36 rounded-full border-8 border-emerald-500 bg-emerald-50/50 flex flex-col items-center justify-center shadow-inner relative">
            <span className="text-3xl font-black text-emerald-700">{complianceRate}%</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
              Adherence
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Excellent Patient Compliance Level
          </p>
        </div>

        {/* 4 Metric Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-orange-100">
          <div className="p-2.5 bg-slate-50 rounded-2xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Prescriptions</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">{medicines.length}</div>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-2xl">
            <div className="text-[10px] font-bold text-emerald-700 uppercase">Taken On-Time</div>
            <div className="text-lg font-black text-emerald-700 mt-0.5">88%</div>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-2xl">
            <div className="text-[10px] font-bold text-amber-700 uppercase">Snoozed / Delayed</div>
            <div className="text-lg font-black text-amber-700 mt-0.5">8%</div>
          </div>
          <div className="p-2.5 bg-red-50 rounded-2xl">
            <div className="text-[10px] font-bold text-red-700 uppercase">Skipped / Missed</div>
            <div className="text-lg font-black text-red-700 mt-0.5">4%</div>
          </div>
        </div>
      </div>

      {/* 2. Active Prescribing Doctors & Hospitals */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Prescribing Physicians & Clinics
        </h4>

        <div className="space-y-2.5">
          <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900">Dr. Sandeep Shah</h5>
                <p className="text-[11px] text-slate-500">Norvic International Hospital • Cardiology</p>
                <div className="text-[10px] text-orange-700 font-semibold mt-0.5">
                  Prescriptions: Atorvastatin 10mg, Amoxicillin 500mg, Paracetamol
                </div>
              </div>
            </div>
            <a
              href="tel:+9779801234567"
              className="text-xs font-bold text-[#FF5A36] bg-white px-3 py-1.5 rounded-xl border border-orange-200"
            >
              Contact
            </a>
          </div>

          <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900">Dr. Anita Patel</h5>
                <p className="text-[11px] text-slate-500">Grande International Hospital • Endocrinology</p>
                <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
                  Prescriptions: Levothyroxine 50mcg, Metformin ER 500mg
                </div>
              </div>
            </div>
            <a
              href="tel:+9779812345678"
              className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-blue-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* 3. Export & Share Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex-1 py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? "Generating PDF..." : "Export Doctor PDF Report"}</span>
        </button>

        <button
          onClick={() => alert("Report link copied to clipboard for sharing!")}
          className="p-3 bg-white hover:bg-orange-50 text-[#FF5A36] border border-orange-200 rounded-2xl transition-all shadow-2xs"
          title="Share Link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => window.print()}
          className="p-3 bg-white hover:bg-orange-50 text-slate-700 border border-slate-200 rounded-2xl transition-all shadow-2xs"
          title="Print Report"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
