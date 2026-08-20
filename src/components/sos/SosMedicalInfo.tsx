import React, { useState } from "react";
import {
  Heart,
  Activity,
  FileText,
  Edit2,
  Share2,
  Check,
  X,
  Phone,
  Hospital,
  AlertTriangle,
  Download,
  Plus
} from "lucide-react";
import { SosMedicalProfile } from "./types";

interface SosMedicalInfoProps {
  medicalProfile: SosMedicalProfile;
  onUpdateMedicalProfile: (updated: SosMedicalProfile) => void;
  onNotify: (msg: string) => void;
}

export const SosMedicalInfo: React.FC<SosMedicalInfoProps> = ({
  medicalProfile,
  onUpdateMedicalProfile,
  onNotify
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<SosMedicalProfile>(medicalProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMedicalProfile({
      ...formData,
      lastUpdated: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    });
    setIsEditing(false);
    onNotify("Medical profile successfully updated!");
  };

  const handleExportCard = () => {
    const summary = `
========================================
CARE2CARE EMERGENCY MEDICAL ID
========================================
Blood Group: ${medicalProfile.bloodGroup}
Allergies: ${medicalProfile.allergies.join(", ") || "None"}
Conditions: ${medicalProfile.medicalConditions.join(", ") || "None"}
Medications: ${medicalProfile.currentMedications.join(", ") || "None"}
Doctor: ${medicalProfile.primaryDoctor} (${medicalProfile.doctorPhone || "N/A"})
Hospital: ${medicalProfile.preferredHospital}
Insurance: ${medicalProfile.insuranceProvider || "N/A"} (${medicalProfile.policyNumber || "N/A"})
Organ Donor: ${medicalProfile.organDonor ? "YES" : "NO"}
Emergency Notes: ${medicalProfile.emergencyNotes}
Last Updated: ${medicalProfile.lastUpdated}
========================================
    `.trim();

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Emergency_Medical_ID_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("Medical ID card exported.");
  };

  return (
    <div className="space-y-4">
      {/* HEADER CARD (SCREEN 6) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center border border-[#FFD9CC] shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Medical Profile
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Keep your medical information up to date
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCard}
          className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] border border-orange-200 cursor-pointer"
          title="Export Medical ID"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* MEDICAL DETAILS TABLE (SCREEN 6) */}
      <div className="bg-white border border-[#FFE8DE] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="divide-y divide-orange-100/70">
          {/* Blood Group */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Blood Group</span>
            <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
              {medicalProfile.bloodGroup}
            </span>
          </div>

          {/* Allergies */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Allergies</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {medicalProfile.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="text-xs font-bold text-slate-800 bg-[#FFF9F5] border border-orange-200 px-2.5 py-0.5 rounded-lg"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Medical Conditions</span>
            <span className="text-xs font-black text-slate-900">
              {medicalProfile.medicalConditions.join(", ")}
            </span>
          </div>

          {/* Current Medications */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Current Medications</span>
            <span className="text-xs font-black text-slate-900 text-right">
              {medicalProfile.currentMedications.join(", ")}
            </span>
          </div>

          {/* Doctor */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Doctor</span>
            <span className="text-xs font-black text-slate-900">
              {medicalProfile.primaryDoctor}
            </span>
          </div>

          {/* Hospital */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Hospital</span>
            <span className="text-xs font-black text-slate-900 text-right">
              {medicalProfile.preferredHospital}
            </span>
          </div>

          {/* Organ Donor */}
          <div className="py-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Organ Donor</span>
            <span className="text-xs font-black text-emerald-600">
              {medicalProfile.organDonor ? "Yes (Registered)" : "No"}
            </span>
          </div>
        </div>

        {/* Emergency Notes Box */}
        {medicalProfile.emergencyNotes && (
          <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#FFE8DE] space-y-1">
            <span className="text-[10px] font-black text-[#FF5A36] uppercase tracking-wider block">
              Emergency Action Notes
            </span>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              {medicalProfile.emergencyNotes}
            </p>
          </div>
        )}

        {/* EDIT BUTTON (SCREEN 6) */}
        <button
          onClick={() => {
            setFormData(medicalProfile);
            setIsEditing(true);
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A50] hover:opacity-95 text-white font-black text-xs shadow-xs cursor-pointer"
        >
          Edit Medical Info
        </button>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Edit Emergency Medical Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Organ Donor Status
                  </label>
                  <select
                    value={formData.organDonor ? "yes" : "no"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organDonor: e.target.value === "yes"
                      })
                    }
                    className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                  >
                    <option value="yes">Yes (Registered Donor)</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Pollen, Peanuts"
                  value={formData.allergies.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(",").map((s) => s.trim())
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Medical Conditions (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asthma, Hypertension"
                  value={formData.medicalConditions.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalConditions: e.target.value.split(",").map((s) => s.trim())
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current Medications (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ventolin, Montelukast 10mg"
                  value={formData.currentMedications.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentMedications: e.target.value.split(",").map((s) => s.trim())
                    })
                  }
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Doctor
                  </label>
                  <input
                    type="text"
                    value={formData.primaryDoctor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryDoctor: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Doctor Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.doctorPhone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorPhone: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Preferred Hospital
                </label>
                <input
                  type="text"
                  value={formData.preferredHospital}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredHospital: e.target.value })
                  }
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Emergency Action Notes / Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.emergencyNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyNotes: e.target.value })
                  }
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF5A36] text-white font-black text-xs shadow-xs cursor-pointer hover:bg-[#E63920]"
                >
                  Save Medical Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
