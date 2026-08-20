import React, { useState } from "react";
import {
  X,
  Calendar,
  Heart,
  Gift,
  Star,
  Sparkles,
  Bell,
  MapPin,
  FileText,
  User,
  Repeat
} from "lucide-react";
import { LifeEventItem, LifePerson, EventCategory } from "./types";

interface LifeDatesAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: LifeEventItem) => void;
  people: LifePerson[];
  initialEvent?: LifeEventItem | null;
}

export const LifeDatesAddEventModal: React.FC<LifeDatesAddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  people,
  initialEvent,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [category, setCategory] = useState<EventCategory>(
    initialEvent?.category || "Anniversary"
  );
  const [date, setDate] = useState(initialEvent?.date || "24 May 2025");
  const [dateBS, setDateBS] = useState(initialEvent?.dateBS || "2082 Jestha 10");
  const [tithi, setTithi] = useState(initialEvent?.tithi || "");
  const [personId, setPersonId] = useState(initialEvent?.personId || people[1]?.id || "");
  const [repeat, setRepeat] = useState<LifeEventItem["repeat"]>(
    initialEvent?.repeat || "Yearly"
  );
  const [reminderNotice, setReminderNotice] = useState(
    initialEvent?.reminderNotice || "1 Day Before at 9:00 AM"
  );
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [notes, setNotes] = useState(initialEvent?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedPerson = people.find((p) => p.id === personId);

    const savedItem: LifeEventItem = {
      id: initialEvent?.id || "e-" + Date.now(),
      title,
      category,
      date,
      dateBS: dateBS || undefined,
      tithi: tithi || undefined,
      daysLeft: initialEvent?.daysLeft ?? 10,
      repeat,
      personId: matchedPerson?.id,
      personName: matchedPerson?.name,
      relationship: matchedPerson?.relationship,
      reminderNotice,
      reminderEnabled: true,
      location: location || undefined,
      notes: notes || undefined,
      color: category === "Anniversary" ? "#FF5A36" : category === "Birthday" ? "#F59E0B" : "#10B981",
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A36]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              {initialEvent ? "Edit Life Event" : "Create New Life Date"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Event Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Our 5th Anniversary, Mom's 55th Birthday"
              required
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          {/* Category & Associated Person */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              >
                <option value="Anniversary">Anniversary</option>
                <option value="Birthday">Birthday</option>
                <option value="Special Day">Special Day</option>
                <option value="Personal Milestone">Personal Milestone</option>
                <option value="Couple Goal">Couple Goal</option>
                <option value="Cultural & Ritual">Cultural & Ritual</option>
                <option value="Career & Growth">Career & Growth</option>
                <option value="Custom Event">Custom Event</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Associated Person</label>
              <select
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              >
                <option value="">None / Both</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.relationship})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Fields: Gregorian and BS */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date (Gregorian)</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="24 May 2025"
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nepali BS Date</label>
              <input
                type="text"
                value={dateBS}
                onChange={(e) => setDateBS(e.target.value)}
                placeholder="2082 Jestha 10"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
          </div>

          {/* Repeat Frequency & Reminder Timing */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Repeat Frequency</label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              >
                <option value="Yearly">Every Year</option>
                <option value="Monthly">Every Month</option>
                <option value="Weekly">Every Week</option>
                <option value="Once">One-time only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Early Alert</label>
              <select
                value={reminderNotice}
                onChange={(e) => setReminderNotice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
              >
                <option value="On the Day at 9:00 AM">On the Day</option>
                <option value="1 Day Before at 9:00 AM">1 Day Before</option>
                <option value="2 Days Before at 9:00 AM">2 Days Before</option>
                <option value="3 Days Before at 9:00 AM">3 Days Before</option>
                <option value="7 Days Before at 9:00 AM">1 Week Before</option>
                <option value="15 Days Before at 9:00 AM">15 Days Before</option>
                <option value="30 Days Before at 9:00 AM">1 Month Before</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Location / Venue</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lakeside Pokhara, Home, Grand Hotel"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Celebration Notes & Wishes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Surprise ideas, gift reservations, memories..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] text-white text-xs font-black cursor-pointer shadow-xs"
            >
              {initialEvent ? "Save Changes" : "Create Life Date"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
