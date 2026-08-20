import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Sparkles,
  ChevronRight,
  Heart,
  Brain,
  Smile,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Lock,
  Droplets,
  Check
} from "lucide-react";
import { JournalItem, CBTThoughtItem } from "./types";
import { soundEngine } from "./soundEngine";

export const MentalJournaling: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Journal" | "Gratitude" | "Thoughts">("Journal");
  const [entryContent, setEntryContent] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // CBT Tab state
  const [cbtSituation, setCbtSituation] = useState<string>("");
  const [cbtAutoThought, setCbtAutoThought] = useState<string>("");
  const [cbtEvidenceAgainst, setCbtEvidenceAgainst] = useState<string>("");
  const [cbtAlternativeThought, setCbtAlternativeThought] = useState<string>("");
  const [cbtBeliefBefore, setCbtBeliefBefore] = useState<number>(8);
  const [cbtBeliefAfter, setCbtBeliefAfter] = useState<number>(3);

  const [savedEntries, setSavedEntries] = useState<JournalItem[]>([
    {
      id: "j-1",
      title: "Morning Clarity & Walk",
      date: "14 May 2025",
      time: "9:15 AM",
      category: "Journal",
      content: "Felt very refreshed after the 15-minute nature walk. The morning breeze cleared my head before tackling the work presentations.",
      moodTag: "😊 Peaceful",
    },
    {
      id: "j-2",
      title: "3 Things I Am Grateful For",
      date: "13 May 2025",
      time: "8:30 PM",
      category: "Gratitude",
      content: "1. Supportive colleagues who helped on the project\n2. A warm cup of chamomile tea\n3. Consistent 8 hours of sleep",
      moodTag: "🤗 Grateful",
    },
  ]);

  const [cbtRecords, setCbtRecords] = useState<CBTThoughtItem[]>([
    {
      id: "cbt-1",
      date: "12 May 2025",
      situation: "Upcoming team presentation",
      automaticThought: "I will make a mistake and everyone will judge me.",
      emotion: "Anxious",
      beliefBefore: 85,
      cognitiveDistortion: "Catastrophizing",
      evidenceAgainst: "I have prepared the deck thoroughly and presented 5 times successfully before.",
      alternativeThought: "Even if I stumble on a word, I know the material and the team wants me to succeed.",
      beliefAfter: 25,
    },
  ]);

  const prompts = [
    "What made me feel grounded today?",
    "What are 3 small wins from today?",
    "What challenge did I navigate calmly?",
    "What is something I appreciate about myself?",
  ];

  const handleSaveEntry = () => {
    if (!entryContent.trim()) return;
    soundEngine.playChime(620, 0.4);
    const newEntry: JournalItem = {
      id: `j-${Date.now()}`,
      title: selectedPrompt || (activeTab === "Gratitude" ? "Gratitude Reflection" : "Daily Reflection"),
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      category: activeTab === "Gratitude" ? "Gratitude" : "Journal",
      content: entryContent.trim(),
      moodTag: "✨ Reflected",
    };
    setSavedEntries([newEntry, ...savedEntries]);
    setEntryContent("");
    setSelectedPrompt(null);
  };

  const handleSaveCBT = () => {
    if (!cbtSituation.trim() || !cbtAutoThought.trim()) return;
    soundEngine.playChime(620, 0.4);
    const newCbt: CBTThoughtItem = {
      id: `cbt-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      situation: cbtSituation.trim(),
      automaticThought: cbtAutoThought.trim(),
      emotion: "Challenged",
      beliefBefore: cbtBeliefBefore * 10,
      cognitiveDistortion: "All-or-Nothing Thinking",
      evidenceAgainst: cbtEvidenceAgainst.trim() || "Observed past positive patterns.",
      alternativeThought: cbtAlternativeThought.trim() || "There is a balanced, compassionate view.",
      beliefAfter: cbtBeliefAfter * 10,
    };
    setCbtRecords([newCbt, ...cbtRecords]);
    setCbtSituation("");
    setCbtAutoThought("");
    setCbtEvidenceAgainst("");
    setCbtAlternativeThought("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Self Reflection
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Journal & CBT Thought Diary</h2>
          <p className="text-xs text-slate-500 font-medium">Reframe thoughts and cultivate daily gratitude.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Navigation Segments */}
      <div className="flex bg-[#FFF9F5] p-1 rounded-2xl border border-orange-200/80 gap-1">
        {(["Journal", "Gratitude", "Thoughts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-[#FF5A36] text-white shadow-xs font-black"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            {tab === "Journal" ? "Daily Journal" : tab === "Gratitude" ? "Gratitude List" : "CBT Thought Record"}
          </button>
        ))}
      </div>

      {/* JOURNAL / GRATITUDE TAB */}
      {(activeTab === "Journal" || activeTab === "Gratitude") && (
        <div className="space-y-4">
          {/* Prompt Generator Chips */}
          <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Guided Reflection Prompts
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPrompt(p)}
                  className={`p-3 rounded-2xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    selectedPrompt === p
                      ? "bg-[#FFF9F5] border-[#FF5A36] text-[#FF5A36]"
                      : "bg-white border-slate-200/80 text-slate-700 hover:border-orange-200"
                  }`}
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* New Entry Box */}
          <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                {selectedPrompt ? selectedPrompt : `New ${activeTab} Entry`}
              </span>
              <span className="text-[11px] font-bold text-slate-400">Encrypted & Private</span>
            </div>

            <textarea
              rows={4}
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              placeholder={
                activeTab === "Gratitude"
                  ? "List 3 things you are grateful for right now..."
                  : "Write your thoughts freely without judgment..."
              }
              className="w-full p-4 text-xs text-slate-800 bg-[#FFF9F5] border border-orange-200/80 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#FF5A36]"
            />

            <button
              onClick={handleSaveEntry}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Entry</span>
            </button>
          </div>

          {/* Previous Entries Feed */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Recent Journal Entries
            </span>

            {savedEntries.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{item.date} • {item.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {item.content}
                </p>
                <div className="pt-2 border-t border-orange-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {item.moodTag}
                  </span>
                  <button
                    onClick={() => setSavedEntries(savedEntries.filter((e) => e.id !== item.id))}
                    className="text-slate-300 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CBT THOUGHT RECORD TAB */}
      {activeTab === "Thoughts" && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Structured Cognitive Restructuring Form
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  1. Triggering Situation / Event
                </label>
                <input
                  type="text"
                  value={cbtSituation}
                  onChange={(e) => setCbtSituation(e.target.value)}
                  placeholder="e.g. Critical email from manager"
                  className="w-full p-2.5 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  2. Automatic Negative Thought (ANT)
                </label>
                <input
                  type="text"
                  value={cbtAutoThought}
                  onChange={(e) => setCbtAutoThought(e.target.value)}
                  placeholder="e.g. I am going to get fired"
                  className="w-full p-2.5 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  3. Evidence Against This Thought
                </label>
                <input
                  type="text"
                  value={cbtEvidenceAgainst}
                  onChange={(e) => setCbtEvidenceAgainst(e.target.value)}
                  placeholder="e.g. My overall annual review was exceptional; they just asked for a minor edit"
                  className="w-full p-2.5 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  4. Balanced Alternative Thought
                </label>
                <input
                  type="text"
                  value={cbtAlternativeThought}
                  onChange={(e) => setCbtAlternativeThought(e.target.value)}
                  placeholder="e.g. Feedback is normal collaboration, not a threat to my career"
                  className="w-full p-2.5 bg-[#FFF9F5] border border-orange-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#FFF9F5] rounded-xl border border-orange-200/80">
                  <span className="text-[10px] font-bold text-slate-500 block">Belief in Negative Thought</span>
                  <div className="text-sm font-black text-rose-500">{cbtBeliefBefore}/10 (Severe)</div>
                </div>
                <div className="p-3 bg-[#FFF9F5] rounded-xl border border-orange-200/80">
                  <span className="text-[10px] font-bold text-slate-500 block">Belief After Reframing</span>
                  <div className="text-sm font-black text-[#FF5A36]">{cbtBeliefAfter}/10 (Resolved)</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveCBT}
              className="w-full py-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs cursor-pointer"
            >
              Save CBT Thought Record
            </button>
          </div>

          {/* Past CBT Records */}
          <div className="space-y-3">
            {cbtRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{rec.situation}</span>
                  <span className="text-[10px] font-bold text-slate-400">{rec.date}</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] font-black text-rose-700 uppercase block">Automatic Thought</span>
                  <p className="text-xs text-rose-900 font-medium">"{rec.automaticThought}"</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                  <span className="text-[10px] font-black text-[#FF5A36] uppercase block">Rational Reframe</span>
                  <p className="text-xs text-slate-800 font-medium">"{rec.alternativeThought}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
