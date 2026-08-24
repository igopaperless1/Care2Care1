import React, { useState } from "react";
import {
  Check,
  Clock,
  X,
  Camera,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Pill,
  ArrowLeft
} from "lucide-react";
import { DoseLogModel, DoseStatus, MedicineTab } from "./types";
import { playMedicineTone } from "./soundUtil";

interface ScreenDoseActionProps {
  dose: DoseLogModel;
  onRecordAction: (doseId: string, status: DoseStatus, reason?: string, note?: string) => void;
  onCancel: () => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenDoseAction: React.FC<ScreenDoseActionProps> = ({
  dose,
  onRecordAction,
  onCancel,
  onNavigate
}) => {
  const [status, setStatus] = useState<DoseStatus>("Taken");
  const [note, setNote] = useState<string>("");
  const [skipReason, setSkipReason] = useState<string>("Felt nauseous / unwell");
  const [photoProof, setPhotoProof] = useState<string | null>(null);

  const skipReasons = [
    "Felt nauseous / unwell",
    "Doctor advised to pause",
    "Forgot / away from home",
    "Ran out of medicine",
    "Fasting for blood test"
  ];

  const handleConfirm = () => {
    if (status === "Taken") {
      playMedicineTone("gentle_bell");
    }
    onRecordAction(
      dose.id,
      status,
      status === "Skipped" ? skipReason : undefined,
      note || undefined
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20">
      {/* 1. Dose Overview Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] border border-[#8B6CE6]/30 text-[#6C3CE1] flex items-center justify-center text-2xl font-black">
            💊
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#6C3CE1]">
              Record Dose Status
            </span>
            <h3 className="text-xl font-black text-[#1A1A1A]">
              {dose.medicineName}
            </h3>
            <p className="text-xs text-[#4A4A4A] font-semibold">
              {dose.dosage} • Scheduled at {dose.scheduledTime} ({dose.slot})
            </p>
          </div>
        </div>
      </div>

      {/* 2. Status Chooser */}
      <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-4">
        <h4 className="text-xs font-black text-[#6C3CE1] uppercase tracking-wider">
          Select Action
        </h4>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setStatus("Taken")}
            className={`py-3.5 px-2 rounded-xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              status === "Taken"
                ? "bg-[#2ECC71] text-white shadow-xs scale-102"
                : "bg-[#F5F5F5] hover:bg-emerald-50 text-[#1A1A1A]"
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Mark Taken</span>
          </button>

          <button
            type="button"
            onClick={() => setStatus("Snoozed")}
            className={`py-3.5 px-2 rounded-xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              status === "Snoozed"
                ? "bg-[#F39C12] text-white shadow-xs scale-102"
                : "bg-[#F5F5F5] hover:bg-amber-50 text-[#1A1A1A]"
            }`}
          >
            <Clock className="w-5 h-5 stroke-[3]" />
            <span>Snooze (15m)</span>
          </button>

          <button
            type="button"
            onClick={() => setStatus("Skipped")}
            className={`py-3.5 px-2 rounded-xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              status === "Skipped"
                ? "bg-[#E74C3C] text-white shadow-xs scale-102"
                : "bg-[#F5F5F5] hover:bg-red-50 text-[#1A1A1A]"
            }`}
          >
            <X className="w-5 h-5 stroke-[3]" />
            <span>Skip Dose</span>
          </button>
        </div>

        {/* Conditional Skip Reason */}
        {status === "Skipped" && (
          <div className="space-y-2 pt-2 border-t border-[#D1D5DB]/40">
            <label className="block text-xs font-black text-[#E74C3C] uppercase tracking-wider">
              Reason for Skipping
            </label>
            <div className="space-y-1.5">
              {skipReasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#F5F5F5] hover:bg-red-50 text-xs font-semibold text-[#1A1A1A] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="skipReason"
                    checked={skipReason === r}
                    onChange={() => setSkipReason(r)}
                    className="accent-[#E74C3C]"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Note input */}
        <div className="space-y-1 pt-2">
          <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider">
            Optional Notes
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Took with a glass of warm milk"
            className="w-full p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-semibold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
          />
        </div>

        {/* Confirm Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#D1D5DB]/40">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-[#F5F5F5] text-[#4A4A4A] text-xs font-bold rounded-xl hover:bg-[#D1D5DB] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer transition-all"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
};
