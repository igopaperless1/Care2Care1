import React, { useState } from "react";
import {
  Trees,
  Sprout,
  CheckCircle2,
  Clock,
  Heart,
  Droplets,
  FlaskConical,
  Plus,
  ArrowRight,
  TrendingUp,
  MoreHorizontal,
  FileText,
  Calendar,
  AlertCircle,
  Play
} from "lucide-react";
import {
  FarmGardenItem,
  FarmTask,
  CropItem,
  IrrigationZone,
  FertilizerRecord,
  HarvestRecord,
  FarmTab
} from "./types";

interface ScreenDashboardProps {
  activeFarm: FarmGardenItem;
  farms: FarmGardenItem[];
  tasks: FarmTask[];
  crops: CropItem[];
  irrigationZones: IrrigationZone[];
  fertilizers: FertilizerRecord[];
  harvests: HarvestRecord[];
  onNavigate: (tab: FarmTab) => void;
  onOpenAddModal: (type: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({
  activeFarm,
  farms,
  tasks,
  crops,
  irrigationZones,
  fertilizers,
  harvests,
  onNavigate,
  onOpenAddModal,
  onToggleTask
}) => {
  const [subTab, setSubTab] = useState<"Overview" | "Tasks" | "Crops" | "Records" | "Analytics">("Overview");

  // Farm-specific metrics
  const farmTasks = tasks.filter((t) => t.farmId === activeFarm.id);
  const farmCrops = crops.filter((c) => c.farmId === activeFarm.id);
  const completedTasks = farmTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = farmTasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = farmTasks.filter((t) => t.status === "pending").length;
  const totalTasks = farmTasks.length || 1;

  const completedPct = Math.round((completedTasks / totalTasks) * 100);
  const inProgressPct = Math.round((inProgressTasks / totalTasks) * 100);
  const pendingPct = Math.max(0, 100 - completedPct - inProgressPct);

  return (
    <div className="space-y-4">
      {/* FARM SELECTION & SUBTABS HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-2xs border border-orange-100 shrink-0">
              <img
                src={activeFarm?.photoUrl}
                alt={activeFarm?.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                {activeFarm?.name}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {activeFarm?.categoryDesc}
              </p>
            </div>
          </div>

          {/* SUB-TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(["Overview", "Tasks", "Crops", "Records", "Analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  subTab === tab
                    ? "bg-orange-100 text-[#FF5A36] border border-orange-200"
                    : "text-slate-600 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4 HIGH-LEVEL METRICS TILES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {/* Total Area */}
          <div className="bg-[#FFF9F5] border border-orange-200/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Area
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{activeFarm?.area}</span>
              <span className="text-xs font-bold text-slate-600">{activeFarm?.areaUnit}</span>
            </div>
            <span className="text-[10px] font-semibold text-[#FF5A36] mt-0.5 block">
              {activeFarm?.status} Management
            </span>
          </div>

          {/* Active Crops */}
          <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Crops
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-900">{farmCrops.length}</span>
              <span className="text-xs font-bold text-emerald-700">types</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
              Optimal Vigor
            </span>
          </div>

          {/* Next Task */}
          <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Next Task
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-blue-950 truncate">
                {activeFarm?.nextTaskText || "Watering"}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-blue-700 mt-0.5 block">
              Scheduled Cycle
            </span>
          </div>

          {/* Health Score */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Health Score
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-950">{activeFarm?.healthLabel || "Excellent"}</span>
              <span className="text-xs font-bold text-amber-700">({activeFarm?.healthScore}%)</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 mt-0.5 block">
              Zero active pathogen
            </span>
          </div>
        </div>
      </div>

      {/* THIS SEASON OVERVIEW WITH DONUT GRAPH & BREAKDOWN */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              This Season Overview
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Seasonal activity & progress completion rate
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
            (Current Season)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* CIRCULAR / DONUT VISUAL */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* SVG Radial Rings */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#F1F5F9"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Completed Ring (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * completedPct) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* In Progress Ring (Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FF5A36"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (completedPct + inProgressPct)) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Tasks
                </span>
                <span className="text-3xl font-black text-slate-900">
                  {totalTasks}
                </span>
                <span className="text-[10px] font-bold text-[#FF5A36]">
                  {completedPct}% Completed
                </span>
              </div>
            </div>
          </div>

          {/* BREAKDOWN PILL METRICS */}
          <div className="md:col-span-7 space-y-3">
            {/* Completed */}
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                <div>
                  <span className="text-xs font-black text-emerald-950 block">Completed</span>
                  <span className="text-[11px] text-emerald-700 font-medium">Fully verified & logged</span>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-950">
                {completedTasks} ({completedPct}%)
              </span>
            </div>

            {/* In Progress */}
            <div className="flex items-center justify-between p-3.5 bg-orange-50/70 border border-orange-200/60 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5A36]" />
                <div>
                  <span className="text-xs font-black text-orange-950 block">In Progress</span>
                  <span className="text-[11px] text-[#FF5A36] font-medium">Currently underway</span>
                </div>
              </div>
              <span className="text-sm font-black text-orange-950">
                {inProgressTasks} ({inProgressPct}%)
              </span>
            </div>

            {/* Pending */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300" />
                <div>
                  <span className="text-xs font-black text-slate-900 block">Pending</span>
                  <span className="text-[11px] text-slate-500 font-medium">Scheduled in queue</span>
                </div>
              </div>
              <span className="text-sm font-black text-slate-900">
                {pendingTasks} ({pendingPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* QUICK ACTION ROW (Add Task, Log Activity, Add Crop, More) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => onOpenAddModal("task")}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-800 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5A36] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">Add Task</span>
          </button>

          <button
            onClick={() => onOpenAddModal("activity")}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-800 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">Log Activity</span>
          </button>

          <button
            onClick={() => onOpenAddModal("crop")}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-800 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">Add Crop</span>
          </button>

          <button
            onClick={() => onNavigate("my_farms")}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-800 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">More Actions</span>
          </button>
        </div>
      </div>

      {/* TODAY'S PRIORITY PREVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Urgent Tasks Quick List */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A36]" />
              <span>Today's Active Tasks</span>
            </h3>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({farmTasks.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {farmTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] border border-orange-100/80 hover:border-orange-200 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                      task.status === "done"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-orange-400 bg-white"
                    }`}
                  >
                    {task.status === "done" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${task.status === "done" ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {task.fieldLocation} • {task.scheduledTime}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    task.status === "done"
                      ? "bg-emerald-100 text-emerald-700"
                      : task.dueBadge === "Today"
                      ? "bg-orange-100 text-[#FF5A36]"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {task.status === "done" ? "Done" : task.dueBadge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Irrigation Zones Quick Status */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Irrigation & Watering Zones</span>
            </h3>
            <button
              onClick={() => onNavigate("irrigation")}
              className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Zones</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {irrigationZones.slice(0, 4).map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{zone.zoneName}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {zone.method} • {zone.scheduledTime}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    zone.status === "Done"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : zone.status === "Scheduled"
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {zone.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
