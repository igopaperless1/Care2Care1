import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Heart,
  Gift,
  Star,
  Calendar as CalendarIcon,
  Sparkles,
  Info
} from "lucide-react";
import { LifeEventItem } from "./types";

interface LifeDatesCalendarProps {
  events: LifeEventItem[];
  onSelectEvent: (event: LifeEventItem) => void;
  onAddNewEvent: () => void;
}

export const LifeDatesCalendar: React.FC<LifeDatesCalendarProps> = ({
  events,
  onSelectEvent,
  onAddNewEvent,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(4); // May (0-indexed: 4)
  const [selectedDay, setSelectedDay] = useState<number>(24);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const year = 2025;

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  // Calendar matrix for May 2025 (starts on Thursday = 1st)
  // Let's create a realistic calendar grid
  const daysInMonth = 31;
  const prevMonthDays = [28, 29, 30]; // Mon, Tue, Wed before May 1
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Map events to day numbers for May
  const getEventForDay = (day: number) => {
    if (day === 24) return events.find((e) => e.id === "e-1");
    if (day === 27) return events.find((e) => e.id === "e-2");
    if (day === 30) return events.find((e) => e.id === "e-3");
    return undefined;
  };

  const selectedEvent = getEventForDay(selectedDay) || events.find((e) => e.id === "e-1");

  return (
    <div className="space-y-4">
      {/* CALENDAR CONTAINER */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-6 shadow-xs space-y-5">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-2xl bg-white border border-orange-200 text-slate-700 hover:bg-[#FFEFE8] hover:text-[#FF5A36] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {months[currentMonthIndex]} {year}
            </h3>
            <span className="text-[10px] font-bold text-[#FF5A36] uppercase tracking-wider">
              BS: Baisakh - Jestha 2082
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-2xl bg-white border border-orange-200 text-slate-700 hover:bg-[#FFEFE8] hover:text-[#FF5A36] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d} className="text-xs font-bold text-slate-500 py-1">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Previous month padding days */}
          {prevMonthDays.map((d) => (
            <div
              key={`prev-${d}`}
              className="h-10 sm:h-12 rounded-2xl flex flex-col items-center justify-center text-xs font-semibold text-slate-300 select-none"
            >
              {d}
            </div>
          ))}

          {/* Current month days */}
          {days.map((d) => {
            const isSelected = d === selectedDay;
            const dayEvent = getEventForDay(d);
            const isToday = d === 20;

            let dotColor = "";
            if (d === 24) dotColor = "bg-rose-500"; // Anniversary
            else if (d === 27) dotColor = "bg-amber-500"; // Birthday
            else if (d === 30) dotColor = "bg-emerald-500"; // Special Day
            else if (d === 8) dotColor = "bg-[#FF5A36]"; // Event

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`h-10 sm:h-12 rounded-2xl relative flex flex-col items-center justify-center text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5A36] text-white shadow-xs scale-102"
                    : isToday
                    ? "bg-orange-100 text-[#FF5A36] border border-[#FF5A36]/40"
                    : "bg-white hover:bg-[#FFEFE8] text-slate-800 border border-orange-100/60"
                }`}
              >
                <span>{d}</span>
                {dotColor && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 ${
                      isSelected ? "bg-white" : dotColor
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-orange-200/50 text-[11px] font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Birthday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Anniversary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Special Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
            <span>Event</span>
          </div>
        </div>
      </div>

      {/* SELECTED DATE CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            {selectedDay} May 2025
          </span>
          <span className="text-[11px] font-bold text-[#FF5A36]">
            {selectedEvent ? "1 Event Scheduled" : "No Events"}
          </span>
        </div>

        {selectedEvent ? (
          <div
            onClick={() => onSelectEvent(selectedEvent)}
            className="bg-white border border-orange-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#FF5A36] transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                  {selectedEvent.title}
                </h4>
                <p className="text-xs font-semibold text-slate-500">
                  {selectedEvent.daysLeft} Days Left • {selectedEvent.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#FF5A36] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                View
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36]" />
            </div>
          </div>
        ) : (
          <div className="bg-white/60 border border-dashed border-orange-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-500">
            No events scheduled on {selectedDay} May 2025. Tap below to create one.
          </div>
        )}

        <button
          onClick={onAddNewEvent}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>
    </div>
  );
};
