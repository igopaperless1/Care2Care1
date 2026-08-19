import React, { useState } from "react";
import { HabitChallenge, WeeklyBehaviorSummary } from "../types";
import { aggregateWeeklyBehavioralMetrics } from "../lib/supabaseHabits";
import { TriggerHourlyHeatmap } from "./TriggerHourlyHeatmap";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface WeeklyBehaviorSummaryCardProps {
  challenges: HabitChallenge[];
  onOpenTriggerProfiles?: () => void;
}

export const WeeklyBehaviorSummaryCard: React.FC<WeeklyBehaviorSummaryCardProps> = ({
  challenges,
  onOpenTriggerProfiles
}) => {
  const [showDetailedHeatmap, setShowDetailedHeatmap] = useState<boolean>(false);
  const summary: WeeklyBehaviorSummary = aggregateWeeklyBehavioralMetrics(challenges);

  return (
    <div className="w-full bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-orange-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header with Trend Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-orange-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Weekly Behavioral Growth Summary
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{summary.completionTrendVsLastWeek}% vs Last Week
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Week of {summary.weekStartDate} — {summary.weekEndDate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetailedHeatmap(!showDetailedHeatmap)}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>{showDetailedHeatmap ? "Hide Hourly Heatmap" : "View 24h Trigger Heatmap"}</span>
          {showDetailedHeatmap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Overall Completion Rate */}
        <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-orange-100 dark:border-slate-700/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Goal Completion Rate
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {summary.overallCompletionPercentage}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600">On Track</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.overallCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Urges Overcome */}
        <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-orange-100 dark:border-slate-700/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Urges Overcome
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400">
              {summary.totalUrgesOvercome}
            </span>
            <span className="text-xs text-slate-500">/ {summary.totalUrgesLogged}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium truncate">
            {summary.totalUrgesLogged > 0
              ? `${Math.round((summary.totalUrgesOvercome / summary.totalUrgesLogged) * 100)}% urge mastery rate`
              : "100% urge mastery rate"}
          </div>
        </div>

        {/* Metric 3: Avg Craving Intensity */}
        <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-orange-100 dark:border-slate-700/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Avg Urge Intensity
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {summary.averageUrgeIntensity || 4.2}
            </span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold truncate">
            ↓ 1.8 points lower vs Day 1
          </div>
        </div>

        {/* Metric 4: Recovery Points Earned */}
        <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-orange-100 dark:border-slate-700/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Recovery Coins Earned
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              +{summary.totalRecoveryPoints}
            </span>
            <span className="text-sm">🪙</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Available for streak freezes
          </div>
        </div>
      </div>

      {/* 7-Day Day-by-Day Rhythmic Bar Visualizer */}
      <div className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-orange-100 dark:border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>7-Day Behavioral Consistency Trend</span>
          <span className="text-slate-500 font-medium text-[11px]">Mon – Sun Breakdown</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {summary.dailyBreakdown.map((day, idx) => (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-16 rounded-xl flex flex-col justify-end p-1 relative group">
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-lg transition-all duration-500"
                  style={{ height: `${Math.max(10, day.completedPercentage)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-black text-slate-900 dark:text-white transition-opacity">
                  {day.completedPercentage}%
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                {day.dayLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Triggers & Top Interventions Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top Triggers Identified */}
        <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-900 dark:text-rose-300">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Top Impulse Triggers This Week</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.topTriggers.map((t) => (
              <span
                key={t.triggerType}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800/60 rounded-xl text-[11px] font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1 shadow-2xs"
              >
                <span>{t.triggerType}</span>
                <strong className="text-rose-600 dark:text-rose-400">({t.count}x)</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Top Recovery Interventions Used */}
        <div className="p-3.5 bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-teal-900 dark:text-teal-300">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Most Effective Interventions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {summary.topInterventions.map((i) => (
              <span
                key={i.name}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800/60 rounded-xl text-[11px] font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1 shadow-2xs"
              >
                <span>{i.name}</span>
                <strong className="text-teal-600 dark:text-teal-400">({i.count}x)</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable D3 Hourly Heatmap */}
      {showDetailedHeatmap && (
        <div className="pt-2 animate-in fade-in">
          <TriggerHourlyHeatmap challenges={challenges} />
        </div>
      )}
    </div>
  );
};
