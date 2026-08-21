import React, { useState } from "react";
import {
  UserCheck,
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  Trash2,
  Filter,
  Sparkles
} from "lucide-react";
import { DiscipleRecord, FamilyTab } from "./types";

interface ScreenDisciplesProps {
  disciples: DiscipleRecord[];
  onAddDisciple: (d: DiscipleRecord) => void;
  onDeleteDisciple: (id: string) => void;
  onNavigate: (tab: FamilyTab) => void;
}

export const ScreenDisciples: React.FC<ScreenDisciplesProps> = ({
  disciples,
  onAddDisciple,
  onDeleteDisciple,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"All Disciples" | "My Family Disciples" | "Initiation Requests">("All Disciples");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDisciple, setNewDisciple] = useState<Partial<DiscipleRecord>>({
    name: "",
    email: "",
    phone: "",
    initiationDate: new Date().toISOString().split("T")[0],
    isFamilyDisciple: true,
    status: "Active Disciple",
    role: "Family Disciple"
  });

  const filteredDisciples = disciples.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeSubTab === "My Family Disciples") return d.isFamilyDisciple;
    if (activeSubTab === "Initiation Requests") return d.status === "Pending Initiation";
    return true;
  });

  const handleSaveDisciple = () => {
    if (!newDisciple.name || !newDisciple.email) {
      alert("Please provide a name and email.");
      return;
    }
    const created: DiscipleRecord = {
      id: `disc-${Date.now()}`,
      name: newDisciple.name!,
      email: newDisciple.email!,
      phone: newDisciple.phone || "+977 9800000000",
      initiationDate: newDisciple.initiationDate || "01 Jan 2024",
      initiationLocation: newDisciple.initiationLocation || "Ashram",
      isFamilyDisciple: newDisciple.isFamilyDisciple ?? true,
      status: "Active Disciple",
      role: newDisciple.role || "Devotee",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    };
    onAddDisciple(created);
    setShowAddModal(false);
    setNewDisciple({
      name: "",
      email: "",
      phone: "",
      initiationDate: new Date().toISOString().split("T")[0],
      isFamilyDisciple: true,
      status: "Active Disciple",
      role: "Family Disciple"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white font-black text-sm flex items-center justify-center shadow-xs">
            9
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Shishya (Disciple) Details</h2>
            <p className="text-xs text-slate-500">Diksha initiate directory, family disciples & spiritual fellowship</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-500/20 cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Shishya</span>
        </button>
      </div>

      {/* 2. Sub Tabs & Search */}
      <div className="bg-white rounded-3xl p-3 border border-orange-100/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-orange-50/70 p-1 rounded-2xl border border-orange-200/80 w-full sm:w-auto">
          {(["All Disciples", "My Family Disciples", "Initiation Requests"] as const).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF5A36] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search disciples by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-orange-50/50 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Disciples List (Exact layout matching Card 9) */}
      <div className="space-y-3">
        {filteredDisciples.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-orange-100 text-center space-y-2">
            <Users className="w-8 h-8 text-orange-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No disciples found</p>
          </div>
        ) : (
          filteredDisciples.map((disc) => (
            <div
              key={disc.id}
              className="bg-white hover:bg-orange-50/30 rounded-3xl p-4 sm:p-5 border border-orange-100/90 shadow-2xs transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={disc.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                  alt={disc.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-200 shadow-2xs bg-orange-50"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{disc.name}</h3>
                    {disc.isFamilyDisciple && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5A36] border border-orange-200">
                        Family Member
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {disc.email}
                    </span>
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      Initiation On {disc.initiationDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDeleteDisciple(disc.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Shishya Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Shishya Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-200 shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF5A36]" /> Add New Shishya / Disciple
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newDisciple.name}
                  onChange={(e) => setNewDisciple({ ...newDisciple, name: e.target.value })}
                  placeholder="e.g. Ramesh Shrestha"
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={newDisciple.email}
                  onChange={(e) => setNewDisciple({ ...newDisciple, email: e.target.value })}
                  placeholder="e.g. ramesh@email.com"
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initiation Date</label>
                <input
                  type="date"
                  value={newDisciple.initiationDate}
                  onChange={(e) => setNewDisciple({ ...newDisciple, initiationDate: e.target.value })}
                  className="w-full px-3 py-2 bg-orange-50/40 border border-orange-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="famDisc"
                  checked={newDisciple.isFamilyDisciple}
                  onChange={(e) => setNewDisciple({ ...newDisciple, isFamilyDisciple: e.target.checked })}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36]"
                />
                <label htmlFor="famDisc" className="text-xs font-bold text-slate-700">
                  This person is a member of our immediate/extended family
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-orange-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDisciple}
                className="px-5 py-2 bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Shishya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
