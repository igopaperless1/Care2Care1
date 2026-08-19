import React, { useState, useEffect } from "react";
import {
  X,
  Zap,
  Clock,
  Calendar,
  Camera,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  BookmarkPlus,
  Layers,
} from "lucide-react";
import {
  QuickAddTemplate,
  getQuickAddTemplates,
  submitQuickAddLog,
} from "../utils/QuickAddTemplateEngine";
import { SaveAsTemplateModal } from "./SaveAsTemplateModal";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  showToast?: (msg: string) => void;
  onOpenPendingQueue?: () => void;
  onLogSuccess?: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  patientId,
  showToast,
  onOpenPendingQueue,
  onLogSuccess,
}) => {
  const [templates, setTemplates] = useState<QuickAddTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [typedInputs, setTypedInputs] = useState<Record<string, any>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaveNewModalOpen, setIsSaveNewModalOpen] = useState<boolean>(false);

  // Initialize templates & restore last selected template ID
  useEffect(() => {
    if (isOpen) {
      const tpls = getQuickAddTemplates();
      setTemplates(tpls);

      const lastId = localStorage.getItem("care2care_last_quick_add_template_id");
      if (lastId && tpls.some((t) => t.id === lastId)) {
        setSelectedTemplateId(lastId);
      } else if (tpls.length > 0) {
        setSelectedTemplateId(tpls[0].id);
      }
    }
  }, [isOpen]);

  // Reset inputs when selected template changes
  useEffect(() => {
    if (selectedTemplateId) {
      try {
        localStorage.setItem("care2care_last_quick_add_template_id", selectedTemplateId);
      } catch (e) {
        console.error(e);
      }

      // Pre-fill smart defaults (today date, current time)
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

      setTypedInputs({
        date: todayStr,
        time: timeStr,
        time_taken: timeStr,
        clock_time: timeStr,
        water_amount_ml: 250,
        amount: 25.0,
        sys_bp: 120,
        dia_bp: 80,
        heart_rate: 72,
        spo2: 98,
        qty_sold: 1,
        dosage_taken: "1 Tablet",
      });
      setPhotoPreview(null);
    }
  }, [selectedTemplateId]);

  if (!isOpen) return null;

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleInputChange = (key: string, value: any) => {
    setTypedInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setTypedInputs((prev) => ({ ...prev, photo_url: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    const result = submitQuickAddLog(currentTemplate, typedInputs, patientId);

    if (result.isPendingQueue) {
      if (showToast) {
        showToast(`⏳ Record sent to Pending Review Queue!`);
      }
      if (onOpenPendingQueue) {
        onOpenPendingQueue();
      }
    } else {
      if (showToast) {
        showToast(`⚡ ${result.message}`);
      }
      if (onLogSuccess) {
        onLogSuccess();
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-lg text-xl">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-1.5">
                <span>Quick-Add Log</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                1-Tap template logging across all care services
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Template Selector Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                What are you logging?
              </label>
              <button
                type="button"
                onClick={() => setIsSaveNewModalOpen(true)}
                className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>+ Create Template</span>
              </button>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  ⚡ {tpl.templateName} ({tpl.serviceType.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>

          {/* DYNAMIC FIELD RENDERING (Based on visible_fields) */}
          {currentTemplate && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 border-b border-emerald-200/60 pb-2">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Configured Shortcut: {currentTemplate.templateName}</span>
                </span>
                <span className="text-[9px] bg-emerald-200 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase">
                  {currentTemplate.serviceType}
                </span>
              </div>

              {currentTemplate.visibleFields.map((fieldKey) => {
                const label = fieldKey.replace("_", " ").toUpperCase();

                if (fieldKey === "amount" || fieldKey === "fuel_cost" || fieldKey === "unit_price" || fieldKey === "cost") {
                  return (
                    <div key={fieldKey}>
                      <label className="block text-xs font-black text-slate-800 mb-1">{label} ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={typedInputs[fieldKey] !== undefined ? typedInputs[fieldKey] : ""}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  );
                }

                if (fieldKey === "description" || fieldKey === "notes") {
                  return (
                    <div key={fieldKey}>
                      <label className="block text-xs font-black text-slate-800 mb-1">{label}</label>
                      <input
                        type="text"
                        value={typedInputs[fieldKey] || ""}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        placeholder="Quick notes or description..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  );
                }

                if (fieldKey === "date") {
                  return (
                    <div key={fieldKey}>
                      <label className="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>DATE LOGGED</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={typedInputs[fieldKey] || new Date().toISOString().split("T")[0]}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                  );
                }

                if (fieldKey === "water_amount_ml") {
                  return (
                    <div key={fieldKey}>
                      <label className="block text-xs font-black text-slate-800 mb-1">WATER AMOUNT (ML)</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[150, 250, 500, 750].map((ml) => (
                          <button
                            type="button"
                            key={ml}
                            onClick={() => handleInputChange(fieldKey, ml)}
                            className={`py-1.5 rounded-lg text-xs font-black transition-all border ${
                              typedInputs[fieldKey] === ml
                                ? "bg-emerald-700 text-white border-emerald-800"
                                : "bg-white text-slate-700 border-slate-300"
                            }`}
                          >
                            {ml}ml
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (fieldKey === "sys_bp" || fieldKey === "dia_bp" || fieldKey === "heart_rate" || fieldKey === "spo2") {
                  return (
                    <div key={fieldKey}>
                      <label className="block text-xs font-black text-slate-800 mb-1">{label}</label>
                      <input
                        type="number"
                        required
                        value={typedInputs[fieldKey] !== undefined ? typedInputs[fieldKey] : ""}
                        onChange={(e) => handleInputChange(fieldKey, Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 outline-none"
                      />
                    </div>
                  );
                }

                return (
                  <div key={fieldKey}>
                    <label className="block text-xs font-black text-slate-800 mb-1">{label}</label>
                    <input
                      type="text"
                      value={typedInputs[fieldKey] || ""}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                );
              })}

              {/* Photo Upload Option */}
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                <label className="text-xs font-black text-emerald-900 flex items-center gap-1.5 cursor-pointer">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Attach Photo / Receipt</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </label>
                {photoPreview && (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                    Attached ✓
                  </span>
                )}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-2xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-amber-300" />
              <span>Log Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* SAVE NEW TEMPLATE MODAL */}
      <SaveAsTemplateModal
        isOpen={isSaveNewModalOpen}
        onClose={() => setIsSaveNewModalOpen(false)}
        initialServiceType={currentTemplate?.serviceType || "expense"}
        onTemplateSaved={(newTpl) => {
          setTemplates(getQuickAddTemplates());
          setSelectedTemplateId(newTpl.id);
        }}
        showToast={showToast}
      />
    </div>
  );
};
