import React, { useState } from "react";
import {
  Pill,
  Camera,
  Upload,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Building,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import {
  MedicineItemModel,
  MedicineFormType,
  ScheduleType,
  MedicineTab
} from "./types";

interface ScreenAddMedicineWizardProps {
  initialData?: Partial<MedicineItemModel>;
  onSaveMedicine: (med: Partial<MedicineItemModel>) => void;
  onCancel: () => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenAddMedicineWizard: React.FC<ScreenAddMedicineWizardProps> = ({
  initialData,
  onSaveMedicine,
  onCancel,
  onNavigate
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Medicine Info
  const [name, setName] = useState(initialData?.name || "");
  const [brandName, setBrandName] = useState(initialData?.brandName || "");
  const [activeIngredient, setActiveIngredient] = useState(initialData?.activeIngredient || "");
  const [type, setType] = useState<MedicineFormType>(initialData?.type || "Capsule");
  const [strength, setStrength] = useState(initialData?.strength || "500 mg");
  const [purpose, setPurpose] = useState(initialData?.purpose || "");
  const [prescribingDoctor, setPrescribingDoctor] = useState(initialData?.prescribingDoctor || "Dr. Sandeep Shah");
  const [doctorPhone, setDoctorPhone] = useState(initialData?.doctorPhone || "+977 9801234567");
  const [hospitalClinic, setHospitalClinic] = useState(initialData?.hospitalClinic || "Norvic International Hospital");

  // Step 2: Schedule & Dosing
  const [scheduleType, setScheduleType] = useState<ScheduleType>(initialData?.scheduleType || "interval");
  const [dosesPerDay, setDosesPerDay] = useState<number>(initialData?.dosesPerDay || 3);
  const [doseTimes, setDoseTimes] = useState<string[]>(
    initialData?.doseTimes && initialData.doseTimes.length > 0
      ? initialData.doseTimes
      : ["08:00 AM", "02:00 PM", "08:00 PM"]
  );
  const [takeWith, setTakeWith] = useState<"Water" | "Milk" | "Juice" | "Any">(initialData?.takeWith || "Water");
  const [foodRelation, setFoodRelation] = useState<
    "Before Food" | "With Food" | "After Food" | "Empty Stomach" | "Before Bed" | "Anytime"
  >(initialData?.foodRelation || "After Food");

  // Step 3: Refill & Review
  const [totalPrescribed, setTotalPrescribed] = useState<number>(initialData?.totalPrescribed || 30);
  const [remainingStock, setRemainingStock] = useState<number>(initialData?.remainingStock || 30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(initialData?.lowStockThreshold || 10);
  const [refillReminderEnabled, setRefillReminderEnabled] = useState<boolean>(
    initialData?.refillReminderEnabled ?? true
  );
  const [instructions, setInstructions] = useState(
    initialData?.instructions || "Take 1 dose after meals with a full glass of water."
  );
  const [prescriptionExpiryDate, setPrescriptionExpiryDate] = useState(
    initialData?.prescriptionExpiryDate || "2026-10-15"
  );

  const handleTimeChange = (index: number, val: string) => {
    const next = [...doseTimes];
    next[index] = val;
    setDoseTimes(next);
  };

  const handleAddDoseTime = () => {
    setDoseTimes([...doseTimes, "10:00 PM"]);
    setDosesPerDay(doseTimes.length + 1);
  };

  const handleRemoveDoseTime = (index: number) => {
    if (doseTimes.length <= 1) return;
    const next = doseTimes.filter((_, i) => i !== index);
    setDoseTimes(next);
    setDosesPerDay(next.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a medicine name");
      setStep(1);
      return;
    }

    const payload: Partial<MedicineItemModel> = {
      name,
      brandName,
      activeIngredient,
      type,
      strength,
      purpose,
      prescribingDoctor,
      doctorPhone,
      hospitalClinic,
      scheduleType,
      dosesPerDay,
      doseTimes,
      takeWith,
      foodRelation,
      instructions,
      totalPrescribed: Number(totalPrescribed),
      remainingStock: Number(remainingStock),
      lowStockThreshold: Number(lowStockThreshold),
      refillReminderEnabled,
      prescriptionExpiryDate,
      status: "Active",
      colorTag: "#6C3CE1"
    };

    onSaveMedicine(payload);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20">
      {/* Step Indicator */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center justify-between">
        {[
          { num: 1, label: "1. Info" },
          { num: 2, label: "2. Schedule" },
          { num: 3, label: "3. Refill & Review" }
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-[#6C3CE1] text-white shadow-xs"
                  : isDone
                  ? "bg-[#F3F0FF] text-[#6C3CE1]"
                  : "text-[#8A8A8A] hover:bg-[#F5F5F5]"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {isDone ? "✓" : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* STEP 1: Medicine Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-4">
            <h3 className="text-sm font-black text-[#6C3CE1] uppercase tracking-wider">
              Step 1: Medicine Details
            </h3>

            {/* Medicine Name */}
            <div>
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amoxicillin, Atorvastatin, Metformin"
                required
                className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-sm font-semibold text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
              />
            </div>

            {/* Brand & Strength */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Brand Name (Optional)
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Moxikind, Lipitor"
                  className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-sm font-semibold text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Strength / Dosage *
                </label>
                <input
                  type="text"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="e.g. 500mg, 10mg, 5ml"
                  required
                  className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-sm font-semibold text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>
            </div>

            {/* Form Type */}
            <div>
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1.5">
                Dosage Form Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  "Tablet",
                  "Capsule",
                  "Syrup",
                  "Injection",
                  "Drops",
                  "Inhaler",
                  "Ointment",
                  "Patch",
                  "Powder",
                  "Suppository"
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t as MedicineFormType)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      type === t
                        ? "bg-[#6C3CE1] text-white shadow-xs"
                        : "bg-[#F5F5F5] text-[#4A4A4A] hover:bg-[#F3F0FF]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                Purpose / Condition (Optional)
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. For Blood Pressure, Antibiotic, Pain relief"
                className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-sm font-semibold text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
              />
            </div>

            {/* Doctor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Prescribing Doctor
                </label>
                <input
                  type="text"
                  value={prescribingDoctor}
                  onChange={(e) => setPrescribingDoctor(e.target.value)}
                  placeholder="e.g. Dr. Sandeep Shah"
                  className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-sm font-semibold text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Hospital / Clinic
                </label>
                <input
                  type="text"
                  value={hospitalClinic}
                  onChange={(e) => setHospitalClinic(e.target.value)}
                  placeholder="e.g. Norvic International Hospital"
                  className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-sm font-semibold text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) {
                    alert("Please enter medicine name");
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-2.5 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Schedule & Dosing */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-4">
            <h3 className="text-sm font-black text-[#6C3CE1] uppercase tracking-wider">
              Step 2: Timings & Schedule
            </h3>

            {/* Dose Times List */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider">
                Daily Dose Times ({doseTimes.length} doses/day)
              </label>
              {doseTimes.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#F3F0FF] text-[#6C3CE1] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                    placeholder="e.g. 08:00 AM"
                    className="flex-1 p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                  />
                  {doseTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoseTime(idx)}
                      className="p-2 text-[#8A8A8A] hover:text-[#E74C3C] transition-colors"
                      title="Remove time"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddDoseTime}
                className="px-3.5 py-1.5 rounded-xl bg-[#F3F0FF] text-[#6C3CE1] hover:bg-[#6C3CE1] hover:text-white text-xs font-bold transition-all border border-[#8B6CE6]/30 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dose Time</span>
              </button>
            </div>

            {/* Food Relationship */}
            <div>
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1.5">
                Food Relationship
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Before Food",
                  "With Food",
                  "After Food",
                  "Empty Stomach",
                  "Before Bed",
                  "Anytime"
                ].map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setFoodRelation(rel as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      foodRelation === rel
                        ? "bg-[#6C3CE1] text-white shadow-xs"
                        : "bg-[#F5F5F5] text-[#4A4A4A] hover:bg-[#F3F0FF]"
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-[#F5F5F5] text-[#4A4A4A] text-xs font-bold rounded-xl hover:bg-[#D1D5DB] cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Refill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Refill & Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-4">
            <h3 className="text-sm font-black text-[#6C3CE1] uppercase tracking-wider">
              Step 3: Inventory & Refill Rules
            </h3>

            {/* Stock Quantities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Total Prescribed
                </label>
                <input
                  type="number"
                  value={totalPrescribed}
                  onChange={(e) => setTotalPrescribed(Number(e.target.value))}
                  min={1}
                  className="w-full p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Current Stock Left
                </label>
                <input
                  type="number"
                  value={remainingStock}
                  onChange={(e) => setRemainingStock(Number(e.target.value))}
                  min={0}
                  className="w-full p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                  Low Stock Alert At
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  min={1}
                  className="w-full p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                Special Instructions / Advice
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="e.g. Complete full 7-day course. Take after food with water."
                className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-medium text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
                Prescription Expiry Date
              </label>
              <input
                type="date"
                value={prescriptionExpiryDate}
                onChange={(e) => setPrescriptionExpiryDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#D1D5DB]/40">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 bg-[#F5F5F5] text-[#4A4A4A] text-xs font-bold rounded-xl hover:bg-[#D1D5DB] cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-purple-900/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>💾 Save Medicine</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
