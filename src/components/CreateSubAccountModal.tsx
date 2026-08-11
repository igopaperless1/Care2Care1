import React, { useState } from "react";
import {
  X,
  UserPlus,
  Users,
  ShieldCheck,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
  Camera,
  FileText
} from "lucide-react";
import { Patient } from "../types";

export interface SubAccountData {
  id: string;
  type: "family" | "relative" | "neighbor" | "specific_person" | "child" | "elderly";
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  profilePhoto: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  notes: string;
  permissions: {
    canMonitor: boolean;
    canReceiveNotifications: boolean;
    canAddServices: boolean;
    canEditProfile: boolean;
  };
  createdAt: string;
}

interface CreateSubAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubAccountCreated: (newAccount: Patient) => void;
}

export const CreateSubAccountModal: React.FC<CreateSubAccountModalProps> = ({
  isOpen,
  onClose,
  onSubAccountCreated
}) => {
  const [accountType, setAccountType] = useState<SubAccountData["type"]>("family");
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("Son / Daughter");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState<number>(25);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [notes, setNotes] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
  );

  const [careLevel, setCareLevel] = useState<string>("partial_care");
  const [specialNeeds, setSpecialNeeds] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");
  const [doctorPhone, setDoctorPhone] = useState<string>("");

  const [permissions, setPermissions] = useState({
    canMonitor: true,
    canReceiveNotifications: true,
    canAddServices: true,
    canEditProfile: false
  });

  // PRESETS / FORM FILLERS FOR DEPENDENTS (Kids, Disabled, Old Age Parents, Patients, Relatives, Neighbors)
  const DEPENDENT_PRESETS = [
    {
      label: "👶 Toddler / Kid",
      type: "child" as const,
      name: "Aarav Singh",
      rel: "Son",
      ageVal: 8,
      genderVal: "male",
      blood: "O+",
      allergiesVal: "Peanuts, Dust pollen",
      cond: "Healthy, Regular Pediatric Vaccination Routine",
      photo: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=250",
      notesVal: "Active kid, needs morning hydration reminders & school routine tracking.",
      level: "independent",
      needs: "Needs supervision for homework & bedtime routine.",
      doc: "Dr. K. Sharma (Pediatrician)"
    },
    {
      label: "👵 Senior / Old Age Mother",
      type: "elderly" as const,
      name: "Gita Devi Singh",
      rel: "Mother",
      ageVal: 65,
      genderVal: "female",
      blood: "O+",
      allergiesVal: "Penicillin",
      cond: "Hypertension, Mild Osteoarthritis, High Blood Sugar",
      photo: "https://images.unsplash.com/photo-1581579438747-1dc8d1e05fec?auto=format&fit=crop&q=80&w=250",
      notesVal: "Requires daily morning Amlodipine 5mg & blood pressure monitoring at 8 AM.",
      level: "partial_care",
      needs: "Assistance with stair walking & heavy physical mobility.",
      doc: "Dr. B. R. Bhattarai (Cardiologist)"
    },
    {
      label: "♿ Disabled Family Member",
      type: "relative" as const,
      name: "Rohan Verma",
      rel: "Brother / Relative",
      ageVal: 32,
      genderVal: "male",
      blood: "B+",
      allergiesVal: "Latex",
      cond: "Paraplegia (Lower limb mobility assistance), Wheelchair User",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
      notesVal: "Requires daily physical therapy exercises, ramp navigation & hydration logging.",
      level: "full_care",
      needs: "Wheelchair accessibility, periodic pressure care & physio session.",
      doc: "Dr. S. K. Shrestha (Orthopedic & Rehabilitation)"
    },
    {
      label: "🏥 Post-Surgery Patient Relative",
      type: "specific_person" as const,
      name: "Sita Adhikari",
      rel: "Sister / Patient Relative",
      ageVal: 42,
      genderVal: "female",
      blood: "A+",
      allergiesVal: "Codeine",
      cond: "Post-Abdominal Surgery Recovery, Mild Fever",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
      notesVal: "Bed rest prescribed for 2 weeks. Post-op antibiotics twice daily with food.",
      level: "full_care",
      needs: "Wound care dressing every 48 hours, light liquid diet.",
      doc: "Dr. P. Joshy (General Surgery)"
    },
    {
      label: "🏠 Elderly Neighbor",
      type: "neighbor" as const,
      name: "Maya Devi Gurung",
      rel: "Next-door Neighbor",
      ageVal: 72,
      genderVal: "female",
      blood: "AB+",
      allergiesVal: "None known",
      cond: "Solitary Senior, Hypertension, Mild Hearing Impairment",
      photo: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&q=80&w=250",
      notesVal: "Community check-in support. Neighbor emergency contact registered.",
      level: "partial_care",
      needs: "Daily evening check-in, assistance with heavy grocery delivery.",
      doc: "Dr. M. Pradhan (Community Physician)"
    }
  ];

  const handleApplyPreset = (preset: typeof DEPENDENT_PRESETS[0]) => {
    setAccountType(preset.type);
    setFullName(preset.name);
    setRelationship(preset.rel);
    setAge(preset.ageVal);
    setGender(preset.genderVal);
    setBloodGroup(preset.blood);
    setAllergies(preset.allergiesVal);
    setMedicalConditions(preset.cond);
    setProfilePhoto(preset.photo);
    setNotes(preset.notesVal);
    setCareLevel(preset.level);
    setSpecialNeeds(preset.needs);
    setDoctorName(preset.doc);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newPatient: Patient = {
      id: "sub-" + Date.now(),
      name: fullName.trim(),
      category: accountType === "elderly" ? "Elderly" : accountType === "child" ? "Kids" : "General",
      age: age || 25,
      avatarUrl: profilePhoto,
      waterCurrentMl: 0,
      waterGoalMl: 2500,
      waterLogs: [],
      medications: [],
      vitals: [],
      mood: "Calm",
      sleepHours: 8,
      caregiverNotes: notes || `Care profile created for ${relationship}`,
      emergencyContact: {
        name: fullName.trim(),
        phone: phone || "+977 9841234567",
        relation: relationship || "Family"
      },
      lastCheckIn: "Just now",
      status: "Stable"
    };

    // Store extended sub account in localStorage as well
    try {
      const existing = JSON.parse(localStorage.getItem("care2care_sub_accounts") || "[]");
      const fullSubAccountRecord: SubAccountData = {
        id: newPatient.id,
        type: accountType,
        fullName: fullName.trim(),
        relationship,
        dateOfBirth: dob,
        gender,
        age: age || 25,
        phone,
        email,
        address,
        profilePhoto,
        bloodGroup,
        allergies,
        medicalConditions,
        notes,
        permissions,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("care2care_sub_accounts", JSON.stringify([fullSubAccountRecord, ...existing]));
    } catch (err) {
      console.error("Error saving sub account to localStorage:", err);
    }

    onSubAccountCreated(newPatient);
    onClose();
  };

  const accountTypeOptions: { id: SubAccountData["type"]; label: string; icon: string }[] = [
    { id: "family", label: "👨‍👩‍👧 Family Member", icon: "👨‍👩‍👧" },
    { id: "relative", label: "👥 Relative", icon: "👥" },
    { id: "neighbor", label: "🏠 Neighbor", icon: "🏠" },
    { id: "specific_person", label: "👤 Specific Person", icon: "👤" },
    { id: "child", label: "👶 Child", icon: "👶" },
    { id: "elderly", label: "👴 Senior / Elderly", icon: "👴" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#2E7D32]/40 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1b5e20] to-[#2E7D32] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 rounded-2xl">
              <UserPlus className="w-5 h-5 text-amber-300 stroke-[2.5]" />
            </span>
            <div>
              <h3 className="text-base font-black flex items-center gap-1.5">
                <span>Create Sub-Account</span>
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Add family, relatives, neighbors or specific care profiles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Fast Preset / Form Filler Section */}
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>⚡ Quick Form Fillers & Presets</span>
              </label>
              <span className="text-[10px] text-amber-700 font-bold bg-white px-2 py-0.5 rounded-full border border-amber-200">
                Auto-fills form details
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DEPENDENT_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-100/80 text-amber-950 font-bold text-[11px] rounded-xl border border-amber-200 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] flex items-center gap-1"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#2E7D32]" /> Select Account Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {accountTypeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAccountType(opt.id)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    accountType === opt.id
                      ? "bg-emerald-50 border-[#2E7D32] text-[#2E7D32] ring-2 ring-[#2E7D32]/30 shadow-xs font-black"
                      : "bg-white border-slate-200 text-slate-700 hover:border-[#2E7D32]"
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <UserPlus className="w-3.5 h-3.5 text-[#2E7D32]" /> Basic Profile Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Son, Mother, Neighbor, Resident"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender & Age</label>
                <div className="flex gap-2">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Age"
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="aarav@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Address Location</label>
              <input
                type="text"
                placeholder="Kathmandu, Nepal"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          {/* Health & Medical Information */}
          <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
            <h4 className="text-xs font-extrabold text-[#2E7D32] flex items-center gap-1.5 border-b border-emerald-200 pb-2">
              <Heart className="w-3.5 h-3.5 text-[#2E7D32]" /> Health & Medical Background
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Dust"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Known Medical Conditions / Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Mild Hypertension, Diabetes Type II, Routine checkups required"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          {/* Account Permissions */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> Care Account Permissions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                { key: "canMonitor", label: "Can Monitor Vitals & Activity" },
                { key: "canReceiveNotifications", label: "Can Receive Emergency Notifications" },
                { key: "canAddServices", label: "Can Add Care Services to Profile" },
                { key: "canEditProfile", label: "Can Edit Profile Information" }
              ].map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white p-2 rounded-xl border border-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={(permissions as any)[perm.key]}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        [perm.key]: e.target.checked
                      }))
                    }
                    className="accent-[#2E7D32] w-4 h-4 rounded"
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Sub-Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
