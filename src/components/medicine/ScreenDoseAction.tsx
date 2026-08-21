import React, { useState } from "react";
import {
  Pill,
  Check,
  Clock,
  X,
  RotateCcw,
  Camera,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { DoseLogModel, DoseStatus, MedicineTab } from "./types";
import { playMedicineTone } from "./soundUtil";

interface ScreenDoseActionProps {
  dose: DoseLogModel;
  onRecordAction: (
    doseId: string,
    status: DoseStatus,
    reason?: string,
    note?: string,
    photoProofUrl?: string
  ) => void;
  onCancel: () => void;
  onNavigate?: (tab: MedicineTab) => void;
}

export const ScreenDoseAction: React.FC<ScreenDoseActionProps> = ({
  dose,
  onRecordAction,
  onCancel,
  onNavigate
}) => {
  const [selectedStatus, setSelectedStatus] = useState<DoseStatus | null>(null);
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [photoProof, setPhotoProof] = useState<string | null>(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(false);

  const reasonsList = [
    "Felt Nauseous / Unwell",
    "Doctor Advised to Hold",
    "Out of Stock / Need Refill",
    "Fasting / Blood Test Today",
    "Forgot Time Slot",
    "Experienced Side Effects",
    "Other Reason"
  ];

  const handleSelectAction = (status: DoseStatus) => {
    setSelectedStatus(status);
    if (status === "Taken") {
      playMedicineTone("take");
    } else if (status === "Snoozed" || status === "MaybeLater") {
      playMedicineTone("snooze");
    } else if (status === "Skipped") {
      playMedicineTone("skip");
    }
  };

  const handleSimulatePhotoProof = () => {
    setIsPhotoCaptured(true);
    setPhotoProof(
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80"
    );
  };

  const handleConfirmSubmit = () => {
    if (!selectedStatus) {
      alert("Please select whether you took, snoozed, or skipped your dose.");
      return;
    }

    onRecordAction(dose.id, selectedStatus, reason || undefined, note || undefined, photoProof || undefined);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Top Cancel bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doses
        </button>
        <span className="text-xs font-bold text-slate-400">Dose Verification</span>
      </div>

      {/* 1. Medicine Card Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A36] mx-auto flex items-center justify-center border border-orange-200 shadow-2xs">
          <Pill className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{dose.medicineName}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {dose.dosage} • {dose.scheduledTime} ({dose.slot} Dose)
          </p>
        </div>
      </div>

      {/* 2. Action Buttons (2x2 Grid) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <h4 className="text-sm font-black text-slate-900 text-center">
          Did you take your medicine?
        </h4>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. TAKEN */}
          <button
            type="button"
            onClick={() => handleSelectAction("Taken")}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              selectedStatus === "Taken"
                ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30 scale-[1.02]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-200"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30 mb-2">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-xs font-black text-slate-900">Taken</span>
            <span className="text-[10px] text-slate-500 mt-0.5">I have taken this dose</span>
          </button>

          {/* 2. SNOOZE */}
          <button
            type="button"
            onClick={() => handleSelectAction("Snoozed")}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              selectedStatus === "Snoozed"
                ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400/30 scale-[1.02]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-amber-50/50 hover:border-amber-200"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/30 mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900">Snooze</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Remind me later</span>
          </button>

          {/* 3. SKIP */}
          <button
            type="button"
            onClick={() => handleSelectAction("Skipped")}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              selectedStatus === "Skipped"
                ? "bg-red-50 border-red-500 ring-2 ring-red-400/30 scale-[1.02]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-red-50/50 hover:border-red-200"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm shadow-red-500/30 mb-2">
              <X className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="text-xs font-black text-slate-900">Skip</span>
            <span className="text-[10px] text-slate-500 mt-0.5">I will skip this dose</span>
          </button>

          {/* 4. MAYBE LATER */}
          <button
            type="button"
            onClick={() => handleSelectAction("MaybeLater")}
            className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              selectedStatus === "MaybeLater"
                ? "bg-orange-50 border-[#FF5A36] ring-2 ring-orange-400/30 scale-[1.02]"
                : "bg-slate-50/70 border-slate-200/80 hover:bg-orange-50/50 hover:border-orange-200"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-orange-400 text-white flex items-center justify-center shadow-sm shadow-orange-500/30 mb-2">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900">Maybe Later</span>
            <span className="text-[10px] text-slate-500 mt-0.5">I will take later</span>
          </button>
        </div>
      </div>

      {/* 3. Optional Skip / Snooze Reason & Notes */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Add Reason <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none"
          >
            <option value="">Select reason for skip / delay...</option>
            {reasonsList.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Add Note <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a personal note or symptoms..."
            className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none"
          />
        </div>

        {/* Take a Photo (Proof) Button */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Take a Photo (Proof)
          </label>
          {photoProof ? (
            <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <img
                src={photoProof}
                alt="Proof"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Photo attached
                </span>
                <button
                  type="button"
                  onClick={() => setPhotoProof(null)}
                  className="text-[11px] font-bold text-red-500 hover:underline mt-0.5"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSimulatePhotoProof}
              className="w-full py-3 bg-orange-50/70 hover:bg-orange-100 text-[#FF5A36] border-2 border-dashed border-orange-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#FF5A36]" />
              <span>Tap to capture photo</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirmSubmit}
          className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          <Check className="w-4 h-4" />
          <span>Save Log & Update Adherence</span>
        </button>
      </div>
    </div>
  );
};
