import React, { useState } from "react";
import {
  BookOpen,
  Smile,
  Meh,
  Frown,
  Heart,
  Sparkles,
  Plus,
  Check,
  Calendar,
  Zap,
  Activity
} from "lucide-react";
import { JournalEntryModel, MedicineTab } from "./types";

interface ScreenMedicineJournalProps {
  entries: JournalEntryModel[];
  onAddEntry: (entry: Partial<JournalEntryModel>) => void;
  onNavigate: (tab: MedicineTab) => void;
}

export const ScreenMedicineJournal: React.FC<ScreenMedicineJournalProps> = ({
  entries,
  onAddEntry,
  onNavigate
}) => {
  const [selectedMood, setSelectedMood] = useState<"Very Good" | "Good" | "Okay" | "Bad">("Good");
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Mild Nausea"]);
  const [notes, setNotes] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const symptomOptions = [
    "Mild Nausea",
    "Headache",
    "Dizziness",
    "Stomach Pain",
    "Drowsiness / Fatigue",
    "Dry Mouth",
    "Heartburn",
    "Skin Rash",
    "Loss of Appetite",
    "Muscle Aches"
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms((prev) => prev.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms((prev) => [...prev, sym]);
    }
  };

  const handleSave = () => {
    const newEntry: Partial<JournalEntryModel> = {
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      energyLevel,
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined
    };

    onAddEntry(newEntry);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    setNotes("");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* 1. Daily Check-in Form */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-orange-100/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">How do you feel today?</h3>
              <p className="text-[11px] text-slate-500">Track medication tolerance & side effects</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#FF5A36] bg-orange-50 px-2.5 py-1 rounded-full">
            Today
          </span>
        </div>

        {/* Mood Selection Row */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Overall Mood & Wellbeing</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Very Good", emoji: "😃", color: "border-emerald-400 bg-emerald-50 text-emerald-900" },
              { label: "Good", emoji: "😊", color: "border-orange-400 bg-orange-50 text-orange-950" },
              { label: "Okay", emoji: "😐", color: "border-amber-400 bg-amber-50 text-amber-950" },
              { label: "Bad", emoji: "😟", color: "border-red-400 bg-red-50 text-red-950" }
            ].map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMood(m.label as any)}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                  selectedMood === m.label
                    ? `${m.color} ring-2 ring-[#FF5A36]/30 scale-105 shadow-2xs font-black`
                    : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-orange-50/50"
                }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[11px] font-bold">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Energy Level
            </span>
            <span className="text-[#FF5A36] font-black">{energyLevel} / 10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full accent-[#FF5A36] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
            <span>Low (1)</span>
            <span>Moderate (5)</span>
            <span>High Vitality (10)</span>
          </div>
        </div>

        {/* Symptoms Checklist */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-bold text-slate-700">
            Observed Symptoms / Side Effects
          </label>
          <div className="flex flex-wrap gap-1.5">
            {symptomOptions.map((sym) => {
              const active = selectedSymptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                    active
                      ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-2xs"
                      : "bg-white text-slate-700 border-orange-100 hover:bg-orange-50"
                  }`}
                >
                  {sym} {active && "✓"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Note */}
        <div className="space-y-1 pt-1">
          <label className="block text-xs font-bold text-slate-700">Personal Health Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write how you felt after your doses, sleep quality, meal effects..."
            className="w-full px-3.5 py-2.5 bg-orange-50/40 border border-orange-200/80 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/40"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs rounded-2xl shadow-sm shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Journal Entry Saved!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Save Daily Health Check-in</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Past Log Entries History */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Past Journal Entries
        </h4>

        {entries.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-4 border border-orange-100 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                  Mood: {item.mood}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" /> Energy: {item.energyLevel}/10
              </span>
            </div>

            {item.symptoms && item.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.symptoms.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-semibold border border-red-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {item.notes && <p className="text-xs text-slate-600 italic">"{item.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
