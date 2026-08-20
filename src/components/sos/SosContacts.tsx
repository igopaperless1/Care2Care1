import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Phone,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  Star,
  Shield,
  Heart,
  ChevronRight,
  Send
} from "lucide-react";
import { SosEmergencyContact, SosContactGroup } from "./types";

interface SosContactsProps {
  contacts: SosEmergencyContact[];
  groups: SosContactGroup[];
  onAddContact: (contact: Omit<SosEmergencyContact, "id">) => void;
  onUpdateContact: (contact: SosEmergencyContact) => void;
  onDeleteContact: (id: string) => void;
  onCallContact: (contact: SosEmergencyContact) => void;
  onSendSms: (contact: SosEmergencyContact) => void;
  onBroadcastGroup: (group: SosContactGroup) => void;
}

export const SosContacts: React.FC<SosContactsProps> = ({
  contacts,
  groups,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onCallContact,
  onSendSms,
  onBroadcastGroup
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"contacts" | "groups">("contacts");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<SosEmergencyContact | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRelation, setFormRelation] = useState("Brother");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPriority, setFormPriority] = useState<"primary" | "secondary" | "tertiary">("primary");
  const [formNotes, setFormNotes] = useState("");

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormName("");
    setFormRelation("Brother");
    setFormPhone("");
    setFormEmail("");
    setFormPriority("primary");
    setFormNotes("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (contact: SosEmergencyContact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormRelation(contact.relationship);
    setFormPhone(contact.phone);
    setFormEmail(contact.email || "");
    setFormPriority(contact.priority);
    setFormNotes(contact.notes || "");
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        name: formName.trim(),
        relationship: formRelation.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || undefined,
        priority: formPriority,
        notes: formNotes.trim() || undefined
      });
    } else {
      onAddContact({
        name: formName.trim(),
        relationship: formRelation.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || undefined,
        priority: formPriority,
        notes: formNotes.trim() || undefined
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* TABS (Contacts | Groups) */}
      <div className="flex bg-[#FFF0EB] p-1 rounded-2xl border border-[#FFD9CC]">
        <button
          onClick={() => setActiveSubTab("contacts")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === "contacts"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveSubTab("groups")}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === "groups"
              ? "bg-[#FF5A36] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Groups ({groups.length})
        </button>
      </div>

      {/* CONTACTS LIST (SCREEN 3) */}
      {activeSubTab === "contacts" && (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white border border-[#FFE8DE] rounded-2xl p-4 shadow-xs flex items-center justify-between hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      contact.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`
                    }
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-100"
                  />
                  {contact.priority === "primary" && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A36] text-white flex items-center justify-center text-[9px] font-black"
                      title="Primary Contact"
                    >
                      1
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-slate-900">{contact.name}</h4>
                    {contact.priority === "primary" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-[#FF5A36]">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500">{contact.relationship}</p>
                  <p className="text-xs font-bold text-slate-700 font-mono mt-0.5">
                    {contact.phone}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSendSms(contact)}
                  className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A36] flex items-center justify-center border border-orange-200 cursor-pointer"
                  title="Send Quick SMS"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onCallContact(contact)}
                  className="w-9 h-9 rounded-xl bg-[#FF5A36] hover:bg-[#E63920] text-white flex items-center justify-center shadow-xs cursor-pointer"
                  title="Call Contact"
                >
                  <Phone className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                  title="Edit Contact"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Contact Button (Screen 3) */}
          <button
            onClick={handleOpenAdd}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A50] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Emergency Contact</span>
          </button>
        </div>
      )}

      {/* GROUPS LIST */}
      {activeSubTab === "groups" && (
        <div className="space-y-3">
          {groups.map((group) => {
            const memberContacts = contacts.filter((c) => group.memberIds.includes(c.id));
            return (
              <div
                key={group.id}
                className="bg-white border border-[#FFE8DE] rounded-3xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{group.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{group.description}</p>
                  </div>
                  <button
                    onClick={() => onBroadcastGroup(group)}
                    className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FF5A36] text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast</span>
                  </button>
                </div>

                {/* Member avatars */}
                <div className="flex items-center gap-2 pt-1">
                  {memberContacts.map((m) => (
                    <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF9F5] border border-orange-200 text-xs font-semibold text-slate-700">
                      <img
                        src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                        alt={m.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT CONTACT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Singh"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Relationship *
                  </label>
                  <select
                    value={formRelation}
                    onChange={(e) => setFormRelation(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
                  >
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Doctor">Doctor / Physician</option>
                    <option value="Friend">Friend</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Caregiver">Caregiver</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
                  >
                    <option value="primary">1 - Primary (Instant)</option>
                    <option value="secondary">2 - Secondary</option>
                    <option value="tertiary">3 - Tertiary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +977 9812345678"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="amit.singh@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Special Instructions / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Has duplicate house keys"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFF9F5] border border-orange-200 rounded-xl focus:ring-2 focus:ring-[#FF5A36] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                {editingContact && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteContact(editingContact.id);
                      setIsAddModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#FF5A36] hover:bg-[#E63920] text-white font-black text-xs shadow-xs cursor-pointer"
                >
                  {editingContact ? "Save Changes" : "Save Emergency Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
