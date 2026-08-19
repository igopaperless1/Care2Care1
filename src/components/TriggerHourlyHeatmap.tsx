import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import { HourlyUrgeHeatmapPoint, HabitChallenge, UrgeLog } from "../types";
import { getHourlyUrgeHeatmapData } from "../lib/supabaseHabits";
import { Clock, Flame, AlertCircle, Info, Activity, Zap } from "lucide-react";

interface TriggerHourlyHeatmapProps {
  challenges?: HabitChallenge[];
  urgeLogs?: UrgeLog[];
  data?: HourlyUrgeHeatmapPoint[];
  title?: string;
  subtitle?: string;
}

export const TriggerHourlyHeatmap: React.FC<TriggerHourlyHeatmapProps> = ({
  challenges = [],
  urgeLogs,
  data,
  title = "24-Hour Behavioral Urge Heatmap",
  subtitle = "Identify your peak vulnerability hours to deploy pre-emptive micro-pauses"
}) => {
  const [hoveredHour, setHoveredHour] = useState<HourlyUrgeHeatmapPoint | null>(null);

  // Compute heatmap data using d3 data preparation
  const heatmapData: HourlyUrgeHeatmapPoint[] = useMemo(() => {
    if (data && data.length === 24) return data;
    return getHourlyUrgeHeatmapData(challenges);
  }, [data, challenges]);

  // Max urge count for D3 color scaling
  const maxCount = useMemo(() => {
    const maxVal = d3.max(heatmapData, (d) => d.urgeCount) || 1;
    return Math.max(maxVal, 3);
  }, [heatmapData]);

  // D3 Color interpolator
  const colorScale = useMemo(() => {
    return d3
      .scaleSequential()
      .domain([0, maxCount])
      .interpolator(d3.interpolateRgbBasis(["#f1f5f9", "#fed7aa", "#fb923c", "#ea580c", "#be123c"]));
  }, [maxCount]);

  const darkColorScale = useMemo(() => {
    return d3
      .scaleSequential()
      .domain([0, maxCount])
      .interpolator(d3.interpolateRgbBasis(["#1e293b", "#334155", "#c2410c", "#f97316", "#fb7185"]));
  }, [maxCount]);

  // Find peak hour(s)
  const peakHour = useMemo(() => {
    return [...heatmapData].sort((a, b) => b.urgeCount - a.urgeCount)[0] || heatmapData[21];
  }, [heatmapData]);

  const totalWeeklyUrges = useMemo(() => {
    return heatmapData.reduce((acc, h) => acc + h.urgeCount, 0);
  }, [heatmapData]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300">
                D3 Analysis
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Peak Urge Callout */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-xs">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">Peak Risk Window:</span>
          <span className="font-black text-rose-600 dark:text-rose-400 text-[11px]">
            {peakHour.hourLabel} ({peakHour.urgeCount} urges)
          </span>
        </div>
      </div>

      {/* 24-Hour Grid Heatmap */}
      <div className="space-y-2">
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {heatmapData.map((point) => {
            const isHovered = hoveredHour?.hour === point.hour;
            const isPeak = point.hour === peakHour.hour && point.urgeCount > 0;
            const bgLight = colorScale(point.urgeCount);
            const bgDark = darkColorScale(point.urgeCount);

            return (
              <div
                key={point.hour}
                onMouseEnter={() => setHoveredHour(point)}
                onMouseLeave={() => setHoveredHour(null)}
                onClick={() => setHoveredHour(point)}
                className={`relative group cursor-pointer transition-all rounded-xl p-2 flex flex-col items-center justify-between border ${
                  isHovered || isPeak
                    ? "ring-2 ring-orange-500 scale-105 z-10 shadow-md border-orange-400"
                    : "border-slate-200/70 dark:border-slate-700/80 hover:border-orange-300"
                }`}
                style={{
                  backgroundColor: point.urgeCount === 0 ? undefined : undefined
                }}
              >
                <div
                  className="w-full h-7 rounded-lg flex items-center justify-center text-[11px] font-black transition-colors"
                  style={{
                    backgroundColor: point.urgeCount > 0 ? (point.urgeCount >= maxCount * 0.7 ? "#ea580c" : point.urgeCount >= maxCount * 0.4 ? "#f97316" : "#fed7aa") : "transparent",
                    color: point.urgeCount >= maxCount * 0.4 ? "#ffffff" : "#475569"
                  }}
                >
                  {point.urgeCount > 0 ? point.urgeCount : "0"}
                </div>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {point.hourLabel.replace(" ", "")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 px-1">
          <div className="flex items-center gap-1.5">
            <span>Low Frequency</span>
            <div className="flex gap-1">
              <span className="w-3.5 h-3 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-200" />
              <span className="w-3.5 h-3 rounded-xs bg-amber-200" />
              <span className="w-3.5 h-3 rounded-xs bg-orange-400" />
              <span className="w-3.5 h-3 rounded-xs bg-rose-600" />
            </div>
            <span>High Craving Trigger</span>
          </div>

          <div className="font-semibold text-slate-600 dark:text-slate-300">
            Total Urge Events Logged: <strong className="text-orange-600 dark:text-orange-400">{totalWeeklyUrges}</strong>
          </div>
        </div>
      </div>

      {/* Inspection Detail / Tooltip Box */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-500" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              Selected Hour: {hoveredHour ? hoveredHour.hourLabel : `${peakHour.hourLabel} (Peak)`}
            </span>
            <span className="text-slate-500 text-[11px] ml-2">
              • Urges: <strong>{hoveredHour ? hoveredHour.urgeCount : peakHour.urgeCount}</strong>
            </span>
            <span className="text-slate-500 text-[11px] ml-2">
              • Avg Craving Intensity:{" "}
              <strong className="text-rose-600 dark:text-rose-400">
                {hoveredHour ? hoveredHour.intensityAvg : peakHour.intensityAvg}/10
              </strong>
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          Top Trigger:{" "}
          <span className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md font-bold text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-slate-700">
            {hoveredHour?.dominantTrigger || peakHour.dominantTrigger || "Fatigue & Routine"}
          </span>
        </div>
      </div>
    </div>
  );
};
