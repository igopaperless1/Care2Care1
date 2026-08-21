import React, { useState } from "react";
import {
  X,
  User,
  Heart,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Camera,
  Save,
  Check
} from "lucide-react";
import { FamilyMember, Gender } from "./types";

interface MemberModalProps {
  member?: FamilyMember | null;
  allMembers: FamilyMember[];
  onSave: (member: FamilyMember) => void;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  member,
  allMembers,
  onSave,
  onClose
}) => {
  const isEdit = !!member;

  const [formData, setFormData] = useState<FamilyMember>(
    member || {
      id: `mem-${Date.now()}`,
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "Male",
      isSelf: false,
      isAlive: true,
      dateOfBirth: "",
      placeOfBirth: "",
      dateOfDeath: "",
      placeOfDeath: "",
      phone: "",
      email: "",
      occupation: "",
      education: "",
      bloodGroup: "O+",
      religion: "Hinduism",
      gotra: "Kashyap",
      kula: "",
      nationality: "Nepali",
      permanentAddress: "",
      city: "",
      profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      biography: "",
      fatherId: "",
      motherId: "",
      spouseIds: []
    }
  );

  const potentialFathers = allMembers.filter((m) => m.id !== formData.id && m.gender === "Male");
  const potentialMothers = allMembers.filter((m) => m.id !== formData.id && m.gender === "Female");
  const potentialSpouses = allMembers.filter((m) => m.id !== formData.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please provide First Name and Last Name.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full border border-orange-200 shadow-2xl space-y-4 my-8 animate-in fade-in max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isEdit ? `Edit Member: ${member.firstName} ${member.lastName}` : "Add New Family Member"}
              </h3>
              <p className="text-xs text-slate-500">Record biographical details, Gotra, ancestry & parentage</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Middle Name</label>
              <input
                type="text"
                value={formData.middleName || ""}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={formData.isAlive ? "Living" : "Deceased"}
                onChange={(e) => setFormData({ ...formData, isAlive: e.target.value === "Living" })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="Living">Living</option>
                <option value="Deceased">Deceased (†)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gotra</label>
              <input
                type="text"
                value={formData.gotra || ""}
                onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                placeholder="e.g. Kashyap"
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Place of Birth</label>
              <input
                type="text"
                value={formData.placeOfBirth || ""}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                placeholder="e.g. Kathmandu, Nepal"
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          {!formData.isAlive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Date of Passing (Punyatithi)</label>
                <input
                  type="date"
                  value={formData.dateOfDeath || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Place of Passing</label>
                <input
                  type="text"
                  value={formData.placeOfDeath || ""}
                  onChange={(e) => setFormData({ ...formData, placeOfDeath: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Lineage & Relationship Links */}
          <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-3">
            <h4 className="text-xs font-black text-[#FF5A36] uppercase tracking-wider">Ancestral Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father</label>
                <select
                  value={formData.fatherId || ""}
                  onChange={(e) => setFormData({ ...formData, fatherId: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="">None / Unknown</option>
                  {potentialFathers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.firstName} {f.lastName} ({f.dateOfBirth?.split("-")[0] || ""})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mother</label>
                <select
                  value={formData.motherId || ""}
                  onChange={(e) => setFormData({ ...formData, motherId: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="">None / Unknown</option>
                  {potentialMothers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.dateOfBirth?.split("-")[0] || ""})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Photo & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation || ""}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Software Engineer"
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
              <input
                type="text"
                value={formData.profilePhoto || ""}
                onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Footer Actions */}
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
              className="px-6 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
