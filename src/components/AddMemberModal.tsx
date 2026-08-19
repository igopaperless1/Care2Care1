import React, { useState } from "react";
import { X, UserPlus, Users, Heart, Shield, Briefcase, Dog, Calendar, Phone, Mail, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export interface MemberFormData {
  id: string;
  name: string;
  category: "family" | "child" | "elderly" | "pet" | "staff";
  relationOrRole: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  notes?: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: MemberFormData) => void;
  isDarkMode?: boolean;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  isDarkMode = false,
}) => {
  const { t } = useLanguage();
  const [category, setCategory] = useState<"family" | "child" | "elderly" | "pet" | "staff">("family");
  const [name, setName] = useState("");
  const [relationOrRole, setRelationOrRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: MemberFormData = {
      id: "mem_" + Date.now(),
      name: name.trim(),
      category,
      relationOrRole: relationOrRole.trim() || (category === "pet" ? "Family Pet" : category === "staff" ? "Staff Member" : "Family"),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      notes: notes.trim() || undefined,
    };

    onAddMember(newMember);
    setSuccessMessage(`${name} successfully added to your ${category} care group!`);
    
    setTimeout(() => {
      setSuccessMessage(null);
      setName("");
      setRelationOrRole("");
      setPhone("");
      setEmail("");
      setDateOfBirth("");
      setNotes("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Add Member / Family Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Add family members, children, seniors, pets or staff
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="my-8 p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-black text-base text-emerald-900 dark:text-emerald-200">{successMessage}</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Category Selector Buttons */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
                Member Category
              </label>
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {[
                  { id: "family", label: "Family", icon: Users },
                  { id: "child", label: "Child", icon: Heart },
                  { id: "elderly", label: "Elderly", icon: Shield },
                  { id: "pet", label: "Pet", icon: Dog },
                  { id: "staff", label: "Staff", icon: Briefcase },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id as any)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Full Name / Pet Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Sharma / Rex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Relation / Role & DOB Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship / Role
                </label>
                <input
                  type="text"
                  placeholder={category === "pet" ? "e.g. Golden Retriever" : category === "staff" ? "e.g. Store Manager" : "e.g. Sister, Mother, Son"}
                  value={relationOrRole}
                  onChange={(e) => setRelationOrRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +977 9801234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. member@care2care.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Notes / Special Care Instructions */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Medical / Care Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Allergic to Penicillin, Daily BP check required at 8 AM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                {t("buttons.cancel", "Cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Member Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
