import React, { useState } from "react";
import {
  Smile,
  Frown,
  Meh,
  Plus,
  Check,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  History,
  TrendingUp,
  Droplets,
  Heart
} from "lucide-react";
import { MoodEntry } from "./types";
import { soundEngine } from "./soundEngine";

interface MentalMoodTrackerProps {
  onSaveMood: (entry: MoodEntry) => void;
  recentEntries?: MoodEntry[];
}

export const MentalMoodTracker: React.FC<MentalMoodTrackerProps> = ({
  onSaveMood,
  recentEntries = [],
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(3); // 3 = Good
  const [intensity, setIntensity] = useState<number>(7);
  const [note, setNote] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Work", "Health", "Nature Walk"]);
  const [customTagInput, setCustomTagInput] = useState<string>("");
  const [isAddingCustomTag, setIsAddingCustomTag] = useState<boolean>(false);

  const moodOptions = [
    { index: 0, label: "Very Bad", emoji: "😢", desc: "Overwhelmed & down" },
    { index: 1, label: "Bad", emoji: "🙁", desc: "Low energy & stressed" },
    { index: 2, label: "Okay", emoji: "😐", desc: "Neutral / Balanced" },
    { index: 3, label: "Good", emoji: "😊", desc: "Positive & Grounded" },
    { index: 4, label: "Excellent", emoji: "😁", desc: "Energized & Inspired" },
  ];

  const defaultTags = ["Work", "Family", "Health", "Friends", "Sleep", "Fitness", "Relaxation", "Focus", "Nature Walk", "Diet"];

  const toggleTag = (tag: string) => {
    soundEngine.playChime(500, 0.1);
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
      setSelectedTags([...selectedTags, customTagInput.trim()]);
      setCustomTagInput("");
      setIsAddingCustomTag(false);
    }
  };

  const handleSave = () => {
    soundEngine.playChime(620, 0.5);
    const selectedMood = moodOptions[selectedIndex];
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      moodIndex: selectedIndex,
      moodLabel: selectedMood.label,
      emoji: selectedMood.emoji,
      intensity,
      note: note.trim() || undefined,
      tags: selectedTags,
    };
    onSaveMood(newEntry);
    setNote("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Daily Check-In
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">How are you feeling right now?</h2>
          <p className="text-xs text-slate-500 font-medium">Log your mood to discover mental wellness patterns.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-2xl shadow-xs">
          {moodOptions[selectedIndex].emoji}
        </div>
      </div>

      {/* 2. Mood Emoji Selector */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Select Your Current Mood
        </span>

        <div className="grid grid-cols-5 gap-2.5">
          {moodOptions.map((opt) => {
            const isSelected = selectedIndex === opt.index;
            return (
              <button
                key={opt.index}
                onClick={() => {
                  setSelectedIndex(opt.index);
                  soundEngine.playChime(420 + opt.index * 60, 0.3);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#FFF9F5] border-[#FF5A36] shadow-xs scale-105"
                    : "bg-white border-slate-200/80 hover:border-orange-200 hover:bg-orange-50/40"
                }`}
              >
                <span className="text-3xl transform transition-transform hover:scale-115">
                  {opt.emoji}
                </span>
                <span
                  className={`text-[11px] font-black mt-2 ${
                    isSelected ? "text-[#FF5A36]" : "text-slate-700"
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-[#FFF9F5] rounded-2xl border border-orange-200/60 text-center">
          <p className="text-xs font-bold text-slate-700">
            {moodOptions[selectedIndex].emoji} &nbsp;
            <span className="text-[#FF5A36] font-black">{moodOptions[selectedIndex].label}:</span> {moodOptions[selectedIndex].desc}
          </p>
        </div>
      </div>

      {/* 3. Intensity Slider */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Mood Intensity / Clarity
          </span>
          <span className="px-3 py-1 bg-orange-100 text-[#FF5A36] border border-orange-200 rounded-xl text-xs font-black">
            {intensity} / 10
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-[#FF5A36] cursor-pointer h-2 bg-orange-100 rounded-lg appearance-none"
        />

        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>1 (Mild / Faint)</span>
          <span>5 (Moderate)</span>
          <span>10 (Very Strong)</span>
        </div>
      </div>

      {/* 4. Contributing Factors / Tags */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            What's impacting your mood?
          </span>
          <span className="text-xs font-bold text-slate-400">
            {selectedTags.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {defaultTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
                }`}
              >
                {tag}
              </button>
            );
          })}

          {selectedTags
            .filter((t) => !defaultTags.includes(t))
            .map((custom) => (
              <button
                key={custom}
                onClick={() => toggleTag(custom)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A36] text-white border border-[#FF5A36] shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <span>{custom}</span>
                <span>×</span>
              </button>
            ))}

          {isAddingCustomTag ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
                placeholder="Custom tag..."
                className="px-3 py-1 text-xs border border-orange-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36] w-32"
                autoFocus
              />
              <button
                onClick={handleAddCustomTag}
                className="px-2.5 py-1 bg-[#FF5A36] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCustomTag(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#FF5A36] bg-orange-50 hover:bg-orange-100 border border-orange-200 border-dashed flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Factor</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Notes & Reflection */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-2">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
          Add Reflection or Notes (Optional)
        </span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What contributed to this feeling today? Any specific thoughts or triggers?"
          className="w-full p-3.5 text-xs text-slate-800 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36]"
        />
      </div>

      {/* 6. Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#FF5A36] hover:bg-[#E04826] text-white font-black text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>Save Mood Entry</span>
      </button>
    </div>
  );
};
