import React, { useState } from "react";
import { X, Calendar, Flame, MapPin, Sparkles, Plus, Save } from "lucide-react";
import { SpiritualEvent } from "./types";

interface AddEventModalProps {
  onSave: (evt: SpiritualEvent) => void;
  onClose: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SpiritualEvent["type"]>("Guru Purnima");
  const [dateFormatted, setDateFormatted] = useState("");
  const [tithiVS, setTithiVS] = useState("");
  const [daysRemainingLabel, setDaysRemainingLabel] = useState("Upcoming");
  const [location, setLocation] = useState("Ashram Mandapam");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide an Event Title.");
      return;
    }
    const newEvt: SpiritualEvent = {
      id: `evt-${Date.now()}`,
      title,
      type,
      dateFormatted: dateFormatted || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      tithiVS: tithiVS || undefined,
      daysRemainingLabel: daysRemainingLabel || "Upcoming",
      isRecurring: true,
      location,
      description
    };
    onSave(newEvt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-orange-200 shadow-2xl space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Add Sacred Ritual or Tithi Event</h3>
              <p className="text-xs text-slate-500">Record Guru Purnima, Janam Tithi, Punyatithi or Shraddha</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Guru Purnima Maha Puja"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="Guru Purnima">Guru Purnima</option>
                <option value="Janam Tithi">Janam Tithi</option>
                <option value="Punyatithi">Punyatithi</option>
                <option value="Shraddha">Shraddha</option>
                <option value="Diwas / Aradhana">Diwas / Aradhana</option>
                <option value="Festival">Festival</option>
                <option value="Satsang">Satsang</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date (Formatted)</label>
              <input
                type="text"
                placeholder="e.g. 10 July 2025"
                value={dateFormatted}
                onChange={(e) => setDateFormatted(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vikram Samvat Tithi</label>
              <input
                type="text"
                placeholder="e.g. Ashadha Shukla Purnima"
                value={tithiVS}
                onChange={(e) => setTithiVS(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Countdown / Badge Label</label>
              <input
                type="text"
                placeholder="e.g. In 25 Days or Recurring"
                value={daysRemainingLabel}
                onChange={(e) => setDaysRemainingLabel(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Vedanand Ashram, Rishikesh"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Vidhi Notes</label>
            <textarea
              rows={2}
              placeholder="Ritual details, Gayatri chant count, Annadanam..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-orange-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
