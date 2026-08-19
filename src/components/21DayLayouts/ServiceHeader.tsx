import React from "react";
import {
  LifelongServiceProfile,
  ServiceArchetype,
  CareLifecycleStage
} from "../../types";
import { ARCHETYPE_META, STAGE_META } from "../../lib/lifelongEngine";
import {
  Sparkles,
  Settings,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Heart,
  Clock,
  RotateCcw
} from "lucide-react";

interface ServiceHeaderProps {
  profile: LifelongServiceProfile;
  icon?: string;
  onOpenSettings?: () => void;
  onOpenReview?: () => void;
  onOpenRecovery?: () => void;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({
  profile,
  icon = "🌟",
  onOpenSettings,
  onOpenReview,
  onOpenRecovery
}) => {
  const archetypeMeta = ARCHETYPE_META[profile.archetype] || ARCHETYPE_META.nourish;
  const stageMeta = STAGE_META[profile.stage] || STAGE_META.ignite;

  // Calculate stage progress percentage
  let stageProgress = 0;
  if (profile.stage === "ignite") {
    stageProgress = Math.min(100, Math.round((profile.dayInCurrentStage / 21) * 100));
  } else if (profile.stage === "stabilize") {
    stageProgress = Math.min(100, Math.round(((profile.dayInCurrentStage - 21) / 39) * 100));
  } else if (profile.stage === "integrate") {
    stageProgress = 100;
  } else if (profile.stage === "recovery") {
    stageProgress = Math.min(100, Math.round((profile.dayInCurrentStage / 7) * 100));
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        {/* Left: Icon + Title + Archetype */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${archetypeMeta.color} text-white flex items-center justify-center text-2xl shadow-sm`}>
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile.serviceName}
              </h1>
              {/* Archetype Pill */}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${archetypeMeta.badgeBg} ${archetypeMeta.badgeText} flex items-center gap-1`}>
                <span>{archetypeMeta.icon}</span>
                <span>{archetypeMeta.title}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {profile.primaryGoalText}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Gentle Recovery Trigger if needed */}
          {onOpenRecovery && (
            <button
              type="button"
              onClick={onOpenRecovery}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
              title="Need a gentle reset? Launch recovery plan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Periodic Review Milestone Button */}
          {onOpenReview && (
            <button
              type="button"
              onClick={onOpenReview}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
              title="Periodic Life Review & Milestones"
            >
              <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Life Review</span>
            </button>
          )}

          {/* Setup / Settings Button */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer transition-all shadow-2xs"
              title="Configure Goals & Reminders"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lifecycle Stage Bar & Consistency Metric */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${stageMeta.badgeBg} ${stageMeta.badgeText}`}>
              {stageMeta.label}
            </span>
            <span className="text-slate-500 font-semibold text-[11px]">
              {profile.stage === "ignite" && `Day ${profile.dayInCurrentStage} of 21`}
              {profile.stage === "stabilize" && `Day ${profile.dayInCurrentStage} of 60 (Stabilization)`}
              {profile.stage === "integrate" && `Day ${profile.totalActiveDays} (Lifelong Practice)`}
              {profile.stage === "recovery" && `Day ${profile.dayInCurrentStage} of 7 (Gentle Rebuild)`}
            </span>
          </div>

          <div className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{profile.currentStreak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{profile.consistencyScorePercent}% Consistency</span>
            </div>
          </div>
        </div>

        {/* Visual Stage Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
              profile.stage === "ignite"
                ? "from-orange-500 to-amber-500"
                : profile.stage === "stabilize"
                ? "from-blue-500 to-indigo-500"
                : profile.stage === "recovery"
                ? "from-teal-500 to-emerald-500"
                : "from-emerald-500 to-teal-500"
            }`}
            style={{ width: `${Math.max(4, stageProgress)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
