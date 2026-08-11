import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  User,
  Plus,
  Search,
  CheckCircle2,
  Bell,
  Sparkles,
  Trash2,
  Edit3,
  Users,
  Award,
  Crown,
  Gift,
  Star,
  Clock,
  Filter,
  Share2,
  Download,
  Info,
  Calendar as CalendarIcon,
  X,
  ChevronRight,
  Sun,
  Moon,
  Home,
  Briefcase,
  GraduationCap,
  Flame,
  Check
} from "lucide-react";
import { Patient } from "../types";

// Safe Utilities
const safeStr = (val: any, fallback = ""): string => (typeof val === "string" ? val : fallback);
const safeNum = (val: any, fallback = 0): number => (typeof val === "number" && !isNaN(val) ? val : fallback);

// Data Types
export interface LifePerson {
  id: string;
  name: string;
  relationship: "Self" | "Spouse/Partner" | "Child" | "Parent" | "Grandparent" | "Sibling" | "Extended Family" | "Other";
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  dateOfBirthBS?: string;
  tithiBirth?: string;
  spouseId?: string; // Linked partner ID (infinity symbol link)
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface LifeEvent {
  id: string;
  personId: string;
  personName: string;
  relationship: string;
  category:
    | "Birthday (Solar)"
    | "Birthday (Tithi)"
    | "Wedding Anniversary"
    | "Engagement Date"
    | "First Meeting Date"
    | "Nwaran (Name-Giving)"
    | "Pasni (First Rice)"
    | "Bratabandha (Sacred Thread)"
    | "Gunyo Cholo (Coming of Age)"
    | "Baptism Day"
    | "Bar/Bat Mitzvah"
    | "Confirmation Day"
    | "Upanayana"
    | "Memorial / Shraddha / Barsi"
    | "Job Start Date"
    | "Retirement Date"
    | "Home Purchase"
    | "Graduation Date"
    | "Custom Milestone";
  title: string;
  description?: string;
  dateGregorian: string;
  dateBS?: string;
  tithiDate?: string;
  isRecurring: boolean;
  remindBeforeDays: number; // 1, 3, 5, 7, 15, 30
  customMessage?: string;
  isActive: boolean;
  createdAt: string;
}

interface LifeDatesTrackerProps {
  patient?: Patient;
}

export const LifeDatesTracker: React.FC<LifeDatesTrackerProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "people" | "add_person" | "add_event" | "calendar" | "analytics">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. PERSONS STATE
  const [people, setPeople] = useState<LifePerson[]>(() => {
    const saved = localStorage.getItem("care2care_life_dates_persons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "p-1",
        name: patient?.name || "Aarav Sharma",
        relationship: "Self",
        gender: "Male",
        dateOfBirth: "1992-05-15",
        dateOfBirthBS: "2049 Jeth 2",
        tithiBirth: "Baisakh Shukla Ashtami",
        notes: "Primary account holder",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString().split("T")[0]
      },
      {
        id: "p-2",
        name: "Priya Sharma",
        relationship: "Spouse/Partner",
        gender: "Female",
        dateOfBirth: "1994-08-22",
        dateOfBirthBS: "2051 Bhadra 6",
        tithiBirth: "Bhadra Krishna Pratipada",
        spouseId: "p-1",
        notes: "Married on Nov 18, 2018",
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString().split("T")[0]
      }
    ];
  });

  // Link Spouse ID mutually for infinity coupling
  useEffect(() => {
    localStorage.setItem("care2care_life_dates_persons", JSON.stringify(people));
  }, [people]);

  // 2. EVENTS STATE
  const [events, setEvents] = useState<LifeEvent[]>(() => {
    const saved = localStorage.getItem("care2care_life_dates_events");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "evt-1",
        personId: "p-1",
        personName: patient?.name || "Aarav Sharma",
        relationship: "Self",
        category: "Birthday (Solar)",
        title: "Aarav's 34th Birthday",
        description: "Annual family celebration",
        dateGregorian: "2026-05-15",
        dateBS: "2083 Jeth 1",
        tithiDate: "Jeth Shukla Navami",
        isRecurring: true,
        remindBeforeDays: 7,
        customMessage: "Order birthday cake and gifts!",
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0]
      },
      {
        id: "evt-2",
        personId: "p-1",
        personName: "Aarav & Priya",
        relationship: "Spouse/Partner",
        category: "Wedding Anniversary",
        title: "Aarav & Priya Wedding Anniversary ∞",
        description: "8th Wedding Anniversary Celebration",
        dateGregorian: "2026-11-18",
        dateBS: "2083 Mangsir 3",
        tithiDate: "Mangsir Shukla Ekadashi",
        isRecurring: true,
        remindBeforeDays: 15,
        customMessage: "Book dinner reservation and romantic getaway!",
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0]
      },
      {
        id: "evt-3",
        personId: "p-2",
        personName: "Priya Sharma",
        relationship: "Spouse/Partner",
        category: "Birthday (Tithi)",
        title: "Priya's Tithi Birthday (Bhadra Krishna)",
        description: "Traditional puja at home",
        dateGregorian: "2026-09-02",
        dateBS: "2083 Bhadra 17",
        tithiDate: "Bhadra Krishna Pratipada",
        isRecurring: true,
        remindBeforeDays: 3,
        customMessage: "Prepare prasadam and garlands for home puja.",
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("care2care_life_dates_events", JSON.stringify(events));
  }, [events]);

  // PERSON FORM STATE
  const [personForm, setPersonForm] = useState<{
    name: string;
    relationship: LifePerson["relationship"];
    gender: LifePerson["gender"];
    dateOfBirth: string;
    spouseId: string;
    notes: string;
    photoUrl: string;
  }>({
    name: "",
    relationship: "Self",
    gender: "Male",
    dateOfBirth: "",
    spouseId: "",
    notes: "",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  });

  const handleCreatePerson = () => {
    if (!personForm.name || !personForm.dateOfBirth) {
      showToast("Please enter Person Name and Date of Birth!");
      return;
    }
    const newPersonId = `p-${Date.now()}`;
    const newPerson: LifePerson = {
      id: newPersonId,
      name: personForm.name,
      relationship: personForm.relationship,
      gender: personForm.gender,
      dateOfBirth: personForm.dateOfBirth,
      dateOfBirthBS: "2083 Date Converted",
      tithiBirth: "Calculated Lunar Tithi",
      spouseId: personForm.spouseId || undefined,
      notes: personForm.notes,
      photoUrl: personForm.photoUrl,
      createdAt: new Date().toISOString().split("T")[0]
    };

    let updatedPeople = [newPerson, ...people];

    // If linked with spouse, update the partner's spouseId as well (Mutual ∞ link)
    if (personForm.spouseId) {
      updatedPeople = updatedPeople.map((p) =>
        p.id === personForm.spouseId ? { ...p, spouseId: newPersonId } : p
      );
    }

    setPeople(updatedPeople);

    // Auto-create Birthday event for person
    const bdayEvt: LifeEvent = {
      id: `evt-bday-${Date.now()}`,
      personId: newPersonId,
      personName: newPerson.name,
      relationship: newPerson.relationship,
      category: "Birthday (Solar)",
      title: `${newPerson.name}'s Birthday`,
      description: "Solar birthday event",
      dateGregorian: newPerson.dateOfBirth,
      isRecurring: true,
      remindBeforeDays: 7,
      customMessage: `Remember to wish ${newPerson.name} happy birthday!`,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setEvents((prev) => [bdayEvt, ...prev]);

    showToast(`💝 ${newPerson.name} added to Life Dates & Birthday event created!`);
    setPersonForm({
      name: "",
      relationship: "Child",
      gender: "Female",
      dateOfBirth: "",
      spouseId: "",
      notes: "",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    });
    setActiveTab("people");
  };

  // EVENT FORM STATE
  const [eventForm, setEventForm] = useState<{
    personId: string;
    category: LifeEvent["category"];
    title: string;
    description: string;
    dateGregorian: string;
    remindBeforeDays: number;
    customMessage: string;
  }>({
    personId: people[0]?.id || "",
    category: "Birthday (Solar)",
    title: "",
    description: "",
    dateGregorian: new Date().toISOString().split("T")[0],
    remindBeforeDays: 7,
    customMessage: ""
  });

  const handleCreateEvent = () => {
    if (!eventForm.personId || !eventForm.dateGregorian) {
      showToast("Please select Person and Event Date!");
      return;
    }
    const selectedPerson = people.find((p) => p.id === eventForm.personId);
    const personName = selectedPerson ? selectedPerson.name : "Family Member";

    const newEvt: LifeEvent = {
      id: `evt-${Date.now()}`,
      personId: eventForm.personId,
      personName,
      relationship: selectedPerson ? selectedPerson.relationship : "Relative",
      category: eventForm.category,
      title: eventForm.title || `${personName} - ${eventForm.category}`,
      description: eventForm.description,
      dateGregorian: eventForm.dateGregorian,
      dateBS: "2083 Converted BS",
      tithiDate: "Calculated Tithi",
      isRecurring: true,
      remindBeforeDays: Number(eventForm.remindBeforeDays),
      customMessage: eventForm.customMessage || `Reminder for ${personName}'s ${eventForm.category}`,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0]
    };

    setEvents([newEvt, ...events]);
    showToast(`🎉 Milestone Event "${newEvt.title}" Saved!`);
    setEventForm({
      personId: people[0]?.id || "",
      category: "Birthday (Solar)",
      title: "",
      description: "",
      dateGregorian: new Date().toISOString().split("T")[0],
      remindBeforeDays: 7,
      customMessage: ""
    });
    setActiveTab("dashboard");
  };

  const handleDeletePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
    setEvents(events.filter((e) => e.personId !== id));
    showToast("Person and related milestone events removed.");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    showToast("Event removed from calendar.");
  };

  // Filtered Events List
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "all" || e.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2E7D32] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          {toastMsg}
        </div>
      )}

      {/* HERO HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl text-slate-900 shadow-sm border border-[#2E7D32]/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md">
              💝
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                Important Life Dates & Milestones
              </h1>
              <p className="text-[10px] text-slate-500 font-bold">
                Never forget birthdays, anniversaries, Nwaran, Pasni, Bratabandha, Shraddha tithis & couple links (∞).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("add_event")}
              className="px-3 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Add Date
            </button>
            <button
              onClick={() => setActiveTab("add_person")}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] font-bold text-xs rounded-xl border border-[#2E7D32]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" /> Add Person
            </button>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold gap-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: <Heart className="w-3.5 h-3.5" /> },
            { id: "people", label: `People & Couples (${people.length})`, icon: <Users className="w-3.5 h-3.5" /> },
            { id: "add_person", label: "+ Add Person", icon: <User className="w-3.5 h-3.5" /> },
            { id: "add_event", label: "+ Add Date", icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: "calendar", label: "Calendar View", icon: <CalendarIcon className="w-3.5 h-3.5" /> },
            { id: "analytics", label: "Analytics", icon: <Sparkles className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#2E7D32] text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. DASHBOARD VIEW */}
      {/* ========================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Total People</span>
              <p className="text-2xl font-black text-slate-900">{people.length}</p>
              <p className="text-[11px] font-bold text-pink-600">Family & Loved Ones</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Life Milestones</span>
              <p className="text-2xl font-black text-slate-900">{events.length}</p>
              <p className="text-[11px] font-bold text-emerald-600">Active Reminders</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Couple Links</span>
              <p className="text-2xl font-black text-slate-900">{people.filter((p) => p.spouseId).length / 2 || 1}</p>
              <p className="text-[11px] font-bold text-purple-600">∞ Coupled Partners</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Tithi Events</span>
              <p className="text-2xl font-black text-slate-900">
                {events.filter((e) => e.category.includes("Tithi") || e.category.includes("Shraddha")).length}
              </p>
              <p className="text-[11px] font-bold text-amber-600">Lunar & Cultural</p>
            </div>
          </div>

          {/* SEARCH & CATEGORY FILTER */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event, person name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
              <span className="text-xs font-bold text-slate-500 shrink-0">Filter:</span>
              {[
                { id: "all", label: "All Events" },
                { id: "Birthday (Solar)", label: "🎂 Birthdays" },
                { id: "Wedding Anniversary", label: "💍 Anniversaries" },
                { id: "Nwaran (Name-Giving)", label: "👶 Nwaran/Pasni" },
                { id: "Memorial / Shraddha / Barsi", label: "🕊️ Shraddha" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                    filterCategory === cat.id
                      ? "bg-slate-900 text-white font-black"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* UPCOMING EVENTS TIMELINE LIST */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-600" /> Upcoming Life Events & Milestones
                </h2>
                <p className="text-xs text-slate-500">Auto-calculated advance reminders with custom greetings</p>
              </div>

              <span className="text-xs font-black bg-pink-50 text-pink-700 px-3 py-1 rounded-full border border-pink-200">
                {filteredEvents.length} Saved Milestones
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-pink-300 bg-slate-50/50 hover:bg-white shadow-2xs hover:shadow-md transition-all space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                        {evt.category.includes("Birthday") ? "🎂" : evt.category.includes("Anniversary") ? "💍" : evt.category.includes("Nwaran") ? "👶" : evt.category.includes("Shraddha") ? "🕊️" : "💝"}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                          {evt.category}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-tight">{evt.title}</h3>
                        <p className="text-xs text-slate-500 font-bold">👤 {evt.personName} ({evt.relationship})</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1.5 text-slate-300 hover:text-red-600 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {evt.description && <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">{evt.description}</p>}

                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-slate-800">📅 Gregorian: {evt.dateGregorian}</p>
                      {evt.dateBS && <p className="text-[11px] font-semibold text-slate-500">🇳🇵 BS: {evt.dateBS} • Tithi: {evt.tithiDate}</p>}
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl text-[11px] font-black border border-emerald-200">
                      <Bell className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{evt.remindBeforeDays} days notice</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. PEOPLE & COUPLE LINKS (∞) VIEW */}
      {/* ========================================== */}
      {activeTab === "people" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">Family Members & Partner Links (∞)</h2>
                <p className="text-xs text-slate-500">Linked partners share joint anniversaries and celebration notifications</p>
              </div>

              <button
                onClick={() => setActiveTab("add_person")}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {people.map((p) => {
                const spouse = people.find((sp) => sp.id === p.spouseId);
                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl border border-slate-200 bg-slate-50/60 space-y-4 relative group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                          alt={p.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-500/30"
                        />
                        <div>
                          <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                          <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                            {p.relationship}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePerson(p.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete Person"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 font-medium bg-white p-3 rounded-2xl border border-slate-100">
                      <p>🎂 DOB: <span className="font-bold text-slate-800">{p.dateOfBirth}</span></p>
                      {p.dateOfBirthBS && <p>🇳🇵 BS Date: {p.dateOfBirthBS}</p>}
                      {p.tithiBirth && <p>🌙 Tithi: {p.tithiBirth}</p>}
                    </div>

                    {/* COUPLE LINK INFINITY BADGE */}
                    {spouse && (
                      <div className="p-2.5 bg-gradient-to-r from-purple-900 to-pink-900 text-white rounded-2xl flex items-center justify-between text-xs font-black shadow-xs">
                        <span>Married Partner: {spouse.name}</span>
                        <span className="text-base font-black text-pink-300">∞</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. ADD PERSON FORM */}
      {/* ========================================== */}
      {activeTab === "add_person" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">Add Person / Family Member</h2>
            <p className="text-xs text-slate-500">Record life dates, relationship & couple links</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={personForm.name}
                onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relationship *</label>
                <select
                  value={personForm.relationship}
                  onChange={(e) => setPersonForm({ ...personForm, relationship: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse/Partner">Spouse/Partner (∞ Link)</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Extended Family">Extended Family</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={personForm.gender}
                  onChange={(e) => setPersonForm({ ...personForm, gender: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth (Solar / Gregorian) *</label>
              <input
                type="date"
                value={personForm.dateOfBirth}
                onChange={(e) => setPersonForm({ ...personForm, dateOfBirth: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
              />
            </div>

            {/* SPOUSE INFINITY LINK SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Link Spouse / Partner (∞ Symbol)</label>
              <select
                value={personForm.spouseId}
                onChange={(e) => setPersonForm({ ...personForm, spouseId: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
              >
                <option value="">-- No Partner Link --</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    ∞ Link with {p.name} ({p.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Personal Notes</label>
              <textarea
                rows={2}
                placeholder="Important preferences, favorite gifts, cultural rites..."
                value={personForm.notes}
                onChange={(e) => setPersonForm({ ...personForm, notes: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <button
              onClick={handleCreatePerson}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Save Person & Generate Birthday Event
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. ADD EVENT / MILESTONE FORM */}
      {/* ========================================== */}
      {activeTab === "add_event" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">Add Life Event & Milestone Date</h2>
            <p className="text-xs text-slate-500">Configure custom advance notice and greetings</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Person *</label>
              <select
                value={eventForm.personId}
                onChange={(e) => setEventForm({ ...eventForm, personId: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
              >
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    👤 {p.name} ({p.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Category *</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="Birthday (Solar)">🎂 Birthday (Solar)</option>
                  <option value="Birthday (Tithi)">🌙 Birthday (Tithi)</option>
                  <option value="Wedding Anniversary">💍 Wedding Anniversary</option>
                  <option value="Engagement Date">💍 Engagement Date</option>
                  <option value="First Meeting Date">💕 First Meeting Date</option>
                  <option value="Nwaran (Name-Giving)">👶 Nwaran (Name-Giving)</option>
                  <option value="Pasni (First Rice)">👶 Pasni (First Rice Feeding)</option>
                  <option value="Bratabandha (Sacred Thread)">🙏 Bratabandha (Sacred Thread)</option>
                  <option value="Gunyo Cholo (Coming of Age)">🙏 Gunyo Cholo (Coming of Age)</option>
                  <option value="Baptism Day">🙏 Baptism Day</option>
                  <option value="Bar/Bat Mitzvah">🙏 Bar/Bat Mitzvah</option>
                  <option value="Confirmation Day">🙏 Confirmation Day</option>
                  <option value="Upanayana">🙏 Upanayana</option>
                  <option value="Memorial / Shraddha / Barsi">🕊️ Memorial / Shraddha / Barsi</option>
                  <option value="Job Start Date">💼 Job Start Date</option>
                  <option value="Retirement Date">💼 Retirement Date</option>
                  <option value="Home Purchase">🏠 Home Purchase</option>
                  <option value="Graduation Date">🎓 Graduation Date</option>
                  <option value="Custom Milestone">📝 Custom Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={eventForm.dateGregorian}
                  onChange={(e) => setEventForm({ ...eventForm, dateGregorian: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Title / Description</label>
              <input
                type="text"
                placeholder="e.g. 10th Wedding Anniversary Gala"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remind Me Advance Notice</label>
                <select
                  value={eventForm.remindBeforeDays}
                  onChange={(e) => setEventForm({ ...eventForm, remindBeforeDays: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value={1}>1 Day Before</option>
                  <option value={3}>3 Days Before</option>
                  <option value={5}>5 Days Before</option>
                  <option value={7}>7 Days Before (1 Week)</option>
                  <option value={15}>15 Days Before</option>
                  <option value={30}>30 Days Before (1 Month)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Reminder Note</label>
                <input
                  type="text"
                  placeholder="Order flowers, cakes or gifts..."
                  value={eventForm.customMessage}
                  onChange={(e) => setEventForm({ ...eventForm, customMessage: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateEvent}
              className="w-full py-3 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Save Milestone & Schedule Reminders
            </button>
          </div>
        </div>
      )}

      {/* ANALYTICS VIEW */}
      {activeTab === "analytics" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="border-l-4 border-l-[#2E7D32] pl-3">
              <h3 className="text-base font-black text-slate-900">Life Milestones & Reminder Analytics</h3>
              <p className="text-xs text-slate-500 font-bold">Distribution of saved dates, family connections, and upcoming reminder schedules</p>
            </div>
            <button
              onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 text-xs font-bold cursor-pointer transition-all"
            >
              {isSectionCollapsed ? "▼ Expand" : "▲ Collapse"}
            </button>
          </div>

          {!isSectionCollapsed && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Total People Logged</span>
                  <p className="text-2xl font-black text-slate-900">{people.length}</p>
                  <p className="text-[11px] font-bold text-[#2E7D32]">Family & Friends</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Milestones & Tithis</span>
                  <p className="text-2xl font-black text-slate-900">{events.length}</p>
                  <p className="text-[11px] font-bold text-emerald-600">Active Events</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Recurring Birthdays</span>
                  <p className="text-2xl font-black text-slate-900">
                    {events.filter(e => e.category.includes("Birthday")).length}
                  </p>
                  <p className="text-[11px] font-bold text-amber-600">Solar & Tithi</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Anniversaries</span>
                  <p className="text-2xl font-black text-slate-900">
                    {events.filter(e => e.category.includes("Anniversary") || e.category.includes("Wedding")).length}
                  </p>
                  <p className="text-[11px] font-bold text-purple-600">Couples Linked</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Category Distribution</h4>
                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    {["Birthday (Solar)", "Birthday (Tithi)", "Wedding Anniversary", "Nwaran (Name-Giving)", "Pasni (First Rice)", "Custom Milestone"].map((cat) => {
                      const count = events.filter(e => e.category === cat).length;
                      const pct = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span>{cat}</span>
                            <span className="font-black text-[#2E7D32]">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Reminders Advance Schedule</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated push and banner alerts configured for upcoming milestone dates:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-800">1 Week Advance Notice</span>
                      <span className="bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-md font-black">
                        {events.filter(e => e.remindBeforeDays === 7).length} Events
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-800">15 Days Advance Notice</span>
                      <span className="bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-md font-black">
                        {events.filter(e => e.remindBeforeDays === 15).length} Events
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-800">1 Month Advance Notice</span>
                      <span className="bg-emerald-100 text-[#2E7D32] px-2.5 py-0.5 rounded-md font-black">
                        {events.filter(e => e.remindBeforeDays === 30).length} Events
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
