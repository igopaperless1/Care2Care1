import React, { useState } from "react";
import { X, Sparkles, Check, Bookmark, Clock, Layers } from "lucide-react";
import {
  QuickAddTemplate,
  ServiceType,
  saveQuickAddTemplate,
} from "../utils/QuickAddTemplateEngine";

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: ServiceType;
  initialPayload?: Record<string, any>;
  onTemplateSaved?: (newTpl: QuickAddTemplate) => void;
  showToast?: (msg: string) => void;
}

const AVAILABLE_FIELDS: { key: string; label: string; defaultFor: ServiceType[] }[] = [
  { key: "amount", label: "Amount / Price ($)", defaultFor: ["expense", "retail_sale", "pet_care"] },
  { key: "description", label: "Description / Notes", defaultFor: ["expense", "vehicle_mileage", "pet_care"] },
  { key: "date", label: "Date Logged", defaultFor: ["expense", "vital_log", "vehicle_mileage"] },
  { key: "merchant", label: "Merchant / Vendor", defaultFor: ["expense"] },
  { key: "medicine_name", label: "Medicine Name", defaultFor: ["prescription"] },
  { key: "dosage_taken", label: "Dosage (e.g. 1 Pill)", defaultFor: ["prescription"] },
  { key: "time_taken", label: "Time Logged", defaultFor: ["prescription", "water_log"] },
  { key: "vehicle_name", label: "Vehicle / License Plate", defaultFor: ["vehicle_mileage"] },
  { key: "fuel_cost", label: "Fuel Cost ($)", defaultFor: ["vehicle_mileage"] },
  { key: "odometer_reading", label: "Odometer Miles", defaultFor: ["vehicle_mileage"] },
  { key: "employee_name", label: "Employee Name", defaultFor: ["employee_clockin"] },
  { key: "clock_time", label: "Clock Time", defaultFor: ["employee_clockin"] },
  { key: "water_amount_ml", label: "Water Amount (ml)", defaultFor: ["water_log"] },
  { key: "sys_bp", label: "Systolic BP", defaultFor: ["vital_log"] },
  { key: "dia_bp", label: "Diastolic BP", defaultFor: ["vital_log"] },
  { key: "heart_rate", label: "Heart Rate (BPM)", defaultFor: ["vital_log"] },
  { key: "spo2", label: "SpO2 Oxygen %", defaultFor: ["vital_log"] },
  { key: "item_name", label: "Item / SKU Name", defaultFor: ["retail_sale"] },
  { key: "qty_sold", label: "Quantity Sold", defaultFor: ["retail_sale"] },
  { key: "pet_name", label: "Pet Name", defaultFor: ["pet_care"] },
];

export const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
  isOpen,
  onClose,
  initialServiceType = "expense",
  initialPayload = {},
  onTemplateSaved,
  showToast,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>(initialServiceType);
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    return AVAILABLE_FIELDS.filter((f) => f.defaultFor.includes(initialServiceType)).map((f) => f.key);
  });
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");

  if (!isOpen) return null;

  const toggleField = (key: string) => {
    if (selectedFields.includes(key)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((k) => k !== key));
      }
    } else {
      if (selectedFields.length < 5) {
        setSelectedFields([...selectedFields, key]);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    const saved = saveQuickAddTemplate({
      userId: "usr-default",
      serviceType,
      templateName: templateName.trim(),
      hiddenPayload: initialPayload,
      visibleFields: selectedFields,
      isReminderEnabled,
      reminderTime: isReminderEnabled ? reminderTime : undefined,
    });

    if (showToast) {
      showToast(`⚡ Quick-Add Template "${saved.templateName}" saved!`);
    }

    if (onTemplateSaved) {
      onTemplateSaved(saved);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-1.5">
                <span>Save as Quick-Add Template</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-200/90 font-medium">
                Eliminate form fatigue by saving this configuration for 1-tap logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Template Name / Shortcut Title
            </label>
            <input
              type="text"
              required
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Gas Refuel, Subcontractor Payout, Morning Pills..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Service Domain
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none"
              >
                <option value="expense">💰 Finance Expense</option>
                <option value="prescription">💊 Health & Prescription</option>
                <option value="vehicle_mileage">🚗 Vehicle & Mileage</option>
                <option value="employee_clockin">💼 HR & Staff Clock-In</option>
                <option value="vital_log">🩺 Health Vitals Log</option>
                <option value="water_log">💧 Hydration Log</option>
                <option value="pet_care">🐾 Pet Care</option>
                <option value="retail_sale">🛒 Retail POS Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Daily Reminder
              </label>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk_rem"
                  checked={isReminderEnabled}
                  onChange={(e) => setIsReminderEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="chk_rem" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Enable Daily Prompt
                </label>
              </div>
              {isReminderEnabled && (
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="mt-1 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-xl text-xs font-black text-slate-800"
                />
              )}
            </div>
          </div>

          {/* VISIBLE FIELDS CHECKBOX MATRIX */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visible Daily Fields (Pick 2-4 max)</span>
              </label>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {selectedFields.length} / 5 Selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {AVAILABLE_FIELDS.map((field) => {
                const isChecked = selectedFields.includes(field.key);
                return (
                  <button
                    type="button"
                    key={field.key}
                    onClick={() => toggleField(field.key)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${
                      isChecked
                        ? "bg-emerald-800 text-amber-300 border-emerald-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{field.label}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>Save Shortcut Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
