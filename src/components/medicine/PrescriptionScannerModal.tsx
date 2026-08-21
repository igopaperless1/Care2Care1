import React, { useState } from "react";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Pill,
  ArrowRight,
  FileText
} from "lucide-react";
import { MedicineItemModel } from "./types";

interface PrescriptionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractedMedicines: (meds: Partial<MedicineItemModel>[]) => void;
}

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  isOpen,
  onClose,
  onExtractedMedicines
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<Partial<MedicineItemModel>[] | null>(null);

  if (!isOpen) return null;

  const sampleRxList = [
    {
      name: "Sample Dr. Rx Slip",
      url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Pharmacy Strip Box",
      url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const handleRunOcr = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const parsed: Partial<MedicineItemModel>[] = [
        {
          name: "Amoxicillin Trihydrate",
          brandName: "Moxikind-500",
          activeIngredient: "Amoxicillin",
          type: "Capsule",
          strength: "500 mg",
          purpose: "Bacterial Infection / Antibiotic Course",
          prescribingDoctor: "Dr. Sandeep Shah, MD",
          hospitalClinic: "Norvic International Hospital",
          scheduleType: "interval",
          dosesPerDay: 3,
          doseTimes: ["08:00 AM", "02:00 PM", "08:00 PM"],
          takeWith: "Water",
          foodRelation: "After Food",
          instructions: "Take 1 capsule every 8 hours after food for 7 days.",
          totalPrescribed: 21,
          remainingStock: 21,
          lowStockThreshold: 6,
          refillReminderEnabled: true,
          prescriptionExpiryDate: "2026-07-01",
          image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80"
        },
        {
          name: "Pantoprazole Gastro-Resistant",
          brandName: "Pan-40",
          activeIngredient: "Pantoprazole Sodium",
          type: "Tablet",
          strength: "40 mg",
          purpose: "Antacid & Gastric Protection",
          prescribingDoctor: "Dr. Sandeep Shah, MD",
          hospitalClinic: "Norvic International Hospital",
          scheduleType: "meal_relative",
          dosesPerDay: 1,
          doseTimes: ["07:30 AM"],
          takeWith: "Water",
          foodRelation: "Empty Stomach",
          instructions: "Take 1 tablet in morning 30 minutes before breakfast.",
          totalPrescribed: 14,
          remainingStock: 14,
          lowStockThreshold: 4,
          refillReminderEnabled: true,
          prescriptionExpiryDate: "2026-07-01",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
        }
      ];
      setExtractedData(parsed);
    }, 1800);
  };

  const handleApplyExtracted = () => {
    if (extractedData) {
      onExtractedMedicines(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 border border-orange-100 shadow-xl space-y-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Prescription Scanner (OCR)</h3>
              <p className="text-xs text-slate-500">Scan Doctor's Rx Slip or Pill Box to auto-fill</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload / Capture Box */}
        {!selectedImage ? (
          <div className="space-y-3">
            <div
              onClick={() => handleRunOcr(sampleRxList[0].url)}
              className="border-2 border-dashed border-orange-300 hover:border-[#FF5A36] bg-orange-50/50 hover:bg-orange-50 rounded-3xl p-6 text-center cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-[#FF5A36] mx-auto flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-900">Tap to Capture or Upload Prescription</div>
              <div className="text-[11px] text-slate-500">Supports JPG, PNG, PDF formats</div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Or try with sample prescription
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sampleRxList.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleRunOcr(s.url)}
                    className="p-2 bg-slate-50 hover:bg-orange-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 text-left"
                  >
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden h-40 border border-orange-200">
              <img
                src={selectedImage}
                alt="Rx Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                  <span className="text-xs font-bold">Extracting medications with AI Vision...</span>
                </div>
              )}
            </div>

            {/* Extracted Medicines List */}
            {extractedData && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {extractedData.length} Medicines Extracted
                  </span>
                  <span>Norvic Hospital</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {extractedData.map((m, idx) => (
                    <div key={idx} className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-1">
                      <div className="text-xs font-bold text-slate-900 flex justify-between">
                        <span>{m.name} ({m.strength})</span>
                        <span className="text-[#FF5A36]">{m.dosesPerDay}x Daily</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Timings: <strong>{m.doseTimes?.join(", ")}</strong> • {m.foodRelation}
                      </div>
                      <div className="text-[10px] text-slate-500 italic">"{m.instructions}"</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleApplyExtracted}
                  className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import {extractedData.length} Medicines to Schedule</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
