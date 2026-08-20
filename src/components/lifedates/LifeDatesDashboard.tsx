import React from "react";
import {
  Heart,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Gift,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Bell,
  Star,
  Users
} from "lucide-react";
import { LifeEventItem, LifeDatesTab } from "./types";

interface LifeDatesDashboardProps {
  onNavigate: (tab: LifeDatesTab) => void;
  onSelectEvent: (event: LifeEventItem) => void;
  onAddNewEvent: () => void;
  events: LifeEventItem[];
  userName?: string;
}

export const LifeDatesDashboard: React.FC<LifeDatesDashboardProps> = ({
  onNavigate,
  onSelectEvent,
  onAddNewEvent,
  events,
  userName = "Roshan"
}) => {
  const nextSpecialEvent = events.find((e) => e.id === "e-1") || events[0];
  const thisMonthEvents = events.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Good Morning, {userName} <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Celebrate every moment of your life.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("reminders")}
            className="p-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 text-[#FF5A36] hover:bg-[#FFEFE8] transition-colors cursor-pointer"
            title="Reminders"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={onAddNewEvent}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white text-xs font-black shadow-xs hover:from-[#EA4C27] hover:to-[#FF5A36] transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* NEXT SPECIAL DAY HERO CARD */}
      {nextSpecialEvent && (
        <div
          onClick={() => onSelectEvent(nextSpecialEvent)}
          className="relative overflow-hidden bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EC] to-[#FEE2D5] border border-orange-200 rounded-3xl p-5 sm:p-6 shadow-xs cursor-pointer group hover:border-[#FF5A36]/60 transition-all"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-orange-200 text-[11px] font-black text-[#FF5A36] tracking-wide uppercase shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#FF5A36]" />
                <span>Next Special Day</span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#FF5A36] transition-colors">
                  {nextSpecialEvent.title}
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>{nextSpecialEvent.date}</span>
                  {nextSpecialEvent.dateBS && (
                    <span className="text-[10px] text-orange-600 bg-orange-100/70 px-1.5 py-0.5 rounded font-mono">
                      {nextSpecialEvent.dateBS}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(nextSpecialEvent);
                  }}
                  className="px-4 py-2 rounded-2xl bg-[#FF5A36] text-white text-xs font-black hover:bg-[#EA4C27] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>View Celebration Details</span>
                </button>
              </div>
            </div>

            {/* CIRCULAR COUNTDOWN GAUGE & COUPLE GRAPHIC */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#FFD5C6"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#FF5A36"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {nextSpecialEvent.daysLeft}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-0.5">
                    Days Left
                  </span>
                </div>
              </div>

              {/* Romantic Couple Avatar Card */}
              <div className="w-24 h-24 rounded-3xl bg-white/90 p-1.5 border border-orange-200 shadow-xs flex items-center justify-center overflow-hidden">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-rose-100 via-orange-100 to-amber-100 flex flex-col items-center justify-center text-[#FF5A36] relative">
                  <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-700 mt-1">Roshan & Pooja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODAY'S OVERVIEW 4 TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          onClick={() => onNavigate("calendar")}
          className="bg-[#FFF9F5] border border-orange-200/80 hover:border-[#FF5A36]/60 rounded-3xl p-3.5 text-center cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Events</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">{events.length}</p>
        </div>

        <div
          onClick={() => onNavigate("upcoming")}
          className="bg-[#FFF9F5] border border-orange-200/80 hover:border-[#FF5A36]/60 rounded-3xl p-3.5 text-center cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Upcoming</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">
            {events.filter((e) => e.daysLeft <= 30).length}
          </p>
        </div>

        <div
          onClick={() => onNavigate("couple_goals")}
          className="bg-[#FFF9F5] border border-orange-200/80 hover:border-[#FF5A36]/60 rounded-3xl p-3.5 text-center cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Completed</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">24</p>
        </div>

        <div
          onClick={() => onNavigate("memories")}
          className="bg-[#FFF9F5] border border-orange-200/80 hover:border-[#FF5A36]/60 rounded-3xl p-3.5 text-center cursor-pointer transition-all shadow-2xs group"
        >
          <div className="w-9 h-9 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Memories</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">56</p>
        </div>
      </div>

      {/* THIS MONTH SECTION */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">This Month</h3>
          </div>
          <button
            onClick={() => onNavigate("upcoming")}
            className="text-xs font-black text-[#FF5A36] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {thisMonthEvents.map((evt) => {
            const isAnniversary = evt.category === "Anniversary";
            const isBirthday = evt.category === "Birthday";

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="bg-white border border-orange-200/70 hover:border-[#FF5A36]/70 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
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
                      <Star className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#FF5A36]">{evt.date.slice(0, 6)}</span>
                      <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-[#FF5A36] transition-colors">
                        {evt.title}
                      </h4>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                      {evt.personName ? `${evt.personName} • ` : ""}{evt.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-xl">
                    {evt.daysLeft}d left
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5A36] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK DISCOVERY TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => onNavigate("quotes")}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-4 cursor-pointer hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Quote of Day</span>
            <p className="text-xs font-black text-slate-900">"Collect moments, not things."</p>
          </div>
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
        </div>

        <div
          onClick={() => onNavigate("gift_ideas")}
          className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/80 rounded-3xl p-4 cursor-pointer hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">Gift Inspiration</span>
            <p className="text-xs font-black text-slate-900">Personalized Photo Frame & More</p>
          </div>
          <Gift className="w-5 h-5 text-rose-600 shrink-0" />
        </div>

        <div
          onClick={() => onNavigate("people")}
          className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/80 rounded-3xl p-4 cursor-pointer hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-orange-700 tracking-wider">Family & Loved Ones</span>
            <p className="text-xs font-black text-slate-900">Manage 5 Important People</p>
          </div>
          <Users className="w-5 h-5 text-[#FF5A36] shrink-0" />
        </div>
      </div>
    </div>
  );
};
