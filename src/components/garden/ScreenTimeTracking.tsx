import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Calendar,
  Droplets,
  FlaskConical,
  Scissors,
  Sprout,
  Heart,
  CheckCircle2
} from "lucide-react";
import { TimeActivityLog, FarmGardenItem } from "./types";

interface ScreenTimeTrackingProps {
  activeFarm: FarmGardenItem;
  timeLogs: TimeActivityLog[];
  onAddTimeLog: (log: TimeActivityLog) => void;
  onOpenAddModal: (type: string) => void;
}

export const ScreenTimeTracking: React.FC<ScreenTimeTrackingProps> = ({
  activeFarm,
  timeLogs,
  onAddTimeLog,
  onOpenAddModal
}) => {
  // Live Interactive Stopwatch
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentTaskName, setCurrentTaskName] = useState("Field Work & Care");
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatStopwatch = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopAndSave = () => {
    if (seconds < 5) {
      setIsRunning(false);
      setSeconds(0);
      return;
    }
    const mins = Math.max(1, Math.round(seconds / 60));
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    const formatted = `${hrs.toString().padStart(2, "0")}h ${remMins.toString().padStart(2, "0")}m`;

    const now = new Date();
    const newLog: TimeActivityLog = {
      id: "time-" + Date.now(),
      farmId: activeFarm.id,
      activityName: currentTaskName,
      category: "weeding",
      date: "Today, " + now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      startTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: "Just now",
      durationMinutes: mins,
      durationFormatted: formatted,
      workerName: "Roshan Gurung"
    };

    onAddTimeLog(newLog);
    setIsRunning(false);
    setSeconds(0);
  };

  const farmTimeLogs = timeLogs.filter((t) => t.farmId === activeFarm.id);
  const totalMinutes = farmTimeLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0) || 265;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const totalFormatted = `${totalHours.toString().padStart(2, "0")}h ${remainingMins.toString().padStart(2, "0")}m`;

  const getActivityIcon = (cat: string) => {
    switch (cat) {
      case "irrigation":
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case "fertilizer":
        return <FlaskConical className="w-4 h-4 text-emerald-600" />;
      case "weeding":
        return <Scissors className="w-4 h-4 text-amber-600" />;
      case "support":
        return <Sprout className="w-4 h-4 text-teal-600" />;
      default:
        return <Clock className="w-4 h-4 text-[#FF5A36]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER DATE BANNER & TOTAL TIME DISPLAY (Matching Screenshot Card 7) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            Today, 15 May 2025
          </span>
          <button
            onClick={() => onOpenAddModal("time")}
            className="text-xs font-black text-[#FF5A36] hover:underline cursor-pointer"
          >
            + Manual Log
          </button>
        </div>

        {/* CLOCK METRIC DISPLAY */}
        <div className="text-center py-2">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {totalFormatted}
          </span>
          <span className="text-xs font-bold text-slate-500 block mt-1">
            Total Time Tracked
          </span>
        </div>

        {/* LIVE STOPWATCH INTERACTIVE WIDGET */}
        <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRunning ? "bg-[#FF5A36] text-white animate-pulse" : "bg-orange-100 text-[#FF5A36]"}`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Active Stopwatch
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {formatStopwatch(seconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Timer</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsRunning(false)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={handleStopAndSave}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Log</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES LIST (Matching Screenshot Card 7) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-3">
        <h3 className="text-base font-black text-slate-900">Recent Activities</h3>

        <div className="space-y-2.5">
          {farmTimeLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs shrink-0">
                  {getActivityIcon(log.category)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{log.activityName}</h4>
                  <p className="text-[11px] font-medium text-slate-500">
                    {log.startTime} - {log.endTime}
                  </p>
                </div>
              </div>

              <span className="text-xs font-black text-slate-800 bg-white px-2.5 py-1 rounded-xl border border-slate-200/80">
                {log.durationFormatted}
              </span>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <button
          onClick={() => {
            setIsRunning(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start New Timer</span>
        </button>
      </div>
    </div>
  );
};
