import React, { useState } from "react";
import {
  Brain,
  Smile,
  Heart,
  Wind,
  Moon,
  BookOpen,
  FileText,
  Target,
  TrendingUp,
  Users,
  PhoneCall,
  Settings,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Plus
} from "lucide-react";
import { MentalScreen, MoodEntry } from "./types";
import { MentalDashboard } from "./MentalDashboard";
import { MentalTherapy } from "./MentalTherapy";
import { MentalMoodTracker } from "./MentalMoodTracker";
import { MentalMeditation } from "./MentalMeditation";
import { MentalSleep } from "./MentalSleep";
import { MentalJournaling } from "./MentalJournaling";
import { MentalAssessments } from "./MentalAssessments";
import { MentalGoals } from "./MentalGoals";
import { MentalInsights } from "./MentalInsights";
import { MentalCommunity } from "./MentalCommunity";
import { MentalCrisisSupport } from "./MentalCrisisSupport";
import { MentalSettings } from "./MentalSettings";
import { MentalCourses } from "./MentalCourses";
import { MentalReminders } from "./MentalReminders";
import { soundEngine } from "./soundEngine";

interface MentalHealthAppProps {
  patientName?: string;
}

export const MentalHealthApp: React.FC<MentalHealthAppProps> = ({
  patientName = "Roshan",
}) => {
  const [currentScreen, setCurrentScreen] = useState<MentalScreen>("dashboard");
  const [latestMood, setLatestMood] = useState<MoodEntry>({
    id: "m-init",
    date: "14 May 2025",
    time: "9:30 AM",
    moodIndex: 3,
    moodLabel: "Good",
    emoji: "😊",
    intensity: 8,
    tags: ["Nature Walk", "Good Sleep", "Healthy Food"],
    note: "Feeling grounded and clear-headed this morning.",
  });

  const navigationItems = [
    { id: "dashboard" as MentalScreen, label: "Dashboard", icon: Brain },
    { id: "mood" as MentalScreen, label: "Mood Log", icon: Smile },
    { id: "therapy" as MentalScreen, label: "Therapy", icon: Heart },
    { id: "meditation" as MentalScreen, label: "Meditation", icon: Wind },
    { id: "sleep" as MentalScreen, label: "Sleep Tracker", icon: Moon },
    { id: "journal" as MentalScreen, label: "Journal & CBT", icon: BookOpen },
    { id: "assessments" as MentalScreen, label: "Assessments", icon: FileText },
    { id: "goals" as MentalScreen, label: "Goals & Habits", icon: Target },
    { id: "insights" as MentalScreen, label: "Insights", icon: TrendingUp },
    { id: "community" as MentalScreen, label: "Community", icon: Users },
    { id: "courses" as MentalScreen, label: "Masterclasses", icon: Sparkles },
    { id: "reminders" as MentalScreen, label: "Reminders", icon: Bell },
    { id: "crisis" as MentalScreen, label: "Crisis Help", icon: PhoneCall, alert: true },
    { id: "settings" as MentalScreen, label: "Settings", icon: Settings },
  ];

  const handleNavigate = (screen: MentalScreen) => {
    soundEngine.playChime(580, 0.2);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveMood = (newMood: MoodEntry) => {
    setLatestMood(newMood);
    setCurrentScreen("dashboard");
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-28 text-slate-800 animate-in fade-in duration-200">
      {/* TOP HEADER (Matching Water Tracker Design & Palette) */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] flex items-center justify-center text-white shadow-xs">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Mental Wellness
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mindfulness & Mental Health
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentScreen !== "dashboard" && (
            <button
              onClick={() => handleNavigate("dashboard")}
              className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF5A36]" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button
            onClick={() => handleNavigate("mood")}
            className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Smile className="w-4 h-4" />
            <span>+ Log Mood</span>
          </button>

          <button
            onClick={() => handleNavigate("crisis")}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="hidden sm:inline">24/7 Help</span>
            <span className="sm:hidden">Help</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING MENU (Water Service Style, no 3-lines menu) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs font-black scale-102"
                  : item.alert
                  ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                  : "bg-white text-slate-700 hover:bg-orange-50 border-slate-200/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : item.alert ? "text-rose-500" : "text-[#FF5A36]"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN VIEW CONTENT */}
      <div className="space-y-4">
        {currentScreen === "dashboard" && (
          <MentalDashboard
            userName={patientName}
            latestMood={latestMood}
            wellbeingScore={78}
            onNavigate={handleNavigate}
            onStartSession={() => handleNavigate("meditation")}
          />
        )}

        {currentScreen === "mood" && (
          <MentalMoodTracker onSaveMood={handleSaveMood} />
        )}

        {currentScreen === "therapy" && (
          <MentalTherapy />
        )}

        {currentScreen === "meditation" && (
          <MentalMeditation />
        )}

        {currentScreen === "sleep" && (
          <MentalSleep />
        )}

        {currentScreen === "journal" && (
          <MentalJournaling />
        )}

        {currentScreen === "assessments" && (
          <MentalAssessments />
        )}

        {currentScreen === "goals" && (
          <MentalGoals />
        )}

        {currentScreen === "insights" && (
          <MentalInsights />
        )}

        {currentScreen === "community" && (
          <MentalCommunity />
        )}

        {currentScreen === "crisis" && (
          <MentalCrisisSupport />
        )}

        {currentScreen === "settings" && (
          <MentalSettings />
        )}

        {currentScreen === "courses" && (
          <MentalCourses />
        )}

        {currentScreen === "reminders" && (
          <MentalReminders />
        )}
      </div>
    </div>
  );
};
