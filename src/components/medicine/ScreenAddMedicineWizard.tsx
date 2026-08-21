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
  Phone,
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
  onNavigate: (tab: MedicineTab) => void;
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
  const [image, setImage] = useState<string>(
    initialData?.image || "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80"
  );

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
  const [instructions, setInstructions] = useState(initialData?.instructions || "Take 1 dose after meals with full glass of water.");
  const [sideEffects, setSideEffects] = useState(initialData?.sideEffects || "Mild nausea");
  const [warnings, setWarnings] = useState(initialData?.warnings || "Do not skip doses; complete the full course.");
  const [prescriptionExpiryDate, setPrescriptionExpiryDate] = useState(
    initialData?.prescriptionExpiryDate || "2026-06-20"
  );

  // Presets for pill images
  const samplePillImages = [
    { label: "Red Capsule", url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80" },
    { label: "White Tablet", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80" },
    { label: "Small Pill", url: "https://images.unsplash.com/photo-1550572017-ed240b904996?w=300&auto=format&fit=crop&q=80" },
    { label: "Yellow Capsule", url: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop&q=80" }
  ];

  const handleAddDoseTime = () => {
    setDoseTimes((prev) => [...prev, "10:00 PM"]);
  };

  const handleRemoveDoseTime = (index: number) => {
    setDoseTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateDoseTime = (index: number, val: string) => {
    setDoseTimes((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleFinalSubmit = () => {
    if (!name.trim()) {
      alert("Please provide the Medicine Name.");
      setStep(1);
      return;
    }

    const payload: Partial<MedicineItemModel> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: name.trim(),
      brandName: brandName.trim() || undefined,
      activeIngredient: activeIngredient.trim() || undefined,
      type,
      strength: strength.trim(),
      purpose: purpose.trim() || "Prescribed Medication",
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      doctorPhone: doctorPhone.trim() || undefined,
      hospitalClinic: hospitalClinic.trim() || undefined,
      scheduleType,
      dosesPerDay: doseTimes.length > 0 ? doseTimes.length : dosesPerDay,
      doseTimes,
      takeWith,
      foodRelation,
      instructions,
      totalPrescribed: Number(totalPrescribed) || 30,
      remainingStock: Number(remainingStock) || 30,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      refillReminderEnabled,
      prescriptionExpiryDate,
      image,
      sideEffects,
      warnings,
      status: "Active"
    };

    onSaveMedicine(payload);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* 1. Wizard Step Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <span className="text-xs font-extrabold text-[#FF5A36] uppercase tracking-wider">
            {initialData?.id ? "Edit Medication" : "Add New Medicine"}
          </span>
          <span className="text-xs font-bold text-slate-400">Step {step} of 3</span>
        </div>

        {/* Step Indicator Progress */}
        <div className="flex items-center justify-between gap-2 relative">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-orange-100 -translate-y-1/2 z-0" />

          {[
            { num: 1, label: "Medicine Info" },
            { num: 2, label: "Schedule" },
            { num: 3, label: "Review" }
          ].map((s) => {
            const isCurrent = step === s.num;
            const isPast = step > s.num;
            return (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => setStep(s.num as any)}
                  className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-[#FF5A36] text-white ring-4 ring-orange-100 scale-110"
                      : isPast
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-slate-400 border border-orange-200"
                  }`}
                >
                  {isPast ? <Check className="w-4 h-4" /> : s.num}
                </button>
                <span
                  className={`text-[11px] font-bold mt-1 ${
                    isCurrent ? "text-[#FF5A36]" : isPast ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Step 1: Medicine Identity & Details */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#FF5A36]" /> Medicine Identity
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Amoxicillin, Atorvastatin, Metformin"
                className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active Ingredient
                </label>
                <input
                  type="text"
                  value={activeIngredient}
                  onChange={(e) => setActiveIngredient(e.target.value)}
                  placeholder="e.g., Amoxicillin Trihydrate"
                  className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g., Moxikind, Lipitor"
                  className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medicine Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MedicineFormType)}
                  className="w-full px-3 py-2.5 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
                >
                  <option value="Capsule">Capsule</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Syrup">Syrup (Liquid)</option>
                  <option value="Injection">Injection</option>
                  <option value="Drops">Eye/Ear Drops</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Ointment">Ointment / Cream</option>
                  <option value="Patch">Patch</option>
                  <option value="Powder">Powder / Sachet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Strength / Dosage
                </label>
                <input
                  type="text"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="e.g., 500 mg, 10 mg, 5 ml"
                  className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Therapeutic Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Antibiotic, For Cholesterol, Blood Pressure, Thyroid"
                className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
              />
            </div>

            {/* Medicine Photo / Visual Asset */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Upload Medicine Photo / Visual Indicator
              </label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                  {image ? (
                    <img
                      src={image}
                      alt="Medicine preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-orange-400" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {samplePillImages.map((s) => (
                      <button
                        type="button"
                        key={s.label}
                        onClick={() => setImage(s.url)}
                        className={`text-[10px] px-2 py-1 rounded-xl font-bold border transition-colors ${
                          image === s.url
                            ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                            : "bg-white text-slate-600 border-orange-100 hover:bg-orange-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Tap a preset or keep the default visual asset.
                  </div>
                </div>
              </div>
            </div>

            {/* Prescribing Doctor & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-orange-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-orange-500" /> Prescribing Doctor
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={prescribingDoctor}
                    onChange={(e) => setPrescribingDoctor(e.target.value)}
                    placeholder="e.g., Dr. Sandeep Shah"
                    className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-orange-500" /> Hospital / Clinic
                </label>
                <input
                  type="text"
                  value={hospitalClinic}
                  onChange={(e) => setHospitalClinic(e.target.value)}
                  placeholder="e.g., Norvic Hospital"
                  className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!name.trim()) {
                  alert("Please enter the Medicine Name.");
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Next: Schedule & Dosing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Step 2: Schedule & Dosing */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF5A36]" /> Schedule & Dosing
          </h3>

          {/* Schedule Type Selection Grid */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Schedule Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "fixed", title: "Fixed Time", desc: "Specific hours" },
                { id: "interval", title: "Flexible Interval", desc: "Every 6h, 8h" },
                { id: "meal_relative", title: "Meal Relative", desc: "Before / After food" },
                { id: "prn", title: "As Needed (PRN)", desc: "When required" },
                { id: "cycle", title: "Cycle Based", desc: "21 on, 7 off" },
                { id: "alternating", title: "Alternating Days", desc: "Mon, Wed, Fri" }
              ].map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setScheduleType(st.id as ScheduleType)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    scheduleType === st.id
                      ? "bg-orange-50 border-[#FF5A36] ring-1 ring-[#FF5A36] shadow-2xs"
                      : "bg-white border-orange-100 hover:bg-orange-50/50"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{st.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Doses per Day Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Doses per Day</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => {
                    setDosesPerDay(n);
                    if (n === 1) setDoseTimes(["08:00 AM"]);
                    if (n === 2) setDoseTimes(["08:00 AM", "08:00 PM"]);
                    if (n === 3) setDoseTimes(["08:00 AM", "02:00 PM", "08:00 PM"]);
                    if (n === 4) setDoseTimes(["08:00 AM", "01:00 PM", "06:00 PM", "10:00 PM"]);
                  }}
                  className={`flex-1 py-2 rounded-2xl text-xs font-extrabold transition-all border ${
                    doseTimes.length === n
                      ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-2xs"
                      : "bg-orange-50/60 text-slate-700 border-orange-100 hover:bg-orange-100"
                  }`}
                >
                  {n}x Daily
                </button>
              ))}
            </div>
          </div>

          {/* Dose Times List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Scheduled Dose Timings</label>
              <button
                type="button"
                onClick={handleAddDoseTime}
                className="text-xs font-bold text-[#FF5A36] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Time
              </button>
            </div>

            <div className="space-y-2">
              {doseTimes.map((timeStr, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-orange-50/50 rounded-2xl border border-orange-100"
                >
                  <span className="w-6 h-6 rounded-full bg-white text-[#FF5A36] text-xs font-bold flex items-center justify-center border border-orange-200">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={timeStr}
                    onChange={(e) => handleUpdateDoseTime(idx, e.target.value)}
                    placeholder="e.g. 08:00 AM"
                    className="flex-1 px-3 py-1.5 bg-white border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                  />
                  {doseTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoseTime(idx)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Food Relation */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Food Relation</label>
              <select
                value={foodRelation}
                onChange={(e) => setFoodRelation(e.target.value as any)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="After Food">After Food</option>
                <option value="Before Food">Before Food (30m prior)</option>
                <option value="With Food">With Food</option>
                <option value="Empty Stomach">Empty Stomach (Morning)</option>
                <option value="Before Bed">Before Bedtime</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Take With</label>
              <select
                value={takeWith}
                onChange={(e) => setTakeWith(e.target.value as any)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Water">Water (Full Glass)</option>
                <option value="Milk">Milk</option>
                <option value="Juice">Juice</option>
                <option value="Any">Any Beverage</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 bg-orange-50 text-slate-700 font-bold text-xs rounded-2xl border border-orange-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Next: Refill & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Step 3: Review & Refill Settings */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Review & Refill Automation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Prescribed Count
              </label>
              <input
                type="number"
                value={totalPrescribed}
                onChange={(e) => setTotalPrescribed(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Low Stock Threshold (Alert)
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Prescription Valid Until
            </label>
            <input
              type="date"
              value={prescriptionExpiryDate}
              onChange={(e) => setPrescriptionExpiryDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructions & Notes
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Complete 7-day course. Do not stop midway."
              className="w-full px-3.5 py-2 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Summary Preview Box */}
          <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5 space-y-1.5">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>{name} ({strength})</span>
              <span className="text-[#FF5A36]">{doseTimes.length}x Daily</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Timings: <strong>{doseTimes.join(", ")}</strong> • {foodRelation} with {takeWith}
            </div>
            <div className="text-[11px] text-slate-500">
              Stock: {remainingStock} units • Alert when ≤ {lowStockThreshold} remaining
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 bg-orange-50 text-slate-700 font-bold text-xs rounded-2xl border border-orange-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Activate Schedule</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
