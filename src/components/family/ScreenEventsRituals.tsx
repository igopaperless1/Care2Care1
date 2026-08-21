import React, { useState } from "react";
import {
  Calendar,
  Flame,
  Plus,
  Clock,
  MapPin,
  Sparkles,
  Filter,
  CheckCircle2,
  Trash2,
  Share2
} from "lucide-react";
import { SpiritualEvent, FamilyTab } from "./types";

interface ScreenEventsRitualsProps {
  events: SpiritualEvent[];
  onAddEvent: (evt: SpiritualEvent) => void;
  onDeleteEvent: (id: string) => void;
  onNavigate: (tab: FamilyTab) => void;
  onOpenAddEventModal: () => void;
}

export const ScreenEventsRituals: React.FC<ScreenEventsRitualsProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
  onNavigate,
  onOpenAddEventModal
}) => {
  const [filterTab, setFilterTab] = useState<"Upcoming" | "Past Events" | "All Events">("Upcoming");
  const [selectedType, setSelectedType] = useState<string>("All");

  const filteredEvents = events.filter((evt) => {
    if (selectedType !== "All" && evt.type !== selectedType) return false;
    if (filterTab === "Upcoming") {
      return !evt.daysRemainingLabel.includes("Past");
    }
    if (filterTab === "Past Events") {
      return evt.daysRemainingLabel.includes("Past");
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            5
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Guru / Guru Mata Events & Rituals</h2>
            <p className="text-xs text-slate-500">Upcoming festivals, Janam Tithi, Punyatithi & recurring Aradhana</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddEventModal}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* 2. Subtabs & Filter Bar (Matching Card 5) */}
      <div className="bg-white rounded-3xl p-3 border border-orange-100/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-orange-50/70 p-1 rounded-2xl border border-orange-200/80 w-full sm:w-auto">
          {(["Upcoming", "Past Events", "All Events"] as const).map((tab) => {
            const isActive = filterTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF5A36] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-orange-50/60 border border-orange-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Event Types</option>
            <option value="Guru Purnima">Guru Purnima</option>
            <option value="Janam Tithi">Janam Tithi</option>
            <option value="Punyatithi">Punyatithi</option>
            <option value="Shraddha">Shraddha</option>
            <option value="Diwas / Aradhana">Diwas / Aradhana</option>
          </select>
        </div>
      </div>

      {/* 3. Event List (Exact layout matching Card 5) */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-2">
            <Calendar className="w-8 h-8 text-orange-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No events found for this filter</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white hover:bg-orange-50/30 rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex flex-col items-center justify-center text-[#FF5A36] shrink-0 font-black">
                  <Flame className="w-5 h-5 text-[#FF5A36]" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900">{evt.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A36] border border-orange-200">
                      {evt.type}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {evt.dateFormatted}
                    </span>
                    {evt.tithiVS && (
                      <span className="text-amber-800 font-semibold">• {evt.tithiVS}</span>
                    )}
                    {evt.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {evt.location}
                      </span>
                    )}
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-1">{evt.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span
                  className={`px-3 py-1.5 rounded-2xl text-xs font-black tracking-wide border shadow-2xs ${
                    evt.daysRemainingLabel === "Recurring"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-[#FF5A36]/10 text-[#FF5A36] border-orange-200"
                  }`}
                >
                  {evt.daysRemainingLabel}
                </span>

                <button
                  type="button"
                  onClick={() => onDeleteEvent(evt.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
