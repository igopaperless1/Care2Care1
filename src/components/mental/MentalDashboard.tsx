import React, { useState } from "react";
import {
  Smile,
  Sun,
  Sparkles,
  ChevronRight,
  Play,
  Activity,
  Heart,
  Droplets,
  Zap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Volume2,
  Wind,
  Moon,
  FileText,
  PhoneCall,
  Flame,
  Check
} from "lucide-react";
import { MoodEntry, MentalScreen } from "./types";
import { soundEngine } from "./soundEngine";

interface MentalDashboardProps {
  userName?: string;
  latestMood?: MoodEntry;
  wellbeingScore?: number;
  onNavigate: (screen: MentalScreen) => void;
  onStartSession: () => void;
}

export const MentalDashboard: React.FC<MentalDashboardProps> = ({
  userName = "Roshan",
  latestMood,
  wellbeingScore = 78,
  onNavigate,
  onStartSession,
}) => {
  // SVG circular progress calculation for Wellbeing ring matching Water Tracker
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - wellbeingScore / 100);

  // Routine Checklist State
  const [routineTasks, setRoutineTasks] = useState([
    { id: "t1", title: "5 min Morning Mindfulness", category: "Meditation", duration: "5m", completed: true, screen: "meditation" as MentalScreen },
    { id: "t2", title: "Daily Gratitude Check-in", category: "Journal", duration: "3m", completed: true, screen: "journal" as MentalScreen },
    { id: "t3", title: "4-7-8 Breathing Reset", category: "Breathing", duration: "4m", completed: false, screen: "meditation" as MentalScreen },
    { id: "t4", title: "Evening Sleep Reflection", category: "Sleep", duration: "5m", completed: false, screen: "sleep" as MentalScreen },
  ]);

  const toggleTask = (id: string) => {
    soundEngine.playChime(650, 0.2);
    setRoutineTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. TOP WELLBEING & MOOD CARD (Matching Water Gauge Card) */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Mind State</span>
            <p className="text-sm font-black text-slate-800">
              {latestMood ? `${latestMood.date} • ${latestMood.time}` : "14 May 2025 • 9:30 AM"}
            </p>
          </div>
          <button
            onClick={() => onNavigate("mood")}
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200 cursor-pointer transition-all"
          >
            <Smile className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Update Mood</span>
          </button>
        </div>

        {/* Circular Score Gauge & Mood Status */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Circular Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" stroke="#FEE2D5" strokeWidth="12" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="#FF5A36"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl">{latestMood?.emoji || "😊"}</span>
              <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5">{wellbeingScore}%</span>
              <span className="text-[10px] font-bold text-slate-400">Wellbeing Index</span>
              <span className="text-xs font-black text-[#FF5A36]">
                {latestMood?.moodLabel || "Good"}
              </span>
            </div>
          </div>

          {/* 3 Status Indicators Breakdown in Peach theme */}
          <div className="space-y-2.5 w-full sm:w-56">
            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Anxiety Level</div>
                <div className="text-sm font-black text-slate-900">Low (Mild)</div>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
            </div>

            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Stress Score</div>
                <div className="text-sm font-black text-slate-900">Moderate (18/40)</div>
              </div>
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
            </div>

            <div className="p-3 bg-[#FFF9F5] border border-orange-200/60 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Mental Energy</div>
                <div className="text-sm font-black text-[#FF5A36]">Optimal (8.5/10)</div>
              </div>
              <span className="w-3 h-3 rounded-full bg-[#FF5A36] shadow-xs" />
            </div>
          </div>
        </div>

        {/* Quick Mood Log Prompt Pill Bar */}
        <div className="space-y-2 pt-1 border-t border-orange-100">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Quick Feeling</span>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "😢 Down", emoji: "😢", index: 0 },
              { label: "🙁 Low", emoji: "🙁", index: 1 },
              { label: "😐 Okay", emoji: "😐", index: 2 },
              { label: "😊 Good", emoji: "😊", index: 3 },
              { label: "😁 Great", emoji: "😁", index: 4 },
            ].map((btn) => (
              <button
                key={btn.index}
                onClick={() => onNavigate("mood")}
                className="py-2.5 px-1 bg-white hover:bg-orange-50 active:bg-orange-100 border border-slate-200/80 hover:border-orange-300 rounded-2xl text-center transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-base block">{btn.emoji}</span>
                <span className="text-[10px] font-bold text-slate-700 truncate block mt-0.5">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PRIMARY ACTION BANNER (RELOCATED ABOVE SO IMMEDIATELY VISIBLE) */}
      <div className="bg-gradient-to-r from-[#FF5A36] to-[#FF8B6B] rounded-3xl p-5 text-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3 h-3" />
            <span>Recommended For You</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            5-Minute Morning Mindfulness
          </h3>
          <p className="text-xs text-orange-100 font-medium">
            Center your mind, reduce cortisol, and prepare for a productive day.
          </p>
        </div>

        <button
          onClick={onStartSession}
          className="px-5 py-3 bg-white hover:bg-orange-50 text-[#FF5A36] font-black text-xs rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-current text-[#FF5A36]" />
          <span>Start Session</span>
        </button>
      </div>

      {/* 3. QUICK ACCESS SERVICES GRID (PROMINENT AND FULLY VISIBLE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: "Therapy", subtitle: "Book or Chat", icon: Heart, screen: "therapy" as MentalScreen, color: "text-[#FF5A36]", bg: "bg-orange-50" },
          { title: "Meditation", subtitle: "Audio & Sounds", icon: Wind, screen: "meditation" as MentalScreen, color: "text-[#FF5A36]", bg: "bg-orange-50" },
          { title: "Sleep Tracker", subtitle: "Stages & Score", icon: Moon, screen: "sleep" as MentalScreen, color: "text-[#FF5A36]", bg: "bg-orange-50" },
          { title: "Journal & CBT", subtitle: "Thought Records", icon: BookOpen, screen: "journal" as MentalScreen, color: "text-[#FF5A36]", bg: "bg-orange-50" },
        ].map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(srv.screen)}
              className="bg-white hover:bg-orange-50/60 border border-orange-200/60 hover:border-orange-300 p-4 rounded-3xl text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-2xl ${srv.bg} ${srv.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                {srv.title}
              </h4>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                {srv.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* 4. TODAY'S PLAN & ROUTINES */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF5A36]" />
            <h3 className="text-base font-black text-slate-900">Today's Mindfulness Plan</h3>
          </div>
          <button
            onClick={() => onNavigate("goals")}
            className="text-xs font-bold text-[#FF5A36] hover:underline cursor-pointer"
          >
            Manage Goals →
          </button>
        </div>

        <div className="space-y-2.5">
          {routineTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                task.completed
                  ? "bg-[#FFF9F5] border-orange-200/60"
                  : "bg-white border-slate-200/80 hover:border-orange-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    task.completed
                      ? "bg-[#FF5A36] text-white shadow-2xs"
                      : "border-2 border-slate-300 hover:border-[#FF5A36] bg-white"
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <h4
                    className={`text-xs font-black ${
                      task.completed ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5">
                    <span className="text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                      {task.category}
                    </span>
                    <span>• {task.duration}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate(task.screen)}
                className="px-3 py-1.5 bg-white hover:bg-orange-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Open</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#FF5A36]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SECONDARY EXPLORE HUB (Clinical Tests, Crisis Help, Masterclasses) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate("assessments")}
          className="p-4 bg-[#FFF9F5] border border-orange-200/80 hover:border-orange-300 rounded-3xl text-center flex flex-col items-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-[#FF5A36] group-hover:scale-105 transition-transform shadow-2xs">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900">Clinical Tests</span>
          <span className="text-[10px] font-bold text-slate-400">PHQ-9 & GAD-7</span>
        </button>

        <button
          onClick={() => onNavigate("insights")}
          className="p-4 bg-[#FFF9F5] border border-orange-200/80 hover:border-orange-300 rounded-3xl text-center flex flex-col items-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-[#FF5A36] group-hover:scale-105 transition-transform shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900">Mood Trends</span>
          <span className="text-[10px] font-bold text-slate-400">Weekly Analytics</span>
        </button>

        <button
          onClick={() => onNavigate("crisis")}
          className="p-4 bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-3xl text-center flex flex-col items-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform shadow-2xs">
            <PhoneCall className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <span className="text-xs font-black text-rose-900">Crisis Helpline</span>
          <span className="text-[10px] font-bold text-rose-500">24/7 Support</span>
        </button>
      </div>
    </div>
  );
};
