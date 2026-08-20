import React, { useState } from "react";
import {
  Users,
  User,
  Heart,
  Plus,
  Phone,
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Link as LinkIcon
} from "lucide-react";
import { LifePerson } from "./types";

interface LifeDatesPeopleProps {
  people: LifePerson[];
  onAddPerson: (person: LifePerson) => void;
  onDeletePerson: (id: string) => void;
}

export const LifeDatesPeople: React.FC<LifeDatesPeopleProps> = ({
  people,
  onAddPerson,
  onDeletePerson,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<LifePerson["relationship"]>("Partner");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [dateOfBirth, setDateOfBirth] = useState("1996-03-22");
  const [dateOfBirthBS, setDateOfBirthBS] = useState("2052-12-09");
  const [tithiBirth, setTithiBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPerson: LifePerson = {
      id: "p-" + Date.now(),
      name,
      relationship,
      gender,
      dateOfBirth,
      dateOfBirthBS,
      tithiBirth,
      phone,
      notes,
      createdAt: new Date().toISOString(),
    };

    onAddPerson(newPerson);
    setIsAddModalOpen(false);
    setName("");
    setPhone("");
    setNotes("");
  };

  return (
    <div className="space-y-4">
      {/* HEADER CARD */}
      <div className="bg-[#FFF9F5] border border-orange-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8B6B] text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Family & Important Persons ({people.length})
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Manage family tree relationships, birthdays & BS/Tithis
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white text-xs font-black shadow-xs hover:from-[#EA4C27] hover:to-[#FF5A36] transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Person</span>
        </button>
      </div>

      {/* PEOPLE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {people.map((p) => {
          const isPartner = p.relationship === "Partner" || p.relationship === "Spouse";

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-2xl p-4 space-y-3 shadow-2xs transition-all hover:border-[#FF5A36] ${
                isPartner ? "border-orange-300/80 bg-gradient-to-br from-white to-[#FFF6F2]" : "border-orange-200/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${
                      isPartner
                        ? "bg-rose-100 text-rose-600 border border-rose-200"
                        : "bg-orange-100 text-[#FF5A36] border border-orange-200"
                    }`}
                  >
                    {isPartner ? <Heart className="w-5 h-5 fill-rose-500" /> : p.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                    <span className="text-[11px] font-bold text-[#FF5A36] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {p.relationship}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeletePerson(p.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove person"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Details Row */}
              <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-orange-100/60">
                {p.dateOfBirth && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Birthday:</span>
                    <span className="font-black text-slate-900">{p.dateOfBirth}</span>
                  </div>
                )}
                {p.dateOfBirthBS && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Nepali BS:</span>
                    <span className="font-mono font-bold text-orange-700">{p.dateOfBirthBS}</span>
                  </div>
                )}
                {p.tithiBirth && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Tithi:</span>
                    <span className="font-bold text-slate-700">{p.tithiBirth}</span>
                  </div>
                )}
                {p.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Phone:</span>
                    <span className="font-semibold text-slate-700">{p.phone}</span>
                  </div>
                )}
              </div>

              {p.notes && (
                <p className="text-[11px] font-medium text-slate-500 bg-[#FFF9F5] p-2 rounded-xl border border-orange-100">
                  {p.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD NEW PERSON */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-black text-slate-900">Add Important Person</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pooja Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="Partner">Partner / Soulmate</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Self">Self</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Best Friend">Best Friend</option>
                    <option value="Family">Family Member</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth (AD)</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nepali DOB (BS)</label>
                  <input
                    type="text"
                    value={dateOfBirthBS}
                    onChange={(e) => setDateOfBirthBS(e.target.value)}
                    placeholder="2052-12-09"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tithi (Lunar Phase)</label>
                <input
                  type="text"
                  value={tithiBirth}
                  onChange={(e) => setTithiBirth(e.target.value)}
                  placeholder="e.g. Jestha Shukla Dashami"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 9841..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Preferences</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Favorite treats, clothing size, flowers..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F5] border border-orange-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#FF5A36] hover:bg-[#EA4C27] text-white text-xs font-black cursor-pointer shadow-xs"
                >
                  Save Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
