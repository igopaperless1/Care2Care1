import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Droplets,
  FlaskConical,
  Scissors,
  Bug,
  Sprout,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2
} from "lucide-react";
import { FarmTask, FarmGardenItem } from "./types";

interface ScreenTasksScheduleProps {
  activeFarm: FarmGardenItem;
  tasks: FarmTask[];
  onToggleTask: (taskId: string) => void;
  onOpenAddModal: (type: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ScreenTasksSchedule: React.FC<ScreenTasksScheduleProps> = ({
  activeFarm,
  tasks,
  onToggleTask,
  onOpenAddModal,
  onDeleteTask
}) => {
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "In Progress" | "Done">("All");
  const [selectedDate, setSelectedDate] = useState<string>("15 May 2025, Thursday");

  const farmTasks = tasks.filter((t) => t.farmId === activeFarm.id);
  const doneCount = farmTasks.filter((t) => t.status === "done").length;
  const inProgressCount = farmTasks.filter((t) => t.status === "in_progress").length;
  const pendingCount = farmTasks.filter((t) => t.status === "pending").length;

  const filteredTasks = farmTasks.filter((task) => {
    if (filterStatus === "Done") return task.status === "done";
    if (filterStatus === "In Progress") return task.status === "in_progress";
    if (filterStatus === "Pending") return task.status === "pending";
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "irrigation":
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case "fertilizer":
        return <FlaskConical className="w-4 h-4 text-emerald-600" />;
      case "weeding":
        return <Scissors className="w-4 h-4 text-amber-600" />;
      case "pest":
        return <Bug className="w-4 h-4 text-rose-500" />;
      case "support":
        return <Sprout className="w-4 h-4 text-teal-600" />;
      case "sowing":
        return <Sprout className="w-4 h-4 text-orange-500" />;
      case "harvest":
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#FF5A36]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* DATE SELECTOR HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A36]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Today's Field Tasks
            </h2>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <span>{selectedDate}</span>
              <span className="text-[#FF5A36]">• {activeFarm.name}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddModal("task")}
          className="px-4 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Field Task</span>
        </button>
      </div>

      {/* FILTER TABS: All(6), Pending(3), In Progress(2), Done(1) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilterStatus("All")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === "All"
              ? "bg-[#FF5A36] text-white shadow-xs font-black"
              : "bg-white text-slate-700 hover:bg-orange-50 border border-slate-200/80"
          }`}
        >
          All ({farmTasks.length})
        </button>
        <button
          onClick={() => setFilterStatus("Pending")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === "Pending"
              ? "bg-[#FF5A36] text-white shadow-xs font-black"
              : "bg-white text-slate-700 hover:bg-orange-50 border border-slate-200/80"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus("In Progress")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === "In Progress"
              ? "bg-[#FF5A36] text-white shadow-xs font-black"
              : "bg-white text-slate-700 hover:bg-orange-50 border border-slate-200/80"
          }`}
        >
          In Progress ({inProgressCount})
        </button>
        <button
          onClick={() => setFilterStatus("Done")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            filterStatus === "Done"
              ? "bg-[#FF5A36] text-white shadow-xs font-black"
              : "bg-white text-slate-700 hover:bg-orange-50 border border-slate-200/80"
          }`}
        >
          Done ({doneCount})
        </button>
      </div>

      {/* TASK LIST (Matching Screenshot Card 3) */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-black text-slate-800">No tasks in this category</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tap below to schedule a new farm or garden task.
            </p>
            <button
              onClick={() => onOpenAddModal("task")}
              className="mt-4 px-4 py-2 bg-[#FF5A36] text-white text-xs font-black rounded-2xl cursor-pointer"
            >
              + Create Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === "done";
            return (
              <div
                key={task.id}
                className={`bg-white border rounded-3xl p-4 sm:p-5 shadow-2xs transition-all flex items-center justify-between gap-3 ${
                  isDone
                    ? "border-emerald-200 bg-emerald-50/30 opacity-80"
                    : "border-slate-200/80 hover:border-orange-200"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* CHECKBOX */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-xl border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-orange-400 bg-white"
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  {/* ICON */}
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/80 flex items-center justify-center shrink-0">
                    {getCategoryIcon(task.category)}
                  </div>

                  {/* TASK INFO */}
                  <div>
                    <h3
                      className={`text-sm font-black ${
                        isDone ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {task.fieldLocation}
                    </p>
                    {task.notes && (
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT TIME & BADGE */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-black text-slate-800">
                    {task.scheduledTime}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800"
                          : task.dueBadge === "Today"
                          ? "bg-orange-100 text-[#FF5A36]"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isDone ? "Done" : task.dueBadge}
                    </span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
