import React, { useState } from "react";
import {
  Heart,
  Gift,
  Calendar,
  Star,
  Sparkles,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  Camera
} from "lucide-react";
import { LifeEventItem } from "./types";

interface LifeDatesUpcomingProps {
  events: LifeEventItem[];
  onSelectEvent: (event: LifeEventItem) => void;
  onAddNewEvent: () => void;
}

export const LifeDatesUpcoming: React.FC<LifeDatesUpcomingProps> = ({
  events,
  onSelectEvent,
  onAddNewEvent,
}) => {
  const [filter, setFilter] = useState<"All" | "Birthday" | "Anniversary" | "Special">("All");

  const filteredEvents = events.filter((e) => {
    if (filter === "All") return true;
    if (filter === "Birthday") return e.category === "Birthday";
    if (filter === "Anniversary") return e.category === "Anniversary";
    if (filter === "Special") return e.category === "Special Day" || e.category === "Cultural & Ritual" || e.category === "Personal Milestone";
    return true;
  });

  const next7DaysEvents = filteredEvents.filter((e) => e.daysLeft <= 14);
  const next30DaysEvents = filteredEvents.filter((e) => e.daysLeft > 14 && e.daysLeft <= 35);
  const laterEvents = filteredEvents.filter((e) => e.daysLeft > 35);

  const renderEventCard = (evt: LifeEventItem) => {
    const isAnniversary = evt.category === "Anniversary";
    const isBirthday = evt.category === "Birthday";

    return (
      <div
        key={evt.id}
        onClick={() => onSelectEvent(evt)}
        className="bg-white border border-orange-200/80 hover:border-[#FF5A36] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isAnniversary
                ? "bg-rose-100 text-rose-500"
                : isBirthday
                ? "bg-amber-100 text-amber-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isAnniversary ? (
              <Heart className="w-5 h-5 fill-rose-500" />
            ) : isBirthday ? (
              <Gift className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-[#FF5A36] transition-colors">
              {evt.title}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>{evt.date}</span>
              {evt.relationship && <span>• {evt.relationship}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-black text-slate-600 bg-[#FFF9F5] border border-orange-200/80 px-2.5 py-1 rounded-xl">
            {evt.daysLeft} Days Left
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(["All", "Birthday", "Anniversary", "Special"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              filter === tab
                ? "bg-[#FF5A36] text-white border-[#FF5A36] shadow-xs"
                : "bg-[#FFF9F5] hover:bg-[#FFEFE8] text-slate-700 border-orange-200/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SECTION: NEXT 7 DAYS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF5A36]" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Next 7 Days</h3>
          </div>
          <span className="text-xs font-bold text-[#FF5A36] bg-orange-100 px-2 py-0.5 rounded-full">
            {next7DaysEvents.length} Events
          </span>
        </div>

        <div className="space-y-2.5">
          {next7DaysEvents.length > 0 ? (
            next7DaysEvents.map(renderEventCard)
          ) : (
            <p className="text-xs text-slate-500 py-3 text-center">No events in next 7 days</p>
          )}
        </div>
      </div>

      {/* SECTION: NEXT 30 DAYS */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Next 30 Days</h3>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            {next30DaysEvents.length} Events
          </span>
        </div>

        <div className="space-y-2.5">
          {next30DaysEvents.length > 0 ? (
            next30DaysEvents.map(renderEventCard)
          ) : (
            <p className="text-xs text-slate-500 py-3 text-center">No events in this range</p>
          )}
        </div>
      </div>

      {/* LATER EVENTS IF ANY */}
      {laterEvents.length > 0 && (
        <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Upcoming Later</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {laterEvents.length} Events
            </span>
          </div>
          <div className="space-y-2.5">{laterEvents.map(renderEventCard)}</div>
        </div>
      )}

      {/* BOTTOM BUTTON */}
      <button
        onClick={onAddNewEvent}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Event</span>
      </button>
    </div>
  );
};
