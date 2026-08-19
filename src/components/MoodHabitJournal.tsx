import React, { useState } from "react";
import { Patient } from "../types";
import {
  Smile,
  Frown,
  Meh,
  Heart,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  History,
  Settings as SettingsIcon,
  Award,
  BarChart3,
  Bell,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  TrendingUp,
  Activity,
  Flame,
  Zap,
  Sliders,
  Shield,
  Trash2,
  Share2,
  Tag,
  ThumbsUp,
  AlertCircle
} from "lucide-react";

export type MoodTab =
  | "dashboard"
  | "log_mood"
  | "history"
  | "analytics"
  | "insights"
  | "triggers"
  | "calendar"
  | "milestones"
  | "reminders"
  | "settings"
  | "trends_30";

interface MoodHabitJournalProps {
  patient?: Patient;
  onLogMood?: (patientId: string, emotion: string, intensity: number) => void;
  onCheckHabit?: (patientId: string, habitId: string) => void;
}

export const MoodHabitJournal: React.FC<MoodHabitJournalProps> = ({
  patient,
  onLogMood,
}) => {
  const [activeTab, setActiveTab] = useState<MoodTab>("dashboard");
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Form State
  const [formMood, setFormMood] = useState<"very_bad" | "bad" | "okay" | "good" | "excellent">("good");
  const [formIntensity, setFormIntensity] = useState<number>(7);
  const [formNotes, setFormNotes] = useState<string>("Had a productive morning and a great lunch with friends.");
  const [formSelectedTags, setFormSelectedTags] = useState<string[]>(["Work", "Friends"]);
  const [formTime, setFormTime] = useState<string>("10:30 AM");

  // History & Analytics State
  const [historyPeriod, setHistoryPeriod] = useState<"Day" | "Week" | "Month" | "Year">("Month");
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"7 Days" | "30 Days" | "90 Days" | "Year">("7 Days");
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>("2025-05-14");

  // Triggers State
  const [triggersSubTab, setTriggersSubTab] = useState<"personal" | "statistics">("personal");
  const [triggersList, setTriggersList] = useState([
    { id: "t1", title: "Work Pressure", desc: "Often makes your mood worse", score: -5, icon: "💼", type: "negative" },
    { id: "t2", title: "Lack of Sleep", desc: "Often makes your mood worse", score: -4, icon: "🌙", type: "negative" },
    { id: "t3", title: "Exercise", desc: "Often improves your mood", score: 4, icon: "🏃", type: "positive" },
    { id: "t4", title: "Time with Friends", desc: "Often improves your mood", score: 5, icon: "☕", type: "positive" },
    { id: "t5", title: "Healthy Food", desc: "Improves your mood", score: 3, icon: "🥗", type: "positive" },
  ]);
  const [newTriggerName, setNewTriggerName] = useState("");

  // Reminders State
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminders, setReminders] = useState([
    { id: "rem1", title: "Morning Check-in", time: "9:00 AM", freq: "Every day", enabled: true },
    { id: "rem2", title: "Afternoon Check-in", time: "3:00 PM", freq: "Every day", enabled: true },
    { id: "rem3", title: "Evening Check-in", time: "9:00 PM", freq: "Every day", enabled: true },
    { id: "rem4", title: "Weekly Reflection", time: "Sunday • 8:00 PM", freq: "Every week", enabled: true },
  ]);

  // Settings State
  const [defaultMood, setDefaultMood] = useState("Good");
  const [reminderTimesSetting, setReminderTimesSetting] = useState("3 times a day");
  const [hideFromHome, setHideFromHome] = useState(false);

  const moodEmojis = {
    very_bad: { emoji: "😡", label: "Very Bad", color: "text-rose-500", bg: "bg-rose-50" },
    bad: { emoji: "🙁", label: "Bad", color: "text-orange-500", bg: "bg-orange-50" },
    okay: { emoji: "😐", label: "Okay", color: "text-amber-500", bg: "bg-amber-50" },
    good: { emoji: "🙂", label: "Good", color: "text-emerald-500", bg: "bg-emerald-50" },
    excellent: { emoji: "😄", label: "Excellent", color: "text-green-600", bg: "bg-green-50" },
  };

  const navMenuItems: Array<{ id: MoodTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "log_mood", label: "Log Mood", icon: Smile },
    { id: "history", label: "Mood History", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "insights", label: "Insights", icon: Sparkles },
    { id: "triggers", label: "Triggers", icon: Zap },
    { id: "calendar", label: "Mood Calendar", icon: CalendarIcon },
    { id: "milestones", label: "Milestones", icon: Award },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "settings", label: "Mood Settings", icon: SettingsIcon },
    { id: "trends_30", label: "Mood Trends (30 Days)", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#FF5A36] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-black animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Mood Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mood & Mental Wellbeing
            </h1>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("log_mood")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Mood</span>
        </button>
      </div>

      {/* HORIZONTAL SCROLLING MENU (AS PER USER REQUIREMENT) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                  : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF5A36]"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SCREEN 1: MOOD DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Mood</span>
                <p className="text-sm font-black text-slate-800">14 May 2025</p>
              </div>
            </div>

            {/* Central Smiley & Score Card */}
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-5xl shadow-sm mb-3 animate-bounce">
                🙂
              </div>
              <h2 className="text-2xl font-black text-slate-900">Good</h2>
              <p className="text-xs text-slate-500 font-bold">You're doing great!</p>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black rounded-full mt-3">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>72% Positive Day</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-orange-50/70 border border-orange-200/60 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Mood Streak</span>
                  <p className="text-sm font-black text-slate-900">5 Days</p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50/70 border border-sky-200/60 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Check-ins</span>
                  <p className="text-sm font-black text-slate-900">1 / 3</p>
                </div>
              </div>
            </div>

            {/* Mood Trend This Week */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Mood Trend (This Week)</span>
                <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setActiveTab("analytics")} />
              </div>

              <div className="h-28 flex items-end justify-between gap-2 pt-2 px-2 border-b border-slate-200 pb-2">
                {[
                  { day: "Mon", emoji: "🙂", val: 7 },
                  { day: "Tue", emoji: "😄", val: 9 },
                  { day: "Wed", emoji: "🙂", val: 8 },
                  { day: "Thu", emoji: "😐", val: 5 },
                  { day: "Fri", emoji: "😄", val: 9 },
                  { day: "Sat", emoji: "🙂", val: 7 },
                  { day: "Sun", emoji: "😄", val: 9 },
                ].map((pt) => (
                  <div key={pt.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-base">{pt.emoji}</span>
                    <div
                      className="w-1.5 bg-[#FF5A36] rounded-full"
                      style={{ height: `${pt.val * 5}px` }}
                    />
                    <span className="text-[10px] font-bold text-slate-400">{pt.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab("log_mood")}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Mood</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOG MOOD */}
      {activeTab === "log_mood" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-900">How are you feeling?</h2>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
              <ChevronLeft className="w-4 h-4 cursor-pointer" />
              <span>Today, 14 May 2025</span>
              <ChevronRight className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* 5 Emojis Selector */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "very_bad", emoji: "😡", label: "Very Bad" },
              { id: "bad", emoji: "🙁", label: "Bad" },
              { id: "okay", emoji: "😐", label: "Okay" },
              { id: "good", emoji: "🙂", label: "Good" },
              { id: "excellent", emoji: "😄", label: "Excellent" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFormMood(m.id as any)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  formMood === m.id
                    ? "bg-orange-50 border-[#FF5A36] text-[#FF5A36] shadow-xs scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-3xl block mb-1">{m.emoji}</span>
                <span className="text-[10px] font-black">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Intensity Slider */}
          <div className="p-4 bg-[#FFF9F5] border border-orange-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Intensity</span>
              <span className="text-[#FF5A36] font-black">{formIntensity} / 10</span>
            </div>
            <p className="text-[11px] text-slate-500">How strong is this feeling?</p>
            <input
              type="range"
              min="1"
              max="10"
              value={formIntensity}
              onChange={(e) => setFormIntensity(parseInt(e.target.value))}
              className="w-full accent-[#FF5A36]"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>1 (Mild)</span>
              <span>10 (Very Strong)</span>
            </div>
          </div>

          {/* What's on your mind? */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">What's on your mind? (Optional)</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Share what's happening..."
              rows={3}
              className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Tags (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {["Work", "Family", "Health", "Friends", "Workout", "Sleep", "Food"].map((tag) => {
                const isSelected = formSelectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFormSelectedTags((prev) =>
                        isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-600"><Clock className="w-4 h-4 text-[#FF5A36]" /> Check-in Time</span>
              <input
                type="text"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="bg-transparent font-black text-slate-900 text-right w-24 border-b border-slate-300"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (patient && onLogMood) {
                onLogMood(patient.id, formMood, formIntensity);
              }
              showNotification("Mood logged successfully!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Mood
          </button>
        </div>
      )}

      {/* SCREEN 3: MOOD HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Mood History</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-black">
              {(["Day", "Week", "Month", "Year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setHistoryPeriod(r)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    historyPeriod === r ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <ChevronLeft className="w-5 h-5 text-slate-400 cursor-pointer" />
            <span className="text-sm font-black text-slate-900">May 2025</span>
            <ChevronRight className="w-5 h-5 text-slate-400 cursor-pointer" />
          </div>

          {/* Month Calendar Grid with Mood badges */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {[28, 29, 30].map((d) => (
              <div key={`mp-${d}`} className="p-2 text-slate-300 font-bold">{d}</div>
            ))}

            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === 14;
              let emoji = "🙂";
              if (day % 4 === 0) emoji = "😄";
              else if (day % 7 === 0) emoji = "😐";

              return (
                <button
                  key={day}
                  onClick={() => setSelectedHistoryDate(`2025-05-${day}`)}
                  className={`p-1.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF5A36] text-white font-black shadow-xs scale-105"
                      : "hover:bg-orange-50 font-bold text-slate-700"
                  }`}
                >
                  <span>{day}</span>
                  <span className="text-xs">{emoji}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Card */}
          <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🙂</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Good • 10:30 AM</h4>
                  <p className="text-[11px] text-slate-600">Had a productive morning and a great lunch with friends.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 4: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Analytics</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-black">
              {(["7 Days", "30 Days", "90 Days", "Year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAnalyticsPeriod(r)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    analyticsPeriod === r ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Donut / Distribution Breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <span className="text-xs font-black text-slate-800">Mood Overview (Last 7 Days)</span>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200">
                <div className="text-3xl font-black text-emerald-600">72%</div>
                <div className="text-[11px] font-bold text-slate-500">Positive Days</div>
              </div>

              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Excellent</span> <span>2 (28%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Good</span> <span>3 (43%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Okay</span> <span>1 (14%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Bad</span> <span>1 (14%)</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Very Bad</span> <span>0 (0%)</span></div>
              </div>
            </div>
          </div>

          {/* Best Day & Average Mood */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Best Day</span>
              <p className="text-sm font-black text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                <span>😄 Excellent</span>
              </p>
            </div>
            <div className="p-3.5 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Average Mood</span>
              <p className="text-sm font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <span>🙂 Good</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: INSIGHTS */}
      {activeTab === "insights" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Mood Insights</h2>

          <div className="space-y-3">
            <div className="p-4 bg-[#FFF9F5] border border-orange-200/70 rounded-2xl flex items-start gap-3">
              <span className="text-3xl">🙂</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">Most Common Mood</h4>
                <p className="text-xs text-slate-600"><span className="font-bold text-[#FF5A36]">Good</span> — accounted for 43% of your check-ins this week.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
              <span className="text-3xl">🌅</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">Best Time of Day</h4>
                <p className="text-xs text-slate-600"><span className="font-bold">Morning</span> — you are happiest in the morning between 8 AM – 11 AM.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
              <span className="text-3xl">📅</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">Consistency: 72%</h4>
                <p className="text-xs text-slate-600">You're consistent with mood check-ins!</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50/70 border border-orange-300 rounded-2xl flex items-start gap-3">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">Tip for You</h4>
                <p className="text-xs text-slate-700">You feel better when you spend time with friends and take active walk breaks.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6: TRIGGERS */}
      {activeTab === "triggers" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Triggers</h2>
              <p className="text-xs text-slate-500">Identify what affects your mood.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-black">
              <button
                onClick={() => setTriggersSubTab("personal")}
                className={`px-3 py-1 rounded-xl transition-all ${
                  triggersSubTab === "personal" ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600"
                }`}
              >
                Personal Triggers
              </button>
              <button
                onClick={() => setTriggersSubTab("statistics")}
                className={`px-3 py-1 rounded-xl transition-all ${
                  triggersSubTab === "statistics" ? "bg-[#FF5A36] text-white shadow-xs" : "text-slate-600"
                }`}
              >
                Statistics
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {triggersList.map((tr) => (
              <div
                key={tr.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tr.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{tr.title}</h4>
                    <p className="text-[10px] text-slate-500">{tr.desc}</p>
                  </div>
                </div>

                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    tr.type === "positive"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {tr.score > 0 ? `+${tr.score}` : tr.score}
                </span>
              </div>
            ))}
          </div>

          {/* Add Custom Trigger */}
          <div className="p-3 bg-orange-50/50 border border-dashed border-orange-300 rounded-2xl flex items-center gap-2">
            <input
              type="text"
              placeholder="Add custom trigger (e.g. Meditation, Loud Noises)"
              value={newTriggerName}
              onChange={(e) => setNewTriggerName(e.target.value)}
              className="flex-1 bg-transparent text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={() => {
                if (newTriggerName.trim()) {
                  setTriggersList((prev) => [
                    ...prev,
                    {
                      id: `t-${Date.now()}`,
                      title: newTriggerName.trim(),
                      desc: "Custom personal trigger",
                      score: 4,
                      icon: "✨",
                      type: "positive",
                    },
                  ]);
                  setNewTriggerName("");
                  showNotification("Trigger added!");
                }
              }}
              className="px-3 py-1.5 bg-[#FF5A36] text-white text-xs font-bold rounded-xl"
            >
              + Add Custom Trigger
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 7: MOOD CALENDAR */}
      {activeTab === "calendar" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Mood Calendar</h2>
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 text-[#FF5A36]" /> May 2025
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-black text-slate-400 py-1">{d}</div>
            ))}

            {[28, 29, 30].map((d) => (
              <div key={`mc-${d}`} className="p-2 text-slate-300 font-bold">{d}</div>
            ))}

            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === 14;
              let emoji = "🙂";
              if (day % 3 === 0) emoji = "😄";
              else if (day % 5 === 0) emoji = "😐";
              else if (day % 7 === 0) emoji = "🙁";

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedHistoryDate(`2025-05-${day}`);
                    showNotification(`Selected May ${day}`);
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF5A36] text-white border-[#FF5A36] font-black shadow-xs"
                      : "bg-slate-50 hover:bg-orange-50 border-slate-200/80 text-slate-700"
                  }`}
                >
                  <span className="font-black text-xs block">{day}</span>
                  <span className="text-xs">{emoji}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-[#FFF9F5] border border-orange-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🙂</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">14 May 2025 • Good</h4>
                <p className="text-[11px] text-slate-600">10:30 AM • Work & Friends</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("log_mood")}
              className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold rounded-xl"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 8: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Achievements</h2>

          <div className="space-y-3">
            {[
              { title: "Mood Starter", desc: "Logged mood for 3 days", progress: "3/3", completed: true, badge: "🌱" },
              { title: "Week Warrior", desc: "Logged mood for 7 days", progress: "7/7", completed: true, badge: "🏆" },
              { title: "Positive Streak", desc: "7 positive mood days in a row", progress: "5/7", completed: false, badge: "⚡" },
              { title: "Monthly Check-in", desc: "Logged mood for 20 days", progress: "12/20", completed: false, badge: "📅" },
              { title: "Mindful Master", desc: "Logged mood for 30 days", locked: true, badge: "🔒" },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.badge}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{m.title}</h4>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </div>
                </div>

                <div>
                  {m.completed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {m.progress && !m.completed && (
                    <span className="text-xs font-black text-[#FF5A36] bg-orange-100 px-2.5 py-1 rounded-xl">
                      {m.progress}
                    </span>
                  )}
                  {m.locked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 9: REMINDERS */}
      {activeTab === "reminders" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Mood Reminders</h2>
              <p className="text-xs text-slate-500">Gentle check-in nudges throughout your day.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#FF5A36]" /> {rem.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">{rem.time} • {rem.freq}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => {
                      setReminders((prev) =>
                        prev.map((r) => (r.id === rem.id ? { ...r, enabled: !r.enabled } : r))
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              showNotification("Mood reminder settings saved!");
              setActiveTab("dashboard");
            }}
            className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black rounded-2xl shadow-sm text-sm cursor-pointer"
          >
            Save Reminder Settings
          </button>
        </div>
      )}

      {/* SCREEN 10: MOOD SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900">Mood Settings</h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Default Mood</span>
              <span className="font-black text-slate-900 flex items-center gap-1">🙂 {defaultMood}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Reminder Times</span>
              <span className="font-black text-slate-900">{reminderTimesSetting}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Mood Tags</span>
              <span className="font-black text-slate-900">7 Configured</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Color Theme</span>
              <span className="font-black text-slate-900">Auto (Pastel Peach)</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Hide from Home</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideFromHome}
                  onChange={(e) => setHideFromHome(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
              </label>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Data Visibility</span>
              <span className="font-black text-slate-900">Only Me (Encrypted)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => showNotification("Mood data exported to JSON/CSV")}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200 transition-colors"
            >
              Export Mood Data
            </button>
            <button
              onClick={() => showNotification("Mood data reset to default")}
              className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs hover:bg-rose-100 transition-colors"
            >
              Reset Mood Data
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 11: MOOD TRENDS (30 DAYS) */}
      {activeTab === "trends_30" && (
        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900">Mood Trends (30 Days)</h2>

          {/* 30 Days Overview Chart */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <span className="text-xs font-black text-slate-800">30 Days Overview</span>

            <div className="h-36 flex items-end justify-between gap-1 pt-2 px-1 border-b border-slate-200 pb-2">
              {Array.from({ length: 15 }, (_, i) => {
                const heightPct = 40 + ((i * 17) % 55);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full max-w-[12px] bg-[#FF5A36] rounded-t-sm"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Apr 15</span>
              <span>Apr 30</span>
              <span>May 15</span>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-black text-slate-800">Mood Distribution</span>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Excellent</span>
                  <span>8 (27%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "27%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Good</span>
                  <span>14 (47%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "47%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Okay</span>
                  <span>5 (17%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "17%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Bad</span>
                  <span>2 (7%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "7%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Very Bad</span>
                  <span>1 (3%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "3%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
