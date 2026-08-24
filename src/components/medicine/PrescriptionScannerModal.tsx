import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  X,
  Check,
  AlertCircle,
  FileText,
  Loader2,
  Pill
} from "lucide-react";
import { MedicineItemModel } from "./types";

interface PrescriptionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractedMedicines: (medicines: Partial<MedicineItemModel>[]) => void;
}

export const PrescriptionScannerModal: React.FC<PrescriptionScannerModalProps> = ({
  isOpen,
  onClose,
  onExtractedMedicines
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatedScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const extracted: Partial<MedicineItemModel>[] = [
        {
          name: "Azithromycin",
          brandName: "Azee",
          type: "Tablet",
          strength: "500mg",
          purpose: "Antibiotic for respiratory infection",
          prescribingDoctor: "Dr. Sandeep Shah",
          dosesPerDay: 1,
          doseTimes: ["01:00 PM"],
          totalPrescribed: 5,
          remainingStock: 5,
          lowStockThreshold: 2,
          foodRelation: "After Food",
          instructions: "Take once daily for 5 days after lunch.",
          status: "Active"
        }
      ];
      onExtractedMedicines(extracted);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-[#D1D5DB]/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center font-black">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                📸 AI Prescription Scanner
              </h3>
              <p className="text-xs text-[#4A4A4A]">
                Extract medication details from photo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F5F5F5] hover:bg-[#D1D5DB] text-[#4A4A4A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload / Camera Box */}
        <div className="border-2 border-dashed border-[#8B6CE6]/40 hover:border-[#6C3CE1] rounded-2xl p-6 text-center space-y-3 bg-[#F3F0FF]/30 transition-colors">
          <div className="w-14 h-14 rounded-full bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center mx-auto shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#1A1A1A]">
              Upload prescription image or slip
            </h4>
            <p className="text-[11px] text-[#8A8A8A]">
              Supports PNG, JPG, JPEG medical slips
            </p>
          </div>
        </div>

        {/* Scan Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-[#F5F5F5] text-[#4A4A4A] text-xs font-bold rounded-xl hover:bg-[#D1D5DB] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSimulatedScan}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scan Prescription</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
