import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  Clock,
  Repeat,
  Bell,
  FileText,
  Share2,
  Edit3,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Camera
} from "lucide-react";
import { LifeEventItem } from "./types";

interface LifeDatesEventDetailsProps {
  event: LifeEventItem;
  onBack: () => void;
  onEdit: (event: LifeEventItem) => void;
  onDelete: (id: string) => void;
  onShare: (event: LifeEventItem) => void;
  onAddMemory: (eventId: string) => void;
}

export const LifeDatesEventDetails: React.FC<LifeDatesEventDetailsProps> = ({
  event,
  onBack,
  onEdit,
  onDelete,
  onShare,
  onAddMemory,
}) => {
  // Live ticking countdown for Days, Hours, Minutes, Seconds
  const [timeLeft, setTimeLeft] = useState({
    days: event.daysLeft,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* TOP NAVIGATION BACK BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 hover:bg-[#FFEFE8] text-slate-700 text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF5A36]" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare(event)}
            className="p-2 rounded-2xl bg-[#FFF9F5] border border-orange-200/80 hover:bg-[#FFEFE8] text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Share celebration"
          >
            <Share2 className="w-4 h-4 text-[#FF5A36]" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HEADER HERO ILLUSTRATION */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF0E8] via-[#FFF8F3] to-white border border-orange-200 rounded-3xl p-6 text-center space-y-4 shadow-xs">
        {/* Couple Illustration Box */}
        <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-rose-100 via-orange-100 to-amber-100 border border-orange-200/80 p-2 shadow-xs flex items-center justify-center relative">
          <Heart className="w-12 h-12 fill-rose-500 text-rose-500 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF5A36] text-white flex items-center justify-center text-xs shadow-xs">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {event.title}
            </h2>
            <button
              onClick={() => onEdit(event)}
              className="p-1 rounded-lg hover:bg-orange-100 text-slate-400 hover:text-[#FF5A36] transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-600 mt-1">
            {event.date} {event.originalYear ? `(${event.originalYear})` : ""}
          </p>
          <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#FF5A36] bg-orange-100/70 px-2.5 py-0.5 rounded-full">
            <Repeat className="w-3 h-3" />
            <span>Every {event.repeat.toLowerCase()}</span>
          </div>
        </div>

        {/* 4 COUNTDOWN TIMER BOXES */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto pt-2">
          <div className="bg-white border border-orange-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
            <span className="block text-xl sm:text-2xl font-black text-[#FF5A36]">
              {timeLeft.days}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Days
            </span>
          </div>
          <div className="bg-white border border-orange-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
            <span className="block text-xl sm:text-2xl font-black text-slate-800 font-mono">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Hours
            </span>
          </div>
          <div className="bg-white border border-orange-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
            <span className="block text-xl sm:text-2xl font-black text-slate-800 font-mono">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Minutes
            </span>
          </div>
          <div className="bg-white border border-orange-200/80 rounded-2xl p-2.5 text-center shadow-2xs">
            <span className="block text-xl sm:text-2xl font-black text-slate-800 font-mono">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Seconds
            </span>
          </div>
        </div>
      </div>

      {/* EVENT DETAILS TABLE */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider px-1">
          Event Details
        </h3>

        <div className="bg-white border border-orange-200/60 rounded-2xl divide-y divide-orange-100 overflow-hidden text-xs">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-600 font-bold">
              <Sparkles className="w-4 h-4 text-[#FF5A36]" />
              <span>Type</span>
            </div>
            <span className="font-black text-slate-900">{event.category}</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-600 font-bold">
              <Calendar className="w-4 h-4 text-[#FF5A36]" />
              <span>Start Date</span>
            </div>
            <span className="font-black text-slate-900">
              {event.date} {event.originalYear ? `(${event.originalYear})` : ""}
            </span>
          </div>

          {event.dateBS && (
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-600 font-bold">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Bikram Sambat (BS)</span>
              </div>
              <span className="font-mono font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded">
                {event.dateBS}
              </span>
            </div>
          )}

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-600 font-bold">
              <Repeat className="w-4 h-4 text-[#FF5A36]" />
              <span>Repeat</span>
            </div>
            <span className="font-black text-slate-900">{event.repeat}</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-600 font-bold">
              <Bell className="w-4 h-4 text-[#FF5A36]" />
              <span>Reminder</span>
            </div>
            <span className="font-black text-slate-900">{event.reminderNotice}</span>
          </div>

          {event.location && (
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-600 font-bold">
                <MapPin className="w-4 h-4 text-[#FF5A36]" />
                <span>Location</span>
              </div>
              <span className="font-black text-slate-900">{event.location}</span>
            </div>
          )}

          <div className="p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 text-slate-600 font-bold">
              <FileText className="w-4 h-4 text-[#FF5A36]" />
              <span>Notes</span>
            </div>
            <p className="text-slate-800 font-medium pl-6 leading-relaxed bg-[#FFF9F5] p-2.5 rounded-xl border border-orange-100">
              {event.notes || "No notes added for this event."}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onEdit(event)}
          className="py-3 rounded-2xl bg-white hover:bg-[#FFEFE8] border border-orange-200 text-slate-800 text-xs font-black shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#FF5A36]" />
          <span>Edit Event</span>
        </button>

        <button
          onClick={() => onShare(event)}
          className="py-3 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] hover:from-[#EA4C27] hover:to-[#FF5A36] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Celebration</span>
        </button>
      </div>

      {/* MEMORY SHORTCUT */}
      <button
        onClick={() => onAddMemory(event.id)}
        className="w-full py-2.5 rounded-2xl bg-[#FFF9F5] hover:bg-[#FFEFE8] border border-dashed border-orange-300 text-[#FF5A36] text-xs font-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Camera className="w-4 h-4" />
        <span>Add a Photo / Memory to this Event</span>
      </button>
    </div>
  );
};
