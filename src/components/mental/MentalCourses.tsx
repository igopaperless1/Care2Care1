import React from "react";
import {
  GraduationCap,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Droplets,
  Heart
} from "lucide-react";
import { soundEngine } from "./soundEngine";

export const MentalCourses: React.FC = () => {
  const courses = [
    {
      id: "c-1",
      title: "CBT Fundamentals for Anxiety",
      lessons: 6,
      completedLessons: 4,
      duration: "45 mins",
      instructor: "Dr. Ananya Sharma",
      category: "Cognitive Therapy",
      progress: 66,
    },
    {
      id: "c-2",
      title: "Mastering Restorative Sleep",
      lessons: 5,
      completedLessons: 2,
      duration: "35 mins",
      instructor: "Dr. Marcus Vance",
      category: "Sleep Hygiene",
      progress: 40,
    },
    {
      id: "c-3",
      title: "Somatic Breathwork & Stress Defense",
      lessons: 4,
      completedLessons: 0,
      duration: "28 mins",
      instructor: "Dr. Elena Rostova",
      category: "Breathwork",
      progress: 0,
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
            Psychoeducation
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Guided Audio Masterclasses</h2>
          <p className="text-xs text-slate-500 font-medium">Expert-led courses in CBT, stress reduction, and sleep.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
          <GraduationCap className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Courses Feed */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-md">
                  {course.category}
                </span>
                <h3 className="text-sm font-black text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-400 font-bold">
                  {course.instructor} • {course.lessons} Lessons • {course.duration}
                </p>
              </div>

              <button
                onClick={() => soundEngine.playChime(600, 0.3)}
                className="px-4 py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-2xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{course.progress > 0 ? "Continue Lesson" : "Start Course"}</span>
              </button>
            </div>

            {/* Progress Bar in Peach */}
            <div className="space-y-1">
              <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF5A36] rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{course.completedLessons} of {course.lessons} completed</span>
                <span className="text-[#FF5A36] font-black">{course.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
