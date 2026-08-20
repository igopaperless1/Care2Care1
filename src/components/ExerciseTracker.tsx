import React, { useState } from "react";
import { Patient } from "../types";
import {
  Dumbbell,
  Layers,
  Sparkles,
  Play,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  Trophy,
  Sliders,
  CheckCircle2,
  Clock,
  Flame,
  Plus
} from "lucide-react";
import { ExerciseTab, ExerciseItem, WorkoutPlan, WorkoutProgram } from "./exercise/types";
import { INITIAL_EXERCISES, INITIAL_PLANS, FEATURED_PROGRAMS } from "./exercise/data";
import { ExerciseDashboard } from "./exercise/ExerciseDashboard";
import { ExerciseBodyParts } from "./exercise/ExerciseBodyParts";
import { ExerciseList } from "./exercise/ExerciseList";
import { ExerciseDetailsModal } from "./exercise/ExerciseDetailsModal";
import { WorkoutBuilder } from "./exercise/WorkoutBuilder";
import { ExerciseSetupModal } from "./exercise/ExerciseSetupModal";
import { ActiveWorkoutSession } from "./exercise/ActiveWorkoutSession";
import { ExercisePrograms } from "./exercise/ExercisePrograms";
import { ExercisePlans } from "./exercise/ExercisePlans";
import { ExerciseProgress } from "./exercise/ExerciseProgress";
import { ExerciseMeasurements } from "./exercise/ExerciseMeasurements";
import { ExerciseInsights } from "./exercise/ExerciseInsights";

interface ExerciseTrackerProps {
  patient?: Patient;
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<ExerciseTab>("dashboard");
  const [exercises, setExercises] = useState<ExerciseItem[]>(INITIAL_EXERCISES);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem>(INITIAL_EXERCISES[1]);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan>(INITIAL_PLANS[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const navMenuItems: Array<{ id: ExerciseTab; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: Dumbbell },
    { id: "body_parts", label: "Body Parts", icon: Layers },
    { id: "exercises", label: "Exercises", icon: Sparkles },
    { id: "details", label: "Details", icon: Sliders },
    { id: "builder", label: "Builder", icon: Plus },
    { id: "setup", label: "Setup", icon: Sliders },
    { id: "in_progress", label: "In Progress", icon: Play },
    { id: "programs", label: "Programs", icon: Trophy },
    { id: "plans", label: "Plans", icon: Calendar },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "measurements", label: "Measurements", icon: TrendingUp },
    { id: "insights", label: "Insights", icon: Award },
  ];

  const handleToggleFavorite = (id: string) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e))
    );
  };

  const handleSelectBodyPart = (part: string) => {
    setSelectedBodyPart(part);
    setActiveTab("exercises");
  };

  const handleOpenExerciseDetails = (ex: ExerciseItem) => {
    setSelectedExercise(ex);
    setActiveTab("details");
  };

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
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                Exercise Service
              </span>
              <span className="text-[11px] font-bold text-slate-500">14 May 2025</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Fitness & Movement Conditioning
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("in_progress")}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Active Workout</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLING PILL BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                  : "bg-[#FFF9F5] hover:bg-[#FFF2EB] text-slate-700 border-orange-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN SCREEN RENDER */}
      {activeTab === "dashboard" && (
        <ExerciseDashboard
          onNavigate={(tab) => setActiveTab(tab)}
          onStartWorkout={() => setActiveTab("in_progress")}
          currentPlan={currentPlan}
        />
      )}

      {activeTab === "body_parts" && (
        <ExerciseBodyParts onSelectBodyPart={handleSelectBodyPart} />
      )}

      {activeTab === "exercises" && (
        <ExerciseList
          exercises={exercises}
          selectedBodyPart={selectedBodyPart}
          onSelectExercise={handleOpenExerciseDetails}
          onToggleFavorite={handleToggleFavorite}
          onClearBodyPartFilter={() => setSelectedBodyPart(null)}
        />
      )}

      {activeTab === "details" && (
        <ExerciseDetailsModal
          exercise={selectedExercise}
          onBack={() => setActiveTab("exercises")}
          onAddToWorkout={(ex) => {
            showNotification(`Added "${ex.name}" to Builder!`);
            setActiveTab("builder");
          }}
          onStartExercise={(ex) => {
            setSelectedExercise(ex);
            setActiveTab("setup");
          }}
        />
      )}

      {activeTab === "builder" && (
        <WorkoutBuilder
          initialExercises={currentPlan.exercises}
          onBack={() => setActiveTab("dashboard")}
          onSaveWorkout={(name, exList) => {
            showNotification(`Saved "${name}" with ${exList.length} exercises!`);
            setActiveTab("plans");
          }}
          onStartWorkout={(name, exList) => {
            showNotification(`Launching "${name}"!`);
            setActiveTab("in_progress");
          }}
          onOpenExerciseLibrary={() => setActiveTab("exercises")}
        />
      )}

      {activeTab === "setup" && (
        <ExerciseSetupModal
          exercise={selectedExercise}
          currentSetNumber={1}
          totalSets={4}
          onBack={() => setActiveTab("details")}
          onCompleteSet={(reps, weight, notes) => {
            showNotification(`Set completed: ${reps} reps @ ${weight}kg!`);
            setActiveTab("in_progress");
          }}
        />
      )}

      {activeTab === "in_progress" && (
        <ActiveWorkoutSession
          workoutName={currentPlan.name}
          exercises={currentPlan.exercises}
          onFinishWorkout={(sum) => {
            showNotification(`Workout finished! Burned ${sum.calories} kcal in ${sum.totalTimeMins} mins!`);
            setActiveTab("progress");
          }}
          onExitWorkout={() => setActiveTab("dashboard")}
        />
      )}

      {activeTab === "programs" && (
        <ExercisePrograms
          onSelectProgram={(prog) => {
            showNotification(`Enrolled in ${prog.title}!`);
            setActiveTab("plans");
          }}
        />
      )}

      {activeTab === "plans" && (
        <ExercisePlans
          plans={INITIAL_PLANS}
          onSelectPlan={(p) => {
            setCurrentPlan(p);
            showNotification(`Selected plan: ${p.name}`);
            setActiveTab("builder");
          }}
          onCreateNewPlan={() => setActiveTab("builder")}
        />
      )}

      {activeTab === "progress" && <ExerciseProgress />}

      {activeTab === "measurements" && <ExerciseMeasurements />}

      {activeTab === "insights" && <ExerciseInsights />}
    </div>
  );
};
