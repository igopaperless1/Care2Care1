import React, { useState } from "react";
import {
  BookOpen,
  User,
  Heart,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Edit2,
  Save,
  Check,
  Globe,
  Award,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { GuruProfile, FamilyTab } from "./types";

interface ScreenGuruDetailsProps {
  profile: GuruProfile;
  onUpdateProfile: (updated: Partial<GuruProfile>) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenGuruDetails: React.FC<ScreenGuruDetailsProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<"Personal" | "Spiritual" | "Contact" | "Addresses" | "Custom Fields">("Personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GuruProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Guru / Guru Mata Details</h2>
            <p className="text-xs text-slate-500">Personal antecedents, education, languages, addresses & contact records</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* 2. Sub Tabs: Personal, Spiritual, Contact, Addresses, Custom Fields */}
      <div className="flex items-center gap-1 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-200/80 overflow-x-auto no-scrollbar">
        {(["Personal", "Spiritual", "Contact", "Addresses", "Custom Fields"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#FF5A36] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Form Sections */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/90 shadow-2xs space-y-6">
        {/* Personal Tab */}
        {activeTab === "Personal" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.gender}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#FF5A36]" /> {formData.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.bloodGroup}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#FF5A36]" /> {formData.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nationality</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.nationality}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alternative Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.altPhone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.maritalStatus}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.permanentAddress}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Languages Known</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.languagesKnown.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      languagesKnown: e.target.value.split(",").map((s) => s.trim())
                    })
                  }
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.languagesKnown.join(", ")}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.temporaryAddress}
                  onChange={(e) => setFormData({ ...formData, temporaryAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100">
                  {formData.temporaryAddress}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-[#FF5A36]" /> {formData.education}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Profession (Before Diksha)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.professionBeforeDiksha}
                  onChange={(e) => setFormData({ ...formData, professionBeforeDiksha: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              ) : (
                <div className="text-xs font-semibold text-slate-900 bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-[#FF5A36]" /> {formData.professionBeforeDiksha}
                </div>
              )}
            </div>

            {/* Biography */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Biography</label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900 leading-relaxed"
                />
              ) : (
                <div className="text-xs text-slate-700 bg-orange-50/30 p-3 rounded-xl border border-orange-100 leading-relaxed">
                  {formData.biography}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spiritual Tab */}
        {activeTab === "Spiritual" && (
          <div className="space-y-3">
            <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 space-y-2">
              <h4 className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">Spiritual Vows & Traditions</h4>
              <p className="text-xs text-slate-700">
                Ordained into the Saraswati order of Dashnami Sanyasis by Param Pujya Swami Brahmanand Saraswati Maharaj.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("spiritual_details")}
              className="px-4 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Open Full Spiritual & Discipleship Page &rarr;
            </button>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "Contact" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-orange-50/30 rounded-2xl border border-orange-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ashram Contact Line</span>
              <div className="text-xs font-bold text-slate-900 mt-1">{formData.phone}</div>
            </div>
            <div className="p-3 bg-orange-50/30 rounded-2xl border border-orange-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Official Email</span>
              <div className="text-xs font-bold text-slate-900 mt-1">{formData.email}</div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "Addresses" && (
          <div className="space-y-3">
            <div className="p-3.5 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" /> Ashram Primary Location
              </span>
              <p className="text-xs text-slate-600">{formData.permanentAddress}</p>
            </div>
          </div>
        )}

        {/* Custom Fields Tab */}
        {activeTab === "Custom Fields" && (
          <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900">Custom Parampara Attributes</div>
            <div>• Vedic Gurukula Affiliation: Rishikesh Dashnami Parishad</div>
            <div>• Published Commentaries: Mandukya Upanishad Karika, Bhagavad Gita Viveka</div>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-4 border-t border-orange-100 flex justify-end">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
