import React, { useState } from "react";
import { INITIAL_MEASUREMENTS } from "./data";
import { Plus, TrendingUp, TrendingDown, Sparkles, Camera, Check, X } from "lucide-react";
import { BodyStatMeasurement } from "./types";

export const ExerciseMeasurements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stats" | "photos">("stats");
  const [measurements, setMeasurements] = useState<BodyStatMeasurement[]>(INITIAL_MEASUREMENTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("Weight");
  const [newValue, setNewValue] = useState("");
  const [newUnit, setNewUnit] = useState("kg");

  const handleSaveMeasurement = () => {
    if (!newValue) return;
    const item: BodyStatMeasurement = {
      id: "m-" + Date.now(),
      label: newLabel,
      currentValue: parseFloat(newValue),
      unit: newUnit,
      change: -0.5,
      trend: "down",
      date: "Today",
    };
    setMeasurements((prev) => [item, ...prev]);
    setIsAdding(false);
    setNewValue("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TABS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "stats"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Body Stats
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "photos"
                ? "bg-[#FF5A36] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Photos
          </button>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-3.5 py-1.5 rounded-xl bg-orange-100 text-[#FF5A36] hover:bg-orange-200 border border-orange-200 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stat</span>
        </button>
      </div>

      {/* MODAL TO ADD MEASUREMENT */}
      {isAdding && (
        <div className="bg-[#FFF9F5] border-2 border-[#FF5A36] rounded-3xl p-5 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Record New Measurement</h4>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Metric</label>
              <select
                value={newLabel}
                onChange={(e) => {
                  setNewLabel(e.target.value);
                  if (e.target.value === "Weight" || e.target.value === "Muscle Mass") setNewUnit("kg");
                  else if (e.target.value === "Body Fat") setNewUnit("%");
                  else setNewUnit("cm");
                }}
                className="w-full text-xs font-black bg-white border border-orange-200 rounded-xl p-2.5"
              >
                <option value="Weight">Weight</option>
                <option value="Body Fat">Body Fat</option>
                <option value="Muscle Mass">Muscle Mass</option>
                <option value="Chest">Chest</option>
                <option value="Waist">Waist</option>
                <option value="Arms">Arms</option>
                <option value="Thighs">Thighs</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Value ({newUnit})</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 75.2"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full text-xs font-black bg-white border border-orange-200 rounded-xl p-2.5"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSaveMeasurement}
                className="w-full py-2.5 rounded-xl bg-[#FF5A36] text-white text-xs font-black hover:bg-[#EA4C27] shadow-xs cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS LIST */}
      {activeTab === "stats" ? (
        <div className="space-y-2.5">
          {measurements.map((m) => (
            <div
              key={m.id}
              className="bg-[#FFF9F5] hover:bg-[#FFF2EB] border border-orange-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-lg shadow-2xs">
                  📏
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{m.label}</h4>
                  <span className="text-[11px] font-bold text-slate-400">{m.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-base font-black text-slate-900">
                  {m.currentValue} <span className="text-xs font-bold text-slate-400">{m.unit}</span>
                </span>

                <div
                  className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl ${
                    m.trend === "down"
                      ? m.label === "Weight" || m.label === "Body Fat" || m.label === "Waist"
                        ? "bg-emerald-100/80 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                      : "bg-emerald-100/80 text-emerald-700"
                  }`}
                >
                  {m.change < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {Math.abs(m.change)} {m.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-8 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white border border-orange-100 flex items-center justify-center text-3xl mx-auto shadow-2xs">
            📷
          </div>
          <h4 className="text-base font-black text-slate-900">Progress Photos Timeline</h4>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Take side-by-side monthly front, side, and back physique photos with privacy encryption.
          </p>
          <button className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] text-white text-xs font-black shadow-xs hover:bg-[#EA4C27] cursor-pointer">
            + Upload Photo
          </button>
        </div>
      )}

      {/* BOTTOM ACTION BUTTON */}
      <button
        onClick={() => setIsAdding(true)}
        className="w-full py-3.5 rounded-2xl bg-white hover:bg-orange-50 border-2 border-dashed border-orange-300 text-xs font-black text-[#FF5A36] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add New Measurement</span>
      </button>
    </div>
  );
};
