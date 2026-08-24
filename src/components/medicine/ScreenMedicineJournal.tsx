import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Smile,
  Meh,
  Frown,
  Activity,
  Calendar,
  Sparkles,
  Check,
  ChevronRight
} from "lucide-react";
import { JournalEntryModel, MedicineTab } from "./types";

interface ScreenMedicineJournalProps {
  entries: JournalEntryModel[];
  onAddEntry: (entry: Partial<JournalEntryModel>) => void;
  onNavigate: (tab: MedicineTab, params?: any) => void;
}

export const ScreenMedicineJournal: React.FC<ScreenMedicineJournalProps> = ({
  entries,
  onAddEntry,
  onNavigate
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [mood, setMood] = useState<"Very Good" | "Good" | "Okay" | "Bad" | "Very Bad">("Good");
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");

  const commonSymptoms = [
    "No Side Effects",
    "Mild Headache",
    "Nausea",
    "Dizziness",
    "Dry Mouth",
    "Fatigue",
    "Stomach Upset",
    "Insomnia"
  ];

  const handleToggleSymptom = (s: string) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({
      date: new Date().toISOString().split("T")[0],
      mood,
      energyLevel,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ["No Symptoms"],
      notes
    });
    setIsAdding(false);
    setSelectedSymptoms([]);
    setNotes("");
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#F3F0FF] text-[#6C3CE1] flex items-center justify-center font-black">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1A1A1A]">
              Medicine & Symptom Journal
            </h3>
            <p className="text-xs text-[#4A4A4A]">
              Track side effects, mood & daily health
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Cancel" : "Log Today"}</span>
        </button>
      </div>

      {/* 2. Add Entry Form */}
      {isAdding && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-5 border-2 border-[#6C3CE1]/30 shadow-[0px_2px_8px_rgba(108,60,225,0.08)] space-y-4"
        >
          <h4 className="text-sm font-black text-[#6C3CE1] uppercase tracking-wider">
            Log Today's Well-being
          </h4>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-2">
              Overall Mood
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  { label: "Very Bad", icon: "😫" },
                  { label: "Bad", icon: "🙁" },
                  { label: "Okay", icon: "😐" },
                  { label: "Good", icon: "😊" },
                  { label: "Very Good", icon: "🤩" }
                ] as const
              ).map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setMood(m.label)}
                  className={`p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    mood === m.label
                      ? "bg-[#6C3CE1] text-white shadow-xs scale-105"
                      : "bg-[#F5F5F5] hover:bg-[#F3F0FF] text-[#1A1A1A]"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[10px] font-bold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-black text-[#6C3CE1] uppercase mb-1">
              <span>Energy Level</span>
              <span className="text-base text-[#1A1A1A]">{energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-[#6C3CE1] cursor-pointer"
            />
          </div>

          {/* Symptoms Chips */}
          <div>
            <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-2">
              Reported Symptoms or Side Effects
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonSymptoms.map((s) => {
                const isSelected = selectedSymptoms.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleToggleSymptom(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#6C3CE1] text-white shadow-xs"
                        : "bg-[#F5F5F5] hover:bg-[#F3F0FF] text-[#4A4A4A]"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-black text-[#6C3CE1] uppercase tracking-wider mb-1">
              Personal Notes / Side Effect Observations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Felt great after morning dose, mild tiredness around 3 PM..."
              className="w-full p-3 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm font-medium text-[#1A1A1A] focus:border-[#6C3CE1] focus:ring-2 focus:ring-[#6C3CE1]/20 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#6C3CE1] hover:bg-[#4A1FAD] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Save Journal Log
          </button>
        </form>
      )}

      {/* 3. History List */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#4A4A4A] px-1">
          Recent Journal Entries ({entries.length})
        </h4>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D5DB]/80 shadow-[0px_2px_8px_rgba(108,60,225,0.06)] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#6C3CE1] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {entry.date}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#6C3CE1] text-xs font-extrabold">
                Mood: {entry.mood}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {entry.symptoms.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#1A1A1A] text-[11px] font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>

            {entry.notes && (
              <p className="text-xs text-[#4A4A4A] bg-[#F5F5F5] p-2.5 rounded-xl mt-2 font-medium">
                "{entry.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
